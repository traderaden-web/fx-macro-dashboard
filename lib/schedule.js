// lib/schedule.js
// Utilitas jadwal & zona waktu yang dipakai bersama oleh data/calendar.js,
// lib/consensus.js, lib/calendar-data.js dan skrip cron.
//
//  • Konversi waktu lokal suatu zona (ET / WIB) ↔ UTC dengan Intl (DST otomatis,
//    tanpa dependensi).
//  • Aturan "periode observasi" (obs) untuk sebuah tanggal rilis: NFP yang rilis
//    4 Sep = data Agustus, klaim mingguan Kamis = minggu berakhir Sabtu sebelumnya,
//    GDP akhir Agustus = kuartal II, dst. Aturan ini yang membuat rilis baru bisa
//    dicocokkan OTOMATIS ke titik FRED tanpa mengetik `obs` satu per satu.
//  • Estimasi tanggal rilis dari sebuah periode (kebalikan aturan di atas) untuk
//    titik FRED yang belum punya baris rilis.

export const TZ_WIB = "Asia/Jakarta";
export const TZ_ET = "America/New_York";

const pad = (n) => String(n).padStart(2, "0");

function partsInZone(date, tz) {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const o = {};
  for (const p of f.formatToParts(date)) if (p.type !== "literal") o[p.type] = p.value;
  return { y: +o.year, m: +o.month, d: +o.day, hh: +o.hour % 24, mm: +o.minute, ss: +o.second };
}

/** Waktu lokal (dateStr "YYYY-MM-DD", timeStr "HH:MM") di zona `tz` → Date (UTC). */
export function zonedTimeToUtc(dateStr, timeStr, tz) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = (timeStr || "00:00").split(":").map(Number);
  const target = Date.UTC(y, m - 1, d, hh, mm, 0);
  let guess = target;
  for (let i = 0; i < 3; i++) {
    const p = partsInZone(new Date(guess), tz);
    const asLocal = Date.UTC(p.y, p.m - 1, p.d, p.hh, p.mm, p.ss);
    if (asLocal === target) break;
    guess -= asLocal - target;
  }
  return new Date(guess);
}

/** Date → {date, time, iso} dalam WIB (UTC+7, tanpa DST). */
export function toWib(date) {
  const p = partsInZone(date, TZ_WIB);
  const d = `${p.y}-${pad(p.m)}-${pad(p.d)}`;
  const t = `${pad(p.hh)}:${pad(p.mm)}`;
  return { date: d, time: t, iso: `${d}T${t}:00+07:00` };
}

/** Waktu ET (mis. jadwal BLS 08:30) → WIB. DST Amerika dihitung otomatis. */
export function etToWib(dateStr, timeStr) {
  return toWib(zonedTimeToUtc(dateStr, timeStr, TZ_ET));
}

/** Tanggal hari ini (YYYY-MM-DD) menurut WIB. */
export function todayWib(now = new Date()) {
  return toWib(now).date;
}

// ---------------------------------------------------------------------------
// Aturan periode observasi
// ---------------------------------------------------------------------------

function ym(y, m) {
  return `${y}-${pad(m)}-01`;
}
export function shiftMonth(dateStr, months) {
  const [y, m] = dateStr.split("-").map(Number);
  const total = y * 12 + (m - 1) + months;
  return ym(Math.floor(total / 12), (total % 12) + 1);
}
function addDays(dateStr, n) {
  const dt = new Date(`${dateStr}T00:00:00Z`);
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}
function dow(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay(); // 0=Min … 6=Sab
}

/** Aturan default per frekuensi; bisa ditimpa lewat `def.obsRule`. */
export function obsRuleFor(def) {
  if (def?.obsRule) return def.obsRule;
  if (def?.freq === "W") return "prev-week";
  if (def?.freq === "Q") return "prev-quarter";
  if (def?.freq === "D") return "same-month";
  return "prev-month";
}

/** Hari libur federal AS yang relevan utk jadwal Kamis (klaim pengangguran). */
export function isUsHoliday(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (m === 1 && d === 1) return true; // Tahun Baru
  if (m === 6 && d === 19) return true; // Juneteenth
  if (m === 7 && d === 4) return true; // Hari Kemerdekaan
  if (m === 12 && d === 25) return true; // Natal
  if (m === 11 && dow(dateStr) === 4 && d >= 22 && d <= 28) return true; // Thanksgiving (Kamis ke-4)
  return false;
}

