// components/ThemeToggle.jsx
// Toggle tema gelap/terang. Menyimpan pilihan di localStorage dan menerapkan
// atribut data-theme pada <html>. Default: gelap (sesuai estetika terminal).
// Komponen memakai matahari/bulan SVG ringan.

"use client";

import { useEffect, useState } from "react";

const KEY = "macrolab.theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    const t = saved === "light" || saved === "dark" ? saved : "dark";
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(KEY, next);
  };

  return (
    <button className="theme-toggle" onClick={toggle} title={theme === "dark" ? "Beralih ke tema terang" : "Beralih ke tema gelap"} aria-label="Ganti tema">
      {theme === "dark" ? (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
