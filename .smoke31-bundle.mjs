// .smoke31-entry.jsx
import { useEffect as useEffect3, useState as useState3 } from "react";

// components/CalendarClient.jsx
import { useEffect as useEffect2, useMemo, useState as useState2 } from "react";

// .smoke20-linkstub.jsx
import { jsx } from "react/jsx-runtime";
function Link(props) {
  return props.href ? /* @__PURE__ */ jsx("a", { href: props.href, className: props.className, children: props.children }) : props.children;
}

// lib/series.js
var SERIES_RAW = [
  {
    id: "nfp",
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
    release: "Akhir bulan, 08:30 ET",
    about: "Indeks harga pengeluaran konsumsi pribadi inti (tanpa makanan & energi) \u2014 ukuran inflasi favorit The Fed.",
    why: "The Fed mengacu pada PCE inti untuk menilai tren inflasi jangka menengah.",
    fx: "Core PCE tinggi \u2192 tekanan kenaikan suku bunga \u2192 USD bisa menguat."
  },
  {
    id: "ahe",
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
    name: "Real GDP (Quarterly)",
    short: "GDP",
    category: "pertumbuhan",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "Q",
    fred: "GDPC1",
    mode: "yoy_pct",
    unit: "%",
    decimals: 1,
    impact: "High",
    release: "Perkiraan setiap kuartal",
    about: "Pertumbuhan ekonomi riil (year-over-year).",
    why: "Pertumbuhan kuat mendukung suku bunga tinggi.",
    fx: "GDP kuat \u2192 USD bullish; lemah \u2192 USD bearish."
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
    name: "Initial Jobless Claims",
    short: "Jobless Claims",
    category: "tenaga-kerja",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "W",
    fred: "ICNSA",
    mode: "level",
    unit: "ribu",
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
  gdp: 0.3,
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
  china_cpi: 0.15
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
  gdp: 1,
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
  china_cpi: 0.5
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

// components/Icons.jsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
function IconFlag({ size = 16 }) {
  return /* @__PURE__ */ jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx2("path", { ...base, d: "M5 3v18" }),
    /* @__PURE__ */ jsx2("path", { ...base, d: "M5 4h13l-2.5 4 2.5 4H5" })
  ] });
}
function IconGlobe({ size = 16 }) {
  return /* @__PURE__ */ jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx2("circle", { ...base, cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ jsx2("path", { ...base, d: "M3 12h18" }),
    /* @__PURE__ */ jsx2("path", { ...base, d: "M12 3c2.6 2.5 2.6 15.5 0 18M12 3c-2.6 2.5-2.6 15.5 0 18" })
  ] });
}

// components/Badges.jsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
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
    isGlobal ? /* @__PURE__ */ jsx3(IconGlobe, { size }) : /* @__PURE__ */ jsx3(IconFlag, { size }),
    showCode && /* @__PURE__ */ jsx3("span", { className: "country-code", children: label })
  ] });
}

// components/TermClock.jsx
import { useEffect, useState } from "react";
import { jsxs as jsxs3 } from "react/jsx-runtime";
var FMT = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
function TermClock({ suffix = "WIB" }) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(/* @__PURE__ */ new Date());
    const t = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(t);
  }, []);
  return /* @__PURE__ */ jsxs3("span", { className: "term-clock mono", children: [
    now ? FMT.format(now) : "--:--:--",
    " ",
    suffix
  ] });
}

