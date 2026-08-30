// components/BootScreen.jsx
// Boot screen terminal penuh untuk halaman Beranda:
// urutan "BIOS" diketik baris per baris (label + status OK/READY),
// progress bar, CRT scanline + flicker.
//  • Klik / ketik apa pun = lewati (semua baris langsung terisi).
//  • Kunjungan berikutnya dalam sesi = replay kilat (±400 ms).
//  • prefers-reduced-motion = tidak ditampilkan sama sekali.
"use client";

import { useEffect, useRef, useState } from "react";

const LINES = [
  { label: "MACROLAB BIOS v2.2.1 — (C) 2026 AD TRADER FOREX", status: "" },
  { label: "CPU   NEXT.JS 15.5 / REACT 19.2 ...............", status: "OK" },
  { label: "MEM   27 SERI FRED + KALENDER RILIS ............", status: "OK" },
  { label: "MOUNT /dev/fred + /dev/forexfactory ............", status: "OK" },
  { label: "SYNC  JADWAL BLS / FOMC / ECB / BOJ ............", status: "OK" },
  { label: "CALIB MATRIX PAIR FX (14 PAIR MAJOR + CROSS) ...", status: "OK" },
  { label: "LOAD  MODUL ANALISIS / CHART / PETA MAKRO ......", status: "OK" },
  { label: "RENDER TERMINAL UI v2.2 ........................", status: "READY" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function BootScreen() {
  const [state, setState] = useState({ idx: 0, typed: 0, done: false });
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setState((s) => ({ ...s, done: true }));
      return undefined;
    }

    let seen = false;
    try {
      seen = sessionStorage.getItem("ml_boot") === "1";
    } catch {
      seen = false;
    }
    let skip = false;
    const onSkip = () => {
      skip = true;
    };
    window.addEventListener("keydown", onSkip);
    window.addEventListener("mousedown", onSkip);
    window.addEventListener("touchstart", onSkip, { passive: true });

    (async () => {
      if (seen) {
        // replay kilat untuk kunjungan berikutnya dalam sesi
        await sleep(380);
        if (aliveRef.current) setState((s) => ({ ...s, idx: LINES.length, typed: 1, done: true }));
        return;
      }
      try {
        sessionStorage.setItem("ml_boot", "1");
      } catch {
        /* abaikan */
      }

      for (let i = 0; i < LINES.length; i++) {
        if (!aliveRef.current) return;
        if (skip) break;
        setState((s) => ({ idx: i, typed: 0, done: false }));
        const label = LINES[i].label;
        for (let c = 1; c <= label.length; c++) {
          if (!aliveRef.current) return;
          if (skip) break;
          setState((s) => (s.idx === i ? { ...s, typed: c } : s));
          await sleep(7);
        }
        if (skip) break;
        await sleep(40);
      }
      // isi penuh (normal atau lewat skip)
      if (aliveRef.current) setState({ idx: LINES.length, typed: 1, done: false });
      await sleep(skip ? 120 : 550);
      if (aliveRef.current) setState((s) => ({ ...s, done: true }));
    })();

    return () => {
      aliveRef.current = false;
      window.removeEventListener("keydown", onSkip);
      window.removeEventListener("mousedown", onSkip);
      window.removeEventListener("touchstart", onSkip);
    };
  }, []);

  if (state.done) return null;
  const progress = Math.min(((state.idx + (state.idx < LINES.length ? state.typed / LINES[state.idx].label.length : 0)) / LINES.length) * 100, 100);

  return (
    <div className="boot-overlay" role="status" aria-label="Memuat terminal MacroLab">
      <div className="boot-crt" aria-hidden="true" />
      <div className="boot-body">
        <div className="boot-title mono">MACROLAB // BOOT SEQUENCE</div>
        <pre className="boot-lines mono">
          {LINES.map((l, i) => {
            const full = state.idx > i || (state.idx === LINES.length);
            const cur = state.idx === i;
            return (
              <span key={i} className="boot-line">
                <span>{full ? l.label : cur ? l.label.slice(0, state.typed) : " "}</span>
                {full && l.status && (
                  <b className={`boot-status ${l.status === "READY" ? "ready" : ""}`}> {l.status}</b>
                )}
                {cur && <span className="hp-cur">▮</span>}
              </span>
            );
          })}
        </pre>
        <div className="boot-bar" aria-hidden="true">
          <i style={{ width: `${progress}%` }} />
        </div>
        <div className="boot-hint mono">KLIK / TEKAN TOMBOL UNTUK LEWATI</div>
      </div>
    </div>
  );
}
