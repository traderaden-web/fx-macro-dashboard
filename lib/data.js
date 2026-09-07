// lib/data.js
// Loader data indikator: LIVE dari FRED pada setiap request (dengan cache
// singkat), fallback ke data/seed.json (diperbarui otomatis oleh GitHub
// Actions tiap 6 jam — lihat .github/workflows/refresh-data.yml).
//
// Prinsip "selalu terbaru":
//  • TTL cache FRED hanya 30 menit; di sekitar jadwal rilis (3 jam setelah
//    waktu rilis di kalender) TTL turun ke 3 menit sehingga angka baru muncul
//    beberapa menit setelah FRED memuatnya (biasanya < 15 menit pasca rilis).
//  • Bila live gagal, seed dipakai — tetapi jika seed ternyata memuat titik
//    LEBIH BARU daripada hasil live (mis. FRED sedang memulihkan seri), kedua
//    sumber digabung sehingga data tidak pernah mundur.
//  • Seri tanpa sumber FRED (ISM) memakai seed + kolom `actual` opsional di
//    data/releases.js (jalur manual / kurasi).
//  • USE_SEED_ONLY=1 mematikan live (untuk pengujian offline).

import seed from "../data/seed.json";
import { getSeries, SERIES } from "./series";
import { fetchSeriesRaw, transformSeries, latestPoints, lastValue } from "./fred";
import { cached } from "./cache";
import { UPCOMING } from "../data/calendar";
import { CONSENSUS } from "../data/releases";
import { fetchIsmLatest } from "./ism";

// Seri tanpa FRED yang punya sumber live sendiri (laporan resmi ISM).
const ISM_KIND = { ismmfg: "pmi", ismsvc: "services" };

const LIVE = process.env.USE_SEED_ONLY !== "1";
const LIVE_TTL = 30 * 60 * 1000; // 30 menit
const HOT_TTL = 3 * 60 * 1000; // 3 menit di jendela rilis
const HOT_WINDOW_MS = 3 * 60 * 60 * 1000; // 3 jam setelah jadwal rilis
const FAIL_TTL = 3 * 60 * 1000; // negative cache 3 menit saat FRED gagal
const CONCURRENCY = 8;
const MAX_POINTS = 132;

const fails = new Map();
function recentFail(id) {
  const at = fails.get(id);
  return at !== undefined && Date.now() - at < FAIL_TTL;
}
function markFail(id) {
  fails.set(id, Date.now());
}

// Tanggal mulai per frekuensi: 132 titik + lookback (YoY = 12 bulan / 4 kuartal).
function startForFreq(freq) {
  if (freq === "Q") return "1990-01-01";
  if (freq === "W") return "2023-06-01";
  return "2013-01-01";
}

/** Apakah ada rilis terjadwal untuk indikator ini dalam 3 jam terakhir? */
export function inReleaseWindow(id, now = Date.now()) {
  for (const e of UPCOMING) {
    if (e.indicatorId !== id) continue;
    const t = new Date(e.iso).getTime();
    if (t <= now && now - t < HOT_WINDOW_MS) return true;
  }
  return false;
}

function ttlFor(id) {
  return inReleaseWindow(id) ? HOT_TTL : LIVE_TTL;
}

/** Ambil & transformasi deret FRED sesuai definisi seri. */
async function fetchLive(def) {
  const raw = await fetchSeriesRaw(def.fred, startForFreq(def.freq), def.fredParams || {});
  const transformed = transformSeries(raw, def.mode);
  const points = latestPoints(transformed, MAX_POINTS);
  const last = lastValue(transformed);
  if (!points.length) throw new Error("no data");
  return { points, last, updated: new Date().toISOString() };
}

/** Titik seed untuk seri; null jika basis (fred/mode) sudah tidak sama dengan definisi. */
function seedPoints(def) {
  const entry = seed.series[def.id];
  if (!entry || !Array.isArray(entry.points) || !entry.points.length) return null;
  const sameBasis = (entry.fred ?? null) === (def.fred ?? null) && entry.mode === def.mode;
  return { points: entry.points, last: entry.last, updated: entry.updated, sameBasis };
}

