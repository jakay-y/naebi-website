'use client';

import { useEffect, useRef, useState } from 'react';
import { HQ_FRAMES } from '@/lib/media';
import { HQ_PATH, HQ_ZONES, zoneAt } from '@/lib/hq';
import { gsap, ScrollTrigger } from '@/lib/scroll';

const N = HQ_FRAMES.count;
// How much of the pin is spent "reconstructing" the twin before the walk starts.
const BOOT = 0.06;

/** Load order: first frame, then coarse-to-fine strides so any scroll position has a near frame fast. */
function loadOrder() {
  const seen = new Set<number>();
  const order: number[] = [];
  for (const stride of [32, 16, 8, 4, 2, 1]) {
    for (let i = 0; i < N; i += stride) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  return order;
}

function mapPoint(p: number): [number, number] {
  const i = zoneAt(p);
  const a = HQ_ZONES[i];
  const b = HQ_ZONES[Math.min(i + 1, HQ_ZONES.length - 1)];
  const span = (b.at - a.at) || 1;
  const t = Math.min(Math.max((p - a.at) / span, 0), 1);
  return [a.map[0] + (b.map[0] - a.map[0]) * t, a.map[1] + (b.map[1] - a.map[1]) * t];
}

/**
 * 02: Inside Naebi. A digital twin of the Rumueme headquarters: the walkthrough is
 * scrubbed frame by frame by scroll, wrapped in a survey HUD (zone, schematic, sync).
 */
export default function Headquarters() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const ambient = useRef<HTMLCanvasElement>(null);
  const titles = useRef<HTMLDivElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const frameLbl = useRef<HTMLSpanElement>(null);
  const syncLbl = useRef<HTMLSpanElement>(null);
  const [zone, setZone] = useState(0);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    const cv = canvas.current!;
    const amb = ambient.current!;
    const ctx = cv.getContext('2d')!;
    const actx = amb.getContext('2d')!;
    const frames: (HTMLImageElement | null)[] = new Array(N).fill(null);
    let count = 0;
    let alive = true;

    // Progressive loading, a few at a time so the first frames win the network.
    const order = loadOrder();
    let next = 0;
    const pump = () => {
      if (!alive || next >= order.length) return;
      const i = order[next++];
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        frames[i] = img;
        count++;
        if (count % 12 === 0 || count === N) setLoaded(count);
        if (i === 0) draw(true);
        pump();
      };
      img.onerror = () => pump();
      img.src = HQ_FRAMES.src(i);
    };
    for (let k = 0; k < 6; k++) pump();

    const nearest = (i: number) => {
      for (let d = 0; d < 48; d++) {
        if (frames[i - d]) return frames[i - d];
        if (frames[i + d]) return frames[i + d];
      }
      return null;
    };

    // Canvas sizing: cover-fit the portrait footage into the viewport element.
    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      amb.width = 48;
      amb.height = 27;
      draw(true);
    };

    const state = { target: 0, cur: 0, boot: 0, drawn: -1, bootDrawn: -1 };
    const scratch = document.createElement('canvas');
    const sctx = scratch.getContext('2d')!;

    function draw(force = false) {
      const fi = Math.round(state.cur);
      const bootQ = Math.round(state.boot * 40);
      if (!force && fi === state.drawn && bootQ === state.bootDrawn) return;
      const img = nearest(fi);
      if (!img) return;
      state.drawn = fi;
      state.bootDrawn = bootQ;
      const { width: W, height: H } = cv;
      const s = Math.max(W / img.width, H / img.height);
      const w = img.width * s;
      const h = img.height * s;
      const x = (W - w) / 2;
      const y = (H - h) / 2;
      if (state.boot < 1) {
        // "Reconstruction": the twin resolves from coarse voxels into the live view.
        const k = 0.02 + 0.98 * Math.pow(state.boot, 2.2);
        scratch.width = Math.max(2, Math.round(W * k));
        scratch.height = Math.max(2, Math.round(H * k));
        sctx.drawImage(img, x * k, y * k, w * k, h * k);
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(scratch, 0, 0, W, H);
        ctx.imageSmoothingEnabled = true;
      } else {
        ctx.drawImage(img, x, y, w, h);
      }
      actx.drawImage(img, 0, 0, amb.width, amb.height);
    }

    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);

    // Ease the playhead toward the scroll target so scrubbing feels like a dolly, not a flipbook.
    const tick = () => {
      state.cur += (state.target - state.cur) * 0.18;
      if (Math.abs(state.target - state.cur) < 0.01) state.cur = state.target;
      draw();
    };
    gsap.ticker.add(tick);

    let lastZone = -1;
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: '+=520%',
      pin: true,
      scrub: true,
      onUpdate: (s) => {
        const p = s.progress;
        state.boot = Math.min(p / BOOT, 1);
        const walk = Math.max(0, (p - BOOT) / (1 - BOOT));
        state.target = walk * (N - 1);
        const z = zoneAt(walk);
        if (z !== lastZone) {
          lastZone = z;
          setZone(z);
        }
        const [mx, my] = mapPoint(walk);
        dot.current?.setAttribute('cx', mx.toFixed(1));
        dot.current?.setAttribute('cy', my.toFixed(1));
        if (trail.current) trail.current.style.strokeDashoffset = String(1 - walk);
        if (frameLbl.current) frameLbl.current.textContent = String(Math.round(walk * (N - 1))).padStart(3, '0');
        if (syncLbl.current) syncLbl.current.textContent = (Math.min(state.boot, 1) * 100).toFixed(1) + '%';
        root.current?.style.setProperty('--boot', String(state.boot));
      },
    });

    return () => {
      alive = false;
      ro.disconnect();
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, []);

  // Zone change: roll the title and sweep a scan line through the twin.
  useEffect(() => {
    gsap.to(titles.current, { yPercent: (-100 / HQ_ZONES.length) * zone, duration: 0.9, ease: 'expo.out' });
    gsap.fromTo('.hq-scan', { yPercent: -10, opacity: 1 }, { yPercent: 110, opacity: 0.2, duration: 1.1, ease: 'power2.inOut' });
  }, [zone]);

  const z = HQ_ZONES[zone];

  return (
    <section id="hq" ref={root} className="hq" aria-label="Inside Naebi headquarters">
      <canvas ref={ambient} className="hq-ambient" aria-hidden="true" />
      <div className="hq-floor" aria-hidden="true" />

      <div className="hq-viewport" data-cursor="SCROLL">
        <canvas ref={canvas} className="hq-canvas" role="img" aria-label={`Naebi headquarters: ${z.title}`} />
        <div className="hq-scanlines" aria-hidden="true" />
        <div className="hq-scan" aria-hidden="true" />
        <div className="hq-boot" aria-hidden="true">
          <span>Digital twin · reconstructing</span>
        </div>
        <span className="hq-corner tl" />
        <span className="hq-corner tr" />
        <span className="hq-corner bl" />
        <span className="hq-corner br" />
        <div className="hq-tag" aria-hidden="true">
          <b>{z.code}</b> · {z.title}
        </div>
        <div className="hq-rec" aria-hidden="true">
          <i /> LIVE TWIN
        </div>
      </div>

      <div className="hq-left">
        <span className="eyebrow">02 · Inside Naebi</span>
        <div className="hq-title-wrap">
          <div ref={titles} className="hq-titles">
            {HQ_ZONES.map((zz) => (
              <h2 key={zz.code}>{zz.title}</h2>
            ))}
          </div>
        </div>
        <div className="hq-body" aria-live="polite">
          {HQ_ZONES.map((zz, i) => (
            <p key={zz.code} className={i === zone ? 'on' : ''}>
              {zz.body}
            </p>
          ))}
        </div>
        <div className="hq-readout">
          <div>
            <span className="k">Sync</span>
            <span ref={syncLbl} className="v">
              0.0%
            </span>
          </div>
          <div>
            <span className="k">Frame</span>
            <span className="v">
              <span ref={frameLbl}>000</span>/{N - 1}
            </span>
          </div>
          <div>
            <span className="k">Cache</span>
            <span className="v">{Math.round((loaded / N) * 100)}%</span>
          </div>
        </div>
      </div>

      <div className="hq-right">
        <div className="hq-map glass">
          <div className="hq-map-head">
            <span>HQ · Ground floor</span>
            <span className="muted">Schematic</span>
          </div>
          <svg viewBox="0 0 100 210" aria-hidden="true">
            <rect x="8" y="14" width="84" height="176" rx="3" className="wall" />
            <rect x="8" y="14" width="84" height="56" className="room" />
            <rect x="62" y="108" width="30" height="28" className="room" />
            <line x1="38" y1="190" x2="62" y2="190" className="door" />
            <path d={HQ_PATH} className="route-bg" pathLength={1} />
            <path ref={trail} d={HQ_PATH} className="route-fg" pathLength={1} />
            {HQ_ZONES.map((zz, i) => (
              <circle key={zz.code} cx={zz.map[0]} cy={zz.map[1]} r={i === zone ? 3 : 2} className={i <= zone ? 'wp on' : 'wp'} />
            ))}
            <circle ref={dot} cx={HQ_ZONES[0].map[0]} cy={HQ_ZONES[0].map[1]} r="4.5" className="you" />
          </svg>
        </div>
        <ol className="hq-zones">
          {HQ_ZONES.map((zz, i) => (
            <li key={zz.code} className={i === zone ? 'on' : i < zone ? 'done' : ''}>
              <span>{zz.code}</span>
              {zz.title}
            </li>
          ))}
        </ol>
      </div>

      <div className="hq-welcome" aria-hidden="true">
        <span className="eyebrow">Naebi Dynamic Concepts · Headquarters</span>
        <div className="display">Step inside.</div>
      </div>
    </section>
  );
}
