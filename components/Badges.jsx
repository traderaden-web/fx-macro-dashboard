// components/Badges.jsx
// Badge dampak (High/Medium/Low), kategori, dan penanda negara (ikon garis).
import { IconFlag, IconGlobe } from "./Icons";

export function ImpactBadge({ level }) {
  const map = {
    High: { c: "#fb7185", bg: "rgba(251,113,133,0.16)" },
    Medium: { c: "#fbbf24", bg: "rgba(251,191,36,0.16)" },
    Low: { c: "#34d399", bg: "rgba(52,211,153,0.16)" },
  };
  const s = map[level] || map.Low;
  return (
    <span className="badge impact" style={{ color: s.c, background: s.bg }}>
      {level}
    </span>
  );
}

export function CategoryBadge({ id, label, color }) {
  return (
    <span className="badge cat" style={{ color, background: `${color}22` }}>
      <span className="dot" style={{ background: color }} />
      {label}
    </span>
  );
}

const CODE_LABEL = {
  US: "US", EZ: "EU", UK: "UK", JP: "JP", CN: "CN",
  AU: "AU", CA: "CA", CH: "CH", NZ: "NZ", GL: "GL",
};

/**
 * Penanda negara versi ikon garis (bendera/globe) + kode negara.
 * `showCode=false` hanya menampilkan ikon (untuk ruang sempit, mis. kartu pemilih).
 */
export function CountryFlag({ code, size = 16, showCode = true, className = "" }) {
  const label = CODE_LABEL[code] || code || "GL";
  const isGlobal = code === "GL";
  return (
    <span className={`country-tag ${isGlobal ? "global" : ""} ${className}`}>
      {isGlobal ? <IconGlobe size={size} /> : <IconFlag size={size} />}
      {showCode && <span className="country-code">{label}</span>}
    </span>
  );
}
