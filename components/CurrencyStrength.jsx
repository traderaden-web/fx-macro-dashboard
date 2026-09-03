// components/CurrencyStrength.jsx
// Meter "kekuatan mata uang" — dihitung dari pergerakan harga hari ini pada
// seluruh pasangan FX (lihat lib/strength.js). Komponen murni (tanpa hook),
// aman dipakai langsung di server component.

import { computeCurrencyStrength, riskBias } from "../lib/strength";

function barColor(score) {
  if (score >= 66) return "var(--up)";
  if (score >= 55) return "#86efac";
  if (score >= 45) return "var(--warn)";
  if (score >= 34) return "#fda4af";
  return "var(--down)";
}

export default function CurrencyStrength({ pairs = [], compact = false }) {
  const strength = computeCurrencyStrength(pairs);
  if (!strength.length) {
    return <div className="cell-muted">Menunggu data kurs…</div>;
  }
  const bias = riskBias(strength);
  const bg = (b) =>
    b?.label === "RISK-ON" ? "var(--up)" : b?.label === "RISK-OFF" ? "var(--down)" : "var(--warn)";
  const top = strength.slice(0, compact ? 5 : strength.length);
  const bottom = strength.slice(-compact ? -3 : -4).reverse();

  return (
    <div className="strength">
      {bias && (
        <div className="strength-bias">
          <span className="strength-bias-label">Sentimen Pasar</span>
          <span className="sentiment-chip" style={{ background: `rgba(255,255,255,0.08)` }}>
            <span className="pulse-dot" style={{ background: bg(bias), boxShadow: `0 0 0 0 ${bg(bias)}` }} />
            <strong>{bias.label}</strong>
          </span>
          <span className="cell-muted" style={{ marginLeft: "auto" }}>
            Risk-on {bias.riskOn} · Risk-off {bias.riskOff} · Δ {bias.gap > 0 ? "+" : ""}{bias.gap}
          </span>
        </div>
      )}

      <div className={`strength-grid ${compact ? "compact" : ""}`}>
        {strength.map((s) => (
          <div className="strength-item" key={s.currency} title={`${s.name} — ${s.label}`}>
            <div className="strength-head">
              <span className="strength-ccy">{s.currency}</span>
              <span className="strength-pct">
                <span style={{ color: barColor(s.score) }}>{s.pct > 0 ? "+" : ""}{s.pct}%</span>
              </span>
            </div>
            <div className="strength-track">
              <div
                className="strength-fill"
                style={{ width: `${s.score}%`, background: `linear-gradient(90deg, ${barColor(s.score)}, ${barColor(s.score)}dd)` }}
              />
            </div>
            <div className="strength-foot">
              <span className="strength-score">{s.score}</span>
              <span className="strength-tag" style={{ color: barColor(s.score) }}>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {!compact && (
        <div className="strength-legend">
          <span className="cell-muted">Paling kuat → {top.map((s) => s.currency).join(" · ")}</span>
          <span className="cell-muted">Paling lemah → {bottom.map((s) => s.currency).join(" · ")}</span>
        </div>
      )}
    </div>
  );
}
