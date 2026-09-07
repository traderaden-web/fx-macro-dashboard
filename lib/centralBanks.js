// lib/centralBanks.js
// Papan Bank Sentral — data kurasi per 30 Agustus 2026, konsisten dengan
// lib/macroData.js & lib/fundamentals.js (dunia data MacroLab).
//
// Sumber tiap bank sentral dicantumkan per baris (situs resmi) + label metode
// suku bunga yang dipakai (setiap bank punya instrumen acuan berbeda).
// Angka LIVE menimpa nilai kurasi lewat `applyLiveOverrides()` (dipanggil
// server di app/fundamentals/page.jsx — FRED utk AS/EZ, Yahoo utk harga pasar).
//
// Tanggal pertemuan berikutnya dikonversi ke WIB (ISO +07:00) sehingga
// countdown di UI akurat tanpa hitung ulang zona waktu di klien.

export const BANKS_ASOF = "30 Agu 2026";

/** Enum sikap kebijakan → label & warna (dipakai badge di UI). */
export const STANCES = {
  hawkish: { label: "HAWKISH", desc: "bias mengetat / baru menaikkan suku bunga", tone: "up" },
  "hawkish-hold": { label: "HOLD · HAWKISH", desc: "menahan, condong ketat", tone: "warn" },
  neutral: { label: "NETRAL", desc: "menahan, dua arah", tone: "flat" },
  "dovish-hold": { label: "HOLD · DOVISH", desc: "menahan, condong melonggarkan", tone: "flat" },
  dovish: { label: "DOVISH", desc: "bias melonggarkan / baru memangkas suku bunga", tone: "down" },
};

/**
 * Daftar bank sentral. `rate` = suku bunga acuan (%), `prevRate` = level
 * sebelum langkah terakhir, `lastMove.bp` (+ naik / − turun), `nextMeeting.iso`
 * = waktu keputusan berikutnya dalam WIB.
 */
