"use client";

// components/MacroMap.jsx
// Peta Makro Global ala TradingView: peta dunia (SVG equirectangular,
// geometri Natural Earth 50m) dengan negara-negara utama diwarnai sesuai
// indikator makro terpilih.
// Animasi: negara muncul berurutan + re-entrance per indikator, pin berdenyut,
// RADAR menyapu peta, partikel digital melayang, ARCA aliran data dari entitas
// ekstrem ke semua bank sentral (partikel terbang), denyut ekstrem + badge,
// count-up panel, ripple klik, ticker data bergulir.
// Interaksi: hover = tooltip ikut kursor · KLIK negara = popup modal data
// lengkap + berita terkini (/api/country/news).
// Data kurasi per-30-Agu-2026 (lib/macroData.js).

import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES, OTHERS, MAP_VIEW } from "../lib/worldMapData";
import {
  MACRO_ASOF,
  INDICATORS,
  CAPITAL_POINTS,
  projectPoint,
  dataFor,
  COUNTRY_DATA,
  COUNTRY_NAMES,
  countryColor,
  legendStops,
} from "../lib/macroData";
import { IconGlobe } from "./Icons";

const FMT = (v, d = 1) => (v === null || v === undefined ? "—" : Number(v).toLocaleString("id-ID", { maximumFractionDigits: d }));

