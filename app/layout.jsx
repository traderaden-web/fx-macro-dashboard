import "./globals.css";
import Header from "../components/Header";
import ForexTicker from "../components/ForexTicker";
import TermFx from "../components/TermFx";

export const metadata = {
  title: "MacroLab — Command Center Data & Analisis untuk Trader Forex",
  description:
    "Pusat data & analisis terlengkap untuk ritel trader forex: makroekonomi (NFP, CPI, PPI, FOMC), analisis teknikal multi-timeframe, analisis fundamental, kalender ekonomi, kekuatan mata uang, risk appetite, watchlist & alert, kalkulator trader, dan asisten AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <TermFx />
        <Header />
        <ForexTicker />
        <main className="main">{children}</main>
        <footer className="footer">
          <div className="footer-inner">
            <span className="footer-line">MacroLab — dibangun untuk trader forex</span>
            <span className="footer-line footer-brand">Build With <strong>AD TRADER FOREX</strong> — Copyright 2026.</span>
            <span className="footer-muted">Sumber utama: FRED (Federal Reserve Economic Data) &amp; jadwal rilis resmi BLS / Federal Reserve.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
