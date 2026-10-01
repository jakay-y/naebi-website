// Stylised Nigeria outline (simplified lon/lat) and key aviation points,
// projected into a 760 x 640 SVG viewBox.

const K = 60;
const LON0 = 2.4;
const LAT0 = 14.1;

export const project = (lon: number, lat: number): [number, number] => [
  +((lon - LON0) * K).toFixed(1),
  +((LAT0 - lat) * K).toFixed(1),
];

const BORDER: [number, number][] = [
  [2.7, 6.37], [2.73, 7.0], [2.75, 7.8], [2.8, 9.06], [3.1, 9.5], [3.6, 10.3], [3.57, 11.33],
  [3.64, 11.7], [3.95, 12.2], [4.1, 13.47], [4.9, 13.75], [5.5, 13.88], [6.4, 13.6], [6.95, 13.0],
  [7.8, 13.33], [9.0, 12.83], [10.0, 13.25], [11.0, 13.37], [12.3, 13.08], [13.1, 13.6],
  [13.6, 13.7], [14.2, 13.08], [14.6, 12.2], [14.2, 11.3], [13.7, 10.7], [13.3, 10.2],
  [13.2, 9.5], [12.8, 8.7], [12.2, 8.4], [11.8, 7.4], [11.1, 6.5], [10.5, 7.0], [9.8, 6.8],
  [9.2, 6.4], [8.8, 5.6], [8.5, 4.8], [7.9, 4.45], [7.5, 4.4], [6.7, 4.25], [6.0, 4.3],
  [5.4, 5.1], [4.9, 5.9], [4.5, 6.3], [3.4, 6.4], [2.7, 6.37],
];

export const BORDER_PTS = BORDER.map(([lon, lat]) => project(lon, lat));
export const BORDER_PATH =
  BORDER_PTS.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ') + ' Z';

export const CITIES = [
  { name: 'Port Harcourt', lon: 7.0, lat: 4.82, hq: true },
  { name: 'Lagos', lon: 3.38, lat: 6.52 },
  { name: 'Abuja', lon: 7.49, lat: 9.06 },
  { name: 'Warri', lon: 5.75, lat: 5.52 },
  { name: 'Calabar', lon: 8.32, lat: 4.96 },
  { name: 'Bonny', lon: 7.17, lat: 4.43 },
  { name: 'Kano', lon: 8.52, lat: 12.0 },
  { name: 'Enugu', lon: 7.5, lat: 6.45 },
  { name: 'Kaduna', lon: 7.44, lat: 10.52 },
  { name: 'Maiduguri', lon: 13.15, lat: 11.85 },
  { name: 'Offshore', lon: 6.3, lat: 3.85 },
].map((c) => ({ ...c, xy: project(c.lon, c.lat) }));

const city = (n: string) => CITIES.find((c) => c.name === n)!.xy;

// Routes drawn on scroll: [from, to]
export const ROUTES: [string, string][] = [
  ['Port Harcourt', 'Lagos'],
  ['Port Harcourt', 'Abuja'],
  ['Port Harcourt', 'Offshore'],
  ['Port Harcourt', 'Bonny'],
  ['Warri', 'Offshore'],
  ['Calabar', 'Port Harcourt'],
  ['Abuja', 'Kano'],
  ['Abuja', 'Lagos'],
  ['Enugu', 'Abuja'],
  ['Kaduna', 'Maiduguri'],
];

export const ROUTE_PATHS = ROUTES.map(([a, b]) => {
  const [x1, y1] = city(a);
  const [x2, y2] = city(b);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const bend = 0.22;
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  return `M${x1} ${y1} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2} ${y2}`;
});

function inside([x, y]: [number, number], poly: [number, number][]) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

// Deterministic pseudo-random so server and client render identical dots.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export const RADAR_CENTER = project(8.0, 8.9);

export const TRAFFIC = (() => {
  const r = rng(407);
  const pts: { x: number; y: number; delay: number }[] = [];
  // Weight traffic toward the Niger Delta, where most helicopter ops are.
  while (pts.length < 140) {
    const delta = pts.length < 70;
    const lon = delta ? 5.2 + r() * 3.8 : 2.8 + r() * 11.5;
    const lat = delta ? 3.9 + r() * 2.4 : 4.4 + r() * 9.2;
    const p = project(lon, lat);
    const offshore = delta && lat < 4.6;
    if (!offshore && !inside(p, BORDER_PTS)) continue;
    const ang = Math.atan2(p[1] - RADAR_CENTER[1], p[0] - RADAR_CENTER[0]);
    const turn = ((ang + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2);
    pts.push({ x: p[0], y: p[1], delay: turn });
  }
  return pts;
})();
