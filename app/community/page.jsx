import CommunityClient from "../../components/CommunityClient";
import { IconUsers, IconTarget } from "../../components/Icons";

export const metadata = {
  title: "Komunitas & Leaderboard Prediksi — MacroLab",
  description:
    "Bagikan prediksi Anda untuk rilis penting (NFP, CPI, FOMC), lihat akurasi historis & leaderboard trader — dan tingkatkan skill Anda bersama komunitas.",
};

export default function CommunityPage() {
  return (
    <div className="page">
      <header className="detail-head">
        <div className="detail-title-row">
          <span className="brand-mark" style={{ width: 40, height: 40 }}>CM</span>
          <div>
            <h1>Komunitas &amp; Leaderboard Prediksi</h1>
            <p className="cell-muted" style={{ margin: 0, maxWidth: 720 }}>
              Ikut <b>menebak angka rilis</b> (NFP, CPI, FOMC) sebelum keluar. Setelah rilis, prediksi
              dinilai terhadap <b>ACTUAL</b> dan Anda naik ke leaderboard — pelajari siapa yang paling
              jitu &amp; kenapa.
            </p>
          </div>
        </div>
        <div className="tags">
          <span className="badge cat"><IconUsers size={13} /> Komunitas</span>
          <span className="badge cat"><IconTarget size={13} /> Leaderboard</span>
          <span className="badge cat">Prediksi Rilis</span>
        </div>
      </header>
      <CommunityClient />
    </div>
  );
}
