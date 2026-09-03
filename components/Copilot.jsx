// components/Copilot.jsx
// Asisten chat "Copilot" — menjawab pertanyaan trader berbasis data MacroLab.
// Cocokkan pertanyaan → jawaban aturan → tampilkan pesan chat sederhana.

"use client";

import { useRef, useState } from "react";
import { IconLightbulb, IconSend } from "./Icons";

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
  const scrollRef = useRef(null);

  async function send(text) {
    const q = (text || "").trim();
    if (!q || loading) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const d = await res.json();
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
          <span className="copilot-sub">Asisten berbasis data real-time</span>
        </div>
        <span className="live-pill"><span className="pulse-dot" /> READY</span>
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
        <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
          <IconSend size={14} /> Kirim
        </button>
      </form>
    </div>
  );
}
