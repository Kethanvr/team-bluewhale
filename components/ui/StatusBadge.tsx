'use client';

type StatusType = 'CRITICAL' | 'WARNING' | 'STABLE' | 'HYPOXIC' | 'DEAD ZONE' | 'STRESSED' | 'HEALTHY' | 'DECLINING' | 'LOCALLY EXTINCT';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { bg: string; color: string; dotAnim: string }> = {
  CRITICAL: { bg: 'rgba(255,45,85,0.15)', color: '#ff2d55', dotAnim: 'animate-blink' },
  'DEAD ZONE': { bg: 'rgba(255,45,85,0.15)', color: '#ff2d55', dotAnim: 'animate-blink' },
  WARNING: { bg: 'rgba(255,107,53,0.15)', color: '#ff6b35', dotAnim: 'animate-blink' },
  HYPOXIC: { bg: 'rgba(255,107,53,0.12)', color: '#ff6b35', dotAnim: 'animate-blink' },
  STRESSED: { bg: 'rgba(255,200,50,0.12)', color: '#ffc832', dotAnim: '' },
  STABLE: { bg: 'rgba(57,255,143,0.12)', color: '#39ff8f', dotAnim: '' },
  HEALTHY: { bg: 'rgba(57,255,143,0.12)', color: '#39ff8f', dotAnim: '' },
  DECLINING: { bg: 'rgba(255,107,53,0.12)', color: '#ff6b35', dotAnim: '' },
  'LOCALLY EXTINCT': { bg: 'rgba(255,45,85,0.15)', color: '#ff2d55', dotAnim: '' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig['WARNING'];
  const padding = size === 'sm' ? '2px 8px' : '4px 12px';
  const fontSize = size === 'sm' ? '0.6rem' : '0.65rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: config.bg,
        border: `1px solid ${config.color}40`,
        color: config.color,
        padding,
        fontSize,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-dm-mono)',
        borderRadius: 2,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: config.color,
          flexShrink: 0,
        }}
        className={config.dotAnim}
      />
      {status}
    </span>
  );
}
