import TechnicalsClient from "../../components/TechnicalsClient";
import { IconGauge } from "../../components/Icons";

export const metadata = {
  title: "Analisis Teknikal — MacroLab",
  description:
    "Matriks sinyal teknikal multi-timeframe (EMAs, RSI, MACD, ATR) untuk forex, gold, komoditas & indeks — dengan skor confluence dan grade setup.",
};

const FEATURES = [
  { k: "EMA 20/50", d: "Tren: di atas/campur, penentu arah utama." },
  { k: "RSI 14", d: "Momentum: jenuh beli/jual untuk antisipasi balik arah." },
  { k: "MACD", d: "Momentum & konfirmasi pergeseran tren." },
  { k: "ATR", d: "Volatilitas: untuk menempatkan stop loss & target yang adil." },
];

export default function TechnicalsPage() {
  return (
    <div className="page">
      <header className="detail-head">
        <div className="detail-title-row">
          <span className="brand-mark" style={{ width: 40, height: 40 }}>TA</span>
          <div>
            <h1>Analisis Teknikal</h1>
            <p className="cell-muted" style={{ margin: 0, maxWidth: 720 }}>
              Scan sinyal multi-timeframe untuk semua instrumen sekaligus. Setiap baris menggabungkan
              EMA 20/50, RSI, MACD &amp; ATR dari 7 timeframe (15m → 1M) menjadi satu skor confluence
              dan grade setup — jadi Anda bisa langsung tahu apa yang sedang selaras.
            </p>
          </div>
        </div>
        <div className="tags">
          {FEATURES.map((f) => (
            <span className="badge cat" key={f.k}><IconGauge size={13} /> {f.k}</span>
          ))}
        </div>
      </header>

      <TechnicalsClient />
    </div>
  );
}
