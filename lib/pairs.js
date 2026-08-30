// lib/pairs.js
// Pasangan mata uang utama + definisi keterkaitannya dengan indikator.
// Model dampak sederhana: setiap indikator menggerakkan satu "currency utama".
// Untuk tiap pair, posisi currency itu di base/quote menentukan arah pergerakan.

export const PAIRS = [
  { symbol: "EURUSD", label: "EUR/USD", base: "EUR", quote: "USD" },
  { symbol: "GBPUSD", label: "GBP/USD", base: "GBP", quote: "USD" },
  { symbol: "USDJPY", label: "USD/JPY", base: "USD", quote: "JPY" },
  { symbol: "USDCHF", label: "USD/CHF", base: "USD", quote: "CHF" },
  { symbol: "AUDUSD", label: "AUD/USD", base: "AUD", quote: "USD" },
  { symbol: "USDCAD", label: "USD/CAD", base: "USD", quote: "CAD" },
  { symbol: "NZDUSD", label: "NZD/USD", base: "NZD", quote: "USD" },
  { symbol: "XAUUSD", label: "Gold / USD", base: "XAU", quote: "USD" },
  // Cross & komoditas
  { symbol: "EURGBP", label: "EUR/GBP", base: "EUR", quote: "GBP" },
  { symbol: "EURJPY", label: "EUR/JPY", base: "EUR", quote: "JPY" },
  { symbol: "GBPJPY", label: "GBP/JPY", base: "GBP", quote: "JPY" },
  { symbol: "AUDNZD", label: "AUD/NZD", base: "AUD", quote: "NZD" },
  { symbol: "CHFJPY", label: "CHF/JPY", base: "CHF", quote: "JPY" },
  { symbol: "USDCNH", label: "USD/CNH", base: "USD", quote: "CNH" },
];

const IND_CURRENCY = {
  nfp: { cur: "USD", bullDir: 1, via: "sinyal ketenagakerjaan → ekspektasi suku bunga & yield AS" },
  unemp: { cur: "USD", bullDir: -1, via: "likuiditas pasar kerja → jalur suku bunga The Fed" },
  cpi: { cur: "USD", bullDir: 1, via: "inflasi inti-kebijakan → stance The Fed & real yield" },
  corecpi: { cur: "USD", bullDir: 1, via: "inflasi inti → fokus utama The Fed" },
  ppi: { cur: "USD", bullDir: 1, via: "inflasi produsen → pendahulu inflasi konsumen" },
  ahe: { cur: "USD", bullDir: 1, via: "inflasi upah → tekanan hawkish The Fed" },
  fedfunds: { cur: "USD", bullDir: 1, via: "keputusan FOMC langsung" },
  dgs10: { cur: "USD", bullDir: 1, via: "real yield & carry AS" },
  retail: { cur: "USD", bullDir: 1, via: "momentum konsumsi → GDP & jalur suku bunga" },
  indpro: { cur: "USD", bullDir: 1, via: "aktivitas industri → ekspektasi pertumbuhan" },
  gdp: { cur: "USD", bullDir: 1, via: "momentum pertumbuhan AS" },
  umich: { cur: "USD", bullDir: 1, via: "sentimen & ekspektasi inflasi konsumen" },
  ismmfg: { cur: "USD", bullDir: 1, via: "aktivitas manufaktur → ekspektasi pertumbuhan & suku bunga" },
  ismsvc: { cur: "USD", bullDir: 1, via: "sektor jasa (±80% PDB) → momentum pertumbuhan AS" },
  eu_cpi: { cur: "EUR", bullDir: 1, via: "inflasi HICP → stance ECB" },
  eu_unemp: { cur: "EUR", bullDir: -1, via: "pasar kerja EZ → jalur ECB" },
  uk_cpi: { cur: "GBP", bullDir: 1, via: "inflasi CPI → stance BoE" },
  uk_unemp: { cur: "GBP", bullDir: -1, via: "pasar kerja UK → jalur BoE" },
  jp_cpi: { cur: "JPY", bullDir: 1, via: "jalur normalisasi BOJ & diferensial suku bunga" },
  claims: { cur: "USD", bullDir: -1, via: "frekuensi pelemahan pasar kerja" },
  capacity: { cur: "USD", bullDir: 1, via: "tekanan kapasitas → tekanan inflasi produksi" },
  eu_gdp: { cur: "EUR", bullDir: 1, via: "pertumbuhan EZ → stance ECB" },
  china_cpi: { cur: "CNH", bullDir: 1, via: "stimulus PBoC & permintaan global (CNY offshore)" },
  wti: { cur: "CAD", bullDir: 1, via: "arus ekspor energi & inflasi global (produsen minyak)" },
  brent: { cur: "CAD", bullDir: 1, via: "arus ekspor energi & inflasi global (produsen minyak)" },
  natgas: { cur: "USD", bullDir: 1, via: "biaya energi AS & eksportir energi" },
  copper: { cur: "AUD", bullDir: 1, via: "permintaan industri global (Dr. Copper)" },
  vix: { cur: "USD", bullDir: 1, via: "risk-off → aset safe-haven (USD/JPY/CHF/emas)" },
};