// components/CalendarClient.jsx
import { Fragment, jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
var COUNTRY_META = {
  US: "Amerika Serikat",
  EZ: "Zona Euro",
  UK: "Inggris",
  JP: "Jepang",
  CN: "Tiongkok",
  AU: "Australia",
  CA: "Kanada",
  CH: "Swiss",
  NZ: "Selandia Baru",
  GL: "Global"
};
var IMP_CLS = { High: "im-high", Medium: "im-medium", Low: "im-low" };
function useNow() {
  const [now, setNow] = useState2(null);
  useEffect2(() => {
    setNow(/* @__PURE__ */ new Date());
    const t = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(t);
  }, []);
  return now;
}
function fmtCountdown(ms) {
  if (ms <= 0) return "SEKARANG";
  const s = Math.floor(ms / 1e3);
  const d = Math.floor(s / 86400);
  const h = Math.floor(s % 86400 / 3600);
  const m = Math.floor(s % 3600 / 60);
  const ss = s % 60;
  if (d > 0) return `T-${d}d ${h}j ${m}m`;
  if (h > 0) return `T-${h}j ${m}m ${String(ss).padStart(2, "0")}s`;
  return `T-${m}m ${String(ss).padStart(2, "0")}s`;
}
var fmtVal = (v) => v === null || v === void 0 ? "\u2014" : Number(v).toLocaleString("id-ID", { maximumFractionDigits: 1 });
function EventRow({ e, now, isNext, open, onToggle }) {
  const series = e.indicatorId ? getSeries(e.indicatorId) : null;
  const rowKey = e.iso + e.title;
  const ts = new Date(e.iso).getTime();
  const tNow = now ? now.getTime() : ts;
  const isPast = ts < tNow;
  const isToday = now && e.iso.slice(0, 10) === now.toISOString().slice(0, 10);
  const time = e.iso.slice(11, 16);
  const cat = CATEGORIES.find((c) => c.id === e.category);
  const cname = COUNTRY_META[e.country] || e.country;
  const hasData = e.actual != null || e.forecast != null || e.previous != null;
  const cd = !isPast && now ? fmtCountdown(ts - tNow) : null;
  return /* @__PURE__ */ jsxs4("div", { className: `cal-row-wrap ${open ? "open" : ""}`, children: [
    /* @__PURE__ */ jsxs4(
      "div",
      {
        className: `cal-row ${isPast ? "is-past" : ""} ${isToday ? "is-today" : ""} ${isNext ? "is-next" : ""}`,
        onClick: () => onToggle(rowKey),
        onKeyDown: (ev) => (ev.key === "Enter" || ev.key === " ") && (ev.preventDefault(), onToggle(rowKey)),
        role: "button",
        tabIndex: 0,
        "aria-expanded": open,
        children: [
          /* @__PURE__ */ jsxs4("span", { className: "cal-r-time mono", children: [
            time,
            /* @__PURE__ */ jsx4("i", { children: isPast ? "DONE" : isToday ? "HARI INI" : "WIB" })
          ] }),
          /* @__PURE__ */ jsxs4("span", { className: "cal-r-title", children: [
            /* @__PURE__ */ jsx4(CountryFlag, { code: e.country, size: 15, showCode: false }),
            e.title,
            isNext && /* @__PURE__ */ jsx4("b", { className: "cal-next-tag", children: "NEXT" }),
            isPast && /* @__PURE__ */ jsx4("i", { className: "cal-released", children: "RELEASED" })
          ] }),
          /* @__PURE__ */ jsxs4("span", { className: "cal-r-cat", style: { "--c": cat?.color }, children: [
            /* @__PURE__ */ jsx4("i", {}),
            " ",
            cat?.label || e.category
          ] }),
          /* @__PURE__ */ jsxs4("span", { className: `cal-r-imp ${IMP_CLS[e.impact] || "im-low"}`, title: `Dampak ${e.impact}`, children: [
            /* @__PURE__ */ jsx4("i", {}),
            /* @__PURE__ */ jsx4("i", {}),
            /* @__PURE__ */ jsx4("i", {})
          ] }),
          /* @__PURE__ */ jsx4("span", { className: "cal-r-metrics mono", title: hasData ? "P = previous \xB7 K = forecast/konsensus \xB7 A = actual (sudah rilis)" : "Belum ada angka (previous/forecast/actual)", children: hasData ? /* @__PURE__ */ jsxs4(Fragment, { children: [
            e.previous != null && /* @__PURE__ */ jsxs4("b", { className: "m-p", children: [
              /* @__PURE__ */ jsx4("u", { children: "P" }),
              fmtVal(e.previous)
            ] }),
            e.forecast != null && /* @__PURE__ */ jsxs4("b", { className: "m-k", children: [
              /* @__PURE__ */ jsx4("u", { children: "K" }),
              fmtVal(e.forecast)
            ] }),
            e.actual != null && /* @__PURE__ */ jsxs4("b", { className: `m-a ${isPast ? "done" : ""}`, children: [
              /* @__PURE__ */ jsx4("u", { children: "A" }),
              fmtVal(e.actual)
            ] })
          ] }) : /* @__PURE__ */ jsx4("span", { className: "dim", children: "\u2014" }) }),
          /* @__PURE__ */ jsx4("span", { className: "cal-r-cd mono", children: cd || "" }),
          /* @__PURE__ */ jsx4("span", { className: "cal-r-chev", "aria-hidden": "true", children: open ? "\u25BE" : "\u25B8" })
        ]
      }
    ),
    /* @__PURE__ */ jsx4("div", { className: "cal-detail", children: /* @__PURE__ */ jsx4("div", { className: "cal-detail-in", children: series ? /* @__PURE__ */ jsxs4("div", { className: "cal-d-grid", children: [
      /* @__PURE__ */ jsxs4("div", { children: [
        /* @__PURE__ */ jsx4("em", { children: "APAKAH INI?" }),
        /* @__PURE__ */ jsx4("p", { children: series.about })
      ] }),
      /* @__PURE__ */ jsxs4("div", { children: [
        /* @__PURE__ */ jsx4("em", { children: "MENGAPA PENTING?" }),
        /* @__PURE__ */ jsx4("p", { children: series.why })
      ] }),
      /* @__PURE__ */ jsxs4("div", { children: [
        /* @__PURE__ */ jsx4("em", { children: "DAMPAK TERHADAP PAIR" }),
        /* @__PURE__ */ jsx4("p", { children: series.fx })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "cal-d-foot", children: [
        (() => {
          const parts = [];
          if (e.previous != null) parts.push(`P ${fmtVal(e.previous)}`);
          if (e.forecast != null) parts.push(`K ${fmtVal(e.forecast)}`);
          if (e.actual != null) parts.push(`A ${fmtVal(e.actual)}`);
          return parts.length ? /* @__PURE__ */ jsx4("span", { className: "cal-d-data mono", children: parts.join(" \xB7 ") }) : null;
        })(),
        series.release && /* @__PURE__ */ jsxs4("span", { className: "cal-d-rel mono", children: [
          "JADWAL: ",
          series.release
        ] }),
        /* @__PURE__ */ jsx4(Link, { className: "cal-d-link mono", href: `/indicators/${e.indicatorId}`, children: "Detail indikator \u2192" }),
        /* @__PURE__ */ jsx4(Link, { className: "cal-d-link mono", href: "/analysis", children: "Analisis dampak \u2192" })
      ] })
    ] }) : /* @__PURE__ */ jsxs4("div", { className: "cal-d-grid", children: [
      /* @__PURE__ */ jsxs4("div", { children: [
        /* @__PURE__ */ jsx4("em", { children: "EVENT PASAR" }),
        /* @__PURE__ */ jsx4("p", { children: "Agenda pasar/pidato pejabat bank sentral \u2014 dampaknya sering terasa lewat sentimen. Pantau berita terkait menjelang acara." })
      ] }),
      /* @__PURE__ */ jsx4("div", { className: "cal-d-foot", style: { gridColumn: "1 / -1" }, children: /* @__PURE__ */ jsx4(Link, { className: "cal-d-link mono", href: "/news", children: "Berita pasar \u2192" }) })
    ] }) }) })
  ] });
}
function CalendarClient({ events }) {
  const now = useNow();
  const [win, setWin] = useState2("terkini");
  const [cat, setCat] = useState2("semua");
  const [imp, setImp] = useState2("semua");
  const [cc, setCc] = useState2("semua");
  const [q, setQ] = useState2("");
  const [open, setOpen] = useState2(null);
  const DAY = 864e5;
  const countries = useMemo(() => [...new Set(events.map((e) => e.country))].filter(Boolean).sort(), [events]);
  const catList = useMemo(() => {
    const present = new Set(events.map((e) => e.category));
    return CATEGORIES.filter((c) => present.has(c.id));
  }, [events]);
  const filtered = useMemo(() => {
    let from = null, to = null;
    if (now) {
      if (win === "terkini") {
        from = new Date(now.getTime() - 3 * DAY);
        to = new Date(now.getTime() + 45 * DAY);
      } else if (win === "7") {
        from = now;
        to = new Date(now.getTime() + 7 * DAY);
      } else if (win === "30") {
        from = now;
        to = new Date(now.getTime() + 30 * DAY);
      }
    }
    const qm = q.trim().toLowerCase();
    return events.filter((e) => cat === "semua" ? true : e.category === cat).filter((e) => imp === "semua" ? true : e.impact === imp).filter((e) => cc === "semua" ? true : e.country === cc).filter((e) => !qm || e.title.toLowerCase().includes(qm)).filter((e) => !from || new Date(e.iso) >= from && new Date(e.iso) <= to).sort((a, b) => a.iso.localeCompare(b.iso));
  }, [events, cat, imp, cc, win, q, now]);
  const groups = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const e of filtered) {
      const d = e.iso.slice(0, 10);
      if (!map.has(d)) map.set(d, []);
      map.get(d).push(e);
    }
    return [...map.entries()].map(([date, list]) => ({ date, list }));
  }, [filtered]);
  const nextHigh = useMemo(() => {
    if (!now) return null;
    const t = now.getTime();
    return events.filter((e) => e.impact === "High" && new Date(e.iso).getTime() > t).sort((a, b) => a.iso.localeCompare(b.iso))[0] || null;
  }, [events, now]);
  const nextHighs = useMemo(() => {
    if (!now) return [];
    const t = now.getTime();
    return events.filter((e) => e.impact === "High" && new Date(e.iso).getTime() > t).sort((a, b) => a.iso.localeCompare(b.iso)).slice(0, 3);
  }, [events, now]);
  const dateLabel = (date) => {
    if (!now) return { main: DAY_NAMES[(/* @__PURE__ */ new Date(`${date}T00:00:00`)).getDay()], sub: `${date.slice(8)} ${MONTHS[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}`, today: false };
    const todayKey = now.toISOString().slice(0, 10);
    if (date === todayKey) return { main: "HARI INI", sub: `${DAY_NAMES[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`, today: true };
    const dt = /* @__PURE__ */ new Date(`${date}T00:00:00`);
    const yest = new Date(now.getTime() - DAY).toISOString().slice(0, 10);
    const tmr = new Date(now.getTime() + DAY).toISOString().slice(0, 10);
    if (date === yest) return { main: "KEMARIN", sub: `${DAY_NAMES[dt.getDay()]}, ${dt.getDate()} ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`, today: false };
    if (date === tmr) return { main: "BESOK", sub: `${DAY_NAMES[dt.getDay()]}, ${dt.getDate()} ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`, today: false };
    return { main: DAY_NAMES[dt.getDay()], sub: `${dt.getDate()} ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`, today: false };
  };
  const winLabel = win === "terkini" ? "3 hari terakhir \u2192 \xB145 hari ke depan" : win === "semua" ? "seluruh rilis" : win === "7" ? "7 hari ke depan" : "30 hari ke depan";
  return /* @__PURE__ */ jsxs4("div", { className: "cal-term", children: [
    /* @__PURE__ */ jsx4("div", { className: "ct-scan", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs4("header", { className: "cal-term-head", children: [
      /* @__PURE__ */ jsxs4("span", { className: "ct-dots", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx4("i", {}),
        /* @__PURE__ */ jsx4("i", {}),
        /* @__PURE__ */ jsx4("i", {})
      ] }),
      /* @__PURE__ */ jsxs4("span", { className: "cal-term-title mono", children: [
        "MACROLAB ",
        /* @__PURE__ */ jsx4("em", { children: "//" }),
        " RELEASE\xA0CALENDAR ",
        /* @__PURE__ */ jsx4("span", { className: "ct-ver", children: "v1.0" }),
        /* @__PURE__ */ jsx4("span", { className: "ct-cursor", "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ jsxs4("span", { className: "cal-term-head-right", children: [
        /* @__PURE__ */ jsx4("span", { className: "ct-led ok", children: "WIB \xB7 UTC+7" }),
        /* @__PURE__ */ jsx4(TermClock, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxs4("section", { className: "cal-next", children: [
      /* @__PURE__ */ jsxs4("div", { className: "cal-next-label mono", children: [
        /* @__PURE__ */ jsx4("span", { className: "ct-tag", children: "00" }),
        " NEXT RELEASE \u2014 HIGH IMPACT"
      ] }),
      nextHigh && now ? /* @__PURE__ */ jsxs4("div", { className: "cal-next-body", children: [
        /* @__PURE__ */ jsxs4("div", { className: "cal-next-info", children: [
          /* @__PURE__ */ jsxs4("b", { className: "cal-next-title", children: [
            /* @__PURE__ */ jsx4(CountryFlag, { code: nextHigh.country, size: 16, showCode: false }),
            " ",
            nextHigh.title
          ] }),
          /* @__PURE__ */ jsxs4("span", { className: "cal-next-when mono", children: [
            DAY_NAMES[new Date(nextHigh.iso).getDay()],
            " \xB7 ",
            nextHigh.iso.slice(8, 10),
            " ",
            MONTHS[Number(nextHigh.iso.slice(5, 7)) - 1],
            " ",
            nextHigh.iso.slice(0, 4),
            " \xB7 ",
            nextHigh.time,
            " WIB \xB7 ",
            COUNTRY_META[nextHigh.country] || nextHigh.country
          ] }),
          nextHigh.previous != null && /* @__PURE__ */ jsxs4("span", { className: "cal-next-prev mono", children: [
            "SEBELUMNYA: ",
            /* @__PURE__ */ jsx4("b", { children: fmtVal(nextHigh.previous) }),
            nextHigh.forecast != null && /* @__PURE__ */ jsxs4(Fragment, { children: [
              " \xB7 FORECAST: ",
              /* @__PURE__ */ jsx4("b", { children: fmtVal(nextHigh.forecast) })
            ] }),
            " ",
            "(",
            getSeries(nextHigh.indicatorId)?.unit || "",
            ")"
          ] }),
          nextHighs.length > 1 && /* @__PURE__ */ jsxs4("span", { className: "cal-next-more mono", children: [
            "+",
            nextHighs.length - 1,
            " high-impact berikutnya: ",
            nextHighs.slice(1).map((e) => e.title).join(" \xB7 ")
          ] })
        ] }),
        /* @__PURE__ */ jsxs4("div", { className: "cal-next-cd", children: [
          /* @__PURE__ */ jsx4("b", { className: "mono", children: fmtCountdown(new Date(nextHigh.iso).getTime() - now.getTime()) }),
          /* @__PURE__ */ jsx4("span", { className: "mono", children: "menuju rilis" })
        ] })
      ] }) : /* @__PURE__ */ jsx4("div", { className: "cal-next-body", children: /* @__PURE__ */ jsx4("span", { className: "cal-next-none mono", children: "TIDAK ADA RILIS HIGH IMPACT BERIKUTNYA DALAM DATA" }) })
    ] }, nextHigh ? nextHigh.iso + nextHigh.title : "none"),
    /* @__PURE__ */ jsxs4("section", { className: "cal-term-sec", children: [
      /* @__PURE__ */ jsxs4("div", { className: "ct-block-head", children: [
        /* @__PURE__ */ jsx4("span", { className: "ct-tag", children: "01" }),
        /* @__PURE__ */ jsx4("h4", { children: "Filter Jadwal" }),
        /* @__PURE__ */ jsxs4("span", { className: "ct-block-meta mono", children: [
          countries.length,
          " NEGARA \xB7 ",
          events.length,
          " EVENT"
        ] })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "cal-chips-row", children: [
        /* @__PURE__ */ jsx4("span", { className: "cal-chips-cap mono", children: "JENDELA" }),
        /* @__PURE__ */ jsx4("div", { className: "cal-chips", children: [
          { id: "terkini", label: "TERKINI" },
          { id: "7", label: "7 HARI" },
          { id: "30", label: "30 HARI" },
          { id: "semua", label: "SEMUA" }
        ].map((w) => /* @__PURE__ */ jsx4("button", { className: `cal-chip ${win === w.id ? "on" : ""}`, onClick: () => setWin(w.id), children: w.label }, w.id)) })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "cal-chips-row", children: [
        /* @__PURE__ */ jsx4("span", { className: "cal-chips-cap mono", children: "KATEGORI" }),
        /* @__PURE__ */ jsxs4("div", { className: "cal-chips", children: [
          /* @__PURE__ */ jsx4("button", { className: `cal-chip ${cat === "semua" ? "on" : ""}`, onClick: () => setCat("semua"), children: "SEMUA" }),
          catList.map((c) => /* @__PURE__ */ jsx4("button", { className: `cal-chip ${cat === c.id ? "on" : ""}`, onClick: () => setCat(c.id), style: { "--c": c.color }, children: c.label.toUpperCase() }, c.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "cal-chips-row", children: [
        /* @__PURE__ */ jsx4("span", { className: "cal-chips-cap mono", children: "DAMPAK" }),
        /* @__PURE__ */ jsxs4("div", { className: "cal-chips", children: [
          /* @__PURE__ */ jsx4("button", { className: `cal-chip ${imp === "semua" ? "on" : ""}`, onClick: () => setImp("semua"), children: "SEMUA" }),
          /* @__PURE__ */ jsx4("button", { className: `cal-chip im-high ${imp === "High" ? "on" : ""}`, onClick: () => setImp("High"), children: "HIGH" }),
          /* @__PURE__ */ jsx4("button", { className: `cal-chip im-medium ${imp === "Medium" ? "on" : ""}`, onClick: () => setImp("Medium"), children: "MEDIUM" }),
          /* @__PURE__ */ jsx4("button", { className: `cal-chip im-low ${imp === "Low" ? "on" : ""}`, onClick: () => setImp("Low"), children: "LOW" })
        ] }),
        /* @__PURE__ */ jsx4("span", { className: "cal-chips-cap mono cal-cc-cap", children: "NEGARA" }),
        /* @__PURE__ */ jsxs4("div", { className: "cal-chips", children: [
          /* @__PURE__ */ jsx4("button", { className: `cal-chip ${cc === "semua" ? "on" : ""}`, onClick: () => setCc("semua"), children: "SEMUA" }),
          countries.map((c) => /* @__PURE__ */ jsx4("button", { className: `cal-chip ${cc === c ? "on" : ""}`, onClick: () => setCc(c), title: COUNTRY_META[c] || c, children: c }, c))
        ] })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "cal-search", children: [
        /* @__PURE__ */ jsx4("span", { className: "ct-prompt", "aria-hidden": "true", children: ">" }),
        /* @__PURE__ */ jsx4("input", { type: "text", placeholder: "cari event\u2026", value: q, onChange: (e) => setQ(e.target.value), "aria-label": "Cari event" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs4("section", { className: "cal-term-sec", children: [
      /* @__PURE__ */ jsxs4("div", { className: "ct-block-head", children: [
        /* @__PURE__ */ jsx4("span", { className: "ct-tag", children: "02" }),
        /* @__PURE__ */ jsx4("h4", { children: "Jadwal Rilis" }),
        /* @__PURE__ */ jsxs4("span", { className: "ct-block-meta mono", children: [
          "\u25B8 ",
          filtered.length,
          " RILIS \xB7 ",
          winLabel.toUpperCase(),
          " \xB7 KLIK BARIS UNTUK DETAIL"
        ] })
      ] }),
      groups.length === 0 && /* @__PURE__ */ jsx4("p", { className: "cal-empty mono", children: "TIDAK ADA RILIS YANG COCOK DENGAN FILTER" }),
      groups.map((g) => {
        const lbl = dateLabel(g.date);
        const pastDay = now && g.date < now.toISOString().slice(0, 10);
        return /* @__PURE__ */ jsxs4("div", { className: `cal-day ${pastDay ? "is-past" : ""}`, children: [
          /* @__PURE__ */ jsxs4("div", { className: `cal-day-head ${lbl.today ? "today" : ""}`, children: [
            /* @__PURE__ */ jsx4("span", { className: "cal-day-main mono", children: lbl.main }),
            /* @__PURE__ */ jsx4("span", { className: "cal-day-sub mono", children: lbl.sub }),
            /* @__PURE__ */ jsxs4("span", { className: "cal-day-n mono", children: [
              "N=",
              g.list.length
            ] }),
            lbl.today && /* @__PURE__ */ jsx4("span", { className: "cal-day-dot", "aria-hidden": "true" })
          ] }),
          /* @__PURE__ */ jsx4("div", { className: "cal-events", children: g.list.map((e) => /* @__PURE__ */ jsx4(
            EventRow,
            {
              e,
              now,
              isNext: !!nextHigh && e.iso === nextHigh.iso && e.title === nextHigh.title,
              open: open === e.iso + e.title,
              onToggle: (k) => setOpen((o) => o === k ? null : k)
            },
            e.iso + e.title
          )) })
        ] }, g.date);
      })
    ] }),
    /* @__PURE__ */ jsxs4("footer", { className: "cal-term-foot mono", children: [
      /* @__PURE__ */ jsxs4("span", { children: [
        "SRC: JADWAL RESMI BLS/FED/ECB/ONS \xB7 P: FRED \xB7 K/A: FOREXFACTORY LIVE \xB7 N: ",
        filtered.length,
        " \xB7 ZONA: WIB (UTC+7)"
      ] }),
      /* @__PURE__ */ jsx4("span", { className: "cal-term-foot-note", children: "P = sebelum rilis \xB7 K = konsensus \xB7 A = angka yang sudah keluar \u2014 verifikasi ke sumber resmi" }),
      /* @__PURE__ */ jsx4("span", { className: "ct-blink", "aria-hidden": "true", children: "\u25CF" })
    ] })
  ] });
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
  // ---- NFP (Employment Situation) — Jumat pertama, 08:30 ET ----
  { date: "2026-09-04", time: "19:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-10-02", time: "19:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-11-06", time: "20:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-12-04", time: "20:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
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

// data/releases.js
var CONSENSUS = {
  nfp: [
    { date: "2026-07-01", consensus: 100 },
    { date: "2026-06-01", consensus: 120 },
    { date: "2026-05-01", consensus: 150 },
    { date: "2026-04-01", consensus: 160 },
    { date: "2026-03-01", consensus: 140 },
    { date: "2026-02-01", consensus: 45 },
    { date: "2026-01-01", consensus: 150 },
    { date: "2025-12-01", consensus: 5 },
    { date: "2025-11-01", consensus: 25 },
    { date: "2025-10-01", consensus: 40 },
    { date: "2025-09-01", consensus: 75 },
    { date: "2025-08-01", consensus: -20 }
  ],
  unemp: [
    { date: "2026-07-01", consensus: 4.2 },
    { date: "2026-06-01", consensus: 4.3 },
    { date: "2026-05-01", consensus: 4.3 },
    { date: "2026-04-01", consensus: 4.4 },
    { date: "2026-03-01", consensus: 4.3 },
    { date: "2026-02-01", consensus: 4.3 },
    { date: "2026-01-01", consensus: 4.4 },
    { date: "2025-12-01", consensus: 4.4 },
    { date: "2025-11-01", consensus: 4.4 },
    { date: "2025-09-01", consensus: 4.3 },
    { date: "2025-08-01", consensus: 4.3 },
    { date: "2025-07-01", consensus: 4.2 },
    { date: "2025-06-01", consensus: 4.2 }
  ],
  cpi: [
    { date: "2026-07-01", consensus: 3.4 },
    { date: "2026-06-01", consensus: 3.6 },
    { date: "2026-05-01", consensus: 3.8 },
    { date: "2026-04-01", consensus: 3.3 },
    { date: "2026-03-01", consensus: 2.8 },
    { date: "2026-02-01", consensus: 2.4 },
    { date: "2026-01-01", consensus: 2.6 },
    { date: "2025-12-01", consensus: 2.7 },
    { date: "2025-11-01", consensus: 2.9 },
    { date: "2025-09-01", consensus: 2.9 },
    { date: "2025-08-01", consensus: 2.8 },
    { date: "2025-07-01", consensus: 2.7 },
    { date: "2025-06-01", consensus: 2.6 },
    { date: "2025-05-01", consensus: 2.3 }
  ],
  corecpi: [
    { date: "2026-07-01", consensus: 2.5 },
    { date: "2026-06-01", consensus: 2.7 },
    { date: "2026-05-01", consensus: 2.6 },
    { date: "2026-04-01", consensus: 2.5 },
    { date: "2026-03-01", consensus: 2.4 },
    { date: "2026-02-01", consensus: 2.4 },
    { date: "2026-01-01", consensus: 2.5 },
    { date: "2025-12-01", consensus: 2.6 },
    { date: "2025-11-01", consensus: 2.7 },
    { date: "2025-09-01", consensus: 2.9 },
    { date: "2025-08-01", consensus: 3.1 },
    { date: "2025-07-01", consensus: 3 },
    { date: "2025-06-01", consensus: 2.9 },
    { date: "2025-05-01", consensus: 2.8 }
  ],
  ppi: [
    { date: "2026-07-01", consensus: 9 },
    { date: "2026-06-01", consensus: 11 },
    { date: "2026-05-01", consensus: 9.5 },
    { date: "2026-04-01", consensus: 6.5 },
    { date: "2026-03-01", consensus: 4 },
    { date: "2026-02-01", consensus: 2.5 },
    { date: "2026-01-01", consensus: 2.9 },
    { date: "2025-12-01", consensus: 3 },
    { date: "2025-11-01", consensus: 3.2 },
    { date: "2025-10-01", consensus: 3.6 },
    { date: "2025-09-01", consensus: 2.5 },
    { date: "2025-08-01", consensus: 2.4 },
    { date: "2025-07-01", consensus: 2 },
    { date: "2025-06-01", consensus: 1.8 }
  ],
  corepce: [
    { date: "2026-07-01", consensus: 0.27 },
    { date: "2026-06-01", consensus: 0.3 },
    { date: "2026-05-01", consensus: 0.28 },
    { date: "2026-04-01", consensus: 0.3 },
    { date: "2026-03-01", consensus: 0.35 },
    { date: "2026-02-01", consensus: 0.35 },
    { date: "2026-01-01", consensus: 0.3 },
    { date: "2025-12-01", consensus: 0.28 },
    { date: "2025-11-01", consensus: 0.25 },
    { date: "2025-10-01", consensus: 0.25 },
    { date: "2025-09-01", consensus: 0.25 },
    { date: "2025-08-01", consensus: 0.24 },
    { date: "2025-07-01", consensus: 0.25 },
    { date: "2025-06-01", consensus: 0.25 }
  ],
  ahe: [
    { date: "2026-07-01", consensus: 3.3 },
    { date: "2026-06-01", consensus: 3.4 },
    { date: "2026-05-01", consensus: 3.5 },
    { date: "2026-04-01", consensus: 3.5 },
    { date: "2026-03-01", consensus: 3.6 },
    { date: "2026-02-01", consensus: 3.7 },
    { date: "2026-01-01", consensus: 3.7 },
    { date: "2025-12-01", consensus: 3.8 },
    { date: "2025-11-01", consensus: 3.9 },
    { date: "2025-10-01", consensus: 3.9 },
    { date: "2025-09-01", consensus: 3.9 },
    { date: "2025-08-01", consensus: 4 },
    { date: "2025-07-01", consensus: 4 },
    { date: "2025-06-01", consensus: 3.9 }
  ],
  fedfunds: [
    { date: "2026-08-01", consensus: 3.75 },
    { date: "2026-07-01", consensus: 3.75 },
    { date: "2026-06-01", consensus: 3.5 },
    { date: "2026-03-01", consensus: 3.75 },
    { date: "2025-12-01", consensus: 3.75 },
    { date: "2025-11-01", consensus: 4 },
    { date: "2025-10-01", consensus: 4 },
    { date: "2025-09-01", consensus: 4.25 }
  ],
  dgs10: [
    { date: "2026-08-01", consensus: 4.6 }
  ],
  retail: [
    { date: "2026-07-01", consensus: 0.3 },
    { date: "2026-06-01", consensus: 0.8 },
    { date: "2026-05-01", consensus: 0.7 },
    { date: "2026-04-01", consensus: 1.1 },
    { date: "2026-03-01", consensus: 1 },
    { date: "2026-02-01", consensus: 0.6 },
    { date: "2026-01-01", consensus: 0.2 },
    { date: "2025-12-01", consensus: 0.3 },
    { date: "2025-11-01", consensus: 0.5 },
    { date: "2025-10-01", consensus: 0.2 },
    { date: "2025-09-01", consensus: 0.3 },
    { date: "2025-08-01", consensus: 0.5 },
    { date: "2025-07-01", consensus: 1 },
    { date: "2025-06-01", consensus: 0.7 }
  ],
  umich: [
    { date: "2026-07-01", consensus: 50.5 },
    { date: "2026-06-01", consensus: 47 },
    { date: "2026-05-01", consensus: 49 },
    { date: "2026-04-01", consensus: 53 },
    { date: "2026-03-01", consensus: 56 },
    { date: "2026-02-01", consensus: 56.5 },
    { date: "2026-01-01", consensus: 54 },
    { date: "2025-12-01", consensus: 53 },
    { date: "2025-11-01", consensus: 53.5 },
    { date: "2025-10-01", consensus: 55 },
    { date: "2025-09-01", consensus: 55.5 },
    { date: "2025-08-01", consensus: 58.5 },
    { date: "2025-07-01", consensus: 61.5 },
    { date: "2025-06-01", consensus: 61 }
  ],
  indpro: [
    { date: "2026-07-01", consensus: 0.2 },
    { date: "2026-06-01", consensus: 0.3 },
    { date: "2026-05-01", consensus: 0.2 },
    { date: "2026-04-01", consensus: 0.4 },
    { date: "2026-03-01", consensus: 0.1 },
    { date: "2026-02-01", consensus: 0.5 },
    { date: "2026-01-01", consensus: 0.2 },
    { date: "2025-12-01", consensus: 0.3 },
    { date: "2025-11-01", consensus: 0 },
    { date: "2025-10-01", consensus: -0.1 },
    { date: "2025-09-01", consensus: 0.1 },
    { date: "2025-08-01", consensus: 0 },
    { date: "2025-07-01", consensus: 0.3 },
    { date: "2025-06-01", consensus: 0.4 }
  ],
  gdp: [
    { date: "2026-04-01", consensus: 2.3 },
    { date: "2026-01-01", consensus: 2.2 },
    { date: "2025-10-01", consensus: 2.4 },
    { date: "2025-07-01", consensus: 2.5 }
  ],
  eu_cpi: [
    { date: "2026-07-01", consensus: 2.8 },
    { date: "2026-06-01", consensus: 3 },
    { date: "2026-05-01", consensus: 3.1 },
    { date: "2026-04-01", consensus: 2.6 },
    { date: "2026-03-01", consensus: 2 },
    { date: "2026-02-01", consensus: 1.7 },
    { date: "2026-01-01", consensus: 1.9 },
    { date: "2025-12-01", consensus: 2.1 },
    { date: "2025-11-01", consensus: 2.1 },
    { date: "2025-10-01", consensus: 2.2 },
    { date: "2025-09-01", consensus: 2 },
    { date: "2025-08-01", consensus: 2 },
    { date: "2025-07-01", consensus: 2 },
    { date: "2025-06-01", consensus: 1.9 }
  ],
  eu_unemp: [
    { date: "2023-01-01", consensus: 6.7 }
  ],
  uk_cpi: [
    { date: "2025-03-01", consensus: 3.7 },
    { date: "2025-02-01", consensus: 3.8 },
    { date: "2025-01-01", consensus: 3.6 },
    { date: "2024-12-01", consensus: 3.4 },
    { date: "2024-11-01", consensus: 3.1 },
    { date: "2024-10-01", consensus: 2.7 },
    { date: "2024-09-01", consensus: 2.9 },
    { date: "2024-08-01", consensus: 3 },
    { date: "2024-07-01", consensus: 3.1 },
    { date: "2024-06-01", consensus: 2.8 },
    { date: "2024-05-01", consensus: 2.9 },
    { date: "2024-04-01", consensus: 3.1 },
    { date: "2024-03-01", consensus: 3.8 },
    { date: "2024-02-01", consensus: 3.9 }
  ],
  uk_unemp: [
    { date: "2026-04-01", consensus: 5 },
    { date: "2026-03-01", consensus: 4.9 },
    { date: "2026-02-01", consensus: 5 },
    { date: "2026-01-01", consensus: 5.1 },
    { date: "2025-12-01", consensus: 5.1 },
    { date: "2025-11-01", consensus: 5 },
    { date: "2025-10-01", consensus: 5 },
    { date: "2025-09-01", consensus: 4.9 },
    { date: "2025-08-01", consensus: 4.8 },
    { date: "2025-07-01", consensus: 4.7 },
    { date: "2025-06-01", consensus: 4.6 },
    { date: "2025-05-01", consensus: 4.6 },
    { date: "2025-04-01", consensus: 4.6 },
    { date: "2025-03-01", consensus: 4.5 }
  ],
  jp_cpi: [
    { date: "2021-06-01", consensus: -0.4 }
  ],
  wti: [
    { date: "2026-08-01", consensus: 82 }
  ],
  vix: [
    { date: "2026-08-01", consensus: 16 }
  ],
  brent: [
    { date: "2026-08-01", consensus: 88 }
  ],
  natgas: [
    { date: "2026-08-01", consensus: 2.9 }
  ],
  copper: [
    { date: "2026-07-01", consensus: 13200 }
  ],
  claims: [
    { date: "2026-08-01", consensus: 215e3 },
    { date: "2026-07-01", consensus: 22e4 },
    { date: "2026-06-01", consensus: 225e3 },
    { date: "2026-05-01", consensus: 215e3 },
    { date: "2026-04-01", consensus: 21e4 },
    { date: "2026-03-01", consensus: 215e3 },
    { date: "2026-02-01", consensus: 235e3 },
    { date: "2026-01-01", consensus: 24e4 },
    { date: "2025-12-01", consensus: 225e3 },
    { date: "2025-11-01", consensus: 23e4 },
    { date: "2025-10-01", consensus: 22e4 },
    { date: "2025-09-01", consensus: 205e3 },
    { date: "2025-08-01", consensus: 21e4 },
    { date: "2025-07-01", consensus: 215e3 }
  ],
  capacity: [
    { date: "2026-07-01", consensus: 76.1 },
    { date: "2026-06-01", consensus: 76 },
    { date: "2026-05-01", consensus: 75.9 },
    { date: "2026-04-01", consensus: 75.6 },
    { date: "2026-03-01", consensus: 75.5 },
    { date: "2026-02-01", consensus: 75.3 },
    { date: "2026-01-01", consensus: 75.4 },
    { date: "2025-12-01", consensus: 75.4 },
    { date: "2025-11-01", consensus: 75.5 },
    { date: "2025-10-01", consensus: 75.9 },
    { date: "2025-09-01", consensus: 76 },
    { date: "2025-08-01", consensus: 76.2 },
    { date: "2025-07-01", consensus: 76.4 },
    { date: "2025-06-01", consensus: 76.1 }
  ],
  eu_gdp: [
    { date: "2026-04-01", consensus: 0.8 },
    { date: "2026-01-01", consensus: 0.8 },
    { date: "2025-10-01", consensus: 1.1 },
    { date: "2025-07-01", consensus: 0.9 }
  ],
  china_cpi: [
    { date: "2025-04-01", consensus: 0.1 },
    { date: "2025-03-01", consensus: 0 },
    { date: "2025-02-01", consensus: -0.1 },
    { date: "2025-01-01", consensus: 0.2 },
    { date: "2024-12-01", consensus: 0.1 },
    { date: "2024-11-01", consensus: 0.2 },
    { date: "2024-10-01", consensus: 0.3 },
    { date: "2024-09-01", consensus: 0.4 },
    { date: "2024-08-01", consensus: 0.3 },
    { date: "2024-07-01", consensus: 0.5 },
    { date: "2024-06-01", consensus: 0.3 },
    { date: "2024-05-01", consensus: 0.3 },
    { date: "2024-04-01", consensus: 0.2 },
    { date: "2024-03-01", consensus: 0.2 }
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
      updated: "2026-08-29T10:40:40.265Z",
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
          value: -20
        },
        {
          date: "2025-07-01",
          value: 64
        },
        {
          date: "2025-08-01",
          value: -70
        },
        {
          date: "2025-09-01",
          value: 76
        },
        {
          date: "2025-10-01",
          value: -140
        },
        {
          date: "2025-11-01",
          value: 41
        },
        {
          date: "2025-12-01",
          value: -17
        },
        {
          date: "2026-01-01",
          value: 160
        },
        {
          date: "2026-02-01",
          value: -156
        },
        {
          date: "2026-03-01",
          value: 214
        },
        {
          date: "2026-04-01",
          value: 148
        },
        {
          date: "2026-05-01",
          value: 63
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
      updated: "2026-08-29T10:40:40.633Z",
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
          value: 4.5
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
      updated: "2026-08-29T10:40:40.905Z",
      last: {
        date: "2026-07-01",
        value: 3.3
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
          value: 2.38
        },
        {
          date: "2025-06-01",
          value: 2.68
        },
        {
          date: "2025-07-01",
          value: 2.74
        },
        {
          date: "2025-08-01",
          value: 2.94
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
          value: 2.65
        },
        {
          date: "2026-01-01",
          value: 2.39
        },
        {
          date: "2026-02-01",
          value: 2.43
        },
        {
          date: "2026-03-01",
          value: 3.29
        },
        {
          date: "2026-04-01",
          value: 3.78
        },
        {
          date: "2026-05-01",
          value: 4.17
        },
        {
          date: "2026-06-01",
          value: 3.46
        },
        {
          date: "2026-07-01",
          value: 3.3
        }
      ]
    },
    corecpi: {
      id: "corecpi",
      fred: "CPILFESL",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-29T10:40:41.218Z",
      last: {
        date: "2026-07-01",
        value: 2.47
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
          value: 2.77
        },
        {
          date: "2025-06-01",
          value: 2.91
        },
        {
          date: "2025-07-01",
          value: 3.05
        },
        {
          date: "2025-08-01",
          value: 3.11
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
          value: 2.65
        },
        {
          date: "2026-01-01",
          value: 2.51
        },
        {
          date: "2026-02-01",
          value: 2.47
        },
        {
          date: "2026-03-01",
          value: 2.6
        },
        {
          date: "2026-04-01",
          value: 2.74
        },
        {
          date: "2026-05-01",
          value: 2.82
        },
        {
          date: "2026-06-01",
          value: 2.57
        },
        {
          date: "2026-07-01",
          value: 2.47
        }
      ]
    },
    ppi: {
      id: "ppi",
      fred: "PPIACO",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-29T10:40:41.578Z",
      last: {
        date: "2026-07-01",
        value: 8.27
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
          value: 3.12
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
          value: 9.43
        },
        {
          date: "2026-05-01",
          value: 12.31
        },
        {
          date: "2026-06-01",
          value: 9.9
        },
        {
          date: "2026-07-01",
          value: 8.27
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
        value: 0.25
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
          value: 0.26
        },
        {
          date: "2026-05-01",
          value: 0.36
        },
        {
          date: "2026-06-01",
          value: 0.15
        },
        {
          date: "2026-07-01",
          value: 0.25
        }
      ]
    },
    ahe: {
      id: "ahe",
      fred: "CES0500000003",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-29T10:40:42.322Z",
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
          value: 3.86
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
          value: 3.73
        },
        {
          date: "2026-01-01",
          value: 3.66
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
          value: 3.57
        },
        {
          date: "2026-05-01",
          value: 3.34
        },
        {
          date: "2026-06-01",
          value: 3.41
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
      updated: "2026-08-29T10:40:45.520Z",
      last: {
        date: "2026-07-01",
        value: -0.75
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
          value: 1.25
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
          value: 0.5
        },
        {
          date: "2025-12-01",
          value: 0.06
        },
        {
          date: "2026-01-01",
          value: 0.02
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
          value: 0.22
        },
        {
          date: "2026-07-01",
          value: -0.75
        }
      ]
    },
    umich: {
      id: "umich",
      fred: "UMCSENT",
      mode: "level",
      unit: "index",
      updated: "2026-08-29T10:40:45.816Z",
      last: {
        date: "2026-07-01",
        value: 55.2
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
          value: 61.7
        },
        {
          date: "2025-08-01",
          value: 58.2
        },
        {
          date: "2025-09-01",
          value: 55.1
        },
        {
          date: "2025-10-01",
          value: 53.6
        },
        {
          date: "2025-11-01",
          value: 51
        },
        {
          date: "2025-12-01",
          value: 52.9
        },
        {
          date: "2026-01-01",
          value: 56.4
        },
        {
          date: "2026-02-01",
          value: 56.6
        },
        {
          date: "2026-03-01",
          value: 53.3
        },
        {
          date: "2026-04-01",
          value: 49.8
        },
        {
          date: "2026-05-01",
          value: 44.8
        },
        {
          date: "2026-06-01",
          value: 49.5
        },
        {
          date: "2026-07-01",
          value: 55.2
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
        date: "2026-04-01",
        value: 2.1
      },
      points: [
        {
          date: "2008-01-01",
          value: 1.39
        },
        {
          date: "2008-04-01",
          value: 1.38
        },
        {
          date: "2008-07-01",
          value: 0.27
        },
        {
          date: "2008-10-01",
          value: -2.54
        },
        {
          date: "2009-01-01",
          value: -3.23
        },
        {
          date: "2009-04-01",
          value: -3.98
        },
        {
          date: "2009-07-01",
          value: -3.13
        },
        {
          date: "2009-10-01",
          value: 0.11
        },
        {
          date: "2010-01-01",
          value: 1.75
        },
        {
          date: "2010-04-01",
          value: 2.91
        },
        {
          date: "2010-07-01",
          value: 3.34
        },
        {
          date: "2010-10-01",
          value: 2.78
        },
        {
          date: "2011-01-01",
          value: 2.04
        },
        {
          date: "2011-04-01",
          value: 1.74
        },
        {
          date: "2011-07-01",
          value: 0.94
        },
        {
          date: "2011-10-01",
          value: 1.54
        },
        {
          date: "2012-01-01",
          value: 2.64
        },
        {
          date: "2012-04-01",
          value: 2.4
        },
        {
          date: "2012-07-01",
          value: 2.57
        },
        {
          date: "2012-10-01",
          value: 1.55
        },
        {
          date: "2013-01-01",
          value: 1.7
        },
        {
          date: "2013-04-01",
          value: 1.52
        },
        {
          date: "2013-07-01",
          value: 2.24
        },
        {
          date: "2013-10-01",
          value: 3.01
        },
        {
          date: "2014-01-01",
          value: 1.65
        },
        {
          date: "2014-04-01",
          value: 2.69
        },
        {
          date: "2014-07-01",
          value: 3.06
        },
        {
          date: "2014-10-01",
          value: 2.69
        },
        {
          date: "2015-01-01",
          value: 3.97
        },
        {
          date: "2015-04-01",
          value: 3.28
        },
        {
          date: "2015-07-01",
          value: 2.45
        },
        {
          date: "2015-10-01",
          value: 2.12
        },
        {
          date: "2016-01-01",
          value: 1.8
        },
        {
          date: "2016-04-01",
          value: 1.49
        },
        {
          date: "2016-07-01",
          value: 1.81
        },
        {
          date: "2016-10-01",
          value: 2.18
        },
        {
          date: "2017-01-01",
          value: 2.09
        },
        {
          date: "2017-04-01",
          value: 2.33
        },
        {
          date: "2017-07-01",
          value: 2.41
        },
        {
          date: "2017-10-01",
          value: 2.99
        },
        {
          date: "2018-01-01",
          value: 3.33
        },
        {
          date: "2018-04-01",
          value: 3.3
        },
        {
          date: "2018-07-01",
          value: 3.13
        },
        {
          date: "2018-10-01",
          value: 2.13
        },
        {
          date: "2019-01-01",
          value: 1.93
        },
        {
          date: "2019-04-01",
          value: 2.24
        },
        {
          date: "2019-07-01",
          value: 2.8
        },
        {
          date: "2019-10-01",
          value: 3.35
        },
        {
          date: "2020-01-01",
          value: 1.36
        },
        {
          date: "2020-04-01",
          value: -7.4
        },
        {
          date: "2020-07-01",
          value: -1.36
        },
        {
          date: "2020-10-01",
          value: -0.92
        },
        {
          date: "2021-01-01",
          value: 1.8
        },
        {
          date: "2021-04-01",
          value: 12.39
        },
        {
          date: "2021-07-01",
          value: 5.15
        },
        {
          date: "2021-10-01",
          value: 5.76
        },
        {
          date: "2022-01-01",
          value: 4.03
        },
        {
          date: "2022-04-01",
          value: 2.45
        },
        {
          date: "2022-07-01",
          value: 2.35
        },
        {
          date: "2022-10-01",
          value: 1.32
        },
        {
          date: "2023-01-01",
          value: 2.31
        },
        {
          date: "2023-04-01",
          value: 2.79
        },
        {
          date: "2023-07-01",
          value: 3.23
        },
        {
          date: "2023-10-01",
          value: 3.39
        },
        {
          date: "2024-01-01",
          value: 2.86
        },
        {
          date: "2024-04-01",
          value: 3.13
        },
        {
          date: "2024-07-01",
          value: 2.79
        },
        {
          date: "2024-10-01",
          value: 2.4
        },
        {
          date: "2025-01-01",
          value: 2.02
        },
        {
          date: "2025-04-01",
          value: 2.08
        },
        {
          date: "2025-07-01",
          value: 2.34
        },
        {
          date: "2025-10-01",
          value: 1.99
        },
        {
          date: "2026-01-01",
          value: 2.68
        },
        {
          date: "2026-04-01",
          value: 2.1
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
      unit: "ribu",
      updated: "2026-08-29T10:40:54.065Z",
      last: {
        date: "2026-08-01",
        value: 176119.5
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
          value: 228071.25
        },
        {
          date: "2025-08-01",
          value: 195403.8
        },
        {
          date: "2025-09-01",
          value: 190112.25
        },
        {
          date: "2025-10-01",
          value: 206641.5
        },
        {
          date: "2025-11-01",
          value: 223173.8
        },
        {
          date: "2025-12-01",
          value: 276501
        },
        {
          date: "2026-01-01",
          value: 277336.8
        },
        {
          date: "2026-02-01",
          value: 217197.25
        },
        {
          date: "2026-03-01",
          value: 192817.25
        },
        {
          date: "2026-04-01",
          value: 200975.5
        },
        {
          date: "2026-05-01",
          value: 186951.8
        },
        {
          date: "2026-06-01",
          value: 218054.5
        },
        {
          date: "2026-07-01",
          value: 210532.5
        },
        {
          date: "2026-08-01",
          value: 176119.5
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
    }
  }
};

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
var LIVE_TTL = 6 * 60 * 60 * 1e3;
var FAIL_TTL = 5 * 60 * 1e3;
function getSeedSeries(id) {
  const def = getSeries(id);
  const entry = seed_default.series[id];
  if (!def || !entry) return null;
  return { ...def, points: entry.points, last: entry.last, source: "seed", updated: entry.updated };
}
var SEED_META = {
  source: seed_default.source,
  generated: seed_default.generated
};

// .smoke31-entry.jsx
import { jsx as jsx5 } from "react/jsx-runtime";
function enrich(e) {
  let previous = null, forecast = null;
  if (e.indicatorId) {
    const d = e.iso.slice(0, 10);
    const pts = getSeedSeries(e.indicatorId)?.points || [];
    for (const p of pts) {
      if (p.date < d) previous = p.value;
      else break;
    }
    const period = d.slice(0, 8) + "01";
    const cons = (CONSENSUS[e.indicatorId] || []).find((c) => c.date === period);
    if (cons && cons.consensus != null) forecast = cons.consensus;
  }
  return { ...e, iso: e.iso, forecast, actual: null, previous };
}
function App() {
  const events = useState3(() => UPCOMING.map(enrich).sort((a, b) => a.iso.localeCompare(b.iso)))[0];
  return /* @__PURE__ */ jsx5(CalendarClient, { events });
}
export {
  App as default
};
