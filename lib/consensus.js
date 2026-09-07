// lib/consensus.js
// Membangun daftar RILIS per indikator secara OTOMATIS, lalu menghitung
// surprise & metrik akurasi konsensus.
//
// Sumber tiap kolom:
//   • tanggal rilis  : jadwal resmi (data/calendar.js ← BLS/BEA/Fed/…) ∪
//                      event ForexFactory (live minggu ini + arsip cron) ∪
//                      riwayat kurasi data/releases.js. Bila sebuah titik FRED
//                      belum punya tanggal rilis dari sumber mana pun, tanggalnya
//                      DIPERKIRAKAN dari pola rilis (ditandai `estimated`).
//   • periode (obs)  : `obs` eksplisit bila ada, kalau tidak dihitung dengan
//                      aturan obsForRelease (NFP 4 Sep → data Agustus, dst.).
//   • actual/previous: SELALU dari FRED (lib/data.js — live, cache ≤ 30 mnt,
//                      3 mnt di jendela rilis) → angka baru muncul otomatis
//                      beberapa menit setelah FRED memuatnya.
//   • consensus      : ForexFactory (live > arsip) > kurasi lokal.
//
// Bentuk keluaran kompatibel dengan versi lama: {...series, points, last,
// source, updated, asOf, releases:[{date, obsDate, consensus, previous, actual,
// surprise, surprisePct, surpriseIdx, source, estimated}], accuracy} + field
// baru `pending` (rilis mendatang / menunggu FRED) dan `dataSource`.

import { CONSENSUS } from "../data/releases";
import { UPCOMING } from "../data/calendar";
import { getSeriesData } from "./data";
import { SERIES } from "./series";
import { computePairImpact } from "./pairs";
import { getFfEvents } from "./provider";
import { obsForRelease, obsRuleFor, estimateReleaseDate, todayWib } from "./schedule";

const MAX_RELEASES = 24; // riwayat yang ditampilkan per indikator
const FUTURE_DAYS = 45; // rilis mendatang yang ikut ditampilkan (pending)

/** Kandidat rilis dari semua sumber → {date, obs, consensus, previous, source, estimated} */
function collectCandidates(id, def, ffEvents) {
  const byDate = new Map();
  const put = (row) => {
    if (!row.date) return;
    const prev = byDate.get(row.date);
    if (!prev) {
      byDate.set(row.date, row);
      return;
    }
    // prioritas konsensus: ff-live > ff-arsip > lokal; obs eksplisit menang.
    const rank = { "ff-live": 3, ff: 2, local: 1, schedule: 0 };
    const merged = { ...prev };
    if (row.obs && !prev.obsExplicit) {
      merged.obs = row.obs;
      merged.obsExplicit = true;
    }
    if (row.consensus != null && (prev.consensus == null || (rank[row.source] ?? 0) > (rank[prev.source] ?? 0))) {
      merged.consensus = row.consensus;
      merged.source = row.source;
    }
    if (row.ffPrevious != null && merged.ffPrevious == null) merged.ffPrevious = row.ffPrevious;
    if (row.iso && !merged.iso) merged.iso = row.iso;
    merged.estimated = false;
    byDate.set(row.date, merged);
  };

  // 1) jadwal resmi (obs eksplisit bila ada; iso = waktu rilis WIB)
  const schedDates = [];
  for (const e of UPCOMING) {
    if (e.indicatorId !== id) continue;
    schedDates.push(e.date);
    put({ date: e.date, iso: e.iso, obs: e.obs || null, obsExplicit: !!e.obs, consensus: null, source: "schedule", estimated: false });
  }
  // Tanggal kurasi/FF yang meleset ≤ 3 hari dari jadwal resmi → disamakan ke
  // tanggal resmi (jadwal resmi = otoritatif utk tanggal & periode data).
  const snap = (date) => {
    if (byDate.has(date)) return date;
    let best = null;
    for (const d of schedDates) {
      const diff = Math.abs(daysBetween(d, date));
      if (diff <= 3 && (best === null || diff < best.diff)) best = { d, diff };
    }
    return best ? best.d : date;
  };
  // 2) kurasi lokal
  for (const r of CONSENSUS[id] || []) {
    const date = snap(r.date);
    const snapped = date !== r.date;
    put({ date, obs: snapped ? null : r.obs || null, obsExplicit: !snapped && !!r.obs, consensus: r.consensus ?? null, source: "local", estimated: false });
  }
  // 3) ForexFactory (arsip + live)
  for (const e of ffEvents) {
    if (e.indicatorId !== id) continue;
    put({
      date: snap(e.wibDate),
      iso: e.dateIso,
      obs: null,
      obsExplicit: false,
      consensus: e.forecast ?? null,
      ffPrevious: e.previous ?? null,
      source: e.live ? "ff-live" : "ff",
      estimated: false,
    });
  }
  // isi obs yang kosong lewat aturan
  for (const row of byDate.values()) {
    if (!row.obs) row.obs = obsForRelease(def, row.date);
  }
  return byDate;
}

