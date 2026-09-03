// components/CalculatorClient.jsx
// "Trader Toolkit" — kalkulator untuk ritel trader FX:
//   1) Position Size (risiko)   2) Pip Value   3) Profit/Loss
//   4) Pivot Points (klasik)    5) Fibonacci  6) Lot vs Unit
// Semua dihitung real-time di client. Nilai pip memakai konvensi standar
// (1 lot FX = 100.000 unit; gold = 100 oz; silver = 5.000 oz) dan dikonversi
// ke USD memakai kurs pasar kira-kira. Bisa di-edit manual bila perlu.

"use client";

import { useMemo, useState } from "react";

const PAIRS = {
  "EUR/USD": { pip: 0.0001, lot: 100000, quoteToUsd: 1, label: "Euro / Dolar AS" },
  "GBP/USD": { pip: 0.0001, lot: 100000, quoteToUsd: 1, label: "Pound / Dolar AS" },
  "USD/JPY": { pip: 0.01, lot: 100000, quoteToUsd: 1 / 157.42, label: "Dolar AS / Yen Jepang" },
  "USD/CHF": { pip: 0.0001, lot: 100000, quoteToUsd: 1 / 0.9108, label: "Dolar AS / Franc Swiss" },
  "AUD/USD": { pip: 0.0001, lot: 100000, quoteToUsd: 1, label: "Dolar AU / Dolar AS" },
  "USD/CAD": { pip: 0.0001, lot: 100000, quoteToUsd: 1 / 1.3601, label: "Dolar AS / Dolar Kanada" },
  "NZD/USD": { pip: 0.0001, lot: 100000, quoteToUsd: 1, label: "Dolar NZ / Dolar AS" },
  "EUR/GBP": { pip: 0.0001, lot: 100000, quoteToUsd: 1.2784, label: "Euro / Pound Inggris" },
  "EUR/JPY": { pip: 0.01, lot: 100000, quoteToUsd: 1 / 157.42, label: "Euro / Yen Jepang" },
  "GBP/JPY": { pip: 0.01, lot: 100000, quoteToUsd: 1 / 157.42, label: "Pound / Yen Jepang" },
  "XAU/USD": { pip: 0.1, lot: 100, quoteToUsd: 1, label: "Emas (per oz)" },
  "XAG/USD": { pip: 0.01, lot: 5000, quoteToUsd: 1, label: "Perak (per oz)" },
};

function num(v, d = 2) {
  if (v == null || Number.isNaN(v)) return "—";
  return Number(v).toLocaleString("id-ID", { maximumFractionDigits: d });
}
function fmtPrice(v) {
  if (v == null || Number.isNaN(v)) return "—";
  return v >= 1000 ? v.toLocaleString("id-ID", { maximumFractionDigits: 2 }) : v.toFixed(5).replace(/0+$/, "").replace(/\.$/, "");
}

export default function CalculatorClient() {
  const [tab, setTab] = useState("possize");
  const TABS = [
    { id: "possize", label: "Position Size" },
    { id: "pipvalue", label: "Pip Value" },
    { id: "pnl", label: "Profit/Loss" },
    { id: "pivot", label: "Pivot Points" },
    { id: "fib", label: "Fibonacci" },
    { id: "lot", label: "Lot vs Unit" },
  ];

  return (
    <div className="calc">
      <div className="calc-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} className={`calc-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)} role="tab">
            {t.label}
          </button>
        ))}
      </div>
      <div className="calc-body">
        {tab === "possize" && <PositionSize />}
        {tab === "pipvalue" && <PipValue />}
        {tab === "pnl" && <ProfitLoss />}
        {tab === "pivot" && <Pivots />}
        {tab === "fib" && <Fibonacci />}
        {tab === "lot" && <LotSize />}
      </div>
    </div>
  );
}

function PairField({ value, onChange }) {
  return (
    <label className="field">
      <span className="field-label">Pasangan</span>
      <div className="field-input">
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {Object.entries(PAIRS).map(([k, v]) => (
            <option key={k} value={k}>{k} — {v.label}</option>
          ))}
        </select>
      </div>
    </label>
  );
}

