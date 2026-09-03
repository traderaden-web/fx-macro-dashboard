// lib/signals.js
// Sinyal Long/Short (Beli/Jual) per timeframe dari harga riil Yahoo Finance.
//
// Metode (dihitung dari OHLCV, bukan tebak-tebakan):
//  - EMA 20 vs EMA 50  → arah tren
//  - RSI(14) Wilder    → jenuh beli / jenuh jual
//  - MACD(12,26,9)     → momentum
//  - Harga vs EMA 50   → konfirmasi posisi
// Skor total −6..+6:  LONG ≥ +3 · SHORT ≤ −3 · selain itu NETRAL.
//
// Timeframe 4h tidak tersedia di Yahoo → di-resample dari bar 1 jam.

import { cached } from "./cache";

const YF = ["https://query1.finance.yahoo.com", "https://query2.finance.yahoo.com"];
const PATH = "/v8/finance/chart/";
const TTL = 5 * 60 * 1000; // 5 menit per (simbol, timeframe)
const TIMEOUT = 8000;
const FAIL_TTL = 5 * 60 * 1000;

let lastFail = 0;

// Simbol chart → Yahoo Finance.
const YAHOO = {
  gold: "GC=F",
  silver: "SI=F",
  wti: "CL=F",
  eurusd: "EURUSD=X",
  gbpusd: "GBPUSD=X",
  usdjpy: "USDJPY=X",
  audusd: "AUDUSD=X",
  usdcad: "USDCAD=X",
  nzdusd: "NZDUSD=X",
  dxy: "DX-Y.NYB",
};

// interval Yahoo + rentang data (cukup untuk warm-up MACD 26+9 & EMA 50).
// "fetch" = interval yang diambil dari API; "resample" = jumlah bar gabung.
const TF = {
  "15m": { fetch: "15m", range: "60d", resample: 1 },
  "30m": { fetch: "30m", range: "60d", resample: 1 },
  "1h": { fetch: "60m", range: "730d", resample: 1 },
  "4h": { fetch: "60m", range: "730d", resample: 4 },
  "1d": { fetch: "1d", range: "2y", resample: 1 },
  "1w": { fetch: "1wk", range: "10y", resample: 1 },
  "1mo": { fetch: "1mo", range: "max", resample: 1 },
};

export const TIMEFRAMES = Object.keys(TF);

// ── Fallback demo (dipakai bila Yahoo tak terjangkau) ─────────────────
// Base price per simbol & volatilitas relatif per timeframe, dipakai untuk
// membuat OHLC deterministik sehingga sinyal teknikal tetap dapat dihitung
// (andai penyedia live mati). Disarikan agar konsisten & masuk akal.
const DEMO_BASE = {
  "GC=F": 2505.6, "SI=F": 29.62, "CL=F": 74.1,
  "EURUSD=X": 1.092, "GBPUSD=X": 1.285, "USDJPY=X": 156.9,
  "AUDUSD=X": 0.664, "USDCAD=X": 1.345, "NZDUSD=X": 0.61, "DX-Y.NYB": 104.8,
};
const DEMO_VOL = { "15m": 0.0006, "30m": 0.0009, "1h": 0.0014, "4h": 0.0024, "1d": 0.0042, "1w": 0.008, "1mo": 0.014 };

function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Bias tren (arah & kekuatan) per simbol → memastikan tiap instrumen punya
// karakter berbeda (bullish/bearish/range) sehingga skor confluence bervariasi.
// Sifatnya deterministik (dari seed), jadi demo tetap konsisten.
const DEMO_TREND = {
  "GC=F": 0.45, "SI=F": 0.28, "CL=F": -0.2,
  "EURUSD=X": 0.3, "GBPUSD=X": 0.38, "USDJPY=X": -0.15,
  "AUDUSD=X": 0.42, "USDCAD=X": -0.3, "NZDUSD=X": 0.26, "DX-Y.NYB": -0.12,
};

