'use client';

import { useEffect, useRef } from 'react';
import { gsap, lockScroll, prefersReducedMotion } from '@/lib/scroll';

/** Red arc draws a full circle while a counter runs 000→100, then the circle opens onto the flyby. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const arc = useRef<SVGCircleElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    lockScroll(true);
    window.scrollTo(0, 0);
    const finish = () => {
      lockScroll(false);
      onDone();
    };

    if (prefersReducedMotion()) {
      gsap.to(root.current, { autoAlpha: 0, duration: 0.3, onComplete: finish });
      return;
    }

    // Wait until the flyby can play through (or 4s max) so the reveal never opens onto a stalled video.
    const imgReady = new Promise<void>((res) => {
      const v = document.querySelector<HTMLVideoElement>('.hero-media video');
      if (!v || v.readyState >= 4) return res();
      v.addEventListener('canplaythrough', () => res(), { once: true });
      v.addEventListener('error', () => res(), { once: true });
      setTimeout(res, 4000);
    });

    const progress = { v: 0 };
    const len = 2 * Math.PI * 140;
    gsap.set(arc.current, { strokeDasharray: len, strokeDashoffset: len });

    const tl = gsap.timeline({ paused: true });
    tl.to(progress, {
      v: 100,
      duration: 2.1,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (count.current) count.current.textContent = String(Math.round(progress.v)).padStart(3, '0');
        if (arc.current) arc.current.style.strokeDashoffset = String(len * (1 - progress.v / 100));
      },
    })
      .to(count.current, { autoAlpha: 0, y: -10, duration: 0.4 }, '+=0.1')
      .to('.preloader .label', { autoAlpha: 0, duration: 0.3 }, '<')
      .to(arc.current, { attr: { r: 160 }, autoAlpha: 0, duration: 0.6, ease: 'expo.in' }, '<')
      .fromTo(
        root.current,
        { '--hole': '0%' } as gsap.TweenVars,
        {
          '--hole': '120%',
          duration: 1.3,
          ease: 'expo.inOut',
          onStart: finish,
        } as gsap.TweenVars,
      )
      .set(root.current, { display: 'none' });

    imgReady.then(() => tl.play());
    return () => {
      tl.kill();
    };
  }, [onDone]);

  return (
    <div
      ref={root}
      className="preloader"
      aria-hidden="true"
      style={{
        // The "hole" expands from the centre, revealing the hero beneath.
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent var(--hole, 0%), #000 calc(var(--hole, 0%) + 0.5%))',
        maskImage: 'radial-gradient(circle at 50% 50%, transparent var(--hole, 0%), #000 calc(var(--hole, 0%) + 0.5%))',
      }}
    >
      <svg viewBox="0 0 300 300">
        <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle
          ref={arc}
          cx="150"
          cy="150"
          r="140"
          fill="none"
          stroke="#e3262b"
          strokeWidth="1.5"
          transform="rotate(-90 150 150)"
        />
      </svg>
      <span ref={count} className="count">
        000
      </span>
      <span className="label">Naebi Dynamic Concepts · Acquiring signal</span>
    </div>
  );
}
