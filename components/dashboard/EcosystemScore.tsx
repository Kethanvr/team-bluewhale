'use client';
import { useEffect, useRef } from 'react';
import { scoreToColor } from '@/lib/ecosystem-score';

interface EcosystemScoreProps {
  score: number;
  size?: number;
}

export default function EcosystemScore({ score, size = 160 }: EcosystemScoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const color = scoreToColor(score);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 12;
    const startAngle = Math.PI * 0.75;
    const endFullAngle = Math.PI * 2.25;

    let current = 0;
    const target = score;
    const duration = 1500;
    const startTime = performance.now();

    const draw = (ts: number) => {
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      current = eased * target;

      ctx.clearRect(0, 0, size, size);

      // Background track
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, endFullAngle);
      ctx.strokeStyle = 'rgba(0,212,255,0.08)';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Active arc
      const endAngle = startAngle + (current / 100) * (endFullAngle - startAngle);
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.strokeStyle = color;
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Score text
      ctx.fillStyle = '#fff';
      ctx.font = `800 ${size * 0.22}px var(--font-syne, sans-serif)`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(Math.round(current).toString(), cx, cy - 6);

      // Sub-label
      ctx.fillStyle = 'rgba(200,232,245,0.5)';
      ctx.font = `${size * 0.08}px var(--font-dm-mono, monospace)`;
      ctx.fillText('/100', cx, cy + size * 0.14);

      if (progress < 1) requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  }, [score, size, color]);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={size} height={size} />
      <div style={{ marginTop: 8, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        Ecosystem Stability Score
      </div>
    </div>
  );
}
