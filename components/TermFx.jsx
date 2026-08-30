// components/TermFx.jsx
// Lapisan efek global "terminal" (client-only, nol dependensi):
//  1. term-glow    — pendar emas lembut yang mengikuti kursor (blend screen).
//  2. term-scanline — pita cahaya menyapu layar pelan (CSS).
// Kedua elemen pointer-events:none, diabaikan saat prefers-reduced-motion.
"use client";

import { useEffect, useRef } from "react";

export default function TermFx() {
  const glowRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = glowRef.current;
    if (!el) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight * 0.35;
    let tx = x;
    let ty = y;
    let raf = null;
    let running = true;

    const loop = () => {
      if (!running) return;
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      el.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
      const idle = Math.abs(tx - x) < 0.4 && Math.abs(ty - y) < 0.4;
      el.style.opacity = idle ? 0 : 1;
      if (!idle) raf = requestAnimationFrame(loop);
      else raf = null;
    };

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) {
        el.style.opacity = 1;
        raf = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      running = false;
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="term-glow" ref={glowRef} aria-hidden="true" />
      <div className="term-scanline" aria-hidden="true" />
    </>
  );
}
