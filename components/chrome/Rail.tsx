'use client';

import { SECTIONS } from '@/lib/content';
import { useActiveSection } from '@/lib/useActiveSection';
import { rotorWipe } from './Wipe';

/** Thin left rail: section index (active turns red) and the rotated "Scroll on" cue. */
export default function Rail() {
  const active = useActiveSection();

  return (
    <aside className="rail" aria-label="Section index">
      <div className="rail-index">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            className={i === active ? 'active' : ''}
            onClick={() => rotorWipe(`#${s.id}`)}
            aria-label={`Go to ${s.label}`}
            title={s.label}
          >
            {String(i + 1).padStart(2, '0')}
          </button>
        ))}
      </div>
      <div className="rail-scroll" aria-hidden="true">
        <span>Scroll on</span>
        <svg width="14" height="30" viewBox="0 0 14 30" fill="none">
          <path d="M7 0v28M1 22l6 6 6-6" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>
    </aside>
  );
}
