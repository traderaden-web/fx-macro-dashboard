// components/fundamentals/BiasBoard.jsx
// "Bias Mata Uang" — kartu skor fundamental per mata uang (0–100) + kekuatan
// intraday. Interaksi: sortir (gabungan/fundamental/teknis/A-Z), dua mode
// tampilan (kartu / tabel), klik kartu untuk membuka rincian komponen skor.

"use client";

import { useMemo, useState } from "react";
import { ScoreBar, ScoreDial, Segmented, fmtID } from "./ui";

const SORTS = [
  { id: "blended", label: "Gabungan" },
  { id: "fund", label: "Fundamental" },
  { id: "tech", label: "Teknis" },
  { id: "az", label: "A–Z" },
];
const VIEWS = [
  { id: "card", label: "Kartu" },
  { id: "table", label: "Tabel" },
];

function tagFor(blended) {
  return blended >= 68 ? "STRONG BUY" : blended >= 55 ? "BUY" : blended >= 45 ? "NETRAL" : blended >= 32 ? "SELL" : "STRONG SELL";
}
function tagCls(blended) {
  return blended >= 55 ? "bull" : blended <= 32 ? "bear" : "flat";
}
function toneColor(v) {
  return v >= 68 ? "var(--up)" : v >= 55 ? "#86efac" : v >= 45 ? "var(--warn)" : v >= 32 ? "#fda4af" : "var(--down)";
}

/** Rincian skor per komponen — muncul saat kartu diklik. */
function ComponentDetail({ r }) {
  const rows = [
    { k: "Suku bunga riil", val: r.realRate, txt: r.realRate == null ? "data inflasi belum tersedia" : `${r.realRate > 0 ? "+" : ""}${fmtID(r.realRate, 1)}%`, score: r.rateScore, weight: 35, why: "Riil tinggi = imbal hasil menarik bagi modal global (bobot terbesar)." },
    { k: "Sikap kebijakan", val: r.lastMove?.bp, txt: r.lastMove ? `${r.lastMove.bp > 0 ? "+" : r.lastMove.bp < 0 ? "−" : ""}${Math.abs(r.lastMove.bp)}bp` : "—", score: r.policyScore, weight: 25, why: "Bank sentral yang baru menaikkan bunga cenderung terus hawkish (momentum)." },
    { k: "Pertumbuhan", val: r.gdp, txt: r.gdp != null ? `${fmtID(r.gdp, 1)}%` : "—", score: r.growthScore, weight: 20, why: "Pertumbuhan kuat menopang ekspektasi bunga & arus investasi." },
    { k: "Pasar kerja", val: r.unemp, txt: r.unemp != null ? `${fmtID(r.unemp, 1)}%` : "—", score: r.unempScore, weight: 20, why: "Pengangguran rendah = ekonomi panas = bias kebijakan ketat." },
  ];
  return (
    <div className="bias-detail">
      <div className="bias-detail-grid">
        {rows.map((c) => (
          <div key={c.k} className="bias-comp">
            <div className="bias-comp-head">
              <span>{c.k} <em>{c.weight}%</em></span>
              <b style={{ color: toneColor(c.score) }}>{c.score}</b>
            </div>
            <ScoreBar value={c.score} right={c.txt} />
            <p>{c.why}</p>
          </div>
        ))}
      </div>
      <div className="bias-facts">
        <div><span>Suku bunga</span><b>{fmtID(r.rate, 2)}%</b></div>
        <div><span>Inflasi</span><b>{r.inflation != null ? fmtID(r.inflation, 1) + "%" : "—"} <i className="cell-muted">({r.inflationLabel})</i></b></div>
        <div><span>Target</span><b>{r.targetLabel}</b></div>
        <div><span>Pertemuan</span><b>{r.nextMeeting.label} · {r.freq}</b></div>
      </div>
      <p className="bias-market-note">💬 {r.marketNote}</p>
    </div>
  );
}

function BiasCard({ r, i }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`panel-card bias-card ${open ? "open" : ""}`} style={{ animationDelay: `${i * 45}ms` }}>
      <button type="button" className="bias-main" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <div className="bias-head">
          <span className="bias-ccy">{r.flag} {r.cc}</span>
          <ScoreDial score={r.blended} />
        </div>
        <div className="bias-name-row">
          <span className="bias-name">{r.name}</span>
          <span className={`fund-tag ${tagCls(r.blended)}`}>{tagFor(r.blended)}</span>
        </div>
        <div className="bias-scores">
          <span>Fund. <b style={{ color: toneColor(r.score) }}>{r.score}</b></span>
          <span>Tek. <b style={{ color: r.tech ? toneColor(r.tech.score) : "var(--dim)" }}>{r.tech ? r.tech.score : "—"}</b></span>
          <span className="cell-muted">{r.bank}</span>
        </div>
        <div className="bias-mini">
          <ScoreBar label="Riil" value={r.rateScore} right={r.realRate == null ? null : `${r.realRate > 0 ? "+" : ""}${fmtID(r.realRate, 1)}%`} delay={i * 60} />
          <ScoreBar label="Kebijakan" value={r.policyScore} right={`${r.lastMove?.bp > 0 ? "+" : r.lastMove?.bp < 0 ? "−" : ""}${Math.abs(r.lastMove?.bp ?? 0)}bp`} delay={i * 60 + 90} />
          <ScoreBar label="Tumbuh" value={r.growthScore} right={r.gdp != null ? `${fmtID(r.gdp, 1)}%` : null} delay={i * 60 + 180} />
          <ScoreBar label="Kerja" value={r.unempScore} right={r.unemp != null ? `${fmtID(r.unemp, 1)}%` : null} delay={i * 60 + 270} />
        </div>
        <span className="bias-more">{open ? "Tutup rincian ▲" : "Rincian skor ▼"}</span>
      </button>
      {open && <ComponentDetail r={r} />}
    </div>
  );
}

