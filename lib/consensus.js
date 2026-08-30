// lib/consensus.js
// Menggabungkan estimasi konsensus (penyedia live / fallback lokal) dengan nilai aktual,
// lalu menghitung "surprise" dan metrik akurasi/kinerja konsensus.

import { CONSENSUS } from "../data/releases";
import { getSeriesData } from "./data";
import { SERIES } from "./series";
import { computePairImpact } from "./pairs";
import { fetchLiveConsensus } from "./provider";

export async function getReleaseAnalytics(id) {
  const series = await getSeriesData(id);
  if (!series) return null;

  const points = series.points || [];
  const idxByDate = new Map();
  points.forEach((p, i) => idxByDate.set(p.date, i));

  const releases = [];
  for (const e of CONSENSUS[id] || []) {
    const i = idxByDate.get(e.date);
    if (i === undefined) continue;
    const actual = points[i]?.value ?? null;
    const previous = i > 0 ? points[i - 1]?.value ?? null : null;
    const consensus = e.consensus;
    const surprise = actual !== null && consensus != null ? round(actual - consensus, 2) : null;
    const surprisePct =
      surprise !== null && consensus ? round((surprise / Math.abs(consensus)) * 100, 2) : null;
    const surpriseIdx =
      surprise !== null && series.scale ? round((surprise / series.scale) * 100, 1) : null;
    releases.push({ date: e.date, consensus, previous, actual, surprise, surprisePct, surpriseIdx, source: "local" });
  }

  let source = "local";
  try {
    const live = await fetchLiveConsensus();
    const ev = live.find((e) => e.indicatorId === id);
    const lastDate = releases.length ? releases[releases.length - 1].date : null;
    if (ev && ev.date && (!lastDate || ev.date.slice(0, 10) > lastDate)) {
      const surprise = ev.actual !== null && ev.forecast !== null ? round(ev.actual - ev.forecast, 2) : null;
      const surprisePct = surprise !== null && ev.forecast ? round((surprise / Math.abs(ev.forecast)) * 100, 2) : null;
      releases.push({
        date: ev.date.slice(0, 10),
        consensus: ev.forecast,
        previous: ev.previous,
        actual: ev.actual,
        surprise,
        surprisePct,
        surpriseIdx: surprise !== null && series.scale ? round((surprise / series.scale) * 100, 1) : null,
        source: "live",
      });
      source = "live";
    }
  } catch {
    // penyedia tidak terjangkau → tetap pakai lokal
  }

  releases.sort((a, b) => a.date.localeCompare(b.date));
  const accuracy = computeAccuracy(releases, series.tol);
  return { ...series, releases, accuracy, source };
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

  // surprise terbesar (absolut) + tanggalnya
  let maxSurprise = null, maxSurpriseDate = null;
  for (const r of valid) {
    if (maxSurprise === null || Math.abs(r.surprise) > Math.abs(maxSurprise)) {
      maxSurprise = r.surprise;
      maxSurpriseDate = r.date;
    }
  }

  // streak: kejutan beruntun searah dari rilis terakhir (BEAT/MISS)
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
  // Diparalel: data seri umumnya sudah ter-cache (lihat lib/data.js), dan
  // fetch kalender live didedup oleh in-flight dedupe di lib/cache.js.
  const out = await Promise.all(
    SERIES.map((s) => getReleaseAnalytics(s.id).catch(() => null))
  );
  return out.filter((a) => a && a.releases.length);
}

export function interpretLatest(analytics) {
  const latest = analytics?.releases?.length ? analytics.releases[analytics.releases.length - 1] : null;
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
