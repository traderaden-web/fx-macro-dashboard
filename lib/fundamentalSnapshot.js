// lib/fundamentalSnapshot.js
// Satu snapshot untuk halaman Fundamental dan kartu Fundamental di chart.
// Nilai makro diperiksa dari FRED; data harga dari Yahoo Finance. Nilai yang
// belum tersedia dari feed tetap memakai baseline kurasi dan ditandai jelas di UI.

import { getForexRates } from "./forex";
import { getSeriesData } from "./data";
import { getReleaseAnalytics } from "./consensus";
import { mergeCountryData } from "./macroData";
import { EVENTS } from "../data/calendar";
import { todayWib } from "./schedule";

const FIELD_SOURCES = [
  { id: "fedfunds", country: "us", field: "rate" },
  { id: "cpi", country: "us", field: "inflation" },
  { id: "unemp", country: "us", field: "unemp" },
  { id: "gdp", country: "us", field: "gdp" },
  { id: "eu_cpi", country: "euro", field: "inflation" },
  { id: "eu_unemp", country: "euro", field: "unemp" },
  { id: "eu_gdp", country: "euro", field: "gdp" },
  { id: "uk_cpi", country: "gb", field: "inflation" },
  { id: "uk_unemp", country: "gb", field: "unemp" },
  { id: "jp_cpi", country: "jp", field: "inflation" },
  { id: "china_cpi", country: "cn", field: "inflation" },
];

function maxIso(values) {
  return values.filter(Boolean).sort().at(-1) || null;
}

async function upcomingCheat(limit = 8) {
  const today = todayWib();
  const events = EVENTS
    .filter((event) => event.impact === "High" && event.indicatorId)
    .filter((event) => event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, limit * 2);
  const ids = [...new Set(events.map((event) => event.indicatorId))];
  const analytics = Object.fromEntries(await Promise.all(ids.map(async (id) => [
    id,
    await getReleaseAnalytics(id).catch(() => null),
  ])));

  const seen = new Set();
  const out = [];
  for (const event of events) {
    const key = `${event.indicatorId}|${event.date}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const series = analytics[event.indicatorId];
    const pending = series?.pending?.find((row) => row.date === event.date);
    out.push({
      ...event,
      consensus: pending?.consensus ?? null,
      previous: pending?.previous ?? series?.last?.value ?? null,
      unit: series?.unit || "",
      source: series?.dataSource || "unavailable",
      updated: series?.updated || null,
    });
    if (out.length === limit) break;
  }
  return out;
}

/**
 * Menghasilkan snapshot yang selalu meminta cache sumber resmi terbaru.
 * FRED sendiri bersifat periodik; "updated" adalah waktu sinkronisasi, sedangkan
 * tanggal observasi per indikator tersedia di fieldMeta untuk transparansi.
 */
export async function getFundamentalSnapshot() {
  const [forex, seriesList, cheatSheet] = await Promise.all([
    getForexRates(),
    Promise.all(FIELD_SOURCES.map(({ id }) => getSeriesData(id).catch(() => null))),
    upcomingCheat(),
  ]);

  const byId = new Map(seriesList.filter(Boolean).map((series) => [series.id, series]));
  const overrides = {};
  const fieldMeta = {};

  for (const def of FIELD_SOURCES) {
    const series = byId.get(def.id);
    const value = series?.last?.value;
    if (value == null) continue;
    overrides[def.country] = { ...(overrides[def.country] || {}), [def.field]: value };
    fieldMeta[`${def.country}.${def.field}`] = {
      indicator: def.id,
      source: series.source,
      observationDate: series.last.date,
      checkedAt: series.updated || null,
    };
  }

  const macroSources = seriesList.filter(Boolean);
  const liveCount = macroSources.filter((series) => series.source === "live").length;
  const fallbackCount = macroSources.length - liveCount;
  const checkedAt = new Date().toISOString();

  return {
    countries: mergeCountryData(overrides),
    pairs: forex.pairs || [],
    cheatSheet,
    fieldMeta,
    checkedAt,
    sources: {
      macro: {
        provider: "FRED",
        liveCount,
        fallbackCount,
        checkedAt: maxIso(macroSources.map((series) => series.updated)) || checkedAt,
      },
      market: {
        provider: forex.source || "unavailable",
        live: forex.source !== "demo",
        checkedAt: forex.updated || null,
      },
    },
  };
}
