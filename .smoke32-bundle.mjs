// .smoke32-entry.jsx
import { useEffect as useEffect5, useState as useState5 } from "react";

// components/CalendarClient.jsx
import { useEffect as useEffect4, useMemo as useMemo2, useRef as useRef2, useState as useState4 } from "react";

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
var COUNTRIES = [
  { id: "US", name: "Amerika Serikat", flag: "\u{1F1FA}\u{1F1F8}" },
  { id: "EZ", name: "Zona Euro", flag: "\u{1F1EA}\u{1F1FA}" },
  { id: "UK", name: "Inggris", flag: "\u{1F1EC}\u{1F1E7}" },
  { id: "JP", name: "Jepang", flag: "\u{1F1EF}\u{1F1F5}" },
  { id: "CN", name: "Tiongkok", flag: "\u{1F1E8}\u{1F1F3}" },
  { id: "GL", name: "Global", flag: "\u{1F310}" }
];

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
function ImpactBadge({ level }) {
  const map = {
    High: { c: "#fb7185", bg: "rgba(251,113,133,0.16)" },
    Medium: { c: "#fbbf24", bg: "rgba(251,191,36,0.16)" },
    Low: { c: "#34d399", bg: "rgba(52,211,153,0.16)" }
  };
  const s = map[level] || map.Low;
  return /* @__PURE__ */ jsx3("span", { className: "badge impact", style: { color: s.c, background: s.bg }, children: level });
}
function CategoryBadge({ id, label, color }) {
  return /* @__PURE__ */ jsxs2("span", { className: "badge cat", style: { color, background: `${color}22` }, children: [
    /* @__PURE__ */ jsx3("span", { className: "dot", style: { background: color } }),
    label
  ] });
}
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

// components/IndicatorClient.jsx
import { useEffect as useEffect3, useMemo, useState as useState3 } from "react";

// components/Chart.jsx
import { useEffect as useEffect2, useRef, useState as useState2 } from "react";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function Chart({ points, height = 260, color = "#38bdf8", unit = "", decimals = 2 }) {
  const ref = useRef(null);
  const [dims, setDims] = useState2({ w: 800, h: height });
  const [hover, setHover] = useState2(null);
  useEffect2(() => {
    const node = ref.current;
    if (!node) return;
    const ro = new ResizeObserver((entries) => {
      const w2 = entries[0]?.contentRect?.width || 800;
      setDims({ w: w2, h: height });
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [height]);
  const data = (points || []).map((p) => ({ ...p, v: typeof p.value === "number" ? p.value : null })).filter((p) => p.v !== null);
  if (!data.length) {
    return /* @__PURE__ */ jsx4("div", { ref, className: "chart-empty", style: { height }, children: /* @__PURE__ */ jsx4("span", { children: "Tidak ada data untuk ditampilkan" }) });
  }
  const { w, h } = dims;
  const pad = { top: 22, right: 18, bottom: 28, left: 46 };
  const iw = w - pad.left - pad.right;
  const ih = h - pad.top - pad.bottom;
  const values = data.map((d) => d.v);
  let min = Math.min(...values);
  let max = Math.max(...values);
  const range = max - min || 1;
  min -= range * 0.12;
  max += range * 0.12;
  const span = max - min;
  const step = iw / Math.max(data.length - 1, 1);
  const x = (i) => pad.left + i * step;
  const y = (v) => pad.top + ih - (v - min) / span * ih;
  const path = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.v).toFixed(1)}`).join(" ");
  const area = `${path} L ${x(data.length - 1).toFixed(1)} ${pad.top + ih} L ${x(0).toFixed(1)} ${pad.top + ih} Z`;
  const fmt2 = (v) => {
    const n = Number(v);
    if (isNaN(n)) return "\u2014";
    return n.toLocaleString("id-ID", { maximumFractionDigits: decimals, minimumFractionDigits: 0 });
  };
  const nTicks = 5;
  const ticks = Array.from({ length: nTicks }, (_, i) => min + span * i / (nTicks - 1));
  const maxLabels = Math.max(2, Math.floor(iw / 64));
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.min(7, maxLabels)));
  let hx = null, hy = null, hd = null;
  if (hover !== null && data[hover]) {
    hx = x(hover);
    hy = y(data[hover].v);
    hd = data[hover];
  }
  const gradId = "areaGrad";
  return /* @__PURE__ */ jsxs4("div", { ref, className: "chart-wrap", children: [
    /* @__PURE__ */ jsxs4("svg", { width: w, height: h, viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: "none", children: [
      /* @__PURE__ */ jsx4("defs", { children: /* @__PURE__ */ jsxs4("linearGradient", { id: gradId, x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx4("stop", { offset: "0%", stopColor: color, stopOpacity: "0.32" }),
        /* @__PURE__ */ jsx4("stop", { offset: "100%", stopColor: color, stopOpacity: "0.02" })
      ] }) }),
      ticks.map((t, i) => {
        const yy = y(t);
        return /* @__PURE__ */ jsxs4("g", { children: [
          /* @__PURE__ */ jsx4("line", { x1: pad.left, y1: yy, x2: w - pad.right, y2: yy, className: "chart-grid" }),
          /* @__PURE__ */ jsx4("text", { x: pad.left - 8, y: yy + 4, className: "chart-tick", textAnchor: "end", children: fmt2(t) })
        ] }, i);
      }),
      /* @__PURE__ */ jsx4("path", { d: area, fill: `url(#${gradId})` }),
      /* @__PURE__ */ jsx4("path", { d: path, fill: "none", stroke: color, strokeWidth: "2.2", strokeLinejoin: "round", strokeLinecap: "round" }),
      data.map(
        (d, i) => i % labelEvery === 0 || i === data.length - 1 ? /* @__PURE__ */ jsx4("text", { x: x(i), y: h - 8, className: "chart-tick", textAnchor: "middle", children: d.date.slice(0, 7) }, i) : null
      ),
      hover !== null && hd && /* @__PURE__ */ jsxs4("g", { children: [
        /* @__PURE__ */ jsx4("line", { x1: hx, y1: pad.top, x2: hx, y2: pad.top + ih, className: "chart-hover-line" }),
        /* @__PURE__ */ jsx4("circle", { cx: hx, cy: hy, r: "4.5", fill: color, stroke: "#0b1220", strokeWidth: "2" })
      ] })
    ] }),
    hover !== null && hd && /* @__PURE__ */ jsxs4("div", { className: "chart-tooltip", style: { left: Math.min(hx, w - 170), top: Math.max(hy - 40, 4) }, children: [
      /* @__PURE__ */ jsx4("div", { className: "tt-date", children: hd.date }),
      /* @__PURE__ */ jsxs4("div", { className: "tt-value", children: [
        fmt2(hd.v),
        " ",
        /* @__PURE__ */ jsx4("span", { children: unit })
      ] })
    ] }),
    /* @__PURE__ */ jsx4(
      "div",
      {
        style: { position: "absolute", inset: 0 },
        onMouseMove: (e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const rel = e.clientX - rect.left;
          const idx = Math.round((rel - pad.left) / step);
          if (idx >= 0 && idx < data.length) setHover(idx);
        },
        onMouseLeave: () => setHover(null)
      }
    )
  ] });
}

// lib/format.js
function fmt(v, decimals = 2) {
  if (v === null || v === void 0 || isNaN(v)) return "\u2014";
  return Number(v).toLocaleString("id-ID", { maximumFractionDigits: decimals, minimumFractionDigits: 0 });
}

