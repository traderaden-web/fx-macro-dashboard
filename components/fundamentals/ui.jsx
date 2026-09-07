// components/fundamentals/ui.jsx
// Pustaka UI bersama khusus halaman /fundamentals: format angka, countdown
// live, gauge skor, grafik area interaktif (hover + crosshair), grafik tangga
// (jalur suku bunga), segmented control, dan badge sumber data.
// Semua komponen murni klien ("use client").

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ---------- format ----------
/** Format angka gaya Indonesia: fmtID(3.75,2)="3,75" · fmtID(4,2)="4,00" · fmtID(15840,0)="15.840" */
export const fmtID = (v, d = 2) => {
  if (v === null || v === undefined || v === "" || !Number.isFinite(Number(v))) return "—";
  const dd = Math.max(0, Math.min(6, d));
  return Number(v).toLocaleString("id-ID", { maximumFractionDigits: dd, minimumFractionDigits: dd });
};

export const pctID = (v, d = 1) =>
  v === null || v === undefined || !Number.isFinite(Number(v)) ? "—" : `${v > 0 ? "+" : ""}${Number(v).toFixed(d).replace(".", ",")}%`;

export const signed = (v, d = 0) =>
  v === null || v === undefined || !Number.isFinite(Number(v)) ? "—" : `${v > 0 ? "+" : ""}${Number(v).toFixed(d).replace(".", ",")}`;

export const bpLabel = (v) => (v === 0 ? "HOLD" : `${v > 0 ? "+" : "−"}${Math.abs(v)}bp`);

// ---------- jam live ----------
/** Tick tiap `interval` ms — dipakai countdown & jam. Hanya di klien. */
export function useNow(interval = 1000) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(t);
  }, [interval]);
  return now;
}

