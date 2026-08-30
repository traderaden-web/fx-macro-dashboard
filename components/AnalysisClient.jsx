// components/AnalysisClient.jsx
// CONSENSUS TERMINAL v2.1 — tampilan ala terminal profesional untuk:
//   01 · Pilih Indikator            (picker terminal: bar dampak, delta, jadwal next)
//   02 · Consensus vs Actual        (readout besar, gauge surprise, chip hawk/dov)
//   03 · Riwayat Surprise & Akurasi (sparkline + tabel mono + panel akurasi)
//   04 · Dampak Pasangan Mata Uang  (banner reaksi mata uang + matriks pair)
// Data: actual dari FRED (live/seed), konsensus dari ForexFactory (live) +
// riwayat kurasi (data/releases.js). Semua angka dihitung, tidak diketik ulang.
"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, COUNTRIES } from "../lib/series";
import { computePairImpact, currencyReaction, magnitudeLabel } from "../lib/pairs";
import { CountryFlag } from "./Badges";
import { GlossaryHint, ImpactLegend } from "./Legend";
import { IconSearch } from "./Icons";

const FMT = (v, d = 1) => (v === null || v === undefined ? "—" : Number(v).toLocaleString("id-ID", { maximumFractionDigits: d }));
const SFMT = (v, d = 1) => (v === null || v === undefined ? "—" : (v > 0 ? "+" : "") + Number(v).toLocaleString("id-ID", { maximumFractionDigits: d }));
const BLN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MM = (s) => (s ? new Date(s + "T00:00:00").toLocaleDateString("id-ID", { month: "short", year: "2-digit" }) : "—");
const IMPACT_RANK = { High: 0, Medium: 1, Low: 2 };

const WIBM = new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

function useWib() {
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
  const m = Math.floor(ms / 60000);
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  const mm = m % 60;
  if (d > 0) return `T-${d}h ${h}j`;
  if (h > 0) return `T-${h}j ${mm}m`;
  return `T-${mm}m`;
}

function fmtEv(e) {
  return `${Number(e.date.slice(8))} ${BLN[Number(e.date.slice(5, 7)) - 1]} ${e.time}`;
}

function nextEvent(upcoming, id, now) {
  if (!upcoming?.length || !now) return null;
  const t = now.getTime();
  return (
    upcoming
      .filter((e) => e.indicatorId === id && new Date(e.iso).getTime() > t)
      .sort((a, b) => a.iso.localeCompare(b.iso))[0] || null
  );
}

