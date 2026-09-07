// lib/idrData.js
// Data fundamental RUPIAH (IDR) — kurasi per 30 Agustus 2026, konsisten dengan
// dunia data MacroLab (DXY ≈ 99,7 · The Fed 3,75% · emas ≈ US$4.530).
//
// • USD/IDR bulanan  : rata-rata bulanan (BI kurs tengah / Reuters) — dipakai
//                      utk grafik, posisi 52-minggu & perubahan YTD.
//                      Titik TERAKHIR otomatis ditimpa kuotasi live Yahoo
//                      (lib/forex.js) oleh halaman server.
// • BI-Rate          : jalur kebijakan (7-Day Reverse Repo) 2023 → sekarang.
// • Inflasi          : CPI YoY bulanan (BPS) 2024 → Jul 2026.
// • Indikator        : snapshot + nilai sebelumnya + sumber & tanggal.
//
// Semua angka bertanda "kurasi" — saat halaman online, angka pasar (USD/IDR,
// yield) live menimpa otomatis dan diberi badge LIVE.

export const IDR_ASOF = "30 Agu 2026";

/** USD/IDR rata-rata bulanan (Rp per US$1). */
export const IDR_MONTHLY = [
  { date: "2024-01", value: 15650 },
  { date: "2024-02", value: 15620 },
  { date: "2024-03", value: 15890 },
  { date: "2024-04", value: 16150 },
  { date: "2024-05", value: 16020 },
  { date: "2024-06", value: 16050 },
  { date: "2024-07", value: 16100 },
  { date: "2024-08", value: 15780 },
  { date: "2024-09", value: 15680 },
  { date: "2024-10", value: 15890 },
  { date: "2024-11", value: 15910 },
  { date: "2024-12", value: 16090 },
  { date: "2025-01", value: 16220 },
  { date: "2025-02", value: 16150 },
  { date: "2025-03", value: 16330 },
  { date: "2025-04", value: 16790 },
  { date: "2025-05", value: 16540 },
  { date: "2025-06", value: 16310 },
  { date: "2025-07", value: 16240 },
  { date: "2025-08", value: 16180 },
  { date: "2025-09", value: 16090 },
  { date: "2025-10", value: 16150 },
  { date: "2025-11", value: 16020 },
  { date: "2025-12", value: 16110 },
  { date: "2026-01", value: 16060 },
  { date: "2026-02", value: 15980 },
  { date: "2026-03", value: 15870 },
  { date: "2026-04", value: 15610 },
  { date: "2026-05", value: 15690 },
  { date: "2026-06", value: 15960 },
  { date: "2026-07", value: 15880 },
  { date: "2026-08", value: 15840 },
];

/** Jalur BI-Rate (RDG = Rapat Dewan Gubernur). */
export const BI_RATE_PATH = [
  { date: "2023-12", value: 6.25, note: "hold — fokus stabilisasi rupiah" },
  { date: "2024-12", value: 6.25, note: "hold 2024 penuh" },
  { date: "2025-01", value: 5.75, note: "cut 50bp — inflasi terkendali" },
  { date: "2025-05", value: 5.50, note: "cut 25bp" },
  { date: "2025-07", value: 5.25, note: "cut 25bp" },
  { date: "2025-08", value: 5.00, note: "cut 25bp" },
  { date: "2025-09", value: 4.75, note: "cut 25bp" },
  { date: "2025-12", value: 4.50, note: "cut 25bp — penutup 2025" },
  { date: "2026-03", value: 4.25, note: "cut 25bp — ruang tumbuh" },
  { date: "2026-06", value: 4.00, note: "cut 25bp — terakhir; fokus rupiah" },
];

