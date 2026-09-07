// components/fundamentals/ReleaseRadar.jsx
// "Radar Rilis & Simulasi" — dua panel yang saling terhubung:
//  1. Radar  : daftar rilis penting mendatang dengan countdown LIVE (berapa
//              hari·jam·menit·detik lagi, detik berjalan).
//  2. Planner: masukkan angka asumsi → hitung surprise vs konsensus, arah
//              mata uang (logika dampak lib/pairs.js) & estimasi gerak pair.
// Klik baris radar otomatis memilih event tersebut di planner.

"use client";

import { useMemo, useState } from "react";
import { computePairImpact, getIndicatorCurrency, magnitudeLabel, estPairMove, PAIRS } from "../../lib/pairs";
import { Countdown, fmtID } from "./ui";

/** Format angka konsensus/previous (bisa null; angka → gaya Indonesia). */
const num = (v, isDecision = false) => {
  if (v == null) return "—";
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  if (isDecision) return fmtID(n, 2); // suku bunga selalu 2 desimal (4,00%)
  return fmtID(n, Number.isInteger(n) ? 0 : Math.min(String(v).replace("-", "").split(".")[1]?.length || 1, 2));
};

/** Dampak keputusan suku bunga bank sentral terhadap pasangannya. */
const EXTRA_PAIRS = [{ symbol: "USDIDR", label: "USD/IDR", base: "USD", quote: "IDR" }];
function decisionImpact(ccy, surprise) {
  const move = surprise > 0 ? 1 : surprise < 0 ? -1 : 0;
  const est = Math.abs(surprise) >= 0.25 ? 0.45 : Math.abs(surprise) > 0 ? 0.2 : 0;
  const mag = Math.abs(surprise) >= 0.25 ? 4 : 2;
  return [...PAIRS, ...EXTRA_PAIRS]
    .filter((p) => p.base === ccy || p.quote === ccy)
    .map((p) => {
      const dir = move * (p.base === ccy ? 1 : -1);
      return {
        symbol: p.symbol, label: p.label, dir,
        strength: dir > 0 ? "Bullish" : dir < 0 ? "Bearish" : "Netral",
        magnitude: dir === 0 ? 1 : mag, est: dir === 0 ? 0 : est,
      };
    });
}

const CAT_COLOR = {
  inflasi: "#f0b429", "tenaga-kerja": "#2dd4bf", moneter: "#c084fc",
  pertumbuhan: "#4ade80", konsumen: "#a78bfa", pasar: "#94a3b8",
};

/** Rentang slider & input berdasarkan nilai konsensus. */
function sliderRange(c) {
  if (c == null || !Number.isFinite(Number(c))) return { min: 0, max: 100, step: 1 };
  const v = Number(c);
  const a = Math.abs(v);
  if (a >= 20) return { min: Math.round(-a * 1.2), max: Math.round(v + a * 1.2), step: 1 };
  const half = Math.max(a * 0.5, 0.5);
  return { min: Math.round((v - half) * 20) / 20, max: Math.round((v + half) * 20) / 20, step: 0.05 };
}

function RadarRow({ e, active, onSelect }) {
  const cat = CAT_COLOR[e.category] || "#94a3b8";
  return (
    <button type="button" className={`radar-row ${active ? "active" : ""}`} onClick={onSelect}>
      <div className="radar-date">
        <b>{e.date.slice(8, 10)}/{e.date.slice(5, 7)}</b>
        <span>{e.time} WIB</span>
      </div>
      <div className="radar-body">
        <div className="radar-title">
          <span className="radar-cat" style={{ background: `${cat}22`, color: cat }}>{e.category}</span>
          <b>{e.flag ? `${e.flag} ` : ""}{e.title}</b>
        </div>
        <span className="cell-muted">
          {e.country} · konsensus {num(e.consensus, e.isDecision)}{e.consensus != null ? (e.unit === "%" ? "%" : e.unit ? ` ${e.unit}` : "") : ""}{e.isDecision ? " (hold)" : ""} · prev {num(e.previous, e.isDecision)}
        </span>
      </div>
      <span className="badge impact" style={{ color: "#fb7185", background: "rgba(251,113,133,0.16)" }}>{e.impact}</span>
      <Countdown iso={e.iso} />
    </button>
  );
}

