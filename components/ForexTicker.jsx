// components/ForexTicker.jsx
// Ticker harga valuta asing yang berjalan (marquee) di bawah header.
// Mengambil data dari /api/forex, lalu memperbarui otomatis tiap 60 detik.

"use client";

import { useEffect, useState } from "react";
import { IconGlobe } from "./Icons";

function fmt(v) {
  if (v == null || Number.isNaN(v)) return "—";
  return v >= 100 ? v.toFixed(2) : v.toFixed(4);
}
function signed(v) {
  if (v == null || Number.isNaN(v)) return "—";
  return (v > 0 ? "+" : "") + v.toFixed(2) + "%";
}

export default function ForexTicker() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/forex", { cache: "no-store" });
        const d = await res.json();
        if (active && d?.pairs?.length) setData(d);
      } catch {
        /* biarkan data lama tetap tampil */
      }
    }
    load();
    const id = setInterval(load, 60000);
    return () => { active = false; clearInterval(id); };
  }, []);

  const items = data?.pairs || [];
  // Duplikasi konten agar marquee berputar mulus tanpa putus.
  const loop = items.length ? [...items, ...items] : [];

  return (
    <div className="ticker" role="region" aria-label="Kurs valuta asing">
      <span className="ticker-label">
        <span className="ticker-label-ico"><IconGlobe size={14} /></span>
        Forex Live
      </span>
      <div className="ticker-viewport">
        {loop.length === 0 ? (
          <span className="ticker-empty">Memuat kurs live…</span>
        ) : (
          <div className="ticker-track">
            {loop.map((p, i) => {
              const dir = p.pct > 0 ? "up" : p.pct < 0 ? "down" : "flat";
              return (
                <span className="ticker-item" key={`${p.symbol}-${i}`} title={p.label}>
                  <span className="tk-sym">{p.symbol}</span>
                  <span className="tk-val">{fmt(p.value)}</span>
                  <span className={`tk-dir ${dir}`}>
                    {dir === "up" ? "▲" : dir === "down" ? "▼" : "—"} {signed(p.pct)}
                  </span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
