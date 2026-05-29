'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { COMMENTS, GROUPS, getGroupColor } from '@/lib/data';
import Pill from '@/components/ui/Pill';
import StarRating from '@/components/ui/StarRating';
import Icon from '@/components/ui/Icon';

const PRIMARY = 'var(--color-blue-50)';
const SAFE_TOP = 52;
const MINE_GROUP = 'g1';

function HeartBtn({ count }: { count: number }) {
  const [liked, setLiked] = useState(false);
  return (
    <button onClick={() => setLiked(!liked)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: liked ? 'var(--color-pink-50)' : 'var(--color-label-alternative)' }}>
      <Icon name={liked ? 'heart-fill' : 'heart'} size={18} color={liked ? 'var(--color-pink-50)' : 'var(--color-label-assistive)'} />
      <span style={{ fontSize: 12.5, fontWeight: 700 }}>{count + (liked ? 1 : 0)}</span>
    </button>
  );
}

function BubbleLayout({ list }: { list: typeof COMMENTS }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {list.map((cm) => {
        const to = GROUPS.find(g => g.id === cm.group)!;
        const c = getGroupColor(to.colorKey);
        return (
          <div key={cm.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <span style={{ width: 40, height: 40, borderRadius: '50%', background: c.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{to.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-label-alternative)', marginBottom: 4, marginLeft: 4 }}>{cm.from} → <span style={{ color: c.deep }}>{to.name}</span></div>
              <div style={{ position: 'relative', background: '#fff', borderRadius: '4px 18px 18px 18px', padding: '14px 16px', boxShadow: 'var(--shadow-emphasize)', borderLeft: `3px solid ${c.solid}` }}>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: 'var(--color-label-normal)' }}>{cm.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}><StarRating value={cm.stars} readOnly size={15} /></span>
                  <HeartBtn count={cm.likes} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MasonryLayout({ list }: { list: typeof COMMENTS }) {
  return (
    <div style={{ columnCount: 2, columnGap: 12 }}>
      {list.map((cm) => {
        const to = GROUPS.find(g => g.id === cm.group)!;
        const c = getGroupColor(to.colorKey);
        return (
          <div key={cm.id} style={{ breakInside: 'avoid', marginBottom: 12, background: c.tint, borderRadius: 18, padding: 14, border: `1.5px solid ${c.soft}`, boxShadow: 'var(--shadow-emphasize)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{to.emoji}</span>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: c.deep }}>{to.name}</span>
            </div>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.5, color: 'var(--color-label-normal)' }}>{cm.text}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
              <Pill size="sm" color={c.deep} bg="#fff">{cm.tag}</Pill>
              <HeartBtn count={cm.likes} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FeedLayout({ list }: { list: typeof COMMENTS }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {list.map((cm) => {
        const to = GROUPS.find(g => g.id === cm.group)!;
        const c = getGroupColor(to.colorKey);
        return (
          <div key={cm.id} style={{ background: '#fff', borderRadius: 20, padding: 16, boxShadow: 'var(--shadow-emphasize)', border: '1px solid var(--color-line-normal-neutral)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ width: 42, height: 42, borderRadius: '50%', background: c.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21 }}>{to.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: 'var(--color-label-strong)' }}>{cm.from}</div>
                <div style={{ fontSize: 12, color: 'var(--color-label-alternative)' }}>{to.name}에게 · 방금 전</div>
              </div>
              <Pill size="sm" color={c.deep} bg={c.soft}>{cm.tag}</Pill>
            </div>
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.55, color: 'var(--color-label-normal)' }}>{cm.text}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-line-normal-neutral)' }}>
              <StarRating value={cm.stars} readOnly size={16} />
              <HeartBtn count={cm.likes} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FeedbackScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'all' | 'mine'>('all');
  const [layout, setLayout] = useState<'bubbles' | 'masonry' | 'feed'>('bubbles');
  const list = tab === 'mine' ? COMMENTS.filter(c => c.group === MINE_GROUP) : COMMENTS;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-coolNeutral-99)', fontFamily: 'var(--font-sans)', paddingTop: SAFE_TOP, paddingBottom: 28, boxSizing: 'border-box' }}>
      {/* header */}
      <div style={{ padding: '6px 20px 14px', background: 'linear-gradient(180deg, var(--color-violet-95), var(--color-coolNeutral-99))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => router.back()} style={{ border: 'none', background: 'rgba(255,255,255,0.7)', width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="arrow-left" size={22} color="var(--color-violet-40)" />
          </button>
          <Pill icon="bubble-fill" color="var(--color-violet-40)" bg="#fff">{COMMENTS.length * 11}개의 칭찬</Pill>
        </div>
        <h1 style={{ margin: '12px 0 2px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', color: 'var(--color-label-strong)' }}>칭찬의 벽 💛</h1>
        <p style={{ margin: 0, fontSize: 14.5, color: 'var(--color-label-neutral)' }}>친구들이 남긴 따뜻한 응원을 읽어봐</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {([{ k: 'all', l: '전체' }, { k: 'mine', l: '우리 햇살팀 🌻' }] as const).map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{ height: 38, padding: '0 16px', borderRadius: 9999, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, border: 'none', background: tab === t.k ? 'var(--color-violet-50)' : '#fff', color: tab === t.k ? '#fff' : 'var(--color-label-neutral)', boxShadow: 'var(--shadow-emphasize)' }}>
              {t.l}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {(['bubbles', 'masonry', 'feed'] as const).map((l) => (
              <button key={l} onClick={() => setLayout(l)} style={{ height: 38, padding: '0 12px', borderRadius: 9999, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, border: 'none', background: layout === l ? 'var(--color-coolNeutral-30)' : '#fff', color: layout === l ? '#fff' : 'var(--color-label-alternative)', boxShadow: 'var(--shadow-emphasize)' }}>
                {l === 'bubbles' ? '말풍선' : l === 'masonry' ? '벽돌' : '피드'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        {layout === 'bubbles' && <BubbleLayout list={list} />}
        {layout === 'masonry' && <MasonryLayout list={list} />}
        {layout === 'feed' && <FeedLayout list={list} />}
      </div>
    </div>
  );
}
