import { getAllSeriesData, latestUpdated } from "../../lib/data";
import IndicatorsClient from "../../components/IndicatorsClient";

// Dirender per request: FRED live (cache ≤ 30 menit, 3 menit di jendela rilis).
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Semua Indikator — MacroLab",
  description: "Daftar lengkap indikator makro ekonomi dengan filter kategori, negara, dan urutan dampak.",
};

export default async function IndicatorsPage() {
  const all = await getAllSeriesData();
  const asOf = latestUpdated(all);
  const live = all.filter((d) => d.source === "live").length;

  return (
    <>
      <section className="hero section-fade" style={{ paddingTop: 20 }}>
        <h1>Semua Indikator</h1>
        <p>
          {all.length} indikator makro dari berbagai ekonomi — nilai terbaru, perubahan, tren 12 periode,
          dan tingkat dampak pasar. Saring berdasarkan kategori, dampak, negara, atau cari langsung;
          <strong> klik baris untuk membuka detail terminal</strong> (riwayat, konsensus vs actual, edukasi).
        </p>
        <div className="notice">
          {live > 0 ? (
            <>🔗 {live}/{all.length} seri ditarik <strong>langsung dari FRED</strong> saat halaman ini dibuka; sisanya dari cache
            yang diperbarui otomatis. Angka rilis baru muncul beberapa menit setelah FRED memuatnya.</>
          ) : (
            <>ℹ️ Data dari cache FRED (diperbarui otomatis tiap beberapa jam &amp; setelah jam rilis AS). Data terakhir diambil{" "}
            {asOf ? `${asOf.slice(0, 10)} ${asOf.slice(11, 16)} UTC` : "—"}.</>
          )}
        </div>
      </section>

      <section className="section">
        <IndicatorsClient items={all} asOf={asOf} />
      </section>
    </>
  );
}
