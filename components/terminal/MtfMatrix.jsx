// components/terminal/MtfMatrix.jsx
// Matriks lengkap SEMUA timeframe (15m → 1B) untuk simbol terpilih:
// sinyal · skor · bias struktur SMC · chart pattern teratas · plan mini
// (entry / SL / TP1 / R:R). Klik baris = pindah timeframe analisis.

"use client";

import { fmtPrice, SIG, TF_LABEL, TF_SHORT, DIR } from "./fmt";

const BIAS_PILL = { BULLISH: "up", BEARISH: "down", RANGE: "flat" };

export default function MtfMatrix({ matrix, activeTf, onSelect, symbolId, loading }) {
  if (loading && !matrix?.length) {
    return <div className="cell-muted">Memuat matriks 7 timeframe…</div>;
  }
  return (
    <div className="table-wrap tech-table-scroll mtfx-wrap">
      <table className="data-table tech-table mtfx-table">
        <thead>
          <tr>
            <th>Timeframe</th>
            <th>Sinyal</th>
            <th>Skor</th>
            <th>Struktur SMC</th>
            <th>Chart Pattern</th>
            <th>Pola Candle</th>
            <th>Entry</th>
            <th>SL</th>
            <th>TP1</th>
            <th>R:R</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(matrix || []).map((m) => {
            const sig = SIG[m.signal] || null;
            const active = m.tf === activeTf;
            const noData = m.ok === false || !m.signal;
            return (
              <tr key={m.tf} className={active ? "mtfx-active" : ""}>
                <td>
                  <div className="cell-name">{TF_LABEL[m.tf]}</div>
                  <div className="cell-muted">{(TF_SHORT[m.tf] || m.tf).toUpperCase()}</div>
                </td>
                <td>
                  {noData ? <span className="cell-muted">—</span> : (
                    <span className={`tech-sig ${sig.cls}`}>
                      {sig.arrow} {sig.short}
                    </span>
                  )}
                </td>
                <td>
                  {m.score != null ? (
                    <span className={`score ${m.score > 2 ? "up" : m.score < -2 ? "down" : "flat"}`}>
                      {m.score > 0 ? "+" : ""}{m.score}
                    </span>
                  ) : "—"}
                </td>
                <td>
                  {m.bias ? (
                    <span className={`bias-pill ${BIAS_PILL[m.bias] === "up" ? "bull" : BIAS_PILL[m.bias] === "down" ? "bear" : "flat"}`}>
                      {m.bias}
                    </span>
                  ) : "—"}
                </td>
                <td>
                  {m.chartPattern ? (
                    <span className={`mtfx-pat ${DIR[m.chartPattern.dir]?.cls || "flat"}`} title={`${m.chartPattern.name} (${m.chartPattern.status})`}>
                      {m.chartPattern.name}
                    </span>
                  ) : <span className="cell-muted">—</span>}
                </td>
                <td>
                  {m.topPattern ? (
                    <span className={`mtfx-pat ${DIR[m.topPattern.dir]?.cls || "flat"}`} title={`${m.topPattern.name} · ${m.topPattern.strength}/100`}>
                      {m.topPattern.name}
                    </span>
                  ) : <span className="cell-muted">—</span>}
                </td>
                {m.plan?.mode === "directional" ? (
                  <>
                    <td className="mtfx-num">{fmtPrice(symbolId, m.plan.entry)}</td>
                    <td className="mtfx-num down">{fmtPrice(symbolId, m.plan.sl)}</td>
                    <td className="mtfx-num up">{fmtPrice(symbolId, m.plan.tp1)}</td>
                    <td><b className="mtfx-rr">1:{m.plan.rr}</b></td>
                  </>
                ) : m.plan?.mode === "breakout" ? (
                  <>
                    <td className="mtfx-num" colSpan={3}>
                      <span className="cell-muted">Breakout plan:</span>{" "}
                      buy {fmtPrice(symbolId, m.plan.buyStop)} / sell {fmtPrice(symbolId, m.plan.sellStop)}
                    </td>
                    <td><span className="cell-muted">tunggu</span></td>
                  </>
                ) : (
                  <>
                    <td className="cell-muted">—</td><td className="cell-muted">—</td><td className="cell-muted">—</td><td className="cell-muted">—</td>
                  </>
                )}
                <td>
                  <button
                    type="button"
                    className={`btn btn-sm ${active ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => onSelect(m.tf)}
                  >
                    {active ? "AKTIF" : "Analisis →"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
