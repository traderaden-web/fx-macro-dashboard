// lib/predictions.js
// Engine komunitas "Prediksi Rilis": simpan prediksi (best-effort JSON file),
// nilai akurasi terhadap ACTUAL, dan susun leaderboard.
//
// Catatan: penyimpanan file JSON cukup untuk demo/tampilan. Untuk produksi yang
// benar, ganti dengan DB persisten (Supabase/Postgres) — lihat README.
//
// Skor per prediksi: 0–100, makin dekat prediksi ke ACTUAL makin tinggi.
//   errorRatio = |predicted - actual| / scale
//   score = clamp(100 - errorRatio * 40, 0, 100)

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "predictions.json");
const scaleOf = (id) =>
  (id === "nfp" && 100) ||
  (id === "cpi" && 1) ||
  (id === "corecpi" && 1) ||
  (id === "unemp" && 1) ||
  (id === "fedfunds" && 0.25) ||
  (id === "gdp" && 0.5) ||
  (id === "ahe" && 0.2) ||
  (id === "retail" && 0.5) ||
  1;

// Bersihkan angka menjadi numerik (terima "85k", "3.4%", "85", dsb.).
export function parseNumber(v) {
  if (v == null) return null;
  const n = Number(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

let cache = null;
function load() {
  if (cache) return cache;
  try {
    if (existsSync(FILE)) cache = JSON.parse(readFileSync(FILE, "utf8"));
  } catch { /* ignore */ }
  cache = cache || { predictions: [] };
  return cache;
}
function persist(data) {
  cache = data;
  try {
    if (!existsSync(path.dirname(FILE))) mkdirSync(path.dirname(FILE), { recursive: true });
    writeFileSync(FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("[predictions] write gagal:", e?.message || e);
  }
}

/** Hitung skor satu prediksi (0–100). */
export function scorePrediction(predicted, actual, indicatorId) {
  const p = parseNumber(predicted);
  const a = parseNumber(actual);
  const scale = scaleOf(indicatorId);
  if (p == null || a == null) return null;
  const err = Math.abs(p - a) / scale;
  return Math.round(Math.max(0, Math.min(100, 100 - err * 40)));
}

/** Ambil prediksi per (indicatorId, releaseDate). */
export function getPredictions({ indicatorId, releaseDate } = {}) {
  let list = load().predictions || [];
  if (indicatorId) list = list.filter((p) => p.indicatorId === indicatorId);
  if (releaseDate) list = list.filter((p) => p.releaseDate === releaseDate);
  return list;
}

/** Simpan prediksi baru. Return prediksi yang tersimpan. */
export function addPrediction({ name, indicatorId, releaseDate, title, predicted, note }) {
  const data = load();
  const p = {
    id: data.predictions.length + 1,
    name: (name || "").trim() || "Anonim",
    indicatorId,
    releaseDate,
    title: title || indicatorId,
    predicted: parseNumber(predicted) ?? predicted,
    note: (note || "").trim(),
    ts: new Date().toISOString(),
  };
  data.predictions.push(p);
  persist(data);
  return p;
}

/** Susun leaderboard berdasarkan prediksi yang sudah graded (punya actual). */
export function leaderboard(actualsByRelease = {}) {
  const all = load().predictions || [];
  const byName = {};
  for (const p of all) {
    const key = `${p.indicatorId}::${p.releaseDate}`;
    const actual = actualsByRelease[key];
    const score = actual != null ? scorePrediction(p.predicted, actual, p.indicatorId) : null;
    const rec = (byName[p.name] = byName[p.name] || { name: p.name, n: 0, total: 0, graded: 0 });
    if (score != null) { rec.total += score; rec.graded += 1; }
    rec.n += 1;
  }
  return Object.values(byName)
    .map((r) => ({ ...r, avg: r.graded ? Math.round(r.total / r.graded) : null }))
    .filter((r) => r.graded > 0)
    .sort((a, b) => (b.avg || 0) - (a.avg || 0))
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

/** Pengaturan label & skala UI per rilis penting. */
export const OPEN_EVENTS = [
  { indicatorId: "nfp", releaseDate: "2026-09-04", title: "Nonfarm Payrolls (NFP)", unit: "ribu", expected: 58 },
  { indicatorId: "cpi", releaseDate: "2026-09-11", title: "CPI y/y (AS)", unit: "%", expected: 3.4 },
  { indicatorId: "fedfunds", releaseDate: "2026-09-17", title: "FOMC Federal Funds Rate", unit: "%", expected: 3.75 },
];