export const CENTRAL_BANKS = [
  {
    key: "us", cc: "USD", flag: "🇺🇸", country: "Amerika Serikat", currencyName: "Dolar AS",
    bankShort: "The Fed", bankName: "Federal Reserve",
    rateLabel: "Federal Funds Rate (batas atas)",
    rate: 3.75, rateRange: "3,50–3,75%", prevRate: 4.0,
    lastMove: { bp: -25, date: "2025-12-10", label: "10 Des 2025" },
    inflation: { value: 3.4, label: "CPI YoY · Jul 2026", core: 2.5 },
    target: { lo: 2, hi: 2, label: "2,0%" },
    gdp: { value: 2.1, note: "annualized Q1-26" },
    unemp: { value: 4.1, note: "NFP Jul: −23K" },
    nextMeeting: { iso: "2026-09-17T01:00:00+07:00", label: "17 Sep (01:00 WIB)", name: "FOMC + SEP (16 Sep ET)" },
    nextMeeting2: "28 Okt 2026", freq: "8×/tahun",
    stance: "hawkish-hold",
    marketNote: "Pasar menghargai HOLD pada 16 Sep; kenaikan +25bp jadi opsi bila inflasi tetap panas.",
    source: { label: "federalreserve.gov", url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" },
  },
  {
    key: "euro", cc: "EUR", flag: "🇪🇺", country: "Zona Euro", currencyName: "Euro",
    bankShort: "ECB", bankName: "European Central Bank",
    rateLabel: "Deposit Facility Rate",
    rate: 2.4, prevRate: 2.15,
    lastMove: { bp: 25, date: "2026-06-11", label: "11 Jun 2026" },
    inflation: { value: 2.9, label: "HICP YoY · Jul 2026", core: 2.5 },
    target: { lo: 2, hi: 2, label: "2,0%" },
    gdp: { value: 0.8, note: "proyeksi 2026 (ECB)" },
    unemp: { value: 6.3, note: "Jun 2026 (Eurostat)" },
    nextMeeting: { iso: "2026-09-10T19:15:00+07:00", label: "10 Sep", name: "Governing Council" },
    nextMeeting2: "29 Okt 2026", freq: "8×/tahun",
    stance: "hawkish",
    marketNote: "Kenaikan pertama dalam 3 thn (Jun); pasar memantau lanjutan +25bp di Q4.",
    source: { label: "ecb.europa.eu", url: "https://www.ecb.europa.eu/press/calendars/mgcgc/html/index.en.html" },
  },
  {
    key: "gb", cc: "GBP", flag: "🇬🇧", country: "Inggris", currencyName: "Pound Sterling",
    bankShort: "BoE", bankName: "Bank of England",
    rateLabel: "Bank Rate",
    rate: 3.75, prevRate: 4.0,
    lastMove: { bp: -25, date: "2025-12-18", label: "18 Des 2025" },
    inflation: { value: 2.9, label: "CPI YoY · Jul 2026", core: 2.6 },
    target: { lo: 2, hi: 2, label: "2,0%" },
    gdp: { value: 0.9, note: "proyeksi 2026" },
    unemp: { value: 4.9, note: "ONS, 3-bulanan" },
    nextMeeting: { iso: "2026-09-17T18:00:00+07:00", label: "17 Sep", name: "MPC" },
    nextMeeting2: "29 Okt 2026", freq: "8×/tahun",
    stance: "neutral",
    marketNote: "Hold sejak cut Des 2025; keputusan Sep bergantung data upah & jasa.",
    source: { label: "bankofengland.co.uk", url: "https://www.bankofengland.co.uk/monetary-policy/upcoming-mpc-dates" },
  },
  {
    key: "jp", cc: "JPY", flag: "🇯🇵", country: "Jepang", currencyName: "Yen",
    bankShort: "BOJ", bankName: "Bank of Japan",
    rateLabel: "Policy Rate (overnight call)",
    rate: 1.0, prevRate: 0.75,
    lastMove: { bp: 25, date: "2026-03-19", label: "19 Mar 2026" },
    inflation: { value: 2.8, label: "CPI YoY · Jul 2026 (kurasi)", core: 2.6 },
    target: { lo: 2, hi: 2, label: "2,0%" },
    gdp: { value: 1.1, note: "annualized Q2-26 (prelim)" },
    unemp: { value: 2.4, note: "angkatan kerja menua" },
    nextMeeting: { iso: "2026-09-18T11:00:00+07:00", label: "18 Sep", name: "MPM (perkiraan ±10:00 JST)" },
    nextMeeting2: "29–30 Okt 2026", freq: "8×/tahun",
    stance: "hawkish",
    marketNote: "Normalisasi lambat (0,75 → 1,00); risiko: intervensi MOF di USD/JPY >160.",
    source: { label: "boj.or.jp", url: "https://www.boj.or.jp/en/mopo/mpmsche_minu/index.htm" },
  },
  {
    key: "ch", cc: "CHF", flag: "🇨🇭", country: "Swiss", currencyName: "Franc Swiss",
    bankShort: "SNB", bankName: "Swiss National Bank",
    rateLabel: "SNB Policy Rate",
    rate: 0.0, prevRate: 0.25,
    lastMove: { bp: -25, date: "2025-06-19", label: "19 Jun 2025" },
    inflation: { value: 0.2, label: "CPI YoY · Jul 2026 (kurasi)" },
    target: { lo: 0, hi: 2, label: "0–2%" },
    gdp: { value: 1.2, note: "kurasi 2026" },
    unemp: { value: 3.0, note: "kurasi Jul 2026" },
    nextMeeting: { iso: "2026-09-24T13:30:00+07:00", label: "24 Sep", name: "Assessment Monetary Policy" },
    nextMeeting2: "10 Des 2026", freq: "4×/tahun",
    stance: "dovish-hold",
    marketNote: "Inflasi nyaris nol → ruang tetap terbuka; CHF kuat jadi rem ekspor.",
    source: { label: "snb.ch", url: "https://www.snb.ch/en/the-snb/mandates-goals/monetary-policy/monetary-policy-assessments" },
  },
  {
    key: "au", cc: "AUD", flag: "🇦🇺", country: "Australia", currencyName: "Dolar Australia",
    bankShort: "RBA", bankName: "Reserve Bank of Australia",
    rateLabel: "Cash Rate",
    rate: 4.35, prevRate: 4.1,
    lastMove: { bp: 25, date: "2026-05-05", label: "5 Mei 2026" },
    inflation: { value: 3.1, label: "CPI YoY · Q2 2026 (kurasi)", core: 3.0 },
    target: { lo: 2, hi: 3, label: "2–3%" },
    gdp: { value: 2.0, note: "kurasi 2026" },
    unemp: { value: 4.5, note: "Labour Force Jul 2026" },
    nextMeeting: { iso: "2026-10-07T10:30:00+07:00", label: "6–7 Okt", name: "RBA Board" },
    nextMeeting2: "10–11 Nov 2026", freq: "8×/tahun",
    stance: "hawkish",
    marketNote: "Paling hawkish di antara pair mayor; hold 11 Agu setelah +25bp Mei.",
    source: { label: "rba.gov.au", url: "https://www.rba.gov.au/monetary-policy/int-rate-decisions/" },
  },
  {
    key: "ca", cc: "CAD", flag: "🇨🇦", country: "Kanada", currencyName: "Dolar Kanada",
    bankShort: "BOC", bankName: "Bank of Canada",
    rateLabel: "Overnight Rate",
    rate: 2.25, prevRate: 2.5,
    lastMove: { bp: -25, date: "2025-10-29", label: "29 Okt 2025" },
    inflation: { value: 2.1, label: "CPI YoY · Jul 2026 (kurasi)", core: 2.4 },
    target: { lo: 1, hi: 3, label: "1–3% (mid 2%)" },
    gdp: { value: 1.3, note: "kurasi 2026" },
    unemp: { value: 6.4, note: "tertinggi di G7 bersama EZ" },
    nextMeeting: { iso: "2026-09-09T20:45:00+07:00", label: "9 Sep", name: "BOC Decision + MPR" },
    nextMeeting2: "28 Okt 2026", freq: "8×/tahun",
    stance: "dovish-hold",
    marketNote: "Pasar kerja lemah menahan BOC; CAD sangat bergantung harga minyak.",
    source: { label: "bankofcanada.ca", url: "https://www.bankofcanada.ca/press/upcoming-events/" },
  },
  {
    key: "nz", cc: "NZD", flag: "🇳🇿", country: "Selandia Baru", currencyName: "Dolar Selandia Baru",
    bankShort: "RBNZ", bankName: "Reserve Bank of New Zealand",
    rateLabel: "Official Cash Rate",
    rate: 2.5, prevRate: 2.25,
    lastMove: { bp: 25, date: "2026-08-12", label: "12 Agu 2026" },
    inflation: { value: 2.6, label: "CPI YoY · Q2 2026 (kurasi)" },
    target: { lo: 1, hi: 3, label: "1–3% (mid 2%)" },
    gdp: { value: 1.6, note: "kurasi 2026" },
    unemp: { value: 5.3, note: "kurasi Q2 2026" },
    nextMeeting: { iso: "2026-10-07T08:00:00+07:00", label: "7 Okt", name: "MPC" },
    nextMeeting2: "23–24 Nov 2026", freq: "7×/tahun",
    stance: "hawkish",
    marketNote: "+25bp Agu 2026 melawan arus global — mendukung NZD, tapi sensitif Cina.",
    source: { label: "rbnz.govt.nz", url: "https://www.rbnz.govt.nz/hub/news" },
  },
  {
    key: "id", cc: "IDR", flag: "🇮🇩", country: "Indonesia", currencyName: "Rupiah",
    bankShort: "BI", bankName: "Bank Indonesia",
    rateLabel: "BI-Rate (Reverse Repo 7 hari)",
    rate: 4.0, prevRate: 4.25,
    lastMove: { bp: -25, date: "2026-06-18", label: "17–18 Jun 2026" },
    inflation: { value: 2.1, label: "CPI YoY · Jul 2026 (BPS)", core: 1.94 },
    target: { lo: 1.5, hi: 3.5, label: "1,5–3,5%" },
    gdp: { value: 4.87, note: "YoY Q2-2026 (BPS)" },
    unemp: { value: 4.8, note: "Sakernas Feb 2026" },
    nextMeeting: { iso: "2026-09-17T15:15:00+07:00", label: "17 Sep", name: "RDG BI (keputusan ±15:15 WIB)" },
    nextMeeting2: "21–22 Okt 2026", freq: "6×/tahun",
    stance: "dovish-hold",
    marketNote: "Siklus pelonggaran berjalan (5,00 → 4,00); ruang cut tersisa ditukar demi stabilitas rupiah.",
    source: { label: "bi.go.id", url: "https://www.bi.go.id/id/informasi-aspek/kebijakan-moneter/default.aspx" },
  },
  {
    key: "cn", cc: "CNY", flag: "🇨🇳", country: "Tiongkok", currencyName: "Yuan",
    bankShort: "PBoC", bankName: "People's Bank of China",
    rateLabel: "Loan Prime Rate (1 tahun)",
    rate: 3.0, prevRate: 3.1,
    lastMove: { bp: -10, date: "2025-05-20", label: "20 Mei 2025" },
    inflation: { value: 0.5, label: "CPI YoY · Jul 2026" },
    target: { lo: 3, hi: 3, label: "≈3% (implisit)" },
    gdp: { value: 4.6, note: "proyeksi 2026" },
    unemp: { value: 5.2, note: "survei urban" },
    nextMeeting: { iso: "2026-09-21T08:00:00+07:00", label: "21 Sep", name: "Pengumuman LPR" },
    nextMeeting2: "20 Okt 2026", freq: "bulanan (LPR)",
    stance: "dovish",
    marketNote: "Inflasi lemah (0,5%) = ruang stimulus; PBoC menjaga yuan stabil.",
    source: { label: "pbc.gov.cn", url: "http://www.pbc.gov.cn/en/3688110/index.html" },
  },
  {
    key: "in", cc: "INR", flag: "🇮🇳", country: "India", currencyName: "Rupee",
    bankShort: "RBI", bankName: "Reserve Bank of India",
    rateLabel: "Repo Rate",
    rate: 5.25, prevRate: 5.5,
    lastMove: { bp: -25, date: "2025-12-05", label: "5 Des 2025" },
    inflation: { value: 3.8, label: "CPI YoY · Jul 2026 (kurasi)" },
    target: { lo: 2, hi: 6, label: "2–6% (mid 4%)" },
    gdp: { value: 6.5, note: "proyeksi FY 2026-27" },
    unemp: { value: 5.1, note: "PLFS 2025-26" },
    nextMeeting: { iso: "2026-10-07T11:30:00+07:00", label: "7 Okt", name: "MPC RBI" },
    nextMeeting2: "2–4 Des 2026", freq: "6×/tahun",
    stance: "neutral",
    marketNote: "Pertumbuhan 6,5% terkuat di dunia besar; inflasi nyaman di tengah band.",
    source: { label: "rbi.org.in", url: "https://www.rbi.org.in/Scripts/MPC.aspx" },
  },
];

export function bankByKey(key) {
  return CENTRAL_BANKS.find((b) => b.key === key) || null;
}

/** Suku bunga riil (aproksimasi = suku bunga acuan − inflasi headline). */
export function realRate(b) {
  return b.inflation?.value == null ? null : Math.round((b.rate - b.inflation.value) * 10) / 10;
}

/** Selisih suku bunga a − b (persen poin) — dasar matriks carry. */
export function carryGap(a, b) {
  return Math.round((a.rate - b.rate) * 100) / 100;
}

// ---------------------------------------------------------------------------
// Skor bias fundamental — model bobot sama dengan lib/fundamentalBias.js:
//   real rate 35% · sikap kebijakan 25% · pertumbuhan 20% · pasar kerja 20%
// lalu digabung dengan strength teknis intraday: 55% fundamental + 45% teknis.
// ---------------------------------------------------------------------------
const clamp = (t, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, t));

