'use client';
import { useState, useRef } from 'react';
import Navbar from '@/components/nav/Navbar';
import OceanCanvas from '@/components/ui/OceanCanvas';
import { PollutionAnalysis } from '@/lib/types';

const DEMO_MODE_RESULT: PollutionAnalysis = {
  pollutionDetected: true,
  pollutionType: { primary: 'Oil Slick', secondary: 'Plastic Debris', marpolCategory: 'MARPOL Annex I' },
  severityScore: 8,
  affectedAreaEstimate: '~2.4 km²',
  dissolvedOxygenImpact: { estimatedDODrop: '1.8 mg/L', impactRadius: '340m', hypoxiaRisk: 'HIGH' },
  trophicThreat: { seagrassRisk: 'HIGH', benthicHabitatImpact: 'HIGH', algalBloomRisk: 'MEDIUM', cascadeRisk: 'Oil film prevents photosynthesis → seagrass die-off → Dugong food source collapse → Olive Ridley prey disruption' },
  speciesAtRisk: [
    { species: 'Olive Ridley Turtle', reason: 'Direct ingestion risk — mistaking plastic for jellyfish' },
    { species: 'Whale Shark', reason: 'Oil-contaminated zooplankton filter-feeding' },
    { species: 'Dugong', reason: 'Seagrass matting prevents grazing' },
  ],
  recommendedActions: ['Immediate deployment of oil containment boom', 'Notify KSPCB under Water Act 1974', 'Alert Coast Guard Zone IX — Mumbai', 'Ban fishing within 2km radius for 72h'],
  alertEscalation: { shouldAlert: true, alertTarget: 'Karnataka Coastal Zone Authority + Indian Coast Guard', urgency: 'IMMEDIATE' },
  confidence: 0.89,
  analysisNotes: 'Classic oil sheen pattern with dark center consistent with bilge water discharge. Iridescent rainbow coloration indicates recent spill (< 6h). High priority response required.',
};

const URGENCY_COLORS = { IMMEDIATE: 'var(--critical)', '48H': 'var(--warn)', '7 DAYS': 'var(--bio)', MONITORING: 'var(--muted)' };

