// lib/smc.js
// ═════════════════════════════════════════════════════════════════════════
// Mesin analisis struktur pasar untuk Terminal Teknikal:
//   • SMC  — Break of Structure (BOS), Change of Character (CHoCH),
//            Order Block (OB), Fair Value Gap (FVG/imbalance), liquidity sweep
//   • ICT  — Premium/Discount zone, equilibrium, Optimal Trade Entry (OTE),
//            liquidity pool (equal highs/lows)
//   • SNR  — Support & Resistance klasik dari klaster swing point
//   • Range & Breakout — kotak range N bar, status breakout + retest
//   • Chart Pattern klasik — Double Top/Bottom, Head & Shoulders (+inverse),
//            Ascending/Descending/Symmetrical Triangle, Rising/Falling Wedge,
//            Bull/Bear Flag (bullish & bearish dua-duanya)
//
// Semua fungsi murni berbasis bar OHLC { t, o, h, l, c } sehingga bisa diuji
// dan dipakai di server route. Level harga dibulatkan 6 signifikan.
// ═════════════════════════════════════════════════════════════════════════

const rnd = (v, p = 6) => (v == null || !isFinite(v) ? null : Number(v.toPrecision(p)));
const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

// ── ATR sederhana (rata-rata True Range 14 bar terakhir) ────────────────
export function atrSimple(bars, period = 14) {
  if (!bars || bars.length < period + 1) return null;
  const trs = [];
  for (let i = bars.length - period; i < bars.length; i++) {
    trs.push(Math.max(
      bars[i].h - bars[i].l,
      Math.abs(bars[i].h - bars[i - 1].c),
      Math.abs(bars[i].l - bars[i - 1].c)
    ));
  }
  return avg(trs);
}

// ── Swing points (pivot high/low) ───────────────────────────────────────
// Menggunakan perbandingan STRICT (>, <): tetangga dengan harga sama persis
// tidak membatalkan pivot — penting untuk puncak/lembah datar dan tren kuat.
export function swingPoints(bars, left = 3, right = 3) {
  const pts = [];
  for (let i = left; i < bars.length - right; i++) {
    const b = bars[i];
    let hi = true, lo = true;
    for (let j = i - left; j <= i + right; j++) {
      if (j === i) continue;
      if (bars[j].h > b.h) hi = false;
      if (bars[j].l < b.l) lo = false;
      if (!hi && !lo) break;
    }
    if (hi) pts.push({ i, t: b.t, price: b.h, type: "H" });
    else if (lo) pts.push({ i, t: b.t, price: b.l, type: "L" });
  }
  return pts;
}

/** Swing dengan fallback: (l,r) → (2,2) → (1,1) bila data sangat monotonik
 *  agar analisis tetap punya titik kerja pada tren tanpa pullback. */
function swingPointsFallback(bars, left = 3, right = 3) {
  let pts = swingPoints(bars, left, right);
  if (pts.length < 2) pts = swingPoints(bars, 2, 2);
  if (pts.length < 2) pts = swingPoints(bars, 1, 1);
  return pts;
}

// Paksa urutan bergantian H-L-H-L (duplikat arah → simpan yang paling ekstrem)
function alternating(pts) {
  const out = [];
  for (const p of pts) {
    const last = out[out.length - 1];
    if (!last || last.type !== p.type) out.push(p);
    else if (p.type === "H" ? p.price >= last.price : p.price <= last.price) {
      out[out.length - 1] = p;
    }
  }
  return out;
}

