'use client';
import Navbar from '@/components/nav/Navbar';
import OceanCanvas from '@/components/ui/OceanCanvas';
import { Species } from '@/lib/types';
import speciesRaw from '@/data/species.json';
import { useState } from 'react';

const species = (speciesRaw as unknown as { species: Species[] }).species;

const IUCN_COLORS: Record<string, string> = {
  CR: '#ff2d55', EN: '#ff6b35', VU: '#ff9f0a', NT: '#ffd60a', LC: '#39ff8f', EW: '#bf5af2', EX: '#8e8e93',
};

const TROPHIC_ICONS: Record<number, string> = { 1: '🌿', 2: '🦐', 3: '🐟', 4: '🐢', 5: '🐋' };

function TrophicChain() {
  const sorted = [...species].sort((a, b) => a.trophicLevel - b.trophicLevel);
  const levels = [5, 4, 3, 2, 1];

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 32, marginBottom: 40 }}>
      <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 24 }}>
        Karnataka Trophic Food Web — Cascade Risk
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {levels.map((lvl, idx) => {
          const atLevel = sorted.filter(s => Math.round(s.trophicLevel) === lvl);
          return (
            <div key={lvl} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 20px', borderBottom: idx < levels.length - 1 ? '1px solid rgba(0,212,255,0.08)' : 'none', background: idx === 0 ? 'rgba(0,212,255,0.03)' : 'transparent', position: 'relative' }}>
              {/* Cascade indicator */}
              {idx < levels.length - 1 && (
                <div style={{ position: 'absolute', left: 52, bottom: -1, width: 1, height: 1, background: 'transparent', zIndex: 2 }}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,45,85,0.3)', position: 'absolute', left: -6, bottom: -14 }}>↓</div>
                </div>
              )}

              <div style={{ width: 40, textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem' }}>{TROPHIC_ICONS[lvl]}</div>
                <div style={{ fontSize: '0.55rem', color: 'var(--muted)', marginTop: 2 }}>L{lvl}</div>
              </div>

              {atLevel.length > 0 ? (
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
                  {atLevel.map(s => {
                    const col = IUCN_COLORS[s.iucnStatus] ?? 'var(--muted)';
                    const trend = s.populationTrend === 'DECLINING' ? '↘' : s.populationTrend === 'INCREASING' ? '↗' : s.populationTrend === 'LOCALLY EXTINCT' ? '✕' : '→';
                    return (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-dm-mono)', color: col, fontWeight: 600 }}>{s.iucnStatus}</span>
                        <div>
                          <div style={{ fontSize: '0.78rem', color: '#fff', fontFamily: 'var(--font-syne)', fontWeight: 600 }}>{s.commonName}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>MSA: {s.msaIndex}% <span style={{ color: trend === '↘' || trend === '✕' ? 'var(--critical)' : 'var(--bio)' }}>{trend}</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ fontSize: '0.72rem', color: 'rgba(200,232,245,0.3)', fontStyle: 'italic' }}>Level {lvl} — baseline prey/producers</div>
              )}

              {/* Cascade effect indicator */}
              {atLevel.length > 0 && atLevel.some(s => s.populationTrend === 'DECLINING') && (
                <div style={{ fontSize: '0.65rem', color: 'var(--critical)', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', padding: '3px 8px', whiteSpace: 'nowrap' }}>CASCADE DOWN ↓</div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(255,45,85,0.05)', border: '1px solid rgba(255,45,85,0.15)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7 }}>
        ⚠ <strong style={{ color: 'var(--critical)' }}>Trophic cascade in progress</strong> — Dugong functionally extinct in Karnataka → seagrass overgrazing → habitat loss cascades to L3 and L2 prey species
      </div>
    </div>
  );
}

function SpeciesCard({ s, selected, onSelect }: { s: Species; selected: boolean; onSelect: () => void }) {
  const col = IUCN_COLORS[s.iucnStatus] ?? 'var(--muted)';
  const trendIcon = s.populationTrend === 'DECLINING' ? '↘' : s.populationTrend === 'INCREASING' ? '↗' : s.populationTrend === 'LOCALLY EXTINCT' ? '✕' : '→';
  const trendColor = s.populationTrend === 'DECLINING' || s.populationTrend === 'LOCALLY EXTINCT' ? 'var(--critical)' : 'var(--bio)';

  return (
    <div
      onClick={onSelect}
      style={{ background: 'var(--surface)', border: `1px solid ${selected ? col + '60' : 'var(--border)'}`, borderLeft: `3px solid ${col}`, padding: 24, cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => !selected && (e.currentTarget.style.borderColor = `${col}40`)}
      onMouseLeave={e => !selected && (e.currentTarget.style.borderColor = 'var(--border)')}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-dm-mono)', color: col, fontWeight: 600, letterSpacing: '0.05em' }}>{s.iucnStatus}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--muted)', marginLeft: 6 }}>{s.iucnStatusFull}</span>
          <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', color: '#fff', margin: '4px 0 2px' }}>{s.commonName}</h3>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontStyle: 'italic' }}>{s.scientificName}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.4rem', color: s.msaIndex < 30 ? 'var(--critical)' : s.msaIndex < 60 ? 'var(--warn)' : 'var(--bio)', lineHeight: 1 }}>{s.msaIndex}%</div>
          <div style={{ fontSize: '0.6rem', color: 'var(--muted)', marginTop: 2 }}>MSA index</div>
        </div>
      </div>

      {/* MSA bar */}
      <div style={{ height: 3, background: 'rgba(0,212,255,0.08)', marginBottom: 12, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${s.msaIndex}%`, background: col, transition: 'width 1s ease' }} />
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: '0.65rem', color: trendColor, fontFamily: 'var(--font-dm-mono)' }}>{trendIcon}</span>
          <span style={{ fontSize: '0.65rem', color: trendColor }}>{s.populationTrend}</span>
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{s.populationChange5yr > 0 ? '+' : ''}{s.populationChange5yr}% (5yr)</div>
        <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{s.karnatakaPopulation}</div>
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 10 }}>
        🎣 {s.primaryThreat}
      </div>

      {selected && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(0,212,255,0.1)' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Cascade Effect</div>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7 }}>{s.cascadeEffect}</p>
          {s.yearsToThreshold && (
            <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)', padding: '4px 10px', fontSize: '0.65rem', color: 'var(--critical)' }}>
              ⚠ {s.yearsToThreshold} years to irreversible threshold
            </div>
          )}
          {s.nestingSitesLostSince2010 && (
            <div style={{ marginTop: 6, fontSize: '0.68rem', color: 'var(--muted)' }}>
              🏝 {s.nestingSitesLostSince2010} nesting sites lost since 2010
            </div>
          )}
          <div style={{ marginTop: 8, fontSize: '0.65rem', color: 'rgba(0,212,255,0.5)', fontFamily: 'var(--font-dm-mono)' }}>Protected: {s.protectedUnder}</div>
        </div>
      )}
    </div>
  );
}

export default function SpeciesPage() {
  const [selected, setSelected] = useState<string | null>(species[0]?.id ?? null);

  return (
    <>
      <OceanCanvas />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(57,255,143,0.08)', border: '1px solid rgba(57,255,143,0.2)', padding: '5px 14px', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--bio)', textTransform: 'uppercase', marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, background: 'var(--bio)', borderRadius: '50%', animation: 'blink 2s infinite' }} />
              IUCN Monitoring · MSA Biodiversity Index
            </div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.04em', color: '#fff', lineHeight: 1.05, marginBottom: 16 }}>
              Species Trophic<br />
              <span style={{ color: 'var(--bio)' }}>Monitor</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', maxWidth: 540, lineHeight: 1.8 }}>
              {species.length} IUCN-listed species tracked on Karnataka's 320km coastline. Hawksbill Turtle (CR), Whale Shark (EN), Dugong (functionally extinct). The food web below shows live cascade consequences.
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2, marginBottom: 40 }}>
            {[
              { label: 'Critically Endangered', count: species.filter(s => s.iucnStatus === 'CR').length, color: 'var(--critical)' },
              { label: 'Endangered', count: species.filter(s => s.iucnStatus === 'EN').length, color: 'var(--warn)' },
              { label: 'Declining Populations', count: species.filter(s => s.populationTrend === 'DECLINING').length, color: '#ff6b35' },
              { label: 'Species Monitored', count: species.length, color: 'var(--glow)' },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '2rem', color: stat.color, lineHeight: 1 }}>{stat.count}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: 6, letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Trophic chain */}
          <TrophicChain />

          {/* Species grid */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ display: 'block', width: 20, height: 1, background: 'var(--bio)' }} /> Species Details · Click to expand
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 2 }}>
            {species.map(s => (
              <SpeciesCard
                key={s.id}
                s={s}
                selected={selected === s.id}
                onSelect={() => setSelected(p => p === s.id ? null : s.id)}
              />
            ))}
          </div>

          {/* IUCN legend */}
          <div style={{ marginTop: 40, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {Object.entries(IUCN_COLORS).map(([code, col]) => (
              <div key={code} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: col }} />
                <span style={{ fontSize: '0.65rem', color: 'var(--muted)', fontFamily: 'var(--font-dm-mono)' }}>{code}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
