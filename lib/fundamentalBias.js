// lib/fundamentalBias.js
// "Bias Fundamental" per mata uang — skor struktural (0–100) dari data makro:
// suku bunga riil, sikap kebijakan (hawkish/dovish), pertumbuhan & pasar kerja.
// Digabung dengan "currency strength" jangka pendek (dari harga) sehingga
// pengguna melihat dua dimensi: FUNDAMENTAL (jangka menengah) & TEKNIS (harian).

import { COUNTRY_DATA, COUNTRY_NAMES } from "./macroData";

const CURRENCIES = [
  { cc: "USD", key: "us", name: "Dolar AS", pairs: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "NZD/USD"] },
  { cc: "EUR", key: "euro", name: "Euro", pairs: ["EUR/USD", "EUR/GBP", "EUR/JPY"] },
  { cc: "GBP", key: "gb", name: "Pound", pairs: ["GBP/USD", "EUR/GBP", "GBP/JPY"] },
  { cc: "JPY", key: "jp", name: "Yen", pairs: ["USD/JPY", "EUR/JPY", "GBP/JPY"] },
  { cc: "CHF", key: "ch", name: "Franc Swiss", pairs: ["USD/CHF"] },
  { cc: "AUD", key: "au", name: "Dolar AU", pairs: ["AUD/USD"] },
  { cc: "CAD", key: "ca", name: "Dolar CA", pairs: ["USD/CAD"] },
  { cc: "NZD", key: "nz", name: "Dolar NZ", pairs: ["NZD/USD"] },
  { cc: "CNY", key: "cn", name: "Yuan", pairs: [] },
];

const clamp = (t, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, t));

// Skor komponen: semua dipetakan ke 0–100 lalu dibobot.
function components(d) {
  const target = 2.0; // target inflasi G10
  const inf = d.inflation;
  const realRate = d.rate != null && inf != null ? d.rate - inf : (d.rate != null ? d.rate - target : null);

  const rateScore = realRate == null ? 50 : Math.round(20 + clamp((realRate + 3) / 6) * 70); // -3% → 20, +3% → 90
  const policyScore = d.move == null ? 50 : Math.round(50 + clamp(d.move / 50) * 40); // dovish → 10, hawkish → 90
  const growthScore = d.gdp == null ? 50 : Math.round(35 + clamp(d.gdp / 6) * 50); // 0% → 35, 6% → 85
  const unempScore = d.unemp == null ? 50 : Math.round(85 - clamp((d.unemp - 3) / 5) * 60); // 3% → 85, 8% → 25

  const score = Math.round(rateScore * 0.35 + policyScore * 0.25 + growthScore * 0.2 + unempScore * 0.2);
  return {
    rateScore, policyScore, growthScore, unempScore,
    realRate: realRate == null ? null : Number(realRate.toFixed(1)),
    score,
    label: score >= 68 ? "KUAT" : score >= 55 ? "CENDERUNG KUAT" : score >= 45 ? "NETRAL" : score >= 32 ? "CENDERUNG LEMAH" : "LEMAH",
  };
}

function notes(d) {
  const parts = [];
  if (d.rate != null && d.move != null) {
    parts.push(d.move > 0 ? `${d.rateBank} hawkish (+${d.move}bp)` : d.move < 0 ? `${d.rateBank} dovish (${d.move}bp)` : `${d.rateBank} hold`);
  }
  if (d.inflation != null) parts.push(`Inflasi ${d.inflation}%`);
  if (d.gdp != null) parts.push(`GDP ${d.gdp}%`);
  if (d.unemp != null) parts.push(`Pengangguran ${d.unemp}%`);
  return parts.join(" · ");
}

/** @returns array mata uang dengan skor fundamental + (opsional) strength teknis. */
export function fundamentalBias(strengthByCcy = {}) {
  return CURRENCIES.map((c) => {
    const d = COUNTRY_DATA[c.key];
    if (!d) return null;
    const comp = components(d);
    const tech = strengthByCcy[c.cc]; // {score, pct, label} atau undefined
    return {
      cc: c.cc,
      name: c.name,
      countryName: COUNTRY_NAMES[c.key],
      pairs: c.pairs,
      bank: d.rateBank,
      rate: d.rate,
      ...comp,
      tech: tech || null,
      note: notes(d),
    };
  }).filter(Boolean);
}

/** Gabungkan skor fundamental & teknis → skor gabungan 0–100. */
export function blendedScore(f, tech) {
  if (tech == null) return f.score;
  return Math.round(f.score * 0.55 + tech.score * 0.45);
}

/** Label konsensus gabungan. */
export function blendedLabel(score) {
  return score >= 68 ? "STRONG BUY" : score >= 55 ? "BUY" : score >= 45 ? "NEUTRAL" : score >= 32 ? "SELL" : "STRONG SELL";
}
