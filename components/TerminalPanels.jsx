// components/TerminalPanels.jsx
// Tiga panel "Pro Terminal" di atas chart:
//  1. CotPanel      — CFTC COT (XAU/DXY/aset lain) + rasio Long/Short + tren
//  2. SessionPanel  — 4 sesi pasar live (jam WIB real-time, sadar DST)
//  3. CalendarPanel — event High-impact ekonomi terdekat + hitung mundur

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SESSIONS, sessionStatus, wibNow } from "../lib/sessions";
import { COT_OFFICIAL_URL } from "../lib/cotData";

const fmt = (n) => n.toLocaleString("en-US");

function useTick(ms = 1000) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

const FLAGS = {
  US: "🇺🇸", EU: "🇪🇺", UK: "🇬🇧", CN: "🇨🇳", JP: "🇯🇵", AU: "🇦🇺",
  CA: "🇨🇦", DE: "🇩🇪", NZ: "🇳🇿", IN: "🇮🇳", RU: "🇷🇺", CH: "🇨🇭",
  BR: "🇧🇷", KR: "🇰🇷", SG: "🇸🇬", MX: "🇲🇽",
};
export function flagOf(code) {
  return FLAGS[code] || "🏳️";
}

function countdown(iso, now) {
  if (!iso || !now) return "";
  let ms = new Date(iso).getTime() - now.getTime();
  if (ms < 0) ms = 0;
  const m = Math.floor(ms / 60000);
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  const mm = m % 60;
  if (d > 0) return `${d} hari ${h} jam`;
  if (h > 0) return `${h} jam ${String(mm).padStart(2, "0")} mnt`;
  return `${mm} menit`;
}

