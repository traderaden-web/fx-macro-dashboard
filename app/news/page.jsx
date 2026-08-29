import NewsClient from "../../components/NewsClient";
import ImportantStrip from "../../components/ImportantStrip";
import { getNews } from "../../lib/news";
import { IconGlobe } from "../../components/Icons";

export const metadata = {
  title: "Berita Pasar Terkini — MacroLab",
  description: "Berita utama pasar global & valuta asing terkini dari Reuters, Investing.com, dan FXStreet.",
};

// Selalu render live saat diminta (jangan di-prerender statis di build),
// supaya berita segar dari Google News tampil, bukan data cadangan.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewsPage() {
  const { items, source, updated } = await getNews();

  return (
    <>
      <section className="hero section-fade" style={{ paddingTop: 20 }}>
        <h1>Berita Pasar Terkini</h1>
        <p>
          Kabar penting yang menggerakkan pasar global &amp; valuta asing terlengkap dan{" "}
          terupdate saat ini.
        </p>
        <div className="notice">
          🔴 Berita ditarik <strong>live</strong> &amp; diperbarui otomatis (cache ±10 menit). Klik judul untuk
          membuka artikel asli di tab baru.
          {updated ? ` · Diperbarui ${new Date(updated).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}` : ""}
        </div>
        <div className="legend" style={{ marginTop: 16 }}>
          <span><IconGlobe size={14} /> Sumber agregator: Google News RSS</span>
        </div>
      </section>

      <ImportantStrip />

      <NewsClient items={items} source={source} updated={updated} />
    </>
  );
}
