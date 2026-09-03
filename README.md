# 💹 MacroLab — Dashboard Makro Ekonomi untuk Trader Forex

Dashboard untuk mengumpulkan, menampilkan, dan menganalisis data makroekonomi yang berdampak pada dunia
forex: **Nonfarm Payrolls (NFP), CPI, Core CPI, PPI, Average Hourly Earnings, Fed Funds Rate, FOMC,
10-Year Treasury Yield, GDP, Retail Sales, sentimen konsumen**, serta indikator Zona Euro, Inggris,
Jepang, dan Tiongkok.

> Dibangun dengan **Next.js (App Router)** dan **React 19**. Nilai indikator ditarik **live dari FRED**
> (tanpa API key) dan otomatis memakai *cache lokal* bila koneksi gagal.

---

## ✨ Fitur

| Halaman | Deskripsi |
| --- | --- |
| **Overview / Command Center** (`/`) | Satu layar: **Risk Appetite Gauge**, **sesi pasar live**, **kekuatan mata uang (currency strength)**, **top movers**, indikator AS paling berdampak, jadwal rilis, dan indikator pasar global. |
| **Kalkulator Trader** (`/calculators`) | Position Size (risiko), Pip Value, Profit/Loss, Pivot Points (klasik), Fibonacci, dan konversi Lot↔Unit — semua real-time di browser. |
| **Analisis Teknikal** (`/technicals`) | Matriks sinyal multi-timeframe (EMA/RSI/MACD/ATR) semua instrumen + skor confluence, grade setup A/B/C & **Market Regime** (tren/range). |
| **Analisis Fundamental** (`/fundamentals`) | Bias fundamental per mata uang (suku bunga riil, kebijakan, pertumbuhan, pasar kerja) + **scenario planner** & cheat sheet rilis penting. |
| **Watchlist & Alerts** (`/watchlist`) | Pantau instrumen favorit + **price alert** dengan notifikasi browser & bunyi. |
| **Copilot** (`/copilot`) | Asisten AI berbasis data MacroLab. Mendukung **LLM sungguhan** (OpenAI/Gemini/Anthropic bila API key di-set) + fallback rule-based. |
| **Pattern Screener** (`/screener`) | Scan otomatis pola candlestick (engulfing, pin bar, doji, inside bar, three soldiers) & breakout untuk semua pasangan. |
| **Komunitas** (`/community`) | Prediksi rilis penting (NFP/CPI/FOMC) + **leaderboard akurasi** terhadap ACTUAL. |
| **Analisis Dampak** (`/analysis`) | **Konsensus vs Actual** per rilis, "surprise", **metrik akurasi konsensus**, dan **dampak ke pasangan mata uang**. |
| **Kalender Ekonomi** (`/calendar`) | Jadwal rilis (FOMC, NFP, CPI, PPI, ISM, dsb.) dengan filter kategori & dampak. |
| **Indikator** (`/indicators`) | Tabel semua indikator dengan **filter** (pencarian, kategori, negara) & **urutan** dampak *High → Low*, nama, negara. |
| **Detail Indikator** (`/indicators/[id]`) | Grafik interaktif, KPI, blok **konsensus vs actual**, **riwayat rilis**, analisis **Apa/Kenapa/Dampak**, **Apa yang Menggerakkan (detail)**, dan **Perspektif Pakar Analis Global**. |
| **Pusat Belajar** (`/learn`) | Panduan memahami data makro + penjelasan lengkap **cara membaca** & **prospek ke depan** tiap indikator. |
| **Ekonomi Global** (`/economy`) | Profil tiap negara: inflasi, pengangguran, suku bunga, pertumbuhan. |
| **API** (`/api/fred/[id]`) | Endpoint JSON per indikator (live FRED + fallback seed). |

> 💡 **Roadmap ide pengembangan** (dari tampilan, data akurat, hingga fitur AI/komunitas) tersedia
> di [`IDEAS.md`](./IDEAS.md).

### 🔑 Aktifkan Copilot LLM (opsional)
Copilot otomatis memakai LLM bila salah satu variabel env di-set (tanpa key, tetap berjalan
pakai engine rule-based):
```bash
# .env.local
OPENAI_API_KEY=sk-...        # atau
GEMINI_API_KEY=...           # atau
ANTHROPIC_API_KEY=...
```
Setiap jawaban LLM menyuntikkan data MacroLab (sinyal teknikal, currency strength, risk bias,
VIX, jadwal rilis) ke dalam prompt sehingga konteksnya nyata, bukan generalisasi.

