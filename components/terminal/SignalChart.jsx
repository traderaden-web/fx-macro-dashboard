// components/terminal/SignalChart.jsx
// ═════════════════════════════════════════════════════════════════════════
// CHART LIVE custom (canvas, tanpa dependensi) — jantung seksi Chart Terminal:
//
//   • Candlestick OHLC live (data /api/chart ← Yahoo Finance, poll 45 dtk)
//   • EMA 20 & EMA 50 overlay (metode tren)
//   • SINYAL & TRADE PLAN digambar langsung: garis ENTRY, SL, TP1/2/3 + RR
//     (atau BUY STOP / SELL STOP saat NETRAL)
//   • Metode SMC: Order Block & FVG (zona), BOS/CHoCH (label di bar)
//   • Metode ICT: zona Premium/Discount + equilibrium
//   • SNR: garis Support/Resistance; Range 20 bar + level breakout
//   • Liquidity pool (equal highs/lows) + tanda swept
//   • Panel osilator RSI(14) atau MACD(12,26,9)
//   • Crosshair + OHLC, zoom (rodah/scroll), geser (drag), reset, ikut live
//
// Semua warna memakai variabel CSS gelap yang sama dengan dashboard; lapisan
// bisa di-toggle dari toolbar legend di atas canvas.
// ═════════════════════════════════════════════════════════════════════════

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fmtPrice, TF_LABEL } from "./fmt";

// ── Warna (selaras tema dashboard) ────────────────────────────────────────
const C = {
  up: "#4ade80",
  down: "#fb7185",
  grid: "rgba(255,255,255,0.055)",
  axis: "#67738a",
  axisBg: "rgba(18,21,28,0.92)",
  text: "#e8ecf3",
  muted: "#9aa5b8",
  ema20: "#f0b429",
  ema50: "#38bdf8",
  entry: "#7dd3fc",
  sl: "#fb7185",
  tp: "#4ade80",
  obBull: "rgba(74,222,128,0.13)",
  obBullB: "rgba(74,222,128,0.55)",
  obBear: "rgba(251,113,133,0.13)",
  obBearB: "rgba(251,113,133,0.55)",
  fvgBull: "rgba(34,211,238,0.10)",
  fvgBullB: "rgba(34,211,238,0.5)",
  fvgBear: "rgba(167,139,250,0.10)",
  fvgBearB: "rgba(167,139,250,0.5)",
  range: "rgba(240,180,41,0.55)",
  snr: "rgba(154,165,184,0.6)",
  liq: "rgba(217,119,87,0.75)",
  eq: "rgba(154,165,184,0.45)",
  prem: "rgba(251,113,133,0.055)",
  disc: "rgba(74,222,128,0.055)",
  cross: "rgba(232,236,243,0.45)",
  rsi: "#c084fc",
  macd: "#f0b429",
  macdSig: "#38bdf8",
};

const PAD_L = 8;
const PAD_R = 70;
const PAD_TOP = 26;
const PAD_BOTTOM = 22;
const OSC_H = 88;
const MIN_BARS = 30;
const MAX_BARS = 260;

const LAYERS = [
  { id: "ema", label: "EMA 20/50", cls: "lay-ema" },
  { id: "plan", label: "Sinyal · Entry/SL/TP", cls: "lay-plan" },
  { id: "zones", label: "Zona OB · FVG · Range", cls: "lay-zones" },
  { id: "snr", label: "S/R · Likuiditas · Premium", cls: "lay-snr" },
];

function timeLabel(t, tf) {
  const d = new Date(t * 1000);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const mon = d.toLocaleString("en-US", { month: "short" });
  if (tf === "1d" || tf === "1w") return `${dd} ${mon}`;
  if (tf === "1mo") return `${mon} ${String(d.getFullYear()).slice(2)}`;
  return `${hh}:${mm}`;
}

