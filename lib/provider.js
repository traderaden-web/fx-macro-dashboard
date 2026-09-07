// lib/provider.js
// Penyedia KONSENSUS (forecast) & JADWAL dari ForexFactory via Fair Economy Media.
//
// Sumber:
//  • LIVE  : ff_calendar_thisweek.json — event minggu berjalan (judul, waktu,
//            dampak, forecast, previous). Dicoba dari 2 host, cache 15 menit,
//            negative-cache per URL (host gagal tidak memblokir host lain).
//  • ARSIP : data/ff-history.json — event minggu-minggu sebelumnya yang
//            disimpan skrip cron (scripts/fetch-ff.mjs) sehingga konsensus
//            rilis lama tetap tersedia setelah feed mingguan berganti.
//
// Catatan penting: feed ini TIDAK memuat kolom `actual` secara andal, jadi
// angka aktual SELALU diambil dari FRED (lib/data.js), bukan dari sini.

import { cached } from "./cache";
import { getSeries } from "./series";
import { toWib } from "./schedule";
import ffHistory from "../data/ff-history.json";

const FF_URLS = [
  "https://nfs.faireconomy.media/ff_calendar_thisweek.json",
  "https://cdn-nfs.faireconomy.media/ff_calendar_thisweek.json",
];
const TTL = 15 * 60 * 1000; // 15 menit (FF meminta polling ≤ 1×/menit; 15 mnt aman & tetap segar)
const NEG_TTL = 5 * 60 * 1000; // host yang gagal tidak dicoba lagi selama 5 menit
const failAt = new Map();

const COUNTRY_MAP = {
  USD: "US", EUR: "EZ", GBP: "UK", JPY: "JP", CNY: "CN",
  AUD: "AU", CAD: "CA", CHF: "CH", NZD: "NZ",
};

// Peta nama singkat → label kategori dan bendera untuk kalender.
export const COUNTRY_FLAGS = {
  US: "🇺🇸", EZ: "🇪🇺", UK: "🇬🇧", JP: "🇯🇵", CN: "🇨🇳",
  AU: "🇦🇺", CA: "🇨🇦", CH: "🇨🇭", NZ: "🇳🇿",
};

// Judul event ForexFactory (huruf kecil) → indikator kami. `cc` = kode mata uang FF.
// Basis data tiap indikator (lib/series.js) sudah disamakan dengan judul FF-nya,
// sehingga forecast FF dapat dibandingkan langsung dengan angka FRED.
const TITLE_MAP = [
  { title: "non-farm employment change", cc: "USD", id: "nfp" },
  { title: "unemployment rate", cc: "USD", id: "unemp" },
  { title: "average hourly earnings m/m", cc: "USD", id: "ahe" },
  { title: "cpi y/y", cc: "USD", id: "cpi" },
  { title: "core cpi y/y", cc: "USD", id: "corecpi" },
  { title: "ppi m/m", cc: "USD", id: "ppi" },
  { title: "core pce price index m/m", cc: "USD", id: "corepce" },
  { title: "federal funds rate", cc: "USD", id: "fedfunds" },
  { title: "retail sales m/m", cc: "USD", id: "retail" },
  { title: "adp non-farm employment change", cc: "USD", id: "adp" },
  { title: "advance gdp q/q", cc: "USD", id: "gdp" },
  { title: "prelim gdp q/q", cc: "USD", id: "gdp" },
  { title: "final gdp q/q", cc: "USD", id: "gdp" },
  { title: "unemployment claims", cc: "USD", id: "claims" },
  { title: "industrial production m/m", cc: "USD", id: "indpro" },
  { title: "capacity utilization rate", cc: "USD", id: "capacity" },
  { title: "prelim uom consumer sentiment", cc: "USD", id: "umich" },
  { title: "ism manufacturing pmi", cc: "USD", id: "ismmfg" },
  { title: "ism services pmi", cc: "USD", id: "ismsvc" },
  { title: "cpi flash estimate y/y", cc: "EUR", id: "eu_cpi" },
  { title: "unemployment rate", cc: "EUR", id: "eu_unemp" },
  { title: "cpi y/y", cc: "GBP", id: "uk_cpi" },
  { title: "unemployment rate", cc: "GBP", id: "uk_unemp" },
  { title: "cpi y/y", cc: "CNY", id: "china_cpi" },
];

export function matchIndicator(title, cc) {
  const t = String(title || "").toLowerCase().trim();
  const hit = TITLE_MAP.find((r) => r.title === t && r.cc === cc);
  return hit ? hit.id : null;
}

/**
 * Parse nilai FF ("58K", "0.4%", "205K", "-4.5M", "2.65%") → angka pada basis
 * indikator. `def.ffDivisor` menyamakan satuan (NFP "58K" = 58 ribu → 58).
 */
