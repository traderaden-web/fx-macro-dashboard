"use client";

// components/MacroMap.jsx
// Peta Makro Global ala TradingView: peta dunia (SVG equirectangular,
// geometri Natural Earth 110m) dengan negara-negara utama diwarnai sesuai
// indikator makro terpilih. Animasi: negara muncul berurutan, pin berdenyut
// di ibu kota bank sentral, sweep cahaya menyapu peta, transisi halus.
// Data kurasi per-30-Agu-2026 (lib/macroData.js).

import { useMemo, useState } from "react";
import { COUNTRIES, OTHERS, MAP_VIEW } from "../lib/worldMapData";
import {
  MACRO_ASOF,
  INDICATORS,
  CAPITAL_POINTS,
  projectPoint,
  dataFor,
  countryColor,
  legendStops,
} from "../lib/macroData";
import { IconGlobe } from "./Icons";

const FMT = (v, d = 1) => (v === null || v === undefined ? "—" : Number(v).toLocaleString("id-ID", { maximumFractionDigits: d }));

export default function MacroMap() {
  const [indId, setIndId] = useState("rate");
  const [hover, setHover] = useState(null); // id topo negara
  const ind = INDICATORS.find((i) => i.id === indId);

  const stops = useMemo(() => legendStops(indId), [indId]);
  const gradient = useMemo(
    () => `linear-gradient(90deg, ${stops.map(([t, c]) => `${c} ${t * 100}%`).join(", ")})`,
    [stops]
  );

  // satu pin per entitas berdata (19 negara Zona Euro → 1 pin di Frankfurt)
  const pins = useMemo(() => {
    const seen = new Map();
    for (const id of Object.keys(COUNTRIES)) {
      const d = dataFor(id);
      if (!d || seen.has(d.key) || !CAPITAL_POINTS[d.key]) continue;
      const [x, y] = projectPoint(...CAPITAL_POINTS[d.key]);
      seen.set(d.key, { key: d.key, x, y, data: d });
    }
    return [...seen.values()];
  }, []);

  const hoverData = hover ? dataFor(hover) : null;

  return (
    <div className="card reveal map-card">
      <div className="section-head map-head">
        <div className="section-title">
          <span className="inline-ico" aria-hidden="true"><IconGlobe size={18} /></span>
          <div>
            <h3>Peta Makro Global</h3>
            <span className="map-sub">Kebijakan moneter &amp; data ekonomi negara-negara penggerak pasar Forex, Gold &amp; Komoditi</span>
          </div>
        </div>
        <div className="seg" role="tablist" aria-label="Indikator peta makro">
          {INDICATORS.map((i) => (
            <button
              key={i.id}
              role="tab"
              aria-selected={indId === i.id}
              className={`seg-btn ${indId === i.id ? "active" : ""}`}
              onClick={() => { setIndId(i.id); setHover(null); }}
              title={i.label}
            >
              {i.id === "rate" ? "Suku Bunga" : i.id === "inflation" ? "Inflasi" : i.id === "gdp" ? "GDP" : i.id === "unemp" ? "Pengangguran" : "Langkah Terakhir"}
            </button>
          ))}
        </div>
      </div>

      <div className="map-wrap">
        <div className="map-frame">
          <svg
            className="map-svg"
            viewBox={`0 0 ${MAP_VIEW[0]} ${MAP_VIEW[1]}`}
            role="img"
            aria-label={`Peta dunia: ${ind.label}`}
          >
            <defs>
              <pattern id="map-grid" width="62.5" height="62.5" patternUnits="userSpaceOnUse">
                <path d="M 62.5 0 L 0 0 0 62.5" fill="none" stroke="#1c2230" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width={MAP_VIEW[0]} height={MAP_VIEW[1]} fill="url(#map-grid)" className="map-bg" />
            {/* negara non-target (gabungan) */}
            <path d={OTHERS} fill="#1a2029" stroke="#242b38" strokeWidth="0.5" className="map-others" />
            {/* negara target: interaktif, muncul berurutan */}
            {Object.entries(COUNTRIES).map(([id, c], i) => {
              const d = dataFor(id);
              const val = d ? d[indId] : null;
              const fill = d ? countryColor(indId, val) : "#333c4c";
              const isHover = hover === id;
              return (
                <path
                  key={id}
                  d={c.d}
                  fill={fill}
                  stroke={isHover ? "#f0b429" : "#0a0c10"}
                  strokeWidth={isHover ? 1.4 : 0.7}
                  className="map-country"
                  style={{ "--i": i }}
                  onMouseEnter={() => setHover(id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setHover(id)}
                />
              );
            })}
            {/* pin berdenyut di ibu kota */}
            {pins.map((p, i) => {
              const c = countryColor(indId, p.data[indId]);
              return (
                <g key={`pin-${p.key}`} className="map-pin" aria-hidden="true">
                  <circle className="map-pin-ring" cx={p.x} cy={p.y} r="6" fill="none" stroke={c} strokeWidth="1.3" style={{ "--pd": `${i * 0.22}s` }} />
                  <circle className="map-pin-dot" cx={p.x} cy={p.y} r="2.5" fill={c} stroke="#0a0c10" strokeWidth="0.9" />
                </g>
              );
            })}
          </svg>
          <div className="map-sweep" aria-hidden="true" />
        </div>

        <div className="map-side">
          <div className="map-legend" key={`legend-${indId}`}>
            <div className="map-legend-title">
              {ind.label} <span>({ind.unit})</span>
            </div>
            <div className="map-legend-bar" style={{ background: gradient }} />
            <div className="map-legend-scale">
              <span>{ind.domain[0]}{ind.unit}</span>
              <span>{(ind.domain[0] + ind.domain[1]) / 2}{ind.unit}</span>
              <span>{ind.domain[1]}{ind.unit}</span>
            </div>
            <div className="map-legend-nodata">
              <i /> tanpa data
            </div>
            <div className="map-legend-pin">
              <i aria-hidden="true" /> ibu kota / markas bank sentral
            </div>
          </div>

          <div className={`map-detail ${hoverData ? "" : "empty"}`}>
            <div className="map-detail-in" key={hoverData ? hoverData.name : "hint"}>
              {hoverData ? (
                <>
                  <div className="map-detail-name">
                    {hoverData.name}
                    <span className="map-detail-bank">{hoverData.bank}</span>
                  </div>
                  <div className="map-detail-stats">
                    <span className="map-stat">
                      <em>Suku bunga</em>
                      <b>{FMT(hoverData.rate)}{hoverData.rate !== null ? "%" : ""}</b>
                    </span>
                    <span className="map-stat">
                      <em>Inflasi YoY</em>
                      <b>{FMT(hoverData.inflation)}{hoverData.inflation !== null ? "%" : ""}</b>
                    </span>
                    <span className="map-stat">
                      <em>GDP{hoverData.gdpNote ? ` (${hoverData.gdpNote})` : ""}</em>
                      <b>{FMT(hoverData.gdp)}{hoverData.gdp !== null ? "%" : ""}</b>
                    </span>
                    <span className="map-stat">
                      <em>Pengangguran</em>
                      <b>{FMT(hoverData.unemp)}{hoverData.unemp !== null ? "%" : ""}</b>
                    </span>
                  </div>
                  <div className="map-detail-move">{hoverData.moveNote}</div>
                </>
              ) : (
                <div className="map-detail-hint">Arahkan kursor ke negara pada peta untuk detail — pin berdenyut menandai ibu kota / markas bank sentral.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="map-foot">
        <span>Data per {MACRO_ASOF} · sumber: ONS, ECB, FRED, RBA, Investing.com, TradingEconomics, Fitch, OECD</span>
        <span>Hover / ketuk negara · {INDICATORS.length} indikator</span>
      </div>
    </div>
  );
}
