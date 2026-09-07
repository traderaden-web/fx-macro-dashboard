// components/TerminalChart.jsx
// Chart teknikal Terminal: candle + overlay SMC (OB / FVG / BOS) + zona ENTRY/TP/SL.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { detectSmc, tradeLevels } from "../lib/smc";

function fmt(p) {
  if (p == null) return "—";
  if (p >= 1000) return p.toLocaleString("en-US", { maximumFractionDigits: 1 });
  if (p >= 100) return p.toFixed(2);
  if (p >= 10) return p.toFixed(3);
  return p.toFixed(5);
}

export default function TerminalChart({ symbolId, tf, style = "smc", height = 520, plan = null }) {
  const wrapRef = useRef(null);
  const [w, setW] = useState(900);
  const [sig, setSig] = useState(null);
  const [err, setErr] = useState(null);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setW(Math.max(320, entries[0]?.contentRect?.width || 900));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let alive = true;
    setErr(null);
    fetch(`/api/signal?symbol=${encodeURIComponent(symbolId)}&tf=${encodeURIComponent(tf)}`)
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        if (j?.ok) setSig(j);
        else { setSig(null); setErr(j?.error || "Gagal memuat chart"); }
      })
      .catch(() => alive && setErr("Gagal terhubung ke server"));
    return () => { alive = false; };
  }, [symbolId, tf]);

  const ohlc = sig?.series?.ohlc || [];
  const smc = useMemo(() => (style === "smc" ? detectSmc(ohlc) : null), [ohlc, style]);
  const levels = useMemo(
    () => tradeLevels({ signal: sig?.signal, price: sig?.price, atr: sig?.atr }),
    [sig]
  );

  const layout = useMemo(() => {
    if (!ohlc.length) return null;
    const pad = { t: 28, r: 72, b: 28, l: 12 };
    const iw = w - pad.l - pad.r;
    const ih = height - pad.t - pad.b;
    const highs = ohlc.map((b) => b.h);
    const lows = ohlc.map((b) => b.l);
    if (levels.tp != null) highs.push(levels.tp);
    if (levels.sl != null) lows.push(levels.sl);
    let min = Math.min(...lows);
    let max = Math.max(...highs);
    const span = (max - min) || max * 0.001 || 1;
    min -= span * 0.08;
    max += span * 0.08;
    const n = ohlc.length;
    const slot = iw / n;
    const x = (i) => pad.l + (i + 0.5) * slot;
    const y = (v) => pad.t + ih - ((v - min) / (max - min)) * ih;
    return { pad, iw, ih, min, max, n, slot, x, y };
  }, [ohlc, w, height, levels]);

  return (
    <div ref={wrapRef} className="term-tech-chart">
      {!ohlc.length && (
        <div className="term-tech-empty">{err || "Memuat candle teknikal…"}</div>
      )}
      {layout && ohlc.length > 0 && (
        <svg
          width={w}
          height={height}
          viewBox={`0 0 ${w} ${height}`}
          className="term-tech-svg"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const px = e.clientX - rect.left;
            const i = Math.floor(((px - layout.pad.l) / layout.iw) * layout.n);
            if (i >= 0 && i < layout.n) setHover(i);
          }}
          onMouseLeave={() => setHover(null)}
        >
          {/* zona SL / ENTRY / TP */}
          {levels.entry != null && levels.tp != null && (
            <rect
              x={layout.pad.l}
              y={Math.min(layout.y(levels.entry), layout.y(levels.tp))}
              width={layout.iw}
              height={Math.abs(layout.y(levels.tp) - layout.y(levels.entry))}
              fill="rgba(74,222,128,0.08)"
            />
          )}
          {levels.entry != null && levels.sl != null && (
            <rect
              x={layout.pad.l}
              y={Math.min(layout.y(levels.entry), layout.y(levels.sl))}
              width={layout.iw}
              height={Math.abs(layout.y(levels.sl) - layout.y(levels.entry))}
              fill="rgba(251,113,133,0.08)"
            />
          )}

          {style === "smc" && smc?.fvg?.map((g, idx) => (
            <rect
              key={`fvg-${idx}`}
              x={layout.x(g.i0) - layout.slot * 0.4}
              y={layout.y(g.top)}
              width={Math.max(4, layout.x(g.i1) - layout.x(g.i0) + layout.slot * 0.8)}
              height={Math.max(2, layout.y(g.bot) - layout.y(g.top))}
              fill={g.dir === "UP" ? "rgba(45,212,191,0.16)" : "rgba(244,114,182,0.16)"}
              stroke={g.dir === "UP" ? "rgba(45,212,191,0.45)" : "rgba(244,114,182,0.45)"}
              strokeWidth="0.6"
            />
          ))}

          {style === "smc" && smc?.orderBlocks?.map((ob, idx) => (
            <rect
              key={`ob-${idx}`}
              x={layout.x(ob.i) - layout.slot * 0.45}
              y={layout.y(ob.top)}
              width={Math.max(3, layout.slot * 0.9)}
              height={Math.max(3, layout.y(ob.bot) - layout.y(ob.top))}
              fill={ob.dir === "UP" ? "rgba(74,222,128,0.28)" : "rgba(251,113,133,0.28)"}
              stroke={ob.dir === "UP" ? "#4ade80" : "#fb7185"}
              strokeWidth="0.8"
            />
          ))}

          {style === "klasik" && sig?.series?.ema20 && (
            <polyline
              fill="none"
              stroke="#2dd4bf"
              strokeWidth="1.4"
              points={sig.series.ema20.map((v, i) => (v == null ? null : `${layout.x(i)},${layout.y(v)}`)).filter(Boolean).join(" ")}
            />
          )}
          {style === "klasik" && sig?.series?.ema50 && (
            <polyline
              fill="none"
              stroke="#7c8698"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              points={sig.series.ema50.map((v, i) => (v == null ? null : `${layout.x(i)},${layout.y(v)}`)).filter(Boolean).join(" ")}
            />
          )}

          {ohlc.map((b, i) => {
            const up = b.c >= b.o;
            const cx = layout.x(i);
            const bw = Math.max(1.4, layout.slot * 0.62);
            return (
              <g key={i}>
                <line x1={cx} x2={cx} y1={layout.y(b.h)} y2={layout.y(b.l)} stroke={up ? "#4ade80" : "#fb7185"} strokeWidth="1" />
                <rect
                  x={cx - bw / 2}
                  y={Math.min(layout.y(b.o), layout.y(b.c))}
                  width={bw}
                  height={Math.max(1, Math.abs(layout.y(b.c) - layout.y(b.o)))}
                  fill={up ? "#4ade80" : "#fb7185"}
                />
              </g>
            );
          })}

          {style === "smc" && smc?.bos?.map((s, idx) => (
            <g key={`bos-${idx}`}>
              <line x1={layout.x(s.i)} x2={w - layout.pad.r} y1={layout.y(s.price)} y2={layout.y(s.price)} stroke={s.dir === "UP" ? "#22d3ee" : "#fbbf24"} strokeDasharray="3 3" strokeWidth="1" />
              <text x={w - layout.pad.r + 4} y={layout.y(s.price) + 3} className="term-tech-lbl" fill={s.dir === "UP" ? "#22d3ee" : "#fbbf24"}>
                {s.type}
              </text>
            </g>
          ))}

          {[["ENTRY", levels.entry, "#f0b429"], ["TP", levels.tp, "#4ade80"], ["SL", levels.sl, "#fb7185"]].map(([lab, val, col]) =>
            val == null ? null : (
              <g key={lab}>
                <line x1={layout.pad.l} x2={w - layout.pad.r} y1={layout.y(val)} y2={layout.y(val)} stroke={col} strokeWidth={lab === "ENTRY" ? 1.4 : 1.2} strokeDasharray={lab === "ENTRY" ? "2 3" : "0"} />
                <rect x={w - layout.pad.r + 2} y={layout.y(val) - 9} width={66} height={16} rx="3" fill={col} />
                <text x={w - layout.pad.r + 35} y={layout.y(val) + 3} textAnchor="middle" className="term-tech-tag">{lab} {fmt(val)}</text>
              </g>
            )
          )}

          {hover != null && ohlc[hover] && (
            <g>
              <line x1={layout.x(hover)} x2={layout.x(hover)} y1={layout.pad.t} y2={height - layout.pad.b} stroke="rgba(232,236,243,0.28)" strokeDasharray="3 3" />
            </g>
          )}
        </svg>
      )}
      <div className="term-tech-legend">
        <span className="tt-mode">{style === "smc" ? "Teknikal SMC · OB · FVG · BOS/CHOCH" : "Teknikal klasik · EMA 20/50"}</span>
        {sig && <span>bias {smc?.bias || sig.signal} · {ohlc.length} bar · {tf.toUpperCase()}</span>}
        {hover != null && ohlc[hover] && (
          <span className="tt-hover">O {fmt(ohlc[hover].o)} H {fmt(ohlc[hover].h)} L {fmt(ohlc[hover].l)} C {fmt(ohlc[hover].c)}</span>
        )}
        <span className="tt-levels">
          {levels.entry != null && <b className="lvl-chip in">ENTRY {fmt(levels.entry)}</b>}
          {levels.sl != null && <b className="lvl-chip out">SL {fmt(levels.sl)}</b>}
          {levels.tp != null && <b className="lvl-chip up">TP {fmt(levels.tp)}</b>}
        </span>
      </div>
    </div>
  );
}
