// lib/smc.js
// Deteksi struktur Smart Money Concepts dari bar OHLC:
// swing, BOS/CHOCH, Fair Value Gap, Order Block.

export function detectSmc(ohlc = []) {
  const n = ohlc.length;
  if (n < 8) return { swings: [], bos: [], fvg: [], orderBlocks: [], bias: "NETRAL" };

  const swings = [];
  const k = 2;
  for (let i = k; i < n - k; i++) {
    const h = ohlc[i].h;
    const l = ohlc[i].l;
    let isHigh = true;
    let isLow = true;
    for (let j = i - k; j <= i + k; j++) {
      if (j === i) continue;
      if (ohlc[j].h >= h) isHigh = false;
      if (ohlc[j].l <= l) isLow = false;
    }
    if (isHigh) swings.push({ i, type: "H", price: h });
    else if (isLow) swings.push({ i, type: "L", price: l });
  }

  const bos = [];
  let lastH = null;
  let lastL = null;
  let trend = 0;
  for (const s of swings) {
    if (s.type === "H") {
      if (lastH && s.price > lastH.price) {
        bos.push({ i: s.i, type: trend < 0 ? "CHOCH" : "BOS", dir: "UP", price: s.price });
        trend = 1;
      }
      lastH = s;
    } else {
      if (lastL && s.price < lastL.price) {
        bos.push({ i: s.i, type: trend > 0 ? "CHOCH" : "BOS", dir: "DOWN", price: s.price });
        trend = -1;
      }
      lastL = s;
    }
  }

  const fvg = [];
  for (let i = 2; i < n; i++) {
    const a = ohlc[i - 2];
    const c = ohlc[i];
    if (a.h < c.l) {
      fvg.push({ i0: i - 2, i1: i, top: c.l, bot: a.h, dir: "UP" });
    } else if (a.l > c.h) {
      fvg.push({ i0: i - 2, i1: i, top: a.l, bot: c.h, dir: "DOWN" });
    }
  }

  const orderBlocks = [];
  for (let i = 3; i < n; i++) {
    const impulse = ohlc[i];
    const prev = ohlc[i - 1];
    const body = Math.abs(impulse.c - impulse.o);
    const rng = impulse.h - impulse.l || 1e-9;
    if (body / rng < 0.55) continue;
    if (impulse.c > impulse.o && prev.c < prev.o) {
      orderBlocks.push({ i: i - 1, top: prev.h, bot: prev.l, dir: "UP" });
    } else if (impulse.c < impulse.o && prev.c > prev.o) {
      orderBlocks.push({ i: i - 1, top: prev.h, bot: prev.l, dir: "DOWN" });
    }
  }

  const bias = trend > 0 ? "BULLISH" : trend < 0 ? "BEARISH" : "NETRAL";
  return {
    swings: swings.slice(-12),
    bos: bos.slice(-8),
    fvg: fvg.slice(-6),
    orderBlocks: orderBlocks.slice(-5),
    bias,
  };
}

export function tradeLevels({ signal, price, atr }) {
  if (price == null || atr == null) return { entry: price ?? null, tp: null, sl: null };
  const TP = 1.5;
  const SL = 1;
  if (signal === "LONG") return { entry: price, tp: price + TP * atr, sl: price - SL * atr };
  if (signal === "SHORT") return { entry: price, tp: price - TP * atr, sl: price + SL * atr };
  return { entry: price, tp: null, sl: null };
}
