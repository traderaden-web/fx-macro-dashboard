// app/api/fred/[id]/route.js
// API route yang mengembalikan data satu indikator (live FRED dengan fallback seed).
// Panggil: GET /api/fred/cpi

import { getSeriesData } from "../../../../lib/data";

export async function GET(_req, { params }) {
  const { id } = await params;
  const data = await getSeriesData(id);
  if (!data) {
    return Response.json({ error: "Indikator tidak ditemukan", id }, { status: 404 });
  }
  return Response.json(data);
}
