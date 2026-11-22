// What the page says. Every story happened, or was first reported, on Sunday 22 November 2026 where it
// happened, or is set for that day and tagged FORECAST until it happens. Each was checked against a dated report.
//   region  one of the seven regions in page.mjs        field  the beat, counted on the masthead
//   at      [longitude, latitude] for the map pin        shift  nudges a crowded pin, in pixels
//   tag     CONFIRMED (2+ outlets) · OFFICIAL (the body itself) · REPORTED (one outlet) · CLAIM · FORECAST
//   by      who stands behind it                         pic    [picture name, options] from pictures.mjs

export const DAY = { long: 'Sunday 22 November 2026', short: 'Sunday 22 November', weekday: 'Sunday' };

export const LEADS = [
  {
    region: 'EUROPE', field: 'Climate', at: [30.7, 36.9],
    head: 'COP31 gets a “final” text and a dawn deadline',
    deck: 'A day past the close, nearly 200 countries are given until 06:00 to agree; a $120bn goal is cut.',
    tag: 'CONFIRMED', by: 'AFP · REUTERS · GUARDIAN',
    pic: ['summit', { label: 'COP31 · ANTALYA', label2: 'A DAY OVER TIME', clock: true }],
  },
  {
    region: 'MIDDLE EAST', field: 'Energy', at: [51.4, 35.7],
    head: 'Iran starts rationing power after gas plants are hit',
    deck: 'The state grid company says supply is cut from today, mostly for up to two hours a day, as fuel runs short.',
    tag: 'OFFICIAL', by: 'IRAN GRID CO · RFE/RL · NEW ARAB',
    pic: ['power', { label: 'IRAN · POWER CUTS', big: '2 HRS', small: 'A DAY, FROM SUNDAY' }],
  },
  {
    region: 'MIDDLE EAST', field: 'Politics', at: [35.2, 31.8], shift: [-4, 4],
    head: 'Eisenkot and Likud sit down for coalition talks',
    deck: 'Gadi Eisenkot, who must form Israel’s next government by December, opens talks with Netanyahu’s party.',
    tag: 'CONFIRMED', by: 'TIMES OF ISRAEL · ABC · FRANCE 24',
    pic: ['building', { label: 'JERUSALEM', label2: 'COALITION TALKS', colours: ['#fff', '#2456a6', '#fff', '#2456a6', '#fff'], bg: '#e4ecf6' }],
  },
];

