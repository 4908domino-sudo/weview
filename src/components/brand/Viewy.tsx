interface ViewyProps {
  size?: number;
  mood?: 'happy' | 'wave' | 'celebrate' | 'peek' | 'think';
  primary?: string;
}

export default function Viewy({ size = 120, mood = 'happy', primary = 'var(--color-blue-50)' }: ViewyProps) {
  const eyeY = mood === 'celebrate' ? 50 : 54;
  const eyes = mood === 'celebrate'
    ? (
      <g stroke="var(--color-coolNeutral-10)" strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d={`M40 ${eyeY}q6 -7 12 0`} />
        <path d={`M68 ${eyeY}q6 -7 12 0`} />
      </g>
    )
    : (
      <g>
        <circle cx="46" cy={eyeY} r="6.4" fill="var(--color-coolNeutral-10)" />
        <circle cx="74" cy={eyeY} r="6.4" fill="var(--color-coolNeutral-10)" />
        <circle cx="48.2" cy={eyeY - 2.2} r="2.1" fill="#fff" />
        <circle cx="76.2" cy={eyeY - 2.2} r="2.1" fill="#fff" />
      </g>
    );
  const mouth = mood === 'celebrate'
    ? <path d="M52 66q8 12 16 0a9 9 0 01-16 0z" fill="var(--color-redOrange-50)" />
    : <path d="M53 65q7 8 14 0" stroke="var(--color-coolNeutral-10)" strokeWidth="3.2" fill="none" strokeLinecap="round" />;

  return (
    <span style={{ display: 'inline-flex', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <path d="M60 22c0-7 5-12 12-12 0 7-5 12-12 12z" fill="var(--color-green-50)" />
        <path d="M60 22c0-6-5-10-11-10 0 6 5 10 11 10z" fill="var(--color-green-60, #1ED45A)" />
        <rect x="58.5" y="20" width="3" height="10" rx="1.5" fill="var(--color-green-40)" />
        <path d="M60 28C36 28 18 44 18 64c0 17 18 30 42 30s42-13 42-30c0-20-18-36-42-36z" fill={primary} />
        <ellipse cx="60" cy="70" rx="30" ry="22" fill="#fff" opacity="0.13" />
        {eyes}
        <circle cx="36" cy="62" r="5" fill="var(--color-pink-60)" opacity="0.55" />
        <circle cx="84" cy="62" r="5" fill="var(--color-pink-60)" opacity="0.55" />
        {mouth}
        {mood === 'wave' && <circle cx="100" cy="52" r="8" fill={primary} />}
      </svg>
    </span>
  );
}
