// lib/assetNews.js
// Filter berita agar relevan dengan aset yang dipilih di tab Chart,
// diurutkan berdasarkan skor dampak (lib/impact.js) lalu kesegaran.
//
// Keyword set dipilih agar hanya berita yang benar-benar menggerakkan
// aset tersebut yang muncul (mis. XAUUSD → berita emas, The Fed, yield,
// dolar; WTI → minyak, OPEC+; EUR/USD → euro, ECB).

const GOLD_KW = [
  "gold", "xau", "emas", "precious", "comex", "hedge fund", "safe haven",
  "dollar", "fed", "fomc", "treasury", "yield", "inflation", "cpi", "jobs",
  "nfp", "recession", "risk", "china", "geopolit",
];
const SILVER_KW = ["silver", "xag", "perak", "precious", "industrial"];
const OIL_KW = [
  "oil", "crude", "wti", "brent", "opec", "petroleum", "minyak", "barrel",
  "energy", "energi", "refin", "drilling", "sanction",
];
const GAS_KW = ["natural gas", "gas alam", "henry hub", "lng", "shale gas"];
const COPPER_KW = [
  "copper", "tembaga", "china", "manufacturing", "pmi", "infrastructure",
  "grid", "solar", "cable",
];
const USD_KW = [
  "dollar", "dxy", "usd", "fed", "fomc", "treasury", "yield", "rate",
  "suku bunga", "inflation", "cpi", "jobs report", "nfp", "dolar",
];
const EURUSD_KW = [
  "euro", "eur", "ecb", "eurozone", "european", "dollar", "usd", "fed",
  "sterling", "pound", "yen",
];

const MAP = {
  gold: GOLD_KW,
  "gold-fut": GOLD_KW,
  silver: SILVER_KW,
  wti: OIL_KW,
  brent: OIL_KW,
  natgas: GAS_KW,
  copper: COPPER_KW,
  dxy: USD_KW,
  eurusd: EURUSD_KW,
};

export function assetKeywords(assetId) {
  return MAP[assetId] || GOLD_KW;
}

/**
 * Ambil berita yang paling berdampak untuk satu aset.
 * `items` = output getNews()/getMarketNews() (sudah ber-impact {score,level,tags}).
 * Jika hasil filter < `min`, diisi berita ber-impact tertinggi secara umum
 * agar kartu tidak pernah kosong.
 */
export function filterAssetNews(items, assetId, { n = 6, min = 3 } = {}) {
  if (!Array.isArray(items) || !items.length) return [];
  const kws = assetKeywords(assetId);
  const scored = (it) => it.impact?.score ?? 0;

  const matched = items.filter((it) => {
    const text = `${it.title || ""} ${it.summary || ""} ${it.cat || ""}`.toLowerCase();
    return kws.some((k) => text.includes(k));
  });
  matched.sort(
    (a, b) => scored(b) - scored(a) || (b.iso || "").localeCompare(a.iso || "")
  );

  let out = matched.slice(0, n);
  if (out.length < min) {
    const have = new Set(out.map((i) => i.title));
    const fill = [...items]
      .sort((a, b) => scored(b) - scored(a) || (b.iso || "").localeCompare(a.iso || ""))
      .filter((i) => !have.has(i.title));
    out = [...out, ...fill.slice(0, n - out.length)];
  }
  return out;
}