function Field({ label, value, onChange, type = "number", step, suffix, hint }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <div className="field-input">
        <input
          type={type}
          value={value}
          step={step}
          onChange={(e) => onChange(e.target.value)}
          inputMode={type === "number" ? "decimal" : undefined}
        />
        {suffix && <span className="field-suffix">{suffix}</span>}
      </div>
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

function ResultRow({ k, v, accent }) {
  return (
    <div className="res-row">
      <span className="res-k">{k}</span>
      <span className={`res-v mono ${accent ? "res-accent" : ""}`}>{v}</span>
    </div>
  );
}

// ── 1) Position Size ──────────────────────────────────────────────────
function PositionSize() {
  const [pair, setPair] = useState("EUR/USD");
  const [balance, setBalance] = useState("10000");
  const [risk, setRisk] = useState("1");
  const [stop, setStop] = useState("30");
  const cfg = PAIRS[pair];

  const r = useMemo(() => {
    const bal = Number(balance), rp = Number(risk), sp = Number(stop);
    if (!bal || !rp || !sp) return null;
    const riskAmount = (bal * rp) / 100;
    const pipValue = cfg.pip * cfg.lot * cfg.quoteToUsd; // USD per pip per lot
    const lots = riskAmount / (sp * pipValue);
    return { riskAmount, pipValue, lots, units: lots * cfg.lot };
  }, [balance, risk, stop, pair, cfg]);

  return (
    <div className="calc-grid">
      <div className="calc-inputs">
        <PairField value={pair} onChange={setPair} />
        <Field label="Saldo Akun (USD)" value={balance} onChange={setBalance} suffix="USD" />
        <Field label="Risiko per Trade" value={risk} onChange={setRisk} step="0.1" suffix="%" />
        <Field label="Stop Loss (pips)" value={stop} onChange={setStop} suffix="pips" />
      </div>
      <div className="calc-result">
        <h4>Hasil {pair}</h4>
        <ResultRow k="Jumlah risiko" v={`$${num(r?.riskAmount, 2)}`} accent />
        <ResultRow k="Pip value / lot" v={`$${num(r?.pipValue, 2)}`} />
        <ResultRow k="Ukuran posisi" v={`${num(r?.lots, 2)} lot`} accent />
        <ResultRow k="Unit" v={`${num(r?.units, 0)} unit`} />
        <p className="calc-note">
          Rumus: <code>lot = (saldo × risiko%) ÷ (stop pips × pip value)</code>. Jangan
          mempertaruhkan lebih dari 1–2% per trade.
        </p>
      </div>
    </div>
  );
}

// ── 2) Pip Value ─────────────────────────────────────────────────────
function PipValue() {
  const [pair, setPair] = useState("EUR/USD");
  const [lots, setLots] = useState("1");
  const cfg = PAIRS[pair];
  const pipValue = cfg.pip * cfg.lot * cfg.quoteToUsd;
  const val = pipValue * Number(lots || 0);
  return (
    <div className="calc-grid">
      <div className="calc-inputs">
        <PairField value={pair} onChange={setPair} />
        <Field label="Ukuran (lot)" value={lots} onChange={setLots} step="0.01" suffix="lot" />
      </div>
      <div className="calc-result">
        <h4>Nilai pip {pair}</h4>
        <ResultRow k="Pip per lot (USD)" v={`$${num(pipValue, 2)}`} accent />
        <ResultRow k="Total nilai pip" v={`$${num(val, 2)}`} />
        <p className="calc-note">Nilai pip dikonversi ke USD memakai kurs pasar. Untuk akun non-USD sesuaikan.</p>
      </div>
    </div>
  );
}

// ── 3) Profit/Loss ───────────────────────────────────────────────────
function ProfitLoss() {
  const [pair, setPair] = useState("EUR/USD");
  const [entry, setEntry] = useState("1.08620");
  const [exit, setExit] = useState("1.09020");
  const [lots, setLots] = useState("1");
  const cfg = PAIRS[pair];
  const e = Number(entry), x = Number(exit), l = Number(lots || 0);

  const r = useMemo(() => {
    if (!e || !x) return null;
    const dir = x > e ? "long" : x < e ? "short" : "flat";
    const pips = Math.abs((x - e) / cfg.pip);
    // Nilai per pip per lot (USD), arah sesuai posisi.
    const perPipUsd = cfg.pip * cfg.lot * cfg.quoteToUsd;
    const usd = ((x - e) / cfg.pip) * perPipUsd * l;
    return { dir, pips, usd, perPipUsd };
  }, [e, x, l, cfg]);

  return (
    <div className="calc-grid">
      <div className="calc-inputs">
        <PairField value={pair} onChange={setPair} />
        <Field label="Entry" value={entry} onChange={setEntry} type="text" />
        <Field label="Exit / Target" value={exit} onChange={setExit} type="text" />
        <Field label="Ukuran (lot)" value={lots} onChange={setLots} step="0.01" suffix="lot" />
      </div>
      <div className="calc-result">
        <h4>Hasil {pair}</h4>
        <ResultRow k="Arah" v={r?.dir === "long" ? "LONG (Beli)" : r?.dir === "short" ? "SHORT (Jual)" : "—"} accent />
        <ResultRow k="Pergerakan" v={`${num(r?.pips, 1)} pips`} />
        <ResultRow
          k="Profit / Loss (USD)"
          v={`${r ? (r.usd >= 0 ? "+" : "") + "$" + num(Math.abs(r.usd), 2) : "—"}`}
          accent
        />
        <p className="calc-note">
          <b>BUY</b> untung bila harga naik · <b>SELL</b> untung bila harga turun.
        </p>
      </div>
    </div>
  );
}

// ── 4) Pivot Points ──────────────────────────────────────────────────
function Pivots() {
  const [high, setHigh] = useState("1.0950");
  const [low, setLow] = useState("1.0780");
  const [close, setClose] = useState("1.0862");
  const h = Number(high), lo = Number(low), c = Number(close);

  const r = useMemo(() => {
    if (!h || !lo || !c) return null;
    const p = (h + lo + c) / 3;
    return {
      p,
      r1: 2 * p - lo, s1: 2 * p - h,
      r2: p + (h - lo), s2: p - (h - lo),
      r3: h + 2 * (p - lo), s3: lo - 2 * (h - p),
      fib: {
        "38.2%": p + (h - lo) * 0.382, "50%": p + (h - lo) * 0.5, "61.8%": p + (h - lo) * 0.618,
      },
    };
  }, [h, lo, c]);

  if (!r) return <div className="calc-note">Isi High, Low &amp; Close (periode sebelumnya).</div>;
  const levels = [
    ["R3", r.r3], ["R2", r.r2], ["R1", r.r1], ["PIVOT", r.p], ["S1", r.s1], ["S2", r.s2], ["S3", r.s3],
  ];
  return (
    <div className="calc-grid">
      <div className="calc-inputs">
        <Field label="High (periode lalu)" value={high} onChange={setHigh} type="text" />
        <Field label="Low (periode lalu)" value={low} onChange={setLow} type="text" />
        <Field label="Close (periode lalu)" value={close} onChange={setClose} type="text" />
      </div>
      <div className="calc-result">
        <h4>Level Klasik</h4>
        <div className="pivot-list">
          {levels.map(([k, v]) => (
            <div className={`pivot ${k === "PIVOT" ? "piv" : k.startsWith("R") ? "res" : "sup"}`} key={k}>
              <span className="pivot-k">{k}</span>
              <span className="pivot-v mono">{fmtPrice(v)}</span>
            </div>
          ))}
        </div>
        <div className="pivot-fib">
          <span className="cell-muted">Pivot Fibonacci:</span>
          {Object.entries(r.fib).map(([k, v]) => (
            <span key={k} className="pivot mono" style={{ marginRight: 10 }}>{k}: {fmtPrice(v)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 5) Fibonacci ─────────────────────────────────────────────────────
function Fibonacci() {
  const [high, setHigh] = useState("1.1000");
  const [low, setLow] = useState("1.0800");
  const h = Number(high), lo = Number(low);
  const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  if (!h || !lo) return <div className="calc-note">Isi High &amp; Low swing.</div>;
  const range = h - lo;
  return (
    <div className="calc-grid">
      <div className="calc-inputs">
        <Field label="High swing" value={high} onChange={setHigh} type="text" />
        <Field label="Low swing" value={low} onChange={setLow} type="text" />
      </div>
      <div className="calc-result">
        <h4>Retracement (pullback)</h4>
        <div className="pivot-list">
          {levels.map((lv) => {
            const price = high - range * lv;
            return (
              <div className="pivot fib" key={lv}>
                <span className="pivot-k">{(lv * 100).toFixed(1)}%</span>
                <span className="pivot-v mono">{fmtPrice(price)}</span>
              </div>
            );
          })}
        </div>
        <p className="calc-note">Level 0.382–0.618 adalah zona pullback paling sering dihormati pasar.</p>
      </div>
    </div>
  );
}

// ── 6) Lot vs Unit ───────────────────────────────────────────────────
function LotSize() {
  const [lots, setLots] = useState("1");
  const l = Number(lots || 0);
  return (
    <div className="calc-grid">
      <div className="calc-inputs">
        <Field label="Ukuran (lot)" value={lots} onChange={setLots} step="0.01" suffix="lot" />
      </div>
      <div className="calc-result">
        <h4>Konversi Lot → Unit</h4>
        <div className="lot-bars">
          <div className="lot-bar"><span>Micro (0.01 lot) = {num(l * 1000, 0)} unit</span></div>
          <div className="lot-bar"><span>Mini (0.10 lot) = {num(l * 10000, 0)} unit</span></div>
          <div className="lot-bar accent"><span>Standard (1.00 lot) = {num(l * 100000, 0)} unit</span></div>
        </div>
        <p className="calc-note">1 lot standar FX = 100.000 unit mata uang dasar.</p>
      </div>
    </div>
  );
}
