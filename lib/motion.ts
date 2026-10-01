'use client';

import { gsap, ScrollTrigger, prefersReducedMotion } from './scroll';

/**
 * Global reveal system. Every section opts in with data attributes:
 *   data-reveal="lines"  heading made of .line > span children, masked rise
 *   data-reveal="fade"   20px rise + fade
 *   data-reveal="image"  clip-path inset reveal with inner scale
 *   data-reveal="draw"   horizontal divider that draws from left
 *   data-count="1234"    number counts up (data-suffix optional)
 *   data-parallax="0.3"  moves at a fraction of scroll speed inside its section
 */
export function initReveals(root: ParentNode = document) {
  const reduce = prefersReducedMotion();
  const ctx = gsap.context(() => {
    root.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
      const spans = el.querySelectorAll('.line > span');
      if (reduce) return;
      gsap.from(spans, {
        yPercent: 115,
        rotate: 2,
        filter: 'blur(10px)',
        duration: 1.25,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    root.querySelectorAll<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
      if (reduce) return;
      gsap.from(el, {
        y: 24,
        autoAlpha: 0,
        duration: 1.1,
        ease: 'expo.out',
        delay: Number(el.dataset.delay ?? 0),
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });

    root.querySelectorAll<HTMLElement>('[data-reveal="image"]').forEach((el) => {
      if (reduce) return;
      const inner = el.querySelector('img, video, .inner');
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%' } });
      tl.fromTo(
        el,
        { clipPath: 'inset(14% 14% 14% 14% round 18px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.4, ease: 'expo.out' },
      );
      if (inner) tl.fromTo(inner, { scale: 1.22 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0);
    });

    root.querySelectorAll<HTMLElement>('[data-reveal="draw"]').forEach((el) => {
      if (reduce) return;
      gsap.fromTo(
        el,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 92%' } },
      );
    });

    root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix ?? '';
      const pad = el.dataset.pad ? Number(el.dataset.pad) : 0;
      const fmt = (v: number) => String(Math.round(v)).padStart(pad, '0') + suffix;
      if (reduce) {
        el.textContent = fmt(end);
        return;
      }
      const obj = { v: 0 };
      el.textContent = fmt(0);
      gsap.to(obj, {
        v: end,
        duration: 2,
        ease: 'power3.out',
        onUpdate: () => (el.textContent = fmt(obj.v)),
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });

    root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      if (reduce) return;
      const speed = Number(el.dataset.parallax);
      const section = el.closest('section') ?? el;
      gsap.fromTo(
        el,
        { yPercent: -speed * 40 },
        {
          yPercent: speed * 40,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });
  }, root as Element);

  ScrollTrigger.refresh();
  return () => ctx.revert();
}

/** Magnetic hover for buttons marked [data-magnetic]. */
export function initMagnetic() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
  const cleanups = els.map((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo(((e.clientX - r.left) / r.width - 0.5) * 16);
      yTo(((e.clientY - r.top) / r.height - 0.5) * 16);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  });
  return () => cleanups.forEach((c) => c());
}