// Angka count-up (ease-out cubic, 550ms) — animasi ulang tiap nilai ganti.
function Num({ v, d = 1, signed = false }) {
  const [dv, setDv] = useState(0);
  useEffect(() => {
    if (v === null || v === undefined) return undefined;
    const start = performance.now();
    const dur = 550;
    let raf;
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDv(v * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [v]);
  return <>{v === null || v === undefined ? "—" : signed ? SFMT(dv, d) : FMT(dv, d)}</>;
}

// ── 02 · CONSENSUS VS ACTUAL ─────────────────────────────────────────────
function BlockConsensus({ item, latest, prevRel, now }) {
  const d = item.decimals;
  const tol = item.tol ?? 0.5;
  const surprise = latest?.surprise ?? null;
  const idx = latest?.surpriseIdx ?? null;
  const cls = surprise === null ? "flat" : Math.abs(surprise) <= tol ? "flat" : surprise > 0 ? "up" : "down";
  const stale = latest && now ? now.getTime() - new Date(latest.date).getTime() > 120 * 86400000 : false;
  const daily = item.freq === "D";

  // domain gauge simetris: cukup lebar utk seluruh riwayat surprise
  const maxAbs = item.releases.reduce((m, r) => Math.max(m, Math.abs(r.surprise ?? 0)), 0);
  const domain = Math.max(tol * 3, maxAbs) * 1.15 || 1;
  const pos = surprise === null ? 50 : Math.max(2.5, Math.min(97.5, ((surprise + domain) / (2 * domain)) * 100));
  const zoneW = Math.min((2 * tol / (2 * domain)) * 100, 40);
  const zoneL = 50 - zoneW / 2;

  const rx = idx !== null ? currencyReaction(item.id, idx) : null;
  const chip =
    surprise === null ? "MENUNGGU RILIS" :
    cls === "flat" ? "SEPERTI KONSENSUS ◆" :
    rx ? (rx.dir > 0 ? `HAWKISH · ${rx.cur} Menguat ▲` : `DOVISH · ${rx.cur} Melemah ▼`) :
    surprise > 0 ? "DI ATAS KONSENSUS ▲" : "DI BAWAH KONSENSUS ▼";

  return (
    <div className="ct-block" style={{ "--b": 0 }}>
      <div className="ct-block-head">
        <span className="ct-tag">02</span>
        <h4>Consensus vs Actual — {item.short}</h4>
        <span className="ct-block-meta mono">
          {stale && <b className="ct-stale">⚠ DATA STALE</b>}
          {latest && <> ASOF {MM(latest.date).toUpperCase()} · SRC {latest.source === "live" ? "FOREXFACTORY" : "FRED"}</>}
          {daily && " · SERI HARIAN (EST. ANALIS)"}
        </span>
      </div>

      <div className="ct-readout">
        <div className="ct-cell">
          <em>PREVIOUS</em>
          <b className="mono">{latest ? FMT(latest.previous, d) : "—"}</b>
          <i>{prevRel ? `${MM(prevRel.date).toUpperCase()} · pembanding` : "rilis sebelumnya"}</i>
        </div>
        <div className="ct-cell cons">
          <em>CONSENSUS</em>
          <b className="mono">{latest ? <Num v={latest.consensus} d={d} /> : "—"}</b>
          <i>estimasi konsensus analis</i>
        </div>
        <div className="ct-cell act">
          <em>ACTUAL</em>
          <b className="mono big">{latest ? <Num v={latest.actual} d={d} /> : "—"}</b>
          <i>FRED · {latest ? MM(latest.date).toUpperCase() : "—"}{latest?.previous !== null && " · " + item.unit}</i>
        </div>
        <div className={`ct-cell sur ${cls}`}>
          <em>SURPRISE</em>
          <b className="mono big">{latest ? <Num v={latest.surprise} d={d} signed /> : "—"}</b>
          <i>{idx !== null ? `idx ${SFMT(idx, 0)} · vs konsensus` : "actual − konsensus"}</i>
        </div>
      </div>

      <div className="ct-gauge" role="img" aria-label={`Surprise ${SFMT(surprise, d)} ${item.unit}`}>
        <div className="ct-gauge-track">
          <span className="ct-g-zone" style={{ left: `${zoneL}%`, width: `${zoneW}%` }} aria-hidden="true" />
          <span className="ct-g-zero" aria-hidden="true" />
          <span className="ct-g-needle" style={{ left: `${pos}%` }} aria-hidden="true" />
        </div>
        <div className="ct-gauge-scale mono">
          <span>−{FMT(domain, 1)}</span>
          <span>0 · ±{FMT(tol, 2)} = inline</span>
          <span>+{FMT(domain, 1)} {item.unit}</span>
        </div>
      </div>

      <div className={`ct-senti ${cls}`}>
        <span className="ct-senti-chip mono">{chip}</span>
        <span>{rx ? rx.via : "Nilai sesuai konsensus — pasar cenderung minim respons."}</span>
      </div>
    </div>
  );
}

// ── 03 · RIWAYAT SURPRISE & AKURASI KONSENSUS ────────────────────────────
function BlockHistory({ item }) {
  const d = item.decimals;
  const tol = item.tol ?? 0.5;
  const acc = item.accuracy;
  const rels = useMemo(() => [...item.releases].reverse(), [item.releases]); // terbaru di atas
  const maxAbs = rels.reduce((m, r) => Math.max(m, Math.abs(r.surprise ?? 0)), 1e-9);
  const biasCls = acc.bias === null ? "" : acc.bias > tol / 2 ? "up" : acc.bias < -tol / 2 ? "down" : "flat";

  return (
    <div className="ct-block" style={{ "--b": 1 }}>
      <div className="ct-block-head">
        <span className="ct-tag">03</span>
        <h4>Riwayat Surprise &amp; Akurasi Konsensus</h4>
        <span className="ct-block-meta mono">
          N={acc.samples} · <b className="up">BEAT {acc.beats}</b> · <b className="down">MISS {acc.misses}</b> · INLINE {acc.inlines}
        </span>
      </div>

      <div className="ct-hist-grid">
        <div className="ct-hist-left">
          <div className="ct-spark" aria-hidden="true">
            {rels.map((r, i) => {
              const h = r.surprise === null ? 0 : Math.max(6, (Math.abs(r.surprise) / maxAbs) * 96);
              const up = r.surprise > 0;
              return (
                <span key={r.date} className="ct-sp-cell" style={{ "--i": i }}>
                  {r.surprise !== null && (
                    <i
                      className={`ct-sp ${up ? "up" : "down"} ${i === 0 ? "last" : ""}`}
                      style={{ height: `${h}%` }}
                    />
                  )}
                </span>
              );
            })}
            <span className="ct-sp-base" />
          </div>

          <div className="ct-table-wrap">
            <table className="ct-table mono">
              <thead>
                <tr>
                  <th>TGL</th><th>PREV</th><th>KONS</th><th>AKTUAL</th>
                  <th>Δ SURPRISE</th><th>Δ IDX</th><th>SINYAL</th><th>SRC</th>
                </tr>
              </thead>
              <tbody>
                {rels.map((r, i) => {
                  const scls = r.surprise === null ? "" : Math.abs(r.surprise) <= tol ? "flat" : r.surprise > 0 ? "up" : "down";
                  return (
                    <tr key={r.date} className={i === 0 ? "ct-latest" : ""} style={{ "--i": i }}>
                      <td>{i === 0 && <span className="ct-dot" aria-hidden="true" />}{MM(r.date).toUpperCase()}</td>
                      <td>{FMT(r.previous, d)}</td>
                      <td>{FMT(r.consensus, d)}</td>
                      <td><b>{FMT(r.actual, d)}</b></td>
                      <td className={scls}>{SFMT(r.surprise, d)}</td>
                      <td className={scls}>{r.surpriseIdx !== null && r.surpriseIdx !== undefined ? SFMT(r.surpriseIdx, 0) : "—"}</td>
                      <td className={scls}>{r.surprise === null ? "·" : Math.abs(r.surprise) <= tol ? "◆" : r.surprise > 0 ? "▲" : "▼"}</td>
                      <td className="ct-src">{r.source === "live" ? "FF" : "FRED"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="ct-acc">
          <div className="ct-acc-row">
            <em>HIT RATE <span className="tip" data-tip={`Persentase rilis dengan |surprise| ≤ ±${FMT(tol, 2)} ${item.unit} (inline).`}>ⓘ</span></em>
            <b className="mono"><Num v={acc.hitRate} d={1} /> <i>%</i></b>
            <span className="ct-acc-bar"><i style={{ width: `${acc.hitRate || 0}%` }} /></span>
            <span className="ct-acc-sub">inline ≤ ±{FMT(tol, 2)} {item.unit}</span>
          </div>
          <div className="ct-acc-row">
            <em>AKURASI ARAH</em>
            <b className="mono"><Num v={acc.dirAcc} d={1} /> <i>%</i></b>
            <span className="ct-acc-bar"><i style={{ width: `${acc.dirAcc || 0}%` }} className="cyan" /></span>
            <span className="ct-acc-sub">konsensus menebak arah naik/turun</span>
          </div>
          <div className="ct-acc-row">
            <em>AVG |SURPRISE|</em>
            <b className="mono"><Num v={acc.avgPct} d={0} /></b>
            <span className="ct-acc-bar"><i style={{ width: `${Math.min(((acc.avgPct || 0) / 150) * 100, 100)}%` }} className="gold" /></span>
            <span className="ct-acc-sub">indeks kejutan · 100 = 1 skala tipikal</span>
          </div>
          <div className="ct-acc-row">
            <em>BIAS KONSENSUS</em>
            <b className={`mono ${biasCls}`}>{acc.bias === null ? "—" : SFMT(acc.bias, d)}</b>
            <span className="ct-acc-bias">
              <i
                style={
                  acc.bias === null
                    ? { left: "50%", width: 0 }
                    : acc.bias >= 0
                    ? { left: "50%", width: `${Math.min(Math.abs(acc.bias) / (2 * (tol * 2 + Math.abs(acc.bias))) * 100, 50)}%` }
                    : { left: `${50 - Math.min((Math.abs(acc.bias) / (2 * (tol * 2 + Math.abs(acc.bias))) * 100, 50))}%`, width: `${Math.min((Math.abs(acc.bias) / (2 * (tol * 2 + Math.abs(acc.bias))) * 100, 50))}%` }
                }
              />
            </span>
            <span className="ct-acc-sub">{acc.bias > 0 ? "konsensus cenderung terlalu rendah" : acc.bias < 0 ? "konsensus cenderung terlalu tinggi" : "tak berpihak"}</span>
          </div>
          <div className="ct-split-wrap">
            <span className="ct-acc-sub">DISTRIBUSI RILIS</span>
            <div className="ct-split" aria-hidden="true">
              <i className="beat" style={{ width: `${(acc.beats / Math.max(acc.samples, 1)) * 100}%` }} />
              <i className="inl" style={{ width: `${(acc.inlines / Math.max(acc.samples, 1)) * 100}%` }} />
              <i className="miss" style={{ width: `${(acc.misses / Math.max(acc.samples, 1)) * 100}%` }} />
            </div>
            <span className="ct-acc-sub mono">
              <b className="up">{acc.beats}×</b> BEAT · <b>{acc.inlines}×</b> INLINE · <b className="down">{acc.misses}×</b> MISS
            </span>
          </div>
          {acc.streak && <div className="ct-streak mono">STREAK ▸ {acc.streak.n}× {acc.streak.kind} beruntun</div>}
          {acc.maxSurprise !== null && (
            <div className="ct-streak mono dim">
              MAX SURPRISE ▸ {SFMT(acc.maxSurprise, d)} ({MM(acc.maxSurpriseDate).toUpperCase()})
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

// ── 04 · DAMPAK TERHADAP PASANGAN MATA UANG ──────────────────────────────
function BlockImpact({ item, latest }) {
  const idx = latest?.surpriseIdx ?? null;
  const pairs = useMemo(
    () => (idx !== null && latest ? computePairImpact(item.id, latest.surprisePct, latest.surprise, idx) : []),
    [item.id, latest, idx]
  );
  const rx = idx !== null ? currencyReaction(item.id, idx) : null;

  return (
    <div className="ct-block" style={{ "--b": 2 }}>
      <div className="ct-block-head">
        <span className="ct-tag">04</span>
        <h4>Dampak terhadap Pasangan Mata Uang</h4>
        <span className="ct-block-meta mono">{latest ? `RILIS ${MM(latest.date).toUpperCase()} · IDX ${SFMT(idx, 0)}` : "—"}</span>
      </div>

      {rx ? (
        <div className={`ct-rx ${rx.dir > 0 ? "up" : rx.dir < 0 ? "down" : "flat"}`}>
          <span className="ct-rx-cur mono">{rx.cur}</span>
          <span className="ct-rx-label">
            {rx.dir > 0 ? "MENGUAT" : rx.dir < 0 ? "MELEMAH" : "NETRAL"}
            <em> {rx.via}</em>
          </span>
          <span className="ct-rx-est mono">EST ±{FMT(rx.est, 2)}% · 15 MNT PASCA-RILIS</span>
        </div>
      ) : (
        <p className="ct-empty mono">BELUM ADA RILIS TERKINI — ESTIMASI AKTIF SETELAH DATA KELUAR</p>
      )}

      {pairs.length === 0 ? (
        <p className="ct-empty mono">TIDAK ADA PAIR TERKAIT LANGSUNG DENGAN INDIKATOR INI</p>
      ) : (
        <div className="ct-table-wrap">
          <table className="ct-table mono">
            <thead>
              <tr>
                <th>PAIR</th><th>ARAH</th><th>EST. MOVE</th><th>KEKUATAN</th><th>DRIVER</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((p, i) => (
                <tr key={p.symbol} style={{ "--i": i }}>
                  <td className="ct-pair-name">{p.label}</td>
                  <td>
                    <span className={`ct-dir ${p.dir > 0 ? "up" : p.dir < 0 ? "down" : "flat"}`}>
                      {p.dir > 0 ? "▲ BULLISH" : p.dir < 0 ? "▼ BEARISH" : "◆ NETRAL"}
                    </span>
                  </td>
                  <td className={p.dir === 0 ? "" : p.dir > 0 ? "up" : "down"}>
                    {p.dir === 0 ? "—" : `${p.dir > 0 ? "+" : "−"}${FMT(p.est, 2)}%`}
                  </td>
                  <td>
                    <span className="ct-seg" aria-hidden="true">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <i key={n} className={n <= p.magnitude ? "on" : ""} style={{ "--n": n }} />
                      ))}
                    </span>
                    <span className="ct-acc-sub">{magnitudeLabel(p.magnitude)}</span>
                  </td>
                  <td className="ct-driver">{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="ct-model-note">
        Model heuristik respons pasar (indeks kejutan × volatilitas historis 15 mnt pasca-rilis).
        Untuk edukasi — bukan saran perdagangan.
      </p>
    </div>
  );
}

// ── TERMINAL ─────────────────────────────────────────────────────────────
export default function AnalysisClient({ items, upcoming = [] }) {
  const now = useWib();
  const [selected, setSelected] = useState((items.find((i) => i.id === "cpi") || items[0])?.id);
  const [cat, setCat] = useState("semua");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const qm = q.trim().toLowerCase();
    return items
      .filter((i) => (cat === "semua" ? true : i.category === cat))
      .filter((i) => !qm || i.short.toLowerCase().includes(qm) || i.name.toLowerCase().includes(qm))
      .sort((a, b) => (IMPACT_RANK[a.impact] ?? 3) - (IMPACT_RANK[b.impact] ?? 3) || a.short.localeCompare(b.short));
  }, [items, cat, q]);

  const current = useMemo(() => items.find((i) => i.id === selected) || items[0], [items, selected]);
  const latest = current?.releases?.length ? current.releases[current.releases.length - 1] : null;
  const prevRel = current?.releases?.length > 1 ? current.releases[current.releases.length - 2] : null;
  const globalNext = useMemo(() => {
    if (!now || !upcoming?.length) return null;
    const t = now.getTime();
    return upcoming.filter((e) => new Date(e.iso).getTime() > t).sort((a, b) => a.iso.localeCompare(b.iso))[0] || null;
  }, [upcoming, now]);

  return (
    <>
      <div className="ct-frame reveal" id="consensus-terminal">
        <div className="ct-scan" aria-hidden="true" />

        <header className="ct-head">
          <span className="ct-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="ct-title">
            MACROLAB <em>//</em> CONSENSUS&nbsp;TERMINAL <span className="ct-ver">v2.1</span>
            <span className="ct-cursor" aria-hidden="true" />
          </span>
          <span className="ct-head-right">
            <span className={`ct-led ${current?.source === "live" ? "ok" : "dim"}`}>
              {current?.source === "live" ? "FRED·LIVE" : "FRED·CACHE"}
            </span>
            <span className="ct-clock mono">{now ? WIBM.format(now) : "--:--:--"} WIB</span>
          </span>
        </header>

        <div className="ct-grid">
          {/* 01 · PILIH INDIKATOR */}
          <aside className="ct-side">
            <div className="ct-side-head">
              <span className="ct-tag">01</span>
              <h4>Pilih Indikator</h4>
              <span className="ct-count mono">{list.length}/{items.length}</span>
            </div>

            <div className="ct-search">
              <span className="ct-prompt" aria-hidden="true">&gt;</span>
              <input
                type="text"
                placeholder="cari indikator…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Cari indikator"
              />
            </div>

            <div className="ct-cats" role="tablist" aria-label="Kategori indikator">
              <button className={cat === "semua" ? "on" : ""} onClick={() => setCat("semua")}>SEMUA</button>
              {CATEGORIES.map((c) => (
                <button key={c.id} className={cat === c.id ? "on" : ""} onClick={() => setCat(c.id)}>
                  {c.label.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="ct-list">
              {list.map((i) => {
                const l = i.releases?.length ? i.releases[i.releases.length - 1] : null;
                const dCls = l?.surprise === null ? "" : Math.abs(l.surprise) <= (i.tol ?? 0.5) ? "flat" : l.surprise > 0 ? "up" : "down";
                const ne = nextEvent(upcoming, i.id, now);
                const cc = COUNTRIES.find((x) => x.id === i.country);
                const catC = CATEGORIES.find((x) => x.id === i.category)?.color;
                return (
                  <button
                    key={i.id}
                    className={`ct-row ${i.id === current.id ? "on" : ""}`}
                    onClick={() => setSelected(i.id)}
                    style={{ "--c": catC }}
                  >
                    <span className="ct-row-top">
                      <CountryFlag code={cc?.id} size={15} showCode={false} />
                      <b className="ct-row-name">{i.short}</b>
                      <span className={`ct-imp im-${(i.impact || "low").toLowerCase()}`} aria-label={`Dampak ${i.impact}`} title={`Dampak ${i.impact}`}>
                        <i /><i /><i />
                      </span>
                    </span>
                    <span className="ct-row-sub mono">
                      <span>
                        {l ? (
                          <>
                            {FMT(l.consensus, i.decimals)} → <b className={dCls}>{FMT(l.actual, i.decimals)}</b>
                          </>
                        ) : "memuat…"}
                      </span>
                      {ne && <span className="ct-next">{Number(ne.date.slice(8))} {BLN[Number(ne.date.slice(5, 7)) - 1]} {ne.time}</span>}
                    </span>
                  </button>
                );
              })}
              {list.length === 0 && <p className="ct-empty mono">TIDAK ADA HASIL UNTUK {q.toUpperCase()}</p>}
            </div>
          </aside>

          {/* 02-04 · detail (re-mount per indikator → animasi re-entrance) */}
          <section className="ct-main" key={current.id}>
            {current && latest && (
              <>
                <BlockConsensus item={current} latest={latest} prevRel={prevRel} now={now} />
                <BlockHistory item={current} />
                <BlockImpact item={current} latest={latest} />
              </>
            )}
          </section>
        </div>

        <footer className="ct-foot">
          <span className="mono ct-foot-src">
            SRC: FRED{current?.source === "live" ? "+LIVE" : ""} · N: {current?.accuracy.samples ?? 0} · TOL: ±{FMT(current?.tol, 2)} {current?.unit} · ASOF: 30 AGU 2026
          </span>
          {globalNext && now && (
            <span className="mono ct-foot-next">
              NEXT ▸ {globalNext.title} — {fmtEv(globalNext)} WIB · <b>{fmtCountdown(new Date(globalNext.iso).getTime() - now.getTime())}</b>
            </span>
          )}
          <span className="ct-blink" aria-hidden="true">●</span>
        </footer>
      </div>

      <GlossaryHint />
      <ImpactLegend />
    </>
  );
}
