'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/scroll';
import { MEDIA } from '@/lib/media';
import { rotorWipe } from '../chrome/Wipe';

/**
 * 01: Arrival. A helicopter flies past, framed in a riveted window (Railroad-style).
 * It plays once after the preloader and holds on its last frame; scrolling pushes us
 * through the window and down into Naebi HQ.
 */
export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const shade = useRef<HTMLDivElement>(null);
  const [ended, setEnded] = useState(false);

  // Mouse parallax: the view behind the glass drifts against the frame.
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    const mx = gsap.quickTo(media.current, 'x', { duration: 1.4, ease: 'power3.out' });
    const my = gsap.quickTo(media.current, 'y', { duration: 1.4, ease: 'power3.out' });
    const cx = gsap.quickTo(content.current, 'x', { duration: 1.6, ease: 'power3.out' });
    const cy = gsap.quickTo(content.current, 'y', { duration: 1.6, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mx(-nx * 24);
      my(-ny * 14);
      cx(nx * 8);
      cy(ny * 6);
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  // Scroll exit: the window opens to full bleed as HQ rises over it.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          // pinSpacing off: HQ slides up over the hero while the window opens, no dead scroll.
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=100%', scrub: 0.6, pin: true, pinSpacing: false },
        })
        .to('.hero-window', { '--inset': '0px', '--radius': '0px', ease: 'power2.inOut', duration: 0.5 } as gsap.TweenVars, 0)
        .to('.hero-frame', { opacity: 0, scale: 1.15, ease: 'power2.in', duration: 0.45 }, 0)
        .to('.hero-content', { yPercent: -24, opacity: 0, filter: 'blur(8px)', ease: 'power1.in', duration: 0.5 }, 0)
        .to('.hero-meta', { opacity: 0, duration: 0.3 }, 0)
        .to('.hero-media', { scale: 1.6, ease: 'power2.in', duration: 1 }, 0.1)
        .to(shade.current, { opacity: 0.85, ease: 'power2.in', duration: 0.6 }, 0.4);
    }, root);
    return () => ctx.revert();
  }, []);

  // Intro once the preloader opens: start the flyby and bring the copy in as it passes.
  useEffect(() => {
    if (!ready) return;
    const v = video.current;
    const reduce = prefersReducedMotion();
    if (v && !reduce) {
      v.currentTime = 0;
      v.play().catch(() => setEnded(true));
    } else setEnded(true);
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap
        .timeline({ delay: 0.15 })
        .from('.hero-window', { '--inset': '0px', duration: 2.2, ease: 'expo.inOut' } as gsap.TweenVars, 0)
        .from('.hero-frame', { opacity: 0, scale: 1.08, duration: 2, ease: 'expo.inOut' }, 0.1)
        .from('.hero-badge', { y: 16, autoAlpha: 0, duration: 1, ease: 'expo.out' }, 1.6)
        .from(
          '.hero-title .line > span',
          { yPercent: 115, filter: 'blur(12px)', duration: 1.4, ease: 'expo.out', stagger: 0.09 },
          1.75,
        )
        .from('.hero-sub', { y: 18, autoAlpha: 0, duration: 1.2, ease: 'expo.out' }, 2.1)
        .from('.hero-form', { y: 18, autoAlpha: 0, scale: 0.96, duration: 1.2, ease: 'expo.out' }, 2.25)
        .from('.hero-meta > *', { autoAlpha: 0, y: 10, stagger: 0.08, duration: 1 }, 2.4);
    }, root);
    return () => ctx.revert();
  }, [ready]);

  const replay = () => {
    const v = video.current;
    if (!v) return;
    setEnded(false);
    v.currentTime = 0;
    v.play().catch(() => setEnded(true));
  };

  return (
    <section id="hero" ref={root} className="hero" aria-label="Introduction">
      <div className="hero-window">
        <div className="hero-glass-clip">
          <div ref={media} className="hero-media">
            <video
              ref={video}
              className={ended ? 'holding' : ''}
              poster={MEDIA.heroPoster}
              muted
              playsInline
              preload="auto"
              onEnded={() => setEnded(true)}
              aria-label="A helicopter flies past against a blue sky"
            >
              <source src={MEDIA.heroVideoWebm} type="video/webm" />
              <source src={MEDIA.heroVideo} type="video/mp4" />
            </video>
          </div>
          <div className="hero-sheen" />
        </div>
        <div className="hero-frame" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <i key={i} className="rivet" style={{ ['--i' as string]: i }} />
          ))}
        </div>
      </div>

      <div ref={content} className="hero-content">
        <span className="pill hero-badge">
          <span style={{ width: 6, height: 6, borderRadius: 9, background: '#e3262b' }} />
          Mandated partner · Federal Ministry of Aviation
        </span>
        <h1 className="display hero-title" aria-label="Every Rotor. Every Landing. Accounted For.">
          <span className="line" aria-hidden="true">
            <span>Every Rotor.</span>
          </span>
          <span className="line" aria-hidden="true">
            <span>Every Landing.</span>
          </span>
          <span className="line" aria-hidden="true">
            <span>Accounted For.</span>
          </span>
        </h1>
        <p className="hero-sub">
          Naebi Dynamic Concepts monitors civil helicopter operations across Nigerian airspace, from airport aprons to
          offshore helidecks, with surveillance and data-acquisition technology built for safety and accountability.
        </p>
        <form
          className="hero-form glass"
          onSubmit={(e) => {
            e.preventDefault();
            rotorWipe('#contact');
          }}
        >
          <label htmlFor="hero-op" className="sr-only">
            Operator ID or email
          </label>
          <input id="hero-op" type="text" placeholder="Enter operator ID or email" autoComplete="email" />
          <button type="submit">Get access</button>
        </form>
      </div>

      <div ref={shade} className="hero-shade" />

      <div className="hero-meta">
        <span>04°49′N 07°02′E · Port Harcourt</span>
        <button onClick={replay} className="hero-replay" data-cursor="PLAY">
          ↻ Replay flyby
        </button>
        <span>Scroll to enter HQ ↓</span>
      </div>
    </section>
  );
}
