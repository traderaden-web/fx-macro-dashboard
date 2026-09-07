// app/api/fred/[id]/route.js
// API route yang mengembalikan data satu indikator (live FRED dengan fallback seed).
// Panggil: GET /api/fred/cpi
//
// Selalu dihitung per request (tanpa cache CDN) — cache TTL singkat sudah
// ditangani di server oleh lib/data.js (30 mnt; 3 mnt di jendela rilis).

import { getSeriesData } from "../../../../lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

export async function GET(_req, { params }) {
  const { id } = await params;
  const data = await getSeriesData(id);
  if (!data) {
    return Response.json({ error: "Indikator tidak ditemukan", id }, { status: 404, headers: NO_STORE });
  }
  return Response.json(data, { headers: NO_STORE });
}
