// lib/patterns.js
// Deteksi pola candlestick + level breakout dari bar OHLC.
// Semua fungsi murni (tanpa dependensi) sehingga bisa diuji & dipakai di
// server route. Pola dikembalikan dengan arah (bullish/bearish/neutral) dan
// kekuatan 0–100 (bobot pendukung).

const clamp = (t, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, t));

// Body & shadow dalam satuan absolut (mengikuti skala harga).
function candle(c) {
  const body = Math.abs(c.c - c.o);
  const upper = Math.max(c.h, c.o, c.c) - Math.max(c.o, c.c);
  const lower = Math.min(c.o, c.c) - Math.min(c.l, c.o, c.c);
  const range = Math.max(c.h - c.l, 1e-9);
  return { bull: c.c > c.o, bear: c.c < c.o, body, upper, lower, range, midClose: (c.c + c.o) / 2 };
}

// Pola pada bar terakhir (indeks -1) dan sebelumnya.
function engulfing(bars, i) {
  const prev = candle(bars[i - 1]);
  const cur = candle(bars[i]);
  const dir = cur.bull ? "bullish" : "bearish";
  // Body saat ini menelan body sebelumnya (sinyal pembalikan).
  const engulfed = cur.bull
    ? cur.body > prev.body && cur.c > prev.c && cur.o < prev.o
    : cur.body > prev.body && cur.c < prev.c && cur.o > prev.o;
  if (!engulfed) return null;
  const extra = cur.range > prev.range ? 0.5 : 0.25;
  return { name: `${dir === "bullish" ? "Bullish" : "Bearish"} Engulfing`, dir, strength: 55 + (prev.body / prev.range) * 20 + extra * 20 };
}

// Pin bar (hammer/shooting star) — ekor panjang, badan kecil.
function pinbar(bars, i) {
  const c = candle(bars[i]);
  const bodyFrac = c.body / c.range;
  if (bodyFrac > 0.32) return null;
  // Hammer: ekor bawah panjang (bullish). Shooting star: ekor atas panjang (bearish).
  if (c.lower >= c.body * 2 && c.upper < c.body * 0.8) {
    return { name: "Pin Bar Bullish (Hammer)", dir: "bullish", strength: 55 + clamp(c.lower / c.range) * 30 };
  }
  if (c.upper >= c.body * 2 && c.lower < c.body * 0.8) {
    return { name: "Pin Bar Bearish (Shooting Star)", dir: "bearish", strength: 55 + clamp(c.upper / c.range) * 30 };
  }
  return null;
}

// Doji — body sangat kecil (indecision).
function doji(bars, i) {
  const c = candle(bars[i]);
  if (c.body / c.range > 0.06) return null;
  // Konfirmasi arah kecil dari posisi close relatif mid-range.
  const dir = c.midClose > bars[i].l + c.range * 0.55 ? "bullish" : c.midClose < bars[i].l + c.range * 0.45 ? "bearish" : "neutral";
  return { name: "Doji (Indecision)", dir, strength: 40 };
}

// Inside bar — bar saat ini sepenuhnya berada dalam range bar sebelumnya (kontraksi).
function insideBar(bars, i) {
  const p = bars[i - 1];
  const c = candle(bars[i]);
  if (c.h === undefined) return null;
  const inside = bars[i].h <= p.h && bars[i].l >= p.l;
  if (!inside) return null;
  return { name: "Inside Bar (Kontraksi)", dir: "neutral", strength: 45 };
}

// Three-white-soldiers / three-black-crows pada 3 bar terakhir.
function threeSoldiers(bars, i) {
  if (i < 2) return null;
  const a = candle(bars[i - 2]), b = candle(bars[i - 1]), c = candle(bars[i]);
  const up = a.bull && b.bull && c.bull && bars[i - 1].c > bars[i - 2].c && bars[i].c > bars[i - 1].c;
  const down = a.bear && b.bear && c.bear && bars[i - 1].c < bars[i - 2].c && bars[i].c < bars[i - 1].c;
  if (up) return { name: "Three White Soldiers", dir: "bullish", strength: 62 };
  if (down) return { name: "Three Black Crows", dir: "bearish", strength: 62 };
  return null;
}

// Breakout: bar menembus high/low dalam N bar terakhir (selain bar itu sendiri).
function breakout(bars, i, N = 20) {
  const from = Math.max(0, i - N);
  const window = bars.slice(from, i);
  if (window.length < 5) return null;
  const hi = Math.max(...window.map((b) => b.h));
  const lo = Math.min(...window.map((b) => b.l));
  const cur = bars[i];
  if (cur.c > hi && cur.c > cur.o) return { name: `Breakout Atas (${N} bar)`, dir: "bullish", strength: 58 };
  if (cur.c < lo && cur.c < cur.o) return { name: `Breakout Bawah (${N} bar)`, dir: "bearish", strength: 58 };
  return null;
}

/**
 * Deteksi semua pola pada `bars` (arahan "lookback" bar terakhir, default 6).
 * @returns {Array<{name,dir,strength,tf}>} — sudah diurut dari paling kuat.
 */
export function detectPatterns(bars, { lookback = 6, minBars = 30 } = {}) {
  if (!bars || bars.length < minBars) return [];
  const results = [];
  const start = Math.max(1, bars.length - lookback);
  for (let i = start; i < bars.length; i++) {
    const found = [
      engulfing(bars, i),
      pinbar(bars, i),
      doji(bars, i),
      insideBar(bars, i),
      threeSoldiers(bars, i),
      breakout(bars, i),
    ].filter(Boolean);
    for (const p of found) results.push({ ...p, idx: i });
  }
  // Urutkan dari paling kuat → lemah.
  results.sort((a, b) => b.strength - a.strength);
  return results;
}

/** Ambil pola paling "menonjol" (terkuat) saja, satu per bar terakhir. */
export function topPattern(bars, opts) {
  const all = detectPatterns(bars, opts);
  if (!all.length) return null;
  // Prioritaskan sinyal pembalikan (engulfing/pin/3 soldiers/breakout) di atas doji/inside.
  const prio = (p) => /Engulf|Pin|Three|Breakout/.test(p.name) ? 0 : 1;
  const sorted = all.sort((a, b) => prio(a) - prio(b) || b.strength - a.strength);
  return sorted[0];
}

/** Ringkas daftar pola menjadi baris UI. */
export function summarizePatterns(patterns, tf) {
  return patterns.map((p) => ({ ...p, tf }));
}
