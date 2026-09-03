"use client";

import { useEffect, useState } from "react";

const fmt = (v) =>
  v == null || Number.isNaN(Number(v)) ? "—" : new Intl.NumberFormat("id-ID").format(Number(v));
const pct = (v) => (v == null ? "—" : `${Number(v).toFixed(1)}%`);
const sign = (v) => (Number(v) > 0 ? "+" : Number(v) < 0 ? "−" : "");

// Warna hasil: hijau laba, merah rugi, abu netral.
const pnlClass = (v) =>
  Number(v) > 0 ? "pnl-up" : Number(v) < 0 ? "pnl-down" : "pnl-flat";

function StatCard({ label, value, sub, tone }) {
  return (
    <div className={`panel-card stat-card ${tone ? `stat-${tone}` : ""}`}>
      <div className="cell-muted">{label}</div>
      <div className="stat-value">{value}</div>
      {sub ? <div className="cell-muted">{sub}</div> : null}
    </div>
  );
}

export default function JournalClient() {
  const [trades, setTrades] = useState([]);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("loading");
  const [form, setForm] = useState({
    symbol: "", direction: "BUY", entry: "", stopLoss: "", takeProfit: "",
    lots: "", pnl: "", note: "",
  });
  const [persistent, setPersistent] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingPnl, setEditingPnl] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const r = await fetch("/api/journal", { cache: "no-store" });
      const j = await r.json();
      setTrades(j.trades || []);
      setStats(j.stats || null);
      setPersistent(j.persistent !== false);
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.symbol.trim()) { setError("Isi simbol (mis. EURUSD)."); return; }
    const method = form.pnl !== "" && form.pnl != null ? "PATCH" : "POST";
    const body = method === "PATCH"
      ? { id: editingId, pnl: form.pnl, symbol: form.symbol, note: form.note }
      : { ...form, pnl: form.pnl };
    const url = "/api/journal";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!data.ok) { setError(data.error || "Gagal menyimpan trade."); return; }
    setForm({ symbol: "", direction: "BUY", entry: "", stopLoss: "", takeProfit: "", lots: "", pnl: "", note: "" });
    setEditingId(null);
    setEditingPnl("");
    load();
  };

  const closeTrade = async (t) => {
    if (editingId === t.id) return;
    setEditingId(t.id);
    setEditingPnl(t.pnl != null ? String(t.pnl) : "");
  };
  const saveClose = async () => {
    const res = await fetch("/api/journal", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, pnl: editingPnl }),
    });
    const data = await res.json();
    if (!data.ok) setError(data.error || "Gagal simpan hasil.");
    setEditingId(null);
    setEditingPnl("");
    load();
  };
  const remove = async (id) => {
    if (!confirm("Hapus trade ini?")) return;
    await fetch(`/api/journal?id=${id}`, { method: "DELETE" });
    load();
  };

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="journal-grid">
      {/* Kolom form input */}
      <form className="panel-card journal-form" onSubmit={submit}>
        <h3>{editingId ? "Tutup / Edit Trade" : "Tambah Trade"}</h3>
        {error ? <div className="error-banner">{error}</div> : null}
        {!persistent ? (
          <div className="notice-banner">
            Penyimpanan sementara (<code>/tmp</code>): trade tetap ada selama server instance hidup, tapi
            hilang setelah redeploy/idle. Untuk riwayat permanen, hubungkan database
            (lihat <code>DEPLOYMENT.md</code>).
          </div>
        ) : null}
        <label>Simbol<span className="req">*</span></label>
        <input value={form.symbol} onChange={(e) => update("symbol", e.target.value)} placeholder="EURUSD" />

        <label>Arah</label>
        <div className="dir-toggle">
          {["BUY", "SELL"].map((d) => (
            <button type="button" key={d} className={form.direction === d ? "active" : ""} onClick={() => update("direction", d)}>{d}</button>
          ))}
        </div>

        <label>Entry</label>
        <input type="number" step="any" value={form.entry} onChange={(e) => update("entry", e.target.value)} placeholder="1.0850" />
        <label>Stop Loss</label>
        <input type="number" step="any" value={form.stopLoss} onChange={(e) => update("stopLoss", e.target.value)} placeholder="1.0820" />
        <label>Take Profit</label>
        <input type="number" step="any" value={form.takeProfit} onChange={(e) => update("takeProfit", e.target.value)} placeholder="1.0910" />
        <label>Lot</label>
        <input type="number" step="any" value={form.lots} onChange={(e) => update("lots", e.target.value)} placeholder="0.10" />
        <label>Hasil (PnL) — kosongkan jika masih open</label>
        <input type="number" step="any" value={form.pnl} onChange={(e) => update("pnl", e.target.value)} placeholder="Contoh: 45.5 (laba) / -32 (rugi)" />
        <label>Catatan</label>
        <textarea value={form.note} onChange={(e) => update("note", e.target.value)} rows={2} placeholder="Alasan entry, setup, pelajaran..." />

        <div className="btn-row">
          <button className="btn btn-primary" type="submit">{editingId ? "Simpan Hasil" : "Tambahkan"}</button>
          {editingId ? (
            <button className="btn btn-ghost" type="button" onClick={() => { setEditingId(null); setEditingPnl(""); }}>Batal</button>
          ) : null}
        </div>
      </form>

      {/* Kolom statistik */}
      <div className="journal-stats">
        {status === "loading" ? <p className="cell-muted">Memuat...</p> : null}
        {stats && (
          <>
            <div className="stat-grid">
              <StatCard label="Total Trade (Tertutup)" value={fmt(stats.total)} sub={`${stats.open} open`} />
              <StatCard label="Win Rate" value={pct(stats.winRate)} sub={`${fmt(stats.win)}W · ${fmt(stats.loss)}L · ${fmt(stats.be)}BE`} tone={Number(stats.winRate) >= 50 ? "up" : "down"} />
              <StatCard label="Profit Factor" value={stats.profitFactor} sub={Number(stats.profitFactor) >= 1.5 ? "Kuat" : Number(stats.profitFactor) >= 1 ? "Cukup" : "Perlu perbaikan"} tone={Number(stats.profitFactor) >= 1 ? "up" : "down"} />
              <StatCard label="Expectancy / Trade" value={fmt(stats.expectancy)} sub="Rata-rata laba per trade" tone={Number(stats.expectancy) > 0 ? "up" : "down"} />
            </div>
            <div className="stat-grid">
              <StatCard label="Net PnL" value={sign(stats.net) + fmt(stats.net)} sub={`Win ${sign(stats.grossWin)}${fmt(stats.grossWin)} · Loss ${fmt(stats.grossLoss)}`} tone={Number(stats.net) > 0 ? "up" : "down"} />
              <StatCard label="Avg Win / Avg Loss" value={`${sign(stats.avgWin)}${fmt(stats.avgWin)} / ${sign(stats.avgLoss)}${fmt(stats.avgLoss)}`} sub="Rasio reward:risk" />
              <StatCard label="Max Drawdown" value={fmt(stats.maxDrawdown)} sub="Kemunduran tertinggi" tone="down" />
              <StatCard label="Streak Terbaik" value={`${fmt(stats.bestWinStreak)}W`} sub={`${stats.lastStreak}${stats.lastStreakType === "win" ? "W" : stats.lastStreakType === "loss" ? "L" : ""} terakhir`} />
            </div>
            <p className="cell-muted" style={{ marginTop: 10 }}>
              <b>Baca:</b> Win-rate tinggi tidak selalu bagus — perhatikan <b>profit factor</b> (&gt;1.5 sehat),
              <b> expectancy</b> (harus positif), dan <b>max drawdown</b> (semakin kecil semakin stabil).
            </p>
          </>
        )}
      </div>

      {/* Tabel trade */}
      <div className="panel-card journal-table">
        <h3>Riwayat Trade ({trades.length})</h3>
        {trades.length === 0 ? (
          <p className="cell-muted">Belum ada trade. Tambahkan di sebelah kiri.</p>
        ) : (
          <div className="table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Simbol</th><th>Arah</th><th>Entry</th><th>SL</th><th>TP</th><th>Lot</th>
                  <th>Hasil</th><th>Status</th><th>Catatan</th><th></th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => (
                  <tr key={t.id}>
                    <td><b>{t.symbol}</b></td>
                    <td className={t.direction === "SELL" ? "pnl-down" : "pnl-up"}>{t.direction}</td>
                    <td>{fmt(t.entry)}</td>
                    <td>{fmt(t.stopLoss)}</td>
                    <td>{fmt(t.takeProfit)}</td>
                    <td>{fmt(t.lots)}</td>
                    <td className={pnlClass(t.pnl)}>
                      {t.pnl != null ? `${sign(t.pnl)}${fmt(t.pnl)}` : (editingId === t.id ? (
                        <input type="number" step="any" value={editingPnl} onChange={(e) => setEditingPnl(e.target.value)} placeholder="PnL" />
                      ) : "—")}
                    </td>
                    <td>
                      {t.pnl != null ? (t.status === "win" ? "✓ Laba" : t.status === "loss" ? "✗ Rugi" : "• BE") : (
                        <button className="btn btn-ghost btn-sm" onClick={() => closeTrade(t)}>Tutup</button>
                      )}
                    </td>
                    <td className="cell-muted">{t.note || "—"}</td>
                    <td>
                      <div className="row-actions">
                        {editingId === t.id && t.pnl == null ? (
                          <button className="btn btn-primary btn-sm" onClick={saveClose}>Simpan</button>
                        ) : null}
                        <button className="btn btn-ghost btn-sm" onClick={() => confirm("Hapus trade ini?") && remove(t.id)}>✕</button>
                      </div>
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
