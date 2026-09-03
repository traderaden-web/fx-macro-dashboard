// components/RiskGauge.jsx
// Gauge "Risk Appetite" (0% = risk-off ekstrem, 100% = risk-on ekstrem).
// Dibangun dari dua sumber yang tersedia server-side:
//   • VIX (indeks ketakutan) — makin tinggi VIX, makin risk-off.
//   • Bias mata uang (Currency Strength) — gap risk-on vs risk-off.
// Murni presentasi, tanpa hook, aman untuk server component.

// Skor dari VIX: VIX 12 → 100 (euforia), VIX 40+ → 0 (panik).
function vixScore(vix) {
  if (vix == null || Number.isNaN(Number(vix))) return 50;
  const v = Number(vix);
  const clamped = Math.max(10, Math.min(45, v));
  return Math.round(((45 - clamped) / 35) * 100);
}

export default function RiskGauge({ vix, biasGap = 0, biasLabel = "NETRAL" }) {
  const v = vixScore(vix);
  // Gabung dengan bias currency: biasGap berkisar ±15 → gandakan jadi ±30 poin.
  // Seimbangkan VIX (money-flow/vol) dengan bias mata uang (sentimen arah).
  const gap = Math.max(-15, Math.min(15, Number(biasGap) || 0));
  const biasScore = Math.max(0, Math.min(100, 50 + gap * 2));
  const combined = Math.max(0, Math.min(100, Math.round(v * 0.5 + biasScore * 0.5)));

  const label =
    combined >= 70 ? "RISK-ON" : combined >= 56 ? "RISK-ON LEMAH" : combined >= 45 ? "NETRAL" : combined >= 30 ? "RISK-OFF LEMAH" : "RISK-OFF";
  const color =
    combined >= 60 ? "var(--up)" : combined >= 45 ? "var(--warn)" : "var(--down)";
  const angle = -90 + (combined / 100) * 180; // -90° (kiri) → +90° (kanan)

  return (
    <div className="gauge">
      <div className="gauge-head">
        <span className="gauge-title">Risk Appetite</span>
        <span className="gauge-value" style={{ color }}>
          <strong>{combined}%</strong> <span>{label}</span>
        </span>
      </div>
      <div className="gauge-dial">
        <div className="gauge-arc">
          <span className="gauge-zones">
            <i className="gz gz-low" />
            <i className="gz gz-mid" />
            <i className="gz gz-high" />
          </span>
          <span className="gauge-needle" style={{ transform: `rotate(${angle}deg)` }}>
            <i />
          </span>
        </div>
        <div className="gauge-scale">
          <span>RISK-OFF</span>
          <span>NETRAL</span>
          <span>RISK-ON</span>
        </div>
      </div>
      <div className="gauge-meta">
        <span className="cell-muted">VIX: {vix == null ? "—" : Number(vix).toFixed(1)}</span>
        <span className="cell-muted">Currency bias: {biasLabel}</span>
      </div>
    </div>
  );
}
