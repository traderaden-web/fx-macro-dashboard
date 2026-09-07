// components/terminal/PatternCards.jsx
// Seksi pola untuk Terminal:
//   A) CHART PATTERN klasik (H&S, Double Top/Bottom, Triangle, Wedge, Flag)
//      — bullish & bearish, status TERBENTUK/TERKONFIRMASI, neckline & target.
//   B) Pola CANDLESTICK (engulfing, pin bar, doji, inside bar, soldiers,
//      breakout) dari API /api/patterns — digroup per timeframe.

"use client";

import { fmtPrice, barsAgo, DIR, PATTERN_TFS, TF_LABEL, nearestPatternTf } from "./fmt";

const PATTERN_ICON = {
  "double-top": "Ⓜ", "double-bottom": "Ⓦ",
  "head-shoulders": "👤", "inv-head-shoulders": "🙃",
  "sym-triangle": "◁▷", "asc-triangle": "📐", "desc-triangle": "📐",
  "rising-wedge": "📈", "falling-wedge": "📉",
  "bull-flag": "🚩", "bear-flag": "🏴",
};

function StrengthMeter({ v }) {
  return (
    <span className="ptn-meter" title={`Kekuatan setup ${v}/100`}>
      <i style={{ width: `${Math.min(100, v)}%` }} />
    </span>
  );
}

function ChartPatternGrid({ patterns, symbolId, tf }) {
  if (!patterns?.length) {
    return (
      <div className="panel-card ptn-empty">
        <b>Belum ada chart pattern klasik terdeteksi</b>
        <p className="cell-muted">
          Pada timeframe {TF_LABEL[tf] || tf} belum terbentuk pola H&S, Double Top/Bottom,
          Triangle, Wedge, atau Flag yang memenuhi kriteria. Coba ganti timeframe.
        </p>
      </div>
    );
  }
  return (
    <div className="ptn-grid">
      {patterns.map((p) => {
        const d = DIR[p.dir] || DIR.neutral;
        const lv = p.levels || {};
        return (
          <div className={`panel-card ptn-card has-${p.dir}`} key={p.key}>
            <div className="ptn-head">
              <span className="ptn-ico" aria-hidden="true">{PATTERN_ICON[p.key] || "📊"}</span>
              <div>
                <b className="ptn-name">{p.name}</b>
                <span className={`chip-dir ${d.cls}`}>{d.arrow} {d.text}</span>
              </div>
              <span className={`ptn-status ${p.status === "TERKONFIRMASI" ? "confirmed" : "forming"}`}>{p.status}</span>
            </div>
            <p className="ptn-note">{p.note}</p>
            <div className="ptn-levels">
              {lv.neckline != null && <span>Neckline <b>{fmtPrice(symbolId, lv.neckline)}</b></span>}
              {lv.breakout != null && <span>Breakout <b>{fmtPrice(symbolId, lv.breakout)}</b></span>}
              {lv.upper != null && <span>Atas <b>{fmtPrice(symbolId, lv.upper)}</b></span>}
              {lv.lower != null && <span>Bawah <b>{fmtPrice(symbolId, lv.lower)}</b></span>}
              {lv.target != null && <span className="ptn-target">Target <b>{fmtPrice(symbolId, lv.target)}</b></span>}
            </div>
            <div className="ptn-foot">
              <StrengthMeter v={p.strength} />
              <span className="cell-muted">{p.strength}/100</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CandleColumns({ patternData, symbolId, tf }) {
  const inst = patternData?.instruments?.find((x) => x.id === symbolId);
  if (!patternData) return <div className="cell-muted">Memuat scan pola candlestick…</div>;
  if (!inst) return <div className="cell-muted">Data pola untuk instrumen ini belum tersedia.</div>;
  return (
    <div className="candle-grid">
      {PATTERN_TFS.map((t) => {
        const cell = inst.tfs?.find((x) => x.tf === t);
        const active = nearestPatternTf(tf) === t;
        return (
          <div className={`panel-card candle-col ${active ? "active" : ""}`} key={t}>
            <div className="candle-col-head">
              <b>{TF_LABEL[t]}</b>
              {active && <span className="ptn-status confirmed">TF AKTIF</span>}
            </div>
            {cell?.patterns?.length ? (
              <ul className="candle-list">
                {cell.patterns.map((p, i) => {
                  const d = DIR[p.dir] || DIR.neutral;
                  return (
                    <li key={i}>
                      <span className={`chip-dir ${d.cls}`}>{d.arrow}</span>
                      <span className="candle-name">{p.name}</span>
                      <StrengthMeter v={p.strength} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="cell-muted candle-none">Tidak ada pola menonjol.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function PatternCards({ data, patternData, tf, loading }) {
  const symbolId = data?.symbol?.id;
  return (
    <div className="ptn-section">
      <div className="section-title ptn-title">
        <h3>📐 Chart Pattern Klasik <span className="cell-muted">· {TF_LABEL[tf] || tf}</span></h3>
        <span className="cell-muted">Bullish &amp; bearish · status + target terukur</span>
      </div>
      {loading && !data
        ? <div className="cell-muted">Mendeteksi chart pattern…</div>
        : <ChartPatternGrid patterns={data?.chartPatterns} symbolId={symbolId} tf={tf} />}

      <div className="section-title ptn-title" style={{ marginTop: 22 }}>
        <h3>🕯️ Pola Candlestick &amp; Breakout <span className="cell-muted">· semua timeframe intraday</span></h3>
        <span className="cell-muted">Scan otomatis engulfing · pin bar · doji · inside bar · soldiers</span>
      </div>
      <CandleColumns patternData={patternData} symbolId={symbolId} tf={tf} />
    </div>
  );
}
