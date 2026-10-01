'use client';

import { useEffect, useRef, useState } from 'react';
import Lines from '../Lines';
import { SYSTEM_STEPS } from '@/lib/content';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/scroll';

function Crosshair() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="lock" aria-hidden="true">
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 1v6M12 17v6M1 12h6M17 12h6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

// Illustrative sample data for the dashboard mock. Not live records.
function DashState({ i, on }: { i: number; on: boolean }) {
  const cls = `dash-state ${on ? 'on' : ''}`;
  if (i === 0)
    return (
      <div className={cls}>
        <span className="dash-kicker">Detect · contact acquired</span>
        <div className="dash-scope">
          <span className="tgt" />
          <span className="tgt-label">5N-XXX · 1,450 FT · 118 KT</span>
        </div>
      </div>
    );
  if (i === 1)
    return (
      <div className={cls}>
        <span className="dash-kicker">Verify · national register</span>
        <div className="dash-row">
          <span>Registration</span>
          <b>5N-XXX</b>
        </div>
        <div className="dash-row">
          <span>Type</span>
          <b>Bell 407</b>
        </div>
        <div className="dash-row">
          <span>Operator</span>
          <b>Sample Operator Ltd</b>
        </div>
        <div className="dash-row">
          <span>Status</span>
          <b className="ok">● Verified</b>
        </div>
      </div>
    );
  if (i === 2)
    return (
      <div className={cls}>
        <span className="dash-kicker">Log · movement record</span>
        {[
          ['06:42', 'Port Harcourt · Take-off', 'ok'],
          ['07:18', 'Offshore helideck · Landing', 'ok'],
          ['08:05', 'Offshore helideck · Take-off', 'ok'],
          ['08:47', 'Bonny · Landing', 'warn'],
        ].map(([t, e, s]) => (
          <div className="dash-row" key={t}>
            <b>{t}</b>
            <span>{e}</span>
            <span className={s}>{s === 'ok' ? '● Logged' : '● Pending'}</span>
          </div>
        ))}
      </div>
    );
  return (
    <div className={cls}>
      <span className="dash-kicker">Levy · statement</span>
      <span className="muted" style={{ fontSize: 13 }}>
        Movements this period
      </span>
      <div className="dash-big">4 movements</div>
      <div className="dash-row">
        <span>Landing &amp; take-off levy</span>
        <b>Calculated</b>
      </div>
      <div className="dash-row">
        <span>Statement</span>
        <b className="ok">● Issued to operator</b>
      </div>
      <div className="dash-row">
        <span>Audit trail</span>
        <b>Complete</b>
      </div>
    </div>
  );
}

/** 05: How it works. Steps lock on as a red line draws down; the sticky console follows. */
export default function System() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.step').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 60%',
          end: 'bottom 60%',
          onToggle: (s) => s.isActive && setStep(i),
        });
      });
      if (prefersReducedMotion()) return;
      gsap.to('.steps-line i', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.steps', start: 'top 60%', end: 'bottom 60%', scrub: true },
      });
      // Background crossfade from ink into graphite and back out.
      gsap.fromTo(
        root.current,
        { backgroundColor: '#0a0c10' },
        {
          backgroundColor: '#14171d',
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 80%', end: 'top 20%', scrub: true },
        },
      );
      gsap.to(root.current, {
        backgroundColor: '#0a0c10',
        ease: 'none',
        immediateRender: false,
        scrollTrigger: { trigger: root.current, start: 'bottom 80%', end: 'bottom 20%', scrub: true },
      });
      gsap.from('.dash', {
        y: 80,
        rotateX: 12,
        transformPerspective: 1200,
        opacity: 0,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.system-grid', start: 'top 80%' },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="system" ref={root} className="system wrap" aria-label="How it works">
      <div className="system-head">
        <div>
          <span className="eyebrow" data-reveal="fade">
            06 · The system
          </span>
          <Lines lines={['Detect. Verify.', 'Log. Levy.']} className="h-lg" />
        </div>
        <p className="lede" data-reveal="fade">
          One continuous chain of custody for every civil helicopter movement, from the first radar contact to a
          transparent, auditable levy statement for the operator.
        </p>
      </div>

      <div className="system-grid">
        <div className="steps">
          <div className="steps-line">
            <i />
          </div>
          {SYSTEM_STEPS.map((s, i) => (
            <div key={s.n} className={`step ${i <= step ? 'on' : ''}`}>
              <Crosshair />
              <span className="n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>

        <div className="dash-sticky">
          <div className="dash" aria-label="Illustrative operations console">
            <div className="dash-top">
              <span className="lights">
                <i />
                <i />
                <i />
              </span>
              <span>Naebi Ops Console · illustrative</span>
              <span className="live">LIVE</span>
            </div>
            <div className="dash-screen">
              {SYSTEM_STEPS.map((s, i) => (
                <DashState key={s.n} i={i} on={i === step} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
