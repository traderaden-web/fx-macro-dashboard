// app/api/terminal/route.js
// GET /api/terminal?symbol=gold&tf=1h
// ═════════════════════════════════════════════════════════════════════════
// Endpoint gabungan untuk halaman Terminal: satu panggilan mengembalikan
//   • sinyal teknikal (EMA/RSI/MACD/ATR) timeframe aktif
//   • TRADE PLAN terukur: Entry · SL · TP1/2/3 · R:R · pip
//   • SMC: struktur pasar (BOS/CHoCH), Order Block, FVG, liquidity sweep
//   • ICT: premium/discount, OTE, liquidity pool
//   • SNR: support/resistance terklaster + kekuatan sentuhan
//   • BREAKOUT: kotak range, status, retest, target measured-move
//   • CHART PATTERN klasik bullish & bearish (H&S, double top/bottom, dst.)
//   • Pola candlestick timeframe aktif
//   • Matriks ringkas SEMUA 7 timeframe (sinyal + struktur + plan mini)
// Di-cache 5 menit per (simbol, tf); antar-timeframe berbagi cache bar.
// ═════════════════════════════════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getSignal, getBars, TIMEFRAMES } from "../../../lib/signals";
import { detectPatterns, topPattern } from "../../../lib/patterns";
import { analyzeStructure } from "../../../lib/smc";
import { buildTradePlan } from "../../../lib/tradeplan";
import { confluenceScore, setupGrade, detectRegime } from "../../../lib/confluence";
import { cached } from "../../../lib/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const TTL = 5 * 60 * 1000;

const INSTRUMENTS = [
  { id: "gold", label: "Gold (XAU/USD)", kind: "gold", tv: "TVC:GOLD" },
  { id: "silver", label: "Silver (XAG/USD)", kind: "gold", tv: "TVC:SILVER" },
  { id: "wti", label: "Minyak WTI", kind: "commodity", tv: "TVC:USOIL" },
  { id: "eurusd", label: "EUR/USD", kind: "fx", tv: "FX:EURUSD" },
  { id: "gbpusd", label: "GBP/USD", kind: "fx", tv: "FX:GBPUSD" },
  { id: "usdjpy", label: "USD/JPY", kind: "fx", tv: "FX:USDJPY" },
  { id: "usdchf", label: "USD/CHF", kind: "fx", tv: "FX:USDCHF" },
  { id: "audusd", label: "AUD/USD", kind: "fx", tv: "FX:AUDUSD" },
  { id: "usdcad", label: "USD/CAD", kind: "fx", tv: "FX:USDCAD" },
  { id: "nzdusd", label: "NZD/USD", kind: "fx", tv: "FX:NZDUSD" },
  { id: "dxy", label: "Dollar Index (DXY)", kind: "index", tv: "TVC:DXY" },
];

/** Analisis penuh satu timeframe: sinyal + SMC + plan. */
async function analyzeTF(symbolId, tf) {
  const { bars } = await getBars(symbolId, tf);
  const ta = analyzeStructure(bars);
  const pats = detectPatterns(bars);
  return { bars, ta, pats };
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbolId = searchParams.get("symbol") || "gold";
  const tf = searchParams.get("tf") || "1h";

  const symbol = INSTRUMENTS.find((s) => s.id === symbolId);
  if (!symbol) {
    return NextResponse.json({ ok: false, error: "simbol tidak dikenal" }, { status: 400 });
  }
  if (!TIMEFRAMES.includes(tf)) {
    return NextResponse.json({ ok: false, error: "timeframe tidak dikenal" }, { status: 400 });
  }

  try {
    const data = await cached(`terminal:${symbolId}:${tf}`, TTL, async () => {
      // ── Timeframe aktif: sinyal + struktur + pola + plan ────────────
      const [sig, main] = await Promise.all([
        getSignal(symbolId, tf, { skipCooldown: true }),
        analyzeTF(symbolId, tf),
      ]);
      const price = sig?.ok ? sig.price : main.ta?.price;
      const plan =
        sig?.ok && price
          ? buildTradePlan({ symbolId, dir: sig.signal, price, atr: sig.atr, ta: main.ta })
          : null;

      // ── Matriks semua timeframe (ringkas, tahan-gagal per TF) ───────
      const settled = await Promise.allSettled(
        TIMEFRAMES.map(async (t) => {
          const s = await getSignal(symbolId, t, { skipCooldown: true });
          const a = await analyzeTF(symbolId, t);
          const p = s?.ok ? buildTradePlan({ symbolId, dir: s.signal, price: s.price, atr: s.atr, ta: a.ta }) : null;
          const top = topPattern(a.bars);
          return {
            tf: t,
            ok: !!s?.ok,
            signal: s?.signal || null,
            score: s?.score ?? null,
            changePct: s?.changePct ?? null,
            price: s?.price ?? a.ta?.price ?? null,
            atr: s?.atr ?? a.ta?.atr ?? null,
            bias: a.ta?.structure?.bias || "RANGE",
            regime: a.ta?.range?.status || "RANGE",
            topPattern: top ? { name: top.name, dir: top.dir, strength: Math.round(top.strength) } : null,
            patternCount: a.pats.length,
            chartPattern: a.ta?.chartPatterns?.[0]
              ? { name: a.ta.chartPatterns[0].name, dir: a.ta.chartPatterns[0].dir, status: a.ta.chartPatterns[0].status }
              : null,
            plan: p
              ? p.mode === "directional"
                ? {
                    mode: "directional", side: p.side, entry: p.entry, sl: p.sl,
                    tp1: p.tps?.[0]?.price ?? null, rr: p.tps?.[0]?.rr ?? null,
                    riskPips: p.riskPips,
                  }
                : {
                    mode: "breakout", side: "NETRAL",
                    buyStop: p.neutral?.buy?.entry ?? null, sellStop: p.neutral?.sell?.entry ?? null,
                  }
              : null,
          };
        })
      );
      const matrix = TIMEFRAMES.map((t, i) => {
        const r = settled[i];
        return r.status === "fulfilled" ? r.value : { tf: t, ok: false };
      });

      // Confluence / grade / regime dari matriks (kompatibel dgn halaman lama)
      const matrixTfs = matrix.map((m) => ({ tf: m.tf, ok: m.ok !== false && !!m.signal, signal: m.signal || "NETRAL" }));
      const confluence = confluenceScore(matrixTfs);
      const grade = setupGrade(matrixTfs);
      const regime = detectRegime(matrixTfs);

      return {
        ok: true,
        updated: new Date().toISOString(),
        symbol,
        tf,
        signal: sig?.ok ? sig : null,
        signalError: sig?.ok === false ? sig.error || "data belum cukup" : null,
        plan,
        smc: main.ta
          ? {
              price: main.ta.price,
              atr: main.ta.atr,
              structure: main.ta.structure,
              orderBlocks: main.ta.orderBlocks,
              fvgs: main.ta.fvgs,
              liquidity: main.ta.liquidity,
              premium: main.ta.premium,
            }
          : null,
        snr: main.ta?.snr || null,
        breakout: main.ta?.range || null,
        chartPatterns: main.ta?.chartPatterns || [],
        candlePatterns: main.pats.slice(0, 6).map((p) => ({
          name: p.name, dir: p.dir, strength: Math.round(p.strength), barsAgo: main.bars.length - 1 - p.idx,
        })),
        matrix,
        confluence,
        grade,
        regime,
      };
    });

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.message || "gagal membangun analisis terminal" },
      { status: 502 }
    );
  }
}
