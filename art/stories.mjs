// The day's stories. Every one happened, or was first reported, on Sunday 22 November 2026 in the place it
// happened, or is set for that day (tagged FORECAST until it happens). Each was checked against a dated report.
// region: one of the seven in build.mjs · field: the beat · at: [longitude, latitude] for the map
// sure: CONFIRMED (two or more outlets) · OFFICIAL (the body itself) · REPORTED (one outlet) · CLAIM (one side) · FORECAST

export const DAY = { long: 'Sunday 22 November 2026', short: 'Sunday 22 November', weekday: 'Sunday' };

// The three leads: a picture, a headline, two lines of what happened.
export const LEADS = [
  {
    region: 'EUROPE', field: 'Climate', at: [30.7, 36.9],
    head: 'COP31 gets a “final” text and a dawn deadline',
    deck: 'A day past the close, nearly 200 countries are given until 06:00 to agree; a $120bn goal is cut.',
    sure: 'CONFIRMED', src: 'AFP · REUTERS · GUARDIAN',
    art: ['talks', { label: 'COP31 · ANTALYA', label2: 'DAY 13 · OVERTIME', clock: true }],
  },
  {
    region: 'MIDDLE EAST', field: 'Energy', at: [51.4, 35.7],
    head: 'Iran starts rationing power after gas plants are hit',
    deck: 'The state grid company says supply is cut from today, mostly for up to two hours a day, as fuel runs short.',
    sure: 'OFFICIAL', src: 'TAVANIR · RFE/RL · NEW ARAB',
    art: ['number', { label: 'IRAN · POWER CUTS', big: '2 HRS', small: 'A DAY, FROM SUNDAY', bg: '#2b2f3a', ink: '#ffd24a', plate: '#b3261e' }],
  },
  {
    region: 'MIDDLE EAST', field: 'Politics', at: [35.2, 31.8],
    head: 'Eisenkot and Likud sit down for coalition talks',
    deck: 'Gadi Eisenkot, who must form Israel’s next government by December, opens talks with Netanyahu’s party.',
    sure: 'CONFIRMED', src: 'TIMES OF ISRAEL · ABC · FRANCE 24',
    art: ['capitol', { label: 'JERUSALEM', label2: 'COALITION TALKS', flag: ['#fff', '#2456a6', '#fff', '#2456a6', '#fff'], bg: '#e4ecf6' }],
  },
];

// Twelve cards: a small picture and a headline each.
export const CARDS = [
  {
    region: 'N. AMERICA', field: 'Motor racing', at: [-115.2, 36.1],
    head: 'Las Vegas GP: Verstappen starts on pole',
    sure: 'FORECAST', src: 'F1 · FIA',
    art: ['sport', { kind: 'car', bg: '#1b2140', big: 'P1', small: '04:00 UTC START', label: 'LAS VEGAS' }],
  },
  {
    region: 'OCEANIA', field: 'Defence', at: [149.1, -35.3],
    head: 'Marles: US budget office “wrong” on AUKUS subs',
    sure: 'OFFICIAL', src: 'MARLES ON ABC',
    art: ['ship', { label: 'AUKUS', label2: 'CBO REPORT', hull: '#3a4350', x: 0.32 }],
  },
  {
    region: 'OCEANIA', field: 'Cricket', at: [174.8, -41.3],
    head: 'India pile up 629 in the Wellington Test',
    sure: 'CONFIRMED', src: 'OUTLOOK · RNZ',
    art: ['sport', { kind: 'cricket', big: '629/6', small: 'LEAD BY 261', label: 'WELLINGTON' }],
  },
  {
    region: 'ASIA', field: 'Weather', at: [138.6, 37.4],
    head: 'Japan warns of rain, snow and cold in the north',
    sure: 'REPORTED', src: 'NHK',
    art: ['storm', { label: 'NIIGATA · IWATE', label2: 'WARNINGS' }],
  },
  {
    region: 'ASIA', field: 'Water', at: [90.4, 23.8],
    head: 'Bangladesh and India meet on Ganges water deal',
    sure: 'FORECAST', src: 'DHAKA TRIBUNE · TBS',
    art: ['flags', { a: ['#006a4e'], b: ['#ff9933', '#fff', '#138808'], label: 'TREATY ENDS 12 DEC' }],
  },
  {
    region: 'ASIA', field: 'Earthquake', at: [140.1, 34.4],
    head: 'M4.6 quake off Chiba at 02:30 Tokyo time',
    sure: 'OFFICIAL', src: 'USGS',
    art: ['place', { label: 'OFF BOSO', big: 'M 4.6', small: '65 KM DEEP', x: 0.24, rings: true, land: '#cfdcc0' }],
  },
  {
    region: 'EUROPE', field: 'Tennis', at: [7.7, 45.1],
    head: 'Alcaraz meets Zverev in the ATP Finals final',
    sure: 'FORECAST', src: 'ATP · 17:00 UTC',
    art: ['sport', { kind: 'tennis', bg: '#2456a6', big: 'FINAL', small: 'TURIN', label: 'ATP FINALS' }],
  },
  {
    region: 'EUROPE', field: 'MotoGP', at: [-8.6, 37.2],
    head: 'Márquez leads by 55 into Portugal GP',
    sure: 'FORECAST', src: 'CRASH.NET · 13:00 UTC',
    art: ['sport', { kind: 'car', bg: '#6b2a1e', big: '+55', small: '62 PTS LEFT', label: 'PORTIMÃO' }],
  },
  {
    region: 'MIDDLE EAST', field: 'Lebanon', at: [35.5, 33.9],
    head: 'Lebanon marks independence day under pressure',
    sure: 'FORECAST', src: 'AL JAZEERA · TOI',
    art: ['capitol', { label: 'BEIRUT', flag: ['#d7261e', '#fff', '#d7261e'], bg: '#eef1e8', big: '22 NOV', small: 'SINCE 1943' }],
  },
  {
    region: 'OCEANIA', field: 'Obituary', at: [151.2, -33.9],
    head: 'Australian politician Fred Nile dies at 92',
    sure: 'CONFIRMED', src: 'ABC · SMH',
    art: ['number', { label: 'SYDNEY', big: '92', small: 'NSW MP 1981–2023', bg: '#e9e6df' }],
  },
  {
    region: 'N. AMERICA', field: 'College football', at: [-122.3, 47.7],
    head: 'Washington stun No. 8 Indiana 27-24 in overtime',
    sure: 'CONFIRMED', src: 'ESPN · CBS SPORTS',
    art: ['sport', { kind: 'rugby', bg: '#3b2a6b', big: '27-24', small: 'OT · 00:17 UTC', label: 'SEATTLE' }],
  },
  {
    region: 'ASIA', field: 'Sumo', at: [130.4, 33.6],
    head: 'Kyushu sumo: Onosato and Wakamotoharu tied going in',
    sure: 'FORECAST', src: 'KYODO',
    art: ['number', { label: 'FUKUOKA', big: 'DAY 15', small: 'TWO SHARE THE LEAD', bg: '#efe2c8' }],
  },
];