// Buat bar OHLC deterministik (random walk + drift) untuk (simbol, tf).
function generateDemoBars(yahoo, symbolId, tf) {
  const base = DEMO_BASE[yahoo] || 100;
  const vol = DEMO_VOL[tf] || 0.001;
  const rand = mulberry32(hashSeed(`${symbolId}:${tf}`));
  const N = 260;
  const stepMs = { "15m": 15 * 60e3, "30m": 30 * 60e3, "1h": 60e3 * 60, "4h": 4 * 60e3 * 60, "1d": 86400e3, "1w": 7 * 86400e3, "1mo": 30 * 86400e3 }[tf] || 3600e3;
  const trend = DEMO_TREND[yahoo] ?? (rand() - 0.5) * 0.4;
  // Arah tren mendominasi (drift), noise kecil → tiap instrumen punya bias
  // bullish/bearish/range yang konsisten. TF tinggi & rendah berbagi tanda.
  const drift = (trend * 1.0 + (rand() - 0.5) * 0.2) * vol;
  const startPad = base * (1 - (N / 2) * drift);
  let price = startPad;
  const now = Date.now();
  const bars = [];
  for (let i = 0; i < N; i++) {
    const o = price;
    const noise = (rand() - 0.5) * 2 * vol;
    let c = o * (1 + drift + noise);
    if (c < o * 0.98) c = o * 0.98;
    if (c > o * 1.02) c = o * 1.02;
    const h = Math.max(o, c) * (1 + vol * (0.2 + rand() * 0.6));
    const l = Math.min(o, c) * (1 - vol * (0.2 + rand() * 0.6));
    bars.push({ t: (now - (N - i) * stepMs) / 1000, o, h, l, c });
    price = c;
  }
  return bars;
}

// ── Indikator teknikal ─────────────────────────────────────────────────
function ema(values, period) {
  if (values.length < period) return null;
  const k = 2 / (period + 1);
  let e = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  const out = new Array(values.length).fill(null);
  out[period - 1] = e;
  for (let i = period; i < values.length; i++) {
    e = values[i] * k + e * (1 - k);
    out[i] = e;
  }
  return out;
}

function rsi(closes, period = 14) {
  if (closes.length < period + 1) return null;
  let gain = 0,
    loss = 0;
  for (let i = 1; i <= period; i++) {
    const d = closes[i] - closes[i - 1];
    if (d >= 0) gain += d;
    else loss -= d;
  }
  let avgG = gain / period,
    avgL = loss / period;
  for (let i = period + 1; i < closes.length; i++) {
    const d = closes[i] - closes[i - 1];
    avgG = (avgG * (period - 1) + Math.max(d, 0)) / period;
    avgL = (avgL * (period - 1) + Math.max(-d, 0)) / period;
  }
  if (avgL === 0) return 100;
  return 100 - 100 / (1 + avgG / avgL);
}

function macd(closes) {
  const e12 = ema(closes, 12);
  const e26 = ema(closes, 26);
  if (!e12 || !e26) return null;
  const line = closes.map((_, i) =>
    e12[i] != null && e26[i] != null ? e12[i] - e26[i] : null
  );
  const valid = line.filter((v) => v != null);
  if (valid.length < 9) return null;
  // EMA 9 dihitung di atas baris MACD yang valid
  const k = 2 / 10;
  let sig = valid.slice(0, 9).reduce((a, b) => a + b, 0) / 9;
  const sigLine = new Array(line.length).fill(null);
  let idx = line.findIndex((v) => v != null) + 8;
  sigLine[idx] = sig;
  for (let i = idx + 1; i < line.length; i++) {
    sig = line[i] * k + sig * (1 - k);
    sigLine[i] = sig;
  }
  const n = line.length - 1;
  return { line: line[n], signal: sigLine[n], hist: line[n] - sigLine[n] };
}

// Gabung `resample` bar berturut-turut menjadi satu bar (untuk 4h dari 1h).
function resampleBars(bars, f, n) {
  if (n <= 1) return bars;
  const out = [];
  for (let i = 0; i + n <= bars.length; i += n) {
    const chunk = bars.slice(i, i + n);
    out.push({
      t: chunk[chunk.length - 1].t,
      o: chunk[0].o,
      h: Math.max(...chunk.map((b) => b.h)),
      l: Math.min(...chunk.map((b) => b.l)),
      c: chunk[chunk.length - 1].c,
    });
  }
  return out;
}

// ATR(14) Wilder dari bar OHLC — dipakai untuk level SL/TP di mini-chart.
function atrWilder(bars, period = 14) {
  if (bars.length < period + 1) return null;
  const trs = [];
  for (let i = 1; i < bars.length; i++) {
    trs.push(
      Math.max(
        bars[i].h - bars[i].l,
        Math.abs(bars[i].h - bars[i - 1].c),
        Math.abs(bars[i].l - bars[i - 1].c)
      )
    );
  }
  let a = trs.slice(0, period).reduce((x, y) => x + y, 0) / period;
  for (let i = period; i < trs.length; i++) a = (a * (period - 1) + trs[i]) / period;
  return a;
}

