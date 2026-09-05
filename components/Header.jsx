// components/Header.jsx
// Topbar tipis: hamburger (mobile/tablet), judul seksi aktif, jam WIB, status & theme toggle.
// Navigasi utama ada di Sidebar (components/Sidebar.jsx).

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { LINKS, isActivePath } from "./Sidebar";

function sectionOf(pathname) {
  return LINKS.find((x) => isActivePath(pathname, x.href))?.label || "Command Center";
}

export default function Header({ onMenu, menuOpen = false }) {
  const pathname = usePathname();
  const [clock, setClock] = useState(null);

  useEffect(() => {
    setClock(new Date());
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const section = sectionOf(pathname);

  return (
    <header className="header topbar">
      <div className="header-inner topbar-inner">
        <button
          type="button"
          className={`menu-btn ${menuOpen ? "is-open" : ""}`}
          onClick={onMenu}
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
          aria-controls="app-sidebar"
        >
          <span /><span /><span />
        </button>
        <span className="topbar-title">
          <span className="topbar-bread">MacroLab</span>
          <span className="topbar-sep">/</span>
          <span className="topbar-section">{section}</span>
        </span>
        <div className="header-right">
          <span className="topbar-clock mono" suppressHydrationWarning>
            {clock
              ? new Intl.DateTimeFormat("id-ID", {
                  timeZone: "Asia/Jakarta",
                  hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
                }).format(clock)
              : "—"}
            <span className="topbar-clock-tz"> WIB</span>
          </span>
          <span className="live-pill topbar-live"><span className="pulse-dot" /> LIVE</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
