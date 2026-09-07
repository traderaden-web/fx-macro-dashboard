// scripts/fetch-all.mjs
// Mengambil data semua indikator dari FRED dan menyimpan data/seed.json.
// Dijalankan otomatis oleh GitHub Actions (.github/workflows/refresh-data.yml)
// setiap beberapa jam + tepat setelah jam rilis AS, sehingga fallback offline
// (seed) pun tidak pernah basi. Bisa juga manual: `npm run fetch`.
//
// Perilaku:
//  • Seri dengan `seedOnly`/tanpa kode FRED (ISM) diambil dari laporan resmi
//    ismworld.org (lib/ism.js) dan digabung ke entri lama; bila gagal, entri
//    lama dipertahankan apa adanya (jalur kurasi lewat data/releases.js).
//  • Bila satu seri gagal diambil, entri lama TETAP dipakai (asal basis
//    fred/mode-nya sama) → satu kegagalan jaringan tidak menghapus data.
//  • Setiap entri menyimpan `fred` & `mode` agar lib/data.js bisa memastikan
//    seed masih pada basis yang sama dengan definisi seri.
//  • FRED_CSV_DIR=<folder> membaca CSV lokal `<FREDID>.csv` (uji offline).

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SERIES } from "../lib/series.js";
import { fetchSeriesRaw, parseSeriesCsv, transformSeries, latestPoints, lastValue } from "../lib/fred.js";
import { fetchIsmLatest } from "../lib/ism.js";

const ISM_KIND = { ismmfg: "pmi", ismsvc: "services" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "data", "seed.json");
const POINTS = 132;
const CSV_DIR = process.env.FRED_CSV_DIR || null;

function startForFreq(freq) {
  if (freq === "Q") return "1990-01-01";
  if (freq === "W") return "2023-06-01";
  return "2013-01-01";
}

async function loadRaw(s) {
  if (CSV_DIR) {
    const text = await fs.readFile(path.join(CSV_DIR, `${s.fred}.csv`), "utf8");
    return parseSeriesCsv(text);
  }
  return fetchSeriesRaw(s.fred, startForFreq(s.freq), s.fredParams || {});
}

async function readOld() {
  try {
    return JSON.parse(await fs.readFile(OUT, "utf8"));
  } catch {
    return { series: {} };
  }
}

async function main() {
  const old = await readOld();
  const results = {};
  let ok = 0, fail = 0, kept = 0;

  for (const s of SERIES) {
    const prev = old.series?.[s.id];
    const sameBasis = prev && (prev.fred ?? null) === (s.fred ?? null) && prev.mode === s.mode;

    if (s.seedOnly || !s.fred) {
      const base = prev ? { ...prev, id: s.id, fred: s.fred ?? null, mode: s.mode, unit: s.unit, curated: true } : null;
      if (ISM_KIND[s.id] && !CSV_DIR) {
        try {
          const latest = await fetchIsmLatest(ISM_KIND[s.id]);
          const map = new Map((base?.points || []).map((p) => [p.date, p.value]));
          const changed = map.get(latest.date) !== latest.value;
          map.set(latest.date, latest.value);
          const points = [...map.entries()].map(([date, value]) => ({ date, value }))
            .sort((a, b) => a.date.localeCompare(b.date)).slice(-POINTS);
          const last = points[points.length - 1];
          results[s.id] = {
            ...(base || {}), id: s.id, fred: null, mode: s.mode, unit: s.unit, curated: true,
            source: "ISM (ismworld.org)", updated: new Date().toISOString(), last, points,
          };
          ok++;
          console.log(`✓ ${s.id.padEnd(12)} ${"ISM".padEnd(18)} last: ${latest.value} (${latest.date})${changed ? " [baru]" : ""}`);
          continue;
        } catch (e) {
          fail++;
          console.error(`✗ ${s.id.padEnd(12)} ISM -> ${e.message}${base ? " (entri lama dipertahankan)" : ""}`);
        }
      }
      if (base) {
        results[s.id] = base;
        kept++;
        console.log(`• ${s.id.padEnd(12)} (kurasi, tanpa FRED) dipertahankan`);
      }
      continue;
    }

    try {
      const raw = await loadRaw(s);
      const transformed = transformSeries(raw, s.mode);
      const points = latestPoints(transformed, POINTS);
      const last = lastValue(transformed);
      if (!points.length) throw new Error("tidak ada titik data");
      results[s.id] = {
        id: s.id,
        fred: s.fred,
        mode: s.mode,
        unit: s.unit,
        updated: new Date().toISOString(),
        last: { date: last.date, value: last.value },
        points,
      };
      ok++;
      console.log(`✓ ${s.id.padEnd(12)} ${s.fred.padEnd(18)} last: ${last.value} (${last.date})`);
    } catch (e) {
      fail++;
      if (sameBasis) {
        results[s.id] = prev;
        kept++;
        console.error(`✗ ${s.id.padEnd(12)} ${s.fred} -> ${e.message} (entri lama dipertahankan)`);
      } else {
        console.error(`✗ ${s.id.padEnd(12)} ${s.fred} -> ${e.message}`);
      }
    }
  }

  const bundle = {
    generated: new Date().toISOString(),
    source: "FRED (fred.stlouisfed.org/graph/fredgraph.csv)",
    ok,
    fail,
    kept,
    series: results,
  };
  await fs.writeFile(OUT, JSON.stringify(bundle, null, 2) + "\n", "utf8");
  console.log(`\nSelesai: ${ok} sukses, ${fail} gagal, ${kept} dipertahankan -> data/seed.json`);
  if (ok === 0 && !CSV_DIR) process.exit(2); // semua gagal → jangan anggap sukses
}

main().catch((e) => { console.error(e); process.exit(1); });
