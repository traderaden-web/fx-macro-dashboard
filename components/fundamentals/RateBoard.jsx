// components/fundamentals/RateBoard.jsx
// "Papan Bank Sentral" — inti halaman /fundamentals. Tiga lensa:
//  1. Papan   : tabel 11 bank sentral (suku bunga, riil, inflasi vs target,
//               langkah terakhir, pertemuan berikutnya + countdown, sikap)
//               — kolom bisa diklik untuk sortir.
//  2. Carry   : matriks selisih suku bunga antar mata uang (basis strategi
//               carry trade) dengan pewarnaan intensitas.
//  3. Inflasi : posisi inflasi tiap negara terhadap pita target banknya.

"use client";

import { useMemo, useState } from "react";
import { realRate, carryGap, STANCES } from "../../lib/centralBanks";
import { Countdown, Segmented, SrcBadge, fmtID, bpLabel } from "./ui";

const VIEWS = [
  { id: "papan", label: "🏦 Papan Suku Bunga" },
  { id: "carry", label: "⚖️ Matriks Carry" },
  { id: "inflasi", label: "🔥 Inflasi vs Target" },
];

// ---------------------------------------------------------------- tabel papan
const COLS = [
  { id: "bank", label: "Bank Sentral", sortable: false },
  { id: "rate", label: "Suku Bunga", sortable: true },
  { id: "real", label: "Riil", sortable: true },
  { id: "infl", label: "Inflasi (target)", sortable: true },
  { id: "move", label: "Langkah Terakhir", sortable: true },
  { id: "next", label: "Pertemuan Berikutnya", sortable: true },
  { id: "stance", label: "Sikap", sortable: true },
];

function MoveBadge({ move }) {
  if (!move) return <span className="cell-muted">—</span>;
  const tone = move.bp > 0 ? "hawk" : move.bp < 0 ? "dove" : "hold";
  return (
    <div className="move-cell">
      <span className={`move-badge ${tone}`}>{bpLabel(move.bp)}</span>
      <span className="cell-muted">{move.label}</span>
    </div>
  );
}

