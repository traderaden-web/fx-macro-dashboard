// components/IndicatorsClient.jsx
// SEMUA INDIKATOR — tampilan terminal interaktif (konsisten Consensus Terminal):
//   01 · FILTER INDIKATOR — kategori, dampak, negara, urutan + pencarian
//   02 · TABEL INDIKATOR  — baris terminal: bendera, nama, nilai terbaru,
//                           Δ periode, sparkline 12 titik, kategori, dampak,
//                           as-of; KLIK BARIS → detail indikator
// Data: getAllSeriesData() (FRED live / seed) — lib/data.js.
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, COUNTRIES } from "../lib/series";
import { CountryFlag } from "./Badges";
import TermClock from "./TermClock";
import { fmt } from "../lib/format";

const IMPACT_ORDER = { High: 0, Medium: 1, Low: 2 };
const IMP_CLS = { High: "im-high", Medium: "im-medium", Low: "im-low" };

// sparkline mini (12 titik terakhir) — inline SVG tanpa dependensi
function Spark({ points, up }) {
  const data = (points || []).slice(-12);
  if (data.length < 2) return <span className="ilt-spark-dim mono">—</span>;
  const vals = data.map((p) => p.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const w = 64, h = 18;
  const step = w / (data.length - 1);
  const pts = vals.map((v, i) => `${(i * step).toFixed(1)},${(h - 2 - ((v - min) / span) * (h - 4)).toFixed(1)}`).join(" ");
  return (
    <svg className="ilt-spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline points={pts} fill="none" stroke={up ? "var(--up)" : "var(--down)"} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={w} cy={h - 2 - ((vals[vals.length - 1] - min) / span) * (h - 4)} r="2" fill={up ? "var(--up)" : "var(--down)"} />
    </svg>
  );
}

export default function IndicatorsClient({ items }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("semua");
  const [imp, setImp] = useState("semua");
  const [cc, setCc] = useState("semua");
  const [sort, setSort] = useState("impact-desc");

  const countries = useMemo(
    () => COUNTRIES.filter((c) => items.some((d) => d.country === c.id)),
    [items]
  );
  const catList = useMemo(() => {
    const present = new Set(items.map((d) => d.category));
    return CATEGORIES.filter((c) => present.has(c.id));
  }, [items]);

  const counts = useMemo(() => ({
    total: items.length,
    high: items.filter((d) => d.impact === "High").length,
    med: items.filter((d) => d.impact === "Medium").length,
    low: items.filter((d) => d.impact === "Low").length,
  }), [items]);

  const filtered = useMemo(() => {
    const qm = q.trim().toLowerCase();
    const list = items.filter((d) => {
      const matchQ = !qm || d.name.toLowerCase().includes(qm) || d.short.toLowerCase().includes(qm) || (d.countryName || "").toLowerCase().includes(qm);
      const matchCat = cat === "semua" || d.category === cat;
      const matchImp = imp === "semua" || d.impact === imp;
      const matchCountry = cc === "semua" || d.country === cc;
      return matchQ && matchCat && matchImp && matchCountry;
    });
    return [...list].sort((a, b) => {
      switch (sort) {
        case "impact-desc": return IMPACT_ORDER[a.impact] - IMPACT_ORDER[b.impact] || a.short.localeCompare(b.short);
        case "impact-asc": return IMPACT_ORDER[b.impact] - IMPACT_ORDER[a.impact] || a.short.localeCompare(b.short);
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "country": return a.country.localeCompare(b.country) || a.short.localeCompare(b.short);
        default: return 0;
      }
    });
  }, [items, q, cat, imp, cc, sort]);

  const sortLabel =
    sort === "impact-desc" ? "DAMPAK HIGH→LOW" :
    sort === "impact-asc" ? "DAMPAK LOW→HIGH" :
    sort === "name-asc" ? "NAMA A→Z" :
    sort === "name-desc" ? "NAMA Z→A" : "NEGARA";

  return (
    <div className="ilt-term">
      <div className="ct-scan" aria-hidden="true" />

      <header className="ilt-term-head">
        <span className="ct-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="ilt-term-title mono">
          MACROLAB <em>//</em> ALL&nbsp;INDICATORS <span className="ct-ver">v1.0</span>
          <span className="ct-cursor" aria-hidden="true" />
        </span>
        <span className="ilt-term-head-right">
          <span className="ct-led ok">{counts.total} INDIKATOR · DATA RIIL</span>
          <TermClock />
        </span>
      </header>

      {/* 01 · FILTER INDIKATOR */}
      <section className="ilt-term-sec">
        <div className="ct-block-head">
          <span className="ct-tag">01</span>
          <h4>Filter Indikator</h4>
          <span className="ct-block-meta mono">▸ {counts.high} HIGH · {counts.med} MEDIUM · {counts.low} LOW · {countries.length} NEGARA</span>
        </div>

        <div className="cal-chips-row">
          <span className="cal-chips-cap mono">KATEGORI</span>
          <div className="cal-chips">
            <button className={`cal-chip ${cat === "semua" ? "on" : ""}`} onClick={() => setCat("semua")}>SEMUA</button>
            {catList.map((c) => (
              <button key={c.id} className={`cal-chip ${cat === c.id ? "on" : ""}`} onClick={() => setCat(c.id)} style={{ "--c": c.color }}>
                <i className="ilt-cat-dot" aria-hidden="true" />{c.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="cal-chips-row">
          <span className="cal-chips-cap mono">DAMPAK</span>
          <div className="cal-chips">
            <button className={`cal-chip ${imp === "semua" ? "on" : ""}`} onClick={() => setImp("semua")}>SEMUA</button>
            <button className={`cal-chip im-high ${imp === "High" ? "on" : ""}`} onClick={() => setImp("High")}>HIGH</button>
            <button className={`cal-chip im-medium ${imp === "Medium" ? "on" : ""}`} onClick={() => setImp("Medium")}>MEDIUM</button>
            <button className={`cal-chip im-low ${imp === "Low" ? "on" : ""}`} onClick={() => setImp("Low")}>LOW</button>
          </div>
          <span className="cal-chips-cap mono cal-cc-cap">NEGARA</span>
          <div className="cal-chips">
            <button className={`cal-chip ${cc === "semua" ? "on" : ""}`} onClick={() => setCc("semua")}>SEMUA</button>
            {countries.map((c) => (
              <button key={c.id} className={`cal-chip ${cc === c.id ? "on" : ""}`} onClick={() => setCc(c.id)} title={c.name}>{c.id}</button>
            ))}
          </div>
        </div>

        <div className="cal-chips-row">
          <span className="cal-chips-cap mono">URUT</span>
          <div className="cal-chips">
            {[
              { id: "impact-desc", label: "DAMPAK ↓" },
              { id: "impact-asc", label: "DAMPAK ↑" },
              { id: "name-asc", label: "NAMA A→Z" },
              { id: "name-desc", label: "NAMA Z→A" },
              { id: "country", label: "NEGARA" },
            ].map((s) => (
              <button key={s.id} className={`cal-chip ${sort === s.id ? "on" : ""}`} onClick={() => setSort(s.id)}>{s.label}</button>
            ))}
          </div>
        </div>

        <div className="cal-search">
          <span className="ct-prompt" aria-hidden="true">&gt;</span>
          <input type="text" placeholder="cari indikator… (nama, singkatan, negara)" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari indikator" />
        </div>
      </section>

      {/* 02 · TABEL INDIKATOR */}
      <section className="ilt-term-sec">
        <div className="ct-block-head">
          <span className="ct-tag">02</span>
          <h4>Tabel Indikator</h4>
          <span className="ct-block-meta mono">▸ {filtered.length} DARI {counts.total} · URUT: {sortLabel} · KLIK BARIS UNTUK DETAIL</span>
        </div>

        <div className="ilt-rows">
          {filtered.length === 0 && <p className="cal-empty mono">TIDAK ADA INDIKATOR YANG COCOK DENGAN FILTER</p>}
          {filtered.map((d, i) => {
            const pts = d.points || [];
            const v = pts.length ? pts[pts.length - 1].value : null;
            const prev = pts.length > 1 ? pts[pts.length - 2].value : null;
            const trend = v !== null && prev !== null ? v - prev : null;
            const catMeta = CATEGORIES.find((c) => c.id === d.category);
            return (
              <Link
                key={d.id}
                href={`/indicators/${d.id}`}
                className={`ilt-row ${d.impact === "High" ? "is-high" : ""}`}
                style={{ animationDelay: `${Math.min(i * 28, 400)}ms` }}
              >
                <span className="ilt-r-idx mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="ilt-r-flag"><CountryFlag code={d.country} size={20} showCode={false} /></span>
                <span className="ilt-r-name">
                  <b>{d.name}</b>
                  <i className="mono">{d.short} · {d.countryName || d.country}</i>
                </span>
                <span className="ilt-r-val mono">
                  {v === null ? "—" : fmt(v, d.decimals)}
                  {v !== null && <u>{d.unit}</u>}
                </span>
                <span className={`ilt-r-trend mono ${trend === null ? "" : trend >= 0 ? "up" : "down"}`}>
                  {trend === null ? "—" : `${trend >= 0 ? "▲ +" : "▼ −"}${trend === null ? "" : fmt(Math.abs(trend), d.decimals)}`}
                </span>
                <span className="ilt-r-spark"><Spark points={pts} up={trend !== null && trend >= 0} /></span>
                <span className="ilt-r-cat" style={{ "--c": catMeta?.color }}>
                  <i aria-hidden="true" />{catMeta?.label || d.category}
                </span>
                <span className={`ilt-r-imp ${IMP_CLS[d.impact] || "im-low"}`} title={`Dampak ${d.impact}`}>
                  <i /><i /><i />
                  <u className="mono">{d.impact === "High" ? "HIGH" : d.impact === "Medium" ? "MED" : "LOW"}</u>
                </span>
                <span className="ilt-r-asof mono">{d.last?.date?.slice(0, 7) || "—"}</span>
                <span className="ilt-r-chev" aria-hidden="true">▸</span>
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="ilt-term-foot mono">
        <span>SRC: FRED / CACHE LOKAL · N: {filtered.length}/{counts.total} · ZONA: WIB (UTC+7)</span>
        <span className="ilt-term-foot-note">Klik baris untuk riwayat, konsensus vs actual & edukasi lengkap</span>
        <span className="ct-blink" aria-hidden="true">●</span>
      </footer>
    </div>
  );
}