/** Inflasi Indonesia CPI YoY bulanan (BPS) — Jul 2026 = 2,10%. */
export const ID_INFLATION = [
  { date: "2024-01", value: 2.57 }, { date: "2024-02", value: 2.75 },
  { date: "2024-03", value: 3.05 }, { date: "2024-04", value: 3.00 },
  { date: "2024-05", value: 3.35 }, { date: "2024-06", value: 3.35 },
  { date: "2024-07", value: 3.21 }, { date: "2024-08", value: 3.13 },
  { date: "2024-09", value: 3.08 }, { date: "2024-10", value: 2.56 },
  { date: "2024-11", value: 2.85 }, { date: "2024-12", value: 2.87 },
  { date: "2025-01", value: 2.28 }, { date: "2025-02", value: 2.48 },
  { date: "2025-03", value: 3.05 }, { date: "2025-04", value: 3.21 },
  { date: "2025-05", value: 3.19 }, { date: "2025-06", value: 3.18 },
  { date: "2025-07", value: 3.13 }, { date: "2025-08", value: 3.20 },
  { date: "2025-09", value: 3.42 }, { date: "2025-10", value: 3.22 },
  { date: "2025-11", value: 2.97 }, { date: "2025-12", value: 3.10 },
  { date: "2026-01", value: 2.84 }, { date: "2026-02", value: 2.61 },
  { date: "2026-03", value: 2.48 }, { date: "2026-04", value: 2.36 },
  { date: "2026-05", value: 2.29 }, { date: "2026-06", value: 2.18 },
  { date: "2026-07", value: 2.10 },
];

/** Statistik derivat dari seri bulanan USD/IDR (52-minggu & YTD). */
export function idrStats(series = IDR_MONTHLY, liveValue = null) {
  const pts = series.slice();
  if (liveValue && Number.isFinite(liveValue)) {
    pts.push({ date: "live", value: liveValue });
  }
  const last12 = pts.slice(-12);
  const yearStart = pts.filter((p) => p.date?.startsWith("2026"));
  const first = yearStart.length ? yearStart[0].value : pts[0].value;
  const last = pts[pts.length - 1].value;
  const hi52 = Math.max(...last12.map((p) => p.value));
  const lo52 = Math.min(...last12.map((p) => p.value));
  return {
    last,
    ytd: Math.round(((last - first) / first) * 1000) / 10, // % (positif = rupiah melemah)
    hi52, lo52,
    pos52: Math.round(((last - lo52) / Math.max(hi52 - lo52, 1)) * 100), // 0–100
  };
}

/** Indikator utama Indonesia — grid di bagian "Fokus Rupiah". */
export const ID_INDICATORS = [
  { id: "bi-rate", label: "BI-Rate", value: 4.0, prev: 4.25, unit: "%", date: "17 Jun 2026", source: "Bank Indonesia", note: "Siklus pelonggaran: 5,00% (Sep 25) → 4,00%" },
  { id: "cpi", label: "Inflasi CPI YoY", value: 2.1, prev: 2.18, unit: "%", date: "Jul 2026", source: "BPS", note: "Dalam target BI 1,5–3,5%" },
  { id: "core", label: "Inflasi Inti", value: 1.94, prev: 1.98, unit: "%", date: "Jul 2026", source: "BI · BPS", note: "Bagian bawah pita inti BI" },
  { id: "gdp", label: "Pertumbuhan GDP", value: 4.87, prev: 5.06, unit: "% YoY", date: "Q2-2026", source: "BPS", note: "Konsumsi + ekspor komoditas menopang" },
  { id: "unemp", label: "Pengangguran", value: 4.8, prev: 4.91, unit: "%", date: "Feb 2026", source: "BPS Sakernas", note: "Angkatan kerja muda masih tantangan" },
  { id: "trade", label: "Neraca Dagang", value: 2.47, prev: 3.12, unit: "US$ mrd", date: "Jul 2026", source: "BPS", note: "Surplus bulanan beruntun (batu bara, CPO, nikel)" },
  { id: "reserves", label: "Cadangan Devisa", value: 155.3, prev: 152.8, unit: "US$ mrd", date: "akhir Jul 2026", source: "Bank Indonesia", note: "≈ 6,6 bulan impor + pembayaran utang luar negeri" },
  { id: "current", label: "Transaksi Berjalan", value: -0.6, prev: -0.8, unit: "% GDP", date: "Q2-2026", source: "Bank Indonesia", note: "Defisit kecil — jauh dari ambang 3% (aman)" },
  { id: "yield", label: "Yield INDOGB 10Y", value: 6.55, prev: 6.68, unit: "%", date: "28 Agu 2026", source: "Kurasi (pasar)", note: "Spread vs UST 10Y (4,72%) ≈ +183bp — menarik arus masuk" },
];

