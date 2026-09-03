// app/api/copilot/route.js
// POST /api/copilot  { question }  → jawaban dari asisten berbasis data MacroLab.
// Menyuntikkan konteks nyata (matrix sinyal, currency strength, risk bias, VIX,
// rilis terdekat) ke engine aturan.

import { NextResponse } from "next/server";
import { getForexRates } from "../../../lib/forex";
import { getSignalMatrix } from "../../../lib/signals";
import { computeCurrencyStrength, riskBias } from "../../../lib/strength";
import { getSeriesData } from "../../../lib/data";
import { answerCopilot } from "../../../lib/copilot";

export const dynamic = "force-dynamic";

const INSTRUMENTS = [
  { id: "gold", label: "Gold (XAU/USD)" },
  { id: "silver", label: "Silver (XAG/USD)" },
  { id: "wti", label: "Minyak WTI" },
  { id: "eurusd", label: "EUR/USD" },
  { id: "gbpusd", label: "GBP/USD" },
  { id: "usdjpy", label: "USD/JPY" },
  { id: "audusd", label: "AUD/USD" },
  { id: "usdcad", label: "USD/CAD" },
  { id: "nzdusd", label: "NZD/USD" },
  { id: "dxy", label: "Dollar Index (DXY)" },
];

export async function POST(req) {
  let question = "";
  try {
    const body = await req.json();
    question = body?.question || "";
  } catch { /* no-op */ }

  try {
    // ── Konteks live (paralel) ──
    const [fx, vixSeries, matrices] = await Promise.all([
      getForexRates().catch(() => ({ pairs: [] })),
      getSeriesData("vix").catch(() => null),
      Promise.allSettled(INSTRUMENTS.map((inst) => getSignalMatrix(inst.id))),
    ]);

    const strength = computeCurrencyStrength(fx.pairs || []);
    const bias = riskBias(strength);

    const matrix = matrices
      .map((r, i) =>
        r.status === "fulfilled" ? { ...INSTRUMENTS[i], ...r.value, tfs: r.value.tfs || [] } : null
      )
      .filter(Boolean);

    // Rilis penting terdekat (dari lib/impact / calendar — pakai data seed ringan).
    let events = [];
    try {
      const { UPCOMING } = await import("../../../data/calendar");
      events = UPCOMING.slice(0, 6).map((e) => ({ title: e.title, date: e.date, time: e.time }));
    } catch { /* no-op */ }

    const ctx = {
      matrix,
      strength,
      bias,
      vix: vixSeries?.last?.value ?? null,
      events,
    };

    const res = answerCopilot(question, ctx);
    return NextResponse.json({ ok: true, ...res });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
