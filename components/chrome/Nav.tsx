'use client';

import { useEffect, useState } from 'react';
import { NAV, SECTIONS } from '@/lib/content';
import { useActiveSection } from '@/lib/useActiveSection';
import { ScrollTrigger } from '@/lib/scroll';
import { rotorWipe } from './Wipe';

export function BrandMark({ className = 'brand-mark' }: { className?: string }) {
  // Placeholder mark: rotor disc over a radar ring. Replace with the official Naebi logo SVG.
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18.5" stroke="currentColor" strokeOpacity="0.5" />
      <circle cx="20" cy="20" r="11" stroke="currentColor" strokeOpacity="0.25" />
      <path d="M4 20h32M20 4v32" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" transform="rotate(28 20 20)" />
      <circle cx="20" cy="20" r="3" fill="#e3262b" />
    </svg>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const activeIdx = useActiveSection();
  const active = `#${SECTIONS[activeIdx]?.id}`;

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 80,
      end: 'max',
      onToggle: (s) => setScrolled(s.isActive),
    });
    return () => st.kill();
  }, []);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    rotorWipe(href);
  };

  return (
    <>
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#hero" className="brand" onClick={go('#hero')} aria-label="Naebi Dynamic Concepts, home">
          <BrandMark />
          <span>
            NAEBI DYNAMIC
            <small>CONCEPTS LTD</small>
          </span>
        </a>
        <nav className="nav-pill glass" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={go(n.href)} className={active === n.href ? 'active' : ''}>
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="nav-cta" onClick={go('#contact')} data-magnetic>
          <span className="dot" /> Book a briefing
        </a>
        <button className="nav-burger glass" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? 'Close' : 'Menu'}
        </button>
      </header>
      <nav className={`nav-sheet glass ${open ? 'open' : ''}`} aria-label="Mobile">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} onClick={go(n.href)}>
            {n.label}
          </a>
        ))}
        <a href="#contact" onClick={go('#contact')}>
          Book a briefing →
        </a>
      </nav>
    </>
  );
}