function Planner({ events, selIdx, setSelIdx }) {
  const ev = events[Math.min(selIdx, events.length - 1)] || null;
  const rng = useMemo(() => sliderRange(ev?.consensus), [ev]);
  const [guess, setGuess] = useState(null); // null = ikat ke konsensus
  const actual = guess == null ? ev?.consensus : guess;
  const consensus = ev?.consensus;

  const sim = useMemo(() => {
    if (!ev || actual == null || consensus == null || !Number.isFinite(Number(actual)) || !Number.isFinite(Number(consensus))) return null;
    const a = Number(actual), c = Number(consensus);
    const surprise = Math.round((a - c) * 100) / 100;
    const surprisePct = c !== 0 ? ((a - c) / Math.abs(c)) * 100 : (a - c) > 0 ? 100 : -100;
    const inLine = Math.abs(surprisePct) < 1.5 || Math.abs(surprise) < 0.051;

    // Keputusan suku bunga bank sentral (ECB/BoE/BOJ/BI/…): surprise positif
    // (hike tak terduga) = hawkish = mata uang menguat.
    if (ev.isDecision) {
      const move = inLine ? 0 : surprise > 0 ? 1 : -1;
      return {
        surprise, surprisePct, inLine,
        meta: { cur: ev.ccy, via: "keputusan suku bunga — kejutan hawkish menguatkan mata uang" },
        curMove: move,
        est: Math.abs(surprise) >= 0.25 ? 0.45 : Math.abs(surprise) > 0 ? 0.2 : 0,
        pairs: decisionImpact(ev.ccy, inLine ? 0 : surprise),
      };
    }

    const meta = getIndicatorCurrency(ev.indicatorId);
    const dir = inLine ? 0 : surprise > 0 ? 1 : -1;
    const curMove = meta ? meta.bullDir * dir : null;
    const est = estPairMove(Math.min(Math.abs(surprisePct) * 8, 150));
    const pairs = computePairImpact(ev.indicatorId, inLine ? 0 : surprisePct);
    return { surprise, surprisePct, inLine, meta, curMove, est, pairs };
  }, [ev, actual, consensus]);

  if (!ev) return <div className="panel-cell">Belum ada rilis terjadwal.</div>;

  return (
    <div className="planner">
      <div className="planner-inputs">
        <label className="field">
          <span className="field-label">Pilih rilis untuk disimulasikan</span>
          <div className="field-input">
            <select value={selIdx} onChange={(e) => { setSelIdx(Number(e.target.value)); setGuess(null); }}>
              {events.map((x, i) => (
                <option key={i} value={i}>{x.title} — {x.date.slice(8, 10)}/{x.date.slice(5, 7)} {x.time}</option>
              ))}
            </select>
          </div>
          <span className="field-hint">
            Konsensus pasar: <b className="mono">{num(consensus, ev.isDecision)}{consensus != null ? (ev.unit === "%" ? "%" : ev.unit ? ` ${ev.unit}` : "") : ""}{ev.isDecision ? " (hold)" : ""}</b> · previous <b className="mono">{num(ev.previous, ev.isDecision)}</b> · dampak {ev.impact}
          </span>
        </label>

        <label className="field">
          <span className="field-label">Asumsikan hasil rilis (angka aktual)</span>
          <div className="field-input planner-num">
            <input
              type="number"
              value={actual ?? ""}
              step={rng.step}
              min={rng.min}
              max={rng.max}
              onChange={(e) => setGuess(e.target.value === "" ? null : Number(e.target.value))}
              placeholder="isi angka…"
            />
            <span className="field-suffix">{ev.unit === "%" ? "%" : ev.unit || ""}</span>
          </div>
          <input
            type="range"
            className="planner-slider"
            min={rng.min}
            max={rng.max}
            step={rng.step}
            value={actual ?? rng.min}
            onChange={(e) => setGuess(Number(e.target.value))}
            aria-label="Geser asumsi hasil"
          />
          <span className="field-hint">
            {rng.min.toLocaleString("id-ID")} … {rng.max.toLocaleString("id-ID")} — ketik angka pasti atau geser.
          </span>
        </label>

        {sim && (
          <div className="surprise-box">
            <div className="surprise-head">
              <span>Surprise vs konsensus</span>
              <span className={`chip ${sim.inLine ? "warn" : sim.surprise > 0 ? "pos" : "neg"}`}>
                {sim.inLine ? "SESUAI EKSPEKTASI" : sim.surprise > 0 ? "BEAT (di atas)" : "MISS (di bawah)"}
              </span>
            </div>
            <div className="surprise-nums">
              <div><span>Δ</span><b className={sim.surprise > 0 ? "up" : sim.surprise < 0 ? "down" : ""}>{sim.surprise > 0 ? "+" : ""}{fmtID(sim.surprise, Number.isInteger(sim.surprise) ? 0 : 2)}</b></div>
              <div><span>%</span><b className={sim.surprisePct > 0 ? "up" : sim.surprisePct < 0 ? "down" : ""}>{sim.surprisePct > 0 ? "+" : ""}{fmtID(sim.surprisePct, 1)}%</b></div>
              <div><span>Est. gerak</span><b>±{fmtID(sim.est, 2)}%</b></div>
            </div>
          </div>
        )}
      </div>

      <div className="planner-result">
        <h4>Simulasi: {ev.title}</h4>
        {sim ? (
          <>
            <div className="dir-box">
              <span className="dir-label">Arah mata uang</span>
              <b className={`dir-value ${sim.curMove > 0 ? "up" : sim.curMove < 0 ? "down" : ""}`}>
                {sim.meta ? (sim.curMove > 0 ? `${sim.meta.cur} MENGUAT` : sim.curMove < 0 ? `${sim.meta.cur} MELEMAH` : `${sim.meta.cur} NETRAL`) : "DAMPAK CAMPURAN"}
              </b>
              <span className="cell-muted">{sim.meta ? `via ${sim.meta.via}` : "indikator tanpa pemetaan mata uang tunggal"}</span>
            </div>
            <div className="planner-pairs">
              {sim.pairs.length ? sim.pairs.map((p) => (
                <div key={p.symbol} className={`pp ${p.dir > 0 ? "up" : p.dir < 0 ? "down" : ""}`}>
                  <b>{p.label}</b>
                  <span>{p.dir > 0 ? "▲" : p.dir < 0 ? "▼" : "→"} {p.strength}</span>
                  <em>±{fmtID(p.est, 2)}% · {magnitudeLabel(p.magnitude)}</em>
                </div>
              )) : <p className="cell-muted">Tidak ada pasangan terpetakan untuk indikator ini.</p>}
            </div>
            <p className="planner-note">
              Estimasi gerak = model heuristik historis (≈0,04% per 10 poin indeks kejutan, plafon 0,6%) — edukasi, bukan jaminan.
              Konfirmasi selalu dengan level teknikal & likuiditas sesi.
            </p>
          </>
        ) : (
          <p className="cell-muted">Konsensus indikator ini belum tersedia — pilih rilis lain atau masukkan angka setelah konsensus terbit.</p>
        )}
      </div>
    </div>
  );
}

