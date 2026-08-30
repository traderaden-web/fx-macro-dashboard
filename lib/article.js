// lib/article.js
// Ekstraksi isi berita dari URL sumber (dipanggil server-side via /api/article).
// Mengambil <title>, meta description/og:description, dan paragraf-paragraf
// terpanjang dari HTML. Robust: konten apa pun yang tidak bisa diekstrak akan
// kembali dengan deskripsi + instruksi membuka situs sumber.

const TIMEOUT = 9000;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

function cleanText(s) {
  let out = String(s)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, "\n");
  // decode entity → strip tag, diulang (untuk HTML ter-escape ganda)
  for (let i = 0; i < 3; i++) {
    const next = out
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#0?39;/gi, "'")
      .replace(/&amp;/gi, "&")
      .replace(/<[^>]+>/g, " ");
    if (next === out) break;
    out = next;
  }
  return out
    .replace(/&nbsp;|\u00a0|\u200b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function metaContent(html, patterns) {
  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1]) return cleanText(m[1]).slice(0, 400);
  }
  return null;
}

/**
 * Ekstrak konten artikel. `url` harus http(s) & bukan jaringan lokal.
 * @returns {ok, title, description, paragraphs, excerpt, sourceDomain}
 */
export async function extractArticle(url) {
  let u;
  try {
    u = new URL(url);
  } catch {
    throw new Error("URL tidak valid");
  }
  if (!/^https?:$/.test(u.protocol)) throw new Error("Hanya http/https");

  const host = u.hostname.toLowerCase();
  const blocked =
    host === "localhost" ||
    host.endsWith(".local") ||
    host.startsWith("127.") ||
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    host.startsWith("169.254.") ||
    host === "0.0.0.0" ||
    host === "[::1]";
  if (blocked) throw new Error("URL tidak diizinkan");

  // Link "splash" Google News tidak berisi artikel (URL penerbit dipicu JS) —
  // client akan menampilkan ringkasan RSS + tombol buka di sumber.
  if (host === "news.google.com" && u.pathname.startsWith("/rss/articles/")) {
    return {
      ok: true,
      redirect: true,
      title: null,
      description: null,
      paragraphs: [],
      excerpt: null,
      sourceDomain: host,
    };
  }

  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT),
    redirect: "follow",
    headers: { Accept: "text/html,application/xhtml+xml", "User-Agent": UA },
  });
  if (!res.ok) throw new Error(`Sumber tidak dapat diakses (HTTP ${res.status})`);

  const html = await res.text();
  if (!html || html.length < 200) throw new Error("Konten kosong");

  const title =
    metaContent(html, [
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i,
    ]) ||
    (html.match(/<title[^>]*>([^<]+)/i) || [])[1] ||
    null;

  const description = metaContent(html, [
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)/i,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i,
  ]);

  // Paragraf: ambil blok <p> terpanjang (biasanya badan artikel)
  const paras = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => cleanText(m[1]))
    .filter((p) => p.length >= 40 && p.length <= 800 && !/copyright|cookie|privacy|subscribe|sign in|log in/i.test(p))
    .filter((p, i, arr) => arr.findIndex((x) => x === p) === i)
    .sort((a, b) => b.length - a.length)
    .slice(0, 6);

  const excerpt =
    (description || paras[0] || "").slice(0, 500);

  return {
    ok: true,
    title: title ? cleanText(title).slice(0, 200) : null,
    description: description || null,
    paragraphs: paras,
    excerpt,
    sourceDomain: host,
  };
}
