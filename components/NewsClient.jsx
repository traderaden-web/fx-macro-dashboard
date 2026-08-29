// components/NewsClient.jsx
// Daftar berita pasar terkini dengan:
//  - filter kategori (wrap, tanpa scroll) + pencarian + filter sumber
//  - watchlist/langganan kategori (disimpan di localStorage)
//  - seluruh kartu dapat diklik untuk membuka artikel asli di tab baru
//  - tombol "Refresh berita" (memanggil /api/news/refresh)
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { IconSearch, IconNews, IconFlag, IconAnalytics } from "./Icons";

const NEWS_CAT = [
  { id: "tradingview", label: "TradingView", color: "#2962ff" },
  { id: "forex", label: "Forex", color: "#38bdf8" },
  { id: "ekonomi", label: "Ekonomi", color: "#4ade80" },
  { id: "pasar", label: "Pasar Global", color: "#94a3b8" },
  { id: "moneter", label: "Suku Bunga & Fed", color: "#c084fc" },
  { id: "komoditas", label: "Minyak & Logam", color: "#fbbf24" },
  { id: "indonesia", label: "Indonesia", color: "#f87171" },
];

// Badge dampak berdasarkan skor berita terhadap Forex/Gold/Komoditas.
function ImpactBadge({ impact }) {
  if (!impact) return null;
  if (impact.level === "kritis") {
    return (
      <span className="impact-badge kritis" title={`Sangat berpengaruh — terkait: ${impact.tags.join(", ")}`}>
        🔥 Sangat Berpengaruh
      </span>
    );
  }
  if (impact.level === "tinggi") {
    return (
      <span className="impact-badge tinggi" title={`Dampak tinggi — terkait: ${impact.tags.join(", ")}`}>
        ⚡ Dampak Tinggi
      </span>
    );
  }
  return null;
}

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

function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; }
}

const LS_KEY = "macrolab_news_watch";

