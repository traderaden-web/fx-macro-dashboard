// components/FundamentalsView.jsx
// Client: papan Fundamental — Bias per mata uang + Scenario Planner interaktif.
// Data (bias, strength, cheat sheet) dikirim dari server (server component).

"use client";

import { useMemo, useState } from "react";
import { computeCurrencyStrength } from "../lib/strength";
import { fundamentalBias } from "../lib/fundamentalBias";
import { IconAnalytics, IconGauge } from "./Icons";

function barColor(score) {
  if (score >= 68) return "var(--up)";
  if (score >= 55) return "#86efac";
  if (score >= 45) return "var(--warn)";
  if (score >= 32) return "#fda4af";
  return "var(--down)";
}

// Skenario untuk planner (murni edukasi, bukan jaminan arah).
function scenario(event, surprise) {
  const s = surprise; // -2 (sangat di bawah) .. +2 (sangat di atas)
  if (event.indicatorId === "nfp") {
    if (s >= 0.5) return { dir: "USD menguat", note: "Data pekerjaan kuat → Fed hawkish → DXY naik, USD/JPY cenderung naik, EUR/USD & GBP/USD turun.", pairs: ["USD/JPY ▲", "EUR/USD ▼", "GBP/USD ▼"], tone: "bullUsd" };
    if (s <= -0.5) return { dir: "USD melemah", note: "Pekerjaan lemah → ekspektasi dovish → DXY turun, USD/JPY turun, EUR/USD & GBP/USD naik.", pairs: ["USD/JPY ▼", "EUR/USD ▲", "GBP/USD ▲"], tone: "bearUsd" };
  }
  if (event.indicatorId === "cpi" || event.indicatorId === "corecpi") {
    if (s >= 0.5) return { dir: "USD menguat (hawkish)", note: "Inflasi melonjak → The Fed kemungkinan naikkan suku bunga → yield AS naik → DXY & USD/JPY naik, emas turun.", pairs: ["USD/JPY ▲", "XAU/USD ▼", "EUR/USD ▼"], tone: "bullUsd" };
    if (s <= -0.5) return { dir: "USD melemah (dovish)", note: "Inflasi mendingin → The Fed bisa memangkas → yield turun → DXY turun, emas naik.", pairs: ["XAU/USD ▲", "EUR/USD ▲", "USD/JPY ▼"], tone: "bearUsd" };
  }
  if (event.indicatorId === "fedfunds") {
    if (s >= 0.5) return { dir: "USD menguat (hawkish)", note: "Suku bunga lebih tinggi dari ekspektasi → DXY naik kuat, emas & safe haven tertekan.", pairs: ["USD/JPY ▲", "XAU/USD ▼", "EUR/USD ▼"], tone: "bullUsd" };
    if (s <= -0.5) return { dir: "USD melemah (dovish)", note: "Suku bunga lebih rendah dari ekspektasi → DXY turun, emas & JPY menguat.", pairs: ["XAU/USD ▲", "USD/JPY ▼", "EUR/USD ▲"], tone: "bearUsd" };
  }
  return { dir: "Pasar bergerak moderat", note: "Jika hasil sesuai konsensus, dampak besar cenderung terbatas — pantau reaksi atas pengumuman (bias ke arah tertentu biasanya muncul di menit pertama).", pairs: ["Perubahan moderat"], tone: "flat" };
}

