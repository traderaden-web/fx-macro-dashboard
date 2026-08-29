// components/TradingViewWidget.jsx
// Render widget resmi TradingView (embed tanpa API key) di sisi client.
// Pola official: kontainer ber-class "tradingview-widget-container" yang berisi
// div "tradingview-widget-container__widget" + <script src="...embed-widget-*.js">
// dengan isian JSON konfigurasi. Script memuat iframe dari s3.tradingview.com —
// jadi chart berjalan penuh di browser pengguna (timeframe, indikator, zoom, dll).

"use client";

import { useEffect, useRef, useMemo } from "react";

const SCRIPTS = {
  "advanced-chart": "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js",
  "symbol-overview": "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js",
  "ticker-tape": "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js",
};

/**
 * @param {"advanced-chart"|"symbol-overview"|"ticker-tape"} type
 * @param {object} config konfigurasi widget (simbol, tema, interval, ...)
 * @param {number|string} height tinggi kontainer (px, "auto", atau "none" = tinggi diatur via CSS/className)
 * @param {string} className class tambahan untuk kontainer (mis. tinggi responsif via CSS)
 * @param {number} [minHeight] tinggi minimum saat height "auto"
 */
export default function TradingViewWidget({ type, config, height = "auto", className = "", minHeight }) {
  const hostRef = useRef(null);
  const configStr = useMemo(() => JSON.stringify(config), [config]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.innerHTML = "";

    // Placeholder status: hilang begitu iframe muncul; jadi pesan error bila gagal.
    const placeholder = document.createElement("div");
    placeholder.className = "tv-placeholder";
    placeholder.textContent = "Memuat chart dari TradingView…";
    host.appendChild(placeholder);

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = SCRIPTS[type];
    script.text = configStr;

    let done = false;
    const fail = (msg) => {
      if (done) return;
      done = true;
      placeholder.textContent = msg;
    };

    // Hapus placeholder tepat saat iframe TradingView muncul di kontainer.
    const observer = new MutationObserver(() => {
      if (host.querySelector("iframe")) {
        done = true;
        observer.disconnect();
        placeholder.remove();
      }
    });

    // Fallback: bila 12 detik berlalu dan iframe belum ada, tampilkan pesan.
    const timeout = setTimeout(() => {
      if (!host.querySelector("iframe")) {
        fail("Chart belum termuat — periksa koneksi internet (chart dimuat dari s3.tradingview.com).");
      }
    }, 12000);

    script.addEventListener("load", () => observer.observe(host, { childList: true, subtree: true }));
    script.addEventListener("error", () => fail("Gagal memuat script TradingView — periksa koneksi internet."));

    host.appendChild(widget);
    host.appendChild(script);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
      host.innerHTML = "";
    };
  }, [type, configStr]);

  return (
    <div
      ref={hostRef}
      className={`tv-widget tradingview-widget-container ${className}`.trim()}
      style={
        height === "none"
          ? undefined
          : { height: height === "auto" ? "auto" : height, minHeight: height === "auto" ? (minHeight ?? 60) : height }
      }
    />
  );
}
