// lib/forex.js
// Pengambil harga valuta asing & logam untuk ticker di bawah header.
// Sumber: Yahoo Finance chart (gratis, tanpa API key) — satu sumber untuk semua
// pasangan, sehingga perubahan arah (%/panah) dihitung dari chartPreviousClose
// (baseline penutupan hari sebelumnya) dan langsung terlihat bermakna.
// Di-cache 60 detik agar tidak berlebihan memanggil API.

import { cached } from "./cache";

const YF = ["https://query1.finance.yahoo.com", "https://query2.finance.yahoo.com"];
const PATH = "/v8/finance/chart/";
const TTL = 5 * 60 * 1000; // 5 menit — harga cukup segar, tanpa membebani API
const TIMEOUT = 6000; // 6 detik per host
const FAIL_TTL = 5 * 60 * 1000; // penyedia gagal → jangan coba lagi 5 menit

let lastFail = 0;

// Daftar pasangan yang ditampilkan. "yahoo" = simbol di Yahoo Finance.
const SYMBOLS = [
  { symbol: "EUR/USD", label: "Euro / Dolar AS", yahoo: "EURUSD=X" },
  { symbol: "GBP/USD", label: "Pound / Dolar AS", yahoo: "GBPUSD=X" },
  { symbol: "USD/JPY", label: "Dolar AS / Yen Jepang", yahoo: "USDJPY=X" },
  { symbol: "USD/CHF", label: "Dolar AS / Franc Swiss", yahoo: "USDCHF=X" },
  { symbol: "AUD/USD", label: "Dolar Australia / Dolar AS", yahoo: "AUDUSD=X" },
  { symbol: "USD/CAD", label: "Dolar AS / Dolar Kanada", yahoo: "USDCAD=X" },
  { symbol: "NZD/USD", label: "Dolar Selandia Baru / Dolar AS", yahoo: "NZDUSD=X" },
  { symbol: "EUR/GBP", label: "Euro / Pound Inggris", yahoo: "EURGBP=X" },
  // Regional Asia & pasar berkembang
  { symbol: "USD/IDR", label: "Dolar AS / Rupiah Indonesia", yahoo: "USDIDR=X" },
  { symbol: "USD/SGD", label: "Dolar AS / Dolar Singapura", yahoo: "USDSGD=X" },
  { symbol: "USD/CNY", label: "Dolar AS / Yuan Tiongkok", yahoo: "USDCNY=X" },
  { symbol: "USD/INR", label: "Dolar AS / Rupee India", yahoo: "USDINR=X" },
  { symbol: "USD/TRY", label: "Dolar AS / Lira Turki", yahoo: "USDTRY=X" },
  // Silang yen
  { symbol: "EUR/JPY", label: "Euro / Yen Jepang", yahoo: "EURJPY=X" },
  { symbol: "GBP/JPY", label: "Pound / Yen Jepang", yahoo: "GBPJPY=X" },
  // Logam mulia (COMEX)
  { symbol: "XAU/USD", label: "Emas (per oz)", yahoo: "GC=F" },
  { symbol: "XAG/USD", label: "Perak (per oz)", yahoo: "SI=F" },
];

// Ambil satu kuotasi dari Yahoo; coba host query1 lalu query2.
async function fetchQuote(def) {
  let lastErr;
  for (const host of YF) {
    try {
      const url = `${host}${PATH}${encodeURIComponent(def.yahoo)}?interval=1d&range=5d`;
      const res = await fetch(url, {
        signal: AbortSignal.timeout(TIMEOUT),
        cache: "no-store",
        headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" },
      });
      if (!res.ok) throw new Error(`${def.symbol} HTTP ${res.status}`);
      const data = await res.json();
      const meta = data?.chart?.result?.[0]?.meta;
      const price = meta?.regularMarketPrice;
      if (price == null) throw new Error(`${def.symbol} tanpa harga`);
      const prev = meta?.chartPreviousClose != null ? meta.chartPreviousClose : price;
      return { ...def, value: price, prev };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error(`${def.symbol} gagal`);
}

function pct(b, c) {
  return b ? ((c - b) / b) * 100 : 0;
}

async function fetchRates() {
  const settled = await Promise.allSettled(SYMBOLS.map(fetchQuote));

  const pairs = [];
  for (const r of settled) {
    if (r.status !== "fulfilled") continue;
    const p = r.value;
    pairs.push({
      symbol: p.symbol,
      label: p.label,
      value: p.value,
      delta: p.value - p.prev,
      pct: pct(p.prev, p.value),
    });
  }
  if (!pairs.length) throw new Error("Forex: tidak ada data");

  return {
    pairs,
    updated: new Date().toISOString(),
    source: "Yahoo Finance",
  };
}

/** Ambil kurs forex (dengan cache TTL). `force` melewati cache.
 *  Saat penyedia gagal, negative cache mencegah request berulang. */
export async function getForexRates({ force = false } = {}) {
  if (force) {
    const data = await fetchRates();
    cached.force("forex:fx", data);
    return data;
  }
  if (Date.now() - lastFail < FAIL_TTL) {
    throw new Error("Penyedia kurs belum tersedia (cooldown)");
  }
  try {
    return await cached("forex:fx", TTL, fetchRates);
  } catch (e) {
    lastFail = Date.now();
    throw e;
  }
}
