// components/SignalPanel.jsx
// Card sinyal Long/Short (Beli/Jual) per timeframe — data dihitung server-side
// (EMA 20/50, RSI 14, MACD 12,26,9) dari harga riil Yahoo Finance.
// Isi card: TF pills · verdict · harga · mini-chart interaktif (harga+EMA,
// hover = crosshair & tooltip) · tabel indikator · confluence multi-timeframe.

"use client";

import { useEffect, useMemo, useState } from "react";

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

// ── Mini chart interaktif (SVG): harga + EMA20 + EMA50, hover = crosshair ──
const CW = 340;
const CH = 132;
const CPAD = 8;

function MiniChart({ series, price }) {
  const [hover, setHover] = useState(null); // index bar yang di-hover

  const { pts, min, max } = useMemo(() => {
    if (!series) return { pts: null, min: 0, max: 1 };
    const { closes, ema20, ema50 } = series;
    const all = closes.concat(ema20.filter((v) => v != null), ema50.filter((v) => v != null));
    const mn = Math.min(...all);
    const mx = Math.max(...all);
    const span = mx - mn || mx * 0.001 || 1;
    const n = closes.length;
    const X = (i) => CPAD + (i / (n - 1)) * (CW - CPAD * 2);
    const Y = (v) => CH - CPAD - ((v - mn) / span) * (CH - CPAD * 2);
    const line = (arr) =>
      arr
        .map((v, i) => (v == null ? null : `${X(i).toFixed(1)},${Y(v).toFixed(1)}`))
        .filter(Boolean)
        .join(" ");
    return {
      pts: {
        n,
        X,
        Y,
        priceLine: line(closes),
        ema20Line: line(ema20),
        ema50Line: line(ema50),
        area: `M ${CPAD},${CH - CPAD} L ${line(closes).split(" ").join(" L ")} L ${X(n - 1).toFixed(1)},${CH - CPAD} Z`,
        last: { x: X(n - 1), y: Y(closes[n - 1]) },
      },
      min: mn,
      max: mx,
    };
  }, [series]);

  if (!series || !pts) {
    return (
      <div className="sig-chart-wrap">
        <div className="sig-chart-loading">Memuat mini-chart…</div>
      </div>
    );
  }

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * CW;
    let i = Math.round(((px - CPAD) / (CW - CPAD * 2)) * (pts.n - 1));
    i = Math.max(0, Math.min(pts.n - 1, i));
    setHover(i);
  };

  const hv = hover != null ? { x: pts.X(hover), y: pts.Y(series.closes[hover]) } : null;
  const hvPct = hover != null ? (hv.x / CW) * 100 : 0;

  return (
    <div className="sig-chart-wrap">
      <div className="sig-chart" style={{ position: "relative" }}>
        <svg
          viewBox={`0 0 ${CW} ${CH}`}
          preserveAspectRatio="none"
          className="sig-chart-svg"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          role="img"
          aria-label={`Grafik harga ${fmtPrice(price)} dengan EMA 20 dan 50`}
        >
          <defs>
            <linearGradient id="sigArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(240,180,41,0.20)" />
              <stop offset="100%" stopColor="rgba(240,180,41,0)" />
            </linearGradient>
          </defs>
          <path d={pts.area} fill="url(#sigArea)" stroke="none" />
          <polyline points={pts.ema50Line} fill="none" stroke="#7c8698" strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
          <polyline points={pts.ema20Line} fill="none" stroke="#2dd4bf" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          <polyline points={pts.priceLine} fill="none" stroke="var(--accent)" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
          <circle cx={pts.last.x} cy={pts.last.y} r="2.6" fill="var(--accent)" vectorEffect="non-scaling-stroke" />
          {hv && (
            <g>
              <line x1={hv.x} y1={CPAD} x2={hv.x} y2={CH - CPAD} stroke="rgba(232,236,243,0.35)" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
              <circle cx={hv.x} cy={hv.y} r="3.2" fill="var(--text)" />
            </g>
          )}
        </svg>
        {hover != null && (
          <div
            className="sig-chart-tip"
            style={{
              left: `${Math.max(8, Math.min(92, hvPct))}%`,
              transform: `translateX(${hvPct > 78 ? "-105%" : hvPct < 22 ? "5%" : "-50%"})`,
            }}
          >
            <b>{fmtPrice(series.closes[hover])}</b>
            <span>
              {hover === pts.n - 1 ? "terakhir" : `${pts.n - 1 - hover} bar lalu`}
              {series.ema20[hover] != null ? ` · EMA20 ${fmtNum(series.ema20[hover])}` : ""}
            </span>
          </div>
        )}
      </div>
      <div className="sig-chart-legend">
        <span><i className="lg lg-price" /> Harga</span>
        <span><i className="lg lg-ema20" /> EMA 20</span>
        <span><i className="lg lg-ema50" /> EMA 50</span>
        <span className="sig-chart-range">
          {fmtPrice(min)} – {fmtPrice(max)}
        </span>
      </div>
    </div>
  );
}

// ── Strip confluence multi-timeframe ────────────────────────────────────
function MTFStrip({ symbolId }) {
  const [m, setM] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    setM(null);
    setErr(null);
    fetch(`/api/signal/matrix?symbol=${symbolId}`)
      .then((r) => r.json().then((j) => ({ status: r.status, j })))
      .then(({ status, j }) => {
        if (!alive) return;
        if (status === 200 && j.ok) setM(j);
        else setErr(j?.error || "Gagal mengambil data");
      })
      .catch(() => alive && setErr("Gagal terhubung ke server"));
    return () => {
      alive = false;
    };
  }, [symbolId]);

  const bull = m ? m.tfs.filter((t) => t.ok && t.signal === "LONG").length : 0;
  const bear = m ? m.tfs.filter((t) => t.ok && t.signal === "SHORT").length : 0;
  const dom = !m ? null : bull > bear ? "BULLISH" : bear > bull ? "BEARISH" : "MIXED";

  if (err) return <div className="mtf-wrap"><span className="mtf-note">{err}</span></div>;

  return (
    <div className="mtf-wrap">
      <div className="mtf-top">
        <span className="mtf-label">Multi-Timeframe</span>
        <span className={`mtf-dom ${dom ? `dom-${dom.toLowerCase()}` : ""}`}>
          {m ? `${dom} · ${bull}B/${bear}S` : "memuat…"}
        </span>
      </div>
      <div className="mtf-strip">
        {(m?.tfs || []).map((t) =>
          t.ok ? (
            <span key={t.tf} className={`mtf-cell ${t.signal.toLowerCase()}`} title={`Skor ${t.score > 0 ? "+" : ""}${t.score}`}>
              <b>{t.tf.toUpperCase()}</b>
              <i className="mtf-dot" />
              <em>{t.signal === "LONG" ? "L" : t.signal === "SHORT" ? "S" : "N"}</em>
            </span>
          ) : (
            <span key={t.tf} className="mtf-cell err">
              <b>{t.tf.toUpperCase()}</b>
              <i className="mtf-dot" />
              <em>—</em>
            </span>
          )
        )}
      </div>
      {m && (
        <p className="mtf-note">
          {bull} bullish · {bear} bearis · {7 - bull - bear} netral — {m.tfs.filter((t) => t.ok).length}/7 timeframe
        </p>
      )}
    </div>
  );
}

// ── Card utama ──────────────────────────────────────────────────────────
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

        {/* Mini chart interaktif — mengisi ruang di desktop */}
        <MiniChart series={data?.series} price={data?.price} />

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

        {/* Confluence multi-timeframe */}
        <MTFStrip symbolId={symbol.id} />

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