// ═════════════════════════════════════════════════════════════════════════
// 1) MARKET STRUCTURE — tren + event BOS / CHoCH
// ═════════════════════════════════════════════════════════════════════════
export function marketStructure(bars, { left = 3, right = 3 } = {}) {
  const raw = swingPointsFallback(bars, left, right);
  const sw = alternating(raw);
  const pivotByIdx = new Map(raw.map((p) => [p.i, p]));

  const events = [];
  let dir = 0; // 1 bullish, -1 bearish, 0 belum terdefinisi
  let hi = null; // swing high aktif menunggu ditembus
  let lo = null; // swing low aktif menunggu ditembus

  for (let i = right; i < bars.length; i++) {
    const p = pivotByIdx.get(i - right);
    if (p) { if (p.type === "H") hi = p; else lo = p; }
    const c = bars[i].c;
    if (hi && c > hi.price) {
      events.push({ i, t: bars[i].t, type: dir === -1 ? "CHoCH" : "BOS", dir: "bullish", level: rnd(hi.price) });
      dir = 1;
      hi = null;
    }
    if (lo && c < lo.price) {
      events.push({ i, t: bars[i].t, type: dir === 1 ? "CHoCH" : "BOS", dir: "bearish", level: rnd(lo.price) });
      dir = -1;
      lo = null;
    }
  }

  // Bias cadangan dari pola 4 swing terakhir (HH/HL vs LH/LL)
  let bias = dir === 1 ? "BULLISH" : dir === -1 ? "BEARISH" : "RANGE";
  const tail = sw.slice(-4);
  if (bias === "RANGE" && tail.length >= 4) {
    const hs = tail.filter((p) => p.type === "H").map((p) => p.price);
    const ls = tail.filter((p) => p.type === "L").map((p) => p.price);
    if (hs.length >= 2 && ls.length >= 2) {
      if (hs[hs.length - 1] > hs[0] && ls[ls.length - 1] > ls[0]) bias = "BULLISH";
      else if (hs[hs.length - 1] < hs[0] && ls[ls.length - 1] < ls[0]) bias = "BEARISH";
    }
  }

  // Fallback terakhir (tren sangat kuat tanpa pullback — swing minim): nilai
  // posisi harga terakhir di dalam kisaran jendela 90 bar vs lebarnya.
  if (bias === "RANGE") {
    const w = bars.slice(-90);
    if (w.length >= 30) {
      const hi = Math.max(...w.map((b) => b.h));
      const lo = Math.min(...w.map((b) => b.l));
      const width = hi - lo;
      const atr = atrSimple(bars) || width * 0.05 || 1;
      if (width > atr * 6) {
        const p = bars[bars.length - 1].c;
        if (p > hi - width * 0.25) bias = "BULLISH";
        else if (p < lo + width * 0.25) bias = "BEARISH";
      }
    }
  }

  const lastSwH = [...raw].reverse().find((p) => p.type === "H");
  const lastSwL = [...raw].reverse().find((p) => p.type === "L");

  return {
    bias,
    dir,
    lastSwingHigh: lastSwH ? rnd(lastSwH.price) : null,
    lastSwingLow: lastSwL ? rnd(lastSwL.price) : null,
    events: events.slice(-6).reverse().map((e) => ({ ...e, barsAgo: bars.length - 1 - e.i })),
    swings: sw.slice(-8).map((p) => ({ ...p, price: rnd(p.price) })),
  };
}

// ═════════════════════════════════════════════════════════════════════════
// 2) ORDER BLOCK — candle berlawanan terakhir sebelum leg displacement
// ═════════════════════════════════════════════════════════════════════════
export function orderBlocks(bars, atr) {
  if (!atr) return [];
  const price = bars[bars.length - 1].c;
  const out = [];
  const from = Math.max(25, bars.length - 130);
  for (let i = from; i < bars.length - 1; i++) {
    const rng = bars[i].h - bars[i].l;
    const base = avg(bars.slice(Math.max(1, i - 20), i).map((b) => b.h - b.l));
    if (!base || rng < base * 1.7) continue; // displacement: range jauh di atas rata-rata
    const body = Math.abs(bars[i].c - bars[i].o);
    if (body / rng < 0.55) continue; // body dominan (bukan doji)
    const prev3 = bars.slice(i - 3, i);
    if (prev3.length < 3) continue;
    const bull = bars[i].c > bars[i].o && bars[i].c > Math.max(...prev3.map((b) => b.h));
    const bear = bars[i].c < bars[i].o && bars[i].c < Math.min(...prev3.map((b) => b.l));
    if (!bull && !bear) continue;

    // OB = candle berlawanan warna terakhir sebelum leg impulsif
    for (let j = i - 1; j >= Math.max(1, i - 4); j--) {
      const opp = bull ? bars[j].c < bars[j].o : bars[j].c > bars[j].o;
      if (!opp) continue;
      const ob = {
        idx: j, t: bars[j].t, side: bull ? "bullish" : "bearish",
        top: bars[j].h, bottom: bars[j].l,
      };
      let touched = false, held = false;
      for (let k = i + 1; k < bars.length; k++) {
        const b = bars[k];
        if (bull) { if (b.l <= ob.top) { touched = true; if (b.c > ob.bottom) held = true; } }
        else { if (b.h >= ob.bottom) { touched = true; if (b.c < ob.top) held = true; } }
      }
      ob.status = held ? "tested" : touched ? "mitigated" : "fresh";
      ob.barsAgo = bars.length - 1 - j;
      ob.distPts = Math.abs(price - (ob.top + ob.bottom) / 2);
      out.push(ob);
      break;
    }
  }
  // Terdekat ke harga diprioritaskan (zona relevan untuk entry), maks 4.
  return out
    .sort((a, b) => a.distPts - b.distPts)
    .slice(0, 4)
    .map((o) => ({
      side: o.side, top: rnd(o.top), bottom: rnd(o.bottom),
      mid: rnd((o.top + o.bottom) / 2), status: o.status,
      barsAgo: o.barsAgo, distPts: rnd(o.distPts),
    }));
}