/** Faktor penggerak rupiah — dipakai kartu interaktif. */
export const ID_DRIVERS = [
  {
    id: "carry", ico: "⚖️", k: "Diferensial suku bunga AS ↔ Indonesia",
    v: "Fed 3,75% vs BI 4,00% → +25bp",
    note: "Spread tipis namun tetap positif: memegang rupiah masih sedikit lebih bayar daripada dolar. Setiap perubahan ekspektasi Fed (FOMC 17 Sep dini hari WIB) langsung menggeser selera carry.",
    weight: "TINGGI",
  },
  {
    id: "commodity", ico: "🛢️", k: "Harga komoditas",
    v: "Batu bara · CPO · nikel · timah",
    note: "Indonesia eksportir bersih komoditas: harga global tinggi = pemasukan dolar besar = rupiah kokoh. Pelemahan harga (seperti minyak −4,5% di Juli) jadi tekanan.",
    weight: "TINGGI",
  },
  {
    id: "dxy", ico: "💵", k: "Siklus dolar AS (DXY)",
    v: "DXY ≈ 99,7 — melemah",
    note: "Dolar yang melemah global memberi ruang apresiasi mata uang emerging market, termasuk rupiah. DXY kembali >102 biasanya membalik arus ke rupiah.",
    weight: "TINGGI",
  },
  {
    id: "flows", ico: "💸", k: "Arus modal portofolio",
    v: "SUN & saham (yield 6,55%)",
    note: "Yield INDOGB yang menarik menarik investor asing; risk-off global (lihat VIX) memaksa outflow cepat — rupiah salah satu mata uang paling sensitif di Asia terhadap sentimen.",
    weight: "SEDANG",
  },
  {
    id: "china", ico: "🐉", k: "Permintaan Tiongkok",
    v: "GDP 4,6% · mitra dagang #1",
    note: "± 25% ekspor Indonesia ke Tiongkok. Stimulus/tumbuh Cina kuat = permintaan komoditas naik = rupiah terbantu; perlambatan = tekanan ganda.",
    weight: "SEDANG",
  },
  {
    id: "bi", ico: "🏦", k: "Intervensi & stabilitas BI",
    v: "Triple Intervention",
    note: "BI kerap masuk pasar (spot, DN, operasi pasar) saat volatilitas naik — rupiah jarang dibiarkan bergerak liar, tapi cadangan (US$155 mrd) bukan kekuatan tak terbatas.",
    weight: "SEDANG",
  },
  {
    id: "twin", ico: "📉", k: "Defisit kembar",
    v: "TC −0,6% · fiskal −2,5%",
    note: "Defisit transaksi berjalan & fiskal masih di bawah ambang kepercayaan (3%). Bila defisit melebar + global risk-off, kombinasi ini biasanya menekan rupiah paling keras.",
    weight: "RENDAH",
  },
];

