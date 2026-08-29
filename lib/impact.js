// lib/impact.js
// Skoring "dampak" berita terhadap pasar Forex, Gold (XAU/USD), dan Komoditas.
// Dipakai untuk menandai berita "Sangat Berpengaruh" dan filter di halaman /news.

// Pola "noise": kata kunci pasar yang muncul di konteks olahraga/balapan
// (mis. "Racing Gold Cup", "Silver Dollar") — cegah false positive.
const NOISE_RE = /\b(racing|hockey|football|soccer|cricket|tennis|match results|box score|premier league|champions league|\bnba\b|\bnfl\b|\bmlb\b|\bnhl\b|grand prix|horse)\b/i;

// Aturan: tag pasar + bobot. Skor kumulatif menentukan level dampak.
const RULES = [
  { tag: "Gold",           w: 3, re: /\bgold\b|xau|bullion|\bemas\b/i },
  { tag: "Silver",         w: 2, re: /\bsilver\b|xag|\bperak\b/i },
  { tag: "Minyak",         w: 3, re: /\boil\b|crude|\bwti\b|brent|opec|minyak/i },
  { tag: "Gas Alam",       w: 2, re: /natural gas|natgas|henry hub/i },
  { tag: "Tembaga",        w: 2, re: /copper|tembaga/i },
  { tag: "Komoditas",      w: 2, re: /commodit/i },
  { tag: "Fed & Suku Bunga", w: 3, re: /\bfed\b|fomc|powell|rate (hike|cut)|interest rate|\becb\b|\bboj\b|bank of england|bank of japan|suku bunga/i },
  { tag: "Inflasi",        w: 2, re: /inflation|inflasi|\bcpi\b|\bpce\b|\bppi\b/i },
  { tag: "Pasar Kerja",    w: 2, re: /nonfarm|payroll|jobless|unemployment|labor market/i },
  { tag: "Dolar",          w: 2, re: /dollar|dxy|greenback/i },
  { tag: "Valuta",         w: 2, re: /\byen\b|\beuro\b|\bpound\b|sterling|forex|\bfx\b|exchange rate/i },
  { tag: "Guncangan",      w: 2, re: /recession|resesi|tariff|sanction|geopolit|war\b|trade (war|deal)/i },
  { tag: "Ekonomi",        w: 1, re: /\bgdp\b|econom/i },
  { tag: "Sentimen Pasar", w: 1, re: /risk[- ]?off|safe[- ]?haven|equit|s&p|nasdaq|dow /i },
];

export const IMPACT_LEVELS = {
  kritis: { label: "Sangat Berpengaruh", icon: "🔥" },
  tinggi: { label: "Dampak Tinggi", icon: "⚡" },
  sedang: { label: "Dampak Sedang", icon: "•" },
  normal: { label: "Biasa", icon: "" },
};

/**
 * Skor dampak sebuah berita terhadap Forex/Gold/Komoditas.
 * @param {string} title judul berita
 * @returns {{score:number, level:"kritis"|"tinggi"|"sedang"|"normal", tags:string[]}}
 */
export function scoreNewsImpact(title = "") {
  const t = String(title);
  let score = 0;
  const tags = [];
  for (const r of RULES) {
    if (r.re.test(t)) {
      score += r.w;
      tags.push(r.tag);
    }
  }
  let level = score >= 6 ? "kritis" : score >= 4 ? "tinggi" : score >= 2 ? "sedang" : "normal";
  if (NOISE_RE.test(t) && level === "kritis") level = "tinggi";
  return { score, level, tags };
}
