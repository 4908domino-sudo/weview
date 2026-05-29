import React from 'react';

interface QRGlyphProps {
  size?: number;
  color?: string;
  bg?: string;
}

export default function QRGlyph({ size = 96, color = 'var(--color-coolNeutral-10)', bg = '#fff' }: QRGlyphProps) {
  const n = 11;
  const cells: React.ReactElement[] = [];
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const finder = (x < 3 && y < 3) || (x > n - 4 && y < 3) || (x < 3 && y > n - 4);
      if (finder) continue;
      if (rnd() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />);
    }
  }
  const Finder = ({ tx, ty }: { tx: number; ty: number }) => (
    <g transform={`translate(${tx},${ty})`}>
      <rect width="3" height="3" fill={color} />
      <rect x="0.6" y="0.6" width="1.8" height="1.8" fill={bg} />
      <rect x="1.1" y="1.1" width="0.8" height="0.8" fill={color} />
    </g>
  );
  return (
    <div style={{ background: bg, padding: size * 0.08, borderRadius: 12, boxShadow: 'var(--shadow-emphasize)' }}>
      <svg width={size} height={size} viewBox={`0 0 ${n} ${n}`} shapeRendering="crispEdges">
        {cells}
        <Finder tx={0} ty={0} />
        <Finder tx={n - 3} ty={0} />
        <Finder tx={0} ty={n - 3} />
      </svg>
    </div>
  );
}
