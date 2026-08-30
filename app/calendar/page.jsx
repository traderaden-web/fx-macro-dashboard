import CalendarClient from "../../components/CalendarClient";
import { UPCOMING } from "../../data/calendar";
import { CONSENSUS } from "../../data/releases";
import { fetchLiveCalendar } from "../../lib/provider";
import { getSeries } from "../../lib/series";
import { getSeedSeries } from "../../lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kalender Ekonomi — MacroLab",
  description: "Jadwal rilis data makro yang berdampak pada pasar valuta asing, lengkap dengan konsensus & aktual.",
};

export default async function CalendarPage() {
  // 1) Ambil event live dari ForexFactory (scrape). Bila tak terjangkau, fallback ke jadwal lokal.
  let live = [];
  let liveSource = false;
  try {
    live = await fetchLiveCalendar();
    liveSource = live.length > 0;
  } catch {
    live = [];
  }

  // 2) Gabungkan dengan jadwal lokal (FOMC, BLS, NFP dll yang sudah disusun per tahun).
  const merged = {};
  const addLocal = (e) => {
    const iso = e.iso;
    const key = iso.slice(0, 10) + "|" + e.title;
    if (!merged[key]) {
      // Angka yang tersedia secara lokal untuk event ini:
      //   P (previous) = nilai terakhir SEBELUM tanggal rilis (seed FRED) —
      //                  yaitu angka yang akan "digantikan" rilis berikutnya.
      //   K (forecast) = konsensus bila ada riwayat yang cocok dengan periode rilis.
      //   A (actual)   = hanya dari live ForexFactory (event menimpa di bawah) —
      //                  untuk event yang sudah RELEASED, angka lengkapnya tampil
      //                  otomatis begitu data live/capture tersedia.
      let previous = null;
      let forecast = null;
      if (e.indicatorId) {
        const d = iso.slice(0, 10);
        const pts = getSeedSeries(e.indicatorId)?.points || [];
        for (const p of pts) {
          if (p.date < d) previous = p.value;
          else break;
        }
        const period = d.slice(0, 8) + "01"; // periode rilis (awal bulan)
        const cons = (CONSENSUS[e.indicatorId] || []).find((c) => c.date === period);
        if (cons && cons.consensus != null) forecast = cons.consensus;
      }
      merged[key] = { ...e, iso, forecast, actual: null, previous };
    }
  };
  UPCOMING.forEach(addLocal);
  // Live (ForexFactory) — lebih detail, menimpa bila ada yang sama.
  for (const e of live) {
    if (!e.dateIso) continue;
    const key = e.dateIso.slice(0, 10) + "|" + e.title;
    // Taruh kategori dari indikator terkait (misal CPI → inflasi), bila ada.
    const series = e.indicatorId ? getSeries(e.indicatorId) : null;
    merged[key] = { ...e, iso: e.dateIso, category: series?.category || e.category };
  }

  // 3) Tampilkan seluruh rilis (sudah lewat & akan datang). Pengguna bisa
  //    mempersempit lewat filter jendela tanggal di sisi klien.
  const events = Object.values(merged).sort((a, b) => a.iso.localeCompare(b.iso));

  return (
    <>
      <section className="hero section-fade" style={{ paddingTop: 20 }}>
        <h1>Kalender Ekonomi</h1>
        <p>
          Jadwal rilis data makro yang berdampak pada pasar valuta asing. Waktu dalam <strong>WIB (UTC+7)</strong>.
          Tampilan default <strong>"Terkini"</strong> menampilkan rilis dari <strong>3 hari terakhir hingga 30 hari ke depan</strong> —
          termasuk yang sudah lewat (terlihat redup) dan yang akan datang. Pilih <strong>"Semua"</strong> untuk seluruh rilis.
          Setiap baris menampilkan <strong>P</strong> (previous), <strong>K</strong> (forecast/konsensus), dan <strong>A</strong> (actual)
          — untuk jadwal yang sudah <strong>RELEASED</strong>, angka lengkap yang sudah keluar langsung tampil di barisnya.
        </p>
        <div className="notice">
          {liveSource ? (
            <>🔗 Data kalender ditarik <strong>live dari ForexFactory</strong> (actual, konsensus, & previous) — termasuk
            event pasar seperti simposium & pidato pejabat bank sentral.</>
          ) : (
            <>ℹ️ Data kalender disusun dari kalender resmi (BLS, Federal Reserve) & agenda pasar. Dalam lingkungan ini host
            ForexFactory tidak dapat dihubungi, sehingga memakai jadwal lokal. Di produksi, data live (termasuk event
            seperti Jackson Hole & pidato pejabat) akan otomatis aktif.</>
          )}{" "}
          Selalu verifikasi ke sumber resmi karena jadwal bisa berubah.
        </div>
      </section>

      <CalendarClient events={events} />
    </>
  );
}
