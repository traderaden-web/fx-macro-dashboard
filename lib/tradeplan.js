// lib/tradeplan.js
// ═════════════════════════════════════════════════════════════════════════
// TRADE PLAN terukur: Entry · Stop Loss · Take Profit (TP1/TP2/TP3) · R:R
//
// Prinsip:
//  • Stop Loss berbasis STRUKTUR (swing low/high, Order Block, S/R terdekat)
//    dengan buffer ATR — bukan angka acak. Dibatasi min 0.6×ATR, max 2.2×ATR
//    agar realistis terhadap volatilitas.
//  • TP berjenjang kelipatan risiko (1.5R / 2.5R / 4R) dan "di-snap" ke level
//    resistensi/support terdekat bila berhimpit (confluence).
//  • Saat sinyal NETRAL → disiapkan BREAKOUT PLAN dua arah (buy-stop di atas
//    range, sell-stop di bawah range) lengkap dengan SL & target measured-move.
//
// Murni fungsi; input = hasil analyzeStructure (lib/smc.js).
// ═════════════════════════════════════════════════════════════════════════

const rnd = (v, p = 6) => (v == null || !isFinite(v) ? null : Number(v.toPrecision(p)));

/** Ukuran 1 pip per instrumen (untuk konversi jarak poin → pip). */
export const PIP_SIZE = {
  eurusd: 0.0001, gbpusd: 0.0001, audusd: 0.0001, nzdusd: 0.0001,
  usdcad: 0.0001, usdchf: 0.0001, usdjpy: 0.01,
  gold: 0.1, silver: 0.01, wti: 0.01, dxy: 0.01,
};

const TP_STEPS = [
  { label: "TP1", mult: 1.5, tag: "konservatif — amankan sebagian" },
  { label: "TP2", mult: 2.5, tag: "target utama" },
  { label: "TP3", mult: 4, tag: "runner — trailing stop" },
];

/**
 * Bangun trade plan dari hasil analisis struktur.
 * @param {string} symbolId  id instrumen (untuk ukuran pip)
 * @param {"LONG"|"SHORT"|"NETRAL"} dir arah sinyal teknikal
 * @param {number} price harga terakhir
 * @param {number} atr ATR(14) timeframe aktif
 * @param {object} ta  hasil analyzeStructure()
 */
