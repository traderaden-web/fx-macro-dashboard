// app/charts/page.jsx
// Pro Terminal: COT + sesi pasar + kalender High-impact + chart TradingView
// + News Event per aset. Chart live dari embed resmi TradingView.

import ChartsClient from "../../components/ChartsClient";
import { getMarketNews } from "../../lib/news";
import { UPCOMING } from "../../data/calendar";

export const metadata = {
  title: "Pro Terminal — Chart Gold, Forex & Komoditas",
  description:
    "Pro Terminal MacroLab: positioning institusional CFTC COT (XAU/DXY), sesi pasar live WIB, kalender ekonomi High-impact, chart TradingView, dan News Event per aset.",
};

// Berita & kalender di-render fresh setiap kali diakses (data tetap ter-cache
// 10 menit di server). `15` item agar filter per aset tetap punya bahan cukup.
export const dynamic = "force-dynamic";

export default async function ChartsPage() {
  const { items } = await getMarketNews(15);
  return <ChartsClient news={items} upcoming={UPCOMING} />;
}
