'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/nav/Navbar';
import OceanCanvas from '@/components/ui/OceanCanvas';

function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, start]);
  return count;
}

function StatCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const count = useCounter(target, 2000, started);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minWidth: 120 }}>
      <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '2.2rem', color: '#fff', lineHeight: 1 }}>
        {count}<span style={{ color: 'var(--glow)' }}>{suffix}</span>
      </div>
      <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 6 }}>{label}</div>
    </div>
  );
}

function RevealSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

export default function HomePage() {

  const problems = [
    { icon: '🌊', title: 'Trophic Cascade Risk', color: 'var(--glow)', desc: 'Overfishing removes apex predators → mesopredator explosion → prey collapse. Karnataka lost 67% of Whale Shark sightings in 5 years. Cascade already in progress.', badge: '73% regime shift probability', badgeColor: 'var(--critical)' },
    { icon: '💀', title: 'Hypoxic Dead Zones', color: 'var(--warn)', desc: 'Arabian Sea OMZ intrudes Karnataka coast seasonally. Sasihithlu zone: DO at 1.4 mg/L — below 2 mg/L dead zone threshold. Marine life suffocating.', badge: 'DO: 1.4 mg/L at Sasihithlu', badgeColor: 'var(--warn)' },
    { icon: '⚠️', title: 'Regime Shift Alert', color: 'var(--bio)', desc: '84% probability of irreversible regime shift at Sasihithlu within 7 months. Once crossed, internal feedback loops prevent ecosystem recovery. The Black Sea never recovered from its 1989 collapse.', badge: '7 months to threshold', badgeColor: 'var(--bio)' },
  ];

  const steps = [
    { num: '01', icon: '📡', title: 'Detect', desc: 'AI Vision analyzes coastal imagery every cycle. Citizen reports fill real-time gaps. Every data point geotagged and validated automatically.', tag: 'Gemini Vision + Crowdsource' },
    { num: '02', icon: '🧠', title: 'Analyze', desc: 'Computes 5 IUCN-aligned sub-indices per zone: Dissolved Oxygen, MSA biodiversity index, Fishing Mortality vs MSY, SST anomaly, and pollution density.', tag: 'Ecosystem Score Engine' },
    { num: '03', icon: '🚨', title: 'Alert', desc: 'Direct automated alerts to Coast Guard, KSPCB, NGOs. Fishermen get SMS zone advisories. Fire alarms, not fire investigations.', tag: 'SMS + Authority Integration' },
  ];

  const features = [
    { icon: '🗺️', title: 'Ecosystem Intelligence Map', desc: 'Full-screen Leaflet map with 6 Karnataka coastal zones. Each zone shows live regime shift probability, 5 sub-indicators, and IUCN species risk. Click any zone to dive deep.' },
    { icon: '🤖', title: 'Gemini AI Pollution Scanner', desc: 'Upload any coastal photo. Real Gemini 1.5 Pro Vision classifies by MARPOL category, estimates DO impact radius, maps trophic cascade threat, and recommends specific authority to alert.' },
    { icon: '🐢', title: 'Species Trophic Monitor', desc: '5 IUCN-listed species tracked with MSA index. Hawksbill Turtle (CR), Whale Shark (EN), Dugong (functionally extinct in Karnataka). Interactive food web shows cascade consequences.' },
    { icon: '🎣', title: 'Fisherman Advisory System', desc: 'Fishing Mortality (F) vs Maximum Sustainable Yield (MSY) per zone. Real-time "Do Not Fish" advisories with safe zone alternatives — no smartphone required.' },
  ];

  return (
    <>
      {/* Scanline */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: 2, background: 'linear-gradient(90deg,transparent,var(--glow),transparent)', opacity: 0.3, zIndex: 10, pointerEvents: 'none' }} className="animate-scan" />

      <OceanCanvas />
      <Navbar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* HERO */}
        <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '140px 60px 80px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', padding: '6px 16px', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--glow)', marginBottom: 32, width: 'fit-content', animation: 'fadeUp 0.8s ease both' }}>
            <span style={{ width: 6, height: 6, background: 'var(--bio)', borderRadius: '50%' }} className="animate-blink" />
            BGSCET Hackathon 2025 — Karnataka Coastline
          </div>

          <h1 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(3.2rem,7.5vw,7rem)', lineHeight: 0.92, letterSpacing: '-0.04em', color: '#fff', animation: 'fadeUp 0.8s 0.1s ease both' }}>
            India&apos;s Marine<br />
            <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(0,212,255,0.6)' }}>Trophic Collapse</span><br />
            <span style={{ background: 'linear-gradient(90deg,var(--glow),var(--pulse))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Early Warning System</span>
          </h1>

          <p style={{ maxWidth: 520, marginTop: 32, fontSize: '0.9rem', lineHeight: 1.8, color: 'var(--muted)', animation: 'fadeUp 0.8s 0.2s ease both' }}>
            BlueWhale monitors 5 IUCN-aligned ecosystem indicators across Karnataka&apos;s 320km coastline — computing real-time regime shift probability before irreversible collapse occurs.
          </p>

          <div style={{ display: 'flex', gap: 16, marginTop: 48, animation: 'fadeUp 0.8s 0.3s ease both' }}>
            <Link href="/map" style={{ background: 'linear-gradient(135deg,var(--glow),var(--pulse))', color: 'var(--abyss)', padding: '16px 36px', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', display: 'inline-block', transition: 'transform 0.2s, box-shadow 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 20px 60px rgba(0,212,255,0.4)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = ''; (e.currentTarget as HTMLAnchorElement).style.boxShadow = ''; }}>
              Explore Map →
            </Link>
            <Link href="/scan" style={{ background: 'transparent', color: 'var(--text)', padding: '16px 36px', fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', display: 'inline-block', border: '1px solid var(--border)', transition: 'border-color 0.3s, color 0.3s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--glow)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--glow)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)'; }}>
              Run AI Scan →
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 48, marginTop: 80, paddingTop: 40, borderTop: '1px solid var(--border)', animation: 'fadeUp 0.8s 0.4s ease both', flexWrap: 'wrap' }}>
            <StatCounter target={320} suffix="km" label="Karnataka coastline monitored" />
            <StatCounter target={6} suffix="" label="Coastal zones tracked" />
            <StatCounter target={5} suffix="" label="IUCN threatened species" />
            <StatCounter target={73} suffix="%" label="Max regime shift probability" />
          </div>
        </section>

        {/* TICKER */}
        <div style={{ background: 'rgba(0,212,255,0.05)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden', padding: '14px 0' }}>
          <div style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap' }} className="animate-ticker">
            {['Trophic Cascade Prediction', 'Dissolved Oxygen Monitoring', 'MSA Biodiversity Index', 'Regime Shift Probability', 'Fishing Mortality vs MSY', 'MARPOL Pollution Classification', 'AI Vision Analysis', 'Karnataka Coastline', 'Trophic Cascade Prediction', 'Dissolved Oxygen Monitoring', 'MSA Biodiversity Index', 'Regime Shift Probability', 'Fishing Mortality vs MSY', 'MARPOL Pollution Classification', 'AI Vision Analysis', 'Karnataka Coastline'].map((item, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '0 32px', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                <span style={{ color: 'var(--glow)' }}>◆</span> {item}
              </span>
            ))}
          </div>
        </div>

        {/* PROBLEM */}
        <section style={{ padding: '120px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <RevealSection>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--glow)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ display: 'block', width: 24, height: 1, background: 'var(--glow)' }} />
              The Crisis
            </div>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.2rem)', lineHeight: 1.05, letterSpacing: '-0.03em', color: '#fff', marginBottom: 24 }}>
              Every existing tool<br />detects what&apos;s already dead.
            </h2>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.9, color: 'var(--muted)' }}>
              BlueWhale predicts what&apos;s about to die — and fires alerts before the trophic cascade becomes irreversible. Because once a marine ecosystem crosses the regime shift threshold, internal feedback loops prevent recovery.
            </p>
            <div style={{ marginTop: 32, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(57,255,143,0.08)', border: '1px solid rgba(57,255,143,0.2)', padding: '6px 14px', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--bio)', textTransform: 'uppercase' }}>
              <span style={{ width: 6, height: 6, background: 'var(--bio)', borderRadius: '50%' }} className="animate-blink" />
              BlueWhale is monitoring now
            </div>
          </RevealSection>

          <RevealSection delay={150}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {problems.map((p, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '28px 32px', position: 'relative', overflow: 'hidden', borderLeft: `3px solid ${p.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, background: `${p.color}12`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{p.icon}</div>
                    <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{p.title}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.7 }}>{p.desc}</p>
                  <div style={{ marginTop: 10, display: 'inline-block', background: `${p.badgeColor}18`, color: p.badgeColor, padding: '2px 10px', fontSize: '0.65rem', letterSpacing: '0.08em' }}>⚠ {p.badge}</div>
                </div>
              ))}
            </div>
          </RevealSection>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: '120px 60px', background: 'rgba(0,5,15,0.8)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <RevealSection>
            <div style={{ textAlign: 'center', marginBottom: 80 }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--glow)', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <span style={{ display: 'block', width: 24, height: 1, background: 'var(--glow)' }} /> How It Works
              </div>
              <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.2rem)', color: '#fff', letterSpacing: '-0.03em' }}>
                Detect → Analyze → Alert
              </h2>
            </div>
          </RevealSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
            {steps.map((s, i) => (
              <RevealSection key={i} delay={i * 150}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '48px 36px', position: 'relative', overflow: 'hidden', height: '100%' }}>
                  <div style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic', fontSize: '5rem', color: 'rgba(0,212,255,0.06)', lineHeight: 1, position: 'absolute', top: 16, right: 24 }}>{s.num}</div>
                  <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,rgba(0,212,255,0.15),rgba(10,240,192,0.05))', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: 24 }}>{s.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: 12 }}>{s.title}</h3>
                  <p style={{ fontSize: '0.8rem', lineHeight: 1.8, color: 'var(--muted)' }}>{s.desc}</p>
                  <span style={{ display: 'inline-block', marginTop: 20, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)', color: 'var(--glow)', fontSize: '0.65rem', letterSpacing: '0.1em', padding: '4px 12px' }}>{s.tag}</span>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section style={{ padding: '120px 60px' }}>
          <RevealSection>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60 }}>
              <div>
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--glow)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ display: 'block', width: 24, height: 1, background: 'var(--glow)' }} /> Platform Features
                </div>
                <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.2rem)', color: '#fff', letterSpacing: '-0.03em' }}>
                  Built to predict,<br />not just report.
                </h2>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', maxWidth: 280, lineHeight: 1.8 }}>Designed for hackathon judges and real-world coastal authorities.</p>
            </div>
          </RevealSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 2 }}>
            {features.map((f, i) => (
              <RevealSection key={i} delay={i * 100}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 40, display: 'grid', gridTemplateColumns: '48px 1fr', gap: 24, alignItems: 'start' }}>
                  <div style={{ width: 48, height: 48, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{f.icon}</div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: 8 }}>{f.title}</h4>
                    <p style={{ fontSize: '0.78rem', lineHeight: 1.8, color: 'var(--muted)' }}>{f.desc}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>

        {/* IMPACT NUMBERS */}
        <section style={{ padding: '120px 60px', background: 'linear-gradient(180deg,rgba(0,5,15,0.9) 0%,rgba(0,20,40,0.5) 100%)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <RevealSection>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--glow)', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <span style={{ display: 'block', width: 24, height: 1, background: 'var(--glow)' }} /> Impact
            </div>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(2rem,4vw,3.2rem)', color: '#fff', letterSpacing: '-0.03em' }}>Numbers that matter.</h2>
          </RevealSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2, marginTop: 80 }}>
            {[
              { num: '84', suffix: '%', desc: 'Regime shift probability at Sasihithlu — 7 months to threshold' },
              { num: '67', suffix: '%', desc: 'Whale Shark sightings lost in Karnataka in 5 years' },
              { num: '320', suffix: 'km', desc: 'Karnataka coastline with no real-time trophic monitoring' },
              { num: '0', suffix: '₹', desc: 'New sensor hardware needed — works with existing cameras' },
            ].map((item, i) => (
              <RevealSection key={i} delay={i * 100}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '48px 24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,var(--glow),var(--pulse))', transform: 'scaleX(0)', transition: 'transform 0.4s' }} />
                  <div style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: '3rem', color: '#fff', lineHeight: 1 }}>
                    {item.num}<span style={{ color: 'var(--glow)' }}>{item.suffix}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', letterSpacing: '0.06em', color: 'var(--muted)', marginTop: 12, lineHeight: 1.7 }}>{item.desc}</div>
                </div>
              </RevealSection>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '160px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 600, height: 600, background: 'radial-gradient(circle,rgba(0,212,255,0.08) 0%,transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
          <RevealSection>
            <h2 style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, fontSize: 'clamp(2.5rem,6vw,5rem)', letterSpacing: '-0.04em', color: '#fff', lineHeight: 1, marginBottom: 24, position: 'relative' }}>
              The ocean can&apos;t wait<br />
              <span style={{ color: 'var(--glow)' }}>8 more weeks.</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.9 }}>
              3 lakh fishing families on Karnataka&apos;s coast depend on ecosystem health we&apos;re currently flying blind on. BlueWhale changes that.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <Link href="/map" style={{ background: 'linear-gradient(135deg,var(--glow),var(--pulse))', color: 'var(--abyss)', padding: '16px 40px', fontFamily: 'var(--font-syne)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block' }}>
                Explore Demo →
              </Link>
              <Link href="/species" style={{ background: 'transparent', color: 'var(--text)', padding: '16px 40px', fontFamily: 'var(--font-syne)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block', border: '1px solid var(--border)' }}>
                View Species →
              </Link>
            </div>
          </RevealSection>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,var(--glow),var(--pulse))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>🐋</div>
            <span style={{ fontFamily: 'var(--font-syne)', fontWeight: 800, color: '#fff' }}>BlueWhale</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>© 2025 BlueWhale · BGSCET Hackathon · Built by Kethan VR</p>
          <ul style={{ display: 'flex', gap: 24, listStyle: 'none', margin: 0, padding: 0 }}>
            <li><Link href="/map" style={{ fontSize: '0.7rem', color: 'var(--muted)', textDecoration: 'none' }}>Map</Link></li>
            <li><Link href="/scan" style={{ fontSize: '0.7rem', color: 'var(--muted)', textDecoration: 'none' }}>Scan</Link></li>
            <li><Link href="/species" style={{ fontSize: '0.7rem', color: 'var(--muted)', textDecoration: 'none' }}>Species</Link></li>
          </ul>
        </footer>
      </main>
    </>
  );
}
