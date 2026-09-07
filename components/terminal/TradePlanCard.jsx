// components/terminal/TradePlanCard.jsx
// Kartu SINYAL + TRADE PLAN — jantung halaman Terminal.
// Menampilkan verdict arah yang JELAS dan TERUKUR:
//   ENTRY · STOP LOSS · TP1/TP2/TP3 · Risk:Reward · jarak pip · dasar SL
//   + meter risiko berjenjang + strip confluence 7 timeframe + ringkasan indikator.
// Saat sinyal NETRAL → menampilkan BREAKOUT PLAN dua arah (buy-stop/sell-stop).

"use client";

import { fmtPrice, fmtPips, SIG, TF_SHORT } from "./fmt";

function DirBadge({ side }) {
  const s = SIG[side] || SIG.NETRAL;
  return (
    <span className={`tpl-dirbadge ${s.cls.replace("sig-", "dir-")}`}>
      {s.arrow} {side === "NETRAL" ? "NETRAL" : side}
    </span>
  );
}

// Baris level: tag + harga + jarak + RR
function LevelRow({ tag, cls, price, symbolId, base, rr, note }) {
  const dist = price != null && base != null ? Math.abs(price - base) : null;
  return (
    <div className={`tpl-row ${cls}`}>
      <span className={`tpl-tag ${cls}`}>{tag}</span>
      <div className="tpl-row-main">
        <span className="tpl-price">{fmtPrice(symbolId, price)}</span>
        {note && <span className="tpl-note">{note}</span>}
      </div>
      <span className="tpl-meta">
        {dist != null && <em>{fmtPips(symbolId, dist)}</em>}
        {rr != null && <b>RR {rr}</b>}
      </span>
    </div>
  );
}

// Meter risiko→reward berjenjang (lebar segmen proporsional nilai R)
function RiskMeter({ tps }) {
  const last = tps[tps.length - 1]?.rr || 4;
  const segs = [];
  let prev = 0;
  tps.forEach((tp, i) => {
    const w = Math.max(tp.rr - prev, 0.01);
    segs.push({ w, cls: `seg-tp${i + 1}`, label: tp.label, rr: tp.rr });
    prev = tp.rr;
  });
  const total = 1 + last; // 1R risiko + total reward
  return (
    <div className="tpl-meter" role="img" aria-label={`Risiko 1 berbanding reward hingga ${last}`}>
      <span className="tpl-meter-seg seg-sl" style={{ width: `${(1 / total) * 100}%` }} title="Risiko 1R (entry → SL)">SL</span>
      {segs.map((s) => (
        <span key={s.label} className={`tpl-meter-seg ${s.cls}`} style={{ width: `${(s.w / total) * 100}%` }} title={`${s.label} · RR ${s.rr}`}>
          {s.label}
        </span>
      ))}
    </div>
  );
}

// Strip confluence 7 timeframe
function ConfluenceStrip({ matrix, tf, onTf }) {
  if (!matrix?.length) return null;
  const bull = matrix.filter((m) => m.signal === "LONG").length;
  const bear = matrix.filter((m) => m.signal === "SHORT").length;
  const dom = bull > bear ? "BULLISH" : bear > bull ? "BEARISH" : "MIXED";
  return (
    <div className="mtf-wrap tpl-mtf">
      <div className="mtf-top">
        <span className="mtf-label">Confluence 7 Timeframe</span>
        <span className={`mtf-dom dom-${dom.toLowerCase()}`}>{dom} · {bull}B/{bear}S</span>
      </div>
      <div className="mtf-strip">
        {matrix.map((m) => (
          <button
            key={m.tf}
            type="button"
            onClick={() => onTf?.(m.tf)}
            className={`mtf-cell ${m.ok === false || !m.signal ? "err" : m.signal.toLowerCase()} ${m.tf === tf ? "active" : ""}`}
            title={`${(m.tf || "").toUpperCase()}: ${m.signal || "tanpa data"}${m.score != null ? ` · skor ${m.score > 0 ? "+" : ""}${m.score}` : ""} — klik untuk analisis TF ini`}
          >
            <b>{(TF_SHORT[m.tf] || m.tf).toUpperCase()}</b>
            <i className="mtf-dot" />
            <em>{m.signal === "LONG" ? "L" : m.signal === "SHORT" ? "S" : "N"}</em>
          </button>
        ))}
      </div>
      <p className="mtf-note">Klik sel timeframe untuk memindahkan seluruh analisis ke timeframe itu.</p>
    </div>
  );
}

