// components/CalendarClient.jsx
// RELEASE CALENDAR — tampilan terminal interaktif untuk jadwal rilis ekonomi:
//   00 · NEXT RELEASE — hitung mundur live ke rilis High impact berikutnya
//   01 · FILTER JADWAL — jendela waktu, kategori, dampak, negara, pencarian
//   02 · JADWAL RILIS  — tabel terminal dikelompokkan per hari; baris dapat
//                        DIKLIK → detail (apa itu, kenapa penting, dampak FX,
//                        tautan indikator/analisis)
// Data: jadwal lokal (data/calendar.js) + ForexFactory live bila terjangkau.
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, getSeries } from "../lib/series";
import { CountryFlag } from "./Badges";
import TermClock from "./TermClock";

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const COUNTRY_META = {
  US: "Amerika Serikat", EZ: "Zona Euro", UK: "Inggris", JP: "Jepang", CN: "Tiongkok",
  AU: "Australia", CA: "Kanada", CH: "Swiss", NZ: "Selandia Baru", GL: "Global",
};
const IMP_CLS = { High: "im-high", Medium: "im-medium", Low: "im-low" };

function useNow() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function fmtCountdown(ms) {
  if (ms <= 0) return "SEKARANG";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (d > 0) return `T-${d}d ${h}j ${m}m`;
  if (h > 0) return `T-${h}j ${m}m ${String(ss).padStart(2, "0")}s`;
  return `T-${m}m ${String(ss).padStart(2, "0")}s`;
}

const fmtVal = (v) => (v === null || v === undefined ? "—" : Number(v).toLocaleString("id-ID", { maximumFractionDigits: 1 }));