/** Hitung mundur ke `iso` (string dengan offset WIB). Null sampai mounted. */
export function useCountdown(iso) {
  const now = useNow(1000);
  return useMemo(() => {
    if (!iso || !now) return null;
    const t = new Date(iso).getTime();
    const diff = t - now;
    if (diff <= 0) {
      // 90 menit pertama pasca-rilis dianggap "baru rilis"
      if (now - t < 90 * 60 * 1000) return { state: "fresh", label: "BARU RILIS", urgent: true };
      return { state: "past", label: "selesai", urgent: false };
    }
    const s = Math.floor(diff / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const label =
      d > 0 ? `${d}h ${h}j ${m}m` : h > 0 ? `${h}j ${m}m ${String(sec).padStart(2, "0")}d` : `${m}m ${String(sec).padStart(2, "0")}d`;
    return { state: "upcoming", label, urgent: diff < 24 * 3600 * 1000, days: d };
  }, [iso, now]);
}

export function Countdown({ iso, className = "" }) {
  const cd = useCountdown(iso);
  if (!cd) return <span className={`cd-chip ${className}`}>···</span>;
  const tone = cd.state === "fresh" ? "live" : cd.urgent ? "urgent" : cd.state === "past" ? "past" : "";
  return (
    <span className={`cd-chip ${tone} ${className}`}>
      {cd.urgent && <i className="cd-dot" aria-hidden="true" />}
      {cd.label}
    </span>
  );
}

// ---------- badge sumber ----------
export function SrcBadge({ kind = "kurasi", label }) {
  const meta = {
    live: { cls: "live", text: label || "LIVE" },
    seed: { cls: "seed", text: label || "FRED" },
    demo: { cls: "demo", text: "DEMO" },
    kurasi: { cls: "kurasi", text: label || "KURASI" },
  }[kind] || { cls: "kurasi", text: label || kind };
  return <span className={`src-badge ${meta.cls}`}>{meta.text}</span>;
}

// ---------- gauge skor (arc 0–100) ----------
export function ScoreDial({ score = 50, size = 74, label }) {
  const r = (size - 10) / 2;
  const c = Math.PI * r; // setengah lingkaran
  const val = Math.max(0, Math.min(100, score));
  const color = val >= 68 ? "var(--up)" : val >= 55 ? "#86efac" : val >= 45 ? "var(--warn)" : val >= 32 ? "#fda4af" : "var(--down)";
  return (
    <div className="dial" style={{ width: size, height: size / 2 + 16 }}>
      <svg width={size} height={size / 2 + 6} viewBox={`0 0 ${size} ${size / 2 + 6}`}>
        <path d={`M 5 ${size / 2} A ${r} ${r} 0 0 1 ${size - 5} ${size / 2}`} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="6" strokeLinecap="round" />
        <path
          d={`M 5 ${size / 2} A ${r} ${r} 0 0 1 ${size - 5} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${(val / 100) * c} ${c}`}
          className="dial-fill"
        />
      </svg>
      <b className="dial-num" style={{ color }}>{Math.round(val)}</b>
      {label && <span className="dial-label">{label}</span>}
    </div>
  );
}

// ---------- grafik area interaktif ----------
/**
 * AreaChart — SVG dengan gradien, crosshair & tooltip saat hover (mouse/touch).
 * points: [{date, value}] · fmtX/fmtY: formatter · min/max otomatis.
 * liveIdx: indeks titik live (ditandai lingkaran + label LIVE).
 */
export function AreaChart({
  points = [], color = "#f0b429", height = 300, fmtX = (d) => d, fmtY = (v) => v,
  liveIdx = -1, yPadRatio = 0.12, unit = "", footnote,
}) {
  const W = 860;
  const H = height;
  const PL = 56, PR = 18, PT = 18, PB = 30;
  const [hover, setHover] = useState(null);
  const wrapRef = useRef(null);

  const data = points.filter((p) => Number.isFinite(p.value));
  const geo = useMemo(() => {
    if (data.length < 2) return null;
    const vals = data.map((p) => p.value);
    let min = Math.min(...vals);
    let max = Math.max(...vals);
    const span = max - min || Math.abs(max) || 1;
    min -= span * yPadRatio;
    max += span * yPadRatio;
    const x = (i) => PL + (i / (data.length - 1)) * (W - PL - PR);
    const y = (v) => PT + (1 - (v - min) / (max - min)) * (H - PT - PB);
    const path = data.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
    const area = `${path} L ${x(data.length - 1).toFixed(1)} ${H - PB} L ${x(0).toFixed(1)} ${H - PB} Z`;
    return { min, max, x, y, path, area };
  }, [data, H]);

  if (!geo) return <div className="chart-empty">Data belum cukup untuk digambar.</div>;

  const onMove = (clientX) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setHover(Math.round(ratio * (data.length - 1)));
  };

  const hPt = hover != null ? data[hover] : null;
  const hX = geo.x(hover ?? 0);
  const tipLeft = Math.max(0, Math.min(88, (hX / W) * 100)); // % posisi tooltip

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => geo.min + (geo.max - geo.min) * t);
  const minPt = data.reduce((a, b) => (b.value < a.value ? b : a), data[0]);
  const maxPt = data.reduce((a, b) => (b.value > a.value ? b : a), data[0]);

  return (
    <div className="area-chart" ref={wrapRef}
      onMouseMove={(e) => onMove(e.clientX)}
      onMouseLeave={() => setHover(null)}
      onTouchStart={(e) => onMove(e.touches[0].clientX)}
      onTouchMove={(e) => onMove(e.touches[0].clientX)}
      onTouchEnd={() => setHover(null)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="area-svg" role="img">
        <defs>
          <linearGradient id={`ac-grad-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.38" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={PL} x2={W - PR} y1={geo.y(t)} y2={geo.y(t)} className="ac-grid" />
            <text x={PL - 8} y={geo.y(t) + 4} className="ac-ylabel" textAnchor="end">{fmtY(t)}</text>
          </g>
        ))}
        <path d={geo.area} fill={`url(#ac-grad-${color.replace(/[^a-z0-9]/gi, "")})`} />
        <path d={geo.path} fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" className="ac-line" />
        {/* penanda titik live */}
        {liveIdx >= 0 && liveIdx < data.length && (
          <g>
            <circle cx={geo.x(liveIdx)} cy={geo.y(data[liveIdx].value)} r="4.5" fill={color} className="ac-live-dot" />
          </g>
        )}
        {/* label min/max */}
        <circle cx={geo.x(data.indexOf(minPt))} cy={geo.y(minPt.value)} r="3.2" className="ac-mm" />
        <circle cx={geo.x(data.indexOf(maxPt))} cy={geo.y(maxPt.value)} r="3.2" className="ac-mm" />
        <text x={geo.x(data.indexOf(maxPt))} y={geo.y(maxPt.value) - 9} className="ac-mmlabel" textAnchor="middle">▲ {fmtY(maxPt.value)}</text>
        <text x={geo.x(data.indexOf(minPt))} y={geo.y(minPt.value) + 17} className="ac-mmlabel" textAnchor="middle">▼ {fmtY(minPt.value)}</text>
        {/* label sumbu X */}
        {[0, Math.floor((data.length - 1) / 2), data.length - 1].map((i, k) => (
          <text key={k} x={geo.x(i)} y={H - 8} className="ac-xlabel" textAnchor={k === 0 ? "start" : k === 2 ? "end" : "middle"}>{fmtX(data[i].date)}</text>
        ))}
        {/* crosshair */}
        {hPt && (
          <g className="ac-cross">
            <line x1={hX} x2={hX} y1={PT} y2={H - PB} />
            <circle cx={hX} cy={geo.y(hPt.value)} r="5" />
          </g>
        )}
      </svg>
      {hPt && (
        <div className="ac-tip" style={{ left: `${tipLeft}%` }}>
          <b>{fmtY(hPt.value)}{unit}</b>
          <span>{fmtX(hPt.date)}{liveIdx === hover ? " · LIVE" : ""}</span>
        </div>
      )}
      {footnote && <div className="ac-foot">{footnote}</div>}
    </div>
  );
}

/** Grafik tangga untuk jalur suku bunga (BI-Rate). */
export function StepChart({ points = [], height = 190, color = "#f0b429", fmtY = (v) => v, fmtX = (d) => d, fmtEnd }) {
  const W = 860;
  const H = height;
  const PL = 46, PR = 14, PT = 14, PB = 26;
  if (points.length < 2) return <div className="chart-empty">—</div>;
  const vals = points.map((p) => p.value);
  const min = Math.min(...vals) - 0.4;
  const max = Math.max(...vals) + 0.4;
  const x = (i) => PL + (i / (points.length - 1)) * (W - PL - PR);
  const y = (v) => PT + (1 - (v - min) / (max - min)) * (H - PT - PB);
  // tangga: garis horizontal sampai titik berikut, lalu naik/turun vertikal
  let d = `M ${x(0)} ${y(points[0].value)}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${x(i)} ${y(points[i - 1].value)} L ${x(i)} ${y(points[i].value)}`;
  }
  const ticks = [Math.min(...vals), Math.round(((Math.min(...vals) + Math.max(...vals)) / 2) * 10) / 10, Math.max(...vals)];
  const endFmt = fmtEnd || fmtY;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="area-svg step-svg" role="img">
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={PL} x2={W - PR} y1={y(t)} y2={y(t)} className="ac-grid" />
          <text x={PL - 7} y={y(t) + 4} className="ac-ylabel" textAnchor="end">{fmtY(t)}</text>
        </g>
      ))}
      <path d={d} fill="none" stroke={color} strokeWidth="2.6" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={p.date}>
          <circle cx={x(i)} cy={y(p.value)} r="4" fill={color} stroke="var(--panel)" strokeWidth="1.6" />
          {i === points.length - 1 && (
            <text x={x(i)} y={y(p.value) - 11} className="ac-mmlabel" textAnchor="end" fill={color}>
              {endFmt(p.value)}%
            </text>
          )}
        </g>
      ))}
      {[0, points.length - 1].map((i, k) => (
        <text key={k} x={x(i)} y={H - 8} className="ac-xlabel" textAnchor={k === 0 ? "start" : "end"}>
          {fmtX(points[i].date)}
        </text>
      ))}
    </svg>
  );
}

// ---------- segmented control ----------
export function Segmented({ options = [], value, onChange, small = false }) {
  return (
    <div className={`fv-seg ${small ? "sm" : ""}`}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          className={`fv-seg-btn ${value === o.id ? "active" : ""}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---------- bar skor kecil ----------
export function ScoreBar({ value = 0, label, right, delay = 0 }) {
  const v = Math.max(0, Math.min(100, value));
  const color = v >= 68 ? "var(--up)" : v >= 55 ? "#86efac" : v >= 45 ? "var(--warn)" : v >= 32 ? "#fda4af" : "var(--down)";
  return (
    <div className="scorebar">
      <div className="scorebar-top">
        <span>{label}</span>
        {right != null && <b style={{ color }}>{right}</b>}
      </div>
      <div className="scorebar-track">
        <div className="scorebar-fill" style={{ width: `${v}%`, background: color, animationDelay: `${delay}ms` }} />
      </div>
    </div>
  );
}
