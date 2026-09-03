// lib/copilot.js
// "Copilot" — asisten AI berbasis aturan (rule-based) yang menjawab pertanyaan
// trader memakai data nyata dari MacroLab sendiri (sinyal teknikal, kekuatan
// mata uang, risk appetite, kalender, fundamental). Tidak memakai API eksternal,
// jadi cepat & gratis. Di Fase 3 bisa diganti engine LLM dengan prompt yang
// menyuntikkan fungsi-fungsi di bawah.

import { computeCurrencyStrength, riskBias } from "./strength";
import { confluenceScore, setupGrade } from "./confluence";

const INSTRUMENT_ALIAS = {
  gold: ["gold", "emas", "xau"],
  silver: ["silver", "perak", "xag"],
  wti: ["wti", "minyak", "oil", "crude"],
  eurusd: ["eurusd", "eur/usd", "euro dolar"],
  gbpusd: ["gbpusd", "gbp/usd", "pound dolar", "cable"],
  usdjpy: ["usdjpy", "usd/jpy", "yen"],
  audusd: ["audusd", "aud/usd", "aussie"],
  usdcad: ["usdcad", "usd/cad", "loonie"],
  nzdusd: ["nzdusd", "nzd/usd", "kiwi"],
  dxy: ["dxy", "dollar index", "dxy"],
};

// Data yang "diisikan" oleh server sebelum dipanggil (server component / route).
const CTX_DEFAULTS = {
  matrix: [],           // hasil /api/signal/matrix per instrumen
  strength: [],         // currency strength
  bias: null,           // risk bias
  vix: null,
  events: [],           // rilis terdekat
};

// Render model "penalaran" sederhana.
export function answerCopilot(question, ctx = CTX_DEFAULTS) {
  const q = (question || "").toLowerCase().trim();
  if (!q) return { text: "Tanya sesuatu — misal: 'Bagaimana setup GBP/USD hari ini?'" };

  const tokens = q.split(/\s+/);

  // 1) Deteksi instrumen yang ditanya.
  const inst = Object.keys(INSTRUMENT_ALIAS).find((id) =>
    INSTRUMENT_ALIAS[id].some((k) => q.includes(k))
  );

  const foundRow = inst ? ctx.matrix.find((r) => r.id === inst) : null;
  const c = foundRow ? confluenceScore(foundRow.tfs || []) : null;
  const grade = foundRow ? setupGrade(foundRow.tfs || []) : null;

  // 2) Intent: sentimen / setup / risiko / kalender.
  if (/sentimen|risk|apetite|risk.?on|risk.?off|panik|eufor/.test(q)) {
    const b = ctx.bias;
    return {
      text: `Sentimen pasar saat ini ${b?.label || "netral"}. Gap risk-on vs risk-off ${b?.gap ?? "—"}, ${
        b ? `mata uang risk-on ${b.riskOn} vs safe-haven ${b.riskOff}` : ""
      }. ${ctx.vix != null ? `VIX di ${Number(ctx.vix).toFixed(1)} (ketakutan pasar ${ctx.vix >= 28 ? "tinggi" : ctx.vix <= 14 ? "sangat rendah" : "moderat"}).` : ""} ${caut()}`,
    };
  }

  if (/kalender|event|rilis|fomc|nfp|cpi|jadwal/.test(q)) {
    if (ctx.events?.length) {
      const top = ctx.events.slice(0, 3).map((e) => `${e.title} (${e.date.slice(8, 10)}/${e.date.slice(5, 7)} ${e.time} WIB)`).join(" · ");
      return { text: `Rilis terdekat yang perlu dipantau:\n\n${top}\n\nPastikan cek dampak & konsensus di halaman Analisis atau Kalender.` };
    }
    return { text: "Belum ada rilis penting berikutnya yang terjadwal dalam data." };
  }

  if (/posisi|size|lots?\b|risiko|manajemen risiko|hitun(g|g) lot|berapa lot/.test(q)) {
    return { text: "Gunakan Kalkulator Trader (menu Kalkulator): masukkan saldo, risiko %, dan stop loss → langsung dapat jumlah lot yang tepat. Aturan aman: risiko 1–2% per trade, target minimal 1:2 (risk:reward)." };
  }

  if (foundRow) {
    const signals = (foundRow.tfs || []).filter((t) => t.ok).map((t) => `${t.tf}: ${t.signal} (${t.score})`).join(", ");
    const dir = c.score >= 2 ? "cenderung BULLISH" : c.score <= -2 ? "cenderung BEARISH" : "NETRAL / campuran";
    return {
      text: `Setup ${foundRow.label}:\n\n• Bias confluence: **${c.label}** (skor ${c.score}, grade ${grade?.grade})\n• ${grade?.note}\n• Per timeframe: ${signals || "data belum cukup"}\n\n**${dir}.** Mulai cek chart & konfirmasi dengan level support/resistance sebelum eksekusi.`,
    };
  }

  if (/help|bisa apa|fitur|menu|dokumentasi/i.test(q)) {
    return {
      text: "Saya bisa bantu: (1) setup teknikal per instrumen (gold, EUR/USD, dll), (2) sentimen & risk appetite pasar, (3) jadwal rilis penting, (4) tips manajemen risiko & posisi. Coba tanya: 'Bagaimana setup EUR/USD?'",
    };
  }

  // Fallback
  return {
    text: "Saya belum paham. Coba tanya salah satu: 'Setup gold hari ini?', 'Sentimen pasar', 'Rilis penting berikutnya', atau 'Cara hitung lot'.",
  };
}

function caut() {
  return "Ingat: ini data historis/estimasi, bukan nasihat investasi.";
}
