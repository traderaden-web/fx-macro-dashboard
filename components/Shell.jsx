// components/Shell.jsx
// Kerangka aplikasi (client): sidebar kiri (fixed/off-canvas) + area konten.
// Memegang state membuka menu untuk mobile (hamburger).

"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ForexTicker from "./ForexTicker";

export default function Shell({ children }) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((o) => !o);
  const close = () => setOpen(false);

  return (
    <div className="shell">
      <Sidebar open={open} onClose={close} />
      {open && <div className="sidebar-overlay" onClick={close} />}
      <div className="shell-content">
        <Header onMenu={toggle} />
        <ForexTicker />
        <main className="main">{children}</main>
        <footer className="footer">
          <div className="footer-inner">
            <span className="footer-line">MacroLab — dibangun untuk trader forex</span>
            <span className="footer-line footer-brand">Build With <strong>AD TRADER FOREX</strong> — Copyright 2026.</span>
            <span className="footer-muted">Sumber utama: FRED (Federal Reserve Economic Data) &amp; jadwal rilis resmi BLS / Federal Reserve.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
