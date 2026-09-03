// components/TechnicalsClient.jsx
// Dashboard Teknikal: matriks sinyal semua instrumen × semua timeframe,
// dijumlahkan jadi skor confluence + grade setup. Data dari /api/technicals.

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { IconChart, IconSearch } from "./Icons";

const TIMEFRAMES = ["15m", "30m", "1h", "4h", "1d", "1w", "1mo"];

const SIG_CLASS = { LONG: "sig-long", SHORT: "sig-short", NETRAL: "sig-neutral" };
const COLORS = {
  LONG: "var(--up)",
  SHORT: "var(--down)",
  NETRAL: "var(--warn)",
};

function formatPrice(symbolId, p) {
  if (p == null) return "—";
  if (["eurusd", "gbpusd", "audusd", "nzdusd"].includes(symbolId)) return p.toFixed(4);
  if (["usdjpy", "usdcad", "dxy"].includes(symbolId)) return p.toFixed(2);
  return p.toFixed(2);
}

export default function TechnicalsClient() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [kind, setKind] = useState("all");
  const [sort, setSort] = useState("score");
  const [updated, setUpdated] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/technicals", { cache: "no-store" });
        const d = await res.json();
        if (active && d?.rows) {
          setRows(d.rows);
          setUpdated(d.updated);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => { active = false; clearInterval(id); };
  }, []);

  const filtered = useMemo(() => {
    let r = rows.filter((x) => x.ok);
    if (kind !== "all") r = r.filter((x) => x.kind === kind);
    if (filter.trim()) {
      const f = filter.toLowerCase();
      r = r.filter((x) => x.label.toLowerCase().includes(f) || x.id.toLowerCase().includes(f));
    }
    if (sort === "score") r = [...r].sort((a, b) => b.score - a.score);
    else if (sort === "grade") r = [...r].sort((a, b) => (a.grade || "D").localeCompare(b.grade || "D"));
    else if (sort === "name") r = [...r].sort((a, b) => a.label.localeCompare(b.label));
    return r;
  }, [rows, filter, kind, sort]);

  return (
    <div>
      <div className="toolbar" style={{ marginBottom: 14 }}>
        <label className="search-box">
          <span className="search-ico"><IconSearch size={16} /></span>
          <input
            className="search-input"
            placeholder="Cari instrumen…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </label>
        <div className="sort-box">
          <span className="sort-label">Jenis</span>
          <select className="sort-select" value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="all">Semua</option>
            <option value="fx">Forex</option>
            <option value="gold">Logam</option>
            <option value="commodity">Komoditas</option>
            <option value="index">Index</option>
          </select>
        </div>
        <div className="sort-box">
          <span className="sort-label">Urutkan</span>
          <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="score">Skor Confluence</option>
            <option value="grade">Grade Setup</option>
            <option value="name">Nama</option>
          </select>
        </div>
        <span className="cell-muted" style={{ marginLeft: "auto" }}>
          {updated ? `Update ${new Date(updated).toLocaleTimeString("id-ID")}` : ""}
        </span>
      </div>

      {loading ? (
        <div className="cell-muted">Memuat matriks sinyal…</div>
      ) : filtered.length === 0 ? (
        <div className="cell-muted">Tidak ada instrumen cocok.</div>
      ) : (
        <div className="table-wrap tech-table-scroll">
          <table className="data-table tech-table">
            <thead>
              <tr>
                <th>Instrumen</th>
                <th>Grade</th>
                {TIMEFRAMES.map((tf) => (
                  <th key={tf} className="tech-tf">{tf}</th>
                ))}
                <th>Skor</th>
                <th>Bias</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="cell-name">{row.label}</div>
                    <div className="cell-muted">{row.id.toUpperCase()}</div>
                  </td>
                  <td>
                    <span className={`grade-chip grade-${row.grade || "C"}`}>
                      {row.grade || "C"}
                    </span>
                  </td>
                  {TIMEFRAMES.map((tf) => {
                    const t = row.tfs?.find((x) => x.tf === tf);
                    const sig = t?.ok ? (t.signal || "NETRAL") : "—";
                    return (
                      <td key={tf} className="tech-cell">
                        <span
                          className={`tech-sig ${t?.ok ? SIG_CLASS[sig] : ""}`}
                          style={t?.ok ? { color: COLORS[sig] } : { color: "var(--dim)" }}
                          title={t?.ok ? `${row.label} ${tf}: ${sig} (skor ${t.score})` : "data tidak tersedia"}
                        >
                          {t?.ok ? (sig === "LONG" ? "▲" : sig === "SHORT" ? "▼" : "•") : "–"}
                        </span>
                      </td>
                    );
                  })}
                  <td>
                    <span className={`score ${row.score > 2 ? "up" : row.score < -2 ? "down" : "flat"}`}>
                      {row.score > 0 ? "+" : ""}{row.score}
                    </span>
                  </td>
                  <td>
                    <span className={`bias-pill ${row.score > 2 ? "bull" : row.score < -2 ? "bear" : "flat"}`}>
                      {row.scoreLabel}
                    </span>
                  </td>
                  <td>
                    <Link href={`/charts?sym=${row.id}`} className="btn btn-ghost btn-sm">
                      <IconChart size={14} /> Chart
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="cell-muted" style={{ marginTop: 12 }}>
        <b>Baca tabel:</b> ▲ = LONG (beli) · ▼ = SHORT (jual) · • = Netral. Skor confluence
        berkisar +10 (semua TF setuju beli) hingga −10 (setuju jual). Grade A = sinyal selaras &
        kuat; B = cukup; C = campuran (tunggu konfirmasi). Sinyal dihitung dari EMA 20/50, RSI 14,
        MACD & ATR.
      </p>
    </div>
  );
}
