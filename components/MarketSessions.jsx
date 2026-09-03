// components/MarketSessions.jsx
// Strip sesi pasar Forex secara live (Sydney, Tokyo, London, New York) dengan
// jam WIB & progress tiap sesi. Di-update tiap detik (client component).

"use client";

import { useEffect, useState } from "react";
import { SESSIONS, sessionStatus } from "../lib/sessions";

export default function MarketSessions() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const activeCount = now
    ? SESSIONS.filter((s) => sessionStatus(s, now)?.active).length
    : 0;

  return (
    <div className="sessions">
      <div className="sessions-head">
        <span className="sessions-title">
          <span className="pulse-dot" /> Sesi Pasar
        </span>
        <span className="sessions-clock">
          {now
            ? new Intl.DateTimeFormat("id-ID", {
                timeZone: "Asia/Jakarta",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              }).format(now)
            : "—"}{" "}
          WIB
        </span>
      </div>
      <div className="sessions-grid">
        {SESSIONS.map((s) => {
          const st = now ? sessionStatus(s, now) : null;
          const open = st?.active;
          const progress = st?.progress ? Math.min(100, Math.max(0, st.progress * 100)) : 0;
          return (
            <div className={`session ${open ? "open" : "closed"}`} key={s.id}>
              <div className="session-top">
                <span className="session-flag">{s.flag}</span>
                <span className="session-name">{s.name}</span>
                <span className={`session-state ${open ? "open" : "closed"}`}>
                  {open ? "BUKA" : "TUTUP"}
                </span>
              </div>
              <div className="session-time mono">{st?.label || "—"}</div>
              <div className="session-track">
                <div
                  className={`session-fill ${open ? "open" : "closed"}`}
                  style={{ width: `${open ? progress : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="sessions-foot cell-muted">
        {activeCount > 0 ? `${activeCount} sesi sedang buka` : "Pasar sedang tutup (weekend/jeda)"}
        <span> · Volatilitas tertinggi saat London ↔ New York overlap</span>
      </div>
    </div>
  );
}
