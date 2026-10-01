'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { AIRCRAFT_STATS, AIRCRAFT_STOPS, HOTSPOTS } from '@/lib/content';
import { MEDIA } from '@/lib/media';
import { gsap, ScrollTrigger, prefersReducedMotion, scrollState, scrollToTarget } from '@/lib/scroll';
import { rotorWipe } from '../chrome/Wipe';

const HelicopterScene = dynamic(() => import('../three/HelicopterScene'), { ssr: false });

/**
 * 03: The aircraft. Pinned studio stage (Valley Helicopters layout): the Bell 407
 * orbits through four stops as you scroll, with a big stat column on the right.
 */
export default function Aircraft() {
  const root = useRef<HTMLElement>(null);
  const titles = useRef<HTMLDivElement>(null);
  const ringArc = useRef<SVGCircleElement>(null);
  const [stop, setStop] = useState(0);
  const [hotspot, setHotspot] = useState<string | null>(null);
  const [use3d, setUse3d] = useState(false);
  const stRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)').matches;
    setUse3d(desktop && !!MEDIA.bell407Glb && !!document.createElement('canvas').getContext('webgl2'));
    if (!desktop || prefersReducedMotion()) return;

    const len = 2 * Math.PI * 48;
    const ctx = gsap.context(() => {
      stRef.current = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: true,
        onUpdate: (s) => {
          scrollState.aircraft = s.progress;
          const i = Math.min(AIRCRAFT_STOPS.length - 1, Math.floor(s.progress * AIRCRAFT_STOPS.length * 0.999));
          setStop(i);
          if (ringArc.current) ringArc.current.style.strokeDashoffset = String(len * (1 - s.progress));
        },
      });
      gsap.set(ringArc.current, { strokeDasharray: len, strokeDashoffset: len });
    }, root);
    return () => {
      ctx.revert();
      stRef.current = null;
    };
  }, []);

  useEffect(() => {
    gsap.to(titles.current, { yPercent: (-100 / AIRCRAFT_STOPS.length) * stop, duration: 0.9, ease: 'expo.out' });
  }, [stop]);

  // Chevrons jump the scroll to the matching stop inside the pin.
  const jump = (dir: number) => {
    const st = stRef.current;
    const next = Math.min(Math.max(stop + dir, 0), AIRCRAFT_STOPS.length - 1);
    if (!st) return setStop(next);
    const y = st.start + (st.end - st.start) * ((next + 0.5) / AIRCRAFT_STOPS.length);
    scrollToTarget(y);
  };

  const active = HOTSPOTS.find((h) => h.id === hotspot);

  return (
    <section id="aircraft" ref={root} className="aircraft" aria-label="The aircraft">
      <svg className="aircraft-ring" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="48" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6" />
        <circle
          ref={ringArc}
          cx="50"
          cy="50"
          r="48"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="0.6"
          transform="rotate(-90 50 50)"
        />
      </svg>

      {use3d ? (
        <div className="aircraft-canvas">
          <HelicopterScene
            onHotspot={(id) => setHotspot((h) => (h === id ? null : id))}
            active={hotspot}
            onFail={() => setUse3d(false)}
          />
        </div>
      ) : (
        <div className="aircraft-fallback">
          <img src={MEDIA.bell407} alt="Bell 407 helicopter in graphite livery with red rotor tips" loading="lazy" />
        </div>
      )}

      <div className="aircraft-left">
        <div className="counter">
          <button onClick={() => jump(-1)} aria-label="Previous">
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
              <path d="M9 1 2 8l7 7" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
          <span className="cur">{String(stop + 1).padStart(2, '0')}</span>
          <span className="tot">/ {String(AIRCRAFT_STOPS.length).padStart(2, '0')}</span>
          <button onClick={() => jump(1)} aria-label="Next">
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
              <path d="m1 1 7 7-7 7" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
        <div className="stop-title-wrap">
          <div ref={titles} className="stop-titles">
            {AIRCRAFT_STOPS.map((s) => (
              <h2 key={s.key}>{s.title}</h2>
            ))}
          </div>
        </div>
        <div className="stop-body" aria-live="polite">
          {AIRCRAFT_STOPS.map((s, i) => (
            <p key={s.key} className={i === stop ? 'on' : ''}>
              {s.body}
            </p>
          ))}
        </div>
        <div className="aircraft-actions">
          <button className="btn btn-solid" data-magnetic onClick={() => rotorWipe('#system')}>
            How it works
          </button>
          <button className="btn btn-outline" data-magnetic onClick={() => rotorWipe('#airspace')}>
            See coverage
          </button>
        </div>
      </div>

      <div className="aircraft-stats">
        {AIRCRAFT_STATS.map((s) => (
          <div key={s.label}>
            <span className="num" data-count={s.value} data-suffix={s.suffix}>
              {s.value}
              {s.suffix}
            </span>
            <span className="lbl">{s.label}</span>
          </div>
        ))}
      </div>

      <div className={`hotspot-card glass ${active ? '' : 'hidden'}`} role="dialog" aria-hidden={!active}>
        <button className="x" onClick={() => setHotspot(null)} aria-label="Close">
          ×
        </button>
        <h4>{active?.title}</h4>
        <p>{active?.body}</p>
      </div>
    </section>
  );
}