export default function FundamentalsView({ pairs = [], cheatSheet = [] }) {
  const strength = computeCurrencyStrength(pairs);
  const strengthByCcy = {};
  strength.forEach((s) => (strengthByCcy[s.currency] = s));

  const bias = useMemo(() => fundamentalBias(strengthByCcy), [pairs.length]);

  // Gabungkan skor
  const rows = bias
    .map((f) => {
      const blended = f.tech ? Math.round(f.score * 0.55 + f.tech.score * 0.45) : f.score;
      return { ...f, blended, blendedLabel: blended >= 68 ? "STRONG BUY" : blended >= 55 ? "BUY" : blended >= 45 ? "NEUTRAL" : blended >= 32 ? "SELL" : "STRONG SELL" };
    })
    .sort((a, b) => b.blended - a.blended);

  // Scenario planner
  const events = cheatSheet.length ? cheatSheet : [{ date: "2026-09-04", time: "19:30", title: "Nonfarm Payrolls (NFP)", indicatorId: "nfp", consensus: 85, impact: "High" }];
  const [selIdx, setSelIdx] = useState(0);
  const [userGuess, setUserGuess] = useState(0);
  const sel = events[Math.min(selIdx, events.length - 1)];
  const scn = scenario(sel, userGuess);

  return (
    <div className="fund">
      {/* ── Bias Fundamental per Mata Uang ── */}
      <section className="section">
        <div className="section-head">
          <h2><span className="inline-ico"><IconAnalytics size={16} /></span> Bias Fundamental per Mata Uang</h2>
          <span className="cell-muted">Skor 0–100 · struktural (makro) + teknis (harga)</span>
        </div>
        <div className="grid grid-stats">
          {rows.map((f) => (
            <div className="panel-card fund-card" key={f.cc}>
              <div className="fund-head">
                <span className="fund-ccy">{f.cc}</span>
                <span className="fund-name">{f.name}</span>
                <span className="fund-blend" style={{ color: barColor(f.blended) }}>{f.blended}</span>
              </div>
              <div className="strength-track" style={{ margin: "10px 0" }}>
                <div className="strength-fill" style={{ width: `${f.blended}%`, background: barColor(f.blended) }} />
              </div>
              <div className="fund-meta">
                <span className={`fund-tag ${f.blended >= 55 ? "bull" : f.blended <= 32 ? "bear" : "flat"}`}>{f.blendedLabel}</span>
                <span className="cell-muted">Fund. {f.score} · Tek. {f.tech ? f.tech.score : "—"}</span>
              </div>
              <div className="fund-bar-groups">
                <div><span>Real rate</span><b>{f.realRate == null ? "—" : f.realRate + "%"}</b></div>
                <div><span>Suku bunga</span><b>{f.rate != null ? f.rate + "%" : "—"}</b></div>
                <div><span>Kebijakan</span><b>{f.policyScore}</b></div>
                <div><span>Pertumbuhan</span><b>{f.growthScore}</b></div>
              </div>
              <div className="fund-note cell-muted">{f.note}</div>
              {f.pairs && f.pairs.length > 0 && (
                <div className="fund-pairs">
                  {f.pairs.map((p) => <span className="badge cat" key={p}>{p}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="cell-muted" style={{ marginTop: 10, fontSize: 12 }}>
          <b>Baca:</b> keempat bar (real rate, suku bunga, kebijakan, pertumbuhan) dihitung dari data makro resmi;
          nilai "Tek." berasal dari pergerakan harga hari ini. Blended = 55% fundamental + 45% teknis.
        </p>
      </section>

      {/* ── Scenario Planner ── */}
      <section className="section">
        <div className="section-head">
          <h2><span className="inline-ico"><IconGauge size={16} /></span> Scenario Planner Rilis Penting</h2>
          <span className="cell-muted">Simulasi: "kalau angkanya X, ke mana arahnya?"</span>
        </div>
        <div className="calc-grid">
          <div className="calc-inputs">
            <label className="field">
              <span className="field-label">Pilih Rilis</span>
              <div className="field-input">
                <select value={selIdx} onChange={(e) => setSelIdx(Number(e.target.value))}>
                  {events.map((ev, i) => (
                    <option key={i} value={i}>{ev.title} ({ev.date.slice(8, 10)}/{ev.date.slice(5, 7)})</option>
                  ))}
                </select>
              </div>
            </label>
            <label className="field">
              <span className="field-label">Asumsikan hasil vs konsensus</span>
              <div className="field-input">
                <input type="range" min="-2" max="2" step="0.5" value={userGuess} onChange={(e) => setUserGuess(Number(e.target.value))} />
              </div>
              <span className="field-hint">
                {userGuess <= -1 ? "Jauh di bawah konsensus" : userGuess < 0 ? "Sedikit di bawah" : userGuess === 0 ? "Sesuai konsensus" : userGuess <= 1 ? "Sedikit di atas" : "Jauh di atas konsensus"}
              </span>
            </label>
            <div className="field">
              <span className="field-label">Konsensus pasar</span>
              <div className="cell-muted">{sel.consensus != null ? `${sel.consensus}` : "—"} · {sel.impact} impact</div>
            </div>
          </div>
          <div className="calc-result">
            <h4>Simulasi {sel.title}</h4>
            <ResultLine k="Arah" v={scn.dir} tone={scn.tone} />
            <ResultLine k="Skenario" v={scn.note} tone="note" />
            <div className="fund-pairs" style={{ marginTop: 10 }}>
              {scn.pairs.map((p) => <span className={`badge cat ${scn.tone}`} key={p}>{p}</span>)}
            </div>
          </div>
        </div>
        <p className="cell-muted" style={{ marginTop: 8, fontSize: 12 }}>
          Ini simulasi edukatif berbasis logika dampak data — bukan jaminan arah. Selalu konfirmasi dengan
          teknikal & dampak di halaman Analisis.
        </p>
      </section>
    </div>
  );
}

function ResultLine({ k, v, tone = "" }) {
  return (
    <div className="res-row">
      <span className="res-k">{k}</span>
      <span className={`res-v ${tone === "bullUsd" ? "up" : tone === "bearUsd" ? "down" : ""}`}>{v}</span>
    </div>
  );
}
