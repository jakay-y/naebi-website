// Zones along the HQ walkthrough. `at` is the point in the footage (0..1) where the zone begins.
// Timings match naebi_intro_video11.mp4 (39s). CLIENT: confirm the copy for each space.

export const HQ_ZONES = [
  {
    at: 0,
    code: 'GF-00',
    title: 'Arrival',
    body: 'No 35 AGIP Road, Rumueme, Port Harcourt. The doors open onto the home of Naebi Dynamic Concepts.',
    map: [50, 196],
  },
  {
    at: 0.075,
    code: 'GF-01',
    title: 'Entrance',
    body: 'Glass, steel and light. An open building for an organisation whose work is built on transparency.',
    map: [50, 170],
  },
  {
    at: 0.18,
    code: 'GF-02',
    title: 'Atrium',
    body: 'A double-height atrium ties the building together, with the mezzanine offices looking down over the hall.',
    map: [50, 140],
  },
  {
    at: 0.255,
    code: 'GF-03',
    title: 'The Stair',
    body: 'Under the Naebi Dynamic name, the stair rises to the upper floor and management offices.',
    map: [78, 124],
  },
  {
    at: 0.37,
    code: 'GF-04',
    title: 'Gallery Hall',
    body: 'A long gallery of the company’s work leads through the heart of the building toward the operations floor.',
    map: [50, 92],
  },
  {
    at: 0.7,
    code: 'GF-05',
    title: 'Operations',
    body: 'Open-plan workstations where Naebi teams handle monitoring, verification and movement records.',
    map: [84, 44],
  },
  {
    at: 0.82,
    code: 'GF-06',
    title: 'Front Desk',
    body: 'Where operators, agencies and partners are welcomed for briefings.',
    map: [46, 34],
  },
  {
    at: 0.915,
    code: 'GF-07',
    title: 'Our Profile',
    body: 'Mission, values and services, on the wall and in practice every day.',
    map: [20, 58],
  },
] as const;

export const zoneAt = (p: number) => {
  let i = 0;
  HQ_ZONES.forEach((z, k) => {
    if (p >= z.at) i = k;
  });
  return i;
};

export const HQ_PATH = 'M' + HQ_ZONES.map((z) => z.map.join(' ')).join(' L');
