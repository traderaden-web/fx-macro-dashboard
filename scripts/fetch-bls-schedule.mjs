// scripts/fetch-bls-schedule.mjs
// Mengambil JADWAL RESMI rilis BLS (Employment Situation/NFP, CPI, PPI, JOLTS,
// ECI) dari kalender iCal publik BLS dan menyimpannya ke data/schedule-us.json.
// BLS memublikasikan jadwal ±12 bulan ke depan, jadi kalender aplikasi selalu
// punya tanggal rilis resmi tanpa perlu diketik manual.
//
// Dijalankan otomatis oleh GitHub Actions (refresh-data.yml) — manual:
//   npm run fetch:schedule
//
// Format keluaran:
//   { source, updated, releases: [ { name, date (ET), time (ET), indicators[], obs? } ] }
// `obs` hanya diisi bila periode data menyimpang dari aturan baku
// (mis. rilis susulan pasca government shutdown 2025).

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "data", "schedule-us.json");
const ICS_URL = "https://www.bls.gov/schedule/news_release/bls.ics";

/** SUMMARY BLS → indikator MacroLab. Rilis lain di ICS diabaikan. */
const MAP = {
  "Employment Situation": { indicators: ["nfp", "unemp", "ahe"], impact: "High" },
  "Consumer Price Index": { indicators: ["cpi", "corecpi"], impact: "High" },
  "Producer Price Index": { indicators: ["ppi"], impact: "High" },
  "Job Openings and Labor Turnover Survey": { indicators: [], impact: "Medium", title: "JOLTS Job Openings", category: "tenaga-kerja" },
  "Employment Cost Index": { indicators: [], impact: "Medium", title: "Employment Cost Index q/q", category: "tenaga-kerja" },
};

/**
 * Periode data yang menyimpang dari aturan "bulan sebelumnya" —
 * rilis susulan setelah government shutdown Okt–Nov 2025.
 */
const OBS_OVERRIDES = {
  "Employment Situation|2025-11-20": "2025-09-01",
  "Producer Price Index|2025-11-25": "2025-09-01",
  "Producer Price Index|2026-01-14": "2025-11-01",
};

export function parseIcs(text) {
  const out = [];
  const blocks = String(text).split("BEGIN:VEVENT").slice(1);
  for (const b of blocks) {
    const dt = b.match(/DTSTART[^:]*:(\d{8})T(\d{4})/);
    const sm = b.match(/SUMMARY:(.+)/);
    if (!dt || !sm) continue;
    const name = sm[1].trim().replace(/\\,/g, ",");
    const meta = MAP[name];
    if (!meta) continue;
    const date = `${dt[1].slice(0, 4)}-${dt[1].slice(4, 6)}-${dt[1].slice(6, 8)}`;
    const time = `${dt[2].slice(0, 2)}:${dt[2].slice(2, 4)}`;
    const row = { name, date, time, tz: "America/New_York", indicators: meta.indicators, impact: meta.impact };
    if (meta.title) row.title = meta.title;
    if (meta.category) row.category = meta.category;
    const ov = OBS_OVERRIDES[`${name}|${date}`];
    if (ov) row.obs = ov;
    out.push(row);
  }
  // unik per (name, date) & urut tanggal
  const seen = new Set();
  return out
    .filter((r) => {
      const k = `${r.name}|${r.date}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));
}

export function serialize(bundle) {
  const rows = bundle.releases.map((r) => "  " + JSON.stringify(r));
  return `{\n "source": ${JSON.stringify(bundle.source)},\n "updated": ${JSON.stringify(bundle.updated)},\n "releases": [\n${rows.join(",\n")}\n ]\n}\n`;
}

async function main() {
  const res = await fetch(ICS_URL, { signal: AbortSignal.timeout(15000), headers: { "user-agent": "MacroLab/1.0 (+github actions)" } });
  if (!res.ok) throw new Error(`BLS ICS HTTP ${res.status}`);
  const releases = parseIcs(await res.text());
  if (releases.length < 10) throw new Error("ICS terlalu sedikit event — format berubah?");

  // pertahankan entri lama yang sudah tidak ada di ICS (BLS memangkas tahun lama)
  let prev = [];
  try {
    prev = JSON.parse(await fs.readFile(OUT, "utf8")).releases || [];
  } catch {
    prev = [];
  }
  const keys = new Set(releases.map((r) => `${r.name}|${r.date}`));
  const minDate = releases[0].date;
  for (const r of prev) {
    if (r.date < minDate && !keys.has(`${r.name}|${r.date}`)) releases.push(r);
  }
  releases.sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));

  const bundle = { source: `BLS (${ICS_URL})`, updated: new Date().toISOString(), releases };
  await fs.writeFile(OUT, serialize(bundle), "utf8");
  console.log(`✓ schedule-us: ${releases.length} rilis (${releases[0].date} … ${releases[releases.length - 1].date}) -> data/schedule-us.json`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
