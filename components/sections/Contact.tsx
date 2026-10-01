'use client';

import { useEffect, useRef, useState } from 'react';
import Lines from '../Lines';
import { COMPANY } from '@/lib/content';
import { gsap, prefersReducedMotion } from '@/lib/scroll';
import { rotorWipe } from '../chrome/Wipe';

/** 07: Touchdown. Contact, and the NAEBI wordmark that fills in as you land. */
export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.wordmark',
        { backgroundPosition: '100% 0' },
        {
          backgroundPosition: '0% 0',
          ease: 'none',
          scrollTrigger: { trigger: '.wordmark', start: 'top bottom', end: 'bottom 85%', scrub: true },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // CLIENT: wire to a form endpoint (Formspree, a serverless function or CRM).
    // Until then, open the visitor's mail client if a company email is configured.
    if (COMPANY.email) {
      const body = encodeURIComponent(
        `${data.get('message')}\n\n${data.get('name')} · ${data.get('org')} · ${data.get('email')}`,
      );
      window.location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(
        `Website enquiry: ${data.get('topic')}`,
      )}&body=${body}`;
    }
    setSent(true);
  };

  return (
    <section id="contact" ref={root} className="contact wrap" aria-label="Contact">
      <div className="contact-grid">
        <div>
          <span className="eyebrow" data-reveal="fade">
            08 · Touchdown
          </span>
          <Lines lines={['Let’s talk about', 'your airspace.']} className="h-lg" />
          <p className="lede" data-reveal="fade">
            Operators, agencies and partners: book a briefing with our team in Port Harcourt.
          </p>
          <div className="contact-details">
            <div data-reveal="fade">
              <h5>Head office</h5>
              <p>
                {COMPANY.address.map((l) => (
                  <span key={l}>
                    {l}
                    <br />
                  </span>
                ))}
              </p>
            </div>
            {(COMPANY.email || COMPANY.phone) && (
              <div data-reveal="fade">
                <h5>Direct</h5>
                <p>
                  {COMPANY.email && <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>}
                  {COMPANY.email && <br />}
                  {COMPANY.phone && <a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}>{COMPANY.phone}</a>}
                </p>
              </div>
            )}
            <div data-reveal="fade">
              <h5>Hours</h5>
              <p>Operations: 24/7</p>
            </div>
          </div>
        </div>

        <form className="contact-form glass" onSubmit={submit} data-reveal="fade">
          {sent ? (
            <div style={{ padding: '40px 6px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: 28, letterSpacing: '-0.02em' }}>Message received.</h3>
              <p className="muted" style={{ margin: 0 }}>
                Thank you. Our team will be in touch shortly.
              </p>
            </div>
          ) : (
            <>
              <div className="row">
                <label>
                  Name
                  <input name="name" required autoComplete="name" />
                </label>
                <label>
                  Organisation
                  <input name="org" autoComplete="organization" />
                </label>
              </div>
              <label>
                Email
                <input name="email" type="email" required autoComplete="email" />
              </label>
              <label>
                I am a
                <select name="topic" defaultValue="Helicopter operator">
                  <option>Helicopter operator</option>
                  <option>Government agency</option>
                  <option>Partner / supplier</option>
                  <option>Press</option>
                </select>
              </label>
              <label>
                Message
                <textarea name="message" required />
              </label>
              <button className="btn btn-solid" type="submit" data-magnetic>
                Book a briefing
              </button>
            </>
          )}
        </form>
      </div>

      <div className="wordmark" aria-hidden="true">
        NAEBI
      </div>

      <footer className="footer">
        <span>
          © {new Date().getFullYear()} {COMPANY.legal} · {COMPANY.rc}
        </span>
        <span>Helicopter surveillance &amp; airspace security · Nigeria</span>
        <a href="#hero" onClick={(e) => {
            e.preventDefault();
            rotorWipe('#hero');
          }}>
          Back to arrival ↑
        </a>
      </footer>
    </section>
  );
}
