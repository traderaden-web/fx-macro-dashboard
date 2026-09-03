// app/api/technicals/route.js
// GET /api/technicals → matriks sinyal teknikal untuk SEMUA instrumen × semua
// timeframe (confluence). Satu request agar halaman Teknikal cepat dimuat.
// Instrumen & symbol mengikuti lib/signals.js (YAHOO).

import { NextResponse } from "next/server";
import { getSignalMatrix } from "../../../lib/signals";
import { confluenceScore, setupGrade } from "../../../lib/confluence";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const symbols = [
    { id: "gold", label: "Gold (XAU/USD)", kind: "gold" },
    { id: "silver", label: "Silver (XAG/USD)", kind: "gold" },
    { id: "wti", label: "Minyak WTI", kind: "commodity" },
    { id: "eurusd", label: "EUR/USD", kind: "fx" },
    { id: "gbpusd", label: "GBP/USD", kind: "fx" },
    { id: "usdjpy", label: "USD/JPY", kind: "fx" },
    { id: "audusd", label: "AUD/USD", kind: "fx" },
    { id: "usdcad", label: "USD/CAD", kind: "fx" },
    { id: "nzdusd", label: "NZD/USD", kind: "fx" },
    { id: "dxy", label: "Dollar Index (DXY)", kind: "index" },
  ];

  const settled = await Promise.allSettled(symbols.map((s) => getSignalMatrix(s.id)));
  const rows = settled.map((r, i) => {
    const sym = symbols[i];
    if (r.status !== "fulfilled") {
      return { ...sym, ok: false, tfs: [], score: 0, grade: null, note: "Gagal memuat" };
    }
    const matrix = r.value;
    const c = confluenceScore(matrix.tfs || []);
    const g = setupGrade(matrix.tfs || []);
    return {
      ...sym,
      ok: true,
      updated: matrix.updated,
      tfs: matrix.tfs,
      score: c.score,
      scoreLabel: c.label,
      grade: g.grade,
      gradeNote: g.note,
    };
  });

  return NextResponse.json({ ok: true, updated: new Date().toISOString(), rows });
}
