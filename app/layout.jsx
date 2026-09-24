import "./globals.css";
import Shell from "../components/Shell";
import TermFx from "../components/TermFx";

export const metadata = {
  title: "MacroLab — Command Center Data & Analisis untuk Trader Forex",
  description:
    "Pusat data & analisis terlengkap untuk ritel trader forex: makroekonomi (NFP, CPI, PPI, FOMC), analisis teknikal multi-timeframe, analisis fundamental, kalender ekonomi, kekuatan mata uang, risk appetite, watchlist & alert, kalkulator trader, dan asisten AI.",
};

export const viewport = {
  themeColor: "#04060c",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800;900&family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <TermFx />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
