// components/TopNews.jsx
// Widget "Berita Penting" untuk beranda — 5 berita utama (kategori kunci) terbaru.
// Komponen server; memanggil getTopNews() lalu menampilkan sebagai daftar ringkas.
import Link from "next/link";
import { getTopNews } from "../lib/news";
import { IconNews } from "./Icons";

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

export default async function TopNews() {
  const { items, source } = await getTopNews(5);
  if (!items || !items.length) return null;

  return (
    <section className="section" id="berita">
      <div className="section-head">
        <h2>
          <span className="inline-ico" aria-hidden="true"><IconNews size={15} /></span>{" "}
          Berita Penting
        </h2>
        <Link href="/news" className="see-all">Semua berita →</Link>
      </div>
      <div className="card">
        <ul className="topnews-list">
          {items.map((n) => (
            <li key={n.id}>
              <a href={n.link} target="_blank" rel="noopener noreferrer" className="topnews-item">
                <span className="topnews-title">
                  {n.impact?.level === "kritis" && <span className="impact-badge kritis" title={`Topik: ${n.impact.tags.join(", ")}`}>🔥</span>}
                  {n.title}
                </span>
                <span className="topnews-meta">{n.source} · {timeAgo(n.iso)}</span>
              </a>
            </li>
          ))}
        </ul>
        {source === "seed" && (
          <p className="cell-muted" style={{ margin: "10px 0 0", fontSize: 12 }}>
            Menampilkan data cadangan (sumber live tak terjangkau saat ini).
          </p>
        )}
      </div>
    </section>
  );
}
