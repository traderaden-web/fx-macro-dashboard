// lib/llm.js
// Integrasi LLM sungguhan untuk Copilot. Mendukung beberapa penyedia via env:
//   OPENAI_API_KEY      → OpenAI chat completions (gpt-4o-mini, dll)
//   GEMINI_API_KEY      → Google Gemini (gemini-1.5-flash / gemini-2.0-flash)
//   ANTHROPIC_API_KEY   → Anthropic Claude (claude-3-5-haiku / sonnet)
// Bila tidak ada key, kembalikan null sehingga pemanggil (api/copilot) memakai
// fallback rule-based. Semua panggilan memakai timeout & error handling aman.

const TIMEOUT = 15000;

async function withTimeout(p, ms = TIMEOUT) {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("LLM timeout")), ms))]);
}

function buildMessages(system, user) {
  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

/** Deteksi penyedia tersedia dari env. */
export function llmProvider() {
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return null;
}

/**
 * Tanya LLM. `system` = instruksi+data MacroLab, `user` = pertanyaan trader.
 * @returns {Promise<string|null>} jawaban teks, atau null bila tak ada key / gagal.
 */
export async function askLLM(system, user, { provider } = {}) {
  const p = provider || llmProvider();
  if (!p) return null;
  try {
    if (p === "openai") return await askOpenAI(system, user);
    if (p === "gemini") return await askGemini(system, user);
    if (p === "anthropic") return await askAnthropic(system, user);
  } catch (e) {
    // Log tapi jangan crash — biarkan caller fallback.
    console.error(`[llm] ${p} gagal:`, e?.message || e);
  }
  return null;
}

async function askOpenAI(system, user) {
  const res = await withTimeout(fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: buildMessages(system, user),
      temperature: 0.4,
      max_tokens: 700,
    }),
  }));
  if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
}

async function askGemini(system, user) {
  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const res = await withTimeout(fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 700 },
    }),
  }));
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((x) => x.text).join("")?.trim();
  return text || null;
}

async function askAnthropic(system, user) {
  const res = await withTimeout(fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-20241022",
      max_tokens: 700,
      system,
      messages: [{ role: "user", content: user }],
    }),
  }));
  if (!res.ok) throw new Error(`Anthropic HTTP ${res.status}`);
  const data = await res.json();
  return data?.content?.[0]?.text?.trim() || null;
}