// ═════════════════════════════════════════════════════════════════════════
// 3) FAIR VALUE GAP (imbalance 3 candle)
// ═════════════════════════════════════════════════════════════════════════
export function fairValueGaps(bars, atr) {
  if (!atr) return [];
  const minGap = atr * 0.12; // abaikan gap mikro
  const out = [];
  for (let i = Math.max(2, bars.length - 100); i < bars.length; i++) {
    const a = bars[i - 2], c = bars[i];
    if (c.l - a.h > minGap) { // bullish FVG: void antara high[i-2] dan low[i]
      out.push({ idx: i, side: "bullish", top: c.l, bottom: a.h });
    } else if (a.l - c.h > minGap) { // bearish FVG
      out.push({ idx: i, side: "bearish", top: a.l, bottom: c.h });
    }
  }
  // Ukur seberapa jauh gap sudah terisi oleh harga setelahnya.
  for (const z of out) {
    let worst = 0;
    const h = z.top - z.bottom;
    for (let k = z.idx + 1; k < bars.length; k++) {
      const b = bars[k];
      if (z.side === "bullish") {
        if (b.l <= z.top) worst = Math.max(worst, Math.min(1, (z.top - Math.max(b.l, z.bottom)) / h));
        if (b.c < z.bottom) { worst = 1; break; }
      } else {
        if (b.h >= z.bottom) worst = Math.max(worst, Math.min(1, (Math.min(b.h, z.top) - z.bottom) / h));
        if (b.c > z.top) { worst = 1; break; }
      }
    }
    z.fillPct = worst;
    z.barsAgo = bars.length - 1 - z.idx;
  }
  return out
    .filter((z) => z.fillPct < 0.99) // hanya yang masih terbuka / sebagian
    .slice(-5)
    .map((z) => ({
      side: z.side, top: rnd(z.top), bottom: rnd(z.bottom), mid: rnd((z.top + z.bottom) / 2),
      fillPct: Math.round(z.fillPct * 100), barsAgo: z.barsAgo,
      state: z.fillPct >= 0.5 ? "sebagian" : "terbuka",
    }));
}

