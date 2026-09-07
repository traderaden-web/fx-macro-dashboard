// components/terminal/fmt.js
// Helper format harga/pip/jarak untuk semua panel Terminal.

export const PIP_SIZE = {
  eurusd: 0.0001, gbpusd: 0.0001, audusd: 0.0001, nzdusd: 0.0001,
  usdcad: 0.0001, usdchf: 0.0001, usdjpy: 0.01,
  gold: 0.1, silver: 0.01, wti: 0.01, dxy: 0.01,
};

const DECIMALS = {
  eurusd: 5, gbpusd: 5, audusd: 5, nzdusd: 5, usdcad: 5, usdchf: 5,
  usdjpy: 3, gold: 2, silver: 3, wti: 2, dxy: 3,
};

/** Format harga sesuai presisi instrumen. */
export function fmtPrice(symbolId, v) {
  if (v == null || !isFinite(v)) return "—";
  const d = DECIMALS[symbolId] ?? (Math.abs(v) >= 1000 ? 1 : 4);
  return Number(v).toLocaleString("en-US", {
    minimumFractionDigits: d, maximumFractionDigits: d,
  });
}

/** Format jarak (pts) jadi pip 1 desimal. */
export function fmtPips(symbolId, pts) {
  if (pts == null || !isFinite(pts)) return "—";
  const pip = PIP_SIZE[symbolId] || 0.0001;
  return `${(Math.abs(pts) / pip).toFixed(1)} pip`;
}

/** Format jarak sebagai persen dari harga referensi. */
export function fmtPct(ref, dist) {
  if (dist == null || ref == null || !ref) return "—";
  return `${((Math.abs(dist) / ref) * 100).toFixed(2)}%`;
}

/** Teks "n bar lalu" atau "baru saja". */
export function barsAgo(n) {
  if (n == null) return "";
  if (n <= 0) return "bar ini";
  if (n === 1) return "1 bar lalu";
  return `${n} bar lalu`;
}

/** Label arah konsisten. */
export const DIR = {
  bullish: { text: "BULLISH", arrow: "▲", cls: "up" },
  bearish: { text: "BEARISH", arrow: "▼", cls: "down" },
  neutral: { text: "NETRAL", arrow: "◆", cls: "flat" },
};

export const SIG = {
  LONG: { text: "LONG — BELI", short: "LONG", arrow: "▲", cls: "sig-long" },
  SHORT: { text: "SHORT — JUAL", short: "SHORT", arrow: "▼", cls: "sig-short" },
  NETRAL: { text: "NETRAL — TUNGGU", short: "NETRAL", arrow: "◆", cls: "sig-neutral" },
};

export const TF_LABEL = {
  "1m": "1 Menit", "5m": "5 Menit",
  "15m": "15 Menit", "30m": "30 Menit", "1h": "1 Jam", "4h": "4 Jam",
  "1d": "Harian", "1w": "Mingguan", "1mo": "Bulanan",
};
export const TF_SHORT = {
  "1m": "M1", "5m": "M5",
  "15m": "15m", "30m": "30m", "1h": "1H", "4h": "4H", "1d": "1D", "1w": "1W", "1mo": "1B",
};
export const TV_INTERVAL = {
  "1m": "1", "5m": "5",
  "15m": "15", "30m": "30", "1h": "60", "4h": "240", "1d": "D", "1w": "W", "1mo": "1M",
};
/** TF pola candlestick (API /api/patterns mendukung 4 TF ini). */
export const PATTERN_TFS = ["15m", "1h", "4h", "1d"];
export const nearestPatternTf = (tf) =>
  PATTERN_TFS.includes(tf) ? tf : tf === "30m" ? "15m" : "1d";