export default function SignalChart({ symbolId, tf, symbolLabel }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updated, setUpdated] = useState(null);

  // State tampilan — disimpan di ref agar loop gambar selalu membaca terbaru
  const view = useRef({ count: 90, offset: 0 });
  const layers = useRef({ ema: true, plan: true, zones: true, snr: true });
  const osc = useRef("rsi"); // "rsi" | "macd" | "off"
  const hover = useRef(null); // { x, y, idx }
  const drag = useRef(null);
  const [, force] = useState(0);
  const rerender = () => force((n) => n + 1);

  const dims = useRef({ w: 800, h: 440, dpr: 1 });

  // ── Fetch data (mount + ganti simbol/TF + poll 45 detik) ────────────────
  const load = useCallback(async (first) => {
    if (first) { setLoading(true); setError(null); }
    try {
      const res = await fetch(`/api/chart?symbol=${symbolId}&tf=${tf}`, { cache: "no-store" });
      const j = await res.json();
      if (j?.ok && j.bars?.length > 30) {
        setData(j);
        setUpdated(new Date());
        setError(null);
      } else if (first) {
        setError(j?.error || "Data chart belum tersedia");
      }
    } catch {
      if (first) setError("Gagal terhubung — periksa koneksi internet.");
    } finally {
      if (first) setLoading(false);
    }
  }, [symbolId, tf]);

  useEffect(() => {
    let alive = true;
    (async () => { await load(true); })();
    const id = setInterval(() => alive && load(false), 45 * 1000);
    return () => { alive = false; clearInterval(id); };
  }, [load]);

  // Ganti simbol/TF → snap kembali ke live
  useEffect(() => { view.current = { count: 90, offset: 0 }; }, [symbolId, tf]);

  // ── Geometri harga/bar ──────────────────────────────────────────────────
  const geom = () => {
    const { w, h } = dims.current;
    const oscH = osc.current === "off" ? 0 : OSC_H;
    const plotL = PAD_L, plotR = w - PAD_R;
    const priceT = PAD_TOP;
    const priceB = h - PAD_BOTTOM - (oscH ? oscH + 10 : 0);
    const oscT = priceB + 10, oscB = h - PAD_BOTTOM;
    const n = data?.bars?.length || 0;
    const count = Math.min(view.current.count, n);
    const end = n - view.current.offset;
    const first = Math.max(0, Math.round(end - count));
    const slot = (plotR - plotL) / count;
    return { w, h, plotL, plotR, priceT, priceB, oscT, oscB, oscH, n, count, first, end, slot };
  };

  const xAt = (i, g) => g.plotL + (i - g.first + 0.5) * g.slot;

  // ── Gambar ──────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const d = data;
    if (!canvas || !d?.bars?.length) return;
    const g = geom();
    const { w, h, dpr } = dims.current;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.font = "10.5px -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.textBaseline = "middle";

    const bars = d.bars;
    const L = layers.current;

    // ── Skala harga: kandil + EMA, lalu level (di-clamp agar tak merusak skala)
    let hi = -Infinity, lo = Infinity;
    for (let i = g.first; i < g.end; i++) {
      if (bars[i].h > hi) hi = bars[i].h;
      if (bars[i].l < lo) lo = bars[i].l;
      if (L.ema) {
        if (d.ema20[i] != null) { hi = Math.max(hi, d.ema20[i]); lo = Math.min(lo, d.ema20[i]); }
        if (d.ema50[i] != null) { hi = Math.max(hi, d.ema50[i]); lo = Math.min(lo, d.ema50[i]); }
      }
    }
    const rng0 = hi - lo || d.price * 0.001 || 1;
    const cands = [];
    const pushC = (v) => { if (v != null && isFinite(v)) cands.push(v); };
    if (L.plan && d.plan) {
      if (d.plan.mode === "directional") {
        pushC(d.plan.entry); pushC(d.plan.sl);
        d.plan.tps?.forEach((t) => pushC(t.price));
      } else {
        pushC(d.plan.buy?.entry); pushC(d.plan.buy?.sl);
        pushC(d.plan.sell?.entry); pushC(d.plan.sell?.sl);
      }
    }
    if (L.snr && d.levels) {
      d.levels.snr?.supports?.forEach((s) => pushC(s.price));
      d.levels.snr?.resistances?.forEach((s) => pushC(s.price));
      d.levels.liquidity?.forEach((p) => pushC(p.price));
      pushC(d.levels.premium?.hi); pushC(d.levels.premium?.lo);
      pushC(d.levels.range?.hi); pushC(d.levels.range?.lo);
    }
    if (L.zones) {
      d.levels?.orderBlocks?.forEach((z) => { pushC(z.top); pushC(z.bottom); });
      d.levels?.fvgs?.forEach((z) => { pushC(z.top); pushC(z.bottom); });
    }
    cands.forEach((v) => {
      hi = Math.max(hi, Math.min(v, hi + rng0 * 0.75));
      lo = Math.min(lo, Math.max(v, lo - rng0 * 0.75));
    });
    const rng = hi - lo || rng0;
    const pad = rng * 0.07;
    hi += pad; lo -= pad;
    const span = hi - lo;
    const y = (p) => g.priceB - ((p - lo) / span) * (g.priceB - g.priceT);
    const xR = g.plotR;

    // ── Grid horizontal + label sumbu harga ──────────────────────────────
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
    ctx.fillStyle = C.axis;
    ctx.textAlign = "left";
    const gridN = 6;
    for (let k = 0; k <= gridN; k++) {
      const p = lo + (span * k) / gridN;
      const yy = y(p);
      ctx.beginPath(); ctx.moveTo(g.plotL, yy); ctx.lineTo(xR, yy); ctx.stroke();
      ctx.fillStyle = C.muted;
      ctx.fillText(fmtPrice(symbolId, p), xR + 6, yy);
    }

    // ── Sumbu waktu ──────────────────────────────────────────────────────
    ctx.textAlign = "center";
    const tickEvery = Math.max(1, Math.round(g.count / 6));
    for (let i = g.first; i < g.end; i++) {
      const rel = i - g.first;
      if (rel % tickEvery !== 0) continue;
      const xx = xAt(i, g);
      ctx.beginPath(); ctx.strokeStyle = C.grid;
      ctx.moveTo(xx, g.priceB); ctx.lineTo(xx, g.priceB + 4); ctx.stroke();
      ctx.fillStyle = C.axis;
      ctx.fillText(timeLabel(bars[i].t, tf), xx, g.priceB + 12);
    }

    // ── Premium / Discount (ICT) — arsir latar ───────────────────────────
    if (L.snr && d.levels?.premium) {
      const pm = d.levels.premium;
      if (pm.hi != null && pm.lo != null) {
        const yHi = y(pm.hi), yLo = y(pm.lo), yEq = y(pm.eq);
        ctx.fillStyle = C.prem;
        ctx.fillRect(g.plotL, yHi, xR - g.plotL, Math.max(0, yEq - yHi));
        ctx.fillStyle = C.disc;
        ctx.fillRect(g.plotL, yEq, xR - g.plotL, Math.max(0, yLo - yEq));
        ctx.setLineDash([2, 4]); ctx.strokeStyle = C.eq;
        ctx.beginPath(); ctx.moveTo(g.plotL, yEq); ctx.lineTo(xR, yEq); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = C.axis; ctx.textAlign = "left";
        ctx.fillText("PREMIUM", g.plotL + 6, yHi + 10);
        ctx.fillText("DISKON", g.plotL + 6, yLo - 10);
      }
    }

    // ── Zona Order Block & FVG ───────────────────────────────────────────
    const drawBand = (zi, top, bottom, fill, border, label, lblColor) => {
      const idx = g.n - 1 - zi;
      const x0 = Math.max(g.plotL, xAt(idx, g) - g.slot * 0.5);
      const yT = y(top), yB = y(bottom);
      if (yB < g.priceT || yT > g.priceB) return;
      ctx.fillStyle = fill;
      ctx.fillRect(x0, yT, xR - x0, Math.max(2, yB - yT));
      ctx.strokeStyle = border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, yT); ctx.lineTo(xR, yT); ctx.moveTo(x0, yB); ctx.lineTo(xR, yB); ctx.stroke();
      if (g.slot > 6 && yB - yT > 9) {
        ctx.fillStyle = lblColor; ctx.textAlign = "left";
        ctx.fillText(label, x0 + 4, (yT + yB) / 2);
      }
    };
    if (L.zones && d.levels) {
      (d.levels.orderBlocks || []).forEach((z) => {
        drawBand(z.barsAgo, z.top, z.bottom,
          z.side === "bullish" ? C.obBull : C.obBear,
          z.side === "bullish" ? C.obBullB : C.obBearB,
          z.side === "bullish" ? "OB BULL" : "OB BEAR",
          z.side === "bullish" ? C.obBullB : C.obBearB);
      });
      (d.levels.fvgs || []).forEach((z) => {
        drawBand(z.barsAgo, z.top, z.bottom,
          z.side === "bullish" ? C.fvgBull : C.fvgBear,
          z.side === "bullish" ? C.fvgBullB : C.fvgBearB,
          z.side === "bullish" ? "FVG ▲" : "FVG ▼",
          z.side === "bullish" ? C.fvgBullB : C.fvgBearB);
      });
    }

    // ── Range box 20 bar + level breakout ────────────────────────────────
    if (L.zones && d.levels?.range) {
      const rg = d.levels.range;
      if (rg.hi != null && rg.lo != null) {
        const i0 = Math.max(g.first, g.n - 21);
        const x0 = xAt(i0, g) - g.slot * 0.5;
        ctx.setLineDash([5, 4]); ctx.strokeStyle = C.range; ctx.lineWidth = 1.2;
        ctx.strokeRect(x0, y(rg.hi), xR - x0, y(rg.lo) - y(rg.hi));
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(240,180,41,0.85)"; ctx.textAlign = "left";
        ctx.fillText(rg.status === "RANGE" ? "RANGE 20" : rg.status.replace("_", " "), x0 + 4, y(rg.hi) - 8);
      }
    }

    // ── Garis harga horizontal (tag di kanan) ────────────────────────────
    const drawnTagsY = [];
    const hline = (price, color, { dash = [], width = 1, tag = "", tagColor = null, txt = "#0a0c10" } = {}) => {
      if (price == null) return;
      const yy = y(price);
      if (yy < g.priceT - 12 || yy > g.priceB + 12) return;
      ctx.setLineDash(dash);
      ctx.strokeStyle = color; ctx.lineWidth = width;
      ctx.beginPath(); ctx.moveTo(g.plotL, yy); ctx.lineTo(xR, yy); ctx.stroke();
      ctx.setLineDash([]);
      if (tag) {
        // Geser tag bila bertabrakan dengan tag lain di sumbu harga
        let ty = yy;
        if (drawnTagsY.some((p) => Math.abs(p - ty) < 15)) {
          ty = yy + (yy > (g.priceT + g.priceB) / 2 ? -17 : 17);
        }
        if (ty < g.priceT + 8) ty = g.priceT + 8;
        if (ty > g.priceB - 8) ty = g.priceB - 8;
        drawnTagsY.push(ty);
        const label = `${tag} ${fmtPrice(symbolId, price)}`;
        ctx.font = "bold 10px -apple-system, Segoe UI, Roboto, sans-serif";
        const tw = ctx.measureText(label).width;
        ctx.fillStyle = tagColor || color;
        roundRect(ctx, xR + 2, ty - 8, tw + 8, 16, 3); ctx.fill();
        ctx.fillStyle = txt; ctx.textAlign = "left";
        ctx.fillText(label, xR + 6, ty);
        ctx.font = "10.5px -apple-system, Segoe UI, Roboto, sans-serif";
      }
    };

    // SNR
    if (L.snr && d.levels?.snr) {
      d.levels.snr.resistances?.forEach((s, i) =>
        hline(s.price, C.snr, { dash: [4, 4], tag: `R${i + 1}`, tagColor: "rgba(154,165,184,0.9)", txt: "#0a0c10" }));
      d.levels.snr.supports?.forEach((s, i) =>
        hline(s.price, C.snr, { dash: [4, 4], tag: `S${i + 1}`, tagColor: "rgba(154,165,184,0.9)", txt: "#0a0c10" }));
    }
    // Likuiditas
    if (L.snr && d.levels?.liquidity) {
      d.levels.liquidity.forEach((p) => {
        hline(p.price, C.liq, { dash: [2, 3], width: 1, tag: p.side === "buyside" ? "LIQ-H" : "LIQ-L", tagColor: p.swept ? "rgba(103,115,138,0.9)" : "rgba(217,119,87,0.95)" });
      });
    }
    // Trade plan
    if (L.plan && d.plan) {
      if (d.plan.mode === "directional") {
        const long = d.plan.side === "LONG";
        const col = long ? "rgba(74,222,128,0.07)" : "rgba(251,113,133,0.07)";
        const yEntry = y(d.plan.entry), ySl = y(d.plan.sl);
        const yTp3 = d.plan.tps?.[d.plan.tps.length - 1]?.price;
        if (yTp3 != null) {
          ctx.fillStyle = long ? "rgba(74,222,128,0.05)" : "rgba(251,113,133,0.05)";
          ctx.fillRect(g.plotL, Math.min(yEntry, y(yTp3)), xR - g.plotL, Math.abs(y(yTp3) - yEntry));
        }
        ctx.fillStyle = col;
        ctx.fillRect(g.plotL, Math.min(yEntry, ySl), xR - g.plotL, Math.abs(ySl - yEntry));
        d.plan.tps?.forEach((t) =>
          hline(t.price, C.tp, { dash: [6, 4], tag: t.label, tagColor: "rgba(34,197,94,0.95)" }));
        hline(d.plan.sl, C.sl, { width: 1.4, tag: "SL", tagColor: "rgba(225,29,72,0.95)" });
        hline(d.plan.entry, C.entry, { width: 1.6, tag: long ? "BELI" : "JUAL", tagColor: "rgba(56,189,248,0.95)", txt: "#04121c" });
      } else if (d.plan.mode === "breakout") {
        hline(d.plan.buy?.entry, C.tp, { dash: [7, 4], tag: "BUY STOP", tagColor: "rgba(34,197,94,0.95)" });
        hline(d.plan.sell?.entry, C.sl, { dash: [7, 4], tag: "SELL STOP", tagColor: "rgba(225,29,72,0.95)" });
      }
    }

    // ── EMA ──────────────────────────────────────────────────────────────
    const drawEma = (arr, color) => {
      ctx.strokeStyle = color; ctx.lineWidth = 1.6;
      ctx.beginPath();
      let started = false;
      for (let i = g.first; i < g.end; i++) {
        if (arr[i] == null) continue;
        const xx = xAt(i, g), yy = y(arr[i]);
        if (!started) { ctx.moveTo(xx, yy); started = true; } else ctx.lineTo(xx, yy);
      }
      ctx.stroke();
    };
    if (L.ema) { drawEma(d.ema20, C.ema20); drawEma(d.ema50, C.ema50); }

    // ── Candlestick ──────────────────────────────────────────────────────
    const cw = Math.max(1.5, Math.min(14, g.slot * 0.66));
    for (let i = g.first; i < g.end; i++) {
      const b = bars[i];
      const up = b.c >= b.o;
      const col = up ? C.up : C.down;
      const xx = xAt(i, g);
      ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, cw * 0.35);
      ctx.beginPath(); ctx.moveTo(xx, y(b.h)); ctx.lineTo(xx, y(b.l)); ctx.stroke();
      ctx.fillStyle = col;
      const yO = y(b.o), yC = y(b.c);
      const top = Math.min(yO, yC);
      ctx.fillRect(xx - cw / 2, top, cw, Math.max(1, Math.abs(yC - yO)));
    }

    // ── Label BOS / CHoCH di bar ─────────────────────────────────────────
    if (d.levels?.events && g.slot > 5) {
      d.levels.events.slice(0, 3).forEach((e) => {
        const idx = g.n - 1 - e.barsAgo;
        if (idx < g.first || idx >= g.end) return;
        const b = bars[idx];
        const xx = xAt(idx, g);
        const bull = e.dir === "bullish";
        const rawY = y(bull ? b.l : b.h);
        // Jaga label tetap di dalam area plot
        const yy = bull
          ? Math.min(rawY, g.priceB - 14)
          : Math.max(rawY, g.priceT + 14);
        ctx.font = "bold 9px -apple-system, Segoe UI, Roboto, sans-serif";
        const label = e.type;
        const tw = ctx.measureText(label).width;
        const bx = Math.max(g.plotL, Math.min(xR - tw - 6, xx - tw / 2 - 3));
        ctx.fillStyle = bull ? "rgba(34,197,94,0.95)" : "rgba(225,29,72,0.95)";
        roundRect(ctx, bx, bull ? yy + 5 : yy - 19, tw + 6, 13, 3); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.textAlign = "center";
        ctx.fillText(label, bx + (tw + 6) / 2, bull ? yy + 11.5 : yy - 12.5);
        ctx.font = "10.5px -apple-system, Segoe UI, Roboto, sans-serif";
      });
    }

    // ── Garis harga terakhir (live) ──────────────────────────────────────
    const lastBar = bars[bars.length - 1];
    const lastUp = lastBar.c >= lastBar.o;
    const yLast = y(lastBar.c);
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = lastUp ? C.up : C.down; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(g.plotL, yLast); ctx.lineTo(xR, yLast); ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = "bold 10.5px -apple-system, Segoe UI, Roboto, sans-serif";
    const lp = fmtPrice(symbolId, lastBar.c);
    const ltw = ctx.measureText(lp).width;
    ctx.fillStyle = lastUp ? C.up : C.down;
    roundRect(ctx, xR + 2, yLast - 9, ltw + 8, 18, 3); ctx.fill();
    ctx.fillStyle = "#04120a"; ctx.textAlign = "left";
    ctx.fillText(lp, xR + 6, yLast);
    ctx.font = "10.5px -apple-system, Segoe UI, Roboto, sans-serif";

    // ── Panel osilator ───────────────────────────────────────────────────
    if (g.oscH > 0) {
      ctx.strokeStyle = C.grid;
      ctx.beginPath(); ctx.moveTo(g.plotL, g.oscT); ctx.lineTo(xR, g.oscT); ctx.stroke();
      if (osc.current === "rsi") {
        // band 30/70
        [30, 50, 70].forEach((v) => {
          const yy = g.oscB - ((v - 15) / 70) * (g.oscB - g.oscT);
          ctx.setLineDash(v === 50 ? [2, 4] : []);
          ctx.strokeStyle = v === 50 ? C.grid : "rgba(200,128,252,0.3)";
          ctx.beginPath(); ctx.moveTo(g.plotL, yy); ctx.lineTo(xR, yy); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = C.axis; ctx.textAlign = "left";
          ctx.fillText(String(v), xR + 6, yy);
        });
        ctx.strokeStyle = C.rsi; ctx.lineWidth = 1.5;
        ctx.beginPath(); let st = false;
        for (let i = g.first; i < g.end; i++) {
          const v = d.rsi?.[i];
          if (v == null) continue;
          const xx = xAt(i, g);
          const yy = g.oscB - ((Math.min(85, Math.max(15, v)) - 15) / 70) * (g.oscB - g.oscT);
          if (!st) { ctx.moveTo(xx, yy); st = true; } else ctx.lineTo(xx, yy);
        }
        ctx.stroke();
      } else if (osc.current === "macd") {
        let mHi = 0;
        for (let i = g.first; i < g.end; i++) {
          const m = d.macd?.[i];
          if (m) mHi = Math.max(mHi, Math.abs(m.line), Math.abs(m.signal), Math.abs(m.hist));
        }
        mHi = mHi || 1;
        const yOsc = (v) => g.oscT + (g.oscB - g.oscT) / 2 - (v / mHi) * ((g.oscB - g.oscT) / 2 - 4);
        ctx.strokeStyle = C.grid;
        ctx.beginPath(); ctx.moveTo(g.plotL, yOsc(0)); ctx.lineTo(xR, yOsc(0)); ctx.stroke();
        const hw = Math.max(1, cw * 0.6);
        for (let i = g.first; i < g.end; i++) {
          const m = d.macd?.[i];
          if (!m) continue;
          const xx = xAt(i, g);
          ctx.fillStyle = m.hist >= 0 ? "rgba(74,222,128,0.55)" : "rgba(251,113,133,0.55)";
          ctx.fillRect(xx - hw / 2, yOsc(0), hw, yOsc(m.hist) - yOsc(0));
        }
        const drawMacd = (key, color) => {
          ctx.strokeStyle = color; ctx.lineWidth = 1.4;
          ctx.beginPath(); let st = false;
          for (let i = g.first; i < g.end; i++) {
            const m = d.macd?.[i];
            if (!m) continue;
            const xx = xAt(i, g), yy = yOsc(m[key]);
            if (!st) { ctx.moveTo(xx, yy); st = true; } else ctx.lineTo(xx, yy);
          }
          ctx.stroke();
        };
        drawMacd("line", C.macd); drawMacd("signal", C.macdSig);
      }
    }

    // ── Crosshair + info OHLC ────────────────────────────────────────────
    const hv = hover.current;
    if (hv && hv.idx >= g.first && hv.idx < g.end) {
      const b = bars[hv.idx];
      const xx = xAt(hv.idx, g);
      ctx.setLineDash([4, 4]); ctx.strokeStyle = C.cross; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(xx, g.priceT); ctx.lineTo(xx, g.oscH ? g.oscB : g.priceB); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(g.plotL, hv.y); ctx.lineTo(xR, hv.y); ctx.stroke();
      ctx.setLineDash([]);
      // tag harga di sumbu
      const priceAt = lo + (1 - (hv.y - g.priceT) / (g.priceB - g.priceT)) * span;
      if (hv.y >= g.priceT && hv.y <= g.priceB) {
        const pl = fmtPrice(symbolId, priceAt);
        ctx.font = "bold 10px -apple-system, Segoe UI, Roboto, sans-serif";
        const tw = ctx.measureText(pl).width;
        ctx.fillStyle = "#323c4e";
        roundRect(ctx, xR + 2, hv.y - 8, tw + 8, 16, 3); ctx.fill();
        ctx.fillStyle = C.text; ctx.textAlign = "left";
        ctx.fillText(pl, xR + 6, hv.y);
        ctx.font = "10.5px -apple-system, Segoe UI, Roboto, sans-serif";
      }
      // tag waktu
      const tl = timeLabel(b.t, tf);
      ctx.font = "bold 10px -apple-system, Segoe UI, Roboto, sans-serif";
      const twt = ctx.measureText(tl).width;
      ctx.fillStyle = "#323c4e";
      roundRect(ctx, xx - twt / 2 - 5, g.priceB + 3, twt + 10, 15, 3); ctx.fill();
      ctx.fillStyle = C.text; ctx.textAlign = "center";
      ctx.fillText(tl, xx, g.priceB + 10.5);
      ctx.font = "10.5px -apple-system, Segoe UI, Roboto, sans-serif";

      // Info OHLC kiri-atas
      const chg = b.c - b.o;
      const chgPct = (chg / b.o) * 100;
      const parts = [
        `O ${fmtPrice(symbolId, b.o)}`,
        `H ${fmtPrice(symbolId, b.h)}`,
        `L ${fmtPrice(symbolId, b.l)}`,
        `C ${fmtPrice(symbolId, b.c)}`,
      ];
      ctx.textAlign = "left";
      ctx.font = "10.5px ui-monospace, Menlo, monospace";
      let tx = g.plotL + 6;
      parts.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? C.muted : i === 1 ? C.up : i === 2 ? C.down : C.text;
        ctx.fillText(p, tx, g.priceT - 10);
        tx += ctx.measureText(p).width + 12;
      });
      ctx.fillStyle = chg >= 0 ? C.up : C.down;
      ctx.fillText(`${chg >= 0 ? "+" : ""}${chgPct.toFixed(2)}%`, tx, g.priceT - 10);
      ctx.font = "10.5px -apple-system, Segoe UI, Roboto, sans-serif";
    }
  }, [data, symbolId, tf]);

  // Gambar ulang saat data / ukuran / state berubah
  useEffect(() => { draw(); }, [draw, dims.current.w, dims.current.h]);

  // ── Ukuran canvas responsif + wheel non-passif (zoom tanpa scroll halaman) ─
  const onWheelRef = useRef(null);
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const measure = () => {
      const r = wrap.getBoundingClientRect();
      dims.current = { w: Math.max(320, r.width), h: Math.max(280, r.height), dpr: Math.min(window.devicePixelRatio || 1, 2) };
      draw();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    const wheel = (e) => { e.preventDefault(); onWheelRef.current?.(e); };
    canvas.addEventListener("wheel", wheel, { passive: false });
    return () => { ro.disconnect(); canvas.removeEventListener("wheel", wheel); };
  }, [draw]);
  onWheelRef.current = (e) => {
    const g = geom();
    const delta = e.deltaY < 0 ? -8 : 8;
    view.current.count = Math.max(MIN_BARS, Math.min(MAX_BARS, view.current.count + delta));
    if (view.current.count + view.current.offset > g.n) {
      view.current.offset = Math.max(0, g.n - view.current.count);
    }
    draw();
    rerender();
  };

  // ── Interaksi mouse / sentuh ───────────────────────────────────────────
  const onMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (drag.current) {
      const dx = x - drag.current.x;
      const g = geom();
      const dbars = Math.round(dx / g.slot);
      if (dbars !== drag.current.dbars) {
        view.current.offset = Math.max(0, Math.min(g.n - MIN_BARS, drag.current.offset0 - dbars));
        drag.current.dbars = dbars;
        draw();
        rerender();
      }
      return;
    }
    const g = geom();
    const idx = Math.round(g.first + (x - g.plotL) / g.slot - 0.5);
    hover.current = { x, y, idx: Math.max(g.first, Math.min(g.end - 1, idx)) };
    draw();
  };

  const onDown = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    drag.current = { x: e.clientX - r.left, dbars: 0, offset0: view.current.offset };
  };
  const onUp = () => { drag.current = null; };
  const onLeave = () => { hover.current = null; drag.current = null; draw(); };

  const zoom = (dir) => {
    const g = geom();
    view.current.count = Math.max(MIN_BARS, Math.min(MAX_BARS, view.current.count + (dir > 0 ? -14 : 14)));
    if (view.current.count + view.current.offset > g.n) view.current.offset = Math.max(0, g.n - view.current.count);
    draw();
    rerender();
  };
  const reset = () => { view.current = { count: 90, offset: 0 }; draw(); rerender(); };

  const following = view.current.offset === 0;
  const sigSide = data?.signal?.side;
  const change = data?.signal?.changePct;

  return (
    <div className="sig-chart-wrap">
      {/* Toolbar */}
      <div className="sig-toolbar">
        <div className="sig-tool-left">
          {data?.signal && (
            <span className={`sig-mini-badge ${sigSide === "LONG" ? "long" : sigSide === "SHORT" ? "short" : "neutral"}`}>
              {sigSide === "LONG" ? "▲ LONG" : sigSide === "SHORT" ? "▼ SHORT" : "◆ NETRAL"}
            </span>
          )}
          <span className="sig-price-live">{data ? fmtPrice(symbolId, data.price) : "—"}</span>
          {change != null && (
            <span className={`sig-chg ${change >= 0 ? "up" : "down"}`}>
              {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
            </span>
          )}
          <span className="sig-tf-label">{TF_LABEL[tf] || tf}</span>
        </div>

        <div className="sig-layers">
          {LAYERS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`sig-layer ${layers.current[l.id] ? "on" : ""} ${l.cls}`}
              onClick={() => { layers.current[l.id] = !layers.current[l.id]; draw(); rerender(); }}
              title={`Tampilkan/sembunyikan: ${l.label}`}
            >
              <i className="sig-layer-dot" /> {l.label}
            </button>
          ))}
          <span className="sig-layer-sep" />
          {[{ id: "rsi", label: "RSI" }, { id: "macd", label: "MACD" }, { id: "off", label: "Off" }].map((o) => (
            <button
              key={o.id}
              type="button"
              className={`sig-osc-btn ${osc.current === o.id ? "on" : ""}`}
              onClick={() => { osc.current = o.id; draw(); rerender(); }}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="sig-tool-right">
          {!following && (
            <button type="button" className="sig-live-btn" onClick={reset} title="Kembali ke bar terakhir">
              <span className="pulse-dot" style={{ width: 6, height: 6 }} /> LIVE
            </button>
          )}
          <button type="button" className="sig-icon-btn" onClick={() => zoom(1)} title="Perbesar">＋</button>
          <button type="button" className="sig-icon-btn" onClick={() => zoom(-1)} title="Perkecil">－</button>
          <button type="button" className="sig-icon-btn" onClick={reset} title="Reset tampilan">⟲</button>
        </div>
      </div>

      {/* Canvas */}
      <div ref={wrapRef} className="sig-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="sig-canvas"
          onMouseMove={onMove}
          onMouseDown={onDown}
          onMouseUp={onUp}
          onMouseLeave={onLeave}
          onDoubleClick={reset}
          onTouchStart={(e) => {
            const t = e.touches[0]; const r = canvasRef.current.getBoundingClientRect();
            drag.current = { x: t.clientX - r.left, dbars: 0, offset0: view.current.offset };
          }}
          onTouchMove={(e) => {
            const t = e.touches[0]; const r = canvasRef.current.getBoundingClientRect();
            const x = t.clientX - r.left;
            if (drag.current) {
              const g = geom();
              const dbars = Math.round((x - drag.current.x) / g.slot);
              if (dbars !== drag.current.dbars) {
                view.current.offset = Math.max(0, Math.min(g.n - MIN_BARS, drag.current.offset0 - dbars));
                drag.current.dbars = dbars;
                draw();
                rerender();
              }
            }
          }}
          onTouchEnd={() => { drag.current = null; }}
        />
        {loading && (
          <div className="sig-status">
            <span className="sig-spinner" /> Memuat chart live {symbolLabel}…
          </div>
        )}
        {!loading && error && !data && (
          <div className="sig-status sig-status-err">
            <span>⚠ {error}</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => load(true)}>Coba lagi</button>
          </div>
        )}
      </div>

      <div className="sig-foot">
        <span className="sig-foot-hint">Geser untuk melihat history · scroll untuk zoom · klik 2× untuk reset · <span className="pulse-dot" style={{ width: 5, height: 5 }} /> auto-refresh 45 dtk</span>
        <span className="sig-foot-src">
          {data?.source === "demo" ? "Data simulasi (penyedia live tak terjangkau)" : `Sumber: Yahoo Finance · ${data?.barsCount || ""} bar`}
          {updated ? ` · ${updated.toLocaleTimeString("id-ID")} WIB` : ""}
        </span>
      </div>
    </div>
  );
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
