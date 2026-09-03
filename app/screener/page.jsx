import ScreenerClient from "../../components/ScreenerClient";
import { IconChart } from "../../components/Icons";

export const metadata = {
  title: "Pattern Screener — MacroLab",
  description:
    "Scan otomatis pola candlestick (engulfing, pin bar, doji, inside bar, three soldiers) + breakout untuk semua pasangan forex, gold & komoditas.",
};

export default function ScreenerPage() {
  return (
    <div className="page">
      <header className="detail-head">
        <div className="detail-title-row">
          <span className="brand-mark" style={{ width: 40, height: 40 }}>SC</span>
          <div>
            <h1>Pattern Screener</h1>
            <p className="cell-muted" style={{ margin: 0, maxWidth: 720 }}>
              Mesin pemindai yang <b>scan semua pasangan otomatis</b> untuk pola candlestick
              (engulfing, pin bar, doji, inside bar, three soldiers) &amp; breakout. Klik kartu
              untuk melihat detail pola per timeframe, lalu buka chart untuk konfirmasi.
            </p>
          </div>
        </div>
        <div className="tags">
          <span className="badge cat"><IconChart size={13} /> Engulfing</span>
          <span className="badge cat">Pin Bar</span>
          <span className="badge cat">Doji</span>
          <span className="badge cat">Inside Bar</span>
          <span className="badge cat">Breakout</span>
        </div>
      </header>
      <ScreenerClient />
    </div>
  );
}
