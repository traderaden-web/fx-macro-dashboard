// components/Copilot.jsx
// Asisten chat "Copilot" — menjawab pertanyaan trader berbasis data MacroLab,
// dengan dukungan LLM (bila key di-set di Pengaturan) + fallback rule-based.
// Sumber jawaban ditunjukkan di header (& READY/LLM/RULES).

"use client";

import { useEffect, useRef, useState } from "react";
import { IconLightbulb } from "./Icons";
import { loadLLMSettings, hasLLMSettings } from "../lib/llmSettings";

const SUGGESTIONS = [
  "Setup gold hari ini?",
  "Bagaimana sentimen pasar?",
  "Rilis penting berikutnya?",
  "Cara hitung lot yang aman?",
];

export default function Copilot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Halo! Saya Copilot MacroLab. Tanya apa pun soal setup teknikal, sentimen pasar, jadwal rilis, atau manajemen risiko." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("rules");
  const [llmOn, setLlmOn] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setLlmOn(hasLLMSettings());
  }, []);

  async function send(text) {
    const q = (text || "").trim();
    if (!q || loading) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);
    try {
      const s = loadLLMSettings();
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, apiKey: s.apiKey, provider: s.provider, model: s.model }),
      });
      const d = await res.json();
      setSource(d.source || "rules");
      setMessages((m) => [...m, { role: "bot", text: d.text || d.error || "Maaf, terjadi kendala." }]);
    } catch {
      setMessages((m) => [...m, { role: "bot", text: "Maaf, layanan sedang tidak tersedia." }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 60);
    }
  }

  return (
    <div className="copilot">
      <div className="copilot-head">
        <span className="copilot-avatar"><IconLightbulb size={16} /></span>
        <div>
          <strong>Copilot MacroLab</strong>
          <span className="copilot-sub">{llmOn ? "Asisten LLM · data MacroLab" : "Asisten rule-based · data MacroLab"}</span>
        </div>
        <span className={`live-pill ${llmOn ? "" : "off"}`}>
          <span className="pulse-dot" /> {llmOn ? "LLM" : "RULES"}
        </span>
      </div>
      <div className="copilot-log" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="msg-text">{m.text}</div>
          </div>
        ))}
        {loading && <div className="msg bot"><div className="msg-text">Menganalisis…</div></div>}
      </div>
      <div className="copilot-suggest">
        {SUGGESTIONS.map((s) => (
          <button key={s} className="chip-suggest" onClick={() => send(s)} disabled={loading}>{s}</button>
        ))}
      </div>
      <form className="copilot-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tanya…" disabled={loading} />
        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>Kirim</button>
      </form>
      <div className="copilot-foot cell-muted">
        {source === "llm" ? "Dijawab oleh model LLM (OpenAI/Gemini/Anthropic)." : "Dijawab oleh mesin aturan internal."} · Bukan nasihat investasi.
      </div>
    </div>
  );
}
