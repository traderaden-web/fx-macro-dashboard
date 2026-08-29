// components/ChartsClient.jsx
// Halaman Chart Gold, Forex & Komoditas — layout rapi:
//  1. Hero ringkas + meta sumber data
//  2. SATU kartu chart besar: head (simbol aktif) → ticker tape → picker simbol → chart utama
//  3. Strip berita berdampak tinggi untuk Gold/Forex/Komoditas

"use client";

import { useState } from "react";
import Link from "next/link";
import TradingViewWidget from "./TradingViewWidget";
import { IconChart, IconLightbulb } from "./Icons";

// Simbol yang dipantau. `tv` = simbol TradingView untuk embed.
const SYMBOLS = [
  { id: "gold", label: "Gold (XAU/USD)", tv: "TVC:GOLD", desc: "Emas spot" },
  { id: "gold-fut", label: "Gold Futures", tv: "COMEX:GC1!", desc: "Kontrak depan COMEX" },
  { id: "silver", label: "Silver (XAG/USD)", tv: "TVC:SILVER", desc: "Perak spot" },
  { id: "wti", label: "Minyak WTI", tv: "TVC:USOIL", desc: "Minyak mentah AS" },
  { id: "brent", label: "Minyak Brent", tv: "TVC:UKOIL", desc: "Minyak mentah global" },
  { id: "natgas", label: "Natural Gas", tv: "TVC:NATGAS", desc: "Henry Hub" },
  { id: "copper", label: "Tembaga", tv: "COMEX:HG1!", desc: "COMEX front month" },
  { id: "dxy", label: "Dollar Index", tv: "TVC:DXY", desc: "DXY — kekuatan USD" },
  { id: "eurusd", label: "EUR/USD", tv: "FX:EURUSD", desc: "Pair mayor" },
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
  interval: "D",
  timezone: "Asia/Jakarta",
  theme: "dark",
  style: "1",
  locale: "en",
  allow_symbol_change: true,
  save_image: false,
  support_host: "https://www.tradingview.com",
};

export default function ChartsClient({ news = [] }) {
  const [active, setActive] = useState(SYMBOLS[0]);

  return (
    <>
      <section className="hero">
        <h1>
          Chart <span style={{ color: "var(--accent)" }}>Gold, Forex &amp; Komoditas</span>
        </h1>
        <p>
          Chart interaktif langsung dari TradingView — pilih simbol, ubah timeframe, pasang
          indikator apa pun. Harga di ticker dan chart ter-update otomatis di browser kamu.
        </p>
        <div className="hero-meta">
          <span>Sumber data: TradingView</span>
          <span>Zona waktu: Asia/Jakarta (WIB)</span>
          <span>Interval default: harian</span>
        </div>
      </section>

      {/* SATU kartu besar: head + ticker + picker + chart utama */}
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
          config={{ ...BASE_CHART, symbol: active.tv }}
        />
      </div>

      {news.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>
              <span className="tip" data-tip="Berita diurutkan berdasarkan skor dampak otomatis terhadap pasar Forex, Gold, & Komoditas (Fed, inflasi, minyak, emas, dsb).">
                Berita Dampak Tinggi: Gold &amp; Komoditas
              </span>
            </h2>
            <Link href="/news" className="see-all">Semua berita →</Link>
          </div>
          <div className="card">
            <ul className="topnews-list">
              {news.map((n) => (
                <li key={n.id}>
                  <a href={n.link} target="_blank" rel="noopener noreferrer" className="topnews-item">
                    <span className="topnews-title">
                      {n.impact?.level === "kritis" && <span className="impact-badge kritis" title={`Topik: ${n.impact.tags.join(", ")}`}>🔥</span>}
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
