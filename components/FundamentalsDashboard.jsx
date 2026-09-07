// components/FundamentalsDashboard.jsx
// Pembungkus klien halaman Fundamental: menyegarkan papan secara OTOMATIS
// tiap 5 menit (plus tombol manual) dari /api/fundamentals/board, tanpa
// reload halaman. Render awal memakai `initial` dari server (first paint
// langsung berisi angka), lalu diganti hasil snapshot termutakhir.
// Papan itu sendiri = FundamentalsBoard (denyut makro, bank sentral, bias,
// fokus rupiah, radar rilis).

"use client";

import { useCallback, useEffect, useState } from "react";
import FundamentalsBoard from "./fundamentals/FundamentalsBoard";

const REFRESH_MS = 5 * 60 * 1000;

function timeLabel(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}

export default function FundamentalsDashboard({ initial = null }) {
  const [data, setData] = useState(initial);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastSync, setLastSync] = useState(initial?.generatedAt || null);

  const load = useCallback(async ({ manual = false } = {}) => {
    if (manual) setRefreshing(true);
    try {
      const response = await fetch("/api/fundamentals/board", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "Papan fundamental tidak tersedia");
      setData(payload);
      setLastSync(payload.generatedAt || new Date().toISOString());
      setError("");
    } catch (err) {
      setError(err?.message || "Papan fundamental tidak tersedia");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = window.setInterval(() => load(), REFRESH_MS);
    return () => window.clearInterval(interval);
  }, [load]);

  const macro = data?.sources?.macro;
  const market = data?.sources?.market;

  return (
    <>
      <div className="fund-live-strip" role="status">
        <div className="fund-live-summary">
          <span className={`fund-live-dot ${data ? "ok" : ""}`} />
          <div>
            <strong>{data ? "SINKRONISASI FUNDAMENTAL AKTIF" : "MENYIAPKAN SINKRONISASI FUNDAMENTAL"}</strong>
            <span>
              {data
                ? `Diperiksa ${timeLabel(lastSync)} WIB · refresh otomatis tiap 5 menit`
                : "Mengambil data resmi dan harga pasar terbaru…"}
            </span>
          </div>
        </div>
        <div className="fund-source-summary">
          {macro && (
            <span>Makro: <b>{macro.provider}</b> · {macro.liveCount} live{macro.fallbackCount ? ` · ${macro.fallbackCount} fallback` : ""}</span>
          )}
          {market && (
            <span className={market.live ? "" : "warn"}>
              Harga: <b>{market.provider}</b>{market.live ? " · live" : " · fallback"}
            </span>
          )}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => load({ manual: true })} disabled={refreshing}>
            {refreshing ? "Memperbarui…" : "Refresh sekarang"}
          </button>
        </div>
      </div>

      {error && data && (
        <p className="notice-banner">Sinkronisasi terakhir gagal: {error}. Menampilkan snapshot berhasil terakhir.</p>
      )}
      {error && !data && <p className="error-banner">{error}</p>}

      {data ? (
        <FundamentalsBoard
          pairs={data.pairs || []}
          pulses={data.pulses || []}
          banks={data.banks || []}
          idr={data.idr || null}
          cheat={data.radar || []}
          asof={data.asof || { macro: "—" }}
        />
      ) : (
        <div className="fund-loading">Memuat denyut makro, papan bank sentral, bias mata uang &amp; fokus Rupiah…</div>
      )}
    </>
  );
}
