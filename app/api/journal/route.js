// app/api/journal/route.js
// GET  /api/journal → daftar trade + statistik.
// POST /api/journal → tambah trade. { symbol, direction, entry, stopLoss, takeProfit, lots, pnl, status, note }
// PATCH /api/journal?id=..&pnl=.. → tutup trade (isi hasil) / edit.
// DELETE /api/journal?id=.. → hapus trade.

import { NextResponse } from "next/server";
import { getTrades, addTrade, updateTrade, deleteTrade, computeStats } from "../../../lib/journal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const trades = getTrades();
  const stats = computeStats(trades);
  return NextResponse.json({ ok: true, trades, stats });
}

export async function POST(req) {
  let body = {};
  try { body = await req.json(); } catch { /* no-op */ }
  const { symbol, direction, entry, stopLoss, takeProfit, lots, pnl, status, note } = body;
  if (!symbol || !direction ) {
    return NextResponse.json({ ok: false, error: "symbol & direction wajib diisi" }, { status: 400 });
  }
  const t = addTrade({ symbol, direction, entry, stopLoss, takeProfit, lots, pnl, note, status });
  return NextResponse.json({ ok: true, trade: t, stats: computeStats(getTrades()) });
}

export async function PATCH(req) {
  let body = {};
  try { body = await req.json(); } catch { /* no-op */ }
  const id = body?.id;
  if (id == null) return NextResponse.json({ ok: false, error: "id wajib diisi" }, { status: 400 });
  const t = updateTrade(id, body);
  if (!t) return NextResponse.json({ ok: false, error: "trade tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ ok: true, trade: t, stats: computeStats(getTrades()) });
}

export async function DELETE(req) {
  const id = new URL(req.url).searchParams.get("id");
  if (id == null) return NextResponse.json({ ok: false, error: "id wajib diisi" }, { status: 400 });
  deleteTrade(id);
  return NextResponse.json({ ok: true, stats: computeStats(getTrades()) });
}
