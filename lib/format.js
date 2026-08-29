// lib/format.js
export function fmt(v, decimals = 2) {
  if (v === null || v === undefined || isNaN(v)) return "—";
  return Number(v).toLocaleString("id-ID", { maximumFractionDigits: decimals, minimumFractionDigits: 0 });
}

export function fmtMonth(dateStr) {
  if (!dateStr) return "—";
  const [y, m] = dateStr.slice(0, 7).split("-");
  return `${m}/${y.slice(2)}`;
}
