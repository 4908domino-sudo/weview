'use client';

interface Option {
  value: string;
  label: string;
}

interface SegmentedProps {
  options: Option[];
  value: string;
  onChange?: (v: string) => void;
  color?: string;
}

export default function Segmented({ options, value, onChange, color = 'var(--color-primary-normal)' }: SegmentedProps) {
  return (
    <div style={{ display: 'inline-flex', background: 'var(--color-coolNeutral-98)', borderRadius: 12, padding: 4, gap: 2 }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange?.(o.value)}
            style={{
              border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: 9,
              background: on ? '#fff' : 'transparent', color: on ? 'var(--color-label-strong)' : 'var(--color-label-alternative)',
              fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap',
              boxShadow: on ? 'var(--shadow-emphasize)' : 'none', transition: 'all .14s ease-out',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
