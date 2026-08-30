// app/api/article/route.js
// GET /api/article?url=https://...
// Ekstraksi isi berita server-side (hindari CORS dari browser) + cache 10 menit.

import { NextResponse } from "next/server";
import { extractArticle } from "../../../lib/article";
import { cached } from "../../../lib/cache";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) {
    return NextResponse.json({ ok: false, error: "url wajib diisi" }, { status: 400 });
  }

  try {
    const data = await cached(`article:${url}`, 10 * 60 * 1000, () => extractArticle(url));
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e?.message || "Gagal mengambil artikel",
        // client tetap bisa tampilkan judul + link sumber
      },
      { status: 502 }
    );
  }
}
