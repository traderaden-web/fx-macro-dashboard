// data/calendar.js
// Kalender ekonomi (jadwal rilis) — DIBANGKITKAN dari jadwal resmi, bukan
// diketik baris per baris:
//
//   • BLS  (NFP/Unemp/AHE, CPI, PPI, JOLTS, ECI) ← data/schedule-us.json,
//          hasil `npm run fetch:schedule` (bls.gov/schedule/news_release/bls.ics),
//          diperbarui otomatis oleh GitHub Actions.
//   • Fed  (FOMC) ← tabel resmi federalreserve.gov (2026 + tentatif 2027).
//   • BEA  (GDP advance/second/third, Core PCE) ← bea.gov/news/schedule.
//   • Census (Retail Sales) ← census.gov/retail/release_schedule.html.
//   • Fed G.17 (Industrial Production & Capacity Utilization) ← release_dates.htm.
//   • ISM  (Manufacturing/Services PMI) ← ismworld.org ROB calendar 2026.
//   • UMich (Consumer Sentiment prelim) ← sca.isr.umich.edu release dates 2026.
//   • ADP  (National Employment Report) ← adpemploymentreport.com.
//   • DOL  (Initial Jobless Claims) ← tiap Kamis 08:30 ET (Rabu bila Kamis libur).
//   • ECB  (rate decision) ← ecb.europa.eu kalender Governing Council 2026.
//
// Semua waktu dikonversi ke WIB dengan DST Amerika/Eropa yang dihitung otomatis
// (lib/schedule.js). Setiap event memiliki `indicatorId` yang menautkan ke
// halaman indikator (/indicators/[id]) dan dipakai lib/consensus.js untuk
// mencocokkan rilis ↔ titik FRED secara otomatis (aturan obsForRelease).
//
// Event ForexFactory (pidato pejabat, data negara lain, dll.) TIDAK ditulis di
// sini — halaman kalender menggabungkannya secara live (lib/provider.js).

import schedule from "./schedule-us.json";
import { etToWib, toWib, zonedTimeToUtc, weekdaysBetween, addDays, isUsHoliday } from "../lib/schedule";

const ET_0830 = "08:30";
const ET_1000 = "10:00";

// Batas jendela kalender: dari awal 2025 sampai akhir tahun depan (rolling).
const NOW = new Date();
const YEAR = NOW.getUTCFullYear();
const RANGE_START = "2025-01-01";
const RANGE_END = `${YEAR + 1}-12-31`;

function ev(dateEt, timeEt, title, category, country, impact, indicatorId, extra = {}) {
  const w = etToWib(dateEt, timeEt);
  return { date: w.date, time: w.time, title, category, country, impact, indicatorId, sourceDate: dateEt, ...extra };
}

// ---------------------------------------------------------------------------
// 1) BLS — dari data/schedule-us.json (otomatis)
// ---------------------------------------------------------------------------
const BLS_TITLES = {
  nfp: ["Nonfarm Payrolls (NFP)", "tenaga-kerja", "High"],
  unemp: ["Unemployment Rate", "tenaga-kerja", "High"],
  ahe: ["Average Hourly Earnings m/m", "tenaga-kerja", "Medium"],
  cpi: ["Consumer Price Index (CPI) y/y", "inflasi", "High"],
  corecpi: ["Core CPI y/y", "inflasi", "High"],
  ppi: ["Producer Price Index (PPI) m/m", "inflasi", "High"],
};