/**
 * Periode data (kunci titik FRED, "YYYY-MM-DD") untuk rilis pada `releaseDate` (WIB).
 *   prev-month   : rilis bulan M → data bulan M-1 (NFP, CPI, PPI, Retail, PCE, ISM, ADP…)
 *   same-month   : rilis bulan M → data bulan M (FOMC / rata-rata bulanan seri harian)
 *   prev-quarter : rilis di kuartal Q → data kuartal Q-1 (GDP advance/prelim/final)
 *   prev-week    : rilis Kamis → minggu yang berakhir Sabtu sebelumnya (Initial Claims)
 *   adp          : ADP (2 hari kerja sebelum NFP) → bulan data NFP yang mengikutinya
 */
export function obsForRelease(def, releaseDate) {
  const rule = obsRuleFor(def);
  const [y, m, d] = releaseDate.slice(0, 10).split("-").map(Number);
  if (rule === "same-month") return ym(y, m);
  if (rule === "prev-quarter") {
    const qStart = Math.floor((m - 1) / 3) * 3 + 1;
    return shiftMonth(ym(y, qStart), -3);
  }
  if (rule === "prev-week") {
    const base = `${y}-${pad(m)}-${pad(d)}`;
    const w = dow(base);
    const back = w === 6 ? 7 : w + 1; // Kamis(4) → 5 hari ke Sabtu sebelumnya
    return addDays(base, -back);
  }
  if (rule === "adp") {
    // ADP terbit 2 hari kerja sebelum NFP: 30 Sep → data September, 4 Nov → data Oktober.
    // Bulan data = bulan sebelum bulan (tanggal rilis + 4 hari).
    const anchor = addDays(`${y}-${pad(m)}-${pad(d)}`, 4);
    return shiftMonth(`${anchor.slice(0, 7)}-01`, -1);
  }
  return shiftMonth(ym(y, m), -1);
}

/**
 * Perkiraan tanggal rilis (WIB) untuk periode `obs`. Bila ada event kalender
 * (`events` = UPCOMING) yang periode-nya cocok, tanggal event dipakai
 * (estimated=false); jika tidak, pakai pola tipikal (estimated=true).
 */
export function estimateReleaseDate(def, obs, events = []) {
  const hit = events.find((e) => e.indicatorId === def.id && obsForRelease(def, e.date) === obs);
  if (hit) return { date: hit.date, estimated: false };

  const rule = obsRuleFor(def);
  const day = Math.min(Math.max(def.typicalDay || 12, 1), 28);
  if (rule === "prev-week") return { date: addDays(obs, 5), estimated: true }; // Sabtu → Kamis berikutnya
  if (rule === "adp") return { date: `${shiftMonth(obs, 1).slice(0, 8)}${pad(day)}`, estimated: true };
  if (rule === "prev-quarter") return { date: `${shiftMonth(obs, 3).slice(0, 8)}${pad(Math.max(day, 25))}`, estimated: true };
  if (rule === "same-month") {
    const next = shiftMonth(obs, 1);
    return { date: addDays(next, -1), estimated: true }; // akhir bulan
  }
  return { date: `${shiftMonth(obs, 1).slice(0, 8)}${pad(day)}`, estimated: true };
}

/** Kembalikan tanggal (YYYY-MM-DD) n periode sebelum `date` untuk frekuensi def. */
export function shiftPeriods(def, date, n) {
  if (def?.freq === "W") return addDays(date, 7 * n);
  if (def?.freq === "Q") return shiftMonth(date, 3 * n);
  return shiftMonth(date, n);
}

// ---------------------------------------------------------------------------
// Pembangkit jadwal otomatis (dipakai data/calendar.js)
// ---------------------------------------------------------------------------

/** Semua tanggal `weekday` (0-6) antara from..to (inklusif). */
export function weekdaysBetween(from, to, weekday) {
  const out = [];
  let cur = from;
  while (dow(cur) !== weekday) cur = addDays(cur, 1);
  while (cur <= to) {
    out.push(cur);
    cur = addDays(cur, 7);
  }
  return out;
}

/** Jumat ke-n (1-based) pada bulan "YYYY-MM". */
export function nthWeekdayOfMonth(yyyyMm, weekday, n) {
  let cur = `${yyyyMm}-01`;
  while (dow(cur) !== weekday) cur = addDays(cur, 1);
  return addDays(cur, 7 * (n - 1));
}

/** Geser ke hari kerja terdekat setelahnya bila jatuh di akhir pekan. */
export function toBusinessDay(dateStr) {
  let cur = dateStr;
  while (dow(cur) === 0 || dow(cur) === 6) cur = addDays(cur, 1);
  return cur;
}

export { addDays };
