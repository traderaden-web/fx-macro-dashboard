// components/LlmSettings.jsx
// Pengaturan LLM milik pengguna (provider, API key, model) + tombol "Tes Koneksi".
// Key disimpan di localStorage dan dikirim per-request (tidak pernah di-commit).

"use client";

import { useEffect, useState } from "react";
import { loadLLMSettings, saveLLMSettings, hasLLMSettings } from "../lib/llmSettings";

const PROVIDERS = [
  { id: "openai", label: "OpenAI", defaultModel: "gpt-4o-mini", envVar: "OPENAI_API_KEY" },
  { id: "gemini", label: "Google Gemini", defaultModel: "gemini-1.5-flash", envVar: "GEMINI_API_KEY" },
  { id: "anthropic", label: "Anthropic Claude", defaultModel: "claude-3-5-haiku-20241022", envVar: "ANTHROPIC_API_KEY" },
];

export default function LlmSettings() {
  const [form, setForm] = useState({ provider: "openai", apiKey: "", model: "" });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const s = loadLLMSettings();
    setForm(s.provider ? s : { provider: "openai", apiKey: "", model: "" });
  }, []);

  const provider = PROVIDERS.find((p) => p.id === form.provider);

  function update(patch) { setForm((f) => ({ ...f, ...patch })); setSaved(false); setResult(null); }

  function save() {
    saveLLMSettings(form);
    setSaved(true);
    setResult({ ok: true, msg: "Pengaturan disimpan di browser." });
  }

  async function test() {
    if (!form.apiKey.trim()) return setResult({ ok: false, msg: "Isi API key dulu." });
    setTesting(true); setResult(null);
    try {
      const res = await fetch("/api/llm/test", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      setResult(d.ok ? { ok: true, msg: `✅ Koneksi OK — model menjawab: "${d.reply || "OK"}"` } : { ok: false, msg: d.error || "Tes gagal." });
    } catch { setResult({ ok: false, msg: "Gagal menghubungi server." }); }
    setTesting(false);
  }

  return (
    <div className="panel-card">
      <h3 style={{ marginTop: 0 }}>Copilot LLM (opsional)</h3>
      <p className="cell-muted" style={{ marginTop: 0, fontSize: 13 }}>
        Tanpa key, Copilot tetap berjalan memakai mesin aturan. Isi key di bawah untuk menjawab
        pertanyaan dengan <b>model sungguhan</b> (OpenAI / Gemini / Claude). Key disimpan hanya di
        browser Anda &amp; dikirim per-permintaan — tidak pernah di-commit.
      </p>

      <div className="calc-inputs" style={{ marginTop: 10 }}>
        <label className="field">
          <span className="field-label">Penyedia</span>
          <div className="field-input">
            <select value={form.provider} onChange={(e) => update({ provider: e.target.value, model: "" })}>
              {PROVIDERS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
        </label>
        <label className="field">
          <span className="field-label">API Key</span>
          <div className="field-input">
            <input value={form.apiKey} onChange={(e) => update({ apiKey: e.target.value })} type="password" placeholder={provider?.envVar} />
          </div>
        </label>
        <label className="field">
          <span className="field-label">Model (opsional)</span>
          <div className="field-input">
            <input value={form.model} onChange={(e) => update({ model: e.target.value })} placeholder={provider?.defaultModel} />
          </div>
          <span className="field-hint">Kosongkan untuk memakai default {provider?.defaultModel}.</span>
        </label>

        <div className="llm-actions">
          <button className="btn btn-primary" onClick={save} disabled={testing}>{saved ? "Tersimpan ✓" : "Simpan"}</button>
          <button className="btn btn-ghost" onClick={test} disabled={testing}>{testing ? "Menguji…" : "Tes Koneksi"}</button>
        </div>

        {result && (
          <div className={`notice ${result.ok ? "" : "notice-warn"}`} style={{ margin: "8px 0 0" }}>
            {result.msg}
          </div>
        )}
      </div>
    </div>
  );
}
