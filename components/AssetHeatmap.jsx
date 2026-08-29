"use client";

// components/AssetHeatmap.jsx
// Heatmap data Major Forex + Gold + Komoditi — gaya bento-tile ala TradingView:
// tile besar dengan isian warna kuat, angka perubahan mencolok, dan sparkline
// 24 sesi terakhir. Sumber: /api/heatmap (Yahoo Finance, refresh 5 menit).

import { useCallback, useEffect, useState } from "react";
import { IconIndicators } from "./Icons";

// ambang normalisasi per grup agar warna seimbang antar-aset
const GROUP_MAX = { fx: 0.5, metal: 2.5, energy: 3.5, base: 2.5 };

const PERIODS = [
  { id: "d", label: "1 Hari" },
  { id: "w", label: "1 Minggu" },
  { id: "m", label: "1 Bulan" },
];

function tileStyle(chg, group) {
  if (chg === null || chg === undefined) return {};
  const max = GROUP_MAX[group] || 1;
  const a = Math.min(1, Math.abs(chg) / max);
  const top = 0.12 + a * 0.38;
  const bot = 0.04 + a * 0.14;
  const border = 0.28 + a * 0.5;
  return chg >= 0
    ? {
        background: `linear-gradient(165deg, rgba(74,222,128,${top}), rgba(74,222,128,${bot}) 70%, transparent)`,
        borderColor: `rgba(74,222,128,${border})`,
      }
    : {
        background: `linear-gradient(165deg, rgba(251,113,133,${top}), rgba(251,113,133,${bot}) 70%, transparent)`,
        borderColor: `rgba(251,113,133,${border})`,
      };
}

function fmtPrice(v, dec) {
  if (v === null || v === undefined) return "—";
  return v.toLocaleString("id-ID", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function fmtChg(v) {
  if (v === null || v === undefined) return "—";
  return `${v >= 0 ? "▲ +" : "▼ "}${v.toFixed(2)}%`;
}

function Spark({ data, up }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const rng = max - min || 1;
  const pts = data.map(
    (v, i) => `${((i / (data.length - 1)) * 100).toFixed(2)},${(27 - ((v - min) / rng) * 22).toFixed(2)}`
  );
  const color = up ? "var(--up)" : "var(--down)";
  return (
    <svg className="spark" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={`0,28 ${pts.join(" ")} 100,28`} fill={color} opacity="0.1" />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function AssetHeatmap() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("d");
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/heatmap", { cache: "no-store" });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "gagal memuat heatmap");
      setData(j);
      setErr("");
    } catch (e) {
      setErr(e.message);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [load]);

  let idx = 0; // untuk stagger animasi antar tile

  return (
    <div className="card reveal heat-card">
      <div className="section-head heat-head">
        <div className="section-title">
          <span className="inline-ico" aria-hidden="true"><IconIndicators size={18} /></span>
          <h3>Heatmap Aset — Major Forex · Gold · Komoditi</h3>
          <span className="heat-live" aria-hidden="true"><i />Live</span>
        </div>
        <div className="seg" role="tablist" aria-label="Periode perubahan">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={period === p.id}
              className={`seg-btn ${period === p.id ? "active" : ""}`}
              onClick={() => setPeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {!data && !err && <p className="cell-muted">Memuat data pasar…</p>}
      {err && <p className="notice">⚠️ {err}</p>}

      {data && (
        <>
          {data.groups.map((g) => (
            <div className="heat-row" key={`${period}-${g.id}`}>
              <div className="heat-row-label">
                <i aria-hidden="true" />
                {g.label}
              </div>
              <div className={`heat-grid heat-grid--${g.id}`}>
                {g.items.map((it) => {
                  const i = idx++;
                  const chg = it[period];
                  return (
                    <div className="heat-cell" key={it.yahoo} style={{ ...tileStyle(chg, it.group), "--i": i }}>
                      <div className="heat-top">
                        <span className="heat-name" title={it.name}>{it.name}</span>
                        <span className={`heat-chg ${chg >= 0 ? "up" : "down"}`}>{fmtChg(chg)}</span>
                      </div>
                      <div className="heat-price">{fmtPrice(it.price, it.dec)}</div>
                      <Spark data={it.spark} up={chg >= 0} />
                    </div>
                  );
                })}
                {g.id === "base" && (
                  <div className="heat-legend-tile" aria-hidden="true">
                    <div className="heat-scale-labels"><span>↓ turun</span><span>→ skala warna</span><span>naik ↑</span></div>
                    <div className="heat-scale" />
                    <div className="heat-legend-note">
                      Semakin pekat warnanya, semakin besar perubahannya. Grafik kecil = tren 24 sesi terakhir.
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="heat-foot">
            <span>Sumber: {data.source} · diperbarui otomatis tiap 5 menit</span>
            <span>Sparkline: 24 sesi perdagangan terakhir</span>
          </div>
        </>
      )}
    </div>
  );
}
