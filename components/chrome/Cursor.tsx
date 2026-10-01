'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/scroll';

/**
 * Ring cursor with a red dot. Grows into a labelled disc over elements with
 * data-cursor="VIEW" / "DRAG" / etc.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.body.classList.add('has-cursor');
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3.out' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3.out' });
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08 });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08 });
    const move = (e: PointerEvent) => {
      document.body.classList.add('cursor-live');
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
      const t = (e.target as HTMLElement)?.closest?.('[data-cursor]') as HTMLElement | null;
      setLabel(t?.dataset.cursor ?? '');
    };
    window.addEventListener('pointermove', move);
    return () => {
      window.removeEventListener('pointermove', move);
      document.body.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div ref={ring} className={`cursor ${label ? 'big' : ''}`} aria-hidden="true">
        <span>{label}</span>
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
