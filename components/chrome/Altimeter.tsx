'use client';

import { useEffect, useRef } from 'react';
import { gsap, scrollState } from '@/lib/scroll';
import { sectionPosition } from '@/lib/useActiveSection';

// Altitude per section (same order as SECTIONS): arrival in the air, on the ground
// inside HQ, then climb for the national picture and descend to touchdown.
const ALT = [1500, 0, 400, 12500, 5000, 2500, 600, 0];

function altitudeAt(pos: number) {
  const i = Math.min(Math.floor(pos), ALT.length - 1);
  const f = pos - i;
  // Hold each section's altitude, transition over its last third.
  const t = Math.min(Math.max((f - 0.66) / 0.34, 0), 1);
  const s = t * t * (3 - 2 * t);
  const a = ALT[i];
  const b = ALT[Math.min(i + 1, ALT.length - 1)];
  return a + (b - a) * s;
}

/** Bottom-right HUD: altitude + heading that respond to scroll. The signature detail. */
export default function Altimeter() {
  const alt = useRef<HTMLSpanElement>(null);
  const hdg = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    let shown = 1500;
    const tick = () => {
      const target = altitudeAt(sectionPosition());
      shown += (target - shown) * 0.08;
      const v = Math.max(0, Math.round(shown / 10) * 10);
      if (alt.current) alt.current.textContent = v.toLocaleString('en-US').padStart(6, '0');
      if (bar.current) bar.current.style.height = `${Math.min(100, (shown / 12500) * 100)}%`;
      if (hdg.current) {
        const h = Math.round((112 + scrollState.page * 248) % 360);
        hdg.current.textContent = String(h).padStart(3, '0') + '°';
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <div className="hud glass" aria-hidden="true">
      <div className="bar">
        <i ref={bar} />
      </div>
      <div>
        <div className="k">ALT FT</div>
        <span ref={alt} className="v">
          01,500
        </span>
      </div>
      <div className="sep" style={{ width: 1, height: 28, background: 'rgba(255,255,255,.15)' }} />
      <div className="hdg">
        <div className="k">HDG</div>
        <span ref={hdg} className="v" style={{ minWidth: '4ch' }}>
          112°
        </span>
      </div>
    </div>
  );
}
