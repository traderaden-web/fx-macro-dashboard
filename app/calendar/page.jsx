import CalendarClient from "../../components/CalendarClient";
import { UPCOMING } from "../../data/calendar";
import { CONSENSUS } from "../../data/releases";
import { fetchLiveCalendar } from "../../lib/provider";
import { getSeries, CATEGORIES, COUNTRIES } from "../../lib/series";
import { getSeedSeries } from "../../lib/data";
import { getReleaseAnalytics } from "../../lib/consensus";
import { getEducation, GENERAL } from "../../lib/education";

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
      //   A (actual)   = titik seed utk periode obs bila rilisnya sudah lewat
      //                  (data verified) — atau dari live ForexFactory bila aktif.
      let previous = null;
      let forecast = null;
      let actual = null;
      if (e.indicatorId) {
        const d = iso.slice(0, 10);
        const pts = getSeedSeries(e.indicatorId)?.points || [];
        // c.date kini = tanggal rilis riil → cocokkan persis dengan tanggal event.
        const cons = (CONSENSUS[e.indicatorId] || []).find((c) => c.date === d);
        if (cons && cons.consensus != null) forecast = cons.consensus;
        // Event sudah RELEASED (ada titik seed utk obs-nya):
        //   A (actual)  = titik seed utk periode obs;
        //   P (previous) = titik SEBELUM obs (bukan sekadar titik sebelum tgl rilis).
        const i = cons && cons.obs ? pts.findIndex((pt) => pt.date === cons.obs) : -1;
        if (i >= 0) {
          actual = pts[i].value;
          previous = i > 0 ? pts[i - 1].value : null;
        } else {
          // Belum rilis → P = nilai terakhir yang akan "digantikan".
          for (const p of pts) {
            if (p.date < d) previous = p.value;
            else break;
          }
        }
      }
      merged[key] = { ...e, iso, forecast, actual, previous };
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

  // 4) Detail indikator untuk POPUP "Detail indikator" (tanpa pindah halaman):
  //    analytics (points + releases + accuracy) + edukasi + jadwal, per indicatorId.
  const ids = [...new Set(events.map((e) => e.indicatorId).filter(Boolean))];
  const analyticsAll = await Promise.all(ids.map((id) => getReleaseAnalytics(id).catch(() => null)));
  const details = {};
  ids.forEach((id, i) => {
    const a = analyticsAll[i];
    if (!a) return;
    details[id] = {
      data: a,
      releases: a.releases,
      accuracy: a.accuracy,
      source: a.source,
      edu: getEducation(id),
      general: GENERAL,
      cat: CATEGORIES.find((c) => c.id === a.category),
      country: COUNTRIES.find((c) => c.id === a.country),
      upcoming: UPCOMING.filter((e) => e.indicatorId === id)
        .sort((x, y) => x.iso.localeCompare(y.iso))
        .slice(0, 3),
    };
  });

  return (
    <>
      <section className="hero section-fade" style={{ paddingTop: 20 }}>
        <h1>Kalender Ekonomi</h1>
        <p>
          Jadwal rilis data makro yang berdampak pada pasar valuta asing. Waktu dalam <strong>WIB (UTC+7)</strong>.
          Tampilan default <strong>"Terkini"</strong> menampilkan rilis dari <strong>30 hari terakhir hingga 45 hari ke depan</strong> —
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

      <CalendarClient events={events} details={details} />
    </>
  );
}
