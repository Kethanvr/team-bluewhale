'use client';
import { useEffect, useRef, useState } from 'react';
import { Zone } from '@/lib/types';
import { scoreToColor } from '@/lib/ecosystem-score';
import EcosystemScore from '@/components/dashboard/EcosystemScore';
import IndicatorBar from '@/components/dashboard/IndicatorBar';
import AlertChain from '@/components/dashboard/AlertChain';
import StatusBadge from '@/components/ui/StatusBadge';
import Link from 'next/link';

interface ZonePanelProps {
  zone: Zone | null;
  allZones: Zone[];
  onSelectZone: (zone: Zone) => void;
  adjustedScores: Record<string, number>;
}

function doStatusColor(s: string) {
  if (s === 'DEAD ZONE' || s === 'HYPOXIC') return 'var(--critical)';
  if (s === 'STRESSED') return 'var(--warn)';
  return 'var(--bio)';
}

function msaColor(v: number) { return v < 30 ? 'var(--critical)' : v < 60 ? 'var(--warn)' : 'var(--bio)'; }
function fishColor(f: number, msy: number) { return f > msy ? 'var(--critical)' : 'var(--bio)'; }
function sstColor(v: number) { return v > 1.5 ? 'var(--critical)' : v > 0.8 ? 'var(--warn)' : 'var(--bio)'; }
function pollColor(v: number) { return v > 6 ? 'var(--critical)' : v > 4 ? 'var(--warn)' : 'var(--bio)'; }

