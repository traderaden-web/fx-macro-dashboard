// lib/macroData.js
// Data makro global kurasi untuk Peta Makro (indikator per negara).
// Per: 30 Agustus 2026.
// Sumber: ONS (UK CPI Jul-26), TradingEconomics (US/UK/Euro area CPI Jul-26),
// ECB staff projections Jun-26 (GDP Zona Euro), FRED ECBDFR, RBA media release
// 11-08-2026 (RBA hold 4.35%), Investing.com central banks (Fed/BOE/SNB/BOC/RBNZ/
// BOJ/RBI/PBOC/CBR/BCB), Fitch GEO Jun-26 (GDP 2026), OECD GDP flash Q2-26,
// UK Parliamentary research briefing 08-07-2026 (GDP Q1-26).
// Nilai yang tidak tersedia → null (digambar abu-abu di peta).

export const MACRO_ASOF = "30 Agu 2026";

// Koordinat ibu kota (lon, lat) untuk pin berdenyut di peta — proyeksi
// equirectangular yang sama dengan worldMapData (viewBox 1000x500).
export const CAPITAL_POINTS = {
  us: [-77.0, 38.9],   // Washington D.C.
  euro: [8.68, 50.11], // Frankfurt (markas ECB)
  gb: [-0.12, 51.5],   // London
  ch: [7.45, 46.95],   // Bern
  jp: [139.69, 35.69], // Tokyo
  ca: [-75.7, 45.42],  // Ottawa
  au: [149.13, -35.28],// Canberra
  nz: [174.76, -41.29],// Wellington
  cn: [116.4, 39.9],   // Beijing
  in: [77.21, 28.61],  // New Delhi
  br: [-47.88, -15.79],// Brasília
  ru: [37.62, 55.75],  // Moskow
};

const MAP_W = 1000;
const MAP_H = 500;
export function projectPoint(lon, lat) {
  return [((lon + 180) / 360) * MAP_W, ((90 - lat) / 180) * MAP_H];
}

// data: rate = suku bunga acuan (%), inflation = CPI YoY (%),
// gdp = pertumbuhan GDP (% — basis tiap negara dicatat di gdpNote),
// unemp = tingkat pengangguran (%) — data per 28–30 Agu 2026 (TradingEconomics
// country list, FRED UNRATE, BLS, Eurostat, ONS, ABS, StatsCan, NBS),
// move = perubahan kebijakan terakhir (basis poin; + hawkish, − dovish, 0 hold).
const D = {
  us: {
    rate: 3.75, inflation: 3.4, gdp: 2.1, unemp: 4.1, move: -25,
    rateBank: "The Fed", gdpNote: "annualized Q1-26",
    moveNote: "−25bp Des 2025; The Fed was-was kembali hawkish (risiko naik Sept 2026)",
  },
  euro: {
    rate: 2.4, inflation: 2.9, gdp: 0.8, unemp: 6.3, move: 25,
    rateBank: "ECB", gdpNote: "proyeksi 2026 (ECB)",
    moveNote: "+25bp Jun 2026 — kenaikan pertama dalam 3 thn",
  },
  gb: {
    rate: 3.75, inflation: 2.9, gdp: 0.9, unemp: 4.9, move: -25,
    rateBank: "Bank of England", gdpNote: "proyeksi 2026",
    moveNote: "−25bp Des 2025 (hold sejak)",
  },
  ch: {
    rate: 0.0, inflation: null, gdp: null, unemp: 3.0, move: -25,
    rateBank: "SNB", gdpNote: null,
    moveNote: "−25bp Jun 2025 (hold sejak)",
  },
  jp: {
    rate: 1.0, inflation: null, gdp: 1.1, unemp: 2.4, move: 25,
    rateBank: "BOJ", gdpNote: "annualized Q2-26 (prelim)",
    moveNote: "+25bp 2026 (0.75 → 1.00)",
  },
  ca: {
    rate: 2.25, inflation: null, gdp: null, unemp: 6.4, move: -25,
    rateBank: "Bank of Canada", gdpNote: null,
    moveNote: "−25bp Okt 2025 (hold sejak)",
  },
  au: {
    rate: 4.35, inflation: null, gdp: null, unemp: 4.5, move: 25,
    rateBank: "RBA", gdpNote: null,
    moveNote: "+25bp Mei 2026, hold 11 Agu 2026",
  },
  nz: {
    rate: 2.5, inflation: null, gdp: null, unemp: null, move: 25,
    rateBank: "RBNZ", gdpNote: null,
    moveNote: "+25bp Agu 2026 (2.25 → 2.50)",
  },
  cn: {
    rate: 3.0, inflation: 0.5, gdp: 4.6, unemp: 5.2, move: -10,
    rateBank: "PBoC (LPR 1-tahun)", gdpNote: "proyeksi 2026",
    moveNote: "−10bp Mei 2025 (hold sejak)",
  },
  in: {
    rate: 5.25, inflation: null, gdp: 6.5, unemp: 5.1, move: -25,
    rateBank: "RBI", gdpNote: "proyeksi 2026",
    moveNote: "−25bp Des 2025 (hold sejak)",
  },
  br: {
    rate: 14.0, inflation: null, gdp: null, unemp: 5.3, move: -25,
    rateBank: "BCB", gdpNote: null,
    moveNote: "−25bp Apr 2026 (14.50 → 14.00)",
  },
  ru: {
    rate: 14.0, inflation: null, gdp: null, unemp: 2.2, move: -50,
    rateBank: "CBR", gdpNote: null,
    moveNote: "−50bp Apr 2026 (14.50 → 14.00)",
  },
};

