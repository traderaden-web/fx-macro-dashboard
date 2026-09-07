// components/fundamentals/PulseStrip.jsx
// "Denyut Makro" — pita KPI global di puncak halaman /fundamentals:
// gauge sentimen risiko (dari pergerakan mata uang hari ini) + 6 tile KPI
// (Fed, inflasi AS, yield, VIX, emas, USD/IDR) dengan sparkline & badge sumber.

"use client";

import { useMemo } from "react";
import { riskBias } from "../../lib/strength";
import CountUp from "../CountUp";
import Sparkline from "../Sparkline";
import { SrcBadge, fmtID, pctID } from "./ui";

function TrendPill({ delta, neutral = false, invert = false, suffix = "" }) {
  if (delta == null || !Number.isFinite(delta)) return null;
  const zero = Math.abs(delta) < 0.0001;
  let up = delta > 0;
  if (invert) up = !up; // mis. USD/IDR naik = rupiah melemah (merah)
  return (
    <span className={`trend-pill ${zero ? "flat" : neutral ? "neutral" : up ? "up" : "down"}`}>
      {zero ? "–" : delta > 0 ? "▲" : "▼"} {pctID(delta)}{suffix}
    </span>
  );
}

function PulseTile({ p }) {
  const delta = p.prev != null && p.value != null ? ((p.value - p.prev) / Math.abs(p.prev)) * 100 : null;
  const rawDelta = p.prev != null && p.value != null ? p.value - p.prev : null;
  return (
    <div className="pulse-tile">
      <div className="pulse-top">
        <span className="pulse-label">{p.flag} {p.label}</span>
        <SrcBadge kind={p.sourceKind} label={p.sourceLabel} />
      </div>
      <div className="pulse-value-row">
        <span className="pulse-value"><CountUp value={p.value} decimals={p.decimals ?? 2} /></span>
        <span className="pulse-unit">{p.unit}</span>
      </div>
      <div className="pulse-meta">
        {p.showRawDelta && rawDelta != null && (
          <span className={`pulse-raw ${p.invertTrend ? (rawDelta < 0 ? "up" : rawDelta > 0 ? "down" : "") : rawDelta > 0 ? "up" : rawDelta < 0 ? "down" : ""}`}>
            {rawDelta > 0 ? "+" : ""}{fmtID(rawDelta, p.rawDecimals ?? 2)}
          </span>
        )}
        <TrendPill delta={delta} neutral={p.neutralTrend} invert={p.invertTrend} />
      </div>
      {p.spark?.length > 2 && <Sparkline points={p.spark} color={p.sparkColor || "#38bdf8"} />}
      <div className="pulse-foot">
        <span className="pulse-date">{p.dateLabel}</span>
        <span className="pulse-hint">{p.hint}</span>
      </div>
    </div>
  );
}

/** Gauge risk-on/off: jarum digerakkan gap rata-rata mata uang risk vs safe. */
function RiskGauge({ strength }) {
  const rb = useMemo(() => riskBias(strength), [strength]);
  const score = rb ? Math.max(0, Math.min(100, 50 + rb.gap * 1.8)) : 50;
  const tone = rb?.label.includes("RISK-ON") ? "on" : rb?.label.includes("RISK-OFF") ? "off" : "mid";
  return (
    <div className={`riskgauge ${tone}`}>
      <div className="rg-head">
        <span className="rg-title">Sentimen Risiko Hari Ini</span>
        <span className={`rg-label ${tone}`}>{rb?.label ?? "—"}</span>
      </div>
      <div className="rg-dial">
        <div className="rg-arc">
          <i className="rg-needle" style={{ transform: `rotate(${score * 1.8 - 90}deg)` }} />
        </div>
        <div className="rg-scale"><span>RISK-OFF</span><span>NETRAL</span><span>RISK-ON</span></div>
      </div>
      <div className="rg-meta">
        <div><span>Mata uang risk</span><b>{fmtID(rb?.riskOn ?? 0, 0)}</b></div>
        <div><span>Safe haven</span><b>{fmtID(rb?.riskOff ?? 0, 0)}</b></div>
        <div><span>Selisih</span><b className={rb?.gap > 0 ? "up" : rb?.gap < 0 ? "down" : ""}>{rb ? (rb.gap > 0 ? "+" : "") + fmtID(rb.gap, 1) : "—"}</b></div>
      </div>
      <p className="rg-note">
        Dihitung dari pergerakan harian mata uang: rata-rata AUD·NZD·CAD·GBP·IDR vs USD·JPY·CHF.
        Risk-on cenderung melemahkan dolar &amp; yen, menguatkan rupiah &amp; mata uang komoditas.
      </p>
    </div>
  );
}

export default function PulseStrip({ pulses = [], strength = [] }) {
  return (
    <section className="section fv-pulse-sec" id="denyut">
      <div className="section-head">
        <h2><span className="inline-ico">💓</span> Denyut Makro Global</h2>
        <span className="cell-muted">KPI inti yang menggerakkan semua mata uang — live bila tersedia</span>
      </div>
      <div className="fv-pulse">
        <RiskGauge strength={strength} />
        {pulses.map((p) => <PulseTile key={p.id} p={p} />)}
      </div>
    </section>
  );
}
