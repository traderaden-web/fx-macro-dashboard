// components/AnalysisClient.jsx
// Halaman analisis interaktif: pilih indikator → lihat konsensus vs actual
// dan dampaknya terhadap pasangan mata uang, plus metrik akurasi konsensus.
"use client";

import { useMemo, useState } from "react";
import { CATEGORIES, COUNTRIES } from "../lib/series";
import { magnitudeLabel, computePairImpact } from "../lib/pairs";
import { CountryFlag } from "./Badges";
import { GlossaryHint, ImpactLegend } from "./Legend";
import { IconSearch, IconLightbulb } from "./Icons";

const FMT = (v, d = 1) => (v === null || v === undefined ? "—" : Number(v).toLocaleString("id-ID", { maximumFractionDigits: d }));

const TONE = {
  hawkish: { c: "#4ade80", bg: "rgba(74,222,128,0.14)", label: "Hawkish" },
  dovish: { c: "#fb7185", bg: "rgba(251,113,133,0.14)", label: "Dovish" },
  netral: { c: "#fbbf24", bg: "rgba(251,191,36,0.14)", label: "Netral" },
};

// Urutan daftar: dampak High → Medium → Low, lalu alfabetis
const IMPACT_RANK = { High: 0, Medium: 1, Low: 2 };

export default function AnalysisClient({ items }) {
  const [selected, setSelected] = useState((items.find((i) => i.id === "cpi") || items[0])?.id);
  const [cat, setCat] = useState("semua");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const qm = q.trim().toLowerCase();
    return items
      .filter((i) => (cat === "semua" ? true : i.category === cat))
      .filter((i) => !qm || i.short.toLowerCase().includes(qm) || i.name.toLowerCase().includes(qm))
      .sort(
        (a, b) =>
          (IMPACT_RANK[a.impact] ?? 3) - (IMPACT_RANK[b.impact] ?? 3) ||
          a.short.localeCompare(b.short)
      );
  }, [items, cat, q]);

  const current = useMemo(() => items.find((i) => i.id === selected) || items[0], [items, selected]);
  const latest = current?.releases?.length ? current.releases[current.releases.length - 1] : null;

  return (
    <>
      <div className="card reveal">
        <div className="section-head">
          <h3>Pilih Indikator</h3>
          <span className="cell-muted">{list.length} tersedia · urut <b style={{ color: "var(--down)" }}>High</b> → <b style={{ color: "var(--warn)" }}>Medium</b> → <b style={{ color: "var(--dim)" }}>Low</b></span>
        </div>
        <div className="toolbar">
          <div className="search-box">
            <span className="search-ico" aria-hidden="true"><IconSearch size={16} /></span>
            <input className="search-input" type="text" placeholder="Cari indikator…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="sort-box">
            <label className="sort-label">Kategori:</label>
            <select className="sort-select" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="semua">Semua</option>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <div className="indicator-picker">
          {list.map((i) => {
            const active = i.id === current.id;
            const c = CATEGORIES.find((x) => x.id === i.category);
            const cc = COUNTRIES.find((x) => x.id === i.country);
            return (
              <button
                key={i.id}
                className={`ind-pick ${active ? "active" : ""}`}
                onClick={() => setSelected(i.id)}
                style={active ? { borderColor: c?.color, background: `${c?.color}16` } : undefined}
              >
                <CountryFlag code={cc?.id} size={18} showCode={false} />
                <span className="ind-name">{i.short}</span>
                <span className={`ind-impact im-${(i.impact || "low").toLowerCase()}`} title={`Dampak ${i.impact}`}>{i.impact}</span>
              </button>
            );
          })}
        </div>
      </div>

      {current && <AnalysisDetail item={current} latest={latest} key={current.id} />}
    </>
  );
}

