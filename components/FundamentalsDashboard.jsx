// components/FundamentalsDashboard.jsx
// Tampilan halaman Fundamental dengan sinkronisasi otomatis terhadap snapshot API.

"use client";

import { useCallback, useEffect, useState } from "react";
import FundamentalsView from "./FundamentalsView";
import { IconAnalytics } from "./Icons";

const REFRESH_MS = 5 * 60 * 1000;

function timeLabel(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

function formatMetric(value, unit = "") {
  if (value == null) return "—";
  return `${Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 })}${unit ? ` ${unit}` : ""}`;
}

export default function FundamentalsDashboard() {
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async ({ manual = false } = {}) => {
    if (manual) setRefreshing(true);
    try {
      const response = await fetch("/api/fundamentals", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Data fundamental tidak tersedia");
      setSnapshot(data);
      setError("");
    } catch (err) {
      setError(err?.message || "Data fundamental tidak tersedia");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = window.setInterval(() => load(), REFRESH_MS);
    return () => window.clearInterval(interval);
  }, [load]);

  const macro = snapshot?.sources?.macro;
  const market = snapshot?.sources?.market;

  return (
    <>
      <div className="fund-live-strip" role="status">
        <div className="fund-live-summary">
          <span className={`fund-live-dot ${snapshot ? "ok" : ""}`} />
          <div>
            <strong>{snapshot ? "SINKRONISASI FUNDAMENTAL AKTIF" : "MENYIAPKAN SINKRONISASI FUNDAMENTAL"}</strong>
            <span>
              {snapshot
                ? `Diperiksa ${timeLabel(snapshot.checkedAt)} WIB · refresh otomatis tiap 5 menit`
                : "Mengambil data resmi dan harga pasar terbaru…"}
            </span>
          </div>
        </div>
        <div className="fund-source-summary">
          {macro && <span>Makro: <b>{macro.provider}</b> · {macro.liveCount} live{macro.fallbackCount ? ` · ${macro.fallbackCount} fallback` : ""}</span>}
          {market && <span className={market.live ? "" : "warn"}>Harga: <b>{market.provider}</b>{market.live ? " · live" : " · fallback"}</span>}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => load({ manual: true })} disabled={refreshing}>
            {refreshing ? "Memperbarui…" : "Refresh sekarang"}
          </button>
        </div>
      </div>

      {error && !snapshot && <p className="error-banner">{error}</p>}
      {error && snapshot && <p className="notice-banner">Sinkronisasi terakhir gagal: {error}. Menampilkan snapshot berhasil terakhir.</p>}

      {loading && !snapshot ? (
        <div className="fund-loading">Memuat bias fundamental, nilai makro resmi, dan harga pasar…</div>
      ) : snapshot ? (
        <>
          <FundamentalsView
            pairs={snapshot.pairs}
            cheatSheet={snapshot.cheatSheet}
            countryData={snapshot.countries}
          />

          <section className="section">
            <div className="section-head">
              <h2><span className="inline-ico"><IconAnalytics size={16} /></span> Cheat Sheet Rilis Penting</h2>
              <span className="cell-muted">Konsensus &amp; angka sebelumnya dari snapshot terbaru</span>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Event</th>
                    <th>Kategori</th>
                    <th>Konsensus</th>
                    <th>Previous</th>
                    <th>Status data</th>
                    <th>Dampak</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.cheatSheet.length ? snapshot.cheatSheet.map((event) => (
                    <tr key={`${event.indicatorId}-${event.date}-${event.time}`}>
                      <td className="mono">
                        <div style={{ fontWeight: 600 }}>{event.date.slice(8, 10)}/{event.date.slice(5, 7)}</div>
                        <div className="cell-muted">{event.time} WIB</div>
                      </td>
                      <td>
                        <div className="cell-name">{event.title}</div>
                        <div className="cell-muted">{event.country}</div>
                      </td>
                      <td><span className="cell-muted">{event.category}</span></td>
                      <td className="mono">{formatMetric(event.consensus, event.unit)}</td>
                      <td className="mono cell-muted">{formatMetric(event.previous, event.unit)}</td>
                      <td><span className={`fund-data-source ${event.source === "live" ? "live" : "fallback"}`}>{event.source === "live" ? "FRED live" : event.source === "curated" ? "kurasi" : event.source === "seed" ? "fallback" : "menunggu"}</span></td>
                      <td><span className="badge impact" style={{ color: "#fb7185", background: "rgba(251,113,133,0.16)" }}>{event.impact}</span></td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7" className="cell-muted">Belum ada rilis berdampak tinggi dalam rentang kalender aktif.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="fund-disclosure">
              Nilai makro mengikuti publikasi terbaru yang tersedia dari FRED; indikator periodik hanya berubah saat lembaga resmi menerbitkan data baru. Bila sumber eksternal tidak merespons, status <b>fallback</b> ditampilkan agar angka kurasi tidak disalahartikan sebagai data live.
            </p>
          </section>
        </>
      ) : null}
    </>
  );
}
