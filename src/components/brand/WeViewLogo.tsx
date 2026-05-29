interface WeViewMarkProps {
  size?: number;
  primary?: string;
}

function WeViewMark({ size = 40, primary = 'var(--color-blue-50)' }: WeViewMarkProps) {
  const r = size * 0.30;
  return (
    <span style={{ display: 'inline-flex', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect x="0" y="0" width="48" height="48" rx={r * 48 / size} fill={primary} />
        <path d="M24 14.5c7.2 0 12.6 5 14.4 8.4.5.7.5 1.6 0 2.3C36.6 28.5 31.2 33.5 24 33.5S11.4 28.5 9.6 25.2a2.2 2.2 0 010-2.3C11.4 19.5 16.8 14.5 24 14.5z" fill="#fff" />
        <circle cx="24" cy="24" r="6.6" fill={primary} />
        <circle cx="24" cy="24" r="3.4" fill="var(--color-coolNeutral-10)" />
        <circle cx="26.2" cy="21.6" r="1.7" fill="#fff" />
      </svg>
    </span>
  );
}

interface WeViewLogoProps {
  height?: number;
  color?: string;
  mark?: boolean;
  primary?: string;
}

export default function WeViewLogo({ height = 28, color = 'var(--color-label-strong)', mark = true, primary = 'var(--color-blue-50)' }: WeViewLogoProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: height * 0.34 }}>
      {mark && <WeViewMark size={height * 1.18} primary={primary} />}
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: height, lineHeight: 1, letterSpacing: '-0.03em', color }}>
        We<span style={{ color: primary }}>View</span>
      </span>
    </span>
  );
}
