'use client';
import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subLabel?: string;
  color?: string;
  icon?: ReactNode;
  accent?: boolean;
}

export default function MetricCard({ label, value, unit, subLabel, color = 'var(--glow)', icon, accent }: MetricCardProps) {
  return (
    <div
      style={{
        background: accent ? `${color}08` : 'var(--surface)',
        border: `1px solid ${accent ? color + '30' : 'var(--border)'}`,
        padding: '20px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {accent && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, ${color}, transparent)`,
          }}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        {icon && <span style={{ fontSize: '1rem' }}>{icon}</span>}
        <span
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            fontFamily: 'var(--font-dm-mono)',
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: '1.8rem',
          color,
          lineHeight: 1,
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: '0.9rem', color: 'var(--muted)', marginLeft: 4 }}>
            {unit}
          </span>
        )}
      </div>
      {subLabel && (
        <div
          style={{
            marginTop: 6,
            fontSize: '0.7rem',
            color: 'var(--muted)',
            fontFamily: 'var(--font-dm-mono)',
          }}
        >
          {subLabel}
        </div>
      )}
    </div>
  );
}