### 🧭 Fitur Baru (v3.x)
- **Sidebar Navigation**: tombol navigasi header dipindah ke sidebar kiri (drawer di mobile) untuk
  tampilan yang lebih rapi.
- **Command Center Home**: Risk Appetite gauge (VIX + bias mata uang), sesi pasar live, currency
  strength meter (13 mata uang), dan top movers — semuanya hidup dari data live/fallback.
- **Analisis Teknikal** (`/technicals`): matriks sinyal multi-timeframe + skor confluence + grade
  setup + Market Regime.
- **Analisis Fundamental** (`/fundamentals`): bias fundamental per mata uang + scenario planner &
  cheat sheet rilis penting.
- **Copilot AI** (`/copilot`): asisten berbasis data MacroLab.
- **Watchlist & Alerts** (`/watchlist`): pantau instrumen + price alert (notifikasi & bunyi).
- **Kalkulator Trader** (`/calculators`): position size, pip value, profit/loss, pivot & Fibonacci.
- **Dark/Light toggle** di header.
- **Fallback data otomatis**: jika penyedia live (FRED/Yahoo/ForexFactory) tak terjangkau, aplikasi
  otomatis memakai data cadangan yang jelas ditandai (tidak pernah blank).

### 🎨 Tema, Responsivitas & Animasi
- **Tema** Dark netral (`#0a0f0c`) dengan aksen **Green Lime** (`#a3e635`).
- **Responsivitas penuh**: layout menyesuaikan desktop, tablet, dan ponsel (breakpoint 900px & 640px).
  Navigasi menjadi baris tab yang bisa digulir di ponsel; tabel dibungkus `.table-scroll` agar bisa
  digulir horizontal, sehingga angka tetap terbaca di layar kecil.
- **Animasi menarik**:
  - **CountUp** — nilai naik dari 0 ke angka sebenarnya saat terlihat (`components/CountUp.jsx`).
  - **Reveal / stagger** — kartu & seksi muncul berurutan ketika di-scroll (`.reveal`, `.reveal-stagger`, `.section-fade`).
  - **Grafik & sparkline menggambar** (draw-line) saat dimuat, plus tooltip pop-in saat hover.
  - **Hover** — kartu terangkat (lift), tombol & badge beranimasi; logo mengambang; dot live berdenyut.
  - **`prefers-reduced-motion`** — animasi otomatis dimatikan bagi pengguna yang memilih mengurangi gerakan.

### 📊 Fitur Analisis (Konsensus vs Actual + Akurasi)
- Nilai **actual & previous** ditarik otomatis dari FRED.
- Nilai **konsensus** diambil dari **penyedia live** (`lib/provider.js`, ForexFactory/Fair Economy) bila
  dapat dijangkau, dengan **negative cache**; jika tidak, memakai **fallback lokal** (`data/releases.js`).
- Setiap rilis dihitung **surprise** (`actual − konsensus`) & **deviasi %**.
- **Metrik kinerja/akurasi** per indikator: *Akurasi Konsensus*, *Akurasi Arah*, *Bias Surprise*, *Deviasi rata-rata*.
- **Mesin dampak** (`lib/pairs.js`) memetakan surprise ke **14 pasangan** (majors + cross + komoditas)
  → **arah** (Bullish/Bearish/Netral) + **kekuatan** (Ringan→Ekstrem).

---

## 🧭 Sumber Data & Rekomendasi

Sistem memakai **beberapa sumber**:

1. **FRED (Federal Reserve Economic Data)** — `https://fred.stlouisfed.org/graph/fredgraph.csv?id=SERIES`.
   - **Kelebihan**: gratis, tanpa API key, data resmi (CPI, PPI, Nonfarm, dll.). **Sumber utama** untuk nilai aktual & historis.
   - **Keterbatasan**: beberapa seri non-AS (mis. Jepang, sebagian UK/China) sering tertinggal di endpoint publik.

2. **ForexFactory / Fair Economy Media** — `https://cdn-nfs.faireconomy.media/ff_calendar_thisweek.json`.
   - Konsensus **gratis** (actual + forecast + previous + dampak) untuk banyak negara. Sumber **konsensus** yang direkomendasikan.
   - **Catatan**: host ini dapat diblokir di jaringan/sandbox tertentu; maka disertai fallback lokal.

