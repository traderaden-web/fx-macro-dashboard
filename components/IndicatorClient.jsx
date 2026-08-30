// components/IndicatorClient.jsx
// INDICATOR DETAIL — tampilan terminal interaktif untuk satu indikator makro:
//   00 · READOUT     — nilai terbaru (count-up), Δ MoM/YoY, panel NEXT RELEASE
//                       dengan hitung mundur LIVE ke rilis berikutnya
//   01 · CONSENSUS   — Previous/Consensus/Actual/Surprise + gauge kejutan +
//                       strip akurasi konsensus (hit-rate, beat/miss, streak)
//   02 · RIWAYAT     — chart interaktif + tab rentang (1T/3T/5T/SEMUA) +
//                       tabel 12 periode terakhir dengan bar perubahan
//   03 · RILIS       — riwayat consensus vs actual dengan bar kejutan
//   04 · PEMAHAMAN   — apa itu / kenapa penting / dampak ke mata uang
//   05 · EDUKASI     — tab interaktif: cara membaca, prospek, penggerak, pakar
// Data: FRED live / seed (lib/data.js) + konsensus (lib/consensus.js) +
// edukasi (lib/education.js) + jadwal rilis (data/calendar.js).
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Chart from "./Chart";
import { CountryFlag, ImpactBadge, CategoryBadge } from "./Badges";
import TermClock from "./TermClock";
import { fmt } from "../lib/format";

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MONTHS_FULL = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function useNow() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", fn);
    return () => mq.removeEventListener?.("change", fn);
  }, []);
  return reduced;
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

