'use client';

// Design Ref: §5.1 /join/{sessionId} — 학생 참여 전체 플로우 (세션 기반)
// Plan SC: 학생 QR 스캔 후 1분 내 평가 완료

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getGroupColor, emojiFor } from '@/lib/data';
import { saveStudentProfile, loadStudentProfile } from '@/lib/activityStore';
import type { SessionWithAggregation, SessionGroup, StoredCriterionRef } from '@/types/session';
import Btn from '@/components/ui/Btn';
import Pill from '@/components/ui/Pill';
import Progress from '@/components/ui/Progress';
import EmojiPick from '@/components/ui/EmojiPick';
import Confetti from '@/components/ui/Confetti';
import Viewy from '@/components/brand/Viewy';
import Icon from '@/components/ui/Icon';

const PRIMARY = 'var(--color-blue-50)';
const SAFE_TOP = 52;

type JoinStep = 'loading' | 'error' | 'intro' | 'groupSelect' | 'list' | 'rate' | 'done';

interface Submission {
  scores: Record<string, number>;
  comment: string;
}

function PhonePage({ children, bg = '#fff', pad = 20 }: { children: React.ReactNode; bg?: string; pad?: number }) {
  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: 'var(--font-sans)', paddingTop: SAFE_TOP, paddingBottom: 30, boxSizing: 'border-box' }}>
      <div style={{ padding: `0 ${pad}px` }}>{children}</div>
    </div>
  );
}

// ── 에러 화면 ─────────────────────────────────────────────────────
function ErrorScreen() {
  return (
    <PhonePage bg="linear-gradient(180deg, var(--color-red-95), var(--color-coolNeutral-99) 60%)">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--color-label-strong)' }}>세션을 찾을 수 없어요</h1>
        <p style={{ margin: '14px 0 0', fontSize: 16, lineHeight: 1.6, color: 'var(--color-label-neutral)', maxWidth: 280 }}>
          QR 코드가 만료됐거나 잘못된 링크일 수 있어요.<br />선생님께 새 QR을 요청해보세요.
        </p>
        <div style={{ marginTop: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Btn variant="outline" size="lg">홈으로</Btn>
          </Link>
        </div>
      </div>
    </PhonePage>
  );
}

// ── 인트로 화면 ───────────────────────────────────────────────────
function IntroStep({ session, onStart }: {
  session: SessionWithAggregation;
  onStart: (name: string) => void;
}) {
  const [name, setName] = useState('');
  useEffect(() => {
    const saved = loadStudentProfile();
    if (saved?.name) setName(saved.name);
  }, []);

  const canStart = session.settings.anonymous || name.trim().length > 0;

  const handleStart = () => {
    if (!session.settings.anonymous && name.trim()) {
      saveStudentProfile({ name: name.trim() });
    }
    onStart(session.settings.anonymous ? '' : name.trim());
  };

  return (
    <PhonePage bg="linear-gradient(180deg, var(--color-blue-95), var(--color-coolNeutral-99) 70%)">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 30 }}>
        <Viewy size={140} mood="wave" primary={PRIMARY} />
        <h1 style={{ margin: '16px 0 0', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', color: 'var(--color-label-strong)' }}>안녕! 나는 뷰이야 👋</h1>
        <p style={{ margin: '10px 0 0', fontSize: 15.5, lineHeight: 1.6, color: 'var(--color-label-neutral)', maxWidth: 280 }}>오늘은 친구들의 발표를 보고<br />멋진 점을 찾아 칭찬해 줄 거야.</p>

        <div style={{ marginTop: 22, width: '100%', background: '#fff', borderRadius: 20, padding: 18, boxShadow: 'var(--shadow-emphasize)', textAlign: 'left' }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-label-alternative)', marginBottom: 4 }}>오늘의 활동</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-label-strong)' }}>{session.title}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <Pill size="sm" color="var(--color-label-neutral)" bg="var(--color-coolNeutral-98)" icon="persons">{session.groups.length}개 모둠</Pill>
            <Pill size="sm" color="var(--color-label-neutral)" bg="var(--color-coolNeutral-98)" icon="sparkle-fill">{session.criteria.length}개 기준</Pill>
            {session.settings.anonymous && <Pill size="sm" color="var(--color-label-neutral)" bg="var(--color-coolNeutral-98)" icon="eye-slash">익명</Pill>}
          </div>
        </div>

        {!session.settings.anonymous && (
          <div style={{ marginTop: 14, width: '100%', background: '#fff', borderRadius: 20, padding: 18, boxShadow: 'var(--shadow-emphasize)', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <Icon name="person-fill" size={15} color="var(--color-blue-50)" />
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-label-strong)' }}>내 이름 (닉네임)</span>
              <span style={{ fontSize: 12, color: 'var(--color-label-alternative)', fontWeight: 500 }}>친구들이 볼 수 있어요</span>
            </div>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && canStart) handleStart(); }}
              placeholder="예: 이준호"
              autoFocus
              style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 12, border: `1.5px solid ${name.trim() ? 'var(--color-blue-50)' : 'var(--color-line-normal-normal)'}`, fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 17, color: 'var(--color-label-strong)', outline: 'none', boxSizing: 'border-box', transition: 'border-color .15s' }}
            />
            {!name.trim() && <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--color-label-alternative)' }}>이름을 입력해야 참여할 수 있어요.</p>}
          </div>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <Btn variant="primary" size="xl" full color={PRIMARY} onClick={handleStart} disabled={!canStart} rightIcon="arrow-right">평가 시작하기</Btn>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{ width: '100%', marginTop: 12, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-label-alternative)', fontWeight: 600, fontSize: 14 }}>← 처음으로</button>
        </Link>
      </div>
    </PhonePage>
  );
}

