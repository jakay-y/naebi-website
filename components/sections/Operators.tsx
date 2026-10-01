'use client';

import { useEffect, useRef } from 'react';
import Lines from '../Lines';
import { NEWS } from '@/lib/content';
import { MEDIA } from '@/lib/media';
import { gsap, prefersReducedMotion } from '@/lib/scroll';
import { rotorWipe } from '../chrome/Wipe';

const Arrow = () => (
  <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true">
    <path d="M0 6h20M15 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

/** 06: Control room. We land in the Naebi operations centre, then split by audience. */
export default function Operators() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ops-hero-media',
        { scale: 1.2, yPercent: -6 },
        {
          scale: 1,
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: '.ops-hero', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
      gsap.from('.ops-card', {
        y: 90,
        opacity: 0,
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.ops-cards', start: 'top 90%' },
      });
      gsap.from('.news-item', {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.news-track', start: 'top 88%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="operators" ref={root} className="operators" aria-label="Operators and agencies">
      <div className="ops-hero">
        <div className="ops-hero-media">
          <img src={MEDIA.controlRoomMin} alt="Naebi surveillance operations room at night" loading="lazy" />
          <div className="ops-glow" />
        </div>
        <div className="ops-hero-copy">
          <span className="eyebrow" data-reveal="fade">
            07 · Control room
          </span>
          <Lines lines={['Eyes on every', 'movement.', 'Day and night.']} className="h-lg" />
        </div>
      </div>

      <div className="wrap">
        <div className="ops-cards">
          <article className="ops-card glass" data-cursor="OPEN">
            <span className="tick" />
            <div>
              <span className="eyebrow">For operators</span>
              <h3 style={{ marginTop: 18 }}>Fly compliant. Pay clearly.</h3>
              <p className="lede">
                Register your fleet, see every logged movement and settle landing and take-off levies with a full audit
                trail.
              </p>
            </div>
            <ul>
              <li>
                Fleet registration <span>01</span>
              </li>
              <li>
                Movement history <span>02</span>
              </li>
              <li>
                Levy statements &amp; payment <span>03</span>
              </li>
            </ul>
            <div style={{ marginTop: 28 }}>
              <button className="btn btn-solid" data-magnetic onClick={() => rotorWipe('#contact')}>
                Operator enquiry
              </button>
            </div>
          </article>

          <article className="ops-card glass" data-cursor="OPEN">
            <span className="tick" />
            <div>
              <span className="eyebrow">For agencies</span>
              <h3 style={{ marginTop: 18 }}>The complete rotary-wing picture.</h3>
              <p className="lede">
                Verified movement data and reporting for NAMA, NCAA and FAAN, covering sites no tower can see.
              </p>
            </div>
            <ul>
              <li>
                Real-time surveillance feed <span>01</span>
              </li>
              <li>
                Movement &amp; anomaly reports <span>02</span>
              </li>
              <li>
                Levy reconciliation <span>03</span>
              </li>
            </ul>
            <div style={{ marginTop: 28 }}>
              <button className="btn btn-outline" data-magnetic onClick={() => rotorWipe('#contact')}>
                Request a briefing
              </button>
            </div>
          </article>
        </div>

        <div className="news">
          <div className="news-head">
            <div>
              <span className="eyebrow" data-reveal="fade">
                Newsroom
              </span>
              <Lines lines={['Latest from Naebi']} className="h-md" />
            </div>
          </div>
          <div className="news-track" data-cursor="DRAG">
            {NEWS.map((n, i) => (
              <a
                key={n.title}
                className="news-item"
                href={n.href}
                target={n.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                onClick={(e) => {
                  if (!n.href.startsWith('#')) return;
                  e.preventDefault();
                  rotorWipe(n.href);
                }}
              >
                <div className="meta">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    {n.source} · {n.date}
                  </span>
                </div>
                <h4>{n.title}</h4>
                <span className="go">
                  Read <Arrow />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