export const CARDS = [
  {
    region: 'N. AMERICA', field: 'Motor racing', at: [-115.2, 36.1],
    head: 'Las Vegas GP: Verstappen starts on pole',
    tag: 'FORECAST', by: 'F1 · FIA',
    pic: ['sport', { kind: 'car', bg: '#1b2140', big: 'P1', small: '04:00 UTC START', label: 'LAS VEGAS' }],
  },
  {
    region: 'OCEANIA', field: 'Defence', at: [149.1, -35.3],
    head: 'Marles: US budget office “wrong” on AUKUS subs',
    tag: 'OFFICIAL', by: 'MARLES ON ABC',
    pic: ['vessel', { sub: true, label: 'AUKUS', label2: 'CBO REPORT', x: 0.34 }],
  },
  {
    region: 'OCEANIA', field: 'Cricket', at: [174.8, -41.3],
    head: 'India pile up 629 in the Wellington Test',
    tag: 'CONFIRMED', by: 'OUTLOOK · RNZ',
    pic: ['sport', { kind: 'cricket', big: '629/6', small: 'LEAD BY 261', label: 'WELLINGTON' }],
  },
  {
    region: 'ASIA', field: 'Weather', at: [138.6, 37.4],
    head: 'Japan warns of rain, snow and cold in the north',
    tag: 'REPORTED', by: 'NHK',
    pic: ['weather', { snow: true, label: 'NIIGATA · IWATE', label2: 'WARNINGS' }],
  },
  {
    region: 'ASIA', field: 'Water', at: [90.4, 23.8],
    head: 'Bangladesh and India meet on Ganges water deal',
    tag: 'FORECAST', by: 'DHAKA TRIBUNE · TBS',
    pic: ['twoflags', { a: ['#006a4e'], b: ['#ff9933', '#fff', '#138808'], label: 'TREATY ENDS 12 DEC' }],
  },
  {
    region: 'ASIA', field: 'Earthquake', at: [140.1, 34.4], shift: [6, 4],
    head: 'M4.6 quake off Chiba at 02:30 Tokyo time',
    tag: 'OFFICIAL', by: 'USGS',
    pic: ['pin', { label: 'OFF BOSO', big: 'M 4.6', small: '65 KM DEEP', x: 0.24, rings: true, land: '#cfdcc0' }],
  },
  {
    region: 'EUROPE', field: 'Tennis', at: [7.7, 45.1],
    head: 'Alcaraz meets Zverev in the ATP Finals final',
    tag: 'FORECAST', by: 'ATP · 17:00 UTC',
    pic: ['sport', { kind: 'tennis', bg: '#2456a6', big: 'FINAL', small: 'TURIN', label: 'ATP FINALS' }],
  },
  {
    region: 'EUROPE', field: 'MotoGP', at: [-8.6, 37.2],
    head: 'Márquez leads by 55 into the Portugal GP',
    tag: 'FORECAST', by: 'CRASH.NET · 13:00 UTC',
    pic: ['sport', { kind: 'bike', bg: '#6b2a1e', big: '+55', small: '62 PTS LEFT', label: 'PORTIMÃO' }],
  },
  {
    region: 'MIDDLE EAST', field: 'Lebanon', at: [35.5, 33.9], shift: [4, -6],
    head: 'Lebanon marks independence day under pressure',
    tag: 'FORECAST', by: 'AL JAZEERA · TOI',
    pic: ['building', { label: 'BEIRUT', colours: ['#d7261e', '#fff', '#d7261e'], bg: '#eef1e8', big: '22 NOV', small: 'SINCE 1943' }],
  },
  {
    region: 'OCEANIA', field: 'Obituary', at: [151.2, -33.9],
    head: 'Australian politician Fred Nile dies at 92',
    tag: 'CONFIRMED', by: 'ABC · SMH',
    pic: ['candle', { label: 'SYDNEY', big: '92', small: 'NSW MP 1981–2023' }],
  },
  {
    region: 'N. AMERICA', field: 'College football', at: [-122.3, 47.7],
    head: 'Washington stun No. 8 Indiana 27-24 in overtime',
    tag: 'CONFIRMED', by: 'ESPN · CBS SPORTS',
    pic: ['sport', { kind: 'oval', bg: '#3b2a6b', big: '27-24', small: 'OT · 00:17 UTC', label: 'SEATTLE' }],
  },
  {
    region: 'ASIA', field: 'Sumo', at: [130.4, 33.6],
    head: 'Kyushu sumo: Onosato and Wakamotoharu tied going in',
    tag: 'FORECAST', by: 'KYODO',
    pic: ['bigfigure', { label: 'FUKUOKA', big: 'DAY 15', small: 'TWO SHARE THE LEAD', bg: '#efe2c8' }],
  },
];