export function getIndicatorCurrency(indicatorId) {
  return IND_CURRENCY[indicatorId] || null;
}

// Estimasi pergerakan pair 15 menit pasca-rilis (model heuristik, bukan saran trading):
// skala respons pasar historis ≈ 0,04% per 10 poin indeks kejutan, plafon 0,6%.
export function estPairMove(surpriseIdx) {
  const a = Math.min(Math.abs(surpriseIdx) || 0, 150);
  return Math.round(0.004 * a * 100) / 100;
}

// Reaksi mata uang utama (untuk banner): arah + estimasi + via.
export function currencyReaction(indicatorId, surpriseIdx) {
  const meta = getIndicatorCurrency(indicatorId);
  if (!meta || surpriseIdx === null || surpriseIdx === undefined) return null;
  const sign = surpriseIdx > 0 ? 1 : surpriseIdx < 0 ? -1 : 0;
  const curMove = meta.bullDir * sign;
  return {
    cur: meta.cur,
    dir: curMove,
    est: estPairMove(surpriseIdx),
    via: meta.via,
    label: curMove > 0 ? `${meta.cur} Menguat` : curMove < 0 ? `${meta.cur} Melemah` : `${meta.cur} Netral`,
  };
}

export function computePairImpact(indicatorId, surprisePct, surprise = null, surpriseIdx = null) {
  const meta = getIndicatorCurrency(indicatorId);
  if (!meta || surprisePct === null || surprisePct === undefined) return [];

  const sign = surprisePct > 0 ? 1 : surprisePct < 0 ? -1 : 0;
  const currencyMove = meta.bullDir * sign; // +1 currency menguat, -1 melemah
  const mag = surpriseIdx != null
    ? magnitudeFromIndex(surpriseIdx)
    : magnitudeFromSurprise(surprisePct);
  const est = estPairMove(surpriseIdx != null ? surpriseIdx : surprisePct);

  const out = [];
  for (const p of PAIRS) {
    const isBase = p.base === meta.cur;
    const isQuote = p.quote === meta.cur;
    if (!isBase && !isQuote) continue;
    const baseSign = isBase ? 1 : -1;
    const pairDir = currencyMove * baseSign; // +1 = pair naik, -1 = turun
    const dir = pairDir > 0 ? 1 : pairDir < 0 ? -1 : 0;
    const strength = dir === 1 ? "Bullish" : dir === -1 ? "Bearish" : "Netral";
    const note =
      (isBase
        ? `${meta.cur} menguat → ${p.label} naik`
        : `${meta.cur} menguat → ${p.label} turun`) +
      (mag >= 3 ? ". Dampak kuat." : ".");
    out.push({ symbol: p.symbol, label: p.label, dir, strength, magnitude: mag, note, est });
  }
  return out;
}

function magnitudeFromSurprise(pct) {
  const a = Math.abs(pct);
  if (a < 1) return 1;
  if (a < 4) return 2;
  if (a < 12) return 3;
  if (a < 30) return 4;
  return 5;
}

// Skala indeks kejutan (100 = selebar satu skala tipikal indikator).
function magnitudeFromIndex(idx) {
  const a = Math.abs(idx);
  if (a < 15) return 1;
  if (a < 45) return 2;
  if (a < 90) return 3;
  if (a < 200) return 4;
  return 5;
}

export function magnitudeLabel(m) {
  return ["", "Ringan", "Moderat", "Kuat", "Sangat Kuat", "Ekstrem"][m] || "—";
}
