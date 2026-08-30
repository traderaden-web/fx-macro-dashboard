// app/api/signal/matrix/route.js
// GET /api/signal/matrix?symbol=gold
// Sinyal semua timeframe (15m..1mo) untuk strip confluence multi-timeframe.

import { NextResponse } from "next/server";
import { getSignalMatrix } from "../../../../lib/signals";

export const dynamic = "force-dynamic";

const VALID_SYMBOLS = new Set([
  "gold", "silver", "wti", "eurusd", "gbpusd", "usdjpy", "audusd", "usdcad", "nzdusd", "dxy",
]);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "gold";
  if (!VALID_SYMBOLS.has(symbol)) {
    return NextResponse.json({ ok: false, error: "simbol tidak dikenal" }, { status: 400 });
  }
  try {
    const data = await getSignalMatrix(symbol);
    return NextResponse.json({ ok: true, ...data });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.message || "gagal mengambil matriks sinyal" },
      { status: 502 }
    );
  }
}
