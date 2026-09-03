// components/ScreenerClient.jsx
// Screener pola candlestick + breakout — scan otomatis semua instrumen ×
// timeframe. Menampilkan setup yang terdeteksi dengan arah, kekuatan & link chart.

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { IconSearch, IconChart } from "./Icons";

const TF_TABS = ["15m", "1h", "4h", "1d"];
const TF_LABEL = { "15m": "15 Menit", "1h": "1 Jam", "4h": "4 Jam", "1d": "Harian" };

const DIR_CLASS = { bullish: "up", bearish: "down", neutral: "flat" };
const DIR_ARROW = { bullish: "▲", bearish: "▼", neutral: "•" };
const DIR_TEXT = { bullish: "BULLISH", bearish: "BEARISH", neutral: "NETRAL" };

export default function ScreenerClient() {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tf, setTf] = useState("1h");
  const [filter, setFilter] = useState("");
  const [updated, setUpdated] = useState(null);
  const [detail, setDetail] = useState(null); // instrumen yang dibuka detailnya

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(`/api/patterns?tf=${tf}`, { cache: "no-store" });
        const d = await res.json();
        if (active && d?.instruments) {
          setInstruments(d.instruments);
          setUpdated(d.updated);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => { active = false; clearInterval(id); };
  }, [tf]);

  const filtered = useMemo(() => {
    let r = instruments;
    if (filter.trim()) {
      const f = filter.toLowerCase();
      r = r.filter((x) => x.label.toLowerCase().includes(f) || x.id.toLowerCase().includes(f));
    }
    // Prioritas: yang punya sinyal paling banyak & paling kuat.
    return [...r].sort((a, b) => (b.signalCount || 0) - (a.signalCount || 0) || (b.top?.strength || 0) - (a.top?.strength || 0));
  }, [instruments, filter]);

  const totalSignals = instruments.reduce((s, x) => s + (x.signalCount || 0), 0);

  return (
    <div>
      <div className="toolbar" style={{ marginBottom: 14 }}>
        <label className="search-box">
          <span className="search-ico"><IconSearch size={16} /></span>
          <input className="search-input" placeholder="Cari pasangan…" value={filter} onChange={(e) => setFilter(e.target.value)} />
        </label>
        <div className="cf-chips">
          {TF_TABS.map((t) => (
            <button key={t} className={`cf-chip ${tf === t ? "active" : ""}`} onClick={() => setTf(t)}>
              {TF_LABEL[t]}
            </button>
          ))}
        </div>
        <span className="cell-muted" style={{ marginLeft: "auto" }}>
          {totalSignals} sinyal · {updated ? new Date(updated).toLocaleTimeString("id-ID") : ""}
        </span>
      </div>

      {loading ? (
        <div className="cell-muted">Scanning pola…</div>
      ) : filtered.length === 0 ? (
        <div className="cell-muted">Tidak ada setup cocok untuk filter ini.</div>
      ) : (
        <div className="grid grid-4">
          {filtered.map((inst) => {
            const top = inst.top;
            return (
              <div className={`panel-card screener-card ${top ? `has-${top.dir}` : ""}`} key={inst.id} onClick={() => setDetail(inst)}>
                <div className="screener-head">
                  <span className="screener-sym">{inst.label}</span>
                  <span className={`chip-dir ${top ? DIR_CLASS[top.dir] : "flat"}`}>
                    {top ? `${DIR_ARROW[top.dir]} ${DIR_TEXT[top.dir]}` : "TANPA SINYAL"}
                  </span>
                </div>
                <div className="screener-strength">
                  {top ? (
                    <>
                      <span className="edit-link">{top.name}</span>
                      <span className="screener-str">Kuat {top.strength}/100</span>
                    </>
                  ) : (
                    <span className="cell-muted">Tidak ada pola menonjol</span>
                  )}
                </div>
                <div className="screener-tfs">
                  {inst.tfs?.slice(0, 4).map((t) => {
                    const s = t.top;
                    return (
                      <span key={t.tf} className={`tf-chip ${s ? DIR_CLASS[s.dir] : "flat"}`} title={s ? `${inst.label} ${TF_LABEL[t.tf]}: ${s.name}` : `${inst.label} ${TF_LABEL[t.tf]}: tanpa sinyal`}>
                        {TF_LABEL[t.tf]}
                      </span>
                    );
                  })}
                </div>
                <div className="screener-foot">
                  <span className="cell-muted">{inst.signalCount} timeframe bersinyal</span>
                  <Link href={`/charts?sym=${inst.id}`} className="btn btn-ghost btn-sm" onClick={(e) => e.stopPropagation()}>
                    <IconChart size={14} /> Chart
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {detail && (
        <div className="modal-backdrop" onClick={() => setDetail(null)}>
          <div className="modal" style={{ maxWidth: 560 }}>
            <div className="modal-title">{detail.label} — Deteksi Pola</div>
            <div className="modal-meta">Scan otomatis per timeframe</div>
            <div className="modal-body">
              {detail.tfs?.map((t) => (
                <div className="pattern-block" key={t.tf}>
                  <div className="pattern-tf">{TF_LABEL[t.tf]}</div>
                  {t.patterns && t.patterns.length ? (
                    <ul className="pattern-list">
                      {t.patterns.map((p, i) => (
                        <li key={i} className={DIR_CLASS[p.dir]}>
                          <span className={`chip-dir ${DIR_CLASS[p.dir]}`}>{DIR_ARROW[p.dir]} {DIR_TEXT[p.dir]}</span>
                          <span className="pattern-name">{p.name}</span>
                          <span className="pattern-str">{p.strength}/100</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="cell-muted">Tidak ada pola terdeteksi pada {TF_LABEL[t.tf]}.</div>
                  )}
                </div>
              ))}
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => setDetail(null)}>Tutup</button>
                <Link href={`/charts?sym=${detail.id}`} className="btn btn-primary" onClick={() => setDetail(null)}>
                  <IconChart size={14} /> Buka Chart
                </Link>
              </div>
              <p className="cell-muted" style={{ fontSize: 12 }}>
                Pola adalah alat identifikasi, bukan sinyal otomatis — konfirmasi dengan level
                support/resistance &amp; volume sebelum eksekusi.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