function biasComponents(b) {
  const inf = b.inflation?.value ?? null;
  const target = inf == null ? 2 : (b.target.lo + b.target.hi) / 2;
  const rr = b.rate != null && inf != null ? b.rate - inf : (b.rate ?? 0) - target;

  const rateScore = Math.round(20 + clamp((rr + 3) / 6) * 70); // −3% → 20, +3% → 90
  const policyScore = Math.round(50 + clamp((b.lastMove?.bp ?? 0) / 50) * 40);
  const growthScore = Math.round(35 + clamp((b.gdp?.value ?? 3) / 6) * 50);
  const unempScore = Math.round(85 - clamp(((b.unemp?.value ?? 4) - 3) / 5) * 60);

  const score = Math.round(rateScore * 0.35 + policyScore * 0.25 + growthScore * 0.2 + unempScore * 0.2);
  return {
    rateScore, policyScore, growthScore, unempScore,
    realRate: rr == null ? null : Math.round(rr * 10) / 10,
    score,
    label: score >= 68 ? "KUAT" : score >= 55 ? "CENDERUNG KUAT" : score >= 45 ? "NETRAL" : score >= 32 ? "CENDERUNG LEMAH" : "LEMAH",
  };
}

const FX_PAIRS = {
  USD: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "NZD/USD", "USD/CHF", "USD/IDR"],
  EUR: ["EUR/USD", "EUR/GBP", "EUR/JPY"],
  GBP: ["GBP/USD", "EUR/GBP", "GBP/JPY"],
  JPY: ["USD/JPY", "EUR/JPY", "GBP/JPY"],
  CHF: ["USD/CHF"],
  AUD: ["AUD/USD"],
  CAD: ["USD/CAD"],
  NZD: ["NZD/USD"],
  IDR: ["USD/IDR"],
  CNY: ["USD/CNY"],
  INR: ["USD/INR"],
};

