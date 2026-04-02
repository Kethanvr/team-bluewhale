'use client';
import { useState } from 'react';
import { Zone } from '@/lib/types';

interface AlertChainProps {
  zone: Zone;
  onClose: () => void;
}

const ESCALATION_STEPS = [
  { name: 'Karnataka Coastal Zone Authority', icon: '🏛️', delay: 0 },
  { name: 'KSPCB — State Pollution Control Board', icon: '☣️', delay: 800 },
  { name: 'Indian Coast Guard — Western Region', icon: '⚓', delay: 1600 },
];

export default function AlertChain({ zone, onClose }: AlertChainProps) {
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);

  const triggerAlert = () => {
    setSent(true);
    ESCALATION_STEPS.forEach((_, i) => {
      setTimeout(() => setStep(i + 1), _.delay + 400);
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,5,15,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div style={{ background: 'var(--deep)', border: '1px solid var(--border)', padding: 40, maxWidth: 460, width: '90%', position: 'relative' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--critical),var(--warn))' }} />

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--critical)', textTransform: 'uppercase', marginBottom: 8 }}>🚨 Alert Escalation Protocol</div>
          <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>{zone.name}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>Regime shift probability: <span style={{ color: 'var(--critical)' }}>{zone.regimeShiftProbability}%</span> · {zone.monthsToThreshold} months to threshold</p>
        </div>

        {!sent ? (
          <>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
              Triggering automated alert chain to regulatory authorities. This will notify all relevant bodies simultaneously.
            </p>
            <button
              onClick={triggerAlert}
              style={{ width: '100%', background: 'var(--critical)', color: '#fff', border: 'none', padding: '14px', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', letterSpacing: '0.05em' }}>
              🚨 TRIGGER ALERT CHAIN
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ESCALATION_STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: step > i ? 'rgba(57,255,143,0.08)' : 'rgba(0,212,255,0.03)', border: `1px solid ${step > i ? 'rgba(57,255,143,0.3)' : 'var(--border)'}`, transition: 'all 0.5s ease' }}>
                <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', color: step > i ? 'var(--bio)' : 'var(--muted)', fontFamily: 'var(--font-dm-mono)' }}>{s.name}</div>
                  {step > i && <div style={{ fontSize: '0.65rem', color: 'var(--bio)', marginTop: 2 }}>✓ Alert sent</div>}
                </div>
                {step > i ? (
                  <span style={{ fontSize: '1rem' }}>✅</span>
                ) : step === i ? (
                  <span style={{ fontSize: '0.65rem', color: 'var(--glow)', animation: 'blink 0.8s infinite' }}>Sending...</span>
                ) : (
                  <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>Pending</span>
                )}
              </div>
            ))}
            {step >= ESCALATION_STEPS.length && (
              <div style={{ marginTop: 8, textAlign: 'center', fontSize: '0.78rem', color: 'var(--bio)' }}>
                ✅ All authorities notified. Response expected within 2 hours.
              </div>
            )}
          </div>
        )}

        <button onClick={onClose} style={{ marginTop: 20, background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '8px 20px', fontSize: '0.72rem', cursor: 'pointer', width: '100%' }}>
          Close
        </button>
      </div>
    </div>
  );
}
