// lib/metaapi.js
// Klien MetaAPI Cloud (REST) untuk sinkronisasi posisi nyata dari akun
// MetaTrader (MT4/MT5). Memakai `fetch` bawaan — tanpa dependensi tambahan.
//
// Autentikasi: header `auth-token: <token>` (bukan bearer).
// Region dapat dipilih via env METAAPI_REGION (default "new-york").
// Base per region: https://mt-client-api-v1.{region}.agiliumtrade.ai
//
// PENTING: modul ini hanya berfungsi READ (baca informasi & posisi). Tidak ada
// eksekusi order otomatis untuk mencegah trade nyata tanpa konfirmasi pengguna.
// Bila token/akun tidak dikonfigurasi, pemanggil memakai fallback demo/paper.

const REGION = process.env.METAAPI_REGION || "new-york";
const BASE = `https://mt-client-api-v1.${REGION}.agiliumtrade.ai`;
const TIMEOUT = 12000;

async function withTimeout(p, ms = TIMEOUT) {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("MetaAPI timeout")), ms))]);
}

async function apiGet(path, token) {
  const res = await withTimeout(fetch(`${BASE}${path}`, {
    headers: { "auth-token": token, Accept: "application/json" },
    cache: "no-store",
  }));
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`MetaAPI HTTP ${res.status}${body ? `: ${body.slice(0, 200)}` : ""}`);
  }
  return res.json();
}

/** Daftar akun yang dapat diakses dengan token. */
export async function metaListAccounts(token) {
  // Endpoint provisioning untuk mencantumkan akun.
  const res = await withTimeout(fetch(`https://trade.metaapi.cloud/users/current/accounts`, {
    headers: { auth: token, Accept: "application/json" },
    cache: "no-store",
  }));
  if (!res.ok) {
    // Fallback ke endpoint client bila provisioning gagal (beberapa token).
    const alt = await apiGet("/users/current/accounts", token).catch(() => null);
    if (alt) return alt;
    throw new Error(`MetaAPI list accounts HTTP ${res.status}`);
  }
  return res.json();
}

/** Informasi akun: balance, equity, margin, free margin, margin level, P/L. */
export async function metaAccountInformation(token, accountId) {
  return apiGet(`/users/current/accounts/${accountId}/account-information`, token);
}

/** Posisi terbuka. */
export async function metaPositions(token, accountId) {
  return apiGet(`/users/current/accounts/${accountId}/positions`, token);
}

/** Order tertunda (pending orders). */
export async function metaOrders(token, accountId) {
  return apiGet(`/users/current/accounts/${accountId}/orders`, token);
}

/** Ambil semua data akun sekaligus (dipakai halaman /broker). */
export async function metaFetchAll(token, accountId) {
  const [info, positions, orders] = await Promise.all([
    metaAccountInformation(token, accountId),
    metaPositions(token, accountId),
    metaOrders(token, accountId),
  ]);
  return { info, positions, orders };
}

// ── Normalisasi hasil MetaAPI → bentuk yang konsisten untuk UI ──
export function normalizeAccount(info) {
  return {
    balance: info?.balance,
    equity: info?.equity,
    margin: info?.margin,
    freeMargin: info?.freeMargin,
    marginLevel: info?.marginLevel,
    unrealizedProfit: info?.profit ?? info?.unrealizedProfit,
    currency: info?.currency,
    platform: info?.platform,
    broker: info?.broker,
    login: info?.login,
  };
}
export function normalizePosition(p) {
  return {
    id: p?.id,
    symbol: p?.symbol,
    type: p?.type, // "POSITION_TYPE_BUY" | "POSITION_TYPE_SELL" | 0/1
    direction: /SELL|1/.test(String(p?.type)) ? "SELL" : "BUY",
    volume: p?.volume,
    currentPrice: p?.currentPrice ?? p?.price,
    openPrice: p?.openPrice,
    takeProfit: p?.takeProfit,
    stopLoss: p?.stopLoss,
    profit: p?.profit,
    openTime: p?.openTime,
    comment: p?.comment,
  };
}
export function normalizeOrder(o) {
  return {
    id: o?.id,
    symbol: o?.symbol,
    type: o?.type,
    direction: /SELL|1/.test(String(o?.type)) ? "SELL" : "BUY",
    volume: o?.volume,
    openPrice: o?.openPrice,
    stopLoss: o?.stopLoss,
    takeProfit: o?.takeProfit,
    currentPrice: o?.currentPrice ?? o?.price,
    time: o?.time,
  };
}
