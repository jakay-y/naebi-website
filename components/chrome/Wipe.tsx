'use client';

import { useEffect, useRef } from 'react';
import { gsap, scrollToTarget, prefersReducedMotion } from '@/lib/scroll';

let runWipe: ((target: string) => void) | null = null;

/** Navigate with the rotor-blade wipe: two dark blades close diagonally, we jump, they open. */
export function rotorWipe(target: string) {
  if (runWipe) runWipe(target);
  else scrollToTarget(target);
}

export default function Wipe() {
  const a = useRef<HTMLElement>(null);
  const b = useRef<HTMLElement>(null);

  useEffect(() => {
    // Each blade covers half the rotated screen and grows from its outer edge toward the centre (see .wipe CSS).
    let busy = false;
    runWipe = (target) => {
      if (prefersReducedMotion()) return scrollToTarget(target, true);
      if (busy) return;
      busy = true;
      gsap
        .timeline({ onComplete: () => void (busy = false) })
        .to([a.current, b.current], { scaleY: 1, duration: 0.6, ease: 'expo.in', stagger: 0.05 })
        .add(() => scrollToTarget(target, true))
        .to([a.current, b.current], { scaleY: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05 }, '+=0.12');
    };
    return () => {
      runWipe = null;
    };
  }, []);

  return (
    <div className="wipe" aria-hidden="true">
      <div className="wipe-rot">
        <i ref={a} />
        <i ref={b} />
      </div>
    </div>
  );
}
