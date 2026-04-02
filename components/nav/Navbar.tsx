'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '/map', label: 'Map' },
    { href: '/scan', label: 'AI Scan' },
    { href: '/species', label: 'Species' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 60px',
        backdropFilter: 'blur(20px)',
        background: 'rgba(2,11,24,0.85)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <div
          style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, var(--glow), var(--pulse))',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
          }}
        >
          🐋
        </div>
        <span
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: '1.3rem',
            letterSpacing: '-0.02em',
            color: '#fff',
          }}
        >
          BlueWhale
        </span>
      </Link>

      {/* Nav links */}
      <ul style={{ display: 'flex', gap: 36, listStyle: 'none', margin: 0, padding: 0 }}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              style={{
                color: pathname === link.href ? 'var(--glow)' : 'var(--muted)',
                textDecoration: 'none',
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-dm-mono)',
                transition: 'color 0.3s',
                borderBottom: pathname === link.href ? '1px solid var(--glow)' : 'none',
                paddingBottom: 2,
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="/map"
        style={{
          background: 'transparent',
          border: '1px solid var(--glow)',
          color: 'var(--glow)',
          padding: '9px 22px',
          fontFamily: 'var(--font-dm-mono)',
          fontSize: '0.72rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          transition: 'all 0.3s',
          display: 'inline-block',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = 'var(--glow)';
          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--abyss)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--glow)';
        }}
      >
        View Demo
      </Link>
    </nav>
  );
}