export const BRIEFS = [
  { region: 'AFRICA', field: 'Diplomacy', place: 'Egypt', text: 'Aswan peace forum ends its two days', at: [32.9, 24.1] },
  { region: 'EUROPE', field: 'Climate', place: 'Antalya', text: 'objections to COP31 package due 03:00 UTC', at: [30.7, 36.9] },
  { region: 'EUROPE', field: 'Climate', place: 'Antalya', text: 'session to adopt the deal set for 06:00 UTC', at: [30.7, 36.9] },
  { region: 'EUROPE', field: 'Football', place: 'Liverpool', text: 'Liverpool v Man United, 16:30 UTC', at: [-3.0, 53.4] },
  { region: 'EUROPE', field: 'Football', place: 'Hull', text: 'Hull City v Brighton, 14:00 UTC', at: [-0.4, 53.7] },
  { region: 'EUROPE', field: 'Tennis', place: 'Turin', text: 'ATP doubles final, 14:00 UTC', at: [7.7, 45.1] },
  { region: 'ASIA', field: 'Earthquake', place: 'Myanmar', text: 'M4.1 quake near Homalin, Sagaing', at: [94.6, 24.4] },
  { region: 'ASIA', field: 'Earthquake', place: 'Sumatra', text: 'M4.2 deep quake near Solok', at: [100.7, -1.0] },
  { region: 'ASIA', field: 'Earthquake', place: 'Banda Sea', text: 'M4.1 deep quake where Saturday’s M6.8 hit', at: [127.8, -6.5] },
  { region: 'ASIA', field: 'Security', place: 'Macau', text: 'APEC-week airspace ban runs its last day', at: [113.5, 22.2] },
  { region: 'OCEANIA', field: 'Cricket', place: 'Wellington', text: 'Pant 128 off 153 balls on day four', at: [174.8, -41.3] },
  { region: 'MIDDLE EAST', field: 'Cricket', place: 'Doha', text: 'India A v Pakistan Shaheens, 10:00 UTC', at: [51.5, 25.3] },
  { region: 'N. AMERICA', field: 'College football', place: 'Columbia SC', text: 'No. 1 Georgia at South Carolina', at: [-81.0, 34.0] },
  { region: 'N. AMERICA', field: 'College football', place: 'South Bend', text: 'SMU at No. 6 Notre Dame', at: [-86.2, 41.7] },
  { region: 'N. AMERICA', field: 'College football', place: 'Fort Worth', text: 'No. 2 Utah at TCU, 02:00 UTC', at: [-97.4, 32.7] },
  { region: 'N. AMERICA', field: 'College football', place: 'Miami', text: 'Virginia Tech at No. 7 Miami', at: [-80.2, 26.0] },
  { region: 'N. AMERICA', field: 'NFL', place: 'NFL', text: 'seven early games from 18:00 UTC', at: [-78.8, 42.8] },
  { region: 'N. AMERICA', field: 'NFL', place: 'NFL', text: 'Jets-Chargers, Raiders-Broncos late', at: [-105.0, 39.7] },
  { region: 'LATIN AMERICA', field: 'NFL', place: 'Mexico City', text: 'Vikings v 49ers, Sunday night local', at: [-99.1, 19.4] },
];

// Timed events, UTC. set: true = scheduled, not yet happened (drawn hollow). above overrides the zig-zag.
export const CLOCK = [
  { t: '00:17', label: 'UW beat Indiana', anchor: 'start', dx: -6 },
  { t: '04:00', label: 'Las Vegas GP', set: true },
  { t: '06:00', label: 'COP31 adoption session', set: true, anchor: 'start', dx: -6 },
  { t: '10:00', label: 'India A v Pakistan', set: true },
  { t: '13:00', label: 'MotoGP Portugal', set: true },
  { t: '16:30', label: 'Liverpool v Man Utd', set: true },
  { t: '17:00', label: 'ATP Finals final', set: true, dx: 24 },
];

// Big stories of the days before, left off on purpose, with the day each one broke.
export const OLDER = [
  { what: 'Xi–Trump–Putin summit in Shenzhen', when: 'Thu 19 Nov' },
  { what: 'Russian strike on Kyiv bridges', when: 'Fri 20 Nov' },
  { what: 'Mexico captures “El Chapo Isidro”', when: 'Sat 21 Nov' },
  { what: 'M6.8 quake in the Banda Sea', when: 'Sat 21 Nov' },
  { what: 'Houthi missiles at Riyadh shot down', when: 'Sat 21 Nov' },
  { what: 'Bayelsa funeral boat capsizes', when: 'Sat 21 Nov' },
];
export const LATER = 'COP31 deal, Vegas GP and ATP winners.';

export const SOURCES = 'Reuters, AFP, AP, ABC, RNZ, NHK, Kyodo, Times of Israel, ESPN, F1, ATP, USGS';
