import AnalysisClient from "../../components/AnalysisClient";
import AssetHeatmap from "../../components/AssetHeatmap";
import MacroMap from "../../components/MacroMap";
import { getAllReleaseAnalytics } from "../../lib/consensus";
import { UPCOMING } from "../../data/calendar";

export const metadata = {
  title: "Analisis Dampak Rilis — MacroLab",
  description: "Bandingkan konsensus vs actual untuk tiap rilis ekonomi dan lihat dampaknya terhadap pasangan mata uang.",
};

export default async function AnalysisPage() {
  const items = await getAllReleaseAnalytics();
  return (
    <>
      <section className="hero section-fade">
        <h1>Analisis Konsensus vs Actual &amp; Dampak Pair</h1>
        <p>
          Bandingkan estimasi analis (konsensus) dengan nilai aktual tiap rilis, hitung besarnya
          &ldquo;kejutan&rdquo; (surprise), lalu lihat arah &amp; kekuatan dampaknya terhadap pasangan mata uang.
        </p>
        <div className="notice">
          ℹ️ Nilai konsensus utama berasal dari penyedia live (ForexFactory) bila dapat dijangkau; bila tidak,
          memakai estimasi demo. Nilai aktual &amp; sebelumnya ditarik otomatis dari FRED.
        </div>
      </section>

      <div className="section-fade">
        <AssetHeatmap />
        <MacroMap />
      </div>

      {items.length ? (
        <AnalysisClient items={items} upcoming={UPCOMING} />
      ) : (
        <p className="cell-muted">Belum ada data rilis tersedia. Jalankan <code>npm run fetch</code> untuk memperbarui.</p>
      )}
    </>
  );
}
