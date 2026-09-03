// lib/llmSettings.js
// Pengelola pengaturan LLM milik pengguna (disimpan di localStorage).
// Karena bersifat personal & hanya dipakai di browser, key disimpan lokal
// dan dikirim ke /api/copilot & /api/llm/test per-request (tidak di commit).

const KEY = "macrolab.llm";

export function loadLLMSettings() {
  try { return JSON.parse(localStorage.getItem(KEY)) || { provider: "", apiKey: "", model: "" }; }
  catch { return { provider: "", apiKey: "", model: "" }; }
}
export function saveLLMSettings(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
}
export function hasLLMSettings() {
  const s = loadLLMSettings();
  return Boolean(s.apiKey);
}