export default function ZonePanel({ zone, allZones, onSelectZone, adjustedScores }: ZonePanelProps) {
  const [view, setView] = useState<'biodiversity' | 'fisherman'>('biodiversity');
  const [showAlert, setShowAlert] = useState(false);
  const [smsShown, setSmsShown] = useState(false);

  useEffect(() => { setView('biodiversity'); setSmsShown(false); }, [zone]);

  if (!zone) {
    // Default state — summary cards
    const critical = allZones.filter(z => z.status === 'CRITICAL').length;
    const warning = allZones.filter(z => z.status === 'WARNING').length;
    const stable = allZones.filter(z => z.status === 'STABLE').length;

    return (
      <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: 4 }}>Karnataka Coastal Intelligence</h2>
          <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>6 zones monitored · Last updated 2 min ago</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 24 }}>
          {[{ label: 'CRITICAL', count: critical, color: 'var(--critical)' }, { label: 'WARNING', count: warning, color: 'var(--warn)' }, { label: 'STABLE', count: stable, color: 'var(--bio)' }].map(s => (
            <div key={s.label} style={{ background: `${s.color}10`, border: `1px solid ${s.color}30`, padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.8rem', color: s.color, lineHeight: 1 }}>{s.count}</div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: s.color, opacity: 0.8, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Select a zone on the map</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {allZones.map(z => {
            const sc = adjustedScores[z.id] ?? z.ecosystemScore;
            const col = scoreToColor(sc);
            return (
              <button key={z.id} onClick={() => onSelectZone(z)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)') }
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0, boxShadow: `0 0 6px ${col}` }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.8rem', color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>{z.name}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{z.district}</div>
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem', color: col }}>{sc}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const sc = adjustedScores[zone.id] ?? zone.ecosystemScore;
  const { indicators } = zone;
  const fRatio = (indicators.fishingMortality / indicators.msy);

  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'rgba(0,12,28,0.8)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1rem', color: '#fff', marginBottom: 4 }}>{zone.name}</h2>
            <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{zone.district} · {zone.lastReported}</div>
          </div>
          <StatusBadge status={zone.status} />
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', gap: 2, marginTop: 12 }}>
          {(['biodiversity', 'fisherman'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ flex: 1, padding: '7px', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', background: view === v ? 'var(--glow)' : 'transparent', color: view === v ? 'var(--abyss)' : 'var(--muted)', border: `1px solid ${view === v ? 'var(--glow)' : 'var(--border)'}`, fontFamily: 'var(--font-dm-mono)', transition: 'all 0.2s' }}>
              {v === 'biodiversity' ? '🐢 Biodiversity' : '🎣 Fisherman'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 24, flex: 1 }}>
        {view === 'biodiversity' ? (
          <>
            {/* Gauge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <EcosystemScore score={sc} size={160} />
            </div>

            {/* 5 indicators */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>5-Indicator Analysis</div>
              <IndicatorBar label="Dissolved Oxygen" value={indicators.dissolvedOxygen} unit={indicators.doUnit} status={indicators.doStatus} statusColor={doStatusColor(indicators.doStatus)} percent={(indicators.dissolvedOxygen / 8) * 100} description="<2 mg/L = dead zone" />
              <IndicatorBar label="MSA Biodiversity Index" value={indicators.msaIndex} unit="%" status={indicators.msaStatus} statusColor={msaColor(indicators.msaIndex)} percent={indicators.msaIndex} description="<30% = functional collapse" />
              <IndicatorBar label="Fishing Mortality" value={`F=${indicators.fishingMortality}`} status={fRatio > 1 ? 'OVER MSY' : 'WITHIN MSY'} statusColor={fishColor(indicators.fishingMortality, indicators.msy)} percent={Math.min(100, fRatio * 60)} description={`MSY=${indicators.msy}`} />
              <IndicatorBar label="SST Anomaly" value={`+${indicators.sstAnomaly}`} unit={indicators.sstUnit} status={indicators.sstAnomaly > 1.5 ? 'BLEACHING RISK' : 'ELEVATED'} statusColor={sstColor(indicators.sstAnomaly)} percent={(indicators.sstAnomaly / 2) * 100} />
              <IndicatorBar label="Pollution Density" value={indicators.pollutionDensity} unit="/10" status="SCORE" statusColor={pollColor(indicators.pollutionDensity)} percent={indicators.pollutionDensity * 10} />
            </div>

            {/* Regime shift */}
            <div style={{ background: 'rgba(255,45,85,0.06)', border: '1px solid rgba(255,45,85,0.2)', padding: '16px', marginBottom: 16 }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--critical)', textTransform: 'uppercase', marginBottom: 10 }}>Trophic Cascade Risk</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Regime Shift Probability</span>
                <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.5rem', color: zone.regimeShiftProbability > 60 ? 'var(--critical)' : 'var(--warn)' }}>{zone.regimeShiftProbability}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,45,85,0.1)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${zone.regimeShiftProbability}%`, background: 'var(--critical)', borderRadius: 3, boxShadow: '0 0 10px var(--critical)' }} />
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>Est. <strong style={{ color: '#fff' }}>{zone.monthsToThreshold} months</strong> to irreversible threshold</div>
            </div>

            {/* Species */}
            {zone.species.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>At-Risk Species</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {zone.species.map(s => (
                    <span key={s} style={{ fontSize: '0.68rem', background: 'rgba(57,255,143,0.08)', border: '1px solid rgba(57,255,143,0.2)', color: 'var(--bio)', padding: '3px 10px' }}>{s.replace(/-/g, ' ')}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Pollution sources */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Pollution Sources</div>
              {zone.pollutionSources.map((src, i) => (
                <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid rgba(0,212,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#fff' }}>{src.name}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{src.type}</div>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--warn)', whiteSpace: 'nowrap', marginLeft: 8 }}>{src.distance}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/scan" style={{ display: 'block', textAlign: 'center', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: 'var(--glow)', padding: '12px', fontSize: '0.75rem', fontFamily: 'var(--font-dm-mono)', textDecoration: 'none', letterSpacing: '0.05em' }}>
                📸 Report Pollution → AI Scan
              </Link>
              <button onClick={() => setShowAlert(true)} style={{ background: 'rgba(255,45,85,0.15)', border: '1px solid rgba(255,45,85,0.4)', color: 'var(--critical)', padding: '12px', fontSize: '0.75rem', fontFamily: 'var(--font-dm-mono)', cursor: 'pointer', letterSpacing: '0.05em' }}>
                🚨 Trigger Alert Chain
              </button>
            </div>
          </>
        ) : (
          // FISHERMAN VIEW
          <>
            <div style={{ background: 'rgba(255,107,53,0.06)', border: '1px solid rgba(255,107,53,0.2)', padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 4 }}>Zone Advisory</div>
              <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.1rem', color: indicators.fishingMortality > indicators.msy ? 'var(--critical)' : 'var(--bio)', marginBottom: 8 }}>
                {indicators.fishingMortality > indicators.msy ? '🔴 DO NOT FISH' : '🟢 SAFE TO FISH'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                F = <strong style={{ color: '#fff' }}>{indicators.fishingMortality}</strong> vs MSY = <strong style={{ color: '#fff' }}>{indicators.msy}</strong> · Ratio: <strong style={{ color: indicators.fishingMortality > indicators.msy ? 'var(--critical)' : 'var(--bio)' }}>{fRatio.toFixed(2)}x</strong>
              </div>
            </div>

            <IndicatorBar label="Fishing Mortality (F)" value={indicators.fishingMortality} status={fRatio > 1 ? 'OVEREXPLOITED' : 'SUSTAINABLE'} statusColor={fRatio > 1 ? 'var(--critical)' : 'var(--bio)'} percent={Math.min(100, fRatio * 60)} description={`Pressure: ${indicators.fishingPressure}`} />

            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 10 }}>Recommended Alternative Zones</div>
              {[{ zone: 'Gokarna Coast', f: 0.18, est: '420 kg/day', status: 'SAFE' }, { zone: 'Netrani Island Waters', f: 0.28, est: '310 kg/day', status: 'SAFE' }].map((z, i) => (
                <div key={i} style={{ padding: '10px 12px', background: 'rgba(57,255,143,0.06)', border: '1px solid rgba(57,255,143,0.2)', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#fff' }}>🟢 {z.zone}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: 2 }}>F={z.f} · Est. catch: {z.est}</div>
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--bio)', background: 'rgba(57,255,143,0.12)', padding: '2px 8px' }}>{z.status}</span>
                </div>
              ))}
            </div>

            {!smsShown ? (
              <button onClick={() => setSmsShown(true)} style={{ width: '100%', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: 'var(--glow)', padding: '12px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'var(--font-dm-mono)' }}>
                📱 Send SMS Advisory
              </button>
            ) : (
              <div style={{ background: 'rgba(0,5,15,0.8)', border: '1px solid var(--border)', padding: 16, fontFamily: 'var(--font-dm-mono)', fontSize: '0.72rem' }}>
                <div style={{ color: 'var(--muted)', marginBottom: 8, fontSize: '0.6rem', letterSpacing: '0.1em' }}>SMS PREVIEW — KANNADA + ENGLISH</div>
                <div style={{ color: '#fff', lineHeight: 1.8 }}>
                  🐋 BlueWhale: {zone.name} ಮೀನುಗಾರಿಕೆ ನಿಷೇಧ.<br />
                  F={indicators.fishingMortality} &gt; MSY={indicators.msy}. OVEREXPLOITED.<br />
                  Safe zone: Gokarna (F=0.18). Go north 45km.<br />
                  Helpline: 1800-XXX-XXXX
                </div>
                <div style={{ marginTop: 8, color: 'var(--bio)', fontSize: '0.65rem' }}>✓ SMS sent to 432 registered fishermen</div>
              </div>
            )}
          </>
        )}
      </div>

      {showAlert && <AlertChain zone={zone} onClose={() => setShowAlert(false)} />}
    </div>
  );
}
