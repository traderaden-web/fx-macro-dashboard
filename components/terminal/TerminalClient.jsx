// components/terminal/TerminalClient.jsx
// ═════════════════════════════════════════════════════════════════════════
// TERMINAL — halaman gabungan (Teknikal + Screener + Chart) dalam SATU layar:
//
//   #sinyal    Sinyal & Trade Plan TERUKUR (Entry · SL · TP1/2/3 · R:R)
//              + snapshot fundamental + News Event per aset
//   #konteks   COT institusional · Sesi pasar live · Kalender high-impact
//   #chart     Chart TradingView live (sinkron timeframe analisis)
//   #struktur  SMC (BOS/CHoCH, OB, FVG, sweep) · ICT (premium/discount, OTE,
//              killzone) · SNR · BREAKOUT (range + retest)
//   #pola      Chart pattern klasik (bullish & bearish) + pola candlestick
//   #mtf       Matriks 7 timeframe penuh untuk simbol terpilih
//   #screener  Matriks sinyal semua instrumen + pola screener (klik = fokus)
//
// Server data: /api/terminal (detail), /api/technicals (matriks semua),
// /api/patterns (scan pola). Semua interaktif — ganti simbol/timeframe dari
// mana saja mengubah seluruh halaman.
// ═════════════════════════════════════════════════════════════════════════

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import TradingViewWidget from "../TradingViewWidget";
import FundamentalsCard from "../FundamentalsCard";
import NewsModal from "../NewsModal";
import { CotPanel, SessionPanel, CalendarPanel } from "../TerminalPanels";
import { IconChart, IconLightbulb } from "../Icons";
import { cotForAsset } from "../../lib/cotData";
import { filterAssetNews } from "../../lib/assetNews";
import TradePlanCard from "./TradePlanCard";
import StructureCards from "./StructureCards";
import PatternCards from "./PatternCards";
import MtfMatrix from "./MtfMatrix";
import ScreenerSection from "./ScreenerSection";
import SignalChart from "./SignalChart";
import { TV_INTERVAL, TF_LABEL, TF_SHORT } from "./fmt";

export const SYMBOLS = [
  { id: "gold", label: "Gold", tv: "TVC:GOLD", desc: "Emas spot (XAU/USD)" },
  { id: "silver", label: "Silver", tv: "TVC:SILVER", desc: "Perak spot (XAG/USD)" },
  { id: "wti", label: "Minyak WTI", tv: "TVC:USOIL", desc: "Minyak mentah AS" },
  { id: "eurusd", label: "EUR/USD", tv: "FX:EURUSD", desc: "Major pair" },
  { id: "gbpusd", label: "GBP/USD", tv: "FX:GBPUSD", desc: "Major pair" },
  { id: "usdjpy", label: "USD/JPY", tv: "FX:USDJPY", desc: "Major pair" },
  { id: "usdchf", label: "USD/CHF", tv: "FX:USDCHF", desc: "Major pair · safe-haven" },
  { id: "audusd", label: "AUD/USD", tv: "FX:AUDUSD", desc: "Major pair" },
  { id: "usdcad", label: "USD/CAD", tv: "FX:USDCAD", desc: "Major pair" },
  { id: "nzdusd", label: "NZD/USD", tv: "FX:NZDUSD", desc: "Major pair" },
  { id: "dxy", label: "DXY", tv: "TVC:DXY", desc: "Dollar Index — kekuatan USD" },
];

const ALL_TFS = ["15m", "30m", "1h", "4h", "1d", "1w", "1mo"];
const BASE_CHART = {
  autosize: true, timezone: "Asia/Jakarta", theme: "dark", style: "1",
  locale: "en", allow_symbol_change: true, save_image: false,
  support_host: "https://www.tradingview.com",
};

const NAV = [
  { id: "sinyal", label: "🎯 Sinyal & Plan", alt: "Sinyal" },
  { id: "chart", label: "📈 Chart", alt: "Chart" },
  { id: "struktur", label: "🏗️ SMC·ICT·SNR", alt: "Struktur" },
  { id: "pola", label: "📐 Pattern", alt: "Pola" },
  { id: "mtf", label: "🕐 Multi-Timeframe", alt: "Multi-TF" },
  { id: "screener", label: "🔍 Screener", alt: "Screener" },
];

