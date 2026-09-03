// app/api/predictions/route.js
// GET  /api/predictions → leaderboard + daftar prediksi + event terbuka.
// POST /api/predictions { name, indicatorId, releaseDate, title, predicted, note }
//      → simpan prediksi baru.
// ?refresh=1 → isi ulang file seed (untuk demo).

import { NextResponse } from "next/server";
import {
  getPredictions, addPrediction, leaderboard, OPEN_EVENTS, scorePrediction,
} from "../../../lib/predictions";
import { CONSENSUS } from "../../../data/releases";
import { getSeriesData } from "../../../lib/data";
import { UPCOMING } from "../../../data/calendar";

export const dynamic = "force-dynamic";

// Peta releaseDate → obs (periode data FRED) dari data/releases.
function obsFor(indicatorId, releaseDate) {
  const list = CONSENSUS[indicatorId] || [];
  const hit = list.find((e) => e.date === releaseDate);
  return hit ? hit.obs : null;
}

// Bangun peta actual: "indicatorId::releaseDate" → nilai FRED aktual.
async function buildActuals(preds) {
  const actuals = {};
  const seriesCache = {};
  for (const p of preds) {
    const key = `${p.indicatorId}::${p.releaseDate}`;
    const obs = obsFor(p.indicatorId, p.releaseDate);
    if (!obs) continue;
    if (!seriesCache[p.indicatorId]) {
      seriesCache[p.indicatorId] = await getSeriesData(p.indicatorId).catch(() => null);
    }
    const series = seriesCache[p.indicatorId];
    const pt = series?.points?.find((x) => x.date === obs);
    if (pt) actuals[key] = pt.value;
  }
  return actuals;
}

export async function GET() {
  const preds = getPredictions();
  const actuals = await buildActuals(preds);
  const board = leaderboard(actuals);

  // Event terbuka untuk diprediksi (yang belum lewat).
  const open = OPEN_EVENTS.map((e) => {
    const already = preds.filter((p) => p.indicatorId === e.indicatorId && p.releaseDate === e.releaseDate);
    return { ...e, votes: already.length };
  });

  // Gabungkan judgement bila ACTUAL tersedia.
  const enriched = preds.map((p) => {
    const actual = actuals[`${p.indicatorId}::${p.releaseDate}`];
    return { ...p, actual: actual ?? null, score: scorePrediction(p.predicted, actual, p.indicatorId) };
  }).reverse();

  return NextResponse.json({ ok: true, updated: new Date().toISOString(), leaderboard: board, predictions: enriched, open });
}

export async function POST(req) {
  let body = {};
  try { body = await req.json(); } catch { /* no-op */ }
  const { name, indicatorId, releaseDate, title, predicted, note } = body;
  if (!indicatorId || !releaseDate || predicted === undefined || predicted === "") {
    return NextResponse.json({ ok: false, error: "indicatorId, releaseDate & predicted wajib diisi" }, { status: 400 });
  }
  const p = addPrediction({ name, indicatorId, releaseDate, title, predicted, note });
  // Build ulang leaderboard.
  const preds = getPredictions();
  const actuals = await buildActuals(preds);
  return NextResponse.json({ ok: true, saved: p, leaderboard: leaderboard(actuals) });
}
