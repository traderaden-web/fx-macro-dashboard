// components/Shell.jsx
// Kerangka aplikasi (client): sidebar kiri (fixed/off-canvas) + area konten.
// Memegang state:
//   - open      : drawer mobile terbuka (hamburger / tab "Menu")
//   - collapsed : sidebar desktop diringkas jadi icon rail (persist di localStorage)
// Juga: kunci scroll body saat drawer terbuka, tutup dengan Escape, tutup
// otomatis saat viewport membesar ke desktop, dan bottom tab bar untuk ponsel.

"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ForexTicker from "./ForexTicker";
import MobileTabBar from "./MobileTabBar";

const COLLAPSE_KEY = "macrolab.sidebar.collapsed";
const DESKTOP_BP = 1024;   // ≥ 1025px: sidebar kolom tetap
const TABLET_BP = 1280;    // 1025–1280px: default ringkas bila belum ada preferensi

export default function Shell({ children }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => setOpen(false), []);
  const toggleCollapse = useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      try { localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0"); } catch { /* private mode */ }
      return next;
    });
  }, []);

  // Muat preferensi collapse. Tanpa preferensi: layar tablet-lebar (≤1280px) default ringkas.
  useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem(COLLAPSE_KEY); } catch { /* ignore */ }
    if (saved === "1" || saved === "0") setCollapsed(saved === "1");
    else if (window.innerWidth > DESKTOP_BP && window.innerWidth <= TABLET_BP) setCollapsed(true);
  }, []);

  // Drawer terbuka: kunci scroll halaman + Escape untuk menutup.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Kalau jendela dilebarkan sampai desktop saat drawer terbuka → tutup drawer.
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BP + 1}px)`);
    const onChange = (e) => { if (e.matches) close(); };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [close]);

  return (
    <div className={`shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <a href="#main-content" className="skip-link">Lewati ke konten</a>
      <Sidebar open={open} collapsed={collapsed} onClose={close} onToggleCollapse={toggleCollapse} />
      <div className={`sidebar-overlay ${open ? "show" : ""}`} onClick={close} aria-hidden="true" />
      <div className="shell-content">
        <Header onMenu={toggle} menuOpen={open} />
        <ForexTicker />
        <main id="main-content" className="main" tabIndex={-1}>{children}</main>
        <footer className="footer">
          <div className="footer-inner">
            <span className="footer-line">MacroLab — dibangun untuk trader forex</span>
            <span className="footer-line footer-brand">Build With <strong>AD TRADER FOREX</strong> — Copyright 2026.</span>
            <span className="footer-muted">Sumber utama: FRED (Federal Reserve Economic Data) &amp; jadwal rilis resmi BLS / Federal Reserve.</span>
          </div>
        </footer>
      </div>
      <MobileTabBar onMenu={toggle} menuOpen={open} />
    </div>
  );
}