// Angka count-up kecil untuk panel detail (animasi ulang tiap nilai/negara ganti)
function Num({ v }) {
  const [d, setD] = useState(0);
  useEffect(() => {
    if (v === null || v === undefined) { setD(0); return undefined; }
    const start = performance.now();
    const dur = 500;
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setD(v * e);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setD(v);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [v]);
  return <>{FMT(d)}</>;
}

function timeAgo(iso) {
  if (!iso) return "";
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.round(h / 24)} hari lalu`;
}

// ── Posisi nilai pada domain indikator (mini bar) ───────────────────────
function IndicatorBar({ indId, d }) {
  const ind = INDICATORS.find((i) => i.id === indId);
  const val = d[indId];
  if (val === null || val === undefined) return null;
  const [lo, hi] = ind.domain;
  const t = Math.max(0, Math.min(1, (val - lo) / (hi - lo)));
  return (
    <div className="cm-bar-row">
      <span className="cm-bar-label">{ind.label}</span>
      <div className="cm-bar">
        <i style={{ left: `${(t * 100).toFixed(1)}%`, background: countryColor(indId, val) }} />
      </div>
      <b className="cm-bar-val">{FMT(val)}{ind.unit}</b>
    </div>
  );
}

// ── Popup modal: data lengkap + berita terkini negara ───────────────────
function CountryModal({ cc, onClose }) {
  const [news, setNews] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    let alive = true;
    fetch(`/api/country/news?cc=${cc}`)
      .then((r) => r.json().then((j) => ({ status: r.status, j })))
      .then(({ status, j }) => {
        if (!alive) return;
        if (status === 200 && j.ok) setNews(j);
        else setErr(j?.error || "Berita gagal dimuat");
      })
      .catch(() => alive && setErr("Gagal terhubung ke server"));
    return () => {
      alive = false;
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cc, onClose]);

  const d = COUNTRY_DATA[cc];
  const name = COUNTRY_NAMES[cc];
  if (!d) return null;

  return (
    <div
      className="cm-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail ${name}`}
    >
      <div className="cm-modal">
        <header className="cm-head">
          <div>
            <h3 className="cm-name">{name}</h3>
            <p className="cm-sub">{d.rateBank} · data per {MACRO_ASOF}</p>
          </div>
          <span className={`cm-move ${d.move > 0 ? "hawk" : "dove"}`}>
            {d.move > 0 ? `▲ +${d.move}bp · hawkish` : `▼ ${d.move}bp · dovish`}
          </span>
          <button type="button" className="cm-close" onClick={onClose} aria-label="Tutup" title="Tutup (Esc)">✕</button>
        </header>

        <div className="cm-body">
          <div className="cm-stats">
            <div className="cm-stat">
              <em>Suku bunga acuan</em>
              <b>{FMT(d.rate)}%</b>
            </div>
            <div className="cm-stat">
              <em>Inflasi YoY</em>
              <b>{d.inflation != null ? `${FMT(d.inflation)}%` : "—"}</b>
            </div>
            <div className="cm-stat" title={d.gdpNote || ""}>
              <em>GDP{d.gdpNote ? ` (${d.gdpNote})` : ""}</em>
              <b>{d.gdp != null ? `${FMT(d.gdp)}%` : "—"}</b>
            </div>
            <div className="cm-stat">
              <em>Pengangguran</em>
              <b>{d.unemp != null ? `${FMT(d.unemp)}%` : "—"}</b>
            </div>
          </div>

          <p className="cm-movenote">📌 {d.moveNote}</p>

          <div className="cm-bars">
            {INDICATORS.filter((i) => d[i.id] != null).map((i) => (
              <IndicatorBar key={i.id} indId={i.id} d={d} />
            ))}
          </div>

          <div className="cm-news">
            <h4 className="cm-news-title">📰 Berita Terkini {name}</h4>
            {err && <p className="cm-news-err">⚠️ {err}. Coba lagi sebentar lagi.</p>}
            {!err && !news && <p className="cm-news-load">Memuat berita terbaru…</p>}
            {news && news.items.length === 0 && <p className="cm-news-load">Tidak ada berita terbaru saat ini.</p>}
            <ul className="cm-news-list">
              {(news?.items || []).map((it) => (
                <li key={it.id}>
                  <a href={it.link} target="_blank" rel="noopener noreferrer" className="cm-news-item">
                    <span className="cm-news-title2">{it.title}</span>
                    <span className="cm-news-meta">{it.source} · {timeAgo(it.iso)}</span>
                    {it.rssSummary && (
                      <span className="cm-news-sum">
                        {it.rssSummary.length > 170 ? `${it.rssSummary.slice(0, 170)}…` : it.rssSummary}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MacroMap() {
  const [indId, setIndId] = useState("rate");
  const [hover, setHover] = useState(null); // id topo negara
  const [modalKey, setModalKey] = useState(null); // entitas makro untuk modal
  const [tip, setTip] = useState(null); // posisi kursor {x, y, w} relatif frame
  const [ripples, setRipples] = useState([]); // efek klik
  const frameRef = useRef(null);
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
  const hoverVal = hoverData ? hoverData[indId] : null;

  // Entitas dengan nilai TERBESAR indikator aktif → denyut "ekstrem" + badge di peta
  const extreme = useMemo(() => {
    const valid = Object.keys(COUNTRY_DATA).map((k) => ({ k, v: COUNTRY_DATA[k][indId] })).filter((x) => x.v != null);
    if (!valid.length) return null;
    const best = valid.reduce((a, b) => (b.v > a.v ? b : a));
    const pin = pins.find((p) => p.key === best.k);
    return pin ? { ...best, x: pin.x, y: pin.y, name: COUNTRY_NAMES[best.k] } : null;
  }, [indId, pins]);

  // Klik negara → ripple di titik klik + (bila berdata) buka modal
  const onCountryClick = (e, id) => {
    const d = dataFor(id);
    setHover(id);
    const r = frameRef.current?.getBoundingClientRect();
    if (r) {
      const rid = Date.now() + Math.random();
      setRipples((rs) => [...rs, { id: rid, x: e.clientX - r.left, y: e.clientY - r.top }]);
      setTimeout(() => setRipples((rs) => rs.filter((x) => x.id !== rid)), 700);
    }
    if (d) setModalKey(d.key);
  };

  // Arc aliran data: sinyal "memancar" dari entitas ekstrem ke semua bank sentral lain
  const arcs = useMemo(() => {
    if (!extreme) return [];
    return pins
      .filter((p) => p.key !== extreme.k)
      .map((p, i) => {
        const x1 = extreme.x, y1 = extreme.y, x2 = p.x, y2 = p.y;
        const dist = Math.hypot(x2 - x1, y2 - y1);
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2 - Math.max(14, dist * 0.22);
        return {
          key: p.key,
          i,
          d: `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
        };
      });
  }, [extreme, pins]);

  // Partikel digital melayang (posisi deterministik — aman untuk SSR/hydration)
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: (i * 61 + 13) % 100,
        top: ((i * 37 + 29) % 86) + 8,
        dur: 9 + ((i * 7) % 8),
        delay: -((i * 13) % 9),
        size: 1.5 + (i % 3) * 0.8,
      })),
    []
  );

  // Ticker: ringkasan 4 indikator semua entitas, bergulir
  const tickerItems = useMemo(
    () =>
      Object.keys(COUNTRY_DATA).map((k) => {
        const d = COUNTRY_DATA[k];
        return `${COUNTRY_NAMES[k]} · ${FMT(d.rate)}% · ${d.inflation != null ? FMT(d.inflation) + "%" : "—"} · ${d.gdp != null ? FMT(d.gdp) + "%" : "—"} · ${d.unemp != null ? FMT(d.unemp) + "%" : "—"}`;
      }),
    []
  );

  return (
    <div className="card reveal map-card">
      <div className="section-head map-head">
        <div className="section-title">
          <span className="inline-ico" aria-hidden="true"><IconGlobe size={18} /></span>
          <div>
            <h3>Peta Makro Global</h3>
            <span className="map-sub">Kebijakan moneter &amp; data ekonomi negara-negara penggerak pasar Forex, Gold &amp; Komoditi — klik negara untuk data lengkap + berita</span>
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
        <div className="map-frame" ref={frameRef}>
          <svg
            className="map-svg"
            viewBox={`0 0 ${MAP_VIEW[0]} ${MAP_VIEW[1]}`}
            role="img"
            aria-label={`Peta dunia: ${ind.label}`}
            onMouseMove={(e) => {
              const r = frameRef.current?.getBoundingClientRect();
              if (r) setTip({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width });
            }}
            onMouseLeave={() => setTip(null)}
          >
            <defs>
              <pattern id="map-grid" width="62.5" height="62.5" patternUnits="userSpaceOnUse">
                <path d="M 62.5 0 L 0 0 0 62.5" fill="none" stroke="#1c2230" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width={MAP_VIEW[0]} height={MAP_VIEW[1]} fill="url(#map-grid)" className="map-bg" />
            {/* negara non-target (gabungan) */}
            <path d={OTHERS} fill="#1a2029" stroke="#242b38" strokeWidth="0.5" className="map-others" />
            {/* negara target: interaktif — re-entrance wave tiap ganti indikator */}
            <g key={`countries-${indId}`}>
              {Object.entries(COUNTRIES).map(([id, c], i) => {
                const d = dataFor(id);
                const val = d ? d[indId] : null;
                const fill = d ? countryColor(indId, val) : "#333c4c";
                const isHover = hover === id;
                const isExtreme = extreme && d && d.key === extreme.k;
                return (
                  <path
                    key={id}
                    d={c.d}
                    fill={fill}
                    stroke={isHover ? "#f0b429" : "#0a0c10"}
                    strokeWidth={isHover ? 1.4 : 0.7}
                    className={`map-country ${isExtreme ? "map-country-extreme" : ""}`}
                    style={{ "--i": i }}
                    onMouseEnter={() => setHover(id)}
                    onMouseLeave={() => setHover(null)}
                    onClick={(e) => onCountryClick(e, id)}
                  />
                );
              })}
            </g>
            {/* pin berdenyut di ibu kota */}
            <g key={`pins-${indId}`}>
              {pins.map((p, i) => {
                const c = countryColor(indId, p.data[indId]);
                return (
                  <g key={`pin-${p.key}`} className="map-pin" aria-hidden="true">
                    <circle className="map-pin-ring" cx={p.x} cy={p.y} r="6" fill="none" stroke={c} strokeWidth="1.3" style={{ "--pd": `${i * 0.22}s` }} />
                    <circle className="map-pin-dot" cx={p.x} cy={p.y} r="2.5" fill={c} stroke="#0a0c10" strokeWidth="0.9" />
                  </g>
                );
              })}
            </g>
            {/* arc aliran data: dari entitas ekstrem ke semua bank sentral lain */}
            <g key={`arcs-${indId}`} className="map-arcs" aria-hidden="true">
              {arcs.map((a) => (
                <g key={a.key}>
                  <path d={a.d} pathLength={1} className="map-arc" style={{ "--i": a.i }} />
                  <g className="map-arc-pkt" style={{ "--i": a.i }}>
                    <circle r="2.8" fill="rgba(240,180,41,0.20)" />
                    <circle r="1.3" fill="#f0b429" />
                    <animateMotion
                      dur={`${(2.8 + (a.i % 5) * 0.45).toFixed(2)}s`}
                      begin={`${(1 + a.i * 0.13).toFixed(2)}s`}
                      repeatCount="indefinite"
                      path={a.d}
                    />
                  </g>
                </g>
              ))}
            </g>
            {/* badge nilai ekstrem di atas pin */}
            {extreme && (
              <g className="map-extreme" aria-hidden="true">
                <text x={extreme.x} y={extreme.y - 11} textAnchor="middle">
                  ▲ {FMT(extreme.v)}{ind.unit}
                </text>
              </g>
            )}
          </svg>
          {/* radar memutar + partikel digital melayang */}
          <div className="map-radar" aria-hidden="true" />
          <div className="map-particles" aria-hidden="true">
            {particles.map((p, i) => (
              <i
                key={i}
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: p.size,
                  height: p.size,
                  animationDuration: `${p.dur}s`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}
          </div>
          {/* ripple di titik klik */}
          {ripples.map((rp) => (
            <span key={rp.id} className="map-ripple" style={{ left: rp.x, top: rp.y }} aria-hidden="true" />
          ))}
          {/* tooltip mengikuti kursor */}
          {hover && hoverData && tip && (
            <div
              className="map-tip"
              style={{ left: Math.max(90, Math.min(tip.w - 90, tip.x)), top: tip.y }}
              aria-hidden="true"
            >
              <b>{hoverData.name}</b>
              <span className="mtip-bank">{hoverData.bank}</span>
              <span className={`mtip-val ${hoverVal >= 0 ? "up" : "down"}`}>
                {ind.label}: {FMT(hoverVal)}{ind.unit}
              </span>
              <span className="mtip-cta">Klik untuk data lengkap &amp; berita →</span>
            </div>
          )}
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
            {extreme && (
              <div className="map-legend-extreme" key={`ext-${indId}-${extreme.k}`}>
                <i aria-hidden="true" />
                <span>
                  Tertinggi: <b>{extreme.name}</b> {FMT(extreme.v)}
                  {ind.unit}
                </span>
              </div>
            )}
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
                      <b>{hoverData.rate !== null ? <><Num v={hoverData.rate} />%</> : "—"}</b>
                    </span>
                    <span className="map-stat">
                      <em>Inflasi YoY</em>
                      <b>{hoverData.inflation !== null ? <><Num v={hoverData.inflation} />%</> : "—"}</b>
                    </span>
                    <span className="map-stat">
                      <em>GDP{hoverData.gdpNote ? ` (${hoverData.gdpNote})` : ""}</em>
                      <b>{hoverData.gdp !== null ? <><Num v={hoverData.gdp} />%</> : "—"}</b>
                    </span>
                    <span className="map-stat">
                      <em>Pengangguran</em>
                      <b>{hoverData.unemp !== null ? <><Num v={hoverData.unemp} />%</> : "—"}</b>
                    </span>
                  </div>
                  <div className="map-detail-move">{hoverData.moveNote}</div>
                  <div className="map-detail-cta">Klik untuk data lengkap &amp; berita →</div>
                </>
              ) : (
                <div className="map-detail-hint">Arahkan kursor ke negara pada peta untuk detail — klik negara untuk membuka data lengkap &amp; berita terbarunya.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ticker data bergulir — semua entitas, 4 indikator */}
      <div className="map-ticker" aria-hidden="true">
        <span className="map-ticker-label">LIVE</span>
        <div className="map-ticker-viewport">
          <div className="map-ticker-track">
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i} className="map-ticker-item">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="map-foot">
        <span>Data per {MACRO_ASOF} · sumber: ONS, ECB, FRED, RBA, Investing.com, TradingEconomics, Fitch, OECD</span>
        <span>Arc = sinyal terkuat memancar · hover / klik negara · {INDICATORS.length} indikator</span>
      </div>

      {modalKey && <CountryModal cc={modalKey} onClose={() => setModalKey(null)} />}
    </div>
  );
}
