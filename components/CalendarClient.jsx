// components/CalendarClient.jsx
// Kalender ekonomi detail: dikelompokkan per tanggal (rilis terbaru & yang akan datang),
// dengan filter rapi (tanpa scroll horizontal) dan info konsensus/aktual bila ada.
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "../lib/series";
import { ImpactBadge, CountryFlag } from "./Badges";
import { GlossaryHint, ImpactLegend } from "./Legend";
import { IconLightbulb } from "./Icons";

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const COUNTRY_META = {
  US: { name: "Amerika Serikat" },
  EZ: { name: "Zona Euro" },
  UK: { name: "Inggris" },
  JP: { name: "Jepang" },
  CN: { name: "Tiongkok" },
  AU: { name: "Australia" },
  CA: { name: "Kanada" },
  CH: { name: "Swiss" },
  NZ: { name: "Selandia Baru" },
  GL: { name: "Global" },
};

export default function CalendarClient({ events }) {
  const [cat, setCat] = useState("semua");
  const [imp, setImp] = useState("semua");
  const [window, setWindow] = useState("terkini"); // semua|terkini|7|30

  // Kategori & dampak yang tersedia (with icons)
  const catList = useMemo(() => {
    const present = new Set(events.map((e) => e.category));
    return CATEGORIES.filter((c) => present.has(c.id));
  }, [events]);

  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10);
  const DAY = 86400000;

  // Nilai jendela. Default "terkini" menampilkan beberapa hari terakhir (termasuk
  // rilis yang sudah lewat) plus ~45 hari ke depan — sehingga rilis akhir bulan
  // (mis. Core PCE & GDP) tetap terlihat tanpa harus pindah ke "Semua".
  const filtered = useMemo(() => {
    let from = null;
    let to = null;
    if (window === "terkini") { from = new Date(now.getTime() - 3 * DAY); to = new Date(now.getTime() + 45 * DAY); }
    else if (window === "7") { from = now; to = new Date(now.getTime() + 7 * DAY); }
    else if (window === "30") { from = now; to = new Date(now.getTime() + 30 * DAY); }
    return events
      .filter((e) => (cat === "semua" ? true : e.category === cat))
      .filter((e) => (imp === "semua" ? true : e.impact === imp))
      .filter((e) => (!from || (new Date(e.iso) >= from && new Date(e.iso) <= to)))
      .sort((a, b) => a.iso.localeCompare(b.iso));
  }, [events, cat, imp, window]);

  // Kelompokkan per tanggal
  const groups = useMemo(() => {
    const map = new Map();
    for (const e of filtered) {
      const d = e.iso.slice(0, 10);
      if (!map.has(d)) map.set(d, []);
      map.get(d).push(e);
    }
    return [...map.entries()].map(([date, list]) => ({ date, list }));
  }, [filtered]);

  const dateLabel = (date) => {
    if (date === todayKey) return { main: "Hari Ini", sub: `${DAY_NAMES[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]}`, today: true };
    const dt = new Date(`${date}T00:00:00`);
    const yest = new Date(now.getTime() - 86400000);
    if (dt.toISOString().slice(0, 10) === yest.toISOString().slice(0, 10)) return { main: "Kemarin", sub: `${DAY_NAMES[dt.getDay()]}, ${dt.getDate()} ${MONTHS[dt.getMonth()]}`, today: false };
    const tmr = new Date(now.getTime() + 86400000);
    if (dt.toISOString().slice(0, 10) === tmr.toISOString().slice(0, 10)) return { main: "Besok", sub: `${DAY_NAMES[dt.getDay()]}, ${dt.getDate()} ${MONTHS[dt.getMonth()]}`, today: false };
    return { main: `${DAY_NAMES[dt.getDay()]}`, sub: `${dt.getDate()} ${MONTHS[dt.getMonth()]}`, today: false };
  };

  return (
    <>
      {/* Panel filter */}
      <div className="calendar-filter">
        <div className="cf-row cf-window">
          {[
            { id: "terkini", label: "Terkini" },
            { id: "semua", label: "Semua" },
            { id: "7", label: "7 hari ke depan" },
            { id: "30", label: "30 hari ke depan" },
          ].map((w) => (
            <button key={w.id} className={`cf-chip ${window === w.id ? "active" : ""}`} onClick={() => setWindow(w.id)}>
              {w.label}
            </button>
          ))}
        </div>

        <div className="cf-row cf-label-row">
          <span className="cf-caption">Kategori</span>
          <div className="cf-chips">
            <button className={`cf-chip ${cat === "semua" ? "active" : ""}`} onClick={() => setCat("semua")}>Semua</button>
            {catList.map((c) => (
              <button key={c.id} className={`cf-chip ${cat === c.id ? "active" : ""}`} onClick={() => setCat(c.id)}>
                <span className="dot" style={{ background: c.color, display: "inline-block", marginRight: 6 }} />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="cf-row cf-label-row">
          <span className="cf-caption">Dampak</span>
          <div className="cf-chips">
            {["High", "Medium", "Low"].map((l) => (
              <button key={l} className={`cf-chip ${imp === l ? "active" : ""}`} onClick={() => setImp(l)}>
                {l === "High" ? "🔴" : l === "Medium" ? "🟠" : "🟢"} {l}
              </button>
            ))}
            <button className={`cf-chip ${imp === "semua" ? "active" : ""}`} onClick={() => setImp("semua")}>Semua</button>
          </div>
        </div>
        <p className="cal-note">
          <span className="inline-ico" aria-hidden="true"><IconLightbulb size={15} /></span>{" "}
          <strong>Cara membaca:</strong> pilih rentang waktu di atas untuk mempersempit. Rilis yang sudah lewat
          terlihat redup (nilai aktualnya ada), rilis <em>hari ini</em> disorot, dan yang <em>mendatang</em> tampil penuh.
        </p>
      </div>

      <p className="result-count">
        Menampilkan <strong>{filtered.length}</strong> rilis
        {window === "terkini" ? " (3 hari terakhir → ±45 hari ke depan)" : window === "semua" ? " (semua rilis)" : window === "7" ? " dalam 7 hari ke depan" : " dalam 30 hari ke depan"}
      </p>

      {/* Daftar dikelompokkan per tanggal */}
      {groups.length === 0 && (
        <div className="card" style={{ textAlign: "center", color: "var(--dim)" }}>
          Tidak ada rilis yang cocok dengan filter.
        </div>
      )}

      {groups.map((g) => {
        const lbl = dateLabel(g.date);
        return (
          <div key={g.date} className="cal-day">
            <div className={`cal-day-head ${lbl.today ? "today" : ""}`}>
              <span className="cal-day-main">{lbl.main}</span>
              <span className="cal-day-sub">{lbl.sub}</span>
            </div>
            <div className="cal-events-card">
              {g.list.map((e) => (
                <EventRow key={e.iso + e.title} e={e} />
              ))}
            </div>
          </div>
        );
      })}

      <GlossaryHint />
      <ImpactLegend />
    </>
  );
}

function EventRow({ e }) {
  const isoFull = new Date(e.iso);
  const isPast = isoFull < new Date();
  const isToday = isoFull.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10);
  const time = e.iso.slice(11, 16);
  const cat = CATEGORIES.find((c) => c.id === e.category);
  const meta = COUNTRY_META[e.country] || { name: e.country };
  const cname = meta.name;
  const hasData = e.actual != null || e.forecast != null || e.previous != null;

  const fmt = (v) => (v === null || v === undefined ? "—" : Number(v).toLocaleString("id-ID", { maximumFractionDigits: 1 }));

  return (
    <div className={`cal-event detail ${isPast ? "is-past" : ""} ${isToday ? "is-today" : ""}`}>
      <div className="cal-time">
        <div className="d">{time}</div>
        <div className="t">{isToday ? "SEKARANG" : isPast ? "SUDAH" : "WIB"}</div>
      </div>
      <div className="cal-body">
        {e.indicatorId ? (
          <Link href={`/indicators/${e.indicatorId}`} className="cal-title cal-title-link">
            <CountryFlag code={e.country} size={15} /> {e.title}
            <span className="cal-chev" aria-hidden="true">›</span>
            {isPast && e.actual == null && <span className="cal-released">sudah dirilis</span>}
          </Link>
        ) : (
          <div className="cal-title">
            <CountryFlag code={e.country} size={15} /> {e.title}
            {isPast && e.actual == null && <span className="cal-released">sudah dirilis</span>}
          </div>
        )}
        {cname !== "Global" && <div className="cal-meta">{cname}</div>}
        <div className="cal-tags">
          <span className="badge cat" style={{ color: cat?.color, background: `${cat?.color}22`, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span className="dot" style={{ background: cat?.color }} /> {cat?.label || e.category}
          </span>
          {e.indicatorId && (
            <Link href={`/indicators/${e.indicatorId}`} className="cal-link">Analisis lengkap →</Link>
          )}
        </div>
      </div>
      <div className="cal-side">
        <ImpactBadge level={e.impact} />
        {hasData && (
          <div className="cal-metrics">
            {e.previous != null && <span className="cm"><i>Prev</i>{fmt(e.previous)}</span>}
            {e.forecast != null && <span className="cm"><i>Kon</i>{fmt(e.forecast)}</span>}
            {e.actual != null && <span className="cm actual"><i>Act</i>{fmt(e.actual)}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
