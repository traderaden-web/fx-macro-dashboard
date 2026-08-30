// lib/data.js
// Loader data: mencoba ambil LIVE dari FRED, lalu fallback ke data/seed.json
// (hasil skrip scripts/fetch-all.mjs). Semua dipakai di server component.
//
// Performa:
// - Fetch dijalankan PARALEL (concurrency terbatas) — bukan satu per satu.
// - Negative cache: jika FRED tidak terjangkau, tidak dicoba ulang selama 5 menit.
// - Rentang tanggal dipangkas sesuai kebutuhan (132 titik + lookback) agar payload CSV lebih kecil.

import seed from "../data/seed.json";
import { getSeries, SERIES } from "./series";
import { fetchSeriesRaw, transformSeries, latestPoints, lastValue } from "./fred";
import { cached } from "./cache";

const LIVE = true; // aktifkan untuk mencoba fetch live dari FRED
const LIVE_TTL = 6 * 60 * 60 * 1000; // 6 jam — data bulanan jarang berubah
const FAIL_TTL = 5 * 60 * 1000; // negative cache 5 menit saat FRED gagal
const CONCURRENCY = 8; // jumlah request FRED paralel

const fails = new Map();
function recentFail(id) {
  const at = fails.get(id);
  return at !== undefined && Date.now() - at < FAIL_TTL;
}
function markFail(id) {
  fails.set(id, Date.now());
}

// Tanggal mulai per frekuensi: cukup 132 titik + lookback (YoY = 12 bulan / 4 kuartal).
function startForFreq(freq) {
  if (freq === "Q") return "1990-01-01"; // 132 kuartal ≈ 33 tahun
  return "2013-01-01"; // 132 bulan + 12 bulan lookback ≈ 12 tahun
}

/** Dapatkan data satu indikator (live dulu, fallback seed).
 *  def.noLive = true → selalu pakai seed (indikator yang sudah divalidasi
 *  terhadap kalender earningsapi/FF user 30-Agu-2026 — data FRED dunia nyata
 *  TIDAK cocok dgn dunia kalender user utk seri-seri tsb). */
export async function getSeriesData(id) {
  const def = getSeries(id);
  if (!def) return null;

  if (LIVE && !def.noLive && !recentFail(id)) {
    const live = await cached(`fred:${id}`, LIVE_TTL, async () => {
      const raw = await fetchSeriesRaw(def.fred, startForFreq(def.freq));
      const transformed = transformSeries(raw, def.mode);
      const points = latestPoints(transformed, 132);
      const last = lastValue(transformed);
      if (points.length) return { ...def, points, last, source: "live", updated: new Date().toISOString() };
      throw new Error("no data");
    }).catch((e) => {
      markFail(id);
      return null;
    });

    if (live) return live;
  }

  const entry = seed.series[id];
  if (entry) {
    return { ...def, points: entry.points, last: entry.last, source: "seed", updated: entry.updated };
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

/** Data seed mentah (tanpa mencoba live). */
export function getSeedSeries(id) {
  const def = getSeries(id);
  const entry = seed.series[id];
  if (!def || !entry) return null;
  return { ...def, points: entry.points, last: entry.last, source: "seed", updated: entry.updated };
}

export const SEED_META = {
  source: seed.source,
  generated: seed.generated,
};
