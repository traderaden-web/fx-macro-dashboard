// lib/sessions.js
// Sesi pasar Forex (jam lokal masing-masing bursa) + util perhitungan zona
// waktu yang akurat & sadar DST, memakai Intl API browser.
//
// Jam bursa dipakai (konvensi standar FX):
//   Sydney  09:00–17:00 AEST/AEDT   London 08:00–17:00 GMT/BST
//   Tokyo   09:00–15:00 JST         New York 08:00–17:00 EST/EDT
//
// Fungsi di sini murni (tanpa dependensi) sehingga aman dipanggil dari
// client component setiap detik (jam live) maupun saat SSR.

export const SESSIONS = [
  { id: "sydney", name: "Sydney", tz: "Australia/Sydney", open: 9, close: 17, flag: "🇦🇺" },
  { id: "tokyo", name: "Tokyo", tz: "Asia/Tokyo", open: 9, close: 15, flag: "🇯" },
  { id: "london", name: "London", tz: "Europe/London", open: 8, close: 17, flag: "🇬🇧" },
  { id: "newyork", name: "New York", tz: "America/New_York", open: 8, close: 17, flag: "🇺🇸" },
];

const WIB_OFFSET_MIN = 7 * 60; // Asia/Jakarta selalu UTC+7 (tanpa DST)

function partValues(date, tz) {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const p = {};
    for (const x of fmt.formatToParts(date)) p[x.type] = x.value;
    return {
      h: Number(p.hour) % 24,
      m: Number(p.minute),
      s: Number(p.second),
    };
  } catch {
    return null;
  }
}

/** Offset zona waktu (menit, relatif UTC) pada momen `date` — akurat + sadar DST. */
export function tzOffsetMinutes(date, tz) {
  const tzP = partValues(date, tz);
  const utcP = partValues(date, "UTC");
  if (!tzP || !utcP) return null;
  const tzMin = tzP.h * 60 + tzP.m;
  const utcMin = utcP.h * 60 + utcP.m;
  let diff = tzMin - utcMin;
  if (diff > 720) diff -= 1440; // guard wraparound (mis. +14 vs -11)
  if (diff < -720) diff += 1440;
  return diff;
}

/** Konversi jam lokal zona `tz` → jam WIB (menit 0..1440). */
export function localHourToWIB(date, tz, localHour) {
  const off = tzOffsetMinutes(date, tz);
  if (off == null) return null;
  const min = ((localHour * 60 - off + WIB_OFFSET_MIN) % 1440 + 1440) % 1440;
  return min;
}

function fmtWIB(min) {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Status satu sesi pada `now` (default: sekarang). */
export function sessionStatus(session, now = new Date()) {
  const p = partValues(now, session.tz);
  if (!p) return null;
  const minutes = p.h * 60 + p.m;
  const open = session.open * 60;
  const close = session.close * 60;
  const active = minutes >= open && minutes < close;
  const progress = active ? (minutes - open) / (close - open) : null;

  const openWIB = localHourToWIB(now, session.tz, session.open);
  const closeWIB = localHourToWIB(now, session.tz, session.close);

  // hitung mundur ke buka berikutnya
  let msToOpen;
  if (active) {
    // sisa tutup
    msToOpen = (close - minutes) * 60000;
  } else {
    msToOpen = (open - minutes + 1440) % 1440 * 60000;
    if (msToOpen === 0) msToOpen = (close - open) * 60000;
  }

  return {
    active,
    progress,
    label:
      openWIB != null && closeWIB != null
        ? `${fmtWIB(openWIB)}–${fmtWIB(closeWIB)} WIB`
        : null,
    wibOpen: openWIB != null ? fmtWIB(openWIB) : null,
    wibClose: closeWIB != null ? fmtWIB(closeWIB) : null,
    msToOpen,
    clock: `${String(p.h).padStart(2, "0")}:${String(p.m).padStart(2, "0")}`,
  };
}

/** Jam WIB sekarang (menit + string), update per detik di client. */
export function wibNow(now = new Date()) {
  const p = partValues(now, "Asia/Jakarta");
  if (!p) return null;
  return {
    minutes: p.h * 60 + p.m,
    string: `${String(p.h).padStart(2, "0")}:${String(p.m).padStart(2, "0")}:${String(p.s).padStart(2, "0")} WIB`,
    hour: p.h,
  };
}
