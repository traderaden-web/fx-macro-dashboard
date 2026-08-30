// data/calendar.js
// Kalender ekonomi (jadwal rilis) — disusun mengikuti kalender resmi BLS / Federal Reserve
// dan gaya tampilan ForexFactory. Semua waktu dalam WIB (UTC+7).
//
// Aturan konversi ke WIB (hasil dihitung otomatis di bawah):
//   - Major rilis AS (NFP, CPI, PPI, claims) 08:30 ET
//       DST (Mar–Nov): 08:30 ET = 12:30 UTC = 19:30 WIB
//       Standar (Nov–Mar): 08:30 ET = 13:30 UTC = 20:30 WIB
//   - ISM Manufacturing PMI 10:00 ET → 21:00 WIB (DST)
//   - FOMC decision 14:00 ET (hari kedua) = 01:00 WIB (besok, DST) / 02:00 WIB (besok, standar)
//
// Setiap event memiliki `indicatorId` yang menautkan ke halaman analisis indikator
// (`/indicators/[id]`), sehingga saat news diklik pengguna dibawa ke halaman yang
// menjelaskan news tersebut + data historis bulan-bulan sebelumnya + analisis prospek.

// DST 2026: mulai 8 Maret (Minggu ke-2) sampai 1 November (Minggu ke-1).
function isDst(month) {
  return month >= 3 && month <= 10;
}

// ---- Jadwal FOMC 2026 (hari keputusan, waktu ET; hari pertama = H-1) ----
const FOMC_2026 = [
  { et: "2026-01-28", sep: false },
  { et: "2026-03-18", sep: true },
  { et: "2026-04-29", sep: false },
  { et: "2026-06-17", sep: true },
  { et: "2026-07-29", sep: false },
  { et: "2026-09-16", sep: true }, // keputusan 16 Sep 14:00 ET → WIB 17 Sep 01:00
  { et: "2026-10-28", sep: false },
  { et: "2026-12-09", sep: true },
];

// Rincian FOMC ala ForexFactory: Federal Funds Rate, Economic Projections (bila SEP),
// Statement (14:00 ET) lalu Press Conference (14:30 ET). Semua menaut ke indikator `fedfunds`.
function fomcEvents() {
  const out = [];
  for (const f of FOMC_2026) {
    const m = Number(f.et.slice(5, 7));
    const dst = isDst(m);
    const t1 = dst ? "01:00" : "02:00"; // 14:00 ET
    const t2 = dst ? "01:30" : "02:30"; // 14:30 ET
    const d = new Date(`${f.et}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    const date = d.toISOString().slice(0, 10);
    out.push({ date, time: t1, title: "FOMC Federal Funds Rate", category: "moneter", country: "US", impact: "High", indicatorId: "fedfunds" });
    if (f.sep) out.push({ date, time: t1, title: "FOMC Economic Projections", category: "moneter", country: "US", impact: "High", indicatorId: "fedfunds" });
    out.push({ date, time: t1, title: "FOMC Statement", category: "moneter", country: "US", impact: "High", indicatorId: "fedfunds" });
    out.push({ date, time: t2, title: "FOMC Press Conference", category: "moneter", country: "US", impact: "Medium", indicatorId: "fedfunds" });
  }
  return out;
}

export const EVENTS = [
  ...fomcEvents(),

  // ---- NFP (Employment Situation) — tanggal 8, 08:30 ET ----
  { date: "2026-09-08", time: "19:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-10-08", time: "19:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-11-09", time: "20:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-12-08", time: "20:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },

  // ---- CPI AS — 08:30 ET ----
  { date: "2026-09-11", time: "19:30", title: "Consumer Price Index (CPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "cpi" },
  { date: "2026-10-14", time: "19:30", title: "Consumer Price Index (CPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "cpi" },
  { date: "2026-11-10", time: "20:30", title: "Consumer Price Index (CPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "cpi" },

  // ---- PPI AS — 08:30 ET (dampak: High) ----
  { date: "2026-09-10", time: "19:30", title: "Producer Price Index (PPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "ppi" },
  { date: "2026-10-15", time: "19:30", title: "Producer Price Index (PPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "ppi" },

  // ---- Core PCE Price Index m/m (indikator inflasi favorit The Fed) — 08:30 ET ----
  { date: "2026-09-30", time: "19:30", title: "Core PCE Price Index (m/m)", category: "inflasi", country: "US", impact: "High", indicatorId: "corepce" },

  // ---- Final GDP q/q — 08:30 ET ----
  { date: "2026-09-30", time: "19:30", title: "Final GDP (q/q)", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "gdp" },

  // ---- Event pasar khusus (agenda simposium & pidato bank sentral) ----
  { date: "2026-08-28", time: "08:00", title: "Jackson Hole Symposium", category: "moneter", country: "US", impact: "High", indicatorId: "fedfunds" },
  { date: "2026-08-28", time: "21:00", title: "Prelim Benchmark Payrolls Revision", category: "tenaga-kerja", country: "US", impact: "Medium", indicatorId: "nfp" },
  { date: "2026-08-28", time: "21:30", title: "Fed Chairman Warsh Speaks", category: "moneter", country: "US", impact: "Medium", indicatorId: "fedfunds" },

  // ---- Indikator lain (patokan bulanan) ----
  { date: "2026-09-01", time: "21:00", title: "ISM Manufacturing PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "indpro" },
  { date: "2026-09-03", time: "19:30", title: "Initial Jobless Claims", category: "tenaga-kerja", country: "US", impact: "Medium", indicatorId: "claims" },
  { date: "2026-09-15", time: "19:30", title: "Retail Sales", category: "konsumen", country: "US", impact: "Medium", indicatorId: "retail" },
];

export const UPCOMING = EVENTS.map((e) => ({ ...e, iso: `${e.date}T${e.time}:00+07:00` }));
