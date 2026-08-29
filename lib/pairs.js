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
  nfp: { cur: "USD", bullDir: 1 },
  unemp: { cur: "USD", bullDir: -1 },
  cpi: { cur: "USD", bullDir: 1 },
  corecpi: { cur: "USD", bullDir: 1 },
  ppi: { cur: "USD", bullDir: 1 },
  ahe: { cur: "USD", bullDir: 1 },
  fedfunds: { cur: "USD", bullDir: 1 },
  dgs10: { cur: "USD", bullDir: 1 },
  retail: { cur: "USD", bullDir: 1 },
  indpro: { cur: "USD", bullDir: 1 },
  gdp: { cur: "USD", bullDir: 1 },
  umich: { cur: "USD", bullDir: 1 },
  eu_cpi: { cur: "EUR", bullDir: 1 },
  eu_unemp: { cur: "EUR", bullDir: -1 },
  uk_cpi: { cur: "GBP", bullDir: 1 },
  uk_unemp: { cur: "GBP", bullDir: -1 },
  jp_cpi: { cur: "JPY", bullDir: 1 },
  claims: { cur: "USD", bullDir: -1 },
  capacity: { cur: "USD", bullDir: 1 },
  eu_gdp: { cur: "EUR", bullDir: 1 },
  china_cpi: { cur: "CNH", bullDir: 1 }, // CNY=CNH offshore, cocok dengan pair USD/CNH
  wti: { cur: "CAD", bullDir: 1, note: "Harga minyak tinggi menguatkan CAD/NOK (produsen)." },
  brent: { cur: "CAD", bullDir: 1, note: "Brent naik menguatkan CAD/NOK (produsen minyak)." },
  natgas: { cur: "USD", bullDir: 1, note: "Gas naik → biaya energi & eksportir energi (USD) menguat." },
  copper: { cur: "AUD", bullDir: 1, note: "Tembaga naik → permintaan global kuat → AUD/NZD menguat." },
  vix: { cur: "USD", bullDir: 1, note: "VIX tinggi = risk-off → aset safe-haven (USD/JPY/CHF/emas) cenderung diburu." },
};

export function getIndicatorCurrency(indicatorId) {
  return IND_CURRENCY[indicatorId] || null;
}

export function computePairImpact(indicatorId, surprisePct, surprise = null) {
  const meta = getIndicatorCurrency(indicatorId);
  if (!meta || surprisePct === null || surprisePct === undefined) return [];

  const sign = surprisePct > 0 ? 1 : surprisePct < 0 ? -1 : 0;
  const currencyMove = meta.bullDir * sign; // +1 currency menguat, -1 melemah
  const mag = magnitudeFromSurprise(surprisePct);

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
      (isBase ? `${meta.cur} menguat → ${p.label} naik` : `${meta.cur} menguat → ${p.label} turun`) +
      (mag >= 3 ? `. Dampak kuat.` : ".");
    out.push({ symbol: p.symbol, label: p.label, dir, strength, magnitude: mag, note });
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

export function magnitudeLabel(m) {
  return ["", "Ringan", "Moderat", "Kuat", "Sangat Kuat", "Ekstrem"][m] || "—";
}
