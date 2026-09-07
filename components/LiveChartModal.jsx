// components/LiveChartModal.jsx
// Popup chart TradingView yang dapat dipakai dari tabel Teknikal maupun Screener.

"use client";

import { useEffect } from "react";
import TradingViewWidget from "./TradingViewWidget";
import { IconChart } from "./Icons";

const TV_SYMBOLS = {
  gold: "TVC:GOLD",
  silver: "TVC:SILVER",
  wti: "TVC:USOIL",
  eurusd: "FX:EURUSD",
  gbpusd: "FX:GBPUSD",
  usdjpy: "FX:USDJPY",
  usdchf: "FX:USDCHF",
  audusd: "FX:AUDUSD",
  usdcad: "FX:USDCAD",
  nzdusd: "FX:NZDUSD",
  dxy: "TVC:DXY",
};

const INTERVALS = {
  "1m": "1",
  "5m": "5",
  "15m": "15",
  "30m": "30",
  "1h": "60",
  "4h": "240",
  "1d": "D",
  "1w": "W",
  "1mo": "1M",
};

export function tradingViewSymbol(id) {
  return TV_SYMBOLS[id] || "FX:EURUSD";
}

/**
 * Chart live dalam dialog. Klik latar, tombol tutup, atau Escape untuk keluar.
 */
export default function LiveChartModal({ instrument, timeframe = "1h", onClose }) {
  const symbol = tradingViewSymbol(instrument?.id);
  const interval = INTERVALS[timeframe] || "60";

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  if (!instrument) return null;

  return (
    <div className="live-chart-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose?.();
    }}>
      <section
        className="live-chart-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="live-chart-title"
      >
        <header className="live-chart-head">
          <div>
            <span className="live-chart-kicker"><span className="pulse-dot" /> LIVE CHART</span>
            <h2 id="live-chart-title"><IconChart size={18} /> {instrument.label}</h2>
            <p>TradingView · {timeframe} · indikator, zoom, dan timeframe dapat diatur langsung pada chart.</p>
          </div>
          <div className="live-chart-actions">
            <a
              className="btn btn-ghost btn-sm"
              href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Layar penuh ↗
            </a>
            <button className="live-chart-close" type="button" onClick={onClose} aria-label="Tutup chart live">
              ×
            </button>
          </div>
        </header>
        <div className="live-chart-body">
          <TradingViewWidget
            type="advanced-chart"
            className="live-chart-widget"
            height="none"
            config={{
              autosize: true,
              symbol,
              interval,
              timezone: "Asia/Jakarta",
              theme: "dark",
              style: "1",
              locale: "en",
              allow_symbol_change: true,
              save_image: false,
              support_host: "https://www.tradingview.com",
            }}
          />
        </div>
      </section>
    </div>
  );
}
