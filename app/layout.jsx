import "./globals.css";
import Header from "../components/Header";
import ForexTicker from "../components/ForexTicker";
import TermFx from "../components/TermFx";

export const metadata = {
  title: "MacroLab — Data Makroekonomi untuk Trader Forex",
  description:
    "Dashboard makroekonomi untuk trader forex: kalender ekonomi (NFP, CPI, PPI, FOMC), data historis, dan analisis dampak terhadap mata uang.",
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
