// components/SignalPanel.jsx
// Bar sinyal Long/Short (Beli/Jual) per timeframe — data dihitung server-side
// (EMA 20/50, RSI 14, MACD 12,26,9) dari harga riil Yahoo Finance.
// TF yang dipilih juga dipakai TradingView chart di bawahnya (interval sync).

"use client";

import { useEffect, useState } from "react";

const TF_LABELS = {
  "15m": "15m",
  "30m": "30m",
  "1h": "1 Jam",
  "4h": "4 Jam",
  "1d": "1 Hari",
  "1w": "1 Minggu",
  "1mo": "1 Bulan",
};

const ACTIONS = {
  LONG: { text: "LONG — BELI", cls: "sig-long", ico: "▲" },
  SHORT: { text: "SHORT — JUAL", cls: "sig-short", ico: "▼" },
  NETRAL: { text: "NETRAL — TUNGGU", cls: "sig-neutral", ico: "◆" },
};

function fmtPrice(p) {
  if (p == null) return "—";
  if (p >= 1000) return p.toLocaleString("en-US", { maximumFractionDigits: 1 });
  if (p >= 100) return p.toFixed(2);
  if (p >= 10) return p.toFixed(3);
  return p.toFixed(4);
}

export default function SignalPanel({ symbol, tf, onTf }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetch(`/api/signal?symbol=${symbol.id}&tf=${tf}`)
      .then((r) => r.json().then((j) => ({ status: r.status, j })))
      .then(({ status, j }) => {
        if (!alive) return;
        if (status === 200 && j.ok) {
          setData(j);
        } else {
          setData(null);
          setError(j?.error || "Gagal mengambil data sinyal");
        }
      })
      .catch(() => alive && setError("Gagal terhubung ke server sinyal"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [symbol.id, tf]);

  const a = data ? ACTIONS[data.signal] : null;

  return (
    <div className={`signal-card ${a ? a.cls : ""}`}>
      <header className="term-head">
        <h3 className="term-title">
          <span className="term-ico" aria-hidden="true">📡</span>
          Signal <span className="term-sub">· {symbol.label}</span>
        </h3>
        <span className="term-badge">EMA · RSI · MACD</span>
      </header>

      <div className="signal-body">
      <div className="signal-tf" role="tablist" aria-label="Pilih timeframe sinyal">
        {Object.keys(TF_LABELS).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tf === t}
            className={`tf-pill ${tf === t ? "active" : ""}`}
            onClick={() => onTf(t)}
          >
            {TF_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="signal-main">
        <div className={`signal-badge ${a ? a.cls : ""}`}>
          <span className="signal-ico" aria-hidden="true">{a ? a.ico : "…"}</span>
          <div className="signal-text">
            <span className="signal-word">
              {loading && !data ? "Memuat…" : a ? a.text : error ? "GAGAL" : "—"}
            </span>
            <span className="signal-sub">
              {data
                ? `Skor ${data.score > 0 ? "+" : ""}${data.score} · kekuatan ${data.strength} · TF ${tf}`
                : error
                  ? error
                  : "Sinyal Long/Short per timeframe"}
            </span>
          </div>
        </div>

        <div className="signal-stat price-stat">
          <span className="stat-lbl">Harga terakhir</span>
          <span className="stat-val big">{data ? fmtPrice(data.price) : "—"}</span>
          {data && (
            <span className={`stat-pct ${data.changePct >= 0 ? "up" : "down"}`}>
              {data.changePct >= 0 ? "+" : ""}{data.changePct.toFixed(2)}% · {data.changeBasis || ""}
            </span>
          )}
        </div>
      </div>

      {/* Detail indikator — mengisi card agar tidak ada space kosong */}
      <div className="sig-detail">
        <div className="sig-row" title="RSI(14) — <30 jenuh jual, >70 jenuh beli">
          <span className="sig-k">RSI 14</span>
          <span className="sig-gauge" aria-hidden="true">
            <span
              className={`sig-gauge-mark ${
                data ? (data.indicators.rsi >= 70 ? "hot" : data.indicators.rsi <= 30 ? "cold" : "") : ""
              }`}
              style={{ left: data ? `${Math.max(0, Math.min(100, data.indicators.rsi))}%` : "50%" }}
            />
          </span>
          <span className="sig-v">
            {data ? data.indicators.rsi : "—"}
            {data && (data.indicators.rsi >= 70 ? " 🔥" : data.indicators.rsi <= 30 ? " ❄️" : "")}
          </span>
        </div>

        <div className="sig-row" title="Tren: EMA 20 vs EMA 50">
          <span className="sig-k">EMA 20/50</span>
          <span className="sig-vals">
            <span>20: <b>{data ? data.indicators.ema20 : "—"}</b></span>
            <span>50: <b>{data ? data.indicators.ema50 : "—"}</b></span>
          </span>
          <span className={`sig-v ${data ? (data.indicators.ema20 > data.indicators.ema50 ? "up" : "down") : ""}`}>
            {data ? (data.indicators.ema20 > data.indicators.ema50 ? "▲ Naik" : "▼ Turun") : "—"}
          </span>
        </div>

        <div className="sig-row" title="Momentum: MACD(12,26,9) vs signal line">
          <span className="sig-k">MACD</span>
          <span className="sig-vals">
            <span>line: <b>{data ? data.indicators.macd : "—"}</b></span>
            <span>sig: <b>{data ? data.indicators.macdSignal : "—"}</b></span>
            <span>hist: <b>{data ? data.indicators.macdHist : "—"}</b></span>
          </span>
          <span className={`sig-v ${data ? (data.indicators.macd > data.indicators.macdSignal ? "up" : "down") : ""}`}>
            {data ? (data.indicators.macd > data.indicators.macdSignal ? "▲ Naik" : "▼ Turun") : "—"}
          </span>
        </div>

        <div className="sig-row" title="Alasan skor — arahkan kursor untuk melihat semuanya">
          <span className="sig-k">Alasan</span>
          <span className="sig-reasons-full" title={data ? data.reasons.join(" · ") : ""}>
            {data ? data.reasons.join(" · ") : "Memuat analisis…"}
          </span>
        </div>
      </div>

      <div className="signal-foot">
        <span className="signal-disc">
          {data
            ? `Sumber: ${data.source} · ${data.bars.toLocaleString("en-US")} bar · terakhir ${new Date(data.lastBar).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} WIB`
            : ""}{" "}
          · Bukan nasihat keuangan
        </span>
      </div>
      </div>
    </div>
  );
}
