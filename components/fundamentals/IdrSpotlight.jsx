// components/fundamentals/IdrSpotlight.jsx
// "Fokus Rupiah 🇮🇩" — panel khusus IDR: kuotasi live USD/IDR, grafik
// interaktif (hover + pilihan rentang), posisi 52-minggu, jalur BI-Rate,
// grid indikator makro Indonesia (BPS/BI), faktor penggerak, kalender &
// kesimpulan. Semua angka diberi sumber + tanggal.

"use client";

import { useMemo, useState } from "react";
import CountUp from "../CountUp";
import Sparkline from "../Sparkline";
import { AreaChart, Countdown, ScoreDial, Segmented, SrcBadge, StepChart, fmtID, pctID } from "./ui";

const RANGES = [
  { id: "6m", label: "6 Bulan", months: 6 },
  { id: "1y", label: "1 Tahun", months: 12 },
  { id: "2y", label: "2 Tahun", months: 24 },
  { id: "all", label: "Semua", months: 999 },
];

const fmtYIDR = (v) => Math.round(v / 100) * 100 >= 1000 ? Math.round(v).toLocaleString("id-ID") : String(Math.round(v));
const MONTHS_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const fmtXIDR = (d) => {
  if (d === "live") return "LIVE";
  const [y, m] = d.split("-");
  return `${MONTHS_ID[+m - 1]} ${y.slice(2)}`;
};
const fmtYRate = (v) => v.toFixed(1).replace(".", ",");

function Range52({ stats }) {
  const pos = Math.max(2, Math.min(98, stats.pos52));
  return (
    <div className="range52">
      <div className="r52-head">
        <span>Posisi 52 Minggu</span>
        <span className={`chip ${stats.ytd <= 0 ? "pos" : "neg"}`} title={`USD/IDR ${pctID(stats.ytd)} sejak awal 2026`}>
          Rupiah {pctID(Math.abs(stats.ytd))} YTD ({stats.ytd <= 0 ? "menguat" : "melemah"})
        </span>
      </div>
      <div className="r52-track">
        <i className="r52-marker" style={{ left: `${pos}%` }} />
        <span className="r52-lab lo">Rp{fmtID(stats.lo52, 0)}</span>
        <span className="r52-lab hi">Rp{fmtID(stats.hi52, 0)}</span>
      </div>
      <div className="r52-foot">Sekarang Rp{fmtID(stats.last, 0)} — {pos < 25 ? "dekat batas bawah (rupiah kuat)" : pos > 75 ? "dekat batas atas (rupiah lemah)" : "di tengah rentang"}</div>
    </div>
  );
}

function IndicatorTile({ ind, inflSeries }) {
  const delta = ind.prev != null ? ind.value - ind.prev : null;
  const goodDown = ["unemp"].includes(ind.id); // turun = lebih baik
  const tone = delta == null || Math.abs(delta) < 0.005 ? "flat" : (delta < 0) === goodDown ? "up" : "down";
  return (
    <div className="idr-ind" title={ind.note}>
      <div className="idr-ind-top">
        <span className="idr-ind-label">{ind.label}</span>
        {ind.id === "cpi" && inflSeries?.length > 2 && <Sparkline points={inflSeries.slice(-18)} color="#fbbf24" width={78} height={26} />}
      </div>
      <div className="idr-ind-val">
        <b><CountUp value={ind.value} decimals={Number.isInteger(ind.value) ? 0 : (String(ind.value).split(".")[1] || "").length} /></b>
        <span className="idr-ind-unit">{ind.unit}</span>
      </div>
      <div className="idr-ind-delta">
        {delta != null && (
          <span className={`trend-pill sm ${tone}`}>
            {delta === 0 ? "–" : delta > 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(2).replace(".", ",")} vs periode lalu
          </span>
        )}
      </div>
      <div className="idr-ind-foot">
        <span>{ind.date} · {ind.source}</span>
      </div>
    </div>
  );
}

function DriverCard({ d, i }) {
  const [open, setOpen] = useState(i === 0);
  return (
    <button type="button" className={`idr-driver ${open ? "open" : ""}`} onClick={() => setOpen((o) => !o)}>
      <div className="idr-driver-head">
        <span className="idr-driver-ico">{d.ico}</span>
        <div className="idr-driver-title">
          <b>{d.k}</b>
          <span>{d.v}</span>
        </div>
        <span className={`idr-driver-weight ${d.weight === "TINGGI" ? "high" : d.weight === "SEDANG" ? "mid" : "low"}`}>{d.weight}</span>
        <span className="idr-driver-arrow">{open ? "▲" : "▼"}</span>
      </div>
      {open && <p className="idr-driver-note">{d.note}</p>}
    </button>
  );
}