// ═════════════════════════════════════════════════════════════════════════
// 4) LIQUIDITY POOL + SWEEP — equal highs/lows yang diburu stop hunter
// ═════════════════════════════════════════════════════════════════════════
export function liquidityPools(bars, atr) {
  if (!atr) return [];
  const pts = alternating(swingPointsFallback(bars, 3, 3));
  const tol = atr * 0.25;
  const pools = [];
  const scan = (type, side) => {
    const list = pts.filter((p) => p.type === type);
    for (let i = 1; i < list.length; i++) {
      if (Math.abs(list[i].price - list[i - 1].price) <= tol) {
        pools.push({ side, price: (list[i].price + list[i - 1].price) / 2, idx: list[i].i, touches: 2 });
      }
    }
  };
  scan("H", "buyside");   // equal highs → kolam stop beli di atas (likuiditas buyer)
  scan("L", "sellside");  // equal lows → kolam stop jual di bawah

  for (const p of pools) {
    p.swept = false;
    p.sweptBarsAgo = null;
    for (let k = p.idx + 1; k < bars.length; k++) {
      const b = bars[k];
      const pokeBeyond = p.side === "buyside" ? b.h > p.price + atr * 0.05 : b.l < p.price - atr * 0.05;
      const closeBack = p.side === "buyside" ? b.c < p.price : b.c > p.price;
      if (pokeBeyond && closeBack) { p.swept = true; p.sweptBarsAgo = bars.length - 1 - k; break; }
    }
  }
  return pools
    .sort((a, b) => b.idx - a.idx)
    .slice(0, 4)
    .map((p) => ({
      side: p.side, price: rnd(p.price), swept: p.swept, sweptBarsAgo: p.sweptBarsAgo,
      barsAgo: bars.length - 1 - p.idx,
    }));
}

// ═════════════════════════════════════════════════════════════════════════
// 5) ICT PREMIUM / DISCOUNT + OTE
// ═════════════════════════════════════════════════════════════════════════
export function premiumDiscount(bars, price, bias, { lookback = 90 } = {}) {
  const win = bars.slice(-lookback);
  const hi = Math.max(...win.map((b) => b.h));
  const lo = Math.min(...win.map((b) => b.l));
  const eq = (hi + lo) / 2;
  const pos = hi > lo ? (price - lo) / (hi - lo) : 0.5;
  const zone =
    pos >= 0.79 ? "PREMIUM DALAM" :
    pos >= 0.55 ? "PREMIUM" :
    pos <= 0.21 ? "DISKON DALAM" :
    pos <= 0.45 ? "DISKON" : "EQUILIBRIUM";

  // OTE 0.62–0.79 retracement dari leg impuls terakhir mengikuti bias struktur,
  // dengan fallback ke dealing-range (hi/lo jendela) bila swing minim.
  let ote = null;
  const sw = alternating(swingPointsFallback(bars, 3, 3));
  if (bias === "BULLISH") {
    const lastH = [...sw].reverse().find((p) => p.type === "H");
    const prevL = lastH ? [...sw.slice(0, sw.indexOf(lastH))].reverse().find((p) => p.type === "L") : null;
    const legFrom = prevL?.price ?? lo, legTo = lastH?.price ?? hi;
    if (legTo > legFrom) {
      const rng = legTo - legFrom;
      const top = legTo - rng * 0.62;
      const bottom = legTo - rng * 0.79;
      ote = {
        leg: "up", legFrom: rnd(legFrom), legTo: rnd(legTo),
        top: rnd(top), bottom: rnd(bottom),
        inside: price <= top && price >= bottom,
      };
    }
  } else if (bias === "BEARISH") {
    const lastL = [...sw].reverse().find((p) => p.type === "L");
    const prevH = lastL ? [...sw.slice(0, sw.indexOf(lastL))].reverse().find((p) => p.type === "H") : null;
    const legFrom = prevH?.price ?? hi, legTo = lastL?.price ?? lo;
    if (legFrom > legTo) {
      const rng = legFrom - legTo;
      const bottom = legTo + rng * 0.62;
      const top = legTo + rng * 0.79;
      ote = {
        leg: "down", legFrom: rnd(legFrom), legTo: rnd(legTo),
        top: rnd(top), bottom: rnd(bottom),
        inside: price >= bottom && price <= top,
      };
    }
  }
  return {
    hi: rnd(hi), lo: rnd(lo), eq: rnd(eq),
    pos: Math.round(pos * 1000) / 10, zone, ote,
  };
}

