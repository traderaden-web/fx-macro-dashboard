// app/api/copilot/route.js
// POST /api/copilot  { question }  → jawaban asisten.
// 1) Jika API key LLM tersedia (OPENAI/GEMINI/ANTHROPIC) → pakai LLM dengan
//    prompt yang menyuntikkan data MacroLab (sinyal teknikal, currency strength,
//    risk bias, VIX, rilis terdekat).
// 2) Tanpa key atau LLM gagal → fallback ke engine rule-based (lib/copilot.js).

import { NextResponse } from "next/server";
import { getForexRates } from "../../../lib/forex";
import { getSignalMatrix } from "../../../lib/signals";
import { computeCurrencyStrength, riskBias } from "../../../lib/strength";
import { getSeriesData } from "../../../lib/data";
import { answerCopilot } from "../../../lib/copilot";
import { askLLM, llmProvider } from "../../../lib/llm";

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
      .map((r, i) => (r.status === "fulfilled" ? { ...INSTRUMENTS[i], ...r.value, tfs: r.value.tfs || [] } : null))
      .filter(Boolean);

    let events = [];
    try {
      const { UPCOMING } = await import("../../../data/calendar");
      events = UPCOMING.slice(0, 6).map((e) => ({ title: e.title, date: e.date, time: e.time }));
    } catch { /* no-op */ }

    const ctx = { matrix, strength, bias, vix: vixSeries?.last?.value ?? null, events };

    // 1) Coba LLM bila tersedia.
    const provider = llmProvider();
    if (provider) {
      const system = buildSystemPrompt(ctx);
      const raw = await askLLM(system, question, { provider });
      if (raw) {
        // Bersihkan markdown ringan & formatting berlebih dari model.
        const text = cleanLLM(raw);
        return NextResponse.json({ ok: true, source: "llm", provider, text });
      }
    }

    // 2) Fallback rule-based.
    const res = answerCopilot(question, ctx);
    return NextResponse.json({ ok: true, source: "rules", ...res });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}

// Prompt sistem yang menyuntikkan seluruh data MacroLab agar LLM menjawab
// dengan angka & konteks nyata, bukan generalisasi.
function buildSystemPrompt(ctx) {
  const tech = ctx.matrix
    .map((m) => {
      const tfs = (m.tfs || []).filter((t) => t.ok).map((t) => `${t.tf} ${t.signal} (${t.score})`).join(", ");
      return `- ${m.label}: ${tfs || "data belum cukup"}`;
    })
    .join("\n");

  const strengthTxt = ctx.strength
    .map((s) => `${s.currency} (${s.score}, ${s.pct > 0 ? "+" : ""}${s.pct}%)`)
    .join(", ");

  const evTxt = ctx.events?.length
    ? ctx.events.map((e) => `${e.title} (${e.date.slice(8, 10)}/${e.date.slice(5, 7)} ${e.time} WIB)`).join(" · ")
    : "tidak ada";

  return [
    "Kamu adalah Copilot MacroLab, asisten analitis untuk ritel trader forex (berbahasa Indonesia).",
    "Jawab dengan ringkas, berbasis data, dan jelas. Pisahkan analisis dari nasihat. Selalu akhiri dengan pengingat bahwa ini bukan nasihat investasi resmi.",
    "",
    "DATA MAKROLAB SAAT INI:",
    `- Risk appetite: ${ctx.bias?.label || "netral"} (gap ${ctx.bias?.gap ?? "—"}; risk-on ${ctx.bias?.riskOn ?? "—"} vs risk-off ${ctx.bias?.riskOff ?? "—"})`,
    `- VIX: ${ctx.vix != null ? Number(ctx.vix).toFixed(1) : "tidak ada"}`,
    `- Kekuatan mata uang (0-100): ${strengthTxt || "tidak ada"}`,
    "",
    "SINYAL TEKNIKAL MULTI-TIMEFRAME:",
    tech || "tidak ada",
    "",
    "RILIS TERDEKAT:",
    evTxt,
    "",
    "Jawab pertanyaan trader berikut dengan memakai data di atas bila relevan.",
  ].join("\n");
}

function cleanLLM(text) {
  return String(text)
    .replace(/```[a-z]*\n?/gi, "")
    .replace(/\*\*/g, "")
    .replace(/\s+\n/g, "\n")
    .trim();
}
