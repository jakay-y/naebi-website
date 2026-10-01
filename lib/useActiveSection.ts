'use client';

import { useEffect, useState } from 'react';
import { SECTIONS } from './content';
import { ScrollTrigger } from './scroll';

/**
 * Index of the section under the viewport midline. Measures each section's pin-spacer
 * (when pinned) so long pinned sections stay active for their whole scroll distance.
 */
const outer = (el: HTMLElement) =>
  el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el;

/** Continuous position through the page in section units: 2.5 = halfway through the third section. */
export function sectionPosition() {
  const mid = window.innerHeight * 0.5;
  let pos = 0;
  SECTIONS.forEach((s, i) => {
    const el = document.getElementById(s.id);
    if (!el) return;
    const r = outer(el).getBoundingClientRect();
    if (r.top <= mid) pos = i + Math.min(Math.max((mid - r.top) / (r.height || 1), 0), 1);
  });
  return pos;
}

export function useActiveSection() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const update = () => {
      const mid = window.innerHeight * 0.5;
      let idx = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && outer(el).getBoundingClientRect().top <= mid) idx = i;
      });
      setActive(idx);
    };
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update, onRefresh: update });
    update();
    return () => st.kill();
  }, []);
  return active;
}
