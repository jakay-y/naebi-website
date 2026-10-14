// Stock photography from Pexels (free to use; https://www.pexels.com/license/).
// scripts/fetch-stock.mjs downloads each photo into public/assets/stock/<name>.webp at build time.
// If a download fails (offline), pages fall back to the matching photo in public/assets/.
import { existsSync } from 'node:fs';

export const STOCK = {
  'heli-flight':     { id: 104757,   w: 1600, alt: 'A dark helicopter banking against a blue sky', title: 'Helicopter on Side Ways', by: 'Somchai Kongkamsri', fallback: 'field-wide.webp' },
  'moon-heli':       { id: 11521681, w: 1400, alt: 'A helicopter in flight beneath the moon', title: 'Moon over Helicopter', fallback: 'waterfall.webp' },
  'rig-blue':        { id: 13199842, w: 1200, alt: 'An offshore oil platform under a blue sky', title: 'An Oil Platform Offshore Under Blue Sky', by: 'Jan-Rune Smenes Reite', fallback: 'rotor-head.webp' },
  'rig-night':       { id: 30475899, w: 1200, alt: 'An offshore oil rig lit up at night', title: 'Illuminated Offshore Oil Rig at Night', by: 'Saul Bandera Brotheridge', fallback: 'tail-rotor.webp' },
  'helipad-top':     { id: 8300721,  w: 1200, alt: 'Top-down view of a helipad', title: 'Top View of a Helipad', fallback: 'helipad.webp' },
  'helis-sunset':    { id: 2962084,  w: 1800, alt: 'Two helicopters flying over the sea at sunset', title: 'Helicopters', by: 'Athena Sandrini', fallback: 'cta-bg.webp' },
  'heli-sky':        { id: 3492103,  w: 1100, alt: 'A helicopter flying against a clear sky', title: 'Helicopter Flying in the Sky', by: 'Juan Gomez', fallback: 'waterfall.webp' },
  'heli-clouds':     { id: 17701242, w: 1200, alt: 'A helicopter flying among clouds', title: 'Helicopter and Clouds', by: 'yaman ozuduru', fallback: 'cockpit.webp' },
  'heli-cockpit':    { id: 2589047,  w: 1800, alt: 'View from a helicopter cockpit over a city at sunset', title: 'Aircraft Cockpit', by: 'Ricky Esquivel', fallback: 'field-wide.webp' },
  'pilot-view':      { id: 9750168,  w: 1200, alt: 'A helicopter pilot’s view of the instrument panel and landscape', title: 'A Point of View of a Helicopter Pilot', by: 'Donovan Kelly', fallback: 'cockpit.webp' },
  'heli-aerial':     { id: 15768079, w: 1200, alt: 'Aerial view of hills and water from a helicopter', title: 'Aerial Photography from Flying Helicopter', by: 'Cyrill', fallback: 'skids.webp' },
  'tower':           { id: 7899923,  w: 1200, alt: 'An airport air traffic control tower', title: 'Air Traffic Control Tower of Arlanda Airport', by: 'Ludvig Hedenborg', fallback: 'tail-rotor.webp' },
  'tower-2':         { id: 32584169, w: 1600, alt: 'An air traffic control tower against a clear sky', title: 'Air Traffic Control Tower at Schiphol Airport', by: 'Tristan', fallback: 'pad-marking.webp' },
  'fog-tarmac':      { id: 15590156, w: 2000, alt: 'A rescue helicopter parked on a foggy tarmac', title: 'Fog over Helicopter on Tarmac', by: 'Joerg Mangelsen', fallback: 'helipad.webp' },
  'ground-crew':     { id: 16108906, w: 1600, alt: 'Ground crew working on an airport apron', title: 'Ground Crew Working at the Airport Tarmac', by: 'Rafael Rodrigues', fallback: 'tail-rotor.webp' },
  'monitors':        { id: 11783119, w: 1200, alt: 'An operator watching several monitors in a control room', title: 'A Man Looking at Multiple Monitors', by: 'Samon Yu', fallback: 'cockpit.webp' },
  'lagos':           { id: 32656347, w: 1800, alt: 'Aerial view of Lagos with the ocean on the horizon', title: 'Aerial View of Lagos Cityscape with Ocean Horizon', by: 'onaopemipo Rufus', fallback: 'hero-wide.webp' },
  'meeting':         { id: 30688592, w: 1400, alt: 'A business meeting in a Lagos office', title: 'High-Level Business Meeting in Lagos Office', by: 'Ninthgrid', fallback: 'field-tall.webp' },
  'meeting-2':       { id: 30688596, w: 1400, alt: 'Professionals in discussion around a table in a Lagos office', title: 'Business Meeting in Lagos Office Setting', by: 'Ninthgrid', fallback: 'skids.webp' },
  'interview':       { id: 30688591, w: 1800, alt: 'Two professionals talking in a modern Lagos office', title: 'Professional Interview in Modern Lagos Office', by: 'Ninthgrid', fallback: 'cta-bg.webp' },
  'sunset-flight':   { id: 9048876,  w: 2000, alt: 'A helicopter silhouetted against a sunset sky above the clouds', title: 'Silhouette of Helicopter Flying in the Sky During Sunset', fallback: 'rotor-head.webp' },
  'hero-heli':       { id: 23124351, w: 2400, alt: 'A helicopter parked on a helipad under a bright sky', title: 'Front View of a Helicopter', by: 'MurdaShots', fallback: 'hero-wide.webp', credit: true },
};

/** Path to use for a stock photo: the downloaded file if present, otherwise its fallback. */
export function stock(name) {
  const s = STOCK[name];
  if (!s) throw new Error(`Unknown stock image: ${name}`);
  return existsSync(`public/assets/stock/${name}.webp`) ? `stock/${name}.webp` : s.fallback;
}
export const pexelsUrl = (id, w) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
export const pexelsPage = (id) => `https://www.pexels.com/photo/${id}/`;
