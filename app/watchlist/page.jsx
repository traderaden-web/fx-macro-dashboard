import WatchlistClient from "../../components/WatchlistClient";
import { IconWallet } from "../../components/Icons";

export const metadata = {
  title: "Watchlist & Alerts — MacroLab",
  description:
    "Pantau instrumen favorit Anda dan pasang price alert + notifikasi browser untuk forex, emas & perak.",
};

export default function WatchlistPage() {
  return (
    <div className="page">
      <header className="detail-head">
        <div className="detail-title-row">
          <span className="brand-mark" style={{ width: 40, height: 40 }}>WL</span>
          <div>
            <h1>Watchlist &amp; Alerts</h1>
            <p className="cell-muted" style={{ margin: 0, maxWidth: 720 }}>
              Buat daftar instrumen yang Anda pantau dan pasang alert harga. Saat harga menyentuh
              target, Anda akan menerima notifikasi browser dan bunyi — langsung bisa ambil aksi.
            </p>
          </div>
        </div>
        <div className="tags">
          <span className="badge cat"><IconWallet size={13} /> Watchlist</span>
          <span className="badge cat">Price Alerts</span>
          <span className="badge cat">Notifikasi Browser</span>
        </div>
      </header>
      <WatchlistClient />
    </div>
  );
}
