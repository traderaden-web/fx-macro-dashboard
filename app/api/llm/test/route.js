// app/api/llm/test/route.js
// POST /api/llm/test  { provider, apiKey, model }  → uji koneksi LLM dengan
// prompt minimal ("Balas dengan kata OK"). Mengembalikan ok + pesan model.
// Key dari body diutamakan; bila kosong, pakai env.

import { NextResponse } from "next/server";
import { askLLM, llmProvider } from "../../../../lib/llm";

export const dynamic = "force-dynamic";

export async function POST(req) {
  let body = {};
  try { body = await req.json(); } catch { /* no-op */ }
  const provider = body?.provider || llmProvider();
  const model = body?.model;
  const apiKey = body?.apiKey;

  // Suntikkan key sementara ke env agar lib/llm memakainya.
  const prev = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    GEMINI_MODEL: process.env.GEMINI_MODEL,
    ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL,
  };
  if (!provider) return NextResponse.json({ ok: false, error: "provider belum diatur / tidak ada key env" }, { status: 400 });

  // Pilih env var sesuai provider.
  const keyVar = provider === "openai" ? "OPENAI_API_KEY" : provider === "gemini" ? "GEMINI_API_KEY" : "ANTHROPIC_API_KEY";
  const modelVar = provider === "openai" ? "OPENAI_MODEL" : provider === "gemini" ? "GEMINI_MODEL" : "ANTHROPIC_MODEL";
  try {
    process.env[keyVar] = apiKey || process.env[keyVar];
    if (model) process.env[modelVar] = model;

    const raw = await askLLM("Jawab dengan satu kata: OK.", "Tes koneksi, silakan jawab OK.", { provider });
    if (raw == null) {
      return NextResponse.json({ ok: false, error: "Penyedia tidak tersedia atau gagal (periksa key/model & koneksi jaringan)." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, provider, model: process.env[modelVar] || null, reply: raw.slice(0, 80) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 502 });
  } finally {
    // Pulihkan env agar tidak bocor antar request.
    process.env.OPENAI_API_KEY = prev.OPENAI_API_KEY;
    process.env.GEMINI_API_KEY = prev.GEMINI_API_KEY;
    process.env.ANTHROPIC_API_KEY = prev.ANTHROPIC_API_KEY;
    process.env.OPENAI_MODEL = prev.OPENAI_MODEL;
    process.env.GEMINI_MODEL = prev.GEMINI_MODEL;
    process.env.ANTHROPIC_MODEL = prev.ANTHROPIC_MODEL;
  }
}
