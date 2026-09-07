// components/FundamentalsCard.jsx
// Ringkasan fundamental aset pada Pro Terminal. Data berasal dari snapshot API
// yang sama dengan halaman Fundamental dan diperiksa ulang setiap lima menit.

"use client";

import { useEffect, useMemo, useState } from "react";

const REFRESH_MS = 5 * 60 * 1000;
const FOCUS = {
  gold: ["us"],
  silver: ["us", "cn"],
  wti: ["us", "ca"],
  eurusd: ["euro", "us"],
  gbpusd: ["gb", "us"],
  usdjpy: ["us", "jp"],
  usdchf: ["us", "ch"],
  audusd: ["au", "us"],
  usdcad: ["us", "ca"],
  nzdusd: ["nz", "us"],
  dxy: ["us"],
};

const COUNTRY_NAMES = {
  us: "Amerika Serikat", euro: "Zona Euro", gb: "Inggris", ch: "Swiss",
  jp: "Jepang", ca: "Kanada", au: "Australia", nz: "Selandia Baru", cn: "Tiongkok",
};

const MARKET_SYMBOL = {
  gold: "XAU/USD", silver: "XAG/USD", eurusd: "EUR/USD", gbpusd: "GBP/USD",
  usdjpy: "USD/JPY", usdchf: "USD/CHF", audusd: "AUD/USD", usdcad: "USD/CAD",
  nzdusd: "NZD/USD",
};

function pct(value, digits = 2) {
  return value == null ? "—" : `${Number(value).toLocaleString("en-US", { maximumFractionDigits: digits })}%`;
}

function timeLabel(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

export default function FundamentalsCard({ assetId, assetLabel }) {
  const [snapshot, setSnapshot] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/fundamentals", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || "Snapshot tidak tersedia");
        if (active) {
          setSnapshot(data);
          setError("");
        }
      } catch (err) {
        if (active) setError(err?.message || "Snapshot tidak tersedia");
      }
    }
    load();
    const id = window.setInterval(load, REFRESH_MS);
    return () => { active = false; window.clearInterval(id); };
  }, []);

  const countries = useMemo(
    () => (FOCUS[assetId] || ["us"]).map((key) => ({ key, ...(snapshot?.countries?.[key] || {}) })),
    [assetId, snapshot]
  );
  const market = snapshot?.pairs?.find((pair) => pair.symbol === MARKET_SYMBOL[assetId]);
  const macroLive = snapshot?.sources?.macro?.liveCount > 0;
  const marketLive = snapshot?.sources?.market?.live;

  return (
    <article className="term-card fund-card">
      <header className="term-head">
        <h3 className="term-title">
          <span className="term-ico" aria-hidden="true">🏛</span>
          Fundamental <span className="term-sub">· {assetLabel}</span>
        </h3>
        <span className={`term-badge ${macroLive ? "live-badge" : ""}`}>
          {snapshot ? (macroLive ? "DATA CHECKED" : "FALLBACK") : "MEMUAT…"}
        </span>
      </header>

      <div className="term-body fund-body">
        {snapshot ? (
          <>
            <div className="fund-countries">
              {countries.map((country) => (
                <div key={country.key} className="fund-country" title={country.moveNote || ""}>
                  <span className="fund-country-name">{COUNTRY_NAMES[country.key] || country.key}</span>
                  <span className="fund-vals">
                    rate <b>{pct(country.rate)}</b>
                    <i className="fund-sep">·</i>
                    infl <b>{pct(country.inflation)}</b>
                    <i className="fund-sep">·</i>
                    unemp <b>{pct(country.unemp)}</b>
                    <i className="fund-sep">·</i>
                    gdp <b>{pct(country.gdp, 1)}</b>
                  </span>
                  <span className="fund-move">
                    {country.rateBank || "—"} {country.move != null ? `${country.move > 0 ? "+" : ""}${country.move}bp` : ""}
                    {country.moveNote ? ` · ${country.moveNote}` : ""}
                  </span>
                </div>
              ))}
            </div>

            {market && (
              <div className="fund-market-row">
                <span><span className={`pulse-dot ${marketLive ? "" : "fallback"}`} /> Harga {market.symbol}</span>
                <b>{Number(market.value).toLocaleString("en-US", { maximumFractionDigits: market.value >= 100 ? 2 : 5 })}</b>
                <em className={market.pct >= 0 ? "up" : "down"}>{market.pct >= 0 ? "+" : ""}{Number(market.pct).toFixed(2)}%</em>
              </div>
            )}

            <p className="fund-headline">
              Snapshot makro diperiksa {timeLabel(snapshot.checkedAt)} WIB. Nilai berkala mengikuti
              publikasi terbaru lembaga resmi; harga pasar berasal dari {snapshot.sources?.market?.provider || "penyedia pasar"}.
            </p>

            <footer className="term-src">
              <span>Makro: FRED {macroLive ? "(live)" : "(fallback)"}</span>
              <span className={marketLive ? "" : "fund-fallback"}>Harga: {snapshot.sources?.market?.provider || "—"}{marketLive ? " · live" : " · fallback"}</span>
            </footer>
          </>
        ) : (
          <p className="sess-loading">{error ? `Fundamental belum termuat: ${error}` : "Memuat snapshot fundamental terbaru…"}</p>
        )}
      </div>
    </article>
  );
}