function AnalysisDetail({ item, latest }) {
  const surprisePct = latest?.surprisePct ?? null;
  const surprise = latest?.surprise ?? null;

  let senti = { tone: "netral", label: "Netral", desc: "Nilai sesuai konsensus." };
  if (surprisePct > 0) senti = { tone: "hawkish", label: "Hawkish", desc: "Nilai di atas konsensus — biasanya mendukung/menguatkan." };
  else if (surprisePct < 0) senti = { tone: "dovish", label: "Dovish", desc: "Nilai di bawah konsensus — biasanya melemahkan/menekan." };
  const tone = TONE[senti.tone];

  const pairs = useMemo(() => {
    if (!latest || surprisePct === null || surprisePct === undefined) return [];
    return computePairImpact(item.id, latest.surprisePct, latest.surprise);
  }, [item.id, latest, surprisePct, surprise]);

  return (
    <>
      <div className="card reveal">
        <div className="section-head">
          <h3>Consensus vs Actual — {item.short}</h3>
          <span className="cell-muted">{item.countryName}</span>
        </div>
        {latest ? (
          <>
            <div className="legend" style={{ marginBottom: 8 }}>
              <span>{item.source === "live" ? <span className="live-pill" style={{ fontSize: 11 }}>Data konsensus: Live (ForexFactory)</span> : <span className="cell-muted">Data konsensus: demo/lokal</span>}</span>
            </div>
            <div className="hilo-grid">
              <HiLo label="Previous" tip="Nilai rilis sebelumnya — dipakai sebagai pembanding." value={latest.previous} unit={item.unit} decimals={item.decimals} />
              <HiLo label="Consensus" tip="Perkiraan para analis sebelum data resmi keluar." value={latest.consensus} unit={item.unit} decimals={item.decimals} highlight />
              <HiLo label="Actual" tip="Nilai resmi yang benar-benar dirilis." value={latest.actual} unit={item.unit} decimals={item.decimals} actual />
              <HiLo label="Surprise" tip="Selisih Actual − Consensus. Melenceng jauh = kejutan besar bagi pasar." value={surprise} unit={item.unit} decimals={item.decimals} signed />
            </div>
            <div className="surprise-bar">
              <div className="sb-label">
                <span>Surprise (= Actual − Consensus)</span>
                <span style={{ fontWeight: 700, color: surprisePct > 0 ? "var(--up)" : surprisePct < 0 ? "var(--down)" : "var(--warn)" }}>
                  {surprisePct > 0 ? "+" : ""}{Number(surprisePct).toFixed(2)}% &nbsp;·&nbsp; {surprise > 0 ? "+" : ""}{Number(surprise).toFixed(item.decimals)}
                </span>
              </div>
              <div className="sb-track"><div className="sb-fill" style={{ width: `${Math.min((Math.abs(surprisePct) / 8) * 100, 100)}%`, background: surprisePct > 0 ? "var(--up)" : surprisePct < 0 ? "var(--down)" : "var(--warn)" }} /></div>
            </div>
            <div className="sentiment-chip" style={{ color: tone.c, background: tone.bg }}>
              <strong>{tone.label}</strong> — {senti.desc}
            </div>
            <p className="cal-note" style={{ marginTop: 12 }}>
              <span className="inline-ico" aria-hidden="true"><IconLightbulb size={15} /></span>{" "}
              <strong>Hawkish</strong> = cenderung menaikkan suku bunga/kebijakan ketat (biasanya menguatkan mata uang).{" "}
              <strong>Dovish</strong> = cenderung menurunkan suku bunga/kebijakan longgar (biasanya melemahkan). Nilai
              konsensus di atas = kejutan positif; di bawah = negatif.
            </p>
          </>
        ) : (
          <p className="cell-muted" style={{ margin: 0 }}>Belum ada data release.</p>
        )}
      </div>

      <AccuracyPanel item={item} />

      <div className="card reveal">
        <div className="section-head">
          <h3>Dampak terhadap Pasangan Mata Uang</h3>
          <span className="cell-muted">Rilis terakhir: {latest?.date || "—"}</span>
        </div>
        {pairs.length === 0 ? (
          <p className="cell-muted" style={{ margin: 0 }}>Indikator ini tidak terkait langsung dengan pair utama yang dipantau.</p>
        ) : (
          <>
          <div className="table-hint">Geser tabel untuk melihat semua kolom →</div>
          <div className="table-wrap" style={{ border: "none" }}>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Pair</th>
                    <th>Arah</th>
                    <th>Kekuatan</th>
                    <th>Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {pairs.map((p) => (
                    <tr key={p.symbol}>
                      <td className="cell-name mono" style={{ fontWeight: 700 }}>{p.label}</td>
                      <td><span className={`dir-chip ${p.dir === 1 ? "up" : p.dir === -1 ? "down" : ""}`}>{p.dir === 1 ? "▲ Naik" : p.dir === -1 ? "▼ Turun" : "— Netral"}</span></td>
                      <td>
                        <span className="mag-dots">{Array.from({ length: 5 }, (_, i) => <span key={i} className={`mag-dot ${i + 1 <= p.magnitude ? "on" : ""}`} />)}</span>
                        <span className="cell-muted" style={{ marginLeft: 8 }}>{magnitudeLabel(p.magnitude)}</span>
                      </td>
                      <td className="cell-muted" style={{ fontSize: 12 }}>{p.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </>
        )}
      </div>

      <GlossaryHint />
      <ImpactLegend />
    </>
  );
}

function AccuracyPanel({ item }) {
  const acc = item.accuracy;
  if (!acc || !acc.samples) return null;
  return (
    <div className="card reveal">
      <div className="section-head">
        <h3>Riwayat Surprise &amp; Akurasi Konsensus</h3>
        <span className="cell-muted">{acc.samples} sampel rilis</span>
      </div>
      <div className="hilo-grid">
        <Metric label="Akurasi Konsensus" tip="Berapa kali perkiraan analis berhasil mendekati nilai aktual (±0,5)." value={FMT(acc.hitRate, 1)} unit="%" sub="Actual dekat konsensus (±0.5)" />
        <Metric label="Akurasi Arah" tip="Seberapa sering konsensus menebak dengan benar arah (naik/turun)." value={FMT(acc.dirAcc, 1)} unit="%" sub="Konsensus menebak arah benar" />
        <Metric label="Bias Surprise" tip="Rata-rata selisih mendekati konsensus. Positif = konsensus cenderung terlalu rendah." value={(acc.bias > 0 ? "+" : "") + FMT(acc.bias, 2)} sub="Rata-rata actual − konsensus" />
        <Metric label="Deviasi Rata-rata" tip="Berapa besar rata-rata penyimpangan dari konsensus, relatif terhadap nilai konsensus." value={FMT(acc.avgPct, 2)} unit="%" sub="Surprise relatif konsensus" />
      </div>
    </div>
  );
}

function Metric({ label, value, unit, sub, tip }) {
  return (
    <div className="hilo">
      <div className="kpi-label">{tip ? <span className="tip" data-tip={tip}>{label}</span> : label}</div>
      <div className="kpi-value" style={{ fontSize: 24 }}>{value} {unit ? <span className="cell-muted" style={{ fontSize: 12 }}>{unit}</span> : null}</div>
      {sub ? <div className="kpi-sub">{sub}</div> : null}
    </div>
  );
}

function HiLo({ label, value, unit, decimals, highlight, actual, signed, tip }) {
  const display = value === null || value === undefined ? "—" : signed && value > 0 ? `+${Number(value).toFixed(decimals)}` : Number(value).toFixed(decimals);
  return (
    <div className="hilo" style={{ border: highlight || actual ? "1px solid var(--accent)" : undefined }}>
      <div className="kpi-label">{tip ? <span className="tip" data-tip={tip}>{label}</span> : label}</div>
      <div className="kpi-value" style={{ color: actual ? "var(--text)" : undefined, fontSize: 24 }}>{display} <span className="cell-muted" style={{ fontSize: 12 }}>{unit}</span></div>
    </div>
  );
}