/**
 * Susun rilis untuk satu indikator.
 * @param {object} series  hasil getSeriesData(id)
 * @param {Array} ffEvents hasil getFfEvents().events
 */
export function buildReleases(series, ffEvents = []) {
  const def = series;
  const points = series.points || [];
  const idxByDate = new Map();
  points.forEach((p, i) => idxByDate.set(p.date, i));

  const byDate = collectCandidates(series.id, def, ffEvents);
  const now = new Date();
  const today = todayWib(now);
  const horizon = addDaysIso(today, FUTURE_DAYS);

  // Titik FRED yang belum punya baris rilis → perkirakan tanggal rilisnya
  // (riwayat sebelum jadwal resmi kami dimulai, atau FRED memuat data sebelum
  // kalender mengenal tanggalnya). Tidak dilakukan utk seri harian & seri
  // "same-month" (Fed Funds punya titik tiap bulan tapi rilis hanya saat FOMC).
  const canEstimate = def.freq !== "D" && obsRuleFor(def) !== "same-month";
  if (canEstimate) {
    const covered = new Set([...byDate.values()].map((r) => r.obs));
    const tail = points.slice(-MAX_RELEASES);
    for (const p of tail) {
      if (covered.has(p.date)) continue;
      const est = estimateReleaseDate(def, p.date, UPCOMING.filter((e) => e.indicatorId === series.id));
      if (byDate.has(est.date)) continue;
      byDate.set(est.date, { date: est.date, obs: p.date, consensus: null, source: "fred", estimated: est.estimated });
    }
  }

  const rows = [];
  for (const r of byDate.values()) {
    const i = idxByDate.get(r.obs);
    const hasPoint = i !== undefined;
    // Sudah rilis? Pakai waktu rilis bila diketahui; tanpa waktu, anggap sudah
    // rilis bila tanggalnya lewat atau FRED sudah memuat titiknya.
    const released = r.iso ? now.getTime() >= new Date(r.iso).getTime() : hasPoint || r.date < today;
    if (!released || !hasPoint) {
      // Mendatang (≤ 45 hari) atau baru lewat & menunggu FRED (≤ 10 hari).
      if (r.date > horizon) continue;
      if (released && daysBetween(r.date, today) > 10) continue;
      if (!released && r.date < today) continue; // baris lama tanpa data
      const previous = r.ffPrevious ?? (hasPoint ? points[i].value : lastBefore(points, r.obs));
      rows.push({
        date: r.date, obsDate: r.obs, consensus: r.consensus, previous, actual: null,
        surprise: null, surprisePct: null, surpriseIdx: null,
        source: srcLabel(r.source), estimated: !!r.estimated, pending: true,
        awaiting: released, // true = sudah lewat, FRED belum memuat angka
      });
      continue;
    }
    const actual = points[i]?.value ?? null;
    const previous = i > 0 ? points[i - 1]?.value ?? null : r.ffPrevious ?? null;
    const consensus = r.consensus;
    const surprise = actual !== null && consensus != null ? round(actual - consensus, 2) : null;
    const surprisePct = surprise !== null && consensus ? round((surprise / Math.abs(consensus)) * 100, 2) : null;
    const surpriseIdx = surprise !== null && series.scale ? round((surprise / series.scale) * 100, 1) : null;
    rows.push({
      date: r.date, obsDate: r.obs, consensus, previous, actual, surprise, surprisePct, surpriseIdx,
      source: srcLabel(r.source), estimated: !!r.estimated, pending: false,
    });
  }

  rows.sort((a, b) => a.date.localeCompare(b.date));
  // satu baris per periode data: bila satu obs punya beberapa tanggal (mis. GDP
  // advance/second/third), pertahankan semuanya — tapi buang duplikat tanpa
  // konsensus yang hanya hasil estimasi jika ada baris nyata utk obs yang sama.
  const realObs = new Set(rows.filter((r) => !r.estimated).map((r) => r.obsDate));
  const cleaned = rows.filter((r) => !r.estimated || !realObs.has(r.obsDate));

  const released = cleaned.filter((r) => !r.pending).slice(-MAX_RELEASES);
  const pending = cleaned.filter((r) => r.pending).slice(0, 3);
  return { released, pending };
}

function srcLabel(s) {
  if (s === "ff-live") return "live";
  if (s === "ff") return "ff";
  if (s === "local") return "local";
  return "fred";
}

