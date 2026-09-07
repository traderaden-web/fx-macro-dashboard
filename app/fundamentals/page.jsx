import FundamentalsDashboard from "../../components/FundamentalsDashboard";
import { IconAnalytics } from "../../components/Icons";

export const metadata = {
  title: "Analisis Fundamental — MacroLab",
  description:
    "Bias fundamental per mata uang dari data makro resmi dan harga pasar terbaru, dengan scenario planner untuk rilis penting.",
};

// Snapshot diambil oleh klien dari /api/fundamentals tanpa HTTP cache dan
// diperbarui berkala. Halaman ini tidak menyimpan angka makro statis saat build.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function FundamentalsPage() {
  return (
    <div className="page">
      <header className="detail-head">
        <div className="detail-title-row">
          <span className="brand-mark" style={{ width: 40, height: 40 }}>FU</span>
          <div>
            <h1>Analisis Fundamental</h1>
            <p className="cell-muted" style={{ margin: 0, maxWidth: 720 }}>
              Pahami <b>mengapa</b> mata uang bergerak melalui suku bunga, inflasi, pertumbuhan,
              pasar kerja, dan harga pasar. Snapshot mengecek publikasi resmi terbaru secara otomatis
              serta menandai data fallback secara transparan.
            </p>
          </div>
        </div>
        <div className="tags">
          <span className="badge cat"><IconAnalytics size={13} /> Bias Fundamental</span>
          <span className="badge cat">Auto refresh 5 menit</span>
          <span className="badge cat">Sumber &amp; status data</span>
        </div>
      </header>

      <FundamentalsDashboard />
    </div>
  );
}
