import BrokerClient from "../../components/BrokerClient";
import { IconWallet } from "../../components/Icons";

export const metadata = {
  title: "Broker & Portfolio — MacroLab",
  description:
    "Sinkronkan posisi nyata trading Anda lewat MetaAPI (MetaTrader MT4/MT5): balance, equity, margin, posisi terbuka & order tertunda — plus mode paper untuk simulasi.",
};

export default function BrokerPage() {
  return (
    <div className="page">
      <header className="detail-head">
        <div className="detail-title-row">
          <span className="brand-mark" style={{ width: 40, height: 40 }}>BK</span>
          <div>
            <h1>Broker &amp; Portfolio</h1>
            <p className="cell-muted" style={{ margin: 0, maxWidth: 720 }}>
              Hubungkan akun <b>MetaTrader (MT4/MT5)</b> via <b>MetaAPI</b> agar <b>posisi nyata</b>,
              equity &amp; margin Anda tersinkron ke MacroLab. Belum sempat connect? Gunakan
              <b> mode paper</b> untuk simulasi tampilan. Bersifat <b>read-only</b> — tidak ada
              order yang dieksekusi otomatis.
            </p>
          </div>
        </div>
        <div className="tags">
          <span className="badge cat"><IconWallet size={13} /> MetaAPI</span>
          <span className="badge cat">Real-time Sync</span>
          <span className="badge cat">Paper Mode</span>
        </div>
      </header>
      <BrokerClient />
    </div>
  );
}