> **Rekomendasi untuk produksi dengan akurasi & cakupan penuh:** gunakan API berbayar seperti
> **TradingEconomics** (actual + konsensus + riwayat) atau **FRED API** resmi dengan key. Ganti
> `lib/provider.js` agar membaca dari penyedia tersebut — sisanya otomatis menyesuaikan.

---

## 🚀 Menjalankan

```bash
npm install
npm run fetch      # ambil data terbaru dari FRED → data/seed.json
npm run dev        # server pengembangan di http://localhost:3000
# atau untuk produksi:
npm run build && npm run start
```

> **Catatan untuk preview sandbox**: server di-bind ke `0.0.0.0`. Data indikator dibaca dari
> `data/seed.json` bila FRED tidak terhubung; konsensus otomatis jatuh ke demo bila penyedia live tidak terjangkau.

---

## 📁 Struktur Proyek

```
fx-macro-dashboard/
├── app/
│   ├── layout.jsx          # Layout + metadata
│   ├── page.jsx           # Halaman overview
│   ├── globals.css        # Tema dark + lime + responsivitas + animasi
│   ├── analysis/page.jsx  # Konsensus vs actual + dampak pair
│   ├── learn/page.jsx     # Pusat belajar data makro
│   ├── calendar/page.jsx  # Kalender ekonomi
│   ├── indicators/
│   │   ├── page.jsx       # Daftar indikator
│   │   └── [id]/page.jsx  # Detail + grafik + edukasi
│   ├── economy/page.jsx   # Ringkasan global
│   └── api/fred/[id]/route.js  # API JSON
├── components/            # Chart, Badge, StatCard, Sparkline, CountUp, CalendarClient, AnalysisClient
├── lib/
│   ├── fred.js            # Fetcher & transformasi seri
│   ├── data.js            # Loader (live FRED → fallback seed)
│   ├── series.js          # Definisi 23 indikator
│   ├── consensus.js       # Gabung konsensus vs actual + metrik akurasi
│   ├── pairs.js           # 14 pasangan & perhitungan dampak (arah+kekuatan)
│   ├── provider.js        # Integrasi penyedia konsensus nyata + fallback
│   ├── education.js       # Konten edukasi & prospek per indikator
│   ├── cache.js           # Cache TTL in-memory
│   └── format.js          # Utilitas format angka
├── data/
│   ├── seed.json          # Cache data (hasil skrip fetch)
│   ├── releases.js        # Estimasi konsensus (fallback demo)
│   ├── calendar.js        # Jadwal event ekonomi
│   └── schema.sql         # Skema database relasional
└── scripts/
    └── fetch-all.mjs      # Pengumpul data FRED → seed.json
```

---

## 💾 Struktur Database (`data/schema.sql`)

Dashboard kini berjalan di atas JSON + FRED live, tetapi `schema.sql` menyediakan skema relasional
siap pakai (`categories`, `countries`, `indicators`, `observations`, `releases`, `assets`,
`asset_indicator`) bila Anda ingin menyimpan data sendiri dan mengelola lewat admin panel.
Anda dapat menjalankannya di PostgreSQL/SQLite dan mengadaptasi `lib/data.js` untuk membaca dari DB.

---

## 📊 Indikator yang Dilacak (23)

**Amerika Serikat:** NFP, Unemployment Rate, CPI, Core CPI, PPI, Average Hourly Earnings, Fed Funds
Target Rate, 10-Year Treasury Yield, Retail Sales, Michigan Consumer Sentiment, Industrial Production,
Real GDP, Initial Jobless Claims, Capacity Utilization.

**Zona Euro:** HICP Inflation, Unemployment Rate, Real GDP.

**Inggris:** CPI, Unemployment Rate. **Jepang:** CPI. **Tiongkok:** CPI.

**Global:** WTI Crude Oil, VIX Volatility Index.

---

## ⚖️ Catatan & Disclaimer

- Jadwal rilis dapat berubah sewaktu-waktu (hari libur, *shutdown* pemerintah). Selalu verifikasi ke sumber resmi.
- Data FRED untuk sebagian seri non-AS dapat tertinggal; hal ini sudah ditandai di UI (tanggal data terakhir).
- Nilai indikator adalah data historis, bukan sinyal investasi. Lakukan riset sendiri sebelum mengambil keputusan.
