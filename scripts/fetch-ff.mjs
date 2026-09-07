// scripts/fetch-ff.mjs
// Mengarsipkan feed mingguan ForexFactory (forecast & previous) ke
// data/ff-history.json supaya konsensus rilis yang sudah lewat tetap tersedia
// setelah feed berganti minggu. Dijalankan otomatis oleh GitHub Actions
// (.github/workflows/refresh-data.yml) — bisa juga manual: `npm run fetch:ff`.
//
// Yang disimpan: event mata uang utama (USD/EUR/GBP/JPY/CNY/AUD/CAD/CHF/NZD)
// berdampak High/Medium/Holiday, plus semua event yang cocok dengan indikator
// kami (lib/provider.js TITLE_MAP) apa pun dampaknya.
// Kolom `actual` sengaja TIDAK dipakai — angka aktual selalu dari FRED.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "data", "ff-history.json");

const URLS = [
  "https://nfs.faireconomy.media/ff_calendar_thisweek.json",
  "https://cdn-nfs.faireconomy.media/ff_calendar_thisweek.json",
];
const KEEP_CC = new Set(["USD", "EUR", "GBP", "JPY", "CNY", "AUD", "CAD", "CHF", "NZD"]);
const KEEP_TITLE = /cpi|ppi|pce|payroll|employment|unemployment|claims|gdp|retail|ism|adp|sentiment|federal funds|fomc|industrial production|capacity|rate decision|refinancing rate|official bank rate|policy rate/i;
const MAX_WEEKS = 120; // ± 2 tahun arsip

async function fetchFeed() {
  let lastErr;
  for (const url of URLS) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!Array.isArray(json)) throw new Error("format tak terduga");
      return json;
    } catch (e) {
      lastErr = e;
      console.warn(`✗ ${url}: ${e.message}`);
    }
  }
  throw lastErr || new Error("feed tidak terjangkau");
}

function keyOf(e) {
  return `${e.country}|${e.title}|${e.date}`;
}

/** Minggu FF dimulai Minggu (waktu ET). Kunci minggu = tanggal Minggu (YYYY-MM-DD). */
function weekKey(events) {
  const first = events.map((e) => e.date.slice(0, 10)).sort()[0];
  return first || new Date().toISOString().slice(0, 10);
}

export function mergeHistory(existing, feed, now = new Date()) {
  const keep = feed.filter(
    (e) => KEEP_CC.has(e.country) && (["High", "Medium", "Holiday"].includes(e.impact) || KEEP_TITLE.test(e.title))
  );
  const map = new Map();
  for (const e of existing?.events || []) map.set(keyOf(e), e);
  let added = 0, updated = 0;
  for (const e of keep) {
    const slim = { title: e.title, country: e.country, date: e.date, impact: e.impact, forecast: e.forecast ?? "", previous: e.previous ?? "" };
    const k = keyOf(slim);
    if (!map.has(k)) added++;
    else if (JSON.stringify(map.get(k)) !== JSON.stringify(slim)) updated++;
    map.set(k, slim); // feed terbaru menimpa (forecast bisa direvisi menjelang rilis)
  }
  const weeks = [...new Set([...(existing?.weeks || []), weekKey(keep)])].sort().slice(-MAX_WEEKS);
  const minDate = weeks[0];
  const events = [...map.values()]
    .filter((e) => e.date.slice(0, 10) >= minDate)
    .sort((a, b) => a.date.localeCompare(b.date) || a.country.localeCompare(b.country) || a.title.localeCompare(b.title));
  return {
    bundle: {
      source: existing?.source || "ForexFactory (nfs.faireconomy.media/ff_calendar_thisweek.json)",
      note: existing?.note || "Arsip event kalender FF per minggu (forecast & previous). Diperbarui otomatis oleh scripts/fetch-ff.mjs (GitHub Actions). Kolom actual TIDAK berasal dari file ini — selalu dari FRED.",
      updated: now.toISOString(),
      weeks,
      events,
    },
    added,
    updated,
  };
}

export function serialize(bundle) {
  const head = { ...bundle, events: undefined };
  const lines = bundle.events.map((e) => "  " + JSON.stringify(e));
  const headJson = JSON.stringify(head, null, 1).replace(/,?\s*"events": (undefined)?/, "").replace(/\n\s*\}$/, "");
  return `${headJson},\n "events": [\n${lines.join(",\n")}\n ]\n}\n`;
}

async function main() {
  let existing = null;
  try {
    existing = JSON.parse(await fs.readFile(OUT, "utf8"));
  } catch {
    existing = null;
  }
  const feed = await fetchFeed();
  const { bundle, added, updated } = mergeHistory(existing, feed);
  await fs.writeFile(OUT, serialize(bundle), "utf8");
  console.log(`✓ ff-history: ${bundle.events.length} event, ${bundle.weeks.length} minggu (+${added} baru, ${updated} diperbarui) -> data/ff-history.json`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