function blsEvents() {
  const out = [];
  for (const r of schedule.releases || []) {
    if (r.date < RANGE_START || r.date > RANGE_END) continue;
    const time = r.time || ET_0830;
    if (r.indicators?.length) {
      for (const id of r.indicators) {
        const t = BLS_TITLES[id];
        if (!t) continue;
        out.push(ev(r.date, time, t[0], t[1], "US", t[2], id, r.obs ? { obs: r.obs } : {}));
      }
    } else if (r.title) {
      out.push(ev(r.date, time, r.title, r.category || "tenaga-kerja", "US", r.impact || "Medium", null));
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// 2) FOMC — hari keputusan (ET). Sumber: federalreserve.gov (2027 tentatif).
// ---------------------------------------------------------------------------
const FOMC = [
  { et: "2025-01-29", sep: false }, { et: "2025-03-19", sep: true }, { et: "2025-05-07", sep: false },
  { et: "2025-06-18", sep: true }, { et: "2025-07-30", sep: false }, { et: "2025-09-17", sep: true },
  { et: "2025-10-29", sep: false }, { et: "2025-12-10", sep: true },
  { et: "2026-01-28", sep: false }, { et: "2026-03-18", sep: true }, { et: "2026-04-29", sep: false },
  { et: "2026-06-17", sep: true }, { et: "2026-07-29", sep: false }, { et: "2026-09-16", sep: true },
  { et: "2026-10-28", sep: false }, { et: "2026-12-09", sep: true },
  { et: "2027-01-27", sep: false }, { et: "2027-03-17", sep: true }, { et: "2027-04-28", sep: false },
  { et: "2027-06-09", sep: true }, { et: "2027-07-28", sep: false }, { et: "2027-09-15", sep: true },
  { et: "2027-10-27", sep: false }, { et: "2027-12-08", sep: true },
];

function fomcEvents() {
  const out = [];
  for (const f of FOMC) {
    if (f.et < RANGE_START || f.et > RANGE_END) continue;
    out.push(ev(f.et, "14:00", "FOMC Federal Funds Rate", "moneter", "US", "High", "fedfunds"));
    if (f.sep) out.push(ev(f.et, "14:00", "FOMC Economic Projections", "moneter", "US", "High", "fedfunds"));
    out.push(ev(f.et, "14:00", "FOMC Statement", "moneter", "US", "High", "fedfunds"));
    out.push(ev(f.et, "14:30", "FOMC Press Conference", "moneter", "US", "Medium", "fedfunds"));
  }
  return out;
}

// ---------------------------------------------------------------------------
// 3) BEA — GDP (3 estimasi per kuartal) & Personal Income and Outlays (Core PCE)
// ---------------------------------------------------------------------------
// [tanggal ET, jenis GDP ("adv"|"second"|"third"|null), kuartal data, bulan PCE (obs)]
const BEA = [
  ["2025-04-30", "adv", "2025-01-01", "2025-03-01"],
  ["2025-05-29", "second", "2025-01-01", "2025-04-01"],
  ["2025-06-26", "third", "2025-01-01", "2025-05-01"],
  ["2025-07-30", "adv", "2025-04-01", "2025-06-01"],
  ["2025-08-28", "second", "2025-04-01", "2025-07-01"],
  ["2025-09-25", "third", "2025-04-01", "2025-08-01"],
  ["2025-12-05", null, null, "2025-09-01"], // pasca-shutdown
  ["2025-12-23", "adv", "2025-07-01", null], // GDP Q3 (gabungan, pasca-shutdown)
  ["2026-01-22", "third", "2025-07-01", "2025-11-01"], // Q3 updated + PCE Okt/Nov (Nov dipakai)
  ["2026-02-20", "adv", "2025-10-01", "2025-12-01"],
  ["2026-03-13", "second", "2025-10-01", "2026-01-01"],
  ["2026-04-09", "third", "2025-10-01", "2026-02-01"],
  ["2026-04-30", "adv", "2026-01-01", "2026-03-01"],
  ["2026-05-28", "second", "2026-01-01", "2026-04-01"],
  ["2026-06-25", "third", "2026-01-01", "2026-05-01"],
  ["2026-07-30", "adv", "2026-04-01", "2026-06-01"],
  ["2026-08-26", "second", "2026-04-01", "2026-07-01"],
  ["2026-09-30", "third", "2026-04-01", "2026-08-01"],
  ["2026-10-29", "adv", "2026-07-01", "2026-09-01"],
  ["2026-11-25", "second", "2026-07-01", "2026-10-01"],
  ["2026-12-23", "third", "2026-07-01", "2026-11-01"],
];
const GDP_LABEL = { adv: "GDP (Advance) q/q", second: "GDP (Prelim) q/q", third: "GDP (Final) q/q" };

function beaEvents() {
  const out = [];
  for (const [d, kind, q, pce] of BEA) {
    if (d < RANGE_START || d > RANGE_END) continue;
    if (kind) out.push(ev(d, ET_0830, GDP_LABEL[kind], "pertumbuhan", "US", "High", "gdp", { obs: q, estimate: kind }));
    if (pce) out.push(ev(d, ET_0830, "Core PCE Price Index m/m", "inflasi", "US", "High", "corepce", { obs: pce }));
  }
  return out;
}

// ---------------------------------------------------------------------------
// 4) Census — Advance Monthly Retail Trade (08:30 ET)
// ---------------------------------------------------------------------------
const RETAIL = [
  ["2025-01-16", "2024-12-01"], ["2025-02-14", "2025-01-01"], ["2025-03-17", "2025-02-01"], ["2025-04-16", "2025-03-01"],
  ["2025-05-15", "2025-04-01"], ["2025-06-17", "2025-05-01"], ["2025-07-17", "2025-06-01"], ["2025-08-15", "2025-07-01"],
  ["2025-09-16", "2025-08-01"], ["2025-11-25", "2025-09-01"], ["2025-12-16", "2025-10-01"],
  ["2026-01-14", "2025-11-01"], ["2026-02-10", "2025-12-01"], ["2026-03-06", "2026-01-01"], ["2026-04-01", "2026-02-01"],
  ["2026-04-21", "2026-03-01"], ["2026-05-14", "2026-04-01"], ["2026-06-17", "2026-05-01"], ["2026-07-16", "2026-06-01"],
  ["2026-08-14", "2026-07-01"], ["2026-09-16", "2026-08-01"], ["2026-10-15", "2026-09-01"], ["2026-11-17", "2026-10-01"],
  ["2026-12-16", "2026-11-01"],
];

// ---------------------------------------------------------------------------
// 5) Fed G.17 — Industrial Production & Capacity Utilization (09:15 ET)
// ---------------------------------------------------------------------------
const G17 = [
  ["2025-01-17", "2024-12-01"], ["2025-02-14", "2025-01-01"], ["2025-03-18", "2025-02-01"], ["2025-04-16", "2025-03-01"],
  ["2025-05-15", "2025-04-01"], ["2025-06-17", "2025-05-01"], ["2025-07-16", "2025-06-01"], ["2025-08-15", "2025-07-01"],
  ["2025-09-16", "2025-08-01"], ["2025-12-03", "2025-10-01"], ["2025-12-23", "2025-11-01"],
  ["2026-01-16", "2025-12-01"], ["2026-02-18", "2026-01-01"], ["2026-03-16", "2026-02-01"], ["2026-04-16", "2026-03-01"],
  ["2026-05-15", "2026-04-01"], ["2026-06-15", "2026-05-01"], ["2026-07-17", "2026-06-01"], ["2026-08-18", "2026-07-01"],
  ["2026-09-18", "2026-08-01"], ["2026-10-16", "2026-09-01"], ["2026-11-17", "2026-10-01"], ["2026-12-16", "2026-11-01"],
  ["2027-01-15", "2026-12-01"], ["2027-02-17", "2027-01-01"], ["2027-03-15", "2027-02-01"], ["2027-04-15", "2027-03-01"],
  ["2027-05-17", "2027-04-01"], ["2027-06-16", "2027-05-01"], ["2027-07-16", "2027-06-01"], ["2027-08-17", "2027-07-01"],
  ["2027-09-16", "2027-08-01"], ["2027-10-18", "2027-09-01"], ["2027-11-17", "2027-10-01"], ["2027-12-16", "2027-11-01"],
];

// ---------------------------------------------------------------------------
// 6) ISM — Manufacturing (hari kerja ke-1) & Services (hari kerja ke-3), 10:00 ET
// ---------------------------------------------------------------------------
const ISM = [
  // [Mfg, Svc, bulan data]
  ["2025-07-01", "2025-07-03", "2025-06-01"], ["2025-08-01", "2025-08-05", "2025-07-01"],
  ["2025-09-02", "2025-09-04", "2025-08-01"], ["2025-10-01", "2025-10-03", "2025-09-01"],
  ["2025-11-03", "2025-11-05", "2025-10-01"], ["2025-12-01", "2025-12-03", "2025-11-01"],
  ["2026-01-05", "2026-01-07", "2025-12-01"], ["2026-02-02", "2026-02-04", "2026-01-01"],
  ["2026-03-02", "2026-03-04", "2026-02-01"], ["2026-04-01", "2026-04-06", "2026-03-01"],
  ["2026-05-01", "2026-05-05", "2026-04-01"], ["2026-06-01", "2026-06-03", "2026-05-01"],
  ["2026-07-01", "2026-07-06", "2026-06-01"], ["2026-08-03", "2026-08-05", "2026-07-01"],
  ["2026-09-01", "2026-09-03", "2026-08-01"], ["2026-10-01", "2026-10-05", "2026-09-01"],
  ["2026-11-02", "2026-11-04", "2026-10-01"], ["2026-12-01", "2026-12-03", "2026-11-01"],
];

// ---------------------------------------------------------------------------
// 7) UMich — Consumer Sentiment PRELIM (10:00 ET); final tidak dijadwalkan
//    sebagai event terpisah (angka FRED = final).
// ---------------------------------------------------------------------------
const UMICH = [
  ["2025-07-18", "2025-07-01"], ["2025-08-15", "2025-08-01"], ["2025-09-12", "2025-09-01"], ["2025-10-10", "2025-10-01"],
  ["2025-11-07", "2025-11-01"], ["2025-12-05", "2025-12-01"],
  ["2026-01-09", "2026-01-01"], ["2026-02-06", "2026-02-01"], ["2026-03-13", "2026-03-01"], ["2026-04-10", "2026-04-01"],
  ["2026-05-08", "2026-05-01"], ["2026-06-12", "2026-06-01"], ["2026-07-17", "2026-07-01"], ["2026-08-14", "2026-08-01"],
  ["2026-09-11", "2026-09-01"], ["2026-10-09", "2026-10-01"], ["2026-11-06", "2026-11-01"], ["2026-12-04", "2026-12-01"],
];

// ---------------------------------------------------------------------------
// 8) ADP National Employment Report (08:15 ET) — 2 hari kerja sebelum NFP
// ---------------------------------------------------------------------------
const ADP = [
  ["2025-07-02", "2025-06-01"], ["2025-07-30", "2025-07-01"], ["2025-09-04", "2025-08-01"], ["2025-10-01", "2025-09-01"],
  ["2025-11-05", "2025-10-01"], ["2025-12-03", "2025-11-01"],
  ["2026-01-07", "2025-12-01"], ["2026-02-04", "2026-01-01"], ["2026-03-04", "2026-02-01"], ["2026-04-01", "2026-03-01"],
  ["2026-05-06", "2026-04-01"], ["2026-06-03", "2026-05-01"], ["2026-07-01", "2026-06-01"], ["2026-08-05", "2026-07-01"],
  ["2026-09-02", "2026-08-01"], ["2026-09-30", "2026-09-01"], ["2026-11-04", "2026-10-01"], ["2026-12-02", "2026-11-01"],
];

// ---------------------------------------------------------------------------
// 9) ECB — keputusan suku bunga (14:15 CET/CEST) + konferensi pers 14:45
// ---------------------------------------------------------------------------
const ECB = [
  "2025-01-30", "2025-03-06", "2025-04-17", "2025-06-05", "2025-07-24", "2025-09-11", "2025-10-30", "2025-12-18",
  "2026-02-05", "2026-03-19", "2026-04-30", "2026-06-11", "2026-07-23", "2026-09-10", "2026-10-29", "2026-12-17",
];

function ecbEvents() {
  const out = [];
  for (const d of ECB) {
    if (d < RANGE_START || d > RANGE_END) continue;
    const w1 = toWib(zonedTimeToUtc(d, "14:15", "Europe/Berlin"));
    const w2 = toWib(zonedTimeToUtc(d, "14:45", "Europe/Berlin"));
    out.push({ date: w1.date, time: w1.time, title: "ECB Main Refinancing Rate", category: "moneter", country: "EZ", impact: "High", indicatorId: null, sourceDate: d });
    out.push({ date: w2.date, time: w2.time, title: "ECB Press Conference", category: "moneter", country: "EZ", impact: "High", indicatorId: null, sourceDate: d });
  }
  return out;
}

// ---------------------------------------------------------------------------
// 10) Initial Jobless Claims — tiap Kamis 08:30 ET (Rabu bila Kamis libur federal)
// ---------------------------------------------------------------------------
function claimsEvents() {
  const out = [];
  for (const thu of weekdaysBetween("2025-06-05", RANGE_END, 4)) {
    const d = isUsHoliday(thu) ? addDays(thu, -1) : thu;
    out.push(ev(d, ET_0830, "Initial Jobless Claims", "tenaga-kerja", "US", "Medium", "claims"));
  }
  return out;
}

function tableEvents(rows, timeEt, title, category, impact, indicatorId) {
  return rows
    .filter(([d]) => d >= RANGE_START && d <= RANGE_END)
    .map(([d, obs]) => ev(d, timeEt, title, category, "US", impact, indicatorId, obs ? { obs } : {}));
}

// ---------------------------------------------------------------------------
// Gabungan
// ---------------------------------------------------------------------------
const ALL = [
  ...fomcEvents(),
  ...blsEvents(),
  ...beaEvents(),
  ...tableEvents(RETAIL, ET_0830, "Retail Sales m/m", "konsumen", "High", "retail"),
  ...tableEvents(G17, "09:15", "Industrial Production m/m", "pertumbuhan", "Low", "indpro"),
  ...tableEvents(G17, "09:15", "Capacity Utilization Rate", "pertumbuhan", "Low", "capacity"),
  ...ISM.filter(([d]) => d >= RANGE_START && d <= RANGE_END).flatMap(([mfg, svc, obs]) => [
    ev(mfg, ET_1000, "ISM Manufacturing PMI", "pertumbuhan", "US", "High", "ismmfg", { obs }),
    ev(svc, ET_1000, "ISM Services PMI", "pertumbuhan", "US", "High", "ismsvc", { obs }),
  ]),
  ...tableEvents(UMICH, ET_1000, "Prelim UoM Consumer Sentiment", "konsumen", "Medium", "umich"),
  ...tableEvents(ADP, "08:15", "ADP Non-Farm Employment Change", "tenaga-kerja", "High", "adp"),
  ...ecbEvents(),
  ...claimsEvents(),
];

// Dedupe (tanggal WIB + judul) lalu urutkan kronologis.
const seen = new Set();
export const EVENTS = ALL.filter((e) => {
  const k = `${e.date}|${e.time}|${e.title}`;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
}).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

export const UPCOMING = EVENTS.map((e) => ({ ...e, iso: `${e.date}T${e.time}:00+07:00` }));

/** Metadata sumber jadwal (untuk footer/asOf). */
export const CALENDAR_META = {
  blsUpdated: schedule.updated || null,
  blsSource: schedule.source || null,
  range: { start: RANGE_START, end: RANGE_END },
  count: EVENTS.length,
};