// components/IndicatorClient.jsx
import { Fragment, jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
function useNow() {
  const [now, setNow] = useState3(null);
  useEffect3(() => {
    setNow(/* @__PURE__ */ new Date());
    const t = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(t);
  }, []);
  return now;
}
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState3(false);
  useEffect3(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", fn);
    return () => mq.removeEventListener?.("change", fn);
  }, []);
  return reduced;
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
function fmtDay(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function CountUp({ value, decimals = 1, prefix = "" }) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState3(null);
  useEffect3(() => {
    if (reduced || value === null || value === void 0) {
      setShown(value);
      return;
    }
    let raf = null;
    const t0 = performance.now();
    const dur = 900;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setShown(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduced]);
  if (shown === null || shown === void 0) return /* @__PURE__ */ jsxs5("span", { children: [
    prefix,
    "\u2014"
  ] });
  return /* @__PURE__ */ jsxs5("span", { children: [
    prefix,
    fmt(shown, decimals)
  ] });
}
function SurpriseGauge({ idx, tol = 0.5, scale = 1 }) {
  if (idx === null || idx === void 0 || isNaN(idx)) {
    return /* @__PURE__ */ jsx5("div", { className: "ind-gauge", children: /* @__PURE__ */ jsx5("span", { className: "ind-gauge-none mono", children: "SURPRISE INDEX BELUM TERSEDIA" }) });
  }
  const clamped = Math.max(-100, Math.min(100, idx));
  const pos = 50 + clamped / 2;
  const tolPct = Math.min(30, tol / scale * 50);
  return /* @__PURE__ */ jsxs5("div", { className: "ind-gauge", role: "img", "aria-label": `Surprise index ${idx}`, children: [
    /* @__PURE__ */ jsxs5("div", { className: "ind-gauge-track", children: [
      /* @__PURE__ */ jsx5("i", { className: "zone miss", style: { left: 0, width: 50 - tolPct } }),
      /* @__PURE__ */ jsx5("i", { className: "zone inline", style: { left: 50 - tolPct, width: tolPct * 2 } }),
      /* @__PURE__ */ jsx5("i", { className: "zone beat", style: { left: 50 + tolPct, width: 50 - tolPct } }),
      /* @__PURE__ */ jsx5("span", { className: "ind-gauge-center", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx5("span", { className: "ind-gauge-needle", style: { left: `${pos}%` }, "aria-hidden": "true", children: /* @__PURE__ */ jsxs5("b", { children: [
        idx > 0 ? "+" : "",
        idx.toFixed(1)
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs5("div", { className: "ind-gauge-scale mono", children: [
      /* @__PURE__ */ jsx5("span", { children: "MISS (di bawah konsensus)" }),
      /* @__PURE__ */ jsx5("span", { children: "SURPRISE INDEX" }),
      /* @__PURE__ */ jsx5("span", { children: "BEAT (di atas konsensus)" })
    ] })
  ] });
}
var DIR_TXT = { up: "\u25B2", down: "\u25BC", flat: "\u2014" };
function EduTab({ edu, general }) {
  const tabs = [
    { id: "read", label: "CARA MEMBACA" },
    { id: "outlook", label: "PROSPEK" },
    { id: "drivers", label: "PENGERAK" },
    ...edu.expertViews?.length ? [{ id: "experts", label: "PAKAR" }] : []
  ];
  const [tab, setTab] = useState3("read");
  return /* @__PURE__ */ jsxs5("div", { className: "ind-edu", children: [
    /* @__PURE__ */ jsx5("div", { className: "ind-edu-tabs", role: "tablist", children: tabs.map((t) => /* @__PURE__ */ jsx5("button", { role: "tab", "aria-selected": tab === t.id, className: `cal-chip ind-edu-tab ${tab === t.id ? "on" : ""}`, onClick: () => setTab(t.id), children: t.label }, t.id)) }),
    /* @__PURE__ */ jsxs5("div", { className: "ind-edu-panel", children: [
      tab === "read" && /* @__PURE__ */ jsx5("ol", { className: "ind-steps mono", children: edu.read.map((p, i) => /* @__PURE__ */ jsxs5("li", { children: [
        /* @__PURE__ */ jsx5("b", { children: String(i + 1).padStart(2, "0") }),
        p
      ] }, i)) }),
      tab === "outlook" && /* @__PURE__ */ jsxs5("div", { className: "ind-outlook", children: [
        /* @__PURE__ */ jsx5("p", { className: "ind-outlook-text", children: edu.outlook }),
        edu.scenarios?.length > 0 && /* @__PURE__ */ jsxs5("div", { className: "ind-scenarios", children: [
          /* @__PURE__ */ jsxs5("div", { className: "ind-scen-head mono", children: [
            /* @__PURE__ */ jsx5("span", { children: "SKENARIO" }),
            /* @__PURE__ */ jsx5("span", { children: "EFEK PASAR" }),
            /* @__PURE__ */ jsx5("span", { children: "ARAH" })
          ] }),
          edu.scenarios.map((s, i) => /* @__PURE__ */ jsxs5("div", { className: `ind-scen-row ${s.dir}`, children: [
            /* @__PURE__ */ jsx5("span", { className: "ind-scen-label", children: s.label }),
            /* @__PURE__ */ jsx5("span", { className: "ind-scen-effect", children: s.effect }),
            /* @__PURE__ */ jsxs5("span", { className: "ind-scen-dir mono", children: [
              DIR_TXT[s.dir],
              " ",
              s.cur
            ] })
          ] }, i))
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "ind-watch", children: [
          /* @__PURE__ */ jsx5("span", { className: "mono", children: "PANTAU:" }),
          edu.watch.map((w, i) => /* @__PURE__ */ jsx5("span", { className: "ind-watch-chip", children: w }, i))
        ] })
      ] }),
      tab === "drivers" && /* @__PURE__ */ jsx5("div", { className: "ind-drivers", children: (edu.drivers || []).map((d, i) => /* @__PURE__ */ jsxs5("div", { className: "ind-driver", children: [
        /* @__PURE__ */ jsxs5("div", { className: "ind-driver-head mono", children: [
          /* @__PURE__ */ jsx5("b", { children: i + 1 }),
          " ",
          d.name
        ] }),
        /* @__PURE__ */ jsx5("p", { children: d.detail }),
        d.data && /* @__PURE__ */ jsxs5("div", { className: "ind-driver-data mono", children: [
          "\u{1F4CA} ",
          d.data
        ] }),
        d.src && /* @__PURE__ */ jsxs5("a", { className: "ind-driver-src mono", href: d.src.url, target: "_blank", rel: "noopener noreferrer", title: d.src.url, children: [
          d.src.label,
          " \u2197"
        ] })
      ] }, i)) }),
      tab === "experts" && /* @__PURE__ */ jsxs5("div", { className: "ind-experts", children: [
        /* @__PURE__ */ jsx5("p", { className: "ind-experts-note", children: general.expertNote }),
        /* @__PURE__ */ jsx5("div", { className: "ind-expert-grid", children: edu.expertViews.map((e, i) => /* @__PURE__ */ jsxs5("div", { className: "ind-expert", children: [
          /* @__PURE__ */ jsxs5("div", { className: "ind-expert-head", children: [
            /* @__PURE__ */ jsx5("span", { className: "ind-expert-avatar mono", children: (e.desk || "?").charAt(0) }),
            /* @__PURE__ */ jsxs5("div", { children: [
              /* @__PURE__ */ jsx5("b", { children: e.desk }),
              /* @__PURE__ */ jsx5("i", { children: "Analis Global" })
            ] })
          ] }),
          /* @__PURE__ */ jsx5("p", { children: e.view }),
          /* @__PURE__ */ jsxs5("div", { className: "ind-expert-signal mono", children: [
            "\u25B8 ",
            e.signal
          ] })
        ] }, i)) })
      ] })
    ] })
  ] });
}
function IndicatorClient({ data, releases, accuracy, source, edu, general, cat, country, upcoming }) {
  const now = useNow();
  const pts = useMemo(() => data.points || [], [data]);
  const v = pts.length ? pts[pts.length - 1].value : null;
  const prev = pts.length > 1 ? pts[pts.length - 2].value : null;
  const yearAgo = pts.length > 12 ? pts[pts.length - 13].value : null;
  const lastDate = pts.length ? pts[pts.length - 1].date : null;
  const isQ = data.freq === "Q";
  const perYear = isQ ? 4 : 12;
  const RANGES = [
    { id: "1y", label: "1T", n: perYear },
    { id: "3y", label: "3T", n: perYear * 3 },
    { id: "5y", label: "5T", n: perYear * 5 },
    { id: "all", label: "SEMUA", n: null }
  ];
  const [range, setRange] = useState3(isQ ? "all" : "3y");
  const shown = useMemo(() => {
    const r = RANGES.find((x) => x.id === range);
    return r?.n ? pts.slice(-r.n) : pts;
  }, [pts, range]);
  const latest = releases?.length ? releases[releases.length - 1] : null;
  const hist = useMemo(() => (releases || []).slice(-6).reverse(), [releases]);
  const nextRel = useMemo(() => {
    if (!now || !upcoming?.length) return null;
    const t = now.getTime();
    return upcoming.filter((e) => new Date(e.iso).getTime() > t).sort((a, b) => a.iso.localeCompare(b.iso))[0] || null;
  }, [upcoming, now]);
  const mom = v !== null && prev !== null ? v - prev : null;
  const yoy = v !== null && yearAgo !== null ? v - yearAgo : null;
  const rows12 = useMemo(() => {
    const arr = pts.slice(-12).reverse();
    const out = [];
    for (let i = 0; i < arr.length; i++) {
      const p = arr[i];
      const next = arr[i - 1];
      const c = next ? p.value - next.value : null;
      out.push({ ...p, c });
    }
    const maxAbs = Math.max(...out.map((r) => Math.abs(r.c) || 0), 1e-9);
    out.forEach((r) => {
      r.bar = r.c === null ? 0 : Math.abs(r.c) / maxAbs * 100;
    });
    return out;
  }, [pts]);
  const maxSurp = Math.max(...hist.map((r) => Math.abs(r.surprise) || 0), 1e-9);
  const srcLive = source === "live" || data.source === "live";
  return /* @__PURE__ */ jsxs5("div", { className: "ind-term", children: [
    /* @__PURE__ */ jsx5("div", { className: "ct-scan", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs5("header", { className: "ind-term-head", children: [
      /* @__PURE__ */ jsxs5("span", { className: "ct-dots", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx5("i", {}),
        /* @__PURE__ */ jsx5("i", {}),
        /* @__PURE__ */ jsx5("i", {})
      ] }),
      /* @__PURE__ */ jsxs5("span", { className: "ind-term-title mono", children: [
        "MACROLAB ",
        /* @__PURE__ */ jsx5("em", { children: "//" }),
        " INDICATOR:\xA0",
        data.short?.toUpperCase(),
        " ",
        /* @__PURE__ */ jsx5("span", { className: "ct-ver", children: "v1.0" }),
        /* @__PURE__ */ jsx5("span", { className: "ct-cursor", "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ jsxs5("span", { className: "ind-term-head-right", children: [
        /* @__PURE__ */ jsxs5("span", { className: `ct-led ${srcLive ? "ok" : "warn"}`, children: [
          srcLive ? "FRED LIVE" : "CACHE LOKAL",
          " \xB7 ",
          data.updated?.slice(0, 10)
        ] }),
        /* @__PURE__ */ jsx5(TermClock, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxs5("section", { className: "ind-readout", children: [
      /* @__PURE__ */ jsxs5("div", { className: "ind-readout-main", children: [
        /* @__PURE__ */ jsxs5("div", { className: "ind-readout-id", children: [
          /* @__PURE__ */ jsxs5("b", { className: "ind-readout-name", children: [
            /* @__PURE__ */ jsx5(CountryFlag, { code: data.country, size: 20, showCode: false }),
            data.name
          ] }),
          /* @__PURE__ */ jsxs5("div", { className: "ind-readout-badges", children: [
            /* @__PURE__ */ jsx5("span", { className: "ind-readout-country mono", children: country?.name || "Global" }),
            /* @__PURE__ */ jsx5(CategoryBadge, { id: cat?.id, label: cat?.label, color: cat?.color }),
            /* @__PURE__ */ jsx5(ImpactBadge, { level: data.impact }),
            /* @__PURE__ */ jsx5("span", { className: "ind-chip mono", children: data.freq === "D" ? "HARIAN" : data.freq === "Q" ? "KUARTALAN" : "BULANAN" }),
            /* @__PURE__ */ jsxs5("span", { className: "ind-chip mono", title: data.release, children: [
              "RILIS: ",
              data.release
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "ind-readout-value mono", children: [
          /* @__PURE__ */ jsx5(CountUp, { value: v, decimals: data.decimals }),
          v !== null && /* @__PURE__ */ jsx5("span", { className: "ind-readout-unit", children: data.unit }),
          /* @__PURE__ */ jsxs5("span", { className: "ind-readout-asof mono", children: [
            "AS-OF ",
            lastDate || "\u2014"
          ] })
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "ind-readout-stats mono", children: [
          /* @__PURE__ */ jsxs5("div", { className: "ind-stat", children: [
            /* @__PURE__ */ jsx5("span", { children: "\u0394 PERIODE" }),
            /* @__PURE__ */ jsx5("b", { className: mom === null ? "" : mom >= 0 ? "up" : "down", children: mom === null ? "\u2014" : `${mom >= 0 ? "\u25B2 +" : "\u25BC "}${fmt(mom, data.decimals)}` }),
            /* @__PURE__ */ jsx5("i", { children: "vs periode sebelumnya" })
          ] }),
          /* @__PURE__ */ jsxs5("div", { className: "ind-stat", children: [
            /* @__PURE__ */ jsx5("span", { children: "\u0394 SETAHUN" }),
            /* @__PURE__ */ jsx5("b", { className: yoy === null ? "" : yoy >= 0 ? "up" : "down", children: yoy === null ? "\u2014" : `${yoy >= 0 ? "\u25B2 +" : "\u25BC "}${fmt(yoy, data.decimals)}` }),
            /* @__PURE__ */ jsx5("i", { children: "vs 12 periode lalu" })
          ] }),
          /* @__PURE__ */ jsxs5("div", { className: "ind-stat", children: [
            /* @__PURE__ */ jsx5("span", { children: "NIAT POINT" }),
            /* @__PURE__ */ jsx5("b", { children: pts.length }),
            /* @__PURE__ */ jsxs5("i", { children: [
              "sejak ",
              pts.length ? pts[0].date : "\u2014"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs5("div", { className: "ind-next", children: [
        /* @__PURE__ */ jsxs5("div", { className: "ind-next-label mono", children: [
          /* @__PURE__ */ jsx5("span", { className: "ct-tag", children: "00" }),
          " NEXT RELEASE"
        ] }),
        nextRel ? /* @__PURE__ */ jsxs5("div", { className: "ind-next-body", children: [
          /* @__PURE__ */ jsx5("b", { className: "ind-next-title", children: nextRel.title }),
          /* @__PURE__ */ jsxs5("span", { className: "ind-next-when mono", children: [
            DAY_NAMES[new Date(nextRel.iso).getDay()],
            " \xB7 ",
            nextRel.iso.slice(8, 10),
            " ",
            MONTHS[Number(nextRel.iso.slice(5, 7)) - 1],
            " ",
            nextRel.iso.slice(0, 4),
            " \xB7 ",
            nextRel.time,
            " WIB"
          ] }),
          /* @__PURE__ */ jsxs5("div", { className: "ind-next-cd mono", children: [
            /* @__PURE__ */ jsx5("b", { children: fmtCountdown(new Date(nextRel.iso).getTime() - now.getTime()) }),
            /* @__PURE__ */ jsx5("span", { children: "menuju rilis" })
          ] })
        ] }) : /* @__PURE__ */ jsxs5("div", { className: "ind-next-body", children: [
          /* @__PURE__ */ jsx5("span", { className: "ind-next-none mono", children: "TIDAK ADA DALAM JADWAL AKTIF" }),
          /* @__PURE__ */ jsxs5("span", { className: "ind-next-sched mono", children: [
            "Pola rilis: ",
            data.release
          ] })
        ] })
      ] })
    ] }),
    latest && /* @__PURE__ */ jsxs5("section", { className: "ind-term-sec", children: [
      /* @__PURE__ */ jsxs5("div", { className: "ct-block-head", children: [
        /* @__PURE__ */ jsx5("span", { className: "ct-tag", children: "01" }),
        /* @__PURE__ */ jsx5("h4", { children: "Consensus vs Actual \u2014 Rilis Terakhir" }),
        /* @__PURE__ */ jsxs5("span", { className: "ct-block-meta mono", children: [
          "\u25B8 ",
          latest.date,
          " \xB7 SRC: ",
          latest.source?.toUpperCase()
        ] })
      ] }),
      /* @__PURE__ */ jsxs5("div", { className: "ind-cells mono", children: [
        /* @__PURE__ */ jsxs5("div", { className: "ind-cell", children: [
          /* @__PURE__ */ jsx5("span", { children: "PREVIOUS" }),
          /* @__PURE__ */ jsx5("b", { children: latest.previous == null ? "\u2014" : fmt(latest.previous, data.decimals) })
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "ind-cell", children: [
          /* @__PURE__ */ jsx5("span", { children: "CONSENSUS" }),
          /* @__PURE__ */ jsx5("b", { children: latest.consensus == null ? "\u2014" : fmt(latest.consensus, data.decimals) })
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "ind-cell act", children: [
          /* @__PURE__ */ jsx5("span", { children: "ACTUAL" }),
          /* @__PURE__ */ jsx5("b", { children: latest.actual == null ? "\u2014" : fmt(latest.actual, data.decimals) })
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: `ind-cell ${latest.surprise > 0 ? "good" : latest.surprise < 0 ? "bad" : "flat"}`, children: [
          /* @__PURE__ */ jsx5("span", { children: "SURPRISE" }),
          /* @__PURE__ */ jsx5("b", { children: latest.surprise == null ? "\u2014" : `${latest.surprise > 0 ? "+" : ""}${fmt(latest.surprise, data.decimals)}` }),
          /* @__PURE__ */ jsx5("i", { children: latest.surprisePct == null ? "" : `${latest.surprisePct > 0 ? "+" : ""}${latest.surprisePct.toFixed(2)}% vs konsensus` })
        ] })
      ] }),
      /* @__PURE__ */ jsx5(SurpriseGauge, { idx: latest.surpriseIdx, tol: accuracy?.tol, scale: data.scale || 1 }),
      accuracy && accuracy.samples > 0 && /* @__PURE__ */ jsxs5("div", { className: "ind-acc mono", children: [
        /* @__PURE__ */ jsx5("span", { className: "ind-acc-title", children: "AKURASI KONSENSUS" }),
        /* @__PURE__ */ jsxs5("span", { className: "ind-acc-item", children: [
          /* @__PURE__ */ jsx5("i", { children: "HIT-RATE" }),
          /* @__PURE__ */ jsx5("b", { children: accuracy.hitRate != null ? `${accuracy.hitRate}%` : "\u2014" }),
          /* @__PURE__ */ jsxs5("em", { children: [
            "tol \xB1",
            accuracy.tol
          ] })
        ] }),
        /* @__PURE__ */ jsxs5("span", { className: "ind-acc-item", children: [
          /* @__PURE__ */ jsx5("i", { children: "BEAT / INLINE / MISS" }),
          /* @__PURE__ */ jsxs5("b", { children: [
            accuracy.beats,
            " / ",
            accuracy.inlines,
            " / ",
            accuracy.misses
          ] }),
          /* @__PURE__ */ jsxs5("em", { children: [
            "N=",
            accuracy.samples
          ] })
        ] }),
        /* @__PURE__ */ jsxs5("span", { className: "ind-acc-item", children: [
          /* @__PURE__ */ jsx5("i", { children: "AKURASI ARAH" }),
          /* @__PURE__ */ jsx5("b", { children: accuracy.dirAcc != null ? `${accuracy.dirAcc}%` : "\u2014" }),
          /* @__PURE__ */ jsx5("em", { children: "vs previous" })
        ] }),
        /* @__PURE__ */ jsxs5("span", { className: "ind-acc-item", children: [
          /* @__PURE__ */ jsx5("i", { children: "KEJUTAN TERBESAR" }),
          /* @__PURE__ */ jsx5("b", { children: accuracy.maxSurprise == null ? "\u2014" : `${accuracy.maxSurprise > 0 ? "+" : ""}${accuracy.maxSurprise}` }),
          /* @__PURE__ */ jsx5("em", { children: accuracy.maxSurpriseDate || "" })
        ] }),
        accuracy.streak && /* @__PURE__ */ jsxs5("span", { className: `ind-acc-item ${accuracy.streak.kind === "BEAT" ? "good" : "bad"}`, children: [
          /* @__PURE__ */ jsx5("i", { children: "STREAK" }),
          /* @__PURE__ */ jsxs5("b", { children: [
            accuracy.streak.n,
            "\xD7 ",
            accuracy.streak.kind
          ] }),
          /* @__PURE__ */ jsx5("em", { children: "beruntun" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs5("p", { className: "ind-linkrow mono", children: [
        "Analisis dampak pair lengkap \u2192 ",
        /* @__PURE__ */ jsx5(Link, { href: "/analysis", children: "HALAMAN ANALISIS" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs5("section", { className: "ind-term-sec", children: [
      /* @__PURE__ */ jsxs5("div", { className: "ct-block-head", children: [
        /* @__PURE__ */ jsx5("span", { className: "ct-tag", children: "02" }),
        /* @__PURE__ */ jsxs5("h4", { children: [
          "Riwayat ",
          data.short
        ] }),
        /* @__PURE__ */ jsxs5("span", { className: "ct-block-meta mono", children: [
          "\u25B8 ",
          shown.length,
          " POINT \xB7 HOVER UNTUK DETAIL"
        ] })
      ] }),
      /* @__PURE__ */ jsx5("div", { className: "ind-range mono", children: RANGES.map((r) => /* @__PURE__ */ jsx5("button", { className: `cal-chip ${range === r.id ? "on" : ""}`, onClick: () => setRange(r.id), children: r.label }, r.id)) }),
      /* @__PURE__ */ jsx5(Chart, { points: shown, color: cat?.color || "#f0b429", unit: data.unit, decimals: data.decimals, height: 320 }),
      /* @__PURE__ */ jsxs5("div", { className: "ind-rows12", children: [
        /* @__PURE__ */ jsxs5("div", { className: "ind-rows12-head mono", children: [
          /* @__PURE__ */ jsx5("span", { children: "PERIODE" }),
          /* @__PURE__ */ jsx5("span", { children: "NILAI" }),
          /* @__PURE__ */ jsx5("span", { className: "ind-rows12-barcol", children: "PERUBAHAN" })
        ] }),
        rows12.map((p) => /* @__PURE__ */ jsxs5("div", { className: `ind-row12 ${p.c === null ? "" : p.c >= 0 ? "up" : "down"}`, children: [
          /* @__PURE__ */ jsx5("span", { className: "mono", children: fmtDay(p.date) }),
          /* @__PURE__ */ jsx5("b", { className: "mono", children: fmt(p.value, data.decimals) }),
          /* @__PURE__ */ jsxs5("span", { className: "ind-rows12-barcol", children: [
            /* @__PURE__ */ jsx5("i", { className: "ind-row12-bar", style: { width: `${p.bar}%` } }),
            /* @__PURE__ */ jsx5("em", { className: "mono", children: p.c === null ? "\u2014" : `${p.c >= 0 ? "+" : ""}${fmt(p.c, data.decimals)}` })
          ] })
        ] }, p.date))
      ] })
    ] }),
    hist.length > 1 && /* @__PURE__ */ jsxs5("section", { className: "ind-term-sec", children: [
      /* @__PURE__ */ jsxs5("div", { className: "ct-block-head", children: [
        /* @__PURE__ */ jsx5("span", { className: "ct-tag", children: "03" }),
        /* @__PURE__ */ jsx5("h4", { children: "Riwayat Rilis \u2014 Consensus vs Actual" }),
        /* @__PURE__ */ jsxs5("span", { className: "ct-block-meta mono", children: [
          "\u25B8 ",
          hist.length,
          " RILIS TERAKHIR \xB7 PERHATIKAN POLA SURPRISE"
        ] })
      ] }),
      /* @__PURE__ */ jsxs5("div", { className: "ind-rel", children: [
        /* @__PURE__ */ jsxs5("div", { className: "ind-rel-head mono", children: [
          /* @__PURE__ */ jsx5("span", { children: "TANGGAL" }),
          /* @__PURE__ */ jsx5("span", { children: "PREV" }),
          /* @__PURE__ */ jsx5("span", { children: "KONSENSUS" }),
          /* @__PURE__ */ jsx5("span", { children: "AKTUAL" }),
          /* @__PURE__ */ jsx5("span", { children: "SURPRISE" })
        ] }),
        hist.map((r) => /* @__PURE__ */ jsxs5("div", { className: "ind-rel-row", children: [
          /* @__PURE__ */ jsx5("span", { className: "mono", children: r.date }),
          /* @__PURE__ */ jsx5("span", { className: "mono dim", children: r.previous == null ? "\u2014" : fmt(r.previous, data.decimals) }),
          /* @__PURE__ */ jsx5("span", { className: "mono dim", children: r.consensus == null ? "\u2014" : fmt(r.consensus, data.decimals) }),
          /* @__PURE__ */ jsx5("b", { className: "mono", children: r.actual == null ? "\u2014" : fmt(r.actual, data.decimals) }),
          /* @__PURE__ */ jsx5("span", { className: "ind-rel-s", children: r.surprise == null ? /* @__PURE__ */ jsx5("span", { className: "mono dim", children: "\u2014" }) : /* @__PURE__ */ jsxs5(Fragment, { children: [
            /* @__PURE__ */ jsx5("i", { className: `ind-rel-bar ${r.surprise >= 0 ? "up" : "down"}`, style: { width: `${Math.abs(r.surprise) / maxSurp * 100}%` } }),
            /* @__PURE__ */ jsxs5("em", { className: `mono ${r.surprise >= 0 ? "up" : "down"}`, children: [
              r.surprise >= 0 ? "+" : "",
              fmt(r.surprise, data.decimals),
              r.surprisePct != null ? ` (${r.surprisePct >= 0 ? "+" : ""}${r.surprisePct.toFixed(1)}%)` : ""
            ] })
          ] }) })
        ] }, r.date))
      ] })
    ] }),
    /* @__PURE__ */ jsxs5("section", { className: "ind-term-sec", children: [
      /* @__PURE__ */ jsxs5("div", { className: "ct-block-head", children: [
        /* @__PURE__ */ jsx5("span", { className: "ct-tag", children: "04" }),
        /* @__PURE__ */ jsxs5("h4", { children: [
          "Memahami ",
          data.short
        ] }),
        /* @__PURE__ */ jsx5("span", { className: "ct-block-meta mono", children: "\u25B8 APA \xB7 MENGAPA \xB7 DAMPAK FX" })
      ] }),
      /* @__PURE__ */ jsxs5("div", { className: "ind-understand", children: [
        /* @__PURE__ */ jsxs5("div", { children: [
          /* @__PURE__ */ jsx5("em", { children: "APA ITU?" }),
          /* @__PURE__ */ jsx5("p", { children: data.about })
        ] }),
        /* @__PURE__ */ jsxs5("div", { children: [
          /* @__PURE__ */ jsx5("em", { children: "MENGAPA PENTING?" }),
          /* @__PURE__ */ jsx5("p", { children: data.why })
        ] }),
        /* @__PURE__ */ jsxs5("div", { children: [
          /* @__PURE__ */ jsx5("em", { children: "DAMPAK KE MATA UANG" }),
          /* @__PURE__ */ jsx5("p", { children: data.fx })
        ] })
      ] })
    ] }),
    edu && /* @__PURE__ */ jsxs5("section", { className: "ind-term-sec", children: [
      /* @__PURE__ */ jsxs5("div", { className: "ct-block-head", children: [
        /* @__PURE__ */ jsx5("span", { className: "ct-tag", children: "05" }),
        /* @__PURE__ */ jsx5("h4", { children: "Edukasi Praktis" }),
        /* @__PURE__ */ jsx5("span", { className: "ct-block-meta mono", children: "\u25B8 PILIH TAB" })
      ] }),
      /* @__PURE__ */ jsx5(EduTab, { edu, general })
    ] }),
    /* @__PURE__ */ jsxs5("footer", { className: "ind-term-foot mono", children: [
      /* @__PURE__ */ jsxs5("span", { children: [
        "SRC: ",
        srcLive ? "FRED (LIVE)" : "CACHE LOKAL",
        " \xB7 N=",
        pts.length,
        " POINT \xB7 AS-OF ",
        lastDate || "\u2014",
        " \xB7 ZONA: WIB (UTC+7)"
      ] }),
      /* @__PURE__ */ jsx5("span", { className: "ind-term-foot-note", children: "Selalu verifikasi ke sumber resmi \u2014 data bisa direvisi" }),
      /* @__PURE__ */ jsx5("span", { className: "ct-blink", "aria-hidden": "true", children: "\u25CF" })
    ] })
  ] });
}

// components/CalendarClient.jsx
import { Fragment as Fragment2, jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var DAY_NAMES2 = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
var MONTHS2 = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
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
function useNow2() {
  const [now, setNow] = useState4(null);
  useEffect4(() => {
    setNow(/* @__PURE__ */ new Date());
    const t = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(t);
  }, []);
  return now;
}
function fmtCountdown2(ms) {
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
function IndicatorModal({ id, info, onClose }) {
  const closeRef = useRef2(null);
  useEffect4(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return /* @__PURE__ */ jsx6(
    "div",
    {
      className: "cm-backdrop cal-mo-backdrop",
      onClick: (e) => e.target === e.currentTarget && onClose(),
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Detail indikator ${info.data.short}`,
      children: /* @__PURE__ */ jsxs6("div", { className: "cal-mo-modal", children: [
        /* @__PURE__ */ jsxs6("header", { className: "cal-mo-head mono", children: [
          /* @__PURE__ */ jsx6("span", { className: "cal-mo-tag", children: "POPUP" }),
          /* @__PURE__ */ jsxs6("b", { children: [
            "DETAIL INDIKATOR \u2014 ",
            info.data.short
          ] }),
          /* @__PURE__ */ jsx6("span", { className: "cal-mo-sub", children: info.data.name }),
          /* @__PURE__ */ jsx6("button", { ref: closeRef, type: "button", className: "cm-close", onClick: onClose, "aria-label": "Tutup", title: "Tutup (Esc)", children: "\u2715" })
        ] }),
        /* @__PURE__ */ jsxs6("div", { className: "cal-mo-body", children: [
          /* @__PURE__ */ jsx6(
            IndicatorClient,
            {
              data: info.data,
              releases: info.releases,
              accuracy: info.accuracy,
              source: info.source,
              edu: info.edu,
              general: info.general,
              cat: info.cat,
              country: info.country,
              upcoming: info.upcoming
            }
          ),
          /* @__PURE__ */ jsxs6("p", { className: "cal-mo-note mono", children: [
            "Ingin tampilan penuh? Buka ",
            /* @__PURE__ */ jsxs6(Link, { href: `/indicators/${id}`, children: [
              "halaman indikator ",
              info.data.short,
              " \u2192"
            ] })
          ] })
        ] })
      ] })
    }
  );
}
function EventRow({ e, now, isNext, open, onToggle, onOpenDetail }) {
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
  const cd = !isPast && now ? fmtCountdown2(ts - tNow) : null;
  return /* @__PURE__ */ jsxs6("div", { className: `cal-row-wrap ${open ? "open" : ""}`, children: [
    /* @__PURE__ */ jsxs6(
      "div",
      {
        className: `cal-row ${isPast ? "is-past" : ""} ${isToday ? "is-today" : ""} ${isNext ? "is-next" : ""}`,
        onClick: () => onToggle(rowKey),
        onKeyDown: (ev) => (ev.key === "Enter" || ev.key === " ") && (ev.preventDefault(), onToggle(rowKey)),
        role: "button",
        tabIndex: 0,
        "aria-expanded": open,
        children: [
          /* @__PURE__ */ jsxs6("span", { className: "cal-r-time mono", children: [
            time,
            /* @__PURE__ */ jsx6("i", { children: isPast ? "DONE" : isToday ? "HARI INI" : "WIB" })
          ] }),
          /* @__PURE__ */ jsxs6("span", { className: "cal-r-title", children: [
            /* @__PURE__ */ jsx6(CountryFlag, { code: e.country, size: 15, showCode: false }),
            e.title,
            isNext && /* @__PURE__ */ jsx6("b", { className: "cal-next-tag", children: "NEXT" }),
            isPast && /* @__PURE__ */ jsx6("i", { className: "cal-released", children: "RELEASED" })
          ] }),
          /* @__PURE__ */ jsxs6("span", { className: "cal-r-cat", style: { "--c": cat?.color }, children: [
            /* @__PURE__ */ jsx6("i", {}),
            " ",
            cat?.label || e.category
          ] }),
          /* @__PURE__ */ jsxs6("span", { className: `cal-r-imp ${IMP_CLS[e.impact] || "im-low"}`, title: `Dampak ${e.impact}`, children: [
            /* @__PURE__ */ jsx6("i", {}),
            /* @__PURE__ */ jsx6("i", {}),
            /* @__PURE__ */ jsx6("i", {})
          ] }),
          /* @__PURE__ */ jsx6("span", { className: "cal-r-metrics mono", title: hasData ? "P = previous \xB7 K = forecast/konsensus \xB7 A = actual (sudah rilis)" : "Belum ada angka (previous/forecast/actual)", children: hasData ? /* @__PURE__ */ jsxs6(Fragment2, { children: [
            e.previous != null && /* @__PURE__ */ jsxs6("b", { className: "m-p", children: [
              /* @__PURE__ */ jsx6("u", { children: "P" }),
              fmtVal(e.previous)
            ] }),
            e.forecast != null && /* @__PURE__ */ jsxs6("b", { className: "m-k", children: [
              /* @__PURE__ */ jsx6("u", { children: "K" }),
              fmtVal(e.forecast)
            ] }),
            e.actual != null && /* @__PURE__ */ jsxs6("b", { className: `m-a ${isPast ? "done" : ""}`, children: [
              /* @__PURE__ */ jsx6("u", { children: "A" }),
              fmtVal(e.actual)
            ] })
          ] }) : /* @__PURE__ */ jsx6("span", { className: "dim", children: "\u2014" }) }),
          /* @__PURE__ */ jsx6("span", { className: "cal-r-cd mono", children: cd || "" }),
          /* @__PURE__ */ jsx6("span", { className: "cal-r-chev", "aria-hidden": "true", children: open ? "\u25BE" : "\u25B8" })
        ]
      }
    ),
    /* @__PURE__ */ jsx6("div", { className: "cal-detail", children: /* @__PURE__ */ jsx6("div", { className: "cal-detail-in", children: series ? /* @__PURE__ */ jsxs6("div", { className: "cal-d-grid", children: [
      /* @__PURE__ */ jsxs6("div", { children: [
        /* @__PURE__ */ jsx6("em", { children: "APAKAH INI?" }),
        /* @__PURE__ */ jsx6("p", { children: series.about })
      ] }),
      /* @__PURE__ */ jsxs6("div", { children: [
        /* @__PURE__ */ jsx6("em", { children: "MENGAPA PENTING?" }),
        /* @__PURE__ */ jsx6("p", { children: series.why })
      ] }),
      /* @__PURE__ */ jsxs6("div", { children: [
        /* @__PURE__ */ jsx6("em", { children: "DAMPAK TERHADAP PAIR" }),
        /* @__PURE__ */ jsx6("p", { children: series.fx })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "cal-d-foot", children: [
        (() => {
          const parts = [];
          if (e.previous != null) parts.push(`P ${fmtVal(e.previous)}`);
          if (e.forecast != null) parts.push(`K ${fmtVal(e.forecast)}`);
          if (e.actual != null) parts.push(`A ${fmtVal(e.actual)}`);
          return parts.length ? /* @__PURE__ */ jsx6("span", { className: "cal-d-data mono", children: parts.join(" \xB7 ") }) : null;
        })(),
        series.release && /* @__PURE__ */ jsxs6("span", { className: "cal-d-rel mono", children: [
          "JADWAL: ",
          series.release
        ] }),
        /* @__PURE__ */ jsx6(
          "button",
          {
            type: "button",
            className: "cal-d-link mono",
            onClick: (ev) => {
              ev.stopPropagation();
              onOpenDetail && onOpenDetail(e.indicatorId);
            },
            children: "Detail indikator \u2192"
          }
        ),
        /* @__PURE__ */ jsx6(Link, { className: "cal-d-link mono", href: "/analysis", children: "Analisis dampak \u2192" })
      ] })
    ] }) : /* @__PURE__ */ jsxs6("div", { className: "cal-d-grid", children: [
      /* @__PURE__ */ jsxs6("div", { children: [
        /* @__PURE__ */ jsx6("em", { children: "EVENT PASAR" }),
        /* @__PURE__ */ jsx6("p", { children: "Agenda pasar/pidato pejabat bank sentral \u2014 dampaknya sering terasa lewat sentimen. Pantau berita terkait menjelang acara." })
      ] }),
      /* @__PURE__ */ jsx6("div", { className: "cal-d-foot", style: { gridColumn: "1 / -1" }, children: /* @__PURE__ */ jsx6(Link, { className: "cal-d-link mono", href: "/news", children: "Berita pasar \u2192" }) })
    ] }) }) })
  ] });
}
function CalendarClient({ events, details = {} }) {
  const now = useNow2();
  const [win, setWin] = useState4("terkini");
  const [cat, setCat] = useState4("semua");
  const [imp, setImp] = useState4("semua");
  const [cc, setCc] = useState4("semua");
  const [q, setQ] = useState4("");
  const [open, setOpen] = useState4(null);
  const [modalId, setModalId] = useState4(null);
  const DAY = 864e5;
  const countries = useMemo2(() => [...new Set(events.map((e) => e.country))].filter(Boolean).sort(), [events]);
  const catList = useMemo2(() => {
    const present = new Set(events.map((e) => e.category));
    return CATEGORIES.filter((c) => present.has(c.id));
  }, [events]);
  const filtered = useMemo2(() => {
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
  const groups = useMemo2(() => {
    const map = /* @__PURE__ */ new Map();
    for (const e of filtered) {
      const d = e.iso.slice(0, 10);
      if (!map.has(d)) map.set(d, []);
      map.get(d).push(e);
    }
    return [...map.entries()].map(([date, list]) => ({ date, list }));
  }, [filtered]);
  const nextHigh = useMemo2(() => {
    if (!now) return null;
    const t = now.getTime();
    return events.filter((e) => e.impact === "High" && new Date(e.iso).getTime() > t).sort((a, b) => a.iso.localeCompare(b.iso))[0] || null;
  }, [events, now]);
  const nextHighs = useMemo2(() => {
    if (!now) return [];
    const t = now.getTime();
    return events.filter((e) => e.impact === "High" && new Date(e.iso).getTime() > t).sort((a, b) => a.iso.localeCompare(b.iso)).slice(0, 3);
  }, [events, now]);
  const dateLabel = (date) => {
    if (!now) return { main: DAY_NAMES2[(/* @__PURE__ */ new Date(`${date}T00:00:00`)).getDay()], sub: `${date.slice(8)} ${MONTHS2[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}`, today: false };
    const todayKey = now.toISOString().slice(0, 10);
    if (date === todayKey) return { main: "HARI INI", sub: `${DAY_NAMES2[now.getDay()]}, ${now.getDate()} ${MONTHS2[now.getMonth()]} ${now.getFullYear()}`, today: true };
    const dt = /* @__PURE__ */ new Date(`${date}T00:00:00`);
    const yest = new Date(now.getTime() - DAY).toISOString().slice(0, 10);
    const tmr = new Date(now.getTime() + DAY).toISOString().slice(0, 10);
    if (date === yest) return { main: "KEMARIN", sub: `${DAY_NAMES2[dt.getDay()]}, ${dt.getDate()} ${MONTHS2[dt.getMonth()]} ${dt.getFullYear()}`, today: false };
    if (date === tmr) return { main: "BESOK", sub: `${DAY_NAMES2[dt.getDay()]}, ${dt.getDate()} ${MONTHS2[dt.getMonth()]} ${dt.getFullYear()}`, today: false };
    return { main: DAY_NAMES2[dt.getDay()], sub: `${dt.getDate()} ${MONTHS2[dt.getMonth()]} ${dt.getFullYear()}`, today: false };
  };
  const winLabel = win === "terkini" ? "3 hari terakhir \u2192 \xB145 hari ke depan" : win === "semua" ? "seluruh rilis" : win === "7" ? "7 hari ke depan" : "30 hari ke depan";
  return /* @__PURE__ */ jsxs6("div", { className: "cal-term", children: [
    /* @__PURE__ */ jsx6("div", { className: "ct-scan", "aria-hidden": "true" }),
    /* @__PURE__ */ jsxs6("header", { className: "cal-term-head", children: [
      /* @__PURE__ */ jsxs6("span", { className: "ct-dots", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx6("i", {}),
        /* @__PURE__ */ jsx6("i", {}),
        /* @__PURE__ */ jsx6("i", {})
      ] }),
      /* @__PURE__ */ jsxs6("span", { className: "cal-term-title mono", children: [
        "MACROLAB ",
        /* @__PURE__ */ jsx6("em", { children: "//" }),
        " RELEASE\xA0CALENDAR ",
        /* @__PURE__ */ jsx6("span", { className: "ct-ver", children: "v1.0" }),
        /* @__PURE__ */ jsx6("span", { className: "ct-cursor", "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ jsxs6("span", { className: "cal-term-head-right", children: [
        /* @__PURE__ */ jsx6("span", { className: "ct-led ok", children: "WIB \xB7 UTC+7" }),
        /* @__PURE__ */ jsx6(TermClock, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxs6("section", { className: "cal-next", children: [
      /* @__PURE__ */ jsxs6("div", { className: "cal-next-label mono", children: [
        /* @__PURE__ */ jsx6("span", { className: "ct-tag", children: "00" }),
        " NEXT RELEASE \u2014 HIGH IMPACT"
      ] }),
      nextHigh && now ? /* @__PURE__ */ jsxs6("div", { className: "cal-next-body", children: [
        /* @__PURE__ */ jsxs6("div", { className: "cal-next-info", children: [
          /* @__PURE__ */ jsxs6("b", { className: "cal-next-title", children: [
            /* @__PURE__ */ jsx6(CountryFlag, { code: nextHigh.country, size: 16, showCode: false }),
            " ",
            nextHigh.title
          ] }),
          /* @__PURE__ */ jsxs6("span", { className: "cal-next-when mono", children: [
            DAY_NAMES2[new Date(nextHigh.iso).getDay()],
            " \xB7 ",
            nextHigh.iso.slice(8, 10),
            " ",
            MONTHS2[Number(nextHigh.iso.slice(5, 7)) - 1],
            " ",
            nextHigh.iso.slice(0, 4),
            " \xB7 ",
            nextHigh.time,
            " WIB \xB7 ",
            COUNTRY_META[nextHigh.country] || nextHigh.country
          ] }),
          nextHigh.previous != null && /* @__PURE__ */ jsxs6("span", { className: "cal-next-prev mono", children: [
            "SEBELUMNYA: ",
            /* @__PURE__ */ jsx6("b", { children: fmtVal(nextHigh.previous) }),
            nextHigh.forecast != null && /* @__PURE__ */ jsxs6(Fragment2, { children: [
              " \xB7 FORECAST: ",
              /* @__PURE__ */ jsx6("b", { children: fmtVal(nextHigh.forecast) })
            ] }),
            " ",
            "(",
            getSeries(nextHigh.indicatorId)?.unit || "",
            ")"
          ] }),
          nextHighs.length > 1 && /* @__PURE__ */ jsxs6("span", { className: "cal-next-more mono", children: [
            "+",
            nextHighs.length - 1,
            " high-impact berikutnya: ",
            nextHighs.slice(1).map((e) => e.title).join(" \xB7 ")
          ] })
        ] }),
        /* @__PURE__ */ jsxs6("div", { className: "cal-next-cd", children: [
          /* @__PURE__ */ jsx6("b", { className: "mono", children: fmtCountdown2(new Date(nextHigh.iso).getTime() - now.getTime()) }),
          /* @__PURE__ */ jsx6("span", { className: "mono", children: "menuju rilis" })
        ] })
      ] }) : /* @__PURE__ */ jsx6("div", { className: "cal-next-body", children: /* @__PURE__ */ jsx6("span", { className: "cal-next-none mono", children: "TIDAK ADA RILIS HIGH IMPACT BERIKUTNYA DALAM DATA" }) })
    ] }, nextHigh ? nextHigh.iso + nextHigh.title : "none"),
    /* @__PURE__ */ jsxs6("section", { className: "cal-term-sec", children: [
      /* @__PURE__ */ jsxs6("div", { className: "ct-block-head", children: [
        /* @__PURE__ */ jsx6("span", { className: "ct-tag", children: "01" }),
        /* @__PURE__ */ jsx6("h4", { children: "Filter Jadwal" }),
        /* @__PURE__ */ jsxs6("span", { className: "ct-block-meta mono", children: [
          countries.length,
          " NEGARA \xB7 ",
          events.length,
          " EVENT"
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "cal-chips-row", children: [
        /* @__PURE__ */ jsx6("span", { className: "cal-chips-cap mono", children: "JENDELA" }),
        /* @__PURE__ */ jsx6("div", { className: "cal-chips", children: [
          { id: "terkini", label: "TERKINI" },
          { id: "7", label: "7 HARI" },
          { id: "30", label: "30 HARI" },
          { id: "semua", label: "SEMUA" }
        ].map((w) => /* @__PURE__ */ jsx6("button", { className: `cal-chip ${win === w.id ? "on" : ""}`, onClick: () => setWin(w.id), children: w.label }, w.id)) })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "cal-chips-row", children: [
        /* @__PURE__ */ jsx6("span", { className: "cal-chips-cap mono", children: "KATEGORI" }),
        /* @__PURE__ */ jsxs6("div", { className: "cal-chips", children: [
          /* @__PURE__ */ jsx6("button", { className: `cal-chip ${cat === "semua" ? "on" : ""}`, onClick: () => setCat("semua"), children: "SEMUA" }),
          catList.map((c) => /* @__PURE__ */ jsx6("button", { className: `cal-chip ${cat === c.id ? "on" : ""}`, onClick: () => setCat(c.id), style: { "--c": c.color }, children: c.label.toUpperCase() }, c.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "cal-chips-row", children: [
        /* @__PURE__ */ jsx6("span", { className: "cal-chips-cap mono", children: "DAMPAK" }),
        /* @__PURE__ */ jsxs6("div", { className: "cal-chips", children: [
          /* @__PURE__ */ jsx6("button", { className: `cal-chip ${imp === "semua" ? "on" : ""}`, onClick: () => setImp("semua"), children: "SEMUA" }),
          /* @__PURE__ */ jsx6("button", { className: `cal-chip im-high ${imp === "High" ? "on" : ""}`, onClick: () => setImp("High"), children: "HIGH" }),
          /* @__PURE__ */ jsx6("button", { className: `cal-chip im-medium ${imp === "Medium" ? "on" : ""}`, onClick: () => setImp("Medium"), children: "MEDIUM" }),
          /* @__PURE__ */ jsx6("button", { className: `cal-chip im-low ${imp === "Low" ? "on" : ""}`, onClick: () => setImp("Low"), children: "LOW" })
        ] }),
        /* @__PURE__ */ jsx6("span", { className: "cal-chips-cap mono cal-cc-cap", children: "NEGARA" }),
        /* @__PURE__ */ jsxs6("div", { className: "cal-chips", children: [
          /* @__PURE__ */ jsx6("button", { className: `cal-chip ${cc === "semua" ? "on" : ""}`, onClick: () => setCc("semua"), children: "SEMUA" }),
          countries.map((c) => /* @__PURE__ */ jsx6("button", { className: `cal-chip ${cc === c ? "on" : ""}`, onClick: () => setCc(c), title: COUNTRY_META[c] || c, children: c }, c))
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "cal-search", children: [
        /* @__PURE__ */ jsx6("span", { className: "ct-prompt", "aria-hidden": "true", children: ">" }),
        /* @__PURE__ */ jsx6("input", { type: "text", placeholder: "cari event\u2026", value: q, onChange: (e) => setQ(e.target.value), "aria-label": "Cari event" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs6("section", { className: "cal-term-sec", children: [
      /* @__PURE__ */ jsxs6("div", { className: "ct-block-head", children: [
        /* @__PURE__ */ jsx6("span", { className: "ct-tag", children: "02" }),
        /* @__PURE__ */ jsx6("h4", { children: "Jadwal Rilis" }),
        /* @__PURE__ */ jsxs6("span", { className: "ct-block-meta mono", children: [
          "\u25B8 ",
          filtered.length,
          " RILIS \xB7 ",
          winLabel.toUpperCase(),
          " \xB7 KLIK BARIS UNTUK DETAIL"
        ] })
      ] }),
      groups.length === 0 && /* @__PURE__ */ jsx6("p", { className: "cal-empty mono", children: "TIDAK ADA RILIS YANG COCOK DENGAN FILTER" }),
      groups.map((g) => {
        const lbl = dateLabel(g.date);
        const pastDay = now && g.date < now.toISOString().slice(0, 10);
        return /* @__PURE__ */ jsxs6("div", { className: `cal-day ${pastDay ? "is-past" : ""}`, children: [
          /* @__PURE__ */ jsxs6("div", { className: `cal-day-head ${lbl.today ? "today" : ""}`, children: [
            /* @__PURE__ */ jsx6("span", { className: "cal-day-main mono", children: lbl.main }),
            /* @__PURE__ */ jsx6("span", { className: "cal-day-sub mono", children: lbl.sub }),
            /* @__PURE__ */ jsxs6("span", { className: "cal-day-n mono", children: [
              "N=",
              g.list.length
            ] }),
            lbl.today && /* @__PURE__ */ jsx6("span", { className: "cal-day-dot", "aria-hidden": "true" })
          ] }),
          /* @__PURE__ */ jsx6("div", { className: "cal-events", children: g.list.map((e) => /* @__PURE__ */ jsx6(
            EventRow,
            {
              e,
              now,
              isNext: !!nextHigh && e.iso === nextHigh.iso && e.title === nextHigh.title,
              open: open === e.iso + e.title,
              onToggle: (k) => setOpen((o) => o === k ? null : k),
              onOpenDetail: setModalId
            },
            e.iso + e.title
          )) })
        ] }, g.date);
      })
    ] }),
    /* @__PURE__ */ jsxs6("footer", { className: "cal-term-foot mono", children: [
      /* @__PURE__ */ jsxs6("span", { children: [
        "SRC: JADWAL RESMI BLS/FED/ECB/ONS \xB7 P: FRED \xB7 K/A: FOREXFACTORY LIVE \xB7 N: ",
        filtered.length,
        " \xB7 ZONA: WIB (UTC+7)"
      ] }),
      /* @__PURE__ */ jsx6("span", { className: "cal-term-foot-note", children: "P = sebelum rilis \xB7 K = konsensus \xB7 A = angka yang sudah keluar \u2014 verifikasi ke sumber resmi" }),
      /* @__PURE__ */ jsx6("span", { className: "ct-blink", "aria-hidden": "true", children: "\u25CF" })
    ] }),
    modalId && details[modalId] && /* @__PURE__ */ jsx6(IndicatorModal, { id: modalId, info: details[modalId], onClose: () => setModalId(null) })
  ] });
}

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
  if (LIVE && !recentFail(id)) {
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
  { title: "advance gdp", id: "gdp", allow: ["US"] },
  { title: "gdp q/q", id: "gdp", allow: ["US"] },
  { title: "initial jobless claims", id: "claims", allow: ["US"] },
  { title: "industrial production m/m", id: "indpro", allow: ["US"] },
  { title: "capacity utilization rate", id: "capacity", allow: ["US"] },
  { title: "michigan consumer sentiment", id: "umich", allow: ["US"] },
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
    const i = idxByDate.get(e.date);
    if (i === void 0) continue;
    const actual = points[i]?.value ?? null;
    const previous = i > 0 ? points[i - 1]?.value ?? null : null;
    const consensus = e.consensus;
    const surprise = actual !== null && consensus != null ? round2(actual - consensus, 2) : null;
    const surprisePct = surprise !== null && consensus ? round2(surprise / Math.abs(consensus) * 100, 2) : null;
    const surpriseIdx = surprise !== null && series.scale ? round2(surprise / series.scale * 100, 1) : null;
    releases.push({ date: e.date, consensus, previous, actual, surprise, surprisePct, surpriseIdx, source: "local" });
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
function avg2(arr) {
  if (!arr.length) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function round2(n, d = 2) {
  if (n === null || n === void 0 || isNaN(n)) return n;
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}

// lib/education.js
var GENERAL = {
  title: "Cara Membaca Data Ekonomi untuk Trading Forex",
  intro: "Data makro adalah 'laporan kesehatan' sebuah ekonomi. Pasar forex bereaksi bukan pada angka itu sendiri, melainkan pada selisih antara angka aktual dengan yang diprediksi analis (konsensus). Semakin besar selisihnya (surprise), semakin besar pula pergerakan harga.",
  points: [
    "Consensus = perkiraan analis sebelum rilis. Jika tidak ada, pasar menjadikan nilai sebelumnya (Previous) sebagai acuan.",
    "Actual = angka yang benar-benar dirilis, biasanya pada jam yang sudah terjadwal.",
    "Surprise = Actual \u2212 Consensus. Positif berarti data lebih baik dari dugaan; negatif berarti lebih buruk.",
    "Yang menggerakkan harga adalah PERUBAHAN ekspektasi. Data bagus tapi di bawah ekspektasi tetap bisa membuat mata uang turun.",
    "Perhatikan juga revisi data sebelumnya dan rilis lanjutan (mis. Core CPI) karena sering kali lebih penting.",
    "Fokus pada dampak: High/Medium/Low, dan pada jam rilis (biasanya 13:30 atau 19:30 WIB)."
  ],
  tips: [
    "Jangan trading 5 menit pertama saat rilis High impact \u2014 spread & lonjakan volatilitas ekstrem.",
    "Bandingkan indikator satu negara dengan negara lawan pair (mis. EURUSD: data AS vs data Euro).",
    "Kombinasikan dengan arah tren & sentimen pasar, jangan hanya satu data."
  ],
  expertNote: "Berikut perspektif dari berbagai 'desk' analis global (pandangan ilustratif untuk pembelajaran). Setiap desk memiliki cara baca berbeda \u2014 bandingkan untuk membentuk gambaran menyeluruh."
};
var SRC = {
  blsJobs: { label: "BLS \u2014 Employment Situation (resmi)", url: "https://www.bls.gov/employment-situation/" },
  blsCpi: { label: "BLS \u2014 Consumer Price Index (resmi)", url: "https://www.bls.gov/cpi/" },
  blsPpi: { label: "BLS \u2014 Producer Price Index (resmi)", url: "https://www.bls.gov/ppi/" },
  blsClaims: { label: "BLS \u2014 Jobless Claims (resmi)", url: "https://www.bls.gov/web/ews/ews.pdf" },
  beaPce: { label: "BEA \u2014 Personal Consumption Expenditures (resmi)", url: "https://www.bea.gov/data/personal-consumption-expenditures" },
  beaGdp: { label: "BEA \u2014 GDP (resmi)", url: "https://www.bea.gov/data/gdp/gross-domestic-product" },
  fed: { label: "The Fed \u2014 FOMC (resmi)", url: "https://www.federalreserve.gov/monetarypolicy/openmarket.htm" },
  fedG17: { label: "The Fed \u2014 G.17 Industrial Production (resmi)", url: "https://www.federalreserve.gov/releases/g17/" },
  treasury: { label: "U.S. Treasury \u2014 Interest Rates (resmi)", url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates" },
  fred: { label: "FRED \u2014 St. Louis Fed (resmi)", url: "https://fred.stlouisfed.org/" },
  census: { label: "U.S. Census Bureau \u2014 Retail (resmi)", url: "https://www.census.gov/retail/index.html" },
  umich: { label: "University of Michigan \u2014 Sentiment (resmi)", url: "https://www.sca.isr.umich.edu/sentiment/" },
  eurostat: { label: "Eurostat \u2014 Labour & HICP (resmi)", url: "https://ec.europa.eu/eurostat/web/products-euro-indicators/overview-1" },
  ecb: { label: "ECB \u2014 Keputuan & Proyeksi (resmi)", url: "https://www.ecb.europa.eu/press/prt/html/index.en.html" },
  onsCpi: { label: "ONS UK \u2014 CPI (resmi)", url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandunemployment/bulletins/consumerpriceinflation/latest" },
  onsJobs: { label: "ONS UK \u2014 Labour Market (resmi)", url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandunemployment/bulletins/uklabourmarket/latest" },
  mofJp: { label: "Jepang \u2014 Kabinet Keuangan/MOF (resmi)", url: "https://www.mof.go.jp/mofj/en/index.htm" },
  nbsCn: { label: "NBS Tiongkok \u2014 CPI (resmi)", url: "https://www.stats.gov.cn/english/" },
  eiaOil: { label: "EIA \u2014 Petroleum (resmi)", url: "https://www.eia.gov/petroleum/" },
  eiaGas: { label: "EIA \u2014 Natural Gas (resmi)", url: "https://www.eia.gov/naturalgas/" },
  lmeCopper: { label: "LME \u2014 Copper (resmi)", url: "https://www.lme.com/market-data/metals/non-ferrous/copper" },
  cboeVix: { label: "CBOE \u2014 VIX (resmi)", url: "https://www.cboe.com/tradable_products/vix/" }
};
var EDUCATION = {
  nfp: {
    read: [
      "Nonfarm Payrolls = jumlah lapangan kerja baru per bulan (di luar sektor pertanian).",
      "Baca perubahannya dalam ribuan, bandingkan dengan konsensus \u2014 bukan angkanya saja.",
      "Dirilis Jumat pertama tiap bulan, 08:30 ET (13:30/19:30 WIB).",
      "Selalu baca tiga angka sekaligus: NFP, Unemployment Rate, dan Average Hourly Earnings (AHE).",
      "Perhatikan revisi 2 bulan sebelumnya \u2014 sering lebih penting daripada headline."
    ],
    drivers: [
      { name: "Permintaan tenaga kerja (hiring)", detail: "Indikasi seberapa kuat bisnis menambah karyawan. Pertambahan besar = ekonomi tumbuh, mendukung USD. Penambahan kecil/mundur = perlambatan. Pola 'low-hire, low-fire' (hiring rendah tapi PHK juga rendah) berarti pasar kerja stabil tapi tidak panas.", data: "Juli 2026: \u221223 ribu (konsensus +80 ribu) \u2014 kejutan negatif; Mei\u2013Juni direvisi turun 103 ribu. Rata-rata 12 bulan hanya +34 ribu/bulan.", src: SRC.blsJobs },
      { name: "Kontribusi sektor (pemerintah, jasa, konstruksi)", detail: "Terpecah per sektor. Sektor jasa (mall, restoran, kesehatan) besar dan sensitif konsumsi; sektor pemerintah bisa berubah drastis (pemotongan/pemindahan jadwal rekrutmen) sehingga memicu revisi.", data: "Juli 2026: Pemerintah \u221253 ribu (terbesar, sebagian kemungkinan revisi musiman), Leisure & Hospitality \u221240 ribu; Construction & Private Education/Health terbesar penambahnya.", src: SRC.blsJobs },
      { name: "Revisi bulan sebelumnya", detail: "Angka dua bulan lalu sering direvisi setelah survei diperluas. Revisi besar ke bawah melemahkan narasi pasar kerja meski headline bulan berjalan terlihat baik.", data: "Mei & Juni 2026 direvisi total \u2212103 ribu dari angka awal.", src: SRC.blsJobs },
      { name: "Tingkat partisipasi angkatan kerja", detail: "Unemployment bisa turun bukan karena makin banyak yang bekerja, tapi karena orang keluar dari angkatan kerja. Partisipasi rendah + unemp 'turun' = sinyal lebih lemah daripada yang terlihat.", data: "Partisipasi Juli 2026: 61,4% \u2014 dekat level terendah ~5,5 tahun (264 ribu orang keluar angkatan kerja).", src: SRC.blsJobs },
      { name: "Siklus ekonomi & suku bunga", detail: "Suku bunga tinggi menekan biaya pinjaman bisnis \u2192 hiring melambat. Dengan The Fed di 3,50\u20133,75% dan wacana kenaikan kembali, biaya kredit tetap menjadi rem utama ekspansi ketenagakerjaan.", data: "Fed Funds 3,50\u20133,75% sejak Des 2025; Ketua The Fed Kevin Warsh (sejak Mei 2026) menegaskan inflasi 'belum melambat cukup'.", src: SRC.fed }
    ],
    expertViews: [
      { desk: "FX Strategist (London)", view: "NFP adalah 'pengguncang utama' dolar. Fokus pada headline tapi yang lebih penting adalah bagian upah (AHE) \u2014 karena itu yang menentukan jalur suku bunga The Fed berikutnya.", signal: "USD kuat jika NFP > konsensus DAN AHE naik." },
      { desk: "Head of Global Macro (New York)", view: "Pasar kerja yang terlalu panas justru jadi masalah: The Fed harus mempertahankan suku bunga tinggi lebih lama. Ingin melihat 'goldilocks' \u2014 cukup besar, tidak terlalu panas.", signal: "NFP besar + AHE sedang = risk-on." },
      { desk: "Quant / Options Desk", view: "Rilis NFP biasanya memicu lonjakan volatilitas (implied vol naik dulu). Implied move bisa 30\u201360 pips pada EURUSD saat rilis.", signal: "Vol spiking; hindari straddle murah." },
      { desk: "Emerging Markets Macro", view: "NFP kuat = dolar menguat = tekanan pada mata uang berkembang & emas. Pasar forex berkembang sangat sensitif terhadap arah NFP.", signal: "NFP kuat = emas & USD/EM down." }
    ],
    outlook: "Gambaran per Agustus 2026: pasar kerja AS sedang 'mendingin tapi belum retak' \u2014 NFP Juli negatif (\u221223 ribu) dengan revisi besar ke bawah, sementara pengangguran justru turun ke 4,1% karena partisipasi merosot ke 61,4%. Selama inflasi masih di 3,4% (di atas target 2%), The Fed terjepit: data kerja lemah mengurangi tekanan menaikkan bunga di rapat September 2026, tetapi CPI yang panas bisa membatalkan efeknya. Ekspektasi konsensus pasar kini condong ke 'the Fed on hold dengan ekor hawkish' \u2014 artinya USD cenderung tetap terdukung, tetapi risiko downside (jika unemp melonjak di atas ~4,5% seperti perkiraan Citi) akan memicu ekspektasi pemangkasan cepat dan tekanan jual USD di paruh kedua 2026.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Pasar kerja lebih kuat \u2192 ekspektasi Fed hawkish bertahan \u2192 USD naik tajam, emas tertekan.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Reaksi terbatas; pasar fokus ke komponen AHE & revisi bulan lalu.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Risiko resesi naik \u2192 ekspektasi pemangkasan The Fed menguat \u2192 USD turun, aset aman naik.", dir: "down", cur: "USD" }
    ],
    watch: ["Average Hourly Earnings", "Unemployment Rate", "Partisipasi angkatan kerja", "Keputusan FOMC September 2026"]
  },
  unemp: {
    read: [
      "Persentase angkatan kerja yang menganggur (ukuran U-3).",
      "Dirilis bersamaan dengan NFP, Jumat pertama tiap bulan.",
      "Turun = pasar kerja ketat; naik = melonggar \u2014 tapi cek partisipasi dulu.",
      "Pergerakan 0,1 poin saja bisa berarti ratusan ribu orang; baca arah 3\u20136 bulan."
    ],
    drivers: [
      { name: "Kesehatan pasar tenaga kerja", detail: "Tingkat pengangguran rendah menandakan bisnis kekurangan pekerja \u2014 menciptakan tekanan pada upah & inflasi, dan memberi The Fed alasan menahan suku bunga tinggi.", data: "Juli 2026: 4,1% (Juni 4,2%; konsensus 4,2%) \u2014 turun, namun karena 264 ribu orang keluar angkatan kerja, bukan karena hiring membaik.", src: SRC.blsJobs },
      { name: "Kebijakan moneter The Fed", detail: "The Fed memegang 'dual mandate' \u2014 inflasi & lapangan kerja. Pengangguran adalah penentu langsung jalur suku bunga: tinggi \u2192 ruang memotong; sangat rendah + inflasi tinggi \u2192 risiko menaikkan.", data: "Konsensus pasar: The Fed 'on hold' di 3,50\u20133,75% dengan risiko dua arah; Citi memproyeksikan unemp menembus 4,5% dalam beberapa bulan \u2192 kembali membuka wacana cut.", src: SRC.fed },
      { name: "Partisipasi angkatan kerja", detail: "Pengangguran turun bisa karena orang berhenti mencari kerja (keluar angkatan kerja), bukan karena mendapat pekerjaan. Selalu baca berpasangan.", data: "Partisipasi 61,4% (Juli 2026) \u2014 dekat level terendah sekitar 5,5 tahun.", src: SRC.blsJobs },
      { name: "Siklus bisnis", detail: "Fase ekspansi menurunkan pengangguran; resesi menaikannya. Data ini indikator lagging (terlambat) \u2014 biasanya baru naik setelah resesi berjalan beberapa bulan.", src: SRC.fred }
    ],
    expertViews: [
      { desk: "Riset Makro (Frankfurt)", view: "Pengangguran rendah tapi inflasi juga turun = kondisi ideal bank sentral mulai melonggarkan. Kombinasi inilah yang dicari pasar.", signal: "Unemp rendah + CPI turun = dovish-friendly." },
      { desk: "Bank Strategist (Tokyo)", view: "Untuk USD semua bergantung pada relasi dengan inflasi. Pengangguran yang terlalu rendah justru berisiko memicu inflasi upah dan membuat The Fed hawkish.", signal: "Waspadai unemp terlalu rendah." },
      { desk: "Economist \u2013 Fixed Income", view: "Kurva imbal hasil bergerak berdasarkan ekspektasi suku bunga yang dipengaruhi pengangguran. Pengangguran naik = obligasi diborong (yield turun).", signal: "Unemp naik = bonds rally." }
    ],
    outlook: "Per Agustus 2026, pengangguran AS 4,1% terlihat 'aman', tetapi strukturnya rapuh: penurunan terjadi di tengah partisipasi yang mendekati level terendah 5,5 tahun (61,4%), artinya banyak yang keluar dari angkatan kerja. Jika tren 'low-hire, low-fire' berlanjut dan partisipasi pulih, unemp berisiko naik cepat \u2014 Citi bahkan memperkirakan menembus 4,5% dalam beberapa bulan, yang akan menggeser pasar ke mode 'the Fed harus memotong'. Sebaliknya, selama unemp bertahan di bawah 4,5% dengan inflasi 3,4% yang masih lengket, The Fed (di bawah Ketua Kevin Warsh) cenderung tetap was-was hawkish. Arah USD: terdukung selama unemp stabil; rawan koreksi signifikan jika dua rilis berturut-turut di atas ekspektasi.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Pasar kerja melemah \u2192 ekspektasi pemangkasan Fed menguat \u2192 USD turun.", dir: "down", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral; pasar beralih ke data inflasi bulan yang sama.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Pasar kerja ketat \u2192 The Fed bisa tetap ketat/menaikkan \u2192 USD naik.", dir: "up", cur: "USD" }
    ],
    watch: ["Jobless Claims mingguan", "Partisipasi angkatan kerja", "Keputusan FOMC", "Laju inflasi (CPI)"]
  },
  cpi: {
    read: [
      "Perubahan harga barang & jasa yang dibeli konsumen, dibanding setahun lalu (YoY).",
      "Indikator inflasi utama yang menjadi target The Fed (2%).",
      "Perhatikan juga Core CPI yang menghapus makanan & energi \u2014 itu yang dibaca The Fed.",
      "Bandingkan actual vs konsensus vs previous; lihat juga komponen energi & shelter."
    ],
    drivers: [
      { name: "Harga energi & pangan", detail: "Bensin & bahan pangan sangat volatil dan mendominasi headline CPI. Lonjakan harga minyak (mis. konflik di Timur Tengah) bisa menaikkan inflasi beberapa titik dalam 2\u20133 bulan, lalu mereda kembali.", data: "Juli 2026: CPI 3,4% YoY (Juni 3,5%) \u2014 melandai; inflasi energi 14,7% masih menjadi beban utama akibat guncangan harga minyak.", src: SRC.blsCpi },
      { name: "Biaya produksi (PPI) & rantai pasok", detail: "Kenaikan harga produsen biasanya terbawa ke harga konsumen beberapa bulan kemudian. PPI adalah 'cermin depan' CPI.", data: "PPI Juli 2026: 4,7% YoY (turun dari 5,5% di Juni) \u2014 sinyal tekanan produksi mereda.", src: SRC.blsPpi },
      { name: "Kenaikan upah (AHE)", detail: "Upah yang naik mendorong daya beli dan biaya tenaga kerja \u2014 sumber inflasi berkelanjutan (khususnya inflasi jasa/shelter).", data: "Upah rata-rata per jam dipantau dalam rilis Employment Situation bulanan (BLS).", src: SRC.blsJobs },
      { name: "Permintaan konsumen & dolar", detail: "Belanja yang kuat mendorong produsen menaikkan harga. Dolar yang lemah membuat barang impor lebih mahal, menaikkan inflasi secara langsung.", src: SRC.blsCpi }
    ],
    expertViews: [
      { desk: "Head of Inflation Research (London)", view: "Headline CPI sering 'dimanipulasi' oleh energi. Analis serius lebih mengandalkan Core CPI untuk membaca tren sebenarnya.", signal: "Fokus ke Core, bukan headline." },
      { desk: "FX Desk (New York)", view: "CPI tinggi = The Fed hawkish = USD bullish, terutama terhadap JPY & EUR. Ini rilis paling dolar-sensitif selain NFP.", signal: "CPI > ekspektasi = USD up." },
      { desk: "Rates Strategist", view: "Yield obligasi bergerak mendahului CPI karena pasar sudah 'memprediksi'. Jika CPI selaras, reaksi kecil; jika meleset, reaksi besar.", signal: "Implied move sudah dipricingin." },
      { desk: "EM Strategist", view: "Inflasi AS yang tinggi menekan aset berisiko & emas, mendukung dolar. EM biasa merasakan tekanan saat inflasi AS memanas.", signal: "CPI tinggi = EM & gold pressure." }
    ],
    outlook: "Inflasi AS per Juli 2026 berada di 3,4% (headline) dan 2,5% (core) \u2014 turun berturut-turut namun masih jauh di atas target 2%. Efek guncangan energi dari konflik Timur Tengah perlahan memudar, sehingga tren headline diperkirakan lanjut melandai menuju ~3,0% pada paruh kedua 2026. Inti pertanyaannya adalah core: selama core turun konsisten (2,5% dan turun), pasar akan kembali memperkirakan pemangkasan The Fed di 2027, meski The Fed (Ketua Warsh) menegaskan 2% adalah 'commitment'. Risiko upside: jika core kembali naik ke atas 2,7% (mis. upah atau sewa memanas), ekspektasi balik ke 'higher for longer' bahkan kenaikan. Implikasi USD: tren inflasi turun = perlahan bearish USD; kejutan naik = spike hawkish.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Inflasi lebih lengket \u2192 The Fed hawkish \u2192 USD & yield naik, emas turun.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Reaksi kecil; pasar fokus ke komponen core & shelter.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Inflasi melandai \u2192 ruang pelonggaran meluas \u2192 USD turun.", dir: "down", cur: "USD" }
    ],
    watch: ["Core CPI", "PPI", "Jadwal FOMC", "Harga minyak (WTI/Brent)"]
  },
  corecpi: {
    read: [
      "CPI tanpa makanan & energi \u2014 lebih stabil dan jadi acuan kebijakan.",
      "Dipelototi lebih serius daripada headline CPI oleh The Fed & pasar.",
      "Komponen terbesar: shelter (sewa & perumahan) dan jasa.",
      "Tren 3\u20136 bulan lebih penting daripada satu bulan (karakternya 'lengket')."
    ],
    drivers: [
      { name: "Harga sewa & perumahan (shelter)", detail: "Komponen terbesar Core CPI. Sewa turun sangat lambat karena kontrak & lag statistik \u2014 ini penyebab utama inflasi inti sulit turun cepat.", data: "Juli 2026: Core CPI 2,5% YoY \u2014 terendah 5 bulan; shelter +3,2% (turun dari 3,3%).", src: SRC.blsCpi },
      { name: "Biaya layanan (services)", detail: "Kategori layanan (kesehatan, transportasi, rekreasi) sensitif terhadap upah & permintaan \u2014 inflasi jasa Juli 2026: 3,1%.", src: SRC.blsCpi },
      { name: "Kenaikan upah", detail: "Upah naik \u2192 biaya layanan naik \u2192 Core CPI naik. Inilah alasan Core 'sticky'.", src: SRC.blsJobs },
      { name: "Harga barang inti (goods ex food/energy)", detail: "Barang seperti kendaraan, perabot, pakaian. Lebih dipengaruhi rantai pasok, dolar, dan tarif impor.", src: SRC.blsCpi }
    ],
    expertViews: [
      { desk: "Head of Global Macro", view: "Core CPI adalah 'sinyal kebijakan' sebenarnya. Jika core turun konsisten, The Fed punya ruang memotong suku bunga.", signal: "Core turun = dovish signal." },
      { desk: "Economist (EU desk)", view: "Perbedaan core CPI AS (2,5%) vs Zona Euro (2,5%) menjelaskan arah divergensi kebijakan Fed\u2013ECB \u2014 perbandingan ini penting untuk EURUSD.", signal: "Core AS > Core EZ = USD kuat." }
    ],
    outlook: "Core CPI AS baru saja turun ke 2,5% (Juli 2026), level terendah dalam 5 bulan \u2014 sinyal bahwa tekanan inflasi inti mulai kehilangan momentum, terutama karena shelter mendingin (3,2%). Jika tren ini berlanjut 2\u20133 bulan (menuju ~2,2\u20132,3% pada akhir 2026), pasar akan secara agresif memperbesar peluang pemangkasan The Fed di 2027 dan USD akan tertekan secara bertahap. Namun dua risiko bisa memutus tren: (1) upah jasa yang kembali naik di atas 3,5% YoY, dan (2) dampak lanjutan tarif/impor ke harga barang inti. Selama core di kisaran 2,4\u20132,7%, The Fed akan memilih 'on hold' \u2014 zona netral bagi USD.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Inflasi inti lengket \u2192 suku bunga tinggi lebih lama \u2192 USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral; konfirmasi tren.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Disinflasi dipercepat \u2192 ekspektasi cut menguat \u2192 USD turun.", dir: "down", cur: "USD" }
    ],
    watch: ["Sewa & perumahan (shelter)", "Data upah (AHE)", "Ekspektasi pasar atas suku bunga (CME FedWatch)"]
  },
  ppi: {
    read: [
      "Perubahan harga di tingkat produsen (huluan), YoY.",
      "Pendahulu CPI \u2014 karena biaya produsen biasanya terbawa ke harga konsumen 1\u20133 bulan kemudian.",
      "Lihat PPI core (ex food, energy, trade) untuk tren sebenarnya."
    ],
    drivers: [
      { name: "Harga bahan baku & komoditas", detail: "Minyak, logam, hasil pertanian menentukan biaya input pabrik. Lonjakan tembaga atau minyak langsung terasa di PPI.", data: "PPI Juli 2026: 4,7% YoY, turun dari 5,5% Juni \u2014 didorong mendinginnya harga energi.", src: SRC.blsPpi },
      { name: "Biaya energi", detail: "Biaya listrik & bahan bakar memengaruhi hampir semua proses produksi; PPI energi sangat volatil mengikuti minyak.", src: SRC.blsPpi },
      { name: "Logistik & transportasi", detail: "Ongkos pengiriman & biaya rantai pasok langsung membebani harga jual produsen.", src: SRC.blsPpi },
      { name: "Upah & biaya buruh", detail: "Kenaikan upah pabrik menjadi biaya produksi yang akhirnya bisa terbawa ke harga konsumen.", src: SRC.blsJobs }
    ],
    expertViews: [
      { desk: "Riset Makro", view: "PPI adalah 'petunjuk awal' CPI. Jika PPI naik, pasar mengantisipasi CPI juga naik beberapa bulan kemudian.", signal: "PPI naik = CPI akan naik." },
      { desk: "Commodity Strategist", view: "PPI sangat dipengaruhi harga minyak & logam. Analis memisahkan komponen energi untuk melihat tren inti.", signal: "Pantau PPI core (ex energy)." }
    ],
    outlook: "PPI turun ke 4,7% (Juli 2026) dari 5,5% \u2014 indikasi kuat bahwa tekanan biaya di hulu sedang mereda, terutama setelah harga energi stabil. Jika PPI core ikut turun di Agustus\u2013September, maka CPI September 2026 berpeluang lanjut melandai di bawah 3,0%, yang akan memperkuat narasi 'disinflasi' dan melemahkan USD secara bertahap. Sebaliknya, kenaikan kembali harga minyak (risk geopolitik Timur Tengah) atau tembaga (risk China) bisa membalikkan arah PPI dalam 1\u20132 bulan.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Tekanan inflasi hulu masih panas \u2192 USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Biaya produksi mendingin \u2192 USD turun.", dir: "down", cur: "USD" }
    ],
    watch: ["CPI bulan berikutnya", "Harga komoditas (minyak, tembaga)", "Indeks harga impor"]
  },
  corepce: {
    read: [
      "Indeks harga pengeluaran konsumsi pribadi inti (tanpa makanan & energi), bulanan (m/m).",
      "Ukuran inflasi yang paling diperhatikan The Fed untuk kebijakan suku bunga.",
      "Dirilis akhir bulan bersamaan dengan GDP final, 08:30 ET."
    ],
    drivers: [
      { name: "Harga jasa (services)", detail: "Komponen jasa yang bersifat lengket (sticky) adalah penyumbang utama tren inflasi inti.", src: SRC.beaPce },
      { name: "Harga barang inti", detail: "Barang non-makanan/non-energi seperti perumahan, transportasi, & perawatan kesehatan.", src: SRC.beaPce },
      { name: "Upah & tenaga kerja", detail: "Kenaikan upah yang cepat terbawa ke harga jasa \u2014 inti dari tekanan inflasi inti.", src: SRC.blsJobs },
      { name: "Keputusan The Fed", detail: "Core PCE adalah input langsung ke dot plot & proyeksi SEP; menyimpang dari 2% berarti The Fed harus memberi alasan.", data: "Target resmi The Fed: 2% YoY. The Fed (Ketua Warsh) menegaskan komitmen 2% di pidato Mei 2026.", src: SRC.fed }
    ],
    expertViews: [
      { desk: "Fed Watch", view: "PCE inti adalah target resmi The Fed (2%). Jika naik, The Fed menahan suku bunga lebih lama; jika turun, membuka jalan pemangkasan.", signal: "Core PCE naik = USD up." },
      { desk: "Rates Strategist", view: "Perbedaan PCE vs CPI sering kecil, tapi The Fed lebih mengandalkan PCE karena mencakup struktur pengeluaran riil konsumen.", signal: "Fokus ke PCE, bukan CPI." }
    ],
    outlook: "Dengan CPI inti di 2,5% (Juli 2026), Core PCE (yang umumnya sedikit di bawah CPI core) diperkirakan bergerak di kisaran ~0,2% per bulan (\xB12,4% YoY) di kuartal III 2026. Ini zona 'cukup baik tapi belum target': cukup untuk mempertahankan The Fed on hold, namun belum cukup untuk memulai pemangkasan. Titik putar penting: jika Core PCE bulanan turun ke \u22640,15% dua bulan beruntun, pasar akan mulai mem-price cut pada paruh pertama 2027 (bearish USD); jika \u22650,30% (mis. jasa & kesehatan memanas), skenario 'higher for longer' bahkan kenaikan kembali akan menguat (bullish USD).",
    scenarios: [
      { label: "Di atas konsensus", effect: "Inflasi inti masih panas \u2192 USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral; fokus ke pidato The Fed.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Ruang pelonggaran \u2192 USD turun.", dir: "down", cur: "USD" }
    ],
    watch: ["CPI", "Upah rata-rata (AHE)", "Komponen jasa", "Keputusan FOMC"]
  },
  ahe: {
    read: [
      "Perubahan gaji rata-rata per jam (Average Hourly Earnings), YoY & MoM.",
      "Indikator inflasi upah \u2014 kenaikan upah cepat dapat memicu inflasi berkelanjutan.",
      "Dirilis bersamaan dengan NFP; sering lebih 'dipasar' daripada headline NFP."
    ],
    drivers: [
      { name: "Keketatan pasar kerja", detail: "Pasar kerja ketat (pengangguran rendah) mendorong perusahaan menaikkan gaji untuk menarik & mempertahankan pekerja.", src: SRC.blsJobs },
      { name: "Perundingan upah", detail: "Perjanjian kerja & serikat pekerja menetapkan kenaikan gaji yang berkelanjutan selama 1\u20133 tahun.", src: SRC.blsJobs },
      { name: "Produktivitas tenaga kerja", detail: "Produktivitas naik memungkinkan kenaikan upah tanpa memicu inflasi; produktivitas turun membuat kenaikan upah jadi inflasioner.", src: SRC.blsJobs }
    ],
    expertViews: [
      { desk: "FX Strategist", view: "AHE adalah 'bagian tersembunyi' dari NFP yang paling menentukan. Upah tinggi = inflasi tinggi = USD bullish.", signal: "AHE naik = USD kuat." },
      { desk: "Rates Desk", view: "Kenaikan upah membuat The Fed menunda penurunan suku bunga, sehingga yield obligasi naik \u2014 mendukung dolar.", signal: "AHE tinggi = yield up." }
    ],
    outlook: "Upah AS perlu diamati bersama inflasi: dengan CPI masih 3,4% (Juli 2026) dan The Fed mengisyaratkan bisa kembali hawkish, kenaikan AHE di atas ~3,8% YoY akan memperkuat alasan 'tahan/naikkan bunga' (bullish USD), sementara AHE melambat ke <3,3% akan membuka ruang pelonggaran (bearish USD). Pola yang paling sehat bagi pasar adalah 'upah naik moderat' (3,3\u20133,7%) \u2014 memberi daya beli tanpa memantik inflasi. Rilis AHE setiap Jumat pertama biasanya menjadi penentu arah EURUSD untuk sepekan ke depan.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Inflasi upah meningkat \u2192 The Fed hawkish \u2192 USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Tekanan inflasi mereda \u2192 USD turun.", dir: "down", cur: "USD" }
    ],
    watch: ["CPI", "Nonfarm Payrolls", "Produktivitas (BLS labor productivity)"]
  },
  fedfunds: {
    read: [
      "Suku bunga acuan The Fed (batas atas target range).",
      "Diumumkan 8x/tahun dari rapat FOMC, 14:00 ET + pidato press conference.",
      "Yang digerakkan pasar sering bukan angkanya, melainkan DOT PLOT & nada pidato."
    ],
    drivers: [
      { name: "Inflasi (CPI/Core CPI)", detail: "Inflasi tinggi memaksa The Fed mempertahankan atau menaikkan suku bunga. Inflasi 3,4% saat ini = alasan utama The Fed tidak mau longgar.", data: "CPI Juli 2026: 3,4% YoY; core 2,5%. Ketua The Fed Kevin Warsh: inflasi 'belum melambat cukup'.", src: SRC.blsCpi },
      { name: "Pasar tenaga kerja", detail: "Lapangan kerja & pengangguran menentukan seberapa ketat kebijakan yang diperlukan.", data: "NFP Juli 2026: \u221223 ribu (kejutan lemah) vs unemp 4,1% \u2014 The Fed terjepit antara dua mandat.", src: SRC.blsJobs },
      { name: "Pertumbuhan ekonomi (GDP)", detail: "Ekonomi yang tumbuh kuat mendukung suku bunga tinggi; perlambatan mendorong penurunan.", data: "GDP Q1-2026: +2,1% annualized; konsensus 2026 ~1,9\u20132,2%.", src: SRC.beaGdp },
      { name: "Kondisi finansial & dot plot", detail: "Dot plot (proyeksi suku bunga tiap anggota FOMC dalam SEP) sering mengguncang pasar lebih besar daripada keputusan itu sendiri.", src: SRC.fed }
    ],
    expertViews: [
      { desk: "Head of Rates (NY)", view: "Pasar berfokus pada 'dot plot' \u2014 proyeksi suku bunga anggota Fed. Perubahan dot plot sering lebih mengguncang daripada keputusan itu sendiri.", signal: "Dot plot = kunci." },
      { desk: "FX Strategist (London)", view: "Suku bunga tinggi = arus modal masuk = USD kuat. Perubahan ekspektasi suku bunga adalah penggerak utama EURUSD & USDJPY.", signal: "Hawkish Fed = USD up." },
      { desk: "Economist", view: "Baca pernyataan & nada (tone) Gubernur. Pidato setelah rapat (press conference) memegang pengaruh besar pada pergerakan pasar.", signal: "Baca nada press conference." }
    ],
    outlook: "Per Agustus 2026, The Fed di bawah kepemimpinan baru (Kevin Warsh, Ketua sejak Mei 2026) berada dalam mode 'hawkish on hold': suku bunga 3,50\u20133,75% dipertahankan karena inflasi 3,4% masih jauh di atas 2%, sementara pasar kerja mulai menunjukkan retakan (NFP Juli negatif, partisipasi 61,4%). Rapat September 2026 menjadi ujian pertama: data CPI Agustus yang panas \u2192 probabilitas kenaikan (hike) nyata; data yang dingin \u2192 hold dengan sinyal 'siap memotong di 2027'. Pasar harus bersiap volatilitas tinggi di sekitar tiap FOMC. Implikasi USD: selama dot plot tidak berubah, USD tetap terdukung oleh yield US10Y ~4,7%; perubahan dot plot ke arah pemangkasan akan menjadi katalis bearish USD terbesar tahun ini.",
    scenarios: [
      { label: "Hawkish (naik/tinggi lebih lama)", effect: "Yield naik, modal masuk \u2192 USD menguat luas (terutama vs EM).", dir: "up", cur: "USD" },
      { label: "Sebagaimana di-expect", effect: "Reaksi kecil; fokus ke dot plot & pidato.", dir: "flat", cur: "USD" },
      { label: "Dovish (potongan di depan)", effect: "Yield turun \u2192 USD melemah, emas & aset risiko naik.", dir: "down", cur: "USD" }
    ],
    watch: ["Dot plot / SEP", "Pernyataan FOMC", "Data CPI & NFP", "Pidato petinggi Fed"]
  },
  dgs10: {
    read: [
      "Imbal hasil obligasi pemerintah AS tenor 10 tahun.",
      "Disebut 'harga uang' \u2014 mencerminkan ekspektasi suku bunga + ekspektasi inflasi + premi risiko.",
      "Bergerak setiap hari (bukan rilis sekali) \u2014 pantau level & spread vs negara lain."
    ],
    drivers: [
      { name: "Ekspektasi suku bunga (The Fed)", detail: "Yield naik saat pasar mengantisipasi The Fed menaikkan suku bunga atau menahannya tinggi lebih lama.", data: "US10Y 28 Agu 2026: 4,73%; US2Y: 4,34% \u2014 kurva memendek namun masih positif (spread 10Y\u20132Y +0,39).", src: SRC.treasury },
      { name: "Ekspektasi inflasi", detail: "Inflasi yang diperkirakan naik membuat investor menuntut kompensasi (yield) lebih tinggi; TIPS (breakeven) adalah ukurannya.", data: "10Y TIPS breakeven \u2248 2,4% (Agu 2026) \u2014 pasar mengantisipasi inflasi 10 tahun ke depan di level ini.", src: SRC.treasury },
      { name: "Permintaan obligasi / risk appetite", detail: "Ketika takut, investor membeli obligasi (flight to safety) \u2192 yield turun; saat risk-on, yield naik. Arahnya bisa terbalik dari 'logika suku bunga'.", src: SRC.treasury },
      { name: "Supply & lelang", detail: "Defisit fiskal AS yang besar berarti penerbitan obligasi masif; hasil lelang yang lemah mendorong yield naik (premi permintaan).", src: SRC.treasury }
    ],
    expertViews: [
      { desk: "Rates Strategist", view: "Yield 10Y adalah 'ukur' suku bunga netral jangka panjang. Kenaikan yield = modal masuk = dolar kuat.", signal: "Yield naik = USD up." },
      { desk: "FX Desk", view: "Spread yield antara AS dan negara lain (mis. AS vs Jerman) adalah mesin utama nilai tukar. Yield AS naik cepat \u2192 selisih melebar \u2192 USD naik.", signal: "Watch US\u2013DE spread." }
    ],
    outlook: "US10Y di ~4,7% (Agu 2026) \u2014 level tinggi historis yang ditopang dua kekuatan: (1) The Fed 'hawkish on hold' dengan inflasi 3,4%, dan (2) penerbitan utang masif. Selama The Fed tidak memberi sinyal pemangkasan nyata, yield diproyeksikan bertahan di rentang 4,5\u20135,0%, yang terus menyedot dana ke dolar dan menahan EUR/USD, GBP/USD, dan cross EM tertekan. Titik perubahan: (a) dot plot September 2026 yang membesar ke arah cut, (b) CPI dua bulan beruntun di bawah konsensus, atau (c) stress lelang obligasi yang memicu risk-off (yield bisa naik sementara meski USD melemah \u2014 watch spread, bukan level saja).",
    scenarios: [
      { label: "Yield melonjak", effect: "Arus modal ke AS \u2192 USD menguat (kecuali karena crisis: flight-to-safety bisa melemahkan USD).", dir: "up", cur: "USD" },
      { label: "Stabil", effect: "Netral; USD mengikuti spread vs negara lain.", dir: "flat", cur: "USD" },
      { label: "Yield turun tajam", effect: "Ekspektasi pelonggaran \u2192 USD melemah.", dir: "down", cur: "USD" }
    ],
    watch: ["Level & kurva yield", "CPI", "Lelang obligasi (Treasury auction)", "Spread vs Bund Jerman & JGB"]
  },
  retail: {
    read: [
      "Perubahan penjualan ritel bulanan (m/m & YoY).",
      "Proksi belanja konsumen \u2014 sekitar dua pertiga ekonomi AS.",
      "Versi 'ex-auto' (tanpa kendaraan) yang paling dipantau pasar."
    ],
    drivers: [
      { name: "Keyakinan konsumen", detail: "Konsumen yang optimis lebih berani berbelanja, mendorong penjualan.", src: SRC.census },
      { name: "Pendapatan & upah", detail: "Pendapatan yang meningkat memberi daya beli untuk belanja.", src: SRC.blsJobs },
      { name: "Inflasi & harga", detail: "Inflasi tinggi bisa menaikkan nilai penjualan itu sendiri; perlu dilihat secara riil (nominal vs riil).", src: SRC.blsCpi },
      { name: "Kondisi kredit & suku bunga", detail: "Suku bunga tinggi menekan pinjaman konsumen (kartu kredit, KPR, auto loan), mengurangi belanja besar.", src: SRC.fed }
    ],
    expertViews: [
      { desk: "Consumer Strategist", view: "Retail sales adalah cermin langsung kesehatan konsumen. Angka kuat menandakan engine ekonomi AS masih menyala.", signal: "Retail kuat = USD up." },
      { desk: "Economist", view: "Perlu dipisahkan control group (tanpa otomotif & bensin) yang lebih bersih \u2014 itu yang biasanya dimonitor pasar.", signal: "Fokus ke control group." }
    ],
    outlook: "Konsumsi AS masih menjadi tulang punggung (\xB12/3 PDB) meski suku bunga tinggi menahan belanja besar (otomotif, rumah). Dengan GDP 2026 diproyeksikan ~1,9\u20132,2% dan upah riil tertekan inflasi 3,4%, retail sales diperkirakan tumbuh moderat \u2014 tidak cukup panas untuk memicu kekhawatiran inflasi, tidak cukup dingin untuk memicu panic. Retail ex-auto yang konsisten >+0,3% m/m akan menjaga narasi 'soft landing' dan menopang USD; kejutan negatif (<0%) akan memperkuat ekspektasi pemangkasan dan menekan USD.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Konsumsi sehat \u2192 ekonomi tahan \u2192 USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Konsumen melemah \u2192 ekspektasi cut \u2192 USD turun.", dir: "down", cur: "USD" }
    ],
    watch: ["Michigan Consumer Sentiment", "Data ketenagakerjaan", "Kredit konsumen (Fed G.19)"]
  },
  umich: {
    read: [
      "Survei keyakinan konsumen (University of Michigan) terhadap ekonomi & keuangan pribadi.",
      "Ada versi preliminary (pertengahan bulan) & final (akhir bulan).",
      "Komponen paling dipasar: ekspektasi inflasi 1-tahun & 5-tahun."
    ],
    drivers: [
      { name: "Kondisi ekonomi saat ini", detail: "Konsumen menilai situasi ekonomi yang sedang berjalan.", src: SRC.umich },
      { name: "Harga & inflasi", detail: "Inflasi tinggi menurunkan keyakinan; survei ini juga memuat ekspektasi inflasi konsumen \u2014 input kebijakan The Fed.", data: "Ekspektasi inflasi 1-tahun konsumen menjadi salah satu pengukur 'anchoring' inflasi (target The Fed 2%).", src: SRC.umich },
      { name: "Pasar tenaga kerja", detail: "Ketersediaan & keamanan pekerjaan memengaruhi rasa aman berbelanja.", src: SRC.blsJobs },
      { name: "Sentimen politik & peristiwa", detail: "Peristiwa politik dapat memengaruhi mood konsumen dalam jangka pendek.", src: SRC.umich }
    ],
    expertViews: [
      { desk: "Micro Strategist", view: "Yang paling dicari adalah 'ekspektasi inflasi 1 tahun' dari survei ini \u2014 sering menjadi petunjuk kebijakan The Fed.", signal: "Watch ekspektasi inflasi 1y." },
      { desk: "Consumer Economist", view: "Sentimen biasanya mengikuti data ketenagakerjaan dan harga; korelasi dengan belanja riil tidak selalu langsung.", signal: "Gunakan sebagai konfirmasi." }
    ],
    outlook: "Sentimen konsumen sensitif terhadap dua hal saat ini: upah riil yang tertekan inflasi 3,4% dan kekhawatiran pasar kerja (partisipasi 61,4%). Selama ekspektasi inflasi 1-tahun tetap 'terjangkar' di bawah ~3%, The Fed tidak perlu panik; lonjakan ekspektasi (>3,5%) akan menjadi bahan bakar narasi hawkish (bullish USD) karena bank sentral harus lebih agresif menjangkarkan. Ekspektasi 5-tahun adalah indikator kepercayaan jangka panjang \u2014 jika masih ~2,3\u20132,5%, pasar harga akan tetap percaya target 2% The Fed tercapai.",
    scenarios: [
      { label: "Sentimen & ekspektasi inflasi naik", effect: "Narasi hawkish \u2192 USD naik.", dir: "up", cur: "USD" },
      { label: "Stabil", effect: "Netral; dampak kecil.", dir: "flat", cur: "USD" },
      { label: "Sentimen anjlok", effect: "Risiko resesi \u2192 USD turun (kecuali flight-to-safety).", dir: "down", cur: "USD" }
    ],
    watch: ["Ekspektasi inflasi 1y & 5y", "Retail Sales", "Data ketenagakerjaan"]
  },
  indpro: {
    read: [
      "Perubahan output pabrik, pertambangan, & utilitas (m/m).",
      "Indikator aktivitas sektor produksi \u2014 sekitar 1/4 ekonomi AS.",
      "Lihat 'advance indicators' (pesanan) di dalam rilis yang sama."
    ],
    drivers: [
      { name: "Pesanan manufaktur", detail: "Pesanan yang masuk (new orders) menentukan tingkat produksi berikutnya.", src: SRC.fedG17 },
      { name: "Permintaan global", detail: "Ekonomi dunia yang kuat mendorong ekspor dan produksi domestik; China & Eropa penopang utama.", src: SRC.fedG17 },
      { name: "Kapasitas produksi", detail: "Seberapa banyak kapasitas yang terpakai menunjukkan ruang untuk meningkatkan output.", src: SRC.fedG17 }
    ],
    expertViews: [
      { desk: "Industri Strategist", view: "Industrial production bersama PMI menunjukkan 'denyut' manufaktur. Kenaikan = ekspansi ekonomi.", signal: "Produksi naik = risk-on." }
    ],
    outlook: "Sektor manufaktur AS berada di fase 'stabil tapi tidak ekspansif' \u2014 tertahan biaya energi tinggi dan suku bunga 3,50\u20133,75%, ditopang investasi IT & energi. Industrial production diproyeksikan tumbuh pelan (+0,1\u20130,3% m/m) di kuartal III 2026. Dampak ke FX terbatas dibanding CPI/NFP, tetapi rangkaian produksi lemah 2\u20133 bulan berturut-turut akan memperkuat skenario resesi ringan yang berujung pada pemangkasan Fed (bearish USD).",
    scenarios: [
      { label: "Di atas konsensus", effect: "Ekspansi berlanjut \u2192 USD naik tipis.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Perlambatan produksi \u2192 USD turun tipis.", dir: "down", cur: "USD" }
    ],
    watch: ["ISM Manufacturing PMI", "Capacity Utilization", "Pesanan tahan lama (durable goods)"]
  },
  gdp: {
    read: [
      "Pertumbuhan ekonomi riil (annualized per kuartal & YoY).",
      "Angka paling luas tentang kesehatan ekonomi; dirilis 3 kali (advance, second, final).",
      "Baca komposisinya: konsumsi vs investasi vs ekspor bersih."
    ],
    drivers: [
      { name: "Konsumsi rumah tangga", detail: "Komponen terbesar (~70% PDB). Belanja konsumen menentukan laju pertumbuhan.", data: "GDP Q1-2026: +2,1% annualized (revisi naik dari 1,6%); proyeksi 2026: 1,9\u20132,2%.", src: SRC.beaGdp },
      { name: "Investasi bisnis", detail: "Investasi modal (terutama IT) merefleksikan optimisme jangka panjang perusahaan; ini penopang pertumbuhan AS 2026.", src: SRC.beaGdp },
      { name: "Ekspor & impor", detail: "Ekspor yang kuat menambah, impor yang besar mengurangi PDB; tarif & kurs menentukan arahnya.", src: SRC.beaGdp },
      { name: "Belanja pemerintah", detail: "Kebijakan fiskal dan belanja negara mendorong pertumbuhan; pemotongan belanja federal bisa menjadi rem (lihat koreksi sektor pemerintah Juli 2026).", src: SRC.beaGdp }
    ],
    expertViews: [
      { desk: "Macro Strategist", view: "GDP kuat = The Fed lebih nyaman mempertahankan suku bunga tinggi = USD kuat. GDP lemah = ekspektasi cut naik.", signal: "GDP kuat = USD up." },
      { desk: "Economist", view: "Perhatikan komposisi: pertumbuhan berbasis konsumsi & investasi lebih sehat & berkelanjutan daripada hanya berbasis stimulus.", signal: "Baca komposisi, bukan headline." }
    ],
    outlook: "Ekonomi AS diproyeksikan tumbuh ~1,9\u20132,2% sepanjang 2026 (di atas konsensus global 2,4% untuk seluruh dunia) \u2014 solid, ditopang investasi IT, energi, dan belanja konsumen yang tangguh. Q2-2026 (rilis akhir Juli) menunjukkan pelansungan tipis; jika Q3 tetap >1,5% annualized, skenario 'soft landing' bertahan dan The Fed tidak punya alasan longgar \u2192 USD terdukung. Risiko utama: konsumsi rumah tangga yang melelah akibat inflasi 3,4% + suku bunga tinggi; dua kuartal berturut-turut <1% akan menggeser pasar ke skenario resesi (bearish USD).",
    scenarios: [
      { label: "Di atas konsensus", effect: "Ekonomi kuat \u2192 The Fed tahan ketat \u2192 USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Perlambatan \u2192 ekspektasi cut \u2192 USD turun.", dir: "down", cur: "USD" }
    ],
    watch: ["Konsumsi pribadi", "Investasi bisnis", "Ekspor bersih", "Kebijakan fiskal"]
  },
  claims: {
    read: [
      "Klaim pengangguran awal per minggu \u2014 data pasar kerja tercepat.",
      "Dirilis setiap Kamis, 08:30 ET (13:30/19:30 WIB). Di sini dirata-rata bulanan.",
      "Bandingkan 4-minggu moving average, bukan angka seminggu."
    ],
    drivers: [
      { name: "PHK / pemutusan kerja", detail: "Peningkatan klaim menandakan perusahaan mulai memangkas karyawan \u2014 tanda awal perlambatan.", data: "Klaim awal sempat stabil di ~215 ribu (Juni\u2013Juli 2026) \u2014 level 'aman', jauh di bawah zona alarm (>300 ribu).", src: SRC.blsClaims },
      { name: "Siklus bisnis", detail: "Klaim biasanya naik menjelang/kala resesi dan turun saat ekspansi.", src: SRC.fred },
      { name: "Kondisi pasar kerja", detail: "Klaim yang rendah & stabil = pasar kerja solid, mendukung kebijakan ketat The Fed.", src: SRC.blsClaims }
    ],
    expertViews: [
      { desk: "Labor Economist", view: "Jobless claims adalah 'radar' dini pasar kerja. Lonjakan tajam adalah peringatan awal resesi.", signal: "Spike = risk-off." },
      { desk: "FX Strategist", view: "Klaim naik melemahkan USD karena memicu spekulasi The Fed akan memangkas suku bunga cepat.", signal: "Klaim naik = USD down." }
    ],
    outlook: "Dengan NFP Juli negatif (\u221223 ribu) dan revisi 103 ribu, klaim awal adalah radar paling dini untuk melihat apakah pasar kerja 'mendingin' atau 'retak'. Selama 4-minggu moving average bertahan di bawah ~230 ribu, pasar akan tetap menganggap pasar kerja stabil (netral-bullish USD). Lonjakan ke 260\u2013300 ribu berturut-turut 2\u20133 minggu akan menjadi sinyal awal pelemahan USD yang besar \u2014 biasanya mendahului kenaikan Unemployment Rate 4\u20138 minggu kemudian.",
    scenarios: [
      { label: "Naik tajam (>250 ribu)", effect: "Warning perlambatan \u2192 USD turun.", dir: "down", cur: "USD" },
      { label: "Stabil (<230 ribu)", effect: "Netral-bullish USD.", dir: "flat", cur: "USD" },
      { label: "Turun", effect: "Pasar kerja ketat \u2192 USD naik tipis.", dir: "up", cur: "USD" }
    ],
    watch: ["NFP (Jumat)", "Unemployment Rate", "Klaim lanjutan (continuing claims)"]
  },
  capacity: {
    read: [
      "Persentase kapasitas industri yang terpakai.",
      "Bersama Industrial Production mencerminkan denyut sektor manufaktur.",
      "Level >80% = tekanan; <75% = banyak ruang."
    ],
    drivers: [
      { name: "Permintaan industri", detail: "Permintaan tinggi mendorong pabrik menggunakan lebih banyak kapasitas.", src: SRC.fedG17 },
      { name: "Investasi kapasitas", detail: "Pembangunan pabrik baru dan peralatan menambah kapasitas yang tersedia.", src: SRC.fedG17 },
      { name: "Siklus manufaktur", detail: "Kapasitas terpakai sangat terikat siklus ekspansi-kontraksi manufaktur.", src: SRC.fedG17 }
    ],
    expertViews: [
      { desk: "Industrial Analyst", view: "Kapasitas terpakai mendekati maksimum menandakan tekanan inflasi produksi \u2014 mendukung kebijakan ketat.", signal: "Kapasitas tinggi = inflasi pressure." }
    ],
    outlook: "Kapasitas terpakai AS di kisaran menengah (\xB177%) menunjukkan ekonomi produksi 'penuh tapi tidak overheat' \u2014 tidak memberi alasan tambahan bagi The Fed untuk menaikkan bunga, namun juga tidak membuka ruang pemangkasan. Dampak FX-nya paling kecil dibanding CPI/NFP; gunakan sebagai konfirmasi arah siklus manufaktur bersama ISM & Industrial Production.",
    scenarios: [
      { label: "Naik mendekati 80%+", effect: "Tekanan inflasi produksi \u2192 USD naik tipis.", dir: "up", cur: "USD" },
      { label: "Stabil", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Turun", effect: "Produksi melemah \u2192 USD turun tipis.", dir: "down", cur: "USD" }
    ],
    watch: ["Industrial Production", "ISM Manufacturing PMI", "PPI"]
  },
  eu_cpi: {
    read: [
      "Indeks harga konsumen Zona Euro (HICP), YoY.",
      "Target inflasi ECB juga 2% (symetris \u2014 inflasi rendah juga jadi masalah).",
      "Ada 'flash estimate' awal bulan (cepat, kurang akurat) & final."
    ],
    drivers: [
      { name: "Harga energi", detail: "Eropa sangat bergantung pada impor energi \u2014 konflik Timur Tengah 2026 menaikkan inflasi EZ lewat harga gas & bensin.", data: "HICP Juli 2026: 2,9% YoY (Juni 2,8%) \u2014 naik lagi akibat energi; core 2,5%. Proyeksi ECB: HICP bisa mencapai 3,4% di Q3\u2013Q4 2026.", src: SRC.eurostat },
      { name: "Harga pangan", detail: "Kenaikan harga pangan langsung tercermin dalam inflasi konsumen Eropa (inflasi pangan Q2-2026: 1,2%).", src: SRC.eurostat },
      { name: "Upah Eropa", detail: "Perundingan upah yang tinggi dapat 'menumpuk' inflasi dan membuat ECB ketat lebih lama. Pertumbuhan upah Q1-2026: 3,4% YoY.", src: SRC.eurostat },
      { name: "Permintaan kawasan", detail: "Konsumsi & investasi dalam Zona Euro menentukan tekanan harga; pertumbuhan 2026 diproyeksikan hanya 0,8%.", src: SRC.ecb }
    ],
    expertViews: [
      { desk: "ECB Watcher", view: "Inflasi EZ biasanya didorong energi, bukan permintaan domestik. Karena itu ECB sering lebih berhati-hati daripada The Fed.", signal: "Baca komponen energi." },
      { desk: "FX Strategist", view: "Inflasi EZ tinggi \u2192 ECB hawkish \u2192 EUR kuat terhadap USD & GBP.", signal: "EZ CPI tinggi = EUR up." }
    ],
    outlook: "ECB baru saja melakukan kenaikan pertama dalam 3 tahun (+25bp Juni 2026, jadi 2,40%) sebagai respons guncangan energi. Proyeksi staff ECB (Juni 2026): HICP 2026 rata-rata 3,0%, bisa menyentuh 3,4% di Q3\u2013Q4, baru turun ke 2,3% di 2027. Artinya ECB kemungkinan menaikkan 1\u20132x lagi pada 2026 sebelum memotong. Divergensi ini adalah mesin EURUSD: ECB hawkish + Fed terjepit data kerja lemah \u2192 EUR memiliki momentum naik terhadap USD di paruh kedua 2026, selama minyak tidak melonjak ekstrem (yang justru merugikan ekonomi EZ).",
    scenarios: [
      { label: "Di atas konsensus", effect: "ECB hawkish \u2192 EUR naik (terutama vs USD/GBP).", dir: "up", cur: "EUR" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "EUR" },
      { label: "Di bawah konsensus", effect: "Ruang longgar ECB \u2192 EUR turun.", dir: "down", cur: "EUR" }
    ],
    watch: ["Keputusan ECB (Sept 2026)", "Harga energi (Brent/TTF)", "GDP & tenaga kerja Eropa"]
  },
  eu_unemp: {
    read: [
      "Tingkat pengangguran Zona Euro (Eurostat, bulanan).",
      "Dampak ke EUR umumnya kecil \u2014 pasar lebih fokus ke inflasi & keputusan ECB.",
      "Perhatikan juga youth unemployment & upah."
    ],
    drivers: [
      { name: "Pasar kerja Eropa", detail: "Kondisi pasar kerja di negara-negara anggota berpengaruh pada angka gabungan.", data: "Juni 2026: 6,3% (Juli belum rilis; proyeksi 6,3%). Pengangguran muda 14,8% (Juni).", src: SRC.eurostat },
      { name: "Siklus ekonomi", detail: "Ekonomi yang tumbuh menurunkan pengangguran; stagnasi menaikannya. Pertumbuhan 2026 EZ hanya 0,8% \u2014 risiko utama.", src: SRC.ecb },
      { name: "Kebijakan ECB", detail: "Kebijakan suku bunga (kini 2,40%) berdampak pada investasi & lapangan kerja.", src: SRC.ecb }
    ],
    expertViews: [
      { desk: "Eurozone Economist", view: "Pengangguran rendah mendukung ECB mempertahankan kebijakan ketat, menguatkan EUR.", signal: "Unemp rendah = EUR up." }
    ],
    outlook: "Pasar kerja Zona Euro masih solid (6,3%, dekat level terendah historis) bahkan di tengah kenaikan suku bunga \u2014 ini memberi ECB legitimasi untuk tetap hawkish sepanjang 2026. Risiko: jika pertumbuhan 0,8% melambat menjadi stagnasi (Q3\u2013Q4), pengangguran bisa naik ke 6,5\u20136,7%, yang akan memaksa ECB berhenti menaikkan dan membuka wacana cut di 2027 (bearish EUR). Jangka pendek: data netral-bullish EUR.",
    scenarios: [
      { label: "Turun (pasar kerja ketat)", effect: "ECB yakin hawkish \u2192 EUR naik.", dir: "up", cur: "EUR" },
      { label: "Stabil", effect: "Netral.", dir: "flat", cur: "EUR" },
      { label: "Naik (perlambatan)", effect: "Tekanan dovish ke ECB \u2192 EUR turun.", dir: "down", cur: "EUR" }
    ],
    watch: ["Keputusan ECB", "PMI Zona Euro", "Upah & data tenaga kerja"]
  },
  uk_cpi: {
    read: [
      "Indeks harga konsumen Inggris (ONS), YoY.",
      "Menentukan kebijakan Bank of England (BoE).",
      "Target inflasi BoE: 2% (CPI)."
    ],
    drivers: [
      { name: "Harga pangan & energi", detail: "Inggris sensitif terhadap impor energi & pangan; lonjakan harga gas (Ofgem price cap) langsung menaikkan inflasi.", data: "CPI Juli 2026: 2,9% YoY (Juni 2,6%) \u2014 naik karena kenaikan price cap energi Ofgem 13%; inflasi energi 9,8%. Core tetap 2,6%.", src: SRC.onsCpi },
      { name: "Upah Inggris", detail: "Pasar kerja Inggris masih ketat, menaikkan upah dan inflasi jasa (inflasi jasa Juli: 3,4%).", src: SRC.onsCpi },
      { name: "Permintaan domestik & sterling", detail: "Konsumsi & revisi harga di sektor jasa; pound yang lemah menaikkan biaya impor.", src: SRC.onsCpi }
    ],
    expertViews: [
      { desk: "BoE Watcher", view: "Inflasi Inggris yang lebih 'sticky' daripada mitranya membuat BoE lebih lambat memangkas suku bunga \u2014 mendukung GBP.", signal: "UK CPI tinggi = GBP up." },
      { desk: "FX Strategist", view: "Perbedaan laju inflasi & kebijakan antara BoE dan The Fed adalah mesin utama GBP/USD.", signal: "Watch BoE vs Fed divergence." }
    ],
    outlook: "Inflasi UK kembali naik ke 2,9% (Juli 2026) \u2014 didorong price cap energi Ofgem, sementara core tetap 2,6% (di bawah target). BoE di 3,75% akan menghadapi dilema di rapat September 2026: headline yang panas vs core yang jinak. Pasar besar kemungkinan memperkirakan hold. Jika inflasi energi ikut mereda (Brent turun) dan upah melambat, BoE bisa mulai memotong di Q1-2027 \u2192 GBP perlahan bearish. Sebaliknya, CPI >3,0% dua bulan beruntun akan mempertahankan narasi 'BoE lebih hawkish dari Fed' \u2192 GBP/USD terangkat.",
    scenarios: [
      { label: "Di atas konsensus", effect: "BoE hawkish \u2192 GBP naik.", dir: "up", cur: "GBP" },
      { label: "Sesuai konsensus", effect: "Netral; fokus ke core.", dir: "flat", cur: "GBP" },
      { label: "Di bawah konsensus", effect: "Ruang cut BoE \u2192 GBP turun.", dir: "down", cur: "GBP" }
    ],
    watch: ["Keputusan BoE", "Data upah UK", "Harga energi & price cap Ofgem"]
  },
  uk_unemp: {
    read: [
      "Tingkat pengangguran Inggris (ONS, bulanan; 3-bulan rolling).",
      "Sering rilis bersamaan dengan data upah & klaim.",
      "Dampak ke GBP moderat \u2014 BoE juga sangat fokus ke inflasi."
    ],
    drivers: [
      { name: "Pasar kerja UK", detail: "Kondisi pasar kerja Inggris, termasuk tingkat partisipasi & low-pay work.", data: "Juni 2026: 4,9% (3-bulan rolling) \u2014 stabil; upah (ex bonus) tetap tumbuh ~4% YoY.", src: SRC.onsJobs },
      { name: "Siklus ekonomi", detail: "Fase ekspansi menurunkan pengangguran; ekonomi UK 2026 diproyeksikan hanya ~0,9% \u2014 zona rapuh.", src: SRC.onsJobs },
      { name: "Kebijakan BoE", detail: "Suku bunga 3,75% menekan permintaan kredit & rekrutmen.", src: SRC.onsJobs }
    ],
    expertViews: [
      { desk: "UK Economist", view: "Pengangguran rendah + upah naik = inflasi bertahan \u2192 BoE ketat \u2192 GBP kuat.", signal: "Unemp rendah & wages up = GBP up." }
    ],
    outlook: "Pasar kerja Inggris dalam mode 'low-hire, low-fire' seperti AS: pengangguran stabil 4,9% tetapi pertumbuhan upah yang kuat (~4%) menjaga inflasi jasa tetap 3,4%. Selama pola ini bertahan, BoE tidak punya alasan longgar \u2014 netral-bullish GBP. Risiko: pertumbuhan ekonomi 0,9% yang terlalu tipis bisa memicu lonjakan pengangguran ke 5,3%+ pada 2027, yang akan menjadi katalis pemangkasan BoE lebih awal (bearish GBP).",
    scenarios: [
      { label: "Turun (pasar kerja ketat)", effect: "BoE tahan ketat \u2192 GBP naik.", dir: "up", cur: "GBP" },
      { label: "Stabil", effect: "Netral.", dir: "flat", cur: "GBP" },
      { label: "Naik (perlambatan)", effect: "BoE dovish \u2192 GBP turun.", dir: "down", cur: "GBP" }
    ],
    watch: ["Upah UK (ex bonus)", "Keputusan BoE", "UK CPI"]
  },
  jp_cpi: {
    read: [
      "Indeks harga konsumen Jepang (MOF), YoY \u2014 Tokyo & nasional.",
      "Menjadi penentu kebijakan normalisasi Bank of Japan (BoJ).",
      "Target inflasi BoJ: 2% (dengan upah riil positif)."
    ],
    drivers: [
      { name: "Harga impor (energi & pangan)", detail: "Jepang sangat bergantung impor; yen lemah membuat impor mahal \u2192 inflasi naik tapi daya beli turun.", data: "BoJ telah menaikkan suku bunga ke 1,00% (2026) \u2014 proses normalisasi berlanjut mengikuti inflasi yang bertahan di atas 2%.", src: SRC.mofJp },
      { name: "Upah Jepang (shuntou)", detail: "Kenaikan upah yang berkelanjutan (musim semi/shuntou) diperlukan agar inflasi 'sehat' dan konsumsi pulih.", src: SRC.mofJp },
      { name: "Faktor yen (passthrough)", detail: "Yen yang lemah menaikkan biaya impor, mendorong inflasi namun menekan daya beli rumah tangga.", src: SRC.mofJp }
    ],
    expertViews: [
      { desk: "BoJ Watcher", view: "Inflasi Jepang menetap di atas target memaksa BoJ menaikkan suku bunga \u2014 langkah 'normalisasi' yang menguatkan JPY.", signal: "Normalisasi BoJ = JPY up." },
      { desk: "FX Strategist", view: "Intervensi Menteri Keuangan sering muncul saat yen melemah tajam \u2014 perhatikan risiko intervensi.", signal: "Watch intervensi yen." }
    ],
    outlook: "Normalisasi BoJ sudah dimulai (suku bunga kini 1,00%) dan akan berlanjut selagi inflasi inti Tokyo bertahan di 2,5\u20133%. Setiap kenaikan BoJ (diprediksi bertahap, total 25\u201350bp lagi pada 2026\u20132027) adalah katalis bullish JPY yang paling diandalkan analis, terutama terhadap USD & EUR. Namun JPY juga dibantu faktor lain: selisih suku bunga AS\u2013Jepang yang mulai menyempit (US10Y 4,73% vs JGB10Y masih ~1,5\u20132%) \u2014 selama The Fed tidak menaikkan lagi, carry trade USD/JPY perlahan kehilangan daya tarik. Risiko: yen terlalu cepat menguat bisa memaksa BoJ berhenti menaikkan (efek umpan balik).",
    scenarios: [
      { label: "CPI di atas 3%", effect: "BoJ cepat menaikkan \u2192 JPY naik tajam.", dir: "up", cur: "JPY" },
      { label: "CPI 2\u20133% (sesuai)", effect: "Normalisasi bertahap \u2192 JPY naik pelan.", dir: "flat", cur: "JPY" },
      { label: "CPI di bawah 2%", effect: "BoJ tertahan \u2192 JPY tertekan.", dir: "down", cur: "JPY" }
    ],
    watch: ["Keputusan BoJ", "Upah (shuntou)", "Intervensi yen", "USD/JPY level 160"]
  },
  eu_gdp: {
    read: [
      "Pertumbuhan ekonomi riil Zona Euro, kuartalan (flash \u2192 final).",
      "Flash estimate awal bulan; final 1,5 bulan kemudian.",
      "Baca revisi antar versi \u2014 pasar bereaksi ke kejutan, bukan level."
    ],
    drivers: [
      { name: "Konsumsi & investasi Eropa", detail: "Belanja rumah tangga tertekan energi & suku bunga 2,40%; investasi ditopang program transisi hijau.", data: "Q1-2026: +0,3% annualized (melemah); proyeksi 2026: +0,8% (ECB) \u2014 jauh di bawah AS (2,1%).", src: SRC.eurostat },
      { name: "Ekspor (terutama ke Tiongkok)", detail: "Permintaan dari Tiongkok \u2014 yang sendiri dalam deflasi ringan \u2014 sangat memengaruhi industri manufaktur EZ.", src: SRC.eurostat },
      { name: "Kebijakan fiskal", detail: "Belanja negara & program investasi (terutama Jerman) mendorong pertumbuhan.", src: SRC.ecb }
    ],
    expertViews: [
      { desk: "EU Macro Strategist", view: "Zona Euro rentan stagnasi. GDP kuat = EUR menguat; pertumbuhan tipis memicu kekhawatiran dan melemahkan EUR.", signal: "EZ GDP kuat = EUR up." }
    ],
    outlook: "Risiko utama Zona Euro 2026 adalah stagnasi: proyeksi ECB hanya +0,8% (Q1 bahkan +0,3% annualized), tertahan guncangan energi dan manufaktur yang lesu. Jika GDP Q2\u2013Q3 ternyata negatif atau 0%, tekanan dovish ke ECB akan menguat \u2014 meski inflasi tinggi, 'stagflasi ringan' bisa memaksa ECB stop & cut di 2027 (bearish EUR). Sebaliknya, stimulus fiskal Jerman yang efektif + recovery manufaktur bisa mengejutkan ke atas (bullish EUR). Volatilitas EUR akan tinggi di sekitar rilis GDP flash.",
    scenarios: [
      { label: "Di atas konsensus (\u22650,5% q/q)", effect: "Ekonomi EZ pulih \u2192 EUR naik.", dir: "up", cur: "EUR" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "EUR" },
      { label: "Di bawah konsensus (<0%)", effect: "Risiko stagnasi \u2192 EUR turun.", dir: "down", cur: "EUR" }
    ],
    watch: ["PMI Zona Euro", "Keputusan ECB", "Pertumbuhan China & AS", "Fiskal Jerman"]
  },
  china_cpi: {
    read: [
      "Indeks harga konsumen Tiongkok (NBS), YoY.",
      "Mencerminkan tekanan deflasi/inflasi ekonomi #2 dunia.",
      "PPI Tiongkok (deflasi industri) sering lebih penting bagi komoditas."
    ],
    drivers: [
      { name: "Permintaan domestik", detail: "Konsumsi & belanja rumah tangga Tiongkok (terlambat karena krisis properti) menentukan tekanan harga.", data: "CPI Juli 2026: +0,5% YoY \u2014 deflasi ringan berlanjut; konsumsi masih lesu pasca-krisis properti.", src: SRC.nbsCn },
      { name: "Harga pangan", detail: "Komponen pangan (terutama babi) besar dan volatil dalam CPI China.", src: SRC.nbsCn },
      { name: "Kebijakan stimulus", detail: "Pemerintah & PBoC melonggarkan kebijakan (LPR kini ~3,0%) untuk melawan deflasi; paket fiskal tambahan kemungkinan besar di H2-2026.", src: SRC.nbsCn },
      { name: "Sektor properti", detail: "Krisis properti menekan permintaan dan harga; pemulihannya penting bagi reflasi & harga tembaga.", src: SRC.nbsCn }
    ],
    expertViews: [
      { desk: "China Economist", view: "Deflasi di China memaksa stimulus agresif \u2192 mendukung CNY dan permintaan komoditas global.", signal: "Stimulus China = CNY & commodity up." },
      { desk: "Commodity Strategist", view: "Jika China berhasil reflasi, permintaan komoditas (tembaga, minyak) naik \u2014 menguntungkan AUD & CAD.", signal: "Reflasi China = AUD/CAD up." }
    ],
    outlook: "Tiongkok masih terjebak inflasi ~0,5% (Juli 2026) \u2014 jauh di bawah target 2,5%, yang memberi PBoC ruang terus melonggarkan (LPR 3,0%, lebih banyak cut & RRR di 2026) serta mendorong paket fiskal besar di H2-2026. Ini bullish CNY secara bertahap dan bullish komoditas (tembaga, minyak, batubara) jika stimulus efektif. Skenario penting: CPI kembali positif >1% + PPI keluar deflasi = 'reflasi terkonfirmasi' \u2192 rali AUD/NZD/CAD & emas. Sebaliknya, CPI kembali ke 0% (resesi-like) \u2192 panic stimulus tapi bearish risk assets.",
    scenarios: [
      { label: "CPI naik (reflasi)", effect: "Permintaan global pulih \u2192 CNY naik, komoditas (AUD) naik.", dir: "up", cur: "CNY" },
      { label: "Stabil ~0,5%", effect: "Netral; stimulus berlanjut.", dir: "flat", cur: "CNY" },
      { label: "Deflasi kembali", effect: "Panic stimulus \u2192 risk-off, CNY tertekan.", dir: "down", cur: "CNY" }
    ],
    watch: ["PPI Tiongkok", "Keputusan PBoC (LPR)", "Paket stimulus fiskal", "Data properti & penjualan ritel"]
  },
  wti: {
    read: [
      "Harga minyak mentah WTI per barel (NYMEX).",
      "Bergerak harian; sangat sensitif stok mingguan EIA (Rabu) & geopolitik.",
      "Pantau juga spread WTI\u2013Brent (kondisi pasar AS)."
    ],
    drivers: [
      { name: "Penawaran OPEC+", detail: "Keputusan OPEC+ memangkas atau menambah produksi berdampak besar pada harga.", data: "WTI 30 Agu 2026: \u2248 US$83,4/barel (live) \u2014 masih tinggi akibat guncangan pasokan Timur Tengah; turun ~4,5% dari sebulan lalu.", src: SRC.eiaOil },
      { name: "Permintaan global", detail: "Permintaan dari ekonomi besar (China, AS, Eropa) menentukan konsumsi minyak; China kunci (lihat CPI deflasinya).", src: SRC.eiaOil },
      { name: "Geopolitik", detail: "Konflik & gangguan pasokan di kawasan produsen (Timur Tengah) menyebabkan lonjakan harga \u2014 faktor utama 2026.", src: SRC.eiaOil },
      { name: "Stok minyak AS (EIA)", detail: "Laporan stok mingguan (Rabu, 14:30 ET) memberi sinyal suplai-permintaan jangka pendek.", src: SRC.eiaOil }
    ],
    expertViews: [
      { desk: "Energy Strategist", view: "Minyak naik menguntungkan produsen (CAD, NOK) dan merugikan importir (JPY, EUR). Juga menaikkan inflasi global.", signal: "WTI up = CAD up, JPY down." },
      { desk: "Macro Desk", view: "Harga minyak memengaruhi inflasi & kebijakan bank sentral \u2014 lonjakan tajam bisa memicu hawkish bias.", signal: "Oil spike = inflation risk." }
    ],
    outlook: "Minyak di ~US$83 (Agu 2026) mencerminkan premium risiko geopolitik Timur Tengah yang belum pulih penuh. Dua jalur: (1) de-escalasi \u2192 stok menumpuk, harga turun ke 70\u201375 \u2192 inflasi global mendingin (dovish semua bank sentral, bearish CAD/NOK, bullish importir JPY/EUR); (2) eskalasi \u2192 90+ \u2192 inflasi kembali memanas (hawkish, bullish CAD, bearish JPY). Laporan EIA mingguan tetap penggerak jangka pendek; pantau juga produksi shale AS yang merespons harga >80.",
    scenarios: [
      { label: "Minyak melonjak", effect: "Inflasi naik \u2192 CAD/NOK naik, JPY/EUR turun.", dir: "up", cur: "CAD\xB7NOK" },
      { label: "Stabil", effect: "Netral.", dir: "flat", cur: "CAD\xB7NOK" },
      { label: "Minyak anjlok", effect: "Inflasi turun \u2192 produsen minyak tertekan.", dir: "down", cur: "CAD\xB7NOK" }
    ],
    watch: ["Laporan stok EIA (Rabu)", "Keputusan OPEC+", "Geopolitik Timur Tengah", "Permintaan China"]
  },
  brent: {
    read: [
      "Harga minyak mentah Brent per barel (ICE).",
      "Acuan harga minyak internasional (Eropa, Asia, Afrika).",
      "Selisih (spread) WTI\u2013Brent mencerminkan logistik & keseimbangan regional."
    ],
    drivers: [
      { name: "Pasokan global & OPEC+", detail: "Produksi dan kebijakan kuota OPEC+ menentukan pasokan minyak dunia.", data: "Brent 30 Agu 2026: \u2248 US$89,3/barel (live) \u2014 premium ~US$6 di atas WTI (normal).", src: SRC.eiaOil },
      { name: "Permintaan global", detail: "Permintaan dari China, AS, & Eropa menggerakkan harga Brent; China ~1/3 impor minyak dunia.", src: SRC.eiaOil },
      { name: "Geopolitik & gangguan pasokan", detail: "Tensi di Timur Tengah & gangguan produksi memicu lonjakan harga.", src: SRC.eiaOil },
      { name: "Stok minyak (EIA/API)", detail: "Laporan stok mingguan memberikan petunjuk keseimbangan suplai-permintaan.", src: SRC.eiaOil }
    ],
    expertViews: [
      { desk: "Energy Strategist", view: "Brent acuan banyak kontrak Asia-Eropa. Naiknya minyak menguatkan CAD/NOK dan melemahkan JPY/EUR.", signal: "Brent up = CAD/NOK up." },
      { desk: "Commodity Analyst", view: "Selisih WTI\u2013Brent (spread) mencerminkan logistik & kondisi pasar regional; perhatikan penyempitan/pelebaran spread.", signal: "Watch WTI\u2013Brent spread." }
    ],
    outlook: "Brent ~US$89 mengikuti WTI dengan premium stabil (~US$6) \u2014 menandakan pasar AS tidak surplus parah. Dengan proyeksi permintaan 2026 yang didorong rebound pascatensi + pertumbuhan moderat, dan suplai OPEC+ yang disiplin, Brent diproyeksikan 80\u201395 sepanjang H2-2026. Level >90 = inflasi global memanas (hawkish global, bullish CAD, bearish JPY); <80 = angin segar bagi importir (EUR/JPY pulih) dan tekanan dovish ke bank sentral.",
    scenarios: [
      { label: "Brent naik (>90)", effect: "Inflasi \u2192 CAD/NOK naik, JPY turun.", dir: "up", cur: "CAD\xB7NOK" },
      { label: "Stabil (80\u201390)", effect: "Netral.", dir: "flat", cur: "CAD\xB7NOK" },
      { label: "Brent turun (<80)", effect: "Inflasi turun \u2192 CAD/NOK turun, JPY/EUR pulih.", dir: "down", cur: "CAD\xB7NOK" }
    ],
    watch: ["OPEC+", "Permintaan China", "Stok minyak EIA", "Spread WTI\u2013Brent"]
  },
  natgas: {
    read: [
      "Harga gas alam acuan Henry Hub per MMBtu (NYMEX).",
      "Bergerak harian; sangat musiman (musim dingin/panas).",
      "Laporan stok EIA tiap Kamis sangat menentukan."
    ],
    drivers: [
      { name: "Musim & cuaca", detail: "Permintaan pemanasan (winter) & pendinginan (summer) sangat menentukan harga gas.", src: SRC.eiaGas },
      { name: "Produksi & stok gas AS", detail: "Stok mingguan EIA (injection/withdrawal) memengaruhi harga.", data: "Henry Hub 30 Agu 2026: \u2248 US$2,89/MMBtu (live) \u2014 level rendah historis akibat produksi shale gas masif.", src: SRC.eiaGas },
      { name: "Ekspor LNG", detail: "Ekspor LNG menyerap pasokan AS, menopang harga gas domestik.", src: SRC.eiaGas },
      { name: "Harga minyak & batu bara", detail: "Substitusi energi memengaruhi harga relatif gas.", src: SRC.eiaGas }
    ],
    expertViews: [
      { desk: "Energy Strategist", view: "Gas merupakan biaya input energi US. Harga naik menguatkan USD dan memengaruhi inflasi domestik.", signal: "Gas up = USD & energy up." },
      { desk: "Commodity Analyst", view: "Volatilitas gas sangat tinggi & musiman. Bisa jadi alat sentimen risiko namun bukan penggerak utama pair FX.", signal: "High vol; gunakan untuk sentimen." }
    ],
    outlook: "Gas US$2,89/MMBtu masih murah historis \u2014 produksi AS yang melimpah menjaga harga rendah sepanjang 2026. Lonjakan terjadi pada musim pendinginan (Nov\u2013Feb) jika cuaca dingin ekstrem: gas bisa 4\u20136 sementara, menaikkan biaya pemanasan rumah tangga & inflasi utilitas (bullish USD ringan). Untuk FX, gas adalah faktor sekunder; pengaruhnya lebih ke sentimen energi & inflasi US secara umum.",
    scenarios: [
      { label: "Gas melonjak (musim dingin ekstrem)", effect: "Inflasi energi US naik \u2192 USD naik tipis.", dir: "up", cur: "USD" },
      { label: "Stabil rendah", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Gas turun", effect: "Inflasi turun \u2192 USD turun tipis.", dir: "down", cur: "USD" }
    ],
    watch: ["Stok gas EIA (Kamis)", "Cuaca/musim", "Ekspor LNG"]
  },
  copper: {
    read: [
      "Harga tembaga global per pound (COMEX) / per metrik ton (LME).",
      "Dianggap barometer kesehatan ekonomi dunia (indikator dini) \u2014 'Dr. Copper'.",
      "Korelasi kuat dengan aktivitas konstruksi, manufaktur & elektrifikasi."
    ],
    drivers: [
      { name: "Permintaan industri & China", detail: "Sebagian besar permintaan tembaga dari sektor konstruksi & manufaktur, terutama China \u2014 stimulus China = katalis utama.", data: "COMEX copper 30 Agu 2026: \u2248 US$6,56/lb (live) \u2014 +3,2% sebulan terakhir, didorong ekspektasi stimulus China.", src: SRC.lmeCopper },
      { name: "Investasi infrastruktur & elektrifikasi", detail: "Kendaraan listrik & jaringan listrik meningkatkan permintaan tembaga jangka panjang (EV butuh 3\u20134x tembaga vs mobil bensin).", src: SRC.lmeCopper },
      { name: "Pasokan tambang", detail: "Gangguan tambang & biaya produksi memengaruhi harga; pasokan global ketat jangka menengah.", src: SRC.lmeCopper },
      { name: "Kurs & stok bursa (LME)", detail: "Stok London Metal Exchange & harga dolar memengaruhi harga tembaga (dikalkulasikan dalam USD).", src: SRC.lmeCopper }
    ],
    expertViews: [
      { desk: "Metals Analyst", view: "Tembaga naik = permintaan global kuat \u2192 menguntungkan mata uang komoditas seperti AUD & NZD.", signal: "Copper up = AUD/NZD up." },
      { desk: "China Desk", view: "Karena China adalah konsumen terbesar, kebijakan stimulus & aktivitas properti China sangat menentukan arah tembaga.", signal: "Watch stimulus China." }
    ],
    outlook: "Tembaga di ~US$6,56/lb dengan tren naik \u2014 kombinasi pasokan ketat dan ekspektasi stimulus China H2-2026. Jika paket fiskal China terealisasi dan properti stabil, tembaga bisa 7+ pada 2027 (bullish AUD/NZD/CAD & sentimen risiko global). Risiko: resesi China (CPI kembali deflasi) \u2192 tembaga turun ke 5,5\u20135,8 \u2192 bearish mata uang komoditas. Pantau stok LME: penurunan stok + harga naik = sinyal permintaan riil, bukan spekulasi.",
    scenarios: [
      { label: "Tembaga naik (>7)", effect: "Permintaan global kuat \u2192 AUD/NZD naik.", dir: "up", cur: "AUD\xB7NZD" },
      { label: "Stabil", effect: "Netral.", dir: "flat", cur: "AUD\xB7NZD" },
      { label: "Tembaga turun (<5,8)", effect: "Risiko resesi global \u2192 AUD/NZD turun.", dir: "down", cur: "AUD\xB7NZD" }
    ],
    watch: ["Stimulus China", "Stok LME", "Data PMI manufaktur", "Aktivitas properti China"]
  },
  vix: {
    read: [
      "Indeks volatilitas/ketakutan pasar (CBOE), harian.",
      "Naik = pasar takut/volatile; turun = tenang. <15 tenang, 20\u201325 gelisah, >30 panic.",
      "Naiknya sering mendahului koreksi saham 2\u20135 hari."
    ],
    drivers: [
      { name: "Sentimen risiko", detail: "Ketakutan & optimisme pasar menentukan level VIX.", src: SRC.cboeVix },
      { name: "Ketakutan krisis", detail: "Peristiwa besar (krisis, konflik, perang dagang) menyebabkan spike VIX.", src: SRC.cboeVix },
      { name: "Data makro besar", detail: "Rilis besar seperti FOMC & NFP (Juli 2026: kejutan NFP negatif) bisa memicu lonjakan volatilitas jangka pendek.", src: SRC.cboeVix }
    ],
    expertViews: [
      { desk: "Vol Strategist", view: "VIX tinggi = risk-off \u2192 aset aman (USD, JPY, CHF, emas) diburu; mata uang risiko (AUD, NZD, GBP) tertekan.", signal: "VIX spike = risk-off." },
      { desk: "Cross-Asset Strategist", view: "VIX adalah 'pengukur' suasana pasar. Pantau spike saat rilis hot sebagai penanda risiko & peluang.", signal: "Gunakan sebagai filter entry." }
    ],
    outlook: "Dengan The Fed 'hawkish on hold', pasar kerja yang rapuh, dan geopolitik Timur Tengah, volatilitas 2026H2 cenderung lebih tinggi dari 2025 \u2014 VIX kemungkinan sering menyentuh 20\u201325 di sekitar rilis FOMC & data kerja. Untuk trader forex: VIX >25 = hindari pair risk (AUD, NZD, GBP) & favor safe haven (USD, JPY, CHF, emas); VIX kembali <18 = environment normal untuk strategi trend. VIX adalah filter, bukan sinyal arah.",
    scenarios: [
      { label: "VIX spike (>25)", effect: "Risk-off \u2192 USD/JPY/CHF/emas naik, AUD/NZD turun.", dir: "up", cur: "USD\xB7JPY\xB7CHF" },
      { label: "Normal (15\u201320)", effect: "Netral; strategi standar.", dir: "flat", cur: "\u2014" },
      { label: "VIX rendah (<15)", effect: "Risk-on \u2192 mata uang risiko pulih.", dir: "down", cur: "USD\xB7JPY\xB7CHF" }
    ],
    watch: ["Rilis FOMC & data kerja", "Geopolitik", "Saham & obligasi (korelasi cross-asset)"]
  }
};
function getEducation(id) {
  return EDUCATION[id] || null;
}

// .smoke32-entry.jsx
import { jsx as jsx7 } from "react/jsx-runtime";
function App({ events, ids }) {
  const [details, setDetails] = useState5(null);
  useEffect5(() => {
    Promise.all(ids.map((id) => getReleaseAnalytics(id).catch(() => null))).then((list) => {
      const d = {};
      ids.forEach((id, i) => {
        const a = list[i];
        if (!a) return;
        d[id] = {
          data: a,
          releases: a.releases,
          accuracy: a.accuracy,
          source: a.source,
          edu: getEducation(id),
          general: GENERAL,
          cat: CATEGORIES.find((c) => c.id === a.category),
          country: COUNTRIES.find((c) => c.id === a.country),
          upcoming: []
        };
      });
      setDetails(d);
    });
  }, [ids]);
  if (!details) return /* @__PURE__ */ jsx7("div", { id: "loading", children: "\u2026" });
  return /* @__PURE__ */ jsx7(CalendarClient, { events, details });
}
export {
  App as default
};