// ID TopoJSON (ISO numeric) → data makro
const IDMAP = {
  "840": "us",
  "826": "gb",
  "756": "ch",
  "392": "jp",
  "124": "ca",
  "036": "au",
  "554": "nz",
  "156": "cn",
  "356": "in",
  "076": "br",
  "643": "ru",
  // Zona Euro (19 negara) → data agregat Zona Euro
  "276": "euro", "250": "euro", "380": "euro", "724": "euro", "528": "euro",
  "620": "euro", "040": "euro", "246": "euro", "372": "euro", "056": "euro",
  "300": "euro", "442": "euro", "705": "euro", "703": "euro", "191": "euro",
  "233": "euro", "428": "euro", "440": "euro", "196": "euro", "470": "euro",
};

const NAMEMAP = {
  us: "Amerika Serikat", euro: "Zona Euro", gb: "Inggris", ch: "Swiss",
  jp: "Jepang", ca: "Kanada", au: "Australia", nz: "Selandia Baru",
  cn: "Tiongkok", in: "India", br: "Brasil", ru: "Rusia",
};

export const COUNTRY_DATA = D;
export const COUNTRY_NAMES = NAMEMAP;

// dataFor(idTopo) → { name, bank, rate, inflation, gdp, gdpNote, move, moveNote } | null
export function dataFor(id) {
  const key = IDMAP[String(id)];
  if (!key) return null;
  const d = D[key];
  return {
    key,
    name: NAMEMAP[key],
    bank: d.rateBank,
    rate: d.rate,
    inflation: d.inflation,
    gdp: d.gdp,
    gdpNote: d.gdpNote,
    unemp: d.unemp,
    move: d.move,
    moveNote: d.moveNote,
  };
}

export const INDICATORS = [
  { id: "rate", label: "Suku Bunga Acuan", unit: "%", domain: [0, 15] },
  { id: "inflation", label: "Inflasi YoY", unit: "%", domain: [0, 4] },
  { id: "gdp", label: "Pertumbuhan GDP", unit: "%", domain: [0, 7] },
  { id: "unemp", label: "Tingkat Pengangguran", unit: "%", domain: [2, 8] },
  { id: "move", label: "Langkah Kebijakan Terakhir", unit: "bp", domain: [-60, 60] },
];

export function indicatorValue(indId, d) {
  if (!d) return null;
  return d[indId];
}

// ---- skala warna (dark theme) ----
// rate: netral → emas (semakin tinggi = kebijakan semakin ketat)
// inflation: dingin → hangat (rendah → tinggi)
// gdp: dingin → hangat (lambat → cepat)
// move: dovish (hijau) ↔ hawkish (merah), 0 = netral
function hex2rgb(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}
function mix(a, b, t) {
  const A = hex2rgb(a), B = hex2rgb(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
const NO_DATA = "#2a3140";

export function countryColor(indId, value) {
  if (value === null || value === undefined) return NO_DATA;
  const clampT = (t) => Math.max(0, Math.min(1, t));
  switch (indId) {
    case "rate": {
      // 0% → abu kebiruan, 15% → emas terang
      const t = clampT(value / 15);
      return mix("#3b4658", "#f0b429", t);
    }
    case "inflation": {
      const t = clampT(value / 4);
      if (t < 0.5) return mix("#2f4157", "#e8b93a", t * 2);
      return mix("#e8b93a", "#ef6a4c", (t - 0.5) * 2);
    }
    case "gdp": {
      const t = clampT(value / 7);
      if (t < 0.5) return mix("#2f4157", "#8fb45c", t * 2);
      return mix("#8fb45c", "#4ade80", (t - 0.5) * 2);
    }
    case "unemp": {
      // rendah (2%) = hijau (sehat) → tinggi (8%) = merah (lemah)
      const t = clampT((value - 2) / 6);
      if (t < 0.45) return mix("#3f9d6f", "#4a5468", t / 0.45);
      return mix("#4a5468", "#ef6a4c", (t - 0.45) / 0.55);
    }
    case "move": {
      // -60 → hijau (dovish), 0 → netral, +60 → merah (hawkish)
      const a = Math.min(Math.abs(value), 60) / 60;
      if (value > 0) return mix("#414a5c", "#ef6a4c", 0.25 + a * 0.75);
      if (value < 0) return mix("#414a5c", "#4ade80", 0.25 + a * 0.75);
      return "#8a93a6";
    }
    default:
      return NO_DATA;
  }
}

// legenda: daftar [posisi 0-1, warna] untuk gradient bar
export function legendStops(indId) {
  const [lo, hi] = INDICATORS.find((i) => i.id === indId).domain;
  const n = 12;
  const stops = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const v = lo + (hi - lo) * t;
    stops.push([t, countryColor(indId, v)]);
  }
  return stops;
}