// ═════════════════════════════════════════════════════════════════════════
// 6) SNR — klaster swing menjadi level Support & Resistance
// ═════════════════════════════════════════════════════════════════════════
export function snrLevels(bars, price, { lookback = 220 } = {}) {
  const atr = atrSimple(bars) || Math.abs(price) * 0.001 || 1;
  const tol = atr * 0.35;
  const n0 = Math.max(0, bars.length - lookback);
  const win = bars.slice(n0);
  const pts = swingPointsFallback(win, 3, 3);

  const clusters = [];
  for (const p of pts) {
    const c = clusters.find((x) => Math.abs(x.price - p.price) <= tol);
    if (c) {
      c.price = (c.price * c.touches + p.price) / (c.touches + 1);
      c.touches += 1;
      c.lastIdx = n0 + p.i;
    } else {
      clusters.push({ price: p.price, touches: 1, lastIdx: n0 + p.i });
    }
  }
  // Fallback ekstrem jendela bila pivot terlalu sedikit (tren tanpa pullback):
  // gunakan kuartil min-low / max-high sebagai level semu agar SNR tetap berguna.
  if (clusters.filter((c) => c.price < price).length < 1) {
    const lows = [...win.map((b) => b.l)].sort((a, b) => a - b);
    for (const q of [0.1, 0.35, 0.6]) {
      const v = lows[Math.floor(q * (lows.length - 1))];
      clusters.push({ price: v, touches: 1, lastIdx: n0 + win.length - 1 });
    }
  }
  if (clusters.filter((c) => c.price > price).length < 1) {
    const highs = [...win.map((b) => b.h)].sort((a, b) => a - b);
    for (const q of [0.4, 0.65, 0.9]) {
      const v = highs[Math.floor(q * (highs.length - 1))];
      clusters.push({ price: v, touches: 1, lastIdx: n0 + win.length - 1 });
    }
  }

  const recency = (idx) => Math.max(0, 30 - (bars.length - 1 - idx) / 4);
  const strength = (c) => Math.min(100, Math.round(c.touches * 24 + recency(c.lastIdx)));

  const supports = clusters
    .filter((c) => c.price < price - tol * 0.3)
    .sort((a, b) => b.price - a.price)
    .slice(0, 3)
    .map((c, i) => ({ key: `S${i + 1}`, price: rnd(c.price), touches: c.touches, strength: strength(c), distPts: rnd(price - c.price) }));
  const resistances = clusters
    .filter((c) => c.price > price + tol * 0.3)
    .sort((a, b) => a.price - b.price)
    .slice(0, 3)
    .map((c, i) => ({ key: `R${i + 1}`, price: rnd(c.price), touches: c.touches, strength: strength(c), distPts: rnd(c.price - price) }));
  return { supports, resistances };
}

// ═════════════════════════════════════════════════════════════════════════
// 7) RANGE + BREAKOUT — kotak N bar, status, retest & target terukur
// ═════════════════════════════════════════════════════════════════════════
export function rangeState(bars, atr, { n = 20 } = {}) {
  const win = bars.slice(-n - 1, -1);
  const hi = Math.max(...win.map((b) => b.h));
  const lo = Math.min(...win.map((b) => b.l));
  const width = hi - lo;
  const last = bars[bars.length - 1];
  const posPct = width > 0 ? Math.round(((last.c - lo) / width) * 100) : 50;

  let status = "RANGE";
  if (last.c > hi) status = "BREAKOUT_UP";
  else if (last.c < lo) status = "BREAKOUT_DOWN";

  // Breakout terkini (≤ 8 bar ke belakang) + kualitas retest
  let breakout = null;
  for (let i = bars.length - 1; i > Math.max(n, bars.length - 9); i--) {
    const prior = bars.slice(i - n - 1, i);
    const pHi = Math.max(...prior.map((b) => b.h));
    const pLo = Math.min(...prior.map((b) => b.l));
    if (bars[i].c > pHi && bars[i].c > bars[i].o) { breakout = { i, dir: "up", level: pHi, width: pHi - pLo }; break; }
    if (bars[i].c < pLo && bars[i].c < bars[i].o) { breakout = { i, dir: "down", level: pLo, width: pHi - pLo }; break; }
  }
  if (breakout) {
    const after = bars.slice(breakout.i + 1);
    const touched = after.some((b) =>
      breakout.dir === "up" ? b.l <= breakout.level + (atr || 0) * 0.1 : b.h >= breakout.level - (atr || 0) * 0.1
    );
    const held = breakout.dir === "up" ? last.c > breakout.level : last.c < breakout.level;
    breakout = {
      dir: breakout.dir,
      level: rnd(breakout.level),
      barsAgo: bars.length - 1 - breakout.i,
      retest: after.length === 0 ? "baru" : touched ? (held ? "sukses" : "gagal") : "belum",
      target: rnd(breakout.dir === "up" ? breakout.level + breakout.width : breakout.level - breakout.width),
    };
  }
  return { hi: rnd(hi), lo: rnd(lo), width: rnd(width), posPct, status, breakout };
}

