// GET /api/fundamentals/board
// Payload papan /fundamentals (denyut makro, bank sentral, bias, fokus
// rupiah, radar rilis) tanpa cache HTTP — dipakai halaman untuk auto-refresh
// tiap 5 menit & tombol "refresh sekarang". Cache sumber tetap dikelola ketat
// di lib/data (≤ 30 mnt; 3 mnt di jendela rilis) & lib/forex (5 mnt).

import { getFundamentalsBoardData } from "../../../../lib/fundamentalsData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  try {
    const data = await getFundamentalsBoardData();
    return Response.json(data, { headers: NO_STORE });
  } catch (error) {
    return Response.json(
      { error: "Papan fundamental gagal dimuat", message: String(error?.message || error) },
      { status: 503, headers: NO_STORE }
    );
  }
}
