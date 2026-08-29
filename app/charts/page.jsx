// app/charts/page.jsx
// Halaman chart Gold, Forex & Komoditas — chart interaktif dari embed
// resmi TradingView (gratis, tanpa API key) + strip berita berdampak tinggi.

import ChartsClient from "../../components/ChartsClient";
import { getMarketNews } from "../../lib/news";

export const metadata = {
  title: "Chart Gold, Forex & Komoditas — MacroLab",
  description:
    "Chart live Gold (XAU/USD), perak, minyak, tembaga, dan dolar dari TradingView — lengkap dengan berita yang paling berdampak.",
};

// Berita strip di-render fresh setiap kali diakses (data tetap ter-cache 10 menit di server).
export const dynamic = "force-dynamic";

export default async function ChartsPage() {
  const { items } = await getMarketNews(8);
  return <ChartsClient news={items} />;
}
