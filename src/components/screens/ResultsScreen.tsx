'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TeacherShell from './TeacherShell';
import { ACTIVITY, GROUPS, COMMENTS, groupAvg, getGroupColor, emojiFor } from '@/lib/data';
import { loadCriteria, mockScoreForCriterion, type StoredCriterion } from '@/lib/activityStore';
import Btn from '@/components/ui/Btn';
import Card from '@/components/ui/Card';
import Pill from '@/components/ui/Pill';
import Progress from '@/components/ui/Progress';
import Segmented from '@/components/ui/Segmented';
import Icon from '@/components/ui/Icon';

const PRIMARY = 'var(--color-blue-50)';

function topCrit(scores: Record<string, number>) {
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

function Radar({ scores, criteria, color, size = 150 }: {
  scores: Record<string, number>; criteria: StoredCriterion[]; color: string; size?: number;
}) {
  const cx = size / 2, cy = size / 2, R = size * 0.36;
  const n = criteria.length;
  if (n < 3) return null;
  const ang = (i: number) => (2 * Math.PI / n) * i - Math.PI / 2;
  const pt = (i: number, r: number): [number, number] => [cx + Math.cos(ang(i)) * r, cy + Math.sin(ang(i)) * r];
  const poly = criteria.map((cr, i) => pt(i, ((scores[cr.key] ?? 0) / 5) * R).join(',')).join(' ');
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.33, 0.66, 1].map((f, ri) => (
        <polygon key={ri} points={criteria.map((_, j) => pt(j, R * f).join(',')).join(' ')} fill="none" stroke="var(--color-line-normal-normal)" strokeWidth="1" />
      ))}
      {criteria.map((_, i) => { const [x, y] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--color-line-normal-neutral)" strokeWidth="1" />; })}
      <polygon points={poly} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      {criteria.map((cr, i) => { const [x, y] = pt(i, ((scores[cr.key] ?? 0) / 5) * R); return <circle key={cr.key} cx={x} cy={y} r="3.5" fill={color} />; })}
      {criteria.map((cr, i) => {
        const [x, y] = pt(i, R + 14);
        const label = cr.label.length > 4 ? cr.label.slice(0, 4) + '…' : cr.label;
        return <text key={cr.key} x={x} y={y + 4} textAnchor="middle" style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, fill: 'var(--color-label-alternative)' }}>{label}</text>;
      })}
    </svg>
  );
}

