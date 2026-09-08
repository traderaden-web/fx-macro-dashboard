// app/api/chart/route.js
// GET /api/chart?symbol=gold&tf=1h
// ═════════════════════════════════════════════════════════════════════════
// Data untuk CHART LIVE custom (canvas) di halaman Terminal:
//   • bar OHLC terakhir (180 bar) + sumber data (Yahoo Finance / demo)
//   • seri indikator: EMA20, EMA50, RSI(14), MACD(12,26,9) — sejajar index bar
//   • TRADE PLAN terukur (Entry · SL · TP1/2/3 atau breakout buy/sell stop)
//   • level analisis untuk digambar di chart:
//       SNR (support/resistance), Order Block, FVG, range & breakout,
//       liquidity pool, premium/discount (ICT), event BOS/CHoCH
// Cache 60 detik (bar mentah sendiri ter-cache 5 menit di lib/signals) —
// client polling ~45 detik sehingga chart terasa live tanpa membebani API.
// ═════════════════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getBars, getSignal, TIMEFRAMES } from "../../../lib/signals";
import { analyzeStructure } from "../../../lib/smc";
import { buildTradePlan } from "../../../lib/tradeplan";
import { cached } from "../../../lib/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TTL = 60 * 1000;
const N_BARS = 180;

const INSTRUMENTS = [
  { id: "gold", label: "Gold (XAU/USD)", tv: "TVC:GOLD" },
  { id: "silver", label: "Silver (XAG/USD)", tv: "TVC:SILVER" },
  { id: "wti", label: "Minyak WTI", tv: "TVC:USOIL" },
  { id: "eurusd", label: "EUR/USD", tv: "FX:EURUSD" },
  { id: "gbpusd", label: "GBP/USD", tv: "FX:GBPUSD" },
  { id: "usdjpy", label: "USD/JPY", tv: "FX:USDJPY" },
  { id: "usdchf", label: "USD/CHF", tv: "FX:USDCHF" },
  { id: "audusd", label: "AUD/USD", tv: "FX:AUDUSD" },
  { id: "usdcad", label: "USD/CAD", tv: "FX:USDCAD" },
  { id: "nzdusd", label: "NZD/USD", tv: "FX:NZDUSD" },
  { id: "dxy", label: "Dollar Index (DXY)", tv: "TVC:DXY" },
];

const r6 = (v) => (v == null || !isFinite(v) ? null : Number(v.toPrecision(6)));
const r2 = (v) => (v == null || !isFinite(v) ? null : Math.round(v * 100) / 100);

// ── Indikator sebagai SERI (panjang = jumlah bar, sejajar index) ─────────
function emaSeries(vals, period) {
  const out = new Array(vals.length).fill(null);
  if (vals.length < period) return out;
  const k = 2 / (period + 1);
  let e = vals.slice(0, period).reduce((a, b) => a + b, 0) / period;
  out[period - 1] = e;
  for (let i = period; i < vals.length; i++) {
    e = vals[i] * k + e * (1 - k);
    out[i] = e;
  }
  return out;
}

function rsiSeries(vals, period = 14) {
  const out = new Array(vals.length).fill(null);
  if (vals.length < period + 1) return out;
  let gain = 0, loss = 0;
  for (let i = 1; i <= period; i++) {
    const d = vals[i] - vals[i - 1];
    if (d >= 0) gain += d; else loss -= d;
  }
  let avgG = gain / period, avgL = loss / period;
  out[period] = avgL === 0 ? 100 : 100 - 100 / (1 + avgG / avgL);
  for (let i = period + 1; i < vals.length; i++) {
    const d = vals[i] - vals[i - 1];
    avgG = (avgG * (period - 1) + Math.max(d, 0)) / period;
    avgL = (avgL * (period - 1) + Math.max(-d, 0)) / period;
    out[i] = avgL === 0 ? 100 : 100 - 100 / (1 + avgG / avgL);
  }
  return out;
}

