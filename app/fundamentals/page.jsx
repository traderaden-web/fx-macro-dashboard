import FundamentalsDashboard from "../../components/FundamentalsDashboard";
import { getFundamentalsBoardData } from "../../lib/fundamentalsData";
import { IconAnalytics } from "../../components/Icons";

export const metadata = {
  title: "Fundamental — MacroLab",
  description:
    "Papan fundamental lengkap: suku bunga 11 bank sentral, inflasi vs target, bias per mata uang, fokus Rupiah (BI-Rate, BPS) & simulasi rilis.",
};

// Dirender per request agar angka awal (FRED, ForexFactory, Yahoo) segar;
// klien lalu menyegarkan otomatis tiap 5 menit via /api/fundamentals/board.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FundamentalsPage() {
  const initial = await getFundamentalsBoardData().catch(() => null);

  return (
    <div className="page">
      <header className="detail-head">
        <div className="detail-title-row">
          <span className="brand-mark" style={{ width: 40, height: 40 }}>FU</span>
          <div>
            <h1>Fundamental</h1>
            <p className="cell-muted" style={{ margin: 0, maxWidth: 780 }}>
              Papan lengkap <b>mengapa mata uang bergerak</b>: suku bunga 11 bank sentral, inflasi vs target,
              bias per mata uang, sorotan khusus <b>Rupiah 🇮🇩</b>, dan radar rilis dengan simulasi dampak —
              semua bertanda sumber &amp; tanggal.
            </p>
          </div>
        </div>
        <div className="tags">
          <span className="badge cat"><IconAnalytics size={13} /> Bias Fundamental</span>
          <span className="badge cat">Auto refresh 5 menit</span>
          <span className="badge cat">🇮🇩 Fokus Rupiah</span>
          <span className="badge cat">📡 Radar Rilis + Simulasi</span>
        </div>
      </header>

      <FundamentalsDashboard initial={initial} />
    </div>
  );
}