// ═════════════════════════════════════════════════════════════════════════
// 8) CHART PATTERN KLASIK — dari rangkaian swing mayor
// ═════════════════════════════════════════════════════════════════════════
function linSlope(pts) {
  if (pts.length < 2) return 0;
  const xs = pts.map((p) => p.i), ys = pts.map((p) => p.price);
  const mx = avg(xs), my = avg(ys);
  let num = 0, den = 0;
  for (let k = 0; k < pts.length; k++) { num += (xs[k] - mx) * (ys[k] - my); den += (xs[k] - mx) ** 2; }
  return den ? num / den : 0;
}

export function chartPatterns(bars, atr, bias = "RANGE") {
  if (!atr) return [];
  const price = bars[bars.length - 1].c;
  const sw = alternating(swingPointsFallback(bars, 4, 4)).slice(-14);
  const H = sw.filter((p) => p.type === "H");
  const L = sw.filter((p) => p.type === "L");
  const found = [];
  const cap = (v) => Math.min(100, Math.round(v));
  const recentOk = (p) => bars.length - 1 - p.i <= 70;

  // ── Double Top ──────────────────────────────────────────────────────
  if (H.length >= 2 && recentOk(H[H.length - 1])) {
    const h1 = H[H.length - 2], h2 = H[H.length - 1];
    const valley = L.filter((p) => p.i > h1.i && p.i < h2.i).sort((a, b) => a.price - b.price)[0];
    if (valley && Math.abs(h1.price - h2.price) <= 0.4 * atr) {
      const depth = Math.min(h1.price, h2.price) - valley.price;
      if (depth >= 0.8 * atr) {
        const confirmed = bars.slice(h2.i + 1).some((b) => b.c < valley.price);
        found.push({
          key: "double-top", name: "Double Top", dir: "bearish",
          status: confirmed ? "TERKONFIRMASI" : "TERBENTUK",
          strength: cap(58 + depth / atr * 8 + (confirmed ? 15 : 0)),
          levels: { neckline: rnd(valley.price), target: rnd(valley.price - depth) },
          note: `Dua puncak setara di ~${rnd(h1.price)}, neckline ${rnd(valley.price)}. Target terukur = tinggi pola diproyeksikan dari neckline.`,
        });
      }
    }
  }

  // ── Double Bottom ───────────────────────────────────────────────────
  if (L.length >= 2 && recentOk(L[L.length - 1])) {
    const l1 = L[L.length - 2], l2 = L[L.length - 1];
    const peak = H.filter((p) => p.i > l1.i && p.i < l2.i).sort((a, b) => b.price - a.price)[0];
    if (peak && Math.abs(l1.price - l2.price) <= 0.4 * atr) {
      const depth = peak.price - Math.max(l1.price, l2.price);
      if (depth >= 0.8 * atr) {
        const confirmed = bars.slice(l2.i + 1).some((b) => b.c > peak.price);
        found.push({
          key: "double-bottom", name: "Double Bottom", dir: "bullish",
          status: confirmed ? "TERKONFIRMASI" : "TERBENTUK",
          strength: cap(58 + depth / atr * 8 + (confirmed ? 15 : 0)),
          levels: { neckline: rnd(peak.price), target: rnd(peak.price + depth) },
          note: `Dua lembah setara di ~${rnd(l1.price)}, neckline ${rnd(peak.price)}. Reversal naik bila neckline ditembus.`,
        });
      }
    }
  }

  // ── Head & Shoulders (top) ──────────────────────────────────────────
  if (H.length >= 3) {
    const [h1, h2, h3] = H.slice(-3);
    const l1 = L.filter((p) => p.i > h1.i && p.i < h2.i).sort((a, b) => a.price - b.price)[0];
    const l2 = L.filter((p) => p.i > h2.i && p.i < h3.i).sort((a, b) => a.price - b.price)[0];
    if (l1 && l2 && h2.price > h1.price + 0.15 * atr && h2.price > h3.price + 0.15 * atr &&
        Math.abs(h1.price - h3.price) <= 0.75 * atr && recentOk(h3)) {
      const neck = Math.min(l1.price, l2.price);
      const depth = h2.price - neck;
      if (depth >= 1.1 * atr) {
        const confirmed = bars.slice(h3.i + 1).some((b) => b.c < neck);
        found.push({
          key: "head-shoulders", name: "Head & Shoulders", dir: "bearish",
          status: confirmed ? "TERKONFIRMASI" : "TERBENTUK",
          strength: cap(64 + depth / atr * 6 + (confirmed ? 14 : 0)),
          levels: { neckline: rnd(neck), target: rnd(neck - depth) },
          note: `Bahu kiri ${rnd(h1.price)} · Kepala ${rnd(h2.price)} · Bahu kanan ${rnd(h3.price)}. Pola reversal klasik.`,
        });
      }
    }
  }

  // ── Inverse Head & Shoulders ────────────────────────────────────────
  if (L.length >= 3) {
    const [l1, l2, l3] = L.slice(-3);
    const h1 = H.filter((p) => p.i > l1.i && p.i < l2.i).sort((a, b) => b.price - a.price)[0];
    const h2 = H.filter((p) => p.i > l2.i && p.i < l3.i).sort((a, b) => b.price - a.price)[0];
    if (h1 && h2 && l2.price < l1.price - 0.15 * atr && l2.price < l3.price - 0.15 * atr &&
        Math.abs(l1.price - l3.price) <= 0.75 * atr && recentOk(l3)) {
      const neck = Math.max(h1.price, h2.price);
      const depth = neck - l2.price;
      if (depth >= 1.1 * atr) {
        const confirmed = bars.slice(l3.i + 1).some((b) => b.c > neck);
        found.push({
          key: "inv-head-shoulders", name: "Inverse Head & Shoulders", dir: "bullish",
          status: confirmed ? "TERKONFIRMASI" : "TERBENTUK",
          strength: cap(64 + depth / atr * 6 + (confirmed ? 14 : 0)),
          levels: { neckline: rnd(neck), target: rnd(neck + depth) },
          note: `Bahu kiri ${rnd(l1.price)} · Kepala ${rnd(l2.price)} · Bahu kanan ${rnd(l3.price)}. Reversal naik kuat.`,
        });
      }
    }
  }

  // ── Triangles & Wedges — regresi slopes atas swing H/L ──────────────
  if (H.length >= 3 && L.length >= 3) {
    const hT = H.slice(-4), lT = L.slice(-4);
    const sH = linSlope(hT) / atr * 10; // slope per 10 bar, dinormalisasi ATR
    const sL = linSlope(lT) / atr * 10;
    const eps = 0.16;
    const lvlH = avg(hT.map((p) => p.price));
    const lvlL = avg(lT.map((p) => p.price));
    const height = lvlH - lvlL;
    if (height > 0.5 * atr) {
      if (sH < -eps && sL > eps) {
        found.push({
          key: "sym-triangle", name: "Symmetrical Triangle", dir: bias === "BULLISH" ? "bullish" : bias === "BEARISH" ? "bearish" : "neutral",
          status: "TERBENTUK", strength: cap(56 + Math.min(sL - sH, 8) * 3),
          levels: { upper: rnd(lvlH), lower: rnd(lvlL), target: rnd(bias === "BEARISH" ? lvlL - height : lvlH + height) },
          note: "Konvergensi lower-high & higher-low = tekanan energi. Bias breakout mengikuti tren struktur.",
        });
      } else if (Math.abs(sH) <= eps && sL > eps) {
        found.push({
          key: "asc-triangle", name: "Ascending Triangle", dir: "bullish",
          status: price > lvlH ? "TERKONFIRMASI" : "TERBENTUK", strength: cap(62 + sL * 4),
          levels: { breakout: rnd(lvlH), target: rnd(lvlH + height) },
          note: `Resistance datar di ~${rnd(lvlH)} dengan higher-low — tekanan beli menumpuk.`,
        });
      } else if (sH < -eps && Math.abs(sL) <= eps) {
        found.push({
          key: "desc-triangle", name: "Descending Triangle", dir: "bearish",
          status: price < lvlL ? "TERKONFIRMASI" : "TERBENTUK", strength: cap(62 + Math.abs(sH) * 4),
          levels: { breakout: rnd(lvlL), target: rnd(lvlL - height) },
          note: `Support datar di ~${rnd(lvlL)} dengan lower-high — tekanan jual menumpuk.`,
        });
      } else if (sH > eps && sL > eps && sL > sH + eps / 2) {
        found.push({
          key: "rising-wedge", name: "Rising Wedge", dir: "bearish",
          status: "TERBENTUK", strength: cap(58 + (sL - sH) * 4),
          levels: { upper: rnd(lvlH), lower: rnd(lvlL) },
          note: "Kedua garis naik namun konvergen — momentum beli melemah, rawan reversal turun.",
        });
      } else if (sH < -eps && sL < -eps && sH < sL - eps / 2) {
        found.push({
          key: "falling-wedge", name: "Falling Wedge", dir: "bullish",
          status: "TERBENTUK", strength: cap(58 + (sL - sH) * 4),
          levels: { upper: rnd(lvlH), lower: rnd(lvlL) },
          note: "Kedua garis turun namun konvergen — momentum jual melemah, rawan reversal naik.",
        });
      }
    }
  }

  // ── Bull / Bear Flag — impuls tajam + konsolidasi kecil ─────────────
  {
    const k = 8; // panjang tiang
    let best = null;
    for (let i = Math.max(1, bars.length - 34); i <= bars.length - k - 4; i++) {
      const move = bars[i + k - 1].c - bars[i].c;
      if (!best || Math.abs(move) > Math.abs(best.move)) best = { i, move };
    }
    if (best && Math.abs(best.move) >= 3 * atr) {
      const flag = bars.slice(best.i + k);
      if (flag.length >= 4 && flag.length <= 16) {
        const fr = Math.max(...flag.map((b) => b.h)) - Math.min(...flag.map((b) => b.l));
        if (fr <= Math.abs(best.move) * 0.55) {
          const up = best.move > 0;
          found.push({
            key: up ? "bull-flag" : "bear-flag",
            name: up ? "Bull Flag" : "Bear Flag",
            dir: up ? "bullish" : "bearish",
            status: "TERBENTUK",
            strength: cap(60 + (Math.abs(best.move) / atr - 3) * 5),
            levels: { target: rnd(price + best.move) , pole: rnd(best.move) },
            note: `Tiang ${up ? "naik" : "turun"} ${rnd(Math.abs(best.move))} pts + konsolidasi bendera ketat. Target = proyeksi tiang.`,
          });
        }
      }
    }
  }

  return found.sort((a, b) => b.strength - a.strength).slice(0, 5);
}

// ═════════════════════════════════════════════════════════════════════════
// ANALISIS GABUNGAN — satu panggilan untuk satu set bar
// ═════════════════════════════════════════════════════════════════════════
export function analyzeStructure(bars) {
  if (!bars || bars.length < 60) return null;
  const price = bars[bars.length - 1].c;
  const atr = atrSimple(bars) || price * 0.0015;
  const structure = marketStructure(bars);
  return {
    price: rnd(price),
    atr: rnd(atr),
    structure,
    snr: snrLevels(bars, price),
    orderBlocks: orderBlocks(bars, atr),
    fvgs: fairValueGaps(bars, atr),
    liquidity: liquidityPools(bars, atr),
    premium: premiumDiscount(bars, price, structure.bias),
    chartPatterns: chartPatterns(bars, atr, structure.bias),
    range: rangeState(bars, atr),
  };
}