// ── 내 모둠 선택 ──────────────────────────────────────────────────
function GroupSelectStep({ groups, onSelect }: {
  groups: SessionGroup[];
  onSelect: (groupId: string) => void;
}) {
  return (
    <PhonePage bg="linear-gradient(180deg, var(--color-violet-95), var(--color-coolNeutral-99) 60%)">
      <div style={{ paddingTop: 8, textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', color: 'var(--color-label-strong)' }}>내가 속한 모둠을<br />골라줘! 👇</h1>
        <p style={{ margin: '10px 0 0', fontSize: 14.5, color: 'var(--color-label-neutral)' }}>내 모둠 친구들은 내가 평가할 수 없어요.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {groups.map(g => {
          const c = getGroupColor(g.colorKey);
          return (
            <button key={g.id} onClick={() => onSelect(g.id)} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px',
              borderRadius: 20, cursor: 'pointer', border: '2px solid var(--color-line-normal-neutral)',
              background: '#fff', width: '100%', textAlign: 'left',
              boxShadow: 'var(--shadow-emphasize)', transition: 'all .15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = c.solid; (e.currentTarget as HTMLElement).style.background = c.tint; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-line-normal-neutral)'; (e.currentTarget as HTMLElement).style.background = '#fff'; }}
            >
              <span style={{ width: 52, height: 52, borderRadius: 14, background: c.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{g.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-label-strong)' }}>{g.name}</div>
                {g.members.length > 0 && <div style={{ fontSize: 13, color: 'var(--color-label-alternative)', marginTop: 2 }}>{g.members.join(' · ')}</div>}
              </div>
              <Icon name="chevron-right" size={22} color="var(--color-label-assistive)" />
            </button>
          );
        })}
      </div>
    </PhonePage>
  );
}

// ── 모둠 목록 (평가 대상) ─────────────────────────────────────────
function ListStep({ groups, submissions, studentName, anonymous, onSelect, onFinish }: {
  groups: SessionGroup[];
  submissions: Record<string, Submission>;
  studentName: string;
  anonymous: boolean;
  onSelect: (g: SessionGroup) => void;
  onFinish: () => void;
}) {
  const doneCount = Object.keys(submissions).length;
  const allDone = doneCount >= groups.length;

  return (
    <PhonePage bg="var(--color-coolNeutral-99)">
      <div style={{ paddingTop: 6, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          {!anonymous && studentName && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="person-fill" size={14} color="var(--color-blue-40)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-blue-40)' }}>{studentName}</span>
            </div>
          )}
          <Pill size="sm" color="var(--color-blue-40)" bg="var(--color-blue-95)">{doneCount}/{groups.length} 완료</Pill>
        </div>
        <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: 'var(--color-label-strong)', letterSpacing: '-0.02em' }}>친구들 발표 어땠어?</h1>
        <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--color-label-neutral)' }}>모둠을 눌러서 응원을 보내줘! 💛</p>
        <Progress value={doneCount} max={groups.length} color={PRIMARY} height={12} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {groups.map(g => {
          const c = getGroupColor(g.colorKey);
          const isDone = !!submissions[g.id];
          return (
            <button key={g.id} onClick={() => onSelect(g)} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 20, cursor: 'pointer', textAlign: 'left',
              border: `1.5px solid ${isDone ? c.solid : 'var(--color-line-normal-neutral)'}`,
              background: isDone ? c.tint : '#fff', transition: 'all .15s', width: '100%', boxShadow: 'var(--shadow-emphasize)',
            }}>
              <span style={{ width: 52, height: 52, borderRadius: 14, background: c.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{g.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--color-label-strong)' }}>{g.name}</div>
                {g.members.length > 0 && <div style={{ fontSize: 13, color: 'var(--color-label-alternative)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.members.join(' · ')}</div>}
              </div>
              {isDone
                ? <Icon name="circle-check-fill" size={26} color={c.solid} />
                : <span style={{ width: 38, height: 38, borderRadius: '50%', background: c.soft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="chevron-right" size={20} color={c.deep} /></span>
              }
            </button>
          );
        })}
      </div>
      {doneCount > 0 && (
        <div style={{ marginTop: 20 }}>
          <Btn variant="primary" size="lg" full color={PRIMARY} onClick={onFinish} rightIcon="arrow-right">
            {allDone ? '완료하고 칭찬 보기' : '여기까지 제출하기'}
          </Btn>
        </div>
      )}
    </PhonePage>
  );
}

// ── 모둠 평가 ─────────────────────────────────────────────────────
function RateStep({ group, criteria, commentsEnabled, existing, onBack, onSubmit }: {
  group: SessionGroup;
  criteria: StoredCriterionRef[];
  commentsEnabled: boolean;
  existing?: Submission;
  onBack: () => void;
  onSubmit: (sub: Submission) => void;
}) {
  const c = getGroupColor(group.colorKey);
  const [scores, setScores] = useState<Record<string, number>>(existing?.scores || {});
  const [comment, setComment] = useState(existing?.comment || '');
  const [submitting, setSubmitting] = useState(false);

  const total = criteria.length;
  const ratedCount = criteria.filter(cr => scores[cr.key]).length;
  const allRated = ratedCount === total;
  const starters = ['이런 점이 멋졌어!', '다음에도 보고 싶어', '나도 배우고 싶었어'];

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--font-sans)', paddingTop: SAFE_TOP, paddingBottom: 28, boxSizing: 'border-box' }}>
      <div style={{ padding: '0 16px 16px', background: c.soft, paddingTop: 10 }}>
        <button onClick={onBack} style={{ border: 'none', background: 'rgba(255,255,255,0.7)', width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <Icon name="arrow-left" size={22} color={c.deep} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 54, height: 54, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, boxShadow: 'var(--shadow-emphasize)' }}>{group.emoji}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 21, color: 'var(--color-label-strong)', letterSpacing: '-0.02em' }}>{group.name}</div>
            {group.members.length > 0 && <div style={{ fontSize: 13, color: c.deep, fontWeight: 600, marginTop: 2 }}>{group.members.join(' · ')}</div>}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <div style={{ padding: '14px 0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: 'var(--color-label-strong)' }}>기준별로 응원해줘</h2>
            <span style={{ fontSize: 13, fontWeight: 800, color: c.deep }}>{ratedCount}/{total}</span>
          </div>
          <Progress value={ratedCount} max={total} color={c.solid} height={8} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4 }}>
          {criteria.map(cr => {
            const v = scores[cr.key] || 0;
            const face = v ? emojiFor(v) : null;
            return (
              <div key={cr.key} style={{ borderRadius: 18, border: `1.5px solid ${v ? c.solid : 'var(--color-line-normal-neutral)'}`, background: v ? c.tint : '#fff', padding: 14, transition: 'all .15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ width: 38, height: 38, borderRadius: 11, background: c.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name={cr.icon} size={20} color={c.deep} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--color-label-strong)' }}>{cr.label}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--color-label-alternative)', marginTop: 1 }}>{cr.desc}</div>
                  </div>
                  {face && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 28, padding: '0 10px', borderRadius: 9999, background: '#fff', color: c.deep, fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{face.label} · {v}점</span>}
                </div>
                <EmojiPick value={v} onChange={val => setScores(s => ({ ...s, [cr.key]: val }))} color={c.solid} />
              </div>
            );
          })}
        </div>

        {commentsEnabled && (
          <div style={{ padding: '18px 0 0' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 800, color: 'var(--color-label-strong)' }}>따뜻한 한마디 <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-label-alternative)' }}>선택</span></h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {starters.map(s => (
                <button key={s} onClick={() => setComment(comment ? comment : s + ' ')} style={{ height: 34, padding: '0 12px', borderRadius: 9999, cursor: 'pointer', border: '1px dashed var(--color-line-normal-normal)', background: 'var(--color-coolNeutral-99)', color: 'var(--color-label-neutral)', fontWeight: 600, fontSize: 13 }}>＋ {s}</button>
              ))}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="친구에게 칭찬을 적어줘 (없어도 괜찮아!)" rows={3}
              style={{ width: '100%', borderRadius: 16, border: '1.5px solid var(--color-line-normal-normal)', padding: 14, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 15, lineHeight: 1.5, color: 'var(--color-label-strong)', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <Btn variant="primary" size="xl" full color={c.solid}
            onClick={() => { setSubmitting(true); onSubmit({ scores, comment }); }}
            disabled={!allRated || submitting} leftIcon="send">
            {submitting ? '보내는 중...' : allRated ? '칭찬 보내기' : `${total - ratedCount}개 기준이 남았어`}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── 완료 화면 ─────────────────────────────────────────────────────
function DoneStep({ count, sessionId }: { count: number; sessionId: string }) {
  const [run, setRun] = useState(false);
  useEffect(() => { const id = setTimeout(() => setRun(true), 200); return () => clearTimeout(id); }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'linear-gradient(180deg, var(--color-violet-95), var(--color-blue-95))', fontFamily: 'var(--font-sans)', paddingTop: SAFE_TOP, boxSizing: 'border-box' }}>
      <Confetti run={run} />
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 36 }}>
        <Viewy size={160} mood="celebrate" primary={PRIMARY} />
        <h1 style={{ margin: '16px 0 0', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em', color: 'var(--color-label-strong)' }}>다 했어! 멋지다 🎉</h1>
        <p style={{ margin: '12px 0 0', fontSize: 16, lineHeight: 1.6, color: 'var(--color-label-neutral)', maxWidth: 280 }}>{count}개 모둠 친구들에게 따뜻한 응원을 보냈어.<br />너의 칭찬이 친구들을 자라게 해 💛</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          {['💛', '⭐', '🌱'].map((e, i) => (
            <span key={i} style={{ width: 52, height: 52, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: 'var(--shadow-emphasize)' }}>{e}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: '0 24px', position: 'absolute', bottom: 24, left: 0, right: 0 }}>
        <Link href={`/results/${sessionId}`} style={{ textDecoration: 'none' }}>
          <Btn variant="primary" size="xl" full color={PRIMARY} rightIcon="arrow-right">우리 반 결과 보기</Btn>
        </Link>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{ width: '100%', marginTop: 12, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-label-neutral)', fontWeight: 700, fontSize: 14 }}>처음으로 →</button>
        </Link>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────
export default function JoinScreen({ sessionId }: { sessionId: string }) {
  const [step, setStep] = useState<JoinStep>('loading');
  const [session, setSession] = useState<SessionWithAggregation | null>(null);
  const [studentName, setStudentName] = useState('');
  const [myGroupId, setMyGroupId] = useState('');
  const [activeGroup, setActiveGroup] = useState<SessionGroup | null>(null);
  const [submissions, setSubmissions] = useState<Record<string, Submission>>({});
  const [submitError, setSubmitError] = useState('');

  // 세션 로드
  useEffect(() => {
    fetch(`/api/sessions/${sessionId}`)
      .then(r => r.json())
      .then(d => {
        if (d.session) { setSession(d.session); setStep('intro'); }
        else setStep('error');
      })
      .catch(() => setStep('error'));
  }, [sessionId]);

  // 내 모둠 제외한 평가 대상
  const toRate = (session?.groups ?? []).filter(g => g.id !== myGroupId);

  // 평가 제출
  const handleSubmit = async (toGroupId: string, sub: Submission) => {
    setSubmitError('');
    try {
      const res = await fetch(`/api/sessions/${sessionId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          fromGroupId: myGroupId,
          toGroupId,
          scores: sub.scores,
          comment: sub.comment,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setSubmitError(err?.error?.code || '제출에 실패했어요. 다시 시도해주세요.');
        return;
      }
      setSubmissions(s => ({ ...s, [toGroupId]: sub }));
      setActiveGroup(null);
      setStep('list');
    } catch {
      setSubmitError('네트워크 오류가 발생했어요.');
    }
  };

  if (step === 'loading') {
    return (
      <PhonePage bg="var(--color-coolNeutral-99)">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80 }}>
          <Viewy size={100} mood="happy" primary={PRIMARY} />
          <p style={{ marginTop: 20, fontSize: 15, color: 'var(--color-label-alternative)', fontWeight: 600 }}>활동 정보를 불러오는 중...</p>
        </div>
      </PhonePage>
    );
  }

  if (step === 'error' || !session) return <ErrorScreen />;

  if (step === 'intro') {
    return <IntroStep session={session} onStart={name => { setStudentName(name); setStep('groupSelect'); }} />;
  }

  if (step === 'groupSelect') {
    return <GroupSelectStep groups={session.groups} onSelect={id => { setMyGroupId(id); setStep('list'); }} />;
  }

  if (step === 'rate' && activeGroup) {
    return (
      <>
        {submitError && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'var(--color-red-50)', color: '#fff', padding: '12px 20px', textAlign: 'center', fontSize: 14, fontWeight: 700 }}>
            {submitError}
            <button onClick={() => setSubmitError('')} style={{ marginLeft: 12, border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer', fontWeight: 800 }}>✕</button>
          </div>
        )}
        <RateStep
          group={activeGroup}
          criteria={session.criteria}
          commentsEnabled={session.settings.commentsEnabled}
          existing={submissions[activeGroup.id]}
          onBack={() => { setActiveGroup(null); setStep('list'); }}
          onSubmit={sub => handleSubmit(activeGroup.id, sub)}
        />
      </>
    );
  }

  if (step === 'done') {
    return <DoneStep count={toRate.length} sessionId={sessionId} />;
  }

  // list
  return (
    <ListStep
      groups={toRate}
      submissions={submissions}
      studentName={studentName}
      anonymous={session.settings.anonymous}
      onSelect={g => { setActiveGroup(g); setStep('rate'); }}
      onFinish={() => setStep('done')}
    />
  );
}
