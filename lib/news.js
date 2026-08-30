// lib/news.js
// Pengambil berita pasar terkini dari Google News RSS.
// Situs berita besar (Reuters, Investing.com, FXStreet) memblokir scraping langsung
// (403 / anti-bot / feed diputus). Google News RSS tetap publik & andal, dan mendukung
// query `site:` sehingga berita tetap berasal dari sumber yang diinginkan + topik.
// Di-cache agar tidak dipanggil berulang; ada fallback ke seed bila penuh gagal.

import { cached } from "./cache";
import seed from "../data/news.json";
import { scoreNewsImpact } from "./impact";
import { fetchTradingViewNews } from "./tradingview";

const RSS_BASE = "https://news.google.com/rss/search?q=";
const TIMEOUT = 8000;
const TTL = 10 * 60 * 1000; // 10 menit
const CONCURRENCY = 3; // hindari tripping rate-limit Google News
const RETRIES = 1; // coba ulang sekali bila gagal
const FAIL_TTL = 5 * 60 * 1000; // negative cache: penyedia gagal → jangan coba lagi 5 menit
const HARD_TIMEOUT = 6000; // render halaman tidak menunggu berita lebih dari ini

let lastFail = 0;

function withTimeout(p, ms) {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);
}

// Tiap feed: query Google News + label kategori + (opsional) bahasa.
const FEEDS = [
  { key: "economy", cat: "ekonomi", q: "site:reuters.com forex OR currency OR economy" },
  { key: "investing", cat: "pasar", q: "site:investing.com market OR forex" },
  { key: "fxstreet", cat: "moneter", q: "site:fxstreet.com fed OR interest rate" },
  { key: "commodities", cat: "komoditas", q: "oil OR gold OR crude OR copper OR commodities" },
  { key: "fed", cat: "moneter", q: "FOMC OR \"Federal Reserve\" OR interest rate" },
  { key: "forex", cat: "forex", q: "EUR/USD OR GBP/USD OR USD/JPY OR \"currency pair\" OR \"exchange rate\" OR \"forex market\"" },
  { key: "indonesia", cat: "indonesia", q: "\"Bank Indonesia\" OR \"BI rate\" OR \"nilai tukar rupiah\" OR \"suku bunga\" OR forex", hl: "id", gl: "ID", ceid: "ID:in" },
];

// Peta kata kunci → indikator terkait (untuk menautkan berita ke halaman analisis).
const INDICATOR_RULES = [
  { id: "fedfunds", re: /fed|fomc|central bank|ecb|boj|bank of england|powell|warsh|hawkish|dovish|rate hike|rate cut|interest rate/i },
  { id: "cpi", re: /inflation|cpi|pce|consumer price|prices|price index|deflation/i },
  { id: "nfp", re: /payroll|employment|unemployment|jobs|jobless|nonfarm|labor|labour|hiring/i },
  { id: "wti", re: /oil|crude|opec|barrel|brend|energy/i },
  { id: "gdp", re: /\bgdp\b|gross domestic|economic growth/i },
  { id: "retail", re: /retail sales|consumer spending|consumer demand/i },
  { id: "umich", re: /michigan|consumer sentiment|consumer confidence/i },
  { id: "claims", re: /jobless claims|initial claims|unemployment claims/i },
  { id: "dgs10", re: /10-year|treasury yield|bond yield|yields/i },
  { id: "indpro", re: /ism|manufacturing|industrial production|factory/i },
];

function tieIndicator(title = "") {
  const t = String(title);
  for (const r of INDICATOR_RULES) if (r.re.test(t)) return r.id;
  return null;
}