export default function ReleaseRadar({ cheat = [] }) {
  const events = cheat;
  const [selIdx, setSelIdx] = useState(0);
  const sel = events[Math.min(selIdx, events.length - 1)];
  return (
    <section className="section" id="rilis">
      <div className="section-head">
        <h2><span className="inline-ico">📡</span> Radar Rilis &amp; Simulasi Dampak</h2>
        <span className="cell-muted">Klik rilis untuk memuatnya ke simulator</span>
      </div>
      <div className="radar-grid">
        <div className="radar-list">
          {events.map((e, i) => (
            <RadarRow
              key={`${e.indicatorId}-${e.date}-${e.time}`}
              e={e}
              active={sel?.indicatorId === e.indicatorId && sel?.date === e.date}
              onSelect={() => { setSelIdx(i); document.getElementById("planner-anchor")?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
            />
          ))}
          {!events.length && <div className="panel-cell cell-muted">Tidak ada rilis berdampak tinggi terjadwal dalam waktu dekat.</div>}
        </div>
        <div className="planner-wrap" id="planner-anchor">
          <Planner events={events} selIdx={selIdx} setSelIdx={setSelIdx} />
        </div>
      </div>
      <p className="cell-muted fv-hint">
        Kolom konsensus diambil dari ForexFactory (live/arsip) &amp; previous dari FRED otomatis via lib/consensus —
        angka aktual baru muncul beberapa menit setelah rilis resmi.
      </p>
    </section>
  );
}