/** Baris bias per mata uang (dipakai kartu & tabel di /fundamentals). */
export function buildBiasRows(banks = CENTRAL_BANKS, strengthByCcy = {}) {
  return banks
    .map((b) => {
      const comp = biasComponents(b);
      const tech = strengthByCcy[b.cc] || null;
      const blended = tech ? Math.round(comp.score * 0.55 + tech.score * 0.45) : comp.score;
      return {
        cc: b.cc, key: b.key, flag: b.flag, name: b.currencyName, country: b.country,
        bank: b.bankShort, bankName: b.bankName,
        rate: b.rate, rateLabel: b.rateLabel,
        inflation: b.inflation?.value ?? null, inflationLabel: b.inflation?.label,
        targetLabel: b.target?.label,
        gdp: b.gdp?.value ?? null, gdpNote: b.gdp?.note,
        unemp: b.unemp?.value ?? null,
        lastMove: b.lastMove, stance: b.stance, stanceMeta: STANCES[b.stance] || STANCES.neutral,
        nextMeeting: b.nextMeeting, freq: b.freq, marketNote: b.marketNote,
        pairs: FX_PAIRS[b.cc] || [],
        ...comp,
        tech,
        blended,
        blendedLabel: blended >= 68 ? "STRONG BUY" : blended >= 55 ? "BUY" : blended >= 45 ? "NETRAL" : blended >= 32 ? "SELL" : "STRONG SELL",
      };
    })
    .sort((a, b) => b.blended - a.blended);
}

