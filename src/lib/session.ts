// Design Ref: §9.1 Application 레이어 — 세션 비즈니스 로직

import { randomUUID } from 'crypto';
import { kv } from './kv';
import type {
  Session, Submission, SessionWithAggregation, AggregatedGroup,
  CreateSessionRequest,
} from '@/types/session';

const SESSION_TTL_SEC = 24 * 60 * 60; // 24h
const sessionKey = (id: string) => `session:${id}`;

// ── 세션 생성 ────────────────────────────────────────────────────
export async function createSession(data: CreateSessionRequest): Promise<Session> {
  const id = randomUUID();
  const now = new Date();
  const session: Session = {
    id,
    title: data.title,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_SEC * 1000).toISOString(),
    criteria: data.criteria,
    settings: data.settings,
    groups: data.groups,
    submissions: [],
  };
  await kv.set(sessionKey(id), session, { ex: SESSION_TTL_SEC });
  return session;
}

// ── 세션 조회 ────────────────────────────────────────────────────
export async function getSession(id: string): Promise<Session | null> {
  return kv.get<Session>(sessionKey(id));
}

// ── 평가 제출 ────────────────────────────────────────────────────
type SubmitResult =
  | { ok: true; submissionId: string }
  | { ok: false; error: string };

export async function addSubmission(
  sessionId: string,
  sub: Omit<Submission, 'id' | 'submittedAt'>
): Promise<SubmitResult> {
  const session = await getSession(sessionId);
  if (!session) return { ok: false, error: 'SESSION_NOT_FOUND' };

  // 자기 모둠 평가 불가
  if (sub.fromGroupId === sub.toGroupId) {
    return { ok: false, error: 'SELF_RATING_NOT_ALLOWED' };
  }

  // 모둠 존재 확인
  const fromGroup = session.groups.find(g => g.id === sub.fromGroupId);
  const toGroup   = session.groups.find(g => g.id === sub.toGroupId);
  if (!fromGroup || !toGroup) return { ok: false, error: 'GROUP_NOT_FOUND' };

  // 점수 유효성 검사 (모든 기준에 1~5 정수)
  for (const cr of session.criteria) {
    const val = sub.scores[cr.key];
    if (val == null) return { ok: false, error: `MISSING_SCORE: ${cr.key}` };
    if (!Number.isInteger(val) || val < 1 || val > 5) {
      return { ok: false, error: `INVALID_SCORE: ${cr.key}` };
    }
  }

  const submissionId = randomUUID();
  const newSub: Submission = {
    id: submissionId,
    submittedAt: new Date().toISOString(),
    studentName: sub.studentName,
    fromGroupId: sub.fromGroupId,
    toGroupId: sub.toGroupId,
    scores: sub.scores,
    comment: sub.comment,
  };

  // 같은 (from, to) 쌍은 덮어쓰기 (수정 허용)
  const idx = session.submissions.findIndex(
    s => s.fromGroupId === sub.fromGroupId && s.toGroupId === sub.toGroupId
  );
  if (idx >= 0) {
    session.submissions[idx] = newSub;
  } else {
    session.submissions.push(newSub);
  }

  // 남은 TTL 유지 (만료 시간 기준 재저장)
  const remainingSec = Math.max(
    Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000),
    1
  );
  await kv.set(sessionKey(sessionId), session, { ex: remainingSec });

  return { ok: true, submissionId };
}

// ── 집계 ─────────────────────────────────────────────────────────
// Design Ref: §3.2 — 제출 데이터를 모둠별로 집계
export function aggregateSession(session: Session): SessionWithAggregation {
  const totalStudents = session.groups.reduce((n, g) => n + g.members.length, 0);
  const aggregated: Record<string, AggregatedGroup> = {};

  for (const group of session.groups) {
    const emptyScores: Record<string, number[]> = {};
    for (const cr of session.criteria) emptyScores[cr.key] = [];
    aggregated[group.id] = { scores: emptyScores, comments: [], submissionCount: 0 };
  }

  for (const sub of session.submissions) {
    const agg = aggregated[sub.toGroupId];
    if (!agg) continue;
    for (const [key, val] of Object.entries(sub.scores)) {
      agg.scores[key] ??= [];
      agg.scores[key].push(val);
    }
    if (sub.comment.trim()) agg.comments.push(sub.comment.trim());
    agg.submissionCount++;
  }

  const { submissions: _, ...rest } = session;
  return {
    ...rest,
    submissionCount: session.submissions.length,
    totalStudents,
    aggregated,
  };
}
