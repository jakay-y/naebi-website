// Site copy in one place. Items marked CLIENT in comments need confirming by Naebi.

export const COMPANY = {
  name: 'Naebi Dynamic Concepts',
  legal: 'Naebi Dynamic Concepts Ltd',
  rc: 'RC 1367947',
  founded: 2016,
  address: ['No 35 AGIP Road', 'Rumueme, Port Harcourt', 'Rivers State, Nigeria'],
  // CLIENT: add real contact details. Empty values are hidden on the page.
  email: '',
  phone: '',
};

export const NAV = [
  { label: 'Inside Naebi', href: '#hq' },
  { label: 'Aircraft', href: '#aircraft' },
  { label: 'Airspace', href: '#airspace' },
  { label: 'Mandate', href: '#mandate' },
  { label: 'System', href: '#system' },
  { label: 'Operators', href: '#operators' },
];

export const SECTIONS = [
  { id: 'hero', label: 'Arrival' },
  { id: 'hq', label: 'Inside Naebi' },
  { id: 'aircraft', label: 'Aircraft' },
  { id: 'airspace', label: 'Airspace' },
  { id: 'mandate', label: 'Mandate' },
  { id: 'system', label: 'System' },
  { id: 'operators', label: 'Control' },
  { id: 'contact', label: 'Touchdown' },
];

export const AIRCRAFT_STOPS = [
  {
    key: 'TRACK',
    title: 'Track',
    body: 'Real-time position of every civil helicopter operating in Nigerian airspace, from airport aprons to offshore helidecks.',
  },
  {
    key: 'IDENTIFY',
    title: 'Identify',
    body: 'Registration, operator and flight purpose matched and verified against the national record before rotors stop turning.',
  },
  {
    key: 'RECORD',
    title: 'Record',
    body: 'Every take-off and every landing captured automatically by on-site data-acquisition devices. No paper logs, no gaps.',
  },
  {
    key: 'SECURE',
    title: 'Secure',
    body: 'Unusual movements are flagged to the aviation authorities in real time, so the sky over critical infrastructure stays accountable.',
  },
];

// CLIENT: confirm or replace. These are factual (founding year, states, agencies)
// rather than invented performance numbers.
export const AIRCRAFT_STATS = [
  { value: 24, suffix: '/7', label: 'monitoring' },
  { value: 37, suffix: '', label: 'states & FCT' },
  { value: 3, suffix: '', label: 'agency partners' },
  { value: 2016, suffix: '', label: 'established' },
];

export const HOTSPOTS = [
  {
    id: 'transponder',
    title: 'Surveillance link',
    body: 'Aircraft position is acquired continuously and relayed to the Naebi operations centre.',
    // Normalised position inside the model bounding box, -1..1 on each axis.
    pos: [0, 1, 0] as [number, number, number],
  },
  {
    id: 'cabin',
    title: 'Movement record',
    body: 'Each landing and take-off is time-stamped against the aircraft registration and operator.',
    pos: [0.45, 0.05, 0.6] as [number, number, number],
  },
  {
    id: 'tail',
    title: 'Identity verification',
    body: 'Registration and operator details are verified against the national register.',
    pos: [-0.85, 0.25, 0] as [number, number, number],
  },
];

export const AGENCIES = [
  {
    code: 'NAMA',
    name: 'Nigerian Airspace Management Agency',
    role: 'Provides air navigation services across Nigerian airspace. Naebi surveillance data adds a complete, real-time picture of low-level rotary-wing traffic.',
  },
  {
    code: 'NCAA',
    name: 'Nigerian Civil Aviation Authority',
    role: 'Regulates the safety and standards of civil aviation. Naebi records give the regulator verifiable evidence of every civil helicopter movement.',
  },
  {
    code: 'FAAN',
    name: 'Federal Airports Authority of Nigeria',
    role: 'Manages Nigeria’s federal airports. Naebi monitoring covers airports, airstrips and helipads alike, closing the gap beyond the terminal fence.',
  },
];

export const SYSTEM_STEPS = [
  {
    n: '01',
    title: 'Detect',
    body: 'Surveillance equipment picks up the helicopter the moment it is airborne or on approach.',
  },
  {
    n: '02',
    title: 'Verify',
    body: 'Registration, operator and route are confirmed against national records.',
  },
  {
    n: '03',
    title: 'Log',
    body: 'Data-acquisition devices time-stamp the landing or take-off at the exact site.',
  },
  {
    n: '04',
    title: 'Levy',
    body: 'The landing and take-off levy is calculated and issued to the operator: transparent, auditable, on record.',
  },
];

export const NEWS = [
  {
    date: 'Jan 2024',
    source: 'THISDAY',
    title: 'Naebi Dynamics to fortify aviation security in Nigeria',
    href: 'https://www.thisdaylive.com/index.php/2024/01/26/naebi-dynamics-to-fortify-aviation-security-in-nigeria/',
  },
  {
    date: 'Company',
    source: 'Naebi',
    title: 'Inaugural ceremony of Naebi Dynamic Concepts Limited',
    href: 'https://naebidynamic.com/inaugural-ceremony-of-naebi-dynamic-concepts-limited/',
  },
  {
    date: 'Press',
    source: 'Media desk',
    title: 'Press and media enquiries: briefings for journalists and partners',
    href: '#contact',
  },
];
