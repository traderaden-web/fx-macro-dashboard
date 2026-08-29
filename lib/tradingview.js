// lib/tradingview.js
// Parser berita TradingView langsung dari https://www.tradingview.com/news/
// (halaman di-SSR: setiap artikel berupa blok <a href="/news/..."> dengan
// judul data-qa-id="news-headline-title" dan <time dateTime="...">).
// Gratis tanpa API key; jika gagal, pipeline berita otomatis lanjut ke feed lain.

const BASE = "https://www.tradingview.com/news/";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const TIMEOUT = 5000;
const LIMIT = 40; // ambil N artikel teratas

/** Ubah "reuters.com,2026" → "Reuters", "tradingview" → "TradingView". */
function sourceOf(href) {
  // href bentuk: /news/{source}:{id}-{slug}/ atau /news/{source},{tahun}:{id}-{slug}/
  const m = href.match(/^\/news\/([^:]+):/);
  if (!m) return "TradingView";
  let s = m[1].split(",")[0];
  if (s === "tradingview") return "TradingView";
  if (s.endsWith(".com")) s = s.slice(0, -4);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Parse tanggal "Fri, 28 Aug 2026 07:48:16 GMT" → ISO. */
function parseTime(s) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function decode(str = "") {
  return String(str)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/**
 * Ambil berita terbaru dari TradingView.
 * @returns {Promise<Array<{id,title,link,iso,source}>>}
 */
export async function fetchTradingViewNews() {
  const res = await fetch(BASE, {
    signal: AbortSignal.timeout(TIMEOUT),
    cache: "no-store",
    headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml", "Accept-Language": "en-US,en;q=0.9" },
  });
  if (!res.ok) throw new Error(`TradingView HTTP ${res.status}`);
  const html = await res.text();

  const items = [];
  const blockRe = /<a href="(\/news\/[^"]+)"[^>]*class="card-[A-Za-z0-9_-]+[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
  let m;
  while ((m = blockRe.exec(html)) !== null && items.length < LIMIT) {
    const href = m[1];
    // Hanya artikel (id mengandung ":"), lewati halaman kategori seperti /news/top-stories/all/
    if (!/^\/news\/[^:]+:/.test(href)) continue;
    const block = m[2];
    const t = block.match(/data-qa-id="news-headline-title"[^>]*>([^<]+)</);
    if (!t) continue;
    const title = decode(t[1]);
    const time = block.match(/<time[^>]*dateTime="([^"]+)"/);
    const iso = parseTime(time ? time[1] : "");
    if (!title) continue;
    items.push({
      id: `tv:${href}`,
      title,
      link: `https://www.tradingview.com${href}`,
      iso,
      source: sourceOf(href),
    });
  }

  if (!items.length) throw new Error("TradingView: tidak ada artikel terparse");
  return items;
}
