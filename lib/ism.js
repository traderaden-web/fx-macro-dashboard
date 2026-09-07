// lib/ism.js
// ISM Manufacturing / Services PMI tidak tersedia di FRED (lisensi). Nilai
// headline diambil langsung dari laporan resmi ISM:
//   https://www.ismworld.org/supply-management-news-and-reports/reports/ism-pmi-reports/pmi/august/
//   https://www.ismworld.org/supply-management-news-and-reports/reports/ism-pmi-reports/services/august/
// Halaman per-bulan TIDAK memuat tahun di URL (Agustus = laporan Agustus terbaru),
// jadi tahun diverifikasi dari judul "August 2026 ISM® Manufacturing PMI® Report".
//
// Dipakai oleh lib/data.js (live, cache 30 mnt) dan scripts/fetch-ism.mjs (cron →
// data/seed.json). Tanpa dependensi internal agar bisa di-import langsung oleh
// skrip Node.

const BASE = "https://www.ismworld.org/supply-management-news-and-reports/reports/ism-pmi-reports";
const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const TIMEOUT = 8000;
const UA = "Mozilla/5.0 (compatible; MacroLab/1.0; +https://github.com/traderaden-web/fx-macro-dashboard)";

export const ISM_KINDS = { pmi: "Manufacturing", services: "Services" };

function decode(s) {
  return String(s || "")
    .replace(/&#174;|&reg;|®/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Parse HTML laporan ISM → {value, month(1-12), year} atau null. */
export function parseIsmReport(html, kind) {
  const text = decode(html);
  const label = ISM_KINDS[kind];
  // "Manufacturing PMI at 54.6%" / "Services PMI at 55.4%"
  const mVal = new RegExp(`${label}\\s+PMI\\s+at\\s+(\\d{1,3}(?:\\.\\d+)?)\\s*%`, "i").exec(text);
  // "August 2026 ISM Manufacturing PMI Report"
  const mDate = new RegExp(`(${MONTHS.join("|")})\\s+(20\\d{2})\\s+ISM\\s+${label}\\s+PMI\\s+Report`, "i").exec(text);
  if (!mVal || !mDate) return null;
  return {
    value: Number(mVal[1]),
    month: MONTHS.indexOf(mDate[1].toLowerCase()) + 1,
    year: Number(mDate[2]),
  };
}

async function fetchReport(kind, monthIdx) {
  const url = `${BASE}/${kind}/${MONTHS[monthIdx]}/`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT),
    cache: "no-store",
    headers: { "user-agent": UA, accept: "text/html" },
  });
  if (!res.ok) throw new Error(`ISM HTTP ${res.status}`);
  return parseIsmReport(await res.text(), kind);
}

/**
 * Titik data terbaru: {date:"YYYY-MM-01", value}. Mencoba bulan lalu (laporan
 * terbit pada hari kerja pertama/ketiga bulan berikutnya), lalu dua bulan lalu.
 * Tahun pada halaman harus cocok — kalau halaman "august" masih tahun lalu
 * (belum dirilis), dilewati.
 */
export async function fetchIsmLatest(kind, now = new Date()) {
  if (!ISM_KINDS[kind]) throw new Error(`ISM kind tidak dikenal: ${kind}`);
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth(); // 0-based bulan berjalan
  const candidates = [1, 2].map((back) => {
    const idx = (m - back + 12) % 12;
    const year = m - back < 0 ? y - 1 : y;
    return { idx, year };
  });
  let lastErr = null;
  for (const c of candidates) {
    try {
      const r = await fetchReport(kind, c.idx);
      if (r && r.year === c.year && r.month === c.idx + 1 && Number.isFinite(r.value)) {
        return { date: `${c.year}-${String(c.idx + 1).padStart(2, "0")}-01`, value: r.value };
      }
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("ISM: laporan terbaru belum tersedia");
}
