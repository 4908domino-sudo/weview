interface ProgressProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  bg?: string;
}

export default function Progress({ value, max = 100, color = 'var(--color-primary-normal)', height = 10, bg = 'var(--color-coolNeutral-97)' }: ProgressProps) {
  return (
    <div style={{ height, borderRadius: 9999, background: bg, overflow: 'hidden', width: '100%' }}>
      <div style={{ height: '100%', width: `${Math.min(100, (value / max) * 100)}%`, borderRadius: 9999, background: color, transition: 'width .4s cubic-bezier(.4,0,.2,1)' }} />
    </div>
  );
}
