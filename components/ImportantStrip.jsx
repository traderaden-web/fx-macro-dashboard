// components/ImportantStrip.jsx
// Strip "Berita Penting" — baris berita utama yang disorot di bagian atas halaman /news.
// Komponen server; memanggil getTopNews() lalu menampilkan kartu ringkas.
import Link from "next/link";
import { getTopNews } from "../lib/news";

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default async function ImportantStrip() {
  const { items } = await getTopNews(6);
  if (!items || !items.length) return null;

  return (
    <section className="section" style={{ marginTop: 8, marginBottom: 24 }}>
      <div className="section-head">
        <h2>
          <span className="strip-ico" aria-hidden="true">★</span> Berita Penting
        </h2>
        <Link href="/#berita" className="see-all">Lihat di beranda →</Link>
      </div>
      <div className="strip-wrap">
        {items.map((n) => (
          <a key={n.id} href={n.link} target="_blank" rel="noopener noreferrer" className="strip-card">
            <span className="strip-badge">Penting</span>
            <span className="strip-title">{n.title}</span>
            <span className="strip-meta">{n.source} · {timeAgo(n.iso)}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