function RateBoardTable({ banks }) {
  const [sort, setSort] = useState({ key: "rate", dir: "desc" });
  const val = (b, key) => {
    switch (key) {
      case "rate": return b.rate;
      case "real": return realRate(b);
      case "infl": return b.inflation?.value ?? -99;
      case "move": return b.lastMove?.bp ?? 0;
      case "next": return b.nextMeeting?.iso ?? "9999";
      case "stance": return ["dovish", "dovish-hold", "neutral", "hawkish-hold", "hawkish"].indexOf(b.stance);
      default: return b.rate;
    }
  };
  const rows = useMemo(() => {
    const arr = [...banks];
    arr.sort((a, b) => {
      const va = val(a, sort.key), vb = val(b, sort.key);
      const cmp = va > vb ? 1 : va < vb ? -1 : 0;
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banks, sort]);

  const clickSort = (id) => {
    if (!COLS.find((c) => c.id === id)?.sortable) return;
    setSort((s) => (s.key === id ? { key: id, dir: s.dir === "asc" ? "desc" : "asc" } : { key: id, dir: id === "next" || id === "bank" ? "asc" : "desc" }));
  };

  return (
    <div className="table-wrap fv-table">
      <table className="data-table fv-banks">
        <thead>
          <tr>
            {COLS.map((c) => (
              <th key={c.id} className={`${c.sortable ? "sortable" : ""} ${sort.key === c.id ? "sorted" : ""}`} onClick={() => clickSort(c.id)}>
                {c.label}
                {c.sortable && <span className="sort-ico">{sort.key === c.id ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => {
            const rr = realRate(b);
            const st = STANCES[b.stance] || STANCES.neutral;
            return (
              <tr key={b.key}>
                <td>
                  <div className="bank-cell">
                    <span className="bank-flag">{b.flag}</span>
                    <div>
                      <div className="bank-name">{b.bankShort} <span className="bank-cc">{b.cc}</span></div>
                      <div className="cell-muted">{b.country} · {b.rateLabel}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="rate-cell">
                    <b>{fmtID(b.rate, 2)}%</b>
                    {b.rateLive && <span className="live-dot" title={`Live FRED · ${b.rateLive.date}`}>●</span>}
                    <div className="rate-bar"><i style={{ width: `${Math.min(100, (b.rate / 6) * 100)}%` }} /></div>
                  </div>
                </td>
                <td><span className={`chip ${rr > 1 ? "pos" : rr > 0 ? "pos-soft" : rr > -1 ? "neg-soft" : "neg"}`}>{rr > 0 ? "+" : ""}{fmtID(rr, 1)}%</span></td>
                <td>
                  <div className="infl-cell">
                    <b>{b.inflation?.value != null ? fmtID(b.inflation.value, 1) + "%" : "—"}</b>
                    <span className="cell-muted">target {b.target.label}</span>
                  </div>
                </td>
                <td><MoveBadge move={b.lastMove} /></td>
                <td>
                  <div className="next-cell">
                    <b>{b.nextMeeting.label}</b>
                    <Countdown iso={b.nextMeeting.iso} />
                    <span className="cell-muted next-name">{b.nextMeeting.name}</span>
                  </div>
                </td>
                <td><span className={`stance-badge ${st.tone}`} title={st.desc}>{st.label}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ------------------------------------------------------------- matriks carry
const MATRIX_CCY = ["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "CAD", "NZD", "IDR", "CNY", "INR"];

function carryColor(diff) {
  if (diff === 0) return "rgba(255,255,255,0.04)";
  const a = Math.min(Math.abs(diff) / 4, 1) * 0.55 + 0.1;
  return diff > 0 ? `rgba(74,222,128,${a})` : `rgba(251,113,133,${a})`;
}

function CarryMatrix({ banks }) {
  const byCcy = useMemo(() => Object.fromEntries(banks.map((b) => [b.cc, b])), [banks]);
  const list = MATRIX_CCY.filter((c) => byCcy[c]);
  return (
    <div className="carry-wrap">
      <div className="table-wrap fv-table">
        <table className="data-table carry-matrix">
          <thead>
            <tr>
              <th className="carry-corner">base ▼ / quote ▶</th>
              {list.map((c) => <th key={c} className="carry-col">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row}>
                <th className="carry-row">{row} <span className="cell-muted">{fmtID(byCcy[row].rate, 2)}%</span></th>
                {list.map((col) => {
                  if (row === col) return <td key={col} className="carry-diag">·</td>;
                  const gap = carryGap(byCcy[row], byCcy[col]);
                  return (
                    <td key={col} className="carry-cell" style={{ background: carryColor(gap) }}
                      title={`Long ${row}/${col}: carry ${gap > 0 ? "+" : ""}${fmtID(gap, 2)}% p.a. — selisih suku bunga acuan ${byCcy[row].bankShort} vs ${byCcy[col].bankShort}`}
                    >
                      {gap > 0 ? "+" : "−"}{fmtID(Math.abs(gap), 2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="carry-legend">
        <span className="lg pos">■</span> carry positif (base bunga lebih tinggi) &nbsp;
        <span className="lg neg">■</span> carry negatif &nbsp;·&nbsp; angka = selisih suku bunga acuan (% p.a.).
        Contoh: long <b>AUD/JPY</b> hari ini menangkap selisih {fmtID(carryGap(byCcy.AUD || { rate: 0 }, byCcy.JPY || { rate: 0 }), 2)}% — dasar <i>carry trade</i> klasik.
      </p>
    </div>
  );
}

// ---------------------------------------------------------- inflasi vs target
const TRACK_MAX = 5; // 0..5%

function InflRow({ b }) {
  const v = b.inflation?.value;
  if (v == null) return null;
  const mid = (b.target.lo + b.target.hi) / 2;
  const gap = Math.round((v - mid) * 10) / 10;
  const within = v >= b.target.lo && v <= b.target.hi;
  const pos = (x) => Math.max(0, Math.min(100, (x / TRACK_MAX) * 100));
  return (
    <div className="infl-row" title={`${b.bankName} — inflasi ${fmtID(v, 1)}% vs target ${b.target.label}`}>
      <div className="infl-who">
        <span className="bank-flag">{b.flag}</span>
        <div>
          <b>{b.cc}</b>
          <span className="cell-muted">{b.bankShort} · {b.inflation.label}</span>
        </div>
      </div>
      <div className="infl-track">
        <div className="infl-band" style={{ left: `${pos(b.target.lo)}%`, width: `${pos(b.target.hi) - pos(b.target.lo)}%` }} />
        {[1, 2, 3, 4].map((t) => <i key={t} className="infl-tick" style={{ left: `${(t / TRACK_MAX) * 100}%` }} />)}
        <span className="infl-dot" style={{ left: `${pos(v)}%` }} data-state={within ? "in" : v > b.target.hi ? "hot" : "cold"} />
        <span className="infl-target-lab" style={{ left: `${pos(mid)}%` }}>{b.target.label}</span>
      </div>
      <div className="infl-status">
        <span className={`chip ${within ? "pos" : v > b.target.hi ? "neg" : "warn"}`}>
          {within ? "Dalam target" : v > b.target.hi ? `${gap > 0 ? "+" : ""}${fmtID(gap, 1)}% vs mid` : `${fmtID(gap, 1)}% vs mid`}
        </span>
      </div>
    </div>
  );
}

function InflationBoard({ banks }) {
  const rows = [...banks].sort((a, b) => (b.inflation?.value ?? -9) - (a.inflation?.value ?? -9));
  return (
    <div className="infl-board">
      <div className="infl-axis">
        <span>0%</span><span>1%</span><span>2%</span><span>3%</span><span>4%</span><span>5%</span>
      </div>
      {rows.map((b) => <InflRow key={b.key} b={b} />)}
      <p className="cell-muted infl-hint">
        Pita terang = zona target resmi bank sentral; bulatan = inflasi terbaru.
        Inflasi <b>di atas</b> pita → tekanan menaikkan suku bunga (hawkish); <b>di bawah</b> → ruang memangkas (dovish).
      </p>
    </div>
  );
}

// --------------------------------------------------------------------- root
export default function RateBoard({ banks = [], asof }) {
  const [view, setView] = useState("papan");
  return (
    <section className="section" id="banksentral">
      <div className="section-head">
        <h2><span className="inline-ico">🏛️</span> Papan Bank Sentral</h2>
        <div className="section-head-tools">
          <span className="cell-muted asof-chip">Per {asof}</span>
          <Segmented options={VIEWS} value={view} onChange={setView} />
        </div>
      </div>

      {view === "papan" && (
        <>
          <RateBoardTable banks={banks} />
          <p className="cell-muted fv-hint">
            <b>Suku bunga riil</b> = suku bunga acuan − inflasi headline (aproksimasi) — mata uang dengan riil tinggi cenderung lebih disukai jangka menengah.
            Klik judul kolom untuk sortir · <span className="live-dot">●</span> = angka live FRED.
          </p>
        </>
      )}
      {view === "carry" && <CarryMatrix banks={banks} />}
      {view === "inflasi" && <InflationBoard banks={banks} />}

      <div className="fv-sources">
        {banks.slice(0, 6).map((b) => (
          <a key={b.key} className="fv-src-link" href={b.source.url} target="_blank" rel="noopener noreferrer" title={`Jadwal & kebijakan resmi ${b.bankName}`}>
            {b.source.label} ↗
          </a>
        ))}
        <span className="cell-muted">+ boj.or.jp · snb.ch · rbnz.govt.nz · bi.go.id · pbc.gov.cn · rbi.org.in</span>
      </div>
    </section>
  );
}
