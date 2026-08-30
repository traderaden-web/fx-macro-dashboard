// components/FundamentalsCard.jsx
// Card penjelasan fundamental per aset — data riil (as-of 30 Agu 2026),
// konsisten dengan /analysis (sumber: BLS, FRED, Treasury, ECB, ONS, EIA).

"use client";

import { useMemo } from "react";
import { assetFundamentals } from "../lib/fundamentals";

const pct = (v, digits = 2) =>
  v == null ? "—" : `${v.toLocaleString("en-US", { maximumFractionDigits: digits })}%`;

export default function FundamentalsCard({ assetId, assetLabel }) {
  const f = useMemo(() => assetFundamentals(assetId), [assetId]);

  return (
    <article className="term-card fund-card">
      <header className="term-head">
        <h3 className="term-title">
          <span className="term-ico" aria-hidden="true">🏛</span>
          Fundamental <span className="term-sub">· {assetLabel}</span>
        </h3>
        <span className="term-badge">As-of 30 Agu 2026</span>
      </header>

      <div className="term-body fund-body">
        {/* Ringkasan negara pendorong */}
        <div className="fund-countries">
          {f.countries.map((c) => (
            <div key={c.key} className="fund-country" title={c.moveNote || ""}>
              <span className="fund-country-name">{c.name}</span>
              <span className="fund-vals">
                <b>{pct(c.rate)}</b>
                <i className="fund-sep">·</i>
                infl <b>{pct(c.inflation)}</b>
                <i className="fund-sep">·</i>
                unemp <b>{pct(c.unemp)}</b>
                <i className="fund-sep">·</i>
                gdp <b>{pct(c.gdp, 1)}</b>
              </span>
              <span className="fund-move">{c.bank} {c.move != null ? `${c.move > 0 ? "+" : ""}${c.move}bp` : ""} {c.moveNote ? "· " + c.moveNote : ""}</span>
            </div>
          ))}
        </div>

        <p className="fund-headline">{f.headline}</p>

        <div className="fund-block">
          <h4 className="fund-h">Apa yang menggerakkan</h4>
          <ul className="fund-drivers">
            {f.drivers.map((d, i) => (
              <li key={i} title={d.note}>
                <span className="fund-d-k">{d.k}</span>
                <span className="fund-d-v">{d.v}</span>
                <span className="fund-d-note">{d.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="fund-block">
          <h4 className="fund-h">Katalis terdekat</h4>
          <ul className="fund-cats">
            {f.catalysts.map((c, i) => (
              <li key={i}>
                <span className="fund-cat-date">{c.date}</span>
                {c.ev}
              </li>
            ))}
          </ul>
        </div>

        <footer className="term-src">
          <span>
            Sumber: {f.sources.map((s) => s.label).join(", ")}
          </span>
          <span className="term-src-links">
            {f.sources.slice(0, 2).map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label.split(" — ")[0].split(" (")[0]} ↗
              </a>
            ))}
          </span>
        </footer>
      </div>
    </article>
  );
}
