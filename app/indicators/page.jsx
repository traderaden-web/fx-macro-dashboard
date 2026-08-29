import { getAllSeriesData } from "../../lib/data";
import { CATEGORIES } from "../../lib/series";
import IndicatorsClient from "../../components/IndicatorsClient";

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
          {all.length} indikator dari berbagai ekonomi. Gunakan filter untuk mencari, dan urutkan berdasarkan
          dampak (High → Low), kategori, atau nama. Klik baris untuk melihat analisis &amp; data lengkap.
        </p>
        <div className="legend">
          {CATEGORIES.map((c) => (
            <span key={c.id}><span className="dot" style={{ background: c.color }} /> {c.label}</span>
          ))}
        </div>
      </section>

      <section className="section">
        <IndicatorsClient items={all} />
      </section>
    </>
  );
}
