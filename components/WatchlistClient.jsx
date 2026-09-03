// components/WatchlistClient.jsx
// Watchlist + Price/Event Alerts. Data harga dari /api/forex, data event dari
// /api/calendar (data/calendar). Disimpan di localStorage. Alert harga memakai
// browser Notification API + bunyi + badge; bila izin belum ada, system beep.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { IconSearch, IconChart, IconWallet } from "./Icons";
import Link from "next/link";

const PICKABLE = [
  { symbol: "EUR/USD", label: "Euro / Dolar AS", yahoo: "EURUSD=X" },
  { symbol: "GBP/USD", label: "Pound / Dolar AS", yahoo: "GBPUSD=X" },
  { symbol: "USD/JPY", label: "Dolar AS / Yen Jepang", yahoo: "USDJPY=X" },
  { symbol: "USD/CHF", label: "Dolar AS / Franc Swiss", yahoo: "USDCHF=X" },
  { symbol: "AUD/USD", label: "Dolar AU / Dolar AS", yahoo: "AUDUSD=X" },
  { symbol: "USD/CAD", label: "Dolar AS / Dolar Kanada", yahoo: "USDCAD=X" },
  { symbol: "NZD/USD", label: "Dolar NZ / Dolar AS", yahoo: "NZDUSD=X" },
  { symbol: "EUR/GBP", label: "Euro / Pound Inggris", yahoo: "EURGBP=X" },
  { symbol: "EUR/JPY", label: "Euro / Yen Jepang", yahoo: "EURJPY=X" },
  { symbol: "GBP/JPY", label: "Pound / Yen Jepang", yahoo: "GBPJPY=X" },
  { symbol: "USD/IDR", label: "Dolar AS / Rupiah", yahoo: "USDIDR=X" },
  { symbol: "XAU/USD", label: "Emas (per oz)", yahoo: "GC=F" },
  { symbol: "XAG/USD", label: "Perak (per oz)", yahoo: "SI=F" },
];

const EVENT_SOURCES = ["FOMC", "NFP", "CPI", "PPI", "GDP", "Retail Sales", "Unemployment"];

const STORE_KEY = "macrolab.watchlist.v1";

function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || { symbols: [], alerts: [] }; }
  catch { return { symbols: [], alerts: [] }; }
}

function beep(freq = 880, dur = 0.18) {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.02);
  } catch { /* no-op */ }
}

function notify(title, body) {
  try {
    if (window.Notification && Notification.permission === "granted") {
      new Notification(title, { body, silent: false });
    }
  } catch { /* no-op */ }
  beep();
}

function fmt(v) { return v >= 100 ? Number(v).toFixed(2) : Number(v).toFixed(4); }