function BiasTable({ rows }) {
  return (
    <div className="table-wrap fv-table">
      <table className="data-table fv-bias-table">
        <thead>
          <tr>
            <th>Mata Uang</th><th>Bank</th><th>Bunga</th><th>Riil</th><th>Inflasi</th>
            <th>GDP</th><th>Pengangg.</th><th>Langkah</th><th>Fund.</th><th>Tek.</th><th>Gabungan</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.cc}>
              <td><b>{r.flag} {r.cc}</b> <span className="cell-muted">{r.name}</span></td>
              <td className="cell-muted">{r.bank}</td>
              <td className="mono">{fmtID(r.rate, 2)}%</td>
              <td className="mono">{r.realRate == null ? "—" : `${r.realRate > 0 ? "+" : ""}${fmtID(r.realRate, 1)}%`}</td>
              <td className="mono">{r.inflation != null ? fmtID(r.inflation, 1) + "%" : "—"}</td>
              <td className="mono">{r.gdp != null ? fmtID(r.gdp, 1) + "%" : "—"}</td>
              <td className="mono">{r.unemp != null ? fmtID(r.unemp, 1) + "%" : "—"}</td>
              <td>{r.lastMove ? `${r.lastMove.bp > 0 ? "+" : r.lastMove.bp < 0 ? "−" : ""}${Math.abs(r.lastMove.bp)}bp` : "—"}</td>
              <td className="mono"><b style={{ color: toneColor(r.score) }}>{r.score}</b></td>
              <td className="mono">{r.tech ? r.tech.score : "—"}</td>
              <td><span className={`fund-tag ${tagCls(r.blended)}`}>{r.blended} · {tagFor(r.blended)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Baris kekuatan intraday (dari harga hari ini) — konteks teknis kartu. */
function StrengthStrip({ strength }) {
  return (
    <div className="strength-strip">
      <div className="ss-head">
        <span className="ss-title">⚡ Kekuatan Intraday</span>
        <span className="cell-muted">pergerakan harga hari ini · 0–100 (50 = netral)</span>
      </div>
      <div className="ss-grid">
        {strength.map((s) => (
          <div key={s.currency} className="ss-item" title={`${s.name}: ${s.pct > 0 ? "+" : ""}${s.pct}% rata-rata vs semua pasangan`}>
            <div className="ss-top"><b>{s.currency}</b><span className={s.pct > 0.02 ? "up" : s.pct < -0.02 ? "down" : "flat"}>{s.pct > 0 ? "+" : ""}{fmtID(s.pct, 2)}%</span></div>
            <div className="strength-track"><div className="strength-fill" style={{ width: `${s.score}%`, background: toneColor(s.score) }} /></div>
            <div className="ss-lab">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BiasBoard({ rows = [], strength = [] }) {
  const [sort, setSort] = useState("blended");
  const [view, setView] = useState("card");

  const sorted = useMemo(() => {
    const arr = [...rows];
    if (sort === "az") arr.sort((a, b) => a.cc.localeCompare(b.cc));
    else if (sort === "fund") arr.sort((a, b) => b.score - a.score);
    else if (sort === "tech") arr.sort((a, b) => (b.tech?.score ?? -1) - (a.tech?.score ?? -1));
    else arr.sort((a, b) => b.blended - a.blended);
    return arr;
  }, [rows, sort]);

  return (
    <section className="section" id="bias">
      <div className="section-head">
        <h2><span className="inline-ico">🧭</span> Bias Fundamental per Mata Uang</h2>
        <div className="section-head-tools">
          <Segmented options={SORTS} value={sort} onChange={setSort} small />
          <Segmented options={VIEWS} value={view} onChange={setView} small />
        </div>
      </div>

      <StrengthStrip strength={strength} />

      {view === "card" ? (
        <div className="grid grid-stats bias-grid">
          {sorted.map((r, i) => <BiasCard key={r.cc} r={r} i={i} />)}
        </div>
      ) : (
        <BiasTable rows={sorted} />
      )}

      <p className="cell-muted fv-hint">
        <b>Cara membaca:</b> skor fundamental (0–100) dari 4 komponen berbobot — suku bunga riil 35%, sikap kebijakan 25%, pertumbuhan 20%, pasar kerja 20%.
        Skor <b>Tek.</b> = kekuatan harga intraday. <b>Gabungan</b> = 55% fundamental + 45% teknis. Klik kartu untuk rincian.
      </p>
    </section>
  );
}