function macdSeries(vals) {
  const e12 = emaSeries(vals, 12);
  const e26 = emaSeries(vals, 26);
  const line = vals.map((_, i) => (e12[i] != null && e26[i] != null ? e12[i] - e26[i] : null));
  const out = new Array(vals.length).fill(null);
  const idx = [], lv = [];
  line.forEach((v, i) => { if (v != null) { idx.push(i); lv.push(v); } });
  if (lv.length >= 9) {
    const sig = emaSeries(lv, 9);
    idx.forEach((bi, k) => {
      if (sig[k] != null) out[bi] = { line: r6(line[bi]), signal: r6(sig[k]), hist: r6(line[bi] - sig[k]) };
    });
  }
  return out;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbolId = searchParams.get("symbol") || "gold";
  const tf = searchParams.get("tf") || "1h";

  const symbol = INSTRUMENTS.find((s) => s.id === symbolId);
  if (!symbol) return NextResponse.json({ ok: false, error: "simbol tidak dikenal" }, { status: 400 });
  if (!TIMEFRAMES.includes(tf)) return NextResponse.json({ ok: false, error: "timeframe tidak dikenal" }, { status: 400 });

  try {
    const data = await cached(`chart:${symbolId}:${tf}`, TTL, async () => {
      const [sigRes, barsRes] = await Promise.all([
        getSignal(symbolId, tf, { skipCooldown: true }).catch(() => null),
        getBars(symbolId, tf),
      ]);
      const bars = barsRes.bars;
      const ta = analyzeStructure(bars);
      const price = bars[bars.length - 1].c;
      const dir = sigRes?.ok ? sigRes.signal : "NETRAL";
      const plan =
        sigRes?.ok && ta
          ? buildTradePlan({ symbolId, dir, price: sigRes.price, atr: sigRes.atr, ta })
          : null;

      // ── Seri indikator lalu pangkas ke N_BARS terakhir ───────────────
      const closes = bars.map((b) => b.c);
      const e20 = emaSeries(closes, 20);
      const e50 = emaSeries(closes, 50);
      const rsi = rsiSeries(closes, 14);
      const macd = macdSeries(closes);

      const start = Math.max(0, bars.length - N_BARS);
      const tailBars = bars.slice(start);
      const tail = (arr, f) => arr.slice(start).map(f);

      return {
        ok: true,
        updated: new Date().toISOString(),
        symbol: { id: symbol.id, label: symbol.label, tv: symbol.tv },
        tf,
        source: barsRes.source,
        price: r6(price),
        atr: ta?.atr ?? sigRes?.atr ?? null,
        signal: sigRes?.ok
          ? {
              side: sigRes.signal,
              score: sigRes.score,
              strength: sigRes.strength,
              changePct: sigRes.changePct,
              changeBasis: sigRes.changeBasis,
              indicators: sigRes.indicators,
            }
          : null,
        barsCount: bars.length,
        lastBar: new Date(bars[bars.length - 1].t * 1000).toISOString(),
        bars: tailBars.map((b) => ({ t: b.t, o: r6(b.o), h: r6(b.h), l: r6(b.l), c: r6(b.c) })),
        ema20: tail(e20, r6),
        ema50: tail(e50, r6),
        rsi: tail(rsi, r2),
        macd: tail(macd, (v) => v),
        // Level & zona untuk digambar di chart (barsAgo relatif ke bar terakhir)
        plan: plan
          ? plan.mode === "directional"
            ? {
                mode: "directional",
                side: plan.side,
                entry: plan.entry,
                sl: plan.sl,
                riskPips: plan.riskPips,
                tps: plan.tps.map((t) => ({ label: t.label, price: t.price, rr: t.rr })),
              }
            : {
                mode: "breakout",
                buy: { entry: plan.neutral?.buy?.entry ?? null, sl: plan.neutral?.buy?.sl ?? null },
                sell: { entry: plan.neutral?.sell?.entry ?? null, sl: plan.neutral?.sell?.sl ?? null },
                range: plan.neutral?.range ?? null,
              }
          : null,
        levels: ta
          ? {
              bias: ta.structure?.bias || "RANGE",
              events: (ta.structure?.events || []).slice(0, 4),
              snr: ta.snr,
              orderBlocks: ta.orderBlocks,
              fvgs: ta.fvgs,
              liquidity: ta.liquidity,
              range: ta.range,
              premium: ta.premium,
            }
          : null,
      };
    });

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.message || "gagal memuat data chart" },
      { status: 502 }
    );
  }
}
