// app/api/patterns/route.js
// GET /api/patterns?tf=1h  → scan SEMUA instrumen × semua timeframe untuk pola
// candlestick + breakout. Dipakai oleh halaman /screener.
// Per TF dijadwalkan terpisah dan kegagalan satu instrumen tidak menularkan.

import { NextResponse } from "next/server";
import { getBars } from "../../../lib/signals";
import { detectPatterns, topPattern } from "../../../lib/patterns";
import { confluenceScore } from "../../../lib/confluence";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const INSTRUMENTS = [
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

const TFS = ["15m", "1h", "4h", "1d"];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const forceTf = searchParams.get("tf");
  const tfs = forceTf && TFS.includes(forceTf) ? [forceTf] : TFS;

  const settled = await Promise.allSettled(
    INSTRUMENTS.flatMap((inst) =>
      tfs.map((tf) => getBars(inst.id, tf).then(({ bars, source }) => ({ inst, tf, bars, source })))
    )
  );

  const rows = [];
  for (const t of settled) {
    if (t.status !== "fulfilled") continue;
    const { inst, tf, bars, source } = t.value;
    const pats = detectPatterns(bars);
    const top = topPattern(bars);
    rows.push({
      id: inst.id,
      label: inst.label,
      kind: inst.kind,
      tf,
      source,
      count: pats.length,
      top: top ? { name: top.name, dir: top.dir, strength: Math.round(top.strength) } : null,
      patterns: pats.slice(0, 3).map((p) => ({ name: p.name, dir: p.dir, strength: Math.round(p.strength) })),
    });
  }

  // Kelompokkan per instrumen, kumpulkan ke 1 baris dengan daftar TF.
  const byInstr = new Map();
  for (const r of rows) {
    if (!byInstr.has(r.id)) {
      byInstr.set(r.id, { ...INSTRUMENTS.find((i) => i.id === r.id), tfs: [] });
    }
    byInstr.get(r.id).tfs.push({ tf: r.tf, top: r.top, count: r.count, patterns: r.patterns, source: r.source });
  }

  const instruments = [...byInstr.values()].map((inst) => {
    // Skor motif: hitung berapa baris TF yang punya sinyal pembalikan kuat.
    const signals = inst.tfs.filter((t) => t.top);
    const strongest = signals.sort((a, b) => (b.top?.strength || 0) - (a.top?.strength || 0))[0];
    return { ...inst, top: strongest?.top || null, signalCount: signals.length };
  });

  return NextResponse.json({ ok: true, updated: new Date().toISOString(), instruments });
}
