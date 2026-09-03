import CalculatorClient from "../../components/CalculatorClient";
import { IconCalculator } from "../../components/Icons";

export const metadata = {
  title: "Kalkulator Trader — MacroLab",
  description:
    "Position size, pip value, profit/loss, pivot points & Fibonacci — kalkulator lengkap untuk ritel trader forex.",
};

export default function CalculatorsPage() {
  return (
    <div className="page">
      <header className="detail-head">
        <div className="detail-title-row">
          <span className="brand-mark" style={{ width: 40, height: 40 }}>CT</span>
          <div>
            <h1>Kalkulator Trader</h1>
            <p className="cell-muted" style={{ margin: 0, maxWidth: 720 }}>
              Hitung ukuran posisi &amp; risiko, nilai pip, profit/loss, pivot points, dan level
              Fibonacci secara akurat sebelum menempatkan order — semua perhitungan berjalan
              instan di browser Anda.
            </p>
          </div>
        </div>
        <div className="tags">
          <span className="badge cat"><IconCalculator size={13} /> Position Size</span>
          <span className="badge cat">Risk Management</span>
          <span className="badge cat">Pivot &amp; Fib</span>
        </div>
      </header>

      <div className="calc-wrap">
        <CalculatorClient />
      </div>

      <section className="section">
        <div className="section-head">
          <h2>Mengapa manajemen risiko itu penting</h2>
        </div>
        <div className="info-grid">
          <div className="info-block">
            <h4>Aturan 1–2%</h4>
            <p>
              Batasi risiko per trade pada 1–2% dari saldo. Dengan risiko 1% dan akun $10.000,
              Anda hanya mempertaruhkan $100 per trade — cukup untuk bertahan dari 10 kekalahan
              beruntun tanpa menghabiskan modal.
            </p>
          </div>
          <div className="info-block">
            <h4>Berhenti sebesar pip, bukan emosi</h4>
            <p>
              Stop loss sebaiknya diletakkan pada level teknikal (struktur, swing low/high), bukan
              angka acak. Gunakan ATR atau level pivot untuk menentukan jarak yang "adil".
            </p>
          </div>
          <div className="info-block">
            <h4>Rasio Risk:Reward</h4>
            <p>
              Target minimal 1:2. Jika risiko 30 pips, target minimum 60 pips. Dengan win-rate 40%
              dan rasio 1:2, Anda tetap profitabel.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
