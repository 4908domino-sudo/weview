'use client';

import { useState } from 'react';
import Icon from './Icon';

interface StarRatingProps {
  value?: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
  color?: string;
}

export default function StarRating({ value = 0, onChange, size = 48, readOnly = false, color = 'var(--color-orange-50)' }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div style={{ display: 'flex', gap: size * 0.12 }} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= shown;
        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onMouseEnter={() => !readOnly && setHover(n)}
            onClick={() => !readOnly && onChange?.(n)}
            style={{
              border: 'none', background: 'transparent', padding: 0, cursor: readOnly ? 'default' : 'pointer',
              transform: on ? 'scale(1)' : 'scale(0.92)', transition: 'transform .14s cubic-bezier(.34,1.56,.64,1)', lineHeight: 0,
            }}
          >
            <Icon name={on ? 'star-fill' : 'star'} size={size} color={on ? color : 'var(--color-line-normal-normal)'} />
          </button>
        );
      })}
    </div>
  );
}
