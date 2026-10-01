'use client';

import { useEffect, useRef } from 'react';
import Lines from '../Lines';
import { BORDER_PATH, CITIES, RADAR_CENTER, ROUTE_PATHS, TRAFFIC } from '@/lib/nigeria';
import { gsap, prefersReducedMotion } from '@/lib/scroll';

const SWEEP = 6; // seconds per radar revolution (matches CSS)

/**
 * 03: The airspace. The camera "climbs" and the helicopter becomes one of many
 * blips on a radar picture of Nigeria; flight paths draw as you scroll.
 */
export default function Airspace() {
  const root = useRef<HTMLElement>(null);
  const map = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const routes = gsap.utils.toArray<SVGPathElement>('.route');
      routes.forEach((r) => {
        const l = r.getTotalLength();
        gsap.set(r, { strokeDasharray: l, strokeDashoffset: l });
      });
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 60%', scrub: 0.8 },
        })
        .fromTo(map.current, { scale: 1.35, rotate: -6, opacity: 0.2 }, { scale: 1, rotate: 0, opacity: 1, ease: 'power2.out', duration: 0.5 }, 0)
        .to(routes, { strokeDashoffset: 0, stagger: 0.04, ease: 'none', duration: 0.4 }, 0.15)
        .from('.city', { scale: 0, transformOrigin: 'center', stagger: 0.03, duration: 0.2 }, 0.1);
    }, root);
    return () => ctx.revert();
  }, []);

  const [rx, ry] = RADAR_CENTER;
  const R = 470;

  return (
    <section id="airspace" ref={root} className="airspace wrap" aria-label="National coverage">
      <div className="airspace-bg" />
      <div className="airspace-copy">
        <span className="eyebrow" data-reveal="fade">
          04 · The big picture
        </span>
        <Lines lines={['One sky.', 'Complete', 'visibility.']} className="h-lg" />
        <p className="lede" data-reveal="fade">
          Airports, airstrips, private helipads and offshore helidecks: wherever a civil helicopter lands or takes off
          in Nigeria, Naebi surveillance and data-acquisition devices are there to see it, log it and report it.
        </p>
        <div className="divider" data-reveal="draw" style={{ marginTop: 40 }} />
        <div className="airspace-legend">
          <div>
            <span className="num" data-count="37">
              37
            </span>
            <span className="lbl">States &amp; FCT</span>
          </div>
          <div>
            <span className="num" data-count="24" data-suffix="/7">
              24/7
            </span>
            <span className="lbl">Live picture</span>
          </div>
          <div>
            <span className="num">
              <span style={{ color: 'var(--red)' }}>●</span> PH
            </span>
            <span className="lbl">Operations HQ</span>
          </div>
        </div>
      </div>

      <div ref={map} className="airspace-map" data-cursor="SCAN">
        <svg viewBox="0 0 760 640" role="img" aria-label="Radar map of Nigeria with helicopter traffic and flight routes">
          <defs>
            <radialGradient id="landFill" cx="55%" cy="65%" r="70%">
              <stop offset="0%" stopColor="#1c222c" />
              <stop offset="100%" stopColor="#11151b" />
            </radialGradient>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <circle key={f} cx={rx} cy={ry} r={R * f} fill="none" stroke="rgba(255,255,255,0.07)" strokeDasharray="2 6" />
          ))}
          <line x1={rx - R} y1={ry} x2={rx + R} y2={ry} stroke="rgba(255,255,255,0.05)" />
          <line x1={rx} y1={ry - R} x2={rx} y2={ry + R} stroke="rgba(255,255,255,0.05)" />
          <path d={BORDER_PATH} fill="url(#landFill)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinejoin="round" />
          {ROUTE_PATHS.map((d, i) => (
            <path key={i} d={d} className="route" />
          ))}
          {TRAFFIC.map((t, i) => (
            <circle
              key={i}
              cx={t.x}
              cy={t.y}
              r={1.9}
              className="blip"
              style={{ animationDelay: `${t.delay * SWEEP - SWEEP}s` }}
            />
          ))}
          {CITIES.map((c) => (
            <g key={c.name} className="city">
              {c.hq && <circle cx={c.xy[0]} cy={c.xy[1]} r={14} fill="none" stroke="#e3262b" strokeOpacity="0.6" />}
              <circle cx={c.xy[0]} cy={c.xy[1]} r={c.hq ? 5 : 3.2} className={c.hq ? 'city-hq' : 'city-dot'} />
              <text x={c.xy[0] + 10} y={c.xy[1] - 8} className="city-label">
                {c.name}
              </text>
            </g>
          ))}
        </svg>
        <div
          className="radar"
          style={{
            left: `${((rx - R) / 760) * 100}%`,
            top: `${((ry - R) / 640) * 100}%`,
            width: `${((2 * R) / 760) * 100}%`,
            height: `${((2 * R) / 640) * 100}%`,
            animationDuration: `${SWEEP}s`,
          }}
        />
      </div>
    </section>
  );
}
