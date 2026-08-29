// scripts/fetch-all.mjs
// Mengambil data semua indikator dari FRED dan menyimpan JSON ke folder data/.
// Berjalan di Node (runtime) atau bisa dipanggil oleh serverless untuk make cache.
// Hasilnya juga dijadikan fallback ketika akses FRED tidak tersedia.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SERIES } from "../lib/series.js";
import { fetchSeriesRaw, transformSeries, latestPoints, lastValue } from "../lib/fred.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "data");

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const results = {};
  let ok = 0, fail = 0;

  for (const s of SERIES) {
    try {
      const raw = await fetchSeriesRaw(s.fred, "2007-01-01");
      const transformed = transformSeries(raw, s.mode);
      const points = latestPoints(transformed, 120);
      const last = lastValue(transformed);
      results[s.id] = {
        id: s.id,
        fred: s.fred,
        mode: s.mode,
        unit: s.unit,
        updated: new Date().toISOString(),
        last: last ? { date: last.date, value: last.value } : null,
        points,
      };
      ok++;
      console.log(`✓ ${s.id.padEnd(12)} ${s.fred.padEnd(14)} last:`, last ? `${last.value} (${last.date})` : "n/a");
    } catch (e) {
      fail++;
      console.error(`✗ ${s.id.padEnd(12)} ${s.fred} -> ${e.message}`);
    }
  }

  const bundle = {
    generated: new Date().toISOString(),
    source: "FRED (fred.stlouisfed.org/graph/fredgraph.csv)",
    ok,
    fail,
    series: results,
  };
  await fs.writeFile(path.join(OUT, "seed.json"), JSON.stringify(bundle, null, 2), "utf8");
  console.log(`\nSelesai: ${ok} sukses, ${fail} gagal -> data/seed.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
