// lib/journal.js
// "Papan Skor Trading" — jurnal trade untuk membangun disiplin. Menyimpan
// trade (entry, SL, TP, hasil) dan menghitung statistik kinerja: win-rate,
// expectancy, profit factor, average win/loss, max drawdown, streaks.
//
// Penyimpanan: file JSON. Di Vercel (filesystem read-only) otomatis jatuh ke
// /tmp sehingga tetap jalan, tapi bersifat sementara — untuk riwayat permanen
// hubungkan DB (Supabase/Postgres). Lihat README & DEPLOYMENT.md.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

// Kandidat lokasi penyimpanan, berurutan prioritas:
//  1. ./data/journal.json  → berjalan di lokal / Netlify (filesystem dapat ditulis)
//  2. /tmp/fx-macro-journal.json → Vercel & platform serverless lain, yang
//     filesystem-nya read-only. Data di /tmp bertahan selama "cold start"
//     (ephemeral): hilang saat instance didaur ulang / redeploy. Untuk
//     penyimpanan permanen, hubungkan DB (lihat README → "Data & penyimpanan").
const CANDIDATES = [
  path.join(process.cwd(), "data", "journal.json"),
  path.join(process.env.JOURNAL_DIR || "/tmp", "fx-macro-journal.json"),
];

// File yang benar-benar dipakai (ditentukan saat pertama kali baca/tulis).
let FILE = null;
export function isPersistent() {
  return FILE === CANDIDATES[0];
}
function pickReadable() {
  for (const f of CANDIDATES) {
    try { if (existsSync(f)) return f; } catch { /* ignore */ }
  }
  return null;
}
function pickWritable() {
  for (const f of CANDIDATES) {
    try {
      const dir = path.dirname(f);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(f, "", { flag: "a" }); // probe: bisa ditulis?
      return f;
    } catch { /* coba kandidat berikutnya */ }
  }
  return null;
}

let cache = null;
function load() {
  if (cache) return cache;
  FILE = pickReadable() || FILE;
  try {
    if (FILE && existsSync(FILE)) cache = JSON.parse(readFileSync(FILE, "utf8"));
  } catch { /* ignore */ }
  cache = cache || { trades: [] };
  return cache;
}
function persist(data) {
  cache = data;
  const file = FILE || pickWritable();
  if (!file) {
    console.error("[journal] tidak ada lokasi penyimpanan yang bisa ditulis — perubahan hanya di memori.");
    return;
  }
  try {
    const dir = path.dirname(file);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(file, JSON.stringify(data, null, 2));
    FILE = file;
  } catch (e) {
    console.error("[journal] write gagal:", e?.message || e);
  }
}

export function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Ambil semua trade (tersortir dari terbaru). */
export function getTrades() {
  return (load().trades || []).slice().sort((a, b) => (b.ts || "").localeCompare(a.ts || ""));
}

/** Simpan trade baru. Hasil (pnl) boleh kosong bila posisi belum ditutup. */
export function addTrade({ symbol, direction, entry, stopLoss, takeProfit, lots, pnl, note, status }) {
  const data = load();
  const pnlN = num(pnl);
  const t = {
    id: data.trades.length + 1,
    symbol: (symbol || "").trim().toUpperCase() || "—",
    direction: direction === "SELL" ? "SELL" : "BUY",
    entry: num(entry),
    stopLoss: num(stopLoss),
    takeProfit: num(takeProfit),
    lots: num(lots),
    pnl: pnlN,
    status: pnlN != null ? (pnlN > 0 ? "win" : pnlN < 0 ? "loss" : "be") : (status || "open"),
    note: (note || "").trim(),
    ts: new Date().toISOString(),
  };
  data.trades.push(t);
  persist(data);
  return t;
}

export function updateTrade(id, patch) {
  const data = load();
  const t = data.trades.find((x) => x.id === Number(id));
  if (!t) return null;
  if (patch && patch.pnl !== undefined && patch.pnl !== null && patch.pnl !== "") {
    const p = num(patch.pnl);
    t.pnl = p;
    t.status = p > 0 ? "win" : p < 0 ? "loss" : "be";
  }
  if (patch.symbol) t.symbol = String(patch.symbol).toUpperCase();
  if (patch.note !== undefined) t.note = patch.note;
  persist(data);
  return t;
}

export function deleteTrade(id) {
  const data = load();
  data.trades = data.trades.filter((x) => x.id !== Number(id));
  persist(data);
  return true;
}

/** Statistik kinerja dari daftar trade (hanya yang sudah punya pnl). */
export function computeStats(trades = []) {
  const closed = trades.filter((t) => t.pnl != null);
  const wins = closed.filter((t) => t.pnl > 0);
  const losses = closed.filter((t) => t.pnl < 0);
  const be = closed.filter((t) => t.pnl === 0);
  const grossWin = wins.reduce((s, t) => s + t.pnl, 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + t.pnl, 0));
  const net = closed.reduce((s, t) => s + t.pnl, 0);

  const winRate = closed.length ? (wins.length / closed.length) * 100 : 0;
  const avgWin = wins.length ? grossWin / wins.length : 0;
  const avgLoss = losses.length ? grossLoss / losses.length : 0;
  const expectancy = closed.length ? (winRate / 100) * avgWin - (1 - winRate / 100) * avgLoss : 0;
  const profitFactor = grossLoss ? grossWin / grossLoss : grossWin > 0 ? Infinity : 0;

  // Max drawdown (berbasis equity kurva kumulatif).
  let equity = 0, peak = 0, maxDD = 0;
  for (const t of closed.slice().sort((a, b) => (a.ts || "").localeCompare(b.ts || ""))) {
    equity += t.pnl;
    peak = Math.max(peak, equity);
    maxDD = Math.max(maxDD, peak - equity);
  }

  // Streak menang / kalah terbaik & terakhir.
  let cur = 0, bestWin = 0, bestLoss = 0, lastStreak = 0, lastType = null;
  for (const t of closed.slice().sort((a, b) => (a.ts || "").localeCompare(b.ts || ""))) {
    const type = t.pnl > 0 ? "win" : t.pnl < 0 ? "loss" : "be";
    if (type === lastType && type !== "be") { cur++; } else { cur = type === "be" ? 0 : 1; }
    lastType = type;
    if (type === "win") bestWin = Math.max(bestWin, cur);
    if (type === "loss") bestLoss = Math.max(bestLoss, cur);
  }
  // Streak terakhir (abaikan be).
  lastStreak = 0;
  for (let i = closed.length - 1; i >= 0; i--) {
    const t = closed[i];
    if (t.pnl === 0) continue;
    if (lastStreak === 0) lastType = t.pnl > 0 ? "win" : "loss";
    if ((t.pnl > 0 ? "win" : "loss") !== lastType) break;
    lastStreak += 1;
  }

  return {
    total: closed.length,
    open: trades.length - closed.length,
    win: wins.length,
    loss: losses.length,
    be: be.length,
    winRate: closed.length ? Math.round(winRate) : 0,
    grossWin: Math.round(grossWin),
    grossLoss: Math.round(grossLoss),
    net: Math.round(net),
    avgWin: Math.round(avgWin),
    avgLoss: Math.round(avgLoss),
    expectancy: Math.round(expectancy * 100) / 100,
    profitFactor: profitFactor === Infinity ? "∞" : (Math.round(profitFactor * 100) / 100),
    maxDrawdown: Math.round(maxDD),
    bestWinStreak: bestWin,
    bestLossStreak: bestLoss,
    lastStreak,
    lastStreakType: lastType,
  };
}