// Kata kunci untuk membuat ringkasan otomatis dari judul (karena RSS tidak memuat isi artikel).
const SUMMARY_RULES = [
  { re: /hawkish|rate hike|hike|tighten|dump/i, text: "Mengindikasikan arah kebijakan yang lebih ketat — cenderung menguatkan mata uang & menekan aset berisiko." },
  { re: /dovish|rate cut|cut|ease|pause|slash/i, text: "Mengindikasikan pelonggaran kebijakan — berpotensi melemahkan mata uang & mendukung aset berisiko." },
  { re: /inflation|cpi|pce|price|cost|consumer|deflation/i, text: "Terkait tekanan harga & inflasi, yang sangat menentukan prospek suku bunga bank sentral." },
  { re: /oil|crude|opec|barrel|energy/i, text: "Pergerakan harga minyak & energi, berdampak pada inflasi dan mata uang penghasil energi." },
  { re: /gold|silver|metal|copper/i, text: "Pergerakan logam mulia & industri, sering dipakai sebagai lindung nilai terhadap risiko & inflasi." },
  { re: /employment|jobs|payroll|unemployment|labor|labour|hiring/i, text: "Data pasar kerja, yang menandakan kesehatan ekonomi dan arah kebijakan bank sentral." },
  { re: /fed|fomc|central bank|ecb|boj|bank of england|powell|warren|warsh/i, text: "Keputusan & pernyataan bank sentral — paling berpengaruh terhadap pasar keuangan global." },
  { re: /dollar|usd|eur\/usd|gbp\/usd|currency|forex|fx|yen|euro|sterling/i, text: "Pergerakan nilai tukar mata uang — fokus utama para trader forex." },
  { re: /yield|bond|treasury|debt|10-year|10 y/i, text: "Imbal hasil obligasi, mencerminkan ekspektasi suku bunga & persepsi risiko pasar." },
  { re: /stock|equity|shares|nasdaq|s&p|dow|wall st/i, text: "Pergerakan pasar saham yang sering berkorelasi dengan sentimen risiko global." },
];

/** Buat satu baris ringkasan otomatis berdasarkan judul. */
export function summarize(title = "") {
  const t = String(title);
  for (const rule of SUMMARY_RULES) {
    if (rule.re.test(t)) return rule.text;
  }
  return "Kabar pasar terkini yang berpotensi memengaruhi arah aset & nilai tukar. Baca selengkapnya untuk detail.";
}

