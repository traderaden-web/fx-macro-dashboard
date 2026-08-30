// lib/education.js
// Konten edukasi: cara membaca tiap indikator, faktor penggerak (detail +
// data riil + sumber resmi), skenario pasar, prospek ke depan, dan
// perspektif pakar analis global.
// Data riil per 30 Agustus 2026 (BLS, FRED, ONS, Eurostat/ECB, Treasury, EIA,
// BEA, Reuters, TradingEconomics).

export const GENERAL = {
  title: "Cara Membaca Data Ekonomi untuk Trading Forex",
  intro:
    "Data makro adalah 'laporan kesehatan' sebuah ekonomi. Pasar forex bereaksi bukan pada angka itu sendiri, melainkan pada selisih antara angka aktual dengan yang diprediksi analis (konsensus). Semakin besar selisihnya (surprise), semakin besar pula pergerakan harga.",
  points: [
    "Consensus = perkiraan analis sebelum rilis. Jika tidak ada, pasar menjadikan nilai sebelumnya (Previous) sebagai acuan.",
    "Actual = angka yang benar-benar dirilis, biasanya pada jam yang sudah terjadwal.",
    "Surprise = Actual − Consensus. Positif berarti data lebih baik dari dugaan; negatif berarti lebih buruk.",
    "Yang menggerakkan harga adalah PERUBAHAN ekspektasi. Data bagus tapi di bawah ekspektasi tetap bisa membuat mata uang turun.",
    "Perhatikan juga revisi data sebelumnya dan rilis lanjutan (mis. Core CPI) karena sering kali lebih penting.",
    "Fokus pada dampak: High/Medium/Low, dan pada jam rilis (biasanya 13:30 atau 19:30 WIB).",
  ],
  tips: [
    "Jangan trading 5 menit pertama saat rilis High impact — spread & lonjakan volatilitas ekstrem.",
    "Bandingkan indikator satu negara dengan negara lawan pair (mis. EURUSD: data AS vs data Euro).",
    "Kombinasikan dengan arah tren & sentimen pasar, jangan hanya satu data.",
  ],
  expertNote:
    "Berikut perspektif dari berbagai 'desk' analis global (pandangan ilustratif untuk pembelajaran). Setiap desk memiliki cara baca berbeda — bandingkan untuk membentuk gambaran menyeluruh.",
};

