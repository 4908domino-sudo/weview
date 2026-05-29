'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ACTIVITY, GROUPS, getGroupColor, emojiFor } from '@/lib/data';
import {
  loadCriteria, loadActivitySettings, loadStudentProfile, saveStudentProfile,
  type StoredCriterion, type ActivitySettings,
} from '@/lib/activityStore';
import Btn from '@/components/ui/Btn';
import Pill from '@/components/ui/Pill';
import Progress from '@/components/ui/Progress';
import EmojiPick from '@/components/ui/EmojiPick';
import Confetti from '@/components/ui/Confetti';
import Viewy from '@/components/brand/Viewy';
import Icon from '@/components/ui/Icon';

const PRIMARY = 'var(--color-blue-50)';
const SAFE_TOP = 52;
const ME_GROUP = 'g1';

type Step = 'intro' | 'list' | 'rate' | 'done';

interface GroupResult {
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

function StudentIntro({ criteriaCount, anonymous, onStart }: {
  criteriaCount: number;
  anonymous: boolean;
  onStart: (name: string) => void;
}) {
  const [name, setName] = useState('');

  useEffect(() => {
    const saved = loadStudentProfile();
    if (saved?.name) setName(saved.name);
  }, []);

  const canStart = anonymous || name.trim().length > 0;

  const handleStart = () => {
    if (!anonymous && name.trim()) {
      saveStudentProfile({ name: name.trim() });
    }
    onStart(anonymous ? '' : name.trim());
  };

  return (
    <PhonePage bg="linear-gradient(180deg, var(--color-blue-95), var(--color-coolNeutral-99) 70%)">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 30 }}>
        <Viewy size={150} mood="wave" primary={PRIMARY} />
        <h1 style={{ margin: '18px 0 0', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em', color: 'var(--color-label-strong)' }}>안녕! 나는 뷰이야 👋</h1>
        <p style={{ margin: '12px 0 0', fontSize: 16, lineHeight: 1.6, color: 'var(--color-label-neutral)', maxWidth: 280 }}>오늘은 친구들의 발표를 보고<br />멋진 점을 찾아 칭찬해 줄 거야.</p>

        {/* 활동 정보 카드 */}
        <div style={{ marginTop: 24, width: '100%', background: '#fff', borderRadius: 20, padding: 18, boxShadow: 'var(--shadow-emphasize)', textAlign: 'left' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-label-alternative)', marginBottom: 4 }}>오늘의 활동</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-label-strong)' }}>{ACTIVITY.title}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            <Pill size="sm" color="var(--color-label-neutral)" bg="var(--color-coolNeutral-98)" icon="persons">{GROUPS.length}개 모둠</Pill>
            <Pill size="sm" color="var(--color-label-neutral)" bg="var(--color-coolNeutral-98)" icon="sparkle-fill">{criteriaCount}개 기준</Pill>
            {anonymous && (
              <Pill size="sm" color="var(--color-label-neutral)" bg="var(--color-coolNeutral-98)" icon="eye-slash">익명</Pill>
            )}
          </div>
        </div>

        {/* 프로필 입력 — 익명이 아닐 때만 표시 */}
        {!anonymous && (
          <div style={{ marginTop: 16, width: '100%', background: '#fff', borderRadius: 20, padding: 18, boxShadow: 'var(--shadow-emphasize)', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <Icon name="person-fill" size={16} color="var(--color-blue-50)" />
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-label-strong)' }}>내 이름 (닉네임)</span>
              <span style={{ fontSize: 12, color: 'var(--color-label-alternative)', fontWeight: 500 }}>친구들이 볼 수 있어요</span>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && canStart) handleStart(); }}
              placeholder="예: 이준호"
              autoFocus
              style={{
                width: '100%', height: 48, padding: '0 16px', borderRadius: 12,
                border: `1.5px solid ${name.trim() ? 'var(--color-blue-50)' : 'var(--color-line-normal-normal)'}`,
                fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 17,
                color: 'var(--color-label-strong)', outline: 'none', boxSizing: 'border-box',
                transition: 'border-color .15s',
              }}
            />
            {!name.trim() && (
              <p style={{ margin: '8px 0 0', fontSize: 12.5, color: 'var(--color-label-alternative)', fontWeight: 500 }}>
                이름을 입력해야 평가에 참여할 수 있어요.
              </p>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <Btn variant="primary" size="xl" full color={PRIMARY} onClick={handleStart} disabled={!canStart} rightIcon="arrow-right">
          평가 시작하기
        </Btn>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{ width: '100%', marginTop: 12, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-label-alternative)', fontWeight: 600, fontSize: 14 }}>← 처음으로</button>
        </Link>
      </div>
    </PhonePage>
  );
}

function RateGroup({ group, criteria, commentsEnabled, anonymous, studentName, onBack, onSubmit, existing }: {
  group: typeof GROUPS[0];
  criteria: StoredCriterion[];
  commentsEnabled: boolean;
  anonymous: boolean;
  studentName: string;
  onBack: () => void;
  onSubmit: (p: GroupResult) => void;
  existing?: GroupResult;
}) {
  const c = getGroupColor(group.colorKey);
  const [scores, setScores] = useState<Record<string, number>>(existing?.scores || {});
  const [comment, setComment] = useState(existing?.comment || '');
  const setScore = (k: string, v: number) => setScores(s => ({ ...s, [k]: v }));
  const total = criteria.length;
  const ratedCount = criteria.filter(cr => scores[cr.key]).length;
  const allRated = ratedCount === total;
  const starters = ['이런 점이 멋졌어!', '다음에도 보고 싶어', '나도 배우고 싶었어'];

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--font-sans)', paddingTop: SAFE_TOP, paddingBottom: 28, boxSizing: 'border-box' }}>
      {/* 모둠 헤더 */}
      <div style={{ padding: '0 16px 16px', background: c.soft, paddingTop: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <button onClick={onBack} style={{ border: 'none', background: 'rgba(255,255,255,0.7)', width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="arrow-left" size={22} color={c.deep} />
          </button>
          {/* 익명이 아닐 때 평가자 프로필 표시 */}
          {!anonymous && studentName && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', borderRadius: 9999, background: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 700, color: c.deep }}>
              <Icon name="person-fill" size={14} color={c.deep} />
              {studentName}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ width: 56, height: 56, borderRadius: 18, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0, boxShadow: 'var(--shadow-emphasize)' }}>{group.emoji}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--color-label-strong)', letterSpacing: '-0.02em' }}>{group.name}</div>
            <div style={{ fontSize: 13, color: c.deep, fontWeight: 600, marginTop: 2 }}>{group.members.join(' · ')}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* 진행도 */}
        <div style={{ padding: '16px 0 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: 'var(--color-label-strong)' }}>기준별로 응원해줘</h2>
            <span style={{ fontSize: 13, fontWeight: 800, color: c.deep }}>{ratedCount}/{total}</span>
          </div>
          <Progress value={ratedCount} max={total} color={c.solid} height={8} />
        </div>

        {/* 기준별 이모지 평가 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
          {criteria.map((cr) => {
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
                  {face && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 28, padding: '0 10px', borderRadius: 9999, background: '#fff', color: c.deep, fontWeight: 800, fontSize: 12.5, flexShrink: 0 }}>{face.label} · {v}점</span>}
                </div>
                <EmojiPick value={v} onChange={(val) => setScore(cr.key, val)} color={c.solid} />
              </div>
            );
          })}
        </div>

        {/* 칭찬 댓글 — commentsEnabled일 때만 표시 */}
        {commentsEnabled && (
          <div style={{ padding: '20px 0 0' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 17, fontWeight: 800, color: 'var(--color-label-strong)' }}>
              따뜻한 한마디 <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-label-alternative)' }}>선택</span>
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {starters.map((s) => (
                <button key={s} onClick={() => setComment(comment ? comment : s + ' ')} style={{ height: 34, padding: '0 12px', borderRadius: 9999, cursor: 'pointer', border: '1px dashed var(--color-line-normal-normal)', background: 'var(--color-coolNeutral-99)', color: 'var(--color-label-neutral)', fontWeight: 600, fontSize: 13 }}>＋ {s}</button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="친구에게 칭찬을 적어줘 (없어도 괜찮아!)"
              rows={3}
              style={{ width: '100%', borderRadius: 16, border: '1.5px solid var(--color-line-normal-normal)', padding: 14, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 15.5, lineHeight: 1.5, color: 'var(--color-label-strong)', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
            />
          </div>
        )}

        <div style={{ marginTop: 18 }}>
          <Btn variant="primary" size="xl" full color={c.solid} onClick={() => onSubmit({ scores, comment })} disabled={!allRated} leftIcon="send">
            {allRated ? '칭찬 보내기' : `${total - ratedCount}개 기준이 남았어`}
          </Btn>
        </div>
      </div>
    </div>
  );
}

function StudentDone({ count }: { count: number }) {
  const [run, setRun] = useState(false);
  useEffect(() => { const id = setTimeout(() => setRun(true), 200); return () => clearTimeout(id); }, []);
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'linear-gradient(180deg, var(--color-violet-95), var(--color-blue-95))', fontFamily: 'var(--font-sans)', paddingTop: SAFE_TOP, boxSizing: 'border-box' }}>
      <Confetti run={run} />
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 36 }}>
        <Viewy size={160} mood="celebrate" primary={PRIMARY} />
        <h1 style={{ margin: '16px 0 0', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, letterSpacing: '-0.03em', color: 'var(--color-label-strong)' }}>다 했어! 멋지다 🎉</h1>
        <p style={{ margin: '12px 0 0', fontSize: 16.5, lineHeight: 1.6, color: 'var(--color-label-neutral)', maxWidth: 280 }}>{count}개 모둠 친구들에게 따뜻한 응원을 보냈어. 너의 칭찬이 친구들을 자라게 해 💛</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          {['💛', '⭐', '🌱'].map((e, i) => (
            <span key={i} style={{ width: 52, height: 52, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: 'var(--shadow-emphasize)' }}>{e}</span>
          ))}
        </div>
      </div>
      <div style={{ padding: '28px 24px', position: 'absolute', bottom: 16, left: 0, right: 0 }}>
        <Link href="/feedback" style={{ textDecoration: 'none' }}>
          <Btn variant="primary" size="xl" full color={PRIMARY} leftIcon="bubble-fill">친구들의 칭찬 보러 가기</Btn>
        </Link>
        <Link href="/results" style={{ textDecoration: 'none' }}>
          <button style={{ width: '100%', marginTop: 12, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-label-neutral)', fontWeight: 700, fontSize: 14.5 }}>우리 반 결과 보기 →</button>
        </Link>
      </div>
    </div>
  );
}

export default function EvaluateScreen() {
  const toRate = GROUPS.filter(g => g.id !== ME_GROUP);
  const [step, setStep] = useState<Step>('intro');
  const [active, setActive] = useState<typeof GROUPS[0] | null>(null);
  const [results, setResults] = useState<Record<string, GroupResult>>({});
  const [studentName, setStudentName] = useState('');
  const [criteria, setCriteria] = useState<StoredCriterion[]>([]);
  const [settings, setSettings] = useState<ActivitySettings | null>(null);

  useEffect(() => {
    setCriteria(loadCriteria());
    setSettings(loadActivitySettings());
  }, []);

  const doneCount = Object.keys(results).length;
  const allDone = doneCount >= toRate.length;

  const openGroup = (g: typeof GROUPS[0]) => { setActive(g); setStep('rate'); };
  const submitGroup = (groupId: string, payload: GroupResult) => {
    setResults(r => ({ ...r, [groupId]: payload }));
    setStep('list');
  };

  if (!settings || criteria.length === 0) return null;

  if (step === 'intro') {
    return (
      <StudentIntro
        criteriaCount={criteria.length}
        anonymous={settings.anonymous}
        onStart={(name) => { setStudentName(name); setStep('list'); }}
      />
    );
  }

  if (step === 'rate' && active) {
    return (
      <RateGroup
        group={active}
        criteria={criteria}
        commentsEnabled={settings.commentsEnabled}
        anonymous={settings.anonymous}
        studentName={studentName}
        onBack={() => setStep('list')}
        onSubmit={(p) => submitGroup(active.id, p)}
        existing={results[active.id]}
      />
    );
  }

  if (allDone && step === 'list') return <StudentDone count={toRate.length} />;

  return (
    <PhonePage bg="var(--color-coolNeutral-99)">
      <div style={{ paddingTop: 6, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-label-alternative)' }}>{ACTIVITY.subject}</span>
          <Pill size="sm" color="var(--color-blue-40)" bg="var(--color-blue-95)">{doneCount}/{toRate.length} 완료</Pill>
        </div>
        <h1 style={{ margin: '0 0 4px', fontSize: 23, fontWeight: 800, color: 'var(--color-label-strong)', letterSpacing: '-0.02em' }}>친구들 발표 어땠어?</h1>
        <p style={{ margin: '0 0 12px', fontSize: 14.5, color: 'var(--color-label-neutral)' }}>모둠을 눌러서 응원을 보내줘! 💛</p>
        <Progress value={doneCount} max={toRate.length} color={PRIMARY} height={12} />
      </div>

      {/* 익명이 아닐 때 현재 평가자 표시 */}
      {!settings.anonymous && studentName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 14, background: 'var(--color-blue-95)', marginBottom: 14 }}>
          <Icon name="person-fill" size={16} color="var(--color-blue-40)" />
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-blue-40)' }}>{studentName}</span>
          <span style={{ fontSize: 13, color: 'var(--color-label-alternative)', fontWeight: 500 }}>으로 참여 중</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {toRate.map((g) => {
          const c = getGroupColor(g.colorKey);
          const isDone = !!results[g.id];
          return (
            <button key={g.id} onClick={() => openGroup(g)} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 20, cursor: 'pointer', textAlign: 'left',
              border: `1.5px solid ${isDone ? c.solid : 'var(--color-line-normal-neutral)'}`,
              background: isDone ? c.tint : '#fff', transition: 'all .15s', width: '100%', boxShadow: 'var(--shadow-emphasize)',
            }}>
              <span style={{ width: 54, height: 54, borderRadius: 16, background: c.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>{g.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-label-strong)' }}>{g.name}</div>
                <div style={{ fontSize: 13, color: 'var(--color-label-alternative)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.members.join(' · ')}</div>
              </div>
              {isDone
                ? <Icon name="circle-check-fill" size={26} color={c.solid} />
                : <span style={{ width: 40, height: 40, borderRadius: '50%', background: c.soft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="chevron-right" size={22} color={c.deep} /></span>
              }
            </button>
          );
        })}
      </div>

      {doneCount > 0 && (
        <div style={{ marginTop: 20 }}>
          <Btn variant="primary" size="lg" full color={PRIMARY} onClick={() => setStep('done')} rightIcon="arrow-right">
            {allDone ? '완료하고 칭찬 보기' : '여기까지 제출하기'}
          </Btn>
        </div>
      )}
    </PhonePage>
  );
}
