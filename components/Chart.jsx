// components/Chart.jsx
// Line chart SVG ringan tanpa dependensi eksternal — bekerja di iframe preview.

"use client";

import { useEffect, useRef, useState } from "react";

export default function Chart({ points, height = 260, color = "#38bdf8", unit = "", decimals = 2 }) {
  const ref = useRef(null);
  const [dims, setDims] = useState({ w: 800, h: height });
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width || 800;
      setDims({ w, h: height });
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [height]);

  const data = (points || [])
    .map((p) => ({ ...p, v: typeof p.value === "number" ? p.value : null }))
    .filter((p) => p.v !== null);

  if (!data.length) {
    return (
      <div ref={ref} className="chart-empty" style={{ height }}>
        <span>Tidak ada data untuk ditampilkan</span>
      </div>
    );
  }

  const { w, h } = dims;
  const pad = { top: 22, right: 18, bottom: 28, left: 46 };
  const iw = w - pad.left - pad.right;
  const ih = h - pad.top - pad.bottom;

  const values = data.map((d) => d.v);
  let min = Math.min(...values);
  let max = Math.max(...values);
  const range = max - min || 1;
  min -= range * 0.12;
  max += range * 0.12;
  const span = max - min;

  const step = iw / Math.max(data.length - 1, 1);
  const x = (i) => pad.left + i * step;
  const y = (v) => pad.top + ih - ((v - min) / span) * ih;

  const path = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.v).toFixed(1)}`)
    .join(" ");

  const area = `${path} L ${x(data.length - 1).toFixed(1)} ${pad.top + ih} L ${x(0).toFixed(1)} ${pad.top + ih} Z`;

  const fmt = (v) => {
    const n = Number(v);
    if (isNaN(n)) return "—";
    return n.toLocaleString("id-ID", { maximumFractionDigits: decimals, minimumFractionDigits: 0 });
  };

  const nTicks = 5;
  const ticks = Array.from({ length: nTicks }, (_, i) => min + (span * i) / (nTicks - 1));
  // Jumlah label sumbu X menyesuaikan lebar tersedia (dinamis di layar sempit).
  const maxLabels = Math.max(2, Math.floor(iw / 64));
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.min(7, maxLabels)));

  let hx = null, hy = null, hd = null;
  if (hover !== null && data[hover]) {
    hx = x(hover);
    hy = y(data[hover].v);
    hd = data[hover];
  }

  const gradId = "areaGrad";

  return (
    <div ref={ref} className="chart-wrap">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {ticks.map((t, i) => {
          const yy = y(t);
          return (
            <g key={i}>
              <line x1={pad.left} y1={yy} x2={w - pad.right} y2={yy} className="chart-grid" />
              <text x={pad.left - 8} y={yy + 4} className="chart-tick" textAnchor="end">
                {fmt(t)}
              </text>
            </g>
          );
        })}

        <path d={area} fill={`url(#${gradId})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />

        {data.map((d, i) =>
          i % labelEvery === 0 || i === data.length - 1 ? (
            <text key={i} x={x(i)} y={h - 8} className="chart-tick" textAnchor="middle">
              {d.date.slice(0, 7)}
            </text>
          ) : null
        )}

        {hover !== null && hd && (
          <g>
            <line x1={hx} y1={pad.top} x2={hx} y2={pad.top + ih} className="chart-hover-line" />
            <circle cx={hx} cy={hy} r="4.5" fill={color} stroke="#0b1220" strokeWidth="2" />
          </g>
        )}
      </svg>

      {hover !== null && hd && (
        <div className="chart-tooltip" style={{ left: Math.min(hx, w - 170), top: Math.max(hy - 40, 4) }}>
          <div className="tt-date">{hd.date}</div>
          <div className="tt-value">
            {fmt(hd.v)} <span>{unit}</span>
          </div>
        </div>
      )}

      {/* overlay interaksi */}
      <div
        style={{ position: "absolute", inset: 0 }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const rel = e.clientX - rect.left;
          const idx = Math.round((rel - pad.left) / step);
          if (idx >= 0 && idx < data.length) setHover(idx);
        }}
        onMouseLeave={() => setHover(null)}
      />
    </div>
  );
}
