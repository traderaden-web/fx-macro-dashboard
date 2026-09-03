// app/api/broker/route.js
// GET  /api/broker → status koneksi + data akun (live MetaAPI bila token/akun
//                    tersedia, atau demo/paper portfolio yang ditandai jelas).
// POST /api/broker { token, accountId } → validasi & simpan koneksi, balas data.
// POST /api/broker { action: "disconnect" } → hapus koneksi.

import { NextResponse } from "next/server";
import {
  metaFetchAll, normalizeAccount, normalizePosition, normalizeOrder,
} from "../../../lib/metaapi";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CONFIG_FILE = path.join(process.cwd(), "data", "broker.json");

function loadConfig() {
  const fromEnv = { token: process.env.METAAPI_TOKEN, accountId: process.env.METAAPI_ACCOUNT_ID };
  if (fromEnv.token && fromEnv.accountId) return fromEnv;
  try {
    if (existsSync(CONFIG_FILE)) {
      const c = JSON.parse(readFileSync(CONFIG_FILE, "utf8"));
      if (c.token && c.accountId) return c;
    }
  } catch { /* ignore */ }
  return null;
}
function saveConfig(cfg) {
  try {
    if (!existsSync(path.dirname(CONFIG_FILE))) mkdirSync(path.dirname(CONFIG_FILE), { recursive: true });
    writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2));
  } catch (e) { console.error("[broker] save gagal:", e?.message || e); }
}
function clearConfig() {
  try { if (existsSync(CONFIG_FILE)) writeFileSync(CONFIG_FILE, JSON.stringify({})); } catch { /* ignore */ }
}

// ── Demo / paper portfolio (agar UI hidup bila belum connect) ──
function paperPortfolio() {
  const positions = [
    { symbol: "EUR/USD", direction: "BUY", volume: 0.50, openPrice: 1.0920, currentPrice: 1.0965, stopLoss: 1.0880, takeProfit: 1.1020, profit: 225.0, id: "P-1001" },
    { symbol: "XAU/USD", direction: "BUY", volume: 0.10, openPrice: 2505.6, currentPrice: 2512.4, stopLoss: 2495.0, takeProfit: 2530.0, profit: 68.0, id: "P-1002" },
    { symbol: "GBP/JPY", direction: "SELL", volume: 0.25, openPrice: 201.62, currentPrice: 200.90, stopLoss: 202.40, takeProfit: 199.60, profit: 112.5, id: "P-1003" },
  ];
  const orders = [
    { symbol: "USD/JPY", direction: "BUY", volume: 0.10, openPrice: 156.30, stopLoss: 155.90, takeProfit: 157.20, id: "O-2001" },
  ];
  const info = {
    balance: 10000,
    equity: 10405.5,
    margin: 750.0,
    freeMargin: 9655.5,
    marginLevel: 1387.4,
    unrealizedProfit: 405.5,
    currency: "USD",
    platform: "MT5",
    broker: "Demo (Paper)",
    login: 12345678,
  };
  return { connected: false, demo: true, info, positions, orders, updated: new Date().toISOString() };
}

const THROW = (e) => { throw e; };

export async function GET() {
  const cfg = loadConfig();
  if (!cfg) return NextResponse.json({ ok: true, ...paperPortfolio() });

  try {
    const data = await metaFetchAll(cfg.token, cfg.accountId);
    return NextResponse.json({
      ok: true,
      connected: true,
      demo: false,
      info: normalizeAccount(data.info),
      positions: (data.positions || []).map(normalizePosition),
      orders: (data.orders || []).map(normalizeOrder),
      updated: new Date().toISOString(),
    });
  } catch (e) {
    // Bila gagal konek (token salah / akun off), tampilkan error + fallback demo.
    return NextResponse.json({
      ok: false, connected: false, demo: true, error: String(e?.message || e),
      info: null, positions: [], orders: [], updated: new Date().toISOString(),
    }, { status: 502 });
  }
}

export async function POST(req) {
  let body = {};
  try { body = await req.json(); } catch { /* no-op */ }

  if (body.action === "disconnect") {
    clearConfig();
    return NextResponse.json({ ok: true, ...paperPortfolio() });
  }

  const { token, accountId } = body;
  if (!token || !accountId) {
    return NextResponse.json({ ok: false, error: "token & accountId wajib diisi" }, { status: 400 });
  }

  // Validasi koneksi sebelum menyimpan.
  try {
    const data = await metaFetchAll(token, accountId);
    saveConfig({ token, accountId });
    return NextResponse.json({
      ok: true, connected: true, demo: false,
      info: normalizeAccount(data.info),
      positions: (data.positions || []).map(normalizePosition),
      orders: (data.orders || []).map(normalizeOrder),
      updated: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 502 });
  }
}