export function buildTradePlan({ symbolId, dir, price, atr, ta }) {
  if (!price || !ta) return null;
  const A = atr && atr > 0 ? atr : price * 0.0015;
  const pip = PIP_SIZE[symbolId] || 0.0001;

  // ── Koleksi level struktur di atas / bawah harga ──────────────────────
  const src = { support: [], resistance: [] };
  for (const s of ta.snr?.supports || []) src.support.push({ v: s.price, n: `Support ${s.key}` });
  for (const r of ta.snr?.resistances || []) src.resistance.push({ v: r.price, n: `Resistance ${r.key}` });
  if (ta.structure?.lastSwingLow) src.support.push({ v: ta.structure.lastSwingLow, n: "Swing Low terakhir" });
  if (ta.structure?.lastSwingHigh) src.resistance.push({ v: ta.structure.lastSwingHigh, n: "Swing High terakhir" });
  for (const ob of ta.orderBlocks || []) {
    if (ob.side === "bullish") src.support.push({ v: ob.bottom, n: "Order Block bullish" });
    else src.resistance.push({ v: ob.top, n: "Order Block bearish" });
  }
  for (const g of ta.fvgs || []) {
    if (g.side === "bullish") src.support.push({ v: g.bottom, n: "FVG bullish" });
    else src.resistance.push({ v: g.top, n: "FVG bearish" });
  }
  const below = src.support.filter((x) => x.v < price).sort((a, b) => b.v - a.v);
  const above = src.resistance.filter((x) => x.v > price).sort((a, b) => a.v - b.v);

  const nearest = (list, minDist, side) => list.find((x) => Math.abs(x.v - price) >= minDist) || null;

  /** Plan satu arah (LONG/SHORT) berbasis market entry. */
  const directional = (side) => {
    const long = side === "LONG";
    // 1) SL di balik struktur terdekat (buffer 0.3×ATR di luar level)
    const anchor = nearest(long ? below : above, 0.25 * A);
    let sl, slBasis;
    if (anchor) {
      sl = long ? anchor.v - 0.3 * A : anchor.v + 0.3 * A;
      slBasis = `Di balik ${anchor.n} (${fmtL(anchor.v)}) + buffer 0.3×ATR`;
    } else {
      sl = long ? price - 1.15 * A : price + 1.15 * A;
      slBasis = "Fallback volatilitas 1.15×ATR (struktur terlalu jauh)";
    }
    // 2) Batas risiko: 0.6×ATR .. 2.2×ATR
    let risk = long ? price - sl : sl - price;
    if (risk < 0.6 * A) { sl = long ? price - 0.85 * A : price + 0.85 * A; risk = long ? price - sl : sl - price; slBasis = "Risiko minimum 0.85×ATR — SL terlalu ketat terhadap noise"; }
    if (risk > 2.2 * A) { sl = long ? price - 2.2 * A : price + 2.2 * A; risk = 2.2 * A; slBasis = "Risiko dibatasi 2.2×ATR — struktur terlalu jauh untuk intraday"; }

    // 3) TP berjenjang, snap ke level struktur bila berhimpit
    const counterLevels = long ? above : below; // target searah trade
    const tps = TP_STEPS.map((step) => {
      let tp = long ? price + step.mult * risk : price - step.mult * risk;
      let note = step.tag;
      const snap = counterLevels.find((x) => Math.abs(x.v - tp) <= 0.3 * risk);
      if (snap) { tp = snap.v; note = `${step.tag} · berhimpit ${snap.n}`; }
      const rr = Math.abs(tp - price) / risk;
      return { label: step.label, price: rnd(tp), rr: Math.round(rr * 10) / 10, pips: Math.round((Math.abs(tp - price) / pip) * 10) / 10, note };
    });

    return {
      side,
      entryKind: "market",
      entry: rnd(price),
      sl: rnd(sl),
      slBasis,
      riskPts: rnd(risk),
      riskPips: Math.round((risk / pip) * 10) / 10,
      atrUsed: rnd(A),
      tps,
      invalid: long
        ? "Setup batal bila harga close di bawah SL / muncul CHoCH bearish."
        : "Setup batal bila harga close di atas SL / muncul CHoCH bullish.",
    };
  };

  // ── NETRAL → breakout plan dua arah dari kotak range ──────────────────
  const neutralPlans = () => {
    const rg = ta.range || {};
    if (rg.hi == null || rg.lo == null || !rg.width) return null;
    const w = rg.width;
    const mk = (upSide) => {
      const entry = upSide ? rg.hi + 0.12 * A : rg.lo - 0.12 * A;
      let sl = upSide ? rg.hi - 0.45 * w : rg.lo + 0.45 * w;
      let risk = Math.abs(entry - sl);
      if (risk < 0.8 * A) { sl = upSide ? entry - 1.1 * A : entry + 1.1 * A; risk = 1.1 * A; }
      const measured = upSide ? entry + w : entry - w; // target measured-move
      return {
        side: upSide ? "LONG" : "SHORT",
        entryKind: "stop",
        entry: rnd(entry),
        sl: rnd(sl),
        slBasis: upSide ? "Kembali masuk range — breakout gagal" : "Kembali masuk range — breakdown gagal",
        riskPts: rnd(risk),
        riskPips: Math.round((risk / pip) * 10) / 10,
        tps: [
          { label: "TP1", price: rnd(upSide ? entry + 1.2 * risk : entry - 1.2 * risk), rr: 1.2, pips: Math.round(((1.2 * risk) / pip) * 10) / 10, note: "konservatif" },
          { label: "TP2", price: rnd(measured), rr: Math.round((w / risk) * 10) / 10, pips: Math.round((w / pip) * 10) / 10, note: "measured move = lebar range" },
        ],
      };
    };
    return { buy: mk(true), sell: mk(false), range: { hi: rg.hi, lo: rg.lo, width: rg.width } };
  };

  if (dir === "LONG" || dir === "SHORT") return { mode: "directional", ...directional(dir) };
  return { mode: "breakout", dir: "NETRAL", atrUsed: rnd(A), neutral: neutralPlans() };
}

function fmtL(v) {
  return v == null ? "—" : String(Number(v.toPrecision(6)));
}
