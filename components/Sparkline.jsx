// components/Sparkline.jsx
// Garis mini untuk kartu ringkasan.

export default function Sparkline({ points, color = "#38bdf8", width = 120, height = 36 }) {
  const data = (points || []).map((p) => p.value).filter((v) => typeof v === "number");
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const x = (i) => i * step;
  const y = (v) => height - ((v - min) / span) * (height - 4) - 2;

  const path = data.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="sparkline">
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
