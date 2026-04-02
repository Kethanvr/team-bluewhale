'use client';
import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/nav/Navbar';
import ZonePanel from '@/components/map/ZonePanel';
import { Zone } from '@/lib/types';
import { computeEcosystemScore, scoreToColor } from '@/lib/ecosystem-score';
import zonesRaw from '@/data/zones.json';

const zones = (zonesRaw as unknown as { zones: Zone[] }).zones;

const OceanMap = dynamic(() => import('@/components/map/OceanMap'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 48, height: 48, border: '3px solid rgba(0,212,255,0.2)', borderTopColor: 'var(--glow)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>Loading Karnataka Coastline…</div>
    </div>
  ),
});

export default function MapPage() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [adjustedScores, setAdjustedScores] = useState<Record<string, number>>({});

  // Compute derived scores on mount
  useEffect(() => {
    const scores: Record<string, number> = {};
    zones.forEach(z => { scores[z.id] = computeEcosystemScore(z.indicators); });
    setAdjustedScores(scores);
  }, []);

  // Simulate live score drift every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setAdjustedScores(prev => {
        const next = { ...prev };
        zones.forEach(z => {
          const drift = (Math.random() - 0.5) * 2;
          next[z.id] = Math.max(0, Math.min(100, (prev[z.id] ?? z.ecosystemScore) + drift));
        });
        return next;
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectZone = useCallback((zone: Zone) => {
    setSelectedZone(z => z?.id === zone.id ? null : zone);
  }, []);

  const worstZone = zones.reduce((w, z) => {
    const sc = adjustedScores[z.id] ?? z.ecosystemScore;
    const ws = adjustedScores[w.id] ?? w.ecosystemScore;
    return sc < ws ? z : w;
  }, zones[0]);

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .leaflet-container { background: #000814 !important; }
      `}</style>
      <Navbar />
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', paddingTop: 60 }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 24px', background: 'rgba(0,8,20,0.95)', borderBottom: '1px solid var(--border)', flexShrink: 0, gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, background: 'var(--bio)', borderRadius: '50%', animation: 'blink 2s infinite' }} />
              <span style={{ fontFamily: 'var(--font-dm-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>LIVE · {zones.length} zones active</span>
            </div>
            <div style={{ height: 16, width: 1, background: 'var(--border)' }} />
            {/* Mini zone chips */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {zones.map(z => {
                const sc = adjustedScores[z.id] ?? z.ecosystemScore;
                const col = scoreToColor(sc);
                return (
                  <button key={z.id} onClick={() => handleSelectZone(z)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, background: selectedZone?.id === z.id ? `${col}18` : 'transparent', border: `1px solid ${selectedZone?.id === z.id ? col + '60' : 'var(--border)'}`, padding: '3px 10px', cursor: 'pointer', transition: 'all 0.2s', borderRadius: 2 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: col, boxShadow: `0 0 6px ${col}` }} />
                    <span style={{ fontSize: '0.65rem', color: selectedZone?.id === z.id ? '#fff' : 'var(--muted)', fontFamily: 'var(--font-dm-mono)' }}>{z.name.split(' ')[0]}</span>
                    <span style={{ fontSize: '0.65rem', color: col, fontFamily: 'var(--font-syne)', fontWeight: 700 }}>{Math.round(sc)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alert banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.25)', padding: '6px 14px' }}>
            <span style={{ fontSize: '0.65rem', animation: 'blink 1s infinite', color: 'var(--critical)' }}>●</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--critical)', fontFamily: 'var(--font-dm-mono)' }}>PRIORITY: {worstZone?.name} · Regime shift {worstZone?.regimeShiftProbability}%</span>
          </div>
        </div>

        {/* Map layout */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', overflow: 'hidden' }}>
          {/* Map column */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <OceanMap
              zones={zones}
              selectedZone={selectedZone}
              adjustedScores={adjustedScores}
              onSelectZone={handleSelectZone}
            />

            {/* Corner legend */}
            <div style={{ position: 'absolute', bottom: 24, left: 24, zIndex: 500, background: 'rgba(0,8,20,0.9)', border: '1px solid var(--border)', padding: '12px 16px', backdropFilter: 'blur(8px)' }}>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase' }}>Ecosystem Score</div>
              {[
                { range: '75–100', label: 'Stable', color: 'var(--bio)' },
                { range: '50–75', label: 'Warning', color: 'var(--warn)' },
                { range: '0–50', label: 'Critical', color: 'var(--critical)' },
              ].map(item => (
                <div key={item.range} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0, boxShadow: `0 0 6px ${item.color}` }} />
                  <span style={{ fontSize: '0.65rem', color: item.color, fontFamily: 'var(--font-dm-mono)' }}>{item.range}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Click hint */}
            {!selectedZone && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', textAlign: 'center', zIndex: 400 }}>
                <div style={{ background: 'rgba(0,8,20,0.7)', border: '1px solid rgba(0,212,255,0.2)', padding: '10px 20px', backdropFilter: 'blur(4px)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(0,212,255,0.5)', fontFamily: 'var(--font-dm-mono)' }}>Click any zone marker to analyze</div>
                </div>
              </div>
            )}
          </div>

          {/* Zone panel */}
          <div style={{ borderLeft: '1px solid var(--border)', background: 'rgba(0,8,20,0.95)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <ZonePanel
              zone={selectedZone}
              allZones={zones}
              onSelectZone={handleSelectZone}
              adjustedScores={adjustedScores}
            />
          </div>
        </div>
      </div>
    </>
  );
}