export default function NewsClient({ items: initialItems, source: initialSource, updated: initialUpdated }) {
  const [items, setItems] = useState(initialItems);
  const [source, setSource] = useState(initialSource);
  const [updated, setUpdated] = useState(initialUpdated);
  const [cat, setCat] = useState("semua");
  const [src, setSrc] = useState("semua");
  const [hotOnly, setHotOnly] = useState(false);
  const [q, setQ] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const [watch, setWatch] = useState([]);
  const [showWatchOnly, setShowWatchOnly] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      if (Array.isArray(saved)) setWatch(saved);
    } catch { /* abaikan */ }
  }, []);

  const sources = useMemo(() => {
    const s = new Set(items.map((i) => i.source).filter(Boolean));
    return [...s].sort((a, b) => a.localeCompare(b));
  }, [items]);

  const hotCount = useMemo(() => items.filter((i) => i.impact?.level === "kritis").length, [items]);

  const filtered = useMemo(() => {
    const qm = q.trim().toLowerCase();
    return items
      .filter((i) => (hotOnly ? i.impact?.level === "kritis" : true))
      .filter((i) => (showWatchOnly ? watch.includes(i.cat) : true))
      .filter((i) => (cat === "semua" ? true : i.cat === cat))
      .filter((i) => (src === "semua" ? true : i.source === src))
      .filter((i) => !qm || i.title.toLowerCase().includes(qm))
      .sort((a, b) => (hotOnly ? (b.impact?.score || 0) - (a.impact?.score || 0) : 0) || (b.iso || "").localeCompare(a.iso || ""));
  }, [items, cat, src, q, watch, showWatchOnly, hotOnly]);

  const toggleWatch = (id) => {
    setWatch((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* abaikan */ }
      return next;
    });
  };

  async function doRefresh() {
    setRefreshing(true);
    setToast(null);
    try {
      const res = await fetch("/api/news/refresh", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.items?.length) {
        setItems(data.items);
        setSource(data.source);
        setUpdated(data.updated);
        setToast({ kind: "ok", msg: `Berhasil memuat ${data.items.length} berita terbaru.` });
      } else {
        setToast({ kind: "warn", msg: "Refresh gagal. Membiarkan data yang ada." });
      }
    } catch {
      setToast({ kind: "warn", msg: "Refresh gagal. Membiarkan data yang ada." });
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <>
      <div className="card reveal" style={{ marginBottom: 12 }}>
        <div className="toolbar">
          <div className="search-box">
            <span className="search-ico" aria-hidden="true"><IconSearch size={16} /></span>
            <input className="search-input" type="text" placeholder="Cari berita…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="sort-box">
            <label className="sort-label">Sumber:</label>
            <select className="sort-select" value={src} onChange={(e) => setSrc(e.target.value)}>
              <option value="semua">Semua</option>
              {sources.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button className="btn btn-ghost news-refresh" onClick={doRefresh} disabled={refreshing}>
            <IconNews size={15} /> {refreshing ? "Memuat…" : "Refresh berita"}
          </button>
        </div>

        <div className="chips-row" style={{ marginBottom: 8 }}>
          <button
            className={`cf-chip hot ${hotOnly ? "active" : ""}`}
            onClick={() => { setHotOnly((v) => !v); setCat("semua"); setShowWatchOnly(false); }}
            title="Hanya berita yang sangat-sangat berpengaruh terhadap pasar Forex, Gold, & Komoditas"
          >
            🔥 Gold, Forex &amp; Komoditas ({hotCount})
          </button>
          <button className={`cf-chip ${!showWatchOnly && !hotOnly && cat === "semua" ? "active" : ""}`} onClick={() => { setCat("semua"); setHotOnly(false); setShowWatchOnly(false); }}>Semua</button>
          {NEWS_CAT.map((c) => {
            const active = !showWatchOnly && !hotOnly && cat === c.id;
            return (
              <div key={c.id} className="chip-group">
                <button className={`cf-chip ${active ? "active" : ""}`} onClick={() => { setCat(c.id); setHotOnly(false); setShowWatchOnly(false); }}>
                  <span className="dot" style={{ background: c.color, display: "inline-block", marginRight: 6 }} />
                  {c.label}
                </button>
                <button
                  className={`watch-dot ${watch.includes(c.id) ? "on" : ""}`}
                  onClick={() => toggleWatch(c.id)}
                  title={watch.includes(c.id) ? "Batal langganan" : "Langganan kategori ini"}
                  aria-label={watch.includes(c.id) ? "Batal langganan" : "Langganan"}
                >★</button>
              </div>
            );
          })}
        </div>

        <div className="toolbar" style={{ marginBottom: 0 }}>
          <button className={`btn btn-ghost watch-toggle ${showWatchOnly ? "active" : ""}`} onClick={() => setShowWatchOnly((v) => !v)}>
            <IconFlag size={15} /> {watch.length ? `Dilanggan (${watch.length} kategori)` : "Langganan"}
          </button>
          {watch.length > 0 && (
            <span className="cell-muted">Kategori dilanggan: {NEWS_CAT.filter((c) => watch.includes(c.id)).map((c) => c.label).join(", ")}</span>
          )}
        </div>
      </div>

      {toast && (
        <div className={`notice ${toast.kind === "warn" ? "notice-warn" : ""}`} style={{ marginBottom: 12 }}>
          {toast.msg}
        </div>
      )}

      <div className="result-count">
        {source === "live" ? (
          <span className="live-pill" style={{ fontSize: 11 }}>🔴 Live — diperbarui otomatis</span>
        ) : (
          <span className="cell-muted">Data cadangan (sumber live tak terjangkau)</span>
        )}
        <span style={{ marginLeft: 10 }}>
          Menampilkan <strong>{filtered.length}</strong> berita
          {updated ? ` · diupdate ${new Date(updated).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}` : ""}
        </span>
        {items.filter((i) => i.lang === "id").length > 0 && (
          <span className="id-badge" title="Berita berbahasa Indonesia">
            🇮🇩 {items.filter((i) => i.lang === "id").length} berita Indonesia
          </span>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="card" style={{ textAlign: "center", color: "var(--dim)" }}>
          Tidak ada berita yang cocok dengan filter.
        </div>
      )}

      <div className="news-grid">
        {filtered.map((n) => {
          const c = NEWS_CAT.find((x) => x.id === n.cat);
          return (
            <div
              key={n.id}
              className="news-card"
              role="button"
              tabIndex={0}
              aria-label={`${n.title} — lihat detail`}
              onClick={(e) => {
                if (e.target.closest("a")) return; // biarkan link internal (Analisis) bekerja
                setActive(n);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(n); }
              }}
            >
              <div className="news-body">
                <div className="news-top">
                  <span className="badge cat" style={{ color: c?.color || "var(--muted)", background: `${c?.color || "#94a3b8"}22` }}>
                    <span className="dot" style={{ background: c?.color || "#94a3b8" }} />
                    {c?.label || "Berita"}
                  </span>
                  <ImpactBadge impact={n.impact} />
                  {n.lang === "id" && <span className="lang-badge" title="Berbahasa Indonesia">🇮🇩 ID</span>}
                  <span className="news-time">{timeAgo(n.iso)}</span>
                </div>
                <h3 className="news-title">{n.title}</h3>
                <p className="news-summary">{n.summary}</p>
                <div className="news-foot">
                  <span className="news-source">{n.source}</span>
                  {n.indicatorId ? (
                    <Link href={`/indicators/${n.indicatorId}`} className="news-indicator" onClick={(e) => e.stopPropagation()} title="Lihat analisis">
                      <IconAnalytics size={13} /> Analisis
                    </Link>
                  ) : (
                    <span className="news-host">{hostOf(n.link)}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {active && <NewsModal n={active} onClose={() => setActive(null)} />}
    </>
  );
}

// Modal detail berita — menampilkan metadata + ringkasan otomatis, dan tombol
// untuk membuka artikel asli. Konten penuh artikel tidak bisa diambil (publisher
// memblokir scraping & Google News hanya memberi judul/ringkasan), jadi modal ini
// menyajikan ringkasan + tautan resmi ke penerbit.
function NewsModal({ n, onClose }) {
  const cat = NEWS_CAT.find((x) => x.id === n.cat);
  const color = cat?.color || "#94a3b8";

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-label={n.title} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Tutup">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
        <div className="modal-body">
          <div className="news-top">
            <span className="badge cat" style={{ color, background: `${color}22` }}>
              <span className="dot" style={{ background: color }} />
              {cat?.label || "Berita"}
            </span>
            <ImpactBadge impact={n.impact} />
            {n.lang === "id" && <span className="lang-badge" title="Berbahasa Indonesia">🇮🇩 ID</span>}
            <span className="news-time">{timeAgo(n.iso)}</span>
          </div>
          <h2 className="modal-title">{n.title}</h2>
          <div className="modal-meta">
            <span className="news-source">{n.source}</span>
            <span className="news-host"> · {hostOf(n.link)}</span>
          </div>
          <div className="modal-summary">{n.summary}</div>

          {n.impact && n.impact.tags.length > 0 && (
            <div className="modal-tags">
              <span className="modal-tags-label">Topik berdampak:</span>
              {n.impact.tags.map((t) => (
                <span key={t} className="modal-tag">{t}</span>
              ))}
            </div>
          )}

          {n.indicatorId && (
            <Link href={`/indicators/${n.indicatorId}`} className="modal-indicator" onClick={onClose}>
              <IconAnalytics size={15} />
              <span>Baca analisis dampak untuk indikator terkait</span>
              <span className="modal-chev">→</span>
            </Link>
          )}

          <div className="modal-note">
            Konten lengkap artikel tersedia di situs penerbit. Ringkasan di atas dibuat otomatis dari judul.
          </div>

          <div className="modal-actions">
            <a href={n.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary modal-open">
              Buka artikel asli
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
            </a>
            <button className="btn btn-ghost" onClick={onClose}>Tutup</button>
          </div>
        </div>
      </div>
    </div>
  );
}
