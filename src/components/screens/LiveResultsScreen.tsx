'use client';

// Design Ref: §5.1 /results/{sessionId} — SSE 실시간 결과 (선생님용)
// Plan SC: 선생님이 실시간으로 학생 제출 현황 + 집계 결과 확인

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TeacherShell from './TeacherShell';
import { getGroupColor, emojiFor } from '@/lib/data';
import type { SessionWithAggregation, AggregatedGroup, StoredCriterionRef } from '@/types/session';
import Btn from '@/components/ui/Btn';
import Card from '@/components/ui/Card';
import Pill from '@/components/ui/Pill';
import Progress from '@/components/ui/Progress';
import Segmented from '@/components/ui/Segmented';
import Icon from '@/components/ui/Icon';

const PRIMARY = 'var(--color-blue-50)';

// ── 집계 헬퍼 ─────────────────────────────────────────────────────

function avgScores(agg: AggregatedGroup, criteria: StoredCriterionRef[]): Record<string, number> {
  return Object.fromEntries(
    criteria.map(cr => {
      const vals = agg.scores[cr.key] ?? [];
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      return [cr.key, avg];
    })
  );
}

function overallAvg(scores: Record<string, number>): number {
  const vals = Object.values(scores).filter(v => v > 0);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
}

function topCrit(scores: Record<string, number>): string {
  const entries = Object.entries(scores).filter(([, v]) => v > 0);
  if (!entries.length) return '';
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

function timeRemaining(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return '만료됨';
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return h > 0 ? `${h}시간 ${m}분 남음` : `${m}분 남음`;
}

// ── 시각화 컴포넌트 ───────────────────────────────────────────────

function Radar({ scores, criteria, color, size = 150 }: {
  scores: Record<string, number>; criteria: StoredCriterionRef[]; color: string; size?: number;
}) {
  const n = criteria.length;
  if (n < 3) return null;
  const cx = size / 2, cy = size / 2, R = size * 0.36;
  const ang = (i: number) => (2 * Math.PI / n) * i - Math.PI / 2;
  const pt = (i: number, r: number): [number, number] => [cx + Math.cos(ang(i)) * r, cy + Math.sin(ang(i)) * r];
  const poly = criteria.map((cr, i) => pt(i, ((scores[cr.key] ?? 0) / 5) * R).join(',')).join(' ');
  const label = (cr: StoredCriterionRef) => cr.label.length > 4 ? cr.label.slice(0, 4) + '…' : cr.label;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.33, 0.66, 1].map((f, i) => (
        <polygon key={i} points={criteria.map((_, j) => pt(j, R * f).join(',')).join(' ')} fill="none" stroke="var(--color-line-normal-normal)" strokeWidth="1" />
      ))}
      {criteria.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--color-line-normal-neutral)" strokeWidth="1" />; })}
      <polygon points={poly} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      {criteria.map((cr, i) => { const [x, y] = pt(i, ((scores[cr.key] ?? 0) / 5) * R); return <circle key={cr.key} cx={x} cy={y} r="3.5" fill={color} />; })}
      {criteria.map((cr, i) => { const [x, y] = pt(i, R + 14); return <text key={cr.key} x={x} y={y + 4} textAnchor="middle" style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, fill: 'var(--color-label-alternative)' }}>{label(cr)}</text>; })}
    </svg>
  );
}

