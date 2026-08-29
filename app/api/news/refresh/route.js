// app/api/news/refresh/route.js
// Endpoint untuk memaksa refresh berita (melewati cache TTL).
// Dipanggil oleh tombol "Refresh berita" di halaman /news.
// GET /api/news/refresh → { items, source, updated }

import { getNews } from "../../../../lib/news";

export const revalidate = 0; // selalu proses ulang
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getNews({ force: true });
    return Response.json(data, { status: data.items?.length ? 200 : 503 });
  } catch (e) {
    return Response.json({ error: "Refresh gagal", message: String(e?.message || e) }, { status: 500 });
  }
}
