// GET /api/fundamentals
// Snapshot Fundamental tanpa cache HTTP agar klien selalu melihat hasil sinkronisasi
// terbaru. Cache sumber tetap dikelola ketat di lib/data (3 menit saat rilis).

import { NextResponse } from "next/server";
import { getFundamentalSnapshot } from "../../../lib/fundamentalSnapshot";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const snapshot = await getFundamentalSnapshot();
    return NextResponse.json(snapshot, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Snapshot fundamental gagal dimuat", message: String(error?.message || error) },
      { status: 503, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }
}
