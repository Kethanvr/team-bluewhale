'use client';

interface IndicatorBarProps {
  label: string;
  value: string | number;
  unit?: string;
  status: string;
  statusColor: string;
  percent: number; // 0-100 fill
  description?: string;
}

export default function IndicatorBar({ label, value, unit, status, statusColor, percent, description }: IndicatorBarProps) {
  return (
    <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.05em', fontFamily: 'var(--font-dm-mono)' }}>{label}</span>
          {description && (
            <span style={{ marginLeft: 6, fontSize: '0.6rem', color: 'rgba(74,122,150,0.6)', fontStyle: 'italic' }}>{description}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
            {value}{unit && <span style={{ fontSize: '0.7rem', color: 'var(--muted)', marginLeft: 2 }}>{unit}</span>}
          </span>
          <span style={{ fontSize: '0.6rem', color: statusColor, letterSpacing: '0.08em', background: `${statusColor}18`, padding: '1px 6px', border: `1px solid ${statusColor}30` }}>{status}</span>
        </div>
      </div>
      <div style={{ height: 4, background: 'rgba(0,212,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, Math.max(0, percent))}%`,
            background: statusColor,
            borderRadius: 2,
            boxShadow: `0 0 8px ${statusColor}60`,
            transition: 'width 1s ease',
          }}
        />
      </div>
    </div>
  );
}
