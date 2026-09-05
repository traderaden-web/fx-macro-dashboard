// components/MobileTabBar.jsx
// Bottom tab bar untuk ponsel (≤ 640px): 4 tujuan paling sering + tombol "Menu"
// yang membuka drawer sidebar. Disembunyikan di tablet/desktop via CSS.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_TABS, NavIcon, isActivePath } from "./Sidebar";

export default function MobileTabBar({ onMenu, menuOpen = false }) {
  const pathname = usePathname();

  return (
    <nav className="tabbar" aria-label="Navigasi cepat">
      {MOBILE_TABS.map((t) => {
        const active = !menuOpen && isActivePath(pathname, t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`tab-item ${active ? "active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span className="tab-ico" aria-hidden="true"><NavIcon name={t.icon} /></span>
            <span className="tab-label">{t.label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        className={`tab-item tab-menu ${menuOpen ? "active" : ""}`}
        onClick={onMenu}
        aria-expanded={menuOpen}
        aria-controls="app-sidebar"
        aria-label="Buka semua menu"
      >
        <span className="tab-ico" aria-hidden="true">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5" cy="5" r="1.6" /><circle cx="12" cy="5" r="1.6" /><circle cx="19" cy="5" r="1.6" />
            <circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" />
            <circle cx="5" cy="19" r="1.6" /><circle cx="12" cy="19" r="1.6" /><circle cx="19" cy="19" r="1.6" />
          </svg>
        </span>
        <span className="tab-label">Menu</span>
      </button>
    </nav>
  );
}
