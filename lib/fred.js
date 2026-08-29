// lib/fred.js
// Fetcher & parser untuk data FRED (Federal Reserve Economic Data).
// Menggunakan endpoint publik "fredgraph.csv" yang TIDAK memerlukan API key,
// dan otomatis memakai fallback ke seed lokal jika request gagal / offline.

const BASE = "https://fred.stlouisfed.org/graph/fredgraph.csv";

/**
 * Ambil deret waktu mentah dari FRED.
 * @param {string} id kode seri FRED, mis. "CPIAUCSL", "PAYEMS"
 * @param {string} start "YYYY-MM-DD"
 * @returns {Promise<Array<{date:string, value:number|null}>>}
 */
export async function fetchSeriesRaw(id, start = "2007-01-01") {
  const url = `${BASE}?id=${encodeURIComponent(id)}&cosd=${start}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000), cache: "no-store" });
  if (!res.ok) throw new Error(`FRED ${id} HTTP ${res.status}`);
  const text = await res.text();
  return parseSeriesCsv(text);
}

/**
 * Parse CSV fredgraph ke array {date, value}.
 * Baris dengan nilai "." (missing) dimasukkan sebagai null / di-skip.
 */
export function parseSeriesCsv(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const comma = line.lastIndexOf(",");
    if (comma < 0) continue;
    const date = line.slice(0, comma).trim();
    const raw = line.slice(comma + 1).trim();
    // tanggal format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    const value = raw === "." || raw === "" ? null : parseFloat(raw);
    out.push({ date, value });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Transformasi deret
// ---------------------------------------------------------------------------

/** Ubah deret ke key "YYYY-MM". */
function toMonthKey(date) {
  return date.slice(0, 7);
}

/** Ambil nilai terakhir yang bukan null untuk sebuah kunci bulan. */
function lookup(values) {
  const map = new Map();
  for (const d of values) {
    if (d.value !== null && d.value !== undefined) {
      map.set(toMonthKey(d.date), d.value);
    }
  }
  // gunakan juga mapping tanggal penuh untuk seri harian (year-month-day)
  const days = new Map();
  for (const d of values) {
    if (d.value !== null && d.value !== undefined) {
      days.set(d.date, d.value);
    }
  }
  return { map, days };
}

function shiftMonthKey(key, months) {
  const [y, m] = key.split("-").map(Number);
  const total = y * 12 + (m - 1) + months;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return `${ny}-${String(nm).padStart(2, "0")}`;
}

/**
 * Hitung turunan (monthly change atau YoY) untuk sejumlah seri.
 * @param {Array<{date,value}>} raw
 * @param {"level"|"monthly_change"|"yoy"|"yoy_pct"} mode
 */
export function transformSeries(raw, mode) {
  if (mode === "level") {
    // kembalikan rata-rata per bulan agar seri harian jadi bulanan
    return aggregateMonthly(raw);
  }
  const { map } = lookup(raw);
  const keys = [...map.keys()].sort();
  const out = [];
  for (const key of keys) {
    const base = map.get(key);
    if (base === null || base === undefined) continue;
    if (mode === "monthly_change") {
      const prevKey = shiftMonthKey(key, -1);
      const prev = map.get(prevKey);
      if (prev === undefined) continue;
      out.push({ date: `${key}-01`, value: round(base - prev, 2) });
    } else if (mode === "mom_pct") {
      const prevKey = shiftMonthKey(key, -1);
      const prev = map.get(prevKey);
      if (prev === undefined || prev === 0) continue;
      out.push({ date: `${key}-01`, value: round(((base - prev) / prev) * 100, 2) });
    } else if (mode === "yoy_pct") {
      const prevKey = shiftMonthKey(key, -12);
      const prev = map.get(prevKey);
      if (prev === undefined || prev === 0) continue;
      out.push({ date: `${key}-01`, value: round(((base - prev) / prev) * 100, 2) });
    }
  }
  return out;
}

/** Rata-rata nilai per bulan (untuk seri harian). */
function aggregateMonthly(raw) {
  const byMonth = new Map();
  for (const d of raw) {
    if (d.value === null || d.value === undefined) continue;
    const key = toMonthKey(d.date);
    if (!byMonth.has(key)) byMonth.set(key, []);
    byMonth.get(key).push(d.value);
  }
  const keys = [...byMonth.keys()].sort();
  return keys.map((k) => ({ date: `${k}-01`, value: round(avg(byMonth.get(k)), 2) }));
}

function avg(arr) {
  if (!arr.length) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function round(n, d = 2) {
  if (n === null || n === undefined || isNaN(n)) return n;
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}

/** Ambil titik data terakhir beserta beberapa titik sebelumnya. */
export function latestPoints(points, n = 12) {
  const valid = points.filter((p) => p.value !== null && p.value !== undefined);
  return valid.slice(-n);
}

export function lastValue(points) {
  const valid = points.filter((p) => p.value !== null && p.value !== undefined);
  return valid.length ? valid[valid.length - 1] : null;
}