function timeAgo(iso) {
  if (!iso) return "";
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.round(h / 24)} hari lalu`;
}

export default function TerminalClient({ news = [], upcoming = [] }) {
  const [symbolId, setSymbolId] = useState("gold");
  const [tf, setTf] = useState("1h");
  const [data, setData] = useState(null);        // /api/terminal
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [techRows, setTechRows] = useState([]);  // /api/technicals
  const [techLoading, setTechLoading] = useState(true);
  const [patternData, setPatternData] = useState(null); // /api/patterns
  const [modalNews, setModalNews] = useState(null);
  const [activeNav, setActiveNav] = useState("sinyal");
  const [chartView, setChartView] = useState("signal"); // "signal" | "tv"
  const topRef = useRef(null);

  const symbol = SYMBOLS.find((s) => s.id === symbolId) || SYMBOLS[0];

  // Deep-link ?sym= & ?tf= (kompatibel tautan lama /charts?sym=gold)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const sym = p.get("sym");
    const t = p.get("tf");
    if (sym && SYMBOLS.some((s) => s.id === sym.toLowerCase())) setSymbolId(sym.toLowerCase());
    if (t && ALL_TFS.includes(t)) setTf(t);
  }, []);

  // Sinkronkan URL (shareable) tanpa reload
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("sym", symbolId);
    url.searchParams.set("tf", tf);
    window.history.replaceState(null, "", url);
  }, [symbolId, tf]);

  // ── Data utama: /api/terminal ────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    async function load(initial) {
      // Ganti simbol/TF → kosongkan data agar tidak menampilkan analisis basi
      // dari instrumen sebelumnya. Refresh polling mempertahankan data.
      if (initial) { setData(null); setLoading(true); setError(null); }
      try {
        const res = await fetch(`/api/terminal?symbol=${symbolId}&tf=${tf}`, { cache: "no-store" });
        const j = await res.json();
        if (!alive) return;
        if (j?.ok) { setData(j); setError(null); }
        else setError(j?.error || "Gagal memuat analisis terminal");
      } catch {
        if (alive) setError("Gagal terhubung ke server analisis");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load(true);
    const id = setInterval(() => load(false), 5 * 60 * 1000);
    return () => { alive = false; clearInterval(id); };
  }, [symbolId, tf]);

  // ── Matriks semua instrumen: /api/technicals ────────────────────────────
  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch("/api/technicals", { cache: "no-store" });
        const d = await res.json();
        if (alive && d?.rows) setTechRows(d.rows);
      } finally {
        if (alive) setTechLoading(false);
      }
    }
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  // ── Scan pola candlestick semua instrumen: /api/patterns (4 TF sekaligus) ──
  useEffect(() => {
    let alive = true;
    fetch("/api/patterns", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (alive && d?.instruments) setPatternData(d); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  // Subnav aktif mengikuti posisi scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => { if (en.isIntersecting) setActiveNav(en.target.id); });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const cot = useMemo(() => cotForAsset(symbolId), [symbolId]);
  const assetNews = useMemo(() => filterAssetNews(news, symbolId, { n: 6, min: 4 }), [news, symbolId]);

  const pickSymbol = (id) => {
    setSymbolId(id);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const dataTf = data?.tf || tf;

  return (
    <div className="page terminal" ref={topRef}>
      {/* ══ HERO + PICKER ══ */}
      <header className="detail-head terminal-hero">
        <div className="detail-title-row">
          <span className="brand-mark" style={{ width: 42, height: 42 }}>TM</span>
          <div>
            <h1 className="terminal-title">
              Terminal <span style={{ color: "var(--accent)" }}>Teknikal Pro</span>
            </h1>
            <p className="cell-muted" style={{ margin: 0, maxWidth: 860 }}>
              Satu halaman untuk semua analisis: <b>sinyal terukur</b> (Entry · SL · TP1/2/3 · R:R),
              struktur <b>SMC &amp; ICT</b>, <b>SNR</b>, <b>breakout</b>, <b>chart pattern</b> bullish/bearish,
              sampai <b>screener 11 instrumen × 7 timeframe</b>. Pilih instrumen &amp; timeframe —
              seluruh halaman ikut menyesuaikan.
            </p>
          </div>
        </div>

        <div className="sym-picker hero-picker terminal-picker" role="tablist" aria-label="Pilih instrumen">
          {SYMBOLS.map((s) => (
            <button key={s.id} role="tab" aria-selected={symbolId === s.id}
              className={`sym-pill ${symbolId === s.id ? "active" : ""}`}
              onClick={() => setSymbolId(s.id)} title={s.desc}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="terminal-tfrow" role="tablist" aria-label="Pilih timeframe analisis">
          <span className="terminal-tflabel">Timeframe:</span>
          {ALL_TFS.map((t) => (
            <button key={t} role="tab" aria-selected={tf === t}
              className={`tf-pill ${tf === t ? "active" : ""}`}
              onClick={() => setTf(t)}>
              {TF_SHORT[t]}
            </button>
          ))}
          <span className="cell-muted terminal-updated">
            {data?.updated ? `Update ${new Date(data.updated).toLocaleTimeString("id-ID")}` : loading ? "Memuat…" : ""}
            {error && <b className="down"> · {error}</b>}
          </span>
        </div>

        <div className="tags">
          <span className="badge cat">EMA · RSI · MACD · ATR</span>
          <span className="badge cat">SMC — BOS/CHoCH · OB · FVG</span>
          <span className="badge cat">ICT — Premium/Discount · OTE · Killzone</span>
          <span className="badge cat">SNR · Breakout</span>
          <span className="badge cat">Chart Pattern Bullish &amp; Bearish</span>
        </div>
      </header>

      {/* ══ SUBNAV sticky ══ */}
      <nav className="term-nav" aria-label="Navigasi seksi terminal">
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`}
            className={`term-nav-chip ${activeNav === n.id ? "active" : ""}`}
            title={n.alt}>
            {n.label}
          </a>
        ))}
      </nav>

      {/* ══ SEKSI 1: SINYAL & TRADE PLAN ══ */}
      <section id="sinyal" className="terminal-sec">
        <div className="sig-fund-news-grid tpl-grid">
          <TradePlanCard data={data} tf={tf} onTf={setTf} loading={loading} />

          <FundamentalsCard assetId={symbol.id} assetLabel={symbol.desc} />

          <article className="term-card news-card">
            <header className="term-head">
              <h3 className="term-title">
                <span className="term-ico" aria-hidden="true">📰</span>
                News Event <span className="term-sub">· {symbol.label}</span>
              </h3>
              <Link href="/news" className="see-all">Semua →</Link>
            </header>
            <div className="term-body news-body">
              {assetNews.length > 0 ? (
                <ul className="topnews-list compact">
                  {assetNews.map((n, i) => (
                    <li key={`${n.link}-${i}`}>
                      <div
                        className="topnews-item clickable" role="button" tabIndex={0}
                        onClick={() => setModalNews(n)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setModalNews(n)}
                      >
                        <span className="topnews-title">
                          {n.impact?.level === "kritis" && <span className="impact-badge kritis" title={`Topik: ${(n.impact.tags || []).join(", ")}`}>🔥</span>}
                          {n.impact?.level === "tinggi" && <span className="impact-badge tinggi" title={`Topik: ${(n.impact.tags || []).join(", ")}`}>⚡</span>}
                          {n.title}
                          <a className="news-ext" href={n.link} target="_blank" rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()} title="Buka di situs sumber">↗</a>
                        </span>
                        <span className="topnews-meta">
                          {n.source} · {timeAgo(n.iso)}
                          {n.impact?.tags?.length ? ` · ${n.impact.tags.slice(0, 3).join(", ")}` : ""}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="sess-loading">Belum ada berita untuk aset ini — coba lagi sebentar lagi.</p>
              )}
            </div>
          </article>
        </div>

        <div className="term-grid" id="konteks">
          <CotPanel cot={cot} />
          <SessionPanel />
          <CalendarPanel events={upcoming} />
        </div>
      </section>

      {/* ══ SEKSI 2: CHART LIVE — sinyal & metode divisualisasikan di chart ══ */}
      <section id="chart" className="terminal-sec">
        <div className="card chart-card sig-chart-card reveal">
          <div className="tv-chart-head sig-chart-head">
            <div className="tv-chart-id">
              <span className="tv-chart-title">
                <span className="inline-ico" aria-hidden="true"><IconChart size={18} /></span>
                {symbol.desc}
                <span className="tv-chart-sub sig-tf-pill">· {TF_LABEL[tf]}</span>
              </span>
              <span className="tv-chart-sub">
                {chartView === "signal"
                  ? "Chart live dengan level sinyal digambar otomatis — Entry · SL · TP, zona Order Block & FVG, S/R, Premium/Diskon"
                  : "Chart TradingView penuh — indikator, alat gambar & studi komunitas bebas dipakai"}
              </span>
            </div>
            <div className="sig-chart-live">
              <span className="pulse-dot" style={{ width: 6, height: 6 }} />
              {chartView === "signal" ? "Live · auto-refresh 45 dtk" : "TradingView · Live"}
            </div>
          </div>

          {/* Picker tampilan chart */}
          <div className="sig-view-tabs" role="tablist" aria-label="Pilih tampilan chart">
            <button
              role="tab" aria-selected={chartView === "signal"}
              className={`sig-view-tab ${chartView === "signal" ? "active" : ""}`}
              onClick={() => setChartView("signal")}
              title="Chart live dengan level Entry/SL/TP & zona SMC-ICT digambar otomatis"
            >
              🎯 Chart Sinyal
              <small>Entry · SL · TP · OB · FVG · S/R</small>
            </button>
            <button
              role="tab" aria-selected={chartView === "tv"}
              className={`sig-view-tab ${chartView === "tv" ? "active" : ""}`}
              onClick={() => setChartView("tv")}
              title="Chart lengkap TradingView — indikator & drawing manual"
            >
              📈 TradingView
              <small>Chart penuh · studi &amp; alat gambar</small>
            </button>
          </div>

          <TradingViewWidget
            type="ticker-tape" minHeight={0}
            config={{
              symbols: SYMBOLS.map((s) => [s.tv]), showSymbolLogo: true,
              colorTheme: "dark", isTransparent: true, displayMode: "adaptive", locale: "en",
            }}
          />

          {chartView === "signal" ? (
            <SignalChart symbolId={symbolId} tf={tf} symbolLabel={symbol.label} />
          ) : (
            <div className="sig-tv-wrap">
              <TradingViewWidget
                type="advanced-chart" className="tv-chart-main" height="none"
                config={{ ...BASE_CHART, symbol: symbol.tv, interval: TV_INTERVAL[tf] }}
              />
              <div className="chart-hints sig-tv-hints">
                <span className="chart-hint">
                  <span className="inline-ico" aria-hidden="true"><IconLightbulb size={13} /></span>
                  <span>
                    Tandai manual level dari kartu Sinyal &amp; SMC — <b>Entry, SL/TP, Order Block, FVG</b> —
                    pakai alat garis/kotak di toolbar chart TradingView.
                  </span>
                </span>
                <a
                  className="btn btn-ghost btn-sm chart-open-tv"
                  href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol.tv)}&interval=${TV_INTERVAL[tf]}`}
                  target="_blank" rel="noopener noreferrer"
                  title="Buka chart penuh TradingView (studi komunitas SMC, order block, FVG)"
                >
                  Bukа penuh di TradingView ↗
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══ SEKSI 3: STRUKTUR (SMC / ICT / SNR / BREAKOUT) ══ */}
      <section id="struktur" className="section terminal-sec">
        <div className="section-head">
          <h2>Struktur Pasar — SMC · ICT · SNR · Breakout</h2>
          <span className="cell-muted">{symbol.desc} · {TF_LABEL[dataTf] || dataTf}</span>
        </div>
        <StructureCards data={data} tf={dataTf} loading={loading} />
      </section>

      {/* ══ SEKSI 4: POLA ══ */}
      <section id="pola" className="section terminal-sec">
        <div className="section-head">
          <h2>Chart Pattern &amp; Pola Candlestick</h2>
          <span className="cell-muted">Bullish &amp; bearish · target terukur</span>
        </div>
        <PatternCards data={data} patternData={patternData} tf={dataTf} loading={loading} />
      </section>

      {/* ══ SEKSI 5: MATRIKS MULTI-TIMEFRAME ══ */}
      <section id="mtf" className="section terminal-sec">
        <div className="section-head">
          <h2>Matriks 7 Timeframe — {symbol.desc}</h2>
          <span className="cell-muted">Sinyal · struktur · pola · plan mini per TF — klik untuk pindah TF</span>
        </div>
        <MtfMatrix
          matrix={data?.matrix}
          activeTf={tf}
          onSelect={setTf}
          symbolId={symbolId}
          loading={loading}
        />
      </section>

      {/* ══ SEKSI 6: SCREENER ══ */}
      <section id="screener" className="section terminal-sec">
        <div className="section-head">
          <h2>Screener — Semua Instrumen</h2>
          <span className="cell-muted">Matriks sinyal + pola · klik Analisis untuk memfokuskan Terminal</span>
        </div>
        <ScreenerSection
          techRows={techRows}
          techLoading={techLoading}
          patternData={patternData}
          tf={tf}
          activeSymbol={symbolId}
          onPickSymbol={pickSymbol}
        />
      </section>

      <footer className="terminal-foot cell-muted">
        <p>
          <b>Disclaimers:</b> seluruh sinyal, level SL/TP, struktur SMC/ICT, dan pola dihasilkan secara
          otomatis dari data harga (EMA 20/50, RSI 14, MACD, ATR 14 + analisis struktur) untuk tujuan
          edukasi — <b>bukan nasihat keuangan</b>. Pasang risiko per trade maksimal 1–2% dan selalu
          konfirmasi dengan manajemen risiko pribadi.
        </p>
      </footer>

      {modalNews && <NewsModal item={modalNews} onClose={() => setModalNews(null)} />}
    </div>
  );
}
