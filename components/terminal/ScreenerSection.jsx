// components/terminal/ScreenerSection.jsx
// Screener gabungan dalam Terminal:
//   A) MATRIKS SEMUA INSTRUMEN — sinyal 7 timeframe per instrumen + grade,
//      regime, skor confluence (dari /api/technicals). Klik "Analisis" →
//      instrumen itu langsung jadi fokus seluruh Terminal.
//   B) POLA SCREENER — kartu pola candlestick/breakout semua instrumen
//      (dari /api/patterns) dengan modal detail per timeframe.

"use client";

import { useMemo, useState } from "react";
import { IconSearch, IconChart } from "../Icons";
import { DIR, TF_SHORT, PATTERN_TFS, TF_LABEL, nearestPatternTf } from "./fmt";

const TIMEFRAMES = ["15m", "30m", "1h", "4h", "1d", "1w", "1mo"];
const SIG_CLASS = { LONG: "sig-long", SHORT: "sig-short", NETRAL: "sig-neutral" };

// ─── A) Matriks semua instrumen ───────────────────────────────────────────
function InstrumentMatrix({ rows, loading, activeSymbol, onPick }) {
  const [filter, setFilter] = useState("");
  const [kind, setKind] = useState("all");
  const [only, setOnly] = useState("all"); // all | LONG | SHORT

  const filtered = useMemo(() => {
    let r = rows.filter((x) => x.ok);
    if (kind !== "all") r = r.filter((x) => x.kind === kind);
    if (only !== "all") r = r.filter((x) => (x.tfs || []).some((t) => t.ok && t.signal === only));
    if (filter.trim()) {
      const f = filter.toLowerCase();
      r = r.filter((x) => x.label.toLowerCase().includes(f) || x.id.toLowerCase().includes(f));
    }
    return [...r].sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
  }, [rows, filter, kind, only]);

  return (
    <div>
      <div className="toolbar" style={{ marginBottom: 14 }}>
        <label className="search-box">
          <span className="search-ico"><IconSearch size={16} /></span>
          <input className="search-input" placeholder="Cari instrumen…" value={filter} onChange={(e) => setFilter(e.target.value)} />
        </label>
        <div className="sort-box">
          <span className="sort-label">Jenis</span>
          <select className="sort-select" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="all">Semua</option>
            <option value="fx">Forex</option>
            <option value="gold">Logam</option>
            <option value="commodity">Komoditas</option>
            <option value="index">Index</option>
          </select>
        </div>
        <div className="sort-box">
          <span className="sort-label">Bias</span>
          <select className="sort-select" value={only} onChange={(e) => setOnly(e.target.value)}>
            <option value="all">Semua</option>
            <option value="LONG">Ada LONG</option>
            <option value="SHORT">Ada SHORT</option>
          </select>
        </div>
      </div>

      {loading && !rows.length ? (
        <div className="cell-muted">Memuat matriks sinyal semua instrumen…</div>
      ) : (
        <div className="table-wrap tech-table-scroll">
          <table className="data-table tech-table">
            <thead>
              <tr>
                <th>Instrumen</th>
                <th>Grade</th>
                <th>Regime</th>
                {TIMEFRAMES.map((t) => <th key={t} className="tech-tf">{t}</th>)}
                <th>Skor</th>
                <th>Bias</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className={row.id === activeSymbol ? "mtfx-active" : ""}>
                  <td>
                    <div className="cell-name">{row.label}</div>
                    <div className="cell-muted">{row.id.toUpperCase()}</div>
                  </td>
                  <td><span className={`grade-chip grade-${row.grade || "C"}`}>{row.grade || "C"}</span></td>
                  <td>
                    <span className={`regime-pill ${row.regime?.type === "TREND" ? "trend" : row.regime?.type === "RANGE" ? "range" : "trans"}`}>
                      {row.regime?.type === "TREND" ? (row.regime.dir === "UP" ? "▲ " : "▼ ") : ""}
                      {row.regime?.label || "—"}
                    </span>
                  </td>
                  {TIMEFRAMES.map((t) => {
                    const cell = row.tfs?.find((x) => x.tf === t);
                    const sig = cell?.ok ? (cell.signal || "NETRAL") : "—";
                    return (
                      <td key={t} className="tech-cell">
                        <span
                          className={`tech-sig ${cell?.ok ? SIG_CLASS[sig] : ""}`}
                          style={cell?.ok ? undefined : { color: "var(--dim)" }}
                          title={cell?.ok ? `${row.label} ${t}: ${sig} (skor ${cell.score})` : "data tidak tersedia"}
                        >
                          {cell?.ok ? (sig === "LONG" ? "▲" : sig === "SHORT" ? "▼" : "•") : "–"}
                        </span>
                      </td>
                    );
                  })}
                  <td>
                    <span className={`score ${row.score > 2 ? "up" : row.score < -2 ? "down" : "flat"}`}>
                      {row.score > 0 ? "+" : ""}{row.score}
                    </span>
                  </td>
                  <td>
                    <span className={`bias-pill ${row.score > 2 ? "bull" : row.score < -2 ? "bear" : "flat"}`}>{row.scoreLabel}</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btn btn-sm ${row.id === activeSymbol ? "btn-primary" : "btn-ghost"}`}
                      onClick={() => onPick(row.id)}
                      title={`Analisis ${row.label} di Terminal (sinyal, SMC, SNR, chart pattern)`}
                    >
                      <IconChart size={14} /> {row.id === activeSymbol ? "AKTIF" : "Analisis"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="cell-muted" style={{ marginTop: 10 }}>
        ▲ LONG · ▼ SHORT · • Netral — diurutkan dari skor confluence paling ekstrem.
        Klik <b>Analisis</b> untuk menjadikan instrumen fokus Terminal (sinyal SL/TP, SMC/ICT, SNR, chart pattern ikut berganti).
      </p>
    </div>
  );
}

// ─── B) Pola screener (kartu) ─────────────────────────────────────────────
function PatternScreener({ patternData, tf, activeSymbol, onPick }) {
  const [detail, setDetail] = useState(null);
  if (!patternData) return <div className="cell-muted">Scanning pola semua instrumen…</div>;
  const instruments = patternData.instruments || [];
  const mapped = nearestPatternTf(tf);
  const ranked = [...instruments]
    .map((inst) => {
      const cell = inst.tfs?.find((x) => x.tf === mapped);
      return { inst, top: cell?.top || null, count: cell?.count || 0 };
    })
    .sort((a, b) => (b.top ? 1 : 0) - (a.top ? 1 : 0) || (b.top?.strength || 0) - (a.top?.strength || 0));

  return (
    <div>
      <div className="grid grid-4">
        {ranked.map(({ inst, top, count }) => {
          const d = top ? DIR[top.dir] || DIR.neutral : null;
          return (
            <div
              className={`panel-card screener-card ${top ? `has-${top.dir}` : ""} ${inst.id === activeSymbol ? "is-preview" : ""}`}
              key={inst.id}
              onClick={() => setDetail(inst)}
              role="button" tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setDetail(inst)}
            >
              <div className="screener-head">
                <span className="screener-sym">{inst.label}</span>
                <span className={`chip-dir ${d ? d.cls : "flat"}`}>{top ? `${d.arrow} ${d.text}` : "TANPA SINYAL"}</span>
              </div>
              <div className="screener-strength">
                {top ? (
                  <>
                    <span className="edit-link">{top.name}</span>
                    <span className="screener-str">Kuat {top.strength}/100</span>
                  </>
                ) : (
                  <span className="cell-muted">Tidak ada pola menonjol di {TF_LABEL[mapped]}</span>
                )}
              </div>
              <div className="screener-tfs">
                {PATTERN_TFS.map((t) => {
                  const c = inst.tfs?.find((x) => x.tf === t);
                  const cd = c?.top ? DIR[c.top.dir] : null;
                  return (
                    <span key={t} className={`tf-chip ${cd ? cd.cls : "flat"}`} title={c?.top ? `${inst.label} ${TF_LABEL[t]}: ${c.top.name}` : `${inst.label} ${TF_LABEL[t]}: tanpa sinyal`}>
                      {TF_LABEL[t]}
                    </span>
                  );
                })}
              </div>
              <div className="screener-foot">
                <span className="cell-muted">{count} pola di {TF_LABEL[mapped]}</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={(e) => { e.stopPropagation(); onPick(inst.id); }}
                >
                  <IconChart size={14} /> Analisis
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {detail && (
        <div className="modal-backdrop" onClick={() => setDetail(null)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{detail.label} — Deteksi Pola</div>
            <div className="modal-meta">Scan otomatis pola candlestick &amp; breakout per timeframe</div>
            <div className="modal-body">
              {PATTERN_TFS.map((t) => {
                const cell = detail.tfs?.find((x) => x.tf === t);
                return (
                  <div className="pattern-block" key={t}>
                    <div className="pattern-tf">{TF_LABEL[t]}</div>
                    {cell?.patterns?.length ? (
                      <ul className="pattern-list">
                        {cell.patterns.map((p, i) => {
                          const d = DIR[p.dir] || DIR.neutral;
                          return (
                            <li key={i} className={d.cls}>
                              <span className={`chip-dir ${d.cls}`}>{d.arrow} {d.text}</span>
                              <span className="pattern-name">{p.name}</span>
                              <span className="pattern-str">{p.strength}/100</span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="cell-muted">Tidak ada pola terdeteksi pada {TF_LABEL[t]}.</div>
                    )}
                  </div>
                );
              })}
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => setDetail(null)}>Tutup</button>
                <button className="btn btn-primary" onClick={() => { onPick(detail.id); setDetail(null); }}>
                  <IconChart size={14} /> Analisis di Terminal
                </button>
              </div>
              <p className="cell-muted" style={{ fontSize: 12 }}>
                Pola adalah alat identifikasi, bukan sinyal otomatis — konfirmasi dengan struktur SMC, SNR &amp; volume sebelum eksekusi.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScreenerSection({ techRows, techLoading, patternData, tf, activeSymbol, onPickSymbol }) {
  const totalSignals = (patternData?.instruments || []).reduce((s, x) => s + (x.signalCount || 0), 0);
  return (
    <div>
      <div className="section-title ptn-title">
        <h3>🧭 Matriks Sinyal Semua Instrumen</h3>
        <span className="cell-muted">{techRows.filter((r) => r.ok).length} instrumen · 7 timeframe · update tiap 5 menit</span>
      </div>
      <InstrumentMatrix rows={techRows} loading={techLoading} activeSymbol={activeSymbol} onPick={onPickSymbol} />

      <div className="section-title ptn-title" style={{ marginTop: 26 }}>
        <h3>🔍 Pola Screener <span className="cell-muted">· fokus {TF_LABEL[nearestPatternTf(tf)]}</span></h3>
        <span className="cell-muted">{totalSignals} timeframe bersinyal · klik kartu untuk detail</span>
      </div>
      <PatternScreener patternData={patternData} tf={tf} activeSymbol={activeSymbol} onPick={onPickSymbol} />
    </div>
  );
}