function SeverityBar({ score }: { score: number }) {
  const color = score > 7 ? 'var(--critical)' : score > 5 ? 'var(--warn)' : 'var(--bio)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1, height: 8, background: 'rgba(0,212,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score * 10}%`, background: color, borderRadius: 4, boxShadow: `0 0 12px ${color}`, transition: 'width 1s ease' }} />
      </div>
      <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '1.2rem', color }}>{score}/10</span>
    </div>
  );
}

function RiskBadge({ level }: { level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' }) {
  const c = level === 'CRITICAL' || level === 'HIGH' ? 'var(--critical)' : level === 'MEDIUM' ? 'var(--warn)' : 'var(--bio)';
  return <span style={{ fontSize: '0.65rem', padding: '2px 8px', background: `${c}18`, color: c, border: `1px solid ${c}40`, letterSpacing: '0.05em' }}>{level}</span>;
}

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PollutionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) handleFile(f);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };

  const runScan = async (demo = false) => {
    setLoading(true);
    setError(null);
    setResult(null);

    if (demo) {
      await new Promise(r => setTimeout(r, 2200));
      setResult(DEMO_MODE_RESULT);
      setDemoMode(true);
      setLoading(false);
      return;
    }

    if (!preview) return;

    try {
      const base64 = preview.includes(',') ? preview.split(',')[1] : preview;
      const mimeType = file?.type ?? 'image/jpeg';

      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error ?? 'Unknown error');
      }

      const data = await res.json();
      setResult(data);
      setDemoMode(false);
    } catch (err: any) {
      setError(err.message ?? 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setPreview(null); setResult(null); setError(null); setDemoMode(false); };

  return (
    <>
      <OceanCanvas />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh', paddingTop: 100, paddingBottom: 80 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', padding: '5px 14px', fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--glow)', textTransform: 'uppercase', marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, background: 'var(--bio)', borderRadius: '50%', animation: 'blink 2s infinite' }} />
              Gemini 1.5 Pro Vision · MARPOL-Aware Analysis
            </div>
            <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: '-0.04em', color: '#fff', lineHeight: 1.05, marginBottom: 16 }}>
              AI Pollution<br />
              <span style={{ color: 'var(--glow)' }}>Scanner</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', maxWidth: 520, lineHeight: 1.8 }}>
              Upload any coastal photo. BlueWhale classifies pollution by MARPOL Annex category, estimates dissolved oxygen impact, maps the trophic cascade threat, and recommends which authority to alert.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 24, transition: 'grid-template-columns 0.4s ease' }}>
            {/* Upload zone */}
            <div>
              {!preview ? (
                <div
                  ref={dropRef}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => inputRef.current?.click()}
                  style={{ border: '2px dashed var(--border)', background: 'var(--surface)', cursor: 'pointer', padding: '64px 40px', textAlign: 'center', transition: 'border-color 0.3s', minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                  <div style={{ width: 72, height: 72, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📸</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: 6 }}>Drop coastal photo here</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>JPG, PNG, WebP — any resolution</div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(0,212,255,0.5)', letterSpacing: '0.08em', fontFamily: 'var(--font-dm-mono)' }}>or click to browse</div>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <img src={preview} alt="Upload preview" style={{ width: '100%', objectFit: 'cover', maxHeight: 360, display: 'block', border: '1px solid var(--border)' }} />
                  <button onClick={reset} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,8,20,0.8)', border: '1px solid var(--border)', color: 'var(--muted)', padding: '4px 10px', fontSize: '0.7rem', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>✕ Remove</button>
                </div>
              )}
              <input ref={inputRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} style={{ display: 'none' }} />

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  disabled={!preview || loading}
                  onClick={() => runScan(false)}
                  style={{ flex: 2, padding: '14px', background: preview && !loading ? 'linear-gradient(135deg,var(--glow),var(--pulse))' : 'rgba(0,212,255,0.06)', color: preview && !loading ? 'var(--abyss)' : 'var(--muted)', border: 'none', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.85rem', cursor: preview && !loading ? 'pointer' : 'not-allowed', letterSpacing: '0.03em', transition: 'all 0.3s' }}>
                  {loading && !demoMode ? '🔍 Analyzing…' : '🔍 Analyze with Gemini'}
                </button>
                <button
                  disabled={loading}
                  onClick={() => runScan(true)}
                  style={{ flex: 1, padding: '14px', background: 'transparent', color: 'var(--glow)', border: '1px solid rgba(0,212,255,0.3)', fontFamily: 'var(--font-dm-mono)', fontSize: '0.72rem', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.05em' }}>
                  {loading && demoMode ? 'Running…' : 'Demo Mode'}
                </button>
              </div>

              {/* API notice */}
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)', fontSize: '0.68rem', color: 'rgba(200,232,245,0.4)', lineHeight: 1.6 }}>
                💡 Requires GEMINI_API_KEY in .env.local · Use <strong style={{ color: 'var(--glow)' }}>Demo Mode</strong> for hackathon demo without API key
              </div>

              {error && (
                <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.25)', fontSize: '0.75rem', color: 'var(--critical)' }}>
                  ⚠ {error}
                </div>
              )}
            </div>

            {/* Results */}
            {result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', maxHeight: '80vh' }}>
                {demoMode && (
                  <div style={{ padding: '6px 12px', background: 'rgba(255,107,53,0.12)', border: '1px solid rgba(255,107,53,0.3)', fontSize: '0.65rem', color: 'var(--warn)', letterSpacing: '0.08em' }}>
                    🎭 DEMO MODE — Simulated result for presentation
                  </div>
                )}

                {/* Pollution Detected Banner */}
                <div style={{ padding: '16px 20px', background: result.pollutionDetected ? 'rgba(255,45,85,0.08)' : 'rgba(57,255,143,0.08)', border: `1px solid ${result.pollutionDetected ? 'rgba(255,45,85,0.3)' : 'rgba(57,255,143,0.3)'}`, borderLeft: `3px solid ${result.pollutionDetected ? 'var(--critical)' : 'var(--bio)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                      {result.pollutionDetected ? '🚨 Pollution Detected' : '✅ No Pollution Detected'}
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>Confidence: {Math.round(result.confidence * 100)}%</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    {result.pollutionType.primary} {result.pollutionType.secondary && `+ ${result.pollutionType.secondary}`} · <strong style={{ color: 'var(--warn)' }}>{result.pollutionType.marpolCategory}</strong>
                  </div>
                </div>

                {/* Severity */}
                <div style={{ padding: 20, background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Severity Score</div>
                  <SeverityBar score={result.severityScore} />
                  <div style={{ marginTop: 8, fontSize: '0.72rem', color: 'var(--muted)' }}>Affected area: <strong style={{ color: '#fff' }}>{result.affectedAreaEstimate}</strong></div>
                </div>

                {/* DO impact */}
                <div style={{ padding: 20, background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Dissolved Oxygen Impact</div>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <div><div style={{ fontSize: '1rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: 'var(--critical)' }}>{result.dissolvedOxygenImpact.estimatedDODrop}</div><div style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>DO drop</div></div>
                    <div><div style={{ fontSize: '1rem', fontFamily: 'var(--font-syne)', fontWeight: 700, color: '#fff' }}>{result.dissolvedOxygenImpact.impactRadius}</div><div style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>impact radius</div></div>
                    <div><div style={{ marginTop: 4 }}><RiskBadge level={result.dissolvedOxygenImpact.hypoxiaRisk} /></div><div style={{ fontSize: '0.6rem', color: 'var(--muted)', marginTop: 4 }}>hypoxia risk</div></div>
                  </div>
                </div>

                {/* Trophic threat */}
                <div style={{ padding: 20, background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Trophic Chain Threat</div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>Seagrass: <RiskBadge level={result.trophicThreat.seagrassRisk as any} /></span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>Benthic: <RiskBadge level={result.trophicThreat.benthicHabitatImpact as any} /></span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>Algal Bloom: <RiskBadge level={result.trophicThreat.algalBloomRisk as any} /></span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7 }}>{result.trophicThreat.cascadeRisk}</p>
                </div>

                {/* Species at risk */}
                <div style={{ padding: 20, background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Species at Risk</div>
                  {result.speciesAtRisk.map((s, i) => (
                    <div key={i} style={{ padding: '8px 0', borderBottom: i < result.speciesAtRisk.length - 1 ? '1px solid rgba(0,212,255,0.06)' : 'none' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--bio)', fontWeight: 600 }}>⚠ {s.species}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{s.reason}</div>
                    </div>
                  ))}
                </div>

                {/* Alert escalation */}
                {result.alertEscalation.shouldAlert && (
                  <div style={{ padding: 20, background: 'rgba(255,45,85,0.06)', border: '1px solid rgba(255,45,85,0.25)', borderLeft: '3px solid var(--critical)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--critical)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>🚨 Alert Required</div>
                      <span style={{ fontSize: '0.65rem', padding: '2px 8px', background: `${URGENCY_COLORS[result.alertEscalation.urgency]}18`, color: URGENCY_COLORS[result.alertEscalation.urgency], border: `1px solid ${URGENCY_COLORS[result.alertEscalation.urgency]}40` }}>{result.alertEscalation.urgency}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#fff' }}>{result.alertEscalation.alertTarget}</div>
                    {result.recommendedActions.map((a, i) => (
                      <div key={i} style={{ marginTop: 6, fontSize: '0.7rem', color: 'var(--muted)', paddingLeft: 12, borderLeft: '2px solid rgba(255,45,85,0.3)' }}>{a}</div>
                    ))}
                  </div>
                )}

                {/* Notes */}
                <div style={{ padding: '12px 16px', background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)', fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.7, fontStyle: 'italic' }}>
                  {result.analysisNotes}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
