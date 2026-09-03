// lib/confluence.js
// Menggabungkan sinyal per-timeframe (matrix) menjadi satu "bias confluence"
// per instrumen + mengklasifikasikan setup berdasarkan skor & konsistensi.
// Dipakai di halaman Teknikal dan bisa juga dipakai untuk "skor" instrumen.

// Bobot timeframe: timeframe lebih tinggi & lebih lama dianggap lebih "berat"
// (tren dominan), timeframe pendek untuk timing entry.
const TF_WEIGHT = { "15m": 1, "30m": 1.2, "1h": 1.5, "4h": 1.8, "1d": 2, "1w": 2.2, "1mo": 2.4 };

export function weights(tfs = []) {
  const out = [];
  for (const t of tfs) {
    const w = TF_WEIGHT[t.tf] != null ? TF_WEIGHT[t.tf] : 1;
    const dir = t.signal === "LONG" ? 1 : t.signal === "SHORT" ? -1 : 0;
    out.push({ ...t, w, dir, score: dir * w });
  }
  return out;
}

/** Skor confluence berbobot −10..+10 (10 = semua TF setuju BUY, −10 semua JUAL). */
export function confluenceScore(tfs = []) {
  const w = weights(tfs);
  const usable = w.filter((x) => x.ok);
  if (!usable.length) return { score: 0, count: 0, available: 0, label: "TIDAK CUKUP DATA" };
  const total = usable.reduce((a, b) => a + b.w, 0);
  const sum = usable.reduce((a, b) => a + b.score, 0);
  const normalized = (sum / total) * 10; // −10..10
  return {
    score: Math.round(normalized * 10) / 10,
    count: usable.length,
    available: w.length,
    label:
      normalized >= 5 ? "KONFLUENSI BULLISH KUAT"
      : normalized >= 3 ? "CENDERUNG BULLISH"
      : normalized >= 2 ? "BULLISH LEMAH"
      : normalized <= -5 ? "KONFLUENSI BEARISH KUAT"
      : normalized <= -3 ? "CENDERUNG BEARISH"
      : normalized <= -2 ? "BEARISH LEMAH"
      : "NETRAL / MIXED",
  };
}

/** Klasifikasi kualitas setup (A/B/C) untuk screener. */
export function setupGrade(tfs = []) {
  const c = confluenceScore(tfs);
  const up = tfs.filter((t) => t.ok && t.signal === "LONG").length;
  const dn = tfs.filter((t) => t.ok && t.signal === "SHORT").length;
  const align = up >= 4 || dn >= 4;
  const strong = Math.abs(c.score) >= 5;
  if (align && strong) return { grade: "A", note: "Sinyal selaras + kuat (setup terbaik)" };
  if (align || strong) return { grade: "B", note: "Sinyal cukup selaras / cukup kuat" };
  return { grade: "C", note: "Bias campuran — tunggu konfirmasi" };
}

/** Ringkas daftar TF (untuk UI kecil). */
export function tfSummary(tfs = []) {
  return tfs.map((t) => ({ tf: t.tf, signal: t.signal || "NETRAL", ok: !!t.ok }));
}

/**
 * Detector "Market Regime": klasifikasi kondisi pasar dari sebaran sinyal TF.
 *   - TREND      : mayoritas TF setuju satu arah (≥5 dari 7).
 *   - RANGE      : mayoritas TF netral (bias campuran / sideways).
 *   - TRANSISI   : seimbang antara dua arah (potensi breakout/reversal).
 */
export function detectRegime(tfs = []) {
  const ok = tfs.filter((t) => t.ok);
  const long = ok.filter((t) => t.signal === "LONG").length;
  const short = ok.filter((t) => t.signal === "SHORT").length;
  const neutral = ok.filter((t) => t.signal === "NETRAL").length;
  const n = ok.length || 1;

  let type, label, dir = "NETRAL";
  if (long >= 5) { type = "TREND"; label = "Tren Menanjak Kuat"; dir = "UP"; }
  else if (short >= 5) { type = "TREND"; label = "Tren Menurun Kuat"; dir = "DOWN"; }
  else if (long >= 4) { type = "TREND"; label = "Cenderung Tren Naik"; dir = "UP"; }
  else if (short >= 4) { type = "TREND"; label = "Cenderung Tren Turun"; dir = "DOWN"; }
  else if (neutral >= Math.ceil(n * 0.6)) { type = "RANGE"; label = "Sideways / Range"; }
  else { type = "TRANSISI"; label = "Transisi (campuran)"; }

  return { type, label, dir, long, short, neutral, count: n };
}
