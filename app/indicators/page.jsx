import { getAllSeriesData } from "../../lib/data";
import IndicatorsClient from "../../components/IndicatorsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Semua Indikator — MacroLab",
  description: "Daftar lengkap indikator makro ekonomi dengan filter kategori, negara, dan urutan dampak.",
};

export default async function IndicatorsPage() {
  const all = await getAllSeriesData();

  return (
    <>
      <section className="hero section-fade" style={{ paddingTop: 20 }}>
        <h1>Semua Indikator</h1>
        <p>
          {all.length} indikator makro dari berbagai ekonomi — nilai terbaru, perubahan, tren 12 periode,
          dan tingkat dampak pasar. Saring berdasarkan kategori, dampak, negara, atau cari langsung;
          <strong> klik baris untuk membuka detail terminal</strong> (riwayat, konsensus vs actual, edukasi).
        </p>
      </section>

      <section className="section">
        <IndicatorsClient items={all} />
      </section>
    </>
  );
}
