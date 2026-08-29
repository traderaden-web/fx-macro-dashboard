// components/IndicatorsClient.jsx
// Tabel indikator dengan pencarian, filter kategori/negara, dan urutan dampak High→Low.
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, COUNTRIES } from "../lib/series";
import { ImpactBadge, CategoryBadge, CountryFlag } from "./Badges";
import { GlossaryHint, ImpactLegend } from "./Legend";
import { IconSearch } from "./Icons";
import { fmt } from "../lib/format";

const IMPACT_ORDER = { High: 0, Medium: 1, Low: 2 };

export default function IndicatorsClient({ items }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("semua");
  const [country, setCountry] = useState("semua");
  const [sort, setSort] = useState("impact-desc"); // default: High → Low

  const filtered = useMemo(() => {
    let list = items.filter((d) => {
      const qm = q.trim().toLowerCase();
      const matchQ = !qm || d.name.toLowerCase().includes(qm) || d.short.toLowerCase().includes(qm);
      const matchCat = cat === "semua" || d.category === cat;
      const matchCountry = country === "semua" || d.country === country;
      return matchQ && matchCat && matchCountry;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "impact-desc":
          return IMPACT_ORDER[a.impact] - IMPACT_ORDER[b.impact] || a.short.localeCompare(b.short);
        case "impact-asc":
          return IMPACT_ORDER[b.impact] - IMPACT_ORDER[a.impact] || a.short.localeCompare(b.short);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "country":
          return a.country.localeCompare(b.country) || a.short.localeCompare(b.short);
        default:
          return 0;
      }
    });
    return list;
  }, [items, q, cat, country, sort]);

  return (
    <>
      {/* Toolbar filter */}
      <div className="toolbar">
        <div className="search-box">
          <span className="search-ico" aria-hidden="true"><IconSearch size={16} /></span>
          <input
            className="search-input"
            type="text"
            placeholder="Cari indikator…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Cari indikator"
          />
        </div>
        <div className="sort-box">
          <label className="sort-label">Urutkan:</label>
          <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="impact-desc">Dampak: High → Low</option>
            <option value="impact-asc">Dampak: Low → High</option>
            <option value="name-asc">Nama: A → Z</option>
            <option value="name-desc">Nama: Z → A</option>
            <option value="country">Negara</option>
          </select>
        </div>
        <div className="country-box">
          <label className="sort-label">Negara:</label>
          <select className="sort-select" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="semua">Semua</option>
            {COUNTRIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Filter kategori */}
      <div className="chips-row">
        <button className={`filter-pill ${cat === "semua" ? "active" : ""}`} onClick={() => setCat("semua")}>Semua</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`filter-pill ${cat === c.id ? "active" : ""}`} onClick={() => setCat(c.id)}>
            <span className="dot" style={{ background: c.color, display: "inline-block", marginRight: 6 }} />
            {c.label}
          </button>
        ))}
      </div>

      <div className="result-count">
        Menampilkan <strong>{filtered.length}</strong> indikator
        &nbsp;·&nbsp; diurutkan <strong>dampak terbesar → terkecil</strong>
      </div>

      <GlossaryHint />
      <ImpactLegend />

      <div className="table-hint">Geser tabel untuk melihat semua kolom →</div>
      <div className="table-wrap">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Indikator</th>
                <th>Nilai Terbaru</th>
                <th>Perubahan (MoM)</th>
                <th>Kategori</th>
                <th>Dampak</th>
                <th>Terakhir</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--dim)", padding: 32 }}>Tidak ada indikator yang cocok.</td></tr>
              )}
              {filtered.map((d) => {
                const pts = d.points || [];
                const v = pts.length ? pts[pts.length - 1].value : null;
                const prev = pts.length > 1 ? pts[pts.length - 2].value : null;
                const trend = v !== null && prev !== null ? v - prev : null;
                const cat = CATEGORIES.find((c) => c.id === d.category);
                return (
                  <tr key={d.id} className="reveal-stagger">
                    <td>
                      <Link href={`/indicators/${d.id}`} className="cell-name">
                        <CountryFlag code={d.country} /> {d.name}
                      </Link>
                      <div className="cell-muted">{d.countryName}</div>
                    </td>
                    <td className="mono" style={{ fontWeight: 700 }}>{fmt(v, d.decimals)} <span className="cell-muted">{d.unit}</span></td>
                    <td className="mono">
                      {trend === null ? "—" : <span className={trend >= 0 ? "val-up" : "val-down"}>{trend >= 0 ? "▲" : "▼"} {fmt(Math.abs(trend), d.decimals)}</span>}
                    </td>
                    <td><CategoryBadge id={cat?.id} label={cat?.label} color={cat?.color} /></td>
                    <td><ImpactBadge level={d.impact} /></td>
                    <td className="cell-muted">{d.last?.date?.slice(0, 7) || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