/** Kolom `actual` manual di data/releases.js (jalur kurasi utk seri tanpa FRED). */
function curatedPoints(def) {
  const rows = CONSENSUS[def.id] || [];
  return rows
    .filter((r) => r.obs && r.actual !== undefined && r.actual !== null)
    .map((r) => ({ date: r.obs, value: r.actual }));
}

/** Gabungkan dua deret berdasarkan tanggal; `primary` menimpa `secondary`. */
function mergePoints(primary, secondary) {
  const map = new Map();
  for (const p of secondary || []) map.set(p.date, p.value);
  for (const p of primary || []) map.set(p.date, p.value);
  return [...map.entries()]
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-MAX_POINTS);
}

function finalize(def, points, source, updated) {
  const pts = points.filter((p) => p.value !== null && p.value !== undefined);
  const last = pts.length ? pts[pts.length - 1] : null;
  return { ...def, points: pts, last, source, updated };
}

/**
 * Data satu indikator: {…def, points, last, source, updated}
 *   source = "live"  → FRED live pada request ini (atau cache ≤ 30 mnt)
 *            "seed"  → fallback data/seed.json
 *            "curated" → seri tanpa FRED (ISM) dari seed + kurasi
 */
export async function getSeriesData(id) {
  const def = getSeries(id);
  if (!def) return null;

  const sp = seedPoints(def);
  const seedBase = sp && sp.sameBasis ? sp.points : [];
  const curated = curatedPoints(def);

  // Seri tanpa sumber FRED → seed + kurasi (+ ISM live dari ismworld.org).
  if (def.seedOnly || !def.fred) {
    let pts = mergePoints(curated, sp?.points || []);
    let source = "curated";
    let updated = sp?.updated || null;
    if (LIVE && ISM_KIND[def.id] && !recentFail(def.id)) {
      const latest = await cached(`ism:${def.id}`, ttlFor(def.id), () => fetchIsmLatest(ISM_KIND[def.id])).catch(() => {
        markFail(def.id);
        return null;
      });
      if (latest) {
        pts = mergePoints([latest], pts);
        source = "live";
        updated = new Date().toISOString();
      }
    }
    if (!pts.length) return null;
    return finalize(def, pts, source, updated);
  }

  if (LIVE && !recentFail(id)) {
    const live = await cached(`fred:${id}`, ttlFor(id), () => fetchLive(def)).catch(() => {
      markFail(id);
      return null;
    });
    if (live) {
      // jangan pernah mundur: bila seed punya titik lebih baru, gabungkan.
      const seedNewer = seedBase.filter((p) => !live.last || p.date > live.last.date);
      const pts = seedNewer.length ? mergePoints(live.points, seedNewer) : live.points;
      return finalize(def, mergePoints(curated, pts), "live", live.updated);
    }
  }

  if (seedBase.length || curated.length) {
    return finalize(def, mergePoints(curated, seedBase), "seed", sp?.updated || null);
  }
  return null;
}

/** Eksekusi async dengan batas konkurensi, hasil tetap sesuai urutan input. */
async function pool(items, limit, fn) {
  const results = new Array(items.length);
  let idx = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (idx < items.length) {
      const i = idx++;
      try {
        results[i] = await fn(items[i]);
      } catch {
        results[i] = null;
      }
    }
  });
  await Promise.all(runners);
  return results;
}

/** Data semua indikator (untuk halaman ringkasan) — diparalel. */
export async function getAllSeriesData() {
  const out = await pool(SERIES, CONCURRENCY, (s) => getSeriesData(s.id));
  return out.filter(Boolean);
}

/** Data seed mentah (tanpa mencoba live). Null bila basis seed sudah berbeda. */
export function getSeedSeries(id) {
  const def = getSeries(id);
  if (!def) return null;
  const sp = seedPoints(def);
  if (!sp || !sp.sameBasis) return null;
  return finalize(def, sp.points, "seed", sp.updated);
}

/** Stempel waktu "data terbaru" dari sekumpulan seri (ISO) — untuk label ASOF. */
export function latestUpdated(list) {
  let best = null;
  for (const s of list || []) {
    const u = s?.updated;
    if (u && (!best || u > best)) best = u;
  }
  return best || seed.generated;
}

export const SEED_META = {
  source: seed.source,
  generated: seed.generated,
};