function BarsViz({ scores, criteria, color }: { scores: Record<string, number>; criteria: StoredCriterionRef[]; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', padding: '4px 0' }}>
      {criteria.map(cr => (
        <div key={cr.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 46, fontSize: 12, fontWeight: 700, color: 'var(--color-label-neutral)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{cr.label}</span>
          <div style={{ flex: 1 }}><Progress value={scores[cr.key] ?? 0} max={5} color={color} height={10} /></div>
          <span style={{ width: 30, textAlign: 'right', fontSize: 13, fontWeight: 800, color: 'var(--color-label-strong)', flexShrink: 0 }}>{(scores[cr.key] ?? 0).toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
}

function BadgesViz({ scores, criteria, color, deep, soft }: {
  scores: Record<string, number>; criteria: StoredCriterionRef[]; color: string; deep: string; soft: string;
}) {
  const top = topCrit(scores);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '4px 0' }}>
      {criteria.map(cr => {
        const isTop = cr.key === top;
        return (
          <span key={cr.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 34, padding: '0 12px', borderRadius: 9999, background: isTop ? color : soft, color: isTop ? '#fff' : deep, fontWeight: 800, fontSize: 13 }}>
            {isTop && <Icon name="crown" size={14} color="#fff" />}
            {cr.label} <span style={{ opacity: 0.85 }}>{(scores[cr.key] ?? 0).toFixed(1)}</span>
          </span>
        );
      })}
    </div>
  );
}

// ── 연결 상태 배지 ────────────────────────────────────────────────
function ConnectionBadge({ status }: { status: 'connecting' | 'connected' | 'reconnecting' | 'expired' }) {
  const map = {
    connecting:   { label: '연결 중…',   dot: 'var(--color-orange-50)', bg: 'var(--color-orange-95)', text: 'var(--color-orange-40)' },
    connected:    { label: '실시간 연결', dot: 'var(--color-green-50)',  bg: 'var(--color-green-95)',  text: 'var(--color-green-40)' },
    reconnecting: { label: '재연결 중…', dot: 'var(--color-orange-50)', bg: 'var(--color-orange-95)', text: 'var(--color-orange-40)' },
    expired:      { label: '세션 만료',  dot: 'var(--color-red-50)',    bg: 'var(--color-red-95)',    text: 'var(--color-red-40)' },
  }[status];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 10px', borderRadius: 9999, background: map.bg, fontSize: 12.5, fontWeight: 700, color: map.text }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: map.dot }} />
      {map.label}
    </span>
  );
}

// ── 에러/만료 화면 ────────────────────────────────────────────────
function ErrorScreen({ message }: { message: string }) {
  return (
    <TeacherShell active="results" wide>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80, textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: 'var(--color-label-strong)' }}>{message}</h1>
        <p style={{ margin: '12px 0 28px', fontSize: 15, color: 'var(--color-label-neutral)' }}>세션이 만료됐거나 존재하지 않아요.</p>
        <Link href="/activities/new" style={{ textDecoration: 'none' }}>
          <Btn variant="primary" size="lg" color={PRIMARY} leftIcon="plus">새 활동 만들기</Btn>
        </Link>
      </div>
    </TeacherShell>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────
export default function LiveResultsScreen({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<SessionWithAggregation | null>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'reconnecting' | 'expired'>('connecting');
  const [notFound, setNotFound] = useState(false);
  const [viz, setViz] = useState('radar');

  const vizOptions = [
    { value: 'radar',  label: '레이더' },
    { value: 'bars',   label: '막대' },
    { value: 'badges', label: '배지' },
  ];

  // 초기 데이터 + SSE 연결
  useEffect(() => {
    // 초기 로드
    fetch(`/api/sessions/${sessionId}`)
      .then(r => r.json())
      .then(d => {
        if (d.session) setSession(d.session);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true));

    // SSE 연결 — Design Ref: §4.2 GET /api/sessions/{id}/stream
    const es = new EventSource(`/api/sessions/${sessionId}/stream`);

    es.addEventListener('update', (e) => {
      try {
        setSession(JSON.parse((e as MessageEvent).data));
        setStatus('connected');
      } catch { /* ignore parse error */ }
    });

    es.addEventListener('expired', () => {
      setStatus('expired');
      es.close();
    });

    es.onopen = () => setStatus('connected');
    es.onerror = () => setStatus(prev => prev === 'expired' ? 'expired' : 'reconnecting');

    return () => es.close();
  }, [sessionId]);

  if (notFound) return <ErrorScreen message="세션을 찾을 수 없어요" />;

  // 로딩 중
  if (!session) {
    return (
      <TeacherShell active="results" wide>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
          <p style={{ fontSize: 16, color: 'var(--color-label-alternative)', fontWeight: 600 }}>결과를 불러오는 중...</p>
        </div>
      </TeacherShell>
    );
  }

  const { criteria, groups, settings, submissionCount, totalStudents, aggregated, title, expiresAt } = session;

  // 모든 댓글 수집
  const allComments = Object.entries(aggregated).flatMap(([groupId, agg]) => {
    const group = groups.find(g => g.id === groupId);
    return agg.comments.map(text => ({ text, group }));
  });

  // 모둠별 평균 점수 + 전체 평균
  const groupsWithAvg = groups
    .map(g => {
      const agg = aggregated[g.id] ?? { scores: {}, comments: [], submissionCount: 0 };
      const scores = avgScores(agg, criteria);
      const avg = overallAvg(scores);
      return { ...g, scores, avg, submissionCount: agg.submissionCount };
    })
    .sort((a, b) => b.avg - a.avg);

  const classAvg = groupsWithAvg.length
    ? groupsWithAvg.reduce((s, g) => s + g.avg, 0) / groupsWithAvg.length
    : 0;

  // 기준별 타이틀 조회
  const superlativeMap = Object.fromEntries(criteria.map(cr => [cr.key, { t: cr.superlativeTitle, e: cr.superlativeEmoji }]));

  return (
    <TeacherShell active="results" wide>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22, gap: 16 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <ConnectionBadge status={status} />
            <span style={{ fontSize: 13, color: 'var(--color-label-alternative)', fontWeight: 500 }}>
              {status !== 'expired' && timeRemaining(expiresAt)}
            </span>
          </div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em', color: 'var(--color-label-strong)' }}>
            🎉 {title}
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 14.5, color: 'var(--color-label-neutral)' }}>
            {session.criteria.length}개 기준 · {groups.length}개 모둠
            {!settings.anonymous && ' · 실명 평가'}
            {settings.commentsEnabled && ' · 칭찬 댓글'}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          <Segmented options={vizOptions} value={viz} onChange={setViz} color={PRIMARY} />
          <Link href="/activities/new" style={{ textDecoration: 'none' }}>
            <Btn variant="outline" size="sm" leftIcon="plus">새 활동 만들기</Btn>
          </Link>
        </div>
      </div>

      {/* 실시간 제출 현황 */}
      <Card pad={20} radius={20} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--color-label-strong)' }}>참여 현황</span>
            {submissionCount > 0 && submissionCount >= totalStudents && (
              <Pill size="sm" icon="circle-check-fill" color="var(--color-green-40)" bg="var(--color-green-95)">모두 완료</Pill>
            )}
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: PRIMARY }}>
            {submissionCount} <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-label-neutral)' }}>/ {totalStudents}명</span>
          </span>
        </div>
        <Progress value={submissionCount} max={Math.max(totalStudents, 1)} color={PRIMARY} height={12} />
        {submissionCount === 0 && (
          <p style={{ margin: '10px 0 0', fontSize: 13.5, color: 'var(--color-label-alternative)', fontWeight: 500 }}>
            학생들이 QR을 찍으면 결과가 여기에 실시간으로 나타나요.
          </p>
        )}
      </Card>

      {/* 요약 스탯 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 26 }}>
        {[
          { icon: 'star-fill',   color: 'var(--color-orange-50)', bg: 'var(--color-orange-95)', num: submissionCount > 0 ? classAvg.toFixed(1) : '—', label: '우리 반 평균 점수' },
          { icon: 'bubble-fill', color: 'var(--color-violet-50)', bg: 'var(--color-violet-95)', num: allComments.length, label: '칭찬 댓글 수' },
          { icon: 'heart-fill',  color: 'var(--color-pink-50)',   bg: 'var(--color-pink-95)',   num: submissionCount > 0 ? `${Math.round((submissionCount / Math.max(totalStudents, 1)) * 100)}%` : '0%', label: '참여율' },
        ].map((s, i) => (
          <Card key={i} pad={20} radius={20} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={s.icon} size={24} color={s.color} />
            </span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--color-label-strong)', lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 13, color: 'var(--color-label-neutral)', marginTop: 4 }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* 모둠별 결과 카드 */}
      {submissionCount > 0 ? (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '0 0 14px' }}>
            <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: 'var(--color-label-strong)' }}>모든 모둠이 빛났어요 ✨</h3>
            <span style={{ fontSize: 13, color: 'var(--color-label-alternative)', fontWeight: 600 }}>종합 점수 순</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }}>
            {groupsWithAvg.map((g, i) => {
              const c = getGroupColor(g.colorKey);
              const top = topCrit(g.scores);
              const sup = superlativeMap[top] ?? { t: '멋진왕', e: '🏆' };
              const medal = ['🥇', '🥈', '🥉'][i];

              return (
                <Card key={g.id} pad={20} radius={24} accent={c.solid}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <span style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: medal ? 18 : 14, fontWeight: 800, background: medal ? 'var(--color-orange-95)' : 'var(--color-coolNeutral-98)', color: 'var(--color-label-neutral)' }}>
                      {medal || (i + 1)}
                    </span>
                    <span style={{ width: 44, height: 44, borderRadius: 12, background: c.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{g.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--color-label-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                        {g.avg > 0 && <span style={{ fontSize: 15, lineHeight: 1 }}>{emojiFor(g.avg).e}</span>}
                        <span style={{ fontSize: 13, fontWeight: 800, color: c.deep }}>{g.avg > 0 ? `${g.avg.toFixed(1)}점` : '미평가'}</span>
                        <span style={{ fontSize: 12, color: 'var(--color-label-assistive)', fontWeight: 500 }}>({g.submissionCount}건)</span>
                      </div>
                    </div>
                    {top && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 30, padding: '0 10px', borderRadius: 9999, background: c.soft, color: c.deep, fontWeight: 800, fontSize: 12.5, flexShrink: 0, whiteSpace: 'nowrap' }}>
                        {sup.e} {sup.t}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: viz === 'radar' ? 155 : 'auto' }}>
                    {viz === 'radar'  && <Radar scores={g.scores} criteria={criteria} color={c.solid} />}
                    {viz === 'bars'   && <BarsViz scores={g.scores} criteria={criteria} color={c.solid} />}
                    {viz === 'badges' && <BadgesViz scores={g.scores} criteria={criteria} color={c.solid} deep={c.deep} soft={c.soft} />}
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <Card pad={40} radius={24} style={{ marginBottom: 28, textAlign: 'center', background: 'var(--color-coolNeutral-99)', border: 'none' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-label-neutral)' }}>학생들의 평가를 기다리는 중이에요</div>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--color-label-assistive)' }}>QR코드를 보여주시면 학생들이 참여할 수 있어요.</p>
        </Card>
      )}

      {/* 칭찬 댓글 */}
      {allComments.length > 0 && (
        <>
          <h3 style={{ margin: '0 0 14px', fontSize: 19, fontWeight: 800, color: 'var(--color-label-strong)' }}>오늘의 따뜻한 한마디 💬</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {allComments.slice(0, 6).map((cm, i) => {
              if (!cm.group) return null;
              const c = getGroupColor(cm.group.colorKey);
              return (
                <Card key={i} pad={16} radius={18} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ width: 38, height: 38, borderRadius: 10, background: c.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{cm.group.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.deep }}>{cm.group.name}에게</span>
                    <p style={{ margin: '4px 0 0', fontSize: 14, lineHeight: 1.5, color: 'var(--color-label-normal)' }}>{cm.text}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </TeacherShell>
  );
}
