// .smoke35-entry.jsx
import { useEffect as useEffect2, useState as useState2 } from "react";

// components/AnalysisClient.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

// lib/series.js
var SERIES_RAW = [
  {
    id: "nfp",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Nonfarm Payrolls (NFP)",
    short: "NFP",
    category: "tenaga-kerja",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "PAYEMS",
    mode: "monthly_change",
    unit: "ribu",
    decimals: 1,
    impact: "High",
    release: "Jumat pertama tiap bulan, 08:30 ET",
    about: "Perubahan jumlah tenaga kerja non-pertanian (paling banyak menentukan pergerakan pasar).",
    why: "Menunjukkan kesehatan pasar tenaga kerja & arah kebijakan suku bunga The Fed.",
    fx: "Data kuat \u2192 USD kuat (hawkish). Data lemah/lebih rendah dari estimasi \u2192 USD melemah."
  },
  {
    id: "unemp",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Unemployment Rate",
    short: "Unemployment",
    category: "tenaga-kerja",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "UNRATE",
    mode: "level",
    unit: "%",
    decimals: 1,
    impact: "High",
    release: "Bersamaan dengan NFP, 08:30 ET",
    about: "Persentase angkatan kerja yang menganggur.",
    why: "Tingkat pengangguran rendah memicu kekhawatiran inflasi upah.",
    fx: "Turun \u2192 USD bullish; naik mendadak \u2192 USD bearish."
  },
  {
    id: "cpi",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Consumer Price Index (CPI)",
    short: "CPI",
    category: "inflasi",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "CPIAUCSL",
    mode: "yoy_pct",
    unit: "%",
    decimals: 2,
    impact: "High",
    release: "Sekitar pertengahan bulan, 08:30 ET",
    about: "Perubahan harga barang & jasa yang dibeli konsumen (YoY).",
    why: "Ukuran inflasi utama yang dipantau The Fed.",
    fx: "Naik di atas target \u2192 The Fed hawkish \u2192 USD kuat. Turun \u2192 USD lemah."
  },
  {
    id: "corecpi",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Core CPI",
    short: "Core CPI",
    category: "inflasi",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "CPILFESL",
    mode: "yoy_pct",
    unit: "%",
    decimals: 2,
    impact: "High",
    release: "Bersamaan dengan CPI",
    about: "CPI tanpa makanan & energi (lebih stabil, jadi fokus pasar).",
    why: "The Fed lebih memperhatikan core CPI untuk kebijakan.",
    fx: "Core CPI tinggi \u2192 USD bullish; rendah \u2192 USD bearish."
  },
  {
    id: "ppi",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Producer Price Index (PPI)",
    short: "PPI",
    category: "inflasi",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "PPIACO",
    mode: "yoy_pct",
    unit: "%",
    decimals: 2,
    impact: "High",
    release: "Sekitar pertengahan bulan, 08:30 ET",
    about: "Perubahan harga di tingkat produsen (indikator pendahulu inflasi konsumen).",
    why: "Biaya produksi yang naik biasanya terbawa ke harga konsumen.",
    fx: "PPI tinggi \u2192 tekanan inflasi \u2192 USD bisa menguat."
  },
  {
    id: "corepce",
    name: "Core PCE Price Index (m/m)",
    short: "Core PCE",
    category: "inflasi",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "PCEPILFE",
    mode: "mom_pct",
    unit: "%",
    decimals: 2,
    impact: "High",
    release: "Akhir bulan, 08:30 ET (19:30 WIB)",
    about: "Indeks harga pengeluaran konsumsi pribadi inti (tanpa makanan & energi) \u2014 ukuran inflasi favorit The Fed.",
    why: "The Fed mengacu pada PCE inti untuk menilai tren inflasi jangka menengah.",
    fx: "Core PCE tinggi \u2192 tekanan kenaikan suku bunga \u2192 USD bisa menguat.",
    // koreksi FF 26 Agu 2026 (obs Jun 0,1 / Jul 0,2) → kunci ke seed
    noLive: true
  },
  {
    id: "ahe",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Average Hourly Earnings",
    short: "AHE",
    category: "tenaga-kerja",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "CES0500000003",
    mode: "yoy_pct",
    unit: "%",
    decimals: 2,
    impact: "Medium",
    release: "Bersamaan dengan NFP",
    about: "Perubahan upah rata-rata per jam (YoY).",
    why: "Kenaikan upah mendorong inflasi upah dan ekspektasi suku bunga.",
    fx: "Upah naik \u2192 USD bullish."
  },
  {
    id: "fedfunds",
    name: "Fed Funds Target Rate",
    short: "Fed Funds",
    category: "moneter",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "DFEDTARU",
    mode: "level",
    unit: "%",
    decimals: 2,
    impact: "High",
    release: "Putusan FOMC 8x/tahun, 14:00 ET",
    about: "Batas atas target suku bunga The Fed.",
    why: "Level suku bunga menentukan biaya dana secara global.",
    fx: "Kenaikan/ekspektasi kenaikan \u2192 USD kuat; pemotongan \u2192 USD lemah."
  },
  {
    id: "dgs10",
    name: "U.S. 10-Year Treasury Yield",
    short: "10Y Yield",
    category: "pasar",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "D",
    fred: "DGS10",
    mode: "level",
    unit: "%",
    decimals: 2,
    impact: "Medium",
    release: "Harian, pasar obligasi",
    about: "Imbal hasil obligasi pemerintah AS tenor 10 tahun.",
    why: "Imbal hasil adalah 'harga' uang; bergerak searah dengan USD.",
    fx: "Yield naik \u2192 aliran modal masuk \u2192 USD menguat."
  },
  {
    id: "retail",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Retail Sales",
    short: "Retail Sales",
    category: "konsumen",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "RSXFS",
    mode: "mom_pct",
    unit: "%",
    decimals: 1,
    impact: "Medium",
    release: "Sekitar pertengahan bulan",
    about: "Perubahan penjualan ritel bulanan.",
    why: "Proksi utama belanja konsumen (2/3 ekonomi AS).",
    fx: "Kuat \u2192 USD bullish; lemah \u2192 USD bearish."
  },
  {
    id: "umich",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Michigan Consumer Sentiment",
    short: "Michigan",
    category: "konsumen",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "UMCSENT",
    mode: "level",
    unit: "index",
    decimals: 1,
    impact: "Low",
    release: "Dua kali per bulan (preliminary & final)",
    about: "Kepercayaan / sentimen konsumen terhadap ekonomi.",
    why: "Menangkap ekspektasi inflasi konsumen.",
    fx: "Sentimen naik \u2192 risiko positif \u2192 USD bisa menguat."
  },
  {
    id: "indpro",
    name: "Industrial Production",
    short: "Ind. Production",
    category: "pertumbuhan",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "INDPRO",
    mode: "monthly_change",
    unit: "%",
    decimals: 2,
    impact: "Low",
    release: "Sekitar pertengahan bulan",
    about: "Perubahan output pabrik, pertambangan, & utilitas.",
    why: "Indikator aktivitas ekonomi sektor produksi.",
    fx: "Produksi naik \u2192 sentimen ekonomi membaik."
  },
  {
    id: "gdp",
    name: "Prelim GDP (q/q) Annualized",
    short: "GDP",
    category: "pertumbuhan",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "Q",
    fred: "GDPC1",
    mode: "qq_ann_pct",
    unit: "%",
    decimals: 1,
    impact: "High",
    release: "3x per kuartal (advance/prelim/final), 08:30 ET (19:30 WIB)",
    about: "Pertumbuhan PDB riil per kuartal, annualized (q/q) \u2014 angka awal (preliminary) dari BEA yang biasanya masih direvisi.",
    why: "Angka pertumbuhan terlebar; menentukan narasi 'ekonomi kuat vs perlambatan' dan ruang kebijakan The Fed.",
    fx: "GDP kuat \u2192 USD bullish; lemah \u2192 ekspektasi cut \u2192 USD bearish.",
    // dikonversi ke basis q/q sesuai ForexFactory (FF 26 Agu 2026: Q2 1,5 / Q1 1,5) → kunci ke seed
    noLive: true
  },
  {
    id: "eu_cpi",
    name: "Euro Area HICP Inflation",
    short: "EZ CPI",
    category: "inflasi",
    country: "EZ",
    countryName: "Zona Euro",
    freq: "M",
    fred: "CP0000EZ19M086NEST",
    mode: "yoy_pct",
    unit: "%",
    decimals: 1,
    impact: "High",
    release: "Flash estimate tiap akhir bulan / laporan awal",
    about: "Harmonized Index of Consumer Prices untuk Zona Euro.",
    why: "Menentukan kebijakan ECB.",
    fx: "Inflasi EZ tinggi \u2192 EUR kuat (ECB hawkish)."
  },
  {
    id: "eu_unemp",
    name: "Euro Area Unemployment Rate",
    short: "EZ Unemployment",
    category: "tenaga-kerja",
    country: "EZ",
    countryName: "Zona Euro",
    freq: "M",
    fred: "LRHUTTTTEZM156S",
    mode: "level",
    unit: "%",
    decimals: 1,
    impact: "Low",
    release: "Akhir bulan (Eurostat)",
    about: "Tingkat pengangguran Zona Euro.",
    why: "Indikator pasar tenaga kerja Eropa.",
    fx: "Pengangguran turun \u2192 EUR sedikit bullish."
  },
  {
    id: "uk_cpi",
    name: "U.K. CPI Inflation",
    short: "UK CPI",
    category: "inflasi",
    country: "UK",
    countryName: "Inggris",
    freq: "M",
    fred: "GBRCPIALLMINMEI",
    mode: "yoy_pct",
    unit: "%",
    decimals: 1,
    impact: "High",
    release: "Sekitar pertengahan bulan (ONS)",
    about: "Indeks harga konsumen Inggris.",
    why: "Menentukan kebijakan Bank of England.",
    fx: "Inflasi UK tinggi \u2192 GBP kuat (BoE hawkish)."
  },
  {
    id: "uk_unemp",
    name: "U.K. Unemployment Rate",
    short: "UK Unemployment",
    category: "tenaga-kerja",
    country: "UK",
    countryName: "Inggris",
    freq: "M",
    fred: "LRHUTTTTGBM156S",
    mode: "level",
    unit: "%",
    decimals: 1,
    impact: "Medium",
    release: "Bulanan (ONS)",
    about: "Tingkat pengangguran Inggris.",
    why: "Kesehatan pasar kerja memengaruhi kebijakan BoE.",
    fx: "Pengangguran turun \u2192 GBP bullish."
  },
  {
    id: "jp_cpi",
    name: "Japan CPI Inflation",
    short: "JP CPI",
    category: "inflasi",
    country: "JP",
    countryName: "Jepang",
    freq: "M",
    fred: "JPNCPIALLMINMEI",
    mode: "yoy_pct",
    unit: "%",
    decimals: 1,
    impact: "Medium",
    release: "Sekitar akhir bulan",
    about: "Indeks harga konsumen Jepang.",
    why: "Inflasi menentukan kebijakan Bank of Japan (normalisasi suku bunga).",
    fx: "Inflasi JP tinggi \u2192 JPY cenderung kuat."
  },
  {
    id: "wti",
    name: "WTI Crude Oil",
    short: "WTI",
    category: "pasar",
    country: "GL",
    countryName: "Global",
    freq: "D",
    fred: "DCOILWTICO",
    mode: "level",
    unit: "USD/barel",
    decimals: 2,
    impact: "Low",
    release: "Daily",
    about: "Harga minyak mentah WTI.",
    why: "Harga minyak berdampak pada inflasi & mata uang negara produsen.",
    fx: "Minyak naik \u2192 CAD (kadang) & NOK menguat; importir (JPY, EUR) melemah."
  },
  {
    id: "vix",
    name: "VIX Volatility Index",
    short: "VIX",
    category: "pasar",
    country: "US",
    countryName: "Global",
    freq: "D",
    fred: "VIXCLS",
    mode: "level",
    unit: "index",
    decimals: 2,
    impact: "Low",
    release: "Daily",
    about: "Ukuran volatilitas & ketakutan pasar (CBOE).",
    why: "VIX tinggi \u2192 risk-off \u2192 safe-haven (USD, JPY, CHF) menguat.",
    fx: "VIX naik \u2192 mata uang safe-haven kuat, mata uang risk tinggi melemah."
  },
  {
    id: "brent",
    name: "Brent Crude Oil",
    short: "Brent",
    category: "pasar",
    country: "GL",
    countryName: "Global",
    freq: "D",
    fred: "DCOILBRENTEU",
    mode: "level",
    unit: "USD/barel",
    decimals: 2,
    impact: "Low",
    release: "Daily",
    about: "Harga minyak mentah Brent (acuan internasional).",
    why: "Bersama WTI, menggerakkan mata uang produsen minyak & memengaruhi inflasi.",
    fx: "Brent naik \u2192 CAD/NOK menguat; importir (JPY/INR) tertekan."
  },
  {
    id: "natgas",
    name: "Natural Gas (Henry Hub)",
    short: "Nat Gas",
    category: "pasar",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "D",
    fred: "DHHNGSP",
    mode: "level",
    unit: "USD/MMBtu",
    decimals: 2,
    impact: "Low",
    release: "Daily",
    about: "Harga gas alam acuan di Henry Hub (AS).",
    why: "Mencerminkan biaya energi AS; berdampak pada inflasi & produsen energinya.",
    fx: "Gas naik \u2192 mendukung biaya energi & USD (eksportir energi)."
  },
  {
    id: "copper",
    name: "Copper (Global Price)",
    short: "Copper",
    category: "pasar",
    country: "GL",
    countryName: "Global",
    freq: "M",
    fred: "PCOPPUSDM",
    mode: "level",
    unit: "USD/ton",
    decimals: 0,
    impact: "Low",
    release: "Bulanan",
    about: "Harga tembaga global (USD per metrik ton).",
    why: "Disebut 'Dr. Copper' sebagai penanda kesehatan ekonomi global & permintaan industri.",
    fx: "Tembaga naik \u2192 permintaan global kuat \u2192 AUD/NZD (produsen) menguat."
  },
  {
    id: "claims",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Initial Jobless Claims",
    short: "Jobless Claims",
    category: "tenaga-kerja",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "W",
    fred: "ICNSA",
    mode: "level",
    unit: "orang",
    decimals: 0,
    impact: "Medium",
    release: "Setiap Kamis, 08:30 ET",
    about: "Klaim pengangguran awal (per minggu, dirata-rata bulanan).",
    why: "Indikator paling cepat untuk melihat kesehatan pasar tenaga kerja AS.",
    fx: "Klaim naik \u2192 ketakutan perlambatan \u2192 USD cenderung melemah."
  },
  {
    id: "capacity",
    name: "Capacity Utilization",
    short: "Capacity",
    category: "pertumbuhan",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "TCU",
    mode: "level",
    unit: "%",
    decimals: 1,
    impact: "Low",
    release: "Sekitar pertengahan bulan",
    about: "Tingkat penggunaan kapasitas industri (%).",
    why: "Kapasitas terpakai tinggi menandakan tekanan inflasi produksi.",
    fx: "Naik \u2192 ekonomi memanas \u2192 mendukung suku bunga tinggi."
  },
  {
    id: "eu_gdp",
    name: "Euro Area Real GDP",
    short: "EZ GDP",
    category: "pertumbuhan",
    country: "EZ",
    countryName: "Zona Euro",
    freq: "Q",
    fred: "CLVMNACSCAB1GQEA19",
    mode: "yoy_pct",
    unit: "%",
    decimals: 1,
    impact: "High",
    release: "Perkiraan awal tiap kuartal",
    about: "Pertumbuhan ekonomi riil Zona Euro (year-over-year).",
    why: "Pertumbuhan kuat mendukung kebijakan ECB yang lebih ketat.",
    fx: "GDP EZ kuat \u2192 EUR menguat; lemah \u2192 EUR melemah."
  },
  {
    id: "china_cpi",
    name: "China Consumer Price Index",
    short: "China CPI",
    category: "inflasi",
    country: "CN",
    countryName: "Tiongkok",
    freq: "M",
    fred: "CHNCPIALLMINMEI",
    mode: "yoy_pct",
    unit: "%",
    decimals: 1,
    impact: "Medium",
    release: "Sekitar pertengahan bulan",
    about: "Perubahan harga konsumen Tiongkok (YoY).",
    why: "Inflasi China memberi sinyal stimulus kebijakan & permintaan global.",
    fx: "Inflasi tinggi \u2192 stimulus bisa dikurangi \u2192 CNY cenderung menguat."
  },
  {
    id: "ismmfg",
    name: "ISM Manufacturing PMI",
    short: "ISM Mfg",
    category: "pertumbuhan",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "ISMPMI",
    mode: "level",
    unit: "index",
    decimals: 1,
    impact: "High",
    release: "Hari kerja pertama tiap bulan, 10:00 ET",
    about: "Indeks komposit sektor manufaktur AS dari survei purchasing managers ISM. >50 = ekspansi, <50 = kontraksi.",
    why: "Puls utama 'pertumbuhan manufaktur' \u2014 menahankan di atas 50 menjaga narasi ekspansi AS.",
    fx: "PMI Mfg di atas konsensus \u2192 ekspektasi Fed hawkish \u2192 USD naik; jauh di bawah 50 \u2192 USD turun.",
    // ditambahkan 30-Agu-2026 (FF user + API earningsapi) → kunci ke seed
    noLive: true
  },
  {
    id: "adp",
    name: "ADP National Employment Report (Private Payrolls)",
    short: "ADP",
    category: "tenaga-kerja",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    mode: "absolute",
    unit: "ribu",
    decimals: 0,
    impact: "High",
    release: "Selasa sebelum NFP, 19:15 WIB",
    about: "Perubahan jumlah tenaga kerja di sektor swasta (survey ADP) \u2014 'pemanasan' sebelum NFP resmi BLS.",
    why: "Proksi arah umum ketenagakerjaan; kejutan ADP sering (tidak selalu) diikuti NFP pekan yang sama.",
    fx: "ADP kuat \u2192 ekspektasi NFP kuat \u2192 USD naik; ADP lemah \u2192 USD turun.",
    // ditambahkan 30-Agu-2026 dari FF window Jun 2026 (A 122K K 118K P 105K) → kunci ke seed
    // ⚠ FF window Sep 2026 tidak menampilkan lagi baris ADP (kemungkinan discontinued)
    noLive: true
  },
  {
    id: "ismsvc",
    name: "ISM Services PMI (Non-Manufacturing)",
    short: "ISM Svc",
    category: "pertumbuhan",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "NAPMNOI",
    mode: "level",
    unit: "index",
    decimals: 1,
    impact: "High",
    release: "3 hari kerja setelah ISM Mfg, 10:00 ET",
    about: "Indeks komposit sektor jasa AS (\xB180% PDB) dari survei ISM. >50 = ekspansi; indikator leading paling stabil utk ekonomi AS.",
    why: "Karena sektor jasa mendominasi ekonomi, kejutan Services PMI sering lebih menentukan arah USD daripada manufaktur.",
    fx: "Svc kuat + Prices tinggi \u2192 Fed hawkish \u2192 USD naik; Svc melambat \u2192 ekspektasi cut \u2192 USD turun.",
    // ditambahkan 30-Agu-2026 (FF user + API earningsapi) → kunci ke seed
    noLive: true
  }
];
var TOL = {
  nfp: 25,
  unemp: 0.15,
  cpi: 0.15,
  corecpi: 0.1,
  ppi: 0.3,
  corepce: 0.05,
  ahe: 0.1,
  fedfunds: 0.05,
  dgs10: 0.05,
  retail: 0.3,
  umich: 2,
  indpro: 0.1,
  gdp: 0.1,
  eu_cpi: 0.15,
  eu_unemp: 0.15,
  uk_cpi: 0.15,
  uk_unemp: 0.1,
  jp_cpi: 0.2,
  wti: 2,
  brent: 2.5,
  natgas: 0.15,
  copper: 300,
  vix: 1.5,
  claims: 15e3,
  capacity: 0.15,
  eu_gdp: 0.3,
  china_cpi: 0.15,
  ismmfg: 1,
  ismsvc: 1,
  adp: 10
};
var SCALE = {
  nfp: 100,
  unemp: 0.2,
  cpi: 0.5,
  corecpi: 0.4,
  ppi: 2,
  corepce: 0.15,
  ahe: 0.3,
  fedfunds: 0.25,
  dgs10: 0.35,
  retail: 0.5,
  umich: 10,
  indpro: 0.4,
  gdp: 0.5,
  eu_cpi: 0.5,
  eu_unemp: 0.2,
  uk_cpi: 0.5,
  uk_unemp: 0.2,
  jp_cpi: 0.5,
  wti: 8,
  brent: 9,
  natgas: 0.8,
  copper: 1e3,
  vix: 5,
  claims: 3e4,
  capacity: 0.5,
  eu_gdp: 0.8,
  china_cpi: 0.5,
  ismmfg: 2,
  ismsvc: 2.5,
  adp: 50
};
var SERIES = SERIES_RAW.map((s) => ({ ...s, tol: TOL[s.id] ?? 0.5, scale: SCALE[s.id] ?? 1 }));
var CATEGORIES = [
  { id: "inflasi", label: "Inflasi", color: "#f0b429" },
  { id: "tenaga-kerja", label: "Tenaga Kerja", color: "#2dd4bf" },
  { id: "moneter", label: "Moneter", color: "#c084fc" },
  { id: "pertumbuhan", label: "Pertumbuhan", color: "#4ade80" },
  { id: "konsumen", label: "Konsumen", color: "#a78bfa" },
  { id: "pasar", label: "Pasar", color: "#94a3b8" }
];
function getSeries(id) {
  return SERIES.find((s) => s.id === id);
}
var COUNTRIES = [
  { id: "US", name: "Amerika Serikat", flag: "\u{1F1FA}\u{1F1F8}" },
  { id: "EZ", name: "Zona Euro", flag: "\u{1F1EA}\u{1F1FA}" },
  { id: "UK", name: "Inggris", flag: "\u{1F1EC}\u{1F1E7}" },
  { id: "JP", name: "Jepang", flag: "\u{1F1EF}\u{1F1F5}" },
  { id: "CN", name: "Tiongkok", flag: "\u{1F1E8}\u{1F1F3}" },
  { id: "GL", name: "Global", flag: "\u{1F310}" }
];

// lib/pairs.js
var PAIRS = [
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
  { symbol: "USDCNH", label: "USD/CNH", base: "USD", quote: "CNH" }
];
var IND_CURRENCY = {
  nfp: { cur: "USD", bullDir: 1, via: "sinyal ketenagakerjaan \u2192 ekspektasi suku bunga & yield AS" },
  unemp: { cur: "USD", bullDir: -1, via: "likuiditas pasar kerja \u2192 jalur suku bunga The Fed" },
  cpi: { cur: "USD", bullDir: 1, via: "inflasi inti-kebijakan \u2192 stance The Fed & real yield" },
  corecpi: { cur: "USD", bullDir: 1, via: "inflasi inti \u2192 fokus utama The Fed" },
  corepce: { cur: "USD", bullDir: 1, via: "inflasi inti versi The Fed \u2192 ekspektasi suku bunga" },
  ppi: { cur: "USD", bullDir: 1, via: "inflasi produsen \u2192 pendahulu inflasi konsumen" },
  ahe: { cur: "USD", bullDir: 1, via: "inflasi upah \u2192 tekanan hawkish The Fed" },
  fedfunds: { cur: "USD", bullDir: 1, via: "keputusan FOMC langsung" },
  dgs10: { cur: "USD", bullDir: 1, via: "real yield & carry AS" },
  retail: { cur: "USD", bullDir: 1, via: "momentum konsumsi \u2192 GDP & jalur suku bunga" },
  indpro: { cur: "USD", bullDir: 1, via: "aktivitas industri \u2192 ekspektasi pertumbuhan" },
  gdp: { cur: "USD", bullDir: 1, via: "momentum pertumbuhan AS" },
  umich: { cur: "USD", bullDir: 1, via: "sentimen & ekspektasi inflasi konsumen" },
  ismmfg: { cur: "USD", bullDir: 1, via: "aktivitas manufaktur \u2192 ekspektasi pertumbuhan & suku bunga" },
  ismsvc: { cur: "USD", bullDir: 1, via: "sektor jasa (\xB180% PDB) \u2192 momentum pertumbuhan AS" },
  adp: { cur: "USD", bullDir: 1, via: "indikator leading NFP \u2014 pekerjaan sektor swasta" },
  eu_cpi: { cur: "EUR", bullDir: 1, via: "inflasi HICP \u2192 stance ECB" },
  eu_unemp: { cur: "EUR", bullDir: -1, via: "pasar kerja EZ \u2192 jalur ECB" },
  uk_cpi: { cur: "GBP", bullDir: 1, via: "inflasi CPI \u2192 stance BoE" },
  uk_unemp: { cur: "GBP", bullDir: -1, via: "pasar kerja UK \u2192 jalur BoE" },
  jp_cpi: { cur: "JPY", bullDir: 1, via: "jalur normalisasi BOJ & diferensial suku bunga" },
  claims: { cur: "USD", bullDir: -1, via: "frekuensi pelemahan pasar kerja" },
  capacity: { cur: "USD", bullDir: 1, via: "tekanan kapasitas \u2192 tekanan inflasi produksi" },
  eu_gdp: { cur: "EUR", bullDir: 1, via: "pertumbuhan EZ \u2192 stance ECB" },
  china_cpi: { cur: "CNH", bullDir: 1, via: "stimulus PBoC & permintaan global (CNY offshore)" },
  wti: { cur: "CAD", bullDir: 1, via: "arus ekspor energi & inflasi global (produsen minyak)" },
  brent: { cur: "CAD", bullDir: 1, via: "arus ekspor energi & inflasi global (produsen minyak)" },
  natgas: { cur: "USD", bullDir: 1, via: "biaya energi AS & eksportir energi" },
  copper: { cur: "AUD", bullDir: 1, via: "permintaan industri global (Dr. Copper)" },
  vix: { cur: "USD", bullDir: 1, via: "risk-off \u2192 aset safe-haven (USD/JPY/CHF/emas)" }
};
function getIndicatorCurrency(indicatorId) {
  return IND_CURRENCY[indicatorId] || null;
}
function estPairMove(surpriseIdx) {
  const a = Math.min(Math.abs(surpriseIdx) || 0, 150);
  return Math.round(4e-3 * a * 100) / 100;
}
function currencyReaction(indicatorId, surpriseIdx) {
  const meta = getIndicatorCurrency(indicatorId);
  if (!meta || surpriseIdx === null || surpriseIdx === void 0) return null;
  const sign = surpriseIdx > 0 ? 1 : surpriseIdx < 0 ? -1 : 0;
  const curMove = meta.bullDir * sign;
  return {
    cur: meta.cur,
    dir: curMove,
    est: estPairMove(surpriseIdx),
    via: meta.via,
    label: curMove > 0 ? `${meta.cur} Menguat` : curMove < 0 ? `${meta.cur} Melemah` : `${meta.cur} Netral`
  };
}
function computePairImpact(indicatorId, surprisePct, surprise = null, surpriseIdx = null) {
  const meta = getIndicatorCurrency(indicatorId);
  if (!meta || surprisePct === null || surprisePct === void 0) return [];
  const sign = surprisePct > 0 ? 1 : surprisePct < 0 ? -1 : 0;
  const currencyMove = meta.bullDir * sign;
  const mag = surpriseIdx != null ? magnitudeFromIndex(surpriseIdx) : magnitudeFromSurprise(surprisePct);
  const est = estPairMove(surpriseIdx != null ? surpriseIdx : surprisePct);
  const out = [];
  for (const p of PAIRS) {
    const isBase = p.base === meta.cur;
    const isQuote = p.quote === meta.cur;
    if (!isBase && !isQuote) continue;
    const baseSign = isBase ? 1 : -1;
    const pairDir = currencyMove * baseSign;
    const dir = pairDir > 0 ? 1 : pairDir < 0 ? -1 : 0;
    const strength = dir === 1 ? "Bullish" : dir === -1 ? "Bearish" : "Netral";
    const note = (isBase ? `${meta.cur} menguat \u2192 ${p.label} naik` : `${meta.cur} menguat \u2192 ${p.label} turun`) + (mag >= 3 ? ". Dampak kuat." : ".");
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
function magnitudeFromIndex(idx) {
  const a = Math.abs(idx);
  if (a < 15) return 1;
  if (a < 45) return 2;
  if (a < 90) return 3;
  if (a < 200) return 4;
  return 5;
}
function magnitudeLabel(m) {
  return ["", "Ringan", "Moderat", "Kuat", "Sangat Kuat", "Ekstrem"][m] || "\u2014";
}

// components/Icons.jsx
import { jsx, jsxs } from "react/jsx-runtime";
var base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
function IconFlag({ size = 16 }) {
  return /* @__PURE__ */ jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("path", { ...base, d: "M5 3v18" }),
    /* @__PURE__ */ jsx("path", { ...base, d: "M5 4h13l-2.5 4 2.5 4H5" })
  ] });
}
function IconGlobe({ size = 16 }) {
  return /* @__PURE__ */ jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("circle", { ...base, cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ jsx("path", { ...base, d: "M3 12h18" }),
    /* @__PURE__ */ jsx("path", { ...base, d: "M12 3c2.6 2.5 2.6 15.5 0 18M12 3c-2.6 2.5-2.6 15.5 0 18" })
  ] });
}

// components/Badges.jsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var CODE_LABEL = {
  US: "US",
  EZ: "EU",
  UK: "UK",
  JP: "JP",
  CN: "CN",
  AU: "AU",
  CA: "CA",
  CH: "CH",
  NZ: "NZ",
  GL: "GL"
};
function CountryFlag({ code, size = 16, showCode = true, className = "" }) {
  const label = CODE_LABEL[code] || code || "GL";
  const isGlobal = code === "GL";
  return /* @__PURE__ */ jsxs2("span", { className: `country-tag ${isGlobal ? "global" : ""} ${className}`, children: [
    isGlobal ? /* @__PURE__ */ jsx2(IconGlobe, { size }) : /* @__PURE__ */ jsx2(IconFlag, { size }),
    showCode && /* @__PURE__ */ jsx2("span", { className: "country-code", children: label })
  ] });
}

// components/AnalysisClient.jsx
import { Fragment, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var FMT = (v, d = 1) => v === null || v === void 0 ? "\u2014" : Number(v).toLocaleString("id-ID", { maximumFractionDigits: d });
var SFMT = (v, d = 1) => v === null || v === void 0 ? "\u2014" : (v > 0 ? "+" : "") + Number(v).toLocaleString("id-ID", { maximumFractionDigits: d });
var BLN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
var MM = (s) => s ? (/* @__PURE__ */ new Date(s + "T00:00:00")).toLocaleDateString("id-ID", { month: "short", year: "2-digit" }) : "\u2014";
var DMY = (s) => s ? `${Number(s.slice(8, 10))} ${BLN[parseInt(s.slice(5, 7), 10) - 1].toUpperCase()} ${s.slice(2, 4)}` : "\u2014";
var IMPACT_RANK = { High: 0, Medium: 1, Low: 2 };
var WIBM = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
function useWib() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(/* @__PURE__ */ new Date());
    const t = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(t);
  }, []);
  return now;
}
function fmtCountdown(ms) {
  if (ms <= 0) return "SEKARANG";
  const m = Math.floor(ms / 6e4);
  const d = Math.floor(m / 1440);
  const h = Math.floor(m % 1440 / 60);
  const mm = m % 60;
  if (d > 0) return `T-${d}h ${h}j`;
  if (h > 0) return `T-${h}j ${mm}m`;
  return `T-${mm}m`;
}
function fmtEv(e) {
  return `${Number(e.date.slice(8))} ${BLN[Number(e.date.slice(5, 7)) - 1]} ${e.time}`;
}
function nextEvent(upcoming, id, now) {
  if (!upcoming?.length || !now) return null;
  const t = now.getTime();
  return upcoming.filter((e) => e.indicatorId === id && new Date(e.iso).getTime() > t).sort((a, b) => a.iso.localeCompare(b.iso))[0] || null;
}
function Num({ v, d = 1, signed = false }) {
  const [dv, setDv] = useState(0);
  useEffect(() => {
    if (v === null || v === void 0) return void 0;
    const start = performance.now();
    const dur = 550;
    let raf;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDv(v * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [v]);
  return /* @__PURE__ */ jsx3(Fragment, { children: v === null || v === void 0 ? "\u2014" : signed ? SFMT(dv, d) : FMT(dv, d) });
}
function BlockConsensus({ item, latest, prevRel, now }) {
  const d = item.decimals;
  const tol = item.tol ?? 0.5;
  const surprise = latest?.surprise ?? null;
  const idx = latest?.surpriseIdx ?? null;
  const cls = surprise === null ? "flat" : Math.abs(surprise) <= tol ? "flat" : surprise > 0 ? "up" : "down";
  const stale = latest && now ? now.getTime() - new Date(latest.date).getTime() > 120 * 864e5 : false;
  const daily = item.freq === "D";
  const maxAbs = item.releases.reduce((m, r) => Math.max(m, Math.abs(r.surprise ?? 0)), 0);
  const domain = Math.max(tol * 3, maxAbs) * 1.15 || 1;
  const pos = surprise === null ? 50 : Math.max(2.5, Math.min(97.5, (surprise + domain) / (2 * domain) * 100));
  const zoneW = Math.min(2 * tol / (2 * domain) * 100, 40);
  const zoneL = 50 - zoneW / 2;
  const rx = idx !== null ? currencyReaction(item.id, idx) : null;
  const chip = surprise === null ? "MENUNGGU RILIS" : cls === "flat" ? "SEPERTI KONSENSUS \u25C6" : rx ? rx.dir > 0 ? `HAWKISH \xB7 ${rx.cur} Menguat \u25B2` : `DOVISH \xB7 ${rx.cur} Melemah \u25BC` : surprise > 0 ? "DI ATAS KONSENSUS \u25B2" : "DI BAWAH KONSENSUS \u25BC";
  return /* @__PURE__ */ jsxs3("div", { className: "ct-block", style: { "--b": 0 }, children: [
    /* @__PURE__ */ jsxs3("div", { className: "ct-block-head", children: [
      /* @__PURE__ */ jsx3("span", { className: "ct-tag", children: "02" }),
      /* @__PURE__ */ jsxs3("h4", { children: [
        "Consensus vs Actual \u2014 ",
        item.short
      ] }),
      /* @__PURE__ */ jsxs3("span", { className: "ct-block-meta mono", children: [
        stale && /* @__PURE__ */ jsx3("b", { className: "ct-stale", children: "\u26A0 DATA STALE" }),
        latest && /* @__PURE__ */ jsxs3(Fragment, { children: [
          " ASOF ",
          DMY(latest.date),
          " \xB7 SRC ",
          latest.source === "live" ? "FOREXFACTORY" : "FRED"
        ] }),
        daily && " \xB7 SERI HARIAN (EST. ANALIS)"
      ] })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "ct-readout", children: [
      /* @__PURE__ */ jsxs3("div", { className: "ct-cell", children: [
        /* @__PURE__ */ jsx3("em", { children: "PREVIOUS" }),
        /* @__PURE__ */ jsx3("b", { className: "mono", children: latest ? FMT(latest.previous, d) : "\u2014" }),
        /* @__PURE__ */ jsx3("i", { children: prevRel ? `${MM(prevRel.date).toUpperCase()} \xB7 pembanding` : "rilis sebelumnya" })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "ct-cell cons", children: [
        /* @__PURE__ */ jsx3("em", { children: "CONSENSUS" }),
        /* @__PURE__ */ jsx3("b", { className: "mono", children: latest ? /* @__PURE__ */ jsx3(Num, { v: latest.consensus, d }) : "\u2014" }),
        /* @__PURE__ */ jsx3("i", { children: "estimasi konsensus analis" })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "ct-cell act", children: [
        /* @__PURE__ */ jsx3("em", { children: "ACTUAL" }),
        /* @__PURE__ */ jsx3("b", { className: "mono big", children: latest ? /* @__PURE__ */ jsx3(Num, { v: latest.actual, d }) : "\u2014" }),
        /* @__PURE__ */ jsxs3("i", { children: [
          "FRED \xB7 ",
          latest ? MM(latest.date).toUpperCase() : "\u2014",
          latest?.previous !== null && " \xB7 " + item.unit
        ] })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: `ct-cell sur ${cls}`, children: [
        /* @__PURE__ */ jsx3("em", { children: "SURPRISE" }),
        /* @__PURE__ */ jsx3("b", { className: "mono big", children: latest ? /* @__PURE__ */ jsx3(Num, { v: latest.surprise, d, signed: true }) : "\u2014" }),
        /* @__PURE__ */ jsx3("i", { children: idx !== null ? `idx ${SFMT(idx, 0)} \xB7 vs konsensus` : "actual \u2212 konsensus" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "ct-gauge", role: "img", "aria-label": `Surprise ${SFMT(surprise, d)} ${item.unit}`, children: [
      /* @__PURE__ */ jsxs3("div", { className: "ct-gauge-track", children: [
        /* @__PURE__ */ jsx3("span", { className: "ct-g-zone", style: { left: `${zoneL}%`, width: `${zoneW}%` }, "aria-hidden": "true" }),
        /* @__PURE__ */ jsx3("span", { className: "ct-g-zero", "aria-hidden": "true" }),
        /* @__PURE__ */ jsx3("span", { className: "ct-g-needle", style: { left: `${pos}%` }, "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "ct-gauge-scale mono", children: [
        /* @__PURE__ */ jsxs3("span", { children: [
          "\u2212",
          FMT(domain, 1)
        ] }),
        /* @__PURE__ */ jsxs3("span", { children: [
          "0 \xB7 \xB1",
          FMT(tol, 2),
          " = inline"
        ] }),
        /* @__PURE__ */ jsxs3("span", { children: [
          "+",
          FMT(domain, 1),
          " ",
          item.unit
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: `ct-senti ${cls}`, children: [
      /* @__PURE__ */ jsx3("span", { className: "ct-senti-chip mono", children: chip }),
      /* @__PURE__ */ jsx3("span", { children: rx ? rx.via : "Nilai sesuai konsensus \u2014 pasar cenderung minim respons." })
    ] })
  ] });
}
function ReleaseModal({ item, r, onClose }) {
  const closeRef = useRef(null);
  const d = item.decimals;
  const tol = item.tol ?? 0.5;
  const rels = item.releases || [];
  const acc = item.accuracy;
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  const maxAbs = rels.reduce((m, x) => Math.max(m, Math.abs(x.surprise ?? 0)), 0);
  const domain = Math.max(tol * 3, maxAbs) * 1.15 || 1;
  const pos = r.surprise === null ? 50 : Math.max(2.5, Math.min(97.5, (r.surprise + domain) / (2 * domain) * 100));
  const zoneW = Math.min(2 * tol / (2 * domain) * 100, 40);
  const zoneL = 50 - zoneW / 2;
  const cls = r.surprise === null ? "flat" : Math.abs(r.surprise) <= tol ? "flat" : r.surprise > 0 ? "up" : "down";
  const label = r.surprise === null ? "MENUNGGU RILIS" : cls === "flat" ? "INLINE \u25C6 SESUAI KONSENSUS" : cls === "up" ? "BEAT \u25B2 DI ATAS KONSENSUS" : "MISS \u25BC DI BAWAH KONSENSUS";
  const rx = r.surpriseIdx != null ? currencyReaction(item.id, r.surpriseIdx) : null;
  const pairs = useMemo(
    () => r.surpriseIdx != null ? computePairImpact(item.id, r.surprisePct, r.surprise, r.surpriseIdx) : [],
    [item.id, r]
  );
  const dateLong = (/* @__PURE__ */ new Date(r.date + "T00:00:00")).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const dateShort = `${r.date.slice(8, 10)} ${BLN[parseInt(r.date.slice(5, 7), 10) - 1]} ${r.date.slice(0, 4)}`;
  const prevDelta = r.actual != null && r.previous != null ? r.actual - r.previous : null;
  if (typeof document === "undefined") return null;
  return createPortal(
    /* @__PURE__ */ jsx3(
      "div",
      {
        className: "cm-backdrop rm-backdrop",
        onClick: (e) => e.target === e.currentTarget && onClose(),
        role: "dialog",
        "aria-modal": "true",
        "aria-label": `Detail rilis ${item.short} ${r.date}`,
        children: /* @__PURE__ */ jsxs3("div", { className: "rm-modal", children: [
          /* @__PURE__ */ jsxs3("header", { className: "rm-head mono", children: [
            /* @__PURE__ */ jsx3("span", { className: "rm-tag", children: "RILIS" }),
            /* @__PURE__ */ jsxs3("b", { children: [
              item.short,
              " \xB7 ",
              dateShort
            ] }),
            /* @__PURE__ */ jsx3("span", { className: `rm-verdict ${cls}`, children: label }),
            /* @__PURE__ */ jsx3("button", { ref: closeRef, type: "button", className: "cm-close", onClick: onClose, "aria-label": "Tutup", title: "Tutup (Esc)", children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsxs3("div", { className: "rm-body", children: [
            /* @__PURE__ */ jsxs3("div", { className: "ct-readout rm-readout", children: [
              /* @__PURE__ */ jsxs3("div", { className: "ct-cell", children: [
                /* @__PURE__ */ jsx3("em", { children: "PREVIOUS" }),
                /* @__PURE__ */ jsx3("b", { className: "mono", children: FMT(r.previous, d) }),
                /* @__PURE__ */ jsxs3("i", { children: [
                  item.unit,
                  " \xB7 nilai sebelum rilis"
                ] })
              ] }),
              /* @__PURE__ */ jsxs3("div", { className: "ct-cell cons", children: [
                /* @__PURE__ */ jsx3("em", { children: "CONSENSUS" }),
                /* @__PURE__ */ jsx3("b", { className: "mono", children: FMT(r.consensus, d) }),
                /* @__PURE__ */ jsx3("i", { children: r.source === "live" ? "FOREXFACTORY LIVE" : "ESTIMASI KURASI ANALIS" })
              ] }),
              /* @__PURE__ */ jsxs3("div", { className: "ct-cell act", children: [
                /* @__PURE__ */ jsx3("em", { children: "ACTUAL" }),
                /* @__PURE__ */ jsx3("b", { className: "mono big", children: FMT(r.actual, d) }),
                /* @__PURE__ */ jsxs3("i", { children: [
                  "FRED \xB7 ",
                  item.unit
                ] })
              ] }),
              /* @__PURE__ */ jsxs3("div", { className: `ct-cell sur ${cls}`, children: [
                /* @__PURE__ */ jsx3("em", { children: "SURPRISE" }),
                /* @__PURE__ */ jsx3("b", { className: "mono big", children: SFMT(r.surprise, d) }),
                /* @__PURE__ */ jsx3("i", { children: r.surprisePct != null ? `${SFMT(r.surprisePct, 1)}% vs konsensus \xB7 idx ${SFMT(r.surpriseIdx, 0)}` : "actual \u2212 konsensus" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs3("div", { className: `rm-cols${pairs.length ? "" : " rm-cols-1"}`, children: [
              /* @__PURE__ */ jsxs3("section", { className: "rm-card", children: [
                /* @__PURE__ */ jsx3("h5", { className: "mono", children: "POSISSI KEJUTAN & BACAAN PASAR" }),
                /* @__PURE__ */ jsxs3("div", { className: "ct-gauge rm-gauge", role: "img", "aria-label": `Surprise index ${SFMT(r.surpriseIdx, 0)}`, children: [
                  /* @__PURE__ */ jsxs3("div", { className: "ct-gauge-track", children: [
                    /* @__PURE__ */ jsx3("span", { className: "ct-g-zone", style: { left: `${zoneL}%`, width: `${zoneW}%` }, "aria-hidden": "true" }),
                    /* @__PURE__ */ jsx3("span", { className: "ct-g-zero", "aria-hidden": "true" }),
                    /* @__PURE__ */ jsx3("span", { className: "ct-g-needle", style: { left: `${pos}%` }, "aria-hidden": "true" })
                  ] }),
                  /* @__PURE__ */ jsxs3("div", { className: "ct-gauge-scale mono", children: [
                    /* @__PURE__ */ jsxs3("span", { children: [
                      "\u2212",
                      FMT(domain, 1)
                    ] }),
                    /* @__PURE__ */ jsxs3("span", { children: [
                      "0 \xB7 \xB1",
                      FMT(tol, 2),
                      " = inline"
                    ] }),
                    /* @__PURE__ */ jsxs3("span", { children: [
                      "+",
                      FMT(domain, 1),
                      " ",
                      item.unit
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs3("div", { className: "rm-txt", children: [
                  /* @__PURE__ */ jsxs3("p", { children: [
                    /* @__PURE__ */ jsx3("b", { children: dateLong }),
                    " \u2014 ",
                    item.name,
                    " (",
                    item.short,
                    ") dirilis dengan nilai",
                    " ",
                    /* @__PURE__ */ jsxs3("b", { children: [
                      FMT(r.actual, d),
                      " ",
                      item.unit
                    ] }),
                    r.actual == null && " (actual belum tersedia)",
                    ".",
                    r.consensus != null && /* @__PURE__ */ jsxs3(Fragment, { children: [
                      " ",
                      "Konsensus analis memperkirakan ",
                      /* @__PURE__ */ jsxs3("b", { children: [
                        FMT(r.consensus, d),
                        " ",
                        item.unit
                      ] }),
                      r.surprise != null && /* @__PURE__ */ jsxs3(Fragment, { children: [
                        " \u2014 realisasi ",
                        Math.abs(r.surprise) <= tol ? "hampir sesuai" : r.surprise > 0 ? "lebih tinggi" : "lebih rendah",
                        " ",
                        /* @__PURE__ */ jsx3("b", { children: FMT(Math.abs(r.surprise), d) }),
                        " (",
                        r.surprisePct != null ? `${SFMT(r.surprisePct, 1)}%` : "\u2014",
                        ") dari perkiraan."
                      ] })
                    ] })
                  ] }),
                  r.previous != null && /* @__PURE__ */ jsxs3("p", { children: [
                    "Dibanding nilai sebelumnya ",
                    /* @__PURE__ */ jsxs3("b", { children: [
                      FMT(r.previous, d),
                      " ",
                      item.unit
                    ] }),
                    ", angka ini",
                    " ",
                    prevDelta === null ? "\u2014" : prevDelta > 0 ? "menaik" : prevDelta < 0 ? "menurun" : "stabil",
                    " ",
                    prevDelta !== null && /* @__PURE__ */ jsxs3("b", { children: [
                      SFMT(prevDelta, d),
                      " ",
                      item.unit
                    ] }),
                    " periode ini."
                  ] }),
                  rx ? /* @__PURE__ */ jsxs3("p", { children: [
                    /* @__PURE__ */ jsxs3("b", { children: [
                      "Bacaan pasar: ",
                      rx.dir > 0 ? "HAWKISH" : rx.dir < 0 ? "DOVISH" : "NETRAL",
                      "."
                    ] }),
                    " ",
                    rx.via,
                    " \u2014 estimasi pergerakan",
                    " ",
                    /* @__PURE__ */ jsxs3("b", { children: [
                      rx.cur,
                      " ",
                      rx.dir > 0 ? "menguat" : rx.dir < 0 ? "melemah" : "netral",
                      " \xB1",
                      FMT(rx.est, 2),
                      "%"
                    ] }),
                    " dalam 15 menit pasca-rilis."
                  ] }) : /* @__PURE__ */ jsx3("p", { children: "Nilai sesuai konsensus \u2014 pasar cenderung minim respons." })
                ] })
              ] }),
              pairs.length > 0 && /* @__PURE__ */ jsxs3("section", { className: "rm-card", children: [
                /* @__PURE__ */ jsx3("h5", { className: "mono", children: "ESTIMASI DAMPAK KE PAIR" }),
                /* @__PURE__ */ jsx3("div", { className: "ct-table-wrap rm-pair-wrap", children: /* @__PURE__ */ jsxs3("table", { className: "ct-table mono", children: [
                  /* @__PURE__ */ jsx3("thead", { children: /* @__PURE__ */ jsxs3("tr", { children: [
                    /* @__PURE__ */ jsx3("th", { children: "PAIR" }),
                    /* @__PURE__ */ jsx3("th", { children: "ARAH" }),
                    /* @__PURE__ */ jsx3("th", { children: "EST. MOVE" }),
                    /* @__PURE__ */ jsx3("th", { children: "KEKUATAN" })
                  ] }) }),
                  /* @__PURE__ */ jsx3("tbody", { children: pairs.map((p, i) => /* @__PURE__ */ jsxs3("tr", { style: { "--i": i }, children: [
                    /* @__PURE__ */ jsx3("td", { className: "ct-pair-name", children: p.label }),
                    /* @__PURE__ */ jsx3("td", { children: /* @__PURE__ */ jsx3("span", { className: `ct-dir ${p.dir > 0 ? "up" : p.dir < 0 ? "down" : "flat"}`, children: p.dir > 0 ? "\u25B2 BULLISH" : p.dir < 0 ? "\u25BC BEARISH" : "\u25C6 NETRAL" }) }),
                    /* @__PURE__ */ jsx3("td", { className: p.dir === 0 ? "" : p.dir > 0 ? "up" : "down", children: p.dir === 0 ? "\u2014" : `${p.dir > 0 ? "+" : "\u2212"}${FMT(p.est, 2)}%` }),
                    /* @__PURE__ */ jsxs3("td", { children: [
                      /* @__PURE__ */ jsx3("span", { className: "ct-seg", "aria-hidden": "true", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsx3("i", { className: n <= p.magnitude ? "on" : "", style: { "--n": n } }, n)) }),
                      /* @__PURE__ */ jsx3("span", { className: "ct-acc-sub", children: magnitudeLabel(p.magnitude) })
                    ] })
                  ] }, p.symbol)) })
                ] }) }),
                /* @__PURE__ */ jsx3("p", { className: "ct-model-note", children: "Model heuristik volatilitas 15 mnt \u2014 edukasi, bukan sinyal trading." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs3("div", { className: "rm-sec", children: [
              /* @__PURE__ */ jsx3("h5", { className: "mono", children: "KONTEKS INDIKATOR" }),
              /* @__PURE__ */ jsxs3("div", { className: "rm-ctx", children: [
                /* @__PURE__ */ jsxs3("div", { children: [
                  /* @__PURE__ */ jsx3("em", { children: "APA INI?" }),
                  /* @__PURE__ */ jsx3("p", { children: item.about })
                ] }),
                /* @__PURE__ */ jsxs3("div", { children: [
                  /* @__PURE__ */ jsx3("em", { children: "MENGAPA PENTING?" }),
                  /* @__PURE__ */ jsx3("p", { children: item.why })
                ] }),
                /* @__PURE__ */ jsxs3("div", { children: [
                  /* @__PURE__ */ jsx3("em", { children: "DAMPAK KE MATA UANG" }),
                  /* @__PURE__ */ jsx3("p", { children: item.fx })
                ] })
              ] })
            ] }),
            acc && acc.samples > 0 && /* @__PURE__ */ jsxs3("div", { className: "rm-acc mono", children: [
              /* @__PURE__ */ jsx3("span", { className: "rm-acc-label", children: "AKURASI KONSENSUS" }),
              /* @__PURE__ */ jsxs3("span", { children: [
                acc.samples,
                " RILIS"
              ] }),
              /* @__PURE__ */ jsxs3("span", { children: [
                "HIT RATE ",
                /* @__PURE__ */ jsxs3("b", { children: [
                  acc.hitRate,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxs3("span", { className: "up", children: [
                "BEAT ",
                acc.beats,
                "\xD7"
              ] }),
              /* @__PURE__ */ jsxs3("span", { className: "down", children: [
                "MISS ",
                acc.misses,
                "\xD7"
              ] }),
              /* @__PURE__ */ jsxs3("span", { children: [
                "INLINE ",
                acc.inlines,
                "\xD7"
              ] }),
              /* @__PURE__ */ jsxs3("span", { className: "rm-acc-this", children: [
                "RILIS INI: ",
                /* @__PURE__ */ jsx3("b", { className: cls === "up" ? "up" : cls === "down" ? "down" : "", children: r.surprise === null ? "MENUNGGU" : cls === "flat" ? "INLINE" : cls === "up" ? "BEAT" : "MISS" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs3("footer", { className: "rm-foot mono", children: [
              /* @__PURE__ */ jsxs3("span", { children: [
                "SRC: ",
                r.source === "live" ? "FOREXFACTORY" : "FRED + KURASI LOKAL",
                " \xB7 TOL \xB1",
                FMT(tol, 2),
                " ",
                item.unit
              ] }),
              /* @__PURE__ */ jsxs3("a", { className: "rm-link", href: `/indicators/${item.id}`, children: [
                "Halaman indikator ",
                item.short,
                " \u2192"
              ] })
            ] })
          ] })
        ] })
      }
    ),
    document.body
  );
}
function BlockHistory({ item }) {
  const d = item.decimals;
  const tol = item.tol ?? 0.5;
  const acc = item.accuracy;
  const [openRel, setOpenRel] = useState(null);
  const rels = useMemo(() => [...item.releases].reverse(), [item.releases]);
  const maxAbs = rels.reduce((m, r) => Math.max(m, Math.abs(r.surprise ?? 0)), 1e-9);
  const biasCls = acc.bias === null ? "" : acc.bias > tol / 2 ? "up" : acc.bias < -tol / 2 ? "down" : "flat";
  return /* @__PURE__ */ jsxs3("div", { className: "ct-block", style: { "--b": 1 }, children: [
    /* @__PURE__ */ jsxs3("div", { className: "ct-block-head", children: [
      /* @__PURE__ */ jsx3("span", { className: "ct-tag", children: "03" }),
      /* @__PURE__ */ jsx3("h4", { children: "Riwayat Surprise & Akurasi Konsensus" }),
      /* @__PURE__ */ jsxs3("span", { className: "ct-block-meta mono", children: [
        "N=",
        acc.samples,
        " \xB7 ",
        /* @__PURE__ */ jsxs3("b", { className: "up", children: [
          "BEAT ",
          acc.beats
        ] }),
        " \xB7 ",
        /* @__PURE__ */ jsxs3("b", { className: "down", children: [
          "MISS ",
          acc.misses
        ] }),
        " \xB7 INLINE ",
        acc.inlines,
        " \xB7 KLIK BARIS = DETAIL"
      ] })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "ct-hist-grid", children: [
      /* @__PURE__ */ jsxs3("div", { className: "ct-hist-left", children: [
        /* @__PURE__ */ jsxs3("div", { className: "ct-spark", "aria-hidden": "true", children: [
          rels.map((r, i) => {
            const h = r.surprise === null ? 0 : Math.max(6, Math.abs(r.surprise) / maxAbs * 48);
            const up = r.surprise > 0;
            return /* @__PURE__ */ jsx3("span", { className: "ct-sp-cell", style: { "--i": i }, children: r.surprise !== null && /* @__PURE__ */ jsx3(
              "i",
              {
                className: `ct-sp ${up ? "up" : "down"} ${i === 0 ? "last" : ""}`,
                style: { height: `${h}%` }
              }
            ) }, r.date);
          }),
          /* @__PURE__ */ jsx3("span", { className: "ct-sp-base" })
        ] }),
        /* @__PURE__ */ jsx3("div", { className: "ct-table-wrap", children: /* @__PURE__ */ jsxs3("table", { className: "ct-table mono", children: [
          /* @__PURE__ */ jsx3("thead", { children: /* @__PURE__ */ jsxs3("tr", { children: [
            /* @__PURE__ */ jsx3("th", { children: "TGL" }),
            /* @__PURE__ */ jsx3("th", { children: "PREV" }),
            /* @__PURE__ */ jsx3("th", { children: "KONS" }),
            /* @__PURE__ */ jsx3("th", { children: "AKTUAL" }),
            /* @__PURE__ */ jsx3("th", { children: "\u0394 SURPRISE" }),
            /* @__PURE__ */ jsx3("th", { children: "\u0394 IDX" }),
            /* @__PURE__ */ jsx3("th", { children: "SINYAL" }),
            /* @__PURE__ */ jsx3("th", { children: "SRC" }),
            /* @__PURE__ */ jsx3("th", { className: "ct-rm-go", "aria-label": "Detail", children: "\u25B8" })
          ] }) }),
          /* @__PURE__ */ jsx3("tbody", { children: rels.map((r, i) => {
            const scls = r.surprise === null ? "" : Math.abs(r.surprise) <= tol ? "flat" : r.surprise > 0 ? "up" : "down";
            return /* @__PURE__ */ jsxs3(
              "tr",
              {
                className: `${i === 0 ? "ct-latest" : ""} rm-clickable`,
                style: { "--i": i },
                role: "button",
                tabIndex: 0,
                title: "Klik untuk detail lengkap rilis ini",
                onClick: () => setOpenRel(r),
                onKeyDown: (ev) => (ev.key === "Enter" || ev.key === " ") && (ev.preventDefault(), setOpenRel(r)),
                children: [
                  /* @__PURE__ */ jsxs3("td", { title: `Rilis ${DMY(r.date)}`, children: [
                    i === 0 && /* @__PURE__ */ jsx3("span", { className: "ct-dot", "aria-hidden": "true" }),
                    DMY(r.date)
                  ] }),
                  /* @__PURE__ */ jsx3("td", { children: FMT(r.previous, d) }),
                  /* @__PURE__ */ jsx3("td", { children: FMT(r.consensus, d) }),
                  /* @__PURE__ */ jsx3("td", { children: /* @__PURE__ */ jsx3("b", { children: FMT(r.actual, d) }) }),
                  /* @__PURE__ */ jsx3("td", { className: scls, children: SFMT(r.surprise, d) }),
                  /* @__PURE__ */ jsx3("td", { className: scls, children: r.surpriseIdx !== null && r.surpriseIdx !== void 0 ? SFMT(r.surpriseIdx, 0) : "\u2014" }),
                  /* @__PURE__ */ jsx3("td", { className: scls, children: r.surprise === null ? "\xB7" : Math.abs(r.surprise) <= tol ? "\u25C6" : r.surprise > 0 ? "\u25B2" : "\u25BC" }),
                  /* @__PURE__ */ jsx3("td", { className: "ct-src", children: r.source === "live" ? "FF" : "FRED" }),
                  /* @__PURE__ */ jsx3("td", { className: "ct-rm-go", "aria-hidden": "true", children: "\u25B8" })
                ]
              },
              r.date
            );
          }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs3("aside", { className: "ct-acc", children: [
        /* @__PURE__ */ jsxs3("div", { className: "ct-acc-row", children: [
          /* @__PURE__ */ jsxs3("em", { children: [
            "HIT RATE ",
            /* @__PURE__ */ jsx3("span", { className: "tip", "data-tip": `Persentase rilis dengan |surprise| \u2264 \xB1${FMT(tol, 2)} ${item.unit} (inline).`, children: "\u24D8" })
          ] }),
          /* @__PURE__ */ jsxs3("b", { className: "mono", children: [
            /* @__PURE__ */ jsx3(Num, { v: acc.hitRate, d: 1 }),
            " ",
            /* @__PURE__ */ jsx3("i", { children: "%" })
          ] }),
          /* @__PURE__ */ jsx3("span", { className: "ct-acc-bar", children: /* @__PURE__ */ jsx3("i", { style: { width: `${acc.hitRate || 0}%` } }) }),
          /* @__PURE__ */ jsxs3("span", { className: "ct-acc-sub", children: [
            "inline \u2264 \xB1",
            FMT(tol, 2),
            " ",
            item.unit
          ] })
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "ct-acc-row", children: [
          /* @__PURE__ */ jsx3("em", { children: "AKURASI ARAH" }),
          /* @__PURE__ */ jsxs3("b", { className: "mono", children: [
            /* @__PURE__ */ jsx3(Num, { v: acc.dirAcc, d: 1 }),
            " ",
            /* @__PURE__ */ jsx3("i", { children: "%" })
          ] }),
          /* @__PURE__ */ jsx3("span", { className: "ct-acc-bar", children: /* @__PURE__ */ jsx3("i", { style: { width: `${acc.dirAcc || 0}%` }, className: "cyan" }) }),
          /* @__PURE__ */ jsx3("span", { className: "ct-acc-sub", children: "konsensus menebak arah naik/turun" })
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "ct-acc-row", children: [
          /* @__PURE__ */ jsx3("em", { children: "AVG |SURPRISE|" }),
          /* @__PURE__ */ jsx3("b", { className: "mono", children: /* @__PURE__ */ jsx3(Num, { v: acc.avgPct, d: 0 }) }),
          /* @__PURE__ */ jsx3("span", { className: "ct-acc-bar", children: /* @__PURE__ */ jsx3("i", { style: { width: `${Math.min((acc.avgPct || 0) / 150 * 100, 100)}%` }, className: "gold" }) }),
          /* @__PURE__ */ jsx3("span", { className: "ct-acc-sub", children: "indeks kejutan \xB7 100 = 1 skala tipikal" })
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "ct-acc-row", children: [
          /* @__PURE__ */ jsx3("em", { children: "BIAS KONSENSUS" }),
          /* @__PURE__ */ jsx3("b", { className: `mono ${biasCls}`, children: acc.bias === null ? "\u2014" : SFMT(acc.bias, d) }),
          /* @__PURE__ */ jsx3("span", { className: "ct-acc-bias", children: /* @__PURE__ */ jsx3(
            "i",
            {
              style: acc.bias === null ? { left: "50%", width: 0 } : acc.bias >= 0 ? { left: "50%", width: `${Math.min(Math.abs(acc.bias) / (2 * (tol * 2 + Math.abs(acc.bias))) * 100, 50)}%` } : { left: `${50 - Math.min((Math.abs(acc.bias) / (2 * (tol * 2 + Math.abs(acc.bias))) * 100, 50))}%`, width: `${Math.min((Math.abs(acc.bias) / (2 * (tol * 2 + Math.abs(acc.bias))) * 100, 50))}%` }
            }
          ) }),
          /* @__PURE__ */ jsx3("span", { className: "ct-acc-sub", children: acc.bias > 0 ? "konsensus cenderung terlalu rendah" : acc.bias < 0 ? "konsensus cenderung terlalu tinggi" : "tak berpihak" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "ct-hist-foot", children: [
      /* @__PURE__ */ jsxs3("div", { className: "ct-split-wrap", children: [
        /* @__PURE__ */ jsx3("span", { className: "ct-acc-sub", children: "DISTRIBUSI RILIS" }),
        /* @__PURE__ */ jsxs3("div", { className: "ct-split", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsx3("i", { className: "beat", style: { width: `${acc.beats / Math.max(acc.samples, 1) * 100}%` } }),
          /* @__PURE__ */ jsx3("i", { className: "inl", style: { width: `${acc.inlines / Math.max(acc.samples, 1) * 100}%` } }),
          /* @__PURE__ */ jsx3("i", { className: "miss", style: { width: `${acc.misses / Math.max(acc.samples, 1) * 100}%` } })
        ] }),
        /* @__PURE__ */ jsxs3("span", { className: "ct-acc-sub mono", children: [
          /* @__PURE__ */ jsxs3("b", { className: "up", children: [
            acc.beats,
            "\xD7"
          ] }),
          " BEAT \xB7 ",
          /* @__PURE__ */ jsxs3("b", { children: [
            acc.inlines,
            "\xD7"
          ] }),
          " INLINE \xB7 ",
          /* @__PURE__ */ jsxs3("b", { className: "down", children: [
            acc.misses,
            "\xD7"
          ] }),
          " MISS"
        ] })
      ] }),
      acc.streak && /* @__PURE__ */ jsxs3("div", { className: "ct-streak mono", children: [
        "STREAK \u25B8 ",
        acc.streak.n,
        "\xD7 ",
        acc.streak.kind,
        " beruntun"
      ] }),
      acc.maxSurprise !== null && /* @__PURE__ */ jsxs3("div", { className: "ct-streak mono dim", children: [
        "MAX SURPRISE \u25B8 ",
        SFMT(acc.maxSurprise, d),
        " (",
        DMY(acc.maxSurpriseDate),
        ")"
      ] })
    ] }),
    openRel && /* @__PURE__ */ jsx3(ReleaseModal, { item, r: openRel, onClose: () => setOpenRel(null) })
  ] });
}
function BlockImpact({ item, latest }) {
  const idx = latest?.surpriseIdx ?? null;
  const pairs = useMemo(
    () => idx !== null && latest ? computePairImpact(item.id, latest.surprisePct, latest.surprise, idx) : [],
    [item.id, latest, idx]
  );
  const rx = idx !== null ? currencyReaction(item.id, idx) : null;
  return /* @__PURE__ */ jsxs3("div", { className: "ct-block", style: { "--b": 2 }, children: [
    /* @__PURE__ */ jsxs3("div", { className: "ct-block-head", children: [
      /* @__PURE__ */ jsx3("span", { className: "ct-tag", children: "04" }),
      /* @__PURE__ */ jsx3("h4", { children: "Dampak terhadap Pasangan Mata Uang" }),
      /* @__PURE__ */ jsx3("span", { className: "ct-block-meta mono", children: latest ? `RILIS ${DMY(latest.date)} \xB7 IDX ${SFMT(idx, 0)}` : "\u2014" })
    ] }),
    rx ? /* @__PURE__ */ jsxs3("div", { className: `ct-rx ${rx.dir > 0 ? "up" : rx.dir < 0 ? "down" : "flat"}`, children: [
      /* @__PURE__ */ jsx3("span", { className: "ct-rx-cur mono", children: rx.cur }),
      /* @__PURE__ */ jsxs3("span", { className: "ct-rx-label", children: [
        rx.dir > 0 ? "MENGUAT" : rx.dir < 0 ? "MELEMAH" : "NETRAL",
        /* @__PURE__ */ jsxs3("em", { children: [
          " ",
          rx.via
        ] })
      ] }),
      /* @__PURE__ */ jsxs3("span", { className: "ct-rx-est mono", children: [
        "EST \xB1",
        FMT(rx.est, 2),
        "% \xB7 15 MNT PASCA-RILIS"
      ] })
    ] }) : /* @__PURE__ */ jsx3("p", { className: "ct-empty mono", children: "BELUM ADA RILIS TERKINI \u2014 ESTIMASI AKTIF SETELAH DATA KELUAR" }),
    pairs.length === 0 ? /* @__PURE__ */ jsx3("p", { className: "ct-empty mono", children: "TIDAK ADA PAIR TERKAIT LANGSUNG DENGAN INDIKATOR INI" }) : /* @__PURE__ */ jsx3("div", { className: "ct-table-wrap", children: /* @__PURE__ */ jsxs3("table", { className: "ct-table mono", children: [
      /* @__PURE__ */ jsx3("thead", { children: /* @__PURE__ */ jsxs3("tr", { children: [
        /* @__PURE__ */ jsx3("th", { children: "PAIR" }),
        /* @__PURE__ */ jsx3("th", { children: "ARAH" }),
        /* @__PURE__ */ jsx3("th", { children: "EST. MOVE" }),
        /* @__PURE__ */ jsx3("th", { children: "KEKUATAN" }),
        /* @__PURE__ */ jsx3("th", { children: "DRIVER" })
      ] }) }),
      /* @__PURE__ */ jsx3("tbody", { children: pairs.map((p, i) => /* @__PURE__ */ jsxs3("tr", { style: { "--i": i }, children: [
        /* @__PURE__ */ jsx3("td", { className: "ct-pair-name", children: p.label }),
        /* @__PURE__ */ jsx3("td", { children: /* @__PURE__ */ jsx3("span", { className: `ct-dir ${p.dir > 0 ? "up" : p.dir < 0 ? "down" : "flat"}`, children: p.dir > 0 ? "\u25B2 BULLISH" : p.dir < 0 ? "\u25BC BEARISH" : "\u25C6 NETRAL" }) }),
        /* @__PURE__ */ jsx3("td", { className: p.dir === 0 ? "" : p.dir > 0 ? "up" : "down", children: p.dir === 0 ? "\u2014" : `${p.dir > 0 ? "+" : "\u2212"}${FMT(p.est, 2)}%` }),
        /* @__PURE__ */ jsxs3("td", { children: [
          /* @__PURE__ */ jsx3("span", { className: "ct-seg", "aria-hidden": "true", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsx3("i", { className: n <= p.magnitude ? "on" : "", style: { "--n": n } }, n)) }),
          /* @__PURE__ */ jsx3("span", { className: "ct-acc-sub", children: magnitudeLabel(p.magnitude) })
        ] }),
        /* @__PURE__ */ jsx3("td", { className: "ct-driver", children: p.note })
      ] }, p.symbol)) })
    ] }) }),
    /* @__PURE__ */ jsx3("p", { className: "ct-model-note", children: "Model heuristik respons pasar (indeks kejutan \xD7 volatilitas historis 15 mnt pasca-rilis). Untuk edukasi \u2014 bukan saran perdagangan." })
  ] });
}
function AnalysisClient({ items, upcoming = [] }) {
  const now = useWib();
  const [selected, setSelected] = useState((items.find((i) => i.id === "cpi") || items[0])?.id);
  const [cat, setCat] = useState("semua");
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const qm = q.trim().toLowerCase();
    return items.filter((i) => cat === "semua" ? true : i.category === cat).filter((i) => !qm || i.short.toLowerCase().includes(qm) || i.name.toLowerCase().includes(qm)).sort((a, b) => (IMPACT_RANK[a.impact] ?? 3) - (IMPACT_RANK[b.impact] ?? 3) || a.short.localeCompare(b.short));
  }, [items, cat, q]);
  const current = useMemo(() => items.find((i) => i.id === selected) || items[0], [items, selected]);
  const latest = current?.releases?.length ? current.releases[current.releases.length - 1] : null;
  const prevRel = current?.releases?.length > 1 ? current.releases[current.releases.length - 2] : null;
  const globalNext = useMemo(() => {
    if (!now || !upcoming?.length) return null;
    const t = now.getTime();
    return upcoming.filter((e) => new Date(e.iso).getTime() > t).sort((a, b) => a.iso.localeCompare(b.iso))[0] || null;
  }, [upcoming, now]);
  return /* @__PURE__ */ jsx3(Fragment, { children: /* @__PURE__ */ jsxs3("div", { className: "ct-frame reveal", id: "consensus-terminal", children: [
    /* @__PURE__ */ jsx3("div", { className: "ct-scan", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs3("header", { className: "ct-head", children: [
      /* @__PURE__ */ jsxs3("span", { className: "ct-dots", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx3("i", {}),
        /* @__PURE__ */ jsx3("i", {}),
        /* @__PURE__ */ jsx3("i", {})
      ] }),
      /* @__PURE__ */ jsxs3("span", { className: "ct-title", children: [
        "MACROLAB ",
        /* @__PURE__ */ jsx3("em", { children: "//" }),
        " CONSENSUS\xA0TERMINAL ",
        /* @__PURE__ */ jsx3("span", { className: "ct-ver", children: "v2.1" }),
        /* @__PURE__ */ jsx3("span", { className: "ct-cursor", "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ jsxs3("span", { className: "ct-head-right", children: [
        /* @__PURE__ */ jsx3("span", { className: `ct-led ${current?.source === "live" ? "ok" : "dim"}`, children: current?.source === "live" ? "FRED\xB7LIVE" : "FRED\xB7CACHE" }),
        /* @__PURE__ */ jsxs3("span", { className: "ct-clock mono", children: [
          now ? WIBM.format(now) : "--:--:--",
          " WIB"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "ct-grid", children: [
      /* @__PURE__ */ jsxs3("aside", { className: "ct-side", children: [
        /* @__PURE__ */ jsxs3("div", { className: "ct-side-head", children: [
          /* @__PURE__ */ jsx3("span", { className: "ct-tag", children: "01" }),
          /* @__PURE__ */ jsx3("h4", { children: "Pilih Indikator" }),
          /* @__PURE__ */ jsxs3("span", { className: "ct-count mono", children: [
            list.length,
            "/",
            items.length
          ] })
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "ct-search", children: [
          /* @__PURE__ */ jsx3("span", { className: "ct-prompt", "aria-hidden": "true", children: ">" }),
          /* @__PURE__ */ jsx3(
            "input",
            {
              type: "text",
              placeholder: "cari indikator\u2026",
              value: q,
              onChange: (e) => setQ(e.target.value),
              "aria-label": "Cari indikator"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "ct-cats", role: "tablist", "aria-label": "Kategori indikator", children: [
          /* @__PURE__ */ jsx3("button", { className: cat === "semua" ? "on" : "", onClick: () => setCat("semua"), children: "SEMUA" }),
          CATEGORIES.map((c) => /* @__PURE__ */ jsx3("button", { className: cat === c.id ? "on" : "", onClick: () => setCat(c.id), children: c.label.toUpperCase() }, c.id))
        ] }),
        /* @__PURE__ */ jsxs3("div", { className: "ct-list", children: [
          list.map((i) => {
            const l = i.releases?.length ? i.releases[i.releases.length - 1] : null;
            const dCls = l?.surprise === null ? "" : Math.abs(l.surprise) <= (i.tol ?? 0.5) ? "flat" : l.surprise > 0 ? "up" : "down";
            const ne = nextEvent(upcoming, i.id, now);
            const cc = COUNTRIES.find((x) => x.id === i.country);
            const catC = CATEGORIES.find((x) => x.id === i.category)?.color;
            return /* @__PURE__ */ jsxs3(
              "button",
              {
                className: `ct-row ${i.id === current.id ? "on" : ""}`,
                onClick: () => setSelected(i.id),
                style: { "--c": catC },
                children: [
                  /* @__PURE__ */ jsxs3("span", { className: "ct-row-top", children: [
                    /* @__PURE__ */ jsx3(CountryFlag, { code: cc?.id, size: 15, showCode: false }),
                    /* @__PURE__ */ jsx3("b", { className: "ct-row-name", children: i.short }),
                    /* @__PURE__ */ jsxs3("span", { className: `ct-imp im-${(i.impact || "low").toLowerCase()}`, "aria-label": `Dampak ${i.impact}`, title: `Dampak ${i.impact}`, children: [
                      /* @__PURE__ */ jsx3("i", {}),
                      /* @__PURE__ */ jsx3("i", {}),
                      /* @__PURE__ */ jsx3("i", {})
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs3("span", { className: "ct-row-sub mono", children: [
                    /* @__PURE__ */ jsx3("span", { children: l ? /* @__PURE__ */ jsxs3(Fragment, { children: [
                      FMT(l.consensus, i.decimals),
                      " \u2192 ",
                      /* @__PURE__ */ jsx3("b", { className: dCls, children: FMT(l.actual, i.decimals) })
                    ] }) : "memuat\u2026" }),
                    ne && /* @__PURE__ */ jsxs3("span", { className: "ct-next", children: [
                      Number(ne.date.slice(8)),
                      " ",
                      BLN[Number(ne.date.slice(5, 7)) - 1],
                      " ",
                      ne.time
                    ] })
                  ] })
                ]
              },
              i.id
            );
          }),
          list.length === 0 && /* @__PURE__ */ jsxs3("p", { className: "ct-empty mono", children: [
            "TIDAK ADA HASIL UNTUK ",
            q.toUpperCase()
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx3("section", { className: "ct-main", children: current && latest && /* @__PURE__ */ jsxs3(Fragment, { children: [
        /* @__PURE__ */ jsx3(BlockConsensus, { item: current, latest, prevRel, now }),
        /* @__PURE__ */ jsx3(BlockHistory, { item: current }),
        /* @__PURE__ */ jsx3(BlockImpact, { item: current, latest })
      ] }) }, current.id)
    ] }),
    /* @__PURE__ */ jsxs3("footer", { className: "ct-foot", children: [
      /* @__PURE__ */ jsxs3("span", { className: "mono ct-foot-src", children: [
        "SRC: FRED",
        current?.source === "live" ? "+LIVE" : "",
        " \xB7 N: ",
        current?.accuracy.samples ?? 0,
        " \xB7 TOL: \xB1",
        FMT(current?.tol, 2),
        " ",
        current?.unit,
        " \xB7 ASOF: 30 AGU 2026"
      ] }),
      globalNext && now && /* @__PURE__ */ jsxs3("span", { className: "mono ct-foot-next", children: [
        "NEXT \u25B8 ",
        globalNext.title,
        " \u2014 ",
        fmtEv(globalNext),
        " WIB \xB7 ",
        /* @__PURE__ */ jsx3("b", { children: fmtCountdown(new Date(globalNext.iso).getTime() - now.getTime()) })
      ] }),
      /* @__PURE__ */ jsx3("span", { className: "ct-blink", "aria-hidden": "true", children: "\u25CF" })
    ] })
  ] }) });
}

// data/releases.js
var CONSENSUS = {
  nfp: [
    { date: "2026-08-07", obs: "2026-07-01", consensus: 85 },
    { date: "2026-07-02", obs: "2026-06-01", consensus: 114 },
    { date: "2026-06-05", obs: "2026-05-01", consensus: 85 },
    { date: "2026-05-08", obs: "2026-04-01", consensus: 65 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 140 },
    { date: "2026-03-13", obs: "2026-02-01", consensus: 45 },
    { date: "2026-02-11", obs: "2026-01-01", consensus: 66 },
    { date: "2026-01-09", obs: "2025-12-01", consensus: 66 },
    { date: "2025-12-16", obs: "2025-11-01", consensus: 51 },
    { date: "2025-11-14", obs: "2025-10-01", consensus: 40 },
    { date: "2025-10-10", obs: "2025-09-01", consensus: 75 },
    { date: "2025-09-05", obs: "2025-08-01", consensus: 75 },
    { date: "2026-09-04", obs: "2026-08-01", consensus: 58 }
  ],
  unemp: [
    { date: "2026-08-07", obs: "2026-07-01", consensus: 4.2 },
    { date: "2026-07-02", obs: "2026-06-01", consensus: 4.3 },
    { date: "2026-06-05", obs: "2026-05-01", consensus: 4.3 },
    { date: "2026-05-08", obs: "2026-04-01", consensus: 4.3 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 4.3 },
    { date: "2026-03-13", obs: "2026-02-01", consensus: 4.3 },
    { date: "2026-02-11", obs: "2026-01-01", consensus: 4.4 },
    { date: "2026-01-09", obs: "2025-12-01", consensus: 4.5 },
    { date: "2025-12-16", obs: "2025-11-01", consensus: 4.5 },
    { date: "2025-10-10", obs: "2025-09-01", consensus: 4.3 },
    { date: "2025-09-05", obs: "2025-08-01", consensus: 4.3 },
    { date: "2025-08-08", obs: "2025-07-01", consensus: 4.2 },
    { date: "2025-07-11", obs: "2025-06-01", consensus: 4.2 },
    { date: "2026-09-04", obs: "2026-08-01", consensus: 4.1 }
  ],
  cpi: [
    { date: "2026-08-12", obs: "2026-07-01", consensus: 3.4 },
    { date: "2026-07-14", obs: "2026-06-01", consensus: 3.8 },
    { date: "2026-06-09", obs: "2026-05-01", consensus: 4.2 },
    { date: "2026-05-12", obs: "2026-04-01", consensus: 3.7 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 3.4 },
    { date: "2026-03-11", obs: "2026-02-01", consensus: 2.4 },
    { date: "2026-02-13", obs: "2026-01-01", consensus: 2.5 },
    { date: "2026-01-13", obs: "2025-12-01", consensus: 2.7 },
    { date: "2025-12-10", obs: "2025-11-01", consensus: 2.9 },
    { date: "2025-10-15", obs: "2025-09-01", consensus: 2.9 },
    { date: "2025-09-11", obs: "2025-08-01", consensus: 2.9 },
    { date: "2025-08-12", obs: "2025-07-01", consensus: 2.8 },
    { date: "2025-07-15", obs: "2025-06-01", consensus: 2.6 },
    { date: "2025-06-11", obs: "2025-05-01", consensus: 2.5 }
  ],
  corecpi: [
    { date: "2026-08-12", obs: "2026-07-01", consensus: 2.5 },
    { date: "2026-07-14", obs: "2026-06-01", consensus: 2.8 },
    { date: "2026-06-09", obs: "2026-05-01", consensus: 2.9 },
    { date: "2026-05-12", obs: "2026-04-01", consensus: 2.7 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 2.7 },
    { date: "2026-03-11", obs: "2026-02-01", consensus: 2.5 },
    { date: "2026-02-13", obs: "2026-01-01", consensus: 2.5 },
    { date: "2026-01-13", obs: "2025-12-01", consensus: 2.7 },
    { date: "2025-12-10", obs: "2025-11-01", consensus: 2.7 },
    { date: "2025-10-15", obs: "2025-09-01", consensus: 2.9 },
    { date: "2025-09-11", obs: "2025-08-01", consensus: 3.1 },
    { date: "2025-08-12", obs: "2025-07-01", consensus: 3 },
    { date: "2025-07-15", obs: "2025-06-01", consensus: 3 },
    { date: "2025-06-11", obs: "2025-05-01", consensus: 2.9 }
  ],
  ppi: [
    { date: "2026-08-13", obs: "2026-07-01", consensus: 4.9 },
    { date: "2026-07-15", obs: "2026-06-01", consensus: 6.2 },
    { date: "2026-06-11", obs: "2026-05-01", consensus: 6.4 },
    { date: "2026-05-13", obs: "2026-04-01", consensus: 4.9 },
    { date: "2026-04-09", obs: "2026-03-01", consensus: 4 },
    { date: "2026-03-10", obs: "2026-02-01", consensus: 2.5 },
    { date: "2026-02-10", obs: "2026-01-01", consensus: 2.9 },
    { date: "2026-01-14", obs: "2025-12-01", consensus: 2.7 },
    { date: "2025-12-10", obs: "2025-11-01", consensus: 3.2 },
    { date: "2025-11-12", obs: "2025-10-01", consensus: 3.6 },
    { date: "2025-10-14", obs: "2025-09-01", consensus: 2.5 },
    { date: "2025-09-10", obs: "2025-08-01", consensus: 3.3 },
    { date: "2025-08-13", obs: "2025-07-01", consensus: 2 },
    { date: "2025-07-15", obs: "2025-06-01", consensus: 1.8 }
  ],
  corepce: [
    { date: "2026-08-26", obs: "2026-07-01", consensus: 0.2 },
    { date: "2026-07-27", obs: "2026-06-01", consensus: 0.3 },
    { date: "2026-06-25", obs: "2026-05-01", consensus: 0.3 },
    { date: "2026-05-27", obs: "2026-04-01", consensus: 0.3 },
    { date: "2026-04-27", obs: "2026-03-01", consensus: 0.35 },
    { date: "2026-03-27", obs: "2026-02-01", consensus: 0.35 },
    { date: "2026-02-27", obs: "2026-01-01", consensus: 0.3 },
    { date: "2026-01-27", obs: "2025-12-01", consensus: 0.28 },
    { date: "2025-12-26", obs: "2025-11-01", consensus: 0.25 },
    { date: "2025-11-27", obs: "2025-10-01", consensus: 0.25 },
    { date: "2025-10-27", obs: "2025-09-01", consensus: 0.25 },
    { date: "2025-09-26", obs: "2025-08-01", consensus: 0.24 },
    { date: "2025-08-27", obs: "2025-07-01", consensus: 0.25 },
    { date: "2025-07-28", obs: "2025-06-01", consensus: 0.25 }
  ],
  adp: [
    { date: "2026-06-03", obs: "2026-05-01", consensus: 118 }
  ],
  ahe: [
    { date: "2026-08-07", obs: "2026-07-01", consensus: 3.3 },
    { date: "2026-07-02", obs: "2026-06-01", consensus: 3.5 },
    { date: "2026-06-05", obs: "2026-05-01", consensus: 3.5 },
    { date: "2026-05-08", obs: "2026-04-01", consensus: 3.8 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 3.6 },
    { date: "2026-03-13", obs: "2026-02-01", consensus: 3.7 },
    { date: "2026-02-11", obs: "2026-01-01", consensus: 3.6 },
    { date: "2026-01-09", obs: "2025-12-01", consensus: 3.6 },
    { date: "2025-12-12", obs: "2025-11-01", consensus: 3.9 },
    { date: "2025-11-14", obs: "2025-10-01", consensus: 3.9 },
    { date: "2025-10-10", obs: "2025-09-01", consensus: 3.9 },
    { date: "2025-09-12", obs: "2025-08-01", consensus: 4 },
    { date: "2025-08-08", obs: "2025-07-01", consensus: 4 },
    { date: "2025-07-03", obs: "2025-06-01", consensus: 3.9 }
  ],
  fedfunds: [
    { date: "2026-07-29", obs: "2026-08-01", consensus: 3.75 },
    { date: "2026-07-29", obs: "2026-07-01", consensus: 3.75 },
    { date: "2026-06-17", obs: "2026-06-01", consensus: 3.5 },
    { date: "2026-03-18", obs: "2026-03-01", consensus: 3.75 },
    { date: "2025-12-10", obs: "2025-12-01", consensus: 3.75 },
    { date: "2025-10-29", obs: "2025-11-01", consensus: 4 },
    { date: "2025-10-29", obs: "2025-10-01", consensus: 4 },
    { date: "2025-09-17", obs: "2025-09-01", consensus: 4.25 }
  ],
  dgs10: [
    { date: "2026-08-31", obs: "2026-08-01", consensus: 4.6 }
  ],
  retail: [
    { date: "2026-08-14", obs: "2026-07-01", consensus: 0.1 },
    { date: "2026-07-16", obs: "2026-06-01", consensus: 0.2 },
    { date: "2026-06-16", obs: "2026-05-01", consensus: 0.7 },
    { date: "2026-05-12", obs: "2026-04-01", consensus: 1.1 },
    { date: "2026-04-15", obs: "2026-03-01", consensus: 1 },
    { date: "2026-03-16", obs: "2026-02-01", consensus: 0.6 },
    { date: "2026-02-10", obs: "2026-01-01", consensus: 0.4 },
    { date: "2026-01-14", obs: "2025-12-01", consensus: 0.5 },
    { date: "2025-12-16", obs: "2025-11-01", consensus: 0.1 },
    { date: "2025-11-18", obs: "2025-10-01", consensus: 0.2 },
    { date: "2025-10-15", obs: "2025-09-01", consensus: 0.3 },
    { date: "2025-09-15", obs: "2025-08-01", consensus: 0.5 },
    { date: "2025-08-15", obs: "2025-07-01", consensus: 0.6 },
    { date: "2025-07-15", obs: "2025-06-01", consensus: 0.7 }
  ],
  umich: [
    { date: "2026-08-14", obs: "2026-07-01", consensus: 54.7 },
    { date: "2026-07-09", obs: "2026-06-01", consensus: 47 },
    { date: "2026-06-12", obs: "2026-05-01", consensus: 46.1 },
    { date: "2026-05-08", obs: "2026-04-01", consensus: 49.7 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 51.6 },
    { date: "2026-03-13", obs: "2026-02-01", consensus: 55 },
    { date: "2026-02-05", obs: "2026-01-01", consensus: 54 },
    { date: "2026-01-09", obs: "2025-12-01", consensus: 53.5 },
    { date: "2025-12-05", obs: "2025-11-01", consensus: 53.5 },
    { date: "2025-11-07", obs: "2025-10-01", consensus: 53 },
    { date: "2025-10-10", obs: "2025-09-01", consensus: 54.1 },
    { date: "2025-09-12", obs: "2025-08-01", consensus: 58.2 },
    { date: "2025-08-15", obs: "2025-07-01", consensus: 61.9 },
    { date: "2025-07-10", obs: "2025-06-01", consensus: 61 }
  ],
  indpro: [
    { date: "2026-08-11", obs: "2026-07-01", consensus: 0.2 },
    { date: "2026-07-10", obs: "2026-06-01", consensus: 0.3 },
    { date: "2026-06-11", obs: "2026-05-01", consensus: 0.2 },
    { date: "2026-05-11", obs: "2026-04-01", consensus: 0.4 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 0.1 },
    { date: "2026-03-11", obs: "2026-02-01", consensus: 0.5 },
    { date: "2026-02-11", obs: "2026-01-01", consensus: 0.2 },
    { date: "2026-01-12", obs: "2025-12-01", consensus: 0.3 },
    { date: "2025-12-12", obs: "2025-11-01", consensus: 0 },
    { date: "2025-11-12", obs: "2025-10-01", consensus: -0.1 },
    { date: "2025-10-13", obs: "2025-09-01", consensus: 0.1 },
    { date: "2025-09-12", obs: "2025-08-01", consensus: 0 },
    { date: "2025-08-12", obs: "2025-07-01", consensus: 0.3 },
    { date: "2025-07-11", obs: "2025-06-01", consensus: 0.4 }
  ],
  gdp: [
    { date: "2026-08-26", obs: "2026-07-01", consensus: 1.5 }
  ],
  eu_cpi: [
    { date: "2026-08-07", obs: "2026-07-01", consensus: 2.8 },
    { date: "2026-07-07", obs: "2026-06-01", consensus: 3 },
    { date: "2026-06-08", obs: "2026-05-01", consensus: 3.1 },
    { date: "2026-05-07", obs: "2026-04-01", consensus: 2.6 },
    { date: "2026-04-07", obs: "2026-03-01", consensus: 2 },
    { date: "2026-03-06", obs: "2026-02-01", consensus: 1.7 },
    { date: "2026-02-06", obs: "2026-01-01", consensus: 1.9 },
    { date: "2026-01-07", obs: "2025-12-01", consensus: 2.1 },
    { date: "2025-12-08", obs: "2025-11-01", consensus: 2.1 },
    { date: "2025-11-07", obs: "2025-10-01", consensus: 2.2 },
    { date: "2025-10-07", obs: "2025-09-01", consensus: 2 },
    { date: "2025-09-08", obs: "2025-08-01", consensus: 2 },
    { date: "2025-08-07", obs: "2025-07-01", consensus: 2 },
    { date: "2025-07-07", obs: "2025-06-01", consensus: 1.9 }
  ],
  eu_unemp: [
    { date: "2023-02-08", obs: "2023-01-01", consensus: 6.7 }
  ],
  uk_cpi: [
    { date: "2025-04-07", obs: "2025-03-01", consensus: 3.7 },
    { date: "2025-03-07", obs: "2025-02-01", consensus: 3.8 },
    { date: "2025-02-07", obs: "2025-01-01", consensus: 3.6 },
    { date: "2025-01-07", obs: "2024-12-01", consensus: 3.4 },
    { date: "2024-12-06", obs: "2024-11-01", consensus: 3.1 },
    { date: "2024-11-07", obs: "2024-10-01", consensus: 2.7 },
    { date: "2024-10-07", obs: "2024-09-01", consensus: 2.9 },
    { date: "2024-09-06", obs: "2024-08-01", consensus: 3 },
    { date: "2024-08-07", obs: "2024-07-01", consensus: 3.1 },
    { date: "2024-07-08", obs: "2024-06-01", consensus: 2.8 },
    { date: "2024-06-07", obs: "2024-05-01", consensus: 2.9 },
    { date: "2024-05-07", obs: "2024-04-01", consensus: 3.1 },
    { date: "2024-04-08", obs: "2024-03-01", consensus: 3.8 },
    { date: "2024-03-07", obs: "2024-02-01", consensus: 3.9 }
  ],
  uk_unemp: [
    { date: "2026-05-07", obs: "2026-04-01", consensus: 5 },
    { date: "2026-04-07", obs: "2026-03-01", consensus: 4.9 },
    { date: "2026-03-06", obs: "2026-02-01", consensus: 5 },
    { date: "2026-02-06", obs: "2026-01-01", consensus: 5.1 },
    { date: "2026-01-07", obs: "2025-12-01", consensus: 5.1 },
    { date: "2025-12-08", obs: "2025-11-01", consensus: 5 },
    { date: "2025-11-07", obs: "2025-10-01", consensus: 5 },
    { date: "2025-10-07", obs: "2025-09-01", consensus: 4.9 },
    { date: "2025-09-08", obs: "2025-08-01", consensus: 4.8 },
    { date: "2025-08-07", obs: "2025-07-01", consensus: 4.7 },
    { date: "2025-07-07", obs: "2025-06-01", consensus: 4.6 },
    { date: "2025-06-06", obs: "2025-05-01", consensus: 4.6 },
    { date: "2025-05-07", obs: "2025-04-01", consensus: 4.6 },
    { date: "2025-04-07", obs: "2025-03-01", consensus: 4.5 }
  ],
  jp_cpi: [
    { date: "2021-07-20", obs: "2021-06-01", consensus: -0.4 }
  ],
  wti: [
    { date: "2026-08-31", obs: "2026-08-01", consensus: 82 }
  ],
  vix: [
    { date: "2026-08-31", obs: "2026-08-01", consensus: 16 }
  ],
  brent: [
    { date: "2026-08-31", obs: "2026-08-01", consensus: 88 }
  ],
  natgas: [
    { date: "2026-08-31", obs: "2026-08-01", consensus: 2.9 }
  ],
  copper: [
    { date: "2026-07-31", obs: "2026-07-01", consensus: 13200 }
  ],
  claims: [
    { date: "2026-08-13", obs: "2026-08-01", consensus: 202500 },
    { date: "2026-07-16", obs: "2026-07-01", consensus: 217667 },
    { date: "2026-06-10", obs: "2026-06-01", consensus: 217e3 },
    { date: "2026-05-07", obs: "2026-05-01", consensus: 205e3 },
    { date: "2026-04-09", obs: "2026-04-01", consensus: 21e4 },
    { date: "2026-03-12", obs: "2026-03-01", consensus: 214500 },
    { date: "2026-02-12", obs: "2026-02-01", consensus: 217e3 },
    { date: "2026-01-08", obs: "2026-01-01", consensus: 213e3 },
    { date: "2025-12-11", obs: "2025-12-01", consensus: 219500 },
    { date: "2025-11-18", obs: "2025-11-01", consensus: 223e3 },
    { date: "2025-10-02", obs: "2025-10-01", consensus: 22e4 },
    { date: "2025-09-11", obs: "2025-09-01", consensus: 232500 },
    { date: "2025-08-07", obs: "2025-08-01", consensus: 221e3 },
    { date: "2025-07-10", obs: "2025-07-01", consensus: 238e3 }
  ],
  capacity: [
    { date: "2026-08-11", obs: "2026-07-01", consensus: 76.1 },
    { date: "2026-07-10", obs: "2026-06-01", consensus: 76 },
    { date: "2026-06-11", obs: "2026-05-01", consensus: 75.9 },
    { date: "2026-05-11", obs: "2026-04-01", consensus: 75.6 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 75.5 },
    { date: "2026-03-11", obs: "2026-02-01", consensus: 75.3 },
    { date: "2026-02-11", obs: "2026-01-01", consensus: 75.4 },
    { date: "2026-01-12", obs: "2025-12-01", consensus: 75.4 },
    { date: "2025-12-12", obs: "2025-11-01", consensus: 75.5 },
    { date: "2025-11-12", obs: "2025-10-01", consensus: 75.9 },
    { date: "2025-10-13", obs: "2025-09-01", consensus: 76 },
    { date: "2025-09-12", obs: "2025-08-01", consensus: 76.2 },
    { date: "2025-08-12", obs: "2025-07-01", consensus: 76.4 },
    { date: "2025-07-11", obs: "2025-06-01", consensus: 76.1 }
  ],
  eu_gdp: [
    { date: "2026-05-01", obs: "2026-04-01", consensus: 0.8 },
    { date: "2026-02-02", obs: "2026-01-01", consensus: 0.8 },
    { date: "2025-11-03", obs: "2025-10-01", consensus: 1.1 },
    { date: "2025-08-01", obs: "2025-07-01", consensus: 0.9 }
  ],
  china_cpi: [
    { date: "2025-05-02", obs: "2025-04-01", consensus: 0.1 },
    { date: "2025-04-02", obs: "2025-03-01", consensus: 0 },
    { date: "2025-03-03", obs: "2025-02-01", consensus: -0.1 },
    { date: "2025-02-03", obs: "2025-01-01", consensus: 0.2 },
    { date: "2025-01-02", obs: "2024-12-01", consensus: 0.1 },
    { date: "2024-12-02", obs: "2024-11-01", consensus: 0.2 },
    { date: "2024-11-01", obs: "2024-10-01", consensus: 0.3 },
    { date: "2024-10-02", obs: "2024-09-01", consensus: 0.4 },
    { date: "2024-09-02", obs: "2024-08-01", consensus: 0.3 },
    { date: "2024-08-02", obs: "2024-07-01", consensus: 0.5 },
    { date: "2024-07-02", obs: "2024-06-01", consensus: 0.3 },
    { date: "2024-06-03", obs: "2024-05-01", consensus: 0.3 },
    { date: "2024-05-02", obs: "2024-04-01", consensus: 0.2 },
    { date: "2024-04-02", obs: "2024-03-01", consensus: 0.2 }
  ],
  // ISM (ditambahkan 30-Agu-2026) — tervalidasi: screenshot FF user (1-15 Jul 26)
  // + file API earningsapi (Non-Manufacturing). Tanggal selain yg ditandai = estimasi.
  ismmfg: [
    { date: "2026-08-03", obs: "2026-07-01", consensus: 54 },
    { date: "2026-07-02", obs: "2026-06-01", consensus: 53.8 },
    // tervalidasi FF
    { date: "2026-06-01", obs: "2026-05-01", consensus: 53.3 },
    { date: "2026-09-01", obs: "2026-08-01", consensus: 55.2 }
  ],
  ismsvc: [
    { date: "2026-08-05", obs: "2026-07-01", consensus: 54.5 },
    // tervalidasi API
    { date: "2026-07-06", obs: "2026-06-01", consensus: 54.2 },
    // tervalidasi FF
    { date: "2026-06-04", obs: "2026-05-01", consensus: 53.7 },
    { date: "2025-10-03", obs: "2025-09-01", consensus: 51.8 },
    // tervalidasi API
    { date: "2025-09-04", obs: "2025-08-01", consensus: 50.9 },
    // tervalidasi API
    { date: "2025-07-03", obs: "2025-06-01", consensus: 50.8 }
    // tervalidasi API
  ]
};

// data/seed.json
var seed_default = {
  generated: "2026-08-29T10:40:55.042Z",
  source: "FRED (fred.stlouisfed.org/graph/fredgraph.csv)",
  ok: 27,
  fail: 0,
  series: {
    nfp: {
      id: "nfp",
      fred: "PAYEMS",
      mode: "monthly_change",
      unit: "ribu",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: -23
      },
      points: [
        {
          date: "2016-08-01",
          value: 141
        },
        {
          date: "2016-09-01",
          value: 306
        },
        {
          date: "2016-10-01",
          value: 98
        },
        {
          date: "2016-11-01",
          value: 118
        },
        {
          date: "2016-12-01",
          value: 225
        },
        {
          date: "2017-01-01",
          value: 220
        },
        {
          date: "2017-02-01",
          value: 218
        },
        {
          date: "2017-03-01",
          value: 124
        },
        {
          date: "2017-04-01",
          value: 205
        },
        {
          date: "2017-05-01",
          value: 205
        },
        {
          date: "2017-06-01",
          value: 203
        },
        {
          date: "2017-07-01",
          value: 189
        },
        {
          date: "2017-08-01",
          value: 147
        },
        {
          date: "2017-09-01",
          value: 89
        },
        {
          date: "2017-10-01",
          value: 141
        },
        {
          date: "2017-11-01",
          value: 223
        },
        {
          date: "2017-12-01",
          value: 151
        },
        {
          date: "2018-01-01",
          value: 137
        },
        {
          date: "2018-02-01",
          value: 394
        },
        {
          date: "2018-03-01",
          value: 226
        },
        {
          date: "2018-04-01",
          value: 140
        },
        {
          date: "2018-05-01",
          value: 322
        },
        {
          date: "2018-06-01",
          value: 218
        },
        {
          date: "2018-07-01",
          value: 60
        },
        {
          date: "2018-08-01",
          value: 257
        },
        {
          date: "2018-09-01",
          value: 81
        },
        {
          date: "2018-10-01",
          value: 169
        },
        {
          date: "2018-11-01",
          value: 90
        },
        {
          date: "2018-12-01",
          value: 192
        },
        {
          date: "2019-01-01",
          value: 251
        },
        {
          date: "2019-02-01",
          value: 7
        },
        {
          date: "2019-03-01",
          value: 228
        },
        {
          date: "2019-04-01",
          value: 296
        },
        {
          date: "2019-05-01",
          value: 27
        },
        {
          date: "2019-06-01",
          value: 220
        },
        {
          date: "2019-07-01",
          value: 99
        },
        {
          date: "2019-08-01",
          value: 232
        },
        {
          date: "2019-09-01",
          value: 196
        },
        {
          date: "2019-10-01",
          value: 95
        },
        {
          date: "2019-11-01",
          value: 207
        },
        {
          date: "2019-12-01",
          value: 127
        },
        {
          date: "2020-01-01",
          value: 237
        },
        {
          date: "2020-02-01",
          value: 262
        },
        {
          date: "2020-03-01",
          value: -1398
        },
        {
          date: "2020-04-01",
          value: -20469
        },
        {
          date: "2020-05-01",
          value: 2614
        },
        {
          date: "2020-06-01",
          value: 4631
        },
        {
          date: "2020-07-01",
          value: 1584
        },
        {
          date: "2020-08-01",
          value: 1566
        },
        {
          date: "2020-09-01",
          value: 949
        },
        {
          date: "2020-10-01",
          value: 690
        },
        {
          date: "2020-11-01",
          value: 273
        },
        {
          date: "2020-12-01",
          value: -185
        },
        {
          date: "2021-01-01",
          value: 315
        },
        {
          date: "2021-02-01",
          value: 517
        },
        {
          date: "2021-03-01",
          value: 852
        },
        {
          date: "2021-04-01",
          value: 355
        },
        {
          date: "2021-05-01",
          value: 478
        },
        {
          date: "2021-06-01",
          value: 755
        },
        {
          date: "2021-07-01",
          value: 942
        },
        {
          date: "2021-08-01",
          value: 552
        },
        {
          date: "2021-09-01",
          value: 457
        },
        {
          date: "2021-10-01",
          value: 801
        },
        {
          date: "2021-11-01",
          value: 658
        },
        {
          date: "2021-12-01",
          value: 586
        },
        {
          date: "2022-01-01",
          value: 190
        },
        {
          date: "2022-02-01",
          value: 819
        },
        {
          date: "2022-03-01",
          value: 490
        },
        {
          date: "2022-04-01",
          value: 308
        },
        {
          date: "2022-05-01",
          value: 301
        },
        {
          date: "2022-06-01",
          value: 434
        },
        {
          date: "2022-07-01",
          value: 714
        },
        {
          date: "2022-08-01",
          value: 290
        },
        {
          date: "2022-09-01",
          value: 220
        },
        {
          date: "2022-10-01",
          value: 357
        },
        {
          date: "2022-11-01",
          value: 303
        },
        {
          date: "2022-12-01",
          value: 100
        },
        {
          date: "2023-01-01",
          value: 434
        },
        {
          date: "2023-02-01",
          value: 290
        },
        {
          date: "2023-03-01",
          value: 68
        },
        {
          date: "2023-04-01",
          value: 241
        },
        {
          date: "2023-05-01",
          value: 280
        },
        {
          date: "2023-06-01",
          value: 225
        },
        {
          date: "2023-07-01",
          value: 163
        },
        {
          date: "2023-08-01",
          value: 218
        },
        {
          date: "2023-09-01",
          value: 156
        },
        {
          date: "2023-10-01",
          value: 159
        },
        {
          date: "2023-11-01",
          value: 127
        },
        {
          date: "2023-12-01",
          value: 154
        },
        {
          date: "2024-01-01",
          value: 175
        },
        {
          date: "2024-02-01",
          value: 206
        },
        {
          date: "2024-03-01",
          value: 228
        },
        {
          date: "2024-04-01",
          value: 64
        },
        {
          date: "2024-05-01",
          value: 78
        },
        {
          date: "2024-06-01",
          value: 87
        },
        {
          date: "2024-07-01",
          value: 53
        },
        {
          date: "2024-08-01",
          value: 9
        },
        {
          date: "2024-09-01",
          value: 155
        },
        {
          date: "2024-10-01",
          value: 33
        },
        {
          date: "2024-11-01",
          value: 134
        },
        {
          date: "2024-12-01",
          value: 237
        },
        {
          date: "2025-01-01",
          value: -48
        },
        {
          date: "2025-02-01",
          value: 42
        },
        {
          date: "2025-03-01",
          value: 67
        },
        {
          date: "2025-04-01",
          value: 108
        },
        {
          date: "2025-05-01",
          value: 13
        },
        {
          date: "2025-06-01",
          value: 147
        },
        {
          date: "2025-07-01",
          value: 64
        },
        {
          date: "2025-08-01",
          value: 22
        },
        {
          date: "2025-09-01",
          value: 76
        },
        {
          date: "2025-10-01",
          value: 108
        },
        {
          date: "2025-11-01",
          value: 64
        },
        {
          date: "2025-12-01",
          value: 50
        },
        {
          date: "2026-01-01",
          value: 130
        },
        {
          date: "2026-02-01",
          value: -156
        },
        {
          date: "2026-03-01",
          value: 185
        },
        {
          date: "2026-04-01",
          value: 115
        },
        {
          date: "2026-05-01",
          value: 129
        },
        {
          date: "2026-06-01",
          value: 20
        },
        {
          date: "2026-07-01",
          value: -23
        }
      ]
    },
    unemp: {
      id: "unemp",
      fred: "UNRATE",
      mode: "level",
      unit: "%",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: 4.1
      },
      points: [
        {
          date: "2016-07-01",
          value: 4.8
        },
        {
          date: "2016-08-01",
          value: 4.9
        },
        {
          date: "2016-09-01",
          value: 5
        },
        {
          date: "2016-10-01",
          value: 4.9
        },
        {
          date: "2016-11-01",
          value: 4.7
        },
        {
          date: "2016-12-01",
          value: 4.7
        },
        {
          date: "2017-01-01",
          value: 4.7
        },
        {
          date: "2017-02-01",
          value: 4.6
        },
        {
          date: "2017-03-01",
          value: 4.4
        },
        {
          date: "2017-04-01",
          value: 4.4
        },
        {
          date: "2017-05-01",
          value: 4.4
        },
        {
          date: "2017-06-01",
          value: 4.3
        },
        {
          date: "2017-07-01",
          value: 4.3
        },
        {
          date: "2017-08-01",
          value: 4.4
        },
        {
          date: "2017-09-01",
          value: 4.3
        },
        {
          date: "2017-10-01",
          value: 4.2
        },
        {
          date: "2017-11-01",
          value: 4.2
        },
        {
          date: "2017-12-01",
          value: 4.1
        },
        {
          date: "2018-01-01",
          value: 4
        },
        {
          date: "2018-02-01",
          value: 4.1
        },
        {
          date: "2018-03-01",
          value: 4
        },
        {
          date: "2018-04-01",
          value: 4
        },
        {
          date: "2018-05-01",
          value: 3.8
        },
        {
          date: "2018-06-01",
          value: 4
        },
        {
          date: "2018-07-01",
          value: 3.8
        },
        {
          date: "2018-08-01",
          value: 3.8
        },
        {
          date: "2018-09-01",
          value: 3.7
        },
        {
          date: "2018-10-01",
          value: 3.8
        },
        {
          date: "2018-11-01",
          value: 3.8
        },
        {
          date: "2018-12-01",
          value: 3.9
        },
        {
          date: "2019-01-01",
          value: 4
        },
        {
          date: "2019-02-01",
          value: 3.8
        },
        {
          date: "2019-03-01",
          value: 3.8
        },
        {
          date: "2019-04-01",
          value: 3.7
        },
        {
          date: "2019-05-01",
          value: 3.6
        },
        {
          date: "2019-06-01",
          value: 3.6
        },
        {
          date: "2019-07-01",
          value: 3.7
        },
        {
          date: "2019-08-01",
          value: 3.6
        },
        {
          date: "2019-09-01",
          value: 3.5
        },
        {
          date: "2019-10-01",
          value: 3.6
        },
        {
          date: "2019-11-01",
          value: 3.6
        },
        {
          date: "2019-12-01",
          value: 3.6
        },
        {
          date: "2020-01-01",
          value: 3.6
        },
        {
          date: "2020-02-01",
          value: 3.5
        },
        {
          date: "2020-03-01",
          value: 4.4
        },
        {
          date: "2020-04-01",
          value: 14.8
        },
        {
          date: "2020-05-01",
          value: 13.2
        },
        {
          date: "2020-06-01",
          value: 11
        },
        {
          date: "2020-07-01",
          value: 10.2
        },
        {
          date: "2020-08-01",
          value: 8.4
        },
        {
          date: "2020-09-01",
          value: 7.8
        },
        {
          date: "2020-10-01",
          value: 6.9
        },
        {
          date: "2020-11-01",
          value: 6.7
        },
        {
          date: "2020-12-01",
          value: 6.7
        },
        {
          date: "2021-01-01",
          value: 6.4
        },
        {
          date: "2021-02-01",
          value: 6.2
        },
        {
          date: "2021-03-01",
          value: 6.1
        },
        {
          date: "2021-04-01",
          value: 6.1
        },
        {
          date: "2021-05-01",
          value: 5.8
        },
        {
          date: "2021-06-01",
          value: 5.9
        },
        {
          date: "2021-07-01",
          value: 5.4
        },
        {
          date: "2021-08-01",
          value: 5.1
        },
        {
          date: "2021-09-01",
          value: 4.7
        },
        {
          date: "2021-10-01",
          value: 4.5
        },
        {
          date: "2021-11-01",
          value: 4.1
        },
        {
          date: "2021-12-01",
          value: 3.9
        },
        {
          date: "2022-01-01",
          value: 4
        },
        {
          date: "2022-02-01",
          value: 3.9
        },
        {
          date: "2022-03-01",
          value: 3.7
        },
        {
          date: "2022-04-01",
          value: 3.7
        },
        {
          date: "2022-05-01",
          value: 3.6
        },
        {
          date: "2022-06-01",
          value: 3.6
        },
        {
          date: "2022-07-01",
          value: 3.5
        },
        {
          date: "2022-08-01",
          value: 3.6
        },
        {
          date: "2022-09-01",
          value: 3.5
        },
        {
          date: "2022-10-01",
          value: 3.6
        },
        {
          date: "2022-11-01",
          value: 3.6
        },
        {
          date: "2022-12-01",
          value: 3.5
        },
        {
          date: "2023-01-01",
          value: 3.5
        },
        {
          date: "2023-02-01",
          value: 3.6
        },
        {
          date: "2023-03-01",
          value: 3.5
        },
        {
          date: "2023-04-01",
          value: 3.4
        },
        {
          date: "2023-05-01",
          value: 3.6
        },
        {
          date: "2023-06-01",
          value: 3.6
        },
        {
          date: "2023-07-01",
          value: 3.5
        },
        {
          date: "2023-08-01",
          value: 3.7
        },
        {
          date: "2023-09-01",
          value: 3.7
        },
        {
          date: "2023-10-01",
          value: 3.9
        },
        {
          date: "2023-11-01",
          value: 3.7
        },
        {
          date: "2023-12-01",
          value: 3.8
        },
        {
          date: "2024-01-01",
          value: 3.7
        },
        {
          date: "2024-02-01",
          value: 3.9
        },
        {
          date: "2024-03-01",
          value: 3.9
        },
        {
          date: "2024-04-01",
          value: 3.9
        },
        {
          date: "2024-05-01",
          value: 3.9
        },
        {
          date: "2024-06-01",
          value: 4.1
        },
        {
          date: "2024-07-01",
          value: 4.2
        },
        {
          date: "2024-08-01",
          value: 4.2
        },
        {
          date: "2024-09-01",
          value: 4.1
        },
        {
          date: "2024-10-01",
          value: 4.1
        },
        {
          date: "2024-11-01",
          value: 4.2
        },
        {
          date: "2024-12-01",
          value: 4.1
        },
        {
          date: "2025-01-01",
          value: 4
        },
        {
          date: "2025-02-01",
          value: 4.2
        },
        {
          date: "2025-03-01",
          value: 4.2
        },
        {
          date: "2025-04-01",
          value: 4.2
        },
        {
          date: "2025-05-01",
          value: 4.3
        },
        {
          date: "2025-06-01",
          value: 4.1
        },
        {
          date: "2025-07-01",
          value: 4.3
        },
        {
          date: "2025-08-01",
          value: 4.3
        },
        {
          date: "2025-09-01",
          value: 4.4
        },
        {
          date: "2025-11-01",
          value: 4.6
        },
        {
          date: "2025-12-01",
          value: 4.4
        },
        {
          date: "2026-01-01",
          value: 4.3
        },
        {
          date: "2026-02-01",
          value: 4.4
        },
        {
          date: "2026-03-01",
          value: 4.3
        },
        {
          date: "2026-04-01",
          value: 4.3
        },
        {
          date: "2026-05-01",
          value: 4.3
        },
        {
          date: "2026-06-01",
          value: 4.2
        },
        {
          date: "2026-07-01",
          value: 4.1
        }
      ]
    },
    cpi: {
      id: "cpi",
      fred: "CPIAUCSL",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: 3.4
      },
      points: [
        {
          date: "2016-07-01",
          value: 0.87
        },
        {
          date: "2016-08-01",
          value: 1.06
        },
        {
          date: "2016-09-01",
          value: 1.55
        },
        {
          date: "2016-10-01",
          value: 1.69
        },
        {
          date: "2016-11-01",
          value: 1.68
        },
        {
          date: "2016-12-01",
          value: 2.05
        },
        {
          date: "2017-01-01",
          value: 2.51
        },
        {
          date: "2017-02-01",
          value: 2.81
        },
        {
          date: "2017-03-01",
          value: 2.44
        },
        {
          date: "2017-04-01",
          value: 2.18
        },
        {
          date: "2017-05-01",
          value: 1.86
        },
        {
          date: "2017-06-01",
          value: 1.64
        },
        {
          date: "2017-07-01",
          value: 1.73
        },
        {
          date: "2017-08-01",
          value: 1.93
        },
        {
          date: "2017-09-01",
          value: 2.18
        },
        {
          date: "2017-10-01",
          value: 2.02
        },
        {
          date: "2017-11-01",
          value: 2.17
        },
        {
          date: "2017-12-01",
          value: 2.13
        },
        {
          date: "2018-01-01",
          value: 2.15
        },
        {
          date: "2018-02-01",
          value: 2.26
        },
        {
          date: "2018-03-01",
          value: 2.33
        },
        {
          date: "2018-04-01",
          value: 2.47
        },
        {
          date: "2018-05-01",
          value: 2.78
        },
        {
          date: "2018-06-01",
          value: 2.81
        },
        {
          date: "2018-07-01",
          value: 2.85
        },
        {
          date: "2018-08-01",
          value: 2.64
        },
        {
          date: "2018-09-01",
          value: 2.33
        },
        {
          date: "2018-10-01",
          value: 2.49
        },
        {
          date: "2018-11-01",
          value: 2.15
        },
        {
          date: "2018-12-01",
          value: 2
        },
        {
          date: "2019-01-01",
          value: 1.49
        },
        {
          date: "2019-02-01",
          value: 1.52
        },
        {
          date: "2019-03-01",
          value: 1.88
        },
        {
          date: "2019-04-01",
          value: 2
        },
        {
          date: "2019-05-01",
          value: 1.8
        },
        {
          date: "2019-06-01",
          value: 1.67
        },
        {
          date: "2019-07-01",
          value: 1.83
        },
        {
          date: "2019-08-01",
          value: 1.74
        },
        {
          date: "2019-09-01",
          value: 1.68
        },
        {
          date: "2019-10-01",
          value: 1.73
        },
        {
          date: "2019-11-01",
          value: 2.09
        },
        {
          date: "2019-12-01",
          value: 2.32
        },
        {
          date: "2020-01-01",
          value: 2.6
        },
        {
          date: "2020-02-01",
          value: 2.34
        },
        {
          date: "2020-03-01",
          value: 1.49
        },
        {
          date: "2020-04-01",
          value: 0.31
        },
        {
          date: "2020-05-01",
          value: 0.2
        },
        {
          date: "2020-06-01",
          value: 0.72
        },
        {
          date: "2020-07-01",
          value: 1
        },
        {
          date: "2020-08-01",
          value: 1.28
        },
        {
          date: "2020-09-01",
          value: 1.39
        },
        {
          date: "2020-10-01",
          value: 1.23
        },
        {
          date: "2020-11-01",
          value: 1.18
        },
        {
          date: "2020-12-01",
          value: 1.32
        },
        {
          date: "2021-01-01",
          value: 1.37
        },
        {
          date: "2021-02-01",
          value: 1.67
        },
        {
          date: "2021-03-01",
          value: 2.67
        },
        {
          date: "2021-04-01",
          value: 4.13
        },
        {
          date: "2021-05-01",
          value: 4.92
        },
        {
          date: "2021-06-01",
          value: 5.3
        },
        {
          date: "2021-07-01",
          value: 5.25
        },
        {
          date: "2021-08-01",
          value: 5.15
        },
        {
          date: "2021-09-01",
          value: 5.35
        },
        {
          date: "2021-10-01",
          value: 6.24
        },
        {
          date: "2021-11-01",
          value: 6.9
        },
        {
          date: "2021-12-01",
          value: 7.17
        },
        {
          date: "2022-01-01",
          value: 7.56
        },
        {
          date: "2022-02-01",
          value: 7.94
        },
        {
          date: "2022-03-01",
          value: 8.57
        },
        {
          date: "2022-04-01",
          value: 8.23
        },
        {
          date: "2022-05-01",
          value: 8.54
        },
        {
          date: "2022-06-01",
          value: 8.98
        },
        {
          date: "2022-07-01",
          value: 8.46
        },
        {
          date: "2022-08-01",
          value: 8.22
        },
        {
          date: "2022-09-01",
          value: 8.19
        },
        {
          date: "2022-10-01",
          value: 7.76
        },
        {
          date: "2022-11-01",
          value: 7.12
        },
        {
          date: "2022-12-01",
          value: 6.4
        },
        {
          date: "2023-01-01",
          value: 6.33
        },
        {
          date: "2023-02-01",
          value: 5.96
        },
        {
          date: "2023-03-01",
          value: 4.92
        },
        {
          date: "2023-04-01",
          value: 4.95
        },
        {
          date: "2023-05-01",
          value: 4.13
        },
        {
          date: "2023-06-01",
          value: 3.07
        },
        {
          date: "2023-07-01",
          value: 3.29
        },
        {
          date: "2023-08-01",
          value: 3.72
        },
        {
          date: "2023-09-01",
          value: 3.69
        },
        {
          date: "2023-10-01",
          value: 3.25
        },
        {
          date: "2023-11-01",
          value: 3.13
        },
        {
          date: "2023-12-01",
          value: 3.32
        },
        {
          date: "2024-01-01",
          value: 3.09
        },
        {
          date: "2024-02-01",
          value: 3.16
        },
        {
          date: "2024-03-01",
          value: 3.49
        },
        {
          date: "2024-04-01",
          value: 3.36
        },
        {
          date: "2024-05-01",
          value: 3.24
        },
        {
          date: "2024-06-01",
          value: 2.97
        },
        {
          date: "2024-07-01",
          value: 2.94
        },
        {
          date: "2024-08-01",
          value: 2.61
        },
        {
          date: "2024-09-01",
          value: 2.43
        },
        {
          date: "2024-10-01",
          value: 2.58
        },
        {
          date: "2024-11-01",
          value: 2.72
        },
        {
          date: "2024-12-01",
          value: 2.87
        },
        {
          date: "2025-01-01",
          value: 2.99
        },
        {
          date: "2025-02-01",
          value: 2.8
        },
        {
          date: "2025-03-01",
          value: 2.38
        },
        {
          date: "2025-04-01",
          value: 2.33
        },
        {
          date: "2025-05-01",
          value: 2.4
        },
        {
          date: "2025-06-01",
          value: 2.7
        },
        {
          date: "2025-07-01",
          value: 2.7
        },
        {
          date: "2025-08-01",
          value: 2.9
        },
        {
          date: "2025-09-01",
          value: 3.02
        },
        {
          date: "2025-11-01",
          value: 2.7
        },
        {
          date: "2025-12-01",
          value: 2.7
        },
        {
          date: "2026-01-01",
          value: 2.4
        },
        {
          date: "2026-02-01",
          value: 2.4
        },
        {
          date: "2026-03-01",
          value: 3.3
        },
        {
          date: "2026-04-01",
          value: 3.8
        },
        {
          date: "2026-05-01",
          value: 4.2
        },
        {
          date: "2026-06-01",
          value: 3.5
        },
        {
          date: "2026-07-01",
          value: 3.4
        }
      ]
    },
    corecpi: {
      id: "corecpi",
      fred: "CPILFESL",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: 2.5
      },
      points: [
        {
          date: "2016-07-01",
          value: 2.17
        },
        {
          date: "2016-08-01",
          value: 2.31
        },
        {
          date: "2016-09-01",
          value: 2.27
        },
        {
          date: "2016-10-01",
          value: 2.2
        },
        {
          date: "2016-11-01",
          value: 2.15
        },
        {
          date: "2016-12-01",
          value: 2.2
        },
        {
          date: "2017-01-01",
          value: 2.25
        },
        {
          date: "2017-02-01",
          value: 2.24
        },
        {
          date: "2017-03-01",
          value: 2.05
        },
        {
          date: "2017-04-01",
          value: 1.9
        },
        {
          date: "2017-05-01",
          value: 1.74
        },
        {
          date: "2017-06-01",
          value: 1.7
        },
        {
          date: "2017-07-01",
          value: 1.68
        },
        {
          date: "2017-08-01",
          value: 1.66
        },
        {
          date: "2017-09-01",
          value: 1.6
        },
        {
          date: "2017-10-01",
          value: 1.76
        },
        {
          date: "2017-11-01",
          value: 1.74
        },
        {
          date: "2017-12-01",
          value: 1.77
        },
        {
          date: "2018-01-01",
          value: 1.89
        },
        {
          date: "2018-02-01",
          value: 1.88
        },
        {
          date: "2018-03-01",
          value: 2.12
        },
        {
          date: "2018-04-01",
          value: 2.15
        },
        {
          date: "2018-05-01",
          value: 2.27
        },
        {
          date: "2018-06-01",
          value: 2.25
        },
        {
          date: "2018-07-01",
          value: 2.27
        },
        {
          date: "2018-08-01",
          value: 2.12
        },
        {
          date: "2018-09-01",
          value: 2.2
        },
        {
          date: "2018-10-01",
          value: 2.13
        },
        {
          date: "2018-11-01",
          value: 2.22
        },
        {
          date: "2018-12-01",
          value: 2.25
        },
        {
          date: "2019-01-01",
          value: 2.18
        },
        {
          date: "2019-02-01",
          value: 2.14
        },
        {
          date: "2019-03-01",
          value: 2.07
        },
        {
          date: "2019-04-01",
          value: 2.09
        },
        {
          date: "2019-05-01",
          value: 1.97
        },
        {
          date: "2019-06-01",
          value: 2.07
        },
        {
          date: "2019-07-01",
          value: 2.17
        },
        {
          date: "2019-08-01",
          value: 2.32
        },
        {
          date: "2019-09-01",
          value: 2.33
        },
        {
          date: "2019-10-01",
          value: 2.34
        },
        {
          date: "2019-11-01",
          value: 2.35
        },
        {
          date: "2019-12-01",
          value: 2.29
        },
        {
          date: "2020-01-01",
          value: 2.28
        },
        {
          date: "2020-02-01",
          value: 2.37
        },
        {
          date: "2020-03-01",
          value: 2.1
        },
        {
          date: "2020-04-01",
          value: 1.43
        },
        {
          date: "2020-05-01",
          value: 1.22
        },
        {
          date: "2020-06-01",
          value: 1.18
        },
        {
          date: "2020-07-01",
          value: 1.56
        },
        {
          date: "2020-08-01",
          value: 1.72
        },
        {
          date: "2020-09-01",
          value: 1.72
        },
        {
          date: "2020-10-01",
          value: 1.64
        },
        {
          date: "2020-11-01",
          value: 1.67
        },
        {
          date: "2020-12-01",
          value: 1.62
        },
        {
          date: "2021-01-01",
          value: 1.38
        },
        {
          date: "2021-02-01",
          value: 1.28
        },
        {
          date: "2021-03-01",
          value: 1.65
        },
        {
          date: "2021-04-01",
          value: 2.98
        },
        {
          date: "2021-05-01",
          value: 3.79
        },
        {
          date: "2021-06-01",
          value: 4.44
        },
        {
          date: "2021-07-01",
          value: 4.21
        },
        {
          date: "2021-08-01",
          value: 3.94
        },
        {
          date: "2021-09-01",
          value: 4
        },
        {
          date: "2021-10-01",
          value: 4.59
        },
        {
          date: "2021-11-01",
          value: 4.97
        },
        {
          date: "2021-12-01",
          value: 5.49
        },
        {
          date: "2022-01-01",
          value: 6.05
        },
        {
          date: "2022-02-01",
          value: 6.46
        },
        {
          date: "2022-03-01",
          value: 6.48
        },
        {
          date: "2022-04-01",
          value: 6.16
        },
        {
          date: "2022-05-01",
          value: 6.03
        },
        {
          date: "2022-06-01",
          value: 5.91
        },
        {
          date: "2022-07-01",
          value: 5.9
        },
        {
          date: "2022-08-01",
          value: 6.29
        },
        {
          date: "2022-09-01",
          value: 6.62
        },
        {
          date: "2022-10-01",
          value: 6.29
        },
        {
          date: "2022-11-01",
          value: 5.97
        },
        {
          date: "2022-12-01",
          value: 5.69
        },
        {
          date: "2023-01-01",
          value: 5.54
        },
        {
          date: "2023-02-01",
          value: 5.5
        },
        {
          date: "2023-03-01",
          value: 5.57
        },
        {
          date: "2023-04-01",
          value: 5.51
        },
        {
          date: "2023-05-01",
          value: 5.34
        },
        {
          date: "2023-06-01",
          value: 4.85
        },
        {
          date: "2023-07-01",
          value: 4.7
        },
        {
          date: "2023-08-01",
          value: 4.4
        },
        {
          date: "2023-09-01",
          value: 4.13
        },
        {
          date: "2023-10-01",
          value: 4.03
        },
        {
          date: "2023-11-01",
          value: 4.02
        },
        {
          date: "2023-12-01",
          value: 3.92
        },
        {
          date: "2024-01-01",
          value: 3.86
        },
        {
          date: "2024-02-01",
          value: 3.76
        },
        {
          date: "2024-03-01",
          value: 3.82
        },
        {
          date: "2024-04-01",
          value: 3.63
        },
        {
          date: "2024-05-01",
          value: 3.39
        },
        {
          date: "2024-06-01",
          value: 3.27
        },
        {
          date: "2024-07-01",
          value: 3.23
        },
        {
          date: "2024-08-01",
          value: 3.29
        },
        {
          date: "2024-09-01",
          value: 3.28
        },
        {
          date: "2024-10-01",
          value: 3.3
        },
        {
          date: "2024-11-01",
          value: 3.29
        },
        {
          date: "2024-12-01",
          value: 3.21
        },
        {
          date: "2025-01-01",
          value: 3.28
        },
        {
          date: "2025-02-01",
          value: 3.14
        },
        {
          date: "2025-03-01",
          value: 2.81
        },
        {
          date: "2025-04-01",
          value: 2.78
        },
        {
          date: "2025-05-01",
          value: 2.8
        },
        {
          date: "2025-06-01",
          value: 2.9
        },
        {
          date: "2025-07-01",
          value: 3.1
        },
        {
          date: "2025-08-01",
          value: 3.1
        },
        {
          date: "2025-09-01",
          value: 3.02
        },
        {
          date: "2025-11-01",
          value: 2.6
        },
        {
          date: "2025-12-01",
          value: 2.6
        },
        {
          date: "2026-01-01",
          value: 2.5
        },
        {
          date: "2026-02-01",
          value: 2.5
        },
        {
          date: "2026-03-01",
          value: 2.6
        },
        {
          date: "2026-04-01",
          value: 2.8
        },
        {
          date: "2026-05-01",
          value: 2.9
        },
        {
          date: "2026-06-01",
          value: 2.6
        },
        {
          date: "2026-07-01",
          value: 2.5
        }
      ]
    },
    ppi: {
      id: "ppi",
      fred: "PPIACO",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: 4.7
      },
      points: [
        {
          date: "2016-08-01",
          value: -2.76
        },
        {
          date: "2016-09-01",
          value: -1.16
        },
        {
          date: "2016-10-01",
          value: -0.43
        },
        {
          date: "2016-11-01",
          value: 0.32
        },
        {
          date: "2016-12-01",
          value: 2.56
        },
        {
          date: "2017-01-01",
          value: 4.44
        },
        {
          date: "2017-02-01",
          value: 5.68
        },
        {
          date: "2017-03-01",
          value: 5.16
        },
        {
          date: "2017-04-01",
          value: 5.35
        },
        {
          date: "2017-05-01",
          value: 4.05
        },
        {
          date: "2017-06-01",
          value: 3.2
        },
        {
          date: "2017-07-01",
          value: 3.09
        },
        {
          date: "2017-08-01",
          value: 3.86
        },
        {
          date: "2017-09-01",
          value: 4.23
        },
        {
          date: "2017-10-01",
          value: 4.39
        },
        {
          date: "2017-11-01",
          value: 5.15
        },
        {
          date: "2017-12-01",
          value: 4.3
        },
        {
          date: "2018-01-01",
          value: 3.78
        },
        {
          date: "2018-02-01",
          value: 4.02
        },
        {
          date: "2018-03-01",
          value: 4.07
        },
        {
          date: "2018-04-01",
          value: 3.78
        },
        {
          date: "2018-05-01",
          value: 5.39
        },
        {
          date: "2018-06-01",
          value: 5.48
        },
        {
          date: "2018-07-01",
          value: 5.58
        },
        {
          date: "2018-08-01",
          value: 4.95
        },
        {
          date: "2018-09-01",
          value: 4.52
        },
        {
          date: "2018-10-01",
          value: 4.98
        },
        {
          date: "2018-11-01",
          value: 3.27
        },
        {
          date: "2018-12-01",
          value: 2.39
        },
        {
          date: "2019-01-01",
          value: 0.61
        },
        {
          date: "2019-02-01",
          value: -0.05
        },
        {
          date: "2019-03-01",
          value: 0.75
        },
        {
          date: "2019-04-01",
          value: 0.9
        },
        {
          date: "2019-05-01",
          value: -0.74
        },
        {
          date: "2019-06-01",
          value: -1.91
        },
        {
          date: "2019-07-01",
          value: -1.76
        },
        {
          date: "2019-08-01",
          value: -2.06
        },
        {
          date: "2019-09-01",
          value: -2.55
        },
        {
          date: "2019-10-01",
          value: -2.93
        },
        {
          date: "2019-11-01",
          value: -1.63
        },
        {
          date: "2019-12-01",
          value: -1
        },
        {
          date: "2020-01-01",
          value: 0.1
        },
        {
          date: "2020-02-01",
          value: -1.26
        },
        {
          date: "2020-03-01",
          value: -3.83
        },
        {
          date: "2020-04-01",
          value: -8.21
        },
        {
          date: "2020-05-01",
          value: -6.49
        },
        {
          date: "2020-06-01",
          value: -4.54
        },
        {
          date: "2020-07-01",
          value: -3.84
        },
        {
          date: "2020-08-01",
          value: -2.46
        },
        {
          date: "2020-09-01",
          value: -1.46
        },
        {
          date: "2020-10-01",
          value: -1.06
        },
        {
          date: "2020-11-01",
          value: -0.35
        },
        {
          date: "2020-12-01",
          value: 0.75
        },
        {
          date: "2021-01-01",
          value: 2.76
        },
        {
          date: "2021-02-01",
          value: 7.07
        },
        {
          date: "2021-03-01",
          value: 11.34
        },
        {
          date: "2021-04-01",
          value: 17.47
        },
        {
          date: "2021-05-01",
          value: 19.25
        },
        {
          date: "2021-06-01",
          value: 19.72
        },
        {
          date: "2021-07-01",
          value: 20.13
        },
        {
          date: "2021-08-01",
          value: 20.13
        },
        {
          date: "2021-09-01",
          value: 20.55
        },
        {
          date: "2021-10-01",
          value: 22.37
        },
        {
          date: "2021-11-01",
          value: 22.69
        },
        {
          date: "2021-12-01",
          value: 20.37
        },
        {
          date: "2022-01-01",
          value: 20.34
        },
        {
          date: "2022-02-01",
          value: 19.97
        },
        {
          date: "2022-03-01",
          value: 20.94
        },
        {
          date: "2022-04-01",
          value: 21.76
        },
        {
          date: "2022-05-01",
          value: 21.5
        },
        {
          date: "2022-06-01",
          value: 22.43
        },
        {
          date: "2022-07-01",
          value: 17.44
        },
        {
          date: "2022-08-01",
          value: 15.48
        },
        {
          date: "2022-09-01",
          value: 13.67
        },
        {
          date: "2022-10-01",
          value: 10.23
        },
        {
          date: "2022-11-01",
          value: 8.17
        },
        {
          date: "2022-12-01",
          value: 6.86
        },
        {
          date: "2023-01-01",
          value: 5.59
        },
        {
          date: "2023-02-01",
          value: 2.38
        },
        {
          date: "2023-03-01",
          value: -1.14
        },
        {
          date: "2023-04-01",
          value: -3.17
        },
        {
          date: "2023-05-01",
          value: -7.17
        },
        {
          date: "2023-06-01",
          value: -9.42
        },
        {
          date: "2023-07-01",
          value: -6.77
        },
        {
          date: "2023-08-01",
          value: -4.4
        },
        {
          date: "2023-09-01",
          value: -3.35
        },
        {
          date: "2023-10-01",
          value: -3.72
        },
        {
          date: "2023-11-01",
          value: -3.91
        },
        {
          date: "2023-12-01",
          value: -3.11
        },
        {
          date: "2024-01-01",
          value: -3.43
        },
        {
          date: "2024-02-01",
          value: -1.45
        },
        {
          date: "2024-03-01",
          value: -0.77
        },
        {
          date: "2024-04-01",
          value: 0.03
        },
        {
          date: "2024-05-01",
          value: 0.65
        },
        {
          date: "2024-06-01",
          value: 0.81
        },
        {
          date: "2024-07-01",
          value: 1.37
        },
        {
          date: "2024-08-01",
          value: -0.86
        },
        {
          date: "2024-09-01",
          value: -2.41
        },
        {
          date: "2024-10-01",
          value: -0.83
        },
        {
          date: "2024-11-01",
          value: 0.14
        },
        {
          date: "2024-12-01",
          value: 1.42
        },
        {
          date: "2025-01-01",
          value: 2.41
        },
        {
          date: "2025-02-01",
          value: 1.79
        },
        {
          date: "2025-03-01",
          value: 1.34
        },
        {
          date: "2025-04-01",
          value: 0.55
        },
        {
          date: "2025-05-01",
          value: 1.32
        },
        {
          date: "2025-06-01",
          value: 1.79
        },
        {
          date: "2025-07-01",
          value: 1.96
        },
        {
          date: "2025-08-01",
          value: 2.6
        },
        {
          date: "2025-09-01",
          value: 3.71
        },
        {
          date: "2025-10-01",
          value: 2.97
        },
        {
          date: "2025-11-01",
          value: 3.44
        },
        {
          date: "2025-12-01",
          value: 3
        },
        {
          date: "2026-01-01",
          value: 2.43
        },
        {
          date: "2026-02-01",
          value: 3.87
        },
        {
          date: "2026-03-01",
          value: 6.8
        },
        {
          date: "2026-04-01",
          value: 6
        },
        {
          date: "2026-05-01",
          value: 6.5
        },
        {
          date: "2026-06-01",
          value: 5.5
        },
        {
          date: "2026-07-01",
          value: 4.7
        }
      ]
    },
    corepce: {
      id: "corepce",
      fred: "PCEPILFE",
      mode: "mom_pct",
      unit: "%",
      updated: "2026-08-29T10:40:41.942Z",
      last: {
        date: "2026-07-01",
        value: 0.2
      },
      points: [
        {
          date: "2016-08-01",
          value: 0.18
        },
        {
          date: "2016-09-01",
          value: 0.13
        },
        {
          date: "2016-10-01",
          value: 0.13
        },
        {
          date: "2016-11-01",
          value: 0.04
        },
        {
          date: "2016-12-01",
          value: 0.12
        },
        {
          date: "2017-01-01",
          value: 0.27
        },
        {
          date: "2017-02-01",
          value: 0.18
        },
        {
          date: "2017-03-01",
          value: -0.04
        },
        {
          date: "2017-04-01",
          value: 0.2
        },
        {
          date: "2017-05-01",
          value: 0.08
        },
        {
          date: "2017-06-01",
          value: 0.13
        },
        {
          date: "2017-07-01",
          value: 0.07
        },
        {
          date: "2017-08-01",
          value: 0.11
        },
        {
          date: "2017-09-01",
          value: 0.12
        },
        {
          date: "2017-10-01",
          value: 0.25
        },
        {
          date: "2017-11-01",
          value: 0.05
        },
        {
          date: "2017-12-01",
          value: 0.15
        },
        {
          date: "2018-01-01",
          value: 0.32
        },
        {
          date: "2018-02-01",
          value: 0.19
        },
        {
          date: "2018-03-01",
          value: 0.22
        },
        {
          date: "2018-04-01",
          value: 0.18
        },
        {
          date: "2018-05-01",
          value: 0.18
        },
        {
          date: "2018-06-01",
          value: 0.09
        },
        {
          date: "2018-07-01",
          value: 0.13
        },
        {
          date: "2018-08-01",
          value: 0.01
        },
        {
          date: "2018-09-01",
          value: 0.19
        },
        {
          date: "2018-10-01",
          value: 0.16
        },
        {
          date: "2018-11-01",
          value: 0.19
        },
        {
          date: "2018-12-01",
          value: 0.17
        },
        {
          date: "2019-01-01",
          value: 0.13
        },
        {
          date: "2019-02-01",
          value: 0.09
        },
        {
          date: "2019-03-01",
          value: 0.09
        },
        {
          date: "2019-04-01",
          value: 0.2
        },
        {
          date: "2019-05-01",
          value: 0.1
        },
        {
          date: "2019-06-01",
          value: 0.18
        },
        {
          date: "2019-07-01",
          value: 0.11
        },
        {
          date: "2019-08-01",
          value: 0.11
        },
        {
          date: "2019-09-01",
          value: 0.07
        },
        {
          date: "2019-10-01",
          value: 0.15
        },
        {
          date: "2019-11-01",
          value: 0.06
        },
        {
          date: "2019-12-01",
          value: 0.22
        },
        {
          date: "2020-01-01",
          value: 0.18
        },
        {
          date: "2020-02-01",
          value: 0.2
        },
        {
          date: "2020-03-01",
          value: -0.08
        },
        {
          date: "2020-04-01",
          value: -0.32
        },
        {
          date: "2020-05-01",
          value: 0.1
        },
        {
          date: "2020-06-01",
          value: 0.16
        },
        {
          date: "2020-07-01",
          value: 0.36
        },
        {
          date: "2020-08-01",
          value: 0.29
        },
        {
          date: "2020-09-01",
          value: 0.16
        },
        {
          date: "2020-10-01",
          value: 0.09
        },
        {
          date: "2020-11-01",
          value: 0.09
        },
        {
          date: "2020-12-01",
          value: 0.28
        },
        {
          date: "2021-01-01",
          value: 0.36
        },
        {
          date: "2021-02-01",
          value: 0.21
        },
        {
          date: "2021-03-01",
          value: 0.41
        },
        {
          date: "2021-04-01",
          value: 0.58
        },
        {
          date: "2021-05-01",
          value: 0.5
        },
        {
          date: "2021-06-01",
          value: 0.47
        },
        {
          date: "2021-07-01",
          value: 0.42
        },
        {
          date: "2021-08-01",
          value: 0.32
        },
        {
          date: "2021-09-01",
          value: 0.21
        },
        {
          date: "2021-10-01",
          value: 0.5
        },
        {
          date: "2021-11-01",
          value: 0.53
        },
        {
          date: "2021-12-01",
          value: 0.58
        },
        {
          date: "2022-01-01",
          value: 0.5
        },
        {
          date: "2022-02-01",
          value: 0.44
        },
        {
          date: "2022-03-01",
          value: 0.4
        },
        {
          date: "2022-04-01",
          value: 0.35
        },
        {
          date: "2022-05-01",
          value: 0.35
        },
        {
          date: "2022-06-01",
          value: 0.59
        },
        {
          date: "2022-07-01",
          value: 0.22
        },
        {
          date: "2022-08-01",
          value: 0.57
        },
        {
          date: "2022-09-01",
          value: 0.44
        },
        {
          date: "2022-10-01",
          value: 0.36
        },
        {
          date: "2022-11-01",
          value: 0.29
        },
        {
          date: "2022-12-01",
          value: 0.35
        },
        {
          date: "2023-01-01",
          value: 0.47
        },
        {
          date: "2023-02-01",
          value: 0.36
        },
        {
          date: "2023-03-01",
          value: 0.33
        },
        {
          date: "2023-04-01",
          value: 0.35
        },
        {
          date: "2023-05-01",
          value: 0.29
        },
        {
          date: "2023-06-01",
          value: 0.26
        },
        {
          date: "2023-07-01",
          value: 0.14
        },
        {
          date: "2023-08-01",
          value: 0.11
        },
        {
          date: "2023-09-01",
          value: 0.31
        },
        {
          date: "2023-10-01",
          value: 0.15
        },
        {
          date: "2023-11-01",
          value: 0.11
        },
        {
          date: "2023-12-01",
          value: 0.18
        },
        {
          date: "2024-01-01",
          value: 0.52
        },
        {
          date: "2024-02-01",
          value: 0.26
        },
        {
          date: "2024-03-01",
          value: 0.39
        },
        {
          date: "2024-04-01",
          value: 0.24
        },
        {
          date: "2024-05-01",
          value: 0.06
        },
        {
          date: "2024-06-01",
          value: 0.24
        },
        {
          date: "2024-07-01",
          value: 0.19
        },
        {
          date: "2024-08-01",
          value: 0.18
        },
        {
          date: "2024-09-01",
          value: 0.27
        },
        {
          date: "2024-10-01",
          value: 0.3
        },
        {
          date: "2024-11-01",
          value: 0.1
        },
        {
          date: "2024-12-01",
          value: 0.19
        },
        {
          date: "2025-01-01",
          value: 0.31
        },
        {
          date: "2025-02-01",
          value: 0.45
        },
        {
          date: "2025-03-01",
          value: 0.1
        },
        {
          date: "2025-04-01",
          value: 0.19
        },
        {
          date: "2025-05-01",
          value: 0.23
        },
        {
          date: "2025-06-01",
          value: 0.26
        },
        {
          date: "2025-07-01",
          value: 0.25
        },
        {
          date: "2025-08-01",
          value: 0.22
        },
        {
          date: "2025-09-01",
          value: 0.19
        },
        {
          date: "2025-10-01",
          value: 0.23
        },
        {
          date: "2025-11-01",
          value: 0.18
        },
        {
          date: "2025-12-01",
          value: 0.33
        },
        {
          date: "2026-01-01",
          value: 0.44
        },
        {
          date: "2026-02-01",
          value: 0.39
        },
        {
          date: "2026-03-01",
          value: 0.3
        },
        {
          date: "2026-04-01",
          value: 0.5
        },
        {
          date: "2026-05-01",
          value: 0.3
        },
        {
          date: "2026-06-01",
          value: 0.1
        },
        {
          date: "2026-07-01",
          value: 0.2
        }
      ]
    },
    ahe: {
      id: "ahe",
      fred: "CES0500000003",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: 3.15
      },
      points: [
        {
          date: "2016-08-01",
          value: 2.43
        },
        {
          date: "2016-09-01",
          value: 2.63
        },
        {
          date: "2016-10-01",
          value: 2.78
        },
        {
          date: "2016-11-01",
          value: 2.57
        },
        {
          date: "2016-12-01",
          value: 2.69
        },
        {
          date: "2017-01-01",
          value: 2.48
        },
        {
          date: "2017-02-01",
          value: 2.72
        },
        {
          date: "2017-03-01",
          value: 2.59
        },
        {
          date: "2017-04-01",
          value: 2.55
        },
        {
          date: "2017-05-01",
          value: 2.46
        },
        {
          date: "2017-06-01",
          value: 2.5
        },
        {
          date: "2017-07-01",
          value: 2.57
        },
        {
          date: "2017-08-01",
          value: 2.57
        },
        {
          date: "2017-09-01",
          value: 2.79
        },
        {
          date: "2017-10-01",
          value: 2.32
        },
        {
          date: "2017-11-01",
          value: 2.47
        },
        {
          date: "2017-12-01",
          value: 2.7
        },
        {
          date: "2018-01-01",
          value: 2.77
        },
        {
          date: "2018-02-01",
          value: 2.57
        },
        {
          date: "2018-03-01",
          value: 2.83
        },
        {
          date: "2018-04-01",
          value: 2.79
        },
        {
          date: "2018-05-01",
          value: 2.94
        },
        {
          date: "2018-06-01",
          value: 2.93
        },
        {
          date: "2018-07-01",
          value: 2.85
        },
        {
          date: "2018-08-01",
          value: 3.19
        },
        {
          date: "2018-09-01",
          value: 3.13
        },
        {
          date: "2018-10-01",
          value: 3.28
        },
        {
          date: "2018-11-01",
          value: 3.39
        },
        {
          date: "2018-12-01",
          value: 3.49
        },
        {
          date: "2019-01-01",
          value: 3.26
        },
        {
          date: "2019-02-01",
          value: 3.55
        },
        {
          date: "2019-03-01",
          value: 3.43
        },
        {
          date: "2019-04-01",
          value: 3.27
        },
        {
          date: "2019-05-01",
          value: 3.34
        },
        {
          date: "2019-06-01",
          value: 3.48
        },
        {
          date: "2019-07-01",
          value: 3.43
        },
        {
          date: "2019-08-01",
          value: 3.42
        },
        {
          date: "2019-09-01",
          value: 3.07
        },
        {
          date: "2019-10-01",
          value: 3.18
        },
        {
          date: "2019-11-01",
          value: 3.28
        },
        {
          date: "2019-12-01",
          value: 2.98
        },
        {
          date: "2020-01-01",
          value: 3.04
        },
        {
          date: "2020-02-01",
          value: 3.07
        },
        {
          date: "2020-03-01",
          value: 3.46
        },
        {
          date: "2020-04-01",
          value: 8.1
        },
        {
          date: "2020-05-01",
          value: 6.6
        },
        {
          date: "2020-06-01",
          value: 5.04
        },
        {
          date: "2020-07-01",
          value: 4.85
        },
        {
          date: "2020-08-01",
          value: 4.8
        },
        {
          date: "2020-09-01",
          value: 4.79
        },
        {
          date: "2020-10-01",
          value: 4.6
        },
        {
          date: "2020-11-01",
          value: 4.59
        },
        {
          date: "2020-12-01",
          value: 5.39
        },
        {
          date: "2021-01-01",
          value: 5.28
        },
        {
          date: "2021-02-01",
          value: 5.29
        },
        {
          date: "2021-03-01",
          value: 4.52
        },
        {
          date: "2021-04-01",
          value: 0.6
        },
        {
          date: "2021-05-01",
          value: 2.32
        },
        {
          date: "2021-06-01",
          value: 3.95
        },
        {
          date: "2021-07-01",
          value: 4.32
        },
        {
          date: "2021-08-01",
          value: 4.37
        },
        {
          date: "2021-09-01",
          value: 4.98
        },
        {
          date: "2021-10-01",
          value: 5.42
        },
        {
          date: "2021-11-01",
          value: 5.36
        },
        {
          date: "2021-12-01",
          value: 4.95
        },
        {
          date: "2022-01-01",
          value: 5.58
        },
        {
          date: "2022-02-01",
          value: 5.29
        },
        {
          date: "2022-03-01",
          value: 5.89
        },
        {
          date: "2022-04-01",
          value: 5.76
        },
        {
          date: "2022-05-01",
          value: 5.56
        },
        {
          date: "2022-06-01",
          value: 5.4
        },
        {
          date: "2022-07-01",
          value: 5.48
        },
        {
          date: "2022-08-01",
          value: 5.39
        },
        {
          date: "2022-09-01",
          value: 5.13
        },
        {
          date: "2022-10-01",
          value: 5.01
        },
        {
          date: "2022-11-01",
          value: 5.09
        },
        {
          date: "2022-12-01",
          value: 4.94
        },
        {
          date: "2023-01-01",
          value: 4.49
        },
        {
          date: "2023-02-01",
          value: 4.77
        },
        {
          date: "2023-03-01",
          value: 4.62
        },
        {
          date: "2023-04-01",
          value: 4.6
        },
        {
          date: "2023-05-01",
          value: 4.36
        },
        {
          date: "2023-06-01",
          value: 4.66
        },
        {
          date: "2023-07-01",
          value: 4.67
        },
        {
          date: "2023-08-01",
          value: 4.47
        },
        {
          date: "2023-09-01",
          value: 4.42
        },
        {
          date: "2023-10-01",
          value: 4.22
        },
        {
          date: "2023-11-01",
          value: 4.11
        },
        {
          date: "2023-12-01",
          value: 4.1
        },
        {
          date: "2024-01-01",
          value: 4.39
        },
        {
          date: "2024-02-01",
          value: 4.13
        },
        {
          date: "2024-03-01",
          value: 4.15
        },
        {
          date: "2024-04-01",
          value: 3.98
        },
        {
          date: "2024-05-01",
          value: 4.15
        },
        {
          date: "2024-06-01",
          value: 3.92
        },
        {
          date: "2024-07-01",
          value: 3.63
        },
        {
          date: "2024-08-01",
          value: 3.92
        },
        {
          date: "2024-09-01",
          value: 3.91
        },
        {
          date: "2024-10-01",
          value: 4.05
        },
        {
          date: "2024-11-01",
          value: 4.18
        },
        {
          date: "2024-12-01",
          value: 4.08
        },
        {
          date: "2025-01-01",
          value: 3.97
        },
        {
          date: "2025-02-01",
          value: 4.11
        },
        {
          date: "2025-03-01",
          value: 4.21
        },
        {
          date: "2025-04-01",
          value: 3.91
        },
        {
          date: "2025-05-01",
          value: 3.98
        },
        {
          date: "2025-06-01",
          value: 3.7
        },
        {
          date: "2025-07-01",
          value: 3.96
        },
        {
          date: "2025-08-01",
          value: 3.98
        },
        {
          date: "2025-09-01",
          value: 3.85
        },
        {
          date: "2025-10-01",
          value: 3.92
        },
        {
          date: "2025-11-01",
          value: 3.93
        },
        {
          date: "2025-12-01",
          value: 3.8
        },
        {
          date: "2026-01-01",
          value: 3.7
        },
        {
          date: "2026-02-01",
          value: 3.7
        },
        {
          date: "2026-03-01",
          value: 3.43
        },
        {
          date: "2026-04-01",
          value: 3.6
        },
        {
          date: "2026-05-01",
          value: 3.34
        },
        {
          date: "2026-06-01",
          value: 3.5
        },
        {
          date: "2026-07-01",
          value: 3.15
        }
      ]
    },
    fedfunds: {
      id: "fedfunds",
      fred: "DFEDTARU",
      mode: "level",
      unit: "%",
      updated: "2026-08-29T10:40:43.716Z",
      last: {
        date: "2026-08-01",
        value: 3.75
      },
      points: [
        {
          date: "2016-09-01",
          value: 0.5
        },
        {
          date: "2016-10-01",
          value: 0.5
        },
        {
          date: "2016-11-01",
          value: 0.5
        },
        {
          date: "2016-12-01",
          value: 0.65
        },
        {
          date: "2017-01-01",
          value: 0.75
        },
        {
          date: "2017-02-01",
          value: 0.75
        },
        {
          date: "2017-03-01",
          value: 0.88
        },
        {
          date: "2017-04-01",
          value: 1
        },
        {
          date: "2017-05-01",
          value: 1
        },
        {
          date: "2017-06-01",
          value: 1.13
        },
        {
          date: "2017-07-01",
          value: 1.25
        },
        {
          date: "2017-08-01",
          value: 1.25
        },
        {
          date: "2017-09-01",
          value: 1.25
        },
        {
          date: "2017-10-01",
          value: 1.25
        },
        {
          date: "2017-11-01",
          value: 1.25
        },
        {
          date: "2017-12-01",
          value: 1.4
        },
        {
          date: "2018-01-01",
          value: 1.5
        },
        {
          date: "2018-02-01",
          value: 1.5
        },
        {
          date: "2018-03-01",
          value: 1.58
        },
        {
          date: "2018-04-01",
          value: 1.75
        },
        {
          date: "2018-05-01",
          value: 1.75
        },
        {
          date: "2018-06-01",
          value: 1.89
        },
        {
          date: "2018-07-01",
          value: 2
        },
        {
          date: "2018-08-01",
          value: 2
        },
        {
          date: "2018-09-01",
          value: 2.03
        },
        {
          date: "2018-10-01",
          value: 2.25
        },
        {
          date: "2018-11-01",
          value: 2.25
        },
        {
          date: "2018-12-01",
          value: 2.35
        },
        {
          date: "2019-01-01",
          value: 2.5
        },
        {
          date: "2019-02-01",
          value: 2.5
        },
        {
          date: "2019-03-01",
          value: 2.5
        },
        {
          date: "2019-04-01",
          value: 2.5
        },
        {
          date: "2019-05-01",
          value: 2.5
        },
        {
          date: "2019-06-01",
          value: 2.5
        },
        {
          date: "2019-07-01",
          value: 2.5
        },
        {
          date: "2019-08-01",
          value: 2.25
        },
        {
          date: "2019-09-01",
          value: 2.15
        },
        {
          date: "2019-10-01",
          value: 1.99
        },
        {
          date: "2019-11-01",
          value: 1.75
        },
        {
          date: "2019-12-01",
          value: 1.75
        },
        {
          date: "2020-01-01",
          value: 1.75
        },
        {
          date: "2020-02-01",
          value: 1.75
        },
        {
          date: "2020-03-01",
          value: 0.78
        },
        {
          date: "2020-04-01",
          value: 0.25
        },
        {
          date: "2020-05-01",
          value: 0.25
        },
        {
          date: "2020-06-01",
          value: 0.25
        },
        {
          date: "2020-07-01",
          value: 0.25
        },
        {
          date: "2020-08-01",
          value: 0.25
        },
        {
          date: "2020-09-01",
          value: 0.25
        },
        {
          date: "2020-10-01",
          value: 0.25
        },
        {
          date: "2020-11-01",
          value: 0.25
        },
        {
          date: "2020-12-01",
          value: 0.25
        },
        {
          date: "2021-01-01",
          value: 0.25
        },
        {
          date: "2021-02-01",
          value: 0.25
        },
        {
          date: "2021-03-01",
          value: 0.25
        },
        {
          date: "2021-04-01",
          value: 0.25
        },
        {
          date: "2021-05-01",
          value: 0.25
        },
        {
          date: "2021-06-01",
          value: 0.25
        },
        {
          date: "2021-07-01",
          value: 0.25
        },
        {
          date: "2021-08-01",
          value: 0.25
        },
        {
          date: "2021-09-01",
          value: 0.25
        },
        {
          date: "2021-10-01",
          value: 0.25
        },
        {
          date: "2021-11-01",
          value: 0.25
        },
        {
          date: "2021-12-01",
          value: 0.25
        },
        {
          date: "2022-01-01",
          value: 0.25
        },
        {
          date: "2022-02-01",
          value: 0.25
        },
        {
          date: "2022-03-01",
          value: 0.37
        },
        {
          date: "2022-04-01",
          value: 0.5
        },
        {
          date: "2022-05-01",
          value: 0.94
        },
        {
          date: "2022-06-01",
          value: 1.38
        },
        {
          date: "2022-07-01",
          value: 1.85
        },
        {
          date: "2022-08-01",
          value: 2.5
        },
        {
          date: "2022-09-01",
          value: 2.73
        },
        {
          date: "2022-10-01",
          value: 3.25
        },
        {
          date: "2022-11-01",
          value: 3.95
        },
        {
          date: "2022-12-01",
          value: 4.27
        },
        {
          date: "2023-01-01",
          value: 4.5
        },
        {
          date: "2023-02-01",
          value: 4.74
        },
        {
          date: "2023-03-01",
          value: 4.82
        },
        {
          date: "2023-04-01",
          value: 5
        },
        {
          date: "2023-05-01",
          value: 5.23
        },
        {
          date: "2023-06-01",
          value: 5.25
        },
        {
          date: "2023-07-01",
          value: 5.29
        },
        {
          date: "2023-08-01",
          value: 5.5
        },
        {
          date: "2023-09-01",
          value: 5.5
        },
        {
          date: "2023-10-01",
          value: 5.5
        },
        {
          date: "2023-11-01",
          value: 5.5
        },
        {
          date: "2023-12-01",
          value: 5.5
        },
        {
          date: "2024-01-01",
          value: 5.5
        },
        {
          date: "2024-02-01",
          value: 5.5
        },
        {
          date: "2024-03-01",
          value: 5.5
        },
        {
          date: "2024-04-01",
          value: 5.5
        },
        {
          date: "2024-05-01",
          value: 5.5
        },
        {
          date: "2024-06-01",
          value: 5.5
        },
        {
          date: "2024-07-01",
          value: 5.5
        },
        {
          date: "2024-08-01",
          value: 5.5
        },
        {
          date: "2024-09-01",
          value: 5.3
        },
        {
          date: "2024-10-01",
          value: 5
        },
        {
          date: "2024-11-01",
          value: 4.81
        },
        {
          date: "2024-12-01",
          value: 4.65
        },
        {
          date: "2025-01-01",
          value: 4.5
        },
        {
          date: "2025-02-01",
          value: 4.5
        },
        {
          date: "2025-03-01",
          value: 4.5
        },
        {
          date: "2025-04-01",
          value: 4.5
        },
        {
          date: "2025-05-01",
          value: 4.5
        },
        {
          date: "2025-06-01",
          value: 4.5
        },
        {
          date: "2025-07-01",
          value: 4.5
        },
        {
          date: "2025-08-01",
          value: 4.5
        },
        {
          date: "2025-09-01",
          value: 4.39
        },
        {
          date: "2025-10-01",
          value: 4.23
        },
        {
          date: "2025-11-01",
          value: 4
        },
        {
          date: "2025-12-01",
          value: 3.83
        },
        {
          date: "2026-01-01",
          value: 3.75
        },
        {
          date: "2026-02-01",
          value: 3.75
        },
        {
          date: "2026-03-01",
          value: 3.75
        },
        {
          date: "2026-04-01",
          value: 3.75
        },
        {
          date: "2026-05-01",
          value: 3.75
        },
        {
          date: "2026-06-01",
          value: 3.75
        },
        {
          date: "2026-07-01",
          value: 3.75
        },
        {
          date: "2026-08-01",
          value: 3.75
        }
      ]
    },
    dgs10: {
      id: "dgs10",
      fred: "DGS10",
      mode: "level",
      unit: "%",
      updated: "2026-08-29T10:40:45.214Z",
      last: {
        date: "2026-08-01",
        value: 4.68
      },
      points: [
        {
          date: "2016-09-01",
          value: 1.63
        },
        {
          date: "2016-10-01",
          value: 1.76
        },
        {
          date: "2016-11-01",
          value: 2.14
        },
        {
          date: "2016-12-01",
          value: 2.49
        },
        {
          date: "2017-01-01",
          value: 2.43
        },
        {
          date: "2017-02-01",
          value: 2.42
        },
        {
          date: "2017-03-01",
          value: 2.48
        },
        {
          date: "2017-04-01",
          value: 2.3
        },
        {
          date: "2017-05-01",
          value: 2.3
        },
        {
          date: "2017-06-01",
          value: 2.19
        },
        {
          date: "2017-07-01",
          value: 2.32
        },
        {
          date: "2017-08-01",
          value: 2.21
        },
        {
          date: "2017-09-01",
          value: 2.2
        },
        {
          date: "2017-10-01",
          value: 2.36
        },
        {
          date: "2017-11-01",
          value: 2.35
        },
        {
          date: "2017-12-01",
          value: 2.4
        },
        {
          date: "2018-01-01",
          value: 2.58
        },
        {
          date: "2018-02-01",
          value: 2.86
        },
        {
          date: "2018-03-01",
          value: 2.84
        },
        {
          date: "2018-04-01",
          value: 2.87
        },
        {
          date: "2018-05-01",
          value: 2.98
        },
        {
          date: "2018-06-01",
          value: 2.91
        },
        {
          date: "2018-07-01",
          value: 2.89
        },
        {
          date: "2018-08-01",
          value: 2.89
        },
        {
          date: "2018-09-01",
          value: 3
        },
        {
          date: "2018-10-01",
          value: 3.15
        },
        {
          date: "2018-11-01",
          value: 3.12
        },
        {
          date: "2018-12-01",
          value: 2.83
        },
        {
          date: "2019-01-01",
          value: 2.71
        },
        {
          date: "2019-02-01",
          value: 2.68
        },
        {
          date: "2019-03-01",
          value: 2.57
        },
        {
          date: "2019-04-01",
          value: 2.53
        },
        {
          date: "2019-05-01",
          value: 2.4
        },
        {
          date: "2019-06-01",
          value: 2.07
        },
        {
          date: "2019-07-01",
          value: 2.06
        },
        {
          date: "2019-08-01",
          value: 1.63
        },
        {
          date: "2019-09-01",
          value: 1.7
        },
        {
          date: "2019-10-01",
          value: 1.71
        },
        {
          date: "2019-11-01",
          value: 1.81
        },
        {
          date: "2019-12-01",
          value: 1.86
        },
        {
          date: "2020-01-01",
          value: 1.76
        },
        {
          date: "2020-02-01",
          value: 1.5
        },
        {
          date: "2020-03-01",
          value: 0.87
        },
        {
          date: "2020-04-01",
          value: 0.66
        },
        {
          date: "2020-05-01",
          value: 0.67
        },
        {
          date: "2020-06-01",
          value: 0.73
        },
        {
          date: "2020-07-01",
          value: 0.62
        },
        {
          date: "2020-08-01",
          value: 0.65
        },
        {
          date: "2020-09-01",
          value: 0.68
        },
        {
          date: "2020-10-01",
          value: 0.79
        },
        {
          date: "2020-11-01",
          value: 0.87
        },
        {
          date: "2020-12-01",
          value: 0.93
        },
        {
          date: "2021-01-01",
          value: 1.08
        },
        {
          date: "2021-02-01",
          value: 1.26
        },
        {
          date: "2021-03-01",
          value: 1.61
        },
        {
          date: "2021-04-01",
          value: 1.63
        },
        {
          date: "2021-05-01",
          value: 1.62
        },
        {
          date: "2021-06-01",
          value: 1.52
        },
        {
          date: "2021-07-01",
          value: 1.32
        },
        {
          date: "2021-08-01",
          value: 1.28
        },
        {
          date: "2021-09-01",
          value: 1.37
        },
        {
          date: "2021-10-01",
          value: 1.58
        },
        {
          date: "2021-11-01",
          value: 1.56
        },
        {
          date: "2021-12-01",
          value: 1.47
        },
        {
          date: "2022-01-01",
          value: 1.76
        },
        {
          date: "2022-02-01",
          value: 1.93
        },
        {
          date: "2022-03-01",
          value: 2.13
        },
        {
          date: "2022-04-01",
          value: 2.75
        },
        {
          date: "2022-05-01",
          value: 2.9
        },
        {
          date: "2022-06-01",
          value: 3.14
        },
        {
          date: "2022-07-01",
          value: 2.9
        },
        {
          date: "2022-08-01",
          value: 2.9
        },
        {
          date: "2022-09-01",
          value: 3.52
        },
        {
          date: "2022-10-01",
          value: 3.98
        },
        {
          date: "2022-11-01",
          value: 3.89
        },
        {
          date: "2022-12-01",
          value: 3.62
        },
        {
          date: "2023-01-01",
          value: 3.53
        },
        {
          date: "2023-02-01",
          value: 3.75
        },
        {
          date: "2023-03-01",
          value: 3.66
        },
        {
          date: "2023-04-01",
          value: 3.46
        },
        {
          date: "2023-05-01",
          value: 3.57
        },
        {
          date: "2023-06-01",
          value: 3.75
        },
        {
          date: "2023-07-01",
          value: 3.9
        },
        {
          date: "2023-08-01",
          value: 4.17
        },
        {
          date: "2023-09-01",
          value: 4.38
        },
        {
          date: "2023-10-01",
          value: 4.8
        },
        {
          date: "2023-11-01",
          value: 4.5
        },
        {
          date: "2023-12-01",
          value: 4.02
        },
        {
          date: "2024-01-01",
          value: 4.06
        },
        {
          date: "2024-02-01",
          value: 4.21
        },
        {
          date: "2024-03-01",
          value: 4.21
        },
        {
          date: "2024-04-01",
          value: 4.54
        },
        {
          date: "2024-05-01",
          value: 4.48
        },
        {
          date: "2024-06-01",
          value: 4.31
        },
        {
          date: "2024-07-01",
          value: 4.25
        },
        {
          date: "2024-08-01",
          value: 3.87
        },
        {
          date: "2024-09-01",
          value: 3.72
        },
        {
          date: "2024-10-01",
          value: 4.1
        },
        {
          date: "2024-11-01",
          value: 4.36
        },
        {
          date: "2024-12-01",
          value: 4.39
        },
        {
          date: "2025-01-01",
          value: 4.63
        },
        {
          date: "2025-02-01",
          value: 4.45
        },
        {
          date: "2025-03-01",
          value: 4.28
        },
        {
          date: "2025-04-01",
          value: 4.28
        },
        {
          date: "2025-05-01",
          value: 4.42
        },
        {
          date: "2025-06-01",
          value: 4.38
        },
        {
          date: "2025-07-01",
          value: 4.39
        },
        {
          date: "2025-08-01",
          value: 4.26
        },
        {
          date: "2025-09-01",
          value: 4.12
        },
        {
          date: "2025-10-01",
          value: 4.06
        },
        {
          date: "2025-11-01",
          value: 4.09
        },
        {
          date: "2025-12-01",
          value: 4.14
        },
        {
          date: "2026-01-01",
          value: 4.21
        },
        {
          date: "2026-02-01",
          value: 4.13
        },
        {
          date: "2026-03-01",
          value: 4.25
        },
        {
          date: "2026-04-01",
          value: 4.32
        },
        {
          date: "2026-05-01",
          value: 4.48
        },
        {
          date: "2026-06-01",
          value: 4.47
        },
        {
          date: "2026-07-01",
          value: 4.6
        },
        {
          date: "2026-08-01",
          value: 4.68
        }
      ]
    },
    retail: {
      id: "retail",
      fred: "RSXFS",
      mode: "mom_pct",
      unit: "%",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: -0.6
      },
      points: [
        {
          date: "2016-08-01",
          value: -0.06
        },
        {
          date: "2016-09-01",
          value: 0.63
        },
        {
          date: "2016-10-01",
          value: 0.21
        },
        {
          date: "2016-11-01",
          value: -0.24
        },
        {
          date: "2016-12-01",
          value: 1.61
        },
        {
          date: "2017-01-01",
          value: 0.78
        },
        {
          date: "2017-02-01",
          value: -0.03
        },
        {
          date: "2017-03-01",
          value: -0.13
        },
        {
          date: "2017-04-01",
          value: 0.37
        },
        {
          date: "2017-05-01",
          value: -0.62
        },
        {
          date: "2017-06-01",
          value: 0.6
        },
        {
          date: "2017-07-01",
          value: 0.01
        },
        {
          date: "2017-08-01",
          value: 0.12
        },
        {
          date: "2017-09-01",
          value: 2.3
        },
        {
          date: "2017-10-01",
          value: -0.01
        },
        {
          date: "2017-11-01",
          value: 1.01
        },
        {
          date: "2017-12-01",
          value: 0.55
        },
        {
          date: "2018-01-01",
          value: -0.55
        },
        {
          date: "2018-02-01",
          value: 0.54
        },
        {
          date: "2018-03-01",
          value: -0.1
        },
        {
          date: "2018-04-01",
          value: 0.19
        },
        {
          date: "2018-05-01",
          value: 1.51
        },
        {
          date: "2018-06-01",
          value: -0.54
        },
        {
          date: "2018-07-01",
          value: 0.48
        },
        {
          date: "2018-08-01",
          value: -0.01
        },
        {
          date: "2018-09-01",
          value: -0.14
        },
        {
          date: "2018-10-01",
          value: 1.03
        },
        {
          date: "2018-11-01",
          value: 0.62
        },
        {
          date: "2018-12-01",
          value: -2.21
        },
        {
          date: "2019-01-01",
          value: 0.31
        },
        {
          date: "2019-02-01",
          value: 0.22
        },
        {
          date: "2019-03-01",
          value: 1.62
        },
        {
          date: "2019-04-01",
          value: -0.11
        },
        {
          date: "2019-05-01",
          value: 1.09
        },
        {
          date: "2019-06-01",
          value: -0.09
        },
        {
          date: "2019-07-01",
          value: 0.72
        },
        {
          date: "2019-08-01",
          value: 0.72
        },
        {
          date: "2019-09-01",
          value: -0.88
        },
        {
          date: "2019-10-01",
          value: 0.24
        },
        {
          date: "2019-11-01",
          value: 0.77
        },
        {
          date: "2019-12-01",
          value: 0.13
        },
        {
          date: "2020-01-01",
          value: -0.42
        },
        {
          date: "2020-02-01",
          value: 0.04
        },
        {
          date: "2020-03-01",
          value: -6.03
        },
        {
          date: "2020-04-01",
          value: -12.03
        },
        {
          date: "2020-05-01",
          value: 18.27
        },
        {
          date: "2020-06-01",
          value: 6.36
        },
        {
          date: "2020-07-01",
          value: 1.3
        },
        {
          date: "2020-08-01",
          value: 0.39
        },
        {
          date: "2020-09-01",
          value: 1.9
        },
        {
          date: "2020-10-01",
          value: -0.4
        },
        {
          date: "2020-11-01",
          value: -0.56
        },
        {
          date: "2020-12-01",
          value: 1.65
        },
        {
          date: "2021-01-01",
          value: 3.22
        },
        {
          date: "2021-02-01",
          value: -2.55
        },
        {
          date: "2021-03-01",
          value: 10.39
        },
        {
          date: "2021-04-01",
          value: 0.48
        },
        {
          date: "2021-05-01",
          value: -1.03
        },
        {
          date: "2021-06-01",
          value: 0.66
        },
        {
          date: "2021-07-01",
          value: -2.14
        },
        {
          date: "2021-08-01",
          value: 0.73
        },
        {
          date: "2021-09-01",
          value: 0.78
        },
        {
          date: "2021-10-01",
          value: 1.62
        },
        {
          date: "2021-11-01",
          value: 1.05
        },
        {
          date: "2021-12-01",
          value: -0.69
        },
        {
          date: "2022-01-01",
          value: 2.37
        },
        {
          date: "2022-02-01",
          value: 0.63
        },
        {
          date: "2022-03-01",
          value: 1.9
        },
        {
          date: "2022-04-01",
          value: 1.12
        },
        {
          date: "2022-05-01",
          value: -0.19
        },
        {
          date: "2022-06-01",
          value: 0.99
        },
        {
          date: "2022-07-01",
          value: -1.07
        },
        {
          date: "2022-08-01",
          value: 0.33
        },
        {
          date: "2022-09-01",
          value: -0.3
        },
        {
          date: "2022-10-01",
          value: 0.96
        },
        {
          date: "2022-11-01",
          value: -1.48
        },
        {
          date: "2022-12-01",
          value: -1.26
        },
        {
          date: "2023-01-01",
          value: 4.01
        },
        {
          date: "2023-02-01",
          value: -0.98
        },
        {
          date: "2023-03-01",
          value: -1.25
        },
        {
          date: "2023-04-01",
          value: 0.87
        },
        {
          date: "2023-05-01",
          value: 0.41
        },
        {
          date: "2023-06-01",
          value: 0.41
        },
        {
          date: "2023-07-01",
          value: 0.1
        },
        {
          date: "2023-08-01",
          value: 1.01
        },
        {
          date: "2023-09-01",
          value: 0.63
        },
        {
          date: "2023-10-01",
          value: -0.57
        },
        {
          date: "2023-11-01",
          value: -0.33
        },
        {
          date: "2023-12-01",
          value: 0.12
        },
        {
          date: "2024-01-01",
          value: -0.89
        },
        {
          date: "2024-02-01",
          value: 0.72
        },
        {
          date: "2024-03-01",
          value: 0.47
        },
        {
          date: "2024-04-01",
          value: -0.05
        },
        {
          date: "2024-05-01",
          value: 0.79
        },
        {
          date: "2024-06-01",
          value: -0.07
        },
        {
          date: "2024-07-01",
          value: 0.97
        },
        {
          date: "2024-08-01",
          value: -0.37
        },
        {
          date: "2024-09-01",
          value: 0.86
        },
        {
          date: "2024-10-01",
          value: 0.66
        },
        {
          date: "2024-11-01",
          value: 0.58
        },
        {
          date: "2024-12-01",
          value: 0.87
        },
        {
          date: "2025-01-01",
          value: -1.06
        },
        {
          date: "2025-02-01",
          value: 0.24
        },
        {
          date: "2025-03-01",
          value: 1.42
        },
        {
          date: "2025-04-01",
          value: -0.18
        },
        {
          date: "2025-05-01",
          value: -1.24
        },
        {
          date: "2025-06-01",
          value: 0.69
        },
        {
          date: "2025-07-01",
          value: 0.5
        },
        {
          date: "2025-08-01",
          value: 0.57
        },
        {
          date: "2025-09-01",
          value: 0.04
        },
        {
          date: "2025-10-01",
          value: -0.17
        },
        {
          date: "2025-11-01",
          value: 0
        },
        {
          date: "2025-12-01",
          value: 0.6
        },
        {
          date: "2026-01-01",
          value: 0
        },
        {
          date: "2026-02-01",
          value: 0.96
        },
        {
          date: "2026-03-01",
          value: 1.99
        },
        {
          date: "2026-04-01",
          value: 0.62
        },
        {
          date: "2026-05-01",
          value: 0.88
        },
        {
          date: "2026-06-01",
          value: 0.2
        },
        {
          date: "2026-07-01",
          value: -0.6
        }
      ]
    },
    umich: {
      id: "umich",
      fred: "UMCSENT",
      mode: "level",
      unit: "index",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: 51
      },
      points: [
        {
          date: "2016-08-01",
          value: 89.8
        },
        {
          date: "2016-09-01",
          value: 91.2
        },
        {
          date: "2016-10-01",
          value: 87.2
        },
        {
          date: "2016-11-01",
          value: 93.8
        },
        {
          date: "2016-12-01",
          value: 98.2
        },
        {
          date: "2017-01-01",
          value: 98.5
        },
        {
          date: "2017-02-01",
          value: 96.3
        },
        {
          date: "2017-03-01",
          value: 96.9
        },
        {
          date: "2017-04-01",
          value: 97
        },
        {
          date: "2017-05-01",
          value: 97.1
        },
        {
          date: "2017-06-01",
          value: 95
        },
        {
          date: "2017-07-01",
          value: 93.4
        },
        {
          date: "2017-08-01",
          value: 96.8
        },
        {
          date: "2017-09-01",
          value: 95.1
        },
        {
          date: "2017-10-01",
          value: 100.7
        },
        {
          date: "2017-11-01",
          value: 98.5
        },
        {
          date: "2017-12-01",
          value: 95.9
        },
        {
          date: "2018-01-01",
          value: 95.7
        },
        {
          date: "2018-02-01",
          value: 99.7
        },
        {
          date: "2018-03-01",
          value: 101.4
        },
        {
          date: "2018-04-01",
          value: 98.8
        },
        {
          date: "2018-05-01",
          value: 98
        },
        {
          date: "2018-06-01",
          value: 98.2
        },
        {
          date: "2018-07-01",
          value: 97.9
        },
        {
          date: "2018-08-01",
          value: 96.2
        },
        {
          date: "2018-09-01",
          value: 100.1
        },
        {
          date: "2018-10-01",
          value: 98.6
        },
        {
          date: "2018-11-01",
          value: 97.5
        },
        {
          date: "2018-12-01",
          value: 98.3
        },
        {
          date: "2019-01-01",
          value: 91.2
        },
        {
          date: "2019-02-01",
          value: 93.8
        },
        {
          date: "2019-03-01",
          value: 98.4
        },
        {
          date: "2019-04-01",
          value: 97.2
        },
        {
          date: "2019-05-01",
          value: 100
        },
        {
          date: "2019-06-01",
          value: 98.2
        },
        {
          date: "2019-07-01",
          value: 98.4
        },
        {
          date: "2019-08-01",
          value: 89.8
        },
        {
          date: "2019-09-01",
          value: 93.2
        },
        {
          date: "2019-10-01",
          value: 95.5
        },
        {
          date: "2019-11-01",
          value: 96.8
        },
        {
          date: "2019-12-01",
          value: 99.3
        },
        {
          date: "2020-01-01",
          value: 99.8
        },
        {
          date: "2020-02-01",
          value: 101
        },
        {
          date: "2020-03-01",
          value: 89.1
        },
        {
          date: "2020-04-01",
          value: 71.8
        },
        {
          date: "2020-05-01",
          value: 72.3
        },
        {
          date: "2020-06-01",
          value: 78.1
        },
        {
          date: "2020-07-01",
          value: 72.5
        },
        {
          date: "2020-08-01",
          value: 74.1
        },
        {
          date: "2020-09-01",
          value: 80.4
        },
        {
          date: "2020-10-01",
          value: 81.8
        },
        {
          date: "2020-11-01",
          value: 76.9
        },
        {
          date: "2020-12-01",
          value: 80.7
        },
        {
          date: "2021-01-01",
          value: 79
        },
        {
          date: "2021-02-01",
          value: 76.8
        },
        {
          date: "2021-03-01",
          value: 84.9
        },
        {
          date: "2021-04-01",
          value: 88.3
        },
        {
          date: "2021-05-01",
          value: 82.9
        },
        {
          date: "2021-06-01",
          value: 85.5
        },
        {
          date: "2021-07-01",
          value: 81.2
        },
        {
          date: "2021-08-01",
          value: 70.3
        },
        {
          date: "2021-09-01",
          value: 72.8
        },
        {
          date: "2021-10-01",
          value: 71.7
        },
        {
          date: "2021-11-01",
          value: 67.4
        },
        {
          date: "2021-12-01",
          value: 70.6
        },
        {
          date: "2022-01-01",
          value: 67.2
        },
        {
          date: "2022-02-01",
          value: 62.8
        },
        {
          date: "2022-03-01",
          value: 59.4
        },
        {
          date: "2022-04-01",
          value: 65.2
        },
        {
          date: "2022-05-01",
          value: 58.4
        },
        {
          date: "2022-06-01",
          value: 50
        },
        {
          date: "2022-07-01",
          value: 51.5
        },
        {
          date: "2022-08-01",
          value: 58.2
        },
        {
          date: "2022-09-01",
          value: 58.6
        },
        {
          date: "2022-10-01",
          value: 59.9
        },
        {
          date: "2022-11-01",
          value: 56.7
        },
        {
          date: "2022-12-01",
          value: 59.8
        },
        {
          date: "2023-01-01",
          value: 64.9
        },
        {
          date: "2023-02-01",
          value: 66.9
        },
        {
          date: "2023-03-01",
          value: 62
        },
        {
          date: "2023-04-01",
          value: 63.7
        },
        {
          date: "2023-05-01",
          value: 59
        },
        {
          date: "2023-06-01",
          value: 64.2
        },
        {
          date: "2023-07-01",
          value: 71.5
        },
        {
          date: "2023-08-01",
          value: 69.4
        },
        {
          date: "2023-09-01",
          value: 67.8
        },
        {
          date: "2023-10-01",
          value: 63.8
        },
        {
          date: "2023-11-01",
          value: 61.3
        },
        {
          date: "2023-12-01",
          value: 69.7
        },
        {
          date: "2024-01-01",
          value: 79
        },
        {
          date: "2024-02-01",
          value: 76.9
        },
        {
          date: "2024-03-01",
          value: 79.4
        },
        {
          date: "2024-04-01",
          value: 77.2
        },
        {
          date: "2024-05-01",
          value: 69.1
        },
        {
          date: "2024-06-01",
          value: 68.2
        },
        {
          date: "2024-07-01",
          value: 66.4
        },
        {
          date: "2024-08-01",
          value: 67.9
        },
        {
          date: "2024-09-01",
          value: 70.1
        },
        {
          date: "2024-10-01",
          value: 70.5
        },
        {
          date: "2024-11-01",
          value: 71.8
        },
        {
          date: "2024-12-01",
          value: 74
        },
        {
          date: "2025-01-01",
          value: 71.7
        },
        {
          date: "2025-02-01",
          value: 64.7
        },
        {
          date: "2025-03-01",
          value: 57
        },
        {
          date: "2025-04-01",
          value: 52.2
        },
        {
          date: "2025-05-01",
          value: 52.2
        },
        {
          date: "2025-06-01",
          value: 60.7
        },
        {
          date: "2025-07-01",
          value: 58.6
        },
        {
          date: "2025-08-01",
          value: 55.4
        },
        {
          date: "2025-09-01",
          value: 55
        },
        {
          date: "2025-10-01",
          value: 50.3
        },
        {
          date: "2025-11-01",
          value: 53.3
        },
        {
          date: "2025-12-01",
          value: 54
        },
        {
          date: "2026-01-01",
          value: 56.6
        },
        {
          date: "2026-02-01",
          value: 56.6
        },
        {
          date: "2026-03-01",
          value: 47.6
        },
        {
          date: "2026-04-01",
          value: 48.2
        },
        {
          date: "2026-05-01",
          value: 48.9
        },
        {
          date: "2026-06-01",
          value: 55.2
        },
        {
          date: "2026-07-01",
          value: 51
        }
      ]
    },
    indpro: {
      id: "indpro",
      fred: "INDPRO",
      mode: "monthly_change",
      unit: "%",
      updated: "2026-08-29T10:40:46.200Z",
      last: {
        date: "2026-07-01",
        value: 0.21
      },
      points: [
        {
          date: "2016-08-01",
          value: -0.15
        },
        {
          date: "2016-09-01",
          value: -0.1
        },
        {
          date: "2016-10-01",
          value: 0.02
        },
        {
          date: "2016-11-01",
          value: -0.41
        },
        {
          date: "2016-12-01",
          value: 0.67
        },
        {
          date: "2017-01-01",
          value: -0.26
        },
        {
          date: "2017-02-01",
          value: -0.4
        },
        {
          date: "2017-03-01",
          value: 0.65
        },
        {
          date: "2017-04-01",
          value: 1.01
        },
        {
          date: "2017-05-01",
          value: 0.12
        },
        {
          date: "2017-06-01",
          value: 0.21
        },
        {
          date: "2017-07-01",
          value: -0.24
        },
        {
          date: "2017-08-01",
          value: -0.41
        },
        {
          date: "2017-09-01",
          value: 0.1
        },
        {
          date: "2017-10-01",
          value: 1.23
        },
        {
          date: "2017-11-01",
          value: 0.24
        },
        {
          date: "2017-12-01",
          value: 0.2
        },
        {
          date: "2018-01-01",
          value: 0
        },
        {
          date: "2018-02-01",
          value: 0.25
        },
        {
          date: "2018-03-01",
          value: 0.5
        },
        {
          date: "2018-04-01",
          value: 1.13
        },
        {
          date: "2018-05-01",
          value: -0.93
        },
        {
          date: "2018-06-01",
          value: 0.8
        },
        {
          date: "2018-07-01",
          value: 0.17
        },
        {
          date: "2018-08-01",
          value: 0.67
        },
        {
          date: "2018-09-01",
          value: 0.07
        },
        {
          date: "2018-10-01",
          value: -0.11
        },
        {
          date: "2018-11-01",
          value: 0.08
        },
        {
          date: "2018-12-01",
          value: 0.03
        },
        {
          date: "2019-01-01",
          value: -0.69
        },
        {
          date: "2019-02-01",
          value: -0.56
        },
        {
          date: "2019-03-01",
          value: 0.04
        },
        {
          date: "2019-04-01",
          value: -0.6
        },
        {
          date: "2019-05-01",
          value: 0.12
        },
        {
          date: "2019-06-01",
          value: 0.05
        },
        {
          date: "2019-07-01",
          value: -0.5
        },
        {
          date: "2019-08-01",
          value: 0.7
        },
        {
          date: "2019-09-01",
          value: -0.35
        },
        {
          date: "2019-10-01",
          value: -0.86
        },
        {
          date: "2019-11-01",
          value: 0.51
        },
        {
          date: "2019-12-01",
          value: -0.24
        },
        {
          date: "2020-01-01",
          value: -0.67
        },
        {
          date: "2020-02-01",
          value: 0.34
        },
        {
          date: "2020-03-01",
          value: -3.97
        },
        {
          date: "2020-04-01",
          value: -12.85
        },
        {
          date: "2020-05-01",
          value: 1.4
        },
        {
          date: "2020-06-01",
          value: 5.63
        },
        {
          date: "2020-07-01",
          value: 3.43
        },
        {
          date: "2020-08-01",
          value: 0.93
        },
        {
          date: "2020-09-01",
          value: 0.01
        },
        {
          date: "2020-10-01",
          value: 0.77
        },
        {
          date: "2020-11-01",
          value: 0.34
        },
        {
          date: "2020-12-01",
          value: 1.28
        },
        {
          date: "2021-01-01",
          value: 0.52
        },
        {
          date: "2021-02-01",
          value: -3.27
        },
        {
          date: "2021-03-01",
          value: 2.77
        },
        {
          date: "2021-04-01",
          value: 0.17
        },
        {
          date: "2021-05-01",
          value: 0.87
        },
        {
          date: "2021-06-01",
          value: 0.37
        },
        {
          date: "2021-07-01",
          value: 0.45
        },
        {
          date: "2021-08-01",
          value: -0.21
        },
        {
          date: "2021-09-01",
          value: -1.19
        },
        {
          date: "2021-10-01",
          value: 1.33
        },
        {
          date: "2021-11-01",
          value: 0.68
        },
        {
          date: "2021-12-01",
          value: -0.29
        },
        {
          date: "2022-01-01",
          value: -0.39
        },
        {
          date: "2022-02-01",
          value: 0.62
        },
        {
          date: "2022-03-01",
          value: 0.58
        },
        {
          date: "2022-04-01",
          value: 0.05
        },
        {
          date: "2022-05-01",
          value: -0.11
        },
        {
          date: "2022-06-01",
          value: -0.32
        },
        {
          date: "2022-07-01",
          value: 0.2
        },
        {
          date: "2022-08-01",
          value: -0.13
        },
        {
          date: "2022-09-01",
          value: 0.2
        },
        {
          date: "2022-10-01",
          value: -0.04
        },
        {
          date: "2022-11-01",
          value: -0.3
        },
        {
          date: "2022-12-01",
          value: -1.19
        },
        {
          date: "2023-01-01",
          value: 0.74
        },
        {
          date: "2023-02-01",
          value: 0.14
        },
        {
          date: "2023-03-01",
          value: 0.38
        },
        {
          date: "2023-04-01",
          value: 0.23
        },
        {
          date: "2023-05-01",
          value: -0.32
        },
        {
          date: "2023-06-01",
          value: -0.81
        },
        {
          date: "2023-07-01",
          value: 0.79
        },
        {
          date: "2023-08-01",
          value: -0.07
        },
        {
          date: "2023-09-01",
          value: 0.18
        },
        {
          date: "2023-10-01",
          value: -0.55
        },
        {
          date: "2023-11-01",
          value: 0.39
        },
        {
          date: "2023-12-01",
          value: -0.26
        },
        {
          date: "2024-01-01",
          value: -1.38
        },
        {
          date: "2024-02-01",
          value: 1.06
        },
        {
          date: "2024-03-01",
          value: 0.17
        },
        {
          date: "2024-04-01",
          value: -0.21
        },
        {
          date: "2024-05-01",
          value: 0.62
        },
        {
          date: "2024-06-01",
          value: 0.03
        },
        {
          date: "2024-07-01",
          value: -0.92
        },
        {
          date: "2024-08-01",
          value: 0.46
        },
        {
          date: "2024-09-01",
          value: -0.62
        },
        {
          date: "2024-10-01",
          value: -0.34
        },
        {
          date: "2024-11-01",
          value: -0.18
        },
        {
          date: "2024-12-01",
          value: 1.03
        },
        {
          date: "2025-01-01",
          value: -0.26
        },
        {
          date: "2025-02-01",
          value: 1.03
        },
        {
          date: "2025-03-01",
          value: -0.06
        },
        {
          date: "2025-04-01",
          value: 0.09
        },
        {
          date: "2025-05-01",
          value: -0.16
        },
        {
          date: "2025-06-01",
          value: 0.51
        },
        {
          date: "2025-07-01",
          value: 0.42
        },
        {
          date: "2025-08-01",
          value: -0.27
        },
        {
          date: "2025-09-01",
          value: 0.04
        },
        {
          date: "2025-10-01",
          value: -0.45
        },
        {
          date: "2025-11-01",
          value: -0.19
        },
        {
          date: "2025-12-01",
          value: 0.46
        },
        {
          date: "2026-01-01",
          value: -0.46
        },
        {
          date: "2026-02-01",
          value: 0.87
        },
        {
          date: "2026-03-01",
          value: -0.15
        },
        {
          date: "2026-04-01",
          value: 0.77
        },
        {
          date: "2026-05-01",
          value: -0.01
        },
        {
          date: "2026-06-01",
          value: 0.28
        },
        {
          date: "2026-07-01",
          value: 0.21
        }
      ]
    },
    gdp: {
      id: "gdp",
      fred: "GDPC1",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-29T10:40:46.480Z",
      last: {
        date: "2026-07-01",
        value: 1.5
      },
      points: [
        {
          date: "2026-04-01",
          value: 1.5
        },
        {
          date: "2026-07-01",
          value: 1.5
        }
      ]
    },
    eu_cpi: {
      id: "eu_cpi",
      fred: "CP0000EZ19M086NEST",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-29T10:40:46.818Z",
      last: {
        date: "2026-07-01",
        value: 2.93
      },
      points: [
        {
          date: "2016-08-01",
          value: 0.23
        },
        {
          date: "2016-09-01",
          value: 0.4
        },
        {
          date: "2016-10-01",
          value: 0.51
        },
        {
          date: "2016-11-01",
          value: 0.58
        },
        {
          date: "2016-12-01",
          value: 1.09
        },
        {
          date: "2017-01-01",
          value: 1.74
        },
        {
          date: "2017-02-01",
          value: 1.96
        },
        {
          date: "2017-03-01",
          value: 1.54
        },
        {
          date: "2017-04-01",
          value: 1.89
        },
        {
          date: "2017-05-01",
          value: 1.39
        },
        {
          date: "2017-06-01",
          value: 1.3
        },
        {
          date: "2017-07-01",
          value: 1.33
        },
        {
          date: "2017-08-01",
          value: 1.54
        },
        {
          date: "2017-09-01",
          value: 1.56
        },
        {
          date: "2017-10-01",
          value: 1.38
        },
        {
          date: "2017-11-01",
          value: 1.52
        },
        {
          date: "2017-12-01",
          value: 1.35
        },
        {
          date: "2018-01-01",
          value: 1.3
        },
        {
          date: "2018-02-01",
          value: 1.13
        },
        {
          date: "2018-03-01",
          value: 1.39
        },
        {
          date: "2018-04-01",
          value: 1.24
        },
        {
          date: "2018-05-01",
          value: 1.94
        },
        {
          date: "2018-06-01",
          value: 1.97
        },
        {
          date: "2018-07-01",
          value: 2.2
        },
        {
          date: "2018-08-01",
          value: 2.08
        },
        {
          date: "2018-09-01",
          value: 2.08
        },
        {
          date: "2018-10-01",
          value: 2.28
        },
        {
          date: "2018-11-01",
          value: 1.93
        },
        {
          date: "2018-12-01",
          value: 1.52
        },
        {
          date: "2019-01-01",
          value: 1.38
        },
        {
          date: "2019-02-01",
          value: 1.49
        },
        {
          date: "2019-03-01",
          value: 1.4
        },
        {
          date: "2019-04-01",
          value: 1.72
        },
        {
          date: "2019-05-01",
          value: 1.23
        },
        {
          date: "2019-06-01",
          value: 1.27
        },
        {
          date: "2019-07-01",
          value: 1.02
        },
        {
          date: "2019-08-01",
          value: 1.01
        },
        {
          date: "2019-09-01",
          value: 0.84
        },
        {
          date: "2019-10-01",
          value: 0.73
        },
        {
          date: "2019-11-01",
          value: 0.96
        },
        {
          date: "2019-12-01",
          value: 1.34
        },
        {
          date: "2020-01-01",
          value: 1.36
        },
        {
          date: "2020-02-01",
          value: 1.22
        },
        {
          date: "2020-03-01",
          value: 0.74
        },
        {
          date: "2020-04-01",
          value: 0.32
        },
        {
          date: "2020-05-01",
          value: 0.09
        },
        {
          date: "2020-06-01",
          value: 0.27
        },
        {
          date: "2020-07-01",
          value: 0.39
        },
        {
          date: "2020-08-01",
          value: -0.17
        },
        {
          date: "2020-09-01",
          value: -0.32
        },
        {
          date: "2020-10-01",
          value: -0.27
        },
        {
          date: "2020-11-01",
          value: -0.29
        },
        {
          date: "2020-12-01",
          value: -0.28
        },
        {
          date: "2021-01-01",
          value: 0.91
        },
        {
          date: "2021-02-01",
          value: 0.94
        },
        {
          date: "2021-03-01",
          value: 1.33
        },
        {
          date: "2021-04-01",
          value: 1.61
        },
        {
          date: "2021-05-01",
          value: 1.98
        },
        {
          date: "2021-06-01",
          value: 1.9
        },
        {
          date: "2021-07-01",
          value: 2.16
        },
        {
          date: "2021-08-01",
          value: 2.94
        },
        {
          date: "2021-09-01",
          value: 3.36
        },
        {
          date: "2021-10-01",
          value: 4.05
        },
        {
          date: "2021-11-01",
          value: 4.88
        },
        {
          date: "2021-12-01",
          value: 4.97
        },
        {
          date: "2022-01-01",
          value: 5.11
        },
        {
          date: "2022-02-01",
          value: 5.88
        },
        {
          date: "2022-03-01",
          value: 7.44
        },
        {
          date: "2022-04-01",
          value: 7.45
        },
        {
          date: "2022-05-01",
          value: 8.05
        },
        {
          date: "2022-06-01",
          value: 8.64
        },
        {
          date: "2022-07-01",
          value: 8.86
        },
        {
          date: "2022-08-01",
          value: 9.15
        },
        {
          date: "2022-09-01",
          value: 9.93
        },
        {
          date: "2022-10-01",
          value: 10.62
        },
        {
          date: "2022-11-01",
          value: 10.05
        },
        {
          date: "2022-12-01",
          value: 9.2
        },
        {
          date: "2023-01-01",
          value: 8.64
        },
        {
          date: "2023-02-01",
          value: 8.5
        },
        {
          date: "2023-03-01",
          value: 6.88
        },
        {
          date: "2023-04-01",
          value: 6.94
        },
        {
          date: "2023-05-01",
          value: 6.1
        },
        {
          date: "2023-06-01",
          value: 5.51
        },
        {
          date: "2023-07-01",
          value: 5.28
        },
        {
          date: "2023-08-01",
          value: 5.21
        },
        {
          date: "2023-09-01",
          value: 4.32
        },
        {
          date: "2023-10-01",
          value: 2.87
        },
        {
          date: "2023-11-01",
          value: 2.37
        },
        {
          date: "2023-12-01",
          value: 2.9
        },
        {
          date: "2024-01-01",
          value: 2.76
        },
        {
          date: "2024-02-01",
          value: 2.57
        },
        {
          date: "2024-03-01",
          value: 2.41
        },
        {
          date: "2024-04-01",
          value: 2.35
        },
        {
          date: "2024-05-01",
          value: 2.55
        },
        {
          date: "2024-06-01",
          value: 2.5
        },
        {
          date: "2024-07-01",
          value: 2.58
        },
        {
          date: "2024-08-01",
          value: 2.16
        },
        {
          date: "2024-09-01",
          value: 1.73
        },
        {
          date: "2024-10-01",
          value: 1.99
        },
        {
          date: "2024-11-01",
          value: 2.23
        },
        {
          date: "2024-12-01",
          value: 2.43
        },
        {
          date: "2025-01-01",
          value: 2.5
        },
        {
          date: "2025-02-01",
          value: 2.3
        },
        {
          date: "2025-03-01",
          value: 2.17
        },
        {
          date: "2025-04-01",
          value: 2.16
        },
        {
          date: "2025-05-01",
          value: 1.86
        },
        {
          date: "2025-06-01",
          value: 1.96
        },
        {
          date: "2025-07-01",
          value: 2.01
        },
        {
          date: "2025-08-01",
          value: 2.02
        },
        {
          date: "2025-09-01",
          value: 2.22
        },
        {
          date: "2025-10-01",
          value: 2.08
        },
        {
          date: "2025-11-01",
          value: 2.11
        },
        {
          date: "2025-12-01",
          value: 1.93
        },
        {
          date: "2026-01-01",
          value: 1.64
        },
        {
          date: "2026-02-01",
          value: 1.87
        },
        {
          date: "2026-03-01",
          value: 2.53
        },
        {
          date: "2026-04-01",
          value: 3
        },
        {
          date: "2026-05-01",
          value: 3.14
        },
        {
          date: "2026-06-01",
          value: 2.73
        },
        {
          date: "2026-07-01",
          value: 2.93
        }
      ]
    },
    eu_unemp: {
      id: "eu_unemp",
      fred: "LRHUTTTTEZM156S",
      mode: "level",
      unit: "%",
      updated: "2026-08-29T10:40:47.141Z",
      last: {
        date: "2023-01-01",
        value: 6.7
      },
      points: [
        {
          date: "2013-02-01",
          value: 12.2
        },
        {
          date: "2013-03-01",
          value: 12.2
        },
        {
          date: "2013-04-01",
          value: 12.2
        },
        {
          date: "2013-05-01",
          value: 12.2
        },
        {
          date: "2013-06-01",
          value: 12.2
        },
        {
          date: "2013-07-01",
          value: 12.1
        },
        {
          date: "2013-08-01",
          value: 12.1
        },
        {
          date: "2013-09-01",
          value: 12.1
        },
        {
          date: "2013-10-01",
          value: 12.1
        },
        {
          date: "2013-11-01",
          value: 12.1
        },
        {
          date: "2013-12-01",
          value: 12
        },
        {
          date: "2014-01-01",
          value: 12.1
        },
        {
          date: "2014-02-01",
          value: 12
        },
        {
          date: "2014-03-01",
          value: 12
        },
        {
          date: "2014-04-01",
          value: 11.8
        },
        {
          date: "2014-05-01",
          value: 11.8
        },
        {
          date: "2014-06-01",
          value: 11.6
        },
        {
          date: "2014-07-01",
          value: 11.7
        },
        {
          date: "2014-08-01",
          value: 11.5
        },
        {
          date: "2014-09-01",
          value: 11.6
        },
        {
          date: "2014-10-01",
          value: 11.6
        },
        {
          date: "2014-11-01",
          value: 11.6
        },
        {
          date: "2014-12-01",
          value: 11.5
        },
        {
          date: "2015-01-01",
          value: 11.4
        },
        {
          date: "2015-02-01",
          value: 11.4
        },
        {
          date: "2015-03-01",
          value: 11.3
        },
        {
          date: "2015-04-01",
          value: 11.2
        },
        {
          date: "2015-05-01",
          value: 11.1
        },
        {
          date: "2015-06-01",
          value: 11.1
        },
        {
          date: "2015-07-01",
          value: 10.8
        },
        {
          date: "2015-08-01",
          value: 10.7
        },
        {
          date: "2015-09-01",
          value: 10.7
        },
        {
          date: "2015-10-01",
          value: 10.7
        },
        {
          date: "2015-11-01",
          value: 10.6
        },
        {
          date: "2015-12-01",
          value: 10.6
        },
        {
          date: "2016-01-01",
          value: 10.5
        },
        {
          date: "2016-02-01",
          value: 10.5
        },
        {
          date: "2016-03-01",
          value: 10.3
        },
        {
          date: "2016-04-01",
          value: 10.3
        },
        {
          date: "2016-05-01",
          value: 10.2
        },
        {
          date: "2016-06-01",
          value: 10.2
        },
        {
          date: "2016-07-01",
          value: 10
        },
        {
          date: "2016-08-01",
          value: 10
        },
        {
          date: "2016-09-01",
          value: 9.9
        },
        {
          date: "2016-10-01",
          value: 9.9
        },
        {
          date: "2016-11-01",
          value: 9.9
        },
        {
          date: "2016-12-01",
          value: 9.7
        },
        {
          date: "2017-01-01",
          value: 9.7
        },
        {
          date: "2017-02-01",
          value: 9.6
        },
        {
          date: "2017-03-01",
          value: 9.5
        },
        {
          date: "2017-04-01",
          value: 9.3
        },
        {
          date: "2017-05-01",
          value: 9.3
        },
        {
          date: "2017-06-01",
          value: 9.1
        },
        {
          date: "2017-07-01",
          value: 9.1
        },
        {
          date: "2017-08-01",
          value: 9
        },
        {
          date: "2017-09-01",
          value: 8.9
        },
        {
          date: "2017-10-01",
          value: 8.8
        },
        {
          date: "2017-11-01",
          value: 8.7
        },
        {
          date: "2017-12-01",
          value: 8.7
        },
        {
          date: "2018-01-01",
          value: 8.7
        },
        {
          date: "2018-02-01",
          value: 8.6
        },
        {
          date: "2018-03-01",
          value: 8.5
        },
        {
          date: "2018-04-01",
          value: 8.4
        },
        {
          date: "2018-05-01",
          value: 8.3
        },
        {
          date: "2018-06-01",
          value: 8.2
        },
        {
          date: "2018-07-01",
          value: 8.1
        },
        {
          date: "2018-08-01",
          value: 8
        },
        {
          date: "2018-09-01",
          value: 8
        },
        {
          date: "2018-10-01",
          value: 8
        },
        {
          date: "2018-11-01",
          value: 7.9
        },
        {
          date: "2018-12-01",
          value: 7.9
        },
        {
          date: "2019-01-01",
          value: 7.9
        },
        {
          date: "2019-02-01",
          value: 7.8
        },
        {
          date: "2019-03-01",
          value: 7.7
        },
        {
          date: "2019-04-01",
          value: 7.7
        },
        {
          date: "2019-05-01",
          value: 7.6
        },
        {
          date: "2019-06-01",
          value: 7.5
        },
        {
          date: "2019-07-01",
          value: 7.5
        },
        {
          date: "2019-08-01",
          value: 7.5
        },
        {
          date: "2019-09-01",
          value: 7.5
        },
        {
          date: "2019-10-01",
          value: 7.4
        },
        {
          date: "2019-11-01",
          value: 7.5
        },
        {
          date: "2019-12-01",
          value: 7.5
        },
        {
          date: "2020-01-01",
          value: 7.5
        },
        {
          date: "2020-02-01",
          value: 7.4
        },
        {
          date: "2020-03-01",
          value: 7.2
        },
        {
          date: "2020-04-01",
          value: 7.4
        },
        {
          date: "2020-05-01",
          value: 7.6
        },
        {
          date: "2020-06-01",
          value: 8.1
        },
        {
          date: "2020-07-01",
          value: 8.5
        },
        {
          date: "2020-08-01",
          value: 8.6
        },
        {
          date: "2020-09-01",
          value: 8.6
        },
        {
          date: "2020-10-01",
          value: 8.4
        },
        {
          date: "2020-11-01",
          value: 8.2
        },
        {
          date: "2020-12-01",
          value: 8.2
        },
        {
          date: "2021-01-01",
          value: 8.2
        },
        {
          date: "2021-02-01",
          value: 8.2
        },
        {
          date: "2021-03-01",
          value: 8.2
        },
        {
          date: "2021-04-01",
          value: 8.2
        },
        {
          date: "2021-05-01",
          value: 8
        },
        {
          date: "2021-06-01",
          value: 7.8
        },
        {
          date: "2021-07-01",
          value: 7.7
        },
        {
          date: "2021-08-01",
          value: 7.5
        },
        {
          date: "2021-09-01",
          value: 7.4
        },
        {
          date: "2021-10-01",
          value: 7.3
        },
        {
          date: "2021-11-01",
          value: 7.1
        },
        {
          date: "2021-12-01",
          value: 7
        },
        {
          date: "2022-01-01",
          value: 6.9
        },
        {
          date: "2022-02-01",
          value: 6.8
        },
        {
          date: "2022-03-01",
          value: 6.8
        },
        {
          date: "2022-04-01",
          value: 6.7
        },
        {
          date: "2022-05-01",
          value: 6.7
        },
        {
          date: "2022-06-01",
          value: 6.7
        },
        {
          date: "2022-07-01",
          value: 6.7
        },
        {
          date: "2022-08-01",
          value: 6.7
        },
        {
          date: "2022-09-01",
          value: 6.7
        },
        {
          date: "2022-10-01",
          value: 6.6
        },
        {
          date: "2022-11-01",
          value: 6.7
        },
        {
          date: "2022-12-01",
          value: 6.7
        },
        {
          date: "2023-01-01",
          value: 6.7
        }
      ]
    },
    uk_cpi: {
      id: "uk_cpi",
      fred: "GBRCPIALLMINMEI",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-29T10:40:47.629Z",
      last: {
        date: "2025-03-01",
        value: 3.42
      },
      points: [
        {
          date: "2015-04-01",
          value: 0.3
        },
        {
          date: "2015-05-01",
          value: 0.5
        },
        {
          date: "2015-06-01",
          value: 0.3
        },
        {
          date: "2015-07-01",
          value: 0.4
        },
        {
          date: "2015-08-01",
          value: 0.4
        },
        {
          date: "2015-09-01",
          value: 0.2
        },
        {
          date: "2015-10-01",
          value: 0.2
        },
        {
          date: "2015-11-01",
          value: 0.4
        },
        {
          date: "2015-12-01",
          value: 0.5
        },
        {
          date: "2016-01-01",
          value: 0.71
        },
        {
          date: "2016-02-01",
          value: 0.6
        },
        {
          date: "2016-03-01",
          value: 0.8
        },
        {
          date: "2016-04-01",
          value: 0.7
        },
        {
          date: "2016-05-01",
          value: 0.7
        },
        {
          date: "2016-06-01",
          value: 0.9
        },
        {
          date: "2016-07-01",
          value: 0.9
        },
        {
          date: "2016-08-01",
          value: 0.9
        },
        {
          date: "2016-09-01",
          value: 1.3
        },
        {
          date: "2016-10-01",
          value: 1.3
        },
        {
          date: "2016-11-01",
          value: 1.5
        },
        {
          date: "2016-12-01",
          value: 1.79
        },
        {
          date: "2017-01-01",
          value: 1.9
        },
        {
          date: "2017-02-01",
          value: 2.3
        },
        {
          date: "2017-03-01",
          value: 2.29
        },
        {
          date: "2017-04-01",
          value: 2.58
        },
        {
          date: "2017-05-01",
          value: 2.68
        },
        {
          date: "2017-06-01",
          value: 2.48
        },
        {
          date: "2017-07-01",
          value: 2.58
        },
        {
          date: "2017-08-01",
          value: 2.77
        },
        {
          date: "2017-09-01",
          value: 2.76
        },
        {
          date: "2017-10-01",
          value: 2.76
        },
        {
          date: "2017-11-01",
          value: 2.85
        },
        {
          date: "2017-12-01",
          value: 2.74
        },
        {
          date: "2018-01-01",
          value: 2.65
        },
        {
          date: "2018-02-01",
          value: 2.44
        },
        {
          date: "2018-03-01",
          value: 2.34
        },
        {
          date: "2018-04-01",
          value: 2.23
        },
        {
          date: "2018-05-01",
          value: 2.32
        },
        {
          date: "2018-06-01",
          value: 2.32
        },
        {
          date: "2018-07-01",
          value: 2.32
        },
        {
          date: "2018-08-01",
          value: 2.4
        },
        {
          date: "2018-09-01",
          value: 2.21
        },
        {
          date: "2018-10-01",
          value: 2.2
        },
        {
          date: "2018-11-01",
          value: 2.1
        },
        {
          date: "2018-12-01",
          value: 2
        },
        {
          date: "2019-01-01",
          value: 1.82
        },
        {
          date: "2019-02-01",
          value: 1.81
        },
        {
          date: "2019-03-01",
          value: 1.81
        },
        {
          date: "2019-04-01",
          value: 1.99
        },
        {
          date: "2019-05-01",
          value: 1.89
        },
        {
          date: "2019-06-01",
          value: 1.89
        },
        {
          date: "2019-07-01",
          value: 1.98
        },
        {
          date: "2019-08-01",
          value: 1.69
        },
        {
          date: "2019-09-01",
          value: 1.69
        },
        {
          date: "2019-10-01",
          value: 1.5
        },
        {
          date: "2019-11-01",
          value: 1.5
        },
        {
          date: "2019-12-01",
          value: 1.31
        },
        {
          date: "2020-01-01",
          value: 1.79
        },
        {
          date: "2020-02-01",
          value: 1.69
        },
        {
          date: "2020-03-01",
          value: 1.5
        },
        {
          date: "2020-04-01",
          value: 0.93
        },
        {
          date: "2020-05-01",
          value: 0.65
        },
        {
          date: "2020-06-01",
          value: 0.83
        },
        {
          date: "2020-07-01",
          value: 1.11
        },
        {
          date: "2020-08-01",
          value: 0.46
        },
        {
          date: "2020-09-01",
          value: 0.74
        },
        {
          date: "2020-10-01",
          value: 0.83
        },
        {
          date: "2020-11-01",
          value: 0.55
        },
        {
          date: "2020-12-01",
          value: 0.83
        },
        {
          date: "2021-01-01",
          value: 0.92
        },
        {
          date: "2021-02-01",
          value: 0.74
        },
        {
          date: "2021-03-01",
          value: 1.01
        },
        {
          date: "2021-04-01",
          value: 1.66
        },
        {
          date: "2021-05-01",
          value: 2.21
        },
        {
          date: "2021-06-01",
          value: 2.39
        },
        {
          date: "2021-07-01",
          value: 2.01
        },
        {
          date: "2021-08-01",
          value: 3.03
        },
        {
          date: "2021-09-01",
          value: 2.93
        },
        {
          date: "2021-10-01",
          value: 3.85
        },
        {
          date: "2021-11-01",
          value: 4.58
        },
        {
          date: "2021-12-01",
          value: 4.84
        },
        {
          date: "2022-01-01",
          value: 4.85
        },
        {
          date: "2022-02-01",
          value: 5.48
        },
        {
          date: "2022-03-01",
          value: 6.2
        },
        {
          date: "2022-04-01",
          value: 7.79
        },
        {
          date: "2022-05-01",
          value: 7.84
        },
        {
          date: "2022-06-01",
          value: 8.17
        },
        {
          date: "2022-07-01",
          value: 8.8
        },
        {
          date: "2022-08-01",
          value: 8.65
        },
        {
          date: "2022-09-01",
          value: 8.81
        },
        {
          date: "2022-10-01",
          value: 9.61
        },
        {
          date: "2022-11-01",
          value: 9.38
        },
        {
          date: "2022-12-01",
          value: 9.24
        },
        {
          date: "2023-01-01",
          value: 8.9
        },
        {
          date: "2023-02-01",
          value: 9.19
        },
        {
          date: "2023-03-01",
          value: 8.84
        },
        {
          date: "2023-04-01",
          value: 7.82
        },
        {
          date: "2023-05-01",
          value: 7.85
        },
        {
          date: "2023-06-01",
          value: 7.39
        },
        {
          date: "2023-07-01",
          value: 6.44
        },
        {
          date: "2023-08-01",
          value: 6.24
        },
        {
          date: "2023-09-01",
          value: 6.38
        },
        {
          date: "2023-10-01",
          value: 4.75
        },
        {
          date: "2023-11-01",
          value: 4.17
        },
        {
          date: "2023-12-01",
          value: 4.15
        },
        {
          date: "2024-01-01",
          value: 4.17
        },
        {
          date: "2024-02-01",
          value: 3.81
        },
        {
          date: "2024-03-01",
          value: 3.79
        },
        {
          date: "2024-04-01",
          value: 3.04
        },
        {
          date: "2024-05-01",
          value: 2.79
        },
        {
          date: "2024-06-01",
          value: 2.78
        },
        {
          date: "2024-07-01",
          value: 3.02
        },
        {
          date: "2024-08-01",
          value: 3.09
        },
        {
          date: "2024-09-01",
          value: 2.61
        },
        {
          date: "2024-10-01",
          value: 3.15
        },
        {
          date: "2024-11-01",
          value: 3.54
        },
        {
          date: "2024-12-01",
          value: 3.52
        },
        {
          date: "2025-01-01",
          value: 3.92
        },
        {
          date: "2025-02-01",
          value: 3.67
        },
        {
          date: "2025-03-01",
          value: 3.42
        }
      ]
    },
    uk_unemp: {
      id: "uk_unemp",
      fred: "LRHUTTTTGBM156S",
      mode: "level",
      unit: "%",
      updated: "2026-08-29T10:40:48.130Z",
      last: {
        date: "2026-04-01",
        value: 4.9
      },
      points: [
        {
          date: "2016-05-01",
          value: 4.9
        },
        {
          date: "2016-06-01",
          value: 4.9
        },
        {
          date: "2016-07-01",
          value: 5
        },
        {
          date: "2016-08-01",
          value: 4.8
        },
        {
          date: "2016-09-01",
          value: 4.8
        },
        {
          date: "2016-10-01",
          value: 4.8
        },
        {
          date: "2016-11-01",
          value: 4.7
        },
        {
          date: "2016-12-01",
          value: 4.7
        },
        {
          date: "2017-01-01",
          value: 4.6
        },
        {
          date: "2017-02-01",
          value: 4.6
        },
        {
          date: "2017-03-01",
          value: 4.5
        },
        {
          date: "2017-04-01",
          value: 4.4
        },
        {
          date: "2017-05-01",
          value: 4.4
        },
        {
          date: "2017-06-01",
          value: 4.3
        },
        {
          date: "2017-07-01",
          value: 4.3
        },
        {
          date: "2017-08-01",
          value: 4.3
        },
        {
          date: "2017-09-01",
          value: 4.2
        },
        {
          date: "2017-10-01",
          value: 4.3
        },
        {
          date: "2017-11-01",
          value: 4.4
        },
        {
          date: "2017-12-01",
          value: 4.3
        },
        {
          date: "2018-01-01",
          value: 4.2
        },
        {
          date: "2018-02-01",
          value: 4.2
        },
        {
          date: "2018-03-01",
          value: 4.2
        },
        {
          date: "2018-04-01",
          value: 4.2
        },
        {
          date: "2018-05-01",
          value: 4
        },
        {
          date: "2018-06-01",
          value: 4
        },
        {
          date: "2018-07-01",
          value: 4
        },
        {
          date: "2018-08-01",
          value: 4.1
        },
        {
          date: "2018-09-01",
          value: 4.1
        },
        {
          date: "2018-10-01",
          value: 4
        },
        {
          date: "2018-11-01",
          value: 4
        },
        {
          date: "2018-12-01",
          value: 3.9
        },
        {
          date: "2019-01-01",
          value: 4
        },
        {
          date: "2019-02-01",
          value: 3.8
        },
        {
          date: "2019-03-01",
          value: 3.8
        },
        {
          date: "2019-04-01",
          value: 3.8
        },
        {
          date: "2019-05-01",
          value: 3.9
        },
        {
          date: "2019-06-01",
          value: 3.9
        },
        {
          date: "2019-07-01",
          value: 3.9
        },
        {
          date: "2019-08-01",
          value: 3.9
        },
        {
          date: "2019-09-01",
          value: 3.8
        },
        {
          date: "2019-10-01",
          value: 3.8
        },
        {
          date: "2019-11-01",
          value: 3.7
        },
        {
          date: "2019-12-01",
          value: 3.9
        },
        {
          date: "2020-01-01",
          value: 3.9
        },
        {
          date: "2020-02-01",
          value: 4.1
        },
        {
          date: "2020-03-01",
          value: 4.1
        },
        {
          date: "2020-04-01",
          value: 4.1
        },
        {
          date: "2020-05-01",
          value: 4.1
        },
        {
          date: "2020-06-01",
          value: 4.4
        },
        {
          date: "2020-07-01",
          value: 4.6
        },
        {
          date: "2020-08-01",
          value: 5
        },
        {
          date: "2020-09-01",
          value: 5.2
        },
        {
          date: "2020-10-01",
          value: 5.2
        },
        {
          date: "2020-11-01",
          value: 5.3
        },
        {
          date: "2020-12-01",
          value: 5.2
        },
        {
          date: "2021-01-01",
          value: 5
        },
        {
          date: "2021-02-01",
          value: 4.9
        },
        {
          date: "2021-03-01",
          value: 4.8
        },
        {
          date: "2021-04-01",
          value: 4.8
        },
        {
          date: "2021-05-01",
          value: 4.7
        },
        {
          date: "2021-06-01",
          value: 4.6
        },
        {
          date: "2021-07-01",
          value: 4.5
        },
        {
          date: "2021-08-01",
          value: 4.4
        },
        {
          date: "2021-09-01",
          value: 4.3
        },
        {
          date: "2021-10-01",
          value: 4.2
        },
        {
          date: "2021-11-01",
          value: 4.2
        },
        {
          date: "2021-12-01",
          value: 4.1
        },
        {
          date: "2022-01-01",
          value: 3.9
        },
        {
          date: "2022-02-01",
          value: 3.8
        },
        {
          date: "2022-03-01",
          value: 3.8
        },
        {
          date: "2022-04-01",
          value: 3.7
        },
        {
          date: "2022-05-01",
          value: 3.8
        },
        {
          date: "2022-06-01",
          value: 3.6
        },
        {
          date: "2022-07-01",
          value: 3.6
        },
        {
          date: "2022-08-01",
          value: 3.7
        },
        {
          date: "2022-09-01",
          value: 3.8
        },
        {
          date: "2022-10-01",
          value: 3.9
        },
        {
          date: "2022-11-01",
          value: 3.9
        },
        {
          date: "2022-12-01",
          value: 3.9
        },
        {
          date: "2023-01-01",
          value: 4
        },
        {
          date: "2023-02-01",
          value: 4
        },
        {
          date: "2023-03-01",
          value: 3.9
        },
        {
          date: "2023-04-01",
          value: 4
        },
        {
          date: "2023-05-01",
          value: 4.2
        },
        {
          date: "2023-06-01",
          value: 4.4
        },
        {
          date: "2023-07-01",
          value: 4.3
        },
        {
          date: "2023-08-01",
          value: 4.1
        },
        {
          date: "2023-09-01",
          value: 4
        },
        {
          date: "2023-10-01",
          value: 4
        },
        {
          date: "2023-11-01",
          value: 3.9
        },
        {
          date: "2023-12-01",
          value: 4.1
        },
        {
          date: "2024-01-01",
          value: 4.2
        },
        {
          date: "2024-02-01",
          value: 4.3
        },
        {
          date: "2024-03-01",
          value: 4.4
        },
        {
          date: "2024-04-01",
          value: 4.4
        },
        {
          date: "2024-05-01",
          value: 4.2
        },
        {
          date: "2024-06-01",
          value: 4.2
        },
        {
          date: "2024-07-01",
          value: 4.1
        },
        {
          date: "2024-08-01",
          value: 4.3
        },
        {
          date: "2024-09-01",
          value: 4.2
        },
        {
          date: "2024-10-01",
          value: 4.4
        },
        {
          date: "2024-11-01",
          value: 4.4
        },
        {
          date: "2024-12-01",
          value: 4.4
        },
        {
          date: "2025-01-01",
          value: 4.5
        },
        {
          date: "2025-02-01",
          value: 4.6
        },
        {
          date: "2025-03-01",
          value: 4.6
        },
        {
          date: "2025-04-01",
          value: 4.7
        },
        {
          date: "2025-05-01",
          value: 4.7
        },
        {
          date: "2025-06-01",
          value: 4.7
        },
        {
          date: "2025-07-01",
          value: 4.8
        },
        {
          date: "2025-08-01",
          value: 5
        },
        {
          date: "2025-09-01",
          value: 5.1
        },
        {
          date: "2025-10-01",
          value: 5.1
        },
        {
          date: "2025-11-01",
          value: 5.2
        },
        {
          date: "2025-12-01",
          value: 5.2
        },
        {
          date: "2026-01-01",
          value: 4.9
        },
        {
          date: "2026-02-01",
          value: 5
        },
        {
          date: "2026-03-01",
          value: 4.9
        },
        {
          date: "2026-04-01",
          value: 4.9
        }
      ]
    },
    jp_cpi: {
      id: "jp_cpi",
      fred: "JPNCPIALLMINMEI",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-29T10:40:48.437Z",
      last: {
        date: "2021-06-01",
        value: -0.4
      },
      points: [
        {
          date: "2011-07-01",
          value: 0.21
        },
        {
          date: "2011-08-01",
          value: 0.21
        },
        {
          date: "2011-09-01",
          value: 0
        },
        {
          date: "2011-10-01",
          value: -0.21
        },
        {
          date: "2011-11-01",
          value: -0.53
        },
        {
          date: "2011-12-01",
          value: -0.21
        },
        {
          date: "2012-01-01",
          value: 0.11
        },
        {
          date: "2012-02-01",
          value: 0.32
        },
        {
          date: "2012-03-01",
          value: 0.53
        },
        {
          date: "2012-04-01",
          value: 0.53
        },
        {
          date: "2012-05-01",
          value: 0.21
        },
        {
          date: "2012-06-01",
          value: -0.21
        },
        {
          date: "2012-07-01",
          value: -0.53
        },
        {
          date: "2012-08-01",
          value: -0.42
        },
        {
          date: "2012-09-01",
          value: -0.32
        },
        {
          date: "2012-10-01",
          value: -0.42
        },
        {
          date: "2012-11-01",
          value: -0.11
        },
        {
          date: "2012-12-01",
          value: -0.21
        },
        {
          date: "2013-01-01",
          value: -0.32
        },
        {
          date: "2013-02-01",
          value: -0.74
        },
        {
          date: "2013-03-01",
          value: -0.95
        },
        {
          date: "2013-04-01",
          value: -0.74
        },
        {
          date: "2013-05-01",
          value: -0.32
        },
        {
          date: "2013-06-01",
          value: 0.21
        },
        {
          date: "2013-07-01",
          value: 0.74
        },
        {
          date: "2013-08-01",
          value: 0.85
        },
        {
          date: "2013-09-01",
          value: 1.06
        },
        {
          date: "2013-10-01",
          value: 1.17
        },
        {
          date: "2013-11-01",
          value: 1.49
        },
        {
          date: "2013-12-01",
          value: 1.59
        },
        {
          date: "2014-01-01",
          value: 1.38
        },
        {
          date: "2014-02-01",
          value: 1.6
        },
        {
          date: "2014-03-01",
          value: 1.59
        },
        {
          date: "2014-04-01",
          value: 3.39
        },
        {
          date: "2014-05-01",
          value: 3.7
        },
        {
          date: "2014-06-01",
          value: 3.59
        },
        {
          date: "2014-07-01",
          value: 3.48
        },
        {
          date: "2014-08-01",
          value: 3.36
        },
        {
          date: "2014-09-01",
          value: 3.25
        },
        {
          date: "2014-10-01",
          value: 2.83
        },
        {
          date: "2014-11-01",
          value: 2.51
        },
        {
          date: "2014-12-01",
          value: 2.41
        },
        {
          date: "2015-01-01",
          value: 2.41
        },
        {
          date: "2015-02-01",
          value: 2.2
        },
        {
          date: "2015-03-01",
          value: 2.3
        },
        {
          date: "2015-04-01",
          value: 0.72
        },
        {
          date: "2015-05-01",
          value: 0.61
        },
        {
          date: "2015-06-01",
          value: 0.41
        },
        {
          date: "2015-07-01",
          value: 0.2
        },
        {
          date: "2015-08-01",
          value: 0.1
        },
        {
          date: "2015-09-01",
          value: 0
        },
        {
          date: "2015-10-01",
          value: 0.31
        },
        {
          date: "2015-11-01",
          value: 0.2
        },
        {
          date: "2015-12-01",
          value: 0.2
        },
        {
          date: "2016-01-01",
          value: -0.1
        },
        {
          date: "2016-02-01",
          value: 0.2
        },
        {
          date: "2016-03-01",
          value: 0
        },
        {
          date: "2016-04-01",
          value: -0.3
        },
        {
          date: "2016-05-01",
          value: -0.51
        },
        {
          date: "2016-06-01",
          value: -0.3
        },
        {
          date: "2016-07-01",
          value: -0.41
        },
        {
          date: "2016-08-01",
          value: -0.51
        },
        {
          date: "2016-09-01",
          value: -0.51
        },
        {
          date: "2016-10-01",
          value: 0.1
        },
        {
          date: "2016-11-01",
          value: 0.51
        },
        {
          date: "2016-12-01",
          value: 0.31
        },
        {
          date: "2017-01-01",
          value: 0.51
        },
        {
          date: "2017-02-01",
          value: 0.31
        },
        {
          date: "2017-03-01",
          value: 0.2
        },
        {
          date: "2017-04-01",
          value: 0.41
        },
        {
          date: "2017-05-01",
          value: 0.41
        },
        {
          date: "2017-06-01",
          value: 0.41
        },
        {
          date: "2017-07-01",
          value: 0.41
        },
        {
          date: "2017-08-01",
          value: 0.61
        },
        {
          date: "2017-09-01",
          value: 0.82
        },
        {
          date: "2017-10-01",
          value: 0.2
        },
        {
          date: "2017-11-01",
          value: 0.51
        },
        {
          date: "2017-12-01",
          value: 1.02
        },
        {
          date: "2018-01-01",
          value: 1.32
        },
        {
          date: "2018-02-01",
          value: 1.43
        },
        {
          date: "2018-03-01",
          value: 1.12
        },
        {
          date: "2018-04-01",
          value: 0.61
        },
        {
          date: "2018-05-01",
          value: 0.71
        },
        {
          date: "2018-06-01",
          value: 0.71
        },
        {
          date: "2018-07-01",
          value: 0.92
        },
        {
          date: "2018-08-01",
          value: 1.32
        },
        {
          date: "2018-09-01",
          value: 1.11
        },
        {
          date: "2018-10-01",
          value: 1.42
        },
        {
          date: "2018-11-01",
          value: 0.91
        },
        {
          date: "2018-12-01",
          value: 0.3
        },
        {
          date: "2019-01-01",
          value: 0.2
        },
        {
          date: "2019-02-01",
          value: 0.2
        },
        {
          date: "2019-03-01",
          value: 0.5
        },
        {
          date: "2019-04-01",
          value: 0.91
        },
        {
          date: "2019-05-01",
          value: 0.7
        },
        {
          date: "2019-06-01",
          value: 0.6
        },
        {
          date: "2019-07-01",
          value: 0.6
        },
        {
          date: "2019-08-01",
          value: 0.2
        },
        {
          date: "2019-09-01",
          value: 0.2
        },
        {
          date: "2019-10-01",
          value: 0.2
        },
        {
          date: "2019-11-01",
          value: 0.5
        },
        {
          date: "2019-12-01",
          value: 0.8
        },
        {
          date: "2020-01-01",
          value: 0.8
        },
        {
          date: "2020-02-01",
          value: 0.6
        },
        {
          date: "2020-03-01",
          value: 0.6
        },
        {
          date: "2020-04-01",
          value: 0.2
        },
        {
          date: "2020-05-01",
          value: 0.1
        },
        {
          date: "2020-06-01",
          value: 0.1
        },
        {
          date: "2020-07-01",
          value: 0.2
        },
        {
          date: "2020-08-01",
          value: 0.1
        },
        {
          date: "2020-09-01",
          value: -0.2
        },
        {
          date: "2020-10-01",
          value: -0.6
        },
        {
          date: "2020-11-01",
          value: -1
        },
        {
          date: "2020-12-01",
          value: -1.19
        },
        {
          date: "2021-01-01",
          value: -0.7
        },
        {
          date: "2021-02-01",
          value: -0.5
        },
        {
          date: "2021-03-01",
          value: -0.4
        },
        {
          date: "2021-04-01",
          value: -1.1
        },
        {
          date: "2021-05-01",
          value: -0.7
        },
        {
          date: "2021-06-01",
          value: -0.4
        }
      ]
    },
    wti: {
      id: "wti",
      fred: "DCOILWTICO",
      mode: "level",
      unit: "USD/barel",
      updated: "2026-08-29T10:40:49.542Z",
      last: {
        date: "2026-08-01",
        value: 83.65
      },
      points: [
        {
          date: "2016-09-01",
          value: 45.18
        },
        {
          date: "2016-10-01",
          value: 49.78
        },
        {
          date: "2016-11-01",
          value: 45.66
        },
        {
          date: "2016-12-01",
          value: 51.97
        },
        {
          date: "2017-01-01",
          value: 52.5
        },
        {
          date: "2017-02-01",
          value: 53.47
        },
        {
          date: "2017-03-01",
          value: 49.33
        },
        {
          date: "2017-04-01",
          value: 51.06
        },
        {
          date: "2017-05-01",
          value: 48.48
        },
        {
          date: "2017-06-01",
          value: 45.18
        },
        {
          date: "2017-07-01",
          value: 46.63
        },
        {
          date: "2017-08-01",
          value: 48.04
        },
        {
          date: "2017-09-01",
          value: 49.82
        },
        {
          date: "2017-10-01",
          value: 51.58
        },
        {
          date: "2017-11-01",
          value: 56.64
        },
        {
          date: "2017-12-01",
          value: 57.88
        },
        {
          date: "2018-01-01",
          value: 63.7
        },
        {
          date: "2018-02-01",
          value: 62.23
        },
        {
          date: "2018-03-01",
          value: 62.72
        },
        {
          date: "2018-04-01",
          value: 66.25
        },
        {
          date: "2018-05-01",
          value: 69.98
        },
        {
          date: "2018-06-01",
          value: 67.87
        },
        {
          date: "2018-07-01",
          value: 70.98
        },
        {
          date: "2018-08-01",
          value: 68.06
        },
        {
          date: "2018-09-01",
          value: 70.23
        },
        {
          date: "2018-10-01",
          value: 70.75
        },
        {
          date: "2018-11-01",
          value: 56.96
        },
        {
          date: "2018-12-01",
          value: 49.52
        },
        {
          date: "2019-01-01",
          value: 51.38
        },
        {
          date: "2019-02-01",
          value: 54.95
        },
        {
          date: "2019-03-01",
          value: 58.15
        },
        {
          date: "2019-04-01",
          value: 63.86
        },
        {
          date: "2019-05-01",
          value: 60.83
        },
        {
          date: "2019-06-01",
          value: 54.66
        },
        {
          date: "2019-07-01",
          value: 57.36
        },
        {
          date: "2019-08-01",
          value: 54.81
        },
        {
          date: "2019-09-01",
          value: 56.95
        },
        {
          date: "2019-10-01",
          value: 53.96
        },
        {
          date: "2019-11-01",
          value: 57.05
        },
        {
          date: "2019-12-01",
          value: 59.82
        },
        {
          date: "2020-01-01",
          value: 57.52
        },
        {
          date: "2020-02-01",
          value: 50.54
        },
        {
          date: "2020-03-01",
          value: 29.21
        },
        {
          date: "2020-04-01",
          value: 16.55
        },
        {
          date: "2020-05-01",
          value: 28.56
        },
        {
          date: "2020-06-01",
          value: 38.31
        },
        {
          date: "2020-07-01",
          value: 40.71
        },
        {
          date: "2020-08-01",
          value: 42.34
        },
        {
          date: "2020-09-01",
          value: 39.63
        },
        {
          date: "2020-10-01",
          value: 39.4
        },
        {
          date: "2020-11-01",
          value: 40.94
        },
        {
          date: "2020-12-01",
          value: 47.02
        },
        {
          date: "2021-01-01",
          value: 52.01
        },
        {
          date: "2021-02-01",
          value: 59.05
        },
        {
          date: "2021-03-01",
          value: 62.33
        },
        {
          date: "2021-04-01",
          value: 61.72
        },
        {
          date: "2021-05-01",
          value: 65.17
        },
        {
          date: "2021-06-01",
          value: 71.38
        },
        {
          date: "2021-07-01",
          value: 72.49
        },
        {
          date: "2021-08-01",
          value: 67.73
        },
        {
          date: "2021-09-01",
          value: 71.65
        },
        {
          date: "2021-10-01",
          value: 81.48
        },
        {
          date: "2021-11-01",
          value: 79.15
        },
        {
          date: "2021-12-01",
          value: 71.71
        },
        {
          date: "2022-01-01",
          value: 83.22
        },
        {
          date: "2022-02-01",
          value: 91.64
        },
        {
          date: "2022-03-01",
          value: 108.5
        },
        {
          date: "2022-04-01",
          value: 101.78
        },
        {
          date: "2022-05-01",
          value: 109.55
        },
        {
          date: "2022-06-01",
          value: 114.84
        },
        {
          date: "2022-07-01",
          value: 101.62
        },
        {
          date: "2022-08-01",
          value: 93.67
        },
        {
          date: "2022-09-01",
          value: 84.26
        },
        {
          date: "2022-10-01",
          value: 87.55
        },
        {
          date: "2022-11-01",
          value: 84.37
        },
        {
          date: "2022-12-01",
          value: 76.44
        },
        {
          date: "2023-01-01",
          value: 78.12
        },
        {
          date: "2023-02-01",
          value: 76.83
        },
        {
          date: "2023-03-01",
          value: 73.28
        },
        {
          date: "2023-04-01",
          value: 79.45
        },
        {
          date: "2023-05-01",
          value: 71.58
        },
        {
          date: "2023-06-01",
          value: 70.25
        },
        {
          date: "2023-07-01",
          value: 76.07
        },
        {
          date: "2023-08-01",
          value: 81.39
        },
        {
          date: "2023-09-01",
          value: 89.43
        },
        {
          date: "2023-10-01",
          value: 85.64
        },
        {
          date: "2023-11-01",
          value: 77.68
        },
        {
          date: "2023-12-01",
          value: 71.9
        },
        {
          date: "2024-01-01",
          value: 74.15
        },
        {
          date: "2024-02-01",
          value: 77.25
        },
        {
          date: "2024-03-01",
          value: 81.28
        },
        {
          date: "2024-04-01",
          value: 85.35
        },
        {
          date: "2024-05-01",
          value: 80.02
        },
        {
          date: "2024-06-01",
          value: 79.77
        },
        {
          date: "2024-07-01",
          value: 81.8
        },
        {
          date: "2024-08-01",
          value: 76.68
        },
        {
          date: "2024-09-01",
          value: 70.24
        },
        {
          date: "2024-10-01",
          value: 71.99
        },
        {
          date: "2024-11-01",
          value: 69.95
        },
        {
          date: "2024-12-01",
          value: 70.12
        },
        {
          date: "2025-01-01",
          value: 75.74
        },
        {
          date: "2025-02-01",
          value: 71.53
        },
        {
          date: "2025-03-01",
          value: 68.24
        },
        {
          date: "2025-04-01",
          value: 63.54
        },
        {
          date: "2025-05-01",
          value: 62.17
        },
        {
          date: "2025-06-01",
          value: 68.17
        },
        {
          date: "2025-07-01",
          value: 68.39
        },
        {
          date: "2025-08-01",
          value: 64.86
        },
        {
          date: "2025-09-01",
          value: 63.96
        },
        {
          date: "2025-10-01",
          value: 60.89
        },
        {
          date: "2025-11-01",
          value: 60.06
        },
        {
          date: "2025-12-01",
          value: 57.97
        },
        {
          date: "2026-01-01",
          value: 60.04
        },
        {
          date: "2026-02-01",
          value: 64.51
        },
        {
          date: "2026-03-01",
          value: 91.38
        },
        {
          date: "2026-04-01",
          value: 100.32
        },
        {
          date: "2026-05-01",
          value: 102.13
        },
        {
          date: "2026-06-01",
          value: 84.81
        },
        {
          date: "2026-07-01",
          value: 80.46
        },
        {
          date: "2026-08-01",
          value: 83.65
        }
      ]
    },
    vix: {
      id: "vix",
      fred: "VIXCLS",
      mode: "level",
      unit: "index",
      updated: "2026-08-29T10:40:50.593Z",
      last: {
        date: "2026-08-01",
        value: 15.29
      },
      points: [
        {
          date: "2016-09-01",
          value: 14.22
        },
        {
          date: "2016-10-01",
          value: 14.59
        },
        {
          date: "2016-11-01",
          value: 15.24
        },
        {
          date: "2016-12-01",
          value: 12.47
        },
        {
          date: "2017-01-01",
          value: 11.61
        },
        {
          date: "2017-02-01",
          value: 11.53
        },
        {
          date: "2017-03-01",
          value: 11.9
        },
        {
          date: "2017-04-01",
          value: 13.14
        },
        {
          date: "2017-05-01",
          value: 10.86
        },
        {
          date: "2017-06-01",
          value: 10.51
        },
        {
          date: "2017-07-01",
          value: 10.26
        },
        {
          date: "2017-08-01",
          value: 11.98
        },
        {
          date: "2017-09-01",
          value: 10.44
        },
        {
          date: "2017-10-01",
          value: 10.13
        },
        {
          date: "2017-11-01",
          value: 10.54
        },
        {
          date: "2017-12-01",
          value: 10.26
        },
        {
          date: "2018-01-01",
          value: 11.06
        },
        {
          date: "2018-02-01",
          value: 22.46
        },
        {
          date: "2018-03-01",
          value: 19.02
        },
        {
          date: "2018-04-01",
          value: 18.27
        },
        {
          date: "2018-05-01",
          value: 14.12
        },
        {
          date: "2018-06-01",
          value: 13.68
        },
        {
          date: "2018-07-01",
          value: 13.15
        },
        {
          date: "2018-08-01",
          value: 12.55
        },
        {
          date: "2018-09-01",
          value: 12.91
        },
        {
          date: "2018-10-01",
          value: 19.35
        },
        {
          date: "2018-11-01",
          value: 19.39
        },
        {
          date: "2018-12-01",
          value: 24.95
        },
        {
          date: "2019-01-01",
          value: 19.57
        },
        {
          date: "2019-02-01",
          value: 15.23
        },
        {
          date: "2019-03-01",
          value: 14.49
        },
        {
          date: "2019-04-01",
          value: 12.95
        },
        {
          date: "2019-05-01",
          value: 16.72
        },
        {
          date: "2019-06-01",
          value: 15.84
        },
        {
          date: "2019-07-01",
          value: 13.31
        },
        {
          date: "2019-08-01",
          value: 18.98
        },
        {
          date: "2019-09-01",
          value: 15.56
        },
        {
          date: "2019-10-01",
          value: 15.47
        },
        {
          date: "2019-11-01",
          value: 12.52
        },
        {
          date: "2019-12-01",
          value: 13.76
        },
        {
          date: "2020-01-01",
          value: 13.94
        },
        {
          date: "2020-02-01",
          value: 19.63
        },
        {
          date: "2020-03-01",
          value: 57.74
        },
        {
          date: "2020-04-01",
          value: 41.45
        },
        {
          date: "2020-05-01",
          value: 30.9
        },
        {
          date: "2020-06-01",
          value: 31.12
        },
        {
          date: "2020-07-01",
          value: 26.84
        },
        {
          date: "2020-08-01",
          value: 22.89
        },
        {
          date: "2020-09-01",
          value: 27.65
        },
        {
          date: "2020-10-01",
          value: 29.44
        },
        {
          date: "2020-11-01",
          value: 25
        },
        {
          date: "2020-12-01",
          value: 22.37
        },
        {
          date: "2021-01-01",
          value: 24.91
        },
        {
          date: "2021-02-01",
          value: 23.14
        },
        {
          date: "2021-03-01",
          value: 21.84
        },
        {
          date: "2021-04-01",
          value: 17.42
        },
        {
          date: "2021-05-01",
          value: 19.76
        },
        {
          date: "2021-06-01",
          value: 16.96
        },
        {
          date: "2021-07-01",
          value: 17.6
        },
        {
          date: "2021-08-01",
          value: 17.47
        },
        {
          date: "2021-09-01",
          value: 19.82
        },
        {
          date: "2021-10-01",
          value: 17.87
        },
        {
          date: "2021-11-01",
          value: 18.5
        },
        {
          date: "2021-12-01",
          value: 21.35
        },
        {
          date: "2022-01-01",
          value: 23.18
        },
        {
          date: "2022-02-01",
          value: 25.75
        },
        {
          date: "2022-03-01",
          value: 26.97
        },
        {
          date: "2022-04-01",
          value: 24.37
        },
        {
          date: "2022-05-01",
          value: 29.31
        },
        {
          date: "2022-06-01",
          value: 28.23
        },
        {
          date: "2022-07-01",
          value: 25
        },
        {
          date: "2022-08-01",
          value: 22.17
        },
        {
          date: "2022-09-01",
          value: 27.34
        },
        {
          date: "2022-10-01",
          value: 30.01
        },
        {
          date: "2022-11-01",
          value: 23.3
        },
        {
          date: "2022-12-01",
          value: 21.78
        },
        {
          date: "2023-01-01",
          value: 20.17
        },
        {
          date: "2023-02-01",
          value: 20.12
        },
        {
          date: "2023-03-01",
          value: 21.64
        },
        {
          date: "2023-04-01",
          value: 17.82
        },
        {
          date: "2023-05-01",
          value: 17.64
        },
        {
          date: "2023-06-01",
          value: 14
        },
        {
          date: "2023-07-01",
          value: 13.93
        },
        {
          date: "2023-08-01",
          value: 15.85
        },
        {
          date: "2023-09-01",
          value: 15.17
        },
        {
          date: "2023-10-01",
          value: 18.89
        },
        {
          date: "2023-11-01",
          value: 14.02
        },
        {
          date: "2023-12-01",
          value: 12.72
        },
        {
          date: "2024-01-01",
          value: 13.39
        },
        {
          date: "2024-02-01",
          value: 13.98
        },
        {
          date: "2024-03-01",
          value: 13.79
        },
        {
          date: "2024-04-01",
          value: 16.14
        },
        {
          date: "2024-05-01",
          value: 13.06
        },
        {
          date: "2024-06-01",
          value: 12.67
        },
        {
          date: "2024-07-01",
          value: 14.37
        },
        {
          date: "2024-08-01",
          value: 19.31
        },
        {
          date: "2024-09-01",
          value: 17.66
        },
        {
          date: "2024-10-01",
          value: 19.96
        },
        {
          date: "2024-11-01",
          value: 16.02
        },
        {
          date: "2024-12-01",
          value: 15.87
        },
        {
          date: "2025-01-01",
          value: 16.76
        },
        {
          date: "2025-02-01",
          value: 16.97
        },
        {
          date: "2025-03-01",
          value: 21.84
        },
        {
          date: "2025-04-01",
          value: 31.97
        },
        {
          date: "2025-05-01",
          value: 20.46
        },
        {
          date: "2025-06-01",
          value: 18.4
        },
        {
          date: "2025-07-01",
          value: 16.38
        },
        {
          date: "2025-08-01",
          value: 15.75
        },
        {
          date: "2025-09-01",
          value: 15.79
        },
        {
          date: "2025-10-01",
          value: 18.09
        },
        {
          date: "2025-11-01",
          value: 19.77
        },
        {
          date: "2025-12-01",
          value: 15.55
        },
        {
          date: "2026-01-01",
          value: 16.18
        },
        {
          date: "2026-02-01",
          value: 19.21
        },
        {
          date: "2026-03-01",
          value: 25.6
        },
        {
          date: "2026-04-01",
          value: 19.81
        },
        {
          date: "2026-05-01",
          value: 17.24
        },
        {
          date: "2026-06-01",
          value: 17.91
        },
        {
          date: "2026-07-01",
          value: 17.09
        },
        {
          date: "2026-08-01",
          value: 15.29
        }
      ]
    },
    brent: {
      id: "brent",
      fred: "DCOILBRENTEU",
      mode: "level",
      unit: "USD/barel",
      updated: "2026-08-29T10:40:52.114Z",
      last: {
        date: "2026-08-01",
        value: 91.4
      },
      points: [
        {
          date: "2016-09-01",
          value: 46.57
        },
        {
          date: "2016-10-01",
          value: 49.52
        },
        {
          date: "2016-11-01",
          value: 44.73
        },
        {
          date: "2016-12-01",
          value: 53.31
        },
        {
          date: "2017-01-01",
          value: 54.58
        },
        {
          date: "2017-02-01",
          value: 54.87
        },
        {
          date: "2017-03-01",
          value: 51.59
        },
        {
          date: "2017-04-01",
          value: 52.31
        },
        {
          date: "2017-05-01",
          value: 50.33
        },
        {
          date: "2017-06-01",
          value: 46.37
        },
        {
          date: "2017-07-01",
          value: 48.48
        },
        {
          date: "2017-08-01",
          value: 51.7
        },
        {
          date: "2017-09-01",
          value: 56.15
        },
        {
          date: "2017-10-01",
          value: 57.51
        },
        {
          date: "2017-11-01",
          value: 62.71
        },
        {
          date: "2017-12-01",
          value: 64.37
        },
        {
          date: "2018-01-01",
          value: 69.08
        },
        {
          date: "2018-02-01",
          value: 65.32
        },
        {
          date: "2018-03-01",
          value: 66.02
        },
        {
          date: "2018-04-01",
          value: 72.11
        },
        {
          date: "2018-05-01",
          value: 76.98
        },
        {
          date: "2018-06-01",
          value: 74.4
        },
        {
          date: "2018-07-01",
          value: 74.25
        },
        {
          date: "2018-08-01",
          value: 72.53
        },
        {
          date: "2018-09-01",
          value: 78.89
        },
        {
          date: "2018-10-01",
          value: 81.03
        },
        {
          date: "2018-11-01",
          value: 64.75
        },
        {
          date: "2018-12-01",
          value: 57.36
        },
        {
          date: "2019-01-01",
          value: 59.41
        },
        {
          date: "2019-02-01",
          value: 63.96
        },
        {
          date: "2019-03-01",
          value: 66.14
        },
        {
          date: "2019-04-01",
          value: 71.23
        },
        {
          date: "2019-05-01",
          value: 71.32
        },
        {
          date: "2019-06-01",
          value: 64.22
        },
        {
          date: "2019-07-01",
          value: 63.92
        },
        {
          date: "2019-08-01",
          value: 59.04
        },
        {
          date: "2019-09-01",
          value: 62.83
        },
        {
          date: "2019-10-01",
          value: 59.71
        },
        {
          date: "2019-11-01",
          value: 63.21
        },
        {
          date: "2019-12-01",
          value: 67.22
        },
        {
          date: "2020-01-01",
          value: 63.65
        },
        {
          date: "2020-02-01",
          value: 55.66
        },
        {
          date: "2020-03-01",
          value: 32.01
        },
        {
          date: "2020-04-01",
          value: 18.38
        },
        {
          date: "2020-05-01",
          value: 29.38
        },
        {
          date: "2020-06-01",
          value: 40.27
        },
        {
          date: "2020-07-01",
          value: 43.24
        },
        {
          date: "2020-08-01",
          value: 44.74
        },
        {
          date: "2020-09-01",
          value: 40.91
        },
        {
          date: "2020-10-01",
          value: 40.19
        },
        {
          date: "2020-11-01",
          value: 42.69
        },
        {
          date: "2020-12-01",
          value: 49.99
        },
        {
          date: "2021-01-01",
          value: 54.77
        },
        {
          date: "2021-02-01",
          value: 62.28
        },
        {
          date: "2021-03-01",
          value: 65.41
        },
        {
          date: "2021-04-01",
          value: 64.81
        },
        {
          date: "2021-05-01",
          value: 68.53
        },
        {
          date: "2021-06-01",
          value: 73.16
        },
        {
          date: "2021-07-01",
          value: 75.17
        },
        {
          date: "2021-08-01",
          value: 70.75
        },
        {
          date: "2021-09-01",
          value: 74.49
        },
        {
          date: "2021-10-01",
          value: 83.54
        },
        {
          date: "2021-11-01",
          value: 81.05
        },
        {
          date: "2021-12-01",
          value: 74.17
        },
        {
          date: "2022-01-01",
          value: 86.51
        },
        {
          date: "2022-02-01",
          value: 97.13
        },
        {
          date: "2022-03-01",
          value: 117.25
        },
        {
          date: "2022-04-01",
          value: 104.58
        },
        {
          date: "2022-05-01",
          value: 113.34
        },
        {
          date: "2022-06-01",
          value: 122.71
        },
        {
          date: "2022-07-01",
          value: 111.93
        },
        {
          date: "2022-08-01",
          value: 100.45
        },
        {
          date: "2022-09-01",
          value: 89.76
        },
        {
          date: "2022-10-01",
          value: 93.33
        },
        {
          date: "2022-11-01",
          value: 91.42
        },
        {
          date: "2022-12-01",
          value: 80.92
        },
        {
          date: "2023-01-01",
          value: 82.5
        },
        {
          date: "2023-02-01",
          value: 82.59
        },
        {
          date: "2023-03-01",
          value: 78.43
        },
        {
          date: "2023-04-01",
          value: 84.64
        },
        {
          date: "2023-05-01",
          value: 75.47
        },
        {
          date: "2023-06-01",
          value: 74.84
        },
        {
          date: "2023-07-01",
          value: 80.11
        },
        {
          date: "2023-08-01",
          value: 86.15
        },
        {
          date: "2023-09-01",
          value: 93.72
        },
        {
          date: "2023-10-01",
          value: 90.6
        },
        {
          date: "2023-11-01",
          value: 82.94
        },
        {
          date: "2023-12-01",
          value: 77.63
        },
        {
          date: "2024-01-01",
          value: 80.12
        },
        {
          date: "2024-02-01",
          value: 83.48
        },
        {
          date: "2024-03-01",
          value: 85.41
        },
        {
          date: "2024-04-01",
          value: 89.94
        },
        {
          date: "2024-05-01",
          value: 81.75
        },
        {
          date: "2024-06-01",
          value: 82.25
        },
        {
          date: "2024-07-01",
          value: 85.15
        },
        {
          date: "2024-08-01",
          value: 80.36
        },
        {
          date: "2024-09-01",
          value: 74.02
        },
        {
          date: "2024-10-01",
          value: 75.63
        },
        {
          date: "2024-11-01",
          value: 74.35
        },
        {
          date: "2024-12-01",
          value: 73.86
        },
        {
          date: "2025-01-01",
          value: 79.27
        },
        {
          date: "2025-02-01",
          value: 75.44
        },
        {
          date: "2025-03-01",
          value: 72.73
        },
        {
          date: "2025-04-01",
          value: 68.13
        },
        {
          date: "2025-05-01",
          value: 64.45
        },
        {
          date: "2025-06-01",
          value: 71.44
        },
        {
          date: "2025-07-01",
          value: 71.04
        },
        {
          date: "2025-08-01",
          value: 67.87
        },
        {
          date: "2025-09-01",
          value: 67.99
        },
        {
          date: "2025-10-01",
          value: 64.54
        },
        {
          date: "2025-11-01",
          value: 63.8
        },
        {
          date: "2025-12-01",
          value: 62.54
        },
        {
          date: "2026-01-01",
          value: 66.6
        },
        {
          date: "2026-02-01",
          value: 70.89
        },
        {
          date: "2026-03-01",
          value: 103.13
        },
        {
          date: "2026-04-01",
          value: 117.29
        },
        {
          date: "2026-05-01",
          value: 107.14
        },
        {
          date: "2026-06-01",
          value: 85.4
        },
        {
          date: "2026-07-01",
          value: 83.76
        },
        {
          date: "2026-08-01",
          value: 91.4
        }
      ]
    },
    natgas: {
      id: "natgas",
      fred: "DHHNGSP",
      mode: "level",
      unit: "USD/MMBtu",
      updated: "2026-08-29T10:40:53.196Z",
      last: {
        date: "2026-08-01",
        value: 2.77
      },
      points: [
        {
          date: "2016-09-01",
          value: 2.99
        },
        {
          date: "2016-10-01",
          value: 2.98
        },
        {
          date: "2016-11-01",
          value: 2.55
        },
        {
          date: "2016-12-01",
          value: 3.59
        },
        {
          date: "2017-01-01",
          value: 3.3
        },
        {
          date: "2017-02-01",
          value: 2.85
        },
        {
          date: "2017-03-01",
          value: 2.88
        },
        {
          date: "2017-04-01",
          value: 3.1
        },
        {
          date: "2017-05-01",
          value: 3.15
        },
        {
          date: "2017-06-01",
          value: 2.98
        },
        {
          date: "2017-07-01",
          value: 2.98
        },
        {
          date: "2017-08-01",
          value: 2.9
        },
        {
          date: "2017-09-01",
          value: 2.98
        },
        {
          date: "2017-10-01",
          value: 2.88
        },
        {
          date: "2017-11-01",
          value: 3.01
        },
        {
          date: "2017-12-01",
          value: 2.82
        },
        {
          date: "2018-01-01",
          value: 3.88
        },
        {
          date: "2018-02-01",
          value: 2.67
        },
        {
          date: "2018-03-01",
          value: 2.69
        },
        {
          date: "2018-04-01",
          value: 2.8
        },
        {
          date: "2018-05-01",
          value: 2.8
        },
        {
          date: "2018-06-01",
          value: 2.97
        },
        {
          date: "2018-07-01",
          value: 2.83
        },
        {
          date: "2018-08-01",
          value: 2.96
        },
        {
          date: "2018-09-01",
          value: 3
        },
        {
          date: "2018-10-01",
          value: 3.28
        },
        {
          date: "2018-11-01",
          value: 4.09
        },
        {
          date: "2018-12-01",
          value: 4.04
        },
        {
          date: "2019-01-01",
          value: 3.11
        },
        {
          date: "2019-02-01",
          value: 2.69
        },
        {
          date: "2019-03-01",
          value: 2.95
        },
        {
          date: "2019-04-01",
          value: 2.65
        },
        {
          date: "2019-05-01",
          value: 2.64
        },
        {
          date: "2019-06-01",
          value: 2.4
        },
        {
          date: "2019-07-01",
          value: 2.37
        },
        {
          date: "2019-08-01",
          value: 2.22
        },
        {
          date: "2019-09-01",
          value: 2.56
        },
        {
          date: "2019-10-01",
          value: 2.33
        },
        {
          date: "2019-11-01",
          value: 2.64
        },
        {
          date: "2019-12-01",
          value: 2.22
        },
        {
          date: "2020-01-01",
          value: 2.02
        },
        {
          date: "2020-02-01",
          value: 1.91
        },
        {
          date: "2020-03-01",
          value: 1.79
        },
        {
          date: "2020-04-01",
          value: 1.74
        },
        {
          date: "2020-05-01",
          value: 1.75
        },
        {
          date: "2020-06-01",
          value: 1.63
        },
        {
          date: "2020-07-01",
          value: 1.76
        },
        {
          date: "2020-08-01",
          value: 2.3
        },
        {
          date: "2020-09-01",
          value: 1.92
        },
        {
          date: "2020-10-01",
          value: 2.39
        },
        {
          date: "2020-11-01",
          value: 2.61
        },
        {
          date: "2020-12-01",
          value: 2.58
        },
        {
          date: "2021-01-01",
          value: 2.71
        },
        {
          date: "2021-02-01",
          value: 5.35
        },
        {
          date: "2021-03-01",
          value: 2.62
        },
        {
          date: "2021-04-01",
          value: 2.66
        },
        {
          date: "2021-05-01",
          value: 2.91
        },
        {
          date: "2021-06-01",
          value: 3.26
        },
        {
          date: "2021-07-01",
          value: 3.84
        },
        {
          date: "2021-08-01",
          value: 4.07
        },
        {
          date: "2021-09-01",
          value: 5.16
        },
        {
          date: "2021-10-01",
          value: 5.51
        },
        {
          date: "2021-11-01",
          value: 5.05
        },
        {
          date: "2021-12-01",
          value: 3.76
        },
        {
          date: "2022-01-01",
          value: 4.38
        },
        {
          date: "2022-02-01",
          value: 4.69
        },
        {
          date: "2022-03-01",
          value: 4.9
        },
        {
          date: "2022-04-01",
          value: 6.6
        },
        {
          date: "2022-05-01",
          value: 8.14
        },
        {
          date: "2022-06-01",
          value: 7.7
        },
        {
          date: "2022-07-01",
          value: 7.28
        },
        {
          date: "2022-08-01",
          value: 8.81
        },
        {
          date: "2022-09-01",
          value: 7.88
        },
        {
          date: "2022-10-01",
          value: 5.66
        },
        {
          date: "2022-11-01",
          value: 5.45
        },
        {
          date: "2022-12-01",
          value: 5.53
        },
        {
          date: "2023-01-01",
          value: 3.27
        },
        {
          date: "2023-02-01",
          value: 2.38
        },
        {
          date: "2023-03-01",
          value: 2.31
        },
        {
          date: "2023-04-01",
          value: 2.16
        },
        {
          date: "2023-05-01",
          value: 2.15
        },
        {
          date: "2023-06-01",
          value: 2.18
        },
        {
          date: "2023-07-01",
          value: 2.55
        },
        {
          date: "2023-08-01",
          value: 2.58
        },
        {
          date: "2023-09-01",
          value: 2.64
        },
        {
          date: "2023-10-01",
          value: 2.98
        },
        {
          date: "2023-11-01",
          value: 2.71
        },
        {
          date: "2023-12-01",
          value: 2.52
        },
        {
          date: "2024-01-01",
          value: 3.18
        },
        {
          date: "2024-02-01",
          value: 1.72
        },
        {
          date: "2024-03-01",
          value: 1.49
        },
        {
          date: "2024-04-01",
          value: 1.6
        },
        {
          date: "2024-05-01",
          value: 2.12
        },
        {
          date: "2024-06-01",
          value: 2.54
        },
        {
          date: "2024-07-01",
          value: 2.08
        },
        {
          date: "2024-08-01",
          value: 1.99
        },
        {
          date: "2024-09-01",
          value: 2.28
        },
        {
          date: "2024-10-01",
          value: 2.2
        },
        {
          date: "2024-11-01",
          value: 2.12
        },
        {
          date: "2024-12-01",
          value: 3.01
        },
        {
          date: "2025-01-01",
          value: 4.13
        },
        {
          date: "2025-02-01",
          value: 4.19
        },
        {
          date: "2025-03-01",
          value: 4.12
        },
        {
          date: "2025-04-01",
          value: 3.42
        },
        {
          date: "2025-05-01",
          value: 3.12
        },
        {
          date: "2025-06-01",
          value: 3.02
        },
        {
          date: "2025-07-01",
          value: 3.2
        },
        {
          date: "2025-08-01",
          value: 2.91
        },
        {
          date: "2025-09-01",
          value: 2.97
        },
        {
          date: "2025-10-01",
          value: 3.19
        },
        {
          date: "2025-11-01",
          value: 3.79
        },
        {
          date: "2025-12-01",
          value: 4.26
        },
        {
          date: "2026-01-01",
          value: 7.72
        },
        {
          date: "2026-02-01",
          value: 3.62
        },
        {
          date: "2026-03-01",
          value: 3.04
        },
        {
          date: "2026-04-01",
          value: 2.77
        },
        {
          date: "2026-05-01",
          value: 2.94
        },
        {
          date: "2026-06-01",
          value: 3.14
        },
        {
          date: "2026-07-01",
          value: 2.89
        },
        {
          date: "2026-08-01",
          value: 2.77
        }
      ]
    },
    copper: {
      id: "copper",
      fred: "PCOPPUSDM",
      mode: "level",
      unit: "USD/ton",
      updated: "2026-08-29T10:40:53.576Z",
      last: {
        date: "2026-07-01",
        value: 13542.82
      },
      points: [
        {
          date: "2016-08-01",
          value: 4751.67
        },
        {
          date: "2016-09-01",
          value: 4722.2
        },
        {
          date: "2016-10-01",
          value: 4731.26
        },
        {
          date: "2016-11-01",
          value: 5450.93
        },
        {
          date: "2016-12-01",
          value: 5660.35
        },
        {
          date: "2017-01-01",
          value: 5754.56
        },
        {
          date: "2017-02-01",
          value: 5940.91
        },
        {
          date: "2017-03-01",
          value: 5824.63
        },
        {
          date: "2017-04-01",
          value: 5683.9
        },
        {
          date: "2017-05-01",
          value: 5599.56
        },
        {
          date: "2017-06-01",
          value: 5719.76
        },
        {
          date: "2017-07-01",
          value: 5985.12
        },
        {
          date: "2017-08-01",
          value: 6485.63
        },
        {
          date: "2017-09-01",
          value: 6577.17
        },
        {
          date: "2017-10-01",
          value: 6807.6
        },
        {
          date: "2017-11-01",
          value: 6826.55
        },
        {
          date: "2017-12-01",
          value: 6833.89
        },
        {
          date: "2018-01-01",
          value: 7065.85
        },
        {
          date: "2018-02-01",
          value: 7006.53
        },
        {
          date: "2018-03-01",
          value: 6799.18
        },
        {
          date: "2018-04-01",
          value: 6851.51
        },
        {
          date: "2018-05-01",
          value: 6825.27
        },
        {
          date: "2018-06-01",
          value: 6965.86
        },
        {
          date: "2018-07-01",
          value: 6250.75
        },
        {
          date: "2018-08-01",
          value: 6051.05
        },
        {
          date: "2018-09-01",
          value: 6050.76
        },
        {
          date: "2018-10-01",
          value: 6219.59
        },
        {
          date: "2018-11-01",
          value: 6195.92
        },
        {
          date: "2018-12-01",
          value: 6075.32
        },
        {
          date: "2019-01-01",
          value: 5939.1
        },
        {
          date: "2019-02-01",
          value: 6300.49
        },
        {
          date: "2019-03-01",
          value: 6439.46
        },
        {
          date: "2019-04-01",
          value: 6438.36
        },
        {
          date: "2019-05-01",
          value: 6017.9
        },
        {
          date: "2019-06-01",
          value: 5882.23
        },
        {
          date: "2019-07-01",
          value: 5941.2
        },
        {
          date: "2019-08-01",
          value: 5709.44
        },
        {
          date: "2019-09-01",
          value: 5759.25
        },
        {
          date: "2019-10-01",
          value: 5757.3
        },
        {
          date: "2019-11-01",
          value: 5859.95
        },
        {
          date: "2019-12-01",
          value: 6077.06
        },
        {
          date: "2020-01-01",
          value: 6031.21
        },
        {
          date: "2020-02-01",
          value: 5687.75
        },
        {
          date: "2020-03-01",
          value: 5182.63
        },
        {
          date: "2020-04-01",
          value: 5057.97
        },
        {
          date: "2020-05-01",
          value: 5239.83
        },
        {
          date: "2020-06-01",
          value: 5754.6
        },
        {
          date: "2020-07-01",
          value: 6372.46
        },
        {
          date: "2020-08-01",
          value: 6508.39
        },
        {
          date: "2020-09-01",
          value: 6704.9
        },
        {
          date: "2020-10-01",
          value: 6713.81
        },
        {
          date: "2020-11-01",
          value: 7068.91
        },
        {
          date: "2020-12-01",
          value: 7772.24
        },
        {
          date: "2021-01-01",
          value: 7972.15
        },
        {
          date: "2021-02-01",
          value: 8470.94
        },
        {
          date: "2021-03-01",
          value: 8988.25
        },
        {
          date: "2021-04-01",
          value: 9324.82
        },
        {
          date: "2021-05-01",
          value: 10166.29
        },
        {
          date: "2021-06-01",
          value: 9631.5
        },
        {
          date: "2021-07-01",
          value: 9450.82
        },
        {
          date: "2021-08-01",
          value: 9370.14
        },
        {
          date: "2021-09-01",
          value: 9324.71
        },
        {
          date: "2021-10-01",
          value: 9829.22
        },
        {
          date: "2021-11-01",
          value: 9728.9
        },
        {
          date: "2021-12-01",
          value: 9551.18
        },
        {
          date: "2022-01-01",
          value: 9782.34
        },
        {
          date: "2022-02-01",
          value: 9943.17
        },
        {
          date: "2022-03-01",
          value: 10230.89
        },
        {
          date: "2022-04-01",
          value: 10174.35
        },
        {
          date: "2022-05-01",
          value: 9395.03
        },
        {
          date: "2022-06-01",
          value: 9067.55
        },
        {
          date: "2022-07-01",
          value: 7544.81
        },
        {
          date: "2022-08-01",
          value: 7990.81
        },
        {
          date: "2022-09-01",
          value: 7746.01
        },
        {
          date: "2022-10-01",
          value: 7651.08
        },
        {
          date: "2022-11-01",
          value: 8049.86
        },
        {
          date: "2022-12-01",
          value: 8371.09
        },
        {
          date: "2023-01-01",
          value: 9007.35
        },
        {
          date: "2023-02-01",
          value: 8936.59
        },
        {
          date: "2023-03-01",
          value: 8856.31
        },
        {
          date: "2023-04-01",
          value: 8809.16
        },
        {
          date: "2023-05-01",
          value: 8243.16
        },
        {
          date: "2023-06-01",
          value: 8396.52
        },
        {
          date: "2023-07-01",
          value: 8476.68
        },
        {
          date: "2023-08-01",
          value: 8347.83
        },
        {
          date: "2023-09-01",
          value: 8276.71
        },
        {
          date: "2023-10-01",
          value: 7941.36
        },
        {
          date: "2023-11-01",
          value: 8189.59
        },
        {
          date: "2023-12-01",
          value: 8407.9
        },
        {
          date: "2024-01-01",
          value: 8351.34
        },
        {
          date: "2024-02-01",
          value: 8304.95
        },
        {
          date: "2024-03-01",
          value: 8692.82
        },
        {
          date: "2024-04-01",
          value: 9445.59
        },
        {
          date: "2024-05-01",
          value: 10117.16
        },
        {
          date: "2024-06-01",
          value: 9648.17
        },
        {
          date: "2024-07-01",
          value: 9385.31
        },
        {
          date: "2024-08-01",
          value: 8981.12
        },
        {
          date: "2024-09-01",
          value: 9259.13
        },
        {
          date: "2024-10-01",
          value: 9533.99
        },
        {
          date: "2024-11-01",
          value: 9075.73
        },
        {
          date: "2024-12-01",
          value: 8909.91
        },
        {
          date: "2025-01-01",
          value: 8976.68
        },
        {
          date: "2025-02-01",
          value: 9330.98
        },
        {
          date: "2025-03-01",
          value: 9735.82
        },
        {
          date: "2025-04-01",
          value: 9172.7
        },
        {
          date: "2025-05-01",
          value: 9531.2
        },
        {
          date: "2025-06-01",
          value: 9835.07
        },
        {
          date: "2025-07-01",
          value: 9770.58
        },
        {
          date: "2025-08-01",
          value: 9671.88
        },
        {
          date: "2025-09-01",
          value: 9994.77
        },
        {
          date: "2025-10-01",
          value: 10739.92
        },
        {
          date: "2025-11-01",
          value: 10812.03
        },
        {
          date: "2025-12-01",
          value: 11790.96
        },
        {
          date: "2026-01-01",
          value: 12986.61
        },
        {
          date: "2026-02-01",
          value: 12951.35
        },
        {
          date: "2026-03-01",
          value: 12528.71
        },
        {
          date: "2026-04-01",
          value: 12890.69
        },
        {
          date: "2026-05-01",
          value: 13512.16
        },
        {
          date: "2026-06-01",
          value: 13552.04
        },
        {
          date: "2026-07-01",
          value: 13542.82
        }
      ]
    },
    claims: {
      id: "claims",
      fred: "ICNSA",
      mode: "level",
      unit: "orang",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-08-01",
        value: 204e3
      },
      points: [
        {
          date: "2016-09-01",
          value: 203777.5
        },
        {
          date: "2016-10-01",
          value: 231147
        },
        {
          date: "2016-11-01",
          value: 254986.5
        },
        {
          date: "2016-12-01",
          value: 333138
        },
        {
          date: "2017-01-01",
          value: 333138.5
        },
        {
          date: "2017-02-01",
          value: 239437.5
        },
        {
          date: "2017-03-01",
          value: 229787
        },
        {
          date: "2017-04-01",
          value: 225320
        },
        {
          date: "2017-05-01",
          value: 216156.75
        },
        {
          date: "2017-06-01",
          value: 228966.5
        },
        {
          date: "2017-07-01",
          value: 242841.8
        },
        {
          date: "2017-08-01",
          value: 200390.25
        },
        {
          date: "2017-09-01",
          value: 218406
        },
        {
          date: "2017-10-01",
          value: 216703.5
        },
        {
          date: "2017-11-01",
          value: 244655
        },
        {
          date: "2017-12-01",
          value: 314453.2
        },
        {
          date: "2018-01-01",
          value: 321816.75
        },
        {
          date: "2018-02-01",
          value: 221394.25
        },
        {
          date: "2018-03-01",
          value: 205243.4
        },
        {
          date: "2018-04-01",
          value: 211109.75
        },
        {
          date: "2018-05-01",
          value: 198841.25
        },
        {
          date: "2018-06-01",
          value: 213828
        },
        {
          date: "2018-07-01",
          value: 219568.75
        },
        {
          date: "2018-08-01",
          value: 178572
        },
        {
          date: "2018-09-01",
          value: 170923.4
        },
        {
          date: "2018-10-01",
          value: 195425
        },
        {
          date: "2018-11-01",
          value: 224007.25
        },
        {
          date: "2018-12-01",
          value: 290725
        },
        {
          date: "2019-01-01",
          value: 303577
        },
        {
          date: "2019-02-01",
          value: 227688.25
        },
        {
          date: "2019-03-01",
          value: 199595
        },
        {
          date: "2019-04-01",
          value: 202238
        },
        {
          date: "2019-05-01",
          value: 195605.5
        },
        {
          date: "2019-06-01",
          value: 213213.6
        },
        {
          date: "2019-07-01",
          value: 212723.75
        },
        {
          date: "2019-08-01",
          value: 178912.4
        },
        {
          date: "2019-09-01",
          value: 170459.5
        },
        {
          date: "2019-10-01",
          value: 193816
        },
        {
          date: "2019-11-01",
          value: 228353.6
        },
        {
          date: "2019-12-01",
          value: 297045
        },
        {
          date: "2020-01-01",
          value: 295816.5
        },
        {
          date: "2020-02-01",
          value: 213741.6
        },
        {
          date: "2020-03-01",
          value: 233697375e-2
        },
        {
          date: "2020-04-01",
          value: 4686939
        },
        {
          date: "2020-05-01",
          value: 21584972e-1
        },
        {
          date: "2020-06-01",
          value: 14710805e-1
        },
        {
          date: "2020-07-01",
          value: 1368789
        },
        {
          date: "2020-08-01",
          value: 866361.8
        },
        {
          date: "2020-09-01",
          value: 796900.75
        },
        {
          date: "2020-10-01",
          value: 753800
        },
        {
          date: "2020-11-01",
          value: 741695.25
        },
        {
          date: "2020-12-01",
          value: 887973.5
        },
        {
          date: "2021-01-01",
          value: 917776.6
        },
        {
          date: "2021-02-01",
          value: 786140.75
        },
        {
          date: "2021-03-01",
          value: 699160.5
        },
        {
          date: "2021-04-01",
          value: 620849.75
        },
        {
          date: "2021-05-01",
          value: 459351.8
        },
        {
          date: "2021-06-01",
          value: 382889.75
        },
        {
          date: "2021-07-01",
          value: 369959.2
        },
        {
          date: "2021-08-01",
          value: 305621.5
        },
        {
          date: "2021-09-01",
          value: 289827.25
        },
        {
          date: "2021-10-01",
          value: 257753.2
        },
        {
          date: "2021-11-01",
          value: 241725
        },
        {
          date: "2021-12-01",
          value: 265293
        },
        {
          date: "2022-01-01",
          value: 318591.6
        },
        {
          date: "2022-02-01",
          value: 221266.25
        },
        {
          date: "2022-03-01",
          value: 201172.25
        },
        {
          date: "2022-04-01",
          value: 203003
        },
        {
          date: "2022-05-01",
          value: 189146.75
        },
        {
          date: "2022-06-01",
          value: 201447.75
        },
        {
          date: "2022-07-01",
          value: 219301.6
        },
        {
          date: "2022-08-01",
          value: 184194.25
        },
        {
          date: "2022-09-01",
          value: 161778
        },
        {
          date: "2022-10-01",
          value: 182976.8
        },
        {
          date: "2022-11-01",
          value: 213724.25
        },
        {
          date: "2022-12-01",
          value: 266964.4
        },
        {
          date: "2023-01-01",
          value: 272706
        },
        {
          date: "2023-02-01",
          value: 217520.5
        },
        {
          date: "2023-03-01",
          value: 214746.75
        },
        {
          date: "2023-04-01",
          value: 206141.4
        },
        {
          date: "2023-05-01",
          value: 203381.5
        },
        {
          date: "2023-06-01",
          value: 237577.25
        },
        {
          date: "2023-07-01",
          value: 237429
        },
        {
          date: "2023-08-01",
          value: 208669.5
        },
        {
          date: "2023-09-01",
          value: 178776.8
        },
        {
          date: "2023-10-01",
          value: 193860.5
        },
        {
          date: "2023-11-01",
          value: 218084.75
        },
        {
          date: "2023-12-01",
          value: 265800.2
        },
        {
          date: "2024-01-01",
          value: 281025.5
        },
        {
          date: "2024-02-01",
          value: 213413.75
        },
        {
          date: "2024-03-01",
          value: 200038.6
        },
        {
          date: "2024-04-01",
          value: 204145.5
        },
        {
          date: "2024-05-01",
          value: 199402.75
        },
        {
          date: "2024-06-01",
          value: 224947.2
        },
        {
          date: "2024-07-01",
          value: 241324.5
        },
        {
          date: "2024-08-01",
          value: 196144
        },
        {
          date: "2024-09-01",
          value: 182104.75
        },
        {
          date: "2024-10-01",
          value: 216579.75
        },
        {
          date: "2024-11-01",
          value: 222877.8
        },
        {
          date: "2024-12-01",
          value: 280353.5
        },
        {
          date: "2025-01-01",
          value: 293002.25
        },
        {
          date: "2025-02-01",
          value: 229547.75
        },
        {
          date: "2025-03-01",
          value: 209481
        },
        {
          date: "2025-04-01",
          value: 218083.25
        },
        {
          date: "2025-05-01",
          value: 205719.6
        },
        {
          date: "2025-06-01",
          value: 234186.75
        },
        {
          date: "2025-07-01",
          value: 23e4
        },
        {
          date: "2025-08-01",
          value: 226e3
        },
        {
          date: "2025-09-01",
          value: 25e4
        },
        {
          date: "2025-10-01",
          value: 206641.5
        },
        {
          date: "2025-11-01",
          value: 232e3
        },
        {
          date: "2025-12-01",
          value: 213500
        },
        {
          date: "2026-01-01",
          value: 208e3
        },
        {
          date: "2026-02-01",
          value: 229e3
        },
        {
          date: "2026-03-01",
          value: 213e3
        },
        {
          date: "2026-04-01",
          value: 219e3
        },
        {
          date: "2026-05-01",
          value: 2e5
        },
        {
          date: "2026-06-01",
          value: 227e3
        },
        {
          date: "2026-07-01",
          value: 212667
        },
        {
          date: "2026-08-01",
          value: 204e3
        }
      ]
    },
    capacity: {
      id: "capacity",
      fred: "TCU",
      mode: "level",
      unit: "%",
      updated: "2026-08-29T10:40:54.381Z",
      last: {
        date: "2026-07-01",
        value: 76.29
      },
      points: [
        {
          date: "2016-08-01",
          value: 75.43
        },
        {
          date: "2016-09-01",
          value: 75.31
        },
        {
          date: "2016-10-01",
          value: 75.29
        },
        {
          date: "2016-11-01",
          value: 74.95
        },
        {
          date: "2016-12-01",
          value: 75.44
        },
        {
          date: "2017-01-01",
          value: 75.23
        },
        {
          date: "2017-02-01",
          value: 74.93
        },
        {
          date: "2017-03-01",
          value: 75.44
        },
        {
          date: "2017-04-01",
          value: 76.24
        },
        {
          date: "2017-05-01",
          value: 76.37
        },
        {
          date: "2017-06-01",
          value: 76.58
        },
        {
          date: "2017-07-01",
          value: 76.45
        },
        {
          date: "2017-08-01",
          value: 76.21
        },
        {
          date: "2017-09-01",
          value: 76.36
        },
        {
          date: "2017-10-01",
          value: 77.38
        },
        {
          date: "2017-11-01",
          value: 77.63
        },
        {
          date: "2017-12-01",
          value: 77.85
        },
        {
          date: "2018-01-01",
          value: 77.91
        },
        {
          date: "2018-02-01",
          value: 78.15
        },
        {
          date: "2018-03-01",
          value: 78.57
        },
        {
          date: "2018-04-01",
          value: 79.46
        },
        {
          date: "2018-05-01",
          value: 78.75
        },
        {
          date: "2018-06-01",
          value: 79.36
        },
        {
          date: "2018-07-01",
          value: 79.46
        },
        {
          date: "2018-08-01",
          value: 79.93
        },
        {
          date: "2018-09-01",
          value: 79.93
        },
        {
          date: "2018-10-01",
          value: 79.78
        },
        {
          date: "2018-11-01",
          value: 79.77
        },
        {
          date: "2018-12-01",
          value: 79.71
        },
        {
          date: "2019-01-01",
          value: 79.1
        },
        {
          date: "2019-02-01",
          value: 78.59
        },
        {
          date: "2019-03-01",
          value: 78.53
        },
        {
          date: "2019-04-01",
          value: 77.99
        },
        {
          date: "2019-05-01",
          value: 78
        },
        {
          date: "2019-06-01",
          value: 77.95
        },
        {
          date: "2019-07-01",
          value: 77.49
        },
        {
          date: "2019-08-01",
          value: 77.95
        },
        {
          date: "2019-09-01",
          value: 77.62
        },
        {
          date: "2019-10-01",
          value: 76.91
        },
        {
          date: "2019-11-01",
          value: 77.25
        },
        {
          date: "2019-12-01",
          value: 77.04
        },
        {
          date: "2020-01-01",
          value: 76.52
        },
        {
          date: "2020-02-01",
          value: 76.78
        },
        {
          date: "2020-03-01",
          value: 73.79
        },
        {
          date: "2020-04-01",
          value: 64.08
        },
        {
          date: "2020-05-01",
          value: 65.19
        },
        {
          date: "2020-06-01",
          value: 69.52
        },
        {
          date: "2020-07-01",
          value: 72.21
        },
        {
          date: "2020-08-01",
          value: 73.02
        },
        {
          date: "2020-09-01",
          value: 73.15
        },
        {
          date: "2020-10-01",
          value: 73.86
        },
        {
          date: "2020-11-01",
          value: 74.26
        },
        {
          date: "2020-12-01",
          value: 75.39
        },
        {
          date: "2021-01-01",
          value: 75.94
        },
        {
          date: "2021-02-01",
          value: 73.57
        },
        {
          date: "2021-03-01",
          value: 75.85
        },
        {
          date: "2021-04-01",
          value: 76.12
        },
        {
          date: "2021-05-01",
          value: 76.93
        },
        {
          date: "2021-06-01",
          value: 77.34
        },
        {
          date: "2021-07-01",
          value: 77.8
        },
        {
          date: "2021-08-01",
          value: 77.73
        },
        {
          date: "2021-09-01",
          value: 76.89
        },
        {
          date: "2021-10-01",
          value: 77.98
        },
        {
          date: "2021-11-01",
          value: 78.56
        },
        {
          date: "2021-12-01",
          value: 78.37
        },
        {
          date: "2022-01-01",
          value: 78.09
        },
        {
          date: "2022-02-01",
          value: 78.58
        },
        {
          date: "2022-03-01",
          value: 79.03
        },
        {
          date: "2022-04-01",
          value: 79.04
        },
        {
          date: "2022-05-01",
          value: 78.92
        },
        {
          date: "2022-06-01",
          value: 78.63
        },
        {
          date: "2022-07-01",
          value: 78.72
        },
        {
          date: "2022-08-01",
          value: 78.54
        },
        {
          date: "2022-09-01",
          value: 78.61
        },
        {
          date: "2022-10-01",
          value: 78.48
        },
        {
          date: "2022-11-01",
          value: 78.15
        },
        {
          date: "2022-12-01",
          value: 77.13
        },
        {
          date: "2023-01-01",
          value: 77.6
        },
        {
          date: "2023-02-01",
          value: 77.61
        },
        {
          date: "2023-03-01",
          value: 77.8
        },
        {
          date: "2023-04-01",
          value: 77.89
        },
        {
          date: "2023-05-01",
          value: 77.55
        },
        {
          date: "2023-06-01",
          value: 76.85
        },
        {
          date: "2023-07-01",
          value: 77.38
        },
        {
          date: "2023-08-01",
          value: 77.26
        },
        {
          date: "2023-09-01",
          value: 77.34
        },
        {
          date: "2023-10-01",
          value: 76.86
        },
        {
          date: "2023-11-01",
          value: 77.11
        },
        {
          date: "2023-12-01",
          value: 76.86
        },
        {
          date: "2024-01-01",
          value: 75.75
        },
        {
          date: "2024-02-01",
          value: 76.52
        },
        {
          date: "2024-03-01",
          value: 76.6
        },
        {
          date: "2024-04-01",
          value: 76.38
        },
        {
          date: "2024-05-01",
          value: 76.8
        },
        {
          date: "2024-06-01",
          value: 76.76
        },
        {
          date: "2024-07-01",
          value: 75.99
        },
        {
          date: "2024-08-01",
          value: 76.27
        },
        {
          date: "2024-09-01",
          value: 75.72
        },
        {
          date: "2024-10-01",
          value: 75.39
        },
        {
          date: "2024-11-01",
          value: 75.17
        },
        {
          date: "2024-12-01",
          value: 75.87
        },
        {
          date: "2025-01-01",
          value: 75.58
        },
        {
          date: "2025-02-01",
          value: 76.27
        },
        {
          date: "2025-03-01",
          value: 76.13
        },
        {
          date: "2025-04-01",
          value: 76.1
        },
        {
          date: "2025-05-01",
          value: 75.89
        },
        {
          date: "2025-06-01",
          value: 76.18
        },
        {
          date: "2025-07-01",
          value: 76.4
        },
        {
          date: "2025-08-01",
          value: 76.11
        },
        {
          date: "2025-09-01",
          value: 76.05
        },
        {
          date: "2025-10-01",
          value: 75.62
        },
        {
          date: "2025-11-01",
          value: 75.39
        },
        {
          date: "2025-12-01",
          value: 75.64
        },
        {
          date: "2026-01-01",
          value: 75.24
        },
        {
          date: "2026-02-01",
          value: 75.81
        },
        {
          date: "2026-03-01",
          value: 75.63
        },
        {
          date: "2026-04-01",
          value: 76.14
        },
        {
          date: "2026-05-01",
          value: 76.06
        },
        {
          date: "2026-06-01",
          value: 76.2
        },
        {
          date: "2026-07-01",
          value: 76.29
        }
      ]
    },
    eu_gdp: {
      id: "eu_gdp",
      fred: "CLVMNACSCAB1GQEA19",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-29T10:40:54.696Z",
      last: {
        date: "2026-04-01",
        value: 0.94
      },
      points: [
        {
          date: "2008-01-01",
          value: 2.22
        },
        {
          date: "2008-04-01",
          value: 1.03
        },
        {
          date: "2008-07-01",
          value: 0.1
        },
        {
          date: "2008-10-01",
          value: -2.12
        },
        {
          date: "2009-01-01",
          value: -5.72
        },
        {
          date: "2009-04-01",
          value: -5.24
        },
        {
          date: "2009-07-01",
          value: -4.36
        },
        {
          date: "2009-10-01",
          value: -2.26
        },
        {
          date: "2010-01-01",
          value: 1.22
        },
        {
          date: "2010-04-01",
          value: 2.17
        },
        {
          date: "2010-07-01",
          value: 2.24
        },
        {
          date: "2010-10-01",
          value: 2.39
        },
        {
          date: "2011-01-01",
          value: 2.96
        },
        {
          date: "2011-04-01",
          value: 1.98
        },
        {
          date: "2011-07-01",
          value: 1.56
        },
        {
          date: "2011-10-01",
          value: 0.67
        },
        {
          date: "2012-01-01",
          value: -0.52
        },
        {
          date: "2012-04-01",
          value: -0.87
        },
        {
          date: "2012-07-01",
          value: -1.02
        },
        {
          date: "2012-10-01",
          value: -1.16
        },
        {
          date: "2013-01-01",
          value: -1.25
        },
        {
          date: "2013-04-01",
          value: -0.25
        },
        {
          date: "2013-07-01",
          value: 0.18
        },
        {
          date: "2013-10-01",
          value: 0.83
        },
        {
          date: "2014-01-01",
          value: 1.65
        },
        {
          date: "2014-04-01",
          value: 1.22
        },
        {
          date: "2014-07-01",
          value: 1.41
        },
        {
          date: "2014-10-01",
          value: 1.57
        },
        {
          date: "2015-01-01",
          value: 1.87
        },
        {
          date: "2015-04-01",
          value: 2.06
        },
        {
          date: "2015-07-01",
          value: 1.99
        },
        {
          date: "2015-10-01",
          value: 2.11
        },
        {
          date: "2016-01-01",
          value: 1.81
        },
        {
          date: "2016-04-01",
          value: 1.58
        },
        {
          date: "2016-07-01",
          value: 1.65
        },
        {
          date: "2016-10-01",
          value: 1.97
        },
        {
          date: "2017-01-01",
          value: 2.25
        },
        {
          date: "2017-04-01",
          value: 2.76
        },
        {
          date: "2017-07-01",
          value: 3.03
        },
        {
          date: "2017-10-01",
          value: 3.04
        },
        {
          date: "2018-01-01",
          value: 2.27
        },
        {
          date: "2018-04-01",
          value: 2.11
        },
        {
          date: "2018-07-01",
          value: 1.44
        },
        {
          date: "2018-10-01",
          value: 1.16
        },
        {
          date: "2019-01-01",
          value: 1.87
        },
        {
          date: "2019-04-01",
          value: 1.68
        },
        {
          date: "2019-07-01",
          value: 1.82
        },
        {
          date: "2019-10-01",
          value: 1.16
        },
        {
          date: "2020-01-01",
          value: -2.79
        },
        {
          date: "2020-04-01",
          value: -13.9
        },
        {
          date: "2020-07-01",
          value: -4.15
        },
        {
          date: "2020-10-01",
          value: -3.77
        },
        {
          date: "2021-01-01",
          value: 0.24
        },
        {
          date: "2021-04-01",
          value: 15.24
        },
        {
          date: "2021-07-01",
          value: 5.17
        },
        {
          date: "2021-10-01",
          value: 5.64
        },
        {
          date: "2022-01-01",
          value: 5.53
        },
        {
          date: "2022-04-01",
          value: 4.27
        },
        {
          date: "2022-07-01",
          value: 2.96
        },
        {
          date: "2022-10-01",
          value: 2.16
        },
        {
          date: "2023-01-01",
          value: 1.29
        },
        {
          date: "2023-04-01",
          value: 0.54
        },
        {
          date: "2023-07-01",
          value: 0.14
        },
        {
          date: "2023-10-01",
          value: 0.2
        },
        {
          date: "2024-01-01",
          value: 0.69
        },
        {
          date: "2024-04-01",
          value: 0.69
        },
        {
          date: "2024-07-01",
          value: 1.05
        },
        {
          date: "2024-10-01",
          value: 1.35
        },
        {
          date: "2025-01-01",
          value: 1.57
        },
        {
          date: "2025-04-01",
          value: 1.35
        },
        {
          date: "2025-07-01",
          value: 1.16
        },
        {
          date: "2025-10-01",
          value: 1.05
        },
        {
          date: "2026-01-01",
          value: 0.48
        },
        {
          date: "2026-04-01",
          value: 0.94
        }
      ]
    },
    china_cpi: {
      id: "china_cpi",
      fred: "CHNCPIALLMINMEI",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-29T10:40:55.042Z",
      last: {
        date: "2025-04-01",
        value: -0.07
      },
      points: [
        {
          date: "2015-05-01",
          value: 1.22
        },
        {
          date: "2015-06-01",
          value: 1.32
        },
        {
          date: "2015-07-01",
          value: 1.73
        },
        {
          date: "2015-08-01",
          value: 2.03
        },
        {
          date: "2015-09-01",
          value: 1.62
        },
        {
          date: "2015-10-01",
          value: 1.21
        },
        {
          date: "2015-11-01",
          value: 1.52
        },
        {
          date: "2015-12-01",
          value: 1.62
        },
        {
          date: "2016-01-01",
          value: 1.81
        },
        {
          date: "2016-02-01",
          value: 2.19
        },
        {
          date: "2016-03-01",
          value: 2.3
        },
        {
          date: "2016-04-01",
          value: 2.31
        },
        {
          date: "2016-05-01",
          value: 2.11
        },
        {
          date: "2016-06-01",
          value: 1.91
        },
        {
          date: "2016-07-01",
          value: 1.7
        },
        {
          date: "2016-08-01",
          value: 1.29
        },
        {
          date: "2016-09-01",
          value: 1.89
        },
        {
          date: "2016-10-01",
          value: 2.2
        },
        {
          date: "2016-11-01",
          value: 2.3
        },
        {
          date: "2016-12-01",
          value: 1.99
        },
        {
          date: "2017-01-01",
          value: 2.57
        },
        {
          date: "2017-02-01",
          value: 0.78
        },
        {
          date: "2017-03-01",
          value: 0.98
        },
        {
          date: "2017-04-01",
          value: 1.18
        },
        {
          date: "2017-05-01",
          value: 1.67
        },
        {
          date: "2017-06-01",
          value: 1.68
        },
        {
          date: "2017-07-01",
          value: 1.38
        },
        {
          date: "2017-08-01",
          value: 1.77
        },
        {
          date: "2017-09-01",
          value: 1.66
        },
        {
          date: "2017-10-01",
          value: 1.86
        },
        {
          date: "2017-11-01",
          value: 1.76
        },
        {
          date: "2017-12-01",
          value: 1.85
        },
        {
          date: "2018-01-01",
          value: 1.45
        },
        {
          date: "2018-02-01",
          value: 2.9
        },
        {
          date: "2018-03-01",
          value: 2.03
        },
        {
          date: "2018-04-01",
          value: 1.84
        },
        {
          date: "2018-05-01",
          value: 1.55
        },
        {
          date: "2018-06-01",
          value: 1.75
        },
        {
          date: "2018-07-01",
          value: 2.14
        },
        {
          date: "2018-08-01",
          value: 2.32
        },
        {
          date: "2018-09-01",
          value: 2.4
        },
        {
          date: "2018-10-01",
          value: 2.5
        },
        {
          date: "2018-11-01",
          value: 2.11
        },
        {
          date: "2018-12-01",
          value: 1.91
        },
        {
          date: "2019-01-01",
          value: 1.71
        },
        {
          date: "2019-02-01",
          value: 1.5
        },
        {
          date: "2019-03-01",
          value: 2.28
        },
        {
          date: "2019-04-01",
          value: 2.57
        },
        {
          date: "2019-05-01",
          value: 2.76
        },
        {
          date: "2019-06-01",
          value: 2.67
        },
        {
          date: "2019-07-01",
          value: 2.76
        },
        {
          date: "2019-08-01",
          value: 2.83
        },
        {
          date: "2019-09-01",
          value: 3
        },
        {
          date: "2019-10-01",
          value: 3.75
        },
        {
          date: "2019-11-01",
          value: 4.51
        },
        {
          date: "2019-12-01",
          value: 4.41
        },
        {
          date: "2020-01-01",
          value: 5.42
        },
        {
          date: "2020-02-01",
          value: 5.18
        },
        {
          date: "2020-03-01",
          value: 4.27
        },
        {
          date: "2020-04-01",
          value: 3.25
        },
        {
          date: "2020-05-01",
          value: 2.41
        },
        {
          date: "2020-06-01",
          value: 2.51
        },
        {
          date: "2020-07-01",
          value: 1.76
        },
        {
          date: "2020-08-01",
          value: 2.39
        },
        {
          date: "2020-09-01",
          value: 1.73
        },
        {
          date: "2020-10-01",
          value: 0.54
        },
        {
          date: "2020-11-01",
          value: -0.45
        },
        {
          date: "2020-12-01",
          value: 0.27
        },
        {
          date: "2021-01-01",
          value: -0.22
        },
        {
          date: "2021-02-01",
          value: -0.42
        },
        {
          date: "2021-03-01",
          value: 0.32
        },
        {
          date: "2021-04-01",
          value: 0.92
        },
        {
          date: "2021-05-01",
          value: 1.64
        },
        {
          date: "2021-06-01",
          value: 1.24
        },
        {
          date: "2021-07-01",
          value: 1.91
        },
        {
          date: "2021-08-01",
          value: 0.64
        },
        {
          date: "2021-09-01",
          value: 0.46
        },
        {
          date: "2021-10-01",
          value: 1.43
        },
        {
          date: "2021-11-01",
          value: 2.48
        },
        {
          date: "2021-12-01",
          value: 1.44
        },
        {
          date: "2022-01-01",
          value: 0.99
        },
        {
          date: "2022-02-01",
          value: 0.99
        },
        {
          date: "2022-03-01",
          value: 1.49
        },
        {
          date: "2022-04-01",
          value: 2.18
        },
        {
          date: "2022-05-01",
          value: 2.09
        },
        {
          date: "2022-06-01",
          value: 2.49
        },
        {
          date: "2022-07-01",
          value: 2.69
        },
        {
          date: "2022-08-01",
          value: 2.49
        },
        {
          date: "2022-09-01",
          value: 2.78
        },
        {
          date: "2022-10-01",
          value: 2.17
        },
        {
          date: "2022-11-01",
          value: 1.57
        },
        {
          date: "2022-12-01",
          value: 1.78
        },
        {
          date: "2023-01-01",
          value: 2.06
        },
        {
          date: "2023-02-01",
          value: 0.98
        },
        {
          date: "2023-03-01",
          value: 0.68
        },
        {
          date: "2023-04-01",
          value: 0.1
        },
        {
          date: "2023-05-01",
          value: 0.19
        },
        {
          date: "2023-06-01",
          value: 0
        },
        {
          date: "2023-07-01",
          value: -0.29
        },
        {
          date: "2023-08-01",
          value: 0.1
        },
        {
          date: "2023-09-01",
          value: 0
        },
        {
          date: "2023-10-01",
          value: -0.19
        },
        {
          date: "2023-11-01",
          value: -0.48
        },
        {
          date: "2023-12-01",
          value: -0.29
        },
        {
          date: "2024-01-01",
          value: -0.87
        },
        {
          date: "2024-02-01",
          value: 0.68
        },
        {
          date: "2024-03-01",
          value: 0.1
        },
        {
          date: "2024-04-01",
          value: 0.19
        },
        {
          date: "2024-05-01",
          value: 0.29
        },
        {
          date: "2024-06-01",
          value: 0.19
        },
        {
          date: "2024-07-01",
          value: 0.49
        },
        {
          date: "2024-08-01",
          value: 0.58
        },
        {
          date: "2024-09-01",
          value: 0.39
        },
        {
          date: "2024-10-01",
          value: 0.29
        },
        {
          date: "2024-11-01",
          value: 0.19
        },
        {
          date: "2024-12-01",
          value: 0.1
        },
        {
          date: "2025-01-01",
          value: 0.48
        },
        {
          date: "2025-02-01",
          value: -0.77
        },
        {
          date: "2025-03-01",
          value: -0.1
        },
        {
          date: "2025-04-01",
          value: -0.07
        }
      ]
    },
    ismmfg: {
      id: "ismmfg",
      fred: "ISMPMI",
      mode: "level",
      unit: "index",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: 55.6
      },
      points: [
        {
          date: "2026-04-01",
          value: 52.7
        },
        {
          date: "2026-05-01",
          value: 54
        },
        {
          date: "2026-06-01",
          value: 53.3
        },
        {
          date: "2026-07-01",
          value: 55.6
        }
      ]
    },
    ismsvc: {
      id: "ismsvc",
      fred: "NAPMNOI",
      mode: "level",
      unit: "index",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: 54.1
      },
      points: [
        {
          date: "2025-05-01",
          value: 49.9
        },
        {
          date: "2025-06-01",
          value: 50.8
        },
        {
          date: "2025-07-01",
          value: 50.1
        },
        {
          date: "2025-08-01",
          value: 52
        },
        {
          date: "2025-09-01",
          value: 50
        },
        {
          date: "2026-04-01",
          value: 53.6
        },
        {
          date: "2026-05-01",
          value: 54.5
        },
        {
          date: "2026-06-01",
          value: 54
        },
        {
          date: "2026-07-01",
          value: 54.1
        }
      ]
    },
    adp: {
      id: "adp",
      points: [
        {
          date: "2026-04-01",
          value: 105
        },
        {
          date: "2026-05-01",
          value: 122
        }
      ],
      last: {
        date: "2026-05-01",
        value: 122
      }
    }
  }
};

// lib/fred.js
var BASE = "https://fred.stlouisfed.org/graph/fredgraph.csv";
async function fetchSeriesRaw(id, start = "2007-01-01") {
  const url = `${BASE}?id=${encodeURIComponent(id)}&cosd=${start}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8e3), cache: "no-store" });
  if (!res.ok) throw new Error(`FRED ${id} HTTP ${res.status}`);
  const text = await res.text();
  return parseSeriesCsv(text);
}
function parseSeriesCsv(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const comma = line.lastIndexOf(",");
    if (comma < 0) continue;
    const date = line.slice(0, comma).trim();
    const raw = line.slice(comma + 1).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    const value = raw === "." || raw === "" ? null : parseFloat(raw);
    out.push({ date, value });
  }
  return out;
}
function toMonthKey(date) {
  return date.slice(0, 7);
}
function lookup(values) {
  const map = /* @__PURE__ */ new Map();
  for (const d of values) {
    if (d.value !== null && d.value !== void 0) {
      map.set(toMonthKey(d.date), d.value);
    }
  }
  const days = /* @__PURE__ */ new Map();
  for (const d of values) {
    if (d.value !== null && d.value !== void 0) {
      days.set(d.date, d.value);
    }
  }
  return { map, days };
}
function shiftMonthKey(key, months) {
  const [y, m] = key.split("-").map(Number);
  const total = y * 12 + (m - 1) + months;
  const ny = Math.floor(total / 12);
  const nm = total % 12 + 1;
  return `${ny}-${String(nm).padStart(2, "0")}`;
}
function transformSeries(raw, mode) {
  if (mode === "level") {
    return aggregateMonthly(raw);
  }
  const { map } = lookup(raw);
  const keys = [...map.keys()].sort();
  const out = [];
  for (const key of keys) {
    const base2 = map.get(key);
    if (base2 === null || base2 === void 0) continue;
    if (mode === "monthly_change") {
      const prevKey = shiftMonthKey(key, -1);
      const prev = map.get(prevKey);
      if (prev === void 0) continue;
      out.push({ date: `${key}-01`, value: round(base2 - prev, 2) });
    } else if (mode === "mom_pct") {
      const prevKey = shiftMonthKey(key, -1);
      const prev = map.get(prevKey);
      if (prev === void 0 || prev === 0) continue;
      out.push({ date: `${key}-01`, value: round((base2 - prev) / prev * 100, 2) });
    } else if (mode === "yoy_pct") {
      const prevKey = shiftMonthKey(key, -12);
      const prev = map.get(prevKey);
      if (prev === void 0 || prev === 0) continue;
      out.push({ date: `${key}-01`, value: round((base2 - prev) / prev * 100, 2) });
    }
  }
  return out;
}
function aggregateMonthly(raw) {
  const byMonth = /* @__PURE__ */ new Map();
  for (const d of raw) {
    if (d.value === null || d.value === void 0) continue;
    const key = toMonthKey(d.date);
    if (!byMonth.has(key)) byMonth.set(key, []);
    byMonth.get(key).push(d.value);
  }
  const keys = [...byMonth.keys()].sort();
  return keys.map((k) => ({ date: `${k}-01`, value: round(avg(byMonth.get(k)), 2) }));
}
function avg(arr) {
  if (!arr.length) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function round(n, d = 2) {
  if (n === null || n === void 0 || isNaN(n)) return n;
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}
function latestPoints(points, n = 12) {
  const valid = points.filter((p) => p.value !== null && p.value !== void 0);
  return valid.slice(-n);
}
function lastValue(points) {
  const valid = points.filter((p) => p.value !== null && p.value !== void 0);
  return valid.length ? valid[valid.length - 1] : null;
}

// lib/cache.js
var store = /* @__PURE__ */ new Map();
var inflight = /* @__PURE__ */ new Map();
async function cached(key, ttlMs, compute) {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < ttlMs) {
    return hit.data;
  }
  if (inflight.has(key)) return inflight.get(key);
  const p = compute().then(
    (data) => {
      store.set(key, { at: Date.now(), data });
      inflight.delete(key);
      return data;
    },
    (e) => {
      inflight.delete(key);
      throw e;
    }
  );
  inflight.set(key, p);
  return p;
}
cached.force = function force(key, data) {
  store.set(key, { at: Date.now(), data });
  return data;
};

// lib/data.js
var LIVE = true;
var LIVE_TTL = 6 * 60 * 60 * 1e3;
var FAIL_TTL = 5 * 60 * 1e3;
var fails = /* @__PURE__ */ new Map();
function recentFail(id) {
  const at = fails.get(id);
  return at !== void 0 && Date.now() - at < FAIL_TTL;
}
function markFail(id) {
  fails.set(id, Date.now());
}
function startForFreq(freq) {
  if (freq === "Q") return "1990-01-01";
  return "2013-01-01";
}
async function getSeriesData(id) {
  const def = getSeries(id);
  if (!def) return null;
  if (LIVE && !def.noLive && !recentFail(id)) {
    const live = await cached(`fred:${id}`, LIVE_TTL, async () => {
      const raw = await fetchSeriesRaw(def.fred, startForFreq(def.freq));
      const transformed = transformSeries(raw, def.mode);
      const points = latestPoints(transformed, 132);
      const last = lastValue(transformed);
      if (points.length) return { ...def, points, last, source: "live", updated: (/* @__PURE__ */ new Date()).toISOString() };
      throw new Error("no data");
    }).catch((e) => {
      markFail(id);
      return null;
    });
    if (live) return live;
  }
  const entry = seed_default.series[id];
  if (entry) {
    return { ...def, points: entry.points, last: entry.last, source: "seed", updated: entry.updated };
  }
  return null;
}
var SEED_META = {
  source: seed_default.source,
  generated: seed_default.generated
};

// lib/provider.js
var FF_URL = "https://cdn-nfs.faireconomy.media/ff_calendar_thisweek.json";
var TTL = 60 * 60 * 1e3;
var NEG_TTL = 10 * 60 * 1e3;
var lastFail = 0;
var COUNTRY_MAP = {
  USD: "US",
  EUR: "EZ",
  GBP: "UK",
  JPY: "JP",
  CNY: "CN",
  AUD: "AU",
  CAD: "CA",
  CHF: "CH",
  NZD: "NZ"
};
var TITLE_MAP = [
  { title: "non-farm employment change", id: "nfp" },
  { title: "unemployment rate", id: "unemp" },
  { title: "cpi y/y", id: "cpi", allow: ["US"] },
  { title: "cpi m/m", id: "cpi", allow: ["US"] },
  { title: "core cpi y/y", id: "corecpi", allow: ["US"] },
  { title: "core cpi m/m", id: "corecpi", allow: ["US"] },
  { title: "ppi y/y", id: "ppi", allow: ["US"] },
  { title: "ppi m/m", id: "ppi", allow: ["US"] },
  { title: "average hourly earnings y/y", id: "ahe", allow: ["US"] },
  { title: "federal funds rate", id: "fedfunds", allow: ["US"] },
  { title: "retail sales m/m", id: "retail", allow: ["US"] },
  { title: "core pce price index", id: "corepce", allow: ["US"] },
  { title: "adp non-farm employment", id: "adp", allow: ["US"] },
  { title: "advance gdp", id: "gdp", allow: ["US"] },
  { title: "gdp q/q", id: "gdp", allow: ["US"] },
  { title: "initial jobless claims", id: "claims", allow: ["US"] },
  { title: "industrial production m/m", id: "indpro", allow: ["US"] },
  { title: "capacity utilization rate", id: "capacity", allow: ["US"] },
  { title: "michigan consumer sentiment", id: "umich", allow: ["US"] },
  { title: "ism manufacturing pmi", id: "ismmfg", allow: ["US"] },
  { title: "ism services pmi", id: "ismsvc", allow: ["US"] },
  { title: "ism non-manufacturing pmi", id: "ismsvc", allow: ["US"] },
  { title: "eurozone cpi y/y", id: "eu_cpi", allow: ["EZ"] },
  { title: "eurozone unemployment rate", id: "eu_unemp", allow: ["EZ"] },
  { title: "eurozone gdp", id: "eu_gdp", allow: ["EZ"] },
  { title: "uk cpi y/y", id: "uk_cpi", allow: ["UK"] },
  { title: "uk unemployment rate", id: "uk_unemp", allow: ["UK"] },
  { title: "japan cpi y/y", id: "jp_cpi", allow: ["JP"] },
  { title: "china cpi y/y", id: "china_cpi", allow: ["CN"] }
];
async function fetchLiveConsensus() {
  if (Date.now() - lastFail < NEG_TTL) {
    throw new Error("Penyedia belum tersedia (cooldown)");
  }
  return cached("ff:calendar", TTL, async () => {
    const res = await fetch(FF_URL, { signal: AbortSignal.timeout(6e3), cache: "no-store" });
    if (!res.ok) throw new Error(`ForexFactory HTTP ${res.status}`);
    const raw = await res.json();
    if (!Array.isArray(raw)) throw new Error("ForexFactory: format tak terduga");
    return raw.map(normalizeEvent).filter(Boolean);
  }).catch((e) => {
    lastFail = Date.now();
    throw e;
  });
}
function normalizeEvent(e) {
  const country = COUNTRY_MAP[e.country] || null;
  const titleNorm = String(e.title || "").toLowerCase().trim();
  const matched = TITLE_MAP.find((r) => {
    if (titleNorm !== r.title) return false;
    if (r.allow && country && !r.allow.includes(country)) return false;
    return true;
  });
  if (!matched) return null;
  return {
    indicatorId: matched.id,
    title: e.title,
    date: e.date,
    country,
    impact: normalizeImpact(e.impact),
    actual: parseVal(e.actual),
    forecast: parseVal(e.forecast),
    previous: parseVal(e.previous),
    unit: e.unit
  };
}
function normalizeImpact(imp) {
  const s = String(imp || "").toLowerCase();
  if (s.includes("high")) return "High";
  if (s.includes("medium") || s.includes("mid")) return "Medium";
  return "Low";
}
function parseVal(v) {
  if (v === null || v === void 0) return null;
  const s = String(v).trim().toLowerCase();
  if (!s || s === "none" || s === "n/a" || s === "-") return null;
  const num = parseFloat(s.replace(/[^0-9.-]/g, ""));
  return isNaN(num) ? null : num;
}

// lib/consensus.js
async function getReleaseAnalytics(id) {
  const series = await getSeriesData(id);
  if (!series) return null;
  const points = series.points || [];
  const idxByDate = /* @__PURE__ */ new Map();
  points.forEach((p, i) => idxByDate.set(p.date, i));
  const releases = [];
  for (const e of CONSENSUS[id] || []) {
    const obs = e.obs || e.date;
    const i = idxByDate.get(obs);
    if (i === void 0) continue;
    const actual = points[i]?.value ?? null;
    const previous = i > 0 ? points[i - 1]?.value ?? null : null;
    const consensus = e.consensus;
    const surprise = actual !== null && consensus != null ? round2(actual - consensus, 2) : null;
    const surprisePct = surprise !== null && consensus ? round2(surprise / Math.abs(consensus) * 100, 2) : null;
    const surpriseIdx = surprise !== null && series.scale ? round2(surprise / series.scale * 100, 1) : null;
    releases.push({ date: e.date, obsDate: obs, consensus, previous, actual, surprise, surprisePct, surpriseIdx, source: "local" });
  }
  let source = "local";
  try {
    const live = await fetchLiveConsensus();
    const ev = live.find((e) => e.indicatorId === id);
    const lastDate = releases.length ? releases[releases.length - 1].date : null;
    if (ev && ev.date && (!lastDate || ev.date.slice(0, 10) > lastDate)) {
      const surprise = ev.actual !== null && ev.forecast !== null ? round2(ev.actual - ev.forecast, 2) : null;
      const surprisePct = surprise !== null && ev.forecast ? round2(surprise / Math.abs(ev.forecast) * 100, 2) : null;
      releases.push({
        date: ev.date.slice(0, 10),
        consensus: ev.forecast,
        previous: ev.previous,
        actual: ev.actual,
        surprise,
        surprisePct,
        surpriseIdx: surprise !== null && series.scale ? round2(surprise / series.scale * 100, 1) : null,
        source: "live"
      });
      source = "live";
    }
  } catch {
  }
  releases.sort((a, b) => a.date.localeCompare(b.date));
  const accuracy = computeAccuracy(releases, series.tol);
  return { ...series, releases, accuracy, source };
}
function computeAccuracy(releases, tol = 0.5) {
  const valid = releases.filter((r) => r.actual != null && r.consensus != null);
  const empty = {
    samples: 0,
    hitRate: null,
    avgPct: null,
    bias: null,
    dirAcc: null,
    beats: 0,
    misses: 0,
    inlines: 0,
    beatRate: null,
    maxSurprise: null,
    maxSurpriseDate: null,
    streak: null,
    tol
  };
  if (!valid.length) return empty;
  const hit = valid.filter((r) => Math.abs(r.surprise) <= tol).length;
  const hitRate = round2(hit / valid.length * 100, 1);
  const beats = valid.filter((r) => r.surprise > tol).length;
  const misses = valid.filter((r) => r.surprise < -tol).length;
  const inlines = valid.length - beats - misses;
  const beatRate = round2(beats / valid.length * 100, 1);
  const pcts = valid.filter((r) => r.surpriseIdx != null);
  const avgPct = pcts.length ? round2(avg2(pcts.map((r) => Math.abs(r.surpriseIdx))), 1) : null;
  const biasAbs = valid.length ? round2(avg2(valid.map((r) => r.surprise)), 2) : null;
  let matched = 0, dirTotal = 0;
  for (const r of valid) {
    if (r.previous == null) continue;
    const actualDir = Math.sign(r.actual - r.previous);
    if (actualDir === 0) continue;
    const consensusDir = Math.sign(r.consensus - r.previous);
    if (consensusDir === 0) continue;
    dirTotal++;
    if (actualDir === consensusDir) matched++;
  }
  const dirAcc = dirTotal ? round2(matched / dirTotal * 100, 1) : null;
  let maxSurprise = null, maxSurpriseDate = null;
  for (const r of valid) {
    if (maxSurprise === null || Math.abs(r.surprise) > Math.abs(maxSurprise)) {
      maxSurprise = r.surprise;
      maxSurpriseDate = r.date;
    }
  }
  let streak = null;
  const last = valid[valid.length - 1];
  const sgn = Math.sign(last.surprise);
  if (sgn !== 0) {
    let n = 1;
    for (let i = valid.length - 2; i >= 0; i--) {
      if (Math.sign(valid[i].surprise) === sgn) n++;
      else break;
    }
    streak = { n, kind: sgn > 0 ? "BEAT" : "MISS" };
  }
  return { samples: valid.length, hitRate, avgPct, bias: biasAbs, dirAcc, beats, misses, inlines, beatRate, maxSurprise, maxSurpriseDate, streak, tol };
}
async function getAllReleaseAnalytics() {
  const out = await Promise.all(
    SERIES.map((s) => getReleaseAnalytics(s.id).catch(() => null))
  );
  return out.filter((a) => a && a.releases.length);
}
function avg2(arr) {
  if (!arr.length) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function round2(n, d = 2) {
  if (n === null || n === void 0 || isNaN(n)) return n;
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}

// data/calendar.js
function isDst(month) {
  return month >= 3 && month <= 10;
}
var FOMC_2026 = [
  { et: "2026-01-28", sep: false },
  { et: "2026-03-18", sep: true },
  { et: "2026-04-29", sep: false },
  { et: "2026-06-17", sep: true },
  { et: "2026-07-29", sep: false },
  { et: "2026-09-16", sep: true },
  // keputusan 16 Sep 14:00 ET → WIB 17 Sep 01:00
  { et: "2026-10-28", sep: false },
  { et: "2026-12-09", sep: true }
];
function fomcEvents() {
  const out = [];
  for (const f of FOMC_2026) {
    const m = Number(f.et.slice(5, 7));
    const dst = isDst(m);
    const t1 = dst ? "01:00" : "02:00";
    const t2 = dst ? "01:30" : "02:30";
    const d = /* @__PURE__ */ new Date(`${f.et}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    const date = d.toISOString().slice(0, 10);
    out.push({ date, time: t1, title: "FOMC Federal Funds Rate", category: "moneter", country: "US", impact: "High", indicatorId: "fedfunds" });
    if (f.sep) out.push({ date, time: t1, title: "FOMC Economic Projections", category: "moneter", country: "US", impact: "High", indicatorId: "fedfunds" });
    out.push({ date, time: t1, title: "FOMC Statement", category: "moneter", country: "US", impact: "High", indicatorId: "fedfunds" });
    out.push({ date, time: t2, title: "FOMC Press Conference", category: "moneter", country: "US", impact: "Medium", indicatorId: "fedfunds" });
  }
  return out;
}
var EVENTS = [
  ...fomcEvents(),
  // ---- NFP (Employment Situation) — 08:30 ET ----
  // ⚑ 30-Agu-2026: jadwal rilis NFP di kalender ini IRREGULER (validasi earningsapi:
  // 3 Jul-25, 5 Sep-25, 16 Des-25, 9 Jan-26, 11 Feb-26, 8 Mei-26, 5 Jun-26, 2 Jul-26).
  // Tanggal di bawah = ESTIMASI (belum terverifikasi API), masih pakai pola Jumat kedua.
  { date: "2026-09-04", time: "19:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-10-09", time: "19:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-11-13", time: "20:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-12-11", time: "20:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  // ---- ISM PMI — 10:00 ET ----
  // ⚑ 30-Agu-2026: jadwal rilis ISM IRREGULER (tervalidasi: Mfg 2 Jul-26, Svc 6 Jul-26
  // & 5 Agu-26). Tanggal di bawah = ESTIMASI (hari kerja pertama / +3 hari kerja).
  { date: "2026-10-26", time: "19:30", title: "Core PCE Price Index m/m", category: "inflasi", country: "US", impact: "High", indicatorId: "corepce" },
  { date: "2026-11-25", time: "19:30", title: "Core PCE Price Index m/m", category: "inflasi", country: "US", impact: "High", indicatorId: "corepce" },
  { date: "2026-10-28", time: "19:30", title: "GDP (Advance) q/q", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "gdp" },
  { date: "2026-11-25", time: "19:30", title: "GDP (Prelim) q/q", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "gdp" },
  { date: "2026-09-01", time: "21:00", title: "ISM Manufacturing PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismmfg" },
  { date: "2026-09-04", time: "21:00", title: "ISM Services PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismsvc" },
  { date: "2026-10-01", time: "21:00", title: "ISM Manufacturing PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismmfg" },
  { date: "2026-10-06", time: "21:00", title: "ISM Services PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismsvc" },
  { date: "2026-11-02", time: "22:00", title: "ISM Manufacturing PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismmfg" },
  { date: "2026-11-05", time: "22:00", title: "ISM Services PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismsvc" },
  { date: "2026-12-01", time: "22:00", title: "ISM Manufacturing PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismmfg" },
  { date: "2026-12-04", time: "22:00", title: "ISM Services PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismsvc" },
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
  { date: "2026-09-15", time: "19:30", title: "Retail Sales", category: "konsumen", country: "US", impact: "Medium", indicatorId: "retail" }
];
var UPCOMING = EVENTS.map((e) => ({ ...e, iso: `${e.date}T${e.time}:00+07:00` }));

// .smoke35-entry.jsx
import { jsx as jsx4 } from "react/jsx-runtime";
function App() {
  const [items, setItems] = useState2(null);
  useEffect2(() => {
    getAllReleaseAnalytics().then(setItems);
  }, []);
  if (!items) return /* @__PURE__ */ jsx4("div", { id: "loading", children: "\u2026" });
  return /* @__PURE__ */ jsx4(AnalysisClient, { items, upcoming: UPCOMING });
}
export {
  App as default
};
