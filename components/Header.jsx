// components/Header.jsx
// Navigasi utama — ikon line-stroke (SVG) yang konsisten, tanpa warna/emoji.
// Responsif: navigasi tab yang bisa digulir di ponsel, inline di desktop.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconAnalytics, IconCalendar, IconIndicators, IconChart, IconLearn, IconNews, IconCalculator } from "./Icons";

const ICONS = { home: IconHome, analytics: IconAnalytics, calendar: IconCalendar, indicators: IconIndicators, chart: IconChart, learn: IconLearn, news: IconNews, calculator: IconCalculator };

const LINKS = [
  { href: "/", icon: "home", label: "Beranda", desc: "Command Center — sentimen, sesi & kekuatan mata uang" },
  { href: "/charts", icon: "chart", label: "Chart", desc: "Chart Gold, Forex & Komoditas (TradingView)" },
  { href: "/analysis", icon: "analytics", label: "Analisis", desc: "Dampak rilis ekonomi ke pasangan mata uang" },
  { href: "/calculators", icon: "calculator", label: "Kalkulator", desc: "Position size, pip value, risiko & pivot points" },
  { href: "/calendar", icon: "calendar", label: "Kalender", desc: "Jadwal rilis data ekonomi penting" },
  { href: "/indicators", icon: "indicators", label: "Indikator", desc: "Semua data indikator ekonomi" },
  { href: "/news", icon: "news", label: "Berita", desc: "Berita pasar + filter berdampak tinggi" },
  { href: "/learn", icon: "learn", label: "Belajar", desc: "Panduan & glosarium istilah pasar" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">FX</span>
          <span className="brand-text">Macro<span className="accent">Lab</span></span>
        </Link>
        <nav className="nav" aria-label="Navigasi utama">
          {LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            const Ico = ICONS[l.icon];
            return (
              <Link key={l.href} href={l.href} className={`nav-link ${active ? "active" : ""}`} title={l.desc}>
                <span className="nav-ico" aria-hidden="true"><Ico /></span>
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="header-right">
          <span className="live-pill">
            <span className="pulse-dot" /> LIVE FRED
          </span>
        </div>
      </div>
    </header>
  );
}
