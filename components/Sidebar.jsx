// components/Sidebar.jsx
// Navigasi sidebar (vertikal) — menggantikan tombol-tombol di header.
// Desktop  : kolom kiri tetap; bisa diringkas jadi "icon rail" (tombol ‹ / ›).
// Tablet   : otomatis ringkas (rail) bila belum ada preferensi tersimpan.
// Mobile   : off-canvas drawer (dibuka hamburger / tab "Menu" di bawah).

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import {
  IconHome, IconAnalytics, IconCalendar, IconIndicators, IconChart,
  IconLearn, IconNews, IconCalculator, IconGauge, IconWallet, IconLightbulb,
  IconScan, IconUsers, IconBook,
} from "./Icons";

const ICONS = {
  home: IconHome, analytics: IconAnalytics, calendar: IconCalendar,
  indicators: IconIndicators, chart: IconChart, learn: IconLearn, news: IconNews,
  calculator: IconCalculator, technicals: IconGauge, watchlist: IconWallet, copilot: IconLightbulb,
  screener: IconScan, community: IconUsers, broker: IconWallet, settings: IconGauge,
  journal: IconBook,
};

// Daftar link dikelompokkan agar 17 item tidak terasa seperti satu tembok panjang.
export const NAV_GROUPS = [
  {
    id: "utama", label: "Utama",
    links: [
      { href: "/", icon: "home", label: "Beranda", desc: "Command Center — sentimen, sesi & kekuatan mata uang" },
      { href: "/technicals", icon: "technicals", label: "Teknikal", desc: "Matriks sinyal multi-timeframe & skor confluence" },
      { href: "/screener", icon: "screener", label: "Screener", desc: "Scan pola candlestick & breakout semua pasangan" },
      { href: "/charts", icon: "chart", label: "Chart", desc: "Chart Gold, Forex & Komoditas (TradingView)" },
    ],
  },
  {
    id: "analisis", label: "Analisis & Data",
    links: [
      { href: "/analysis", icon: "analytics", label: "Analisis", desc: "Dampak rilis ekonomi ke pasangan mata uang" },
      { href: "/fundamentals", icon: "analytics", label: "Fundamental", desc: "Bias fundamental & cheat sheet rilis penting" },
      { href: "/calendar", icon: "calendar", label: "Kalender", desc: "Jadwal rilis data ekonomi penting" },
      { href: "/indicators", icon: "indicators", label: "Indikator", desc: "Semua data indikator ekonomi" },
      { href: "/news", icon: "news", label: "Berita", desc: "Berita pasar + filter berdampak tinggi" },
    ],
  },
  {
    id: "alat", label: "Alat Trader",
    links: [
      { href: "/watchlist", icon: "watchlist", label: "Watchlist", desc: "Pantau instrumen & pasang price alert" },
      { href: "/calculators", icon: "calculator", label: "Kalkulator", desc: "Position size, pip value, risiko & pivot points" },
      { href: "/journal", icon: "journal", label: "Jurnal", desc: "Papan skor: catat trade & statistik kinerja" },
      { href: "/copilot", icon: "copilot", label: "Copilot", desc: "Asisten AI berbasis data MacroLab" },
    ],
  },
  {
    id: "akun", label: "Akun & Komunitas",
    links: [
      { href: "/broker", icon: "broker", label: "Broker", desc: "Sinkron posisi nyata (MetaAPI) & portfolio" },
      { href: "/community", icon: "community", label: "Komunitas", desc: "Prediksi rilis & leaderboard akurasi" },
      { href: "/learn", icon: "learn", label: "Belajar", desc: "Panduan & glosarium istilah pasar" },
      { href: "/settings", icon: "settings", label: "Pengaturan", desc: "LLM & integrasi broker" },
    ],
  },
];

// Daftar rata (dipakai Header untuk judul seksi & MobileTabBar).
export const LINKS = NAV_GROUPS.flatMap((g) => g.links);

// Item yang tampil di bottom tab bar ponsel (maks 4 + tombol Menu).
export const MOBILE_TABS = ["/", "/technicals", "/charts", "/calendar"]
  .map((href) => LINKS.find((l) => l.href === href))
  .filter(Boolean);

export function isActivePath(pathname, href) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function NavIcon({ name }) {
  const Ico = ICONS[name] || IconHome;
  return <Ico />;
}

const SECTION_OF = (pathname) => LINKS.find((x) => isActivePath(pathname, x.href))?.label || "";

export default function Sidebar({ open = false, collapsed = false, onClose, onToggleCollapse }) {
  const pathname = usePathname();
  const closeBtnRef = useRef(null);
  const firstRender = useRef(true);

  // Tutup otomatis saat ganti halaman di mobile (lewati render pertama).
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    if (onClose) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Saat drawer dibuka: pindahkan fokus ke tombol tutup agar keyboard/screen reader
  // langsung berada di dalam panel.
  useEffect(() => {
    if (open) closeBtnRef.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <aside
      id="app-sidebar"
      className={`sidebar ${open ? "open" : ""} ${collapsed ? "collapsed" : ""}`}
      aria-label="Navigasi utama"
    >
      <div className="sidebar-head">
        <Link href="/" className="brand" onClick={onClose} aria-label="MacroLab — Beranda">
          <span className="brand-mark">FX</span>
          <span className="brand-text">Macro<span className="accent">Lab</span></span>
        </Link>
        <button ref={closeBtnRef} type="button" className="sidebar-close" onClick={onClose} aria-label="Tutup menu">✕</button>
        <button
          type="button"
          className="sidebar-collapse"
          onClick={onToggleCollapse}
          aria-pressed={collapsed}
          aria-label={collapsed ? "Perlebar sidebar" : "Ringkas sidebar"}
          title={collapsed ? "Perlebar sidebar" : "Ringkas sidebar"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {collapsed ? <path d="M9 6l6 6-6 6" /> : <path d="M15 6l-6 6 6 6" />}
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_GROUPS.map((g) => (
          <div className="side-group" key={g.id} role="group" aria-label={g.label}>
            <div className="side-group-label" aria-hidden="true">{g.label}</div>
            {g.links.map((l) => {
              const active = isActivePath(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`side-link ${active ? "active" : ""}`}
                  title={collapsed ? `${l.label} — ${l.desc}` : l.desc}
                  aria-current={active ? "page" : undefined}
                  onClick={onClose}
                >
                  <span className="nav-ico" aria-hidden="true"><NavIcon name={l.icon} /></span>
                  <span className="side-link-text">
                    <span className="side-label">{l.label}</span>
                    <span className="side-desc">{l.desc}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="side-foot-row">
          <span className="live-pill"><span className="pulse-dot" /> <span className="live-pill-text">LIVE FRED</span></span>
          <ThemeToggle />
        </div>
        <div className="side-foot-meta mono">
          <span>SYS: FRED+FF · v3.4</span>
          <span>{SECTION_OF(pathname) || "Overview"}</span>
        </div>
      </div>
    </aside>
  );
}
