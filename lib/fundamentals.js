// lib/fundamentals.js
// Penjelasan fundamental per aset — data riil per 30 Agustus 2026 (BLS, FRED,
// Treasury, ECB, ONS, EIA, Reuters) — dipakai card "Fundamental" di /charts.
// Angka negara diambil dari COUNTRY_DATA (lib/macroData.js) agar konsisten
// dengan /analysis; bagian naratif & katalis di bawah.

import { COUNTRY_DATA, COUNTRY_NAMES } from "./macroData";

const SRC = {
  bls: { label: "BLS (resmi)", url: "https://www.bls.gov/" },
  fred: { label: "FRED (resmi)", url: "https://fred.stlouisfed.org/" },
  fed: { label: "The Fed (resmi)", url: "https://www.federalreserve.gov/" },
  treasury: { label: "U.S. Treasury (resmi)", url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates" },
  ecb: { label: "ECB (resmi)", url: "https://www.ecb.europa.eu/" },
  eurostat: { label: "Eurostat (resmi)", url: "https://ec.europa.eu/eurostat/" },
  ons: { label: "ONS UK (resmi)", url: "https://www.ons.gov.uk/" },
  boj: { label: "BOJ (resmi)", url: "https://www.boj.or.jp/en/" },
  rba: { label: "RBA (resmi)", url: "https://www.rba.gov.au/" },
  boc: { label: "Bank of Canada (resmi)", url: "https://www.bankofcanada.ca/" },
  rbnz: { label: "RBNZ (resmi)", url: "https://www.rbnz.govt.nz/" },
  eia: { label: "EIA (resmi)", url: "https://www.eia.gov/" },
  cftc: { label: "CFTC (resmi)", url: "https://www.cftc.gov/MarketReports/CommitmentsofTraders" },
};

const FOCUS = {
  us: ["us"],
  euro_us: ["euro", "us"],
  gb_us: ["gb", "us"],
  jp_us: ["jp", "us"],
  au_us: ["au", "us"],
  ca_us: ["ca", "us"],
  nz_us: ["nz", "us"],
  us_cn: ["us", "cn"],
};

export function assetFundamentals(id) {
  const cc = (k) => COUNTRY_DATA[k];

  const defs = {
    gold: {
      focus: FOCUS.us,
      headline:
        "Emas diperdagangkan ≈ US$4.530/oz (30 Agu 2026) dengan hedge fund net long +141.648 kontrak (CFTC, 18 Agu) — tertinggi sejak awal tahun. Pendorong utama: suku bunga riil AS yang turun dari puncaknya, inflasi AS masih 3,4% YoY (core 2,5%), pasar kerja AS melambat (NFP Juli −23 ribu; pengangguran 4,1%), dan The Fed di 3,75% masih di bawah tekanan inflasi. Dolar (DXY ≈ 99,7) yang melemah memperkuat emas dalam denominasi dolar.",
      drivers: [
        { k: "Fed Funds Rate", v: "3,75%", note: "FOMC berikutnya 16 Sep 2026 — pasar menghargai 'on hold, hawkish tail' di bawah Ketua Kevin Warsh" },
        { k: "Inflasi AS (CPI)", v: "3,4% YoY", note: "core 2,5% (Jul 26); energi 14,7% masih beban utama" },
        { k: "Yield Treasury 10-tahun", v: "≈ 4,72%", note: "yield turun = biaya oportunitas memegang emas turun = emas naik" },
        { k: "Dollar Index (DXY)", v: "≈ 99,7", note: "dolar lemah → emas lebih murah bagi pembeli non-USD" },
        { k: "Pasar kerja AS", v: "NFP −23K (Jul)", note: "konsensus +85K; Juni direvisi 57→20K — sinyal perlambatan" },
      ],
      catalysts: [
        { date: "4 Sep", ev: "NFP (pekerjaan AS) — 19:30 WIB" },
        { date: "16 Sep", ev: "FOMC + press conference — 01:00 WIB" },
      ],
      sources: [SRC.bls, SRC.treasury, SRC.fed],
    },

    silver: {
      focus: FOCUS.us_cn,
      headline:
        "Perak ≈ US$67,8/oz (30 Agu 2026) digerakkan ganda: moneter (mengikuti emas) dan industri (panel surya, elektronik, EV — permintaan besar dari manufaktur Tiongkok, GDP 4,6%). Hedge fund net long +11.695 kontrak (CFTC, 18 Agu), jauh di bawah ekstrem emas sehingga rasio emas/perak masih menarik. Pelemahan dolar dan ekspektasi stimulus China menjadi katalis terdekat.",
      drivers: [
        { k: "Fed Funds Rate", v: "3,75%", note: "sinyal The Fed menentukan arah logam mulia" },
        { k: "Rasio emas/perak", v: "≈ 67:1", note: "perak relatif murah vs emas — potensi catch-up" },
        { k: "GDP Tiongkok", v: "4,6% (F 2026)", note: "permintaan industri perak terbesar di dunia" },
        { k: "Inflasi AS", v: "3,4% YoY", note: "inflasi tinggi → lindung nilai ke logam" },
      ],
      catalysts: [
        { date: "4 Sep", ev: "NFP AS — 19:30 WIB" },
        { date: "16 Sep", ev: "FOMC — 01:00 WIB" },
      ],
      sources: [SRC.bls, SRC.fred, SRC.cftc],
    },

    wti: {
      focus: FOCUS.us_cn,
      headline:
        "WTI ≈ US$83,4/barel (30 Agu 2026). Pasokan: OPEC+ masih memegang kuota produksi, AS tetap produsen terbesar. Permintaan: manufaktur Tiongkok (PMI) dan konsumsi AS menjadi penentu; stok komersial AS dipantau mingguan (EIA). Hedge fund baru memotong net long (CFTC, 18 Agu) setelah harga turun ~4,5% pada Juli — posisi spekulatif masih net long namun lebih ringan.",
      drivers: [
        { k: "Kebijakan OPEC+", v: "kuota ketat", note: "setiap sinyal relaksasi = tekanan jual" },
        { k: "Permintaan Tiongkok", v: "GDP 4,6% (F)", note: "importir minyak terbesar dunia" },
        { k: "Data stok AS (EIA)", v: "rilis mingguan", note: "akumulasi stok = negatif; penarikan = positif" },
        { k: "Inflasi & suku bunga AS", v: "CPI 3,4% · Fed 3,75%", note: "ekonomi melambat → ekspektasi permintaan minyak turun" },
      ],
      catalysts: [
        { date: "mingguan", ev: "EIA inventori minyak AS — 21:30 WIB" },
        { date: "16 Sep", ev: "FOMC — menentukan jalur suku bunga global" },
      ],
      sources: [SRC.eia, SRC.fred, SRC.bls],
    },

    eurusd: {
      focus: FOCUS.euro_us,
      headline:
        "EUR/USD ≈ 1,1587 (30 Agu 2026). Arah pair ditentukan selisih suku bunga: ECB 2,40% vs The Fed 3,75% — diferensial +135bp masih pro-USD, tetapi ECB baru naikkan suku bunga +25bp di Jun 2026 (pertama dalam 3 tahun) sementara The Fed tertahan inflasi 3,4%. Inflasi Zona Euro 2,9% (core 2,5%) vs AS 3,4% memberi ECB ruang kebijakan yang lebih longgar. Pertemuan ECB 10 Sep lalu FOMC 16 Sep adalah dua katalis terbesar bulan depan.",
      drivers: [
        { k: "ECB", v: "2,40%", note: "+25bp Jun 2026 — kenaikan pertama dalam 3 tahun; meeting 10 Sep" },
        { k: "The Fed", v: "3,75%", note: "on hold; Ketua Warsh hawkish; FOMC 16 Sep" },
        { k: "Inflasi", v: "EZ 2,9% vs AS 3,4%", note: "inflasi AS lebih tinggi → The Fed lebih tertahan" },
        { k: "GDP", v: "EZ 0,8% vs AS 2,1% (F)", note: "pertumbuhan AS jauh lebih kuat" },
        { k: "Pengangguran", v: "EZ 6,3% vs AS 4,1%", note: "pasar kerja EZ lebih longgar" },
      ],
      catalysts: [
        { date: "10 Sep", ev: "Keputusan ECB — 20:15 WIB" },
        { date: "16 Sep", ev: "FOMC + proyeksi — 01:00 WIB" },
      ],
      sources: [SRC.ecb, SRC.eurostat, SRC.fed],
    },

    gbpusd: {
      focus: FOCUS.gb_us,
      headline:
        "GBP/USD ≈ 1,3537 (30 Agu 2026). BoE dan The Fed sama-sama di 3,75%, sehingga pair lebih sensitif pada data masing-masing: inflasi UK 2,9% (core 2,6%) vs AS 3,4% — inflasi UK yang lebih rendah memberi BoE ruang longgar (BoE sudah cut −25bp Des 2025, hold sejak). Pertumbuhan UK 0,9% (F) lebih lemah dari AS 2,1% — headwind bagi pound. Data tenaga kerja ONS (bulanan) dan CPI UK menjadi pemicu volatilitas utama.",
      drivers: [
        { k: "Bank of England", v: "3,75%", note: "hold sejak cut −25bp Des 2025" },
        { k: "The Fed", v: "3,75%", note: "on hold; FOMC 16 Sep" },
        { k: "Inflasi UK (CPI)", v: "2,9% YoY", note: "core 2,6% — lebih terkendali dari AS" },
        { k: "Pengangguran UK", v: "4,9%", note: "lebih tinggi dari AS (4,1%) — pasar kerja lebih longgar" },
        { k: "GDP UK", v: "0,9% (F 2026)", note: "jauh di bawah AS 2,1%" },
      ],
      catalysts: [
        { date: "4 Sep", ev: "NFP AS — 19:30 WIB" },
        { date: "16 Sep", ev: "FOMC — 01:00 WIB" },
      ],
      sources: [SRC.ons, SRC.fed, SRC.bls],
    },

    usdjpy: {
      focus: FOCUS.jp_us,
      headline:
        "USD/JPY ≈ 160,0 (30 Agu 2026) — level tertinggi historis. Penyebab: gap suku bunga raksasa, BOJ baru di 1,00% (naik dari 0,75% pada 2026) vs The Fed 3,75% → carry trade USD/JPY tetap sangat menguntungkan bagi institusi. BOJ normalisasi lambat (inflasi Jepang terkendali, GDP Q2 1,1% annualized) membuat yen tetap lemah. Risiko asimetris: intervensi verbal/moneter otoritas Jepang (MOF) di atas 160 dan kejutan hawkish BOJ adalah dua pemicu balik arah terbesar.",
      drivers: [
        { k: "BOJ", v: "1,00%", note: "+25bp 2026 (0,75 → 1,00); masih jauh dari Fed" },
        { k: "The Fed", v: "3,75%", note: "diferensial +275bp = mesin carry trade" },
        { k: "GDP Jepang", v: "1,1% (Q2 annualized)", note: "pertumbuhan moderat, tidak memberi alasan BOJ agresif" },
        { k: "Pengangguran Jepang", v: "2,4%", note: "pasar kerja sangat kuat — inflasi upah tertahan" },
        { k: "Risiko intervensi", v: "MOF di >160", note: "sejarah: apresiasi cepat setelah intervensi" },
      ],
      catalysts: [
        { date: "4 Sep", ev: "NFP AS — 19:30 WIB" },
        { date: "16 Sep", ev: "FOMC — 01:00 WIB (sentimen carry trade)" },
      ],
      sources: [SRC.boj, SRC.fed, SRC.treasury],
    },

    audusd: {
      focus: FOCUS.au_us,
      headline:
        "AUD/USD ≈ 0,7164 (30 Agu 2026). RBA masih ketat di 4,35% (naik +25bp Mei 2026, hold 11 Agu) — paling hawkish di antara pair mayor, menopang AUD. Namun AUD sangat bergantung pada dua hal eksternal: harga komoditas (minyak, emas, logam) dan Tiongkok (GDP 4,6%, importir komoditas terbesar). Jika data AS (NFP, CPI) membuat The Fed tampak lebih hawkish, AUD tertekan karena dolar menguat.",
      drivers: [
        { k: "RBA", v: "4,35%", note: "+25bp Mei 2026; hold 11 Agu 2026" },
        { k: "The Fed", v: "3,75%", note: "diferensial hanya +65bp — paling kecil di pair mayor" },
        { k: "GDP Tiongkok", v: "4,6% (F)", note: "katalis utama permintaan komoditas" },
        { k: "Pengangguran AU", v: "4,5%", note: "pasar kerja AU masih solid" },
        { k: "Harga komoditas", v: "WTI 83,4 · XAU 4.530", note: "eksportir komoditas = AUD procy" },
      ],
      catalysts: [
        { date: "4 Sep", ev: "NFP AS — 19:30 WIB" },
        { date: "16 Sep", ev: "FOMC — 01:00 WIB" },
      ],
      sources: [SRC.rba, SRC.bls, SRC.fred],
    },

    usdcad: {
      focus: FOCUS.ca_us,
      headline:
        "USD/CAD ≈ 1,3901 (30 Agu 2026). BOC di 2,25% (cut −25bp Okt 2025, hold sejak) — jauh di bawah Fed 3,75%, sehingga dolar AS struktural lebih kuat. CAD juga 'oil pair': WTI ≈ 83,4 yang turun ~4,5% pada Juli menekan CAD. Pengangguran Kanada 6,4% (tertinggi di G7 selain EZ) memperkuat kasus kebijakan longgar BOC. Pair paling sensitif: data AS (NFP, CPI) + harga minyak.",
      drivers: [
        { k: "Bank of Canada", v: "2,25%", note: "hold sejak cut Okt 2025" },
        { k: "The Fed", v: "3,75%", note: "diferensial +150bp pro-USD" },
        { k: "Pengangguran CA", v: "6,4%", note: "pasar kerja lemah → tekanan ke BOC" },
        { k: "Harga minyak (WTI)", v: "≈ 83,4", note: "CAD = oil pair; minyak turun = CAD turun" },
      ],
      catalysts: [
        { date: "4 Sep", ev: "NFP AS — 19:30 WIB" },
        { date: "mingguan", ev: "EIA inventori minyak — 21:30 WIB" },
      ],
      sources: [SRC.boc, SRC.bls, SRC.eia],
    },

    nzdusd: {
      focus: FOCUS.nz_us,
      headline:
        "NZD/USD ≈ 0,5915 (30 Agu 2026) — pair terjauh dari paritas di antar mayor. RBNZ justru naikkan suku bunga +25bp ke 2,50% di Agu 2026 (bertentangan arus global) namun gap dengan Fed 3,75% masih lebar. Selandia Baru sangat sensitif terhadap China (sapi, susu) dan global risk appetite — NZD cenderung turun saat aversi risiko. Volatilitas tinggi, likuiditas lebih tipis dibanding pair lain.",
      drivers: [
        { k: "RBNZ", v: "2,50%", note: "+25bp Agu 2026 (2,25 → 2,50)" },
        { k: "The Fed", v: "3,75%", note: "diferensial +125bp pro-USD" },
        { k: "China (mitra dagang)", v: "GDP 4,6% (F)", note: "permintaan susu/sapi NZ ke China" },
        { k: "Risk sentiment", v: "sensitif", note: "NZD turun saat pasar takut (safe-haven ke USD)" },
      ],
      catalysts: [
        { date: "4 Sep", ev: "NFP AS — 19:30 WIB" },
        { date: "16 Sep", ev: "FOMC — 01:00 WIB" },
      ],
      sources: [SRC.rbnz, SRC.bls, SRC.fred],
    },

    dxy: {
      focus: FOCUS.us,
      headline:
        "DXY ≈ 99,7 (30 Agu 2026) — di bawah 100 untuk pertama kalinya dalam waktu lama, mencerminkan dolar yang melemah terhadap sekeranjang 6 mata uang (63% EUR, 13% JPY, 11% GBP, 4% SEK, 4% CAD, 3% CHF). Spekulans net long +17.073 kontrak (CFTC 25 Agu) namun komersial net short −19.838 — posisi relatif seimbang menjelang FOMC 16 Sep. Penggerak: yield Treasury (10Y ≈ 4,72%), ekspektasi suku bunga The Fed, dan sentimen safe-haven global.",
      drivers: [
        { k: "The Fed", v: "3,75%", note: "on hold; Ketua Warsh hawkish — FOMC 16 Sep" },
        { k: "Yield 10-tahun", v: "≈ 4,72%", note: "yield tinggi = tarik modal ke USD" },
        { k: "Inflasi AS", v: "3,4% YoY", note: "inflasi tinggi = The Fed tertahan cut = pro-USD" },
        { k: "Pasar kerja", v: "unemp 4,1%", note: "NFP Juli −23K — mulai melambat" },
        { k: "COT spekulatif", v: "net long +17.073", note: "CFTC 25 Agu; komersial net short" },
      ],
      catalysts: [
        { date: "4 Sep", ev: "NFP — 19:30 WIB" },
        { date: "16 Sep", ev: "FOMC + proyeksi — 01:00 WIB" },
      ],
      sources: [SRC.treasury, SRC.fed, SRC.cftc],
    },
  };

  const d = defs[id] || defs.gold;
  const countries = d.focus.map((k) => {
    const row = cc(k);
    return {
      key: k,
      name: COUNTRY_NAMES[k] || k,
      bank: row?.rateBank || "—",
      rate: row?.rate ?? null,
      inflation: row?.inflation ?? null,
      gdp: row?.gdp ?? null,
      gdpNote: row?.gdpNote || null,
      unemp: row?.unemp ?? null,
      move: row?.move ?? null,
      moveNote: row?.moveNote || null,
    };
  });

  return { ...d, countries };
}