function PlanNeutral({ plan, symbolId, price }) {
  const { buy, sell, range } = plan.neutral || {};
  if (!buy || !sell) return <p className="cell-muted">Range belum cukup jelas — belum ada breakout plan.</p>;
  const Side = ({ p, cls, label, ico, rangeEdge }) => (
    <div className={`tpl-side ${cls}`}>
      <div className="tpl-side-head">
        <span className="tpl-side-ico">{ico}</span>
        <div>
          <b>{label}</b>
          <small>{p.entryKind === "stop" ? "Pending stop order" : "Market"}</small>
        </div>
      </div>
      <div className="tpl-side-rows">
        <div><span>Entry stop</span><b>{fmtPrice(symbolId, p.entry)}</b></div>
        <div><span>SL {rangeEdge}</span><b>{fmtPrice(symbolId, p.sl)}</b><em>{p.riskPips} pip</em></div>
        {p.tps.map((tp) => (
          <div key={tp.label}><span>{tp.label}</span><b>{fmtPrice(symbolId, tp.price)}</b><em>RR {tp.rr}</em></div>
        ))}
      </div>
      <p className="tpl-side-note">{p.slBasis} · target TP2 = measured-move lebar range.</p>
    </div>
  );
  return (
    <div className="tpl-neutral">
      <div className="tpl-rangebox">
        <span className="tpl-range-lbl">RANGE AKTIF · 20 bar</span>
        <span className="tpl-range-hi">▲ {fmtPrice(symbolId, range?.hi)}</span>
        <span className="tpl-range-lo">▼ {fmtPrice(symbolId, range?.lo)}</span>
      </div>
      <div className="tpl-neutral-grid">
        <Side p={buy} cls="buy" label="BUY STOP" ico="▲" rangeEdge="(breakout gagal)" />
        <Side p={sell} cls="sell" label="SELL STOP" ico="▼" rangeEdge="(breakdown gagal)" />
      </div>
      <p className="cell-muted tpl-wait">
        Harga <b>{fmtPrice(symbolId, price)}</b> di dalam range — tunggu breakout terkonfirmasi (close di luar kotak)
        atau retest level sebelum entry.
      </p>
    </div>
  );
}