function BarsViz({ scores, criteria, color }: { scores: Record<string, number>; criteria: StoredCriterion[]; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', padding: '4px 0' }}>
      {criteria.map((cr) => (
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
  scores: Record<string, number>; criteria: StoredCriterion[]; color: string; deep: string; soft: string;
}) {
  const top = topCrit(scores);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '4px 0' }}>
      {criteria.map((cr) => {
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

export default function ResultsScreen() {
  const vizOptions = [{ value: 'radar', label: '레이더' }, { value: 'bars', label: '막대' }, { value: 'badges', label: '배지' }];
  const [viz, setViz] = useState('radar');
  const [criteria, setCriteria] = useState<StoredCriterion[]>([]);

  useEffect(() => { setCriteria(loadCriteria()); }, []);

  if (criteria.length === 0) return null; // hydration guard

  // Build per-group scores for all criteria (uses mock for custom criteria)
  const groupsWithScores = GROUPS.map(g => ({
    ...g,
    allScores: Object.fromEntries(criteria.map(cr => [cr.key, mockScoreForCriterion(g.id, cr.key)])),
  }));

  const avgAll = groupsWithScores.reduce((a, g) => a + groupAvg(g), 0) / groupsWithScores.length;

  // Build superlative lookup from criteria
  const superlativeMap = Object.fromEntries(criteria.map(cr => [cr.key, { t: cr.superlativeTitle, e: cr.superlativeEmoji }]));

  return (
    <TeacherShell active="results" wide>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22, gap: 16 }}>
        <div style={{ minWidth: 0 }}>
          <Pill icon="circle-check-fill" color="var(--color-green-40)" bg="var(--color-green-95)" style={{ marginBottom: 10 }}>모두 참여 완료 · 22/22명</Pill>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, letterSpacing: '-0.03em', color: 'var(--color-label-strong)' }}>🎉 {ACTIVITY.title}</h1>
          <p style={{ margin: '6px 0 0', fontSize: 15, color: 'var(--color-label-neutral)' }}>{ACTIVITY.subject} · {ACTIVITY.date} · 모든 모둠이 저마다의 빛을 냈어요.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          <Segmented options={vizOptions} value={viz} onChange={setViz} color={PRIMARY} />
          <Btn variant="outline" size="sm" leftIcon="download">결과 내보내기</Btn>
        </div>
      </div>

      {/* 평가 기준 & 타이틀 요약 */}
      <Card pad={16} radius={18} style={{ marginBottom: 24, background: 'var(--color-coolNeutral-99)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Icon name="sparkle-fill" size={16} color="var(--color-violet-50)" />
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-label-alternative)' }}>이번 활동의 평가 기준 · 기준별 타이틀</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {criteria.map(cr => (
            <span key={cr.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 12px', borderRadius: 9999, background: '#fff', border: '1px solid var(--color-line-normal-neutral)', fontSize: 13, fontWeight: 700, color: 'var(--color-label-neutral)' }}>
              <Icon name={cr.icon} size={13} />
              {cr.label}
              <span style={{ color: 'var(--color-label-assistive)', fontWeight: 600 }}>→</span>
              <span style={{ color: 'var(--color-violet-40)' }}>{cr.superlativeEmoji} {cr.superlativeTitle}</span>
            </span>
          ))}
        </div>
      </Card>

      {/* summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 26 }}>
        {[
          { icon: 'star-fill',   color: 'var(--color-orange-50)', bg: 'var(--color-orange-95)', num: avgAll.toFixed(1),          label: '우리 반 평균 점수' },
          { icon: 'bubble-fill', color: 'var(--color-violet-50)', bg: 'var(--color-violet-95)', num: COMMENTS.length * 11,       label: '나눈 칭찬 댓글' },
          { icon: 'heart-fill',  color: 'var(--color-pink-50)',   bg: 'var(--color-pink-95)',   num: '100%',                     label: '서로를 응원한 비율' },
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

      {/* group result cards */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '0 0 14px' }}>
        <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: 'var(--color-label-strong)' }}>모든 모둠이 빛났어요 ✨</h3>
        <span style={{ fontSize: 13, color: 'var(--color-label-alternative)', fontWeight: 600 }}>종합 점수 순 · 기준별 타이틀</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }}>
        {[...groupsWithScores].sort((a, b) => groupAvg(b) - groupAvg(a)).map((g, i) => {
          const c = getGroupColor(g.colorKey);
          const top = topCrit(g.allScores);
          const sup = superlativeMap[top] ?? { t: '멋진왕', e: '🏆' };
          const avg = groupAvg(g);
          const medal = ['🥇', '🥈', '🥉'][i];
          return (
            <Card key={g.id} pad={20} radius={24} accent={c.solid}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: medal ? 19 : 14, fontWeight: 800, background: medal ? 'var(--color-orange-95)' : 'var(--color-coolNeutral-98)', color: 'var(--color-label-neutral)' }}>{medal || (i + 1)}</span>
                <span style={{ width: 46, height: 46, borderRadius: 14, background: c.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 25, flexShrink: 0 }}>{g.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-label-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                    <span style={{ fontSize: 16, lineHeight: 1 }}>{emojiFor(avg).e}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: c.deep }}>{avg.toFixed(1)}점</span>
                  </div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 32, padding: '0 10px', borderRadius: 9999, background: c.soft, color: c.deep, fontWeight: 800, fontSize: 13, flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {sup.e} {sup.t}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: viz === 'radar' ? 160 : 'auto' }}>
                {viz === 'radar'  && <Radar scores={g.allScores} criteria={criteria} color={c.solid} />}
                {viz === 'bars'   && <BarsViz scores={g.allScores} criteria={criteria} color={c.solid} />}
                {viz === 'badges' && <BadgesViz scores={g.allScores} criteria={criteria} color={c.solid} deep={c.deep} soft={c.soft} />}
              </div>
            </Card>
          );
        })}
      </div>

      {/* comment highlights */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: 'var(--color-label-strong)' }}>오늘의 따뜻한 한마디 💬</h3>
        <Link href="/feedback" style={{ textDecoration: 'none' }}>
          <Btn variant="ghost" size="sm" rightIcon="arrow-right">피드백 월에서 모두 보기</Btn>
        </Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {COMMENTS.slice(0, 4).map((cm) => {
          const g = GROUPS.find(x => x.id === cm.group)!;
          const c = getGroupColor(g.colorKey);
          return (
            <Card key={cm.id} pad={18} radius={20} style={{ display: 'flex', gap: 12 }}>
              <span style={{ width: 40, height: 40, borderRadius: 12, background: c.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{g.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--color-label-strong)' }}>{g.name}에게</span>
                  <Pill size="sm" color={c.deep} bg={c.soft}>{cm.tag}</Pill>
                </div>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: 'var(--color-label-normal)' }}>{cm.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                  <Icon name="heart-fill" size={15} color="var(--color-pink-50)" />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-label-alternative)' }}>{cm.likes}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </TeacherShell>
  );
}
