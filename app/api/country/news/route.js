// app/api/country/news/route.js
// Berita terkini per negara makro (untuk modal detail Peta Makro).
// Sumber: Google News RSS (lib/news.js → getCountryNews), cache 10 menit per negara.
// Query: GET /api/country/news?cc=us|euro|gb|ch|jp|ca|au|nz|cn|in|br|ru

import { getCountryNews } from "../../../../lib/news";
import { COUNTRY_DATA } from "../../../../lib/macroData";

export const dynamic = "force-dynamic";

const KEYS = new Set(Object.keys(COUNTRY_DATA));

export async function GET(req) {
  const url = new URL(req.url);
  const cc = url.searchParams.get("cc");
  if (!cc || !KEYS.has(cc)) {
    return Response.json(
      { ok: false, error: `Negara tidak dikenal: ${cc || "(kosong)"}. Pilihan: ${[...KEYS].join(", ")}` },
      { status: 400 }
    );
  }
  try {
    const { items, source, updated } = await getCountryNews(cc, 8);
    return Response.json({ ok: true, cc, items, source, updated });
  } catch (e) {
    return Response.json(
      { ok: false, cc, error: String(e.message || e) },
      { status: 502 }
    );
  }
}
