// app/api/heatmap/route.js
// Data heatmap aset: Major Forex + Logam Mulia + Energi + Logam Dasar.
// Sumber: Yahoo Finance chart API (gratis). Perubahan dihitung dari harga
// penutupan harian: 1H (hari terakhir), 1M (≈5 sesi), 3M (sepanjang bulan).
// Di-cache 5 menit; bila penyedia gagal → data seed (offline) dengan flag.

import { cached } from "../../../lib/cache";

const YF = ["https://query1.finance.yahoo.com", "https://query2.finance.yahoo.com"];
const TIMEOUT = 6000;
const TTL = 5 * 60 * 1000;

// [simbol Yahoo, nama tampilan, format harga]
const ASSETS = [
  { group: "fx", yahoo: "EURUSD=X", name: "EUR/USD", dec: 4 },
  { group: "fx", yahoo: "GBPUSD=X", name: "GBP/USD", dec: 4 },
  { group: "fx", yahoo: "USDJPY=X", name: "USD/JPY", dec: 2 },
  { group: "fx", yahoo: "USDCHF=X", name: "USD/CHF", dec: 4 },
  { group: "fx", yahoo: "AUDUSD=X", name: "AUD/USD", dec: 4 },
  { group: "fx", yahoo: "USDCAD=X", name: "USD/CAD", dec: 4 },
  { group: "fx", yahoo: "NZDUSD=X", name: "NZD/USD", dec: 4 },
  { group: "metal", yahoo: "GC=F", name: "XAU/USD (Gold)", dec: 2 },
  { group: "metal", yahoo: "SI=F", name: "XAG/USD (Silver)", dec: 2 },
  { group: "energy", yahoo: "CL=F", name: "WTI Crude", dec: 2 },
  { group: "energy", yahoo: "BZ=F", name: "Brent Crude", dec: 2 },
  { group: "energy", yahoo: "NG=F", name: "Natural Gas", dec: 2 },
  { group: "base", yahoo: "HG=F", name: "Copper", dec: 2 },
];

const GROUPS = [
  { id: "fx", label: "Major Forex" },
  { id: "metal", label: "Logam Mulia" },
  { id: "energy", label: "Energi" },
  { id: "base", label: "Logam Dasar" },
];

// Data cadangan bila Yahoo tidak terjangkau (nilai realistis, ditandai seed)
const SEED = {
  "EURUSD=X": { price: 1.1685, d: 0.05, w: 0.22, m: -0.41 },
  "GBPUSD=X": { price: 1.3421, d: -0.03, w: 0.14, m: -0.66 },
  "USDJPY=X": { price: 147.85, d: 0.08, w: 0.31, m: 1.12 },
  "USDCHF=X": { price: 0.8024, d: 0.02, w: -0.08, m: 0.34 },
  "AUDUSD=X": { price: 0.6541, d: -0.11, w: -0.27, m: 0.58 },
  "USDCAD=X": { price: 1.3682, d: 0.04, w: 0.11, m: -0.19 },
  "NZDUSD=X": { price: 0.5876, d: -0.09, w: -0.18, m: 0.42 },
  "GC=F": { price: 3384.5, d: 0.24, w: 1.05, m: 2.86 },
  "SI=F": { price: 38.42, d: 0.41, w: 2.35, m: 6.12 },
  "CL=F": { price: 71.18, d: 0.52, w: 2.14, m: -1.85 },
  "BZ=F": { price: 75.62, d: 0.48, w: 2.02, m: -2.31 },
  "NG=F": { price: 3.42, d: -1.24, w: 4.65, m: 12.4 },
  "HG=F": { price: 5.18, d: 0.12, w: 0.84, m: 3.27 },
};

async function fetchOne(def) {
  let lastErr;
  for (const host of YF) {
    try {
      const url = `${host}/v8/finance/chart/${encodeURIComponent(def.yahoo)}?interval=1d&range=3mo`;
      const res = await fetch(url, {
        signal: AbortSignal.timeout(TIMEOUT),
        cache: "no-store",
        headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const r = data?.chart?.result?.[0];
      const ts = r?.timestamp || [];
      const rawC = r?.indicators?.quote?.[0]?.close || [];
      const bars = [];
      for (let i = 0; i < ts.length; i++) {
        if (rawC[i] != null) bars.push({ t: ts[i], c: rawC[i] });
      }
      const closes = bars.map((b) => b.c);
      if (closes.length < 8) throw new Error("data kurang");
      const last = closes[closes.length - 1];
      const pct = (base, now) => (base ? ((now - base) / base) * 100 : 0);
      const tail = bars.slice(-64);
      return {
        group: def.group,
        yahoo: def.yahoo,
        name: def.name,
        dec: def.dec,
        price: last,
        d: pct(closes[closes.length - 2], last),
        w: pct(closes[Math.max(0, closes.length - 6)], last),
        m: pct(closes[0], last),
        spark: closes.slice(-24), // 24 sesi terakhir → sparkline 1 bulan
        hist: tail.map((b) => Number(b.c.toPrecision(6))), // 64 sesi → chart detail
        histT: tail.map((b) => new Date(b.t * 1000).toISOString().slice(0, 10)),
      };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("gagal");
}

async function fetchAll() {
  const settled = await Promise.allSettled(ASSETS.map(fetchOne));
  const items = [];
  let seedCount = 0;
  settled.forEach((r, i) => {
    const def = ASSETS[i];
    if (r.status === "fulfilled") items.push(r.value);
    else {
      const s = SEED[def.yahoo];
      if (s) {
        seedCount++;
        const N = 64;
        const mk = (n) =>
          Array.from({ length: n }, (_, i) => s.price * (1 + (s.m / 100) * Math.sin(i / 4) * 0.3 + (i - n / 2) * (s.m / 100) / n));
        const tail = mk(N).map((v) => Number(v.toPrecision(6)));
        items.push({
          group: def.group, yahoo: def.yahoo, name: def.name, dec: def.dec,
          price: s.price, d: s.d, w: s.w, m: s.m,
          spark: tail.slice(-24),
          hist: tail,
          histT: Array.from({ length: N }, (_, i) =>
            new Date(Date.now() - (N - 1 - i) * 86400000).toISOString().slice(0, 10)
          ),
          seed: true,
        });
      }
    }
  });
  if (!items.length) throw new Error("Heatmap: tidak ada data");
  return {
    asOf: new Date().toISOString(),
    source: seedCount ? `Yahoo Finance (+${seedCount} seed)` : "Yahoo Finance",
    groups: GROUPS.map((g) => ({ ...g, items: items.filter((it) => it.group === g.id) })),
  };
}

export async function GET() {
  try {
    const data = await cached("heatmap:assets", TTL, fetchAll);
    return Response.json(data);
  } catch (e) {
    return Response.json(
      { error: String(e.message || e), groups: GROUPS.map((g) => ({ ...g, items: [] })) },
      { status: 502 }
    );
  }
}
