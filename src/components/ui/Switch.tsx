'use client';

interface SwitchProps {
  on: boolean;
  onChange?: (v: boolean) => void;
  color?: string;
}

export default function Switch({ on, onChange, color = 'var(--color-primary-normal)' }: SwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!on)}
      style={{
        width: 52, height: 30, borderRadius: 9999, border: 'none', cursor: 'pointer', padding: 3,
        background: on ? color : 'var(--color-coolNeutral-95)', transition: 'background .16s ease-out', display: 'flex',
      }}
    >
      <span style={{
        width: 24, height: 24, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transform: on ? 'translateX(22px)' : 'translateX(0)',
        transition: 'transform .18s cubic-bezier(.34,1.4,.64,1)',
      }} />
    </button>
  );
}