export default function TradePlanCard({ data, tf, onTf, loading }) {
  const symbolId = data?.symbol?.id || "gold";
  const sig = data?.signal;
  const plan = data?.plan;
  const side = sig?.signal || "NETRAL";
  const s = SIG[side] || SIG.NETRAL;
  const price = sig?.price ?? data?.smc?.price;
  const grade = data?.grade?.grade;
  const conf = data?.confluence;

  return (
    <div className={`signal-card tpl-card ${s.cls}`}>
      <header className="term-head">
        <h3 className="term-title">
          <span className="term-ico" aria-hidden="true">🎯</span>
          Sinyal &amp; Trade Plan <span className="term-sub">· {data?.symbol?.label || "—"} · {TF_SHORT[tf] || tf}</span>
        </h3>
        <span className="term-badge tpl-badges">
          {grade && <span className={`grade-chip grade-${grade}`} title={data.grade?.note || "Grade setup"}>{grade}</span>}
        </span>
      </header>

      <div className="signal-body">
        {/* 7 timeframe penuh */}
        <div className="signal-tf tpl-tfs" role="tablist" aria-label="Pilih timeframe sinyal">
          {["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w", "1mo"].map((t) => (
            <button key={t} role="tab" aria-selected={tf === t}
              className={`tf-pill ${tf === t ? "active" : ""}`} onClick={() => onTf(t)}>
              {TF_SHORT[t]}
            </button>
          ))}
        </div>

        {loading && !data ? (
          <div className="cell-muted tpl-loading">Menghitung sinyal, struktur &amp; level…</div>
        ) : (
          <>
            {/* Verdict */}
            <div className={`signal-verdict ${s.cls} tpl-verdict`}>
              <span className="signal-verdict-ico" aria-hidden="true">{s.arrow}</span>
              <div className="signal-verdict-text">
                <span className="signal-word">{s.text}</span>
                <span className="signal-sub">
                  {sig
                    ? `Skor ${sig.score > 0 ? "+" : ""}${sig.score} · kekuatan ${sig.strength} · ${conf?.label || ""}`
                    : data?.signalError || "Data belum cukup"}
                </span>
              </div>
              <DirBadge side={side} />
            </div>

            {/* Harga */}
            <div className="signal-price">
              <span className="sig-plabel">Harga terakhir</span>
              <span className="sig-pval">{fmtPrice(symbolId, price)}</span>
              {sig && (
                <span className={`sig-pct ${sig.changePct >= 0 ? "up" : "down"}`}>
                  {sig.changePct >= 0 ? "▲" : "▼"} {Math.abs(sig.changePct).toFixed(2)}%
                  <i>{sig.changeBasis || ""}</i>
                </span>
              )}
            </div>

            {/* Rencana terukur */}
            {plan?.mode === "directional" ? (
              <div className="tpl-plan">
                <div className="tpl-ladder">
                  {plan.tps && [...plan.tps].reverse().map((tp, i) => (
                    <LevelRow key={tp.label} tag={tp.label} cls={`tp${plan.tps.length - i}`}
                      price={tp.price} symbolId={symbolId} base={plan.entry} rr={tp.rr} note={tp.note} />
                  ))}
                  <div className="tpl-row entry">
                    <span className="tpl-tag entry">ENTRY</span>
                    <div className="tpl-row-main">
                      <span className="tpl-price">{fmtPrice(symbolId, plan.entry)}</span>
                      <span className="tpl-note">{plan.entryKind === "market" ? "Market execution" : "Pending"}</span>
                    </div>
                    <span className="tpl-meta"><em>harga sekarang</em></span>
                  </div>
                  <div className="tpl-row sl">
                    <span className="tpl-tag sl">SL</span>
                    <div className="tpl-row-main">
                      <span className="tpl-price">{fmtPrice(symbolId, plan.sl)}</span>
                      <span className="tpl-note">{plan.slBasis}</span>
                    </div>
                    <span className="tpl-meta"><em>{plan.riskPips} pip</em><b>1R</b></span>
                  </div>
                </div>
                {plan.tps?.length ? <RiskMeter tps={plan.tps} /> : null}
                <p className="tpl-basis">⛔ {plan.invalid} Risiko/trade disarankan ≤ 1–2% — hitung ukuran lot di halaman <a href="/calculators">Kalkulator</a>.</p>
              </div>
            ) : plan?.mode === "breakout" ? (
              <PlanNeutral plan={plan} symbolId={symbolId} price={price} />
            ) : (
              <p className="cell-muted">Trade plan belum tersedia untuk timeframe ini.</p>
            )}

            {/* Indikator ringkas */}
            {sig && (
              <div className="tpl-indicators" aria-label="Ringkasan indikator">
                <div className="tpl-ind" title="RSI(14): <30 jenuh jual, >70 jenuh beli">
                  <span>RSI 14</span>
                  <b className={sig.indicators.rsi >= 70 ? "down" : sig.indicators.rsi <= 30 ? "up" : ""}>{sig.indicators.rsi}</b>
                  <em>{sig.indicators.rsi >= 70 ? "jenuh beli" : sig.indicators.rsi <= 30 ? "jenuh jual" : "netral"}</em>
                </div>
                <div className="tpl-ind" title="EMA20 vs EMA50 = arah tren">
                  <span>EMA 20/50</span>
                  <b className={sig.indicators.ema20 > sig.indicators.ema50 ? "up" : "down"}>{sig.indicators.ema20 > sig.indicators.ema50 ? "▲ Tren naik" : "▼ Tren turun"}</b>
                  <em>{fmtPrice(symbolId, sig.indicators.ema20)} / {fmtPrice(symbolId, sig.indicators.ema50)}</em>
                </div>
                <div className="tpl-ind" title="MACD(12,26,9) vs signal line = momentum">
                  <span>MACD</span>
                  <b className={sig.indicators.macd > sig.indicators.macdSignal ? "up" : "down"}>{sig.indicators.macd > sig.indicators.macdSignal ? "▲ Naik" : "▼ Turun"}</b>
                  <em>hist {sig.indicators.macdHist}</em>
                </div>
                <div className="tpl-ind" title="ATR(14) = rata-rata jangkauan bar — dasar SL/TP">
                  <span>ATR 14</span>
                  <b>{fmtPrice(symbolId, sig.atr)}</b>
                  <em>{fmtPips(symbolId, sig.atr)}/bar</em>
                </div>
              </div>
            )}

            <ConfluenceStrip matrix={data?.matrix} tf={tf} onTf={onTf} />

            <div className="signal-foot">
              <span className="signal-reasons" title={sig ? sig.reasons.join(" · ") : ""}>
                <b>Alasan:</b> {sig ? sig.reasons.join(" · ") : "—"}
              </span>
              <span className="signal-disc">
                {sig ? `Sumber: ${sig.source} · ${sig.bars?.toLocaleString("en-US")} bar` : ""} · Edukasi, bukan nasihat keuangan
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
