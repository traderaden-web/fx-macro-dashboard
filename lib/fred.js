// lib/fred.js
// Fetcher & parser untuk data FRED (Federal Reserve Economic Data).
// Menggunakan endpoint publik "fredgraph.csv" yang TIDAK memerlukan API key,
// dan otomatis memakai fallback ke seed lokal jika request gagal / offline.
//
// Juga menyediakan akses ALFRED (arsip vintage FRED) untuk mengambil ANGKA
// RILIS PERTAMA (first print) sebuah periode — angka yang benar-benar dilihat
// pasar saat rilis, sebelum direvisi.

const BASE = "https://fred.stlouisfed.org/graph/fredgraph.csv";
const ALFRED = "https://alfred.stlouisfed.org/graph/alfredgraph.csv";
const TIMEOUT = 8000;

/**
 * Ambil deret waktu mentah dari FRED.
 * @param {string} id kode seri FRED, mis. "CPIAUCSL", "PAYEMS"
 * @param {string} start "YYYY-MM-DD"
 * @param {Record<string,string>} [params] parameter tambahan fredgraph
 *        (mis. { fq: "Monthly", fam: "eop" } untuk agregasi di sisi FRED)
 * @returns {Promise<Array<{date:string, value:number|null}>>}
 */
export async function fetchSeriesRaw(id, start = "2007-01-01", params = {}) {
  const q = new URLSearchParams({ id, cosd: start, ...params });
  const url = `${BASE}?${q.toString()}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT), cache: "no-store" });
  if (!res.ok) throw new Error(`FRED ${id} HTTP ${res.status}`);
  const text = await res.text();
  const rows = parseSeriesCsv(text);
  if (!rows.length && /<html/i.test(text)) throw new Error(`FRED ${id}: seri tidak ditemukan`);
  return rows;
}

/**
 * Ambil deret sebagaimana tersedia pada tanggal `vintage` (ALFRED).
 * Dipakai skrip cron untuk merekam first print tiap rilis.
 */
export async function fetchSeriesVintage(id, vintage, start = "2007-01-01") {
  const q = new URLSearchParams({ id, cosd: start, vintage_date: vintage });
  const url = `${ALFRED}?${q.toString()}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT), cache: "no-store" });
  if (!res.ok) throw new Error(`ALFRED ${id}@${vintage} HTTP ${res.status}`);
  return parseSeriesCsv(await res.text());
}

/**
 * Parse CSV fredgraph ke array {date, value}.
 * Baris dengan nilai "." (missing) dimasukkan sebagai null / di-skip.
 * Kolom nilai diambil dari kolom TERAKHIR sehingga header ALFRED
 * ("PAYEMS_20260904") juga terbaca.
 */
export function parseSeriesCsv(text) {
  const lines = String(text || "").trim().split("\n");
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
    out.push({ date, value: Number.isFinite(value) ? value : null });
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

/** Peta bulan → nilai terakhir yang bukan null pada bulan tsb. */
function monthMap(values) {
  const map = new Map();
  for (const d of values) {
    if (d.value !== null && d.value !== undefined) map.set(toMonthKey(d.date), d.value);
  }
  return map;
}

function shiftMonthKey(key, months) {
  const [y, m] = key.split("-").map(Number);
  const total = y * 12 + (m - 1) + months;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return `${ny}-${String(nm).padStart(2, "0")}`;
}

/**
 * Hitung turunan untuk sejumlah seri.
 * @param {Array<{date,value}>} raw
 * @param {"level"|"level_last"|"raw"|"monthly_change"|"monthly_change_k"|"mom_pct"|"yoy_pct"|"qq_ann_pct"} mode
 *   level            rata-rata per bulan (seri harian → bulanan)
 *   level_last       nilai TERAKHIR tiap bulan (mis. target Fed Funds: level setelah FOMC)
 *   raw              apa adanya (mis. klaim pengangguran mingguan)
 *   monthly_change   selisih vs bulan sebelumnya (NFP, ribuan)
 *   monthly_change_k selisih vs bulan sebelumnya ÷ 1000 (ADP: orang → ribu)
 *   mom_pct          % perubahan vs bulan sebelumnya
 *   yoy_pct          % perubahan vs 12 bulan sebelumnya
 *   qq_ann_pct       % perubahan kuartalan disetahunkan
 */
export function transformSeries(raw, mode) {
  if (mode === "level") return aggregateMonthly(raw);
  if (mode === "level_last") {
    const map = monthMap(raw);
    return [...map.keys()].sort().map((k) => ({ date: `${k}-01`, value: round(map.get(k), 2) }));
  }
  if (mode === "raw") {
    return raw.filter((d) => d.value !== null && d.value !== undefined).map((d) => ({ date: d.date, value: d.value }));
  }
  const map = monthMap(raw);
  const keys = [...map.keys()].sort();
  const out = [];
  for (const key of keys) {
    const base = map.get(key);
    if (base === null || base === undefined) continue;
    if (mode === "monthly_change" || mode === "monthly_change_k") {
      const prev = map.get(shiftMonthKey(key, -1));
      if (prev === undefined) continue;
      const div = mode === "monthly_change_k" ? 1000 : 1;
      out.push({ date: `${key}-01`, value: round((base - prev) / div, 2) });
    } else if (mode === "mom_pct") {
      const prev = map.get(shiftMonthKey(key, -1));
      if (prev === undefined || prev === 0) continue;
      out.push({ date: `${key}-01`, value: round(((base - prev) / prev) * 100, 2) });
    } else if (mode === "yoy_pct") {
      const prev = map.get(shiftMonthKey(key, -12));
      if (prev === undefined || prev === 0) continue;
      out.push({ date: `${key}-01`, value: round(((base - prev) / prev) * 100, 2) });
    } else if (mode === "qq_ann_pct") {
      const prev = map.get(shiftMonthKey(key, -3));
      if (prev === undefined || prev <= 0 || base <= 0) continue;
      out.push({ date: `${key}-01`, value: round((Math.pow(base / prev, 4) - 1) * 100, 2) });
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

/** Nilai transformasi untuk SATU periode `obs` dari deret mentah (dipakai first print). */
export function valueAt(raw, mode, obs) {
  const t = transformSeries(raw, mode);
  const hit = t.find((p) => p.date === obs);
  return hit ? hit.value : null;
}