// ── Skor sinyal ─────────────────────────────────────────────────────────
function computeSignal(closes) {
  if (!closes || closes.length < 60) {
    return { error: "Data harga belum cukup untuk timeframe ini" };
  }
  const price = closes[closes.length - 1];
  const e20 = ema(closes, 20);
  const e50 = ema(closes, 50);
  const r = rsi(closes, 14);
  const m = macd(closes);
  if (e20[e20.length - 1] == null || e50[e50.length - 1] == null || r == null || !m) {
    return { error: "Data harga belum cukup untuk indikator" };
  }

  let score = 0;
  const reasons = [];

  // RSI
  if (r <= 30) { score += 2; reasons.push(`RSI ${r.toFixed(1)} — jenuh jual`); }
  else if (r < 40) { score += 1; reasons.push(`RSI ${r.toFixed(1)} — mendekati jenuh jual`); }
  else if (r >= 70) { score -= 2; reasons.push(`RSI ${r.toFixed(1)} — jenuh beli`); }
  else if (r > 60) { score -= 1; reasons.push(`RSI ${r.toFixed(1)} — mendekati jenuh beli`); }
  else reasons.push(`RSI ${r.toFixed(1)} — netral`);

  // Tren EMA
  if (e20[e20.length - 1] > e50[e50.length - 1]) { score += 1; reasons.push("EMA20 > EMA50 (tren naik)"); }
  else { score -= 1; reasons.push("EMA20 < EMA50 (tren turun)"); }

  // MACD
  if (m.line > m.signal) { score += 1; reasons.push("MACD di atas signal (momentum naik)"); }
  else { score -= 1; reasons.push("MACD di bawah signal (momentum turun)"); }

  // Posisi harga vs EMA50
  if (price > e50[e50.length - 1]) score += 1;
  else score -= 1;

  let signal, label, action;
  if (score >= 3) { signal = "LONG"; label = "BULLISH"; action = "BELI"; }
  else if (score <= -3) { signal = "SHORT"; label = "BEARISH"; action = "JUAL"; }
  else { signal = "NETRAL"; label = "MIXED"; action = "TUNGGU"; }
  const strength = Math.abs(score) >= 5 ? "kuat" : Math.abs(score) >= 3 ? "sedang" : "lemah";

  return {
    price,
    signal,
    label,
    action,
    score,
    strength,
    reasons,
    series: { closes, ema20: e20, ema50: e50 },
    indicators: {
      rsi: Number(r.toFixed(2)),
      ema20: Number(e20[e20.length - 1].toPrecision(6)),
      ema50: Number(e50[e50.length - 1].toPrecision(6)),
      macd: Number(m.line.toPrecision(4)),
      macdSignal: Number(m.signal.toPrecision(4)),
      macdHist: Number(m.hist.toPrecision(4)),
    },
  };
}

