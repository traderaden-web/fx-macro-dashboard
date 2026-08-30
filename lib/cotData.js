// lib/cotData.js
// Data CFTC Commitments of Traders (COT) terkurasi — angka riil dari laporan
// resmi CFTC, diambil pada minggu berjalan, lengkap dengan tanggal as-of,
// tanggal rilis, dan tautan sumber. COT dirilis tiap Jumat (data hari Selasa).
//
// Catatan metodologi:
//  - XAU (COMEX Gold) memakai data "disaggregated" kategori **Managed Money**
//    (hedge fund) — posisi spekulatif institusional, 1 kontrak = 100 oz.
//  - DXY memakai laporan legacy **Non-Commercial** (ICE U.S. Dollar Index).
//  - Tidak ada angka fiktif: jika satu minggu belum dipublikasikan, panel
//    menampilkan data terbaru yang tersedia + tanggal as-of-nya.

const SRC = {
  cftc: "https://www.cftc.gov/MarketReports/CommitmentsofTraders",
  metalcharts: "https://metalcharts.org/cot",
  tradingster: "https://www.tradingster.com/cot/legacy-futures/098662",
  indexbox:
    "https://www.indexbox.io/blog/cot-report-august-18-2026-managed-money-boosts-gold-and-copper-cuts-crude-oil-and-sugar/",
};

export const COT = {
  releasedNote: "Rilis: Jumat 28 Agu 2026 (data s.d. Selasa 25 Agu 2026)",

  // ── COMEX GOLD (XAU) — Managed Money, disaggregated ────────────────────
  // Sumber: CFTC COT disaggregated 18 Agu 2026, dikutip MetalCharts (21 Agu)
  // & IndexBox (21 Agu); pekan sebelumnya (11 Agu) +128.000.
  xau: {
    label: "COMEX Gold (XAU)",
    asOf: "18 Agu 2026",
    released: "21 Agu 2026",
    category: "Managed Money (hedge fund)",
    long: 154595,
    short: 12947,
    net: 141648,
    prevNet: 128000,
    change: 13648,
    oi: 406300,
    contract: "1 kontrak = 100 oz emas",
    trend: [
      { d: "16 Jun", v: 128043 },
      { d: "23 Jun", v: 131102 },
      { d: "28 Jul", v: 119795 },
      { d: "11 Agu", v: 128000 },
      { d: "18 Agu", v: 141648 },
    ],
    reading:
      "Net long hedge fund emas naik +13,6K kontrak ke level tertinggi sejak awal tahun — akumulasi agresif di harga ~4.478, mengonfirmasi posisi safe-haven.",
    url: SRC.metalcharts,
  },

  // ── U.S. DOLLAR INDEX (DXY) — Non-Commercial, legacy ───────────────────
  // Sumber: CFTC COT legacy 25 Agu 2026 (Tradingster, kode 098662).
  usd: {
    label: "U.S. Dollar Index (DXY)",
    asOf: "25 Agu 2026",
    released: "28 Agu 2026",
    category: "Non-Commercial (spekulatif)",
    long: 29042,
    short: 10360,
    spread: 1609,
    net: 17073,
    prevNet: 17505,
    change: -432,
    commLong: 13957,
    commShort: 33795,
    oi: 47953,
    contract: "ICE USD Index futures, 107 trader dilaporkan",
    reading:
      "Spekulans masih net long DXY +17,0K kontrak (long -540, short -143 pekan ini), sementara komersial net short -19,8K — posisi dolar relatif seimbang menjelang FOMC 16 Sep.",
    url: SRC.tradingster,
  },

  // ── SILVER — Managed Money ─────────────────────────────────────────────
  // Sumber: CFTC disaggregated 18 Agu 2026 (IndexBox, 21 Agu).
  silver: {
    label: "COMEX Silver (XAG)",
    asOf: "18 Agu 2026",
    released: "21 Agu 2026",
    category: "Managed Money (hedge fund)",
    net: 11695,
    reading:
      "Hedge fund net long perak +11.695 kontrak (18 Agu) — posisi positif moderat, jauh di bawah ekstrem emas.",
    url: SRC.indexbox,
  },

  // ── WTI CRUDE — Managed Money ─────────────────────────────────────────
  // Sumber: CFTC disaggregated 18 Agu 2026 (IndexBox, 21 Agu).
  wti: {
    label: "WTI Crude Oil",
    asOf: "18 Agu 2026",
    released: "21 Agu 2026",
    category: "Managed Money (hedge fund)",
    reading:
      "Hedge fund memotong net long WTI (18 Agu) setelah harga turun ~4,5% pada Juli — posisi tetap net long namun lebih ringan, mencerminkan kekhawatiran permintaan.",
    url: SRC.indexbox,
  },
};

// Peta aset → data COT. Pair FX memakai COT USD (kaki USD yang menentukan arah).
const MAP = {
  gold: "xau",
  silver: "silver",
  wti: "wti",
  dxy: "usd",
  eurusd: "usd",
  gbpusd: "usd",
  usdjpy: "usd",
  audusd: "usd",
  usdcad: "usd",
  nzdusd: "usd",
};

export function cotForAsset(assetId) {
  const key = MAP[assetId] || "xau";
  return { ...COT[key], assetKey: key };
}

export const COT_OFFICIAL_URL = SRC.cftc;
