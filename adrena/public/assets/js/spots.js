/* spots.js — spot and sport configuration for the wind forecast page */

const SPOTS = [
  {
    id: 'svencele',
    name: 'Svencelė',
    desc: 'Kuršių marios · PUČIA.LT',
    water: 'lagoon',
    // TODO: confirm good/bad wind directions with local instructors.
    // goodDirs: array of [fromDeg, toDeg] where the spot is rideable.
    // badDirs:  array of [fromDeg, toDeg] where wind is offshore/dangerous.
    goodDirs: null,
    badDirs:  null,
  },
  {
    id: 'neringa-pervalka',
    name: 'Pervalka',
    desc: 'Kuršių marios',
    water: 'lagoon',
    goodDirs: null, // TODO
    badDirs:  null, // TODO
  },
  {
    id: 'neringa-nida',
    name: 'Nida',
    desc: 'Kuršių marios',
    water: 'lagoon',
    goodDirs: null, // TODO
    badDirs:  null, // TODO
  },
  {
    id: 'klaipeda',
    name: 'Klaipėda / Melnragė',
    desc: 'Baltijos jūra',
    water: 'sea',
    goodDirs: null, // TODO
    badDirs:  null, // TODO
  },
  {
    id: 'kauno-marios',
    name: 'Kauno marios',
    desc: 'Nemunas',
    water: 'reservoir',
    goodDirs: null, // TODO
    badDirs:  null, // TODO
  },
];

const SPORTS = {
  kaitavimas_prad: {
    name: 'Kaitavimas (pradedantysis)',
    nameShort: 'Kaitavimas prad.',
    wind: { good: [6, 10], warnLow: [5, 6], warnHigh: [10, 12] },
    maxGustDelta: 4,
    noThunder: true,
    noOffshore: true,
  },
  kaitavimas_paz: {
    name: 'Kaitavimas (pažengęs)',
    nameShort: 'Kaitavimas paženg.',
    wind: { good: [6, 16], warnLow: [4, 6], warnHigh: [16, 20] },
    maxGustDelta: 6,
    noThunder: true,
    noOffshore: true,
  },
  burlentes: {
    name: 'Burlentės',
    nameShort: 'Burlentės',
    wind: { good: [8, 25], warnLow: [5, 8], warnHigh: [25, 35] }, // TODO: confirm
    maxGustDelta: 8,
    noThunder: true,
    noOffshore: false, // TODO
  },
  sparnlente: {
    name: 'Sparnlentė / Wing',
    nameShort: 'Wing',
    wind: { good: [5, 12], warnLow: [3, 5], warnHigh: [12, 16] }, // TODO: confirm
    maxGustDelta: 5,
    noThunder: true,
    noOffshore: false, // TODO
  },
  parasparnis: {
    name: 'Parasparnis',
    nameShort: 'Parasparnis',
    wind: { good: [3, 8], warnLow: [2, 3], warnHigh: [8, 12] }, // TODO: confirm
    maxGustDelta: 3,
    noThunder: true,
    noOffshore: false, // TODO
  },
};

// Wind colour scale — Adrena palette, continuous
const WIND_SCALE = [
  { max: 2,   bg: '#DDE4E8', text: '#52616C' },
  { max: 5,   bg: '#B8D9D7', text: '#0A5D5B' },
  { max: 6,   bg: '#6CC8C4', text: '#074A47' },
  { max: 11,  bg: '#0FA3A0', text: '#ffffff' },
  { max: 15,  bg: '#FF8A3D', text: '#ffffff' },
  { max: 18,  bg: '#FF5A36', text: '#ffffff' },
  { max: 999, bg: '#8B1A1A', text: '#ffffff' },
];

function windCellStyle(ms) {
  if (ms == null) return { bg: 'transparent', text: 'inherit' };
  for (const s of WIND_SCALE) {
    if (ms < s.max) return { bg: s.bg, text: s.text };
  }
  return { bg: '#8B1A1A', text: '#ffffff' };
}

// Compute verdict: 'good' | 'warn' | 'bad'
function verdict(sportId, windMs, gustMs, windDirDeg, spotId, condCode) {
  const sport = SPORTS[sportId];
  if (!sport) return 'bad';

  if (sport.noThunder && condCode && /thunder|storm/i.test(condCode)) return 'bad';

  const w = sport.wind;
  let v;
  if (windMs >= w.good[0] && windMs <= w.good[1]) {
    v = 'good';
  } else if (
    (w.warnLow  && windMs >= w.warnLow[0]  && windMs < w.warnLow[1]) ||
    (w.warnHigh && windMs > w.warnHigh[0] && windMs <= w.warnHigh[1])
  ) {
    v = 'warn';
  } else {
    v = 'bad';
  }

  if (v === 'good' && gustMs != null && gustMs > windMs + sport.maxGustDelta) v = 'warn';

  if (sport.noOffshore && v !== 'bad') {
    const spot = SPOTS.find(s => s.id === spotId);
    if (spot && spot.badDirs && windDirDeg != null) {
      for (const [dMin, dMax] of spot.badDirs) {
        const d = windDirDeg;
        const inRange = dMin <= dMax ? (d >= dMin && d <= dMax)
          : (d >= dMin || d <= dMax); // wrap-around ranges like [315, 45]
        if (inRange) return 'bad';
      }
    }
  }

  return v;
}

// Short reason string shown in the "Dabar" card
function verdictReason(sportId, windMs, gustMs, condCode) {
  const sport = SPORTS[sportId];
  if (!sport) return '';
  const w = sport.wind;
  const ms = m => m != null ? m.toFixed(1) + ' m/s' : '';
  if (sport.noThunder && condCode && /thunder/i.test(condCode)) return 'Perkūnija';
  if (windMs < (w.warnLow ? w.warnLow[0] : w.good[0])) return 'Per silpnas: ' + ms(windMs);
  if (windMs > (w.warnHigh ? w.warnHigh[1] : w.good[1])) return 'Per stiprus: ' + ms(windMs);
  if (gustMs != null && gustMs > windMs + sport.maxGustDelta) return 'Gūsiai per stiprūs: ' + ms(gustMs);
  if (w.warnLow && windMs >= w.warnLow[0] && windMs < w.warnLow[1]) return 'Silpnokas: ' + ms(windMs);
  if (w.warnHigh && windMs > w.warnHigh[0] && windMs <= w.warnHigh[1]) return 'Stiprokas: ' + ms(windMs);
  return 'Vėjas tinkamas: ' + ms(windMs);
}
