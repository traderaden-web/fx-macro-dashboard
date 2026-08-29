// components/CountUp.jsx
// Animasi angka menghitung dari 0 ke nilai target saat terlihat (di viewport).
"use client";

import { useEffect, useRef, useState } from "react";

export default function CountUp({ value, decimals = 0, duration = 1100, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const target = Number(value) || 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            setDisplay(target * eased);
            if (p < 1) requestAnimationFrame(tick);
            else setDisplay(target);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [value, duration]);

  const format = (n) => n.toLocaleString("id-ID", { maximumFractionDigits: decimals, minimumFractionDigits: 0 });

  return (
    <span ref={ref} className="countup">
      {prefix}{format(display)}{suffix}
    </span>
  );
}
