// lib/strength.js
// Mesin "Currency Strength Meter" — mengukur kekuatan relatif tiap mata uang
// dari pergerakan harga hari ini (day-change %) pada semua pasangan FX.
//
// Metode: setiap pasangan menyumbang +pct ke mata uang dasar (base) dan -pct
// ke mata uang kutipan (quote). Skor per mata uang = rata-rata kontribusi,
// lalu dinormalisasi ke skala 0–100 (50 = netral). Logam (XAU/XAG) dikecualikan
// karena bukan mata uang.

const CURRENCIES = new Set([
  "USD", "EUR", "GBP", "JPY", "CHF", "AUD", "CAD", "NZD",
  "IDR", "SGD", "CNY", "INR", "TRY",
]);

// Rentang yang dipetakan ke skala 0–100. Day-move sebesar ±0.5% dianggap
// ekstrem (skor 0 / 100). Angka ini empiris untuk pasar FX harian.
const SPAN = 0.5;

/** @returns {{currency, score, label, pct}[]} diurutkan dari paling kuat. */
export function computeCurrencyStrength(pairs = []) {
  const contribution = {};
  const count = {};

  for (const p of pairs) {
    if (!p.symbol || !p.symbol.includes("/")) continue;
    const [base, quote] = p.symbol.split("/");
    if (!CURRENCIES.has(base) || !CURRENCIES.has(quote)) continue;
    const pct = Number(p.pct) || 0;
    contribution[base] = (contribution[base] || 0) + pct;
    contribution[quote] = (contribution[quote] || 0) - pct;
    count[base] = (count[base] || 0) + 1;
    count[quote] = (count[quote] || 0) + 1;
  }

  const names = {
    USD: "Dolar AS", EUR: "Euro", GBP: "Pound", JPY: "Yen",
    CHF: "Franc Swiss", AUD: "Dolar AU", CAD: "Dolar CA", NZD: "Dolar NZ",
    IDR: "Rupiah", SGD: "Dolar SG", CNY: "Yuan", INR: "Rupee", TRY: "Lira",
  };

  const result = [];
  for (const cur of Object.keys(contribution)) {
    const avg = contribution[cur] / (count[cur] || 1);
    const score = Math.max(0, Math.min(100, 50 + (avg / SPAN) * 50));
    result.push({
      currency: cur,
      name: names[cur] || cur,
      pct: Number(avg.toFixed(3)),
      score: Math.round(score),
      label: score >= 66 ? "KUAT" : score >= 55 ? "CENDERUNG KUAT" : score >= 45 ? "NETRAL" : score >= 34 ? "CENDERUNG LEMAH" : "LEMAH",
    });
  }

  // Urutkan dari paling kuat ke paling lemah.
  result.sort((a, b) => b.score - a.score);
  return result;
}

/** @returns skor ringkas 0–100 untuk satu mata uang (50 netral). */
export function currencyScore(currency, strength) {
  const found = strength.find((s) => s.currency === currency);
  return found ? found.score : 50;
}

/** @returns rangkuman bias risk-on/off berbasis skor rata-rata mata uang risk. */
export function riskBias(strength) {
  if (!strength.length) return null;
  // Mata uang "risk" yang biasanya menguat saat risk-on.
  const riskOn = ["AUD", "NZD", "CAD", "GBP", "IDR", "TRY", "SGD"];
  const safe = ["USD", "JPY", "CHF"];
  const avg = (codes) =>
    codes.reduce((sum, c) => sum + currencyScore(c, strength), 0) / Math.max(1, codes.length);
  const rOn = avg(riskOn);
  const rOff = avg(safe);
  const gap = rOn - rOff;
  const label =
    gap >= 8 ? "RISK-ON" : gap >= 3 ? "CENDERUNG RISK-ON" : gap <= -8 ? "RISK-OFF" : gap <= -3 ? "CENDERUNG RISK-OFF" : "NETRAL";
  return { gap: Number(gap.toFixed(1)), riskOn: Number(rOn.toFixed(0)), riskOff: Number(rOff.toFixed(0)), label };
}
