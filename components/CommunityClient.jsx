// components/CommunityClient.jsx
// Komunitas & Leaderboard Prediksi Rilis: prediksi NFP/CPI/FOMC, lihat akurasi
// historis & leaderboard. Data dari /api/predictions.

"use client";

import { useEffect, useState } from "react";
import { IconTarget, IconUsers } from "./Icons";

export default function CommunityClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // Form state
  const [selIdx, setSelIdx] = useState(0);
  const [name, setName] = useState("");
  const [predicted, setPredicted] = useState("");
  const [note, setNote] = useState("");

  async function load(refresh = false) {
    try {
      const res = await fetch(`/api/predictions${refresh ? "?refresh=1" : ""}`, { cache: "no-store" });
      const d = await res.json();
      if (d?.ok) setData(d);
    } catch { /* ignore */ } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  const open = data?.open || [];
  const sel = open[Math.min(selIdx, Math.max(0, open.length - 1))];

  async function submit(e) {
    e.preventDefault();
    if (!sel) return;
    if (!predicted) return setMsg("Isi nilai prediksi.");
    setMsg("Menyimpan…");
    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, indicatorId: sel.indicatorId, releaseDate: sel.releaseDate, title: sel.title, predicted, note }),
      });
      const d = await res.json();
      if (d?.ok) {
        setMsg(`Prediksi tersimpan! ${d.leaderboard?.length || 0} peserta di leaderboard.`);
        setPredicted(""); setNote("");
        load();
      } else {
        setMsg(d.error || "Gagal menyimpan.");
      }
    } catch { setMsg("Gagal menyimpan."); }
  }

  if (loading) return <div className="cell-muted">Memuat komunitas…</div>;

  const board = data?.leaderboard || [];
  const preds = data?.predictions || [];

  return (
    <div>
      {msg && <div className="notice" style={{ marginBottom: 12 }}>{msg}</div>}

      <div className="community-grid">
        {/* ── Submit prediksi ── */}
        <div className="panel-card">
          <div className="section-title"><span className="inline-ico"><IconTarget size={18} /></span><h3>Prediksi Rilis Berikutnya</h3></div>
          <form onSubmit={submit} className="calc-inputs" style={{ marginTop: 12 }}>
            <label className="field">
              <span className="field-label">Pilih Rilis</span>
              <div className="field-input">
                <select value={selIdx} onChange={(e) => setSelIdx(Number(e.target.value))}>
                  {open.map((o, i) => (
                    <option key={i} value={i}>{o.title} ({o.releaseDate.slice(8, 10)}/{o.releaseDate.slice(5, 7)})</option>
                  ))}
                </select>
              </div>
            </label>
            {sel && (
              <div className="cell-muted">Konsensus pasar: {sel.expected} {sel.unit} · {sel.votes} sudah menebak</div>
            )}
            <label className="field">
              <span className="field-label">Nama / Alias</span>
              <div className="field-input"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Sultan Pip" /></div>
            </label>
            <label className="field">
              <span className="field-label">Prediksi Anda {sel ? `(${sel.unit})` : ""}</span>
              <div className="field-input"><input value={predicted} onChange={(e) => setPredicted(e.target.value)} type="text" placeholder={sel?.expected?.toString()} /></div>
            </label>
            <label className="field">
              <span className="field-label">Catatan (opsional)</span>
              <div className="field-input"><input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Alasan singkat…" /></div>
            </label>
            <button className="btn btn-primary" type="submit">Kirim Prediksi</button>
          </form>
          <p className="cell-muted" style={{ fontSize: 12, marginTop: 8 }}>
            Setelah rilis keluar, prediksi Anda dinilai terhadap ACTUAL dan masuk leaderboard.
            Data disimpan lokal (demo); untuk produksi gunakan DB persisten.
          </p>
        </div>

        {/* ── Leaderboard ── */}
        <div className="panel-card">
          <div className="section-title"><span className="inline-ico"><IconUsers size={18} /></span><h3>Leaderboard Akurasi</h3></div>
          {board.length === 0 ? (
            <div className="cell-muted">Belum ada prediksi yang bisa dinilai. Tunggu rilis terdekat dinilai.</div>
          ) : (
            <table className="data-table" style={{ marginTop: 6 }}>
              <thead><tr><th>#</th><th>Trader</th><th>Prediksi</th><th>Skor Rata²</th></tr></thead>
              <tbody>
                {board.map((r) => (
                  <tr key={r.name}>
                    <td className="mono">{r.rank}</td>
                    <td className="cell-name">{r.name}</td>
                    <td className="mono cell-muted">{r.graded} dinilai / {r.n}</td>
                    <td className="mono"><span className={`score ${r.avg >= 70 ? "up" : r.avg >= 50 ? "flat" : "down"}`}>{r.avg}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Riwayat prediksi ── */}
      <div className="panel-card" style={{ marginTop: 16 }}>
        <div className="section-title"><span className="inline-ico"><IconTarget size={18} /></span><h3>Riwayat Prediksi</h3></div>
        {preds.length === 0 ? (
          <div className="cell-muted">Belum ada prediksi.</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Trader</th><th>Rilis</th><th>Prediksi</th><th>Actual</th><th>Hasil</th></tr></thead>
              <tbody>
                {preds.slice(0, 20).map((p) => (
                  <tr key={p.id}>
                    <td className="cell-name">{p.name}</td>
                    <td><div className="cell-name">{p.title}</div><div className="cell-muted">{p.releaseDate}</div></td>
                    <td className="mono">{p.predicted}</td>
                    <td className="mono cell-muted">{p.actual ?? "—"}</td>
                    <td className="mono">
                      {p.score != null ? (
                        <span className={`score ${p.score >= 70 ? "up" : p.score >= 50 ? "flat" : "down"}`}>{p.score}</span>
                      ) : <span className="cell-muted">belum rilis</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