// Numbered briefs: one line each, carrying the count on from the pictures.
export const BRIEFS = [
  { region: 'AFRICA', field: 'Diplomacy', place: 'Egypt', text: 'Aswan peace forum ends its two days', at: [32.9, 24.1] },
  { region: 'EUROPE', field: 'Climate', place: 'Antalya', text: 'objections to COP31 package due 03:00 UTC', at: [30.7, 36.9] },
  { region: 'EUROPE', field: 'Climate', place: 'Antalya', text: 'session to adopt the deal set for 06:00 UTC', at: [30.7, 36.9] },
  { region: 'EUROPE', field: 'Football', place: 'Liverpool', text: 'Liverpool v Man United, 16:30 UTC', at: [-3.0, 53.4] },
  { region: 'EUROPE', field: 'Football', place: 'Hull', text: 'Hull City v Brighton, 14:00 UTC', at: [-0.4, 53.7] },
  { region: 'EUROPE', field: 'Tennis', place: 'Turin', text: 'ATP doubles final, 14:00 UTC', at: [7.7, 45.1] },
  { region: 'ASIA', field: 'Earthquake', place: 'Myanmar', text: 'M4.1 quake near Homalin, Sagaing', at: [94.6, 24.4] },
  { region: 'ASIA', field: 'Earthquake', place: 'Sumatra', text: 'M4.2 deep quake near Solok', at: [100.7, -1.0] },
  { region: 'ASIA', field: 'Earthquake', place: 'Banda Sea', text: 'M4.1 deep aftershock area of Friday’s M6.8', at: [127.8, -6.5] },
  { region: 'OCEANIA', field: 'Cricket', place: 'Wellington', text: 'Pant 128 off 153 balls on day four', at: [174.8, -41.3] },
  { region: 'N. AMERICA', field: 'College football', place: 'Columbia SC', text: 'No. 1 Georgia at South Carolina', at: [-81.0, 34.0] },
  { region: 'N. AMERICA', field: 'College football', place: 'South Bend', text: 'SMU at No. 6 Notre Dame', at: [-86.2, 41.7] },
  { region: 'N. AMERICA', field: 'College football', place: 'Fort Worth', text: 'No. 2 Utah at TCU, 02:00 UTC', at: [-97.4, 32.7] },
  { region: 'N. AMERICA', field: 'College football', place: 'Miami', text: 'Virginia Tech at No. 7 Miami', at: [-80.2, 26.0] },
  { region: 'N. AMERICA', field: 'NFL', place: 'NFL', text: 'seven early games from 18:00 UTC', at: [-78.8, 42.8] },
  { region: 'N. AMERICA', field: 'NFL', place: 'NFL', text: 'Jets-Chargers, Raiders-Broncos late', at: [-105.0, 39.7] },
  { region: 'LATIN AMERICA', field: 'NFL', place: 'Mexico City', text: 'Vikings v 49ers, Sunday night local', at: [-99.1, 19.4] },
  { region: 'MIDDLE EAST', field: 'Cricket', place: 'Doha', text: 'India A v Pakistan Shaheens, 10:00 UTC', at: [51.5, 25.3] },
  { region: 'ASIA', field: 'Security', place: 'Macau', text: 'APEC-week airspace ban runs its last day', at: [113.5, 22.2] },
];

// Events with a time on the record, in UTC. set: true marks one that is scheduled, not yet happened.
export const CLOCK = [
  { t: '00:17', label: 'UW beat Indiana', anchor: 'start', dx: -6 },
  { t: '04:00', label: 'Las Vegas GP', set: true },
  { t: '06:00', label: 'COP31 adoption session', set: true, anchor: 'start', dx: -6 },
  { t: '10:00', label: 'India A v Pakistan', set: true },
  { t: '13:00', label: 'MotoGP Portugal', set: true },
  { t: '16:30', label: 'Liverpool v Man Utd', set: true },
  { t: '17:00', label: 'ATP Finals final', set: true, dx: 24 },
];

// Left out on purpose: big stories that broke before Sunday, with the day they belong to.
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
