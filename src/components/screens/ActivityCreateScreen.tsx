'use client';

// Design Ref: §5.1 활동 만들기 화면 — API 연동, 실제 QR 생성

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TeacherShell from './TeacherShell';
import { EMOJI_SCALE, GROUP_COLORS } from '@/lib/data';
import { DEFAULT_CRITERIA, type StoredCriterion } from '@/lib/activityStore';
import type { CreateSessionResponse } from '@/types/session';
import Btn from '@/components/ui/Btn';
import Card from '@/components/ui/Card';
import Pill from '@/components/ui/Pill';
import Switch from '@/components/ui/Switch';
import Icon from '@/components/ui/Icon';
import QRCodeDisplay from '@/components/ui/QRCodeDisplay';

const PRIMARY = 'var(--color-blue-50)';

const emojis = ['🌻', '🌊', '🌳', '⭐', '🌸', '🍀', '🦋', '🐬', '🚀', '🎨'];
const colorKeys = ['orange', 'blue', 'green', 'violet', 'pink', 'cyan'] as const;

const QUICK_CRITERIA = [
  { label: '표현력',    desc: '생각을 명확하게 표현했나요?',     icon: 'sparkle',    superlativeTitle: '표현왕',  superlativeEmoji: '🎨' },
  { label: '준비성',    desc: '발표를 꼼꼼히 준비했나요?',       icon: 'document',   superlativeTitle: '준비왕',  superlativeEmoji: '📋' },
  { label: '자료 활용', desc: '자료를 잘 활용했나요?',           icon: 'image',      superlativeTitle: '자료왕',  superlativeEmoji: '📊' },
  { label: '시간 관리', desc: '정해진 시간 안에 잘 마쳤나요?',   icon: 'clock',      superlativeTitle: '시간왕',  superlativeEmoji: '⏱️' },
  { label: '질문 응답', desc: '친구들 질문에 잘 답했나요?',       icon: 'bubble',     superlativeTitle: '소통왕',  superlativeEmoji: '💬' },
];

const ICON_OPTIONS = [
  'star', 'heart', 'sparkle', 'document', 'microphone',
  'persons', 'crown', 'fire', 'globe', 'camera', 'clock', 'bubble',
];

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-label-strong)' }}>{children}</span>
      {hint && <span style={{ marginLeft: 8, fontSize: 13, color: 'var(--color-label-alternative)', fontWeight: 500 }}>{hint}</span>}
    </div>
  );
}

// ── LaunchModal — 실제 QR 코드 + 세션 코드 표시 ──────────────────
function LaunchModal({ sessionId, joinUrl, title, onClose, onPreview }: {
  sessionId: string;
  joinUrl: string;
  title: string;
  onClose: () => void;
  onPreview: () => void;
}) {
  const shortCode = sessionId.slice(0, 8).toUpperCase();

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--color-material-dimmer)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 32, padding: '36px 36px 32px', width: 480, maxWidth: '100%', textAlign: 'center', boxShadow: 'var(--shadow-heavy)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, border: 'none', background: 'var(--color-coolNeutral-98)', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="close" size={20} />
        </button>

        <Pill icon="circle-check-fill" color="var(--color-green-40)" bg="var(--color-green-95)" style={{ marginBottom: 16 }}>활동이 시작됐어요!</Pill>
        <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: 'var(--color-label-strong)', letterSpacing: '-0.02em' }}>{title}</h2>
        <p style={{ margin: '0 0 22px', fontSize: 14.5, color: 'var(--color-label-neutral)' }}>학생들에게 QR 코드를 보여주세요</p>

        {/* 실제 QR 코드 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <QRCodeDisplay url={joinUrl} size={180} />
        </div>

        {/* 참여 코드 + URL */}
        <div style={{ background: 'var(--color-coolNeutral-99)', borderRadius: 16, padding: '14px 20px', marginBottom: 20, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12.5, color: 'var(--color-label-alternative)', fontWeight: 600 }}>QR이 안 될 때 입력할 코드</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 20, letterSpacing: '0.08em', color: PRIMARY }}>{shortCode}</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-label-assistive)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{joinUrl}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Btn variant="primary" size="lg" full color={PRIMARY} onClick={onPreview} rightIcon="arrow-right">실시간 결과 보기</Btn>
          <Btn variant="soft" size="md" full onClick={onClose}>활동 설정 돌아가기</Btn>
        </div>
      </div>
    </div>
  );
}

// ── 커스텀 기준 추가 폼 ──────────────────────────────────────────
interface CustomCriterionFormProps {
  onAdd: (c: StoredCriterion) => void;
  onCancel: () => void;
  existingLabels: string[];
}