// ── baris event + panel detail expandable ────────────────────────────────
function EventRow({ e, now, isNext, open, onToggle }) {
  const series = e.indicatorId ? getSeries(e.indicatorId) : null;
  const rowKey = e.iso + e.title;
  const ts = new Date(e.iso).getTime();
  const tNow = now ? now.getTime() : ts;
  const isPast = ts < tNow;
  const isToday = now && e.iso.slice(0, 10) === now.toISOString().slice(0, 10);
  const time = e.iso.slice(11, 16);
  const cat = CATEGORIES.find((c) => c.id === e.category);
  const cname = COUNTRY_META[e.country] || e.country;
  const hasData = e.actual != null || e.forecast != null || e.previous != null;
  const cd = !isPast && now ? fmtCountdown(ts - tNow) : null;

  return (
    <div className={`cal-row-wrap ${open ? "open" : ""}`}>
      <div
        className={`cal-row ${isPast ? "is-past" : ""} ${isToday ? "is-today" : ""} ${isNext ? "is-next" : ""}`}
        onClick={() => onToggle(rowKey)}
        onKeyDown={(ev) => (ev.key === "Enter" || ev.key === " ") && (ev.preventDefault(), onToggle(rowKey))}
        role="button"
        tabIndex={0}
        aria-expanded={open}
      >
        <span className="cal-r-time mono">
          {time}
          <i>{isPast ? "DONE" : isToday ? "HARI INI" : "WIB"}</i>
        </span>
        <span className="cal-r-title">
          <CountryFlag code={e.country} size={15} showCode={false} />
          {e.title}
          {isNext && <b className="cal-next-tag">NEXT</b>}
          {isPast && e.actual == null && <i className="cal-released">RELEASED</i>}
        </span>
        <span className="cal-r-cat" style={{ "--c": cat?.color }}>
          <i /> {cat?.label || e.category}
        </span>
        <span className={`cal-r-imp ${IMP_CLS[e.impact] || "im-low"}`} title={`Dampak ${e.impact}`}>
          <i /><i /><i />
        </span>
        <span className="cal-r-metrics mono">
          {e.previous != null && <b title="Previous"><u>P</u>{fmtVal(e.previous)}</b>}
          {e.forecast != null && <b title="Konsensus"><u>K</u>{fmtVal(e.forecast)}</b>}
          {e.actual != null && <b className="act" title="Actual"><u>A</u>{fmtVal(e.actual)}</b>}
          {!hasData && <span className="dim">—</span>}
        </span>
        <span className="cal-r-cd mono">{cd || ""}</span>
        <span className="cal-r-chev" aria-hidden="true">{open ? "▾" : "▸"}</span>
      </div>

      <div className="cal-detail">
        <div className="cal-detail-in">
          {series ? (
            <div className="cal-d-grid">
              <div>
                <em>APAKAH INI?</em>
                <p>{series.about}</p>
              </div>
              <div>
                <em>MENGAPA PENTING?</em>
                <p>{series.why}</p>
              </div>
              <div>
                <em>DAMPAK TERHADAP PAIR</em>
                <p>{series.fx}</p>
              </div>
              <div className="cal-d-foot">
                {series.release && <span className="cal-d-rel mono">JADWAL: {series.release}</span>}
                <Link className="cal-d-link mono" href={`/indicators/${e.indicatorId}`}>
                  Detail indikator →
                </Link>
                <Link className="cal-d-link mono" href="/analysis">
                  Analisis dampak →
                </Link>
              </div>
            </div>
          ) : (
            <div className="cal-d-grid">
              <div>
                <em>EVENT PASAR</em>
                <p>
                  Agenda pasar/pidato pejabat bank sentral — dampaknya sering terasa lewat sentimen.
                  Pantau berita terkait menjelang acara.
                </p>
              </div>
              <div className="cal-d-foot" style={{ gridColumn: "1 / -1" }}>
                <Link className="cal-d-link mono" href="/news">Berita pasar →</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── TERMINAL ─────────────────────────────────────────────────────────────
export default function CalendarClient({ events }) {
  const now = useNow();
  const [win, setWin] = useState("terkini");
  const [cat, setCat] = useState("semua");
  const [imp, setImp] = useState("semua");
  const [cc, setCc] = useState("semua");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);

  const DAY = 86400000;

  const countries = useMemo(() => [...new Set(events.map((e) => e.country))].filter(Boolean).sort(), [events]);
  const catList = useMemo(() => {
    const present = new Set(events.map((e) => e.category));
    return CATEGORIES.filter((c) => present.has(c.id));
  }, [events]);

  const filtered = useMemo(() => {
    let from = null, to = null;
    if (now) {
      if (win === "terkini") { from = new Date(now.getTime() - 3 * DAY); to = new Date(now.getTime() + 45 * DAY); }
      else if (win === "7") { from = now; to = new Date(now.getTime() + 7 * DAY); }
      else if (win === "30") { from = now; to = new Date(now.getTime() + 30 * DAY); }
    }
    const qm = q.trim().toLowerCase();
    return events
      .filter((e) => (cat === "semua" ? true : e.category === cat))
      .filter((e) => (imp === "semua" ? true : e.impact === imp))
      .filter((e) => (cc === "semua" ? true : e.country === cc))
      .filter((e) => !qm || e.title.toLowerCase().includes(qm))
      .filter((e) => !from || (new Date(e.iso) >= from && new Date(e.iso) <= to))
      .sort((a, b) => a.iso.localeCompare(b.iso));
  }, [events, cat, imp, cc, win, q, now]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const e of filtered) {
      const d = e.iso.slice(0, 10);
      if (!map.has(d)) map.set(d, []);
      map.get(d).push(e);
    }
    return [...map.entries()].map(([date, list]) => ({ date, list }));
  }, [filtered]);

  // rilis High impact berikutnya (untuk panel NEXT + tag baris)
  const nextHigh = useMemo(() => {
    if (!now) return null;
    const t = now.getTime();
    return (
      events
        .filter((e) => e.impact === "High" && new Date(e.iso).getTime() > t)
        .sort((a, b) => a.iso.localeCompare(b.iso))[0] || null
    );
  }, [events, now]);
  const nextHighs = useMemo(() => {
    if (!now) return [];
    const t = now.getTime();
    return events
      .filter((e) => e.impact === "High" && new Date(e.iso).getTime() > t)
      .sort((a, b) => a.iso.localeCompare(b.iso))
      .slice(0, 3);
  }, [events, now]);

  const dateLabel = (date) => {
    if (!now) return { main: DAY_NAMES[new Date(`${date}T00:00:00`).getDay()], sub: `${date.slice(8)} ${MONTHS[Number(date.slice(5, 7)) - 1]} ${date.slice(0, 4)}`, today: false };
    const todayKey = now.toISOString().slice(0, 10);
    if (date === todayKey) return { main: "HARI INI", sub: `${DAY_NAMES[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`, today: true };
    const dt = new Date(`${date}T00:00:00`);
    const yest = new Date(now.getTime() - DAY).toISOString().slice(0, 10);
    const tmr = new Date(now.getTime() + DAY).toISOString().slice(0, 10);
    if (date === yest) return { main: "KEMARIN", sub: `${DAY_NAMES[dt.getDay()]}, ${dt.getDate()} ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`, today: false };
    if (date === tmr) return { main: "BESOK", sub: `${DAY_NAMES[dt.getDay()]}, ${dt.getDate()} ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`, today: false };
    return { main: DAY_NAMES[dt.getDay()], sub: `${dt.getDate()} ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`, today: false };
  };

  const winLabel =
    win === "terkini" ? "3 hari terakhir → ±45 hari ke depan" :
    win === "semua" ? "seluruh rilis" :
    win === "7" ? "7 hari ke depan" : "30 hari ke depan";

  return (
    <div className="cal-term">
      <div className="ct-scan" aria-hidden="true" />

      <header className="cal-term-head">
        <span className="ct-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="cal-term-title mono">
          MACROLAB <em>//</em> RELEASE&nbsp;CALENDAR <span className="ct-ver">v1.0</span>
          <span className="ct-cursor" aria-hidden="true" />
        </span>
        <span className="cal-term-head-right">
          <span className="ct-led ok">WIB · UTC+7</span>
          <TermClock />
        </span>
      </header>

      {/* 00 · NEXT RELEASE */}
      <section className="cal-next" key={nextHigh ? nextHigh.iso + nextHigh.title : "none"}>
        <div className="cal-next-label mono">
          <span className="ct-tag">00</span> NEXT RELEASE — HIGH IMPACT
        </div>
        {nextHigh && now ? (
          <div className="cal-next-body">
            <div className="cal-next-info">
              <b className="cal-next-title">
                <CountryFlag code={nextHigh.country} size={16} showCode={false} /> {nextHigh.title}
              </b>
              <span className="cal-next-when mono">
                {DAY_NAMES[new Date(nextHigh.iso).getDay()]} · {nextHigh.iso.slice(8, 10)} {MONTHS[Number(nextHigh.iso.slice(5, 7)) - 1]} {nextHigh.iso.slice(0, 4)} · {nextHigh.time} WIB · {COUNTRY_META[nextHigh.country] || nextHigh.country}
              </span>
              {nextHighs.length > 1 && (
                <span className="cal-next-more mono">
                  +{nextHighs.length - 1} high-impact berikutnya: {nextHighs.slice(1).map((e) => e.title).join(" · ")}
                </span>
              )}
            </div>
            <div className="cal-next-cd">
              <b className="mono">{fmtCountdown(new Date(nextHigh.iso).getTime() - now.getTime())}</b>
              <span className="mono">menuju rilis</span>
            </div>
          </div>
        ) : (
          <div className="cal-next-body">
            <span className="cal-next-none mono">TIDAK ADA RILIS HIGH IMPACT BERIKUTNYA DALAM DATA</span>
          </div>
        )}
      </section>

      {/* 01 · FILTER JADWAL */}
      <section className="cal-term-sec">
        <div className="ct-block-head">
          <span className="ct-tag">01</span>
          <h4>Filter Jadwal</h4>
          <span className="ct-block-meta mono">{countries.length} NEGARA · {events.length} EVENT</span>
        </div>

        <div className="cal-chips-row">
          <span className="cal-chips-cap mono">JENDELA</span>
          <div className="cal-chips">
            {[
              { id: "terkini", label: "TERKINI" },
              { id: "7", label: "7 HARI" },
              { id: "30", label: "30 HARI" },
              { id: "semua", label: "SEMUA" },
            ].map((w) => (
              <button key={w.id} className={`cal-chip ${win === w.id ? "on" : ""}`} onClick={() => setWin(w.id)}>{w.label}</button>
            ))}
          </div>
        </div>

        <div className="cal-chips-row">
          <span className="cal-chips-cap mono">KATEGORI</span>
          <div className="cal-chips">
            <button className={`cal-chip ${cat === "semua" ? "on" : ""}`} onClick={() => setCat("semua")}>SEMUA</button>
            {catList.map((c) => (
              <button key={c.id} className={`cal-chip ${cat === c.id ? "on" : ""}`} onClick={() => setCat(c.id)} style={{ "--c": c.color }}>
                {c.label.toUpperCase()}
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
              <button key={c} className={`cal-chip ${cc === c ? "on" : ""}`} onClick={() => setCc(c)} title={COUNTRY_META[c] || c}>{c}</button>
            ))}
          </div>
        </div>

        <div className="cal-search">
          <span className="ct-prompt" aria-hidden="true">&gt;</span>
          <input type="text" placeholder="cari event…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari event" />
        </div>
      </section>

      {/* 02 · JADWAL RILIS */}
      <section className="cal-term-sec">
        <div className="ct-block-head">
          <span className="ct-tag">02</span>
          <h4>Jadwal Rilis</h4>
          <span className="ct-block-meta mono">
            ▸ {filtered.length} RILIS · {winLabel.toUpperCase()} · KLIK BARIS UNTUK DETAIL
          </span>
        </div>

        {groups.length === 0 && <p className="cal-empty mono">TIDAK ADA RILIS YANG COCOK DENGAN FILTER</p>}

        {groups.map((g) => {
          const lbl = dateLabel(g.date);
          const pastDay = now && g.date < now.toISOString().slice(0, 10);
          return (
            <div key={g.date} className={`cal-day ${pastDay ? "is-past" : ""}`}>
              <div className={`cal-day-head ${lbl.today ? "today" : ""}`}>
                <span className="cal-day-main mono">{lbl.main}</span>
                <span className="cal-day-sub mono">{lbl.sub}</span>
                <span className="cal-day-n mono">N={g.list.length}</span>
                {lbl.today && <span className="cal-day-dot" aria-hidden="true" />}
              </div>
              <div className="cal-events">
                {g.list.map((e) => (
                  <EventRow
                    key={e.iso + e.title}
                    e={e}
                    now={now}
                    isNext={!!nextHigh && e.iso === nextHigh.iso && e.title === nextHigh.title}
                    open={open === e.iso + e.title}
                    onToggle={(k) => setOpen((o) => (o === k ? null : k))}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <footer className="cal-term-foot mono">
        <span>SRC: JADWAL RESMI BLS/FED/ECB/ONS{""} · N: {filtered.length} · ZONA: WIB (UTC+7)</span>
        <span className="cal-term-foot-note">Jadwal bisa berubah — verifikasi ke sumber resmi</span>
        <span className="ct-blink" aria-hidden="true">●</span>
      </footer>
    </div>
  );
}