function fmtDay(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// angka berjalan (count-up) — hormati prefers-reduced-motion
function CountUp({ value, decimals = 1, prefix = "" }) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(null);
  useEffect(() => {
    if (reduced || value === null || value === undefined) { setShown(value); return; }
    let raf = null;
    const t0 = performance.now();
    const dur = 900;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setShown(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduced]);
  if (shown === null || shown === undefined) return <span>{prefix}—</span>;
  return <span>{prefix}{fmt(shown, decimals)}</span>;
}

// gauge horizontal kejutan: tengah = konsensus, kanan = beat, kiri = miss
function SurpriseGauge({ idx, tol = 0.5, scale = 1 }) {
  if (idx === null || idx === undefined || isNaN(idx)) {
    return <div className="ind-gauge"><span className="ind-gauge-none mono">SURPRISE INDEX BELUM TERSEDIA</span></div>;
  }
  const clamped = Math.max(-100, Math.min(100, idx));
  const pos = 50 + clamped / 2;
  const tolPct = Math.min(30, (tol / scale) * 50);
  return (
    <div className="ind-gauge" role="img" aria-label={`Surprise index ${idx}`}>
      <div className="ind-gauge-track">
        <i className="zone miss" style={{ left: 0, width: 50 - tolPct }} />
        <i className="zone inline" style={{ left: 50 - tolPct, width: tolPct * 2 }} />
        <i className="zone beat" style={{ left: 50 + tolPct, width: 50 - tolPct }} />
        <span className="ind-gauge-center" aria-hidden="true" />
        <span className="ind-gauge-needle" style={{ left: `${pos}%` }} aria-hidden="true">
          <b>{idx > 0 ? "+" : ""}{idx.toFixed(1)}</b>
        </span>
      </div>
      <div className="ind-gauge-scale mono">
        <span>MISS (di bawah konsensus)</span>
        <span>SURPRISE INDEX</span>
        <span>BEAT (di atas konsensus)</span>
      </div>
    </div>
  );
}

const DIR_TXT = { up: "▲", down: "▼", flat: "—" };

// ── tab edukasi ──────────────────────────────────────────────────────────
function EduTab({ edu, general }) {
  const tabs = [
    { id: "read", label: "CARA MEMBACA" },
    { id: "outlook", label: "PROSPEK" },
    { id: "drivers", label: "PENGERAK" },
    ...(edu.expertViews?.length ? [{ id: "experts", label: "PAKAR" }] : []),
  ];
  const [tab, setTab] = useState("read");

  return (
    <div className="ind-edu">
      <div className="ind-edu-tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={`cal-chip ind-edu-tab ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="ind-edu-panel">
        {tab === "read" && (
          <ol className="ind-steps mono">
            {edu.read.map((p, i) => (
              <li key={i}><b>{String(i + 1).padStart(2, "0")}</b>{p}</li>
            ))}
          </ol>
        )}

        {tab === "outlook" && (
          <div className="ind-outlook">
            <p className="ind-outlook-text">{edu.outlook}</p>
            {edu.scenarios?.length > 0 && (
              <div className="ind-scenarios">
                <div className="ind-scen-head mono"><span>SKENARIO</span><span>EFEK PASAR</span><span>ARAH</span></div>
                {edu.scenarios.map((s, i) => (
                  <div key={i} className={`ind-scen-row ${s.dir}`}>
                    <span className="ind-scen-label">{s.label}</span>
                    <span className="ind-scen-effect">{s.effect}</span>
                    <span className="ind-scen-dir mono">{DIR_TXT[s.dir]} {s.cur}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="ind-watch">
              <span className="mono">PANTAU:</span>
              {edu.watch.map((w, i) => <span key={i} className="ind-watch-chip">{w}</span>)}
            </div>
          </div>
        )}

        {tab === "drivers" && (
          <div className="ind-drivers">
            {(edu.drivers || []).map((d, i) => (
              <div className="ind-driver" key={i}>
                <div className="ind-driver-head mono"><b>{i + 1}</b> {d.name}</div>
                <p>{d.detail}</p>
                {d.data && <div className="ind-driver-data mono">📊 {d.data}</div>}
                {d.src && (
                  <a className="ind-driver-src mono" href={d.src.url} target="_blank" rel="noopener noreferrer" title={d.src.url}>
                    {d.src.label} ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "experts" && (
          <div className="ind-experts">
            <p className="ind-experts-note">{general.expertNote}</p>
            <div className="ind-expert-grid">
              {edu.expertViews.map((e, i) => (
                <div className="ind-expert" key={i}>
                  <div className="ind-expert-head">
                    <span className="ind-expert-avatar mono">{(e.desk || "?").charAt(0)}</span>
                    <div>
                      <b>{e.desk}</b>
                      <i>Analis Global</i>
                    </div>
                  </div>
                  <p>{e.view}</p>
                  <div className="ind-expert-signal mono">▸ {e.signal}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── TERMINAL ─────────────────────────────────────────────────────────────
export default function IndicatorClient({ data, releases, accuracy, source, edu, general, cat, country, upcoming }) {
  const now = useNow();
  const pts = useMemo(() => data.points || [], [data]);
  const v = pts.length ? pts[pts.length - 1].value : null;
  const prev = pts.length > 1 ? pts[pts.length - 2].value : null;
  const yearAgo = pts.length > 12 ? pts[pts.length - 13].value : null;
  const lastDate = pts.length ? pts[pts.length - 1].date : null;

  const isQ = data.freq === "Q";
  const perYear = isQ ? 4 : 12;
  const RANGES = [
    { id: "1y", label: "1T", n: perYear },
    { id: "3y", label: "3T", n: perYear * 3 },
    { id: "5y", label: "5T", n: perYear * 5 },
    { id: "all", label: "SEMUA", n: null },
  ];
  const [range, setRange] = useState(isQ ? "all" : "3y");
  const shown = useMemo(() => {
    const r = RANGES.find((x) => x.id === range);
    return r?.n ? pts.slice(-r.n) : pts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pts, range]);

  const latest = releases?.length ? releases[releases.length - 1] : null;
  const hist = useMemo(() => (releases || []).slice(-6).reverse(), [releases]);

  // rilis berikutnya untuk indikator ini (dari jadwal lokal)
  const nextRel = useMemo(() => {
    if (!now || !upcoming?.length) return null;
    const t = now.getTime();
    return upcoming.filter((e) => new Date(e.iso).getTime() > t).sort((a, b) => a.iso.localeCompare(b.iso))[0] || null;
  }, [upcoming, now]);

  const mom = v !== null && prev !== null ? v - prev : null;
  const yoy = v !== null && yearAgo !== null ? v - yearAgo : null;

  // bar perubahan untuk tabel 12 periode terakhir
  const rows12 = useMemo(() => {
    const arr = pts.slice(-12).reverse();
    const out = [];
    for (let i = 0; i < arr.length; i++) {
      const p = arr[i];
      const next = arr[i - 1];
      const c = next ? p.value - next.value : null;
      out.push({ ...p, c });
    }
    const maxAbs = Math.max(...out.map((r) => Math.abs(r.c) || 0), 1e-9);
    out.forEach((r) => { r.bar = r.c === null ? 0 : (Math.abs(r.c) / maxAbs) * 100; });
    return out;
  }, [pts]);

  // bar kejutan untuk tabel rilis
  const maxSurp = Math.max(...(hist.map((r) => Math.abs(r.surprise) || 0)), 1e-9);

  const srcLive = source === "live" || data.source === "live";

  return (
    <div className="ind-term">
      <div className="ct-scan" aria-hidden="true" />

      <header className="ind-term-head">
        <span className="ct-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="ind-term-title mono">
          MACROLAB <em>//</em> INDICATOR:&nbsp;{data.short?.toUpperCase()} <span className="ct-ver">v1.0</span>
          <span className="ct-cursor" aria-hidden="true" />
        </span>
        <span className="ind-term-head-right">
          <span className={`ct-led ${srcLive ? "ok" : "warn"}`}>{srcLive ? "FRED LIVE" : "CACHE LOKAL"} · {data.updated?.slice(0, 10)}</span>
          <TermClock />
        </span>
      </header>

      {/* 00 · READOUT */}
      <section className="ind-readout">
        <div className="ind-readout-main">
          <div className="ind-readout-id">
            <b className="ind-readout-name">
              <CountryFlag code={data.country} size={20} showCode={false} />
              {data.name}
            </b>
            <div className="ind-readout-badges">
              <span className="ind-readout-country mono">{country?.name || "Global"}</span>
              <CategoryBadge id={cat?.id} label={cat?.label} color={cat?.color} />
              <ImpactBadge level={data.impact} />
              <span className="ind-chip mono">{data.freq === "D" ? "HARIAN" : data.freq === "Q" ? "KUARTALAN" : "BULANAN"}</span>
              <span className="ind-chip mono" title={data.release}>RILIS: {data.release}</span>
            </div>
          </div>

          <div className="ind-readout-value mono">
            <CountUp value={v} decimals={data.decimals} />
            {v !== null && <span className="ind-readout-unit">{data.unit}</span>}
            <span className="ind-readout-asof mono">AS-OF {lastDate || "—"}</span>
          </div>

          <div className="ind-readout-stats mono">
            <div className="ind-stat">
              <span>Δ PERIODE</span>
              <b className={mom === null ? "" : mom >= 0 ? "up" : "down"}>
                {mom === null ? "—" : `${mom >= 0 ? "▲ +" : "▼ "}${fmt(mom, data.decimals)}`}
              </b>
              <i>vs periode sebelumnya</i>
            </div>
            <div className="ind-stat">
              <span>Δ SETAHUN</span>
              <b className={yoy === null ? "" : yoy >= 0 ? "up" : "down"}>
                {yoy === null ? "—" : `${yoy >= 0 ? "▲ +" : "▼ "}${fmt(yoy, data.decimals)}`}
              </b>
              <i>vs 12 periode lalu</i>
            </div>
            <div className="ind-stat">
              <span>NIAT POINT</span>
              <b>{pts.length}</b>
              <i>sejak {pts.length ? pts[0].date : "—"}</i>
            </div>
          </div>
        </div>

        <div className="ind-next">
          <div className="ind-next-label mono"><span className="ct-tag">00</span> NEXT RELEASE</div>
          {nextRel ? (
            <div className="ind-next-body">
              <b className="ind-next-title">{nextRel.title}</b>
              <span className="ind-next-when mono">
                {DAY_NAMES[new Date(nextRel.iso).getDay()]} · {nextRel.iso.slice(8, 10)} {MONTHS[Number(nextRel.iso.slice(5, 7)) - 1]} {nextRel.iso.slice(0, 4)} · {nextRel.time} WIB
              </span>
              <div className="ind-next-cd mono">
                <b>{fmtCountdown(new Date(nextRel.iso).getTime() - now.getTime())}</b>
                <span>menuju rilis</span>
              </div>
            </div>
          ) : (
            <div className="ind-next-body">
              <span className="ind-next-none mono">TIDAK ADA DALAM JADWAL AKTIF</span>
              <span className="ind-next-sched mono">Pola rilis: {data.release}</span>
            </div>
          )}
        </div>
      </section>

      {/* 01 · CONSENSUS VS ACTUAL */}
      {latest && (
        <section className="ind-term-sec">
          <div className="ct-block-head">
            <span className="ct-tag">01</span>
            <h4>Consensus vs Actual — Rilis Terakhir</h4>
            <span className="ct-block-meta mono">▸ {latest.date} · SRC: {latest.source?.toUpperCase()}</span>
          </div>

          <div className="ind-cells mono">
            <div className="ind-cell">
              <span>PREVIOUS</span>
              <b>{latest.previous == null ? "—" : fmt(latest.previous, data.decimals)}</b>
            </div>
            <div className="ind-cell">
              <span>CONSENSUS</span>
              <b>{latest.consensus == null ? "—" : fmt(latest.consensus, data.decimals)}</b>
            </div>
            <div className="ind-cell act">
              <span>ACTUAL</span>
              <b>{latest.actual == null ? "—" : fmt(latest.actual, data.decimals)}</b>
            </div>
            <div className={`ind-cell ${latest.surprise > 0 ? "good" : latest.surprise < 0 ? "bad" : "flat"}`}>
              <span>SURPRISE</span>
              <b>{latest.surprise == null ? "—" : `${latest.surprise > 0 ? "+" : ""}${fmt(latest.surprise, data.decimals)}`}</b>
              <i>{latest.surprisePct == null ? "" : `${latest.surprisePct > 0 ? "+" : ""}${latest.surprisePct.toFixed(2)}% vs konsensus`}</i>
            </div>
          </div>

          <SurpriseGauge idx={latest.surpriseIdx} tol={accuracy?.tol} scale={data.scale || 1} />

          {accuracy && accuracy.samples > 0 && (
            <div className="ind-acc mono">
              <span className="ind-acc-title">AKURASI KONSENSUS</span>
              <span className="ind-acc-item"><i>HIT-RATE</i><b>{accuracy.hitRate != null ? `${accuracy.hitRate}%` : "—"}</b><em>tol ±{accuracy.tol}</em></span>
              <span className="ind-acc-item"><i>BEAT / INLINE / MISS</i><b>{accuracy.beats} / {accuracy.inlines} / {accuracy.misses}</b><em>N={accuracy.samples}</em></span>
              <span className="ind-acc-item"><i>AKURASI ARAH</i><b>{accuracy.dirAcc != null ? `${accuracy.dirAcc}%` : "—"}</b><em>vs previous</em></span>
              <span className="ind-acc-item"><i>KEJUTAN TERBESAR</i><b>{accuracy.maxSurprise == null ? "—" : `${accuracy.maxSurprise > 0 ? "+" : ""}${accuracy.maxSurprise}`}</b><em>{accuracy.maxSurpriseDate || ""}</em></span>
              {accuracy.streak && (
                <span className={`ind-acc-item ${accuracy.streak.kind === "BEAT" ? "good" : "bad"}`}>
                  <i>STREAK</i><b>{accuracy.streak.n}× {accuracy.streak.kind}</b><em>beruntun</em>
                </span>
              )}
            </div>
          )}

          <p className="ind-linkrow mono">
            Analisis dampak pair lengkap → <Link href="/analysis">HALAMAN ANALISIS</Link>
          </p>
        </section>
      )}

      {/* 02 · RIWAYAT */}
      <section className="ind-term-sec">
        <div className="ct-block-head">
          <span className="ct-tag">02</span>
          <h4>Riwayat {data.short}</h4>
          <span className="ct-block-meta mono">▸ {shown.length} POINT · HOVER UNTUK DETAIL</span>
        </div>

        <div className="ind-range mono">
          {RANGES.map((r) => (
            <button key={r.id} className={`cal-chip ${range === r.id ? "on" : ""}`} onClick={() => setRange(r.id)}>{r.label}</button>
          ))}
        </div>

        <Chart points={shown} color={cat?.color || "#f0b429"} unit={data.unit} decimals={data.decimals} height={320} />

        <div className="ind-rows12">
          <div className="ind-rows12-head mono"><span>PERIODE</span><span>NILAI</span><span className="ind-rows12-barcol">PERUBAHAN</span></div>
          {rows12.map((p) => (
            <div key={p.date} className={`ind-row12 ${p.c === null ? "" : p.c >= 0 ? "up" : "down"}`}>
              <span className="mono">{fmtDay(p.date)}</span>
              <b className="mono">{fmt(p.value, data.decimals)}</b>
              <span className="ind-rows12-barcol">
                <i className="ind-row12-bar" style={{ width: `${p.bar}%` }} />
                <em className="mono">{p.c === null ? "—" : `${p.c >= 0 ? "+" : ""}${fmt(p.c, data.decimals)}`}</em>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 03 · RIWAYAT RILIS */}
      {hist.length > 1 && (
        <section className="ind-term-sec">
          <div className="ct-block-head">
            <span className="ct-tag">03</span>
            <h4>Riwayat Rilis — Consensus vs Actual</h4>
            <span className="ct-block-meta mono">▸ {hist.length} RILIS TERAKHIR · PERHATIKAN POLA SURPRISE</span>
          </div>
          <div className="ind-rel">
            <div className="ind-rel-head mono">
              <span>TANGGAL</span><span>PREV</span><span>KONSENSUS</span><span>AKTUAL</span><span>SURPRISE</span>
            </div>
            {hist.map((r) => (
              <div key={r.date} className="ind-rel-row">
                <span className="mono">{r.date}</span>
                <span className="mono dim">{r.previous == null ? "—" : fmt(r.previous, data.decimals)}</span>
                <span className="mono dim">{r.consensus == null ? "—" : fmt(r.consensus, data.decimals)}</span>
                <b className="mono">{r.actual == null ? "—" : fmt(r.actual, data.decimals)}</b>
                <span className="ind-rel-s">
                  {r.surprise == null ? <span className="mono dim">—</span> : (
                    <>
                      <i className={`ind-rel-bar ${r.surprise >= 0 ? "up" : "down"}`} style={{ width: `${(Math.abs(r.surprise) / maxSurp) * 100}%` }} />
                      <em className={`mono ${r.surprise >= 0 ? "up" : "down"}`}>
                        {r.surprise >= 0 ? "+" : ""}{fmt(r.surprise, data.decimals)}
                        {r.surprisePct != null ? ` (${r.surprisePct >= 0 ? "+" : ""}${r.surprisePct.toFixed(1)}%)` : ""}
                      </em>
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 04 · PEMAHAMAN */}
      <section className="ind-term-sec">
        <div className="ct-block-head">
          <span className="ct-tag">04</span>
          <h4>Memahami {data.short}</h4>
          <span className="ct-block-meta mono">▸ APA · MENGAPA · DAMPAK FX</span>
        </div>
        <div className="ind-understand">
          <div><em>APA ITU?</em><p>{data.about}</p></div>
          <div><em>MENGAPA PENTING?</em><p>{data.why}</p></div>
          <div><em>DAMPAK KE MATA UANG</em><p>{data.fx}</p></div>
        </div>
      </section>

      {/* 05 · EDUKASI */}
      {edu && (
        <section className="ind-term-sec">
          <div className="ct-block-head">
            <span className="ct-tag">05</span>
            <h4>Edukasi Praktis</h4>
            <span className="ct-block-meta mono">▸ PILIH TAB</span>
          </div>
          <EduTab edu={edu} general={general} />
        </section>
      )}

      <footer className="ind-term-foot mono">
        <span>SRC: {srcLive ? "FRED (LIVE)" : "CACHE LOKAL"} · N={pts.length} POINT · AS-OF {lastDate || "—"} · ZONA: WIB (UTC+7)</span>
        <span className="ind-term-foot-note">Selalu verifikasi ke sumber resmi — data bisa direvisi</span>
        <span className="ct-blink" aria-hidden="true">●</span>
      </footer>
    </div>
  );
}
