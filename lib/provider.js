// lib/provider.js
// Penyedia data konsensus "nyata" yang gratis & akurat.
// Backend utama: ForexFactory via Fair Economy Media (cdn-nfs.faireconomy.media),
// JSON kalender mingguan yang berisi actual + forecast (konsensus) + previous.
// Jika host tidak dapat dijangkau, otomatis memakai fallback lokal.

import { cached } from "./cache";

const FF_URL = "https://cdn-nfs.faireconomy.media/ff_calendar_thisweek.json";
const TTL = 60 * 60 * 1000; // 1 jam
const NEG_TTL = 10 * 60 * 1000; // bila gagal, jangan coba lagi selama 10 menit
let lastFail = 0;

const COUNTRY_MAP = {
  USD: "US", EUR: "EZ", GBP: "UK", JPY: "JP", CNY: "CN",
  AUD: "AU", CAD: "CA", CHF: "CH", NZD: "NZ",
};

// Peta nama singkat → label kategori dan bendera untuk kalender.
export const COUNTRY_FLAGS = {
  US: "🇺🇸", EZ: "🇪🇺", UK: "🇬🇧", JP: "🇯🇵", CN: "🇨🇳",
  AU: "🇦🇺", CA: "🇨🇦", CH: "🇨🇭", NZ: "🇳🇿",
};

const TITLE_MAP = [
  { title: "non-farm employment change", id: "nfp" },
  { title: "unemployment rate", id: "unemp" },
  { title: "cpi y/y", id: "cpi", allow: ["US"] },
  { title: "cpi m/m", id: "cpi", allow: ["US"] },
  { title: "core cpi y/y", id: "corecpi", allow: ["US"] },
  { title: "core cpi m/m", id: "corecpi", allow: ["US"] },
  { title: "ppi y/y", id: "ppi", allow: ["US"] },
  { title: "ppi m/m", id: "ppi", allow: ["US"] },
  { title: "average hourly earnings y/y", id: "ahe", allow: ["US"] },
  { title: "federal funds rate", id: "fedfunds", allow: ["US"] },
  { title: "retail sales m/m", id: "retail", allow: ["US"] },
  { title: "core pce price index", id: "corepce", allow: ["US"] },
  { title: "adp non-farm employment", id: "adp", allow: ["US"] },
  { title: "advance gdp", id: "gdp", allow: ["US"] },
  { title: "gdp q/q", id: "gdp", allow: ["US"] },
  { title: "initial jobless claims", id: "claims", allow: ["US"] },
  { title: "industrial production m/m", id: "indpro", allow: ["US"] },
  { title: "capacity utilization rate", id: "capacity", allow: ["US"] },
  { title: "michigan consumer sentiment", id: "umich", allow: ["US"] },
  { title: "ism manufacturing pmi", id: "ismmfg", allow: ["US"] },
  { title: "ism services pmi", id: "ismsvc", allow: ["US"] },
  { title: "ism non-manufacturing pmi", id: "ismsvc", allow: ["US"] },
  { title: "eurozone cpi y/y", id: "eu_cpi", allow: ["EZ"] },
  { title: "eurozone unemployment rate", id: "eu_unemp", allow: ["EZ"] },
  { title: "eurozone gdp", id: "eu_gdp", allow: ["EZ"] },
  { title: "uk cpi y/y", id: "uk_cpi", allow: ["UK"] },
  { title: "uk unemployment rate", id: "uk_unemp", allow: ["UK"] },
  { title: "japan cpi y/y", id: "jp_cpi", allow: ["JP"] },
  { title: "china cpi y/y", id: "china_cpi", allow: ["CN"] },
];

export async function fetchLiveConsensus() {
  if (Date.now() - lastFail < NEG_TTL) {
    throw new Error("Penyedia belum tersedia (cooldown)");
  }
  return cached("ff:calendar", TTL, async () => {
    const res = await fetch(FF_URL, { signal: AbortSignal.timeout(6000), cache: "no-store" });
    if (!res.ok) throw new Error(`ForexFactory HTTP ${res.status}`);
    const raw = await res.json();
    if (!Array.isArray(raw)) throw new Error("ForexFactory: format tak terduga");
    return raw.map(normalizeEvent).filter(Boolean);
  }).catch((e) => {
    lastFail = Date.now();
    throw e;
  });
}

function normalizeEvent(e) {
  const country = COUNTRY_MAP[e.country] || null;
  const titleNorm = String(e.title || "").toLowerCase().trim();
  const matched = TITLE_MAP.find((r) => {
    if (titleNorm !== r.title) return false;
    if (r.allow && country && !r.allow.includes(country)) return false;
    return true;
  });
  if (!matched) return null;
  return {
    indicatorId: matched.id,
    title: e.title,
    date: e.date,
    country,
    impact: normalizeImpact(e.impact),
    actual: parseVal(e.actual),
    forecast: parseVal(e.forecast),
    previous: parseVal(e.previous),
    unit: e.unit,
  };
}

/** Ambil seluruh event kalender ForexFactory minggu ini (tidak dibatasi indikator kami). */
export async function fetchLiveCalendar() {
  if (Date.now() - lastFail < NEG_TTL) {
    throw new Error("Penyedia belum tersedia (cooldown)");
  }
  return cached("ff:calendar-full", TTL, async () => {
    const res = await fetch(FF_URL, { signal: AbortSignal.timeout(6000), cache: "no-store" });
    if (!res.ok) throw new Error(`ForexFactory HTTP ${res.status}`);
    const raw = await res.json();
    if (!Array.isArray(raw)) throw new Error("ForexFactory: format tak terduga");
    return raw
      .map((e) => {
        const country = COUNTRY_MAP[e.country] || null;
        if (!country) return null;
        const titleNorm = String(e.title || "").toLowerCase().trim();
        const matched = TITLE_MAP.find((r) => titleNorm === r.title && (!r.allow || (country && r.allow.includes(country))));
        return {
          indicatorId: matched ? matched.id : null,
          title: e.title,
          date: e.date,
          dateIso: toIso(e.date),
          country,
          impact: normalizeImpact(e.impact),
          actual: parseVal(e.actual),
          forecast: parseVal(e.forecast),
          previous: parseVal(e.previous),
          unit: e.unit,
        };
      })
      .filter(Boolean);
  }).catch((e) => {
    lastFail = Date.now();
    throw e;
  });
}

function toIso(dateStr) {
  // ForexFactory format: "2026-09-04T19:30:00-04:00" → ambil bagian tanggal & jam lalu buat ISO tanpa zona agar konsisten.
  const d = String(dateStr || "");
  const m = d.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
  if (m) return `${m[1]}T${m[2]}:00`;
  const s = String(dateStr || "");
  if (/^\d{4}-\d{2}-\d{2}\s/.test(s)) {
    const mm = s.match(/^(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2})/);
    return `${mm[1]}T${mm[2]}:00`;
  }
  return s.length >= 10 ? `${s.slice(0, 10)}T00:00:00` : s;
}

function normalizeImpact(imp) {
  const s = String(imp || "").toLowerCase();
  if (s.includes("high")) return "High";
  if (s.includes("medium") || s.includes("mid")) return "Medium";
  return "Low";
}

function parseVal(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim().toLowerCase();
  if (!s || s === "none" || s === "n/a" || s === "-") return null;
  const num = parseFloat(s.replace(/[^0-9.-]/g, ""));
  return isNaN(num) ? null : num;
}
