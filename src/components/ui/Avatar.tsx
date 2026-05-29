import { GROUP_COLORS } from '@/lib/data';

interface AvatarProps {
  name?: string;
  size?: number;
  colorKey?: string;
  ring?: boolean;
}

export default function Avatar({ name = '학생', size = 44, colorKey, ring = false }: AvatarProps) {
  const idx = colorKey != null ? GROUP_COLORS.findIndex(g => g.key === colorKey) : (name.charCodeAt(0) % 6);
  const g = GROUP_COLORS[(idx + 6) % GROUP_COLORS.length] ?? GROUP_COLORS[0];
  const initial = name.slice(-2);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: '50%', background: g.soft, color: g.deep,
      fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: size * 0.36, flexShrink: 0,
    }}>
      {initial}
    </span>
  );
}
