// app/api/signal/route.js
// GET /api/signal?symbol=gold&tf=1h
// Sinyal Long/Short (Beli/Jual) dihitung server-side dari harga Yahoo Finance
// (EMA 20/50 + RSI 14 + MACD 12,26,9). Di-cache 5 menit per (simbol, TF).

import { NextResponse } from "next/server";
import { getSignal, TIMEFRAMES } from "../../../lib/signals";

export const dynamic = "force-dynamic";

const VALID_SYMBOLS = new Set([
  "gold", "silver", "wti", "eurusd", "gbpusd", "usdjpy", "audusd", "usdcad", "nzdusd", "dxy",
]);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "gold";
  const tf = searchParams.get("tf") || "1h";

  if (!VALID_SYMBOLS.has(symbol)) {
    return NextResponse.json({ ok: false, error: "simbol tidak dikenal" }, { status: 400 });
  }
  if (!TIMEFRAMES.includes(tf)) {
    return NextResponse.json({ ok: false, error: "timeframe tidak dikenal" }, { status: 400 });
  }

  try {
    const data = await getSignal(symbol, tf);
    if (!data.ok) {
      return NextResponse.json(data, { status: 502 });
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.message || "gagal mengambil sinyal" },
      { status: 502 }
    );
  }
}