/**
 * Timpa nilai kurasi dengan angka LIVE (FRED / pasar) — dipanggil server.
 * Aturan: nilai live hanya menimpa bila periode datanya SAMA ATAU LEBIH BARU
 * dari 1 Jun 2026 (jaga agar seri basi tidak menimpa kurasi terbaru).
 */
export function applyLiveOverrides(banks, o = {}) {
  const FRESH = "2026-06-01";
  return banks.map((b) => {
    const out = { ...b };
    const set = (field, series, map) => {
      const s = o[series];
      if (!s?.last || s.last.date < FRESH || s.last.value == null) return;
      const v = map ? map(s.last.value) : s.last.value;
      if (v == null || !Number.isFinite(v)) return;
      out[field] = v;
      out[`${field}Live`] = { value: v, date: s.last.date, source: s.source || "live" };
    };
    if (b.key === "us") {
      set("rate", "fedfunds"); // out.rate + out.rateLive (badge ● live di tabel)
      if (o.cpi?.last?.value != null) {
        out.inflation = { ...b.inflation, value: Math.round(o.cpi.last.value * 10) / 10, label: `CPI YoY · ${o.cpi.last.date.slice(0, 7)} (FRED)` };
        out.inflationLive = { value: o.cpi.last.value, date: o.cpi.last.date, source: o.cpi.source };
      }
      if (o.unemp?.last?.value != null && o.unemp.last.date >= FRESH) {
        out.unemp = { value: o.unemp.last.value, note: `FRED · ${o.unemp.last.date.slice(0, 7)}` };
      }
    }
    if (b.key === "euro" && o.eu_cpi?.last?.value != null && o.eu_cpi.last.date >= FRESH) {
      out.inflation = { ...b.inflation, value: Math.round(o.eu_cpi.last.value * 10) / 10, label: `HICP YoY · ${o.eu_cpi.last.date.slice(0, 7)} (FRED)` };
      out.inflationLive = { value: o.eu_cpi.last.value, date: o.eu_cpi.last.date, source: o.eu_cpi.source };
    }
    return out;
  });
}
