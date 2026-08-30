"use client";

// components/AssetHeatmap.jsx
// Heatmap v2 (Round-15) — interaktif & animatif, gaya bento-tile ala TradingView:
//  - Tile warna kuat + shimmer halus, angka menghitung (count-up)
//  - Hover = overlay info 1H/1Mgu/1Bulan · Klik = panel detail + chart 3 bulan
//    (garis tergambar + crosshair & tooltip harga/tanggal)
//  - Top mover per periode = badge + pulse emas · Sort: grup / naik / turun
// Sumber: /api/heatmap (Yahoo Finance, refresh 5 menit).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconIndicators } from "./Icons";

// ambang normalisasi per grup agar warna seimbang antar-aset
const GROUP_MAX = { fx: 0.5, metal: 2.5, energy: 3.5, base: 2.5 };

const PERIODS = [
  { id: "d", label: "1 Hari", short: "1H" },
  { id: "w", label: "1 Minggu", short: "1Mgu" },
  { id: "m", label: "1 Bulan", short: "1Bulan" },
];
const SORTS = [
  { id: "grup", label: "Urutan Grup" },
  { id: "up", label: "▲ Naik" },
  { id: "down", label: "▼ Turun" },
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
const fmtSigned = (v) => (v === null || v === undefined ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`);
const fmtDate = (d) =>
  d ? new Date(`${d}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "";

// Angka yang menghitung (count-up) dan animasi ulang setiap nilai berubah
function AnimNum({ value, decimals = 2, prefix = "", suffix = "" }) {
  const [disp, setDisp] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const from = prev.current;
    prev.current = value;
    if (from === value) { setDisp(value); return undefined; }
    const start = performance.now();
    const dur = 650;
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisp(from + (value - from) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisp(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <>
      {prefix}
      {disp.toLocaleString("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </>
  );
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

// ── Chart detail: 64 sesi harian, garis tergambar + crosshair ──────────
function BigChart({ hist, histT, dec }) {
  const [hover, setHover] = useState(null);
  if (!hist || hist.length < 2) return null;
  const W = 600, H = 220, PX = 6, PT = 10, PB = 16;
  const n = hist.length;
  const min = Math.min(...hist);
  const max = Math.max(...hist);
  const span = max - min || Math.abs(max) * 0.01 || 1;
  const X = (i) => PX + (i / (n - 1)) * (W - PX * 2);
  const Y = (v) => H - PB - ((v - min) / span) * (H - PT - PB);
  const pts = hist.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
  const area = `${PX},${H - PB} ${pts} ${X(n - 1).toFixed(1)},${H - PB}`;
  const up = hist[n - 1] >= hist[0];
  const color = up ? "var(--up)" : "var(--down)";
  const hi = hover != null ? Math.max(0, Math.min(n - 1, hover)) : null;
  const sinceStart = hi != null ? ((hist[hi] - hist[0]) / hist[0]) * 100 : 0;

  return (
    <div className="hd-chart">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="hd-svg"
        role="img"
        aria-label="Chart harian 3 bulan"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setHover(Math.round(((e.clientX - r.left) / Math.max(r.width, 1)) * (n - 1)));
        }}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="hdArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={up ? "rgba(74,222,128,0.25)" : "rgba(251,113,133,0.25)"} />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={PX} x2={W - PX} y1={PT + (H - PT - PB) * f} y2={PT + (H - PT - PB) * f} stroke="var(--border)" strokeWidth="0.6" />
        ))}
        <polygon points={area} fill="url(#hdArea)" className="hd-area" />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" className="hd-line" />
        <circle cx={X(n - 1)} cy={Y(hist[n - 1])} r="3" fill={color} />
        {hi != null && (
          <g>
            <line x1={X(hi)} x2={X(hi)} y1={PT} y2={H - PB} stroke="rgba(232,236,243,0.4)" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            <circle cx={X(hi)} cy={Y(hist[hi])} r="3.4" fill="var(--text)" />
          </g>
        )}
      </svg>
      {hi != null && (
        <div
          className="hd-tip"
          style={{
            left: `${(hi / (n - 1)) * 100}%`,
            transform: `translateX(${hi > n * 0.75 ? "-105%" : hi < n * 0.25 ? "5%" : "-50%"})`,
          }}
        >
          <b>{fmtPrice(hist[hi], dec)}</b>
          <span>{fmtDate(histT[hi])} · {sinceStart >= 0 ? "+" : ""}{sinceStart.toFixed(2)}% dari awal</span>
        </div>
      )}
    </div>
  );
}

// ── Panel detail aset terpilih ─────────────────────────────────────────
function DetailPanel({ it, onClose }) {
  const hist = it.hist || [];
  const lo = hist.length ? Math.min(...hist) : null;
  const hi = hist.length ? Math.max(...hist) : null;
  return (
    <div className="heat-detail" key={it.yahoo}>
      <header className="hd-head">
        <div className="hd-title">
          <span className="hd-name">{it.name}</span>
          <span className="hd-src">Harian · 3 bulan · Yahoo Finance{it.seed ? " (seed)" : ""}</span>
        </div>
        <span className="hd-price"><AnimNum value={it.price} decimals={it.dec} /></span>
        <button type="button" className="hd-close" onClick={onClose} aria-label="Tutup detail">✕</button>
      </header>
      <div className="hd-chips">
        {PERIODS.map((p) => (
          <span key={p.id} className={`hd-chip ${it[p.id] >= 0 ? "up" : "down"}`}>
            {p.label}: <b>{fmtSigned(it[p.id])}</b>
          </span>
        ))}
        <span className="hd-chip dim">
          Range 3B: {lo != null ? `${fmtPrice(lo, it.dec)} – ${fmtPrice(hi, it.dec)}` : "—"}
        </span>
      </div>
      <BigChart hist={it.hist} histT={it.histT} dec={it.dec} />
    </div>
  );
}

export default function AssetHeatmap() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("d");
  const [sort, setSort] = useState("grup");
  const [selId, setSelId] = useState(null);
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

  // Esc menutup detail
  useEffect(() => {
    if (!selId) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setSelId(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selId]);

  const all = useMemo(() => (data ? data.groups.flatMap((g) => g.items) : []), [data]);
  const sel = useMemo(() => (selId ? all.find((it) => it.yahoo === selId) || null : null), [all, selId]);

  // Top mover periode aktif (perubahan absolut terbesar)
  const topItem = useMemo(() => {
    const withChg = all.filter((it) => it[period] != null);
    return withChg.length
      ? withChg.reduce((a, b) => (Math.abs(b[period]) > Math.abs(a[period]) ? b : a))
      : null;
  }, [all, period]);

  const sortedGroup = (items) => {
    if (sort === "grup") return items;
    return [...items].sort((a, b) =>
      sort === "up"
        ? (b[period] ?? -Infinity) - (a[period] ?? -Infinity)
        : (a[period] ?? Infinity) - (b[period] ?? Infinity)
    );
  };

  let idx = 0; // untuk stagger animasi antar tile

  return (
    <div className="card reveal heat-card">
      <div className="section-head heat-head">
        <div className="section-title">
          <span className="inline-ico" aria-hidden="true"><IconIndicators size={18} /></span>
          <h3>Heatmap Aset — Major Forex · Gold · Komoditi</h3>
          <span className="heat-live" aria-hidden="true"><i />Live</span>
        </div>
        <div className="heat-segs">
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
          <div className="seg" role="tablist" aria-label="Urutan tile">
            {SORTS.map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={sort === s.id}
                className={`seg-btn ${sort === s.id ? "active" : ""}`}
                onClick={() => setSort(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!data && !err && <p className="cell-muted">Memuat data pasar…</p>}
      {err && <p className="notice">⚠️ {err}</p>}

      {data && (
        <>
          {sel && <DetailPanel it={sel} onClose={() => setSelId(null)} />}

          {data.groups.map((g) => (
            <div className="heat-row" key={`${period}-${sort}-${g.id}`}>
              <div className="heat-row-label">
                <i aria-hidden="true" />
                {g.label}
              </div>
              <div className={`heat-grid heat-grid--${g.id}`}>
                {sortedGroup(g.items).map((it) => {
                  const i = idx++;
                  const chg = it[period];
                  const isTop = topItem?.yahoo === it.yahoo;
                  return (
                    <button
                      type="button"
                      key={it.yahoo}
                      className={`heat-cell ${chg >= 0 ? "up-t" : "down-t"} ${isTop ? "top" : ""} ${selId === it.yahoo ? "sel" : ""}`}
                      style={{ ...tileStyle(chg, it.group), "--i": i }}
                      onClick={() => setSelId(selId === it.yahoo ? null : it.yahoo)}
                      aria-pressed={selId === it.yahoo}
                      title={`${it.name} — klik untuk detail`}
                    >
                      <span className="heat-glow" aria-hidden="true" />
                      <div className="heat-top">
                        <span className="heat-name" title={it.name}>{it.name}</span>
                        {isTop && <span className="heat-topbadge">TOP MOVER</span>}
                      </div>
                      <div className={`heat-chg ${chg >= 0 ? "up" : "down"}`}>
                        <AnimNum value={chg} decimals={2} prefix={chg >= 0 ? "+" : ""} suffix="%" />
                      </div>
                      <div className="heat-price"><AnimNum value={it.price} decimals={it.dec} /></div>
                      <Spark data={it.spark} up={chg >= 0} />
                      <div className="heat-tip" aria-hidden="true">
                        {PERIODS.map((p) => (
                          <span key={p.id} className={`ht-chip ${it[p.id] >= 0 ? "up" : "down"}`}>
                            {p.short} {fmtSigned(it[p.id])}
                          </span>
                        ))}
                        <span className="ht-cta">{selId === it.yahoo ? "Klik lagi untuk tutup ✕" : "Klik untuk detail →"}</span>
                      </div>
                    </button>
                  );
                })}
                {g.id === "base" && (
                  <div className="heat-legend-tile" aria-hidden="true">
                    <div className="heat-scale-labels"><span>↓ turun</span><span>→ skala warna</span><span>naik ↑</span></div>
                    <div className="heat-scale" />
                    <div className="heat-legend-note">
                      Semakin pekat warnanya, semakin besar perubahannya. Arahkan kursor untuk ringkasan, klik tile untuk chart detail.
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="heat-foot">
            <span>Sumber: {data.source} · diperbarui otomatis tiap 5 menit</span>
            <span>Sparkline: 24 sesi terakhir · Top mover: perubahan {PERIODS.find((p) => p.id === period)?.label} terbesar</span>
          </div>
        </>
      )}
    </div>
  );
}
