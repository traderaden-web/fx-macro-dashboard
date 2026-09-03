import "./globals.css";
import Shell from "../components/Shell";
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
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
