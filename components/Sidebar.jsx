// components/Sidebar.jsx
// Navigasi sidebar (vertikal) — menggantikan tombol-tombol di header.
// Desktop: kolom kiri tetap. Mobile/tablet: off-canvas drawer (dibuka hamburger).

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
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

export const LINKS = [
  { href: "/", icon: "home", label: "Beranda", desc: "Command Center — sentimen, sesi & kekuatan mata uang" },
  { href: "/technicals", icon: "technicals", label: "Teknikal", desc: "Matriks sinyal multi-timeframe & skor confluence" },
  { href: "/screener", icon: "screener", label: "Screener", desc: "Scan pola candlestick & breakout semua pasangan" },
  { href: "/charts", icon: "chart", label: "Chart", desc: "Chart Gold, Forex & Komoditas (TradingView)" },
  { href: "/analysis", icon: "analytics", label: "Analisis", desc: "Dampak rilis ekonomi ke pasangan mata uang" },
  { href: "/fundamentals", icon: "analytics", label: "Fundamental", desc: "Bias fundamental & cheat sheet rilis penting" },
  { href: "/broker", icon: "broker", label: "Broker", desc: "Sinkron posisi nyata (MetaAPI) & portfolio" },
  { href: "/community", icon: "community", label: "Komunitas", desc: "Prediksi rilis & leaderboard akurasi" },
  { href: "/calculators", icon: "calculator", label: "Kalkulator", desc: "Position size, pip value, risiko & pivot points" },
  { href: "/watchlist", icon: "watchlist", label: "Watchlist", desc: "Pantau instrumen & pasang price alert" },
  { href: "/calendar", icon: "calendar", label: "Kalender", desc: "Jadwal rilis data ekonomi penting" },
  { href: "/indicators", icon: "indicators", label: "Indikator", desc: "Semua data indikator ekonomi" },
  { href: "/news", icon: "news", label: "Berita", desc: "Berita pasar + filter berdampak tinggi" },
  { href: "/copilot", icon: "copilot", label: "Copilot", desc: "Asisten AI berbasis data MacroLab" },
  { href: "/learn", icon: "learn", label: "Belajar", desc: "Panduan & glosarium istilah pasar" },
  { href: "/settings", icon: "settings", label: "Pengaturan", desc: "LLM & integrasi broker" },
  { href: "/journal", icon: "journal", label: "Jurnal", desc: "Papan skor: catat trade & statistik kinerja" },
];

const SECTION_OF = (pathname) => {
  const l = LINKS.find((x) => (x.href === "/" ? pathname === "/" : pathname.startsWith(x.href)));
  return l?.label || "";
};

export default function Sidebar({ open = false, onClose }) {
  const pathname = usePathname();

  // Tutup otomatis saat ganti halaman di mobile.
  useEffect(() => {
    if (onClose) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <aside className={`sidebar ${open ? "open" : ""}`} aria-label="Navigasi utama">
      <div className="sidebar-head">
        <Link href="/" className="brand" onClick={onClose}>
          <span className="brand-mark">FX</span>
          <span className="brand-text">Macro<span className="accent">Lab</span></span>
        </Link>
        <button className="sidebar-close" onClick={onClose} aria-label="Tutup menu">✕</button>
      </div>

      <nav className="sidebar-nav">
        {LINKS.map((l) => {
          const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          const Ico = ICONS[l.icon];
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`side-link ${active ? "active" : ""}`}
              title={l.desc}
              onClick={onClose}
            >
              <span className="nav-ico" aria-hidden="true"><Ico /></span>
              <span className="side-link-text">
                <span className="side-label">{l.label}</span>
                <span className="side-desc">{l.desc}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-foot">
        <div className="side-foot-row">
          <span className="live-pill"><span className="pulse-dot" /> LIVE FRED</span>
          <ThemeToggle />
        </div>
        <div className="side-foot-meta mono">
          <span>SYS: FRED+FF · v3.1</span>
          <span>{SECTION_OF(pathname) || "Over — view"}</span>
        </div>
      </div>
    </aside>
  );
}