// ─────────────────────────────────────────────────────────────────────────
// 1. COT PANEL — data CFTC + rasio Long/Short
// ─────────────────────────────────────────────────────────────────────────
function Sparkline({ points }) {
  if (!points || points.length < 2) return null;
  const w = 132, h = 34, pad = 3;
  const vs = points.map((p) => p.v);
  const min = Math.min(...vs), max = Math.max(...vs);
  const span = max - min || 1;
  const coords = points.map((p, i) => {
    const x = pad + (i / (points.length - 1)) * (w - pad * 2);
    const y = h - pad - ((p.v - min) / span) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const last = coords[coords.length - 1].split(",");
  return (
    <svg className="cot-spark" viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
      <polyline points={coords.join(" ")} fill="none" stroke="var(--accent)" strokeWidth="1.6" />
      <circle cx={last[0]} cy={last[1]} r="2.4" fill="var(--accent)" />
    </svg>
  );
}

export function CotPanel({ cot }) {
  if (!cot) return null;
  const hasLS = cot.long != null && cot.short != null;
  const lPct = hasLS ? (cot.long / (cot.long + cot.short)) * 100 : null;
  const sPct = hasLS ? 100 - lPct : null;
  const ratio = hasLS ? (cot.long / cot.short).toFixed(1) : null;
  const change = cot.change ?? null;
  const up = change == null ? true : change >= 0;
  const net = cot.net ?? null;
  const netUp = net == null ? true : net >= 0;

  return (
    <article className="term-card">
      <header className="term-head">
        <h3 className="term-title">
          <span className="term-ico" aria-hidden="true">📊</span>
          COT — {cot.label}
        </h3>
        <span className="term-badge">{cot.category}</span>
      </header>

      <div className="term-body">
        <div className="cot-net-row">
          <div className="cot-net">
            <span className={`cot-net-num ${netUp ? "up" : "down"}`}>
              {net != null ? `${net >= 0 ? "+" : "−"}${fmt(Math.abs(net))}` : "—"}
            </span>
            <span className="cot-net-lbl">Net {net != null && net >= 0 ? "Long" : "Short"} (kontrak)</span>
          </div>
          {change != null && (
            <span className={`cot-chg ${up ? "up" : "down"}`} title="Perubahan vs pekan sebelumnya">
              {up ? "▲" : "▼"} {up ? "+" : "−"}{fmt(Math.abs(change))}
            </span>
          )}
        </div>

        {hasLS ? (
          <div className="cot-ls">
            <div className="cot-ls-top">
              <span className="ls-lbl long">LONG {lPct.toFixed(1)}%</span>
              <span className="ls-ratio" title="Rasio Long:Short">
                {ratio}:1 <em>L/S</em>
              </span>
              <span className="ls-lbl short">SHORT {sPct.toFixed(1)}%</span>
            </div>
            <div className="ls-bar" role="img" aria-label={`Long ${lPct.toFixed(1)} persen, short ${sPct.toFixed(1)} persen`}>
              <span className="ls-bar-long" style={{ width: `${lPct}%` }} />
              <span className="ls-bar-short" style={{ width: `${sPct}%` }} />
            </div>
            <div className="cot-ls-nums">
              <span>L {fmt(cot.long)}</span>
              <span>S {fmt(cot.short)}{cot.spread ? ` + ${fmt(cot.spread)} spr` : ""}</span>
            </div>
          </div>
        ) : (
          <div className="cot-qual">{cot.reading}</div>
        )}

        {cot.trend && (
          <div className="cot-trend" title="Net posisi (ribuan kontrak) — CFTC COT, mingguan">
            <Sparkline points={cot.trend} />
            <span className="cot-trend-lbl">
              {cot.trend[0].d} → {cot.trend[cot.trend.length - 1].d}
            </span>
          </div>
        )}

        {hasLS && (
          <ul className="cot-facts">
            {cot.oi != null && <li>Open Interest <b>{fmt(cot.oi)}</b> kontrak</li>}
            {cot.contract && <li>{cot.contract}</li>}
            {cot.commLong != null && (
              <li>Komersial net <b className="down">−{fmt(cot.commShort - cot.commLong)}</b> (L {fmt(cot.commLong)} / S {fmt(cot.commShort)})</li>
            )}
            <li className="cot-reading-inline">{cot.reading}</li>
          </ul>
        )}

        <footer className="term-src">
          <span>CFTC COT · as-of {cot.asOf} · rilis {cot.released}</span>
          <span className="term-src-links">
            <a href={cot.url} target="_blank" rel="noopener noreferrer">Sumber ↗</a>
            <a href={COT_OFFICIAL_URL} target="_blank" rel="noopener noreferrer">CFTC resmi ↗</a>
          </span>
        </footer>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 2. SESSION PANEL — 4 sesi pasar, jam WIB live (sadar DST)
// ─────────────────────────────────────────────────────────────────────────
function fmtRemain(ms) {
  const m = Math.floor(ms / 60000);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}j ${String(m % 60).padStart(2, "0")}m`;
  return `${m}m`;
}

export function SessionPanel() {
  const now = useTick(1000);
  const wib = now ? wibNow(now) : null;

  const rows = useMemo(() => {
    if (!now) return null;
    return SESSIONS.map((s) => ({ s, st: sessionStatus(s, now) }));
  }, [now]);

  const active = rows ? rows.filter((r) => r.st?.active) : [];
  const overlap =
    active.length === 2
      ? `${active[0].s.name} × ${active[1].s.name}`
      : active.length === 3
        ? "3 sesi beririsan"
        : null;

  return (
    <article className="term-card">
      <header className="term-head">
        <h3 className="term-title">
          <span className="term-ico" aria-hidden="true">🕐</span>
          Sesi Pasar <span className="term-sub">· WIB live</span>
        </h3>
        <span className="term-badge live-badge">
          <span className="pulse-dot" style={{ width: 6, height: 6 }} /> {wib ? wib.string : "--:--:--"}
        </span>
      </header>

      <div className="term-body">
        {!rows && <div className="sess-loading">Memuat jam sesi…</div>}
        <ul className="sess-list">
          {rows?.map(({ s, st }) => (
            <li key={s.id} className={`sess-row ${st.active ? "active" : ""}`}>
              <span className="sess-name" title={`Jam lokal bursa ${s.name}`}>
                <span className="sess-flag" aria-hidden="true">{s.flag}</span>
                {s.name}
                {st.active && <span className="sess-open-dot" aria-label="Buka" />}
              </span>
              <span className="sess-time">{st.label}</span>
              <span className="sess-state">
                {st.active ? (
                  <span className="sess-chip open">
                    BUKA · tutup {fmtRemain(st.msToOpen)}
                  </span>
                ) : (
                  <span className="sess-chip closed">
                    TERTUTUP · buka {fmtRemain(st.msToOpen)}
                  </span>
                )}
              </span>
              <span className="sess-progress" aria-hidden="true">
                <span style={{ width: st.active ? `${(st.progress * 100).toFixed(1)}%` : "0%" }} />
              </span>
            </li>
          ))}
        </ul>

        <div className={`sess-overlap ${overlap ? "on" : ""}`}>
          {overlap ? (
            <>
              <b>PRIME TIME</b> — volatilitas &amp; likuiditas tertinggi: <b>{overlap}</b>
            </>
          ) : (
            <span>
              Sesi <b>{active.length ? active.map((a) => a.s.name).join(", ") : "terdekat"}</b>{" "}
              {active.length === 1 ? "berjalan" : "akan berjalan"} — volatilitas relatif terbatas.
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 3. CALENDAR PANEL — event High-impact terdekat + hitung mundur
// ─────────────────────────────────────────────────────────────────────────
export function CalendarPanel({ events = [] }) {
  const now = useTick(30000);
  const t = now ? now.getTime() : 0;

  const upcoming = useMemo(() => {
    return (events || [])
      .filter((e) => e.iso && new Date(e.iso).getTime() >= t)
      .sort((a, b) => a.iso.localeCompare(b.iso));
  }, [events, t]);

  const featured = upcoming.find((e) => e.impact === "High") || upcoming[0] || null;
  const rest = upcoming.filter((e) => e !== featured).slice(0, 3);

  return (
    <article className="term-card">
      <header className="term-head">
        <h3 className="term-title">
          <span className="term-ico" aria-hidden="true">📅</span>
          Kalender Ekonomi <span className="term-sub">· High Impact</span>
        </h3>
        <span className="term-badge">Terdekat</span>
      </header>

      <div className="term-body">
        {featured ? (
          <>
            <div className="cal-feat">
              <div className="cal-feat-top">
                <span className="cal-flag" aria-hidden="true">{flagOf(featured.country)}</span>
                <span className={`impact-badge ${featured.impact === "High" ? "kritis" : "tinggi"}`}>
                  {featured.impact}
                </span>
                <span className="cal-count" title="Hitung mundur ke rilis">
                  {now ? countdown(featured.iso, now) : "—"}
                </span>
              </div>
              <h4 className="cal-title">{featured.title}</h4>
              <p className="cal-meta">
                {featured.date} · {featured.time} WIB · kategori {featured.category}
              </p>
              {featured.indicatorId && (
                <Link
                  className="cal-link"
                  href={`/indicators/${featured.indicatorId}`}
                  title="Lihat analisis indikator, data historis, dan prospek"
                >
                  Analisis &amp; historis indikator ini →
                </Link>
              )}
            </div>

            {rest.length > 0 && (
              <ul className="cal-rest">
                {rest.map((e, i) => (
                  <li key={`${e.iso}-${i}`}>
                    <span className="cal-rest-date">{e.date} {e.time}</span>
                    <span className="cal-rest-title">
                      <span aria-hidden="true">{flagOf(e.country)}</span> {e.title}
                    </span>
                    <span className={`cal-rest-impact ${e.impact === "High" ? "kritis" : "sedang"}`}>
                      {e.impact}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="sess-loading">Tidak ada event terjadwal ke depan.</p>
        )}
      </div>
    </article>
  );
}