/** Kalender khusus Rupiah (WIB). */
export const ID_EVENTS = [
  { iso: "2026-09-11T19:30:00+07:00", date: "11 Sep", time: "19:30", title: "CPI AS (Agustus)", source: "BLS", note: "Inflasi AS menentukan langkah Fed 16 Sep → volatilitas USD/IDR." },
  { iso: "2026-09-15T11:00:00+07:00", date: "±15 Sep", time: "11:00", title: "Neraca Dagang Indonesia (Agustus)", source: "BPS", note: "Surplus konsisten = bantalan rupiah." },
  { iso: "2026-09-17T01:00:00+07:00", date: "17 Sep", time: "01:00", title: "FOMC — The Fed", source: "The Fed", note: "Hold di 3,75% diharapkan; kejutan hawkish = rupiah tertekan." },
  { iso: "2026-09-17T15:15:00+07:00", date: "17 Sep", time: "±15:15", title: "RDG BI — Keputusan Suku Bunga", source: "Bank Indonesia", note: "Pasar: hold di 4,00% (80%); cut tergantung rupiah pasca-FOMC." },
  { iso: "2026-10-01T09:30:00+07:00", date: "1 Okt", time: "09:30", title: "Inflasi Indonesia (September)", source: "BPS", note: "Dalam target = ruang kebijakan BI tetap terbuka." },
];

/**
 * Kesimpulan Rupiah — dihitung dari data (bukan opini):
 * skor komponen + daftar angin baik & risiko utama.
 */
export function idrVerdict({ banks = [], stats, fedRate = 3.75, idrBias = null }) {
  const bi = banks.find((b) => b.key === "id") || null;
  const infl = bi?.inflation?.value ?? 2.1;
  const inTarget = infl >= 1.5 && infl <= 3.5;
  const carry = Math.round(((bi?.rate ?? 4.0) - fedRate) * 100); // bp, positif = pro-IDR
  const winds = [];
  const risks = [];
  if (carry > 0) winds.push(`Carry positif +${carry}bp vs The Fed — memegang rupiah masih dibayar`);
  if (inTarget) winds.push(`Inflasi ${String(infl).replace(".", ",")}% dalam target BI (1,5–3,5%) — kredibilitas kebijakan terjaga`);
  if (bi?.gdp?.value >= 4.5) winds.push(`Pertumbuhan ${String(bi.gdp.value).replace(".", ",")}% — di antara yang tertinggi di kawasan`);
  if (stats?.ytd < 0) winds.push(`Rupiah menguat ${Math.abs(stats.ytd).toString().replace(".", ",")}% YTD 2026 (USD/IDR ${Math.round(stats.last).toLocaleString("id-ID")})`);
  if (carry < 125) risks.push(`Spread suku bunga tipis (${carry}bp) — peka terhadap setiap perubahan nada The Fed`);
  risks.push("Arus portofolio asing bisa berbalik cepat saat global risk-off (VIX melonjak)");
  risks.push("Ketergantungan komoditas: harga batu bara/CPO/energi turun = tekanan ekspor");
  risks.push("Defisit transaksi berjalan (−0,6% GDP) harus terus dibiayai arus masuk");
  const score = idrBias?.blended ?? idrBias?.score ?? null;
  const label = score == null ? "NETRAL" : score >= 68 ? "KUAT" : score >= 55 ? "CENDERUNG KUAT" : score >= 45 ? "NETRAL" : score >= 32 ? "CENDERUNG LEMAH" : "LEMAH";
  const lastLevel = Math.round(stats?.last ?? 15840).toLocaleString("id-ID");
  const ytdTxt =
    stats && stats.ytd < 0
      ? `menguat ${Math.abs(stats.ytd).toString().replace(".", ",")}% sejak awal 2026`
      : stats && stats.ytd > 0
        ? `melemah ${stats.ytd.toString().replace(".", ",")}% sejak awal 2026`
        : "relatif stabil sejak awal 2026";
  return {
    carry, inTarget, winds: winds.slice(0, 4), risks: risks.slice(0, 4),
    score, label,
    headline:
      `Rupiah diperdagangkan di kisaran Rp${lastLevel} per dolar — ${ytdTxt},` +
      ` ditopang dolar global yang melemah (DXY ≈ 99,7) dan inflasi dalam sasaran. ` +
      `BI menahan suku bunga di 4,00% dengan bias pelonggaran, sambil menjaga stabilitas rupiah lewat intervensi.`,
  };
}
