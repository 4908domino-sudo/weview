'use client';

import { useState, CSSProperties, MouseEvent } from 'react';
import Icon from './Icon';

interface BtnProps {
  variant?: 'primary' | 'soft' | 'outline' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  leftIcon?: string;
  rightIcon?: string;
  children?: React.ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  full?: boolean;
  color?: string;
  style?: CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

export default function Btn({
  variant = 'primary', size = 'md', leftIcon, rightIcon, children,
  onClick, disabled = false, full = false, color, style = {}, type = 'button',
}: BtnProps) {
  const [press, setPress] = useState(false);

  const sizes: Record<string, CSSProperties> = {
    sm: { height: 38, padding: '0 16px', fontSize: 14, borderRadius: 10 },
    md: { height: 48, padding: '0 22px', fontSize: 16, borderRadius: 14 },
    lg: { height: 58, padding: '0 28px', fontSize: 18, borderRadius: 16 },
    xl: { height: 68, padding: '0 32px', fontSize: 20, borderRadius: 20 },
  };

  const accent = color || 'var(--color-primary-normal)';
  const variants: Record<string, CSSProperties> = {
    primary:  { background: disabled ? 'var(--color-interaction-disable)' : accent, color: disabled ? 'var(--color-label-disable)' : '#fff', boxShadow: disabled ? 'none' : '0 6px 16px -6px rgba(0,102,255,0.5)' },
    soft:     { background: 'var(--color-blue-95)', color: 'var(--color-blue-40)' },
    outline:  { background: '#fff', color: 'var(--color-label-strong)', borderColor: 'var(--color-line-normal-normal)' },
    ghost:    { background: 'transparent', color: 'var(--color-label-neutral)' },
    white:    { background: '#fff', color: accent, boxShadow: '0 6px 18px -8px rgba(0,0,0,0.3)' },
  };

  const iconSize = size === 'sm' ? 16 : size === 'xl' ? 24 : 20;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerLeave={() => setPress(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: 'var(--font-sans)', fontWeight: 700, letterSpacing: '0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer', border: '1.5px solid transparent',
        transition: 'transform .12s ease-out, background .14s ease-out, box-shadow .14s ease-out',
        whiteSpace: 'nowrap', width: full ? '100%' : undefined, boxSizing: 'border-box',
        transform: press && !disabled ? 'scale(0.97)' : 'scale(1)',
        ...sizes[size], ...variants[variant], ...style,
      }}
    >
      {leftIcon && <Icon name={leftIcon} size={iconSize} />}
      {children && <span>{children}</span>}
      {rightIcon && <Icon name={rightIcon} size={iconSize} />}
    </button>
  );
}
