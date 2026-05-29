'use client';

import { useState, CSSProperties } from 'react';

interface CardProps {
  children: React.ReactNode;
  pad?: number;
  radius?: number;
  style?: CSSProperties;
  hover?: boolean;
  onClick?: () => void;
  accent?: string;
}

export default function Card({ children, pad = 20, radius = 20, style = {}, hover = false, onClick, accent }: CardProps) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => hover && setH(false)}
      style={{
        background: 'var(--color-background-normal)', borderRadius: radius,
        border: '1px solid var(--color-line-normal-neutral)', padding: pad,
        boxShadow: h ? 'var(--shadow-strong)' : 'var(--shadow-emphasize)',
        transform: h ? 'translateY(-3px)' : 'none',
        transition: 'transform .16s ease-out, box-shadow .16s ease-out',
        cursor: onClick ? 'pointer' : 'default', boxSizing: 'border-box',
        borderTop: accent ? `3px solid ${accent}` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
