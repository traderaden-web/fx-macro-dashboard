// components/SignalPanel.jsx
// Card sinyal Long/Short (Beli/Jual) per timeframe — data dihitung server-side
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

const fmtNum = (v) => (v == null ? "—" : Number(v).toLocaleString("en-US"));

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
  const rsi = data?.indicators?.rsi;

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
        {/* Timeframe */}
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

        {/* Verdict */}
        <div className={`signal-verdict ${a ? a.cls : ""}`}>
          <span className="signal-verdict-ico" aria-hidden="true">{a ? a.ico : "…"}</span>
          <div className="signal-verdict-text">
            <span className="signal-word">
              {loading && !data ? "MEMUAT…" : a ? a.text : error ? "GAGAL" : "—"}
            </span>
            <span className="signal-sub">
              {data
                ? `Skor ${data.score > 0 ? "+" : ""}${data.score} · kekuatan ${data.strength} · timeframe ${tf}`
                : error
                  ? error
                  : "Sinyal Long/Short per timeframe"}
            </span>
          </div>
        </div>

        {/* Harga */}
        <div className="signal-price">
          <span className="sig-plabel">Harga terakhir</span>
          <span className="sig-pval">{data ? fmtPrice(data.price) : "—"}</span>
          {data && (
            <span className={`sig-pct ${data.changePct >= 0 ? "up" : "down"}`}>
              {data.changePct >= 0 ? "▲" : "▼"} {Math.abs(data.changePct).toFixed(2)}%
              <i>{data.changeBasis || ""}</i>
            </span>
          )}
        </div>

        {/* Tabel indikator */}
        <div className="sig-table">
          <div className="sig-trow">
            <span className="sig-tlabel" title="RSI(14) — di bawah 30 jenuh jual, di atas 70 jenuh beli">
              RSI 14
            </span>
            <span className={`sig-tval ${data ? (rsi >= 70 ? "down" : rsi <= 30 ? "up" : "") : ""}`}>
              {data ? rsi : "—"}
              {data && (rsi >= 70 ? " 🔥" : rsi <= 30 ? " ❄️" : "")}
            </span>
            <span className="sig-tsub">
              {data
                ? rsi >= 70
                  ? "jenuh beli"
                  : rsi > 60
                    ? "cenderung jenuh beli"
                    : rsi <= 30
                      ? "jenuh jual"
                      : rsi < 40
                        ? "cenderung jenuh jual"
                        : "netral"
                : ""}
            </span>
          </div>
          <div className="sig-gauge-row" aria-hidden="true">
            <span className="sig-gauge">
              <span
                className={`sig-gauge-mark ${data ? (rsi >= 70 ? "hot" : rsi <= 30 ? "cold" : "") : ""}`}
                style={{ left: data ? `${Math.max(0, Math.min(100, rsi))}%` : "50%" }}
              />
            </span>
            <span className="sig-gauge-scale">
              <i>0</i>
              <i>30</i>
              <i>70</i>
              <i>100</i>
            </span>
          </div>

          <div className="sig-trow" title="Tren: EMA 20 vs EMA 50">
            <span className="sig-tlabel">EMA 20/50</span>
            <span className={`sig-tval ${data ? (data.indicators.ema20 > data.indicators.ema50 ? "up" : "down") : ""}`}>
              {data
                ? data.indicators.ema20 > data.indicators.ema50
                  ? "▲ Naik"
                  : "▼ Turun"
                : "—"}
            </span>
            <span className="sig-tsub">
              {data ? `${fmtNum(data.indicators.ema20)} / ${fmtNum(data.indicators.ema50)}` : ""}
            </span>
          </div>

          <div className="sig-trow" title="Momentum: MACD(12,26,9) vs signal line">
            <span className="sig-tlabel">MACD</span>
            <span className={`sig-tval ${data ? (data.indicators.macd > data.indicators.macdSignal ? "up" : "down") : ""}`}>
              {data
                ? data.indicators.macd > data.indicators.macdSignal
                  ? "▲ Naik"
                  : "▼ Turun"
                : "—"}
            </span>
            <span className="sig-tsub">
              {data ? `hist ${fmtNum(data.indicators.macdHist)}` : ""}
            </span>
          </div>
        </div>

        {/* Alasan + sumber */}
        <div className="signal-foot">
          <span className="signal-reasons" title={data ? data.reasons.join(" · ") : ""}>
            <b>Alasan:</b> {data ? data.reasons.join(" · ") : "Memuat analisis…"}
          </span>
          <span className="signal-disc">
            {data
              ? `Sumber: ${data.source} · ${data.bars.toLocaleString("en-US")} bar · terakhir ${new Date(data.lastBar).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} WIB`
              : ""}
            {" "}· Bukan nasihat keuangan
          </span>
        </div>
      </div>
    </div>
  );
}
