// components/ChartsClient.jsx
// /charts — "Pro Terminal" Gold, Forex & Komoditas:
//  1. Hero ringkas + meta sumber data
//  2. GRID TERMINAL: [COT + Long/Short] [Sesi Pasar live] [Kalender High Impact]
//  3. Kartu chart besar (ticker tape + picker simbol + chart TradingView live)
//  4. News Event — berita yang paling menggerakkan aset terpilih

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import TradingViewWidget from "./TradingViewWidget";
import SignalPanel from "./SignalPanel";
import { CotPanel, SessionPanel, CalendarPanel } from "./TerminalPanels";
import { IconChart, IconLightbulb } from "./Icons";
import { cotForAsset } from "../lib/cotData";
import { filterAssetNews } from "../lib/assetNews";

// Simbol yang dipantau. `tv` = simbol TradingView untuk embed.
const SYMBOLS = [
  { id: "gold", label: "Gold (XAU/USD)", tv: "TVC:GOLD", desc: "Emas spot" },
  { id: "silver", label: "Silver (XAG/USD)", tv: "TVC:SILVER", desc: "Perak spot" },
  { id: "wti", label: "Minyak WTI", tv: "TVC:USOIL", desc: "Minyak mentah AS" },
  { id: "eurusd", label: "EUR/USD", tv: "FX:EURUSD", desc: "Major pair" },
  { id: "gbpusd", label: "GBP/USD", tv: "FX:GBPUSD", desc: "Major pair" },
  { id: "usdjpy", label: "USD/JPY", tv: "FX:USDJPY", desc: "Major pair" },
  { id: "audusd", label: "AUD/USD", tv: "FX:AUDUSD", desc: "Major pair" },
  { id: "usdcad", label: "USD/CAD", tv: "FX:USDCAD", desc: "Major pair" },
  { id: "nzdusd", label: "NZD/USD", tv: "FX:NZDUSD", desc: "Major pair" },
  { id: "dxy", label: "Dollar Index", tv: "TVC:DXY", desc: "DXY — kekuatan USD" },
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

const BASE_CHART = {
  autosize: true,
  timezone: "Asia/Jakarta",
  theme: "dark",
  style: "1",
  locale: "en",
  allow_symbol_change: true,
  save_image: false,
  support_host: "https://www.tradingview.com",
};

// TF sinyal → interval TradingView
const TF_INTERVAL = {
  "15m": "15",
  "30m": "30",
  "1h": "60",
  "4h": "240",
  "1d": "D",
  "1w": "W",
  "1mo": "1M",
};

export default function ChartsClient({ news = [], upcoming = [] }) {
  const [active, setActive] = useState(SYMBOLS[0]);
  const [tf, setTf] = useState("1h"); // timeframe sinyal + chart (sync)

  const cot = useMemo(() => cotForAsset(active.id), [active]);
  const assetNews = useMemo(
    () => filterAssetNews(news, active.id, { n: 6, min: 4 }),
    [news, active]
  );

  return (
    <>
      <section className="hero">
        <h1>
          Pro Terminal <span style={{ color: "var(--accent)" }}>Gold, Forex &amp; Komoditas</span>
        </h1>
        <p>
          Terminal pro: positioning institusional (CFTC COT), sesi pasar live, kalender
          High-impact, chart TradingView, dan News Event — semua menyesuaikan aset yang kamu pilih.
        </p>
        <div className="hero-meta">
          <span>Chart: TradingView (live)</span>
          <span>Positioning: CFTC COT (mingguan)</span>
          <span>Zona waktu: Asia/Jakarta (WIB)</span>
        </div>
      </section>

      {/* ── GRID TERMINAL: COT | SESI | KALENDER ── */}
      <div className="term-grid">
        <CotPanel cot={cot} />
        <SessionPanel />
        <CalendarPanel events={upcoming} />
      </div>

      {/* ── SIGNAL: Long/Short per timeframe (sync dengan interval chart) ── */}
      <SignalPanel symbol={active} tf={tf} onTf={setTf} />

      {/* ── CHART UTAMA ── */}
      <div className="card chart-card reveal">
        <div className="tv-chart-head">
          <div className="tv-chart-id">
            <span className="tv-chart-title">
              <span className="inline-ico" aria-hidden="true"><IconChart size={18} /></span>
              {active.label}
            </span>
            <span className="tv-chart-sub">{active.desc} · timeframe &amp; indikator bebas diubah di dalam chart</span>
          </div>
          <span className="tv-chart-tv">
            <span className="pulse-dot" style={{ width: 6, height: 6 }} /> TradingView · Live
          </span>
        </div>

        <TradingViewWidget
          type="ticker-tape"
          minHeight={0}
          config={{
            symbols: SYMBOLS.map((s) => [s.tv]),
            showSymbolLogo: true,
            colorTheme: "dark",
            isTransparent: true,
            displayMode: "adaptive",
            locale: "en",
          }}
        />

        <div className="chart-card-strip">
          <div className="sym-picker" role="tablist" aria-label="Pilih simbol chart">
            {SYMBOLS.map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={active.id === s.id}
                className={`sym-pill ${active.id === s.id ? "active" : ""}`}
                onClick={() => setActive(s)}
                title={s.desc}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="chart-hints">
          <span className="chart-hint">
            <span className="inline-ico" aria-hidden="true"><IconLightbulb size={13} /></span>
            <span>
              Tambah indikator: klik <b>Indicators (fx)</b> di toolbar chart — RSI, MA, Bollinger,{" "}
              <b>Pivot Points (level S/R)</b>, Fibonacci, dll.
            </span>
          </span>
          <a
            className="btn btn-ghost btn-sm chart-open-tv"
            href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(active.tv)}&interval=D`}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka chart full TradingView untuk indikator komunitas (SMC, SNR, Order Blocks, FVG)"
          >
            SMC / SNR &amp; studi komunitas → buka di TradingView ↗
          </a>
        </div>

        <TradingViewWidget
          type="advanced-chart"
          className="tv-chart-main"
          height="none"
          config={{ ...BASE_CHART, symbol: active.tv, interval: TF_INTERVAL[tf] }}
        />
      </div>

      {/* ── NEWS EVENT: berita yang menggerakkan aset terpilih ── */}
      {assetNews.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>
              <span className="tip" data-tip="Berita difilter per aset (keyword + skor dampak) dan diurutkan dari yang paling berdampak. Sumber: Google News + TradingView News.">
                News Event — {active.label}
              </span>
            </h2>
            <Link href="/news" className="see-all">Semua berita →</Link>
          </div>
          <div className="card">
            <ul className="topnews-list">
              {assetNews.map((n, i) => (
                <li key={`${n.link}-${i}`}>
                  <a href={n.link} target="_blank" rel="noopener noreferrer" className="topnews-item">
                    <span className="topnews-title">
                      {n.impact?.level === "kritis" && (
                        <span className="impact-badge kritis" title={`Topik: ${(n.impact.tags || []).join(", ")}`}>🔥</span>
                      )}
                      {n.impact?.level === "tinggi" && (
                        <span className="impact-badge tinggi" title={`Topik: ${(n.impact.tags || []).join(", ")}`}>⚡</span>
                      )}
                      {n.title}
                    </span>
                    <span className="topnews-meta">
                      {n.source} · {timeAgo(n.iso)}
                      {n.impact?.tags?.length ? ` · ${n.impact.tags.slice(0, 3).join(", ")}` : ""}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
