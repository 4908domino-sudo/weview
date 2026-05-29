import { CSSProperties } from 'react';
import Icon from './Icon';

interface PillProps {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  icon?: string;
  size?: 'sm' | 'md';
  style?: CSSProperties;
}

export default function Pill({ children, color = 'var(--color-blue-40)', bg = 'var(--color-blue-95)', icon, size = 'md', style = {} }: PillProps) {
  const s = size === 'sm' ? { h: 24, fs: 12, px: 9, gap: 4, ic: 13 } : { h: 30, fs: 13, px: 12, gap: 5, ic: 15 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: s.gap, height: s.h, padding: `0 ${s.px}px`,
      borderRadius: 9999, background: bg, color, fontFamily: 'var(--font-sans)', fontWeight: 700,
      fontSize: s.fs, letterSpacing: '0.01em', ...style,
    }}>
      {icon && <Icon name={icon} size={s.ic} />}
      {children}
    </span>
  );
}
