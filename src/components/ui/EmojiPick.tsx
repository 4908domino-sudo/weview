'use client';

import { EMOJI_SCALE } from '@/lib/data';

interface EmojiPickProps {
  value?: number;
  onChange?: (v: number) => void;
  color?: string;
}

export default function EmojiPick({ value = 0, onChange, color = 'var(--color-primary-normal)' }: EmojiPickProps) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {EMOJI_SCALE.map((it) => {
        const on = it.v === value;
        return (
          <button
            key={it.v}
            type="button"
            onClick={() => onChange?.(it.v)}
            title={`${it.label} · ${it.v}점`}
            style={{
              flex: 1, height: 52, borderRadius: 14, cursor: 'pointer',
              border: on ? `2px solid ${color}` : '2px solid var(--color-line-normal-neutral)',
              background: on ? color : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: on ? 'translateY(-2px) scale(1.05)' : 'none',
              boxShadow: on ? 'var(--shadow-emphasize)' : 'none', transition: 'all .14s ease-out',
            }}
          >
            <span style={{ fontSize: 25, lineHeight: 1, filter: on ? 'none' : 'grayscale(0.4)', opacity: on ? 1 : 0.6 }}>{it.e}</span>
          </button>
        );
      })}
    </div>
  );
}
