'use client';

import { useEffect, useRef } from 'react';
import Lines from '../Lines';
import { AGENCIES } from '@/lib/content';
import { MEDIA } from '@/lib/media';
import { gsap, prefersReducedMotion } from '@/lib/scroll';

// CLIENT: replace with an approved line from the MD/CEO if preferred.
const QUOTE = 'Safety in the sky begins with knowing exactly who is in it.';

/**
 * 04: The mandate. Horizontal pinned scroll across the agencies Naebi works with,
 * over the offshore helideck at dusk. Background moves at a third of the speed.
 */
export default function Mandate() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)').matches;
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>('.mandate-quote .w');
      if (prefersReducedMotion() || !desktop) {
        gsap.set(words, { opacity: 1 });
        return;
      }
      const distance = () => (track.current?.scrollWidth ?? 0) - window.innerWidth;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });
      tl.to(track.current, { x: () => -distance(), ease: 'none', duration: 1 }, 0)
        .to('.mandate-bg', { xPercent: -6, ease: 'none', duration: 1 }, 0)
        .to('.mandate-progress i', { scaleX: 1, ease: 'none', duration: 1 }, 0)
        .to(words, { opacity: 1, stagger: 0.012, ease: 'none', duration: 0.08 }, 0.8);
      gsap.utils.toArray<HTMLElement>('.agency').forEach((card) => {
        gsap.from(card, {
          y: 60,
          rotate: 2,
          opacity: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: tl,
            start: 'left 95%',
            end: 'left 55%',
            scrub: true,
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="mandate" ref={root} className="mandate" aria-label="Mandate and partners">
      <div className="mandate-bg">
        <img src={MEDIA.helipadMin} alt="" loading="lazy" />
      </div>
      <div ref={track} className="mandate-track">
        <div className="mandate-intro">
          <span className="eyebrow" data-reveal="fade">
            05 · Authority
          </span>
          <Lines lines={['Mandated to watch', 'the rotary-wing', 'sky.']} className="h-md" />
          <p className="lede" data-reveal="fade">
            Under a mandate from the Federal Ministry of Aviation, Naebi works alongside Nigeria’s aviation agencies to
            monitor civil helicopter operations and collect landing and take-off levies on their behalf.
          </p>
        </div>

        {AGENCIES.map((a, i) => (
          <article key={a.code} className="agency glass" data-cursor="READ">
            <span className="idx">
              {String(i + 1).padStart(2, '0')} / {String(AGENCIES.length).padStart(2, '0')}
            </span>
            <div>
              <div className="code num">{a.code}</div>
            </div>
            <div>
              <h3>{a.name}</h3>
              <p>{a.role}</p>
            </div>
          </article>
        ))}

        <div className="mandate-quote">
          <blockquote>
            {QUOTE.split(' ').map((w, i) => (
              <span key={i} className="w">
                {w}{' '}
              </span>
            ))}
          </blockquote>
          <cite>Naebi Dynamic Concepts</cite>
        </div>
      </div>
      <div className="mandate-progress" aria-hidden="true">
        <i />
      </div>
    </section>
  );
}
