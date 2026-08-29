// lib/glossary.js
// Glosarium istilah dalam bahasa sederhana untuk pengguna awam.
// Dipakai untuk tooltip (data-tip), bagian "Glosarium", dan panduan cepat.

export const GLOSSARY = [
  { term: "Indikator Ekonomi", def: "Data statistik yang menggambarkan kondisi ekonomi, mis. inflasi atau jumlah pekerja." },
  { term: "Konsensus (Forecast)", def: "Perkiraan nilai rilis dari para analis sebelum data resmi keluar. Dibandingkan dengan nilai aktual." },
  { term: "Aktual", def: "Nilai resmi yang benar-benar dirilis dari sebuah indikator." },
  { term: "Previous", def: "Nilai rilis sebelumnya, dipakai sebagai pembanding." },
  { term: "Surprise", def: "Selisih antara nilai Aktual dan Konsensus. Meleset jauh = kejutan besar." },
  { term: "MoM (Month-over-Month)", def: "Perbandingan nilai dengan bulan sebelumnya." },
  { term: "YoY (Year-over-Year)", def: "Perbandingan nilai dengan tahun sebelumnya." },
  { term: "Hawkish", def: "Pandangan yang cenderung menaikkan suku bunga / kebijakan ketat. Biasanya menguatkan mata uang." },
  { term: "Dovish", def: "Pandangan yang cenderung menurunkan suku bunga / kebijakan longgar. Biasanya melemahkan mata uang." },
  { term: "Bullish", def: "Sentimen naik — harga atau mata uang diperkirakan menguat." },
  { term: "Bearish", def: "Sentimen turun — harga atau mata uang diperkirakan melemah." },
  { term: "Volatilitas", def: "Seberapa besar dan cepat harga bergerak. Rilis berdaya dorong besar biasanya memicu volatilitas." },
  { term: "NFP (Nonfarm Payrolls)", def: "Laporan jumlah lapangan kerja non-pertanian AS. Salah satu rilis paling berpengaruh terhadap dolar." },
  { term: "CPI", def: "Indeks Harga Konsumen — ukuran utama inflasi dari harga barang & jasa yang dibeli konsumen." },
  { term: "PPI", def: "Indeks Harga Produsen — ukuran inflasi di tingkat produsen/awal rantai pasok." },
  { term: "FOMC", def: "Komite Federal Reserve yang memutuskan suku bunga AS. Keputusannya sangat berpengaruh ke pasar." },
  { term: "Dot Plot", def: "Proyeksi suku bunga tiap anggota FOMC, diterbitkan beberapa kali setahun." },
  { term: "Suku Bunga Acuan", def: "Biaya pinjam-meminjam antar bank — acuan utama ekonomi AS dan memengaruhi kuat mata uang." },
  { term: "Inflasi", def: "Kenaikan harga barang & jasa secara umum. Terlalu tinggi atau terlalu rendah sama-sama diperhatikan." },
  { term: "Tenaga Kerja", def: "Data ketenagakerjaan seperti jumlah pekerja, pengangguran, dan upah." },
  { term: "VIX", def: "Ukuran \"rasa takut\" pasar (indeks volatilitas). Naik = pasar cemas/bergejolak." },
  { term: "Yield (Imbal Hasil)", def: "Imbal hasil obligasi pemerintah, mis. 10 tahun. Naik sering berarti ekspektasi suku bunga/inflasi naik." },
  { term: "Pair (Pasangan Mata Uang)", def: "Pasangan mata uang yang diperdagangkan, contoh EUR/USD atau USD/JPY." },
  { term: "Magnitude (Kekuatan)", def: "Seberapa kuat sebuah rilis menggerakkan pasangan mata uang, dari lemah hingga sangat kuat." },
];

export const GLOSSARY_BY_TERM = Object.fromEntries(GLOSSARY.map((g) => [g.term.toLowerCase(), g.def]));

/** Ambil definisi singkat berdasarkan istilah (case-insensitive). */
export function defOf(term) {
  return GLOSSARY_BY_TERM[String(term || "").toLowerCase()] || null;
}
