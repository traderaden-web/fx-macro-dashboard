// data/releases.js
// Estimasi konsensus (fallback demo) untuk rilis indikator.
// Nilai ACTUAL dan PREVIOUS diambil otomatis dari FRED (lib/consensus.js).
// Untuk produksi, sumber konsensus utama berasal dari penyedia live (lib/provider.js);
// nilai di sini menjadi cadangan bila penyedia tidak dapat dijangkau.

export const CONSENSUS = {
  cpi: [
    { date: "2026-05-01", consensus: 4.0 },
    { date: "2026-06-01", consensus: 3.5 },
    { date: "2026-07-01", consensus: 3.3 },
  ],
  corecpi: [
    { date: "2026-05-01", consensus: 2.8 },
    { date: "2026-06-01", consensus: 2.6 },
    { date: "2026-07-01", consensus: 2.5 },
  ],
  ppi: [
    { date: "2026-05-01", consensus: 11.5 },
    { date: "2026-06-01", consensus: 10.0 },
    { date: "2026-07-01", consensus: 8.5 },
  ],
  nfp: [
    { date: "2026-05-01", consensus: 60 },
    { date: "2026-06-01", consensus: 30 },
    { date: "2026-07-01", consensus: -10 },
  ],
  unemp: [
    { date: "2026-05-01", consensus: 4.3 },
    { date: "2026-06-01", consensus: 4.2 },
    { date: "2026-07-01", consensus: 4.2 },
  ],
  ahe: [
    { date: "2026-05-01", consensus: 3.4 },
    { date: "2026-06-01", consensus: 3.5 },
    { date: "2026-07-01", consensus: 3.2 },
  ],
  retail: [
    { date: "2026-05-01", consensus: 0.6 },
    { date: "2026-06-01", consensus: 0.3 },
    { date: "2026-07-01", consensus: 0.1 },
  ],
  indpro: [{ date: "2026-07-01", consensus: 0.25 }],
  gdp: [{ date: "2026-04-01", consensus: 2.2 }],
  umich: [{ date: "2026-07-01", consensus: 56 }],
  fedfunds: [{ date: "2026-08-01", consensus: 3.75 }],
  dgs10: [{ date: "2026-08-01", consensus: 4.6 }],
  eu_cpi: [{ date: "2026-07-01", consensus: 2.7 }],
  eu_unemp: [{ date: "2023-01-01", consensus: 6.7 }],
  uk_cpi: [{ date: "2025-03-01", consensus: 3.5 }],
  uk_unemp: [{ date: "2026-04-01", consensus: 5.0 }],
  jp_cpi: [{ date: "2021-06-01", consensus: -0.4 }],
  wti: [{ date: "2026-08-01", consensus: 82 }],
  vix: [{ date: "2026-08-01", consensus: 16 }],
  claims: [
    { date: "2026-06-01", consensus: 205 },
    { date: "2026-07-01", consensus: 200 },
  ],
  capacity: [
    { date: "2026-06-01", consensus: 76.1 },
    { date: "2026-07-01", consensus: 76.3 },
  ],
  eu_gdp: [
    { date: "2026-01-01", consensus: 0.5 },
    { date: "2026-04-01", consensus: 0.9 },
  ],
  china_cpi: [
    { date: "2025-03-01", consensus: -0.1 },
    { date: "2025-04-01", consensus: -0.1 },
  ],
};
