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
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
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
            isPast && e.actual == null && /* @__PURE__ */ jsx4("i", { className: "cal-released", children: "RELEASED" })
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
          /* @__PURE__ */ jsxs4("span", { className: "cal-r-metrics mono", children: [
            e.previous != null && /* @__PURE__ */ jsxs4("b", { title: "Previous", children: [
              /* @__PURE__ */ jsx4("u", { children: "P" }),
              fmtVal(e.previous)
            ] }),
            e.forecast != null && /* @__PURE__ */ jsxs4("b", { title: "Konsensus", children: [
              /* @__PURE__ */ jsx4("u", { children: "K" }),
              fmtVal(e.forecast)
            ] }),
            e.actual != null && /* @__PURE__ */ jsxs4("b", { className: "act", title: "Actual", children: [
              /* @__PURE__ */ jsx4("u", { children: "A" }),
              fmtVal(e.actual)
            ] }),
            !hasData && /* @__PURE__ */ jsx4("span", { className: "dim", children: "\u2014" })
          ] }),
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
        "SRC: JADWAL RESMI BLS/FED/ECB/ONS",
        "",
        " \xB7 N: ",
        filtered.length,
        " \xB7 ZONA: WIB (UTC+7)"
      ] }),
      /* @__PURE__ */ jsx4("span", { className: "cal-term-foot-note", children: "Jadwal bisa berubah \u2014 verifikasi ke sumber resmi" }),
      /* @__PURE__ */ jsx4("span", { className: "ct-blink", "aria-hidden": "true", children: "\u25CF" })
    ] })
  ] });
}

// .smoke28-entry.jsx
import { jsx as jsx5 } from "react/jsx-runtime";
function App() {
  const dstr = (days) => {
    const d = new Date(Date.now() + days * 864e5);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const ev = (days, time, title, category, country, impact, indicatorId, extra = {}) => ({
    title,
    category,
    country,
    impact,
    indicatorId,
    time,
    iso: `${dstr(days)}T${time}:00+07:00`,
    ...extra
  });
  const events = [
    ev(-1, "19:30", "Consumer Price Index (CPI)", "inflasi", "US", "High", "cpi", {
      actual: "3.30",
      previous: "3.40",
      forecast: "3.40"
    }),
    ev(0, "10:00", "Retail Sales (JP)", "konsumen", "JP", "Low", "retail"),
    ev(0, "16:30", "Nonfarm Payrolls (NFP)", "tenaga-kerja", "US", "Medium", "nfp"),
    ev(0, "19:30", "Consumer Price Index (CPI)", "inflasi", "US", "High", "cpi"),
    ev(1, "01:00", "FOMC Federal Funds Rate", "moneter", "US", "High", "fedfunds"),
    ev(1, "07:00", "GDP (UK)", "pertumbuhan", "GB", "Low", "gdp")
  ];
  return /* @__PURE__ */ jsx5(CalendarClient, { events });
}
export {
  App as default
};