export function parseFfValue(v, def) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s || /^(none|n\/a|-|—)$/i.test(s)) return null;
  const m = s.replace(/,/g, "").match(/^(<|>)?\s*(-?\d+(?:\.\d+)?)\s*([KMBT])?\s*%?$/i);
  if (!m) {
    const num = parseFloat(s.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(num) ? num : null;
  }
  let num = parseFloat(m[2]);
  const suf = (m[3] || "").toUpperCase();
  const mult = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 }[suf] || 1;
  num *= mult;
  if (def?.ffDivisor) num /= def.ffDivisor;
  return Number.isFinite(num) ? Math.round(num * 1e6) / 1e6 : null;
}

function normalizeImpact(imp) {
  const s = String(imp || "").toLowerCase();
  if (s.includes("high")) return "High";
  if (s.includes("medium") || s.includes("mid")) return "Medium";
  if (s.includes("holiday")) return "Holiday";
  return "Low";
}

/** Event mentah FF → bentuk seragam yang dipakai kalender & analitik. */
export function normalizeFfEvent(e) {
  const cc = e.country;
  const country = COUNTRY_MAP[cc] || null;
  const at = new Date(e.date);
  if (!country || Number.isNaN(at.getTime())) return null;
  const indicatorId = matchIndicator(e.title, cc);
  const def = indicatorId ? getSeries(indicatorId) : null;
  const wib = toWib(at);
  return {
    key: `${cc}|${e.title}|${e.date}`,
    indicatorId,
    title: e.title,
    country,
    cc,
    date: e.date, // waktu asli FF (ISO dengan offset ET)
    at: at.toISOString(), // UTC
    wibDate: wib.date, // tanggal rilis versi WIB — kunci pencocokan dengan jadwal lokal
    dateIso: wib.iso,
    time: wib.time,
    impact: normalizeImpact(e.impact),
    forecast: parseFfValue(e.forecast, def),
    previous: parseFfValue(e.previous, def),
    actual: parseFfValue(e.actual, def),
    forecastRaw: e.forecast ?? null,
    previousRaw: e.previous ?? null,
    unit: e.unit,
  };
}

async function fetchOne(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(6000), cache: "no-store" });
  if (!res.ok) throw new Error(`ForexFactory HTTP ${res.status}`);
  const raw = await res.json();
  if (!Array.isArray(raw)) throw new Error("ForexFactory: format tak terduga");
  return raw;
}

/** Feed mentah minggu ini (array event FF). Melempar error bila semua host gagal. */
export async function fetchFfRaw() {
  return cached("ff:raw", TTL, async () => {
    let lastErr = null;
    for (const url of FF_URLS) {
      const f = failAt.get(url);
      if (f && Date.now() - f < NEG_TTL) continue;
      try {
        return await fetchOne(url);
      } catch (e) {
        failAt.set(url, Date.now());
        lastErr = e;
      }
    }
    throw lastErr || new Error("Penyedia belum tersedia (cooldown)");
  });
}

/** Seluruh event kalender ForexFactory minggu ini (semua negara yang kami kenal). */
export async function fetchLiveCalendar() {
  const raw = await fetchFfRaw();
  return raw.map(normalizeFfEvent).filter(Boolean);
}

/** Event minggu ini yang cocok dengan indikator kami (konsensus live). */
export async function fetchLiveConsensus() {
  const all = await fetchLiveCalendar();
  return all.filter((e) => e.indicatorId);
}

/** Event arsip (data/ff-history.json) — sudah dinormalisasi. */
export function archivedFfEvents() {
  const list = Array.isArray(ffHistory?.events) ? ffHistory.events : [];
  return list.map(normalizeFfEvent).filter(Boolean);
}

export const FF_HISTORY_META = {
  updated: ffHistory?.updated || null,
  weeks: Array.isArray(ffHistory?.weeks) ? ffHistory.weeks : [],
};

/**
 * Gabungan arsip + live (live menimpa arsip untuk event yang sama).
 * Tidak pernah melempar: bila live gagal, hanya arsip yang dikembalikan
 * dan `live=false`.
 */
export async function getFfEvents() {
  const merged = new Map();
  for (const e of archivedFfEvents()) merged.set(e.key, { ...e, live: false });
  let live = false;
  try {
    for (const e of await fetchLiveCalendar()) merged.set(e.key, { ...e, live: true });
    live = true;
  } catch {
    /* penyedia tidak terjangkau → arsip saja */
  }
  const events = [...merged.values()].sort((a, b) => a.at.localeCompare(b.at));
  return { events, live };
}