function decode(str) {
  if (!str) return "";
  return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

/** Normalisasi judul agar dedupe akurat (buang embel-embel sumber & tanda kutip). */
function normalizeTitle(title = "") {
  return String(title)
    .replace(/\s*-\s*[^-]+$/, "") // buang trailing " - Reuters"
    .replace(/[“”"']+/g, "")
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** Ambil satu feed RSS dan kembalikan array item ternormalisasi. */
async function fetchFeed(feed) {
  const hl = feed.hl || "en-US";
  const gl = feed.gl || "US";
  const ceid = feed.ceid || "US:en";
  const url = `${RSS_BASE}${encodeURIComponent(feed.q)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT),
    cache: "no-store",
    redirect: "follow",
    headers: { "User-Agent": "Mozilla/5.0", Accept: "application/rss+xml, application/xml, text/xml, */*" },
  });
  if (!res.ok) throw new Error(`GoogleNews ${feed.key} HTTP ${res.status}`);
  const xml = await res.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  return items
    .map((it) => {
      const get = (re) => (it.match(re) || [])[1];
      const title = decode((get(/<title>(.*?)<\/title>/) || "").replace(/<[^>]+>/g, "").trim());
      const link = decode(get(/<link>(.*?)<\/link>/) || "").trim();
      const pubDate = decode(get(/<pubDate>(.*?)<\/pubDate>/) || "").trim();
      const source = decode((get(/<source[^>]*>(.*?)<\/source>/) || "").trim());
      // <description> RSS = ringkasan artikel dari penerbit (dipakai popup berita)
      const rawDesc = get(/<description>([\s\S]*?)<\/description>/) || "";
      const rssSummary = decode(rawDesc.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
      const iso = pubDate ? new Date(pubDate).toISOString() : null;
      if (!title || !link) return null;
      return {
        id: `${feed.key}:${link}`,
        title,
        link,
        pubDate,
        iso,
        source: source || "Google News",
        cat: feed.cat,
        lang: feed.hl === "id" ? "id" : "en",
        summary: summarize(title),
        rssSummary: rssSummary || null,
        indicatorId: tieIndicator(title),
        impact: scoreNewsImpact(title),
        norm: normalizeTitle(title),
      };
    })
    .filter(Boolean);
}

/** Eksekusi async dengan batas konkurensinya (biar tidak di-throttle Google News). */
function pool(items, limit, fn) {
  const results = new Array(items.length);
  let idx = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (idx < items.length) {
      const i = idx++;
      try {
        results[i] = { ok: true, value: await fn(items[i]) };
      } catch (e) {
        results[i] = { ok: false, error: e };
      }
    }
  });
  return Promise.all(runners).then(() => results);
}

async function fetchWithRetry(feed) {
  try {
    return await fetchFeed(feed);
  } catch (e) {
    if (RETRIES <= 0) throw e;
    await new Promise((r) => setTimeout(r, 200));
    return fetchFeed(feed);
  }
}

/** Ambil semua feed, gabung, dedupe (kunci: judul ternormalisasi), urutkan terbaru dulu.
 *  TradingView diproses paralel dan DIDULUHKAN saat dedupe agar link langsung
 *  (bukan redirect Google News) yang tersimpan. */
async function fetchAll() {
  const [settled, tvRaw] = await Promise.all([
    pool(FEEDS, CONCURRENCY, fetchWithRetry),
    withTimeout(fetchTradingViewNews(), TIMEOUT).catch(() => []),
  ]);

  const tvItems = tvRaw.map((it) => ({
    ...it,
    cat: "tradingview",
    lang: "en",
    summary: summarize(it.title),
    indicatorId: tieIndicator(it.title),
    impact: scoreNewsImpact(it.title),
    norm: normalizeTitle(it.title),
  }));

  const seen = new Set();
  const out = [];
  const push = (it) => {
    const key = it.norm || it.title.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(it);
  };
  tvItems.forEach(push);
  for (const r of settled) {
    if (!r.ok || !r.value) continue;
    r.value.forEach(push);
  }
  return out.sort((a, b) => (b.iso || "").localeCompare(a.iso || ""));
}

/** Data berita live (Google News RSS) dengan cache; `force` melewati cache.
 *  Dibatasi HARD_TIMEOUT + negative cache agar render halaman tidak pernah
 *  macet lama saat penyedia tidak terjangkau (langsung pakai seed). */
export async function getNews({ force = false } = {}) {
  if (force || Date.now() - lastFail > FAIL_TTL) {
    try {
      let live;
      if (force) {
        live = await withTimeout(fetchAll(), HARD_TIMEOUT);
        if (live && live.length) cached.force?.("news:gnews", live);
      } else {
        live = await withTimeout(cached("news:gnews", TTL, fetchAll), HARD_TIMEOUT);
      }
      if (live && live.length) {
        return { items: live, source: "live", updated: new Date().toISOString() };
      }
      lastFail = Date.now(); // hasil kosong = anggap gagal
    } catch {
      lastFail = Date.now();
      /* jatuh ke seed */
    }
  }
  return {
    items: (seed.items || []).map((it) => (it.impact ? it : { ...it, impact: scoreNewsImpact(it.title) })),
    source: "seed",
    updated: seed.updated || null,
  };
}

/** Berita berfokus pasar (Gold/Forex/Komoditas) untuk halaman /charts —
 *  diurutkan dari skor dampak tertinggi, lalu terbaru. */
export async function getMarketNews(n = 8) {
  const { items, source, updated } = await getNews();
  const scored = items
    .filter((i) => (i.impact?.score ?? 0) > 0)
    .sort((a, b) => (b.impact.score - a.impact.score) || (b.iso || "").localeCompare(a.iso || ""));
  return { items: scored.slice(0, n), source, updated };
}

/** Berita "penting" terbaru untuk widget beranda — kategori kunci + berita
 *  berstatus "sangat berpengaruh" (Gold/Forex/Komoditas) didahulukan. */
export async function getTopNews(n = 5) {
  const { items, source, updated } = await getNews();
  const important = items
    .filter((i) => ["moneter", "forex", "pasar", "ekonomi"].includes(i.cat) || i.impact?.level === "kritis")
    .sort((a, b) => {
      const ka = a.impact?.level === "kritis" ? 1 : 0;
      const kb = b.impact?.level === "kritis" ? 1 : 0;
      if (kb !== ka) return kb - ka;
      return (b.iso || "").localeCompare(a.iso || "");
    })
    .slice(0, n);
  return { items: important, source, updated };
}