function lastBefore(points, obs) {
  let v = null;
  for (const p of points) {
    if (p.date < obs) v = p.value;
    else break;
  }
  return v;
}

function addDaysIso(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function daysBetween(a, b) {
  return Math.round((new Date(`${b}T00:00:00Z`) - new Date(`${a}T00:00:00Z`)) / 86400000);
}

let ffPromise = null;
/** Event FF (arsip + live) — dibagi antar-indikator dalam satu request. */
async function ffEventsShared() {
  if (!ffPromise) {
    ffPromise = getFfEvents()
      .catch(() => ({ events: [], live: false }))
      .finally(() => { const t = setTimeout(() => { ffPromise = null; }, 5000); t.unref?.(); });
  }
  return ffPromise;
}

export async function getReleaseAnalytics(id) {
  const series = await getSeriesData(id);
  if (!series) return null;
  const ff = await ffEventsShared();
  const { released, pending } = buildReleases(series, ff.events);
  const accuracy = computeAccuracy(released, series.tol);
  const hasLiveCons = released.some((r) => r.source === "live") || pending.some((r) => r.source === "live");
  return {
    ...series,
    releases: released, // hanya yang sudah rilis & punya angka FRED (kompatibel UI lama)
    pending, // rilis mendatang / menunggu FRED: {date, obsDate, consensus, previous, awaiting}
    accuracy,
    // "live" bila data FRED live ATAU konsensus FF live (kompatibel dgn UI lama)
    source: series.source === "live" || hasLiveCons ? "live" : series.source,
    dataSource: series.source, // live | seed | curated (FRED)
    consensusLive: ff.live,
    asOf: series.updated || null,
  };
}

export function computeAccuracy(releases, tol = 0.5) {
  const valid = releases.filter((r) => r.actual != null && r.consensus != null);
  const empty = {
    samples: 0, hitRate: null, avgPct: null, bias: null, dirAcc: null,
    beats: 0, misses: 0, inlines: 0, beatRate: null, maxSurprise: null,
    maxSurpriseDate: null, streak: null, tol,
  };
  if (!valid.length) return empty;

  const hit = valid.filter((r) => Math.abs(r.surprise) <= tol).length;
  const hitRate = round((hit / valid.length) * 100, 1);
  const beats = valid.filter((r) => r.surprise > tol).length;
  const misses = valid.filter((r) => r.surprise < -tol).length;
  const inlines = valid.length - beats - misses;
  const beatRate = round((beats / valid.length) * 100, 1);

  const pcts = valid.filter((r) => r.surpriseIdx != null);
  const avgPct = pcts.length ? round(avg(pcts.map((r) => Math.abs(r.surpriseIdx))), 1) : null;
  const biasAbs = valid.length ? round(avg(valid.map((r) => r.surprise)), 2) : null;

  let matched = 0, dirTotal = 0;
  for (const r of valid) {
    if (r.previous == null) continue;
    const actualDir = Math.sign(r.actual - r.previous);
    if (actualDir === 0) continue;
    const consensusDir = Math.sign(r.consensus - r.previous);
    if (consensusDir === 0) continue;
    dirTotal++;
    if (actualDir === consensusDir) matched++;
  }
  const dirAcc = dirTotal ? round((matched / dirTotal) * 100, 1) : null;

  let maxSurprise = null, maxSurpriseDate = null;
  for (const r of valid) {
    if (maxSurprise === null || Math.abs(r.surprise) > Math.abs(maxSurprise)) {
      maxSurprise = r.surprise;
      maxSurpriseDate = r.date;
    }
  }

  let streak = null;
  const last = valid[valid.length - 1];
  const sgn = Math.sign(last.surprise);
  if (sgn !== 0) {
    let n = 1;
    for (let i = valid.length - 2; i >= 0; i--) {
      if (Math.sign(valid[i].surprise) === sgn) n++;
      else break;
    }
    streak = { n, kind: sgn > 0 ? "BEAT" : "MISS" };
  }

  return { samples: valid.length, hitRate, avgPct, bias: biasAbs, dirAcc, beats, misses, inlines, beatRate, maxSurprise, maxSurpriseDate, streak, tol };
}

export async function getAllReleaseAnalytics() {
  const out = await Promise.all(SERIES.map((s) => getReleaseAnalytics(s.id).catch(() => null)));
  return out.filter((a) => a && a.releases.length);
}

export function interpretLatest(analytics) {
  const done = analytics?.releases || [];
  const latest = done.length ? done[done.length - 1] : null;
  if (!latest) return null;
  return { latest, pairs: computePairImpact(analytics.id, latest.surprisePct, latest.surprise) };
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
