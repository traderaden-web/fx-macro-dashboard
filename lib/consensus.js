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
    releases.push({ date: e.date, consensus, previous, actual, surprise, surprisePct, source: "local" });
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
        source: "live",
      });
      source = "live";
    }
  } catch {
    // penyedia tidak terjangkau → tetap pakai lokal
  }

  releases.sort((a, b) => a.date.localeCompare(b.date));
  const accuracy = computeAccuracy(releases);
  return { ...series, releases, accuracy, source };
}

export function computeAccuracy(releases) {
  const valid = releases.filter((r) => r.actual != null && r.consensus != null);
  if (!valid.length) return { samples: 0, hitRate: null, avgPct: null, bias: null, dirAcc: null };

  const tolerance = 0.5;
  const hit = valid.filter((r) => Math.abs(r.surprise) <= tolerance).length;
  const hitRate = round((hit / valid.length) * 100, 1);

  const pcts = valid.filter((r) => r.surprisePct != null);
  const avgPct = pcts.length ? round(avg(pcts.map((r) => r.surprisePct)), 2) : null;
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

  return { samples: valid.length, hitRate, avgPct, bias: biasAbs, dirAcc };
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
