// app/api/forex/route.js
// GET /api/forex → { pairs, updated, source }
// Untuk ticker harga valuta asing di bawah header.

import { getForexRates } from "../../../lib/forex";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getForexRates();
    return Response.json(data, { status: data.pairs?.length ? 200 : 503 });
  } catch (e) {
    return Response.json({ error: "Kurs forex gagal dimuat", message: String(e?.message || e) }, { status: 500 });
  }
}
