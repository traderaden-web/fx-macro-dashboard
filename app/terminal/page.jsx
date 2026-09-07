// app/terminal/page.jsx
// TERMINAL — halaman gabungan: Teknikal + Screener + Chart jadi SATU.
// Sinyal SL/TP terukur · SMC/ICT · SNR · Breakout · Chart Pattern · 7 timeframe.
// (Halaman lama /technicals /screener /charts me-redirect ke sini.)

import TerminalClient from "../../components/terminal/TerminalClient";
import { getMarketNews } from "../../lib/news";
import { UPCOMING } from "../../data/calendar";

export const metadata = {
  title: "Terminal Teknikal Pro — Sinyal SL/TP, SMC/ICT, SNR, Chart Pattern & Screener — MacroLab",
  description:
    "Terminal teknikal lengkap dalam satu halaman: sinyal terukur (Entry, Stop Loss, TP1/2/3, R:R), struktur SMC (BOS/CHoCH, Order Block, FVG), ICT (Premium/Discount, OTE), Support-Resistance, Breakout, Chart Pattern bullish/bearish, matriks 7 timeframe, dan screener 11 instrumen.",
};

// Berita & kalender di-render fresh setiap akses (ter-cache 10 menit di server).
export const dynamic = "force-dynamic";

export default async function TerminalPage() {
  const { items } = await getMarketNews(15);
  return <TerminalClient news={items} upcoming={UPCOMING} />;
}
