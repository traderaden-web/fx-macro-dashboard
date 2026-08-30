// components/TermClock.jsx
// Jam WIB (Asia/Jakarta) tick-per-detik, gaya mono terminal.
// SSR-safe: server me-render placeholder "--:--:--" (tanpa mismatch).
"use client";

import { useEffect, useState } from "react";

const FMT = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export default function TermClock({ suffix = "WIB" }) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="term-clock mono">
      {now ? FMT.format(now) : "--:--:--"} {suffix}
    </span>
  );
}
