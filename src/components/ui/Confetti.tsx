'use client';

import { useRef, useEffect } from 'react';

interface ConfettiProps {
  run: boolean;
  count?: number;
}

export default function Confetti({ run, count = 80 }: ConfettiProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!run || !ref.current) return;
    const cvs = ref.current;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const W = cvs.width = cvs.offsetWidth;
    const H = cvs.height = cvs.offsetHeight;
    const cols = ['#0066FF', '#6541F2', '#00BF40', '#FF9200', '#F553DA', '#00BDDE'];
    const parts = Array.from({ length: count }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 120, y: H * 0.35,
      vx: (Math.random() - 0.5) * 11, vy: Math.random() * -13 - 4,
      s: 5 + Math.random() * 7, c: cols[(Math.random() * cols.length) | 0],
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
    }));
    let raf: number, t = 0;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      t++;
      parts.forEach((p) => {
        p.vy += 0.32; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - t / 130);
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); ctx.restore();
      });
      if (t < 130) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [run, count]);

  return (
    <canvas
      ref={ref}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 40 }}
    />
  );
}
