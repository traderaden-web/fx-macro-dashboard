// components/Icons.jsx
// Pustaka ikon line-stroke (SVG) yang konsisten — tanpa warna/emoji.
// Warna mengikuti `currentColor`, jadi otomatis menyesuaikan konteks.
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconHome({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...base} d="M3 9.5 12 3l9 6.5" />
      <path {...base} d="M5 8.5V21h14V8.5" />
      <path {...base} d="M9 21v-6h6v6" />
    </svg>
  );
}

export function IconAnalytics({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...base} d="M3 3v18h18" />
      <path {...base} d="M7 15.5l4-4 3 3 5-6" />
      <path {...base} d="M19 8.5h-2.5M19 8.5V11" />
    </svg>
  );
}

export function IconCalendar({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect {...base} x="3" y="4.5" width="18" height="16" rx="2" />
      <path {...base} d="M3 9.5h18M8 2.5v4M16 2.5v4" />
      <path {...base} d="M8 13.5h3M8 16.5h3" />
    </svg>
  );
}

export function IconIndicators({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...base} d="M3 12h3l3-8 6 16 3-8h3" />
    </svg>
  );
}

export function IconLearn({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...base} d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z" />
      <path {...base} d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

export function IconSearch({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle {...base} cx="11" cy="11" r="7" />
      <path {...base} d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function IconFlag({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...base} d="M5 3v18" />
      <path {...base} d="M5 4h13l-2.5 4 2.5 4H5" />
    </svg>
  );
}

export function IconGlobe({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle {...base} cx="12" cy="12" r="9" />
      <path {...base} d="M3 12h18" />
      <path {...base} d="M12 3c2.6 2.5 2.6 15.5 0 18M12 3c-2.6 2.5-2.6 15.5 0 18" />
    </svg>
  );
}

export function IconLightbulb({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...base} d="M9 18h6" />
      <path {...base} d="M10 22h4" />
      <path {...base} d="M12 2a7 7 0 0 0-4 12.6c.8.6 1.3 1.5 1.4 2.4h5.2c.1-.9.6-1.8 1.4-2.4A7 7 0 0 0 12 2z" />
    </svg>
  );
}

export function IconTarget({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle {...base} cx="12" cy="12" r="8" />
      <circle {...base} cx="12" cy="12" r="3" />
      <path {...base} d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  );
}

export function IconChart({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...base} d="M3 3v18h18" />
      <rect {...base} x="7" y="12" width="3" height="6" rx="0.5" />
      <rect {...base} x="12" y="8" width="3" height="10" rx="0.5" />
      <rect {...base} x="17" y="5" width="3" height="13" rx="0.5" />
    </svg>
  );
}

export function IconNews({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...base} d="M4 5h13v14a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2z" />
      <path {...base} d="M17 8h2.5a1 1 0 0 1 1 1V18a2 2 0 0 1-2 2H17" />
      <path {...base} d="M8 9h5M8 12.5h5M8 16h3" />
    </svg>
  );
}

export function IconCalculator({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect {...base} x="5" y="3" width="14" height="18" rx="2" />
      <path {...base} d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
    </svg>
  );
}

export function IconGauge({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...base} d="M4 15a8 8 0 1 1 16 0" />
      <path {...base} d="M12 15 16 9" />
      <circle {...base} cx="12" cy="15" r="1.5" />
    </svg>
  );
}

export function IconWallet({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect {...base} x="3" y="6" width="18" height="14" rx="2" />
      <path {...base} d="M3 10h18" />
      <circle {...base} cx="16" cy="14" r="1.4" />
    </svg>
  );
}

export function IconSend({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...base} d="M22 2 11 13" />
      <path {...base} d="M22 2 15 22l-4-9-9-4z" />
    </svg>
  );
}

export function IconScan({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...base} d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
      <path {...base} d="M4 12h16" />
    </svg>
  );
}

export function IconUsers({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle {...base} cx="9" cy="8" r="3.5" />
      <path {...base} d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path {...base} d="M17 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-6.5-6.5" />
    </svg>
  );
}

export function IconBook({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path {...base} d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
      <path {...base} d="M19 19v2H6a2 2 0 0 1-2-2" />
      <path {...base} d="M9 7h6M9 11h6" />
    </svg>
  );
}
