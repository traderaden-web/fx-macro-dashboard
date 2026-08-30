// components/NewsModal.jsx
// Popup berita: klik item News Event → modal menampilkan isi artikel
// (diekstrak server-side dari situs sumber) + tombol buka di sumber asli.

"use client";

import { useEffect, useState } from "react";

function timeAgo(iso) {
  if (!iso) return "";
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.round(h / 24)} hari lalu`;
}

export default function NewsModal({ item, onClose }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    setArticle(null);

    // Esc untuk tutup
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    fetch(`/api/article?url=${encodeURIComponent(item.link)}`)
      .then((r) => r.json().then((j) => ({ status: r.status, j })))
      .then(({ status, j }) => {
        if (!alive) return;
        if (status === 200 && j.ok) setArticle(j);
        else setError(j?.error || "Isi artikel tidak dapat diambil");
      })
      .catch(() => alive && setError("Gagal terhubung ke server"))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  return (
    <div
      className="news-modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div className="news-modal">
        <header className="news-modal-head">
          <div>
            <h3 className="news-modal-title">
              {item.impact?.level === "kritis" && <span className="impact-badge kritis">🔥</span>}
              {item.impact?.level === "tinggi" && <span className="impact-badge tinggi">⚡</span>}
              {article?.title || item.title}
            </h3>
            <p className="news-modal-meta">
              {item.source} · {timeAgo(item.iso)}
              {item.impact?.tags?.length ? ` · ${item.impact.tags.join(", ")}` : ""}
            </p>
          </div>
          <button className="news-modal-close" onClick={onClose} aria-label="Tutup" title="Tutup (Esc)">
            ✕
          </button>
        </header>

        <div className="news-modal-body">
          {loading && (
            <div className="news-modal-loading">
              <span className="pulse-dot" style={{ width: 8, height: 8 }} />
              Mengambil isi artikel dari {new URL(item.link).hostname}…
            </div>
          )}

          {!loading && error && (
            <div className="news-modal-error">
              <p>⚠️ {error}.</p>
              <p className="news-modal-hint">
                Judul berita tetap bisa dibaca di bawah. Untuk artikel lengkap, buka langsung di situs
                sumbernya.
              </p>
            </div>
          )}

          {!loading && !error && article && article.redirect && (
            <>
              {item.rssSummary && <p className="news-modal-desc">{item.rssSummary}</p>}
              <div className="news-modal-info">
                <p>ℹ️ Ini link agregasi Google News — artikel lengkapnya berada di situs penerbit aslinya.</p>
                <p className="news-modal-hint">
                  Klik <b>Buka di situs sumber</b> di bawah untuk membaca artikel lengkap.
                </p>
              </div>
            </>
          )}

          {!loading && !error && article && !article.redirect && (
            <>
              {article.description && <p className="news-modal-desc">{article.description}</p>}
              {article.excerpt && !article.description && (
                <p className="news-modal-desc">{article.excerpt}</p>
              )}
              {article.paragraphs.length > 0 ? (
                <div className="news-modal-paras">
                  {article.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : (
                <p className="news-modal-desc">
                  Konten artikel tidak dapat diekstrak otomatis (situs sumber membatasi). Baca lengkap
                  di situs sumber.
                </p>
              )}
            </>
          )}

          {!loading && !error && article && !article.redirect && (
            <p className="news-modal-note">
              Ekstraksi otomatis dari <b>{article.sourceDomain}</b> — panjangnya mungkin dipotong; untuk
              versi lengkap gunakan tombol di bawah.
            </p>
          )}
        </div>

        <footer className="news-modal-foot">
          <span className="news-modal-src">
            Sumber: <b>{item.source}</b>
          </span>
          <a
            className="btn btn-ghost btn-sm"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buka di situs sumber ↗
          </a>
        </footer>
      </div>
    </div>
  );
}
