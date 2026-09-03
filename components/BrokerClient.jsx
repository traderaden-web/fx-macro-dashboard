// components/BrokerClient.jsx
// "Portfolio / Broker" — sinkronisasi posisi nyata (MetaAPI) + mode paper/demo.
// Menampilkan ringkasan akun, posisi terbuka & order tertunda. Read-only
// (tidak mengeksekusi order) demi keamanan.

"use client";

import { useEffect, useState } from "react";
import { IconWallet, IconSearch } from "./Icons";

const DEMO_LABEL = { demo: "PAPER", connected: "LIVE" };

function fmt(v, d = 2) {
  if (v == null || Number.isNaN(v)) return "—";
  return Number(v).toLocaleString("id-ID", { maximumFractionDigits: d });
}
function money(v) {
  if (v == null || Number.isNaN(v)) return "—";
  const s = Number(v) > 0 ? "+" : "";
  return `${s}$${fmt(Math.abs(v), 2)}`;
}
function price(v) {
  if (v == null || Number.isNaN(v)) return "—";
  return v >= 100 ? fmt(v, 2) : fmt(v, 4);
}

export default function BrokerClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState("");
  const [accountId, setAccountId] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/broker", { cache: "no-store" });
      const d = await res.json();
      setData(d);
    } catch { /* ignore */ } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function connect(e) {
    e?.preventDefault();
    if (!token.trim() || !accountId.trim()) return setMsg("Isi MetaAPI token & accountId.");
    setSaving(true); setMsg("Menghubungkan…");
    try {
      const res = await fetch("/api/broker", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim(), accountId: accountId.trim() }),
      });
      const d = await res.json();
      if (d.ok && d.connected) { setMsg("Akun terhubung! Posisi disinkronkan."); setData(d); }
      else setMsg(d.error || "Gagal terhubung. Periksa token/accountId.");
    } catch { setMsg("Gagal terhubung ke MetaAPI."); }
    setSaving(false);
  }

  async function disconnect() {
    setSaving(true);
    try {
      const res = await fetch("/api/broker", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect" }),
      });
      const d = await res.json();
      setData(d); setMsg("Koneksi dilepas.");
    } catch { /* ignore */ }
    setSaving(false);
  }

  const info = data?.info;
  const positions = data?.positions || [];
  const orders = data?.orders || [];
  const live = !!data?.connected;

  return (
    <div>
      {msg && <div className={`notice ${data?.error ? "notice-warn" : ""}`} style={{ marginBottom: 12 }}>{msg}</div>}

      {/* ── Status & Koneksi ── */}
      <div className="panel-card broker-connect">
        <div className="connect-row">
          <span className={`live-pill ${live ? "" : "off"}`}><span className="pulse-dot" /> {live ? "LIVE · MetaAPI" : "PAPER MODE"}</span>
          <div className="connect-info">
            <strong>{info?.broker || "Demo (Paper)"}</strong>
            {info?.login && <span className="cell-muted">Login {info.login} · {info?.platform}</span>}
          </div>
          <div className="connect-actions">
            {live ? (
              <button className="btn btn-ghost btn-sm" onClick={disconnect} disabled={saving}>Putuskan</button>
            ) : null}
          </div>
        </div>

        {!live && (
          <form className="calc-inputs broker-form" onSubmit={connect}>
            <label className="field">
              <span className="field-label">MetaAPI Token</span>
              <div className="field-input"><input value={token} onChange={(e) => setToken(e.target.value)} type="password" placeholder="eyJhbGciOi..." /></div>
            </label>
            <label className="field">
              <span className="field-label">Account ID</span>
              <div className="field-input"><input value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="865d3a4d-..." /></div>
            </label>
            <div className="connect-cta">
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Menghubungkan…" : "Hubungkan & Sinkron"}</button>
              <p className="cell-muted" style={{ fontSize: 12, margin: 0 }}>
                Saat belum terhubung, tampil portofolio demo (paper). Token didapat di
                app.metaapi.cloud/token. Tidak ada order nyata yang dieksekusi otomatis.
              </p>
            </div>
          </form>
        )}
      </div>

      {/* ── Ringkasan Akun ── */}
      {info && (
        <div className="grid grid-4 broker-kpis" style={{ marginTop: 16 }}>
          <Kpi label="Balance" value={money(info.balance)} />
          <Kpi label="Equity" value={money(info.equity)} accent />
          <Kpi label="Free Margin" value={money(info.freeMargin)} />
          <Kpi label="Margin Level" value={`${fmt(info.marginLevel, 1)}%`} />
          <Kpi label="Margin" value={money(info.margin)} />
          <Kpi label="Unrealized P/L" value={money(info.unrealizedProfit)} accent={info.unrealizedProfit > 0} />
        </div>
      )}

      {/* ── Posisi Terbuka ── */}
      <section className="section">
        <div className="section-head"><h2>Posisi Terbuka</h2><span className="cell-muted">{positions.length} posisi</span></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Simbol</th><th>Arah</th><th>Volume</th><th>Open</th><th>Harga Kini</th><th>SL</th><th>TP</th><th>P/L</th></tr></thead>
            <tbody>
              {positions.length === 0 ? (
                <tr><td colSpan={8} className="cell-muted">Tidak ada posisi terbuka.</td></tr>
              ) : positions.map((p) => (
                <tr key={p.id}>
                  <td className="cell-name">{p.symbol}</td>
                  <td><span className={`badge dir-${p.direction === "BUY" ? "up" : "down"}`}>{p.direction}</span></td>
                  <td className="mono">{fmt(p.volume, 2)}</td>
                  <td className="mono">{price(p.openPrice)}</td>
                  <td className="mono">{price(p.currentPrice)}</td>
                  <td className="mono cell-muted">{p.stopLoss ? price(p.stopLoss) : "—"}</td>
                  <td className="mono cell-muted">{p.takeProfit ? price(p.takeProfit) : "—"}</td>
                  <td className={`mono ${p.profit >= 0 ? "val-up" : "val-down"}`}>{money(p.profit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Order Tertunda ── */}
      <section className="section">
        <div className="section-head"><h2>Order Tertunda</h2><span className="cell-muted">{orders.length} order</span></div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Simbol</th><th>Arah</th><th>Volume</th><th>Harga</th><th>SL</th><th>TP</th></tr></thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} className="cell-muted">Tidak ada order tertunda.</td></tr>
              ) : orders.map((o) => (
                <tr key={o.id}>
                  <td className="cell-name">{o.symbol}</td>
                  <td><span className={`badge dir-${o.direction === "BUY" ? "up" : "down"}`}>{o.direction}</span></td>
                  <td className="mono">{fmt(o.volume, 2)}</td>
                  <td className="mono">{price(o.openPrice ?? o.currentPrice)}</td>
                  <td className="mono cell-muted">{o.stopLoss ? price(o.stopLoss) : "—"}</td>
                  <td className="mono cell-muted">{o.takeProfit ? price(o.takeProfit) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="cell-muted" style={{ fontSize: 12, marginTop: 12 }}>
        <b>Mode read-only:</b> posisi ditampilkan &amp; disinkronkan, tetapi tidak ada order yang
        dieksekusi otomatis. Untuk mengubah posisi, lakukan dari terminal broker Anda.
      </p>
    </div>
  );
}

function Kpi({ label, value, accent, accentUp }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value ${accent ? (value?.startsWith("+") ? "val-up" : "val-up") : ""}`}>{value}</div>
    </div>
  );
}