export default function IdrSpotlight({ idr, banks = [] }) {
  const { quote, series, biPath, infl, indicators, drivers, events, stats, verdict, asof } = idr;
  const [range, setRange] = useState("1y");
  const [flip, setFlip] = useState(false); // tampilan Rupiah per Dolar ⇄ Dolar per Rupiah

  const chartData = useMemo(() => {
    const r = RANGES.find((x) => x.id === range);
    let pts = series;
    if (r.months < 999) pts = series.slice(-r.months);
    // titik live menimpa titik terakhir + ditandai
    const out = pts.map((p) => ({ ...p }));
    if (quote?.value && out.length) out[out.length - 1] = { date: "live", value: quote.value };
    return out;
  }, [series, range, quote]);

  const liveIdx = quote?.value ? chartData.length - 1 : -1;
  const dayPct = quote?.pct ?? null;
  const fed = banks.find((b) => b.key === "us");
  const bi = banks.find((b) => b.key === "id");

  return (
    <section className="section fv-idr-sec" id="rupiah">
      <div className="section-head">
        <h2><span className="inline-ico">🇮🇩</span> Fokus Rupiah (IDR)</h2>
        <span className="cell-muted asof-chip">Kurasi per {asof} + kuotasi live</span>
      </div>

      {/* ── baris atas: kuotasi + grafik ── */}
      <div className="fv-idr-top">
        <div className="idr-quote panel-card">
          <div className="idr-quote-head">
            <span className="idr-quote-sym">USD/IDR</span>
            <button type="button" className="flip-btn" onClick={() => setFlip((f) => !f)} title="Balik arah kutipan">
              {flip ? "USD → IDR" : "IDR → USD"} ⇄
            </button>
          </div>
          <div className="idr-quote-price">
            {flip ? (
              <>
                $<CountUp value={quote?.value ? 10000 / quote.value : 0} decimals={3} />
                <span className="idr-quote-unit">per Rp10.000</span>
              </>
            ) : (
              <>
                Rp <CountUp value={quote?.value ?? 0} decimals={0} />
                <span className="idr-quote-unit">per US$1</span>
              </>
            )}
          </div>
          <div className="idr-quote-meta">
            <span className={`trend-pill ${dayPct == null ? "flat" : dayPct > 0 ? "down" : dayPct < 0 ? "up" : "flat"}`}>
              {dayPct == null ? "—" : `${dayPct > 0 ? "▲" : dayPct < 0 ? "▼" : "–"} ${Math.abs(dayPct).toFixed(2).replace(".", ",")}%`}
            </span>
            <span className="cell-muted">{dayPct == null ? "" : dayPct > 0 ? "rupiah melemah hari ini" : dayPct < 0 ? "rupiah menguat hari ini" : "datar hari ini"}</span>
            <SrcBadge kind={quote?.source === "live" ? "live" : quote?.demo ? "demo" : "kurasi"} label={quote?.sourceLabel || (quote?.demo ? "DEMO" : "LIVE")} />
          </div>
          <p className="idr-quote-note">
            <b>Catatan arah:</b> USD/IDR <b>naik</b> = rupiah <b>melemah</b> (butuh lebih banyak rupiah per dolar).
          </p>
        </div>

        <div className="idr-chart panel-card">
          <div className="idr-chart-head">
            <div>
              <b>USD/IDR — Riwayat</b>
              <span className="cell-muted"> rata-rata bulanan (BI/Reuters) + titik live</span>
            </div>
            <Segmented options={RANGES} value={range} onChange={setRange} small />
          </div>
          <AreaChart
            points={chartData}
            color="#f0b429"
            height={280}
            fmtX={fmtXIDR}
            fmtY={fmtYIDR}
            liveIdx={liveIdx}
            footnote={quote?.value ? "Titik terakhir = kuotasi live Yahoo Finance; sisanya rata-rata bulanan kurasi." : "Rata-rata bulanan kurasi (BI/Reuters)."}
          />
        </div>
      </div>

      {/* ── baris kedua: 52-minggu · BI-Rate · kesimpulan ── */}
      <div className="fv-idr-mid">
        <div className="panel-card idr-range-card">
          <Range52 stats={stats} />
        </div>

        <div className="panel-card idr-bi-card">
          <div className="idr-bi-head">
            <div>
              <b>🏦 Bank Indonesia — BI-Rate</b>
              <span className="cell-muted"> Reverse Repo 7 hari · siklus pelonggaran</span>
            </div>
            <div className="idr-bi-right">
              <span className="idr-bi-rate">{fmtID(bi?.rate ?? 4, 2)}%</span>
              <Countdown iso={bi?.nextMeeting?.iso} />
            </div>
          </div>
          <StepChart points={biPath} fmtY={fmtYRate} fmtEnd={(v) => v.toFixed(2).replace(".", ",")} fmtX={fmtXIDR} color="#2dd4bf" />
          <div className="idr-bi-foot">
            <span className="cell-muted">{biPath[0]?.date} → {biPath[biPath.length - 1]?.date}: 6,25% → {fmtID(biPath[biPath.length - 1]?.value, 2)}% ({biPath.length - 2} kali pemangkasan)</span>
            <span className="cell-muted">RDG berikutnya: {bi?.nextMeeting?.name}</span>
          </div>
        </div>

        <div className={`panel-card idr-verdict ${verdict.score != null && verdict.score >= 55 ? "good" : verdict.score != null && verdict.score < 45 ? "bad" : ""}`}>
          <div className="idr-verdict-head">
            <b>📋 Kesimpulan Rupiah</b>
            {verdict.score != null && <ScoreDial score={verdict.score} label="skor bias" />}
          </div>
          <div className="idr-verdict-badge">
            <span className={`fund-tag ${verdict.score >= 55 ? "bull" : verdict.score < 45 ? "bear" : "flat"}`}>{verdict.label}</span>
            <span className={`chip ${verdict.carry > 0 ? "pos" : "neg"}`}>Carry {verdict.carry > 0 ? "+" : ""}{verdict.carry}bp vs The Fed</span>
            <span className={`chip ${verdict.inTarget ? "pos" : "warn"}`}>{verdict.inTarget ? "Inflasi dalam target" : "Inflasi di luar target"}</span>
          </div>
          <p className="idr-verdict-text">{verdict.headline}</p>
          <div className="idr-verdict-cols">
            <div>
              <h5>✅ Angin Baik</h5>
              <ul>{verdict.winds.map((w, i) => <li key={i}>{w}</li>)}</ul>
            </div>
            <div>
              <h5>⚠️ Risiko</h5>
              <ul>{verdict.risks.map((r, i) => <li key={i}>{r}</li>)}</ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── grid indikator ── */}
      <div className="idr-ind-grid">
        {indicators.map((ind) => <IndicatorTile key={ind.id} ind={ind} inflSeries={ind.id === "cpi" ? infl : null} />)}
      </div>

      {/* ── penggerak + kalender ── */}
      <div className="fv-idr-bottom">
        <div className="idr-drivers">
          <h4>🔧 Apa yang Menggerakkan Rupiah</h4>
          <p className="cell-muted">Klik untuk membuka penjelasan — diurut dari pengaruh terbesar.</p>
          {drivers.map((d, i) => <DriverCard key={d.id} d={d} i={i} />)}
        </div>
        <div className="idr-events">
          <h4>📅 Kalender Rupiah</h4>
          <p className="cell-muted">Acara yang paling menggerakkan USD/IDR dalam beberapa pekan ke depan (WIB).</p>
          {events.map((e) => (
            <div key={e.iso} className="idr-event">
              <div className="idr-event-date">
                <b>{e.date}</b>
                <span>{e.time} WIB</span>
              </div>
              <div className="idr-event-body">
                <b>{e.title}</b>
                <span className="cell-muted">{e.source} · {e.note}</span>
              </div>
              <Countdown iso={e.iso} />
            </div>
          ))}
          <div className="idr-diff-note">
            <b>Diferensial kunci:</b> The Fed {fmtID(fed?.rate ?? 3.75, 2)}% vs BI {fmtID(bi?.rate ?? 4, 2)}% →
            <span className={`chip ${verdict.carry >= 0 ? "pos" : "neg"}`}>{verdict.carry >= 0 ? "+" : "−"}{Math.abs(verdict.carry)}bp</span>
            {verdict.carry >= 0 ? "pro-Rupiah" : "pro-USD"} · yield 10Y: AS {fmtID(4.72, 2)}% vs INDOGB {fmtID(6.55, 2)}% (spread +183bp menarik arus masuk).
          </div>
        </div>
      </div>
    </section>
  );
}
