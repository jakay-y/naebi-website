'use client';

import { useCallback, useEffect, useState } from 'react';
import Preloader from './chrome/Preloader';
import Nav from './chrome/Nav';
import Rail from './chrome/Rail';
import Altimeter from './chrome/Altimeter';
import Cursor from './chrome/Cursor';
import Wipe from './chrome/Wipe';
import Hero from './sections/Hero';
import Headquarters from './sections/Headquarters';
import Aircraft from './sections/Aircraft';
import Airspace from './sections/Airspace';
import Mandate from './sections/Mandate';
import System from './sections/System';
import Operators from './sections/Operators';
import Contact from './sections/Contact';
import { ScrollTrigger, scrollState, startSmoothScroll } from '@/lib/scroll';
import { initMagnetic, initReveals } from '@/lib/motion';

/**
 * One continuous camera move, driven by scroll:
 * arrival → inside HQ → aircraft → airspace → mandate → system → control room → touchdown.
 */
export default function Experience() {
  const [ready, setReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const stop = startSmoothScroll();
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      refreshPriority: -1,
      onUpdate: (s) => {
        scrollState.page = s.progress;
        scrollState.velocity = s.getVelocity();
      },
    });
    // Images and fonts change layout after load; recompute pin spacing then.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      stop();
      st.kill();
      window.removeEventListener('load', refresh);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const a = initReveals();
    const b = initMagnetic();
    return () => {
      a();
      b();
    };
  }, [ready]);

  return (
    <>
      <Preloader onDone={onDone} />
      <Nav />
      <Rail />
      <Altimeter />
      <Cursor />
      <Wipe />
      <div className="grain" aria-hidden="true" />
      <main>
        <Hero ready={ready} />
        <Headquarters />
        <Aircraft />
        <Airspace />
        <Mandate />
        <System />
        <Operators />
        <Contact />
      </main>
    </>
  );
}