export default function WatchlistClient() {
  const [store, setStoreState] = useState({ symbols: [], alerts: [] });
  const [prices, setPrices] = useState([]);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [perm, setPerm] = useState("default");
  const [editing, setEditing] = useState(null); // alert being edited

  const activeRef = useRef(true);

  // muat store dari localStorage
  useEffect(() => {
    setStoreState(loadStore());
    if ("Notification" in window) setPerm(Notification.permission);
  }, []);
  useEffect(() => setStoreState((s) => s && s.symbols ? s : { symbols: [], alerts: [] }), []);

  // fetch harga berkala
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/forex", { cache: "no-store" });
        const d = await res.json();
        if (activeRef.current && d?.pairs) setPrices(d.pairs);
      } catch { /* ignore */ }
    }
    load();
    const id = setInterval(load, 30000);
    return () => { activeRef.current = false; clearInterval(id); };
  }, []);

  const save = (next) => {
    setStoreState(next);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch { /* no-op */ }
  };

  const priceOf = (symbol) => prices.find((p) => p.symbol === symbol);
  const chartSym = (symbol) => (symbol === "XAU/USD" ? "gold" : symbol === "XAG/USD" ? "silver" : symbol.replace("/", "").toLowerCase());

  const addSymbol = (sym) => {
    if (!store) return;
    if (store.symbols.includes(sym.symbol)) return setNotice(`${sym.symbol} sudah di watchlist`);
    save({ ...store, symbols: [...store.symbols, sym.symbol] });
    setNotice(`${sym.symbol} ditambahkan`);
    setTimeout(() => setNotice(""), 2500);
  };
  const removeSymbol = (sym) => {
    save({ ...store, symbols: store.symbols.filter((s) => s !== sym), alerts: store.alerts.filter((a) => a.symbol !== sym) });
  };

  // ── Alert price: create ──
  const createAlert = (alert) => {
    if (!store) return;
    const next = { ...store, alerts: [...store.alerts, { id: Date.now(), ...alert }] };
    save(next);
    setEditing(null);
    setNotice(`Alert ${alert.symbol} ${alert.op === "above" ? ">" : "<"} ${alert.target} aktif`);
    setTimeout(() => setNotice(""), 2500);
  };
  const removeAlert = (id) => save({ ...store, alerts: store.alerts.filter((a) => a.id !== id) });

  // ── Cek alert tiap harga berubah ──
  useEffect(() => {
    if (!store?.alerts?.length) return;
    for (const a of store.alerts) {
      const p = priceOf(a.symbol);
      if (!p) continue;
      const triggered = a.op === "above" ? p.value >= Number(a.target) : p.value <= Number(a.target);
      if (triggered && !a.done) {
        notify(`🚨 Alert ${a.symbol}`, `Harga ${fmt(p.value)} ${a.op === "above" ? "di atas" : "di bawah"} target ${a.target}`);
        save({ ...store, alerts: store.alerts.map((x) => (x.id === a.id ? { ...x, done: true } : x)) });
      }
    }
  }, [prices, store?.alerts?.length]);

  const filtered = useMemo(
    () => PICKABLE.filter((p) => (p.symbol + p.label + p.yahoo).toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const watchlist = useMemo(
    () => store?.symbols.map((sym) => ({ sym, q: priceOf(sym) })) || [],
    [store?.symbols, prices]
  );

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    const p = await Notification.requestPermission();
    setPerm(p);
  };

  return (
    <div className="watch">
      <div className="watch-toolbar">
        <button className="btn btn-ghost btn-sm" onClick={requestPermission} disabled={perm === "granted"}>
          <IconWallet size={14} />
          {perm === "granted" ? "Notifikasi aktif" : perm === "denied" ? "Notifikasi diblokir" : "Aktifkan notifikasi"}
        </button>
        <span className="cell-muted" style={{ marginLeft: "auto" }}>
          {store?.symbols.length || 0} instrumen · {store?.alerts.length || 0} alert
        </span>
      </div>
      {notice && <div className="notice" style={{ marginBottom: 12 }}>{notice}</div>}

      <div className="watch-grid">
        {/* ── Watchlist ── */}
        <div className="watch-panel">
          <h3>Watchlist Saya</h3>
          {watchlist.length === 0 ? (
            <p className="cell-muted">Belum ada instrumen. Tambahkan dari kolom kanan.</p>
          ) : (
            <div className="watch-list">
              {watchlist.map(({ sym, q }) => {
                const dir = q ? (q.pct > 0 ? "up" : q.pct < 0 ? "down" : "flat") : "flat";
                return (
                  <div className="watch-row" key={sym}>
                    <div className="watch-sym">
                      <strong>{sym}</strong>
                      <span className="cell-muted">{q?.label || ""}</span>
                    </div>
                    <div className={`watch-px mono ${dir}`}>
                      <span className="watch-px-val">{q ? fmt(q.value) : "—"}</span>
                      <span className="watch-px-pct">
                        {q && q.pct > 0 ? "▲ +" : q && q.pct < 0 ? "▼ " : "— "}
                        {q ? `${Number(q.pct).toFixed(2)}%` : ""}
                      </span>
                    </div>
                    <div className="watch-actions">
                      <button className="icon-btn" title="Buat alert" onClick={() => setEditing({ symbol: sym, op: "above", target: q?.value != null ? fmt(q.value) : "", done: false })}>🔔</button>
                      <Link href={`/charts?sym=${chartSym(sym)}`} className="icon-btn" title="Chart">📈</Link>
                      <button className="icon-btn danger" title="Hapus" onClick={() => removeSymbol(sym)}>✕</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Tambah ── */}
        <div className="watch-panel">
          <h3>Tambah Instrumen</h3>
          <label className="search-box">
            <span className="search-ico"><IconSearch size={16} /></span>
            <input className="search-input" placeholder="Cari EUR/USD, gold…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
          <div className="watch-pick">
            {filtered.map((p) => {
              const active = store?.symbols.includes(p.symbol);
              const pct = priceOf(p.symbol)?.pct;
              return (
                <button key={p.symbol} className={`watch-chip ${active ? "active" : ""}`} onClick={() => (active ? removeSymbol(p.symbol) : addSymbol(p))}>
                  <span className="watch-chip-sym">{p.symbol}</span>
                  <span className="cell-muted">{p.label}</span>
                  {pct != null && (
                    <span className={`watch-chip-pct ${pct > 0 ? "up" : pct < 0 ? "down" : ""}`}>
                      {pct > 0 ? "+" : ""}{Number(pct).toFixed(2)}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Alerts ── */}
      <div className="watch-panel" style={{ marginTop: 16 }}>
        <h3>Price &amp; Event Alerts</h3>
        {store?.alerts.length === 0 ? (
          <p className="cell-muted">Belum ada alert. Klik 🔔 pada salah satu instrumen untuk membuat alert harga.</p>
        ) : (
          <div className="alert-list">
            {store.alerts.map((a) => (
              <div className={`alert-row ${a.done ? "done" : ""}`} key={a.id}>
                <div className="alert-info">
                  <strong>{a.symbol}</strong>
                  <span className="alert-cond">
                    {a.op === "above" ? "≥" : "≤"} {a.target}
                    {a.done && <span className="alert-hit">· sudah terpenuhi</span>}
                  </span>
                </div>
                <button className="icon-btn danger" onClick={() => removeAlert(a.id)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <div className="modal-backdrop">
          <div className="modal edit-alert">
            <div className="modal-title">Buat Alert — {editing.symbol}</div>
            <div className="field" style={{ marginTop: 12 }}>
              <span className="field-label">Ketik / kondisi harga</span>
              <div className="alert-builder">
                <select value={editing.op} onChange={(e) => setEditing({ ...editing, op: e.target.value })}>
                  <option value="above">Naik di atas</option>
                  <option value="below">Turun di bawah</option>
                </select>
                <input value={editing.target} onChange={(e) => setEditing({ ...editing, target: e.target.value })} type="text" placeholder="target harga" />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setEditing(null)}>Batal</button>
              <button className="btn btn-primary" onClick={() => createAlert(editing)}>Simpan Alert</button>
            </div>
            <p className="cell-muted" style={{ fontSize: 12, marginTop: 8 }}>
              Alert akan berbunyi &amp; menampilkan notifikasi bila harga menyentuh target. Gunakan
              dengan bijak saat sesi aktif.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