function CustomCriterionForm({ onAdd, onCancel, existingLabels }: CustomCriterionFormProps) {
  const [label, setLabel] = useState('');
  const [desc, setDesc] = useState('');
  const [superlativeTitle, setSuperlativeTitle] = useState('');
  const [superlativeEmoji, setSuperlativeEmoji] = useState('🏆');
  const [icon, setIcon] = useState('star');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!label.trim()) e.label = '기준명을 입력해주세요';
    if (existingLabels.includes(label.trim())) e.label = '이미 있는 기준이에요';
    if (!superlativeTitle.trim()) e.superlativeTitle = '타이틀을 입력해주세요';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    onAdd({
      key: `custom_${Date.now()}`,
      label: label.trim(),
      desc: desc.trim() || `${label.trim()}이(가) 잘 드러났나요?`,
      icon,
      superlativeTitle: superlativeTitle.trim(),
      superlativeEmoji,
    });
  };

  const inputStyle = (error?: string) => ({
    width: '100%', height: 44, padding: '0 14px', borderRadius: 12,
    border: `1.5px solid ${error ? 'var(--color-status-destructive)' : 'var(--color-line-normal-normal)'}`,
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15,
    color: 'var(--color-label-strong)', outline: 'none', boxSizing: 'border-box' as const,
  });

  const EMOJI_OPTIONS = ['🏆', '⭐', '🎯', '💡', '🌟', '🔥', '👑', '🎨', '📣', '💬', '🤝', '🔎'];

  return (
    <div style={{ marginTop: 16, padding: 20, borderRadius: 18, border: '2px solid var(--color-violet-50)', background: 'var(--color-violet-99)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Icon name="sparkle-fill" size={18} color="var(--color-violet-50)" />
        <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--color-violet-40)' }}>나만의 기준 만들기</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-label-alternative)', marginBottom: 6 }}>기준명 *</label>
          <input value={label} onChange={e => { setLabel(e.target.value); setErrors({}); }} placeholder="예: 표현력" style={inputStyle(errors.label)} />
          {errors.label && <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-status-destructive)', fontWeight: 600 }}>{errors.label}</p>}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-label-alternative)', marginBottom: 6 }}>설명</label>
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="예: 생각을 명확하게 표현했나요?" style={inputStyle()} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-label-alternative)', marginBottom: 6 }}>점수가 높을 때 타이틀 *</label>
          <input value={superlativeTitle} onChange={e => { setSuperlativeTitle(e.target.value); setErrors({}); }} placeholder="예: 표현왕" style={inputStyle(errors.superlativeTitle)} />
          {errors.superlativeTitle && <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-status-destructive)', fontWeight: 600 }}>{errors.superlativeTitle}</p>}
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-label-alternative)', marginBottom: 6 }}>이모지</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
            {EMOJI_OPTIONS.map(em => (
              <button key={em} type="button" onClick={() => setSuperlativeEmoji(em)}
                style={{ width: 36, height: 36, borderRadius: 10, border: `2px solid ${superlativeEmoji === em ? 'var(--color-violet-50)' : 'transparent'}`, background: superlativeEmoji === em ? 'var(--color-violet-95)' : 'transparent', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {em}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-label-alternative)', marginBottom: 8 }}>아이콘</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {ICON_OPTIONS.map(ic => (
            <button key={ic} type="button" onClick={() => setIcon(ic)}
              style={{ width: 40, height: 40, borderRadius: 11, border: `2px solid ${icon === ic ? 'var(--color-violet-50)' : 'var(--color-line-normal-neutral)'}`, background: icon === ic ? 'var(--color-violet-95)' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .12s' }}>
              <Icon name={ic} size={18} color={icon === ic ? 'var(--color-violet-50)' : 'var(--color-label-alternative)'} />
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Btn variant="ghost" size="sm" onClick={onCancel}>취소</Btn>
        <Btn variant="primary" size="sm" color="var(--color-violet-50)" onClick={handleAdd} leftIcon="plus">기준 추가</Btn>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────
export default function ActivityCreateScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('우리 동네 환경 지키기');
  const [groups, setGroups] = useState([
    { name: '햇살팀', emoji: '🌻', colorKey: 'orange' as string },
    { name: '바다팀', emoji: '🌊', colorKey: 'blue'   as string },
    { name: '숲속팀', emoji: '🌳', colorKey: 'green'  as string },
    { name: '별빛팀', emoji: '⭐', colorKey: 'violet' as string },
    { name: '꽃잎팀', emoji: '🌸', colorKey: 'pink'   as string },
  ]);
  const [criteria, setCriteria] = useState<StoredCriterion[]>(DEFAULT_CRITERIA);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [comments, setComments] = useState(true);
  const [anon, setAnon] = useState(true);
  const [loading, setLoading] = useState(false);
  const [launchData, setLaunchData] = useState<CreateSessionResponse | null>(null);
  const [launchError, setLaunchError] = useState('');

  const addGroup = () => {
    const i = groups.length;
    setGroups([...groups, { name: `${i + 1}모둠`, emoji: emojis[i % emojis.length], colorKey: colorKeys[i % colorKeys.length] }]);
  };
  const removeGroup = (i: number) => setGroups(groups.filter((_, x) => x !== i));
  const setGroupName = (i: number, v: string) => setGroups(groups.map((g, x) => x === i ? { ...g, name: v } : g));

  const removeCriterion = (key: string) => setCriteria(criteria.filter(c => c.key !== key));
  const addQuickCriterion = (q: typeof QUICK_CRITERIA[0]) => {
    if (criteria.some(c => c.label === q.label)) return;
    setCriteria([...criteria, { key: `quick_${q.label}`, ...q }]);
  };
  const addCustomCriterion = (c: StoredCriterion) => { setCriteria([...criteria, c]); setShowCustomForm(false); };

  // Plan SC: 선생님 3분 내 활동 생성
  const handleLaunch = async () => {
    setLaunchError('');
    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        criteria,
        settings: { commentsEnabled: comments, anonymous: anon },
        groups: groups.map((g, i) => ({
          id: `g${i + 1}`,
          name: g.name,
          emoji: g.emoji,
          colorKey: g.colorKey,
          members: [],
        })),
      };

      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message || '세션 생성에 실패했어요.');
      }

      const data: CreateSessionResponse = await res.json();
      setLaunchData(data);
    } catch (err) {
      setLaunchError(err instanceof Error ? err.message : '오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeacherShell active="create">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <button onClick={() => router.push('/activities/new')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'inline-flex', color: 'var(--color-label-alternative)' }}>
          <Icon name="arrow-left" size={22} />
        </button>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em', color: 'var(--color-label-strong)' }}>새 평가 활동 만들기</h1>
      </div>
      <p style={{ margin: '0 0 24px 34px', fontSize: 15, color: 'var(--color-label-neutral)' }}>수업 중 3분이면 충분해요. 모둠과 기준만 정하면 끝!</p>

      {/* 활동 이름 */}
      <Card pad={24} radius={20} style={{ marginBottom: 16 }}>
        <FieldLabel hint="발표 주제를 적어주세요">활동 이름</FieldLabel>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="예: 우리 동네 환경 지키기"
          style={{ width: '100%', height: 52, padding: '0 16px', borderRadius: 14, border: '1.5px solid var(--color-line-normal-normal)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17, color: 'var(--color-label-strong)', outline: 'none', boxSizing: 'border-box' }}
        />
      </Card>

      {/* 모둠 만들기 */}
      <Card pad={24} radius={20} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <FieldLabel hint={`${groups.length}개 모둠`}>모둠 만들기</FieldLabel>
          <Pill size="sm" color="var(--color-label-neutral)" bg="var(--color-coolNeutral-98)" icon="persons">발표 모둠</Pill>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {groups.map((g, i) => {
            const c = GROUP_COLORS.find(x => x.key === g.colorKey) || GROUP_COLORS[0];
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px 8px 12px', borderRadius: 14, border: '1.5px solid var(--color-line-normal-neutral)', background: c.tint }}>
                <span style={{ fontSize: 22 }}>{g.emoji}</span>
                <input value={g.name} onChange={e => setGroupName(i, e.target.value)}
                  style={{ flex: 1, minWidth: 0, height: 40, border: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, color: c.deep, outline: 'none' }} />
                <button onClick={() => removeGroup(i)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'inline-flex', color: 'var(--color-label-assistive)' }}>
                  <Icon name="close" size={18} />
                </button>
              </div>
            );
          })}
          <button onClick={addGroup} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 58, borderRadius: 14, border: '1.5px dashed var(--color-line-normal-normal)', background: 'transparent', cursor: 'pointer', color: 'var(--color-label-neutral)', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15 }}>
            <Icon name="plus" size={20} />모둠 추가
          </button>
        </div>
      </Card>

      {/* 평가 기준 */}
      <Card pad={24} radius={20} style={{ marginBottom: 16 }}>
        <FieldLabel hint="이런 점을 칭찬해요">평가 기준</FieldLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          {criteria.map((c) => (
            <span key={c.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 40, padding: '0 8px 0 12px', borderRadius: 9999, background: 'var(--color-violet-95)', color: 'var(--color-violet-40)', fontWeight: 700, fontSize: 14 }}>
              <Icon name={c.icon} size={14} color="var(--color-violet-50)" />{c.label}
              <button onClick={() => removeCriterion(c.key)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'inline-flex', color: 'var(--color-violet-40)', opacity: 0.6 }}>
                <Icon name="close" size={16} />
              </button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
          {QUICK_CRITERIA.filter(q => !criteria.some(c => c.label === q.label)).map((q) => (
            <button key={q.label} onClick={() => addQuickCriterion(q)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 32, padding: '0 12px', borderRadius: 9999, border: '1px dashed var(--color-line-normal-normal)', background: 'transparent', cursor: 'pointer', color: 'var(--color-label-alternative)', fontWeight: 600, fontSize: 13 }}>
              <Icon name="plus" size={14} />{q.label}
            </button>
          ))}
          {!showCustomForm && (
            <button onClick={() => setShowCustomForm(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 32, padding: '0 14px', borderRadius: 9999, border: '1.5px solid var(--color-violet-50)', background: 'var(--color-violet-99)', cursor: 'pointer', color: 'var(--color-violet-40)', fontWeight: 700, fontSize: 13 }}>
              <Icon name="sparkle-fill" size={14} color="var(--color-violet-50)" />직접 만들기
            </button>
          )}
        </div>
        {showCustomForm && (
          <CustomCriterionForm onAdd={addCustomCriterion} onCancel={() => setShowCustomForm(false)} existingLabels={criteria.map(c => c.label)} />
        )}
        {criteria.length > 0 && (
          <div style={{ marginTop: 18, padding: '14px 16px', borderRadius: 14, background: 'var(--color-coolNeutral-99)' }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-label-alternative)', marginBottom: 10 }}>점수가 가장 높을 때 받는 타이틀</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {criteria.map(c => (
                <span key={c.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 28, padding: '0 10px', borderRadius: 9999, background: '#fff', border: '1px solid var(--color-line-normal-neutral)', fontSize: 13, fontWeight: 700, color: 'var(--color-label-neutral)' }}>
                  {c.superlativeEmoji} {c.superlativeTitle}
                </span>
              ))}
            </div>
          </div>
        )}
        <div style={{ marginTop: 14, padding: '14px 16px', borderRadius: 14, background: 'var(--color-coolNeutral-99)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--color-label-strong)' }}>학생은 기준마다 이모지로 점수를 줘요</div>
            <div style={{ fontSize: 12.5, color: 'var(--color-label-alternative)', marginTop: 2 }}>이모지 하나가 1~5점이에요. 기준별 점수가 따로 모여요.</div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {EMOJI_SCALE.map((it) => (
              <span key={it.v} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: 20 }}>{it.e}</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-label-assistive)' }}>{it.v}</span>
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* 옵션 */}
      <Card pad={8} radius={20} style={{ marginBottom: 28 }}>
        {[
          { on: comments, set: setComments, icon: 'bubble-fill', title: '칭찬 댓글 받기', desc: '친구에게 따뜻한 한마디를 남길 수 있어요.' },
          { on: anon,     set: setAnon,     icon: 'eye-slash',   title: '익명으로 평가',  desc: '누가 평가했는지 보이지 않아 편하게 참여해요.' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderBottom: i === 0 ? '1px solid var(--color-line-normal-neutral)' : 'none' }}>
            <span style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--color-coolNeutral-98)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={r.icon} size={20} color="var(--color-label-neutral)" />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15.5, color: 'var(--color-label-strong)' }}>{r.title}</div>
              <div style={{ fontSize: 13, color: 'var(--color-label-alternative)', marginTop: 2 }}>{r.desc}</div>
            </div>
            <Switch on={r.on} onChange={r.set} color={PRIMARY} />
          </div>
        ))}
      </Card>

      {/* 에러 */}
      {launchError && (
        <div style={{ marginBottom: 16, padding: '14px 16px', borderRadius: 14, background: 'var(--color-red-95)', color: 'var(--color-red-40)', fontWeight: 700, fontSize: 14 }}>
          {launchError}
        </div>
      )}

      {/* 하단 CTA */}
      <div style={{ position: 'sticky', bottom: 0, display: 'flex', gap: 12, justifyContent: 'flex-end', padding: '16px 0', background: 'linear-gradient(180deg, transparent, var(--color-coolNeutral-99) 40%)' }}>
        <Btn variant="outline" size="lg" onClick={() => router.push('/dashboard')}>취소</Btn>
        <Btn variant="primary" size="lg" color={PRIMARY} onClick={handleLaunch} disabled={loading || !title.trim() || groups.length < 2} leftIcon="camera">
          {loading ? '활동 만드는 중...' : '활동 시작하기'}
        </Btn>
      </div>

      {/* 실제 QR 모달 */}
      {launchData && (
        <LaunchModal
          sessionId={launchData.sessionId}
          joinUrl={launchData.joinUrl}
          title={title}
          onClose={() => setLaunchData(null)}
          onPreview={() => router.push(`/results/${launchData.sessionId}`)}
        />
      )}
    </TeacherShell>
  );
}