// Sumber resmi (stabil) — dipakai lintas indikator
const SRC = {
  blsJobs: { label: "BLS — Employment Situation (resmi)", url: "https://www.bls.gov/employment-situation/" },
  adp: { label: "ADP Research — National Employment (resmi)", url: "https://adpemploymentreport.com/" },
  blsCpi: { label: "BLS — Consumer Price Index (resmi)", url: "https://www.bls.gov/cpi/" },
  blsPpi: { label: "BLS — Producer Price Index (resmi)", url: "https://www.bls.gov/ppi/" },
  blsClaims: { label: "BLS — Jobless Claims (resmi)", url: "https://www.bls.gov/web/ews/ews.pdf" },
  beaPce: { label: "BEA — Personal Consumption Expenditures (resmi)", url: "https://www.bea.gov/data/personal-consumption-expenditures" },
  beaGdp: { label: "BEA — GDP (resmi)", url: "https://www.bea.gov/data/gdp/gross-domestic-product" },
  fed: { label: "The Fed — FOMC (resmi)", url: "https://www.federalreserve.gov/monetarypolicy/openmarket.htm" },
  fedG17: { label: "The Fed — G.17 Industrial Production (resmi)", url: "https://www.federalreserve.gov/releases/g17/" },
  treasury: { label: "U.S. Treasury — Interest Rates (resmi)", url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates" },
  fred: { label: "FRED — St. Louis Fed (resmi)", url: "https://fred.stlouisfed.org/" },
  census: { label: "U.S. Census Bureau — Retail (resmi)", url: "https://www.census.gov/retail/index.html" },
  umich: { label: "University of Michigan — Sentiment (resmi)", url: "https://www.sca.isr.umich.edu/sentiment/" },
  ism: { label: "ISM — PMI Manufaktur & Jasa (resmi)", url: "https://www.ismworld.org/supply-management-news-events/reports-studies/mmi/" },
  eurostat: { label: "Eurostat — Labour & HICP (resmi)", url: "https://ec.europa.eu/eurostat/web/products-euro-indicators/overview-1" },
  ecb: { label: "ECB — Keputuan & Proyeksi (resmi)", url: "https://www.ecb.europa.eu/press/prt/html/index.en.html" },
  onsCpi: { label: "ONS UK — CPI (resmi)", url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandunemployment/bulletins/consumerpriceinflation/latest" },
  onsJobs: { label: "ONS UK — Labour Market (resmi)", url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandunemployment/bulletins/uklabourmarket/latest" },
  mofJp: { label: "Jepang — Kabinet Keuangan/MOF (resmi)", url: "https://www.mof.go.jp/mofj/en/index.htm" },
  nbsCn: { label: "NBS Tiongkok — CPI (resmi)", url: "https://www.stats.gov.cn/english/" },
  eiaOil: { label: "EIA — Petroleum (resmi)", url: "https://www.eia.gov/petroleum/" },
  eiaGas: { label: "EIA — Natural Gas (resmi)", url: "https://www.eia.gov/naturalgas/" },
  lmeCopper: { label: "LME — Copper (resmi)", url: "https://www.lme.com/market-data/metals/non-ferrous/copper" },
  cboeVix: { label: "CBOE — VIX (resmi)", url: "https://www.cboe.com/tradable_products/vix/" },
};

export const EDUCATION = {
  nfp: {
    read: [
      "Nonfarm Payrolls = jumlah lapangan kerja baru per bulan (di luar sektor pertanian).",
      "Baca perubahannya dalam ribuan, bandingkan dengan konsensus — bukan angkanya saja.",
      "Dirilis Jumat pertama tiap bulan, 08:30 ET (13:30/19:30 WIB).",
      "Selalu baca tiga angka sekaligus: NFP, Unemployment Rate, dan Average Hourly Earnings (AHE).",
      "Perhatikan revisi 2 bulan sebelumnya — sering lebih penting daripada headline.",
    ],
    drivers: [
      { name: "Permintaan tenaga kerja (hiring)", detail: "Indikasi seberapa kuat bisnis menambah karyawan. Pertambahan besar = ekonomi tumbuh, mendukung USD. Penambahan kecil/mundur = perlambatan. Pola 'low-hire, low-fire' (hiring rendah tapi PHK juga rendah) berarti pasar kerja stabil tapi tidak panas.", data: "Juli 2026: −23 ribu (konsensus +85 ribu) — kejutan negatif besar; Juni direvisi turun dari 57 ke 20 ribu (diterbitkan 7 Agu). Rantai revisi ke bawah: Apr 115→2 ribu (1.99K), Mei 172→129, Jun 57→20; Feb-26: −133 ribu.", src: SRC.blsJobs },
      { name: "Kontribusi sektor (pemerintah, jasa, konstruksi)", detail: "Terpecah per sektor. Sektor jasa (mall, restoran, kesehatan) besar dan sensitif konsumsi; sektor pemerintah bisa berubah drastis (pemotongan/pemindahan jadwal rekrutmen) sehingga memicu revisi.", data: "Juli 2026: Pemerintah −53 ribu (terbesar, sebagian kemungkinan revisi musiman), Leisure & Hospitality −40 ribu; Construction & Private Education/Health terbesar penambahnya.", src: SRC.blsJobs },
      { name: "Revisi bulan sebelumnya", detail: "Angka dua bulan lalu sering direvisi setelah survei diperluas. Revisi besar ke bawah melemahkan narasi pasar kerja meski headline bulan berjalan terlihat baik.", data: "Juni 2026 direvisi turun 57 → 20 ribu pada rilis 7 Agu; Mei dirilis 172 ribu (5 Jun) lalu direvisi turun ke 129 ribu; April 115→2 ribu (1.99K) — revisi terbesar. 28 Agu: revisi benchmark tahunan BLS −79 ribu (2025: −911 ribu) — level payroll terus direvisi ke bawah.", src: SRC.blsJobs },
      { name: "Tingkat partisipasi angkatan kerja", detail: "Unemployment bisa turun bukan karena makin banyak yang bekerja, tapi karena orang keluar dari angkatan kerja. Partisipasi rendah + unemp 'turun' = sinyal lebih lemah daripada yang terlihat.", data: "Partisipasi Juli 2026: 61,4% — dekat level terendah ~5,5 tahun (264 ribu orang keluar angkatan kerja).", src: SRC.blsJobs },
      { name: "Siklus ekonomi & suku bunga", detail: "Suku bunga tinggi menekan biaya pinjaman bisnis → hiring melambat. Dengan The Fed di 3,50–3,75% dan wacana kenaikan kembali, biaya kredit tetap menjadi rem utama ekspansi ketenagakerjaan.", data: "Fed Funds 3,50–3,75% sejak Des 2025; Ketua The Fed Kevin Warsh (sejak Mei 2026) menegaskan inflasi 'belum melambat cukup'.", src: SRC.fed },
    ],
    expertViews: [
      { desk: "FX Strategist (London)", view: "NFP adalah 'pengguncang utama' dolar. Fokus pada headline tapi yang lebih penting adalah bagian upah (AHE) — karena itu yang menentukan jalur suku bunga The Fed berikutnya.", signal: "USD kuat jika NFP > konsensus DAN AHE naik." },
      { desk: "Head of Global Macro (New York)", view: "Pasar kerja yang terlalu panas justru jadi masalah: The Fed harus mempertahankan suku bunga tinggi lebih lama. Ingin melihat 'goldilocks' — cukup besar, tidak terlalu panas.", signal: "NFP besar + AHE sedang = risk-on." },
      { desk: "Quant / Options Desk", view: "Rilis NFP biasanya memicu lonjakan volatilitas (implied vol naik dulu). Implied move bisa 30–60 pips pada EURUSD saat rilis.", signal: "Vol spiking; hindari straddle murah." },
      { desk: "Emerging Markets Macro", view: "NFP kuat = dolar menguat = tekanan pada mata uang berkembang & emas. Pasar forex berkembang sangat sensitif terhadap arah NFP.", signal: "NFP kuat = emas & USD/EM down." },
    ],
    outlook:
      "Gambaran per Agustus 2026: pasar kerja AS sedang 'mendingin tapi belum retak' — NFP Juli negatif (−23 ribu) dengan revisi besar ke bawah, sementara pengangguran justru turun ke 4,1% karena partisipasi merosot ke 61,4%. Selama inflasi masih di 3,4% (di atas target 2%), The Fed terjepit: data kerja lemah mengurangi tekanan menaikkan bunga di rapat September 2026, tetapi CPI yang panas bisa membatalkan efeknya. Ekspektasi konsensus pasar kini condong ke 'the Fed on hold dengan ekor hawkish' — artinya USD cenderung tetap terdukung, tetapi risiko downside (jika unemp melonjak di atas ~4,5% seperti perkiraan Citi) akan memicu ekspektasi pemangkasan cepat dan tekanan jual USD di paruh kedua 2026.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Pasar kerja lebih kuat → ekspektasi Fed hawkish bertahan → USD naik tajam, emas tertekan.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Reaksi terbatas; pasar fokus ke komponen AHE & revisi bulan lalu.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Risiko resesi naik → ekspektasi pemangkasan The Fed menguat → USD turun, aset aman naik.", dir: "down", cur: "USD" },
    ],
    watch: ["Average Hourly Earnings", "Unemployment Rate", "Partisipasi angkatan kerja", "Keputusan FOMC September 2026"],
  },
  unemp: {
    read: [
      "Persentase angkatan kerja yang menganggur (ukuran U-3).",
      "Dirilis bersamaan dengan NFP, Jumat pertama tiap bulan.",
      "Turun = pasar kerja ketat; naik = melonggar — tapi cek partisipasi dulu.",
      "Pergerakan 0,1 poin saja bisa berarti ratusan ribu orang; baca arah 3–6 bulan.",
    ],
    drivers: [
      { name: "Kesehatan pasar tenaga kerja", detail: "Tingkat pengangguran rendah menandakan bisnis kekurangan pekerja — menciptakan tekanan pada upah & inflasi, dan memberi The Fed alasan menahan suku bunga tinggi.", data: "Juli 2026: 4,1% (Juni 4,2%; konsensus 4,2%) — turun, namun karena 264 ribu orang keluar angkatan kerja, bukan karena hiring membaik.", src: SRC.blsJobs },
      { name: "Kebijakan moneter The Fed", detail: "The Fed memegang 'dual mandate' — inflasi & lapangan kerja. Pengangguran adalah penentu langsung jalur suku bunga: tinggi → ruang memotong; sangat rendah + inflasi tinggi → risiko menaikkan.", data: "Konsensus pasar: The Fed 'on hold' di 3,50–3,75% dengan risiko dua arah; Citi memproyeksikan unemp menembus 4,5% dalam beberapa bulan → kembali membuka wacana cut.", src: SRC.fed },
      { name: "Partisipasi angkatan kerja", detail: "Pengangguran turun bisa karena orang berhenti mencari kerja (keluar angkatan kerja), bukan karena mendapat pekerjaan. Selalu baca berpasangan.", data: "Partisipasi 61,4% (Juli 2026) — dekat level terendah sekitar 5,5 tahun.", src: SRC.blsJobs },
      { name: "Siklus bisnis", detail: "Fase ekspansi menurunkan pengangguran; resesi menaikannya. Data ini indikator lagging (terlambat) — biasanya baru naik setelah resesi berjalan beberapa bulan.", src: SRC.fred },
    ],
    expertViews: [
      { desk: "Riset Makro (Frankfurt)", view: "Pengangguran rendah tapi inflasi juga turun = kondisi ideal bank sentral mulai melonggarkan. Kombinasi inilah yang dicari pasar.", signal: "Unemp rendah + CPI turun = dovish-friendly." },
      { desk: "Bank Strategist (Tokyo)", view: "Untuk USD semua bergantung pada relasi dengan inflasi. Pengangguran yang terlalu rendah justru berisiko memicu inflasi upah dan membuat The Fed hawkish.", signal: "Waspadai unemp terlalu rendah." },
      { desk: "Economist – Fixed Income", view: "Kurva imbal hasil bergerak berdasarkan ekspektasi suku bunga yang dipengaruhi pengangguran. Pengangguran naik = obligasi diborong (yield turun).", signal: "Unemp naik = bonds rally." },
    ],
    outlook:
      "Per Agustus 2026, pengangguran AS 4,1% terlihat 'aman', tetapi strukturnya rapuh: penurunan terjadi di tengah partisipasi yang mendekati level terendah 5,5 tahun (61,4%), artinya banyak yang keluar dari angkatan kerja. Jika tren 'low-hire, low-fire' berlanjut dan partisipasi pulih, unemp berisiko naik cepat — Citi bahkan memperkirakan menembus 4,5% dalam beberapa bulan, yang akan menggeser pasar ke mode 'the Fed harus memotong'. Sebaliknya, selama unemp bertahan di bawah 4,5% dengan inflasi 3,4% yang masih lengket, The Fed (di bawah Ketua Kevin Warsh) cenderung tetap was-was hawkish. Arah USD: terdukung selama unemp stabil; rawan koreksi signifikan jika dua rilis berturut-turut di atas ekspektasi.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Pasar kerja melemah → ekspektasi pemangkasan Fed menguat → USD turun.", dir: "down", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral; pasar beralih ke data inflasi bulan yang sama.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Pasar kerja ketat → The Fed bisa tetap ketat/menaikkan → USD naik.", dir: "up", cur: "USD" },
    ],
    watch: ["Jobless Claims mingguan", "Partisipasi angkatan kerja", "Keputusan FOMC", "Laju inflasi (CPI)"],
  },
  cpi: {
    read: [
      "Perubahan harga barang & jasa yang dibeli konsumen, dibanding setahun lalu (YoY).",
      "Indikator inflasi utama yang menjadi target The Fed (2%).",
      "Perhatikan juga Core CPI yang menghapus makanan & energi — itu yang dibaca The Fed.",
      "Bandingkan actual vs konsensus vs previous; lihat juga komponen energi & shelter.",
    ],
    drivers: [
      { name: "Harga energi & pangan", detail: "Bensin & bahan pangan sangat volatil dan mendominasi headline CPI. Lonjakan harga minyak (mis. konflik di Timur Tengah) bisa menaikkan inflasi beberapa titik dalam 2–3 bulan, lalu mereda kembali.", data: "Juli 2026: CPI 3,4% YoY (Juni 3,5%) — melandai; inflasi energi 14,7% masih menjadi beban utama akibat guncangan harga minyak.", src: SRC.blsCpi },
      { name: "Biaya produksi (PPI) & rantai pasok", detail: "Kenaikan harga produsen biasanya terbawa ke harga konsumen beberapa bulan kemudian. PPI adalah 'cermin depan' CPI.", data: "PPI Juli 2026: 4,7% YoY (turun dari 5,5% di Juni) — sinyal tekanan produksi mereda.", src: SRC.blsPpi },
      { name: "Kenaikan upah (AHE)", detail: "Upah yang naik mendorong daya beli dan biaya tenaga kerja — sumber inflasi berkelanjutan (khususnya inflasi jasa/shelter).", data: "Upah rata-rata per jam dipantau dalam rilis Employment Situation bulanan (BLS).", src: SRC.blsJobs },
      { name: "Permintaan konsumen & dolar", detail: "Belanja yang kuat mendorong produsen menaikkan harga. Dolar yang lemah membuat barang impor lebih mahal, menaikkan inflasi secara langsung.", src: SRC.blsCpi },
    ],
    expertViews: [
      { desk: "Head of Inflation Research (London)", view: "Headline CPI sering 'dimanipulasi' oleh energi. Analis serius lebih mengandalkan Core CPI untuk membaca tren sebenarnya.", signal: "Fokus ke Core, bukan headline." },
      { desk: "FX Desk (New York)", view: "CPI tinggi = The Fed hawkish = USD bullish, terutama terhadap JPY & EUR. Ini rilis paling dolar-sensitif selain NFP.", signal: "CPI > ekspektasi = USD up." },
      { desk: "Rates Strategist", view: "Yield obligasi bergerak mendahului CPI karena pasar sudah 'memprediksi'. Jika CPI selaras, reaksi kecil; jika meleset, reaksi besar.", signal: "Implied move sudah dipricingin." },
      { desk: "EM Strategist", view: "Inflasi AS yang tinggi menekan aset berisiko & emas, mendukung dolar. EM biasa merasakan tekanan saat inflasi AS memanas.", signal: "CPI tinggi = EM & gold pressure." },
    ],
    outlook:
      "Inflasi AS per Juli 2026 berada di 3,4% (headline) dan 2,5% (core) — turun berturut-turut namun masih jauh di atas target 2%. Efek guncangan energi dari konflik Timur Tengah perlahan memudar, sehingga tren headline diperkirakan lanjut melandai menuju ~3,0% pada paruh kedua 2026. Inti pertanyaannya adalah core: selama core turun konsisten (2,5% dan turun), pasar akan kembali memperkirakan pemangkasan The Fed di 2027, meski The Fed (Ketua Warsh) menegaskan 2% adalah 'commitment'. Risiko upside: jika core kembali naik ke atas 2,7% (mis. upah atau sewa memanas), ekspektasi balik ke 'higher for longer' bahkan kenaikan. Implikasi USD: tren inflasi turun = perlahan bearish USD; kejutan naik = spike hawkish.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Inflasi lebih lengket → The Fed hawkish → USD & yield naik, emas turun.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Reaksi kecil; pasar fokus ke komponen core & shelter.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Inflasi melandai → ruang pelonggaran meluas → USD turun.", dir: "down", cur: "USD" },
    ],
    watch: ["Core CPI", "PPI", "Jadwal FOMC", "Harga minyak (WTI/Brent)"],
  },
  corecpi: {
    read: [
      "CPI tanpa makanan & energi — lebih stabil dan jadi acuan kebijakan.",
      "Dipelototi lebih serius daripada headline CPI oleh The Fed & pasar.",
      "Komponen terbesar: shelter (sewa & perumahan) dan jasa.",
      "Tren 3–6 bulan lebih penting daripada satu bulan (karakternya 'lengket').",
    ],
    drivers: [
      { name: "Harga sewa & perumahan (shelter)", detail: "Komponen terbesar Core CPI. Sewa turun sangat lambat karena kontrak & lag statistik — ini penyebab utama inflasi inti sulit turun cepat.", data: "Juli 2026: Core CPI 2,5% YoY — terendah 5 bulan; shelter +3,2% (turun dari 3,3%).", src: SRC.blsCpi },
      { name: "Biaya layanan (services)", detail: "Kategori layanan (kesehatan, transportasi, rekreasi) sensitif terhadap upah & permintaan — inflasi jasa Juli 2026: 3,1%.", src: SRC.blsCpi },
      { name: "Kenaikan upah", detail: "Upah naik → biaya layanan naik → Core CPI naik. Inilah alasan Core 'sticky'.", src: SRC.blsJobs },
      { name: "Harga barang inti (goods ex food/energy)", detail: "Barang seperti kendaraan, perabot, pakaian. Lebih dipengaruhi rantai pasok, dolar, dan tarif impor.", src: SRC.blsCpi },
    ],
    expertViews: [
      { desk: "Head of Global Macro", view: "Core CPI adalah 'sinyal kebijakan' sebenarnya. Jika core turun konsisten, The Fed punya ruang memotong suku bunga.", signal: "Core turun = dovish signal." },
      { desk: "Economist (EU desk)", view: "Perbedaan core CPI AS (2,5%) vs Zona Euro (2,5%) menjelaskan arah divergensi kebijakan Fed–ECB — perbandingan ini penting untuk EURUSD.", signal: "Core AS > Core EZ = USD kuat." },
    ],
    outlook:
      "Core CPI AS baru saja turun ke 2,5% (Juli 2026), level terendah dalam 5 bulan — sinyal bahwa tekanan inflasi inti mulai kehilangan momentum, terutama karena shelter mendingin (3,2%). Jika tren ini berlanjut 2–3 bulan (menuju ~2,2–2,3% pada akhir 2026), pasar akan secara agresif memperbesar peluang pemangkasan The Fed di 2027 dan USD akan tertekan secara bertahap. Namun dua risiko bisa memutus tren: (1) upah jasa yang kembali naik di atas 3,5% YoY, dan (2) dampak lanjutan tarif/impor ke harga barang inti. Selama core di kisaran 2,4–2,7%, The Fed akan memilih 'on hold' — zona netral bagi USD.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Inflasi inti lengket → suku bunga tinggi lebih lama → USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral; konfirmasi tren.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Disinflasi dipercepat → ekspektasi cut menguat → USD turun.", dir: "down", cur: "USD" },
    ],
    watch: ["Sewa & perumahan (shelter)", "Data upah (AHE)", "Ekspektasi pasar atas suku bunga (CME FedWatch)"],
  },
  ppi: {
    read: [
      "Perubahan harga di tingkat produsen (huluan), YoY.",
      "Pendahulu CPI — karena biaya produsen biasanya terbawa ke harga konsumen 1–3 bulan kemudian.",
      "Lihat PPI core (ex food, energy, trade) untuk tren sebenarnya.",
    ],
    drivers: [
      { name: "Harga bahan baku & komoditas", detail: "Minyak, logam, hasil pertanian menentukan biaya input pabrik. Lonjakan tembaga atau minyak langsung terasa di PPI.", data: "PPI Juli 2026: 4,7% YoY, turun dari 5,5% Juni — didorong mendinginnya harga energi.", src: SRC.blsPpi },
      { name: "Biaya energi", detail: "Biaya listrik & bahan bakar memengaruhi hampir semua proses produksi; PPI energi sangat volatil mengikuti minyak.", src: SRC.blsPpi },
      { name: "Logistik & transportasi", detail: "Ongkos pengiriman & biaya rantai pasok langsung membebani harga jual produsen.", src: SRC.blsPpi },
      { name: "Upah & biaya buruh", detail: "Kenaikan upah pabrik menjadi biaya produksi yang akhirnya bisa terbawa ke harga konsumen.", src: SRC.blsJobs },
    ],
    expertViews: [
      { desk: "Riset Makro", view: "PPI adalah 'petunjuk awal' CPI. Jika PPI naik, pasar mengantisipasi CPI juga naik beberapa bulan kemudian.", signal: "PPI naik = CPI akan naik." },
      { desk: "Commodity Strategist", view: "PPI sangat dipengaruhi harga minyak & logam. Analis memisahkan komponen energi untuk melihat tren inti.", signal: "Pantau PPI core (ex energy)." },
    ],
    outlook:
      "PPI turun ke 4,7% (Juli 2026) dari 5,5% — indikasi kuat bahwa tekanan biaya di hulu sedang mereda, terutama setelah harga energi stabil. Jika PPI core ikut turun di Agustus–September, maka CPI September 2026 berpeluang lanjut melandai di bawah 3,0%, yang akan memperkuat narasi 'disinflasi' dan melemahkan USD secara bertahap. Sebaliknya, kenaikan kembali harga minyak (risk geopolitik Timur Tengah) atau tembaga (risk China) bisa membalikkan arah PPI dalam 1–2 bulan.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Tekanan inflasi hulu masih panas → USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Biaya produksi mendingin → USD turun.", dir: "down", cur: "USD" },
    ],
    watch: ["CPI bulan berikutnya", "Harga komoditas (minyak, tembaga)", "Indeks harga impor"],
  },
  corepce: {
    read: [
      "Indeks harga pengeluaran konsumsi pribadi inti (tanpa makanan & energi), bulanan (m/m).",
      "Ukuran inflasi yang paling diperhatikan The Fed untuk kebijakan suku bunga.",
      "Dirilis akhir bulan bersamaan dengan GDP final, 08:30 ET.",
    ],
    drivers: [
      { name: "Harga jasa (services)", detail: "Komponen jasa yang bersifat lengket (sticky) adalah penyumbang utama tren inflasi inti.", src: SRC.beaPce },
      { name: "Harga barang inti", detail: "Barang non-makanan/non-energi seperti perumahan, transportasi, & perawatan kesehatan.", src: SRC.beaPce },
      { name: "Upah & tenaga kerja", detail: "Kenaikan upah yang cepat terbawa ke harga jasa — inti dari tekanan inflasi inti.", src: SRC.blsJobs },
      { name: "Keputusan The Fed", detail: "Core PCE adalah input langsung ke dot plot & proyeksi SEP; menyimpang dari 2% berarti The Fed harus memberi alasan.", data: "Target resmi The Fed: 2% YoY. The Fed (Ketua Warsh) menegaskan komitmen 2% di pidato Mei 2026.", src: SRC.fed },
    ],
    expertViews: [
      { desk: "Fed Watch", view: "PCE inti adalah target resmi The Fed (2%). Jika naik, The Fed menahan suku bunga lebih lama; jika turun, membuka jalan pemangkasan.", signal: "Core PCE naik = USD up." },
      { desk: "Rates Strategist", view: "Perbedaan PCE vs CPI sering kecil, tapi The Fed lebih mengandalkan PCE karena mencakup struktur pengeluaran riil konsumen.", signal: "Fokus ke PCE, bukan CPI." },
    ],
    outlook:
      "Juli 2026 (rilis 26 Agu): 0,2% (konsensus 0,2%; Juni 0,1%) — sesuai konsensus, tren inflasi inti tetap jinak. Dengan CPI inti di 2,5% (Juli 2026), Core PCE (yang umumnya sedikit di bawah CPI core) diperkirakan bergerak di kisaran ~0,2% per bulan (±2,4% YoY) di kuartal III 2026. Ini zona 'cukup baik tapi belum target': cukup untuk mempertahankan The Fed on hold, namun belum cukup untuk memulai pemangkasan. Titik putar penting: jika Core PCE bulanan turun ke ≤0,15% dua bulan beruntun, pasar akan mulai mem-price cut pada paruh pertama 2027 (bearish USD); jika ≥0,30% (mis. jasa & kesehatan memanas), skenario 'higher for longer' bahkan kenaikan kembali akan menguat (bullish USD).",
    scenarios: [
      { label: "Di atas konsensus", effect: "Inflasi inti masih panas → USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral; fokus ke pidato The Fed.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Ruang pelonggaran → USD turun.", dir: "down", cur: "USD" },
    ],
    watch: ["CPI", "Upah rata-rata (AHE)", "Komponen jasa", "Keputusan FOMC"],
  },
  adp: {
    read: [
      "Perubahan pekerjaan di sektor swasta (ADP Research), bulanan, dalam ribuan.",
      "Dirilis Selasa — dua hari kerja sebelum NFP resmi BLS — sebagai 'pemanasan' data ketenagakerjaan.",
      "Korelasinya dengan NFP kuat secara historis, tapi bisa meleset jauh (bias survei & cakupan berbeda).",
    ],
    drivers: [
      { name: "Pemutusan & perekrutan swasta", detail: "Indeks ADP menghitung churn (keluar-masuk) tenaga kerja di bisnis non-pemerintah.", src: SRC.adp },
      { name: "Sektor jasa vs manufaktur", detail: "Mayoritas pekerjaan baru di AS ada di sektor jasa; ADP mencerminkan itu lebih cepat dari BLS.", src: SRC.adp },
      { name: "Kebijakan The Fed", detail: "Pasar kerja yang mendingin memberi The Fed alasan longgar; ADP lemah memperkuat tesis tersebut.", data: "Mar 2026: +62 ribu (konsensus +41 ribu; Feb +66 ribu); Mei 2026: +122 ribu (konsensus +118 ribu; April +105 ribu). Reliabel sebagai arah umum — tapi NFP resmi Mei pekan yang sama 172 ribu (kemudian direvisi 129 ribu).", src: SRC.adp },
    ],
    expertViews: [
      { desk: "FX Strategist", view: "ADP adalah probabilitas awal arah NFP: jika ADP beat, market langsung menaikkan ekspektasi NFP — USD menguat sebelum BLS bicara.", signal: "ADP beat = USD naik (sementara)." },
      { desk: "Economist", view: "Jangan overrate: ADP bukan BLS. Rilis ADP yang meleset dari NFP terjadi rutin; keputusan posisi sebaiknya menunggu NFP.", signal: "ADP = sinyal, NFP = keputusan." },
    ],
    outlook:
      "Catatan penting: kalender ForexFactory mulai window Sep 2026 tidak menampilkan lagi baris ADP — indikasi rilis ini dihentikan/berubah. Data terakhir yang kami verifikasi: April 2026 +105 ribu, Mei 2026 +122 ribu (konsensus +118 ribu). Selama masih dirilis, ADP tetap berguna sebagai leading indicator NFP; jika memang berhenti, fokus pasar kerja bergeser penuh ke NFP + klaim mingguan.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Ekspektasi NFP naik → USD menguat sebelum rilis NFP.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral; pasar menunggu NFP.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Ekspektasi NFP turun → USD melemah.", dir: "down", cur: "USD" },
    ],
    watch: ["NFP (BLS)", "Klaim pengangguran", "ISM Services (komponen employment)"],
  },
  ahe: {
    read: [
      "Perubahan gaji rata-rata per jam (Average Hourly Earnings), YoY & MoM.",
      "Indikator inflasi upah — kenaikan upah cepat dapat memicu inflasi berkelanjutan.",
      "Dirilis bersamaan dengan NFP; sering lebih 'dipasar' daripada headline NFP.",
    ],
    drivers: [
      { name: "Keketatan pasar kerja", detail: "Pasar kerja ketat (pengangguran rendah) mendorong perusahaan menaikkan gaji untuk menarik & mempertahankan pekerja.", src: SRC.blsJobs },
      { name: "Perundingan upah", detail: "Perjanjian kerja & serikat pekerja menetapkan kenaikan gaji yang berkelanjutan selama 1–3 tahun.", src: SRC.blsJobs },
      { name: "Produktivitas tenaga kerja", detail: "Produktivitas naik memungkinkan kenaikan upah tanpa memicu inflasi; produktivitas turun membuat kenaikan upah jadi inflasioner.", src: SRC.blsJobs },
    ],
    expertViews: [
      { desk: "FX Strategist", view: "AHE adalah 'bagian tersembunyi' dari NFP yang paling menentukan. Upah tinggi = inflasi tinggi = USD bullish.", signal: "AHE naik = USD kuat." },
      { desk: "Rates Desk", view: "Kenaikan upah membuat The Fed menunda penurunan suku bunga, sehingga yield obligasi naik — mendukung dolar.", signal: "AHE tinggi = yield up." },
    ],
    outlook:
      "Upah AS perlu diamati bersama inflasi: dengan CPI masih 3,4% (Juli 2026) dan The Fed mengisyaratkan bisa kembali hawkish, kenaikan AHE di atas ~3,8% YoY akan memperkuat alasan 'tahan/naikkan bunga' (bullish USD), sementara AHE melambat ke <3,3% akan membuka ruang pelonggaran (bearish USD). Pola yang paling sehat bagi pasar adalah 'upah naik moderat' (3,3–3,7%) — memberi daya beli tanpa memantik inflasi. Rilis AHE setiap Jumat pertama biasanya menjadi penentu arah EURUSD untuk sepekan ke depan.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Inflasi upah meningkat → The Fed hawkish → USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Tekanan inflasi mereda → USD turun.", dir: "down", cur: "USD" },
    ],
    watch: ["CPI", "Nonfarm Payrolls", "Produktivitas (BLS labor productivity)"],
  },
  fedfunds: {
    read: [
      "Suku bunga acuan The Fed (batas atas target range).",
      "Diumumkan 8x/tahun dari rapat FOMC, 14:00 ET + pidato press conference.",
      "Yang digerakkan pasar sering bukan angkanya, melainkan DOT PLOT & nada pidato.",
    ],
    drivers: [
      { name: "Inflasi (CPI/Core CPI)", detail: "Inflasi tinggi memaksa The Fed mempertahankan atau menaikkan suku bunga. Inflasi 3,4% saat ini = alasan utama The Fed tidak mau longgar.", data: "CPI Juli 2026: 3,4% YoY; core 2,5%. Ketua The Fed Kevin Warsh: inflasi 'belum melambat cukup'.", src: SRC.blsCpi },
      { name: "Pasar tenaga kerja", detail: "Lapangan kerja & pengangguran menentukan seberapa ketat kebijakan yang diperlukan.", data: "NFP Juli 2026: −23 ribu (kejutan lemah) vs unemp 4,1% — The Fed terjepit antara dua mandat.", src: SRC.blsJobs },
      { name: "Pertumbuhan ekonomi (GDP)", detail: "Ekonomi yang tumbuh kuat mendukung suku bunga tinggi; perlambatan mendorong penurunan.", data: "GDP Q1-2026: +2,1% annualized; konsensus 2026 ~1,9–2,2%.", src: SRC.beaGdp },
      { name: "Kondisi finansial & dot plot", detail: "Dot plot (proyeksi suku bunga tiap anggota FOMC dalam SEP) sering mengguncang pasar lebih besar daripada keputusan itu sendiri.", src: SRC.fed },
    ],
    expertViews: [
      { desk: "Head of Rates (NY)", view: "Pasar berfokus pada 'dot plot' — proyeksi suku bunga anggota Fed. Perubahan dot plot sering lebih mengguncang daripada keputusan itu sendiri.", signal: "Dot plot = kunci." },
      { desk: "FX Strategist (London)", view: "Suku bunga tinggi = arus modal masuk = USD kuat. Perubahan ekspektasi suku bunga adalah penggerak utama EURUSD & USDJPY.", signal: "Hawkish Fed = USD up." },
      { desk: "Economist", view: "Baca pernyataan & nada (tone) Gubernur. Pidato setelah rapat (press conference) memegang pengaruh besar pada pergerakan pasar.", signal: "Baca nada press conference." },
    ],
    outlook:
      "Per Agustus 2026, The Fed di bawah kepemimpinan baru (Kevin Warsh, Ketua sejak Mei 2026) berada dalam mode 'hawkish on hold': suku bunga 3,50–3,75% dipertahankan karena inflasi 3,4% masih jauh di atas 2%, sementara pasar kerja mulai menunjukkan retakan (NFP Juli negatif, partisipasi 61,4%). Rapat September 2026 menjadi ujian pertama: data CPI Agustus yang panas → probabilitas kenaikan (hike) nyata; data yang dingin → hold dengan sinyal 'siap memotong di 2027'. Pasar harus bersiap volatilitas tinggi di sekitar tiap FOMC. Implikasi USD: selama dot plot tidak berubah, USD tetap terdukung oleh yield US10Y ~4,7%; perubahan dot plot ke arah pemangkasan akan menjadi katalis bearish USD terbesar tahun ini.",
    scenarios: [
      { label: "Hawkish (naik/tinggi lebih lama)", effect: "Yield naik, modal masuk → USD menguat luas (terutama vs EM).", dir: "up", cur: "USD" },
      { label: "Sebagaimana di-expect", effect: "Reaksi kecil; fokus ke dot plot & pidato.", dir: "flat", cur: "USD" },
      { label: "Dovish (potongan di depan)", effect: "Yield turun → USD melemah, emas & aset risiko naik.", dir: "down", cur: "USD" },
    ],
    watch: ["Dot plot / SEP", "Pernyataan FOMC", "Data CPI & NFP", "Pidato petinggi Fed"],
  },
  dgs10: {
    read: [
      "Imbal hasil obligasi pemerintah AS tenor 10 tahun.",
      "Disebut 'harga uang' — mencerminkan ekspektasi suku bunga + ekspektasi inflasi + premi risiko.",
      "Bergerak setiap hari (bukan rilis sekali) — pantau level & spread vs negara lain.",
    ],
    drivers: [
      { name: "Ekspektasi suku bunga (The Fed)", detail: "Yield naik saat pasar mengantisipasi The Fed menaikkan suku bunga atau menahannya tinggi lebih lama.", data: "US10Y 28 Agu 2026: 4,73%; US2Y: 4,34% — kurva memendek namun masih positif (spread 10Y–2Y +0,39).", src: SRC.treasury },
      { name: "Ekspektasi inflasi", detail: "Inflasi yang diperkirakan naik membuat investor menuntut kompensasi (yield) lebih tinggi; TIPS (breakeven) adalah ukurannya.", data: "10Y TIPS breakeven ≈ 2,4% (Agu 2026) — pasar mengantisipasi inflasi 10 tahun ke depan di level ini.", src: SRC.treasury },
      { name: "Permintaan obligasi / risk appetite", detail: "Ketika takut, investor membeli obligasi (flight to safety) → yield turun; saat risk-on, yield naik. Arahnya bisa terbalik dari 'logika suku bunga'.", src: SRC.treasury },
      { name: "Supply & lelang", detail: "Defisit fiskal AS yang besar berarti penerbitan obligasi masif; hasil lelang yang lemah mendorong yield naik (premi permintaan).", src: SRC.treasury },
    ],
    expertViews: [
      { desk: "Rates Strategist", view: "Yield 10Y adalah 'ukur' suku bunga netral jangka panjang. Kenaikan yield = modal masuk = dolar kuat.", signal: "Yield naik = USD up." },
      { desk: "FX Desk", view: "Spread yield antara AS dan negara lain (mis. AS vs Jerman) adalah mesin utama nilai tukar. Yield AS naik cepat → selisih melebar → USD naik.", signal: "Watch US–DE spread." },
    ],
    outlook:
      "US10Y di ~4,7% (Agu 2026) — level tinggi historis yang ditopang dua kekuatan: (1) The Fed 'hawkish on hold' dengan inflasi 3,4%, dan (2) penerbitan utang masif. Selama The Fed tidak memberi sinyal pemangkasan nyata, yield diproyeksikan bertahan di rentang 4,5–5,0%, yang terus menyedot dana ke dolar dan menahan EUR/USD, GBP/USD, dan cross EM tertekan. Titik perubahan: (a) dot plot September 2026 yang membesar ke arah cut, (b) CPI dua bulan beruntun di bawah konsensus, atau (c) stress lelang obligasi yang memicu risk-off (yield bisa naik sementara meski USD melemah — watch spread, bukan level saja).",
    scenarios: [
      { label: "Yield melonjak", effect: "Arus modal ke AS → USD menguat (kecuali karena crisis: flight-to-safety bisa melemahkan USD).", dir: "up", cur: "USD" },
      { label: "Stabil", effect: "Netral; USD mengikuti spread vs negara lain.", dir: "flat", cur: "USD" },
      { label: "Yield turun tajam", effect: "Ekspektasi pelonggaran → USD melemah.", dir: "down", cur: "USD" },
    ],
    watch: ["Level & kurva yield", "CPI", "Lelang obligasi (Treasury auction)", "Spread vs Bund Jerman & JGB"],
  },
  retail: {
    read: [
      "Perubahan penjualan ritel bulanan (m/m & YoY).",
      "Proksi belanja konsumen — sekitar dua pertiga ekonomi AS.",
      "Versi 'ex-auto' (tanpa kendaraan) yang paling dipantau pasar.",
    ],
    drivers: [
      { name: "Keyakinan konsumen", detail: "Konsumen yang optimis lebih berani berbelanja, mendorong penjualan.", src: SRC.census },
      { name: "Pendapatan & upah", detail: "Pendapatan yang meningkat memberi daya beli untuk belanja.", src: SRC.blsJobs },
      { name: "Inflasi & harga", detail: "Inflasi tinggi bisa menaikkan nilai penjualan itu sendiri; perlu dilihat secara riil (nominal vs riil).", src: SRC.blsCpi },
      { name: "Kondisi kredit & suku bunga", detail: "Suku bunga tinggi menekan pinjaman konsumen (kartu kredit, KPR, auto loan), mengurangi belanja besar.", src: SRC.fed },
    ],
    expertViews: [
      { desk: "Consumer Strategist", view: "Retail sales adalah cermin langsung kesehatan konsumen. Angka kuat menandakan engine ekonomi AS masih menyala.", signal: "Retail kuat = USD up." },
      { desk: "Economist", view: "Perlu dipisahkan control group (tanpa otomotif & bensin) yang lebih bersih — itu yang biasanya dimonitor pasar.", signal: "Fokus ke control group." },
    ],
    outlook:
      "Konsumsi AS masih menjadi tulang punggung (±2/3 PDB) meski suku bunga tinggi menahan belanja besar (otomotif, rumah). Dengan GDP 2026 diproyeksikan ~1,9–2,2% dan upah riil tertekan inflasi 3,4%, retail sales diperkirakan tumbuh moderat — tidak cukup panas untuk memicu kekhawatiran inflasi, tidak cukup dingin untuk memicu panic. Retail ex-auto yang konsisten >+0,3% m/m akan menjaga narasi 'soft landing' dan menopang USD; kejutan negatif (<0%) akan memperkuat ekspektasi pemangkasan dan menekan USD.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Konsumsi sehat → ekonomi tahan → USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Konsumen melemah → ekspektasi cut → USD turun.", dir: "down", cur: "USD" },
    ],
    watch: ["Michigan Consumer Sentiment", "Data ketenagakerjaan", "Kredit konsumen (Fed G.19)"],
  },
  umich: {
    read: [
      "Survei keyakinan konsumen (University of Michigan) terhadap ekonomi & keuangan pribadi.",
      "Ada versi preliminary (pertengahan bulan) & final (akhir bulan).",
      "Komponen paling dipasar: ekspektasi inflasi 1-tahun & 5-tahun.",
    ],
    drivers: [
      { name: "Kondisi ekonomi saat ini", detail: "Konsumen menilai situasi ekonomi yang sedang berjalan.", src: SRC.umich },
      { name: "Harga & inflasi", detail: "Inflasi tinggi menurunkan keyakinan; survei ini juga memuat ekspektasi inflasi konsumen — input kebijakan The Fed.", data: "Ekspektasi inflasi 1-tahun konsumen menjadi salah satu pengukur 'anchoring' inflasi (target The Fed 2%).", src: SRC.umich },
      { name: "Pasar tenaga kerja", detail: "Ketersediaan & keamanan pekerjaan memengaruhi rasa aman berbelanja.", src: SRC.blsJobs },
      { name: "Sentimen politik & peristiwa", detail: "Peristiwa politik dapat memengaruhi mood konsumen dalam jangka pendek.", src: SRC.umich },
    ],
    expertViews: [
      { desk: "Micro Strategist", view: "Yang paling dicari adalah 'ekspektasi inflasi 1 tahun' dari survei ini — sering menjadi petunjuk kebijakan The Fed.", signal: "Watch ekspektasi inflasi 1y." },
      { desk: "Consumer Economist", view: "Sentimen biasanya mengikuti data ketenagakerjaan dan harga; korelasi dengan belanja riil tidak selalu langsung.", signal: "Gunakan sebagai konfirmasi." },
    ],
    outlook:
      "Sentimen konsumen sensitif terhadap dua hal saat ini: upah riil yang tertekan inflasi 3,4% dan kekhawatiran pasar kerja (partisipasi 61,4%). Selama ekspektasi inflasi 1-tahun tetap 'terjangkar' di bawah ~3%, The Fed tidak perlu panik; lonjakan ekspektasi (>3,5%) akan menjadi bahan bakar narasi hawkish (bullish USD) karena bank sentral harus lebih agresif menjangkarkan. Ekspektasi 5-tahun adalah indikator kepercayaan jangka panjang — jika masih ~2,3–2,5%, pasar harga akan tetap percaya target 2% The Fed tercapai.",
    scenarios: [
      { label: "Sentimen & ekspektasi inflasi naik", effect: "Narasi hawkish → USD naik.", dir: "up", cur: "USD" },
      { label: "Stabil", effect: "Netral; dampak kecil.", dir: "flat", cur: "USD" },
      { label: "Sentimen anjlok", effect: "Risiko resesi → USD turun (kecuali flight-to-safety).", dir: "down", cur: "USD" },
    ],
    watch: ["Ekspektasi inflasi 1y & 5y", "Retail Sales", "Data ketenagakerjaan"],
  },
  indpro: {
    read: [
      "Perubahan output pabrik, pertambangan, & utilitas (m/m).",
      "Indikator aktivitas sektor produksi — sekitar 1/4 ekonomi AS.",
      "Lihat 'advance indicators' (pesanan) di dalam rilis yang sama.",
    ],
    drivers: [
      { name: "Pesanan manufaktur", detail: "Pesanan yang masuk (new orders) menentukan tingkat produksi berikutnya.", src: SRC.fedG17 },
      { name: "Permintaan global", detail: "Ekonomi dunia yang kuat mendorong ekspor dan produksi domestik; China & Eropa penopang utama.", src: SRC.fedG17 },
      { name: "Kapasitas produksi", detail: "Seberapa banyak kapasitas yang terpakai menunjukkan ruang untuk meningkatkan output.", src: SRC.fedG17 },
    ],
    expertViews: [
      { desk: "Industri Strategist", view: "Industrial production bersama PMI menunjukkan 'denyut' manufaktur. Kenaikan = ekspansi ekonomi.", signal: "Produksi naik = risk-on." },
    ],
    outlook:
      "Sektor manufaktur AS berada di fase 'stabil tapi tidak ekspansif' — tertahan biaya energi tinggi dan suku bunga 3,50–3,75%, ditopang investasi IT & energi. Industrial production diproyeksikan tumbuh pelan (+0,1–0,3% m/m) di kuartal III 2026. Dampak ke FX terbatas dibanding CPI/NFP, tetapi rangkaian produksi lemah 2–3 bulan berturut-turut akan memperkuat skenario resesi ringan yang berujung pada pemangkasan Fed (bearish USD).",
    scenarios: [
      { label: "Di atas konsensus", effect: "Ekspansi berlanjut → USD naik tipis.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Perlambatan produksi → USD turun tipis.", dir: "down", cur: "USD" },
    ],
    watch: ["ISM Manufacturing PMI", "Capacity Utilization", "Pesanan tahan lama (durable goods)"],
  },
  gdp: {
    read: [
      "Pertumbuhan ekonomi riil per kuartal, annualized (q/q) — angka preliminary BEA (sesuai tampilan ForexFactory).",
      "Angka paling luas tentang kesehatan ekonomi; dirilis 3 kali (advance, second, final).",
      "Baca komposisinya: konsumsi vs investasi vs ekspor bersih.",
    ],
    drivers: [
      { name: "Konsumsi rumah tangga", detail: "Komponen terbesar (~70% PDB). Belanja konsumen menentukan laju pertumbuhan.", data: "Q2-2026: advance 1,5% (30 Jul, K 2,1%) → preliminary 1,5% (26 Agu, K 1,5%) — stabil. Q1-2026: advance 2,0% (30 Apr) → preliminary 1,6% (28 Mei) → 'final' 2,1% (25 Jun) → direvisi ke 1,5% (per 26 Agu) — empat nilai untuk satu kuartal, dunia revisi BEA yang liar.", src: SRC.beaGdp },
      { name: "Investasi bisnis", detail: "Investasi modal (terutama IT) merefleksikan optimisme jangka panjang perusahaan; ini penopang pertumbuhan AS 2026.", src: SRC.beaGdp },
      { name: "Ekspor & impor", detail: "Ekspor yang kuat menambah, impor yang besar mengurangi PDB; tarif & kurs menentukan arahnya.", src: SRC.beaGdp },
      { name: "Belanja pemerintah", detail: "Kebijakan fiskal dan belanja negara mendorong pertumbuhan; pemotongan belanja federal bisa menjadi rem (lihat koreksi sektor pemerintah Juli 2026).", src: SRC.beaGdp },
    ],
    expertViews: [
      { desk: "Macro Strategist", view: "GDP kuat = The Fed lebih nyaman mempertahankan suku bunga tinggi = USD kuat. GDP lemah = ekspektasi cut naik.", signal: "GDP kuat = USD up." },
      { desk: "Economist", view: "Perhatikan komposisi: pertumbuhan berbasis konsumsi & investasi lebih sehat & berkelanjutan daripada hanya berbasis stimulus.", signal: "Baca komposisi, bukan headline." },
    ],
    outlook:
      "Ekonomi AS diproyeksikan tumbuh ~1,9–2,2% sepanjang 2026 — solid, ditopang investasi IT, energi, dan belanja konsumen yang tangguh. Advance Q2-2026 (26 Agu) +1,5% annualized, sesuai konsensus (Q1 juga 1,5%); jika Q3 tetap >1,5% annualized, skenario 'soft landing' bertahan dan The Fed tidak punya alasan longgar → USD terdukung. Risiko utama: konsumsi rumah tangga yang melelah akibat inflasi 3,4% + suku bunga tinggi; dua kuartal berturut-turut <1% akan menggeser pasar ke skenario resesi (bearish USD).",
    scenarios: [
      { label: "Di atas konsensus", effect: "Ekonomi kuat → The Fed tahan ketat → USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Perlambatan → ekspektasi cut → USD turun.", dir: "down", cur: "USD" },
    ],
    watch: ["Konsumsi pribadi", "Investasi bisnis", "Ekspor bersih", "Kebijakan fiskal"],
  },
  claims: {
    read: [
      "Klaim pengangguran awal per minggu — data pasar kerja tercepat.",
      "Dirilis setiap Kamis, 08:30 ET (13:30/19:30 WIB). Di sini dirata-rata bulanan.",
      "Bandingkan 4-minggu moving average, bukan angka seminggu.",
    ],
    drivers: [
      { name: "PHK / pemutusan kerja", detail: "Peningkatan klaim menandakan perusahaan mulai memangkas karyawan — tanda awal perlambatan.", data: "Klaim awal sempat stabil di ~215 ribu (Juni–Juli 2026) — level 'aman', jauh di bawah zona alarm (>300 ribu).", src: SRC.blsClaims },
      { name: "Siklus bisnis", detail: "Klaim biasanya naik menjelang/kala resesi dan turun saat ekspansi.", src: SRC.fred },
      { name: "Kondisi pasar kerja", detail: "Klaim yang rendah & stabil = pasar kerja solid, mendukung kebijakan ketat The Fed.", src: SRC.blsClaims },
    ],
    expertViews: [
      { desk: "Labor Economist", view: "Jobless claims adalah 'radar' dini pasar kerja. Lonjakan tajam adalah peringatan awal resesi.", signal: "Spike = risk-off." },
      { desk: "FX Strategist", view: "Klaim naik melemahkan USD karena memicu spekulasi The Fed akan memangkas suku bunga cepat.", signal: "Klaim naik = USD down." },
    ],
    outlook:
      "Dengan NFP Juli negatif (−23 ribu vs konsensus +85) dan revisi Juni ke bawah (57→20 ribu), klaim awal adalah radar paling dini untuk melihat apakah pasar kerja 'mendingin' atau 'retak'. Selama 4-minggu moving average bertahan di bawah ~230 ribu, pasar akan tetap menganggap pasar kerja stabil (netral-bullish USD). Lonjakan ke 260–300 ribu berturut-turut 2–3 minggu akan menjadi sinyal awal pelemahan USD yang besar — biasanya mendahului kenaikan Unemployment Rate 4–8 minggu kemudian.",
    scenarios: [
      { label: "Naik tajam (>250 ribu)", effect: "Warning perlambatan → USD turun.", dir: "down", cur: "USD" },
      { label: "Stabil (<230 ribu)", effect: "Netral-bullish USD.", dir: "flat", cur: "USD" },
      { label: "Turun", effect: "Pasar kerja ketat → USD naik tipis.", dir: "up", cur: "USD" },
    ],
    watch: ["NFP (Jumat)", "Unemployment Rate", "Klaim lanjutan (continuing claims)"],
  },
  capacity: {
    read: [
      "Persentase kapasitas industri yang terpakai.",
      "Bersama Industrial Production mencerminkan denyut sektor manufaktur.",
      "Level >80% = tekanan; <75% = banyak ruang.",
    ],
    drivers: [
      { name: "Permintaan industri", detail: "Permintaan tinggi mendorong pabrik menggunakan lebih banyak kapasitas.", src: SRC.fedG17 },
      { name: "Investasi kapasitas", detail: "Pembangunan pabrik baru dan peralatan menambah kapasitas yang tersedia.", src: SRC.fedG17 },
      { name: "Siklus manufaktur", detail: "Kapasitas terpakai sangat terikat siklus ekspansi-kontraksi manufaktur.", src: SRC.fedG17 },
    ],
    expertViews: [
      { desk: "Industrial Analyst", view: "Kapasitas terpakai mendekati maksimum menandakan tekanan inflasi produksi — mendukung kebijakan ketat.", signal: "Kapasitas tinggi = inflasi pressure." },
    ],
    outlook:
      "Kapasitas terpakai AS di kisaran menengah (±77%) menunjukkan ekonomi produksi 'penuh tapi tidak overheat' — tidak memberi alasan tambahan bagi The Fed untuk menaikkan bunga, namun juga tidak membuka ruang pemangkasan. Dampak FX-nya paling kecil dibanding CPI/NFP; gunakan sebagai konfirmasi arah siklus manufaktur bersama ISM & Industrial Production.",
    scenarios: [
      { label: "Naik mendekati 80%+", effect: "Tekanan inflasi produksi → USD naik tipis.", dir: "up", cur: "USD" },
      { label: "Stabil", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Turun", effect: "Produksi melemah → USD turun tipis.", dir: "down", cur: "USD" },
    ],
    watch: ["Industrial Production", "ISM Manufacturing PMI", "PPI"],
  },
  eu_cpi: {
    read: [
      "Indeks harga konsumen Zona Euro (HICP), YoY.",
      "Target inflasi ECB juga 2% (symetris — inflasi rendah juga jadi masalah).",
      "Ada 'flash estimate' awal bulan (cepat, kurang akurat) & final.",
    ],
    drivers: [
      { name: "Harga energi", detail: "Eropa sangat bergantung pada impor energi — konflik Timur Tengah 2026 menaikkan inflasi EZ lewat harga gas & bensin.", data: "HICP Juli 2026: 2,9% YoY (Juni 2,8%) — naik lagi akibat energi; core 2,5%. Proyeksi ECB: HICP bisa mencapai 3,4% di Q3–Q4 2026.", src: SRC.eurostat },
      { name: "Harga pangan", detail: "Kenaikan harga pangan langsung tercermin dalam inflasi konsumen Eropa (inflasi pangan Q2-2026: 1,2%).", src: SRC.eurostat },
      { name: "Upah Eropa", detail: "Perundingan upah yang tinggi dapat 'menumpuk' inflasi dan membuat ECB ketat lebih lama. Pertumbuhan upah Q1-2026: 3,4% YoY.", src: SRC.eurostat },
      { name: "Permintaan kawasan", detail: "Konsumsi & investasi dalam Zona Euro menentukan tekanan harga; pertumbuhan 2026 diproyeksikan hanya 0,8%.", src: SRC.ecb },
    ],
    expertViews: [
      { desk: "ECB Watcher", view: "Inflasi EZ biasanya didorong energi, bukan permintaan domestik. Karena itu ECB sering lebih berhati-hati daripada The Fed.", signal: "Baca komponen energi." },
      { desk: "FX Strategist", view: "Inflasi EZ tinggi → ECB hawkish → EUR kuat terhadap USD & GBP.", signal: "EZ CPI tinggi = EUR up." },
    ],
    outlook:
      "ECB baru saja melakukan kenaikan pertama dalam 3 tahun (+25bp Juni 2026, jadi 2,40%) sebagai respons guncangan energi. Proyeksi staff ECB (Juni 2026): HICP 2026 rata-rata 3,0%, bisa menyentuh 3,4% di Q3–Q4, baru turun ke 2,3% di 2027. Artinya ECB kemungkinan menaikkan 1–2x lagi pada 2026 sebelum memotong. Divergensi ini adalah mesin EURUSD: ECB hawkish + Fed terjepit data kerja lemah → EUR memiliki momentum naik terhadap USD di paruh kedua 2026, selama minyak tidak melonjak ekstrem (yang justru merugikan ekonomi EZ).",
    scenarios: [
      { label: "Di atas konsensus", effect: "ECB hawkish → EUR naik (terutama vs USD/GBP).", dir: "up", cur: "EUR" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "EUR" },
      { label: "Di bawah konsensus", effect: "Ruang longgar ECB → EUR turun.", dir: "down", cur: "EUR" },
    ],
    watch: ["Keputusan ECB (Sept 2026)", "Harga energi (Brent/TTF)", "GDP & tenaga kerja Eropa"],
  },
  eu_unemp: {
    read: [
      "Tingkat pengangguran Zona Euro (Eurostat, bulanan).",
      "Dampak ke EUR umumnya kecil — pasar lebih fokus ke inflasi & keputusan ECB.",
      "Perhatikan juga youth unemployment & upah.",
    ],
    drivers: [
      { name: "Pasar kerja Eropa", detail: "Kondisi pasar kerja di negara-negara anggota berpengaruh pada angka gabungan.", data: "Juni 2026: 6,3% (Juli belum rilis; proyeksi 6,3%). Pengangguran muda 14,8% (Juni).", src: SRC.eurostat },
      { name: "Siklus ekonomi", detail: "Ekonomi yang tumbuh menurunkan pengangguran; stagnasi menaikannya. Pertumbuhan 2026 EZ hanya 0,8% — risiko utama.", src: SRC.ecb },
      { name: "Kebijakan ECB", detail: "Kebijakan suku bunga (kini 2,40%) berdampak pada investasi & lapangan kerja.", src: SRC.ecb },
    ],
    expertViews: [
      { desk: "Eurozone Economist", view: "Pengangguran rendah mendukung ECB mempertahankan kebijakan ketat, menguatkan EUR.", signal: "Unemp rendah = EUR up." },
    ],
    outlook:
      "Pasar kerja Zona Euro masih solid (6,3%, dekat level terendah historis) bahkan di tengah kenaikan suku bunga — ini memberi ECB legitimasi untuk tetap hawkish sepanjang 2026. Risiko: jika pertumbuhan 0,8% melambat menjadi stagnasi (Q3–Q4), pengangguran bisa naik ke 6,5–6,7%, yang akan memaksa ECB berhenti menaikkan dan membuka wacana cut di 2027 (bearish EUR). Jangka pendek: data netral-bullish EUR.",
    scenarios: [
      { label: "Turun (pasar kerja ketat)", effect: "ECB yakin hawkish → EUR naik.", dir: "up", cur: "EUR" },
      { label: "Stabil", effect: "Netral.", dir: "flat", cur: "EUR" },
      { label: "Naik (perlambatan)", effect: "Tekanan dovish ke ECB → EUR turun.", dir: "down", cur: "EUR" },
    ],
    watch: ["Keputusan ECB", "PMI Zona Euro", "Upah & data tenaga kerja"],
  },
  uk_cpi: {
    read: [
      "Indeks harga konsumen Inggris (ONS), YoY.",
      "Menentukan kebijakan Bank of England (BoE).",
      "Target inflasi BoE: 2% (CPI).",
    ],
    drivers: [
      { name: "Harga pangan & energi", detail: "Inggris sensitif terhadap impor energi & pangan; lonjakan harga gas (Ofgem price cap) langsung menaikkan inflasi.", data: "CPI Juli 2026: 2,9% YoY (Juni 2,6%) — naik karena kenaikan price cap energi Ofgem 13%; inflasi energi 9,8%. Core tetap 2,6%.", src: SRC.onsCpi },
      { name: "Upah Inggris", detail: "Pasar kerja Inggris masih ketat, menaikkan upah dan inflasi jasa (inflasi jasa Juli: 3,4%).", src: SRC.onsCpi },
      { name: "Permintaan domestik & sterling", detail: "Konsumsi & revisi harga di sektor jasa; pound yang lemah menaikkan biaya impor.", src: SRC.onsCpi },
    ],
    expertViews: [
      { desk: "BoE Watcher", view: "Inflasi Inggris yang lebih 'sticky' daripada mitranya membuat BoE lebih lambat memangkas suku bunga — mendukung GBP.", signal: "UK CPI tinggi = GBP up." },
      { desk: "FX Strategist", view: "Perbedaan laju inflasi & kebijakan antara BoE dan The Fed adalah mesin utama GBP/USD.", signal: "Watch BoE vs Fed divergence." },
    ],
    outlook:
      "Inflasi UK kembali naik ke 2,9% (Juli 2026) — didorong price cap energi Ofgem, sementara core tetap 2,6% (di bawah target). BoE di 3,75% akan menghadapi dilema di rapat September 2026: headline yang panas vs core yang jinak. Pasar besar kemungkinan memperkirakan hold. Jika inflasi energi ikut mereda (Brent turun) dan upah melambat, BoE bisa mulai memotong di Q1-2027 → GBP perlahan bearish. Sebaliknya, CPI >3,0% dua bulan beruntun akan mempertahankan narasi 'BoE lebih hawkish dari Fed' → GBP/USD terangkat.",
    scenarios: [
      { label: "Di atas konsensus", effect: "BoE hawkish → GBP naik.", dir: "up", cur: "GBP" },
      { label: "Sesuai konsensus", effect: "Netral; fokus ke core.", dir: "flat", cur: "GBP" },
      { label: "Di bawah konsensus", effect: "Ruang cut BoE → GBP turun.", dir: "down", cur: "GBP" },
    ],
    watch: ["Keputusan BoE", "Data upah UK", "Harga energi & price cap Ofgem"],
  },
  uk_unemp: {
    read: [
      "Tingkat pengangguran Inggris (ONS, bulanan; 3-bulan rolling).",
      "Sering rilis bersamaan dengan data upah & klaim.",
      "Dampak ke GBP moderat — BoE juga sangat fokus ke inflasi.",
    ],
    drivers: [
      { name: "Pasar kerja UK", detail: "Kondisi pasar kerja Inggris, termasuk tingkat partisipasi & low-pay work.", data: "Juni 2026: 4,9% (3-bulan rolling) — stabil; upah (ex bonus) tetap tumbuh ~4% YoY.", src: SRC.onsJobs },
      { name: "Siklus ekonomi", detail: "Fase ekspansi menurunkan pengangguran; ekonomi UK 2026 diproyeksikan hanya ~0,9% — zona rapuh.", src: SRC.onsJobs },
      { name: "Kebijakan BoE", detail: "Suku bunga 3,75% menekan permintaan kredit & rekrutmen.", src: SRC.onsJobs },
    ],
    expertViews: [
      { desk: "UK Economist", view: "Pengangguran rendah + upah naik = inflasi bertahan → BoE ketat → GBP kuat.", signal: "Unemp rendah & wages up = GBP up." },
    ],
    outlook:
      "Pasar kerja Inggris dalam mode 'low-hire, low-fire' seperti AS: pengangguran stabil 4,9% tetapi pertumbuhan upah yang kuat (~4%) menjaga inflasi jasa tetap 3,4%. Selama pola ini bertahan, BoE tidak punya alasan longgar — netral-bullish GBP. Risiko: pertumbuhan ekonomi 0,9% yang terlalu tipis bisa memicu lonjakan pengangguran ke 5,3%+ pada 2027, yang akan menjadi katalis pemangkasan BoE lebih awal (bearish GBP).",
    scenarios: [
      { label: "Turun (pasar kerja ketat)", effect: "BoE tahan ketat → GBP naik.", dir: "up", cur: "GBP" },
      { label: "Stabil", effect: "Netral.", dir: "flat", cur: "GBP" },
      { label: "Naik (perlambatan)", effect: "BoE dovish → GBP turun.", dir: "down", cur: "GBP" },
    ],
    watch: ["Upah UK (ex bonus)", "Keputusan BoE", "UK CPI"],
  },
  jp_cpi: {
    read: [
      "Indeks harga konsumen Jepang (MOF), YoY — Tokyo & nasional.",
      "Menjadi penentu kebijakan normalisasi Bank of Japan (BoJ).",
      "Target inflasi BoJ: 2% (dengan upah riil positif).",
    ],
    drivers: [
      { name: "Harga impor (energi & pangan)", detail: "Jepang sangat bergantung impor; yen lemah membuat impor mahal → inflasi naik tapi daya beli turun.", data: "BoJ telah menaikkan suku bunga ke 1,00% (2026) — proses normalisasi berlanjut mengikuti inflasi yang bertahan di atas 2%.", src: SRC.mofJp },
      { name: "Upah Jepang (shuntou)", detail: "Kenaikan upah yang berkelanjutan (musim semi/shuntou) diperlukan agar inflasi 'sehat' dan konsumsi pulih.", src: SRC.mofJp },
      { name: "Faktor yen (passthrough)", detail: "Yen yang lemah menaikkan biaya impor, mendorong inflasi namun menekan daya beli rumah tangga.", src: SRC.mofJp },
    ],
    expertViews: [
      { desk: "BoJ Watcher", view: "Inflasi Jepang menetap di atas target memaksa BoJ menaikkan suku bunga — langkah 'normalisasi' yang menguatkan JPY.", signal: "Normalisasi BoJ = JPY up." },
      { desk: "FX Strategist", view: "Intervensi Menteri Keuangan sering muncul saat yen melemah tajam — perhatikan risiko intervensi.", signal: "Watch intervensi yen." },
    ],
    outlook:
      "Normalisasi BoJ sudah dimulai (suku bunga kini 1,00%) dan akan berlanjut selagi inflasi inti Tokyo bertahan di 2,5–3%. Setiap kenaikan BoJ (diprediksi bertahap, total 25–50bp lagi pada 2026–2027) adalah katalis bullish JPY yang paling diandalkan analis, terutama terhadap USD & EUR. Namun JPY juga dibantu faktor lain: selisih suku bunga AS–Jepang yang mulai menyempit (US10Y 4,73% vs JGB10Y masih ~1,5–2%) — selama The Fed tidak menaikkan lagi, carry trade USD/JPY perlahan kehilangan daya tarik. Risiko: yen terlalu cepat menguat bisa memaksa BoJ berhenti menaikkan (efek umpan balik).",
    scenarios: [
      { label: "CPI di atas 3%", effect: "BoJ cepat menaikkan → JPY naik tajam.", dir: "up", cur: "JPY" },
      { label: "CPI 2–3% (sesuai)", effect: "Normalisasi bertahap → JPY naik pelan.", dir: "flat", cur: "JPY" },
      { label: "CPI di bawah 2%", effect: "BoJ tertahan → JPY tertekan.", dir: "down", cur: "JPY" },
    ],
    watch: ["Keputusan BoJ", "Upah (shuntou)", "Intervensi yen", "USD/JPY level 160"],
  },
  eu_gdp: {
    read: [
      "Pertumbuhan ekonomi riil Zona Euro, kuartalan (flash → final).",
      "Flash estimate awal bulan; final 1,5 bulan kemudian.",
      "Baca revisi antar versi — pasar bereaksi ke kejutan, bukan level.",
    ],
    drivers: [
      { name: "Konsumsi & investasi Eropa", detail: "Belanja rumah tangga tertekan energi & suku bunga 2,40%; investasi ditopang program transisi hijau.", data: "Q1-2026: +0,3% annualized (melemah); proyeksi 2026: +0,8% (ECB) — jauh di bawah AS (2,1%).", src: SRC.eurostat },
      { name: "Ekspor (terutama ke Tiongkok)", detail: "Permintaan dari Tiongkok — yang sendiri dalam deflasi ringan — sangat memengaruhi industri manufaktur EZ.", src: SRC.eurostat },
      { name: "Kebijakan fiskal", detail: "Belanja negara & program investasi (terutama Jerman) mendorong pertumbuhan.", src: SRC.ecb },
    ],
    expertViews: [
      { desk: "EU Macro Strategist", view: "Zona Euro rentan stagnasi. GDP kuat = EUR menguat; pertumbuhan tipis memicu kekhawatiran dan melemahkan EUR.", signal: "EZ GDP kuat = EUR up." },
    ],
    outlook:
      "Risiko utama Zona Euro 2026 adalah stagnasi: proyeksi ECB hanya +0,8% (Q1 bahkan +0,3% annualized), tertahan guncangan energi dan manufaktur yang lesu. Jika GDP Q2–Q3 ternyata negatif atau 0%, tekanan dovish ke ECB akan menguat — meski inflasi tinggi, 'stagflasi ringan' bisa memaksa ECB stop & cut di 2027 (bearish EUR). Sebaliknya, stimulus fiskal Jerman yang efektif + recovery manufaktur bisa mengejutkan ke atas (bullish EUR). Volatilitas EUR akan tinggi di sekitar rilis GDP flash.",
    scenarios: [
      { label: "Di atas konsensus (≥0,5% q/q)", effect: "Ekonomi EZ pulih → EUR naik.", dir: "up", cur: "EUR" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "EUR" },
      { label: "Di bawah konsensus (<0%)", effect: "Risiko stagnasi → EUR turun.", dir: "down", cur: "EUR" },
    ],
    watch: ["PMI Zona Euro", "Keputusan ECB", "Pertumbuhan China & AS", "Fiskal Jerman"],
  },
  china_cpi: {
    read: [
      "Indeks harga konsumen Tiongkok (NBS), YoY.",
      "Mencerminkan tekanan deflasi/inflasi ekonomi #2 dunia.",
      "PPI Tiongkok (deflasi industri) sering lebih penting bagi komoditas.",
    ],
    drivers: [
      { name: "Permintaan domestik", detail: "Konsumsi & belanja rumah tangga Tiongkok (terlambat karena krisis properti) menentukan tekanan harga.", data: "CPI Juli 2026: +0,5% YoY — deflasi ringan berlanjut; konsumsi masih lesu pasca-krisis properti.", src: SRC.nbsCn },
      { name: "Harga pangan", detail: "Komponen pangan (terutama babi) besar dan volatil dalam CPI China.", src: SRC.nbsCn },
      { name: "Kebijakan stimulus", detail: "Pemerintah & PBoC melonggarkan kebijakan (LPR kini ~3,0%) untuk melawan deflasi; paket fiskal tambahan kemungkinan besar di H2-2026.", src: SRC.nbsCn },
      { name: "Sektor properti", detail: "Krisis properti menekan permintaan dan harga; pemulihannya penting bagi reflasi & harga tembaga.", src: SRC.nbsCn },
    ],
    expertViews: [
      { desk: "China Economist", view: "Deflasi di China memaksa stimulus agresif → mendukung CNY dan permintaan komoditas global.", signal: "Stimulus China = CNY & commodity up." },
      { desk: "Commodity Strategist", view: "Jika China berhasil reflasi, permintaan komoditas (tembaga, minyak) naik — menguntungkan AUD & CAD.", signal: "Reflasi China = AUD/CAD up." },
    ],
    outlook:
      "Tiongkok masih terjebak inflasi ~0,5% (Juli 2026) — jauh di bawah target 2,5%, yang memberi PBoC ruang terus melonggarkan (LPR 3,0%, lebih banyak cut & RRR di 2026) serta mendorong paket fiskal besar di H2-2026. Ini bullish CNY secara bertahap dan bullish komoditas (tembaga, minyak, batubara) jika stimulus efektif. Skenario penting: CPI kembali positif >1% + PPI keluar deflasi = 'reflasi terkonfirmasi' → rali AUD/NZD/CAD & emas. Sebaliknya, CPI kembali ke 0% (resesi-like) → panic stimulus tapi bearish risk assets.",
    scenarios: [
      { label: "CPI naik (reflasi)", effect: "Permintaan global pulih → CNY naik, komoditas (AUD) naik.", dir: "up", cur: "CNY" },
      { label: "Stabil ~0,5%", effect: "Netral; stimulus berlanjut.", dir: "flat", cur: "CNY" },
      { label: "Deflasi kembali", effect: "Panic stimulus → risk-off, CNY tertekan.", dir: "down", cur: "CNY" },
    ],
    watch: ["PPI Tiongkok", "Keputusan PBoC (LPR)", "Paket stimulus fiskal", "Data properti & penjualan ritel"],
  },
  wti: {
    read: [
      "Harga minyak mentah WTI per barel (NYMEX).",
      "Bergerak harian; sangat sensitif stok mingguan EIA (Rabu) & geopolitik.",
      "Pantau juga spread WTI–Brent (kondisi pasar AS).",
    ],
    drivers: [
      { name: "Penawaran OPEC+", detail: "Keputusan OPEC+ memangkas atau menambah produksi berdampak besar pada harga.", data: "WTI 30 Agu 2026: ≈ US$83,4/barel (live) — masih tinggi akibat guncangan pasokan Timur Tengah; turun ~4,5% dari sebulan lalu.", src: SRC.eiaOil },
      { name: "Permintaan global", detail: "Permintaan dari ekonomi besar (China, AS, Eropa) menentukan konsumsi minyak; China kunci (lihat CPI deflasinya).", src: SRC.eiaOil },
      { name: "Geopolitik", detail: "Konflik & gangguan pasokan di kawasan produsen (Timur Tengah) menyebabkan lonjakan harga — faktor utama 2026.", src: SRC.eiaOil },
      { name: "Stok minyak AS (EIA)", detail: "Laporan stok mingguan (Rabu, 14:30 ET) memberi sinyal suplai-permintaan jangka pendek.", src: SRC.eiaOil },
    ],
    expertViews: [
      { desk: "Energy Strategist", view: "Minyak naik menguntungkan produsen (CAD, NOK) dan merugikan importir (JPY, EUR). Juga menaikkan inflasi global.", signal: "WTI up = CAD up, JPY down." },
      { desk: "Macro Desk", view: "Harga minyak memengaruhi inflasi & kebijakan bank sentral — lonjakan tajam bisa memicu hawkish bias.", signal: "Oil spike = inflation risk." },
    ],
    outlook:
      "Minyak di ~US$83 (Agu 2026) mencerminkan premium risiko geopolitik Timur Tengah yang belum pulih penuh. Dua jalur: (1) de-escalasi → stok menumpuk, harga turun ke 70–75 → inflasi global mendingin (dovish semua bank sentral, bearish CAD/NOK, bullish importir JPY/EUR); (2) eskalasi → 90+ → inflasi kembali memanas (hawkish, bullish CAD, bearish JPY). Laporan EIA mingguan tetap penggerak jangka pendek; pantau juga produksi shale AS yang merespons harga >80.",
    scenarios: [
      { label: "Minyak melonjak", effect: "Inflasi naik → CAD/NOK naik, JPY/EUR turun.", dir: "up", cur: "CAD·NOK" },
      { label: "Stabil", effect: "Netral.", dir: "flat", cur: "CAD·NOK" },
      { label: "Minyak anjlok", effect: "Inflasi turun → produsen minyak tertekan.", dir: "down", cur: "CAD·NOK" },
    ],
    watch: ["Laporan stok EIA (Rabu)", "Keputusan OPEC+", "Geopolitik Timur Tengah", "Permintaan China"],
  },
  brent: {
    read: [
      "Harga minyak mentah Brent per barel (ICE).",
      "Acuan harga minyak internasional (Eropa, Asia, Afrika).",
      "Selisih (spread) WTI–Brent mencerminkan logistik & keseimbangan regional.",
    ],
    drivers: [
      { name: "Pasokan global & OPEC+", detail: "Produksi dan kebijakan kuota OPEC+ menentukan pasokan minyak dunia.", data: "Brent 30 Agu 2026: ≈ US$89,3/barel (live) — premium ~US$6 di atas WTI (normal).", src: SRC.eiaOil },
      { name: "Permintaan global", detail: "Permintaan dari China, AS, & Eropa menggerakkan harga Brent; China ~1/3 impor minyak dunia.", src: SRC.eiaOil },
      { name: "Geopolitik & gangguan pasokan", detail: "Tensi di Timur Tengah & gangguan produksi memicu lonjakan harga.", src: SRC.eiaOil },
      { name: "Stok minyak (EIA/API)", detail: "Laporan stok mingguan memberikan petunjuk keseimbangan suplai-permintaan.", src: SRC.eiaOil },
    ],
    expertViews: [
      { desk: "Energy Strategist", view: "Brent acuan banyak kontrak Asia-Eropa. Naiknya minyak menguatkan CAD/NOK dan melemahkan JPY/EUR.", signal: "Brent up = CAD/NOK up." },
      { desk: "Commodity Analyst", view: "Selisih WTI–Brent (spread) mencerminkan logistik & kondisi pasar regional; perhatikan penyempitan/pelebaran spread.", signal: "Watch WTI–Brent spread." },
    ],
    outlook:
      "Brent ~US$89 mengikuti WTI dengan premium stabil (~US$6) — menandakan pasar AS tidak surplus parah. Dengan proyeksi permintaan 2026 yang didorong rebound pascatensi + pertumbuhan moderat, dan suplai OPEC+ yang disiplin, Brent diproyeksikan 80–95 sepanjang H2-2026. Level >90 = inflasi global memanas (hawkish global, bullish CAD, bearish JPY); <80 = angin segar bagi importir (EUR/JPY pulih) dan tekanan dovish ke bank sentral.",
    scenarios: [
      { label: "Brent naik (>90)", effect: "Inflasi → CAD/NOK naik, JPY turun.", dir: "up", cur: "CAD·NOK" },
      { label: "Stabil (80–90)", effect: "Netral.", dir: "flat", cur: "CAD·NOK" },
      { label: "Brent turun (<80)", effect: "Inflasi turun → CAD/NOK turun, JPY/EUR pulih.", dir: "down", cur: "CAD·NOK" },
    ],
    watch: ["OPEC+", "Permintaan China", "Stok minyak EIA", "Spread WTI–Brent"],
  },
  natgas: {
    read: [
      "Harga gas alam acuan Henry Hub per MMBtu (NYMEX).",
      "Bergerak harian; sangat musiman (musim dingin/panas).",
      "Laporan stok EIA tiap Kamis sangat menentukan.",
    ],
    drivers: [
      { name: "Musim & cuaca", detail: "Permintaan pemanasan (winter) & pendinginan (summer) sangat menentukan harga gas.", src: SRC.eiaGas },
      { name: "Produksi & stok gas AS", detail: "Stok mingguan EIA (injection/withdrawal) memengaruhi harga.", data: "Henry Hub 30 Agu 2026: ≈ US$2,89/MMBtu (live) — level rendah historis akibat produksi shale gas masif.", src: SRC.eiaGas },
      { name: "Ekspor LNG", detail: "Ekspor LNG menyerap pasokan AS, menopang harga gas domestik.", src: SRC.eiaGas },
      { name: "Harga minyak & batu bara", detail: "Substitusi energi memengaruhi harga relatif gas.", src: SRC.eiaGas },
    ],
    expertViews: [
      { desk: "Energy Strategist", view: "Gas merupakan biaya input energi US. Harga naik menguatkan USD dan memengaruhi inflasi domestik.", signal: "Gas up = USD & energy up." },
      { desk: "Commodity Analyst", view: "Volatilitas gas sangat tinggi & musiman. Bisa jadi alat sentimen risiko namun bukan penggerak utama pair FX.", signal: "High vol; gunakan untuk sentimen." },
    ],
    outlook:
      "Gas US$2,89/MMBtu masih murah historis — produksi AS yang melimpah menjaga harga rendah sepanjang 2026. Lonjakan terjadi pada musim pendinginan (Nov–Feb) jika cuaca dingin ekstrem: gas bisa 4–6 sementara, menaikkan biaya pemanasan rumah tangga & inflasi utilitas (bullish USD ringan). Untuk FX, gas adalah faktor sekunder; pengaruhnya lebih ke sentimen energi & inflasi US secara umum.",
    scenarios: [
      { label: "Gas melonjak (musim dingin ekstrem)", effect: "Inflasi energi US naik → USD naik tipis.", dir: "up", cur: "USD" },
      { label: "Stabil rendah", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Gas turun", effect: "Inflasi turun → USD turun tipis.", dir: "down", cur: "USD" },
    ],
    watch: ["Stok gas EIA (Kamis)", "Cuaca/musim", "Ekspor LNG"],
  },
  copper: {
    read: [
      "Harga tembaga global per pound (COMEX) / per metrik ton (LME).",
      "Dianggap barometer kesehatan ekonomi dunia (indikator dini) — 'Dr. Copper'.",
      "Korelasi kuat dengan aktivitas konstruksi, manufaktur & elektrifikasi.",
    ],
    drivers: [
      { name: "Permintaan industri & China", detail: "Sebagian besar permintaan tembaga dari sektor konstruksi & manufaktur, terutama China — stimulus China = katalis utama.", data: "COMEX copper 30 Agu 2026: ≈ US$6,56/lb (live) — +3,2% sebulan terakhir, didorong ekspektasi stimulus China.", src: SRC.lmeCopper },
      { name: "Investasi infrastruktur & elektrifikasi", detail: "Kendaraan listrik & jaringan listrik meningkatkan permintaan tembaga jangka panjang (EV butuh 3–4x tembaga vs mobil bensin).", src: SRC.lmeCopper },
      { name: "Pasokan tambang", detail: "Gangguan tambang & biaya produksi memengaruhi harga; pasokan global ketat jangka menengah.", src: SRC.lmeCopper },
      { name: "Kurs & stok bursa (LME)", detail: "Stok London Metal Exchange & harga dolar memengaruhi harga tembaga (dikalkulasikan dalam USD).", src: SRC.lmeCopper },
    ],
    expertViews: [
      { desk: "Metals Analyst", view: "Tembaga naik = permintaan global kuat → menguntungkan mata uang komoditas seperti AUD & NZD.", signal: "Copper up = AUD/NZD up." },
      { desk: "China Desk", view: "Karena China adalah konsumen terbesar, kebijakan stimulus & aktivitas properti China sangat menentukan arah tembaga.", signal: "Watch stimulus China." },
    ],
    outlook:
      "Tembaga di ~US$6,56/lb dengan tren naik — kombinasi pasokan ketat dan ekspektasi stimulus China H2-2026. Jika paket fiskal China terealisasi dan properti stabil, tembaga bisa 7+ pada 2027 (bullish AUD/NZD/CAD & sentimen risiko global). Risiko: resesi China (CPI kembali deflasi) → tembaga turun ke 5,5–5,8 → bearish mata uang komoditas. Pantau stok LME: penurunan stok + harga naik = sinyal permintaan riil, bukan spekulasi.",
    scenarios: [
      { label: "Tembaga naik (>7)", effect: "Permintaan global kuat → AUD/NZD naik.", dir: "up", cur: "AUD·NZD" },
      { label: "Stabil", effect: "Netral.", dir: "flat", cur: "AUD·NZD" },
      { label: "Tembaga turun (<5,8)", effect: "Risiko resesi global → AUD/NZD turun.", dir: "down", cur: "AUD·NZD" },
    ],
    watch: ["Stimulus China", "Stok LME", "Data PMI manufaktur", "Aktivitas properti China"],
  },
  vix: {
    read: [
      "Indeks volatilitas/ketakutan pasar (CBOE), harian.",
      "Naik = pasar takut/volatile; turun = tenang. <15 tenang, 20–25 gelisah, >30 panic.",
      "Naiknya sering mendahului koreksi saham 2–5 hari.",
    ],
    drivers: [
      { name: "Sentimen risiko", detail: "Ketakutan & optimisme pasar menentukan level VIX.", src: SRC.cboeVix },
      { name: "Ketakutan krisis", detail: "Peristiwa besar (krisis, konflik, perang dagang) menyebabkan spike VIX.", src: SRC.cboeVix },
      { name: "Data makro besar", detail: "Rilis besar seperti FOMC & NFP (Juli 2026: kejutan NFP negatif) bisa memicu lonjakan volatilitas jangka pendek.", src: SRC.cboeVix },
    ],
    expertViews: [
      { desk: "Vol Strategist", view: "VIX tinggi = risk-off → aset aman (USD, JPY, CHF, emas) diburu; mata uang risiko (AUD, NZD, GBP) tertekan.", signal: "VIX spike = risk-off." },
      { desk: "Cross-Asset Strategist", view: "VIX adalah 'pengukur' suasana pasar. Pantau spike saat rilis hot sebagai penanda risiko & peluang.", signal: "Gunakan sebagai filter entry." },
    ],
    outlook:
      "Dengan The Fed 'hawkish on hold', pasar kerja yang rapuh, dan geopolitik Timur Tengah, volatilitas 2026H2 cenderung lebih tinggi dari 2025 — VIX kemungkinan sering menyentuh 20–25 di sekitar rilis FOMC & data kerja. Untuk trader forex: VIX >25 = hindari pair risk (AUD, NZD, GBP) & favor safe haven (USD, JPY, CHF, emas); VIX kembali <18 = environment normal untuk strategi trend. VIX adalah filter, bukan sinyal arah.",
    scenarios: [
      { label: "VIX spike (>25)", effect: "Risk-off → USD/JPY/CHF/emas naik, AUD/NZD turun.", dir: "up", cur: "USD·JPY·CHF" },
      { label: "Normal (15–20)", effect: "Netral; strategi standar.", dir: "flat", cur: "—" },
      { label: "VIX rendah (<15)", effect: "Risk-on → mata uang risiko pulih.", dir: "down", cur: "USD·JPY·CHF" },
    ],
    watch: ["Rilis FOMC & data kerja", "Geopolitik", "Saham & obligasi (korelasi cross-asset)"],
  },
  ismmfg: {
    read: [
      "ISM Manufacturing PMI = indeks komposit sektor manufaktur AS dari survei purchasing managers (ISM, ratusan perusahaan).",
      "Di atas 50 = manufaktur berekspansi; di bawah 50 = berkontraksi.",
      "Dirilis hari kerja pertama tiap bulan, 10:00 ET (21:00 WIB saat DST) — sebelum pasar AS dibuka.",
      "Komponen penting: New Orders (leading), Production, Employment, Inventories, Prices Paid.",
      "Lebih bergejolak dari ISM Services — manufaktur ±11% PDB AS, jadi bobotnya lebih kecil tapi cepat bereaksi.",
    ],
    drivers: [
      { name: "Permintaan (New Orders)", detail: "New Orders adalah komponen paling forward-looking: pesanan naik = pabrik menambah produksi & tenaga kerja. Pesanan turun biasanya mendahului pemangkasan produksi beberapa bulan.", data: "Juli 2026: 55,6 (K 54,0) — beat; Juni 53,3 (K 53,8); Mei 54,0 (K 53,3); April 52,7. Tren: manufaktur berakselerasi sejak April.", src: SRC.ism },
      { name: "Kebijakan moneter & suku bunga", detail: "Suku bunga tinggi menaikkan biaya pinjaman modal kerja & investasi mesin — rem langsung bagi manufaktur. ISM bergerak cepat terhadap perubahan ekspektasi The Fed.", data: "Fed Funds 3,75% (FOMC 16 Sep 2026); Ketua Kevin Warsh menegaskan inflasi 3,4% 'belum cukup melambat'.", src: SRC.fed },
      { name: "Perdagangan global & tarif", detail: "Tarif menaikkan biaya input impor dan mengubah aliran pesanan ekspor. Manufaktur AS sangat terpapar pada China & Zona Euro.", data: "Meski ekonomi melambat, manufaktur bertahan di atas 50 (Juni 53,3) — lebih tahan banting dari sektor jasa dalam siklus ini.", src: SRC.ism },
      { name: "Biaya & harga (Prices Paid)", detail: "Subindeks harga pembayaran menunjukkan tekanan biaya input sebelum menular ke CPI. Naik = potensi inflasi lanjutan.", data: "Per Agustus 2026 tekanan harga masih terasa — konsisten dengan CPI yang tetap di 3,4%, jauh di atas target 2%.", src: SRC.ism },
    ],
    expertViews: [
      { desk: "FX Strategist (London)", view: "ISM Mfg adalah 'nadi pertumbuhan' — kejutan di atas 55 membuat pasar harga ulang The Fed ke arah hawkish; di bawah 48 memantik trade pemangkasan.", signal: "PMI > 55 = USD bullish; < 48 = USD bearish." },
      { desk: "Head of Global Macro (New York)", view: "Baca berpasangan dengan Services: manufaktur lemah tapi jasa tetap >54 = narasi 'soft landing', bukan resesi. Sebaliknya keduanya di bawah 50 = alarm.", signal: "Mfg < 50 + Svc > 53 = soft landing." },
      { desk: "Quant / Rates Desk", view: "Implied move di rilis ISM lebih kecil dari NFP/CPI (±15–25 pips EURUSD), tapi yield 2-tahun bereaksi cepat karena ini data pertumbuhan paling dini.", signal: "Pantau yield 2Y pasca-rilis." },
    ],
    outlook:
      "Per akhir Agustus 2026: manufaktur AS berekspansi dan justru mempercepat — Juli 55,6, beat konsensus 54,0 (Juni 53,3, Mei 54,0). Dengan The Fed 'on hold' di 3,75% dan inflasi lengket di 3,4%, momentum ini mengurangi risiko resesi manufaktur; pertanyaannya apakah beat Juli lanjutan atau spike sekali? Dua rilis beruntun di bawah 50 akan mendorong pasar ke mode 'Fed harus cut' — USD rentan. Selama bertahan di atas 53, cerita pertumbuhan USD tetap utuh; risikonya datang dari subindeks New Orders jika mulai turun di bawah 50.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Manufaktur lebih kuat → ekspektasi Fed hawkish bertahan → USD naik, yield naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Reaksi terbatas; pasar menunggu ISM Services beberapa hari kemudian.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Manufaktur melemah → risiko resesi + ekspektasi cut Fed → USD turun, emas naik.", dir: "down", cur: "USD" },
    ],
    watch: ["ISM Services PMI (beberapa hari kemudian)", "Keputusan FOMC 16 Sep 2026", "Subindeks New Orders", "Yield Treasury 2 tahun"],
  },
  ismsvc: {
    read: [
      "ISM Services PMI (Non-Manufacturing) = indeks komposit sektor jasa AS — ±80% dari PDB.",
      "Di atas 50 = ekspansi. Karena jasanya dominan, ini leading indicator paling stabil utk ekonomi AS.",
      "Dirilis 3 hari kerja setelah ISM Manufacturing, 10:00 ET (21:00/22:00 WIB).",
      "Komponen penting: Business Activity, New Orders, Employment, Prices Received.",
      "Rilis Services sering menjadi 'rilis besar' bulan itu — bobotnya lebih besar daripada manufaktur.",
    ],
    drivers: [
      { name: "Konsumsi rumah tangga", detail: "Sektor jasa adalah proksi langsung belanja konsumen (makanan, kesehatan, perjalanan, jasa keuangan). Services PMI kuat = konsumsi kuat = momentum GDP.", data: "Mei 2026: 54,5 (konsensus 53,7; sebelumnya 53,6); Juni 2026: 54,0 (konsensus 54,2); Juli 2026: 54,1 (konsensus 54,5) — ekspansi solid; dua rilis terakhir di bawah konsensus.", src: SRC.ism },
      { name: "Harga (Prices Received)", detail: "Subindeks harga diterima di atas 60–70 berarti bisnis jasa menaikkan harga — pendahulu CPI. Ini alasan The Fed membaca Services dengan saksama.", data: "Rilis 5 Agu 2026: Prices 70,3 — tekanan biaya tinggi, konsisten dengan CPI 3,4% yang jauh di atas target 2%.", src: SRC.ism },
      { name: "Subindeks Employment", detail: "Employment di bawah 50 berkepanjangan = peringatan dini PHK di sektor jasa — tempat mayoritas pekerjaan AS berada. Lebih cepat bicara dari pada NFP bulanan.", data: "Juli 2026: Employment 47,4 (konsensus 51,2) — di bawah 50, sejalan dengan pasar tenaga kerja yang mendingin (NFP Juli −23 ribu).", src: SRC.ism },
      { name: "Kebijakan The Fed", detail: "Sektor jasa adalah 'mandat kedua' The Fed dalam praktiknya: jasa kuat + inflasi lengket = pemangkasan ditunda. Kombinasi inilah yang menahan USD.", data: "Fed 3,75% dengan konsensus 'on hold ber ekor hawkish' menuju FOMC 16 Sep 2026.", src: SRC.fed },
    ],
    expertViews: [
      { desk: "FX Strategist (London)", view: "Services adalah angka yang lebih besar — 80% PDB. Kejutan di atas 55 lebih menentukan arah USD daripada beat manufaktur.", signal: "Svc > 55 = USD bullish." },
      { desk: "Head of Global Macro (New York)", view: "Services di atas 54 dengan Prices di atas 70 = The Fed tidak punya alasan untuk cut. Itu kombinasi yang menopang dolar.", signal: "Svc tinggi + Prices tinggi = hawkish-friendly." },
      { desk: "Emerging Markets Macro", view: "Ekonomi jasa yang kuat menahan yield tinggi lebih lama — buruk bagi mata uang EM yang tertekan dolar.", signal: "Svc kuat = USD/EM naik." },
    ],
    outlook:
      "Per Agustus 2026: sektor jasa berada di ekspansi paling solid di antara indikator AS (Juli 54,1, naik dari 54,0) — tetapi dua komponen memberi peringatan: Employment 47,4 (di bawah 50, konsensus 51,2) dan dua rilis beruntun di bawah konsensus. Jika Employment turun di bawah 47 atau Business Activity menembus bawah 52, narasi 'soft landing' akan diuji dan USD rentan. Selama headline bertahan di atas 53 dengan Prices di atas 70, cerita Fed hawkish berlanjut dan USD tetap terdukung.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Jasa lebih kuat → ekspektasi Fed hawkish → USD naik, yield naik, emas tertekan.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral; pasar membaca subindeks Employment & Prices.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Jasa melambat → ekspektasi pemangkasan menguat → USD turun, EM & emas naik.", dir: "down", cur: "USD" },
    ],
    watch: ["ISM Manufacturing PMI", "Subindeks Employment", "FOMC 16 Sep 2026", "CPI core bulan berjalan"],
  },
};

export function getEducation(id) {
  return EDUCATION[id] || null;
}