// ── Fetch + komputasi (di-cache 5 menit per simbol+TF) ─────────────────
async function fetchCloses(yahoo, tf) {
  const spec = TF[tf];
  const url = `${PATH}${encodeURIComponent(yahoo)}?interval=${spec.fetch}&range=${spec.range}`;
  let lastErr;
  for (const host of YF) {
    try {
      const res = await fetch(`${host}${url}`, {
        signal: AbortSignal.timeout(TIMEOUT),
        cache: "no-store",
        headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const result = data?.chart?.result?.[0];
      const ts = result?.timestamp || [];
      const q = result?.indicators?.quote?.[0] || {};
      const bars = [];
      for (let i = 0; i < ts.length; i++) {
        if (q.close?.[i] == null) continue;
        bars.push({
          t: ts[i],
          o: q.open?.[i] ?? q.close[i],
          h: q.high?.[i] ?? q.close[i],
          l: q.low?.[i] ?? q.close[i],
          c: q.close[i],
        });
      }
      if (bars.length < 30) throw new Error("data bar kurang");
      return { bars, meta: result.meta || {} };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("gagal mengambil harga");
}

/** Sinyal untuk (simbol, timeframe). `symbolId` = id picker chart. */
export async function getSignal(symbolId, tf, { force = false, skipCooldown = false } = {}) {
  const yahoo = YAHOO[symbolId];
  if (!yahoo) throw new Error(`Simbol ${symbolId} tidak dikenal`);
  if (!TF[tf]) throw new Error(`Timeframe ${tf} tidak dikenal`);
  const key = `signal:${symbolId}:${tf}`;

  if (force) {
    const data = await build();
    cached.force(key, data);
    return data;
  }
  if (!skipCooldown && Date.now() - lastFail < FAIL_TTL) {
    throw new Error("Penyedia harga belum tersedia (cooldown)");
  }
  try {
    return await cached(key, TTL, build);
  } catch (e) {
    lastFail = Date.now();
    throw e;
  }

  async function build() {
    let bars, source = "Yahoo Finance";
    try {
      const fetched = await fetchCloses(yahoo, tf);
      bars = fetched.bars;
    } catch (e) {
      // Penyedia live tidak terjangkau → pakai data demo yang deterministik.
      bars = generateDemoBars(yahoo, symbolId, tf);
      source = "demo";
    }
    bars = resampleBars(bars, TF[tf].fetch, TF[tf].resample);
    const closes = bars.map((b) => b.c);
    const sig = computeSignal(closes);
    if (sig.error) return { ok: false, error: sig.error, symbolId, tf };

    // Baseline perubahan: 1d/1w/1mo = bar sebelumnya; intraday = harga ~24 jam
    // lalu. Bila now-24h jatuh di jeda akhir pekan (bar null terfilter), pakai
    // bar pembuka sesi terakhir (bar setelah jeda > 24 jam) → "sejak buka pasar".
    let baseline, changeBasis;
    if (tf === "1d" || tf === "1w" || tf === "1mo") {
      baseline = closes[closes.length - 2];
      changeBasis = "vs bar sebelumnya";
    } else {
      const target = Date.now() / 1000 - 86400;
      let bestIdx = bars.length - 1,
        bestDist = Infinity;
      for (let i = 0; i < bars.length; i++) {
        const d = Math.abs(bars[i].t - target);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      if (bestIdx === bars.length - 1) {
        // jeda panjang (akhir pekan) — cari awal sesi terakhir
        for (let i = bars.length - 1; i > 0; i--) {
          if (bars[i].t - bars[i - 1].t > 86400) {
            bestIdx = i;
            changeBasis = "sejak buka pasar (akhir pekan)";
            break;
          }
        }
      }
      baseline = closes[bestIdx] ?? closes[closes.length - 2];
      if (!changeBasis) changeBasis = "vs 24 jam lalu";
    }

    const atr = atrWilder(bars, 14);

    // Seri untuk mini-chart: 80 bar terakhir (harga + EMA20 + EMA50)
    const N = 80;
    const tail = (arr) =>
      arr.slice(-N).map((v) => (v == null ? null : Number(v.toPrecision(6))));

    return {
      ok: true,
      symbolId,
      tf,
      source,
      updated: new Date().toISOString(),
      bars: bars.length,
      lastBar: new Date(bars[bars.length - 1].t * 1000).toISOString(),
      price: Number(sig.price.toPrecision(6)),
      changePct: ((sig.price - baseline) / baseline) * 100,
      changeBasis,
      atr: atr ? Number(atr.toPrecision(6)) : null,
      ...sig,
      series: {
        closes: tail(sig.series.closes),
        ema20: tail(sig.series.ema20),
        ema50: tail(sig.series.ema50),
      },
    };
  }
}

/**
 * Matriks sinyal semua timeframe untuk satu simbol (confluence multi-timeframe).
 * Menggunakan cache per TF; kegagalan satu TF tidak menular ke TF lain.
 */
export async function getSignalMatrix(symbolId) {
  if (!YAHOO[symbolId]) throw new Error(`Simbol ${symbolId} tidak dikenal`);
  const results = await Promise.allSettled(
    TIMEFRAMES.map((tf) => getSignal(symbolId, tf, { skipCooldown: true }))
  );
  const tfs = TIMEFRAMES.map((tf, i) => {
    const r = results[i];
    if (r.status !== "fulfilled" || !r.value?.ok) return { tf, ok: false };
    return {
      tf,
      ok: true,
      signal: r.value.signal,
      score: r.value.score,
      changePct: r.value.changePct,
      price: r.value.price,
    };
  });
  return { symbolId, updated: new Date().toISOString(), tfs };
}
