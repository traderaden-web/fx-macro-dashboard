var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// .smoke49-entry.jsx
var smoke49_entry_exports = {};
__export(smoke49_entry_exports, {
  default: () => App
});
module.exports = __toCommonJS(smoke49_entry_exports);
var import_react4 = require("react");
var import_react5 = require("react");

// components/IndicatorClient.jsx
var import_react3 = require("react");

// .smoke49-linkstub.jsx
var import_jsx_runtime = require("react/jsx-runtime");
function Link({ href, children, ...rest }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { href, ...rest, children });
}

// components/Chart.jsx
var import_react = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
function Chart({ points, height = 260, color = "#38bdf8", unit = "", decimals = 2 }) {
  const ref = (0, import_react.useRef)(null);
  const [dims, setDims] = (0, import_react.useState)({ w: 800, h: height });
  const [hover, setHover] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    const node = ref.current;
    if (!node) return;
    const ro = new ResizeObserver((entries) => {
      const w2 = entries[0]?.contentRect?.width || 800;
      setDims({ w: w2, h: height });
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, [height]);
  const data = (points || []).map((p) => ({ ...p, v: typeof p.value === "number" ? p.value : null })).filter((p) => p.v !== null);
  if (!data.length) {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { ref, className: "chart-empty", style: { height }, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: "Tidak ada data untuk ditampilkan" }) });
  }
  const { w, h } = dims;
  const pad = { top: 22, right: 18, bottom: 28, left: 46 };
  const iw = w - pad.left - pad.right;
  const ih = h - pad.top - pad.bottom;
  const values = data.map((d) => d.v);
  let min = Math.min(...values);
  let max = Math.max(...values);
  const range = max - min || 1;
  min -= range * 0.12;
  max += range * 0.12;
  const span = max - min;
  const step = iw / Math.max(data.length - 1, 1);
  const x = (i) => pad.left + i * step;
  const y = (v) => pad.top + ih - (v - min) / span * ih;
  const path = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.v).toFixed(1)}`).join(" ");
  const area = `${path} L ${x(data.length - 1).toFixed(1)} ${pad.top + ih} L ${x(0).toFixed(1)} ${pad.top + ih} Z`;
  const fmt2 = (v) => {
    const n = Number(v);
    if (isNaN(n)) return "\u2014";
    return n.toLocaleString("id-ID", { maximumFractionDigits: decimals, minimumFractionDigits: 0 });
  };
  const nTicks = 5;
  const ticks = Array.from({ length: nTicks }, (_, i) => min + span * i / (nTicks - 1));
  const maxLabels = Math.max(2, Math.floor(iw / 64));
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.min(7, maxLabels)));
  let hx = null, hy = null, hd = null;
  if (hover !== null && data[hover]) {
    hx = x(hover);
    hy = y(data[hover].v);
    hd = data[hover];
  }
  const gradId = "areaGrad";
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { ref, className: "chart-wrap", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("svg", { width: w, height: h, viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: "none", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("linearGradient", { id: gradId, x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("stop", { offset: "0%", stopColor: color, stopOpacity: "0.32" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("stop", { offset: "100%", stopColor: color, stopOpacity: "0.02" })
      ] }) }),
      ticks.map((t, i) => {
        const yy = y(t);
        return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("g", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: pad.left, y1: yy, x2: w - pad.right, y2: yy, className: "chart-grid" }),
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("text", { x: pad.left - 8, y: yy + 4, className: "chart-tick", textAnchor: "end", children: fmt2(t) })
        ] }, i);
      }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: area, fill: `url(#${gradId})` }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: path, fill: "none", stroke: color, strokeWidth: "2.2", strokeLinejoin: "round", strokeLinecap: "round" }),
      data.map(
        (d, i) => i % labelEvery === 0 || i === data.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("text", { x: x(i), y: h - 8, className: "chart-tick", textAnchor: "middle", children: d.date.slice(0, 7) }, i) : null
      ),
      hover !== null && hd && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("g", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: hx, y1: pad.top, x2: hx, y2: pad.top + ih, className: "chart-hover-line" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("circle", { cx: hx, cy: hy, r: "4.5", fill: color, stroke: "#0b1220", strokeWidth: "2" })
      ] })
    ] }),
    hover !== null && hd && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "chart-tooltip", style: { left: Math.min(hx, w - 170), top: Math.max(hy - 40, 4) }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "tt-date", children: hd.date }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "tt-value", children: [
        fmt2(hd.v),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { children: unit })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "div",
      {
        style: { position: "absolute", inset: 0 },
        onMouseMove: (e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const rel = e.clientX - rect.left;
          const idx = Math.round((rel - pad.left) / step);
          if (idx >= 0 && idx < data.length) setHover(idx);
        },
        onMouseLeave: () => setHover(null)
      }
    )
  ] });
}

// components/Icons.jsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
function IconFlag({ size = 16 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { ...base, d: "M5 3v18" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { ...base, d: "M5 4h13l-2.5 4 2.5 4H5" })
  ] });
}
function IconGlobe({ size = 16 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("circle", { ...base, cx: "12", cy: "12", r: "9" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { ...base, d: "M3 12h18" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { ...base, d: "M12 3c2.6 2.5 2.6 15.5 0 18M12 3c-2.6 2.5-2.6 15.5 0 18" })
  ] });
}

// components/Badges.jsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function ImpactBadge({ level }) {
  const map = {
    High: { c: "#fb7185", bg: "rgba(251,113,133,0.16)" },
    Medium: { c: "#fbbf24", bg: "rgba(251,191,36,0.16)" },
    Low: { c: "#34d399", bg: "rgba(52,211,153,0.16)" }
  };
  const s = map[level] || map.Low;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "badge impact", style: { color: s.c, background: s.bg }, children: level });
}
function CategoryBadge({ id, label, color }) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "badge cat", style: { color, background: `${color}22` }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dot", style: { background: color } }),
    label
  ] });
}
var CODE_LABEL = {
  US: "US",
  EZ: "EU",
  UK: "UK",
  JP: "JP",
  CN: "CN",
  AU: "AU",
  CA: "CA",
  CH: "CH",
  NZ: "NZ",
  GL: "GL"
};
function CountryFlag({ code, size = 16, showCode = true, className = "" }) {
  const label = CODE_LABEL[code] || code || "GL";
  const isGlobal = code === "GL";
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: `country-tag ${isGlobal ? "global" : ""} ${className}`, children: [
    isGlobal ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IconGlobe, { size }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IconFlag, { size }),
    showCode && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "country-code", children: label })
  ] });
}

// components/TermClock.jsx
var import_react2 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var FMT = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
function TermClock({ suffix = "WIB" }) {
  const [now, setNow] = (0, import_react2.useState)(null);
  (0, import_react2.useEffect)(() => {
    setNow(/* @__PURE__ */ new Date());
    const t = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(t);
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: "term-clock mono", children: [
    now ? FMT.format(now) : "--:--:--",
    " ",
    suffix
  ] });
}

// lib/format.js
function fmt(v, decimals = 2) {
  if (v === null || v === void 0 || isNaN(v)) return "\u2014";
  return Number(v).toLocaleString("id-ID", { maximumFractionDigits: decimals, minimumFractionDigits: 0 });
}

// components/IndicatorClient.jsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
function useNow() {
  const [now, setNow] = (0, import_react3.useState)(null);
  (0, import_react3.useEffect)(() => {
    setNow(/* @__PURE__ */ new Date());
    const t = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(t);
  }, []);
  return now;
}
function usePrefersReducedMotion() {
  const [reduced, setReduced] = (0, import_react3.useState)(false);
  (0, import_react3.useEffect)(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", fn);
    return () => mq.removeEventListener?.("change", fn);
  }, []);
  return reduced;
}
function fmtCountdown(ms) {
  if (ms <= 0) return "SEKARANG";
  const s = Math.floor(ms / 1e3);
  const d = Math.floor(s / 86400);
  const h = Math.floor(s % 86400 / 3600);
  const m = Math.floor(s % 3600 / 60);
  const ss = s % 60;
  if (d > 0) return `T-${d}d ${h}j ${m}m`;
  if (h > 0) return `T-${h}j ${m}m ${String(ss).padStart(2, "0")}s`;
  return `T-${m}m ${String(ss).padStart(2, "0")}s`;
}
function fmtDay(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function CountUp({ value, decimals = 1, prefix = "" }) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = (0, import_react3.useState)(null);
  (0, import_react3.useEffect)(() => {
    if (reduced || value === null || value === void 0) {
      setShown(value);
      return;
    }
    let raf = null;
    const t0 = performance.now();
    const dur = 900;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setShown(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduced]);
  if (shown === null || shown === void 0) return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { children: [
    prefix,
    "\u2014"
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { children: [
    prefix,
    fmt(shown, decimals)
  ] });
}
function SurpriseGauge({ idx, tol = 0.5, scale = 1 }) {
  if (idx === null || idx === void 0 || isNaN(idx)) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "ind-gauge", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-gauge-none mono", children: "SURPRISE INDEX BELUM TERSEDIA" }) });
  }
  const clamped = Math.max(-100, Math.min(100, idx));
  const pos = 50 + clamped / 2;
  const tolPct = Math.min(30, tol / scale * 50);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-gauge", role: "img", "aria-label": `Surprise index ${idx}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-gauge-track", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", { className: "zone miss", style: { left: 0, width: 50 - tolPct } }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", { className: "zone inline", style: { left: 50 - tolPct, width: tolPct * 2 } }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", { className: "zone beat", style: { left: 50 + tolPct, width: 50 - tolPct } }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-gauge-center", "aria-hidden": "true" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-gauge-needle", style: { left: `${pos}%` }, "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("b", { children: [
        idx > 0 ? "+" : "",
        idx.toFixed(1)
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-gauge-scale mono", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "MISS (di bawah konsensus)" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "SURPRISE INDEX" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "BEAT (di atas konsensus)" })
    ] })
  ] });
}
var DIR_TXT = { up: "\u25B2", down: "\u25BC", flat: "\u2014" };
function EduTab({ edu, general }) {
  const tabs = [
    { id: "read", label: "CARA MEMBACA" },
    ...edu.forecast ? [{ id: "forecast", label: "PERKIRAAN RILIS" }] : [],
    { id: "outlook", label: "PROSPEK" },
    { id: "drivers", label: "PENGERAK" },
    ...edu.expertViews?.length ? [{ id: "experts", label: "PAKAR" }] : []
  ];
  const [tab, setTab] = (0, import_react3.useState)("read");
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-edu", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "ind-edu-tabs", role: "tablist", children: tabs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { role: "tab", "aria-selected": tab === t.id, className: `cal-chip ind-edu-tab ${tab === t.id ? "on" : ""}`, onClick: () => setTab(t.id), children: t.label }, t.id)) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-edu-panel", children: [
      tab === "read" && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("ol", { className: "ind-steps mono", children: edu.read.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("li", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: String(i + 1).padStart(2, "0") }),
        p
      ] }, i)) }),
      tab === "forecast" && edu.forecast && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-forecast", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-forecast-next mono", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ind-when", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: "NEXT \u25B8" }),
            " ",
            edu.forecast.next
          ] }),
          edu.forecast.obs && edu.forecast.obs !== "\u2014" && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ind-obs", children: [
            "DATA: ",
            edu.forecast.obs
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-cells mono", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-cell", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "PREVIOUS" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: edu.forecast.prev })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-cell", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "KONSENSUS" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: edu.forecast.con })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-cell act", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "PERKIRAAN (RANGE)" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: edu.forecast.range })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "ind-outlook-text", children: edu.forecast.basis }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-scenarios", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-scen-head mono", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "PERKIRAAN DATA" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "EFEK PASAR" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "ARAH" })
          ] }),
          edu.forecast.scenarios.map((sc, i) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: `ind-scen-row ${sc.dir}`, children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-scen-label", children: sc.label }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-scen-effect", children: sc.effect }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ind-scen-dir mono", children: [
              DIR_TXT[sc.dir],
              " ",
              sc.cur
            ] })
          ] }, i))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "ind-forecast-note mono", children: "Perkiraan disusun dari konsensus + tren data verified (per 30 Agu 2026). Nilai final bisa berbeda \u2014 selalu baca revisi & komponen di dalam rilis." })
      ] }),
      tab === "outlook" && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-outlook", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "ind-outlook-text", children: edu.outlook }),
        edu.scenarios?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-scenarios", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-scen-head mono", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "SKENARIO" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "EFEK PASAR" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "ARAH" })
          ] }),
          edu.scenarios.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: `ind-scen-row ${s.dir}`, children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-scen-label", children: s.label }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-scen-effect", children: s.effect }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ind-scen-dir mono", children: [
              DIR_TXT[s.dir],
              " ",
              s.cur
            ] })
          ] }, i))
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-watch", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "mono", children: "PANTAU:" }),
          edu.watch.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-watch-chip", children: w }, i))
        ] })
      ] }),
      tab === "drivers" && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "ind-drivers", children: (edu.drivers || []).map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-driver", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-driver-head mono", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: i + 1 }),
          " ",
          d.name
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { children: d.detail }),
        d.data && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-driver-data mono", children: [
          "\u{1F4CA} ",
          d.data
        ] }),
        d.src && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("a", { className: "ind-driver-src mono", href: d.src.url, target: "_blank", rel: "noopener noreferrer", title: d.src.url, children: [
          d.src.label,
          " \u2197"
        ] })
      ] }, i)) }),
      tab === "experts" && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-experts", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "ind-experts-note", children: general.expertNote }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "ind-expert-grid", children: edu.expertViews.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-expert", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-expert-head", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-expert-avatar mono", children: (e.desk || "?").charAt(0) }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: e.desk }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", { children: "Analis Global" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { children: e.view }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-expert-signal mono", children: [
            "\u25B8 ",
            e.signal
          ] })
        ] }, i)) })
      ] })
    ] })
  ] });
}
function IndicatorClient({ data, releases, accuracy, source, edu, general, cat, country, upcoming }) {
  const now = useNow();
  const pts = (0, import_react3.useMemo)(() => data.points || [], [data]);
  const v = pts.length ? pts[pts.length - 1].value : null;
  const prev = pts.length > 1 ? pts[pts.length - 2].value : null;
  const yearAgo = pts.length > 12 ? pts[pts.length - 13].value : null;
  const lastDate = pts.length ? pts[pts.length - 1].date : null;
  const isQ = data.freq === "Q";
  const perYear = isQ ? 4 : 12;
  const RANGES = [
    { id: "1y", label: "1T", n: perYear },
    { id: "3y", label: "3T", n: perYear * 3 },
    { id: "5y", label: "5T", n: perYear * 5 },
    { id: "all", label: "SEMUA", n: null }
  ];
  const [range, setRange] = (0, import_react3.useState)(isQ ? "all" : "3y");
  const shown = (0, import_react3.useMemo)(() => {
    const r = RANGES.find((x) => x.id === range);
    return r?.n ? pts.slice(-r.n) : pts;
  }, [pts, range]);
  const latest = releases?.length ? releases[releases.length - 1] : null;
  const hist = (0, import_react3.useMemo)(() => (releases || []).slice(-6).reverse(), [releases]);
  const nextRel = (0, import_react3.useMemo)(() => {
    if (!now || !upcoming?.length) return null;
    const t = now.getTime();
    return upcoming.filter((e) => new Date(e.iso).getTime() > t).sort((a, b) => a.iso.localeCompare(b.iso))[0] || null;
  }, [upcoming, now]);
  const mom = v !== null && prev !== null ? v - prev : null;
  const yoy = v !== null && yearAgo !== null ? v - yearAgo : null;
  const rows12 = (0, import_react3.useMemo)(() => {
    const arr = pts.slice(-12).reverse();
    const out = [];
    for (let i = 0; i < arr.length; i++) {
      const p = arr[i];
      const next = arr[i - 1];
      const c = next ? p.value - next.value : null;
      out.push({ ...p, c });
    }
    const maxAbs = Math.max(...out.map((r) => Math.abs(r.c) || 0), 1e-9);
    out.forEach((r) => {
      r.bar = r.c === null ? 0 : Math.abs(r.c) / maxAbs * 100;
    });
    return out;
  }, [pts]);
  const maxSurp = Math.max(...hist.map((r) => Math.abs(r.surprise) || 0), 1e-9);
  const srcLive = source === "live" || data.source === "live";
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-term", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "ct-scan", "aria-hidden": "true" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("header", { className: "ind-term-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ct-dots", "aria-hidden": "true", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", {}),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", {}),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", {})
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ind-term-title mono", children: [
        "MACROLAB ",
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("em", { children: "//" }),
        " INDICATOR:\xA0",
        data.short?.toUpperCase(),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ct-ver", children: "v1.0" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ct-cursor", "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ind-term-head-right", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: `ct-led ${srcLive ? "ok" : "warn"}`, children: [
          srcLive ? "FRED LIVE" : "CACHE LOKAL",
          " \xB7 ",
          data.updated?.slice(0, 10)
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(TermClock, {})
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("section", { className: "ind-readout", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-readout-main", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-readout-id", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("b", { className: "ind-readout-name", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(CountryFlag, { code: data.country, size: 20, showCode: false }),
            data.name
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-readout-badges", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-readout-country mono", children: country?.name || "Global" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(CategoryBadge, { id: cat?.id, label: cat?.label, color: cat?.color }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ImpactBadge, { level: data.impact }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-chip mono", children: data.freq === "D" ? "HARIAN" : data.freq === "Q" ? "KUARTALAN" : "BULANAN" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ind-chip mono", title: data.release, children: [
              "RILIS: ",
              data.release
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-readout-value mono", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(CountUp, { value: v, decimals: data.decimals }),
          v !== null && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-readout-unit", children: data.unit }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ind-readout-asof mono", children: [
            "AS-OF ",
            lastDate || "\u2014"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-readout-stats mono", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-stat", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "\u0394 PERIODE" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { className: mom === null ? "" : mom >= 0 ? "up" : "down", children: mom === null ? "\u2014" : `${mom >= 0 ? "\u25B2 +" : "\u25BC "}${fmt(mom, data.decimals)}` }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", { children: "vs periode sebelumnya" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-stat", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "\u0394 SETAHUN" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { className: yoy === null ? "" : yoy >= 0 ? "up" : "down", children: yoy === null ? "\u2014" : `${yoy >= 0 ? "\u25B2 +" : "\u25BC "}${fmt(yoy, data.decimals)}` }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", { children: "vs 12 periode lalu" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-stat", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "NIAT POINT" }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: pts.length }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("i", { children: [
              "sejak ",
              pts.length ? pts[0].date : "\u2014"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-next", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-next-label mono", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ct-tag", children: "00" }),
          " NEXT RELEASE"
        ] }),
        nextRel ? /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-next-body", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { className: "ind-next-title", children: nextRel.title }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ind-next-when mono", children: [
            DAY_NAMES[new Date(nextRel.iso).getDay()],
            " \xB7 ",
            nextRel.iso.slice(8, 10),
            " ",
            MONTHS[Number(nextRel.iso.slice(5, 7)) - 1],
            " ",
            nextRel.iso.slice(0, 4),
            " \xB7 ",
            nextRel.time,
            " WIB"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-next-cd mono", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: fmtCountdown(new Date(nextRel.iso).getTime() - now.getTime()) }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "menuju rilis" })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-next-body", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-next-none mono", children: "TIDAK ADA DALAM JADWAL AKTIF" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ind-next-sched mono", children: [
            "Pola rilis: ",
            data.release
          ] })
        ] })
      ] })
    ] }),
    latest && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("section", { className: "ind-term-sec", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ct-block-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ct-tag", children: "01" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h4", { children: "Consensus vs Actual \u2014 Rilis Terakhir" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ct-block-meta mono", children: [
          "\u25B8 ",
          latest.date,
          " \xB7 SRC: ",
          latest.source?.toUpperCase()
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-cells mono", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-cell", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "PREVIOUS" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: latest.previous == null ? "\u2014" : fmt(latest.previous, data.decimals) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-cell", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "CONSENSUS" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: latest.consensus == null ? "\u2014" : fmt(latest.consensus, data.decimals) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-cell act", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "ACTUAL" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: latest.actual == null ? "\u2014" : fmt(latest.actual, data.decimals) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: `ind-cell ${latest.surprise > 0 ? "good" : latest.surprise < 0 ? "bad" : "flat"}`, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "SURPRISE" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: latest.surprise == null ? "\u2014" : `${latest.surprise > 0 ? "+" : ""}${fmt(latest.surprise, data.decimals)}` }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", { children: latest.surprisePct == null ? "" : `${latest.surprisePct > 0 ? "+" : ""}${latest.surprisePct.toFixed(2)}% vs konsensus` })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(SurpriseGauge, { idx: latest.surpriseIdx, tol: accuracy?.tol, scale: data.scale || 1 }),
      accuracy && accuracy.samples > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-acc mono", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-acc-title", children: "AKURASI KONSENSUS" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ind-acc-item", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", { children: "HIT-RATE" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: accuracy.hitRate != null ? `${accuracy.hitRate}%` : "\u2014" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("em", { children: [
            "tol \xB1",
            accuracy.tol
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ind-acc-item", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", { children: "BEAT / INLINE / MISS" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("b", { children: [
            accuracy.beats,
            " / ",
            accuracy.inlines,
            " / ",
            accuracy.misses
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("em", { children: [
            "N=",
            accuracy.samples
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ind-acc-item", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", { children: "AKURASI ARAH" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: accuracy.dirAcc != null ? `${accuracy.dirAcc}%` : "\u2014" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("em", { children: "vs previous" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ind-acc-item", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", { children: "KEJUTAN TERBESAR" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { children: accuracy.maxSurprise == null ? "\u2014" : `${accuracy.maxSurprise > 0 ? "+" : ""}${accuracy.maxSurprise}` }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("em", { children: accuracy.maxSurpriseDate || "" })
        ] }),
        accuracy.streak && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: `ind-acc-item ${accuracy.streak.kind === "BEAT" ? "good" : "bad"}`, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", { children: "STREAK" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("b", { children: [
            accuracy.streak.n,
            "\xD7 ",
            accuracy.streak.kind
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("em", { children: "beruntun" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("p", { className: "ind-linkrow mono", children: [
        "Analisis dampak pair lengkap \u2192 ",
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Link, { href: "/analysis", children: "HALAMAN ANALISIS" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("section", { className: "ind-term-sec", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ct-block-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ct-tag", children: "02" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("h4", { children: [
          "Riwayat ",
          data.short
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ct-block-meta mono", children: [
          "\u25B8 ",
          shown.length,
          " POINT \xB7 HOVER UNTUK DETAIL"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "ind-range mono", children: RANGES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("button", { className: `cal-chip ${range === r.id ? "on" : ""}`, onClick: () => setRange(r.id), children: r.label }, r.id)) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Chart, { points: shown, color: cat?.color || "#f0b429", unit: data.unit, decimals: data.decimals, height: 320 }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-rows12", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-rows12-head mono", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "PERIODE" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "NILAI" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-rows12-barcol", children: "PERUBAHAN" })
        ] }),
        rows12.map((p) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: `ind-row12 ${p.c === null ? "" : p.c >= 0 ? "up" : "down"}`, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "mono", children: fmtDay(p.date) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { className: "mono", children: fmt(p.value, data.decimals) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ind-rows12-barcol", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", { className: "ind-row12-bar", style: { width: `${p.bar}%` } }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("em", { className: "mono", children: p.c === null ? "\u2014" : `${p.c >= 0 ? "+" : ""}${fmt(p.c, data.decimals)}` })
          ] })
        ] }, p.date))
      ] })
    ] }),
    hist.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("section", { className: "ind-term-sec", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ct-block-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ct-tag", children: "03" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h4", { children: "Riwayat Rilis \u2014 Consensus vs Actual" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: "ct-block-meta mono", children: [
          "\u25B8 ",
          hist.length,
          " RILIS TERAKHIR \xB7 PERHATIKAN POLA SURPRISE"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-rel", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-rel-head mono", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "TANGGAL" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "PREV" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "KONSENSUS" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "AKTUAL" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { children: "SURPRISE" })
        ] }),
        hist.map((r) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-rel-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "mono", children: r.date }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "mono dim", children: r.previous == null ? "\u2014" : fmt(r.previous, data.decimals) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "mono dim", children: r.consensus == null ? "\u2014" : fmt(r.consensus, data.decimals) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("b", { className: "mono", children: r.actual == null ? "\u2014" : fmt(r.actual, data.decimals) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-rel-s", children: r.surprise == null ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "mono dim", children: "\u2014" }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("i", { className: `ind-rel-bar ${r.surprise >= 0 ? "up" : "down"}`, style: { width: `${Math.abs(r.surprise) / maxSurp * 100}%` } }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("em", { className: `mono ${r.surprise >= 0 ? "up" : "down"}`, children: [
              r.surprise >= 0 ? "+" : "",
              fmt(r.surprise, data.decimals),
              r.surprisePct != null ? ` (${r.surprisePct >= 0 ? "+" : ""}${r.surprisePct.toFixed(1)}%)` : ""
            ] })
          ] }) })
        ] }, r.date))
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("section", { className: "ind-term-sec", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ct-block-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ct-tag", children: "04" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("h4", { children: [
          "Memahami ",
          data.short
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ct-block-meta mono", children: "\u25B8 APA \xB7 MENGAPA \xB7 DAMPAK FX" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ind-understand", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("em", { children: "APA ITU?" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { children: data.about })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("em", { children: "MENGAPA PENTING?" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { children: data.why })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("em", { children: "DAMPAK KE MATA UANG" }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { children: data.fx })
        ] })
      ] })
    ] }),
    edu && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("section", { className: "ind-term-sec", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "ct-block-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ct-tag", children: "05" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h4", { children: "Edukasi Praktis" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ct-block-meta mono", children: "\u25B8 PILIH TAB" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(EduTab, { edu, general })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("footer", { className: "ind-term-foot mono", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { children: [
        "SRC: ",
        srcLive ? "FRED (LIVE)" : "CACHE LOKAL",
        " \xB7 N=",
        pts.length,
        " POINT \xB7 AS-OF ",
        lastDate || "\u2014",
        " \xB7 ZONA: WIB (UTC+7)"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ind-term-foot-note", children: "Selalu verifikasi ke sumber resmi \u2014 data bisa direvisi" }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "ct-blink", "aria-hidden": "true", children: "\u25CF" })
    ] })
  ] });
}

// data/releases.js
var CONSENSUS = {
  nfp: [
    { date: "2026-08-07", obs: "2026-07-01", consensus: 85 },
    { date: "2026-07-02", obs: "2026-06-01", consensus: 114 },
    { date: "2026-06-05", obs: "2026-05-01", consensus: 85 },
    { date: "2026-05-08", obs: "2026-04-01", consensus: 65 },
    { date: "2026-04-03", obs: "2026-03-01", consensus: 65 },
    { date: "2026-03-06", obs: "2026-02-01", consensus: 58 },
    { date: "2026-02-11", obs: "2026-01-01", consensus: 66 },
    { date: "2026-01-09", obs: "2025-12-01", consensus: 66 },
    { date: "2025-12-16", obs: "2025-11-01", consensus: 51 },
    { date: "2025-11-14", obs: "2025-10-01", consensus: 40 },
    { date: "2025-10-10", obs: "2025-09-01", consensus: 75 },
    { date: "2025-09-05", obs: "2025-08-01", consensus: 75 },
    { date: "2026-09-04", obs: "2026-08-01", consensus: 58 }
  ],
  unemp: [
    { date: "2026-08-07", obs: "2026-07-01", consensus: 4.2 },
    { date: "2026-07-02", obs: "2026-06-01", consensus: 4.3 },
    { date: "2026-06-05", obs: "2026-05-01", consensus: 4.3 },
    { date: "2026-05-08", obs: "2026-04-01", consensus: 4.3 },
    { date: "2026-04-03", obs: "2026-03-01", consensus: 4.4 },
    { date: "2026-03-06", obs: "2026-02-01", consensus: 4.3 },
    { date: "2026-02-11", obs: "2026-01-01", consensus: 4.4 },
    { date: "2026-01-09", obs: "2025-12-01", consensus: 4.5 },
    { date: "2025-12-16", obs: "2025-11-01", consensus: 4.5 },
    { date: "2025-10-10", obs: "2025-09-01", consensus: 4.3 },
    { date: "2025-09-05", obs: "2025-08-01", consensus: 4.3 },
    { date: "2025-08-08", obs: "2025-07-01", consensus: 4.2 },
    { date: "2025-07-11", obs: "2025-06-01", consensus: 4.2 },
    { date: "2026-09-04", obs: "2026-08-01", consensus: 4.1 }
  ],
  cpi: [
    { date: "2026-03-11", obs: "2026-02-01", consensus: 2.4 },
    { date: "2026-08-12", obs: "2026-07-01", consensus: 3.4 },
    { date: "2026-07-14", obs: "2026-06-01", consensus: 3.8 },
    { date: "2026-06-09", obs: "2026-05-01", consensus: 4.2 },
    { date: "2026-05-12", obs: "2026-04-01", consensus: 3.7 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 3.4 },
    { date: "2026-02-13", obs: "2026-01-01", consensus: 2.5 },
    { date: "2026-01-13", obs: "2025-12-01", consensus: 2.7 },
    { date: "2025-12-10", obs: "2025-11-01", consensus: 2.9 },
    { date: "2025-10-15", obs: "2025-09-01", consensus: 2.9 },
    { date: "2025-09-11", obs: "2025-08-01", consensus: 2.9 },
    { date: "2025-08-12", obs: "2025-07-01", consensus: 2.8 },
    { date: "2025-07-15", obs: "2025-06-01", consensus: 2.6 },
    { date: "2025-06-11", obs: "2025-05-01", consensus: 2.5 }
  ],
  corecpi: [
    { date: "2026-03-11", obs: "2026-02-01", consensus: 2.5 },
    { date: "2026-08-12", obs: "2026-07-01", consensus: 2.5 },
    { date: "2026-07-14", obs: "2026-06-01", consensus: 2.8 },
    { date: "2026-06-09", obs: "2026-05-01", consensus: 2.9 },
    { date: "2026-05-12", obs: "2026-04-01", consensus: 2.7 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 2.7 },
    { date: "2026-02-13", obs: "2026-01-01", consensus: 2.5 },
    { date: "2026-01-13", obs: "2025-12-01", consensus: 2.7 },
    { date: "2025-12-10", obs: "2025-11-01", consensus: 2.7 },
    { date: "2025-10-15", obs: "2025-09-01", consensus: 2.9 },
    { date: "2025-09-11", obs: "2025-08-01", consensus: 3.1 },
    { date: "2025-08-12", obs: "2025-07-01", consensus: 3 },
    { date: "2025-07-15", obs: "2025-06-01", consensus: 3 },
    { date: "2025-06-11", obs: "2025-05-01", consensus: 2.9 }
  ],
  ppi: [
    { date: "2026-03-18", obs: "2026-02-01", consensus: 4 },
    { date: "2026-08-13", obs: "2026-07-01", consensus: 4.9 },
    { date: "2026-07-15", obs: "2026-06-01", consensus: 6.2 },
    { date: "2026-06-11", obs: "2026-05-01", consensus: 6.4 },
    { date: "2026-05-13", obs: "2026-04-01", consensus: 4.9 },
    { date: "2026-04-14", obs: "2026-03-01", consensus: 4 },
    { date: "2026-02-27", obs: "2026-01-01", consensus: 2.5 },
    { date: "2026-01-30", obs: "2025-12-01", consensus: 2.9 },
    { date: "2026-01-14", obs: "2025-11-01", consensus: 2.7 },
    { date: "2025-12-10", obs: "2025-10-01", consensus: 3.2 },
    { date: "2025-11-12", obs: "2025-10-01", consensus: 3.6 },
    { date: "2025-10-14", obs: "2025-09-01", consensus: 2.5 },
    { date: "2025-09-10", obs: "2025-08-01", consensus: 3.3 },
    { date: "2025-08-13", obs: "2025-07-01", consensus: 2 },
    { date: "2025-07-15", obs: "2025-06-01", consensus: 1.8 }
  ],
  corepce: [
    { date: "2026-08-26", obs: "2026-07-01", consensus: 0.2 },
    { date: "2026-07-30", obs: "2026-06-01", consensus: 0.2 },
    { date: "2026-06-25", obs: "2026-05-01", consensus: 0.3 },
    { date: "2026-05-28", obs: "2026-04-01", consensus: 0.3 },
    { date: "2026-04-30", obs: "2026-03-01", consensus: 0.3 },
    { date: "2026-03-13", obs: "2026-01-01", consensus: 0.4 },
    { date: "2026-02-20", obs: "2025-12-01", consensus: 0.3 },
    { date: "2026-01-22", obs: "2025-11-01", consensus: 0.2 },
    { date: "2025-12-26", obs: "2025-11-01", consensus: 0.25 },
    { date: "2025-11-27", obs: "2025-10-01", consensus: 0.25 },
    { date: "2025-10-27", obs: "2025-09-01", consensus: 0.25 },
    { date: "2025-09-26", obs: "2025-08-01", consensus: 0.24 },
    { date: "2025-08-27", obs: "2025-07-01", consensus: 0.25 },
    { date: "2025-07-28", obs: "2025-06-01", consensus: 0.25 }
  ],
  adp: [
    { date: "2026-03-04", obs: "2026-01-01", consensus: 50 },
    { date: "2026-02-04", obs: "2025-12-01", consensus: 46 },
    { date: "2026-01-07", obs: "2025-11-01", consensus: 49 },
    { date: "2026-04-01", obs: "2026-03-01", consensus: 41 },
    { date: "2026-06-03", obs: "2026-05-01", consensus: 118 }
  ],
  ahe: [
    { date: "2026-08-07", obs: "2026-07-01", consensus: 3.3 },
    { date: "2026-07-02", obs: "2026-06-01", consensus: 3.5 },
    { date: "2026-06-05", obs: "2026-05-01", consensus: 3.5 },
    { date: "2026-05-08", obs: "2026-04-01", consensus: 3.8 },
    { date: "2026-04-03", obs: "2026-03-01", consensus: 3.6 },
    { date: "2026-03-06", obs: "2026-02-01", consensus: 3.7 },
    { date: "2026-02-11", obs: "2026-01-01", consensus: 3.6 },
    { date: "2026-01-09", obs: "2025-12-01", consensus: 3.6 },
    { date: "2025-12-12", obs: "2025-11-01", consensus: 3.9 },
    { date: "2025-11-14", obs: "2025-10-01", consensus: 3.9 },
    { date: "2025-10-10", obs: "2025-09-01", consensus: 3.9 },
    { date: "2025-09-12", obs: "2025-08-01", consensus: 4 },
    { date: "2025-08-08", obs: "2025-07-01", consensus: 4 },
    { date: "2025-07-03", obs: "2025-06-01", consensus: 3.9 }
  ],
  fedfunds: [
    { date: "2026-01-29", obs: "2026-01-01", consensus: 3.75 },
    { date: "2026-04-30", obs: "2026-04-01", consensus: 3.75 },
    { date: "2026-09-17", obs: "2026-09-01", consensus: 3.75 },
    { date: "2026-07-30", obs: "2026-07-01", consensus: 3.75 },
    { date: "2026-06-18", obs: "2026-06-01", consensus: 3.75 },
    { date: "2026-03-19", obs: "2026-03-01", consensus: 3.75 },
    { date: "2025-12-10", obs: "2025-12-01", consensus: 3.75 },
    { date: "2025-10-29", obs: "2025-11-01", consensus: 4 },
    { date: "2025-10-29", obs: "2025-10-01", consensus: 4 },
    { date: "2025-09-17", obs: "2025-09-01", consensus: 4.25 }
  ],
  dgs10: [
    { date: "2026-08-31", obs: "2026-08-01", consensus: 4.6 }
  ],
  retail: [
    { date: "2026-03-06", obs: "2026-02-01", consensus: -0.3 },
    { date: "2026-08-14", obs: "2026-07-01", consensus: 0.1 },
    { date: "2026-07-16", obs: "2026-06-01", consensus: 0.2 },
    { date: "2026-06-16", obs: "2026-06-01", consensus: 0.7 },
    { date: "2026-05-14", obs: "2026-05-01", consensus: 0.5 },
    { date: "2026-04-21", obs: "2026-04-01", consensus: 1.4 },
    { date: "2026-04-01", obs: "2026-03-01", consensus: 0.5 },
    { date: "2026-02-10", obs: "2026-01-01", consensus: 0.4 },
    { date: "2026-01-14", obs: "2025-12-01", consensus: 0.5 },
    { date: "2025-12-16", obs: "2025-11-01", consensus: 0.1 },
    { date: "2025-11-18", obs: "2025-10-01", consensus: 0.2 },
    { date: "2025-10-15", obs: "2025-09-01", consensus: 0.3 },
    { date: "2025-09-15", obs: "2025-08-01", consensus: 0.5 },
    { date: "2025-08-15", obs: "2025-07-01", consensus: 0.6 },
    { date: "2025-07-15", obs: "2025-06-01", consensus: 0.7 }
  ],
  umich: [
    { date: "2026-08-14", obs: "2026-07-01", consensus: 54.7 },
    { date: "2026-07-09", obs: "2026-06-01", consensus: 47 },
    { date: "2026-06-12", obs: "2026-05-01", consensus: 46.1 },
    { date: "2026-05-08", obs: "2026-04-01", consensus: 49.7 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 51.6 },
    { date: "2026-03-13", obs: "2026-02-01", consensus: 55 },
    { date: "2026-02-06", obs: "2026-01-01", consensus: 55 },
    { date: "2026-01-09", obs: "2025-12-01", consensus: 53.5 },
    { date: "2025-12-05", obs: "2025-11-01", consensus: 53.5 },
    { date: "2025-11-07", obs: "2025-10-01", consensus: 53 },
    { date: "2025-10-10", obs: "2025-09-01", consensus: 54.1 },
    { date: "2025-09-12", obs: "2025-08-01", consensus: 58.2 },
    { date: "2025-08-15", obs: "2025-07-01", consensus: 61.9 },
    { date: "2025-07-10", obs: "2025-06-01", consensus: 61 }
  ],
  indpro: [
    { date: "2026-08-11", obs: "2026-07-01", consensus: 0.2 },
    { date: "2026-07-10", obs: "2026-06-01", consensus: 0.3 },
    { date: "2026-06-11", obs: "2026-05-01", consensus: 0.2 },
    { date: "2026-05-11", obs: "2026-04-01", consensus: 0.4 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 0.1 },
    { date: "2026-03-11", obs: "2026-02-01", consensus: 0.5 },
    { date: "2026-02-11", obs: "2026-01-01", consensus: 0.2 },
    { date: "2026-01-12", obs: "2025-12-01", consensus: 0.3 },
    { date: "2025-12-12", obs: "2025-11-01", consensus: 0 },
    { date: "2025-11-12", obs: "2025-10-01", consensus: -0.1 },
    { date: "2025-10-13", obs: "2025-09-01", consensus: 0.1 },
    { date: "2025-09-12", obs: "2025-08-01", consensus: 0 },
    { date: "2025-08-12", obs: "2025-07-01", consensus: 0.3 },
    { date: "2025-07-11", obs: "2025-06-01", consensus: 0.4 }
  ],
  gdp: [
    { date: "2026-04-09", obs: "2025-10-01", consensus: 0.7 },
    { date: "2026-08-26", obs: "2026-07-01", consensus: 1.5 }
  ],
  eu_cpi: [
    { date: "2026-08-07", obs: "2026-07-01", consensus: 2.8 },
    { date: "2026-07-07", obs: "2026-06-01", consensus: 3 },
    { date: "2026-06-08", obs: "2026-05-01", consensus: 3.1 },
    { date: "2026-05-07", obs: "2026-04-01", consensus: 2.6 },
    { date: "2026-04-07", obs: "2026-03-01", consensus: 2 },
    { date: "2026-03-06", obs: "2026-02-01", consensus: 1.7 },
    { date: "2026-02-06", obs: "2026-01-01", consensus: 1.9 },
    { date: "2026-01-07", obs: "2025-12-01", consensus: 2.1 },
    { date: "2025-12-08", obs: "2025-11-01", consensus: 2.1 },
    { date: "2025-11-07", obs: "2025-10-01", consensus: 2.2 },
    { date: "2025-10-07", obs: "2025-09-01", consensus: 2 },
    { date: "2025-09-08", obs: "2025-08-01", consensus: 2 },
    { date: "2025-08-07", obs: "2025-07-01", consensus: 2 },
    { date: "2025-07-07", obs: "2025-06-01", consensus: 1.9 }
  ],
  eu_unemp: [
    { date: "2023-02-08", obs: "2023-01-01", consensus: 6.7 }
  ],
  uk_cpi: [
    { date: "2025-04-07", obs: "2025-03-01", consensus: 3.7 },
    { date: "2025-03-07", obs: "2025-02-01", consensus: 3.8 },
    { date: "2025-02-07", obs: "2025-01-01", consensus: 3.6 },
    { date: "2025-01-07", obs: "2024-12-01", consensus: 3.4 },
    { date: "2024-12-06", obs: "2024-11-01", consensus: 3.1 },
    { date: "2024-11-07", obs: "2024-10-01", consensus: 2.7 },
    { date: "2024-10-07", obs: "2024-09-01", consensus: 2.9 },
    { date: "2024-09-06", obs: "2024-08-01", consensus: 3 },
    { date: "2024-08-07", obs: "2024-07-01", consensus: 3.1 },
    { date: "2024-07-08", obs: "2024-06-01", consensus: 2.8 },
    { date: "2024-06-07", obs: "2024-05-01", consensus: 2.9 },
    { date: "2024-05-07", obs: "2024-04-01", consensus: 3.1 },
    { date: "2024-04-08", obs: "2024-03-01", consensus: 3.8 },
    { date: "2024-03-07", obs: "2024-02-01", consensus: 3.9 }
  ],
  uk_unemp: [
    { date: "2026-05-07", obs: "2026-04-01", consensus: 5 },
    { date: "2026-04-07", obs: "2026-03-01", consensus: 4.9 },
    { date: "2026-03-06", obs: "2026-02-01", consensus: 5 },
    { date: "2026-02-06", obs: "2026-01-01", consensus: 5.1 },
    { date: "2026-01-07", obs: "2025-12-01", consensus: 5.1 },
    { date: "2025-12-08", obs: "2025-11-01", consensus: 5 },
    { date: "2025-11-07", obs: "2025-10-01", consensus: 5 },
    { date: "2025-10-07", obs: "2025-09-01", consensus: 4.9 },
    { date: "2025-09-08", obs: "2025-08-01", consensus: 4.8 },
    { date: "2025-08-07", obs: "2025-07-01", consensus: 4.7 },
    { date: "2025-07-07", obs: "2025-06-01", consensus: 4.6 },
    { date: "2025-06-06", obs: "2025-05-01", consensus: 4.6 },
    { date: "2025-05-07", obs: "2025-04-01", consensus: 4.6 },
    { date: "2025-04-07", obs: "2025-03-01", consensus: 4.5 }
  ],
  jp_cpi: [
    { date: "2021-07-20", obs: "2021-06-01", consensus: -0.4 }
  ],
  wti: [
    { date: "2026-08-31", obs: "2026-08-01", consensus: 82 }
  ],
  vix: [
    { date: "2026-08-31", obs: "2026-08-01", consensus: 16 }
  ],
  brent: [
    { date: "2026-08-31", obs: "2026-08-01", consensus: 88 }
  ],
  natgas: [
    { date: "2026-08-31", obs: "2026-08-01", consensus: 2.9 }
  ],
  copper: [
    { date: "2026-07-31", obs: "2026-07-01", consensus: 13200 }
  ],
  claims: [
    { date: "2026-08-13", obs: "2026-08-01", consensus: 202500 },
    { date: "2026-07-16", obs: "2026-07-01", consensus: 217667 },
    { date: "2026-06-10", obs: "2026-06-01", consensus: 217e3 },
    { date: "2026-05-07", obs: "2026-05-01", consensus: 205e3 },
    { date: "2026-04-09", obs: "2026-04-01", consensus: 21e4 },
    { date: "2026-03-12", obs: "2026-03-01", consensus: 214500 },
    { date: "2026-02-12", obs: "2026-02-01", consensus: 217e3 },
    { date: "2026-01-08", obs: "2026-01-01", consensus: 213e3 },
    { date: "2025-12-11", obs: "2025-12-01", consensus: 219500 },
    { date: "2025-11-18", obs: "2025-11-01", consensus: 223e3 },
    { date: "2025-10-02", obs: "2025-10-01", consensus: 22e4 },
    { date: "2025-09-11", obs: "2025-09-01", consensus: 232500 },
    { date: "2025-08-07", obs: "2025-08-01", consensus: 221e3 },
    { date: "2025-07-10", obs: "2025-07-01", consensus: 238e3 }
  ],
  capacity: [
    { date: "2026-08-11", obs: "2026-07-01", consensus: 76.1 },
    { date: "2026-07-10", obs: "2026-06-01", consensus: 76 },
    { date: "2026-06-11", obs: "2026-05-01", consensus: 75.9 },
    { date: "2026-05-11", obs: "2026-04-01", consensus: 75.6 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 75.5 },
    { date: "2026-03-11", obs: "2026-02-01", consensus: 75.3 },
    { date: "2026-02-11", obs: "2026-01-01", consensus: 75.4 },
    { date: "2026-01-12", obs: "2025-12-01", consensus: 75.4 },
    { date: "2025-12-12", obs: "2025-11-01", consensus: 75.5 },
    { date: "2025-11-12", obs: "2025-10-01", consensus: 75.9 },
    { date: "2025-10-13", obs: "2025-09-01", consensus: 76 },
    { date: "2025-09-12", obs: "2025-08-01", consensus: 76.2 },
    { date: "2025-08-12", obs: "2025-07-01", consensus: 76.4 },
    { date: "2025-07-11", obs: "2025-06-01", consensus: 76.1 }
  ],
  eu_gdp: [
    { date: "2026-05-01", obs: "2026-04-01", consensus: 0.8 },
    { date: "2026-02-02", obs: "2026-01-01", consensus: 0.8 },
    { date: "2025-11-03", obs: "2025-10-01", consensus: 1.1 },
    { date: "2025-08-01", obs: "2025-07-01", consensus: 0.9 }
  ],
  china_cpi: [
    { date: "2025-05-02", obs: "2025-04-01", consensus: 0.1 },
    { date: "2025-04-02", obs: "2025-03-01", consensus: 0 },
    { date: "2025-03-03", obs: "2025-02-01", consensus: -0.1 },
    { date: "2025-02-03", obs: "2025-01-01", consensus: 0.2 },
    { date: "2025-01-02", obs: "2024-12-01", consensus: 0.1 },
    { date: "2024-12-02", obs: "2024-11-01", consensus: 0.2 },
    { date: "2024-11-01", obs: "2024-10-01", consensus: 0.3 },
    { date: "2024-10-02", obs: "2024-09-01", consensus: 0.4 },
    { date: "2024-09-02", obs: "2024-08-01", consensus: 0.3 },
    { date: "2024-08-02", obs: "2024-07-01", consensus: 0.5 },
    { date: "2024-07-02", obs: "2024-06-01", consensus: 0.3 },
    { date: "2024-06-03", obs: "2024-05-01", consensus: 0.3 },
    { date: "2024-05-02", obs: "2024-04-01", consensus: 0.2 },
    { date: "2024-04-02", obs: "2024-03-01", consensus: 0.2 }
  ],
  // ISM (ditambahkan 30-Agu-2026) — tervalidasi: screenshot FF user (1-15 Jul 26)
  // + file API earningsapi (Non-Manufacturing). Tanggal selain yg ditandai = estimasi.
  ismmfg: [
    { date: "2026-03-02", obs: "2026-02-01", consensus: 51.7 },
    { date: "2026-02-02", obs: "2026-01-01", consensus: 48.5 },
    { date: "2026-01-05", obs: "2025-12-01", consensus: 48.3 },
    { date: "2026-04-01", obs: "2026-03-01", consensus: 52.3 },
    { date: "2026-08-03", obs: "2026-07-01", consensus: 54 },
    { date: "2026-07-01", obs: "2026-06-01", consensus: 53.8 },
    // tervalidasi FF
    { date: "2026-06-01", obs: "2026-05-01", consensus: 53.3 },
    { date: "2026-09-01", obs: "2026-08-01", consensus: 55.2 }
  ],
  ismsvc: [
    { date: "2026-03-04", obs: "2026-02-01", consensus: 53.5 },
    { date: "2026-02-04", obs: "2026-01-01", consensus: 53.5 },
    { date: "2026-01-07", obs: "2025-12-01", consensus: 52.2 },
    { date: "2026-04-06", obs: "2026-03-01", consensus: 54.8 },
    { date: "2026-05-05", obs: "2026-04-01", consensus: 53.7 },
    { date: "2026-08-05", obs: "2026-07-01", consensus: 54.5 },
    // tervalidasi API
    { date: "2026-07-06", obs: "2026-06-01", consensus: 54.2 },
    // tervalidasi FF
    { date: "2026-06-04", obs: "2026-05-01", consensus: 53.7 },
    { date: "2025-10-03", obs: "2025-09-01", consensus: 51.8 },
    // tervalidasi API
    { date: "2025-09-04", obs: "2025-08-01", consensus: 50.9 },
    // tervalidasi API
    { date: "2025-07-03", obs: "2025-06-01", consensus: 50.8 }
    // tervalidasi API
  ]
};

// data/seed.json
var seed_default = {
  generated: "2026-08-29T10:40:55.042Z",
  source: "FRED (fred.stlouisfed.org/graph/fredgraph.csv)",
  ok: 27,
  fail: 0,
  series: {
    nfp: {
      id: "nfp",
      fred: "PAYEMS",
      mode: "monthly_change",
      unit: "ribu",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: -23
      },
      points: [
        {
          date: "2016-08-01",
          value: 141
        },
        {
          date: "2016-09-01",
          value: 306
        },
        {
          date: "2016-10-01",
          value: 98
        },
        {
          date: "2016-11-01",
          value: 118
        },
        {
          date: "2016-12-01",
          value: 225
        },
        {
          date: "2017-01-01",
          value: 220
        },
        {
          date: "2017-02-01",
          value: 218
        },
        {
          date: "2017-03-01",
          value: 124
        },
        {
          date: "2017-04-01",
          value: 205
        },
        {
          date: "2017-05-01",
          value: 205
        },
        {
          date: "2017-06-01",
          value: 203
        },
        {
          date: "2017-07-01",
          value: 189
        },
        {
          date: "2017-08-01",
          value: 147
        },
        {
          date: "2017-09-01",
          value: 89
        },
        {
          date: "2017-10-01",
          value: 141
        },
        {
          date: "2017-11-01",
          value: 223
        },
        {
          date: "2017-12-01",
          value: 151
        },
        {
          date: "2018-01-01",
          value: 137
        },
        {
          date: "2018-02-01",
          value: 394
        },
        {
          date: "2018-03-01",
          value: 226
        },
        {
          date: "2018-04-01",
          value: 140
        },
        {
          date: "2018-05-01",
          value: 322
        },
        {
          date: "2018-06-01",
          value: 218
        },
        {
          date: "2018-07-01",
          value: 60
        },
        {
          date: "2018-08-01",
          value: 257
        },
        {
          date: "2018-09-01",
          value: 81
        },
        {
          date: "2018-10-01",
          value: 169
        },
        {
          date: "2018-11-01",
          value: 90
        },
        {
          date: "2018-12-01",
          value: 192
        },
        {
          date: "2019-01-01",
          value: 251
        },
        {
          date: "2019-02-01",
          value: 7
        },
        {
          date: "2019-03-01",
          value: 228
        },
        {
          date: "2019-04-01",
          value: 296
        },
        {
          date: "2019-05-01",
          value: 27
        },
        {
          date: "2019-06-01",
          value: 220
        },
        {
          date: "2019-07-01",
          value: 99
        },
        {
          date: "2019-08-01",
          value: 232
        },
        {
          date: "2019-09-01",
          value: 196
        },
        {
          date: "2019-10-01",
          value: 95
        },
        {
          date: "2019-11-01",
          value: 207
        },
        {
          date: "2019-12-01",
          value: 127
        },
        {
          date: "2020-01-01",
          value: 237
        },
        {
          date: "2020-02-01",
          value: 262
        },
        {
          date: "2020-03-01",
          value: -1398
        },
        {
          date: "2020-04-01",
          value: -20469
        },
        {
          date: "2020-05-01",
          value: 2614
        },
        {
          date: "2020-06-01",
          value: 4631
        },
        {
          date: "2020-07-01",
          value: 1584
        },
        {
          date: "2020-08-01",
          value: 1566
        },
        {
          date: "2020-09-01",
          value: 949
        },
        {
          date: "2020-10-01",
          value: 690
        },
        {
          date: "2020-11-01",
          value: 273
        },
        {
          date: "2020-12-01",
          value: -185
        },
        {
          date: "2021-01-01",
          value: 315
        },
        {
          date: "2021-02-01",
          value: 517
        },
        {
          date: "2021-03-01",
          value: 852
        },
        {
          date: "2021-04-01",
          value: 355
        },
        {
          date: "2021-05-01",
          value: 478
        },
        {
          date: "2021-06-01",
          value: 755
        },
        {
          date: "2021-07-01",
          value: 942
        },
        {
          date: "2021-08-01",
          value: 552
        },
        {
          date: "2021-09-01",
          value: 457
        },
        {
          date: "2021-10-01",
          value: 801
        },
        {
          date: "2021-11-01",
          value: 658
        },
        {
          date: "2021-12-01",
          value: 586
        },
        {
          date: "2022-01-01",
          value: 190
        },
        {
          date: "2022-02-01",
          value: 819
        },
        {
          date: "2022-03-01",
          value: 490
        },
        {
          date: "2022-04-01",
          value: 308
        },
        {
          date: "2022-05-01",
          value: 301
        },
        {
          date: "2022-06-01",
          value: 434
        },
        {
          date: "2022-07-01",
          value: 714
        },
        {
          date: "2022-08-01",
          value: 290
        },
        {
          date: "2022-09-01",
          value: 220
        },
        {
          date: "2022-10-01",
          value: 357
        },
        {
          date: "2022-11-01",
          value: 303
        },
        {
          date: "2022-12-01",
          value: 100
        },
        {
          date: "2023-01-01",
          value: 434
        },
        {
          date: "2023-02-01",
          value: 290
        },
        {
          date: "2023-03-01",
          value: 68
        },
        {
          date: "2023-04-01",
          value: 241
        },
        {
          date: "2023-05-01",
          value: 280
        },
        {
          date: "2023-06-01",
          value: 225
        },
        {
          date: "2023-07-01",
          value: 163
        },
        {
          date: "2023-08-01",
          value: 218
        },
        {
          date: "2023-09-01",
          value: 156
        },
        {
          date: "2023-10-01",
          value: 159
        },
        {
          date: "2023-11-01",
          value: 127
        },
        {
          date: "2023-12-01",
          value: 154
        },
        {
          date: "2024-01-01",
          value: 175
        },
        {
          date: "2024-02-01",
          value: 206
        },
        {
          date: "2024-03-01",
          value: 228
        },
        {
          date: "2024-04-01",
          value: 64
        },
        {
          date: "2024-05-01",
          value: 78
        },
        {
          date: "2024-06-01",
          value: 87
        },
        {
          date: "2024-07-01",
          value: 53
        },
        {
          date: "2024-08-01",
          value: 9
        },
        {
          date: "2024-09-01",
          value: 155
        },
        {
          date: "2024-10-01",
          value: 33
        },
        {
          date: "2024-11-01",
          value: 134
        },
        {
          date: "2024-12-01",
          value: 237
        },
        {
          date: "2025-01-01",
          value: -48
        },
        {
          date: "2025-02-01",
          value: 42
        },
        {
          date: "2025-03-01",
          value: 67
        },
        {
          date: "2025-04-01",
          value: 108
        },
        {
          date: "2025-05-01",
          value: 13
        },
        {
          date: "2025-06-01",
          value: 147
        },
        {
          date: "2025-07-01",
          value: 64
        },
        {
          date: "2025-08-01",
          value: 22
        },
        {
          date: "2025-09-01",
          value: 76
        },
        {
          date: "2025-10-01",
          value: 108
        },
        {
          date: "2025-11-01",
          value: 56
        },
        {
          date: "2025-12-01",
          value: 48
        },
        {
          date: "2026-01-01",
          value: 126
        },
        {
          date: "2026-02-01",
          value: -133
        },
        {
          date: "2026-03-01",
          value: 185
        },
        {
          date: "2026-04-01",
          value: 2
        },
        {
          date: "2026-05-01",
          value: 129
        },
        {
          date: "2026-06-01",
          value: 20
        },
        {
          date: "2026-07-01",
          value: -23
        }
      ]
    },
    unemp: {
      id: "unemp",
      fred: "UNRATE",
      mode: "level",
      unit: "%",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: 4.1
      },
      points: [
        {
          date: "2016-07-01",
          value: 4.8
        },
        {
          date: "2016-08-01",
          value: 4.9
        },
        {
          date: "2016-09-01",
          value: 5
        },
        {
          date: "2016-10-01",
          value: 4.9
        },
        {
          date: "2016-11-01",
          value: 4.7
        },
        {
          date: "2016-12-01",
          value: 4.7
        },
        {
          date: "2017-01-01",
          value: 4.7
        },
        {
          date: "2017-02-01",
          value: 4.6
        },
        {
          date: "2017-03-01",
          value: 4.4
        },
        {
          date: "2017-04-01",
          value: 4.4
        },
        {
          date: "2017-05-01",
          value: 4.4
        },
        {
          date: "2017-06-01",
          value: 4.3
        },
        {
          date: "2017-07-01",
          value: 4.3
        },
        {
          date: "2017-08-01",
          value: 4.4
        },
        {
          date: "2017-09-01",
          value: 4.3
        },
        {
          date: "2017-10-01",
          value: 4.2
        },
        {
          date: "2017-11-01",
          value: 4.2
        },
        {
          date: "2017-12-01",
          value: 4.1
        },
        {
          date: "2018-01-01",
          value: 4
        },
        {
          date: "2018-02-01",
          value: 4.1
        },
        {
          date: "2018-03-01",
          value: 4
        },
        {
          date: "2018-04-01",
          value: 4
        },
        {
          date: "2018-05-01",
          value: 3.8
        },
        {
          date: "2018-06-01",
          value: 4
        },
        {
          date: "2018-07-01",
          value: 3.8
        },
        {
          date: "2018-08-01",
          value: 3.8
        },
        {
          date: "2018-09-01",
          value: 3.7
        },
        {
          date: "2018-10-01",
          value: 3.8
        },
        {
          date: "2018-11-01",
          value: 3.8
        },
        {
          date: "2018-12-01",
          value: 3.9
        },
        {
          date: "2019-01-01",
          value: 4
        },
        {
          date: "2019-02-01",
          value: 3.8
        },
        {
          date: "2019-03-01",
          value: 3.8
        },
        {
          date: "2019-04-01",
          value: 3.7
        },
        {
          date: "2019-05-01",
          value: 3.6
        },
        {
          date: "2019-06-01",
          value: 3.6
        },
        {
          date: "2019-07-01",
          value: 3.7
        },
        {
          date: "2019-08-01",
          value: 3.6
        },
        {
          date: "2019-09-01",
          value: 3.5
        },
        {
          date: "2019-10-01",
          value: 3.6
        },
        {
          date: "2019-11-01",
          value: 3.6
        },
        {
          date: "2019-12-01",
          value: 3.6
        },
        {
          date: "2020-01-01",
          value: 3.6
        },
        {
          date: "2020-02-01",
          value: 3.5
        },
        {
          date: "2020-03-01",
          value: 4.4
        },
        {
          date: "2020-04-01",
          value: 14.8
        },
        {
          date: "2020-05-01",
          value: 13.2
        },
        {
          date: "2020-06-01",
          value: 11
        },
        {
          date: "2020-07-01",
          value: 10.2
        },
        {
          date: "2020-08-01",
          value: 8.4
        },
        {
          date: "2020-09-01",
          value: 7.8
        },
        {
          date: "2020-10-01",
          value: 6.9
        },
        {
          date: "2020-11-01",
          value: 6.7
        },
        {
          date: "2020-12-01",
          value: 6.7
        },
        {
          date: "2021-01-01",
          value: 6.4
        },
        {
          date: "2021-02-01",
          value: 6.2
        },
        {
          date: "2021-03-01",
          value: 6.1
        },
        {
          date: "2021-04-01",
          value: 6.1
        },
        {
          date: "2021-05-01",
          value: 5.8
        },
        {
          date: "2021-06-01",
          value: 5.9
        },
        {
          date: "2021-07-01",
          value: 5.4
        },
        {
          date: "2021-08-01",
          value: 5.1
        },
        {
          date: "2021-09-01",
          value: 4.7
        },
        {
          date: "2021-10-01",
          value: 4.5
        },
        {
          date: "2021-11-01",
          value: 4.1
        },
        {
          date: "2021-12-01",
          value: 3.9
        },
        {
          date: "2022-01-01",
          value: 4
        },
        {
          date: "2022-02-01",
          value: 3.9
        },
        {
          date: "2022-03-01",
          value: 3.7
        },
        {
          date: "2022-04-01",
          value: 3.7
        },
        {
          date: "2022-05-01",
          value: 3.6
        },
        {
          date: "2022-06-01",
          value: 3.6
        },
        {
          date: "2022-07-01",
          value: 3.5
        },
        {
          date: "2022-08-01",
          value: 3.6
        },
        {
          date: "2022-09-01",
          value: 3.5
        },
        {
          date: "2022-10-01",
          value: 3.6
        },
        {
          date: "2022-11-01",
          value: 3.6
        },
        {
          date: "2022-12-01",
          value: 3.5
        },
        {
          date: "2023-01-01",
          value: 3.5
        },
        {
          date: "2023-02-01",
          value: 3.6
        },
        {
          date: "2023-03-01",
          value: 3.5
        },
        {
          date: "2023-04-01",
          value: 3.4
        },
        {
          date: "2023-05-01",
          value: 3.6
        },
        {
          date: "2023-06-01",
          value: 3.6
        },
        {
          date: "2023-07-01",
          value: 3.5
        },
        {
          date: "2023-08-01",
          value: 3.7
        },
        {
          date: "2023-09-01",
          value: 3.7
        },
        {
          date: "2023-10-01",
          value: 3.9
        },
        {
          date: "2023-11-01",
          value: 3.7
        },
        {
          date: "2023-12-01",
          value: 3.8
        },
        {
          date: "2024-01-01",
          value: 3.7
        },
        {
          date: "2024-02-01",
          value: 3.9
        },
        {
          date: "2024-03-01",
          value: 3.9
        },
        {
          date: "2024-04-01",
          value: 3.9
        },
        {
          date: "2024-05-01",
          value: 3.9
        },
        {
          date: "2024-06-01",
          value: 4.1
        },
        {
          date: "2024-07-01",
          value: 4.2
        },
        {
          date: "2024-08-01",
          value: 4.2
        },
        {
          date: "2024-09-01",
          value: 4.1
        },
        {
          date: "2024-10-01",
          value: 4.1
        },
        {
          date: "2024-11-01",
          value: 4.2
        },
        {
          date: "2024-12-01",
          value: 4.1
        },
        {
          date: "2025-01-01",
          value: 4
        },
        {
          date: "2025-02-01",
          value: 4.2
        },
        {
          date: "2025-03-01",
          value: 4.2
        },
        {
          date: "2025-04-01",
          value: 4.2
        },
        {
          date: "2025-05-01",
          value: 4.3
        },
        {
          date: "2025-06-01",
          value: 4.1
        },
        {
          date: "2025-07-01",
          value: 4.3
        },
        {
          date: "2025-08-01",
          value: 4.3
        },
        {
          date: "2025-09-01",
          value: 4.4
        },
        {
          date: "2025-11-01",
          value: 4.6
        },
        {
          date: "2025-12-01",
          value: 4.4
        },
        {
          date: "2026-01-01",
          value: 4.3
        },
        {
          date: "2026-02-01",
          value: 4.4
        },
        {
          date: "2026-03-01",
          value: 4.3
        },
        {
          date: "2026-04-01",
          value: 4.3
        },
        {
          date: "2026-05-01",
          value: 4.3
        },
        {
          date: "2026-06-01",
          value: 4.2
        },
        {
          date: "2026-07-01",
          value: 4.1
        }
      ]
    },
    cpi: {
      id: "cpi",
      fred: "CPIAUCSL",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: 3.4
      },
      points: [
        {
          date: "2016-07-01",
          value: 0.87
        },
        {
          date: "2016-08-01",
          value: 1.06
        },
        {
          date: "2016-09-01",
          value: 1.55
        },
        {
          date: "2016-10-01",
          value: 1.69
        },
        {
          date: "2016-11-01",
          value: 1.68
        },
        {
          date: "2016-12-01",
          value: 2.05
        },
        {
          date: "2017-01-01",
          value: 2.51
        },
        {
          date: "2017-02-01",
          value: 2.81
        },
        {
          date: "2017-03-01",
          value: 2.44
        },
        {
          date: "2017-04-01",
          value: 2.18
        },
        {
          date: "2017-05-01",
          value: 1.86
        },
        {
          date: "2017-06-01",
          value: 1.64
        },
        {
          date: "2017-07-01",
          value: 1.73
        },
        {
          date: "2017-08-01",
          value: 1.93
        },
        {
          date: "2017-09-01",
          value: 2.18
        },
        {
          date: "2017-10-01",
          value: 2.02
        },
        {
          date: "2017-11-01",
          value: 2.17
        },
        {
          date: "2017-12-01",
          value: 2.13
        },
        {
          date: "2018-01-01",
          value: 2.15
        },
        {
          date: "2018-02-01",
          value: 2.26
        },
        {
          date: "2018-03-01",
          value: 2.33
        },
        {
          date: "2018-04-01",
          value: 2.47
        },
        {
          date: "2018-05-01",
          value: 2.78
        },
        {
          date: "2018-06-01",
          value: 2.81
        },
        {
          date: "2018-07-01",
          value: 2.85
        },
        {
          date: "2018-08-01",
          value: 2.64
        },
        {
          date: "2018-09-01",
          value: 2.33
        },
        {
          date: "2018-10-01",
          value: 2.49
        },
        {
          date: "2018-11-01",
          value: 2.15
        },
        {
          date: "2018-12-01",
          value: 2
        },
        {
          date: "2019-01-01",
          value: 1.49
        },
        {
          date: "2019-02-01",
          value: 1.52
        },
        {
          date: "2019-03-01",
          value: 1.88
        },
        {
          date: "2019-04-01",
          value: 2
        },
        {
          date: "2019-05-01",
          value: 1.8
        },
        {
          date: "2019-06-01",
          value: 1.67
        },
        {
          date: "2019-07-01",
          value: 1.83
        },
        {
          date: "2019-08-01",
          value: 1.74
        },
        {
          date: "2019-09-01",
          value: 1.68
        },
        {
          date: "2019-10-01",
          value: 1.73
        },
        {
          date: "2019-11-01",
          value: 2.09
        },
        {
          date: "2019-12-01",
          value: 2.32
        },
        {
          date: "2020-01-01",
          value: 2.6
        },
        {
          date: "2020-02-01",
          value: 2.34
        },
        {
          date: "2020-03-01",
          value: 1.49
        },
        {
          date: "2020-04-01",
          value: 0.31
        },
        {
          date: "2020-05-01",
          value: 0.2
        },
        {
          date: "2020-06-01",
          value: 0.72
        },
        {
          date: "2020-07-01",
          value: 1
        },
        {
          date: "2020-08-01",
          value: 1.28
        },
        {
          date: "2020-09-01",
          value: 1.39
        },
        {
          date: "2020-10-01",
          value: 1.23
        },
        {
          date: "2020-11-01",
          value: 1.18
        },
        {
          date: "2020-12-01",
          value: 1.32
        },
        {
          date: "2021-01-01",
          value: 1.37
        },
        {
          date: "2021-02-01",
          value: 1.67
        },
        {
          date: "2021-03-01",
          value: 2.67
        },
        {
          date: "2021-04-01",
          value: 4.13
        },
        {
          date: "2021-05-01",
          value: 4.92
        },
        {
          date: "2021-06-01",
          value: 5.3
        },
        {
          date: "2021-07-01",
          value: 5.25
        },
        {
          date: "2021-08-01",
          value: 5.15
        },
        {
          date: "2021-09-01",
          value: 5.35
        },
        {
          date: "2021-10-01",
          value: 6.24
        },
        {
          date: "2021-11-01",
          value: 6.9
        },
        {
          date: "2021-12-01",
          value: 7.17
        },
        {
          date: "2022-01-01",
          value: 7.56
        },
        {
          date: "2022-02-01",
          value: 7.94
        },
        {
          date: "2022-03-01",
          value: 8.57
        },
        {
          date: "2022-04-01",
          value: 8.23
        },
        {
          date: "2022-05-01",
          value: 8.54
        },
        {
          date: "2022-06-01",
          value: 8.98
        },
        {
          date: "2022-07-01",
          value: 8.46
        },
        {
          date: "2022-08-01",
          value: 8.22
        },
        {
          date: "2022-09-01",
          value: 8.19
        },
        {
          date: "2022-10-01",
          value: 7.76
        },
        {
          date: "2022-11-01",
          value: 7.12
        },
        {
          date: "2022-12-01",
          value: 6.4
        },
        {
          date: "2023-01-01",
          value: 6.33
        },
        {
          date: "2023-02-01",
          value: 5.96
        },
        {
          date: "2023-03-01",
          value: 4.92
        },
        {
          date: "2023-04-01",
          value: 4.95
        },
        {
          date: "2023-05-01",
          value: 4.13
        },
        {
          date: "2023-06-01",
          value: 3.07
        },
        {
          date: "2023-07-01",
          value: 3.29
        },
        {
          date: "2023-08-01",
          value: 3.72
        },
        {
          date: "2023-09-01",
          value: 3.69
        },
        {
          date: "2023-10-01",
          value: 3.25
        },
        {
          date: "2023-11-01",
          value: 3.13
        },
        {
          date: "2023-12-01",
          value: 3.32
        },
        {
          date: "2024-01-01",
          value: 3.09
        },
        {
          date: "2024-02-01",
          value: 3.16
        },
        {
          date: "2024-03-01",
          value: 3.49
        },
        {
          date: "2024-04-01",
          value: 3.36
        },
        {
          date: "2024-05-01",
          value: 3.24
        },
        {
          date: "2024-06-01",
          value: 2.97
        },
        {
          date: "2024-07-01",
          value: 2.94
        },
        {
          date: "2024-08-01",
          value: 2.61
        },
        {
          date: "2024-09-01",
          value: 2.43
        },
        {
          date: "2024-10-01",
          value: 2.58
        },
        {
          date: "2024-11-01",
          value: 2.72
        },
        {
          date: "2024-12-01",
          value: 2.87
        },
        {
          date: "2025-01-01",
          value: 2.99
        },
        {
          date: "2025-02-01",
          value: 2.8
        },
        {
          date: "2025-03-01",
          value: 2.38
        },
        {
          date: "2025-04-01",
          value: 2.33
        },
        {
          date: "2025-05-01",
          value: 2.4
        },
        {
          date: "2025-06-01",
          value: 2.7
        },
        {
          date: "2025-07-01",
          value: 2.7
        },
        {
          date: "2025-08-01",
          value: 2.9
        },
        {
          date: "2025-09-01",
          value: 3.02
        },
        {
          date: "2025-11-01",
          value: 2.7
        },
        {
          date: "2025-12-01",
          value: 2.7
        },
        {
          date: "2026-01-01",
          value: 2.4
        },
        {
          date: "2026-02-01",
          value: 2.4
        },
        {
          date: "2026-03-01",
          value: 3.3
        },
        {
          date: "2026-04-01",
          value: 3.8
        },
        {
          date: "2026-05-01",
          value: 4.2
        },
        {
          date: "2026-06-01",
          value: 3.5
        },
        {
          date: "2026-07-01",
          value: 3.4
        }
      ]
    },
    corecpi: {
      id: "corecpi",
      fred: "CPILFESL",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: 2.5
      },
      points: [
        {
          date: "2016-07-01",
          value: 2.17
        },
        {
          date: "2016-08-01",
          value: 2.31
        },
        {
          date: "2016-09-01",
          value: 2.27
        },
        {
          date: "2016-10-01",
          value: 2.2
        },
        {
          date: "2016-11-01",
          value: 2.15
        },
        {
          date: "2016-12-01",
          value: 2.2
        },
        {
          date: "2017-01-01",
          value: 2.25
        },
        {
          date: "2017-02-01",
          value: 2.24
        },
        {
          date: "2017-03-01",
          value: 2.05
        },
        {
          date: "2017-04-01",
          value: 1.9
        },
        {
          date: "2017-05-01",
          value: 1.74
        },
        {
          date: "2017-06-01",
          value: 1.7
        },
        {
          date: "2017-07-01",
          value: 1.68
        },
        {
          date: "2017-08-01",
          value: 1.66
        },
        {
          date: "2017-09-01",
          value: 1.6
        },
        {
          date: "2017-10-01",
          value: 1.76
        },
        {
          date: "2017-11-01",
          value: 1.74
        },
        {
          date: "2017-12-01",
          value: 1.77
        },
        {
          date: "2018-01-01",
          value: 1.89
        },
        {
          date: "2018-02-01",
          value: 1.88
        },
        {
          date: "2018-03-01",
          value: 2.12
        },
        {
          date: "2018-04-01",
          value: 2.15
        },
        {
          date: "2018-05-01",
          value: 2.27
        },
        {
          date: "2018-06-01",
          value: 2.25
        },
        {
          date: "2018-07-01",
          value: 2.27
        },
        {
          date: "2018-08-01",
          value: 2.12
        },
        {
          date: "2018-09-01",
          value: 2.2
        },
        {
          date: "2018-10-01",
          value: 2.13
        },
        {
          date: "2018-11-01",
          value: 2.22
        },
        {
          date: "2018-12-01",
          value: 2.25
        },
        {
          date: "2019-01-01",
          value: 2.18
        },
        {
          date: "2019-02-01",
          value: 2.14
        },
        {
          date: "2019-03-01",
          value: 2.07
        },
        {
          date: "2019-04-01",
          value: 2.09
        },
        {
          date: "2019-05-01",
          value: 1.97
        },
        {
          date: "2019-06-01",
          value: 2.07
        },
        {
          date: "2019-07-01",
          value: 2.17
        },
        {
          date: "2019-08-01",
          value: 2.32
        },
        {
          date: "2019-09-01",
          value: 2.33
        },
        {
          date: "2019-10-01",
          value: 2.34
        },
        {
          date: "2019-11-01",
          value: 2.35
        },
        {
          date: "2019-12-01",
          value: 2.29
        },
        {
          date: "2020-01-01",
          value: 2.28
        },
        {
          date: "2020-02-01",
          value: 2.37
        },
        {
          date: "2020-03-01",
          value: 2.1
        },
        {
          date: "2020-04-01",
          value: 1.43
        },
        {
          date: "2020-05-01",
          value: 1.22
        },
        {
          date: "2020-06-01",
          value: 1.18
        },
        {
          date: "2020-07-01",
          value: 1.56
        },
        {
          date: "2020-08-01",
          value: 1.72
        },
        {
          date: "2020-09-01",
          value: 1.72
        },
        {
          date: "2020-10-01",
          value: 1.64
        },
        {
          date: "2020-11-01",
          value: 1.67
        },
        {
          date: "2020-12-01",
          value: 1.62
        },
        {
          date: "2021-01-01",
          value: 1.38
        },
        {
          date: "2021-02-01",
          value: 1.28
        },
        {
          date: "2021-03-01",
          value: 1.65
        },
        {
          date: "2021-04-01",
          value: 2.98
        },
        {
          date: "2021-05-01",
          value: 3.79
        },
        {
          date: "2021-06-01",
          value: 4.44
        },
        {
          date: "2021-07-01",
          value: 4.21
        },
        {
          date: "2021-08-01",
          value: 3.94
        },
        {
          date: "2021-09-01",
          value: 4
        },
        {
          date: "2021-10-01",
          value: 4.59
        },
        {
          date: "2021-11-01",
          value: 4.97
        },
        {
          date: "2021-12-01",
          value: 5.49
        },
        {
          date: "2022-01-01",
          value: 6.05
        },
        {
          date: "2022-02-01",
          value: 6.46
        },
        {
          date: "2022-03-01",
          value: 6.48
        },
        {
          date: "2022-04-01",
          value: 6.16
        },
        {
          date: "2022-05-01",
          value: 6.03
        },
        {
          date: "2022-06-01",
          value: 5.91
        },
        {
          date: "2022-07-01",
          value: 5.9
        },
        {
          date: "2022-08-01",
          value: 6.29
        },
        {
          date: "2022-09-01",
          value: 6.62
        },
        {
          date: "2022-10-01",
          value: 6.29
        },
        {
          date: "2022-11-01",
          value: 5.97
        },
        {
          date: "2022-12-01",
          value: 5.69
        },
        {
          date: "2023-01-01",
          value: 5.54
        },
        {
          date: "2023-02-01",
          value: 5.5
        },
        {
          date: "2023-03-01",
          value: 5.57
        },
        {
          date: "2023-04-01",
          value: 5.51
        },
        {
          date: "2023-05-01",
          value: 5.34
        },
        {
          date: "2023-06-01",
          value: 4.85
        },
        {
          date: "2023-07-01",
          value: 4.7
        },
        {
          date: "2023-08-01",
          value: 4.4
        },
        {
          date: "2023-09-01",
          value: 4.13
        },
        {
          date: "2023-10-01",
          value: 4.03
        },
        {
          date: "2023-11-01",
          value: 4.02
        },
        {
          date: "2023-12-01",
          value: 3.92
        },
        {
          date: "2024-01-01",
          value: 3.86
        },
        {
          date: "2024-02-01",
          value: 3.76
        },
        {
          date: "2024-03-01",
          value: 3.82
        },
        {
          date: "2024-04-01",
          value: 3.63
        },
        {
          date: "2024-05-01",
          value: 3.39
        },
        {
          date: "2024-06-01",
          value: 3.27
        },
        {
          date: "2024-07-01",
          value: 3.23
        },
        {
          date: "2024-08-01",
          value: 3.29
        },
        {
          date: "2024-09-01",
          value: 3.28
        },
        {
          date: "2024-10-01",
          value: 3.3
        },
        {
          date: "2024-11-01",
          value: 3.29
        },
        {
          date: "2024-12-01",
          value: 3.21
        },
        {
          date: "2025-01-01",
          value: 3.28
        },
        {
          date: "2025-02-01",
          value: 3.14
        },
        {
          date: "2025-03-01",
          value: 2.81
        },
        {
          date: "2025-04-01",
          value: 2.78
        },
        {
          date: "2025-05-01",
          value: 2.8
        },
        {
          date: "2025-06-01",
          value: 2.9
        },
        {
          date: "2025-07-01",
          value: 3.1
        },
        {
          date: "2025-08-01",
          value: 3.1
        },
        {
          date: "2025-09-01",
          value: 3.02
        },
        {
          date: "2025-11-01",
          value: 2.6
        },
        {
          date: "2025-12-01",
          value: 2.6
        },
        {
          date: "2026-01-01",
          value: 2.5
        },
        {
          date: "2026-02-01",
          value: 2.5
        },
        {
          date: "2026-03-01",
          value: 2.6
        },
        {
          date: "2026-04-01",
          value: 2.8
        },
        {
          date: "2026-05-01",
          value: 2.9
        },
        {
          date: "2026-06-01",
          value: 2.6
        },
        {
          date: "2026-07-01",
          value: 2.5
        }
      ]
    },
    ppi: {
      id: "ppi",
      fred: "PPIACO",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: 4.7
      },
      points: [
        {
          date: "2016-08-01",
          value: -2.76
        },
        {
          date: "2016-09-01",
          value: -1.16
        },
        {
          date: "2016-10-01",
          value: -0.43
        },
        {
          date: "2016-11-01",
          value: 0.32
        },
        {
          date: "2016-12-01",
          value: 2.56
        },
        {
          date: "2017-01-01",
          value: 4.44
        },
        {
          date: "2017-02-01",
          value: 5.68
        },
        {
          date: "2017-03-01",
          value: 5.16
        },
        {
          date: "2017-04-01",
          value: 5.35
        },
        {
          date: "2017-05-01",
          value: 4.05
        },
        {
          date: "2017-06-01",
          value: 3.2
        },
        {
          date: "2017-07-01",
          value: 3.09
        },
        {
          date: "2017-08-01",
          value: 3.86
        },
        {
          date: "2017-09-01",
          value: 4.23
        },
        {
          date: "2017-10-01",
          value: 4.39
        },
        {
          date: "2017-11-01",
          value: 5.15
        },
        {
          date: "2017-12-01",
          value: 4.3
        },
        {
          date: "2018-01-01",
          value: 3.78
        },
        {
          date: "2018-02-01",
          value: 4.02
        },
        {
          date: "2018-03-01",
          value: 4.07
        },
        {
          date: "2018-04-01",
          value: 3.78
        },
        {
          date: "2018-05-01",
          value: 5.39
        },
        {
          date: "2018-06-01",
          value: 5.48
        },
        {
          date: "2018-07-01",
          value: 5.58
        },
        {
          date: "2018-08-01",
          value: 4.95
        },
        {
          date: "2018-09-01",
          value: 4.52
        },
        {
          date: "2018-10-01",
          value: 4.98
        },
        {
          date: "2018-11-01",
          value: 3.27
        },
        {
          date: "2018-12-01",
          value: 2.39
        },
        {
          date: "2019-01-01",
          value: 0.61
        },
        {
          date: "2019-02-01",
          value: -0.05
        },
        {
          date: "2019-03-01",
          value: 0.75
        },
        {
          date: "2019-04-01",
          value: 0.9
        },
        {
          date: "2019-05-01",
          value: -0.74
        },
        {
          date: "2019-06-01",
          value: -1.91
        },
        {
          date: "2019-07-01",
          value: -1.76
        },
        {
          date: "2019-08-01",
          value: -2.06
        },
        {
          date: "2019-09-01",
          value: -2.55
        },
        {
          date: "2019-10-01",
          value: -2.93
        },
        {
          date: "2019-11-01",
          value: -1.63
        },
        {
          date: "2019-12-01",
          value: -1
        },
        {
          date: "2020-01-01",
          value: 0.1
        },
        {
          date: "2020-02-01",
          value: -1.26
        },
        {
          date: "2020-03-01",
          value: -3.83
        },
        {
          date: "2020-04-01",
          value: -8.21
        },
        {
          date: "2020-05-01",
          value: -6.49
        },
        {
          date: "2020-06-01",
          value: -4.54
        },
        {
          date: "2020-07-01",
          value: -3.84
        },
        {
          date: "2020-08-01",
          value: -2.46
        },
        {
          date: "2020-09-01",
          value: -1.46
        },
        {
          date: "2020-10-01",
          value: -1.06
        },
        {
          date: "2020-11-01",
          value: -0.35
        },
        {
          date: "2020-12-01",
          value: 0.75
        },
        {
          date: "2021-01-01",
          value: 2.76
        },
        {
          date: "2021-02-01",
          value: 7.07
        },
        {
          date: "2021-03-01",
          value: 11.34
        },
        {
          date: "2021-04-01",
          value: 17.47
        },
        {
          date: "2021-05-01",
          value: 19.25
        },
        {
          date: "2021-06-01",
          value: 19.72
        },
        {
          date: "2021-07-01",
          value: 20.13
        },
        {
          date: "2021-08-01",
          value: 20.13
        },
        {
          date: "2021-09-01",
          value: 20.55
        },
        {
          date: "2021-10-01",
          value: 22.37
        },
        {
          date: "2021-11-01",
          value: 22.69
        },
        {
          date: "2021-12-01",
          value: 20.37
        },
        {
          date: "2022-01-01",
          value: 20.34
        },
        {
          date: "2022-02-01",
          value: 19.97
        },
        {
          date: "2022-03-01",
          value: 20.94
        },
        {
          date: "2022-04-01",
          value: 21.76
        },
        {
          date: "2022-05-01",
          value: 21.5
        },
        {
          date: "2022-06-01",
          value: 22.43
        },
        {
          date: "2022-07-01",
          value: 17.44
        },
        {
          date: "2022-08-01",
          value: 15.48
        },
        {
          date: "2022-09-01",
          value: 13.67
        },
        {
          date: "2022-10-01",
          value: 10.23
        },
        {
          date: "2022-11-01",
          value: 8.17
        },
        {
          date: "2022-12-01",
          value: 6.86
        },
        {
          date: "2023-01-01",
          value: 5.59
        },
        {
          date: "2023-02-01",
          value: 2.38
        },
        {
          date: "2023-03-01",
          value: -1.14
        },
        {
          date: "2023-04-01",
          value: -3.17
        },
        {
          date: "2023-05-01",
          value: -7.17
        },
        {
          date: "2023-06-01",
          value: -9.42
        },
        {
          date: "2023-07-01",
          value: -6.77
        },
        {
          date: "2023-08-01",
          value: -4.4
        },
        {
          date: "2023-09-01",
          value: -3.35
        },
        {
          date: "2023-10-01",
          value: -3.72
        },
        {
          date: "2023-11-01",
          value: -3.91
        },
        {
          date: "2023-12-01",
          value: -3.11
        },
        {
          date: "2024-01-01",
          value: -3.43
        },
        {
          date: "2024-02-01",
          value: -1.45
        },
        {
          date: "2024-03-01",
          value: -0.77
        },
        {
          date: "2024-04-01",
          value: 0.03
        },
        {
          date: "2024-05-01",
          value: 0.65
        },
        {
          date: "2024-06-01",
          value: 0.81
        },
        {
          date: "2024-07-01",
          value: 1.37
        },
        {
          date: "2024-08-01",
          value: -0.86
        },
        {
          date: "2024-09-01",
          value: -2.41
        },
        {
          date: "2024-10-01",
          value: -0.83
        },
        {
          date: "2024-11-01",
          value: 0.14
        },
        {
          date: "2024-12-01",
          value: 1.42
        },
        {
          date: "2025-01-01",
          value: 2.41
        },
        {
          date: "2025-02-01",
          value: 1.79
        },
        {
          date: "2025-03-01",
          value: 1.34
        },
        {
          date: "2025-04-01",
          value: 0.55
        },
        {
          date: "2025-05-01",
          value: 1.32
        },
        {
          date: "2025-06-01",
          value: 1.79
        },
        {
          date: "2025-07-01",
          value: 1.96
        },
        {
          date: "2025-08-01",
          value: 2.6
        },
        {
          date: "2025-09-01",
          value: 3.71
        },
        {
          date: "2025-10-01",
          value: 2.97
        },
        {
          date: "2025-11-01",
          value: 3.44
        },
        {
          date: "2025-12-01",
          value: 3
        },
        {
          date: "2026-01-01",
          value: 2.43
        },
        {
          date: "2026-02-01",
          value: 3.87
        },
        {
          date: "2026-03-01",
          value: 6.8
        },
        {
          date: "2026-04-01",
          value: 6
        },
        {
          date: "2026-05-01",
          value: 6.5
        },
        {
          date: "2026-06-01",
          value: 5.5
        },
        {
          date: "2026-07-01",
          value: 4.7
        }
      ]
    },
    corepce: {
      id: "corepce",
      fred: "PCEPILFE",
      mode: "mom_pct",
      unit: "%",
      updated: "2026-08-29T10:40:41.942Z",
      last: {
        date: "2026-07-01",
        value: 0.2
      },
      points: [
        {
          date: "2016-08-01",
          value: 0.18
        },
        {
          date: "2016-09-01",
          value: 0.13
        },
        {
          date: "2016-10-01",
          value: 0.13
        },
        {
          date: "2016-11-01",
          value: 0.04
        },
        {
          date: "2016-12-01",
          value: 0.12
        },
        {
          date: "2017-01-01",
          value: 0.27
        },
        {
          date: "2017-02-01",
          value: 0.18
        },
        {
          date: "2017-03-01",
          value: -0.04
        },
        {
          date: "2017-04-01",
          value: 0.2
        },
        {
          date: "2017-05-01",
          value: 0.08
        },
        {
          date: "2017-06-01",
          value: 0.13
        },
        {
          date: "2017-07-01",
          value: 0.07
        },
        {
          date: "2017-08-01",
          value: 0.11
        },
        {
          date: "2017-09-01",
          value: 0.12
        },
        {
          date: "2017-10-01",
          value: 0.25
        },
        {
          date: "2017-11-01",
          value: 0.05
        },
        {
          date: "2017-12-01",
          value: 0.15
        },
        {
          date: "2018-01-01",
          value: 0.32
        },
        {
          date: "2018-02-01",
          value: 0.19
        },
        {
          date: "2018-03-01",
          value: 0.22
        },
        {
          date: "2018-04-01",
          value: 0.18
        },
        {
          date: "2018-05-01",
          value: 0.18
        },
        {
          date: "2018-06-01",
          value: 0.09
        },
        {
          date: "2018-07-01",
          value: 0.13
        },
        {
          date: "2018-08-01",
          value: 0.01
        },
        {
          date: "2018-09-01",
          value: 0.19
        },
        {
          date: "2018-10-01",
          value: 0.16
        },
        {
          date: "2018-11-01",
          value: 0.19
        },
        {
          date: "2018-12-01",
          value: 0.17
        },
        {
          date: "2019-01-01",
          value: 0.13
        },
        {
          date: "2019-02-01",
          value: 0.09
        },
        {
          date: "2019-03-01",
          value: 0.09
        },
        {
          date: "2019-04-01",
          value: 0.2
        },
        {
          date: "2019-05-01",
          value: 0.1
        },
        {
          date: "2019-06-01",
          value: 0.18
        },
        {
          date: "2019-07-01",
          value: 0.11
        },
        {
          date: "2019-08-01",
          value: 0.11
        },
        {
          date: "2019-09-01",
          value: 0.07
        },
        {
          date: "2019-10-01",
          value: 0.15
        },
        {
          date: "2019-11-01",
          value: 0.06
        },
        {
          date: "2019-12-01",
          value: 0.22
        },
        {
          date: "2020-01-01",
          value: 0.18
        },
        {
          date: "2020-02-01",
          value: 0.2
        },
        {
          date: "2020-03-01",
          value: -0.08
        },
        {
          date: "2020-04-01",
          value: -0.32
        },
        {
          date: "2020-05-01",
          value: 0.1
        },
        {
          date: "2020-06-01",
          value: 0.16
        },
        {
          date: "2020-07-01",
          value: 0.36
        },
        {
          date: "2020-08-01",
          value: 0.29
        },
        {
          date: "2020-09-01",
          value: 0.16
        },
        {
          date: "2020-10-01",
          value: 0.09
        },
        {
          date: "2020-11-01",
          value: 0.09
        },
        {
          date: "2020-12-01",
          value: 0.28
        },
        {
          date: "2021-01-01",
          value: 0.36
        },
        {
          date: "2021-02-01",
          value: 0.21
        },
        {
          date: "2021-03-01",
          value: 0.41
        },
        {
          date: "2021-04-01",
          value: 0.58
        },
        {
          date: "2021-05-01",
          value: 0.5
        },
        {
          date: "2021-06-01",
          value: 0.47
        },
        {
          date: "2021-07-01",
          value: 0.42
        },
        {
          date: "2021-08-01",
          value: 0.32
        },
        {
          date: "2021-09-01",
          value: 0.21
        },
        {
          date: "2021-10-01",
          value: 0.5
        },
        {
          date: "2021-11-01",
          value: 0.53
        },
        {
          date: "2021-12-01",
          value: 0.58
        },
        {
          date: "2022-01-01",
          value: 0.5
        },
        {
          date: "2022-02-01",
          value: 0.44
        },
        {
          date: "2022-03-01",
          value: 0.4
        },
        {
          date: "2022-04-01",
          value: 0.35
        },
        {
          date: "2022-05-01",
          value: 0.35
        },
        {
          date: "2022-06-01",
          value: 0.59
        },
        {
          date: "2022-07-01",
          value: 0.22
        },
        {
          date: "2022-08-01",
          value: 0.57
        },
        {
          date: "2022-09-01",
          value: 0.44
        },
        {
          date: "2022-10-01",
          value: 0.36
        },
        {
          date: "2022-11-01",
          value: 0.29
        },
        {
          date: "2022-12-01",
          value: 0.35
        },
        {
          date: "2023-01-01",
          value: 0.47
        },
        {
          date: "2023-02-01",
          value: 0.36
        },
        {
          date: "2023-03-01",
          value: 0.33
        },
        {
          date: "2023-04-01",
          value: 0.35
        },
        {
          date: "2023-05-01",
          value: 0.29
        },
        {
          date: "2023-06-01",
          value: 0.26
        },
        {
          date: "2023-07-01",
          value: 0.14
        },
        {
          date: "2023-08-01",
          value: 0.11
        },
        {
          date: "2023-09-01",
          value: 0.31
        },
        {
          date: "2023-10-01",
          value: 0.15
        },
        {
          date: "2023-11-01",
          value: 0.11
        },
        {
          date: "2023-12-01",
          value: 0.18
        },
        {
          date: "2024-01-01",
          value: 0.52
        },
        {
          date: "2024-02-01",
          value: 0.26
        },
        {
          date: "2024-03-01",
          value: 0.39
        },
        {
          date: "2024-04-01",
          value: 0.24
        },
        {
          date: "2024-05-01",
          value: 0.06
        },
        {
          date: "2024-06-01",
          value: 0.24
        },
        {
          date: "2024-07-01",
          value: 0.19
        },
        {
          date: "2024-08-01",
          value: 0.18
        },
        {
          date: "2024-09-01",
          value: 0.27
        },
        {
          date: "2024-10-01",
          value: 0.3
        },
        {
          date: "2024-11-01",
          value: 0.1
        },
        {
          date: "2024-12-01",
          value: 0.19
        },
        {
          date: "2025-01-01",
          value: 0.31
        },
        {
          date: "2025-02-01",
          value: 0.45
        },
        {
          date: "2025-03-01",
          value: 0.1
        },
        {
          date: "2025-04-01",
          value: 0.19
        },
        {
          date: "2025-05-01",
          value: 0.23
        },
        {
          date: "2025-06-01",
          value: 0.26
        },
        {
          date: "2025-07-01",
          value: 0.25
        },
        {
          date: "2025-08-01",
          value: 0.22
        },
        {
          date: "2025-09-01",
          value: 0.19
        },
        {
          date: "2025-10-01",
          value: 0.2
        },
        {
          date: "2025-11-01",
          value: 0.2
        },
        {
          date: "2025-12-01",
          value: 0.4
        },
        {
          date: "2026-01-01",
          value: 0.4
        },
        {
          date: "2026-02-01",
          value: 0.4
        },
        {
          date: "2026-03-01",
          value: 0.3
        },
        {
          date: "2026-04-01",
          value: 0.5
        },
        {
          date: "2026-05-01",
          value: 0.3
        },
        {
          date: "2026-06-01",
          value: 0.1
        },
        {
          date: "2026-07-01",
          value: 0.2
        }
      ]
    },
    ahe: {
      id: "ahe",
      fred: "CES0500000003",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: 3.15
      },
      points: [
        {
          date: "2016-08-01",
          value: 2.43
        },
        {
          date: "2016-09-01",
          value: 2.63
        },
        {
          date: "2016-10-01",
          value: 2.78
        },
        {
          date: "2016-11-01",
          value: 2.57
        },
        {
          date: "2016-12-01",
          value: 2.69
        },
        {
          date: "2017-01-01",
          value: 2.48
        },
        {
          date: "2017-02-01",
          value: 2.72
        },
        {
          date: "2017-03-01",
          value: 2.59
        },
        {
          date: "2017-04-01",
          value: 2.55
        },
        {
          date: "2017-05-01",
          value: 2.46
        },
        {
          date: "2017-06-01",
          value: 2.5
        },
        {
          date: "2017-07-01",
          value: 2.57
        },
        {
          date: "2017-08-01",
          value: 2.57
        },
        {
          date: "2017-09-01",
          value: 2.79
        },
        {
          date: "2017-10-01",
          value: 2.32
        },
        {
          date: "2017-11-01",
          value: 2.47
        },
        {
          date: "2017-12-01",
          value: 2.7
        },
        {
          date: "2018-01-01",
          value: 2.77
        },
        {
          date: "2018-02-01",
          value: 2.57
        },
        {
          date: "2018-03-01",
          value: 2.83
        },
        {
          date: "2018-04-01",
          value: 2.79
        },
        {
          date: "2018-05-01",
          value: 2.94
        },
        {
          date: "2018-06-01",
          value: 2.93
        },
        {
          date: "2018-07-01",
          value: 2.85
        },
        {
          date: "2018-08-01",
          value: 3.19
        },
        {
          date: "2018-09-01",
          value: 3.13
        },
        {
          date: "2018-10-01",
          value: 3.28
        },
        {
          date: "2018-11-01",
          value: 3.39
        },
        {
          date: "2018-12-01",
          value: 3.49
        },
        {
          date: "2019-01-01",
          value: 3.26
        },
        {
          date: "2019-02-01",
          value: 3.55
        },
        {
          date: "2019-03-01",
          value: 3.43
        },
        {
          date: "2019-04-01",
          value: 3.27
        },
        {
          date: "2019-05-01",
          value: 3.34
        },
        {
          date: "2019-06-01",
          value: 3.48
        },
        {
          date: "2019-07-01",
          value: 3.43
        },
        {
          date: "2019-08-01",
          value: 3.42
        },
        {
          date: "2019-09-01",
          value: 3.07
        },
        {
          date: "2019-10-01",
          value: 3.18
        },
        {
          date: "2019-11-01",
          value: 3.28
        },
        {
          date: "2019-12-01",
          value: 2.98
        },
        {
          date: "2020-01-01",
          value: 3.04
        },
        {
          date: "2020-02-01",
          value: 3.07
        },
        {
          date: "2020-03-01",
          value: 3.46
        },
        {
          date: "2020-04-01",
          value: 8.1
        },
        {
          date: "2020-05-01",
          value: 6.6
        },
        {
          date: "2020-06-01",
          value: 5.04
        },
        {
          date: "2020-07-01",
          value: 4.85
        },
        {
          date: "2020-08-01",
          value: 4.8
        },
        {
          date: "2020-09-01",
          value: 4.79
        },
        {
          date: "2020-10-01",
          value: 4.6
        },
        {
          date: "2020-11-01",
          value: 4.59
        },
        {
          date: "2020-12-01",
          value: 5.39
        },
        {
          date: "2021-01-01",
          value: 5.28
        },
        {
          date: "2021-02-01",
          value: 5.29
        },
        {
          date: "2021-03-01",
          value: 4.52
        },
        {
          date: "2021-04-01",
          value: 0.6
        },
        {
          date: "2021-05-01",
          value: 2.32
        },
        {
          date: "2021-06-01",
          value: 3.95
        },
        {
          date: "2021-07-01",
          value: 4.32
        },
        {
          date: "2021-08-01",
          value: 4.37
        },
        {
          date: "2021-09-01",
          value: 4.98
        },
        {
          date: "2021-10-01",
          value: 5.42
        },
        {
          date: "2021-11-01",
          value: 5.36
        },
        {
          date: "2021-12-01",
          value: 4.95
        },
        {
          date: "2022-01-01",
          value: 5.58
        },
        {
          date: "2022-02-01",
          value: 5.29
        },
        {
          date: "2022-03-01",
          value: 5.89
        },
        {
          date: "2022-04-01",
          value: 5.76
        },
        {
          date: "2022-05-01",
          value: 5.56
        },
        {
          date: "2022-06-01",
          value: 5.4
        },
        {
          date: "2022-07-01",
          value: 5.48
        },
        {
          date: "2022-08-01",
          value: 5.39
        },
        {
          date: "2022-09-01",
          value: 5.13
        },
        {
          date: "2022-10-01",
          value: 5.01
        },
        {
          date: "2022-11-01",
          value: 5.09
        },
        {
          date: "2022-12-01",
          value: 4.94
        },
        {
          date: "2023-01-01",
          value: 4.49
        },
        {
          date: "2023-02-01",
          value: 4.77
        },
        {
          date: "2023-03-01",
          value: 4.62
        },
        {
          date: "2023-04-01",
          value: 4.6
        },
        {
          date: "2023-05-01",
          value: 4.36
        },
        {
          date: "2023-06-01",
          value: 4.66
        },
        {
          date: "2023-07-01",
          value: 4.67
        },
        {
          date: "2023-08-01",
          value: 4.47
        },
        {
          date: "2023-09-01",
          value: 4.42
        },
        {
          date: "2023-10-01",
          value: 4.22
        },
        {
          date: "2023-11-01",
          value: 4.11
        },
        {
          date: "2023-12-01",
          value: 4.1
        },
        {
          date: "2024-01-01",
          value: 4.39
        },
        {
          date: "2024-02-01",
          value: 4.13
        },
        {
          date: "2024-03-01",
          value: 4.15
        },
        {
          date: "2024-04-01",
          value: 3.98
        },
        {
          date: "2024-05-01",
          value: 4.15
        },
        {
          date: "2024-06-01",
          value: 3.92
        },
        {
          date: "2024-07-01",
          value: 3.63
        },
        {
          date: "2024-08-01",
          value: 3.92
        },
        {
          date: "2024-09-01",
          value: 3.91
        },
        {
          date: "2024-10-01",
          value: 4.05
        },
        {
          date: "2024-11-01",
          value: 4.18
        },
        {
          date: "2024-12-01",
          value: 4.08
        },
        {
          date: "2025-01-01",
          value: 3.97
        },
        {
          date: "2025-02-01",
          value: 4.11
        },
        {
          date: "2025-03-01",
          value: 4.21
        },
        {
          date: "2025-04-01",
          value: 3.91
        },
        {
          date: "2025-05-01",
          value: 3.98
        },
        {
          date: "2025-06-01",
          value: 3.7
        },
        {
          date: "2025-07-01",
          value: 3.96
        },
        {
          date: "2025-08-01",
          value: 3.98
        },
        {
          date: "2025-09-01",
          value: 3.85
        },
        {
          date: "2025-10-01",
          value: 3.92
        },
        {
          date: "2025-11-01",
          value: 3.93
        },
        {
          date: "2025-12-01",
          value: 3.8
        },
        {
          date: "2026-01-01",
          value: 3.7
        },
        {
          date: "2026-02-01",
          value: 3.7
        },
        {
          date: "2026-03-01",
          value: 3.43
        },
        {
          date: "2026-04-01",
          value: 3.6
        },
        {
          date: "2026-05-01",
          value: 3.34
        },
        {
          date: "2026-06-01",
          value: 3.5
        },
        {
          date: "2026-07-01",
          value: 3.15
        }
      ]
    },
    fedfunds: {
      id: "fedfunds",
      fred: "DFEDTARU",
      mode: "level",
      unit: "%",
      updated: "2026-08-29T10:40:43.716Z",
      last: {
        date: "2026-08-01",
        value: 3.75
      },
      points: [
        {
          date: "2016-09-01",
          value: 0.5
        },
        {
          date: "2016-10-01",
          value: 0.5
        },
        {
          date: "2016-11-01",
          value: 0.5
        },
        {
          date: "2016-12-01",
          value: 0.65
        },
        {
          date: "2017-01-01",
          value: 0.75
        },
        {
          date: "2017-02-01",
          value: 0.75
        },
        {
          date: "2017-03-01",
          value: 0.88
        },
        {
          date: "2017-04-01",
          value: 1
        },
        {
          date: "2017-05-01",
          value: 1
        },
        {
          date: "2017-06-01",
          value: 1.13
        },
        {
          date: "2017-07-01",
          value: 1.25
        },
        {
          date: "2017-08-01",
          value: 1.25
        },
        {
          date: "2017-09-01",
          value: 1.25
        },
        {
          date: "2017-10-01",
          value: 1.25
        },
        {
          date: "2017-11-01",
          value: 1.25
        },
        {
          date: "2017-12-01",
          value: 1.4
        },
        {
          date: "2018-01-01",
          value: 1.5
        },
        {
          date: "2018-02-01",
          value: 1.5
        },
        {
          date: "2018-03-01",
          value: 1.58
        },
        {
          date: "2018-04-01",
          value: 1.75
        },
        {
          date: "2018-05-01",
          value: 1.75
        },
        {
          date: "2018-06-01",
          value: 1.89
        },
        {
          date: "2018-07-01",
          value: 2
        },
        {
          date: "2018-08-01",
          value: 2
        },
        {
          date: "2018-09-01",
          value: 2.03
        },
        {
          date: "2018-10-01",
          value: 2.25
        },
        {
          date: "2018-11-01",
          value: 2.25
        },
        {
          date: "2018-12-01",
          value: 2.35
        },
        {
          date: "2019-01-01",
          value: 2.5
        },
        {
          date: "2019-02-01",
          value: 2.5
        },
        {
          date: "2019-03-01",
          value: 2.5
        },
        {
          date: "2019-04-01",
          value: 2.5
        },
        {
          date: "2019-05-01",
          value: 2.5
        },
        {
          date: "2019-06-01",
          value: 2.5
        },
        {
          date: "2019-07-01",
          value: 2.5
        },
        {
          date: "2019-08-01",
          value: 2.25
        },
        {
          date: "2019-09-01",
          value: 2.15
        },
        {
          date: "2019-10-01",
          value: 1.99
        },
        {
          date: "2019-11-01",
          value: 1.75
        },
        {
          date: "2019-12-01",
          value: 1.75
        },
        {
          date: "2020-01-01",
          value: 1.75
        },
        {
          date: "2020-02-01",
          value: 1.75
        },
        {
          date: "2020-03-01",
          value: 0.78
        },
        {
          date: "2020-04-01",
          value: 0.25
        },
        {
          date: "2020-05-01",
          value: 0.25
        },
        {
          date: "2020-06-01",
          value: 0.25
        },
        {
          date: "2020-07-01",
          value: 0.25
        },
        {
          date: "2020-08-01",
          value: 0.25
        },
        {
          date: "2020-09-01",
          value: 0.25
        },
        {
          date: "2020-10-01",
          value: 0.25
        },
        {
          date: "2020-11-01",
          value: 0.25
        },
        {
          date: "2020-12-01",
          value: 0.25
        },
        {
          date: "2021-01-01",
          value: 0.25
        },
        {
          date: "2021-02-01",
          value: 0.25
        },
        {
          date: "2021-03-01",
          value: 0.25
        },
        {
          date: "2021-04-01",
          value: 0.25
        },
        {
          date: "2021-05-01",
          value: 0.25
        },
        {
          date: "2021-06-01",
          value: 0.25
        },
        {
          date: "2021-07-01",
          value: 0.25
        },
        {
          date: "2021-08-01",
          value: 0.25
        },
        {
          date: "2021-09-01",
          value: 0.25
        },
        {
          date: "2021-10-01",
          value: 0.25
        },
        {
          date: "2021-11-01",
          value: 0.25
        },
        {
          date: "2021-12-01",
          value: 0.25
        },
        {
          date: "2022-01-01",
          value: 0.25
        },
        {
          date: "2022-02-01",
          value: 0.25
        },
        {
          date: "2022-03-01",
          value: 0.37
        },
        {
          date: "2022-04-01",
          value: 0.5
        },
        {
          date: "2022-05-01",
          value: 0.94
        },
        {
          date: "2022-06-01",
          value: 1.38
        },
        {
          date: "2022-07-01",
          value: 1.85
        },
        {
          date: "2022-08-01",
          value: 2.5
        },
        {
          date: "2022-09-01",
          value: 2.73
        },
        {
          date: "2022-10-01",
          value: 3.25
        },
        {
          date: "2022-11-01",
          value: 3.95
        },
        {
          date: "2022-12-01",
          value: 4.27
        },
        {
          date: "2023-01-01",
          value: 4.5
        },
        {
          date: "2023-02-01",
          value: 4.74
        },
        {
          date: "2023-03-01",
          value: 4.82
        },
        {
          date: "2023-04-01",
          value: 5
        },
        {
          date: "2023-05-01",
          value: 5.23
        },
        {
          date: "2023-06-01",
          value: 5.25
        },
        {
          date: "2023-07-01",
          value: 5.29
        },
        {
          date: "2023-08-01",
          value: 5.5
        },
        {
          date: "2023-09-01",
          value: 5.5
        },
        {
          date: "2023-10-01",
          value: 5.5
        },
        {
          date: "2023-11-01",
          value: 5.5
        },
        {
          date: "2023-12-01",
          value: 5.5
        },
        {
          date: "2024-01-01",
          value: 5.5
        },
        {
          date: "2024-02-01",
          value: 5.5
        },
        {
          date: "2024-03-01",
          value: 5.5
        },
        {
          date: "2024-04-01",
          value: 5.5
        },
        {
          date: "2024-05-01",
          value: 5.5
        },
        {
          date: "2024-06-01",
          value: 5.5
        },
        {
          date: "2024-07-01",
          value: 5.5
        },
        {
          date: "2024-08-01",
          value: 5.5
        },
        {
          date: "2024-09-01",
          value: 5.3
        },
        {
          date: "2024-10-01",
          value: 5
        },
        {
          date: "2024-11-01",
          value: 4.81
        },
        {
          date: "2024-12-01",
          value: 4.65
        },
        {
          date: "2025-01-01",
          value: 4.5
        },
        {
          date: "2025-02-01",
          value: 4.5
        },
        {
          date: "2025-03-01",
          value: 4.5
        },
        {
          date: "2025-04-01",
          value: 4.5
        },
        {
          date: "2025-05-01",
          value: 4.5
        },
        {
          date: "2025-06-01",
          value: 4.5
        },
        {
          date: "2025-07-01",
          value: 4.5
        },
        {
          date: "2025-08-01",
          value: 4.5
        },
        {
          date: "2025-09-01",
          value: 4.39
        },
        {
          date: "2025-10-01",
          value: 4.23
        },
        {
          date: "2025-11-01",
          value: 4
        },
        {
          date: "2025-12-01",
          value: 3.83
        },
        {
          date: "2026-01-01",
          value: 3.75
        },
        {
          date: "2026-02-01",
          value: 3.75
        },
        {
          date: "2026-03-01",
          value: 3.75
        },
        {
          date: "2026-04-01",
          value: 3.75
        },
        {
          date: "2026-05-01",
          value: 3.75
        },
        {
          date: "2026-06-01",
          value: 3.75
        },
        {
          date: "2026-07-01",
          value: 3.75
        },
        {
          date: "2026-08-01",
          value: 3.75
        }
      ]
    },
    dgs10: {
      id: "dgs10",
      fred: "DGS10",
      mode: "level",
      unit: "%",
      updated: "2026-08-29T10:40:45.214Z",
      last: {
        date: "2026-08-01",
        value: 4.68
      },
      points: [
        {
          date: "2016-09-01",
          value: 1.63
        },
        {
          date: "2016-10-01",
          value: 1.76
        },
        {
          date: "2016-11-01",
          value: 2.14
        },
        {
          date: "2016-12-01",
          value: 2.49
        },
        {
          date: "2017-01-01",
          value: 2.43
        },
        {
          date: "2017-02-01",
          value: 2.42
        },
        {
          date: "2017-03-01",
          value: 2.48
        },
        {
          date: "2017-04-01",
          value: 2.3
        },
        {
          date: "2017-05-01",
          value: 2.3
        },
        {
          date: "2017-06-01",
          value: 2.19
        },
        {
          date: "2017-07-01",
          value: 2.32
        },
        {
          date: "2017-08-01",
          value: 2.21
        },
        {
          date: "2017-09-01",
          value: 2.2
        },
        {
          date: "2017-10-01",
          value: 2.36
        },
        {
          date: "2017-11-01",
          value: 2.35
        },
        {
          date: "2017-12-01",
          value: 2.4
        },
        {
          date: "2018-01-01",
          value: 2.58
        },
        {
          date: "2018-02-01",
          value: 2.86
        },
        {
          date: "2018-03-01",
          value: 2.84
        },
        {
          date: "2018-04-01",
          value: 2.87
        },
        {
          date: "2018-05-01",
          value: 2.98
        },
        {
          date: "2018-06-01",
          value: 2.91
        },
        {
          date: "2018-07-01",
          value: 2.89
        },
        {
          date: "2018-08-01",
          value: 2.89
        },
        {
          date: "2018-09-01",
          value: 3
        },
        {
          date: "2018-10-01",
          value: 3.15
        },
        {
          date: "2018-11-01",
          value: 3.12
        },
        {
          date: "2018-12-01",
          value: 2.83
        },
        {
          date: "2019-01-01",
          value: 2.71
        },
        {
          date: "2019-02-01",
          value: 2.68
        },
        {
          date: "2019-03-01",
          value: 2.57
        },
        {
          date: "2019-04-01",
          value: 2.53
        },
        {
          date: "2019-05-01",
          value: 2.4
        },
        {
          date: "2019-06-01",
          value: 2.07
        },
        {
          date: "2019-07-01",
          value: 2.06
        },
        {
          date: "2019-08-01",
          value: 1.63
        },
        {
          date: "2019-09-01",
          value: 1.7
        },
        {
          date: "2019-10-01",
          value: 1.71
        },
        {
          date: "2019-11-01",
          value: 1.81
        },
        {
          date: "2019-12-01",
          value: 1.86
        },
        {
          date: "2020-01-01",
          value: 1.76
        },
        {
          date: "2020-02-01",
          value: 1.5
        },
        {
          date: "2020-03-01",
          value: 0.87
        },
        {
          date: "2020-04-01",
          value: 0.66
        },
        {
          date: "2020-05-01",
          value: 0.67
        },
        {
          date: "2020-06-01",
          value: 0.73
        },
        {
          date: "2020-07-01",
          value: 0.62
        },
        {
          date: "2020-08-01",
          value: 0.65
        },
        {
          date: "2020-09-01",
          value: 0.68
        },
        {
          date: "2020-10-01",
          value: 0.79
        },
        {
          date: "2020-11-01",
          value: 0.87
        },
        {
          date: "2020-12-01",
          value: 0.93
        },
        {
          date: "2021-01-01",
          value: 1.08
        },
        {
          date: "2021-02-01",
          value: 1.26
        },
        {
          date: "2021-03-01",
          value: 1.61
        },
        {
          date: "2021-04-01",
          value: 1.63
        },
        {
          date: "2021-05-01",
          value: 1.62
        },
        {
          date: "2021-06-01",
          value: 1.52
        },
        {
          date: "2021-07-01",
          value: 1.32
        },
        {
          date: "2021-08-01",
          value: 1.28
        },
        {
          date: "2021-09-01",
          value: 1.37
        },
        {
          date: "2021-10-01",
          value: 1.58
        },
        {
          date: "2021-11-01",
          value: 1.56
        },
        {
          date: "2021-12-01",
          value: 1.47
        },
        {
          date: "2022-01-01",
          value: 1.76
        },
        {
          date: "2022-02-01",
          value: 1.93
        },
        {
          date: "2022-03-01",
          value: 2.13
        },
        {
          date: "2022-04-01",
          value: 2.75
        },
        {
          date: "2022-05-01",
          value: 2.9
        },
        {
          date: "2022-06-01",
          value: 3.14
        },
        {
          date: "2022-07-01",
          value: 2.9
        },
        {
          date: "2022-08-01",
          value: 2.9
        },
        {
          date: "2022-09-01",
          value: 3.52
        },
        {
          date: "2022-10-01",
          value: 3.98
        },
        {
          date: "2022-11-01",
          value: 3.89
        },
        {
          date: "2022-12-01",
          value: 3.62
        },
        {
          date: "2023-01-01",
          value: 3.53
        },
        {
          date: "2023-02-01",
          value: 3.75
        },
        {
          date: "2023-03-01",
          value: 3.66
        },
        {
          date: "2023-04-01",
          value: 3.46
        },
        {
          date: "2023-05-01",
          value: 3.57
        },
        {
          date: "2023-06-01",
          value: 3.75
        },
        {
          date: "2023-07-01",
          value: 3.9
        },
        {
          date: "2023-08-01",
          value: 4.17
        },
        {
          date: "2023-09-01",
          value: 4.38
        },
        {
          date: "2023-10-01",
          value: 4.8
        },
        {
          date: "2023-11-01",
          value: 4.5
        },
        {
          date: "2023-12-01",
          value: 4.02
        },
        {
          date: "2024-01-01",
          value: 4.06
        },
        {
          date: "2024-02-01",
          value: 4.21
        },
        {
          date: "2024-03-01",
          value: 4.21
        },
        {
          date: "2024-04-01",
          value: 4.54
        },
        {
          date: "2024-05-01",
          value: 4.48
        },
        {
          date: "2024-06-01",
          value: 4.31
        },
        {
          date: "2024-07-01",
          value: 4.25
        },
        {
          date: "2024-08-01",
          value: 3.87
        },
        {
          date: "2024-09-01",
          value: 3.72
        },
        {
          date: "2024-10-01",
          value: 4.1
        },
        {
          date: "2024-11-01",
          value: 4.36
        },
        {
          date: "2024-12-01",
          value: 4.39
        },
        {
          date: "2025-01-01",
          value: 4.63
        },
        {
          date: "2025-02-01",
          value: 4.45
        },
        {
          date: "2025-03-01",
          value: 4.28
        },
        {
          date: "2025-04-01",
          value: 4.28
        },
        {
          date: "2025-05-01",
          value: 4.42
        },
        {
          date: "2025-06-01",
          value: 4.38
        },
        {
          date: "2025-07-01",
          value: 4.39
        },
        {
          date: "2025-08-01",
          value: 4.26
        },
        {
          date: "2025-09-01",
          value: 4.12
        },
        {
          date: "2025-10-01",
          value: 4.06
        },
        {
          date: "2025-11-01",
          value: 4.09
        },
        {
          date: "2025-12-01",
          value: 4.14
        },
        {
          date: "2026-01-01",
          value: 4.21
        },
        {
          date: "2026-02-01",
          value: 4.13
        },
        {
          date: "2026-03-01",
          value: 4.25
        },
        {
          date: "2026-04-01",
          value: 4.32
        },
        {
          date: "2026-05-01",
          value: 4.48
        },
        {
          date: "2026-06-01",
          value: 4.47
        },
        {
          date: "2026-07-01",
          value: 4.6
        },
        {
          date: "2026-08-01",
          value: 4.68
        }
      ]
    },
    retail: {
      id: "retail",
      fred: "RSXFS",
      mode: "mom_pct",
      unit: "%",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: -0.6
      },
      points: [
        {
          date: "2016-08-01",
          value: -0.06
        },
        {
          date: "2016-09-01",
          value: 0.63
        },
        {
          date: "2016-10-01",
          value: 0.21
        },
        {
          date: "2016-11-01",
          value: -0.24
        },
        {
          date: "2016-12-01",
          value: 1.61
        },
        {
          date: "2017-01-01",
          value: 0.78
        },
        {
          date: "2017-02-01",
          value: -0.03
        },
        {
          date: "2017-03-01",
          value: -0.13
        },
        {
          date: "2017-04-01",
          value: 0.37
        },
        {
          date: "2017-05-01",
          value: -0.62
        },
        {
          date: "2017-06-01",
          value: 0.6
        },
        {
          date: "2017-07-01",
          value: 0.01
        },
        {
          date: "2017-08-01",
          value: 0.12
        },
        {
          date: "2017-09-01",
          value: 2.3
        },
        {
          date: "2017-10-01",
          value: -0.01
        },
        {
          date: "2017-11-01",
          value: 1.01
        },
        {
          date: "2017-12-01",
          value: 0.55
        },
        {
          date: "2018-01-01",
          value: -0.55
        },
        {
          date: "2018-02-01",
          value: 0.54
        },
        {
          date: "2018-03-01",
          value: -0.1
        },
        {
          date: "2018-04-01",
          value: 0.19
        },
        {
          date: "2018-05-01",
          value: 1.51
        },
        {
          date: "2018-06-01",
          value: -0.54
        },
        {
          date: "2018-07-01",
          value: 0.48
        },
        {
          date: "2018-08-01",
          value: -0.01
        },
        {
          date: "2018-09-01",
          value: -0.14
        },
        {
          date: "2018-10-01",
          value: 1.03
        },
        {
          date: "2018-11-01",
          value: 0.62
        },
        {
          date: "2018-12-01",
          value: -2.21
        },
        {
          date: "2019-01-01",
          value: 0.31
        },
        {
          date: "2019-02-01",
          value: 0.22
        },
        {
          date: "2019-03-01",
          value: 1.62
        },
        {
          date: "2019-04-01",
          value: -0.11
        },
        {
          date: "2019-05-01",
          value: 1.09
        },
        {
          date: "2019-06-01",
          value: -0.09
        },
        {
          date: "2019-07-01",
          value: 0.72
        },
        {
          date: "2019-08-01",
          value: 0.72
        },
        {
          date: "2019-09-01",
          value: -0.88
        },
        {
          date: "2019-10-01",
          value: 0.24
        },
        {
          date: "2019-11-01",
          value: 0.77
        },
        {
          date: "2019-12-01",
          value: 0.13
        },
        {
          date: "2020-01-01",
          value: -0.42
        },
        {
          date: "2020-02-01",
          value: 0.04
        },
        {
          date: "2020-03-01",
          value: -6.03
        },
        {
          date: "2020-04-01",
          value: -12.03
        },
        {
          date: "2020-05-01",
          value: 18.27
        },
        {
          date: "2020-06-01",
          value: 6.36
        },
        {
          date: "2020-07-01",
          value: 1.3
        },
        {
          date: "2020-08-01",
          value: 0.39
        },
        {
          date: "2020-09-01",
          value: 1.9
        },
        {
          date: "2020-10-01",
          value: -0.4
        },
        {
          date: "2020-11-01",
          value: -0.56
        },
        {
          date: "2020-12-01",
          value: 1.65
        },
        {
          date: "2021-01-01",
          value: 3.22
        },
        {
          date: "2021-02-01",
          value: -2.55
        },
        {
          date: "2021-03-01",
          value: 10.39
        },
        {
          date: "2021-04-01",
          value: 0.48
        },
        {
          date: "2021-05-01",
          value: -1.03
        },
        {
          date: "2021-06-01",
          value: 0.66
        },
        {
          date: "2021-07-01",
          value: -2.14
        },
        {
          date: "2021-08-01",
          value: 0.73
        },
        {
          date: "2021-09-01",
          value: 0.78
        },
        {
          date: "2021-10-01",
          value: 1.62
        },
        {
          date: "2021-11-01",
          value: 1.05
        },
        {
          date: "2021-12-01",
          value: -0.69
        },
        {
          date: "2022-01-01",
          value: 2.37
        },
        {
          date: "2022-02-01",
          value: 0.63
        },
        {
          date: "2022-03-01",
          value: 1.9
        },
        {
          date: "2022-04-01",
          value: 1.12
        },
        {
          date: "2022-05-01",
          value: -0.19
        },
        {
          date: "2022-06-01",
          value: 0.99
        },
        {
          date: "2022-07-01",
          value: -1.07
        },
        {
          date: "2022-08-01",
          value: 0.33
        },
        {
          date: "2022-09-01",
          value: -0.3
        },
        {
          date: "2022-10-01",
          value: 0.96
        },
        {
          date: "2022-11-01",
          value: -1.48
        },
        {
          date: "2022-12-01",
          value: -1.26
        },
        {
          date: "2023-01-01",
          value: 4.01
        },
        {
          date: "2023-02-01",
          value: -0.98
        },
        {
          date: "2023-03-01",
          value: -1.25
        },
        {
          date: "2023-04-01",
          value: 0.87
        },
        {
          date: "2023-05-01",
          value: 0.41
        },
        {
          date: "2023-06-01",
          value: 0.41
        },
        {
          date: "2023-07-01",
          value: 0.1
        },
        {
          date: "2023-08-01",
          value: 1.01
        },
        {
          date: "2023-09-01",
          value: 0.63
        },
        {
          date: "2023-10-01",
          value: -0.57
        },
        {
          date: "2023-11-01",
          value: -0.33
        },
        {
          date: "2023-12-01",
          value: 0.12
        },
        {
          date: "2024-01-01",
          value: -0.89
        },
        {
          date: "2024-02-01",
          value: 0.72
        },
        {
          date: "2024-03-01",
          value: 0.47
        },
        {
          date: "2024-04-01",
          value: -0.05
        },
        {
          date: "2024-05-01",
          value: 0.79
        },
        {
          date: "2024-06-01",
          value: -0.07
        },
        {
          date: "2024-07-01",
          value: 0.97
        },
        {
          date: "2024-08-01",
          value: -0.37
        },
        {
          date: "2024-09-01",
          value: 0.86
        },
        {
          date: "2024-10-01",
          value: 0.66
        },
        {
          date: "2024-11-01",
          value: 0.58
        },
        {
          date: "2024-12-01",
          value: 0.87
        },
        {
          date: "2025-01-01",
          value: -1.06
        },
        {
          date: "2025-02-01",
          value: 0.24
        },
        {
          date: "2025-03-01",
          value: 1.42
        },
        {
          date: "2025-04-01",
          value: -0.18
        },
        {
          date: "2025-05-01",
          value: -1.24
        },
        {
          date: "2025-06-01",
          value: 0.69
        },
        {
          date: "2025-07-01",
          value: 0.5
        },
        {
          date: "2025-08-01",
          value: 0.57
        },
        {
          date: "2025-09-01",
          value: 0.04
        },
        {
          date: "2025-10-01",
          value: -0.17
        },
        {
          date: "2025-11-01",
          value: -0.1
        },
        {
          date: "2025-12-01",
          value: 0.6
        },
        {
          date: "2026-01-01",
          value: -0.1
        },
        {
          date: "2026-02-01",
          value: -0.1
        },
        {
          date: "2026-03-01",
          value: 0.6
        },
        {
          date: "2026-04-01",
          value: 1.6
        },
        {
          date: "2026-05-01",
          value: 0.5
        },
        {
          date: "2026-06-01",
          value: 0.2
        },
        {
          date: "2026-07-01",
          value: -0.6
        }
      ]
    },
    umich: {
      id: "umich",
      fred: "UMCSENT",
      mode: "level",
      unit: "index",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: 51
      },
      points: [
        {
          date: "2016-08-01",
          value: 89.8
        },
        {
          date: "2016-09-01",
          value: 91.2
        },
        {
          date: "2016-10-01",
          value: 87.2
        },
        {
          date: "2016-11-01",
          value: 93.8
        },
        {
          date: "2016-12-01",
          value: 98.2
        },
        {
          date: "2017-01-01",
          value: 98.5
        },
        {
          date: "2017-02-01",
          value: 96.3
        },
        {
          date: "2017-03-01",
          value: 96.9
        },
        {
          date: "2017-04-01",
          value: 97
        },
        {
          date: "2017-05-01",
          value: 97.1
        },
        {
          date: "2017-06-01",
          value: 95
        },
        {
          date: "2017-07-01",
          value: 93.4
        },
        {
          date: "2017-08-01",
          value: 96.8
        },
        {
          date: "2017-09-01",
          value: 95.1
        },
        {
          date: "2017-10-01",
          value: 100.7
        },
        {
          date: "2017-11-01",
          value: 98.5
        },
        {
          date: "2017-12-01",
          value: 95.9
        },
        {
          date: "2018-01-01",
          value: 95.7
        },
        {
          date: "2018-02-01",
          value: 99.7
        },
        {
          date: "2018-03-01",
          value: 101.4
        },
        {
          date: "2018-04-01",
          value: 98.8
        },
        {
          date: "2018-05-01",
          value: 98
        },
        {
          date: "2018-06-01",
          value: 98.2
        },
        {
          date: "2018-07-01",
          value: 97.9
        },
        {
          date: "2018-08-01",
          value: 96.2
        },
        {
          date: "2018-09-01",
          value: 100.1
        },
        {
          date: "2018-10-01",
          value: 98.6
        },
        {
          date: "2018-11-01",
          value: 97.5
        },
        {
          date: "2018-12-01",
          value: 98.3
        },
        {
          date: "2019-01-01",
          value: 91.2
        },
        {
          date: "2019-02-01",
          value: 93.8
        },
        {
          date: "2019-03-01",
          value: 98.4
        },
        {
          date: "2019-04-01",
          value: 97.2
        },
        {
          date: "2019-05-01",
          value: 100
        },
        {
          date: "2019-06-01",
          value: 98.2
        },
        {
          date: "2019-07-01",
          value: 98.4
        },
        {
          date: "2019-08-01",
          value: 89.8
        },
        {
          date: "2019-09-01",
          value: 93.2
        },
        {
          date: "2019-10-01",
          value: 95.5
        },
        {
          date: "2019-11-01",
          value: 96.8
        },
        {
          date: "2019-12-01",
          value: 99.3
        },
        {
          date: "2020-01-01",
          value: 99.8
        },
        {
          date: "2020-02-01",
          value: 101
        },
        {
          date: "2020-03-01",
          value: 89.1
        },
        {
          date: "2020-04-01",
          value: 71.8
        },
        {
          date: "2020-05-01",
          value: 72.3
        },
        {
          date: "2020-06-01",
          value: 78.1
        },
        {
          date: "2020-07-01",
          value: 72.5
        },
        {
          date: "2020-08-01",
          value: 74.1
        },
        {
          date: "2020-09-01",
          value: 80.4
        },
        {
          date: "2020-10-01",
          value: 81.8
        },
        {
          date: "2020-11-01",
          value: 76.9
        },
        {
          date: "2020-12-01",
          value: 80.7
        },
        {
          date: "2021-01-01",
          value: 79
        },
        {
          date: "2021-02-01",
          value: 76.8
        },
        {
          date: "2021-03-01",
          value: 84.9
        },
        {
          date: "2021-04-01",
          value: 88.3
        },
        {
          date: "2021-05-01",
          value: 82.9
        },
        {
          date: "2021-06-01",
          value: 85.5
        },
        {
          date: "2021-07-01",
          value: 81.2
        },
        {
          date: "2021-08-01",
          value: 70.3
        },
        {
          date: "2021-09-01",
          value: 72.8
        },
        {
          date: "2021-10-01",
          value: 71.7
        },
        {
          date: "2021-11-01",
          value: 67.4
        },
        {
          date: "2021-12-01",
          value: 70.6
        },
        {
          date: "2022-01-01",
          value: 67.2
        },
        {
          date: "2022-02-01",
          value: 62.8
        },
        {
          date: "2022-03-01",
          value: 59.4
        },
        {
          date: "2022-04-01",
          value: 65.2
        },
        {
          date: "2022-05-01",
          value: 58.4
        },
        {
          date: "2022-06-01",
          value: 50
        },
        {
          date: "2022-07-01",
          value: 51.5
        },
        {
          date: "2022-08-01",
          value: 58.2
        },
        {
          date: "2022-09-01",
          value: 58.6
        },
        {
          date: "2022-10-01",
          value: 59.9
        },
        {
          date: "2022-11-01",
          value: 56.7
        },
        {
          date: "2022-12-01",
          value: 59.8
        },
        {
          date: "2023-01-01",
          value: 64.9
        },
        {
          date: "2023-02-01",
          value: 66.9
        },
        {
          date: "2023-03-01",
          value: 62
        },
        {
          date: "2023-04-01",
          value: 63.7
        },
        {
          date: "2023-05-01",
          value: 59
        },
        {
          date: "2023-06-01",
          value: 64.2
        },
        {
          date: "2023-07-01",
          value: 71.5
        },
        {
          date: "2023-08-01",
          value: 69.4
        },
        {
          date: "2023-09-01",
          value: 67.8
        },
        {
          date: "2023-10-01",
          value: 63.8
        },
        {
          date: "2023-11-01",
          value: 61.3
        },
        {
          date: "2023-12-01",
          value: 69.7
        },
        {
          date: "2024-01-01",
          value: 79
        },
        {
          date: "2024-02-01",
          value: 76.9
        },
        {
          date: "2024-03-01",
          value: 79.4
        },
        {
          date: "2024-04-01",
          value: 77.2
        },
        {
          date: "2024-05-01",
          value: 69.1
        },
        {
          date: "2024-06-01",
          value: 68.2
        },
        {
          date: "2024-07-01",
          value: 66.4
        },
        {
          date: "2024-08-01",
          value: 67.9
        },
        {
          date: "2024-09-01",
          value: 70.1
        },
        {
          date: "2024-10-01",
          value: 70.5
        },
        {
          date: "2024-11-01",
          value: 71.8
        },
        {
          date: "2024-12-01",
          value: 74
        },
        {
          date: "2025-01-01",
          value: 71.7
        },
        {
          date: "2025-02-01",
          value: 64.7
        },
        {
          date: "2025-03-01",
          value: 57
        },
        {
          date: "2025-04-01",
          value: 52.2
        },
        {
          date: "2025-05-01",
          value: 52.2
        },
        {
          date: "2025-06-01",
          value: 60.7
        },
        {
          date: "2025-07-01",
          value: 58.6
        },
        {
          date: "2025-08-01",
          value: 55.4
        },
        {
          date: "2025-09-01",
          value: 55
        },
        {
          date: "2025-10-01",
          value: 50.3
        },
        {
          date: "2025-11-01",
          value: 52.9
        },
        {
          date: "2025-12-01",
          value: 56.4
        },
        {
          date: "2026-01-01",
          value: 57.3
        },
        {
          date: "2026-02-01",
          value: 56.6
        },
        {
          date: "2026-03-01",
          value: 47.6
        },
        {
          date: "2026-04-01",
          value: 48.2
        },
        {
          date: "2026-05-01",
          value: 48.9
        },
        {
          date: "2026-06-01",
          value: 55.2
        },
        {
          date: "2026-07-01",
          value: 51
        }
      ]
    },
    indpro: {
      id: "indpro",
      fred: "INDPRO",
      mode: "monthly_change",
      unit: "%",
      updated: "2026-08-29T10:40:46.200Z",
      last: {
        date: "2026-07-01",
        value: 0.21
      },
      points: [
        {
          date: "2016-08-01",
          value: -0.15
        },
        {
          date: "2016-09-01",
          value: -0.1
        },
        {
          date: "2016-10-01",
          value: 0.02
        },
        {
          date: "2016-11-01",
          value: -0.41
        },
        {
          date: "2016-12-01",
          value: 0.67
        },
        {
          date: "2017-01-01",
          value: -0.26
        },
        {
          date: "2017-02-01",
          value: -0.4
        },
        {
          date: "2017-03-01",
          value: 0.65
        },
        {
          date: "2017-04-01",
          value: 1.01
        },
        {
          date: "2017-05-01",
          value: 0.12
        },
        {
          date: "2017-06-01",
          value: 0.21
        },
        {
          date: "2017-07-01",
          value: -0.24
        },
        {
          date: "2017-08-01",
          value: -0.41
        },
        {
          date: "2017-09-01",
          value: 0.1
        },
        {
          date: "2017-10-01",
          value: 1.23
        },
        {
          date: "2017-11-01",
          value: 0.24
        },
        {
          date: "2017-12-01",
          value: 0.2
        },
        {
          date: "2018-01-01",
          value: 0
        },
        {
          date: "2018-02-01",
          value: 0.25
        },
        {
          date: "2018-03-01",
          value: 0.5
        },
        {
          date: "2018-04-01",
          value: 1.13
        },
        {
          date: "2018-05-01",
          value: -0.93
        },
        {
          date: "2018-06-01",
          value: 0.8
        },
        {
          date: "2018-07-01",
          value: 0.17
        },
        {
          date: "2018-08-01",
          value: 0.67
        },
        {
          date: "2018-09-01",
          value: 0.07
        },
        {
          date: "2018-10-01",
          value: -0.11
        },
        {
          date: "2018-11-01",
          value: 0.08
        },
        {
          date: "2018-12-01",
          value: 0.03
        },
        {
          date: "2019-01-01",
          value: -0.69
        },
        {
          date: "2019-02-01",
          value: -0.56
        },
        {
          date: "2019-03-01",
          value: 0.04
        },
        {
          date: "2019-04-01",
          value: -0.6
        },
        {
          date: "2019-05-01",
          value: 0.12
        },
        {
          date: "2019-06-01",
          value: 0.05
        },
        {
          date: "2019-07-01",
          value: -0.5
        },
        {
          date: "2019-08-01",
          value: 0.7
        },
        {
          date: "2019-09-01",
          value: -0.35
        },
        {
          date: "2019-10-01",
          value: -0.86
        },
        {
          date: "2019-11-01",
          value: 0.51
        },
        {
          date: "2019-12-01",
          value: -0.24
        },
        {
          date: "2020-01-01",
          value: -0.67
        },
        {
          date: "2020-02-01",
          value: 0.34
        },
        {
          date: "2020-03-01",
          value: -3.97
        },
        {
          date: "2020-04-01",
          value: -12.85
        },
        {
          date: "2020-05-01",
          value: 1.4
        },
        {
          date: "2020-06-01",
          value: 5.63
        },
        {
          date: "2020-07-01",
          value: 3.43
        },
        {
          date: "2020-08-01",
          value: 0.93
        },
        {
          date: "2020-09-01",
          value: 0.01
        },
        {
          date: "2020-10-01",
          value: 0.77
        },
        {
          date: "2020-11-01",
          value: 0.34
        },
        {
          date: "2020-12-01",
          value: 1.28
        },
        {
          date: "2021-01-01",
          value: 0.52
        },
        {
          date: "2021-02-01",
          value: -3.27
        },
        {
          date: "2021-03-01",
          value: 2.77
        },
        {
          date: "2021-04-01",
          value: 0.17
        },
        {
          date: "2021-05-01",
          value: 0.87
        },
        {
          date: "2021-06-01",
          value: 0.37
        },
        {
          date: "2021-07-01",
          value: 0.45
        },
        {
          date: "2021-08-01",
          value: -0.21
        },
        {
          date: "2021-09-01",
          value: -1.19
        },
        {
          date: "2021-10-01",
          value: 1.33
        },
        {
          date: "2021-11-01",
          value: 0.68
        },
        {
          date: "2021-12-01",
          value: -0.29
        },
        {
          date: "2022-01-01",
          value: -0.39
        },
        {
          date: "2022-02-01",
          value: 0.62
        },
        {
          date: "2022-03-01",
          value: 0.58
        },
        {
          date: "2022-04-01",
          value: 0.05
        },
        {
          date: "2022-05-01",
          value: -0.11
        },
        {
          date: "2022-06-01",
          value: -0.32
        },
        {
          date: "2022-07-01",
          value: 0.2
        },
        {
          date: "2022-08-01",
          value: -0.13
        },
        {
          date: "2022-09-01",
          value: 0.2
        },
        {
          date: "2022-10-01",
          value: -0.04
        },
        {
          date: "2022-11-01",
          value: -0.3
        },
        {
          date: "2022-12-01",
          value: -1.19
        },
        {
          date: "2023-01-01",
          value: 0.74
        },
        {
          date: "2023-02-01",
          value: 0.14
        },
        {
          date: "2023-03-01",
          value: 0.38
        },
        {
          date: "2023-04-01",
          value: 0.23
        },
        {
          date: "2023-05-01",
          value: -0.32
        },
        {
          date: "2023-06-01",
          value: -0.81
        },
        {
          date: "2023-07-01",
          value: 0.79
        },
        {
          date: "2023-08-01",
          value: -0.07
        },
        {
          date: "2023-09-01",
          value: 0.18
        },
        {
          date: "2023-10-01",
          value: -0.55
        },
        {
          date: "2023-11-01",
          value: 0.39
        },
        {
          date: "2023-12-01",
          value: -0.26
        },
        {
          date: "2024-01-01",
          value: -1.38
        },
        {
          date: "2024-02-01",
          value: 1.06
        },
        {
          date: "2024-03-01",
          value: 0.17
        },
        {
          date: "2024-04-01",
          value: -0.21
        },
        {
          date: "2024-05-01",
          value: 0.62
        },
        {
          date: "2024-06-01",
          value: 0.03
        },
        {
          date: "2024-07-01",
          value: -0.92
        },
        {
          date: "2024-08-01",
          value: 0.46
        },
        {
          date: "2024-09-01",
          value: -0.62
        },
        {
          date: "2024-10-01",
          value: -0.34
        },
        {
          date: "2024-11-01",
          value: -0.18
        },
        {
          date: "2024-12-01",
          value: 1.03
        },
        {
          date: "2025-01-01",
          value: -0.26
        },
        {
          date: "2025-02-01",
          value: 1.03
        },
        {
          date: "2025-03-01",
          value: -0.06
        },
        {
          date: "2025-04-01",
          value: 0.09
        },
        {
          date: "2025-05-01",
          value: -0.16
        },
        {
          date: "2025-06-01",
          value: 0.51
        },
        {
          date: "2025-07-01",
          value: 0.42
        },
        {
          date: "2025-08-01",
          value: -0.27
        },
        {
          date: "2025-09-01",
          value: 0.04
        },
        {
          date: "2025-10-01",
          value: -0.45
        },
        {
          date: "2025-11-01",
          value: -0.19
        },
        {
          date: "2025-12-01",
          value: 0.46
        },
        {
          date: "2026-01-01",
          value: -0.46
        },
        {
          date: "2026-02-01",
          value: 0.87
        },
        {
          date: "2026-03-01",
          value: -0.15
        },
        {
          date: "2026-04-01",
          value: 0.77
        },
        {
          date: "2026-05-01",
          value: -0.01
        },
        {
          date: "2026-06-01",
          value: 0.28
        },
        {
          date: "2026-07-01",
          value: 0.21
        }
      ]
    },
    gdp: {
      id: "gdp",
      fred: "GDPC1",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-29T10:40:46.480Z",
      last: {
        date: "2026-07-01",
        value: 1.5
      },
      points: [
        {
          date: "2025-07-01",
          value: 4.3
        },
        {
          date: "2025-10-01",
          value: 0.5
        },
        {
          date: "2026-04-01",
          value: 1.5
        },
        {
          date: "2026-07-01",
          value: 1.5
        }
      ]
    },
    eu_cpi: {
      id: "eu_cpi",
      fred: "CP0000EZ19M086NEST",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-29T10:40:46.818Z",
      last: {
        date: "2026-07-01",
        value: 2.93
      },
      points: [
        {
          date: "2016-08-01",
          value: 0.23
        },
        {
          date: "2016-09-01",
          value: 0.4
        },
        {
          date: "2016-10-01",
          value: 0.51
        },
        {
          date: "2016-11-01",
          value: 0.58
        },
        {
          date: "2016-12-01",
          value: 1.09
        },
        {
          date: "2017-01-01",
          value: 1.74
        },
        {
          date: "2017-02-01",
          value: 1.96
        },
        {
          date: "2017-03-01",
          value: 1.54
        },
        {
          date: "2017-04-01",
          value: 1.89
        },
        {
          date: "2017-05-01",
          value: 1.39
        },
        {
          date: "2017-06-01",
          value: 1.3
        },
        {
          date: "2017-07-01",
          value: 1.33
        },
        {
          date: "2017-08-01",
          value: 1.54
        },
        {
          date: "2017-09-01",
          value: 1.56
        },
        {
          date: "2017-10-01",
          value: 1.38
        },
        {
          date: "2017-11-01",
          value: 1.52
        },
        {
          date: "2017-12-01",
          value: 1.35
        },
        {
          date: "2018-01-01",
          value: 1.3
        },
        {
          date: "2018-02-01",
          value: 1.13
        },
        {
          date: "2018-03-01",
          value: 1.39
        },
        {
          date: "2018-04-01",
          value: 1.24
        },
        {
          date: "2018-05-01",
          value: 1.94
        },
        {
          date: "2018-06-01",
          value: 1.97
        },
        {
          date: "2018-07-01",
          value: 2.2
        },
        {
          date: "2018-08-01",
          value: 2.08
        },
        {
          date: "2018-09-01",
          value: 2.08
        },
        {
          date: "2018-10-01",
          value: 2.28
        },
        {
          date: "2018-11-01",
          value: 1.93
        },
        {
          date: "2018-12-01",
          value: 1.52
        },
        {
          date: "2019-01-01",
          value: 1.38
        },
        {
          date: "2019-02-01",
          value: 1.49
        },
        {
          date: "2019-03-01",
          value: 1.4
        },
        {
          date: "2019-04-01",
          value: 1.72
        },
        {
          date: "2019-05-01",
          value: 1.23
        },
        {
          date: "2019-06-01",
          value: 1.27
        },
        {
          date: "2019-07-01",
          value: 1.02
        },
        {
          date: "2019-08-01",
          value: 1.01
        },
        {
          date: "2019-09-01",
          value: 0.84
        },
        {
          date: "2019-10-01",
          value: 0.73
        },
        {
          date: "2019-11-01",
          value: 0.96
        },
        {
          date: "2019-12-01",
          value: 1.34
        },
        {
          date: "2020-01-01",
          value: 1.36
        },
        {
          date: "2020-02-01",
          value: 1.22
        },
        {
          date: "2020-03-01",
          value: 0.74
        },
        {
          date: "2020-04-01",
          value: 0.32
        },
        {
          date: "2020-05-01",
          value: 0.09
        },
        {
          date: "2020-06-01",
          value: 0.27
        },
        {
          date: "2020-07-01",
          value: 0.39
        },
        {
          date: "2020-08-01",
          value: -0.17
        },
        {
          date: "2020-09-01",
          value: -0.32
        },
        {
          date: "2020-10-01",
          value: -0.27
        },
        {
          date: "2020-11-01",
          value: -0.29
        },
        {
          date: "2020-12-01",
          value: -0.28
        },
        {
          date: "2021-01-01",
          value: 0.91
        },
        {
          date: "2021-02-01",
          value: 0.94
        },
        {
          date: "2021-03-01",
          value: 1.33
        },
        {
          date: "2021-04-01",
          value: 1.61
        },
        {
          date: "2021-05-01",
          value: 1.98
        },
        {
          date: "2021-06-01",
          value: 1.9
        },
        {
          date: "2021-07-01",
          value: 2.16
        },
        {
          date: "2021-08-01",
          value: 2.94
        },
        {
          date: "2021-09-01",
          value: 3.36
        },
        {
          date: "2021-10-01",
          value: 4.05
        },
        {
          date: "2021-11-01",
          value: 4.88
        },
        {
          date: "2021-12-01",
          value: 4.97
        },
        {
          date: "2022-01-01",
          value: 5.11
        },
        {
          date: "2022-02-01",
          value: 5.88
        },
        {
          date: "2022-03-01",
          value: 7.44
        },
        {
          date: "2022-04-01",
          value: 7.45
        },
        {
          date: "2022-05-01",
          value: 8.05
        },
        {
          date: "2022-06-01",
          value: 8.64
        },
        {
          date: "2022-07-01",
          value: 8.86
        },
        {
          date: "2022-08-01",
          value: 9.15
        },
        {
          date: "2022-09-01",
          value: 9.93
        },
        {
          date: "2022-10-01",
          value: 10.62
        },
        {
          date: "2022-11-01",
          value: 10.05
        },
        {
          date: "2022-12-01",
          value: 9.2
        },
        {
          date: "2023-01-01",
          value: 8.64
        },
        {
          date: "2023-02-01",
          value: 8.5
        },
        {
          date: "2023-03-01",
          value: 6.88
        },
        {
          date: "2023-04-01",
          value: 6.94
        },
        {
          date: "2023-05-01",
          value: 6.1
        },
        {
          date: "2023-06-01",
          value: 5.51
        },
        {
          date: "2023-07-01",
          value: 5.28
        },
        {
          date: "2023-08-01",
          value: 5.21
        },
        {
          date: "2023-09-01",
          value: 4.32
        },
        {
          date: "2023-10-01",
          value: 2.87
        },
        {
          date: "2023-11-01",
          value: 2.37
        },
        {
          date: "2023-12-01",
          value: 2.9
        },
        {
          date: "2024-01-01",
          value: 2.76
        },
        {
          date: "2024-02-01",
          value: 2.57
        },
        {
          date: "2024-03-01",
          value: 2.41
        },
        {
          date: "2024-04-01",
          value: 2.35
        },
        {
          date: "2024-05-01",
          value: 2.55
        },
        {
          date: "2024-06-01",
          value: 2.5
        },
        {
          date: "2024-07-01",
          value: 2.58
        },
        {
          date: "2024-08-01",
          value: 2.16
        },
        {
          date: "2024-09-01",
          value: 1.73
        },
        {
          date: "2024-10-01",
          value: 1.99
        },
        {
          date: "2024-11-01",
          value: 2.23
        },
        {
          date: "2024-12-01",
          value: 2.43
        },
        {
          date: "2025-01-01",
          value: 2.5
        },
        {
          date: "2025-02-01",
          value: 2.3
        },
        {
          date: "2025-03-01",
          value: 2.17
        },
        {
          date: "2025-04-01",
          value: 2.16
        },
        {
          date: "2025-05-01",
          value: 1.86
        },
        {
          date: "2025-06-01",
          value: 1.96
        },
        {
          date: "2025-07-01",
          value: 2.01
        },
        {
          date: "2025-08-01",
          value: 2.02
        },
        {
          date: "2025-09-01",
          value: 2.22
        },
        {
          date: "2025-10-01",
          value: 2.08
        },
        {
          date: "2025-11-01",
          value: 2.11
        },
        {
          date: "2025-12-01",
          value: 1.93
        },
        {
          date: "2026-01-01",
          value: 1.64
        },
        {
          date: "2026-02-01",
          value: 1.87
        },
        {
          date: "2026-03-01",
          value: 2.53
        },
        {
          date: "2026-04-01",
          value: 3
        },
        {
          date: "2026-05-01",
          value: 3.14
        },
        {
          date: "2026-06-01",
          value: 2.73
        },
        {
          date: "2026-07-01",
          value: 2.93
        }
      ]
    },
    eu_unemp: {
      id: "eu_unemp",
      fred: "LRHUTTTTEZM156S",
      mode: "level",
      unit: "%",
      updated: "2026-08-29T10:40:47.141Z",
      last: {
        date: "2023-01-01",
        value: 6.7
      },
      points: [
        {
          date: "2013-02-01",
          value: 12.2
        },
        {
          date: "2013-03-01",
          value: 12.2
        },
        {
          date: "2013-04-01",
          value: 12.2
        },
        {
          date: "2013-05-01",
          value: 12.2
        },
        {
          date: "2013-06-01",
          value: 12.2
        },
        {
          date: "2013-07-01",
          value: 12.1
        },
        {
          date: "2013-08-01",
          value: 12.1
        },
        {
          date: "2013-09-01",
          value: 12.1
        },
        {
          date: "2013-10-01",
          value: 12.1
        },
        {
          date: "2013-11-01",
          value: 12.1
        },
        {
          date: "2013-12-01",
          value: 12
        },
        {
          date: "2014-01-01",
          value: 12.1
        },
        {
          date: "2014-02-01",
          value: 12
        },
        {
          date: "2014-03-01",
          value: 12
        },
        {
          date: "2014-04-01",
          value: 11.8
        },
        {
          date: "2014-05-01",
          value: 11.8
        },
        {
          date: "2014-06-01",
          value: 11.6
        },
        {
          date: "2014-07-01",
          value: 11.7
        },
        {
          date: "2014-08-01",
          value: 11.5
        },
        {
          date: "2014-09-01",
          value: 11.6
        },
        {
          date: "2014-10-01",
          value: 11.6
        },
        {
          date: "2014-11-01",
          value: 11.6
        },
        {
          date: "2014-12-01",
          value: 11.5
        },
        {
          date: "2015-01-01",
          value: 11.4
        },
        {
          date: "2015-02-01",
          value: 11.4
        },
        {
          date: "2015-03-01",
          value: 11.3
        },
        {
          date: "2015-04-01",
          value: 11.2
        },
        {
          date: "2015-05-01",
          value: 11.1
        },
        {
          date: "2015-06-01",
          value: 11.1
        },
        {
          date: "2015-07-01",
          value: 10.8
        },
        {
          date: "2015-08-01",
          value: 10.7
        },
        {
          date: "2015-09-01",
          value: 10.7
        },
        {
          date: "2015-10-01",
          value: 10.7
        },
        {
          date: "2015-11-01",
          value: 10.6
        },
        {
          date: "2015-12-01",
          value: 10.6
        },
        {
          date: "2016-01-01",
          value: 10.5
        },
        {
          date: "2016-02-01",
          value: 10.5
        },
        {
          date: "2016-03-01",
          value: 10.3
        },
        {
          date: "2016-04-01",
          value: 10.3
        },
        {
          date: "2016-05-01",
          value: 10.2
        },
        {
          date: "2016-06-01",
          value: 10.2
        },
        {
          date: "2016-07-01",
          value: 10
        },
        {
          date: "2016-08-01",
          value: 10
        },
        {
          date: "2016-09-01",
          value: 9.9
        },
        {
          date: "2016-10-01",
          value: 9.9
        },
        {
          date: "2016-11-01",
          value: 9.9
        },
        {
          date: "2016-12-01",
          value: 9.7
        },
        {
          date: "2017-01-01",
          value: 9.7
        },
        {
          date: "2017-02-01",
          value: 9.6
        },
        {
          date: "2017-03-01",
          value: 9.5
        },
        {
          date: "2017-04-01",
          value: 9.3
        },
        {
          date: "2017-05-01",
          value: 9.3
        },
        {
          date: "2017-06-01",
          value: 9.1
        },
        {
          date: "2017-07-01",
          value: 9.1
        },
        {
          date: "2017-08-01",
          value: 9
        },
        {
          date: "2017-09-01",
          value: 8.9
        },
        {
          date: "2017-10-01",
          value: 8.8
        },
        {
          date: "2017-11-01",
          value: 8.7
        },
        {
          date: "2017-12-01",
          value: 8.7
        },
        {
          date: "2018-01-01",
          value: 8.7
        },
        {
          date: "2018-02-01",
          value: 8.6
        },
        {
          date: "2018-03-01",
          value: 8.5
        },
        {
          date: "2018-04-01",
          value: 8.4
        },
        {
          date: "2018-05-01",
          value: 8.3
        },
        {
          date: "2018-06-01",
          value: 8.2
        },
        {
          date: "2018-07-01",
          value: 8.1
        },
        {
          date: "2018-08-01",
          value: 8
        },
        {
          date: "2018-09-01",
          value: 8
        },
        {
          date: "2018-10-01",
          value: 8
        },
        {
          date: "2018-11-01",
          value: 7.9
        },
        {
          date: "2018-12-01",
          value: 7.9
        },
        {
          date: "2019-01-01",
          value: 7.9
        },
        {
          date: "2019-02-01",
          value: 7.8
        },
        {
          date: "2019-03-01",
          value: 7.7
        },
        {
          date: "2019-04-01",
          value: 7.7
        },
        {
          date: "2019-05-01",
          value: 7.6
        },
        {
          date: "2019-06-01",
          value: 7.5
        },
        {
          date: "2019-07-01",
          value: 7.5
        },
        {
          date: "2019-08-01",
          value: 7.5
        },
        {
          date: "2019-09-01",
          value: 7.5
        },
        {
          date: "2019-10-01",
          value: 7.4
        },
        {
          date: "2019-11-01",
          value: 7.5
        },
        {
          date: "2019-12-01",
          value: 7.5
        },
        {
          date: "2020-01-01",
          value: 7.5
        },
        {
          date: "2020-02-01",
          value: 7.4
        },
        {
          date: "2020-03-01",
          value: 7.2
        },
        {
          date: "2020-04-01",
          value: 7.4
        },
        {
          date: "2020-05-01",
          value: 7.6
        },
        {
          date: "2020-06-01",
          value: 8.1
        },
        {
          date: "2020-07-01",
          value: 8.5
        },
        {
          date: "2020-08-01",
          value: 8.6
        },
        {
          date: "2020-09-01",
          value: 8.6
        },
        {
          date: "2020-10-01",
          value: 8.4
        },
        {
          date: "2020-11-01",
          value: 8.2
        },
        {
          date: "2020-12-01",
          value: 8.2
        },
        {
          date: "2021-01-01",
          value: 8.2
        },
        {
          date: "2021-02-01",
          value: 8.2
        },
        {
          date: "2021-03-01",
          value: 8.2
        },
        {
          date: "2021-04-01",
          value: 8.2
        },
        {
          date: "2021-05-01",
          value: 8
        },
        {
          date: "2021-06-01",
          value: 7.8
        },
        {
          date: "2021-07-01",
          value: 7.7
        },
        {
          date: "2021-08-01",
          value: 7.5
        },
        {
          date: "2021-09-01",
          value: 7.4
        },
        {
          date: "2021-10-01",
          value: 7.3
        },
        {
          date: "2021-11-01",
          value: 7.1
        },
        {
          date: "2021-12-01",
          value: 7
        },
        {
          date: "2022-01-01",
          value: 6.9
        },
        {
          date: "2022-02-01",
          value: 6.8
        },
        {
          date: "2022-03-01",
          value: 6.8
        },
        {
          date: "2022-04-01",
          value: 6.7
        },
        {
          date: "2022-05-01",
          value: 6.7
        },
        {
          date: "2022-06-01",
          value: 6.7
        },
        {
          date: "2022-07-01",
          value: 6.7
        },
        {
          date: "2022-08-01",
          value: 6.7
        },
        {
          date: "2022-09-01",
          value: 6.7
        },
        {
          date: "2022-10-01",
          value: 6.6
        },
        {
          date: "2022-11-01",
          value: 6.7
        },
        {
          date: "2022-12-01",
          value: 6.7
        },
        {
          date: "2023-01-01",
          value: 6.7
        }
      ]
    },
    uk_cpi: {
      id: "uk_cpi",
      fred: "GBRCPIALLMINMEI",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-29T10:40:47.629Z",
      last: {
        date: "2025-03-01",
        value: 3.42
      },
      points: [
        {
          date: "2015-04-01",
          value: 0.3
        },
        {
          date: "2015-05-01",
          value: 0.5
        },
        {
          date: "2015-06-01",
          value: 0.3
        },
        {
          date: "2015-07-01",
          value: 0.4
        },
        {
          date: "2015-08-01",
          value: 0.4
        },
        {
          date: "2015-09-01",
          value: 0.2
        },
        {
          date: "2015-10-01",
          value: 0.2
        },
        {
          date: "2015-11-01",
          value: 0.4
        },
        {
          date: "2015-12-01",
          value: 0.5
        },
        {
          date: "2016-01-01",
          value: 0.71
        },
        {
          date: "2016-02-01",
          value: 0.6
        },
        {
          date: "2016-03-01",
          value: 0.8
        },
        {
          date: "2016-04-01",
          value: 0.7
        },
        {
          date: "2016-05-01",
          value: 0.7
        },
        {
          date: "2016-06-01",
          value: 0.9
        },
        {
          date: "2016-07-01",
          value: 0.9
        },
        {
          date: "2016-08-01",
          value: 0.9
        },
        {
          date: "2016-09-01",
          value: 1.3
        },
        {
          date: "2016-10-01",
          value: 1.3
        },
        {
          date: "2016-11-01",
          value: 1.5
        },
        {
          date: "2016-12-01",
          value: 1.79
        },
        {
          date: "2017-01-01",
          value: 1.9
        },
        {
          date: "2017-02-01",
          value: 2.3
        },
        {
          date: "2017-03-01",
          value: 2.29
        },
        {
          date: "2017-04-01",
          value: 2.58
        },
        {
          date: "2017-05-01",
          value: 2.68
        },
        {
          date: "2017-06-01",
          value: 2.48
        },
        {
          date: "2017-07-01",
          value: 2.58
        },
        {
          date: "2017-08-01",
          value: 2.77
        },
        {
          date: "2017-09-01",
          value: 2.76
        },
        {
          date: "2017-10-01",
          value: 2.76
        },
        {
          date: "2017-11-01",
          value: 2.85
        },
        {
          date: "2017-12-01",
          value: 2.74
        },
        {
          date: "2018-01-01",
          value: 2.65
        },
        {
          date: "2018-02-01",
          value: 2.44
        },
        {
          date: "2018-03-01",
          value: 2.34
        },
        {
          date: "2018-04-01",
          value: 2.23
        },
        {
          date: "2018-05-01",
          value: 2.32
        },
        {
          date: "2018-06-01",
          value: 2.32
        },
        {
          date: "2018-07-01",
          value: 2.32
        },
        {
          date: "2018-08-01",
          value: 2.4
        },
        {
          date: "2018-09-01",
          value: 2.21
        },
        {
          date: "2018-10-01",
          value: 2.2
        },
        {
          date: "2018-11-01",
          value: 2.1
        },
        {
          date: "2018-12-01",
          value: 2
        },
        {
          date: "2019-01-01",
          value: 1.82
        },
        {
          date: "2019-02-01",
          value: 1.81
        },
        {
          date: "2019-03-01",
          value: 1.81
        },
        {
          date: "2019-04-01",
          value: 1.99
        },
        {
          date: "2019-05-01",
          value: 1.89
        },
        {
          date: "2019-06-01",
          value: 1.89
        },
        {
          date: "2019-07-01",
          value: 1.98
        },
        {
          date: "2019-08-01",
          value: 1.69
        },
        {
          date: "2019-09-01",
          value: 1.69
        },
        {
          date: "2019-10-01",
          value: 1.5
        },
        {
          date: "2019-11-01",
          value: 1.5
        },
        {
          date: "2019-12-01",
          value: 1.31
        },
        {
          date: "2020-01-01",
          value: 1.79
        },
        {
          date: "2020-02-01",
          value: 1.69
        },
        {
          date: "2020-03-01",
          value: 1.5
        },
        {
          date: "2020-04-01",
          value: 0.93
        },
        {
          date: "2020-05-01",
          value: 0.65
        },
        {
          date: "2020-06-01",
          value: 0.83
        },
        {
          date: "2020-07-01",
          value: 1.11
        },
        {
          date: "2020-08-01",
          value: 0.46
        },
        {
          date: "2020-09-01",
          value: 0.74
        },
        {
          date: "2020-10-01",
          value: 0.83
        },
        {
          date: "2020-11-01",
          value: 0.55
        },
        {
          date: "2020-12-01",
          value: 0.83
        },
        {
          date: "2021-01-01",
          value: 0.92
        },
        {
          date: "2021-02-01",
          value: 0.74
        },
        {
          date: "2021-03-01",
          value: 1.01
        },
        {
          date: "2021-04-01",
          value: 1.66
        },
        {
          date: "2021-05-01",
          value: 2.21
        },
        {
          date: "2021-06-01",
          value: 2.39
        },
        {
          date: "2021-07-01",
          value: 2.01
        },
        {
          date: "2021-08-01",
          value: 3.03
        },
        {
          date: "2021-09-01",
          value: 2.93
        },
        {
          date: "2021-10-01",
          value: 3.85
        },
        {
          date: "2021-11-01",
          value: 4.58
        },
        {
          date: "2021-12-01",
          value: 4.84
        },
        {
          date: "2022-01-01",
          value: 4.85
        },
        {
          date: "2022-02-01",
          value: 5.48
        },
        {
          date: "2022-03-01",
          value: 6.2
        },
        {
          date: "2022-04-01",
          value: 7.79
        },
        {
          date: "2022-05-01",
          value: 7.84
        },
        {
          date: "2022-06-01",
          value: 8.17
        },
        {
          date: "2022-07-01",
          value: 8.8
        },
        {
          date: "2022-08-01",
          value: 8.65
        },
        {
          date: "2022-09-01",
          value: 8.81
        },
        {
          date: "2022-10-01",
          value: 9.61
        },
        {
          date: "2022-11-01",
          value: 9.38
        },
        {
          date: "2022-12-01",
          value: 9.24
        },
        {
          date: "2023-01-01",
          value: 8.9
        },
        {
          date: "2023-02-01",
          value: 9.19
        },
        {
          date: "2023-03-01",
          value: 8.84
        },
        {
          date: "2023-04-01",
          value: 7.82
        },
        {
          date: "2023-05-01",
          value: 7.85
        },
        {
          date: "2023-06-01",
          value: 7.39
        },
        {
          date: "2023-07-01",
          value: 6.44
        },
        {
          date: "2023-08-01",
          value: 6.24
        },
        {
          date: "2023-09-01",
          value: 6.38
        },
        {
          date: "2023-10-01",
          value: 4.75
        },
        {
          date: "2023-11-01",
          value: 4.17
        },
        {
          date: "2023-12-01",
          value: 4.15
        },
        {
          date: "2024-01-01",
          value: 4.17
        },
        {
          date: "2024-02-01",
          value: 3.81
        },
        {
          date: "2024-03-01",
          value: 3.79
        },
        {
          date: "2024-04-01",
          value: 3.04
        },
        {
          date: "2024-05-01",
          value: 2.79
        },
        {
          date: "2024-06-01",
          value: 2.78
        },
        {
          date: "2024-07-01",
          value: 3.02
        },
        {
          date: "2024-08-01",
          value: 3.09
        },
        {
          date: "2024-09-01",
          value: 2.61
        },
        {
          date: "2024-10-01",
          value: 3.15
        },
        {
          date: "2024-11-01",
          value: 3.54
        },
        {
          date: "2024-12-01",
          value: 3.52
        },
        {
          date: "2025-01-01",
          value: 3.92
        },
        {
          date: "2025-02-01",
          value: 3.67
        },
        {
          date: "2025-03-01",
          value: 3.42
        }
      ]
    },
    uk_unemp: {
      id: "uk_unemp",
      fred: "LRHUTTTTGBM156S",
      mode: "level",
      unit: "%",
      updated: "2026-08-29T10:40:48.130Z",
      last: {
        date: "2026-04-01",
        value: 4.9
      },
      points: [
        {
          date: "2016-05-01",
          value: 4.9
        },
        {
          date: "2016-06-01",
          value: 4.9
        },
        {
          date: "2016-07-01",
          value: 5
        },
        {
          date: "2016-08-01",
          value: 4.8
        },
        {
          date: "2016-09-01",
          value: 4.8
        },
        {
          date: "2016-10-01",
          value: 4.8
        },
        {
          date: "2016-11-01",
          value: 4.7
        },
        {
          date: "2016-12-01",
          value: 4.7
        },
        {
          date: "2017-01-01",
          value: 4.6
        },
        {
          date: "2017-02-01",
          value: 4.6
        },
        {
          date: "2017-03-01",
          value: 4.5
        },
        {
          date: "2017-04-01",
          value: 4.4
        },
        {
          date: "2017-05-01",
          value: 4.4
        },
        {
          date: "2017-06-01",
          value: 4.3
        },
        {
          date: "2017-07-01",
          value: 4.3
        },
        {
          date: "2017-08-01",
          value: 4.3
        },
        {
          date: "2017-09-01",
          value: 4.2
        },
        {
          date: "2017-10-01",
          value: 4.3
        },
        {
          date: "2017-11-01",
          value: 4.4
        },
        {
          date: "2017-12-01",
          value: 4.3
        },
        {
          date: "2018-01-01",
          value: 4.2
        },
        {
          date: "2018-02-01",
          value: 4.2
        },
        {
          date: "2018-03-01",
          value: 4.2
        },
        {
          date: "2018-04-01",
          value: 4.2
        },
        {
          date: "2018-05-01",
          value: 4
        },
        {
          date: "2018-06-01",
          value: 4
        },
        {
          date: "2018-07-01",
          value: 4
        },
        {
          date: "2018-08-01",
          value: 4.1
        },
        {
          date: "2018-09-01",
          value: 4.1
        },
        {
          date: "2018-10-01",
          value: 4
        },
        {
          date: "2018-11-01",
          value: 4
        },
        {
          date: "2018-12-01",
          value: 3.9
        },
        {
          date: "2019-01-01",
          value: 4
        },
        {
          date: "2019-02-01",
          value: 3.8
        },
        {
          date: "2019-03-01",
          value: 3.8
        },
        {
          date: "2019-04-01",
          value: 3.8
        },
        {
          date: "2019-05-01",
          value: 3.9
        },
        {
          date: "2019-06-01",
          value: 3.9
        },
        {
          date: "2019-07-01",
          value: 3.9
        },
        {
          date: "2019-08-01",
          value: 3.9
        },
        {
          date: "2019-09-01",
          value: 3.8
        },
        {
          date: "2019-10-01",
          value: 3.8
        },
        {
          date: "2019-11-01",
          value: 3.7
        },
        {
          date: "2019-12-01",
          value: 3.9
        },
        {
          date: "2020-01-01",
          value: 3.9
        },
        {
          date: "2020-02-01",
          value: 4.1
        },
        {
          date: "2020-03-01",
          value: 4.1
        },
        {
          date: "2020-04-01",
          value: 4.1
        },
        {
          date: "2020-05-01",
          value: 4.1
        },
        {
          date: "2020-06-01",
          value: 4.4
        },
        {
          date: "2020-07-01",
          value: 4.6
        },
        {
          date: "2020-08-01",
          value: 5
        },
        {
          date: "2020-09-01",
          value: 5.2
        },
        {
          date: "2020-10-01",
          value: 5.2
        },
        {
          date: "2020-11-01",
          value: 5.3
        },
        {
          date: "2020-12-01",
          value: 5.2
        },
        {
          date: "2021-01-01",
          value: 5
        },
        {
          date: "2021-02-01",
          value: 4.9
        },
        {
          date: "2021-03-01",
          value: 4.8
        },
        {
          date: "2021-04-01",
          value: 4.8
        },
        {
          date: "2021-05-01",
          value: 4.7
        },
        {
          date: "2021-06-01",
          value: 4.6
        },
        {
          date: "2021-07-01",
          value: 4.5
        },
        {
          date: "2021-08-01",
          value: 4.4
        },
        {
          date: "2021-09-01",
          value: 4.3
        },
        {
          date: "2021-10-01",
          value: 4.2
        },
        {
          date: "2021-11-01",
          value: 4.2
        },
        {
          date: "2021-12-01",
          value: 4.1
        },
        {
          date: "2022-01-01",
          value: 3.9
        },
        {
          date: "2022-02-01",
          value: 3.8
        },
        {
          date: "2022-03-01",
          value: 3.8
        },
        {
          date: "2022-04-01",
          value: 3.7
        },
        {
          date: "2022-05-01",
          value: 3.8
        },
        {
          date: "2022-06-01",
          value: 3.6
        },
        {
          date: "2022-07-01",
          value: 3.6
        },
        {
          date: "2022-08-01",
          value: 3.7
        },
        {
          date: "2022-09-01",
          value: 3.8
        },
        {
          date: "2022-10-01",
          value: 3.9
        },
        {
          date: "2022-11-01",
          value: 3.9
        },
        {
          date: "2022-12-01",
          value: 3.9
        },
        {
          date: "2023-01-01",
          value: 4
        },
        {
          date: "2023-02-01",
          value: 4
        },
        {
          date: "2023-03-01",
          value: 3.9
        },
        {
          date: "2023-04-01",
          value: 4
        },
        {
          date: "2023-05-01",
          value: 4.2
        },
        {
          date: "2023-06-01",
          value: 4.4
        },
        {
          date: "2023-07-01",
          value: 4.3
        },
        {
          date: "2023-08-01",
          value: 4.1
        },
        {
          date: "2023-09-01",
          value: 4
        },
        {
          date: "2023-10-01",
          value: 4
        },
        {
          date: "2023-11-01",
          value: 3.9
        },
        {
          date: "2023-12-01",
          value: 4.1
        },
        {
          date: "2024-01-01",
          value: 4.2
        },
        {
          date: "2024-02-01",
          value: 4.3
        },
        {
          date: "2024-03-01",
          value: 4.4
        },
        {
          date: "2024-04-01",
          value: 4.4
        },
        {
          date: "2024-05-01",
          value: 4.2
        },
        {
          date: "2024-06-01",
          value: 4.2
        },
        {
          date: "2024-07-01",
          value: 4.1
        },
        {
          date: "2024-08-01",
          value: 4.3
        },
        {
          date: "2024-09-01",
          value: 4.2
        },
        {
          date: "2024-10-01",
          value: 4.4
        },
        {
          date: "2024-11-01",
          value: 4.4
        },
        {
          date: "2024-12-01",
          value: 4.4
        },
        {
          date: "2025-01-01",
          value: 4.5
        },
        {
          date: "2025-02-01",
          value: 4.6
        },
        {
          date: "2025-03-01",
          value: 4.6
        },
        {
          date: "2025-04-01",
          value: 4.7
        },
        {
          date: "2025-05-01",
          value: 4.7
        },
        {
          date: "2025-06-01",
          value: 4.7
        },
        {
          date: "2025-07-01",
          value: 4.8
        },
        {
          date: "2025-08-01",
          value: 5
        },
        {
          date: "2025-09-01",
          value: 5.1
        },
        {
          date: "2025-10-01",
          value: 5.1
        },
        {
          date: "2025-11-01",
          value: 5.2
        },
        {
          date: "2025-12-01",
          value: 5.2
        },
        {
          date: "2026-01-01",
          value: 4.9
        },
        {
          date: "2026-02-01",
          value: 5
        },
        {
          date: "2026-03-01",
          value: 4.9
        },
        {
          date: "2026-04-01",
          value: 4.9
        }
      ]
    },
    jp_cpi: {
      id: "jp_cpi",
      fred: "JPNCPIALLMINMEI",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-29T10:40:48.437Z",
      last: {
        date: "2021-06-01",
        value: -0.4
      },
      points: [
        {
          date: "2011-07-01",
          value: 0.21
        },
        {
          date: "2011-08-01",
          value: 0.21
        },
        {
          date: "2011-09-01",
          value: 0
        },
        {
          date: "2011-10-01",
          value: -0.21
        },
        {
          date: "2011-11-01",
          value: -0.53
        },
        {
          date: "2011-12-01",
          value: -0.21
        },
        {
          date: "2012-01-01",
          value: 0.11
        },
        {
          date: "2012-02-01",
          value: 0.32
        },
        {
          date: "2012-03-01",
          value: 0.53
        },
        {
          date: "2012-04-01",
          value: 0.53
        },
        {
          date: "2012-05-01",
          value: 0.21
        },
        {
          date: "2012-06-01",
          value: -0.21
        },
        {
          date: "2012-07-01",
          value: -0.53
        },
        {
          date: "2012-08-01",
          value: -0.42
        },
        {
          date: "2012-09-01",
          value: -0.32
        },
        {
          date: "2012-10-01",
          value: -0.42
        },
        {
          date: "2012-11-01",
          value: -0.11
        },
        {
          date: "2012-12-01",
          value: -0.21
        },
        {
          date: "2013-01-01",
          value: -0.32
        },
        {
          date: "2013-02-01",
          value: -0.74
        },
        {
          date: "2013-03-01",
          value: -0.95
        },
        {
          date: "2013-04-01",
          value: -0.74
        },
        {
          date: "2013-05-01",
          value: -0.32
        },
        {
          date: "2013-06-01",
          value: 0.21
        },
        {
          date: "2013-07-01",
          value: 0.74
        },
        {
          date: "2013-08-01",
          value: 0.85
        },
        {
          date: "2013-09-01",
          value: 1.06
        },
        {
          date: "2013-10-01",
          value: 1.17
        },
        {
          date: "2013-11-01",
          value: 1.49
        },
        {
          date: "2013-12-01",
          value: 1.59
        },
        {
          date: "2014-01-01",
          value: 1.38
        },
        {
          date: "2014-02-01",
          value: 1.6
        },
        {
          date: "2014-03-01",
          value: 1.59
        },
        {
          date: "2014-04-01",
          value: 3.39
        },
        {
          date: "2014-05-01",
          value: 3.7
        },
        {
          date: "2014-06-01",
          value: 3.59
        },
        {
          date: "2014-07-01",
          value: 3.48
        },
        {
          date: "2014-08-01",
          value: 3.36
        },
        {
          date: "2014-09-01",
          value: 3.25
        },
        {
          date: "2014-10-01",
          value: 2.83
        },
        {
          date: "2014-11-01",
          value: 2.51
        },
        {
          date: "2014-12-01",
          value: 2.41
        },
        {
          date: "2015-01-01",
          value: 2.41
        },
        {
          date: "2015-02-01",
          value: 2.2
        },
        {
          date: "2015-03-01",
          value: 2.3
        },
        {
          date: "2015-04-01",
          value: 0.72
        },
        {
          date: "2015-05-01",
          value: 0.61
        },
        {
          date: "2015-06-01",
          value: 0.41
        },
        {
          date: "2015-07-01",
          value: 0.2
        },
        {
          date: "2015-08-01",
          value: 0.1
        },
        {
          date: "2015-09-01",
          value: 0
        },
        {
          date: "2015-10-01",
          value: 0.31
        },
        {
          date: "2015-11-01",
          value: 0.2
        },
        {
          date: "2015-12-01",
          value: 0.2
        },
        {
          date: "2016-01-01",
          value: -0.1
        },
        {
          date: "2016-02-01",
          value: 0.2
        },
        {
          date: "2016-03-01",
          value: 0
        },
        {
          date: "2016-04-01",
          value: -0.3
        },
        {
          date: "2016-05-01",
          value: -0.51
        },
        {
          date: "2016-06-01",
          value: -0.3
        },
        {
          date: "2016-07-01",
          value: -0.41
        },
        {
          date: "2016-08-01",
          value: -0.51
        },
        {
          date: "2016-09-01",
          value: -0.51
        },
        {
          date: "2016-10-01",
          value: 0.1
        },
        {
          date: "2016-11-01",
          value: 0.51
        },
        {
          date: "2016-12-01",
          value: 0.31
        },
        {
          date: "2017-01-01",
          value: 0.51
        },
        {
          date: "2017-02-01",
          value: 0.31
        },
        {
          date: "2017-03-01",
          value: 0.2
        },
        {
          date: "2017-04-01",
          value: 0.41
        },
        {
          date: "2017-05-01",
          value: 0.41
        },
        {
          date: "2017-06-01",
          value: 0.41
        },
        {
          date: "2017-07-01",
          value: 0.41
        },
        {
          date: "2017-08-01",
          value: 0.61
        },
        {
          date: "2017-09-01",
          value: 0.82
        },
        {
          date: "2017-10-01",
          value: 0.2
        },
        {
          date: "2017-11-01",
          value: 0.51
        },
        {
          date: "2017-12-01",
          value: 1.02
        },
        {
          date: "2018-01-01",
          value: 1.32
        },
        {
          date: "2018-02-01",
          value: 1.43
        },
        {
          date: "2018-03-01",
          value: 1.12
        },
        {
          date: "2018-04-01",
          value: 0.61
        },
        {
          date: "2018-05-01",
          value: 0.71
        },
        {
          date: "2018-06-01",
          value: 0.71
        },
        {
          date: "2018-07-01",
          value: 0.92
        },
        {
          date: "2018-08-01",
          value: 1.32
        },
        {
          date: "2018-09-01",
          value: 1.11
        },
        {
          date: "2018-10-01",
          value: 1.42
        },
        {
          date: "2018-11-01",
          value: 0.91
        },
        {
          date: "2018-12-01",
          value: 0.3
        },
        {
          date: "2019-01-01",
          value: 0.2
        },
        {
          date: "2019-02-01",
          value: 0.2
        },
        {
          date: "2019-03-01",
          value: 0.5
        },
        {
          date: "2019-04-01",
          value: 0.91
        },
        {
          date: "2019-05-01",
          value: 0.7
        },
        {
          date: "2019-06-01",
          value: 0.6
        },
        {
          date: "2019-07-01",
          value: 0.6
        },
        {
          date: "2019-08-01",
          value: 0.2
        },
        {
          date: "2019-09-01",
          value: 0.2
        },
        {
          date: "2019-10-01",
          value: 0.2
        },
        {
          date: "2019-11-01",
          value: 0.5
        },
        {
          date: "2019-12-01",
          value: 0.8
        },
        {
          date: "2020-01-01",
          value: 0.8
        },
        {
          date: "2020-02-01",
          value: 0.6
        },
        {
          date: "2020-03-01",
          value: 0.6
        },
        {
          date: "2020-04-01",
          value: 0.2
        },
        {
          date: "2020-05-01",
          value: 0.1
        },
        {
          date: "2020-06-01",
          value: 0.1
        },
        {
          date: "2020-07-01",
          value: 0.2
        },
        {
          date: "2020-08-01",
          value: 0.1
        },
        {
          date: "2020-09-01",
          value: -0.2
        },
        {
          date: "2020-10-01",
          value: -0.6
        },
        {
          date: "2020-11-01",
          value: -1
        },
        {
          date: "2020-12-01",
          value: -1.19
        },
        {
          date: "2021-01-01",
          value: -0.7
        },
        {
          date: "2021-02-01",
          value: -0.5
        },
        {
          date: "2021-03-01",
          value: -0.4
        },
        {
          date: "2021-04-01",
          value: -1.1
        },
        {
          date: "2021-05-01",
          value: -0.7
        },
        {
          date: "2021-06-01",
          value: -0.4
        }
      ]
    },
    wti: {
      id: "wti",
      fred: "DCOILWTICO",
      mode: "level",
      unit: "USD/barel",
      updated: "2026-08-29T10:40:49.542Z",
      last: {
        date: "2026-08-01",
        value: 83.65
      },
      points: [
        {
          date: "2016-09-01",
          value: 45.18
        },
        {
          date: "2016-10-01",
          value: 49.78
        },
        {
          date: "2016-11-01",
          value: 45.66
        },
        {
          date: "2016-12-01",
          value: 51.97
        },
        {
          date: "2017-01-01",
          value: 52.5
        },
        {
          date: "2017-02-01",
          value: 53.47
        },
        {
          date: "2017-03-01",
          value: 49.33
        },
        {
          date: "2017-04-01",
          value: 51.06
        },
        {
          date: "2017-05-01",
          value: 48.48
        },
        {
          date: "2017-06-01",
          value: 45.18
        },
        {
          date: "2017-07-01",
          value: 46.63
        },
        {
          date: "2017-08-01",
          value: 48.04
        },
        {
          date: "2017-09-01",
          value: 49.82
        },
        {
          date: "2017-10-01",
          value: 51.58
        },
        {
          date: "2017-11-01",
          value: 56.64
        },
        {
          date: "2017-12-01",
          value: 57.88
        },
        {
          date: "2018-01-01",
          value: 63.7
        },
        {
          date: "2018-02-01",
          value: 62.23
        },
        {
          date: "2018-03-01",
          value: 62.72
        },
        {
          date: "2018-04-01",
          value: 66.25
        },
        {
          date: "2018-05-01",
          value: 69.98
        },
        {
          date: "2018-06-01",
          value: 67.87
        },
        {
          date: "2018-07-01",
          value: 70.98
        },
        {
          date: "2018-08-01",
          value: 68.06
        },
        {
          date: "2018-09-01",
          value: 70.23
        },
        {
          date: "2018-10-01",
          value: 70.75
        },
        {
          date: "2018-11-01",
          value: 56.96
        },
        {
          date: "2018-12-01",
          value: 49.52
        },
        {
          date: "2019-01-01",
          value: 51.38
        },
        {
          date: "2019-02-01",
          value: 54.95
        },
        {
          date: "2019-03-01",
          value: 58.15
        },
        {
          date: "2019-04-01",
          value: 63.86
        },
        {
          date: "2019-05-01",
          value: 60.83
        },
        {
          date: "2019-06-01",
          value: 54.66
        },
        {
          date: "2019-07-01",
          value: 57.36
        },
        {
          date: "2019-08-01",
          value: 54.81
        },
        {
          date: "2019-09-01",
          value: 56.95
        },
        {
          date: "2019-10-01",
          value: 53.96
        },
        {
          date: "2019-11-01",
          value: 57.05
        },
        {
          date: "2019-12-01",
          value: 59.82
        },
        {
          date: "2020-01-01",
          value: 57.52
        },
        {
          date: "2020-02-01",
          value: 50.54
        },
        {
          date: "2020-03-01",
          value: 29.21
        },
        {
          date: "2020-04-01",
          value: 16.55
        },
        {
          date: "2020-05-01",
          value: 28.56
        },
        {
          date: "2020-06-01",
          value: 38.31
        },
        {
          date: "2020-07-01",
          value: 40.71
        },
        {
          date: "2020-08-01",
          value: 42.34
        },
        {
          date: "2020-09-01",
          value: 39.63
        },
        {
          date: "2020-10-01",
          value: 39.4
        },
        {
          date: "2020-11-01",
          value: 40.94
        },
        {
          date: "2020-12-01",
          value: 47.02
        },
        {
          date: "2021-01-01",
          value: 52.01
        },
        {
          date: "2021-02-01",
          value: 59.05
        },
        {
          date: "2021-03-01",
          value: 62.33
        },
        {
          date: "2021-04-01",
          value: 61.72
        },
        {
          date: "2021-05-01",
          value: 65.17
        },
        {
          date: "2021-06-01",
          value: 71.38
        },
        {
          date: "2021-07-01",
          value: 72.49
        },
        {
          date: "2021-08-01",
          value: 67.73
        },
        {
          date: "2021-09-01",
          value: 71.65
        },
        {
          date: "2021-10-01",
          value: 81.48
        },
        {
          date: "2021-11-01",
          value: 79.15
        },
        {
          date: "2021-12-01",
          value: 71.71
        },
        {
          date: "2022-01-01",
          value: 83.22
        },
        {
          date: "2022-02-01",
          value: 91.64
        },
        {
          date: "2022-03-01",
          value: 108.5
        },
        {
          date: "2022-04-01",
          value: 101.78
        },
        {
          date: "2022-05-01",
          value: 109.55
        },
        {
          date: "2022-06-01",
          value: 114.84
        },
        {
          date: "2022-07-01",
          value: 101.62
        },
        {
          date: "2022-08-01",
          value: 93.67
        },
        {
          date: "2022-09-01",
          value: 84.26
        },
        {
          date: "2022-10-01",
          value: 87.55
        },
        {
          date: "2022-11-01",
          value: 84.37
        },
        {
          date: "2022-12-01",
          value: 76.44
        },
        {
          date: "2023-01-01",
          value: 78.12
        },
        {
          date: "2023-02-01",
          value: 76.83
        },
        {
          date: "2023-03-01",
          value: 73.28
        },
        {
          date: "2023-04-01",
          value: 79.45
        },
        {
          date: "2023-05-01",
          value: 71.58
        },
        {
          date: "2023-06-01",
          value: 70.25
        },
        {
          date: "2023-07-01",
          value: 76.07
        },
        {
          date: "2023-08-01",
          value: 81.39
        },
        {
          date: "2023-09-01",
          value: 89.43
        },
        {
          date: "2023-10-01",
          value: 85.64
        },
        {
          date: "2023-11-01",
          value: 77.68
        },
        {
          date: "2023-12-01",
          value: 71.9
        },
        {
          date: "2024-01-01",
          value: 74.15
        },
        {
          date: "2024-02-01",
          value: 77.25
        },
        {
          date: "2024-03-01",
          value: 81.28
        },
        {
          date: "2024-04-01",
          value: 85.35
        },
        {
          date: "2024-05-01",
          value: 80.02
        },
        {
          date: "2024-06-01",
          value: 79.77
        },
        {
          date: "2024-07-01",
          value: 81.8
        },
        {
          date: "2024-08-01",
          value: 76.68
        },
        {
          date: "2024-09-01",
          value: 70.24
        },
        {
          date: "2024-10-01",
          value: 71.99
        },
        {
          date: "2024-11-01",
          value: 69.95
        },
        {
          date: "2024-12-01",
          value: 70.12
        },
        {
          date: "2025-01-01",
          value: 75.74
        },
        {
          date: "2025-02-01",
          value: 71.53
        },
        {
          date: "2025-03-01",
          value: 68.24
        },
        {
          date: "2025-04-01",
          value: 63.54
        },
        {
          date: "2025-05-01",
          value: 62.17
        },
        {
          date: "2025-06-01",
          value: 68.17
        },
        {
          date: "2025-07-01",
          value: 68.39
        },
        {
          date: "2025-08-01",
          value: 64.86
        },
        {
          date: "2025-09-01",
          value: 63.96
        },
        {
          date: "2025-10-01",
          value: 60.89
        },
        {
          date: "2025-11-01",
          value: 60.06
        },
        {
          date: "2025-12-01",
          value: 57.97
        },
        {
          date: "2026-01-01",
          value: 60.04
        },
        {
          date: "2026-02-01",
          value: 64.51
        },
        {
          date: "2026-03-01",
          value: 91.38
        },
        {
          date: "2026-04-01",
          value: 100.32
        },
        {
          date: "2026-05-01",
          value: 102.13
        },
        {
          date: "2026-06-01",
          value: 84.81
        },
        {
          date: "2026-07-01",
          value: 80.46
        },
        {
          date: "2026-08-01",
          value: 83.65
        }
      ]
    },
    vix: {
      id: "vix",
      fred: "VIXCLS",
      mode: "level",
      unit: "index",
      updated: "2026-08-29T10:40:50.593Z",
      last: {
        date: "2026-08-01",
        value: 15.29
      },
      points: [
        {
          date: "2016-09-01",
          value: 14.22
        },
        {
          date: "2016-10-01",
          value: 14.59
        },
        {
          date: "2016-11-01",
          value: 15.24
        },
        {
          date: "2016-12-01",
          value: 12.47
        },
        {
          date: "2017-01-01",
          value: 11.61
        },
        {
          date: "2017-02-01",
          value: 11.53
        },
        {
          date: "2017-03-01",
          value: 11.9
        },
        {
          date: "2017-04-01",
          value: 13.14
        },
        {
          date: "2017-05-01",
          value: 10.86
        },
        {
          date: "2017-06-01",
          value: 10.51
        },
        {
          date: "2017-07-01",
          value: 10.26
        },
        {
          date: "2017-08-01",
          value: 11.98
        },
        {
          date: "2017-09-01",
          value: 10.44
        },
        {
          date: "2017-10-01",
          value: 10.13
        },
        {
          date: "2017-11-01",
          value: 10.54
        },
        {
          date: "2017-12-01",
          value: 10.26
        },
        {
          date: "2018-01-01",
          value: 11.06
        },
        {
          date: "2018-02-01",
          value: 22.46
        },
        {
          date: "2018-03-01",
          value: 19.02
        },
        {
          date: "2018-04-01",
          value: 18.27
        },
        {
          date: "2018-05-01",
          value: 14.12
        },
        {
          date: "2018-06-01",
          value: 13.68
        },
        {
          date: "2018-07-01",
          value: 13.15
        },
        {
          date: "2018-08-01",
          value: 12.55
        },
        {
          date: "2018-09-01",
          value: 12.91
        },
        {
          date: "2018-10-01",
          value: 19.35
        },
        {
          date: "2018-11-01",
          value: 19.39
        },
        {
          date: "2018-12-01",
          value: 24.95
        },
        {
          date: "2019-01-01",
          value: 19.57
        },
        {
          date: "2019-02-01",
          value: 15.23
        },
        {
          date: "2019-03-01",
          value: 14.49
        },
        {
          date: "2019-04-01",
          value: 12.95
        },
        {
          date: "2019-05-01",
          value: 16.72
        },
        {
          date: "2019-06-01",
          value: 15.84
        },
        {
          date: "2019-07-01",
          value: 13.31
        },
        {
          date: "2019-08-01",
          value: 18.98
        },
        {
          date: "2019-09-01",
          value: 15.56
        },
        {
          date: "2019-10-01",
          value: 15.47
        },
        {
          date: "2019-11-01",
          value: 12.52
        },
        {
          date: "2019-12-01",
          value: 13.76
        },
        {
          date: "2020-01-01",
          value: 13.94
        },
        {
          date: "2020-02-01",
          value: 19.63
        },
        {
          date: "2020-03-01",
          value: 57.74
        },
        {
          date: "2020-04-01",
          value: 41.45
        },
        {
          date: "2020-05-01",
          value: 30.9
        },
        {
          date: "2020-06-01",
          value: 31.12
        },
        {
          date: "2020-07-01",
          value: 26.84
        },
        {
          date: "2020-08-01",
          value: 22.89
        },
        {
          date: "2020-09-01",
          value: 27.65
        },
        {
          date: "2020-10-01",
          value: 29.44
        },
        {
          date: "2020-11-01",
          value: 25
        },
        {
          date: "2020-12-01",
          value: 22.37
        },
        {
          date: "2021-01-01",
          value: 24.91
        },
        {
          date: "2021-02-01",
          value: 23.14
        },
        {
          date: "2021-03-01",
          value: 21.84
        },
        {
          date: "2021-04-01",
          value: 17.42
        },
        {
          date: "2021-05-01",
          value: 19.76
        },
        {
          date: "2021-06-01",
          value: 16.96
        },
        {
          date: "2021-07-01",
          value: 17.6
        },
        {
          date: "2021-08-01",
          value: 17.47
        },
        {
          date: "2021-09-01",
          value: 19.82
        },
        {
          date: "2021-10-01",
          value: 17.87
        },
        {
          date: "2021-11-01",
          value: 18.5
        },
        {
          date: "2021-12-01",
          value: 21.35
        },
        {
          date: "2022-01-01",
          value: 23.18
        },
        {
          date: "2022-02-01",
          value: 25.75
        },
        {
          date: "2022-03-01",
          value: 26.97
        },
        {
          date: "2022-04-01",
          value: 24.37
        },
        {
          date: "2022-05-01",
          value: 29.31
        },
        {
          date: "2022-06-01",
          value: 28.23
        },
        {
          date: "2022-07-01",
          value: 25
        },
        {
          date: "2022-08-01",
          value: 22.17
        },
        {
          date: "2022-09-01",
          value: 27.34
        },
        {
          date: "2022-10-01",
          value: 30.01
        },
        {
          date: "2022-11-01",
          value: 23.3
        },
        {
          date: "2022-12-01",
          value: 21.78
        },
        {
          date: "2023-01-01",
          value: 20.17
        },
        {
          date: "2023-02-01",
          value: 20.12
        },
        {
          date: "2023-03-01",
          value: 21.64
        },
        {
          date: "2023-04-01",
          value: 17.82
        },
        {
          date: "2023-05-01",
          value: 17.64
        },
        {
          date: "2023-06-01",
          value: 14
        },
        {
          date: "2023-07-01",
          value: 13.93
        },
        {
          date: "2023-08-01",
          value: 15.85
        },
        {
          date: "2023-09-01",
          value: 15.17
        },
        {
          date: "2023-10-01",
          value: 18.89
        },
        {
          date: "2023-11-01",
          value: 14.02
        },
        {
          date: "2023-12-01",
          value: 12.72
        },
        {
          date: "2024-01-01",
          value: 13.39
        },
        {
          date: "2024-02-01",
          value: 13.98
        },
        {
          date: "2024-03-01",
          value: 13.79
        },
        {
          date: "2024-04-01",
          value: 16.14
        },
        {
          date: "2024-05-01",
          value: 13.06
        },
        {
          date: "2024-06-01",
          value: 12.67
        },
        {
          date: "2024-07-01",
          value: 14.37
        },
        {
          date: "2024-08-01",
          value: 19.31
        },
        {
          date: "2024-09-01",
          value: 17.66
        },
        {
          date: "2024-10-01",
          value: 19.96
        },
        {
          date: "2024-11-01",
          value: 16.02
        },
        {
          date: "2024-12-01",
          value: 15.87
        },
        {
          date: "2025-01-01",
          value: 16.76
        },
        {
          date: "2025-02-01",
          value: 16.97
        },
        {
          date: "2025-03-01",
          value: 21.84
        },
        {
          date: "2025-04-01",
          value: 31.97
        },
        {
          date: "2025-05-01",
          value: 20.46
        },
        {
          date: "2025-06-01",
          value: 18.4
        },
        {
          date: "2025-07-01",
          value: 16.38
        },
        {
          date: "2025-08-01",
          value: 15.75
        },
        {
          date: "2025-09-01",
          value: 15.79
        },
        {
          date: "2025-10-01",
          value: 18.09
        },
        {
          date: "2025-11-01",
          value: 19.77
        },
        {
          date: "2025-12-01",
          value: 15.55
        },
        {
          date: "2026-01-01",
          value: 16.18
        },
        {
          date: "2026-02-01",
          value: 19.21
        },
        {
          date: "2026-03-01",
          value: 25.6
        },
        {
          date: "2026-04-01",
          value: 19.81
        },
        {
          date: "2026-05-01",
          value: 17.24
        },
        {
          date: "2026-06-01",
          value: 17.91
        },
        {
          date: "2026-07-01",
          value: 17.09
        },
        {
          date: "2026-08-01",
          value: 15.29
        }
      ]
    },
    brent: {
      id: "brent",
      fred: "DCOILBRENTEU",
      mode: "level",
      unit: "USD/barel",
      updated: "2026-08-29T10:40:52.114Z",
      last: {
        date: "2026-08-01",
        value: 91.4
      },
      points: [
        {
          date: "2016-09-01",
          value: 46.57
        },
        {
          date: "2016-10-01",
          value: 49.52
        },
        {
          date: "2016-11-01",
          value: 44.73
        },
        {
          date: "2016-12-01",
          value: 53.31
        },
        {
          date: "2017-01-01",
          value: 54.58
        },
        {
          date: "2017-02-01",
          value: 54.87
        },
        {
          date: "2017-03-01",
          value: 51.59
        },
        {
          date: "2017-04-01",
          value: 52.31
        },
        {
          date: "2017-05-01",
          value: 50.33
        },
        {
          date: "2017-06-01",
          value: 46.37
        },
        {
          date: "2017-07-01",
          value: 48.48
        },
        {
          date: "2017-08-01",
          value: 51.7
        },
        {
          date: "2017-09-01",
          value: 56.15
        },
        {
          date: "2017-10-01",
          value: 57.51
        },
        {
          date: "2017-11-01",
          value: 62.71
        },
        {
          date: "2017-12-01",
          value: 64.37
        },
        {
          date: "2018-01-01",
          value: 69.08
        },
        {
          date: "2018-02-01",
          value: 65.32
        },
        {
          date: "2018-03-01",
          value: 66.02
        },
        {
          date: "2018-04-01",
          value: 72.11
        },
        {
          date: "2018-05-01",
          value: 76.98
        },
        {
          date: "2018-06-01",
          value: 74.4
        },
        {
          date: "2018-07-01",
          value: 74.25
        },
        {
          date: "2018-08-01",
          value: 72.53
        },
        {
          date: "2018-09-01",
          value: 78.89
        },
        {
          date: "2018-10-01",
          value: 81.03
        },
        {
          date: "2018-11-01",
          value: 64.75
        },
        {
          date: "2018-12-01",
          value: 57.36
        },
        {
          date: "2019-01-01",
          value: 59.41
        },
        {
          date: "2019-02-01",
          value: 63.96
        },
        {
          date: "2019-03-01",
          value: 66.14
        },
        {
          date: "2019-04-01",
          value: 71.23
        },
        {
          date: "2019-05-01",
          value: 71.32
        },
        {
          date: "2019-06-01",
          value: 64.22
        },
        {
          date: "2019-07-01",
          value: 63.92
        },
        {
          date: "2019-08-01",
          value: 59.04
        },
        {
          date: "2019-09-01",
          value: 62.83
        },
        {
          date: "2019-10-01",
          value: 59.71
        },
        {
          date: "2019-11-01",
          value: 63.21
        },
        {
          date: "2019-12-01",
          value: 67.22
        },
        {
          date: "2020-01-01",
          value: 63.65
        },
        {
          date: "2020-02-01",
          value: 55.66
        },
        {
          date: "2020-03-01",
          value: 32.01
        },
        {
          date: "2020-04-01",
          value: 18.38
        },
        {
          date: "2020-05-01",
          value: 29.38
        },
        {
          date: "2020-06-01",
          value: 40.27
        },
        {
          date: "2020-07-01",
          value: 43.24
        },
        {
          date: "2020-08-01",
          value: 44.74
        },
        {
          date: "2020-09-01",
          value: 40.91
        },
        {
          date: "2020-10-01",
          value: 40.19
        },
        {
          date: "2020-11-01",
          value: 42.69
        },
        {
          date: "2020-12-01",
          value: 49.99
        },
        {
          date: "2021-01-01",
          value: 54.77
        },
        {
          date: "2021-02-01",
          value: 62.28
        },
        {
          date: "2021-03-01",
          value: 65.41
        },
        {
          date: "2021-04-01",
          value: 64.81
        },
        {
          date: "2021-05-01",
          value: 68.53
        },
        {
          date: "2021-06-01",
          value: 73.16
        },
        {
          date: "2021-07-01",
          value: 75.17
        },
        {
          date: "2021-08-01",
          value: 70.75
        },
        {
          date: "2021-09-01",
          value: 74.49
        },
        {
          date: "2021-10-01",
          value: 83.54
        },
        {
          date: "2021-11-01",
          value: 81.05
        },
        {
          date: "2021-12-01",
          value: 74.17
        },
        {
          date: "2022-01-01",
          value: 86.51
        },
        {
          date: "2022-02-01",
          value: 97.13
        },
        {
          date: "2022-03-01",
          value: 117.25
        },
        {
          date: "2022-04-01",
          value: 104.58
        },
        {
          date: "2022-05-01",
          value: 113.34
        },
        {
          date: "2022-06-01",
          value: 122.71
        },
        {
          date: "2022-07-01",
          value: 111.93
        },
        {
          date: "2022-08-01",
          value: 100.45
        },
        {
          date: "2022-09-01",
          value: 89.76
        },
        {
          date: "2022-10-01",
          value: 93.33
        },
        {
          date: "2022-11-01",
          value: 91.42
        },
        {
          date: "2022-12-01",
          value: 80.92
        },
        {
          date: "2023-01-01",
          value: 82.5
        },
        {
          date: "2023-02-01",
          value: 82.59
        },
        {
          date: "2023-03-01",
          value: 78.43
        },
        {
          date: "2023-04-01",
          value: 84.64
        },
        {
          date: "2023-05-01",
          value: 75.47
        },
        {
          date: "2023-06-01",
          value: 74.84
        },
        {
          date: "2023-07-01",
          value: 80.11
        },
        {
          date: "2023-08-01",
          value: 86.15
        },
        {
          date: "2023-09-01",
          value: 93.72
        },
        {
          date: "2023-10-01",
          value: 90.6
        },
        {
          date: "2023-11-01",
          value: 82.94
        },
        {
          date: "2023-12-01",
          value: 77.63
        },
        {
          date: "2024-01-01",
          value: 80.12
        },
        {
          date: "2024-02-01",
          value: 83.48
        },
        {
          date: "2024-03-01",
          value: 85.41
        },
        {
          date: "2024-04-01",
          value: 89.94
        },
        {
          date: "2024-05-01",
          value: 81.75
        },
        {
          date: "2024-06-01",
          value: 82.25
        },
        {
          date: "2024-07-01",
          value: 85.15
        },
        {
          date: "2024-08-01",
          value: 80.36
        },
        {
          date: "2024-09-01",
          value: 74.02
        },
        {
          date: "2024-10-01",
          value: 75.63
        },
        {
          date: "2024-11-01",
          value: 74.35
        },
        {
          date: "2024-12-01",
          value: 73.86
        },
        {
          date: "2025-01-01",
          value: 79.27
        },
        {
          date: "2025-02-01",
          value: 75.44
        },
        {
          date: "2025-03-01",
          value: 72.73
        },
        {
          date: "2025-04-01",
          value: 68.13
        },
        {
          date: "2025-05-01",
          value: 64.45
        },
        {
          date: "2025-06-01",
          value: 71.44
        },
        {
          date: "2025-07-01",
          value: 71.04
        },
        {
          date: "2025-08-01",
          value: 67.87
        },
        {
          date: "2025-09-01",
          value: 67.99
        },
        {
          date: "2025-10-01",
          value: 64.54
        },
        {
          date: "2025-11-01",
          value: 63.8
        },
        {
          date: "2025-12-01",
          value: 62.54
        },
        {
          date: "2026-01-01",
          value: 66.6
        },
        {
          date: "2026-02-01",
          value: 70.89
        },
        {
          date: "2026-03-01",
          value: 103.13
        },
        {
          date: "2026-04-01",
          value: 117.29
        },
        {
          date: "2026-05-01",
          value: 107.14
        },
        {
          date: "2026-06-01",
          value: 85.4
        },
        {
          date: "2026-07-01",
          value: 83.76
        },
        {
          date: "2026-08-01",
          value: 91.4
        }
      ]
    },
    natgas: {
      id: "natgas",
      fred: "DHHNGSP",
      mode: "level",
      unit: "USD/MMBtu",
      updated: "2026-08-29T10:40:53.196Z",
      last: {
        date: "2026-08-01",
        value: 2.77
      },
      points: [
        {
          date: "2016-09-01",
          value: 2.99
        },
        {
          date: "2016-10-01",
          value: 2.98
        },
        {
          date: "2016-11-01",
          value: 2.55
        },
        {
          date: "2016-12-01",
          value: 3.59
        },
        {
          date: "2017-01-01",
          value: 3.3
        },
        {
          date: "2017-02-01",
          value: 2.85
        },
        {
          date: "2017-03-01",
          value: 2.88
        },
        {
          date: "2017-04-01",
          value: 3.1
        },
        {
          date: "2017-05-01",
          value: 3.15
        },
        {
          date: "2017-06-01",
          value: 2.98
        },
        {
          date: "2017-07-01",
          value: 2.98
        },
        {
          date: "2017-08-01",
          value: 2.9
        },
        {
          date: "2017-09-01",
          value: 2.98
        },
        {
          date: "2017-10-01",
          value: 2.88
        },
        {
          date: "2017-11-01",
          value: 3.01
        },
        {
          date: "2017-12-01",
          value: 2.82
        },
        {
          date: "2018-01-01",
          value: 3.88
        },
        {
          date: "2018-02-01",
          value: 2.67
        },
        {
          date: "2018-03-01",
          value: 2.69
        },
        {
          date: "2018-04-01",
          value: 2.8
        },
        {
          date: "2018-05-01",
          value: 2.8
        },
        {
          date: "2018-06-01",
          value: 2.97
        },
        {
          date: "2018-07-01",
          value: 2.83
        },
        {
          date: "2018-08-01",
          value: 2.96
        },
        {
          date: "2018-09-01",
          value: 3
        },
        {
          date: "2018-10-01",
          value: 3.28
        },
        {
          date: "2018-11-01",
          value: 4.09
        },
        {
          date: "2018-12-01",
          value: 4.04
        },
        {
          date: "2019-01-01",
          value: 3.11
        },
        {
          date: "2019-02-01",
          value: 2.69
        },
        {
          date: "2019-03-01",
          value: 2.95
        },
        {
          date: "2019-04-01",
          value: 2.65
        },
        {
          date: "2019-05-01",
          value: 2.64
        },
        {
          date: "2019-06-01",
          value: 2.4
        },
        {
          date: "2019-07-01",
          value: 2.37
        },
        {
          date: "2019-08-01",
          value: 2.22
        },
        {
          date: "2019-09-01",
          value: 2.56
        },
        {
          date: "2019-10-01",
          value: 2.33
        },
        {
          date: "2019-11-01",
          value: 2.64
        },
        {
          date: "2019-12-01",
          value: 2.22
        },
        {
          date: "2020-01-01",
          value: 2.02
        },
        {
          date: "2020-02-01",
          value: 1.91
        },
        {
          date: "2020-03-01",
          value: 1.79
        },
        {
          date: "2020-04-01",
          value: 1.74
        },
        {
          date: "2020-05-01",
          value: 1.75
        },
        {
          date: "2020-06-01",
          value: 1.63
        },
        {
          date: "2020-07-01",
          value: 1.76
        },
        {
          date: "2020-08-01",
          value: 2.3
        },
        {
          date: "2020-09-01",
          value: 1.92
        },
        {
          date: "2020-10-01",
          value: 2.39
        },
        {
          date: "2020-11-01",
          value: 2.61
        },
        {
          date: "2020-12-01",
          value: 2.58
        },
        {
          date: "2021-01-01",
          value: 2.71
        },
        {
          date: "2021-02-01",
          value: 5.35
        },
        {
          date: "2021-03-01",
          value: 2.62
        },
        {
          date: "2021-04-01",
          value: 2.66
        },
        {
          date: "2021-05-01",
          value: 2.91
        },
        {
          date: "2021-06-01",
          value: 3.26
        },
        {
          date: "2021-07-01",
          value: 3.84
        },
        {
          date: "2021-08-01",
          value: 4.07
        },
        {
          date: "2021-09-01",
          value: 5.16
        },
        {
          date: "2021-10-01",
          value: 5.51
        },
        {
          date: "2021-11-01",
          value: 5.05
        },
        {
          date: "2021-12-01",
          value: 3.76
        },
        {
          date: "2022-01-01",
          value: 4.38
        },
        {
          date: "2022-02-01",
          value: 4.69
        },
        {
          date: "2022-03-01",
          value: 4.9
        },
        {
          date: "2022-04-01",
          value: 6.6
        },
        {
          date: "2022-05-01",
          value: 8.14
        },
        {
          date: "2022-06-01",
          value: 7.7
        },
        {
          date: "2022-07-01",
          value: 7.28
        },
        {
          date: "2022-08-01",
          value: 8.81
        },
        {
          date: "2022-09-01",
          value: 7.88
        },
        {
          date: "2022-10-01",
          value: 5.66
        },
        {
          date: "2022-11-01",
          value: 5.45
        },
        {
          date: "2022-12-01",
          value: 5.53
        },
        {
          date: "2023-01-01",
          value: 3.27
        },
        {
          date: "2023-02-01",
          value: 2.38
        },
        {
          date: "2023-03-01",
          value: 2.31
        },
        {
          date: "2023-04-01",
          value: 2.16
        },
        {
          date: "2023-05-01",
          value: 2.15
        },
        {
          date: "2023-06-01",
          value: 2.18
        },
        {
          date: "2023-07-01",
          value: 2.55
        },
        {
          date: "2023-08-01",
          value: 2.58
        },
        {
          date: "2023-09-01",
          value: 2.64
        },
        {
          date: "2023-10-01",
          value: 2.98
        },
        {
          date: "2023-11-01",
          value: 2.71
        },
        {
          date: "2023-12-01",
          value: 2.52
        },
        {
          date: "2024-01-01",
          value: 3.18
        },
        {
          date: "2024-02-01",
          value: 1.72
        },
        {
          date: "2024-03-01",
          value: 1.49
        },
        {
          date: "2024-04-01",
          value: 1.6
        },
        {
          date: "2024-05-01",
          value: 2.12
        },
        {
          date: "2024-06-01",
          value: 2.54
        },
        {
          date: "2024-07-01",
          value: 2.08
        },
        {
          date: "2024-08-01",
          value: 1.99
        },
        {
          date: "2024-09-01",
          value: 2.28
        },
        {
          date: "2024-10-01",
          value: 2.2
        },
        {
          date: "2024-11-01",
          value: 2.12
        },
        {
          date: "2024-12-01",
          value: 3.01
        },
        {
          date: "2025-01-01",
          value: 4.13
        },
        {
          date: "2025-02-01",
          value: 4.19
        },
        {
          date: "2025-03-01",
          value: 4.12
        },
        {
          date: "2025-04-01",
          value: 3.42
        },
        {
          date: "2025-05-01",
          value: 3.12
        },
        {
          date: "2025-06-01",
          value: 3.02
        },
        {
          date: "2025-07-01",
          value: 3.2
        },
        {
          date: "2025-08-01",
          value: 2.91
        },
        {
          date: "2025-09-01",
          value: 2.97
        },
        {
          date: "2025-10-01",
          value: 3.19
        },
        {
          date: "2025-11-01",
          value: 3.79
        },
        {
          date: "2025-12-01",
          value: 4.26
        },
        {
          date: "2026-01-01",
          value: 7.72
        },
        {
          date: "2026-02-01",
          value: 3.62
        },
        {
          date: "2026-03-01",
          value: 3.04
        },
        {
          date: "2026-04-01",
          value: 2.77
        },
        {
          date: "2026-05-01",
          value: 2.94
        },
        {
          date: "2026-06-01",
          value: 3.14
        },
        {
          date: "2026-07-01",
          value: 2.89
        },
        {
          date: "2026-08-01",
          value: 2.77
        }
      ]
    },
    copper: {
      id: "copper",
      fred: "PCOPPUSDM",
      mode: "level",
      unit: "USD/ton",
      updated: "2026-08-29T10:40:53.576Z",
      last: {
        date: "2026-07-01",
        value: 13542.82
      },
      points: [
        {
          date: "2016-08-01",
          value: 4751.67
        },
        {
          date: "2016-09-01",
          value: 4722.2
        },
        {
          date: "2016-10-01",
          value: 4731.26
        },
        {
          date: "2016-11-01",
          value: 5450.93
        },
        {
          date: "2016-12-01",
          value: 5660.35
        },
        {
          date: "2017-01-01",
          value: 5754.56
        },
        {
          date: "2017-02-01",
          value: 5940.91
        },
        {
          date: "2017-03-01",
          value: 5824.63
        },
        {
          date: "2017-04-01",
          value: 5683.9
        },
        {
          date: "2017-05-01",
          value: 5599.56
        },
        {
          date: "2017-06-01",
          value: 5719.76
        },
        {
          date: "2017-07-01",
          value: 5985.12
        },
        {
          date: "2017-08-01",
          value: 6485.63
        },
        {
          date: "2017-09-01",
          value: 6577.17
        },
        {
          date: "2017-10-01",
          value: 6807.6
        },
        {
          date: "2017-11-01",
          value: 6826.55
        },
        {
          date: "2017-12-01",
          value: 6833.89
        },
        {
          date: "2018-01-01",
          value: 7065.85
        },
        {
          date: "2018-02-01",
          value: 7006.53
        },
        {
          date: "2018-03-01",
          value: 6799.18
        },
        {
          date: "2018-04-01",
          value: 6851.51
        },
        {
          date: "2018-05-01",
          value: 6825.27
        },
        {
          date: "2018-06-01",
          value: 6965.86
        },
        {
          date: "2018-07-01",
          value: 6250.75
        },
        {
          date: "2018-08-01",
          value: 6051.05
        },
        {
          date: "2018-09-01",
          value: 6050.76
        },
        {
          date: "2018-10-01",
          value: 6219.59
        },
        {
          date: "2018-11-01",
          value: 6195.92
        },
        {
          date: "2018-12-01",
          value: 6075.32
        },
        {
          date: "2019-01-01",
          value: 5939.1
        },
        {
          date: "2019-02-01",
          value: 6300.49
        },
        {
          date: "2019-03-01",
          value: 6439.46
        },
        {
          date: "2019-04-01",
          value: 6438.36
        },
        {
          date: "2019-05-01",
          value: 6017.9
        },
        {
          date: "2019-06-01",
          value: 5882.23
        },
        {
          date: "2019-07-01",
          value: 5941.2
        },
        {
          date: "2019-08-01",
          value: 5709.44
        },
        {
          date: "2019-09-01",
          value: 5759.25
        },
        {
          date: "2019-10-01",
          value: 5757.3
        },
        {
          date: "2019-11-01",
          value: 5859.95
        },
        {
          date: "2019-12-01",
          value: 6077.06
        },
        {
          date: "2020-01-01",
          value: 6031.21
        },
        {
          date: "2020-02-01",
          value: 5687.75
        },
        {
          date: "2020-03-01",
          value: 5182.63
        },
        {
          date: "2020-04-01",
          value: 5057.97
        },
        {
          date: "2020-05-01",
          value: 5239.83
        },
        {
          date: "2020-06-01",
          value: 5754.6
        },
        {
          date: "2020-07-01",
          value: 6372.46
        },
        {
          date: "2020-08-01",
          value: 6508.39
        },
        {
          date: "2020-09-01",
          value: 6704.9
        },
        {
          date: "2020-10-01",
          value: 6713.81
        },
        {
          date: "2020-11-01",
          value: 7068.91
        },
        {
          date: "2020-12-01",
          value: 7772.24
        },
        {
          date: "2021-01-01",
          value: 7972.15
        },
        {
          date: "2021-02-01",
          value: 8470.94
        },
        {
          date: "2021-03-01",
          value: 8988.25
        },
        {
          date: "2021-04-01",
          value: 9324.82
        },
        {
          date: "2021-05-01",
          value: 10166.29
        },
        {
          date: "2021-06-01",
          value: 9631.5
        },
        {
          date: "2021-07-01",
          value: 9450.82
        },
        {
          date: "2021-08-01",
          value: 9370.14
        },
        {
          date: "2021-09-01",
          value: 9324.71
        },
        {
          date: "2021-10-01",
          value: 9829.22
        },
        {
          date: "2021-11-01",
          value: 9728.9
        },
        {
          date: "2021-12-01",
          value: 9551.18
        },
        {
          date: "2022-01-01",
          value: 9782.34
        },
        {
          date: "2022-02-01",
          value: 9943.17
        },
        {
          date: "2022-03-01",
          value: 10230.89
        },
        {
          date: "2022-04-01",
          value: 10174.35
        },
        {
          date: "2022-05-01",
          value: 9395.03
        },
        {
          date: "2022-06-01",
          value: 9067.55
        },
        {
          date: "2022-07-01",
          value: 7544.81
        },
        {
          date: "2022-08-01",
          value: 7990.81
        },
        {
          date: "2022-09-01",
          value: 7746.01
        },
        {
          date: "2022-10-01",
          value: 7651.08
        },
        {
          date: "2022-11-01",
          value: 8049.86
        },
        {
          date: "2022-12-01",
          value: 8371.09
        },
        {
          date: "2023-01-01",
          value: 9007.35
        },
        {
          date: "2023-02-01",
          value: 8936.59
        },
        {
          date: "2023-03-01",
          value: 8856.31
        },
        {
          date: "2023-04-01",
          value: 8809.16
        },
        {
          date: "2023-05-01",
          value: 8243.16
        },
        {
          date: "2023-06-01",
          value: 8396.52
        },
        {
          date: "2023-07-01",
          value: 8476.68
        },
        {
          date: "2023-08-01",
          value: 8347.83
        },
        {
          date: "2023-09-01",
          value: 8276.71
        },
        {
          date: "2023-10-01",
          value: 7941.36
        },
        {
          date: "2023-11-01",
          value: 8189.59
        },
        {
          date: "2023-12-01",
          value: 8407.9
        },
        {
          date: "2024-01-01",
          value: 8351.34
        },
        {
          date: "2024-02-01",
          value: 8304.95
        },
        {
          date: "2024-03-01",
          value: 8692.82
        },
        {
          date: "2024-04-01",
          value: 9445.59
        },
        {
          date: "2024-05-01",
          value: 10117.16
        },
        {
          date: "2024-06-01",
          value: 9648.17
        },
        {
          date: "2024-07-01",
          value: 9385.31
        },
        {
          date: "2024-08-01",
          value: 8981.12
        },
        {
          date: "2024-09-01",
          value: 9259.13
        },
        {
          date: "2024-10-01",
          value: 9533.99
        },
        {
          date: "2024-11-01",
          value: 9075.73
        },
        {
          date: "2024-12-01",
          value: 8909.91
        },
        {
          date: "2025-01-01",
          value: 8976.68
        },
        {
          date: "2025-02-01",
          value: 9330.98
        },
        {
          date: "2025-03-01",
          value: 9735.82
        },
        {
          date: "2025-04-01",
          value: 9172.7
        },
        {
          date: "2025-05-01",
          value: 9531.2
        },
        {
          date: "2025-06-01",
          value: 9835.07
        },
        {
          date: "2025-07-01",
          value: 9770.58
        },
        {
          date: "2025-08-01",
          value: 9671.88
        },
        {
          date: "2025-09-01",
          value: 9994.77
        },
        {
          date: "2025-10-01",
          value: 10739.92
        },
        {
          date: "2025-11-01",
          value: 10812.03
        },
        {
          date: "2025-12-01",
          value: 11790.96
        },
        {
          date: "2026-01-01",
          value: 12986.61
        },
        {
          date: "2026-02-01",
          value: 12951.35
        },
        {
          date: "2026-03-01",
          value: 12528.71
        },
        {
          date: "2026-04-01",
          value: 12890.69
        },
        {
          date: "2026-05-01",
          value: 13512.16
        },
        {
          date: "2026-06-01",
          value: 13552.04
        },
        {
          date: "2026-07-01",
          value: 13542.82
        }
      ]
    },
    claims: {
      id: "claims",
      fred: "ICNSA",
      mode: "level",
      unit: "orang",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-08-01",
        value: 204e3
      },
      points: [
        {
          date: "2016-09-01",
          value: 203777.5
        },
        {
          date: "2016-10-01",
          value: 231147
        },
        {
          date: "2016-11-01",
          value: 254986.5
        },
        {
          date: "2016-12-01",
          value: 333138
        },
        {
          date: "2017-01-01",
          value: 333138.5
        },
        {
          date: "2017-02-01",
          value: 239437.5
        },
        {
          date: "2017-03-01",
          value: 229787
        },
        {
          date: "2017-04-01",
          value: 225320
        },
        {
          date: "2017-05-01",
          value: 216156.75
        },
        {
          date: "2017-06-01",
          value: 228966.5
        },
        {
          date: "2017-07-01",
          value: 242841.8
        },
        {
          date: "2017-08-01",
          value: 200390.25
        },
        {
          date: "2017-09-01",
          value: 218406
        },
        {
          date: "2017-10-01",
          value: 216703.5
        },
        {
          date: "2017-11-01",
          value: 244655
        },
        {
          date: "2017-12-01",
          value: 314453.2
        },
        {
          date: "2018-01-01",
          value: 321816.75
        },
        {
          date: "2018-02-01",
          value: 221394.25
        },
        {
          date: "2018-03-01",
          value: 205243.4
        },
        {
          date: "2018-04-01",
          value: 211109.75
        },
        {
          date: "2018-05-01",
          value: 198841.25
        },
        {
          date: "2018-06-01",
          value: 213828
        },
        {
          date: "2018-07-01",
          value: 219568.75
        },
        {
          date: "2018-08-01",
          value: 178572
        },
        {
          date: "2018-09-01",
          value: 170923.4
        },
        {
          date: "2018-10-01",
          value: 195425
        },
        {
          date: "2018-11-01",
          value: 224007.25
        },
        {
          date: "2018-12-01",
          value: 290725
        },
        {
          date: "2019-01-01",
          value: 303577
        },
        {
          date: "2019-02-01",
          value: 227688.25
        },
        {
          date: "2019-03-01",
          value: 199595
        },
        {
          date: "2019-04-01",
          value: 202238
        },
        {
          date: "2019-05-01",
          value: 195605.5
        },
        {
          date: "2019-06-01",
          value: 213213.6
        },
        {
          date: "2019-07-01",
          value: 212723.75
        },
        {
          date: "2019-08-01",
          value: 178912.4
        },
        {
          date: "2019-09-01",
          value: 170459.5
        },
        {
          date: "2019-10-01",
          value: 193816
        },
        {
          date: "2019-11-01",
          value: 228353.6
        },
        {
          date: "2019-12-01",
          value: 297045
        },
        {
          date: "2020-01-01",
          value: 295816.5
        },
        {
          date: "2020-02-01",
          value: 213741.6
        },
        {
          date: "2020-03-01",
          value: 233697375e-2
        },
        {
          date: "2020-04-01",
          value: 4686939
        },
        {
          date: "2020-05-01",
          value: 21584972e-1
        },
        {
          date: "2020-06-01",
          value: 14710805e-1
        },
        {
          date: "2020-07-01",
          value: 1368789
        },
        {
          date: "2020-08-01",
          value: 866361.8
        },
        {
          date: "2020-09-01",
          value: 796900.75
        },
        {
          date: "2020-10-01",
          value: 753800
        },
        {
          date: "2020-11-01",
          value: 741695.25
        },
        {
          date: "2020-12-01",
          value: 887973.5
        },
        {
          date: "2021-01-01",
          value: 917776.6
        },
        {
          date: "2021-02-01",
          value: 786140.75
        },
        {
          date: "2021-03-01",
          value: 699160.5
        },
        {
          date: "2021-04-01",
          value: 620849.75
        },
        {
          date: "2021-05-01",
          value: 459351.8
        },
        {
          date: "2021-06-01",
          value: 382889.75
        },
        {
          date: "2021-07-01",
          value: 369959.2
        },
        {
          date: "2021-08-01",
          value: 305621.5
        },
        {
          date: "2021-09-01",
          value: 289827.25
        },
        {
          date: "2021-10-01",
          value: 257753.2
        },
        {
          date: "2021-11-01",
          value: 241725
        },
        {
          date: "2021-12-01",
          value: 265293
        },
        {
          date: "2022-01-01",
          value: 318591.6
        },
        {
          date: "2022-02-01",
          value: 221266.25
        },
        {
          date: "2022-03-01",
          value: 201172.25
        },
        {
          date: "2022-04-01",
          value: 203003
        },
        {
          date: "2022-05-01",
          value: 189146.75
        },
        {
          date: "2022-06-01",
          value: 201447.75
        },
        {
          date: "2022-07-01",
          value: 219301.6
        },
        {
          date: "2022-08-01",
          value: 184194.25
        },
        {
          date: "2022-09-01",
          value: 161778
        },
        {
          date: "2022-10-01",
          value: 182976.8
        },
        {
          date: "2022-11-01",
          value: 213724.25
        },
        {
          date: "2022-12-01",
          value: 266964.4
        },
        {
          date: "2023-01-01",
          value: 272706
        },
        {
          date: "2023-02-01",
          value: 217520.5
        },
        {
          date: "2023-03-01",
          value: 214746.75
        },
        {
          date: "2023-04-01",
          value: 206141.4
        },
        {
          date: "2023-05-01",
          value: 203381.5
        },
        {
          date: "2023-06-01",
          value: 237577.25
        },
        {
          date: "2023-07-01",
          value: 237429
        },
        {
          date: "2023-08-01",
          value: 208669.5
        },
        {
          date: "2023-09-01",
          value: 178776.8
        },
        {
          date: "2023-10-01",
          value: 193860.5
        },
        {
          date: "2023-11-01",
          value: 218084.75
        },
        {
          date: "2023-12-01",
          value: 265800.2
        },
        {
          date: "2024-01-01",
          value: 281025.5
        },
        {
          date: "2024-02-01",
          value: 213413.75
        },
        {
          date: "2024-03-01",
          value: 200038.6
        },
        {
          date: "2024-04-01",
          value: 204145.5
        },
        {
          date: "2024-05-01",
          value: 199402.75
        },
        {
          date: "2024-06-01",
          value: 224947.2
        },
        {
          date: "2024-07-01",
          value: 241324.5
        },
        {
          date: "2024-08-01",
          value: 196144
        },
        {
          date: "2024-09-01",
          value: 182104.75
        },
        {
          date: "2024-10-01",
          value: 216579.75
        },
        {
          date: "2024-11-01",
          value: 222877.8
        },
        {
          date: "2024-12-01",
          value: 280353.5
        },
        {
          date: "2025-01-01",
          value: 293002.25
        },
        {
          date: "2025-02-01",
          value: 229547.75
        },
        {
          date: "2025-03-01",
          value: 209481
        },
        {
          date: "2025-04-01",
          value: 218083.25
        },
        {
          date: "2025-05-01",
          value: 205719.6
        },
        {
          date: "2025-06-01",
          value: 234186.75
        },
        {
          date: "2025-07-01",
          value: 23e4
        },
        {
          date: "2025-08-01",
          value: 226e3
        },
        {
          date: "2025-09-01",
          value: 25e4
        },
        {
          date: "2025-10-01",
          value: 206641.5
        },
        {
          date: "2025-11-01",
          value: 232e3
        },
        {
          date: "2025-12-01",
          value: 213500
        },
        {
          date: "2026-01-01",
          value: 208e3
        },
        {
          date: "2026-02-01",
          value: 229e3
        },
        {
          date: "2026-03-01",
          value: 213e3
        },
        {
          date: "2026-04-01",
          value: 219e3
        },
        {
          date: "2026-05-01",
          value: 2e5
        },
        {
          date: "2026-06-01",
          value: 227e3
        },
        {
          date: "2026-07-01",
          value: 212667
        },
        {
          date: "2026-08-01",
          value: 204e3
        }
      ]
    },
    capacity: {
      id: "capacity",
      fred: "TCU",
      mode: "level",
      unit: "%",
      updated: "2026-08-29T10:40:54.381Z",
      last: {
        date: "2026-07-01",
        value: 76.29
      },
      points: [
        {
          date: "2016-08-01",
          value: 75.43
        },
        {
          date: "2016-09-01",
          value: 75.31
        },
        {
          date: "2016-10-01",
          value: 75.29
        },
        {
          date: "2016-11-01",
          value: 74.95
        },
        {
          date: "2016-12-01",
          value: 75.44
        },
        {
          date: "2017-01-01",
          value: 75.23
        },
        {
          date: "2017-02-01",
          value: 74.93
        },
        {
          date: "2017-03-01",
          value: 75.44
        },
        {
          date: "2017-04-01",
          value: 76.24
        },
        {
          date: "2017-05-01",
          value: 76.37
        },
        {
          date: "2017-06-01",
          value: 76.58
        },
        {
          date: "2017-07-01",
          value: 76.45
        },
        {
          date: "2017-08-01",
          value: 76.21
        },
        {
          date: "2017-09-01",
          value: 76.36
        },
        {
          date: "2017-10-01",
          value: 77.38
        },
        {
          date: "2017-11-01",
          value: 77.63
        },
        {
          date: "2017-12-01",
          value: 77.85
        },
        {
          date: "2018-01-01",
          value: 77.91
        },
        {
          date: "2018-02-01",
          value: 78.15
        },
        {
          date: "2018-03-01",
          value: 78.57
        },
        {
          date: "2018-04-01",
          value: 79.46
        },
        {
          date: "2018-05-01",
          value: 78.75
        },
        {
          date: "2018-06-01",
          value: 79.36
        },
        {
          date: "2018-07-01",
          value: 79.46
        },
        {
          date: "2018-08-01",
          value: 79.93
        },
        {
          date: "2018-09-01",
          value: 79.93
        },
        {
          date: "2018-10-01",
          value: 79.78
        },
        {
          date: "2018-11-01",
          value: 79.77
        },
        {
          date: "2018-12-01",
          value: 79.71
        },
        {
          date: "2019-01-01",
          value: 79.1
        },
        {
          date: "2019-02-01",
          value: 78.59
        },
        {
          date: "2019-03-01",
          value: 78.53
        },
        {
          date: "2019-04-01",
          value: 77.99
        },
        {
          date: "2019-05-01",
          value: 78
        },
        {
          date: "2019-06-01",
          value: 77.95
        },
        {
          date: "2019-07-01",
          value: 77.49
        },
        {
          date: "2019-08-01",
          value: 77.95
        },
        {
          date: "2019-09-01",
          value: 77.62
        },
        {
          date: "2019-10-01",
          value: 76.91
        },
        {
          date: "2019-11-01",
          value: 77.25
        },
        {
          date: "2019-12-01",
          value: 77.04
        },
        {
          date: "2020-01-01",
          value: 76.52
        },
        {
          date: "2020-02-01",
          value: 76.78
        },
        {
          date: "2020-03-01",
          value: 73.79
        },
        {
          date: "2020-04-01",
          value: 64.08
        },
        {
          date: "2020-05-01",
          value: 65.19
        },
        {
          date: "2020-06-01",
          value: 69.52
        },
        {
          date: "2020-07-01",
          value: 72.21
        },
        {
          date: "2020-08-01",
          value: 73.02
        },
        {
          date: "2020-09-01",
          value: 73.15
        },
        {
          date: "2020-10-01",
          value: 73.86
        },
        {
          date: "2020-11-01",
          value: 74.26
        },
        {
          date: "2020-12-01",
          value: 75.39
        },
        {
          date: "2021-01-01",
          value: 75.94
        },
        {
          date: "2021-02-01",
          value: 73.57
        },
        {
          date: "2021-03-01",
          value: 75.85
        },
        {
          date: "2021-04-01",
          value: 76.12
        },
        {
          date: "2021-05-01",
          value: 76.93
        },
        {
          date: "2021-06-01",
          value: 77.34
        },
        {
          date: "2021-07-01",
          value: 77.8
        },
        {
          date: "2021-08-01",
          value: 77.73
        },
        {
          date: "2021-09-01",
          value: 76.89
        },
        {
          date: "2021-10-01",
          value: 77.98
        },
        {
          date: "2021-11-01",
          value: 78.56
        },
        {
          date: "2021-12-01",
          value: 78.37
        },
        {
          date: "2022-01-01",
          value: 78.09
        },
        {
          date: "2022-02-01",
          value: 78.58
        },
        {
          date: "2022-03-01",
          value: 79.03
        },
        {
          date: "2022-04-01",
          value: 79.04
        },
        {
          date: "2022-05-01",
          value: 78.92
        },
        {
          date: "2022-06-01",
          value: 78.63
        },
        {
          date: "2022-07-01",
          value: 78.72
        },
        {
          date: "2022-08-01",
          value: 78.54
        },
        {
          date: "2022-09-01",
          value: 78.61
        },
        {
          date: "2022-10-01",
          value: 78.48
        },
        {
          date: "2022-11-01",
          value: 78.15
        },
        {
          date: "2022-12-01",
          value: 77.13
        },
        {
          date: "2023-01-01",
          value: 77.6
        },
        {
          date: "2023-02-01",
          value: 77.61
        },
        {
          date: "2023-03-01",
          value: 77.8
        },
        {
          date: "2023-04-01",
          value: 77.89
        },
        {
          date: "2023-05-01",
          value: 77.55
        },
        {
          date: "2023-06-01",
          value: 76.85
        },
        {
          date: "2023-07-01",
          value: 77.38
        },
        {
          date: "2023-08-01",
          value: 77.26
        },
        {
          date: "2023-09-01",
          value: 77.34
        },
        {
          date: "2023-10-01",
          value: 76.86
        },
        {
          date: "2023-11-01",
          value: 77.11
        },
        {
          date: "2023-12-01",
          value: 76.86
        },
        {
          date: "2024-01-01",
          value: 75.75
        },
        {
          date: "2024-02-01",
          value: 76.52
        },
        {
          date: "2024-03-01",
          value: 76.6
        },
        {
          date: "2024-04-01",
          value: 76.38
        },
        {
          date: "2024-05-01",
          value: 76.8
        },
        {
          date: "2024-06-01",
          value: 76.76
        },
        {
          date: "2024-07-01",
          value: 75.99
        },
        {
          date: "2024-08-01",
          value: 76.27
        },
        {
          date: "2024-09-01",
          value: 75.72
        },
        {
          date: "2024-10-01",
          value: 75.39
        },
        {
          date: "2024-11-01",
          value: 75.17
        },
        {
          date: "2024-12-01",
          value: 75.87
        },
        {
          date: "2025-01-01",
          value: 75.58
        },
        {
          date: "2025-02-01",
          value: 76.27
        },
        {
          date: "2025-03-01",
          value: 76.13
        },
        {
          date: "2025-04-01",
          value: 76.1
        },
        {
          date: "2025-05-01",
          value: 75.89
        },
        {
          date: "2025-06-01",
          value: 76.18
        },
        {
          date: "2025-07-01",
          value: 76.4
        },
        {
          date: "2025-08-01",
          value: 76.11
        },
        {
          date: "2025-09-01",
          value: 76.05
        },
        {
          date: "2025-10-01",
          value: 75.62
        },
        {
          date: "2025-11-01",
          value: 75.39
        },
        {
          date: "2025-12-01",
          value: 75.64
        },
        {
          date: "2026-01-01",
          value: 75.24
        },
        {
          date: "2026-02-01",
          value: 75.81
        },
        {
          date: "2026-03-01",
          value: 75.63
        },
        {
          date: "2026-04-01",
          value: 76.14
        },
        {
          date: "2026-05-01",
          value: 76.06
        },
        {
          date: "2026-06-01",
          value: 76.2
        },
        {
          date: "2026-07-01",
          value: 76.29
        }
      ]
    },
    eu_gdp: {
      id: "eu_gdp",
      fred: "CLVMNACSCAB1GQEA19",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-29T10:40:54.696Z",
      last: {
        date: "2026-04-01",
        value: 0.94
      },
      points: [
        {
          date: "2008-01-01",
          value: 2.22
        },
        {
          date: "2008-04-01",
          value: 1.03
        },
        {
          date: "2008-07-01",
          value: 0.1
        },
        {
          date: "2008-10-01",
          value: -2.12
        },
        {
          date: "2009-01-01",
          value: -5.72
        },
        {
          date: "2009-04-01",
          value: -5.24
        },
        {
          date: "2009-07-01",
          value: -4.36
        },
        {
          date: "2009-10-01",
          value: -2.26
        },
        {
          date: "2010-01-01",
          value: 1.22
        },
        {
          date: "2010-04-01",
          value: 2.17
        },
        {
          date: "2010-07-01",
          value: 2.24
        },
        {
          date: "2010-10-01",
          value: 2.39
        },
        {
          date: "2011-01-01",
          value: 2.96
        },
        {
          date: "2011-04-01",
          value: 1.98
        },
        {
          date: "2011-07-01",
          value: 1.56
        },
        {
          date: "2011-10-01",
          value: 0.67
        },
        {
          date: "2012-01-01",
          value: -0.52
        },
        {
          date: "2012-04-01",
          value: -0.87
        },
        {
          date: "2012-07-01",
          value: -1.02
        },
        {
          date: "2012-10-01",
          value: -1.16
        },
        {
          date: "2013-01-01",
          value: -1.25
        },
        {
          date: "2013-04-01",
          value: -0.25
        },
        {
          date: "2013-07-01",
          value: 0.18
        },
        {
          date: "2013-10-01",
          value: 0.83
        },
        {
          date: "2014-01-01",
          value: 1.65
        },
        {
          date: "2014-04-01",
          value: 1.22
        },
        {
          date: "2014-07-01",
          value: 1.41
        },
        {
          date: "2014-10-01",
          value: 1.57
        },
        {
          date: "2015-01-01",
          value: 1.87
        },
        {
          date: "2015-04-01",
          value: 2.06
        },
        {
          date: "2015-07-01",
          value: 1.99
        },
        {
          date: "2015-10-01",
          value: 2.11
        },
        {
          date: "2016-01-01",
          value: 1.81
        },
        {
          date: "2016-04-01",
          value: 1.58
        },
        {
          date: "2016-07-01",
          value: 1.65
        },
        {
          date: "2016-10-01",
          value: 1.97
        },
        {
          date: "2017-01-01",
          value: 2.25
        },
        {
          date: "2017-04-01",
          value: 2.76
        },
        {
          date: "2017-07-01",
          value: 3.03
        },
        {
          date: "2017-10-01",
          value: 3.04
        },
        {
          date: "2018-01-01",
          value: 2.27
        },
        {
          date: "2018-04-01",
          value: 2.11
        },
        {
          date: "2018-07-01",
          value: 1.44
        },
        {
          date: "2018-10-01",
          value: 1.16
        },
        {
          date: "2019-01-01",
          value: 1.87
        },
        {
          date: "2019-04-01",
          value: 1.68
        },
        {
          date: "2019-07-01",
          value: 1.82
        },
        {
          date: "2019-10-01",
          value: 1.16
        },
        {
          date: "2020-01-01",
          value: -2.79
        },
        {
          date: "2020-04-01",
          value: -13.9
        },
        {
          date: "2020-07-01",
          value: -4.15
        },
        {
          date: "2020-10-01",
          value: -3.77
        },
        {
          date: "2021-01-01",
          value: 0.24
        },
        {
          date: "2021-04-01",
          value: 15.24
        },
        {
          date: "2021-07-01",
          value: 5.17
        },
        {
          date: "2021-10-01",
          value: 5.64
        },
        {
          date: "2022-01-01",
          value: 5.53
        },
        {
          date: "2022-04-01",
          value: 4.27
        },
        {
          date: "2022-07-01",
          value: 2.96
        },
        {
          date: "2022-10-01",
          value: 2.16
        },
        {
          date: "2023-01-01",
          value: 1.29
        },
        {
          date: "2023-04-01",
          value: 0.54
        },
        {
          date: "2023-07-01",
          value: 0.14
        },
        {
          date: "2023-10-01",
          value: 0.2
        },
        {
          date: "2024-01-01",
          value: 0.69
        },
        {
          date: "2024-04-01",
          value: 0.69
        },
        {
          date: "2024-07-01",
          value: 1.05
        },
        {
          date: "2024-10-01",
          value: 1.35
        },
        {
          date: "2025-01-01",
          value: 1.57
        },
        {
          date: "2025-04-01",
          value: 1.35
        },
        {
          date: "2025-07-01",
          value: 1.16
        },
        {
          date: "2025-10-01",
          value: 1.05
        },
        {
          date: "2026-01-01",
          value: 0.48
        },
        {
          date: "2026-04-01",
          value: 0.94
        }
      ]
    },
    china_cpi: {
      id: "china_cpi",
      fred: "CHNCPIALLMINMEI",
      mode: "yoy_pct",
      unit: "%",
      updated: "2026-08-29T10:40:55.042Z",
      last: {
        date: "2025-04-01",
        value: -0.07
      },
      points: [
        {
          date: "2015-05-01",
          value: 1.22
        },
        {
          date: "2015-06-01",
          value: 1.32
        },
        {
          date: "2015-07-01",
          value: 1.73
        },
        {
          date: "2015-08-01",
          value: 2.03
        },
        {
          date: "2015-09-01",
          value: 1.62
        },
        {
          date: "2015-10-01",
          value: 1.21
        },
        {
          date: "2015-11-01",
          value: 1.52
        },
        {
          date: "2015-12-01",
          value: 1.62
        },
        {
          date: "2016-01-01",
          value: 1.81
        },
        {
          date: "2016-02-01",
          value: 2.19
        },
        {
          date: "2016-03-01",
          value: 2.3
        },
        {
          date: "2016-04-01",
          value: 2.31
        },
        {
          date: "2016-05-01",
          value: 2.11
        },
        {
          date: "2016-06-01",
          value: 1.91
        },
        {
          date: "2016-07-01",
          value: 1.7
        },
        {
          date: "2016-08-01",
          value: 1.29
        },
        {
          date: "2016-09-01",
          value: 1.89
        },
        {
          date: "2016-10-01",
          value: 2.2
        },
        {
          date: "2016-11-01",
          value: 2.3
        },
        {
          date: "2016-12-01",
          value: 1.99
        },
        {
          date: "2017-01-01",
          value: 2.57
        },
        {
          date: "2017-02-01",
          value: 0.78
        },
        {
          date: "2017-03-01",
          value: 0.98
        },
        {
          date: "2017-04-01",
          value: 1.18
        },
        {
          date: "2017-05-01",
          value: 1.67
        },
        {
          date: "2017-06-01",
          value: 1.68
        },
        {
          date: "2017-07-01",
          value: 1.38
        },
        {
          date: "2017-08-01",
          value: 1.77
        },
        {
          date: "2017-09-01",
          value: 1.66
        },
        {
          date: "2017-10-01",
          value: 1.86
        },
        {
          date: "2017-11-01",
          value: 1.76
        },
        {
          date: "2017-12-01",
          value: 1.85
        },
        {
          date: "2018-01-01",
          value: 1.45
        },
        {
          date: "2018-02-01",
          value: 2.9
        },
        {
          date: "2018-03-01",
          value: 2.03
        },
        {
          date: "2018-04-01",
          value: 1.84
        },
        {
          date: "2018-05-01",
          value: 1.55
        },
        {
          date: "2018-06-01",
          value: 1.75
        },
        {
          date: "2018-07-01",
          value: 2.14
        },
        {
          date: "2018-08-01",
          value: 2.32
        },
        {
          date: "2018-09-01",
          value: 2.4
        },
        {
          date: "2018-10-01",
          value: 2.5
        },
        {
          date: "2018-11-01",
          value: 2.11
        },
        {
          date: "2018-12-01",
          value: 1.91
        },
        {
          date: "2019-01-01",
          value: 1.71
        },
        {
          date: "2019-02-01",
          value: 1.5
        },
        {
          date: "2019-03-01",
          value: 2.28
        },
        {
          date: "2019-04-01",
          value: 2.57
        },
        {
          date: "2019-05-01",
          value: 2.76
        },
        {
          date: "2019-06-01",
          value: 2.67
        },
        {
          date: "2019-07-01",
          value: 2.76
        },
        {
          date: "2019-08-01",
          value: 2.83
        },
        {
          date: "2019-09-01",
          value: 3
        },
        {
          date: "2019-10-01",
          value: 3.75
        },
        {
          date: "2019-11-01",
          value: 4.51
        },
        {
          date: "2019-12-01",
          value: 4.41
        },
        {
          date: "2020-01-01",
          value: 5.42
        },
        {
          date: "2020-02-01",
          value: 5.18
        },
        {
          date: "2020-03-01",
          value: 4.27
        },
        {
          date: "2020-04-01",
          value: 3.25
        },
        {
          date: "2020-05-01",
          value: 2.41
        },
        {
          date: "2020-06-01",
          value: 2.51
        },
        {
          date: "2020-07-01",
          value: 1.76
        },
        {
          date: "2020-08-01",
          value: 2.39
        },
        {
          date: "2020-09-01",
          value: 1.73
        },
        {
          date: "2020-10-01",
          value: 0.54
        },
        {
          date: "2020-11-01",
          value: -0.45
        },
        {
          date: "2020-12-01",
          value: 0.27
        },
        {
          date: "2021-01-01",
          value: -0.22
        },
        {
          date: "2021-02-01",
          value: -0.42
        },
        {
          date: "2021-03-01",
          value: 0.32
        },
        {
          date: "2021-04-01",
          value: 0.92
        },
        {
          date: "2021-05-01",
          value: 1.64
        },
        {
          date: "2021-06-01",
          value: 1.24
        },
        {
          date: "2021-07-01",
          value: 1.91
        },
        {
          date: "2021-08-01",
          value: 0.64
        },
        {
          date: "2021-09-01",
          value: 0.46
        },
        {
          date: "2021-10-01",
          value: 1.43
        },
        {
          date: "2021-11-01",
          value: 2.48
        },
        {
          date: "2021-12-01",
          value: 1.44
        },
        {
          date: "2022-01-01",
          value: 0.99
        },
        {
          date: "2022-02-01",
          value: 0.99
        },
        {
          date: "2022-03-01",
          value: 1.49
        },
        {
          date: "2022-04-01",
          value: 2.18
        },
        {
          date: "2022-05-01",
          value: 2.09
        },
        {
          date: "2022-06-01",
          value: 2.49
        },
        {
          date: "2022-07-01",
          value: 2.69
        },
        {
          date: "2022-08-01",
          value: 2.49
        },
        {
          date: "2022-09-01",
          value: 2.78
        },
        {
          date: "2022-10-01",
          value: 2.17
        },
        {
          date: "2022-11-01",
          value: 1.57
        },
        {
          date: "2022-12-01",
          value: 1.78
        },
        {
          date: "2023-01-01",
          value: 2.06
        },
        {
          date: "2023-02-01",
          value: 0.98
        },
        {
          date: "2023-03-01",
          value: 0.68
        },
        {
          date: "2023-04-01",
          value: 0.1
        },
        {
          date: "2023-05-01",
          value: 0.19
        },
        {
          date: "2023-06-01",
          value: 0
        },
        {
          date: "2023-07-01",
          value: -0.29
        },
        {
          date: "2023-08-01",
          value: 0.1
        },
        {
          date: "2023-09-01",
          value: 0
        },
        {
          date: "2023-10-01",
          value: -0.19
        },
        {
          date: "2023-11-01",
          value: -0.48
        },
        {
          date: "2023-12-01",
          value: -0.29
        },
        {
          date: "2024-01-01",
          value: -0.87
        },
        {
          date: "2024-02-01",
          value: 0.68
        },
        {
          date: "2024-03-01",
          value: 0.1
        },
        {
          date: "2024-04-01",
          value: 0.19
        },
        {
          date: "2024-05-01",
          value: 0.29
        },
        {
          date: "2024-06-01",
          value: 0.19
        },
        {
          date: "2024-07-01",
          value: 0.49
        },
        {
          date: "2024-08-01",
          value: 0.58
        },
        {
          date: "2024-09-01",
          value: 0.39
        },
        {
          date: "2024-10-01",
          value: 0.29
        },
        {
          date: "2024-11-01",
          value: 0.19
        },
        {
          date: "2024-12-01",
          value: 0.1
        },
        {
          date: "2025-01-01",
          value: 0.48
        },
        {
          date: "2025-02-01",
          value: -0.77
        },
        {
          date: "2025-03-01",
          value: -0.1
        },
        {
          date: "2025-04-01",
          value: -0.07
        }
      ]
    },
    ismmfg: {
      id: "ismmfg",
      fred: "ISMPMI",
      mode: "level",
      unit: "index",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: 55.6
      },
      points: [
        {
          date: "2025-11-01",
          value: 48.2
        },
        {
          date: "2025-12-01",
          value: 47.9
        },
        {
          date: "2026-01-01",
          value: 52.6
        },
        {
          date: "2026-02-01",
          value: 52.4
        },
        {
          date: "2026-03-01",
          value: 52.7
        },
        {
          date: "2026-04-01",
          value: 52.7
        },
        {
          date: "2026-05-01",
          value: 54
        },
        {
          date: "2026-06-01",
          value: 53.3
        },
        {
          date: "2026-07-01",
          value: 55.6
        }
      ]
    },
    ismsvc: {
      id: "ismsvc",
      fred: "NAPMNOI",
      mode: "level",
      unit: "index",
      updated: "2026-08-30T12:00:00Z",
      last: {
        date: "2026-07-01",
        value: 54.1
      },
      points: [
        {
          date: "2025-05-01",
          value: 49.9
        },
        {
          date: "2025-06-01",
          value: 50.8
        },
        {
          date: "2025-07-01",
          value: 50.1
        },
        {
          date: "2025-08-01",
          value: 52
        },
        {
          date: "2025-09-01",
          value: 50
        },
        {
          date: "2025-11-01",
          value: 52.6
        },
        {
          date: "2025-12-01",
          value: 54.4
        },
        {
          date: "2026-01-01",
          value: 53.8
        },
        {
          date: "2026-02-01",
          value: 56.1
        },
        {
          date: "2026-03-01",
          value: 54
        },
        {
          date: "2026-04-01",
          value: 53.6
        },
        {
          date: "2026-05-01",
          value: 54.5
        },
        {
          date: "2026-06-01",
          value: 54
        },
        {
          date: "2026-07-01",
          value: 54.1
        }
      ]
    },
    adp: {
      id: "adp",
      points: [
        {
          date: "2025-10-01",
          value: 29
        },
        {
          date: "2025-11-01",
          value: 37
        },
        {
          date: "2025-12-01",
          value: 11
        },
        {
          date: "2026-01-01",
          value: 66
        },
        {
          date: "2026-02-01",
          value: 66
        },
        {
          date: "2026-03-01",
          value: 62
        },
        {
          date: "2026-04-01",
          value: 105
        },
        {
          date: "2026-05-01",
          value: 122
        }
      ],
      last: {
        date: "2026-05-01",
        value: 122
      }
    }
  }
};

// lib/series.js
var SERIES_RAW = [
  {
    id: "nfp",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Nonfarm Payrolls (NFP)",
    short: "NFP",
    category: "tenaga-kerja",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "PAYEMS",
    mode: "monthly_change",
    unit: "ribu",
    decimals: 1,
    impact: "High",
    release: "Awal bulan (hari irreguler, Rabu\u2013Jumat), 08:30 ET (19:30/20:30 WIB)",
    about: "Perubahan jumlah tenaga kerja non-pertanian (paling banyak menentukan pergerakan pasar).",
    why: "Menunjukkan kesehatan pasar tenaga kerja & arah kebijakan suku bunga The Fed.",
    fx: "Data kuat \u2192 USD kuat (hawkish). Data lemah/lebih rendah dari estimasi \u2192 USD melemah."
  },
  {
    id: "unemp",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Unemployment Rate",
    short: "Unemployment",
    category: "tenaga-kerja",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "UNRATE",
    mode: "level",
    unit: "%",
    decimals: 1,
    impact: "High",
    release: "Bersamaan dengan NFP, 08:30 ET",
    about: "Persentase angkatan kerja yang menganggur.",
    why: "Tingkat pengangguran rendah memicu kekhawatiran inflasi upah.",
    fx: "Turun \u2192 USD bullish; naik mendadak \u2192 USD bearish."
  },
  {
    id: "cpi",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Consumer Price Index (CPI)",
    short: "CPI",
    category: "inflasi",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "CPIAUCSL",
    mode: "yoy_pct",
    unit: "%",
    decimals: 2,
    impact: "High",
    release: "Sekitar pertengahan bulan, 08:30 ET",
    about: "Perubahan harga barang & jasa yang dibeli konsumen (YoY).",
    why: "Ukuran inflasi utama yang dipantau The Fed.",
    fx: "Naik di atas target \u2192 The Fed hawkish \u2192 USD kuat. Turun \u2192 USD lemah."
  },
  {
    id: "corecpi",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Core CPI",
    short: "Core CPI",
    category: "inflasi",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "CPILFESL",
    mode: "yoy_pct",
    unit: "%",
    decimals: 2,
    impact: "High",
    release: "Bersamaan dengan CPI",
    about: "CPI tanpa makanan & energi (lebih stabil, jadi fokus pasar).",
    why: "The Fed lebih memperhatikan core CPI untuk kebijakan.",
    fx: "Core CPI tinggi \u2192 USD bullish; rendah \u2192 USD bearish."
  },
  {
    id: "ppi",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Producer Price Index (PPI)",
    short: "PPI",
    category: "inflasi",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "PPIACO",
    mode: "yoy_pct",
    unit: "%",
    decimals: 2,
    impact: "High",
    release: "Sekitar pertengahan bulan, 08:30 ET",
    about: "Perubahan harga di tingkat produsen (indikator pendahulu inflasi konsumen).",
    why: "Biaya produksi yang naik biasanya terbawa ke harga konsumen.",
    fx: "PPI tinggi \u2192 tekanan inflasi \u2192 USD bisa menguat."
  },
  {
    id: "corepce",
    name: "Core PCE Price Index (m/m)",
    short: "Core PCE",
    category: "inflasi",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "PCEPILFE",
    mode: "mom_pct",
    unit: "%",
    decimals: 2,
    impact: "High",
    release: "Akhir bulan, 08:30 ET (19:30 WIB)",
    about: "Indeks harga pengeluaran konsumsi pribadi inti (tanpa makanan & energi) \u2014 ukuran inflasi favorit The Fed.",
    why: "The Fed mengacu pada PCE inti untuk menilai tren inflasi jangka menengah.",
    fx: "Core PCE tinggi \u2192 tekanan kenaikan suku bunga \u2192 USD bisa menguat.",
    // koreksi FF 26 Agu 2026 (obs Jun 0,1 / Jul 0,2) → kunci ke seed
    noLive: true
  },
  {
    id: "ahe",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Average Hourly Earnings",
    short: "AHE",
    category: "tenaga-kerja",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "CES0500000003",
    mode: "yoy_pct",
    unit: "%",
    decimals: 2,
    impact: "Medium",
    release: "Bersamaan dengan NFP",
    about: "Perubahan upah rata-rata per jam (YoY).",
    why: "Kenaikan upah mendorong inflasi upah dan ekspektasi suku bunga.",
    fx: "Upah naik \u2192 USD bullish."
  },
  {
    id: "fedfunds",
    name: "Fed Funds Target Rate",
    short: "Fed Funds",
    category: "moneter",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "DFEDTARU",
    mode: "level",
    unit: "%",
    decimals: 2,
    impact: "High",
    release: "Putusan FOMC 8x/tahun, 14:00 ET",
    about: "Batas atas target suku bunga The Fed.",
    why: "Level suku bunga menentukan biaya dana secara global.",
    fx: "Kenaikan/ekspektasi kenaikan \u2192 USD kuat; pemotongan \u2192 USD lemah."
  },
  {
    id: "dgs10",
    name: "U.S. 10-Year Treasury Yield",
    short: "10Y Yield",
    category: "pasar",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "D",
    fred: "DGS10",
    mode: "level",
    unit: "%",
    decimals: 2,
    impact: "Medium",
    release: "Harian, pasar obligasi",
    about: "Imbal hasil obligasi pemerintah AS tenor 10 tahun.",
    why: "Imbal hasil adalah 'harga' uang; bergerak searah dengan USD.",
    fx: "Yield naik \u2192 aliran modal masuk \u2192 USD menguat."
  },
  {
    id: "retail",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Retail Sales",
    short: "Retail Sales",
    category: "konsumen",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "RSXFS",
    mode: "mom_pct",
    unit: "%",
    decimals: 1,
    impact: "Medium",
    release: "Sekitar pertengahan bulan",
    about: "Perubahan penjualan ritel bulanan.",
    why: "Proksi utama belanja konsumen (2/3 ekonomi AS).",
    fx: "Kuat \u2192 USD bullish; lemah \u2192 USD bearish."
  },
  {
    id: "umich",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Michigan Consumer Sentiment",
    short: "Michigan",
    category: "konsumen",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "UMCSENT",
    mode: "level",
    unit: "index",
    decimals: 1,
    impact: "Low",
    release: "Dua kali per bulan (preliminary & final)",
    about: "Kepercayaan / sentimen konsumen terhadap ekonomi.",
    why: "Menangkap ekspektasi inflasi konsumen.",
    fx: "Sentimen naik \u2192 risiko positif \u2192 USD bisa menguat."
  },
  {
    id: "indpro",
    name: "Industrial Production",
    short: "Ind. Production",
    category: "pertumbuhan",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "INDPRO",
    mode: "monthly_change",
    unit: "%",
    decimals: 2,
    impact: "Low",
    release: "Sekitar pertengahan bulan",
    about: "Perubahan output pabrik, pertambangan, & utilitas.",
    why: "Indikator aktivitas ekonomi sektor produksi.",
    fx: "Produksi naik \u2192 sentimen ekonomi membaik."
  },
  {
    id: "gdp",
    name: "Prelim GDP (q/q) Annualized",
    short: "GDP",
    category: "pertumbuhan",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "Q",
    fred: "GDPC1",
    mode: "qq_ann_pct",
    unit: "%",
    decimals: 1,
    impact: "High",
    release: "3x per kuartal (advance/prelim/final), 08:30 ET (19:30 WIB)",
    about: "Pertumbuhan PDB riil per kuartal, annualized (q/q) \u2014 angka awal (preliminary) dari BEA yang biasanya masih direvisi.",
    why: "Angka pertumbuhan terlebar; menentukan narasi 'ekonomi kuat vs perlambatan' dan ruang kebijakan The Fed.",
    fx: "GDP kuat \u2192 USD bullish; lemah \u2192 ekspektasi cut \u2192 USD bearish.",
    // dikonversi ke basis q/q sesuai ForexFactory (FF 26 Agu 2026: Q2 1,5 / Q1 1,5) → kunci ke seed
    noLive: true
  },
  {
    id: "eu_cpi",
    name: "Euro Area HICP Inflation",
    short: "EZ CPI",
    category: "inflasi",
    country: "EZ",
    countryName: "Zona Euro",
    freq: "M",
    fred: "CP0000EZ19M086NEST",
    mode: "yoy_pct",
    unit: "%",
    decimals: 1,
    impact: "High",
    release: "Flash estimate tiap akhir bulan / laporan awal",
    about: "Harmonized Index of Consumer Prices untuk Zona Euro.",
    why: "Menentukan kebijakan ECB.",
    fx: "Inflasi EZ tinggi \u2192 EUR kuat (ECB hawkish)."
  },
  {
    id: "eu_unemp",
    name: "Euro Area Unemployment Rate",
    short: "EZ Unemployment",
    category: "tenaga-kerja",
    country: "EZ",
    countryName: "Zona Euro",
    freq: "M",
    fred: "LRHUTTTTEZM156S",
    mode: "level",
    unit: "%",
    decimals: 1,
    impact: "Low",
    release: "Akhir bulan (Eurostat)",
    about: "Tingkat pengangguran Zona Euro.",
    why: "Indikator pasar tenaga kerja Eropa.",
    fx: "Pengangguran turun \u2192 EUR sedikit bullish."
  },
  {
    id: "uk_cpi",
    name: "U.K. CPI Inflation",
    short: "UK CPI",
    category: "inflasi",
    country: "UK",
    countryName: "Inggris",
    freq: "M",
    fred: "GBRCPIALLMINMEI",
    mode: "yoy_pct",
    unit: "%",
    decimals: 1,
    impact: "High",
    release: "Sekitar pertengahan bulan (ONS)",
    about: "Indeks harga konsumen Inggris.",
    why: "Menentukan kebijakan Bank of England.",
    fx: "Inflasi UK tinggi \u2192 GBP kuat (BoE hawkish)."
  },
  {
    id: "uk_unemp",
    name: "U.K. Unemployment Rate",
    short: "UK Unemployment",
    category: "tenaga-kerja",
    country: "UK",
    countryName: "Inggris",
    freq: "M",
    fred: "LRHUTTTTGBM156S",
    mode: "level",
    unit: "%",
    decimals: 1,
    impact: "Medium",
    release: "Bulanan (ONS)",
    about: "Tingkat pengangguran Inggris.",
    why: "Kesehatan pasar kerja memengaruhi kebijakan BoE.",
    fx: "Pengangguran turun \u2192 GBP bullish."
  },
  {
    id: "jp_cpi",
    name: "Japan CPI Inflation",
    short: "JP CPI",
    category: "inflasi",
    country: "JP",
    countryName: "Jepang",
    freq: "M",
    fred: "JPNCPIALLMINMEI",
    mode: "yoy_pct",
    unit: "%",
    decimals: 1,
    impact: "Medium",
    release: "Sekitar akhir bulan",
    about: "Indeks harga konsumen Jepang.",
    why: "Inflasi menentukan kebijakan Bank of Japan (normalisasi suku bunga).",
    fx: "Inflasi JP tinggi \u2192 JPY cenderung kuat."
  },
  {
    id: "wti",
    name: "WTI Crude Oil",
    short: "WTI",
    category: "pasar",
    country: "GL",
    countryName: "Global",
    freq: "D",
    fred: "DCOILWTICO",
    mode: "level",
    unit: "USD/barel",
    decimals: 2,
    impact: "Low",
    release: "Daily",
    about: "Harga minyak mentah WTI.",
    why: "Harga minyak berdampak pada inflasi & mata uang negara produsen.",
    fx: "Minyak naik \u2192 CAD (kadang) & NOK menguat; importir (JPY, EUR) melemah."
  },
  {
    id: "vix",
    name: "VIX Volatility Index",
    short: "VIX",
    category: "pasar",
    country: "US",
    countryName: "Global",
    freq: "D",
    fred: "VIXCLS",
    mode: "level",
    unit: "index",
    decimals: 2,
    impact: "Low",
    release: "Daily",
    about: "Ukuran volatilitas & ketakutan pasar (CBOE).",
    why: "VIX tinggi \u2192 risk-off \u2192 safe-haven (USD, JPY, CHF) menguat.",
    fx: "VIX naik \u2192 mata uang safe-haven kuat, mata uang risk tinggi melemah."
  },
  {
    id: "brent",
    name: "Brent Crude Oil",
    short: "Brent",
    category: "pasar",
    country: "GL",
    countryName: "Global",
    freq: "D",
    fred: "DCOILBRENTEU",
    mode: "level",
    unit: "USD/barel",
    decimals: 2,
    impact: "Low",
    release: "Daily",
    about: "Harga minyak mentah Brent (acuan internasional).",
    why: "Bersama WTI, menggerakkan mata uang produsen minyak & memengaruhi inflasi.",
    fx: "Brent naik \u2192 CAD/NOK menguat; importir (JPY/INR) tertekan."
  },
  {
    id: "natgas",
    name: "Natural Gas (Henry Hub)",
    short: "Nat Gas",
    category: "pasar",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "D",
    fred: "DHHNGSP",
    mode: "level",
    unit: "USD/MMBtu",
    decimals: 2,
    impact: "Low",
    release: "Daily",
    about: "Harga gas alam acuan di Henry Hub (AS).",
    why: "Mencerminkan biaya energi AS; berdampak pada inflasi & produsen energinya.",
    fx: "Gas naik \u2192 mendukung biaya energi & USD (eksportir energi)."
  },
  {
    id: "copper",
    name: "Copper (Global Price)",
    short: "Copper",
    category: "pasar",
    country: "GL",
    countryName: "Global",
    freq: "M",
    fred: "PCOPPUSDM",
    mode: "level",
    unit: "USD/ton",
    decimals: 0,
    impact: "Low",
    release: "Bulanan",
    about: "Harga tembaga global (USD per metrik ton).",
    why: "Disebut 'Dr. Copper' sebagai penanda kesehatan ekonomi global & permintaan industri.",
    fx: "Tembaga naik \u2192 permintaan global kuat \u2192 AUD/NZD (produsen) menguat."
  },
  {
    id: "claims",
    // tervalidasi earningsapi 30-Agu-2026 → kunci ke seed (bukan FRED live)
    noLive: true,
    name: "Initial Jobless Claims",
    short: "Jobless Claims",
    category: "tenaga-kerja",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "W",
    fred: "ICNSA",
    mode: "level",
    unit: "orang",
    decimals: 0,
    impact: "Medium",
    release: "Setiap Kamis, 08:30 ET",
    about: "Klaim pengangguran awal (per minggu, dirata-rata bulanan).",
    why: "Indikator paling cepat untuk melihat kesehatan pasar tenaga kerja AS.",
    fx: "Klaim naik \u2192 ketakutan perlambatan \u2192 USD cenderung melemah."
  },
  {
    id: "capacity",
    name: "Capacity Utilization",
    short: "Capacity",
    category: "pertumbuhan",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "TCU",
    mode: "level",
    unit: "%",
    decimals: 1,
    impact: "Low",
    release: "Sekitar pertengahan bulan",
    about: "Tingkat penggunaan kapasitas industri (%).",
    why: "Kapasitas terpakai tinggi menandakan tekanan inflasi produksi.",
    fx: "Naik \u2192 ekonomi memanas \u2192 mendukung suku bunga tinggi."
  },
  {
    id: "eu_gdp",
    name: "Euro Area Real GDP",
    short: "EZ GDP",
    category: "pertumbuhan",
    country: "EZ",
    countryName: "Zona Euro",
    freq: "Q",
    fred: "CLVMNACSCAB1GQEA19",
    mode: "yoy_pct",
    unit: "%",
    decimals: 1,
    impact: "High",
    release: "Perkiraan awal tiap kuartal",
    about: "Pertumbuhan ekonomi riil Zona Euro (year-over-year).",
    why: "Pertumbuhan kuat mendukung kebijakan ECB yang lebih ketat.",
    fx: "GDP EZ kuat \u2192 EUR menguat; lemah \u2192 EUR melemah."
  },
  {
    id: "china_cpi",
    name: "China Consumer Price Index",
    short: "China CPI",
    category: "inflasi",
    country: "CN",
    countryName: "Tiongkok",
    freq: "M",
    fred: "CHNCPIALLMINMEI",
    mode: "yoy_pct",
    unit: "%",
    decimals: 1,
    impact: "Medium",
    release: "Sekitar pertengahan bulan",
    about: "Perubahan harga konsumen Tiongkok (YoY).",
    why: "Inflasi China memberi sinyal stimulus kebijakan & permintaan global.",
    fx: "Inflasi tinggi \u2192 stimulus bisa dikurangi \u2192 CNY cenderung menguat."
  },
  {
    id: "ismmfg",
    name: "ISM Manufacturing PMI",
    short: "ISM Mfg",
    category: "pertumbuhan",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "ISMPMI",
    mode: "level",
    unit: "index",
    decimals: 1,
    impact: "High",
    release: "Tanggal 1\u20135 tiap bulan (hari irreguler), 10:00 ET (21:00/22:00 WIB)",
    about: "Indeks komposit sektor manufaktur AS dari survei purchasing managers ISM. >50 = ekspansi, <50 = kontraksi.",
    why: "Puls utama 'pertumbuhan manufaktur' \u2014 menahankan di atas 50 menjaga narasi ekspansi AS.",
    fx: "PMI Mfg di atas konsensus \u2192 ekspektasi Fed hawkish \u2192 USD naik; jauh di bawah 50 \u2192 USD turun.",
    // ditambahkan 30-Agu-2026 (FF user + API earningsapi) → kunci ke seed
    noLive: true
  },
  {
    id: "adp",
    name: "ADP National Employment Report (Private Payrolls)",
    short: "ADP",
    category: "tenaga-kerja",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    mode: "absolute",
    unit: "ribu",
    decimals: 0,
    impact: "High",
    release: "Rabu\u2013Jumat, 2\u20133 hari kerja sebelum NFP, 08:15 ET (18:15/19:15 WIB)",
    about: "Perubahan jumlah tenaga kerja di sektor swasta (survey ADP) \u2014 'pemanasan' sebelum NFP resmi BLS.",
    why: "Proksi arah umum ketenagakerjaan; kejutan ADP sering (tidak selalu) diikuti NFP pekan yang sama.",
    fx: "ADP kuat \u2192 ekspektasi NFP kuat \u2192 USD naik; ADP lemah \u2192 USD turun.",
    // ditambahkan 30-Agu-2026 dari FF window Jun 2026 (A 122K K 118K P 105K) → kunci ke seed
    // ⚠ FF window Sep 2026 tidak menampilkan lagi baris ADP (kemungkinan discontinued)
    noLive: true
  },
  {
    id: "ismsvc",
    name: "ISM Services PMI (Non-Manufacturing)",
    short: "ISM Svc",
    category: "pertumbuhan",
    country: "US",
    countryName: "Amerika Serikat",
    freq: "M",
    fred: "NAPMNOI",
    mode: "level",
    unit: "index",
    decimals: 1,
    impact: "High",
    release: "2\u20133 hari kerja setelah ISM Mfg, 10:00 ET (21:00/22:00 WIB)",
    about: "Indeks komposit sektor jasa AS (\xB180% PDB) dari survei ISM. >50 = ekspansi; indikator leading paling stabil utk ekonomi AS.",
    why: "Karena sektor jasa mendominasi ekonomi, kejutan Services PMI sering lebih menentukan arah USD daripada manufaktur.",
    fx: "Svc kuat + Prices tinggi \u2192 Fed hawkish \u2192 USD naik; Svc melambat \u2192 ekspektasi cut \u2192 USD turun.",
    // ditambahkan 30-Agu-2026 (FF user + API earningsapi) → kunci ke seed
    noLive: true
  }
];
var TOL = {
  nfp: 25,
  unemp: 0.15,
  cpi: 0.15,
  corecpi: 0.1,
  ppi: 0.3,
  corepce: 0.05,
  ahe: 0.1,
  fedfunds: 0.05,
  dgs10: 0.05,
  retail: 0.3,
  umich: 2,
  indpro: 0.1,
  gdp: 0.1,
  eu_cpi: 0.15,
  eu_unemp: 0.15,
  uk_cpi: 0.15,
  uk_unemp: 0.1,
  jp_cpi: 0.2,
  wti: 2,
  brent: 2.5,
  natgas: 0.15,
  copper: 300,
  vix: 1.5,
  claims: 15e3,
  capacity: 0.15,
  eu_gdp: 0.3,
  china_cpi: 0.15,
  ismmfg: 1,
  ismsvc: 1,
  adp: 10
};
var SCALE = {
  nfp: 100,
  unemp: 0.2,
  cpi: 0.5,
  corecpi: 0.4,
  ppi: 2,
  corepce: 0.15,
  ahe: 0.3,
  fedfunds: 0.25,
  dgs10: 0.35,
  retail: 0.5,
  umich: 10,
  indpro: 0.4,
  gdp: 0.5,
  eu_cpi: 0.5,
  eu_unemp: 0.2,
  uk_cpi: 0.5,
  uk_unemp: 0.2,
  jp_cpi: 0.5,
  wti: 8,
  brent: 9,
  natgas: 0.8,
  copper: 1e3,
  vix: 5,
  claims: 3e4,
  capacity: 0.5,
  eu_gdp: 0.8,
  china_cpi: 0.5,
  ismmfg: 2,
  ismsvc: 2.5,
  adp: 50
};
var SERIES = SERIES_RAW.map((s) => ({ ...s, tol: TOL[s.id] ?? 0.5, scale: SCALE[s.id] ?? 1 }));
var CATEGORIES = [
  { id: "inflasi", label: "Inflasi", color: "#f0b429" },
  { id: "tenaga-kerja", label: "Tenaga Kerja", color: "#2dd4bf" },
  { id: "moneter", label: "Moneter", color: "#c084fc" },
  { id: "pertumbuhan", label: "Pertumbuhan", color: "#4ade80" },
  { id: "konsumen", label: "Konsumen", color: "#a78bfa" },
  { id: "pasar", label: "Pasar", color: "#94a3b8" }
];
function getSeries(id) {
  return SERIES.find((s) => s.id === id);
}
var COUNTRIES = [
  { id: "US", name: "Amerika Serikat", flag: "\u{1F1FA}\u{1F1F8}" },
  { id: "EZ", name: "Zona Euro", flag: "\u{1F1EA}\u{1F1FA}" },
  { id: "UK", name: "Inggris", flag: "\u{1F1EC}\u{1F1E7}" },
  { id: "JP", name: "Jepang", flag: "\u{1F1EF}\u{1F1F5}" },
  { id: "CN", name: "Tiongkok", flag: "\u{1F1E8}\u{1F1F3}" },
  { id: "GL", name: "Global", flag: "\u{1F310}" }
];

// lib/fred.js
var BASE = "https://fred.stlouisfed.org/graph/fredgraph.csv";
async function fetchSeriesRaw(id, start = "2007-01-01") {
  const url = `${BASE}?id=${encodeURIComponent(id)}&cosd=${start}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8e3), cache: "no-store" });
  if (!res.ok) throw new Error(`FRED ${id} HTTP ${res.status}`);
  const text = await res.text();
  return parseSeriesCsv(text);
}
function parseSeriesCsv(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const comma = line.lastIndexOf(",");
    if (comma < 0) continue;
    const date = line.slice(0, comma).trim();
    const raw = line.slice(comma + 1).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    const value = raw === "." || raw === "" ? null : parseFloat(raw);
    out.push({ date, value });
  }
  return out;
}
function toMonthKey(date) {
  return date.slice(0, 7);
}
function lookup(values) {
  const map = /* @__PURE__ */ new Map();
  for (const d of values) {
    if (d.value !== null && d.value !== void 0) {
      map.set(toMonthKey(d.date), d.value);
    }
  }
  const days = /* @__PURE__ */ new Map();
  for (const d of values) {
    if (d.value !== null && d.value !== void 0) {
      days.set(d.date, d.value);
    }
  }
  return { map, days };
}
function shiftMonthKey(key, months) {
  const [y, m] = key.split("-").map(Number);
  const total = y * 12 + (m - 1) + months;
  const ny = Math.floor(total / 12);
  const nm = total % 12 + 1;
  return `${ny}-${String(nm).padStart(2, "0")}`;
}
function transformSeries(raw, mode) {
  if (mode === "level") {
    return aggregateMonthly(raw);
  }
  const { map } = lookup(raw);
  const keys = [...map.keys()].sort();
  const out = [];
  for (const key of keys) {
    const base2 = map.get(key);
    if (base2 === null || base2 === void 0) continue;
    if (mode === "monthly_change") {
      const prevKey = shiftMonthKey(key, -1);
      const prev = map.get(prevKey);
      if (prev === void 0) continue;
      out.push({ date: `${key}-01`, value: round(base2 - prev, 2) });
    } else if (mode === "mom_pct") {
      const prevKey = shiftMonthKey(key, -1);
      const prev = map.get(prevKey);
      if (prev === void 0 || prev === 0) continue;
      out.push({ date: `${key}-01`, value: round((base2 - prev) / prev * 100, 2) });
    } else if (mode === "yoy_pct") {
      const prevKey = shiftMonthKey(key, -12);
      const prev = map.get(prevKey);
      if (prev === void 0 || prev === 0) continue;
      out.push({ date: `${key}-01`, value: round((base2 - prev) / prev * 100, 2) });
    }
  }
  return out;
}
function aggregateMonthly(raw) {
  const byMonth = /* @__PURE__ */ new Map();
  for (const d of raw) {
    if (d.value === null || d.value === void 0) continue;
    const key = toMonthKey(d.date);
    if (!byMonth.has(key)) byMonth.set(key, []);
    byMonth.get(key).push(d.value);
  }
  const keys = [...byMonth.keys()].sort();
  return keys.map((k) => ({ date: `${k}-01`, value: round(avg(byMonth.get(k)), 2) }));
}
function avg(arr) {
  if (!arr.length) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function round(n, d = 2) {
  if (n === null || n === void 0 || isNaN(n)) return n;
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}
function latestPoints(points, n = 12) {
  const valid = points.filter((p) => p.value !== null && p.value !== void 0);
  return valid.slice(-n);
}
function lastValue(points) {
  const valid = points.filter((p) => p.value !== null && p.value !== void 0);
  return valid.length ? valid[valid.length - 1] : null;
}

// lib/cache.js
var store = /* @__PURE__ */ new Map();
var inflight = /* @__PURE__ */ new Map();
async function cached(key, ttlMs, compute) {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < ttlMs) {
    return hit.data;
  }
  if (inflight.has(key)) return inflight.get(key);
  const p = compute().then(
    (data) => {
      store.set(key, { at: Date.now(), data });
      inflight.delete(key);
      return data;
    },
    (e) => {
      inflight.delete(key);
      throw e;
    }
  );
  inflight.set(key, p);
  return p;
}
cached.force = function force(key, data) {
  store.set(key, { at: Date.now(), data });
  return data;
};

// lib/data.js
var LIVE = true;
var LIVE_TTL = 6 * 60 * 60 * 1e3;
var FAIL_TTL = 5 * 60 * 1e3;
var fails = /* @__PURE__ */ new Map();
function recentFail(id) {
  const at = fails.get(id);
  return at !== void 0 && Date.now() - at < FAIL_TTL;
}
function markFail(id) {
  fails.set(id, Date.now());
}
function startForFreq(freq) {
  if (freq === "Q") return "1990-01-01";
  return "2013-01-01";
}
async function getSeriesData(id) {
  const def = getSeries(id);
  if (!def) return null;
  if (LIVE && !def.noLive && !recentFail(id)) {
    const live = await cached(`fred:${id}`, LIVE_TTL, async () => {
      const raw = await fetchSeriesRaw(def.fred, startForFreq(def.freq));
      const transformed = transformSeries(raw, def.mode);
      const points = latestPoints(transformed, 132);
      const last = lastValue(transformed);
      if (points.length) return { ...def, points, last, source: "live", updated: (/* @__PURE__ */ new Date()).toISOString() };
      throw new Error("no data");
    }).catch((e) => {
      markFail(id);
      return null;
    });
    if (live) return live;
  }
  const entry = seed_default.series[id];
  if (entry) {
    return { ...def, points: entry.points, last: entry.last, source: "seed", updated: entry.updated };
  }
  return null;
}
var SEED_META = {
  source: seed_default.source,
  generated: seed_default.generated
};

// lib/provider.js
var FF_URL = "https://cdn-nfs.faireconomy.media/ff_calendar_thisweek.json";
var TTL = 60 * 60 * 1e3;
var NEG_TTL = 10 * 60 * 1e3;
var lastFail = 0;
var COUNTRY_MAP = {
  USD: "US",
  EUR: "EZ",
  GBP: "UK",
  JPY: "JP",
  CNY: "CN",
  AUD: "AU",
  CAD: "CA",
  CHF: "CH",
  NZD: "NZ"
};
var TITLE_MAP = [
  { title: "non-farm employment change", id: "nfp" },
  { title: "unemployment rate", id: "unemp" },
  { title: "cpi y/y", id: "cpi", allow: ["US"] },
  { title: "cpi m/m", id: "cpi", allow: ["US"] },
  { title: "core cpi y/y", id: "corecpi", allow: ["US"] },
  { title: "core cpi m/m", id: "corecpi", allow: ["US"] },
  { title: "ppi y/y", id: "ppi", allow: ["US"] },
  { title: "ppi m/m", id: "ppi", allow: ["US"] },
  { title: "average hourly earnings y/y", id: "ahe", allow: ["US"] },
  { title: "federal funds rate", id: "fedfunds", allow: ["US"] },
  { title: "retail sales m/m", id: "retail", allow: ["US"] },
  { title: "core pce price index", id: "corepce", allow: ["US"] },
  { title: "adp non-farm employment", id: "adp", allow: ["US"] },
  { title: "advance gdp", id: "gdp", allow: ["US"] },
  { title: "gdp q/q", id: "gdp", allow: ["US"] },
  { title: "initial jobless claims", id: "claims", allow: ["US"] },
  { title: "industrial production m/m", id: "indpro", allow: ["US"] },
  { title: "capacity utilization rate", id: "capacity", allow: ["US"] },
  { title: "michigan consumer sentiment", id: "umich", allow: ["US"] },
  { title: "ism manufacturing pmi", id: "ismmfg", allow: ["US"] },
  { title: "ism services pmi", id: "ismsvc", allow: ["US"] },
  { title: "ism non-manufacturing pmi", id: "ismsvc", allow: ["US"] },
  { title: "eurozone cpi y/y", id: "eu_cpi", allow: ["EZ"] },
  { title: "eurozone unemployment rate", id: "eu_unemp", allow: ["EZ"] },
  { title: "eurozone gdp", id: "eu_gdp", allow: ["EZ"] },
  { title: "uk cpi y/y", id: "uk_cpi", allow: ["UK"] },
  { title: "uk unemployment rate", id: "uk_unemp", allow: ["UK"] },
  { title: "japan cpi y/y", id: "jp_cpi", allow: ["JP"] },
  { title: "china cpi y/y", id: "china_cpi", allow: ["CN"] }
];
async function fetchLiveConsensus() {
  if (Date.now() - lastFail < NEG_TTL) {
    throw new Error("Penyedia belum tersedia (cooldown)");
  }
  return cached("ff:calendar", TTL, async () => {
    const res = await fetch(FF_URL, { signal: AbortSignal.timeout(6e3), cache: "no-store" });
    if (!res.ok) throw new Error(`ForexFactory HTTP ${res.status}`);
    const raw = await res.json();
    if (!Array.isArray(raw)) throw new Error("ForexFactory: format tak terduga");
    return raw.map(normalizeEvent).filter(Boolean);
  }).catch((e) => {
    lastFail = Date.now();
    throw e;
  });
}
function normalizeEvent(e) {
  const country = COUNTRY_MAP[e.country] || null;
  const titleNorm = String(e.title || "").toLowerCase().trim();
  const matched = TITLE_MAP.find((r) => {
    if (titleNorm !== r.title) return false;
    if (r.allow && country && !r.allow.includes(country)) return false;
    return true;
  });
  if (!matched) return null;
  return {
    indicatorId: matched.id,
    title: e.title,
    date: e.date,
    country,
    impact: normalizeImpact(e.impact),
    actual: parseVal(e.actual),
    forecast: parseVal(e.forecast),
    previous: parseVal(e.previous),
    unit: e.unit
  };
}
function normalizeImpact(imp) {
  const s = String(imp || "").toLowerCase();
  if (s.includes("high")) return "High";
  if (s.includes("medium") || s.includes("mid")) return "Medium";
  return "Low";
}
function parseVal(v) {
  if (v === null || v === void 0) return null;
  const s = String(v).trim().toLowerCase();
  if (!s || s === "none" || s === "n/a" || s === "-") return null;
  const num = parseFloat(s.replace(/[^0-9.-]/g, ""));
  return isNaN(num) ? null : num;
}

// lib/consensus.js
async function getReleaseAnalytics(id) {
  const series = await getSeriesData(id);
  if (!series) return null;
  const points = series.points || [];
  const idxByDate = /* @__PURE__ */ new Map();
  points.forEach((p, i) => idxByDate.set(p.date, i));
  const releases = [];
  for (const e of CONSENSUS[id] || []) {
    const obs = e.obs || e.date;
    const i = idxByDate.get(obs);
    if (i === void 0) continue;
    const actual = points[i]?.value ?? null;
    const previous = i > 0 ? points[i - 1]?.value ?? null : null;
    const consensus = e.consensus;
    const surprise = actual !== null && consensus != null ? round2(actual - consensus, 2) : null;
    const surprisePct = surprise !== null && consensus ? round2(surprise / Math.abs(consensus) * 100, 2) : null;
    const surpriseIdx = surprise !== null && series.scale ? round2(surprise / series.scale * 100, 1) : null;
    releases.push({ date: e.date, obsDate: obs, consensus, previous, actual, surprise, surprisePct, surpriseIdx, source: "local" });
  }
  let source = "local";
  try {
    const live = await fetchLiveConsensus();
    const ev = live.find((e) => e.indicatorId === id);
    const lastDate = releases.length ? releases[releases.length - 1].date : null;
    if (ev && ev.date && (!lastDate || ev.date.slice(0, 10) > lastDate)) {
      const surprise = ev.actual !== null && ev.forecast !== null ? round2(ev.actual - ev.forecast, 2) : null;
      const surprisePct = surprise !== null && ev.forecast ? round2(surprise / Math.abs(ev.forecast) * 100, 2) : null;
      releases.push({
        date: ev.date.slice(0, 10),
        consensus: ev.forecast,
        previous: ev.previous,
        actual: ev.actual,
        surprise,
        surprisePct,
        surpriseIdx: surprise !== null && series.scale ? round2(surprise / series.scale * 100, 1) : null,
        source: "live"
      });
      source = "live";
    }
  } catch {
  }
  releases.sort((a, b) => a.date.localeCompare(b.date));
  const accuracy = computeAccuracy(releases, series.tol);
  return { ...series, releases, accuracy, source };
}
function computeAccuracy(releases, tol = 0.5) {
  const valid = releases.filter((r) => r.actual != null && r.consensus != null);
  const empty = {
    samples: 0,
    hitRate: null,
    avgPct: null,
    bias: null,
    dirAcc: null,
    beats: 0,
    misses: 0,
    inlines: 0,
    beatRate: null,
    maxSurprise: null,
    maxSurpriseDate: null,
    streak: null,
    tol
  };
  if (!valid.length) return empty;
  const hit = valid.filter((r) => Math.abs(r.surprise) <= tol).length;
  const hitRate = round2(hit / valid.length * 100, 1);
  const beats = valid.filter((r) => r.surprise > tol).length;
  const misses = valid.filter((r) => r.surprise < -tol).length;
  const inlines = valid.length - beats - misses;
  const beatRate = round2(beats / valid.length * 100, 1);
  const pcts = valid.filter((r) => r.surpriseIdx != null);
  const avgPct = pcts.length ? round2(avg2(pcts.map((r) => Math.abs(r.surpriseIdx))), 1) : null;
  const biasAbs = valid.length ? round2(avg2(valid.map((r) => r.surprise)), 2) : null;
  let matched = 0, dirTotal = 0;
  for (const r of valid) {
    if (r.previous == null) continue;
    const actualDir = Math.sign(r.actual - r.previous);
    if (actualDir === 0) continue;
    const consensusDir = Math.sign(r.consensus - r.previous);
    if (consensusDir === 0) continue;
    dirTotal++;
    if (actualDir === consensusDir) matched++;
  }
  const dirAcc = dirTotal ? round2(matched / dirTotal * 100, 1) : null;
  let maxSurprise = null, maxSurpriseDate = null;
  for (const r of valid) {
    if (maxSurprise === null || Math.abs(r.surprise) > Math.abs(maxSurprise)) {
      maxSurprise = r.surprise;
      maxSurpriseDate = r.date;
    }
  }
  let streak = null;
  const last = valid[valid.length - 1];
  const sgn = Math.sign(last.surprise);
  if (sgn !== 0) {
    let n = 1;
    for (let i = valid.length - 2; i >= 0; i--) {
      if (Math.sign(valid[i].surprise) === sgn) n++;
      else break;
    }
    streak = { n, kind: sgn > 0 ? "BEAT" : "MISS" };
  }
  return { samples: valid.length, hitRate, avgPct, bias: biasAbs, dirAcc, beats, misses, inlines, beatRate, maxSurprise, maxSurpriseDate, streak, tol };
}
function avg2(arr) {
  if (!arr.length) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function round2(n, d = 2) {
  if (n === null || n === void 0 || isNaN(n)) return n;
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}

// lib/education.js
var GENERAL = {
  title: "Cara Membaca Data Ekonomi untuk Trading Forex",
  intro: "Data makro adalah 'laporan kesehatan' sebuah ekonomi. Pasar forex bereaksi bukan pada angka itu sendiri, melainkan pada selisih antara angka aktual dengan yang diprediksi analis (konsensus). Semakin besar selisihnya (surprise), semakin besar pula pergerakan harga.",
  points: [
    "Consensus = perkiraan analis sebelum rilis. Jika tidak ada, pasar menjadikan nilai sebelumnya (Previous) sebagai acuan.",
    "Actual = angka yang benar-benar dirilis, biasanya pada jam yang sudah terjadwal.",
    "Surprise = Actual \u2212 Consensus. Positif berarti data lebih baik dari dugaan; negatif berarti lebih buruk.",
    "Yang menggerakkan harga adalah PERUBAHAN ekspektasi. Data bagus tapi di bawah ekspektasi tetap bisa membuat mata uang turun.",
    "Perhatikan juga revisi data sebelumnya dan rilis lanjutan (mis. Core CPI) karena sering kali lebih penting.",
    "Fokus pada dampak: High/Medium/Low, dan pada jam rilis (biasanya 13:30 atau 19:30 WIB)."
  ],
  tips: [
    "Jangan trading 5 menit pertama saat rilis High impact \u2014 spread & lonjakan volatilitas ekstrem.",
    "Bandingkan indikator satu negara dengan negara lawan pair (mis. EURUSD: data AS vs data Euro).",
    "Kombinasikan dengan arah tren & sentimen pasar, jangan hanya satu data."
  ],
  expertNote: "Berikut perspektif dari berbagai 'desk' analis global (pandangan ilustratif untuk pembelajaran). Setiap desk memiliki cara baca berbeda \u2014 bandingkan untuk membentuk gambaran menyeluruh."
};
var SRC = {
  blsJobs: { label: "BLS \u2014 Employment Situation (resmi)", url: "https://www.bls.gov/employment-situation/" },
  adp: { label: "ADP Research \u2014 National Employment (resmi)", url: "https://adpemploymentreport.com/" },
  blsCpi: { label: "BLS \u2014 Consumer Price Index (resmi)", url: "https://www.bls.gov/cpi/" },
  blsPpi: { label: "BLS \u2014 Producer Price Index (resmi)", url: "https://www.bls.gov/ppi/" },
  blsClaims: { label: "BLS \u2014 Jobless Claims (resmi)", url: "https://www.bls.gov/web/ews/ews.pdf" },
  beaPce: { label: "BEA \u2014 Personal Consumption Expenditures (resmi)", url: "https://www.bea.gov/data/personal-consumption-expenditures" },
  beaGdp: { label: "BEA \u2014 GDP (resmi)", url: "https://www.bea.gov/data/gdp/gross-domestic-product" },
  fed: { label: "The Fed \u2014 FOMC (resmi)", url: "https://www.federalreserve.gov/monetarypolicy/openmarket.htm" },
  fedG17: { label: "The Fed \u2014 G.17 Industrial Production (resmi)", url: "https://www.federalreserve.gov/releases/g17/" },
  treasury: { label: "U.S. Treasury \u2014 Interest Rates (resmi)", url: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates" },
  fred: { label: "FRED \u2014 St. Louis Fed (resmi)", url: "https://fred.stlouisfed.org/" },
  census: { label: "U.S. Census Bureau \u2014 Retail (resmi)", url: "https://www.census.gov/retail/index.html" },
  umich: { label: "University of Michigan \u2014 Sentiment (resmi)", url: "https://www.sca.isr.umich.edu/sentiment/" },
  ism: { label: "ISM \u2014 PMI Manufaktur & Jasa (resmi)", url: "https://www.ismworld.org/supply-management-news-events/reports-studies/mmi/" },
  eurostat: { label: "Eurostat \u2014 Labour & HICP (resmi)", url: "https://ec.europa.eu/eurostat/web/products-euro-indicators/overview-1" },
  ecb: { label: "ECB \u2014 Keputuan & Proyeksi (resmi)", url: "https://www.ecb.europa.eu/press/prt/html/index.en.html" },
  onsCpi: { label: "ONS UK \u2014 CPI (resmi)", url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandunemployment/bulletins/consumerpriceinflation/latest" },
  onsJobs: { label: "ONS UK \u2014 Labour Market (resmi)", url: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/employmentandunemployment/bulletins/uklabourmarket/latest" },
  mofJp: { label: "Jepang \u2014 Kabinet Keuangan/MOF (resmi)", url: "https://www.mof.go.jp/mofj/en/index.htm" },
  nbsCn: { label: "NBS Tiongkok \u2014 CPI (resmi)", url: "https://www.stats.gov.cn/english/" },
  eiaOil: { label: "EIA \u2014 Petroleum (resmi)", url: "https://www.eia.gov/petroleum/" },
  eiaGas: { label: "EIA \u2014 Natural Gas (resmi)", url: "https://www.eia.gov/naturalgas/" },
  lmeCopper: { label: "LME \u2014 Copper (resmi)", url: "https://www.lme.com/market-data/metals/non-ferrous/copper" },
  cboeVix: { label: "CBOE \u2014 VIX (resmi)", url: "https://www.cboe.com/tradable_products/vix/" }
};
var EDUCATION = {
  nfp: {
    read: [
      "Nonfarm Payrolls = jumlah lapangan kerja baru per bulan (di luar sektor pertanian).",
      "Baca perubahannya dalam ribuan, bandingkan dengan konsensus \u2014 bukan angkanya saja.",
      "Dirilis awal bulan (hari IRREGULER \u2014 Rabu s/d Jumat, selalu cek jadwal), 08:30 ET (19:30/20:30 WIB).",
      "Selalu baca tiga angka sekaligus: NFP, Unemployment Rate, dan Average Hourly Earnings (AHE).",
      "Perhatikan revisi 2 bulan sebelumnya \u2014 sering lebih penting daripada headline."
    ],
    forecast: {
      next: "Kamis, 4 Sep 2026 \xB7 19:30 WIB (hari rilis irreguler \u2014 sudah verified di kalender)",
      obs: "Agustus 2026 (data bulan sebelumnya)",
      prev: "\u221223 ribu (Jul; dirilis 7 Agu)",
      con: "+58 ribu (konsensus)",
      range: "Base 0 \u2013 120 ribu \xB7 fokus pasar 30\u201370 ribu",
      basis: "Syok Juli (\u221223 ribu vs K +85 ribu; sektor pemerintah \u221253 ribu) sudah ter-harga, dan konsensus Agustus memproyeksikan rebound ke +58 ribu. Base case: pemulihan moderat 30\u201370 ribu \u2014 pasar kerja masih 'low-hire, low-fire' (partisipasi 61,4%, terendah ~5,5 tahun). Jika \u2265100 ribu = syok pemerintah sekali jalan; jika \u22640 = narasi 'retak' berlanjut. Skenario revisi Juli (\u221223 ribu) juga masih terbuka \u2014 tren revisi 2026 ke bawah (Jun 57\u219220, Mei 172\u2192129).",
      scenarios: [
        { label: "\u2265 100 ribu", effect: "Rebound terkonfirmasi \u2192 bias hawkish Fed kembali \u2192 USD naik, yield naik, emas turun.", dir: "up", cur: "USD" },
        { label: "30\u201370 ribu (base)", effect: "'Mendingin tapi bertahan' \u2192 pasar fokus ke AHE & revisi \u2192 USD sideways.", dir: "flat", cur: "USD" },
        { label: "\u2264 0 ribu", effect: "Syok berlanjut \u2192 fear resesi memuncak \u2192 ekspektasi cut melonjak \u2192 USD turun, emas naik.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Permintaan tenaga kerja (hiring)", detail: "Indikasi seberapa kuat bisnis menambah karyawan. Pertambahan besar = ekonomi tumbuh, mendukung USD. Penambahan kecil/mundur = perlambatan. Pola 'low-hire, low-fire' (hiring rendah tapi PHK juga rendah) berarti pasar kerja stabil tapi tidak panas.", data: "Juli 2026: \u221223 ribu (konsensus +85 ribu) \u2014 kejutan negatif besar; Juni direvisi turun dari 57 ke 20 ribu (diterbitkan 7 Agu). Rantai revisi: Des 50\u219248, Jan 130\u2192126, Feb \u221292\u2192\u2212133, Apr 115\u21922 (1.99K), Mei 172\u2192129, Jun 57\u219220.", src: SRC.blsJobs },
      { name: "Kontribusi sektor (pemerintah, jasa, konstruksi)", detail: "Terpecah per sektor. Sektor jasa (mall, restoran, kesehatan) besar dan sensitif konsumsi; sektor pemerintah bisa berubah drastis (pemotongan/pemindahan jadwal rekrutmen) sehingga memicu revisi.", data: "Juli 2026: Pemerintah \u221253 ribu (terbesar, sebagian kemungkinan revisi musiman), Leisure & Hospitality \u221240 ribu; Construction & Private Education/Health terbesar penambahnya.", src: SRC.blsJobs },
      { name: "Revisi bulan sebelumnya", detail: "Angka dua bulan lalu sering direvisi setelah survei diperluas. Revisi besar ke bawah melemahkan narasi pasar kerja meski headline bulan berjalan terlihat baik.", data: "Juni 2026 direvisi turun 57 \u2192 20 ribu (rilis 7 Agu); Mei 172\u2192129; April 115\u21922 ribu (1.99K) \u2014 revisi terbesar; Feb \u221292\u2192\u2212133 (rilis 6 Mar: \u221292 ribu, K 58 ribu, P 126 ribu); Jan 130\u2192126; Des 50\u219248. 28 Agu: revisi benchmark tahunan BLS \u221279 ribu (2025: \u2212911 ribu) \u2014 level payroll terus direvisi ke bawah.", src: SRC.blsJobs },
      { name: "Tingkat partisipasi angkatan kerja", detail: "Unemployment bisa turun bukan karena makin banyak yang bekerja, tapi karena orang keluar dari angkatan kerja. Partisipasi rendah + unemp 'turun' = sinyal lebih lemah daripada yang terlihat.", data: "Partisipasi Juli 2026: 61,4% \u2014 dekat level terendah ~5,5 tahun (264 ribu orang keluar angkatan kerja).", src: SRC.blsJobs },
      { name: "Siklus ekonomi & suku bunga", detail: "Suku bunga tinggi menekan biaya pinjaman bisnis \u2192 hiring melambat. Dengan The Fed di 3,50\u20133,75% dan wacana kenaikan kembali, biaya kredit tetap menjadi rem utama ekspansi ketenagakerjaan.", data: "Fed Funds 3,50\u20133,75% sejak Des 2025; Ketua The Fed Kevin Warsh (sejak Mei 2026) menegaskan inflasi 'belum melambat cukup'.", src: SRC.fed }
    ],
    expertViews: [
      { desk: "FX Strategist (London)", view: "NFP adalah 'pengguncang utama' dolar. Fokus pada headline tapi yang lebih penting adalah bagian upah (AHE) \u2014 karena itu yang menentukan jalur suku bunga The Fed berikutnya.", signal: "USD kuat jika NFP > konsensus DAN AHE naik." },
      { desk: "Head of Global Macro (New York)", view: "Pasar kerja yang terlalu panas justru jadi masalah: The Fed harus mempertahankan suku bunga tinggi lebih lama. Ingin melihat 'goldilocks' \u2014 cukup besar, tidak terlalu panas.", signal: "NFP besar + AHE sedang = risk-on." },
      { desk: "Quant / Options Desk", view: "Rilis NFP biasanya memicu lonjakan volatilitas (implied vol naik dulu). Implied move bisa 30\u201360 pips pada EURUSD saat rilis.", signal: "Vol spiking; hindari straddle murah." },
      { desk: "Emerging Markets Macro", view: "NFP kuat = dolar menguat = tekanan pada mata uang berkembang & emas. Pasar forex berkembang sangat sensitif terhadap arah NFP.", signal: "NFP kuat = emas & USD/EM down." }
    ],
    outlook: "Gambaran per Agustus 2026: pasar kerja AS sedang 'mendingin tapi belum retak' \u2014 NFP Juli negatif (\u221223 ribu) dengan revisi besar ke bawah, sementara pengangguran justru turun ke 4,1% karena partisipasi merosot ke 61,4%. Selama inflasi masih di 3,4% (di atas target 2%), The Fed terjepit: data kerja lemah mengurangi tekanan menaikkan bunga di rapat September 2026, tetapi CPI yang panas bisa membatalkan efeknya. Ekspektasi konsensus pasar kini condong ke 'the Fed on hold dengan ekor hawkish' \u2014 artinya USD cenderung tetap terdukung, tetapi risiko downside (jika unemp melonjak di atas ~4,5% seperti perkiraan Citi) akan memicu ekspektasi pemangkasan cepat dan tekanan jual USD di paruh kedua 2026.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Pasar kerja lebih kuat \u2192 ekspektasi Fed hawkish bertahan \u2192 USD naik tajam, emas tertekan.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Reaksi terbatas; pasar fokus ke komponen AHE & revisi bulan lalu.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Risiko resesi naik \u2192 ekspektasi pemangkasan The Fed menguat \u2192 USD turun, aset aman naik.", dir: "down", cur: "USD" }
    ],
    watch: ["Average Hourly Earnings", "Unemployment Rate", "Partisipasi angkatan kerja", "Keputusan FOMC September 2026"]
  },
  unemp: {
    read: [
      "Persentase angkatan kerja yang menganggur (ukuran U-3).",
      "Dirilis bersamaan dengan NFP (awal bulan; hari irreguler \u2014 cek jadwal).",
      "Turun = pasar kerja ketat; naik = melonggar \u2014 tapi cek partisipasi dulu.",
      "Pergerakan 0,1 poin saja bisa berarti ratusan ribu orang; baca arah 3\u20136 bulan."
    ],
    forecast: {
      next: "Kamis, 4 Sep 2026 \xB7 19:30 WIB (bersamaan dengan NFP)",
      obs: "Agustus 2026",
      prev: "4,1% (Jul)",
      con: "4,1% (konsensus)",
      range: "4,0 \u2013 4,2%",
      basis: "4,1% Juli turun karena partisipasi anjlok (61,4%), bukan karena hiring membaik \u2014 'aman tapi rapuh strukturnya'. Base case Agustus: stabil 4,1%. Naik ke 4,2%+ (terutama jika NFP \u2264\u2212150 ribu) = sinyal 'retak' pertama yang jelas sejak syok Juli; 4,0% = partisipasi pulih (positif).",
      scenarios: [
        { label: "4,2%+", effect: "Pasar kerja melonggar \u2192 ekspektasi cut menguat \u2192 USD turun.", dir: "down", cur: "USD" },
        { label: "4,1% (base)", effect: "Netral \u2014 fokus tetap di headline NFP & AHE.", dir: "flat", cur: "USD" },
        { label: "4,0%", effect: "Pasar kerja mengetat \u2192 Fed tahan ketat \u2192 USD naik.", dir: "up", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Kesehatan pasar tenaga kerja", detail: "Tingkat pengangguran rendah menandakan bisnis kekurangan pekerja \u2014 menciptakan tekanan pada upah & inflasi, dan memberi The Fed alasan menahan suku bunga tinggi.", data: "Juli 2026: 4,1% (Juni 4,2%; konsensus 4,2%) \u2014 turun, namun karena 264 ribu orang keluar angkatan kerja, bukan karena hiring membaik.", src: SRC.blsJobs },
      { name: "Kebijakan moneter The Fed", detail: "The Fed memegang 'dual mandate' \u2014 inflasi & lapangan kerja. Pengangguran adalah penentu langsung jalur suku bunga: tinggi \u2192 ruang memotong; sangat rendah + inflasi tinggi \u2192 risiko menaikkan.", data: "Konsensus pasar: The Fed 'on hold' di 3,50\u20133,75% dengan risiko dua arah; Citi memproyeksikan unemp menembus 4,5% dalam beberapa bulan \u2192 kembali membuka wacana cut.", src: SRC.fed },
      { name: "Partisipasi angkatan kerja", detail: "Pengangguran turun bisa karena orang berhenti mencari kerja (keluar angkatan kerja), bukan karena mendapat pekerjaan. Selalu baca berpasangan.", data: "Partisipasi 61,4% (Juli 2026) \u2014 dekat level terendah sekitar 5,5 tahun.", src: SRC.blsJobs },
      { name: "Siklus bisnis", detail: "Fase ekspansi menurunkan pengangguran; resesi menaikannya. Data ini indikator lagging (terlambat) \u2014 biasanya baru naik setelah resesi berjalan beberapa bulan.", src: SRC.fred }
    ],
    expertViews: [
      { desk: "Riset Makro (Frankfurt)", view: "Pengangguran rendah tapi inflasi juga turun = kondisi ideal bank sentral mulai melonggarkan. Kombinasi inilah yang dicari pasar.", signal: "Unemp rendah + CPI turun = dovish-friendly." },
      { desk: "Bank Strategist (Tokyo)", view: "Untuk USD semua bergantung pada relasi dengan inflasi. Pengangguran yang terlalu rendah justru berisiko memicu inflasi upah dan membuat The Fed hawkish.", signal: "Waspadai unemp terlalu rendah." },
      { desk: "Economist \u2013 Fixed Income", view: "Kurva imbal hasil bergerak berdasarkan ekspektasi suku bunga yang dipengaruhi pengangguran. Pengangguran naik = obligasi diborong (yield turun).", signal: "Unemp naik = bonds rally." }
    ],
    outlook: "Per Agustus 2026, pengangguran AS 4,1% terlihat 'aman', tetapi strukturnya rapuh: penurunan terjadi di tengah partisipasi yang mendekati level terendah 5,5 tahun (61,4%), artinya banyak yang keluar dari angkatan kerja. Jika tren 'low-hire, low-fire' berlanjut dan partisipasi pulih, unemp berisiko naik cepat \u2014 Citi bahkan memperkirakan menembus 4,5% dalam beberapa bulan, yang akan menggeser pasar ke mode 'the Fed harus memotong'. Sebaliknya, selama unemp bertahan di bawah 4,5% dengan inflasi 3,4% yang masih lengket, The Fed (di bawah Ketua Kevin Warsh) cenderung tetap was-was hawkish. Arah USD: terdukung selama unemp stabil; rawan koreksi signifikan jika dua rilis berturut-turut di atas ekspektasi.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Pasar kerja melemah \u2192 ekspektasi pemangkasan Fed menguat \u2192 USD turun.", dir: "down", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral; pasar beralih ke data inflasi bulan yang sama.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Pasar kerja ketat \u2192 The Fed bisa tetap ketat/menaikkan \u2192 USD naik.", dir: "up", cur: "USD" }
    ],
    watch: ["Jobless Claims mingguan", "Partisipasi angkatan kerja", "Keputusan FOMC", "Laju inflasi (CPI)"]
  },
  cpi: {
    read: [
      "Perubahan harga barang & jasa yang dibeli konsumen, dibanding setahun lalu (YoY).",
      "Indikator inflasi utama yang menjadi target The Fed (2%).",
      "Perhatikan juga Core CPI yang menghapus makanan & energi \u2014 itu yang dibaca The Fed.",
      "Bandingkan actual vs konsensus vs previous; lihat juga komponen energi & shelter."
    ],
    forecast: {
      next: "Jumat, 11 Sep 2026 \xB7 19:30 WIB",
      obs: "Agustus 2026 (y/y)",
      prev: "3,4% (Jul)",
      con: "\xB13,2% (estimasi pasar)",
      range: "3,0 \u2013 3,5% headline \xB7 core 2,3 \u2013 2,6%",
      basis: "Juli 3,4% masih panas (energi 14,7%). Headline Agustus diproyeksikan melandai ke ~3,2% seiring guncangan minyak memudar \u2014 TAPI yang menentukan adalah core: core \u22642,4% = tren disinflasi berlanjut (dovish); core \u22652,6% (jasa/upah memanas) = narasi 'higher for longer' hidup lagi \u2014 katalis USD terbesar bulan ini. Pantau komponen shelter & energi.",
      scenarios: [
        { label: "Headline \u22653,5% / core \u22652,6%", effect: "Inflasi lengket \u2192 Fed hawkish \u2192 USD & yield naik, emas turun.", dir: "up", cur: "USD" },
        { label: "3,1 \u2013 3,3% (base)", effect: "Tren berlanjut \u2192 reaksi terbatas; pasar baca core & shelter.", dir: "flat", cur: "USD" },
        { label: "Headline \u22643,0% / core \u22642,4%", effect: "Disinflasi dipercepat \u2192 ruang cut meluas \u2192 USD turun.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Harga energi & pangan", detail: "Bensin & bahan pangan sangat volatil dan mendominasi headline CPI. Lonjakan harga minyak (mis. konflik di Timur Tengah) bisa menaikkan inflasi beberapa titik dalam 2\u20133 bulan, lalu mereda kembali.", data: "Juli 2026: CPI 3,4% YoY (Juni 3,5%) \u2014 melandai; inflasi energi 14,7% masih menjadi beban utama. Rantai YoY verified: Nov 2,7; Des 2,7; Jan 2,4; Feb 2,4; Mar 3,3; Apr 3,8; Mei 4,2 (puncak guncangan energi); Jun 3,5; Jul 3,4.", src: SRC.blsCpi },
      { name: "Biaya produksi (PPI) & rantai pasok", detail: "Kenaikan harga produsen biasanya terbawa ke harga konsumen beberapa bulan kemudian. PPI adalah 'cermin depan' CPI.", data: "PPI Juli 2026: 4,7% YoY (turun dari 5,5% di Juni) \u2014 sinyal tekanan produksi mereda.", src: SRC.blsPpi },
      { name: "Kenaikan upah (AHE)", detail: "Upah yang naik mendorong daya beli dan biaya tenaga kerja \u2014 sumber inflasi berkelanjutan (khususnya inflasi jasa/shelter).", data: "Upah rata-rata per jam dipantau dalam rilis Employment Situation bulanan (BLS).", src: SRC.blsJobs },
      { name: "Permintaan konsumen & dolar", detail: "Belanja yang kuat mendorong produsen menaikkan harga. Dolar yang lemah membuat barang impor lebih mahal, menaikkan inflasi secara langsung.", src: SRC.blsCpi }
    ],
    expertViews: [
      { desk: "Head of Inflation Research (London)", view: "Headline CPI sering 'dimanipulasi' oleh energi. Analis serius lebih mengandalkan Core CPI untuk membaca tren sebenarnya.", signal: "Fokus ke Core, bukan headline." },
      { desk: "FX Desk (New York)", view: "CPI tinggi = The Fed hawkish = USD bullish, terutama terhadap JPY & EUR. Ini rilis paling dolar-sensitif selain NFP.", signal: "CPI > ekspektasi = USD up." },
      { desk: "Rates Strategist", view: "Yield obligasi bergerak mendahului CPI karena pasar sudah 'memprediksi'. Jika CPI selaras, reaksi kecil; jika meleset, reaksi besar.", signal: "Implied move sudah dipricingin." },
      { desk: "EM Strategist", view: "Inflasi AS yang tinggi menekan aset berisiko & emas, mendukung dolar. EM biasa merasakan tekanan saat inflasi AS memanas.", signal: "CPI tinggi = EM & gold pressure." }
    ],
    outlook: "Inflasi AS per Juli 2026 berada di 3,4% (headline) dan 2,5% (core) \u2014 turun berturut-turut namun masih jauh di atas target 2%. Efek guncangan energi dari konflik Timur Tengah perlahan memudar, sehingga tren headline diperkirakan lanjut melandai menuju ~3,0% pada paruh kedua 2026. Inti pertanyaannya adalah core: selama core turun konsisten (2,5% dan turun), pasar akan kembali memperkirakan pemangkasan The Fed di 2027, meski The Fed (Ketua Warsh) menegaskan 2% adalah 'commitment'. Risiko upside: jika core kembali naik ke atas 2,7% (mis. upah atau sewa memanas), ekspektasi balik ke 'higher for longer' bahkan kenaikan. Implikasi USD: tren inflasi turun = perlahan bearish USD; kejutan naik = spike hawkish.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Inflasi lebih lengket \u2192 The Fed hawkish \u2192 USD & yield naik, emas turun.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Reaksi kecil; pasar fokus ke komponen core & shelter.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Inflasi melandai \u2192 ruang pelonggaran meluas \u2192 USD turun.", dir: "down", cur: "USD" }
    ],
    watch: ["Core CPI", "PPI", "Jadwal FOMC", "Harga minyak (WTI/Brent)"]
  },
  corecpi: {
    read: [
      "CPI tanpa makanan & energi \u2014 lebih stabil dan jadi acuan kebijakan.",
      "Dipelototi lebih serius daripada headline CPI oleh The Fed & pasar.",
      "Komponen terbesar: shelter (sewa & perumahan) dan jasa.",
      "Tren 3\u20136 bulan lebih penting daripada satu bulan (karakternya 'lengket')."
    ],
    forecast: {
      next: "Jumat, 11 Sep 2026 \xB7 19:30 WIB (rilis yang sama dengan CPI)",
      obs: "Agustus 2026 (y/y)",
      prev: "2,5% (Jul \u2014 terendah 5 bulan)",
      con: "\xB12,4% (estimasi pasar)",
      range: "2,3 \u2013 2,6%",
      basis: "Core turun 5 bulan beruntun (rantai verified: Mar 2,6 \u2192 Apr 2,8 \u2192 Mei 2,9 \u2192 Jun 2,6 \u2192 Jul 2,5); shelter mendingin ke 3,2%. Base case Agustus: lanjut melandai ke 2,3\u20132,4% \u2014 jalur ini membuat pasar mulai price pemangkasan Fed 2027 (USD perlahan tertekan). Jika menembus \u22652,6% (inflasi jasa atau upah) = tren disinflasi PUTUS \u2192 spike USD immediate.",
      scenarios: [
        { label: "\u2265 2,6%", effect: "Inflasi inti lengket \u2192 cut tertunda \u2192 USD naik.", dir: "up", cur: "USD" },
        { label: "2,3 \u2013 2,5% (base)", effect: "Tren konfirmasi \u2192 USD sideways; fokus ke FOMC 17 Sep.", dir: "flat", cur: "USD" },
        { label: "\u2264 2,3%", effect: "Disinflasi dipercepat \u2192 ekspektasi cut menguat \u2192 USD turun.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Harga sewa & perumahan (shelter)", detail: "Komponen terbesar Core CPI. Sewa turun sangat lambat karena kontrak & lag statistik \u2014 ini penyebab utama inflasi inti sulit turun cepat.", data: "Juli 2026: Core CPI 2,5% YoY \u2014 terendah 5 bulan; shelter +3,2% (turun dari 3,3%). Rantai YoY verified: Nov 2,6; Des 2,6; Jan 2,5; Feb 2,5; Mar 2,6; Apr 2,8; Mei 2,9; Jun 2,6; Jul 2,5.", src: SRC.blsCpi },
      { name: "Biaya layanan (services)", detail: "Kategori layanan (kesehatan, transportasi, rekreasi) sensitif terhadap upah & permintaan \u2014 inflasi jasa Juli 2026: 3,1%.", src: SRC.blsCpi },
      { name: "Kenaikan upah", detail: "Upah naik \u2192 biaya layanan naik \u2192 Core CPI naik. Inilah alasan Core 'sticky'.", src: SRC.blsJobs },
      { name: "Harga barang inti (goods ex food/energy)", detail: "Barang seperti kendaraan, perabot, pakaian. Lebih dipengaruhi rantai pasok, dolar, dan tarif impor.", src: SRC.blsCpi }
    ],
    expertViews: [
      { desk: "Head of Global Macro", view: "Core CPI adalah 'sinyal kebijakan' sebenarnya. Jika core turun konsisten, The Fed punya ruang memotong suku bunga.", signal: "Core turun = dovish signal." },
      { desk: "Economist (EU desk)", view: "Perbedaan core CPI AS (2,5%) vs Zona Euro (2,5%) menjelaskan arah divergensi kebijakan Fed\u2013ECB \u2014 perbandingan ini penting untuk EURUSD.", signal: "Core AS > Core EZ = USD kuat." }
    ],
    outlook: "Core CPI AS baru saja turun ke 2,5% (Juli 2026), level terendah dalam 5 bulan \u2014 sinyal bahwa tekanan inflasi inti mulai kehilangan momentum, terutama karena shelter mendingin (3,2%). Jika tren ini berlanjut 2\u20133 bulan (menuju ~2,2\u20132,3% pada akhir 2026), pasar akan secara agresif memperbesar peluang pemangkasan The Fed di 2027 dan USD akan tertekan secara bertahap. Namun dua risiko bisa memutus tren: (1) upah jasa yang kembali naik di atas 3,5% YoY, dan (2) dampak lanjutan tarif/impor ke harga barang inti. Selama core di kisaran 2,4\u20132,7%, The Fed akan memilih 'on hold' \u2014 zona netral bagi USD.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Inflasi inti lengket \u2192 suku bunga tinggi lebih lama \u2192 USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral; konfirmasi tren.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Disinflasi dipercepat \u2192 ekspektasi cut menguat \u2192 USD turun.", dir: "down", cur: "USD" }
    ],
    watch: ["Sewa & perumahan (shelter)", "Data upah (AHE)", "Ekspektasi pasar atas suku bunga (CME FedWatch)"]
  },
  ppi: {
    read: [
      "Perubahan harga di tingkat produsen (huluan), YoY.",
      "Pendahulu CPI \u2014 karena biaya produsen biasanya terbawa ke harga konsumen 1\u20133 bulan kemudian.",
      "Lihat PPI core (ex food, energy, trade) untuk tren sebenarnya."
    ],
    forecast: {
      next: "Kamis, 10 Sep 2026 \xB7 19:30 WIB",
      obs: "Agustus 2026 (y/y)",
      prev: "4,7% (Jul)",
      con: "\xB14,4% (estimasi pasar)",
      range: "4,0 \u2013 4,9%",
      basis: "PPI turun dari 5,5% (Jun) ke 4,7% (Jul) \u2014 tekanan biaya hulu mereda seiring energi. Agustus diproyeksikan melandai lagi ke ~4,3\u20134,5%. Sebagai leading CPI: PPI \u22655% (minyak/tembaga naik lagi) = peringatan CPI Sep\u2013Okt tetap panas (hawkish, USD up); PPI \u22644,2% = disinflasi hulu terkonfirmasi (USD down).",
      scenarios: [
        { label: "\u2265 5,0%", effect: "Tekanan biaya menyala lagi \u2192 CPI tetap tinggi \u2192 USD naik.", dir: "up", cur: "USD" },
        { label: "4,2 \u2013 4,7% (base)", effect: "Melandai berlanjut \u2192 netral untuk USD.", dir: "flat", cur: "USD" },
        { label: "\u2264 4,2%", effect: "Disinflasi hulu terkonfirmasi \u2192 USD turun.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Harga bahan baku & komoditas", detail: "Minyak, logam, hasil pertanian menentukan biaya input pabrik. Lonjakan tembaga atau minyak langsung terasa di PPI.", data: "PPI Juli 2026: 4,7% YoY, turun dari 5,5% Juni \u2014 didorong mendinginnya harga energi.", src: SRC.blsPpi },
      { name: "Biaya energi", detail: "Biaya listrik & bahan bakar memengaruhi hampir semua proses produksi; PPI energi sangat volatil mengikuti minyak.", src: SRC.blsPpi },
      { name: "Logistik & transportasi", detail: "Ongkos pengiriman & biaya rantai pasok langsung membebani harga jual produsen.", src: SRC.blsPpi },
      { name: "Upah & biaya buruh", detail: "Kenaikan upah pabrik menjadi biaya produksi yang akhirnya bisa terbawa ke harga konsumen.", src: SRC.blsJobs }
    ],
    expertViews: [
      { desk: "Riset Makro", view: "PPI adalah 'petunjuk awal' CPI. Jika PPI naik, pasar mengantisipasi CPI juga naik beberapa bulan kemudian.", signal: "PPI naik = CPI akan naik." },
      { desk: "Commodity Strategist", view: "PPI sangat dipengaruhi harga minyak & logam. Analis memisahkan komponen energi untuk melihat tren inti.", signal: "Pantau PPI core (ex energy)." }
    ],
    outlook: "PPI turun ke 4,7% (Juli 2026) dari 5,5% \u2014 indikasi kuat bahwa tekanan biaya di hulu sedang mereda, terutama setelah harga energi stabil. Jika PPI core ikut turun di Agustus\u2013September, maka CPI September 2026 berpeluang lanjut melandai di bawah 3,0%, yang akan memperkuat narasi 'disinflasi' dan melemahkan USD secara bertahap. Sebaliknya, kenaikan kembali harga minyak (risk geopolitik Timur Tengah) atau tembaga (risk China) bisa membalikkan arah PPI dalam 1\u20132 bulan.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Tekanan inflasi hulu masih panas \u2192 USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Biaya produksi mendingin \u2192 USD turun.", dir: "down", cur: "USD" }
    ],
    watch: ["CPI bulan berikutnya", "Harga komoditas (minyak, tembaga)", "Indeks harga impor"]
  },
  corepce: {
    read: [
      "Indeks harga pengeluaran konsumsi pribadi inti (tanpa makanan & energi), bulanan (m/m).",
      "Ukuran inflasi yang paling diperhatikan The Fed untuk kebijakan suku bunga.",
      "Dirilis akhir bulan bersamaan dengan GDP final, 08:30 ET."
    ],
    forecast: {
      next: "Selasa, 30 Sep 2026 \xB7 19:30 WIB (ukuran inflasi resmi The Fed)",
      obs: "Agustus 2026 (m/m)",
      prev: "0,2% (Jul; Jun 0,1%)",
      con: "0,2% (konsensus)",
      range: "0,1 \u2013 0,3%",
      basis: "Juli 0,2% sesuai konsensus \u2014 inflasi inti jinak. Target resmi Fed 2% YoY \u2248 0,15\u20130,17% per bulan, jadi base case Agustus 0,15\u20130,25% = zona 'Fed bisa on hold'. Dua titik putar: jika \u22650,30% dua bulan beruntun (jasa/medis memanas) \u2192 'higher for longer' menguat (USD up); jika \u22640,15% dua bulan beruntun \u2192 pasar mulai price cut H1-2027 (USD down). Rantai: Jul 0,2 (Jun 0,1, Mei 0,3, Apr 0,5, Mar 0,3).",
      scenarios: [
        { label: "\u2265 0,30%", effect: "Inflasi inti panas \u2192 Fed ketat lebih lama \u2192 USD naik.", dir: "up", cur: "USD" },
        { label: "0,15 \u2013 0,25% (base)", effect: "'Cukup baik' \u2192 USD sideways; fokus ke dot plot FOMC 17 Sep.", dir: "flat", cur: "USD" },
        { label: "\u2264 0,15%", effect: "Ruang pelonggaran \u2192 USD turun.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Harga jasa (services)", detail: "Komponen jasa yang bersifat lengket (sticky) adalah penyumbang utama tren inflasi inti.", src: SRC.beaPce },
      { name: "Harga barang inti", detail: "Barang non-makanan/non-energi seperti perumahan, transportasi, & perawatan kesehatan.", src: SRC.beaPce },
      { name: "Upah & tenaga kerja", detail: "Kenaikan upah yang cepat terbawa ke harga jasa \u2014 inti dari tekanan inflasi inti.", src: SRC.blsJobs },
      { name: "Keputusan The Fed", detail: "Core PCE adalah input langsung ke dot plot & proyeksi SEP; menyimpang dari 2% berarti The Fed harus memberi alasan.", data: "Target resmi The Fed: 2% YoY. The Fed (Ketua Warsh) menegaskan komitmen 2% di pidato Mei 2026.", src: SRC.fed }
    ],
    expertViews: [
      { desk: "Fed Watch", view: "PCE inti adalah target resmi The Fed (2%). Jika naik, The Fed menahan suku bunga lebih lama; jika turun, membuka jalan pemangkasan.", signal: "Core PCE naik = USD up." },
      { desk: "Rates Strategist", view: "Perbedaan PCE vs CPI sering kecil, tapi The Fed lebih mengandalkan PCE karena mencakup struktur pengeluaran riil konsumen.", signal: "Fokus ke PCE, bukan CPI." }
    ],
    outlook: "Juli 2026 (rilis 26 Agu): 0,2% (konsensus 0,2%; Juni 0,1%) \u2014 sesuai konsensus, tren inflasi inti tetap jinak. Rantai: Nov 0,2 (rilis 22 Jan, K 0,2), Des 0,4 (rilis 20 Feb, K 0,3), Jan 0,4 (rilis 13 Mar, K 0,4), Feb 0,4, Mar 0,3, Apr 0,5 (revisi dr 0,2). Dengan CPI inti di 2,5% (Juli 2026), Core PCE (yang umumnya sedikit di bawah CPI core) diperkirakan bergerak di kisaran ~0,2% per bulan (\xB12,4% YoY) di kuartal III 2026. Ini zona 'cukup baik tapi belum target': cukup untuk mempertahankan The Fed on hold, namun belum cukup untuk memulai pemangkasan. Titik putar penting: jika Core PCE bulanan turun ke \u22640,15% dua bulan beruntun, pasar akan mulai mem-price cut pada paruh pertama 2027 (bearish USD); jika \u22650,30% (mis. jasa & kesehatan memanas), skenario 'higher for longer' bahkan kenaikan kembali akan menguat (bullish USD).",
    scenarios: [
      { label: "Di atas konsensus", effect: "Inflasi inti masih panas \u2192 USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral; fokus ke pidato The Fed.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Ruang pelonggaran \u2192 USD turun.", dir: "down", cur: "USD" }
    ],
    watch: ["CPI", "Upah rata-rata (AHE)", "Komponen jasa", "Keputusan FOMC"]
  },
  adp: {
    read: [
      "Perubahan pekerjaan di sektor swasta (ADP Research), bulanan, dalam ribuan.",
      "Dirilis Rabu \u2014 2\u20133 hari kerja sebelum NFP resmi BLS \u2014 sebagai 'pemanasan' data ketenagakerjaan.",
      "Korelasinya dengan NFP kuat secara historis, tapi bisa meleset jauh (bias survei & cakupan berbeda)."
    ],
    forecast: {
      next: "TIDAK ADA JADWAL \u2014 ADP tidak lagi muncul di kalender sejak window Sep 2026",
      obs: "\u2014",
      prev: "+122 ribu (Mei \u2014 data terakhir verified)",
      con: "\u2014",
      range: "\u2014",
      basis: "Rilis ADP tampaknya DIHENTIKAN/DIUBAH (tidak lagi tercantum di ForexFactory window Sep 2026). Data terakhir kami verifikasi: Mei +122 ribu (K 118), Apr +105, Mar +62 (K 41), Feb +66, Jan +66, Des +11, Nov +37, Okt +29 \u2014 dengan revisi besar-besaran di tiap rilis. Jika benar berhenti, fungsi leading indicator pasar kerja pindah ke: subindeks employment ISM, jobless claims mingguan, dan survei UoM. Untuk membaca arah NFP 4 Sep: lihat ISM Services (4 Sep 21:00) & claims mingguan.",
      scenarios: [
        { label: "Jika kembali & beat konsensus", effect: "Ekspektasi NFP naik \u2192 USD menguat (sementara).", dir: "up", cur: "USD" },
        { label: "Berhenti berlanjut (base)", effect: "Netral \u2014 fokus pasar ke NFP + claims.", dir: "flat", cur: "USD" },
        { label: "Jika kembali & meleset lemah", effect: "Ekspektasi NFP turun \u2192 USD melemah.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Pemutusan & perekrutan swasta", detail: "Indeks ADP menghitung churn (keluar-masuk) tenaga kerja di bisnis non-pemerintah.", src: SRC.adp },
      { name: "Sektor jasa vs manufaktur", detail: "Mayoritas pekerjaan baru di AS ada di sektor jasa; ADP mencerminkan itu lebih cepat dari BLS.", src: SRC.adp },
      { name: "Kebijakan The Fed", detail: "Pasar kerja yang mendingin memberi The Fed alasan longgar; ADP lemah memperkuat tesis tersebut.", data: "Nilai terkini per bulan (verified FF): Okt +29, Nov +37 (revisi dr 41), Des +11 (dr 22), Jan +66 (dr 63), Feb +66, Mar +62 (K 41), Apr +105, Mei +122 (K 118). Revisinya besar-besaran \u2014 perlakukan sebagai arah umum, bukan angka final.", src: SRC.adp }
    ],
    expertViews: [
      { desk: "FX Strategist", view: "ADP adalah probabilitas awal arah NFP: jika ADP beat, market langsung menaikkan ekspektasi NFP \u2014 USD menguat sebelum BLS bicara.", signal: "ADP beat = USD naik (sementara)." },
      { desk: "Economist", view: "Jangan overrate: ADP bukan BLS. Rilis ADP yang meleset dari NFP terjadi rutin; keputusan posisi sebaiknya menunggu NFP.", signal: "ADP = sinyal, NFP = keputusan." }
    ],
    outlook: "Catatan penting: kalender ForexFactory mulai window Sep 2026 tidak menampilkan lagi baris ADP \u2014 indikasi rilis ini dihentikan/berubah. Data terakhir yang kami verifikasi: April 2026 +105 ribu, Mei 2026 +122 ribu (konsensus +118 ribu). Selama masih dirilis, ADP tetap berguna sebagai leading indicator NFP; jika memang berhenti, fokus pasar kerja bergeser penuh ke NFP + klaim mingguan.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Ekspektasi NFP naik \u2192 USD menguat sebelum rilis NFP.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral; pasar menunggu NFP.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Ekspektasi NFP turun \u2192 USD melemah.", dir: "down", cur: "USD" }
    ],
    watch: ["NFP (BLS)", "Klaim pengangguran", "ISM Services (komponen employment)"]
  },
  ahe: {
    read: [
      "Perubahan gaji rata-rata per jam (Average Hourly Earnings), YoY & MoM.",
      "Indikator inflasi upah \u2014 kenaikan upah cepat dapat memicu inflasi berkelanjutan.",
      "Dirilis bersamaan dengan NFP; sering lebih 'dipasar' daripada headline NFP."
    ],
    forecast: {
      next: "Kamis, 4 Sep 2026 \xB7 19:30 WIB (dirilis bersamaan dengan NFP)",
      obs: "Agustus 2026 (y/y)",
      prev: "3,15% (Jul)",
      con: "\xB13,20% (estimasi pasar)",
      range: "3,0 \u2013 3,4%",
      basis: "Upah melambat: 3,50 (Jun) \u2192 3,15 (Jul) \u2014 perlambatan 2 bulan. Ini angka kunci kedua FOMC September: \u22653,4% menyalakan kembali kekhawatiran inflasi upah (hawkish); \u22643,0% konfirmasi disinflasi upah (dovish, USD tertekan). Zona 'sehat' bagi pasar: 3,2\u20133,4% \u2014 daya beli terjaga tanpa inflasi baru.",
      scenarios: [
        { label: "\u2265 3,4%", effect: "Inflasi upah \u2192 Fed ketat lebih lama \u2192 USD naik.", dir: "up", cur: "USD" },
        { label: "3,1 \u2013 3,3% (base)", effect: "Upah moderat \u2192 netral untuk USD.", dir: "flat", cur: "USD" },
        { label: "\u2264 3,0%", effect: "Disinflasi upah \u2192 ruang cut meluas \u2192 USD turun.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Keketatan pasar kerja", detail: "Pasar kerja ketat (pengangguran rendah) mendorong perusahaan menaikkan gaji untuk menarik & mempertahankan pekerja.", src: SRC.blsJobs },
      { name: "Perundingan upah", detail: "Perjanjian kerja & serikat pekerja menetapkan kenaikan gaji yang berkelanjutan selama 1\u20133 tahun.", src: SRC.blsJobs },
      { name: "Produktivitas tenaga kerja", detail: "Produktivitas naik memungkinkan kenaikan upah tanpa memicu inflasi; produktivitas turun membuat kenaikan upah jadi inflasioner.", src: SRC.blsJobs }
    ],
    expertViews: [
      { desk: "FX Strategist", view: "AHE adalah 'bagian tersembunyi' dari NFP yang paling menentukan. Upah tinggi = inflasi tinggi = USD bullish.", signal: "AHE naik = USD kuat." },
      { desk: "Rates Desk", view: "Kenaikan upah membuat The Fed menunda penurunan suku bunga, sehingga yield obligasi naik \u2014 mendukung dolar.", signal: "AHE tinggi = yield up." }
    ],
    outlook: "Upah AS perlu diamati bersama inflasi: dengan CPI masih 3,4% (Juli 2026) dan The Fed mengisyaratkan bisa kembali hawkish, kenaikan AHE di atas ~3,8% YoY akan memperkuat alasan 'tahan/naikkan bunga' (bullish USD), sementara AHE melambat ke <3,3% akan membuka ruang pelonggaran (bearish USD). Pola yang paling sehat bagi pasar adalah 'upah naik moderat' (3,3\u20133,7%) \u2014 memberi daya beli tanpa memantik inflasi. Rilis AHE (bersamaan dengan NFP, awal bulan) biasanya menjadi penentu arah EURUSD untuk sepekan ke depan.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Inflasi upah meningkat \u2192 The Fed hawkish \u2192 USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Tekanan inflasi mereda \u2192 USD turun.", dir: "down", cur: "USD" }
    ],
    watch: ["CPI", "Nonfarm Payrolls", "Produktivitas (BLS labor productivity)"]
  },
  fedfunds: {
    read: [
      "Suku bunga acuan The Fed (batas atas target range).",
      "Diumumkan 8x/tahun dari rapat FOMC, 14:00 ET + pidato press conference.",
      "Yang digerakkan pasar sering bukan angkanya, melainkan DOT PLOT & nada pidato."
    ],
    forecast: {
      next: "Rabu, 17 Sep 2026 \xB7 01:00 WIB \u2014 FOMC + Economic Projections (dot plot); press conference 01:30",
      obs: "Fed Funds Rate (batas atas target range)",
      prev: "3,75% (range 3,50\u20133,75%)",
      con: "3,75% (hold \u2014 base case)",
      range: "Keputusan: hold 3,75% \xB7 yang menggerakkan = dot plot & nada pidato",
      basis: "Rapat 17 Sep ini 'memiliki' semua: setelah bulan lemah (NFP Jul \u221223 ribu, retail Jul miss \u22120,6%), ada rilis CPI 11 Sep. Hold di 3,75% = base case. Yang menggerakkan pasar adalah DOT PLOT & nada Ketua Warsh: dot median tetap 3,75 tanpa pemangkasan 2027 \u2192 'higher for longer' terkonfirmasi \u2192 USD naik; dot median menyiratkan cut 2027 \u2192 koreksi USD. Historisnya dot plot mengguncang pasar lebih besar dari keputusan itu sendiri.",
      scenarios: [
        { label: "Hawkish: dot plot tanpa cut", effect: "Yield naik, modal masuk \u2192 USD menguat luas (terutama vs EM).", dir: "up", cur: "USD" },
        { label: "Sesuai: hold + dot plot netral", effect: "Reaksi terbatas; pasar baca nada press conference.", dir: "flat", cur: "USD" },
        { label: "Dovish: dot plot siratkan cut 2027", effect: "Yield turun \u2192 USD melemah, emas & aset risiko naik.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Inflasi (CPI/Core CPI)", detail: "Inflasi tinggi memaksa The Fed mempertahankan atau menaikkan suku bunga. Inflasi 3,4% saat ini = alasan utama The Fed tidak mau longgar.", data: "CPI Juli 2026: 3,4% YoY; core 2,5%. Ketua The Fed Kevin Warsh: inflasi 'belum melambat cukup'.", src: SRC.blsCpi },
      { name: "Pasar tenaga kerja", detail: "Lapangan kerja & pengangguran menentukan seberapa ketat kebijakan yang diperlukan.", data: "NFP Juli 2026: \u221223 ribu (kejutan lemah) vs unemp 4,1% \u2014 The Fed terjepit antara dua mandat.", src: SRC.blsJobs },
      { name: "Pertumbuhan ekonomi (GDP)", detail: "Ekonomi yang tumbuh kuat mendukung suku bunga tinggi; perlambatan mendorong penurunan.", data: "GDP Q1-2026 final (revisi 26 Agu): +1,5% annualized (awal 2,0%); Q2: 1,5% (advance 30 Jul, K 2,1% \u2192 prelim 26 Agu, K 1,5%). Proyeksi 2026 penuh turun ke ~1,5\u20132,0%.", src: SRC.beaGdp },
      { name: "Kondisi finansial & dot plot", detail: "Dot plot (proyeksi suku bunga tiap anggota FOMC dalam SEP) sering mengguncang pasar lebih besar daripada keputusan itu sendiri.", src: SRC.fed }
    ],
    expertViews: [
      { desk: "Head of Rates (NY)", view: "Pasar berfokus pada 'dot plot' \u2014 proyeksi suku bunga anggota Fed. Perubahan dot plot sering lebih mengguncang daripada keputusan itu sendiri.", signal: "Dot plot = kunci." },
      { desk: "FX Strategist (London)", view: "Suku bunga tinggi = arus modal masuk = USD kuat. Perubahan ekspektasi suku bunga adalah penggerak utama EURUSD & USDJPY.", signal: "Hawkish Fed = USD up." },
      { desk: "Economist", view: "Baca pernyataan & nada (tone) Gubernur. Pidato setelah rapat (press conference) memegang pengaruh besar pada pergerakan pasar.", signal: "Baca nada press conference." }
    ],
    outlook: "Per Agustus 2026, The Fed di bawah kepemimpinan baru (Kevin Warsh, Ketua sejak Mei 2026) berada dalam mode 'hawkish on hold': suku bunga 3,50\u20133,75% dipertahankan karena inflasi 3,4% masih jauh di atas 2%, sementara pasar kerja mulai menunjukkan retakan (NFP Juli negatif, partisipasi 61,4%). Rapat September 2026 menjadi ujian pertama: data CPI Agustus yang panas \u2192 probabilitas kenaikan (hike) nyata; data yang dingin \u2192 hold dengan sinyal 'siap memotong di 2027'. Pasar harus bersiap volatilitas tinggi di sekitar tiap FOMC. Implikasi USD: selama dot plot tidak berubah, USD tetap terdukung oleh yield US10Y ~4,7%; perubahan dot plot ke arah pemangkasan akan menjadi katalis bearish USD terbesar tahun ini.",
    scenarios: [
      { label: "Hawkish (naik/tinggi lebih lama)", effect: "Yield naik, modal masuk \u2192 USD menguat luas (terutama vs EM).", dir: "up", cur: "USD" },
      { label: "Sebagaimana di-expect", effect: "Reaksi kecil; fokus ke dot plot & pidato.", dir: "flat", cur: "USD" },
      { label: "Dovish (potongan di depan)", effect: "Yield turun \u2192 USD melemah, emas & aset risiko naik.", dir: "down", cur: "USD" }
    ],
    watch: ["Dot plot / SEP", "Pernyataan FOMC", "Data CPI & NFP", "Pidato petinggi Fed"]
  },
  dgs10: {
    read: [
      "Imbal hasil obligasi pemerintah AS tenor 10 tahun.",
      "Disebut 'harga uang' \u2014 mencerminkan ekspektasi suku bunga + ekspektasi inflasi + premi risiko.",
      "Bergerak setiap hari (bukan rilis sekali) \u2014 pantau level & spread vs negara lain."
    ],
    forecast: {
      next: "Bergerak HARIAN \u2014 tanpa jadwal rilis (pantau level & hasil lelang)",
      obs: "Yield US10Y (harian)",
      prev: "4,68% (30 Agu)",
      con: "\u2014",
      range: "September: 4,4 \u2013 5,0%",
      basis: "US10Y ~4,7% ditopang dua kekuatan: (1) Fed hawkish-on-hold (CPI 3,4%), (2) penerbitan utang AS masif. Rentang September: 4,4\u20135,0%. Spike >4,9% = risk-off global (USD & emas naik); jebol <4,4% = ekspektasi pelonggaran (USD turun). Untuk EURUSD/GBPUSD yang menentukan adalah SPREAD vs Bund & Gilts, bukan level absolut. Watch lelang: hasil lelang lemah saat risk-off bisa menaikkan yield sementara USD melemah (pola klasik).",
      scenarios: [
        { label: "Yield spike > 4,9%", effect: "Risk-off global \u2192 USD & emas naik (kecuali krisis murni: flight-to-safety bisa melemahkan USD).", dir: "up", cur: "USD" },
        { label: "4,5 \u2013 4,9% (base)", effect: "Arus modal ke AS \u2192 USD terdukung.", dir: "flat", cur: "USD" },
        { label: "< 4,4%", effect: "Ekspektasi pelonggaran \u2192 USD melemah.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Ekspektasi suku bunga (The Fed)", detail: "Yield naik saat pasar mengantisipasi The Fed menaikkan suku bunga atau menahannya tinggi lebih lama.", data: "US10Y 28 Agu 2026: 4,73%; US2Y: 4,34% \u2014 kurva memendek namun masih positif (spread 10Y\u20132Y +0,39).", src: SRC.treasury },
      { name: "Ekspektasi inflasi", detail: "Inflasi yang diperkirakan naik membuat investor menuntut kompensasi (yield) lebih tinggi; TIPS (breakeven) adalah ukurannya.", data: "10Y TIPS breakeven \u2248 2,4% (Agu 2026) \u2014 pasar mengantisipasi inflasi 10 tahun ke depan di level ini.", src: SRC.treasury },
      { name: "Permintaan obligasi / risk appetite", detail: "Ketika takut, investor membeli obligasi (flight to safety) \u2192 yield turun; saat risk-on, yield naik. Arahnya bisa terbalik dari 'logika suku bunga'.", src: SRC.treasury },
      { name: "Supply & lelang", detail: "Defisit fiskal AS yang besar berarti penerbitan obligasi masif; hasil lelang yang lemah mendorong yield naik (premi permintaan).", src: SRC.treasury }
    ],
    expertViews: [
      { desk: "Rates Strategist", view: "Yield 10Y adalah 'ukur' suku bunga netral jangka panjang. Kenaikan yield = modal masuk = dolar kuat.", signal: "Yield naik = USD up." },
      { desk: "FX Desk", view: "Spread yield antara AS dan negara lain (mis. AS vs Jerman) adalah mesin utama nilai tukar. Yield AS naik cepat \u2192 selisih melebar \u2192 USD naik.", signal: "Watch US\u2013DE spread." }
    ],
    outlook: "US10Y di ~4,7% (Agu 2026) \u2014 level tinggi historis yang ditopang dua kekuatan: (1) The Fed 'hawkish on hold' dengan inflasi 3,4%, dan (2) penerbitan utang masif. Selama The Fed tidak memberi sinyal pemangkasan nyata, yield diproyeksikan bertahan di rentang 4,5\u20135,0%, yang terus menyedot dana ke dolar dan menahan EUR/USD, GBP/USD, dan cross EM tertekan. Titik perubahan: (a) dot plot September 2026 yang membesar ke arah cut, (b) CPI dua bulan beruntun di bawah konsensus, atau (c) stress lelang obligasi yang memicu risk-off (yield bisa naik sementara meski USD melemah \u2014 watch spread, bukan level saja).",
    scenarios: [
      { label: "Yield melonjak", effect: "Arus modal ke AS \u2192 USD menguat (kecuali karena crisis: flight-to-safety bisa melemahkan USD).", dir: "up", cur: "USD" },
      { label: "Stabil", effect: "Netral; USD mengikuti spread vs negara lain.", dir: "flat", cur: "USD" },
      { label: "Yield turun tajam", effect: "Ekspektasi pelonggaran \u2192 USD melemah.", dir: "down", cur: "USD" }
    ],
    watch: ["Level & kurva yield", "CPI", "Lelang obligasi (Treasury auction)", "Spread vs Bund Jerman & JGB"]
  },
  retail: {
    read: [
      "Perubahan penjualan ritel bulanan (m/m & YoY).",
      "Proksi belanja konsumen \u2014 sekitar dua pertiga ekonomi AS.",
      "Versi 'ex-auto' (tanpa kendaraan) yang paling dipantau pasar."
    ],
    forecast: {
      next: "Selasa, 15 Sep 2026 \xB7 19:30 WIB",
      obs: "Agustus 2026 (m/m)",
      prev: "\u22120,6% (Jul \u2014 miss jelas vs K +0,1%)",
      con: "\xB1+0,3% (estimasi pasar)",
      range: "\u22120,2% \u2013 +0,8%",
      basis: "Juli negatif pertama sejak November (\u22120,6% vs konsensus +0,1%) \u2014 narasi 'konsumen lelah' menguat. Agustus diproyeksikan recovery parsial (~+0,3%): basis lemah + suku bunga 3,50\u20133,75% masih menekan belanja besar. Jika kembali \u22640% = penguat skenario cut (USD down); jika \u2265+0,5% = narasi soft landing aman (USD up). Rantai verified: Jun +0,2 \u2192 Jul \u22120,6.",
      scenarios: [
        { label: "\u2265 +0,5%", effect: "Konsumsi sehat \u2192 ekonomi tahan \u2192 USD naik.", dir: "up", cur: "USD" },
        { label: "0 \u2013 0,4% (base)", effect: "Recovery parsial \u2192 netral untuk USD.", dir: "flat", cur: "USD" },
        { label: "\u2264 0%", effect: "Konsumen lelah berlanjut \u2192 ekspektasi cut menguat \u2192 USD turun.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Keyakinan konsumen", detail: "Konsumen yang optimis lebih berani berbelanja, mendorong penjualan.", data: "Rantai m/m verified: Nov \u22120,1; Des +0,6; Jan \u22120,1 (revisi dr 0,0); Feb \u22120,1; Mar +0,6; Apr +1,6; Mei +0,5; Jun +0,2; Jul \u22120,6 (K +0,1 \u2014 miss jelas, rilis 14 Agu).", src: SRC.census },
      { name: "Pendapatan & upah", detail: "Pendapatan yang meningkat memberi daya beli untuk belanja.", src: SRC.blsJobs },
      { name: "Inflasi & harga", detail: "Inflasi tinggi bisa menaikkan nilai penjualan itu sendiri; perlu dilihat secara riil (nominal vs riil).", src: SRC.blsCpi },
      { name: "Kondisi kredit & suku bunga", detail: "Suku bunga tinggi menekan pinjaman konsumen (kartu kredit, KPR, auto loan), mengurangi belanja besar.", src: SRC.fed }
    ],
    expertViews: [
      { desk: "Consumer Strategist", view: "Retail sales adalah cermin langsung kesehatan konsumen. Angka kuat menandakan engine ekonomi AS masih menyala.", signal: "Retail kuat = USD up." },
      { desk: "Economist", view: "Perlu dipisahkan control group (tanpa otomotif & bensin) yang lebih bersih \u2014 itu yang biasanya dimonitor pasar.", signal: "Fokus ke control group." }
    ],
    outlook: "Konsumsi AS masih menjadi tulang punggung (\xB12/3 PDB) meski suku bunga tinggi menahan belanja besar (otomotif, rumah). Dengan GDP 2026 diproyeksikan ~1,9\u20132,2% dan upah riil tertekan inflasi 3,4%, retail sales diperkirakan tumbuh moderat \u2014 tidak cukup panas untuk memicu kekhawatiran inflasi, tidak cukup dingin untuk memicu panic. Retail ex-auto yang konsisten >+0,3% m/m akan menjaga narasi 'soft landing' dan menopang USD; kejutan negatif (<0%) akan memperkuat ekspektasi pemangkasan dan menekan USD.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Konsumsi sehat \u2192 ekonomi tahan \u2192 USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Konsumen melemah \u2192 ekspektasi cut \u2192 USD turun.", dir: "down", cur: "USD" }
    ],
    watch: ["Michigan Consumer Sentiment", "Data ketenagakerjaan", "Kredit konsumen (Fed G.19)"]
  },
  umich: {
    read: [
      "Survei keyakinan konsumen (University of Michigan) terhadap ekonomi & keuangan pribadi.",
      "Ada versi preliminary (pertengahan bulan) & final (akhir bulan).",
      "Komponen paling dipasar: ekspektasi inflasi 1-tahun & 5-tahun."
    ],
    forecast: {
      next: "Tidak ada jadwal aktif (pola: preliminary ~Jumat kedua, 21:00/22:00 WIB \u2014 rilis data Aug diperkirakan \xB110 Sep)",
      obs: "Agustus 2026",
      prev: "51,0 (Jul \u2014 turun dari 55,2 Jun)",
      con: "\xB151\u201353 (estimasi pasar)",
      range: "48 \u2013 55",
      basis: "Sentimen konsumen melemah jelas: Jan 57,3 \u2192 Jun 55,2 \u2192 Jul 51,0. Prelim Agustus diperkirakan 51\u201353: pulih ke \u226554 = cerita 'konsumen masih bertahan'; jebol <50 = warning resesi konsumen (buruk utk retail & GDP). Sama pentingnya: ekspektasi inflasi 1-tahun (terakhir 3,5% di Jan, turun dr 4,0%) \u2014 jika lompatan ke >4% = narasi 'anchoring gagal' menguat (hawkish, USD up).",
      scenarios: [
        { label: "Sentimen \u226554 + ekspektasi inflasi stabil", effect: "Konsumen sehat \u2192 USD naik.", dir: "up", cur: "USD" },
        { label: "50 \u2013 53 (base)", effect: "Lemah tapi stabil \u2192 dampak terbatas.", dir: "flat", cur: "USD" },
        { label: "< 50 / ekspektasi inflasi >4%", effect: "Warning resesi (USD down) ATAU inflasi tak terkunci (USD up) \u2014 baca dua-duanya.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Kondisi ekonomi saat ini", detail: "Konsumen menilai situasi ekonomi yang sedang berjalan.", src: SRC.umich },
      { name: "Harga & inflasi", detail: "Inflasi tinggi menurunkan keyakinan; survei ini juga memuat ekspektasi inflasi konsumen \u2014 input kebijakan The Fed.", data: "Ekspektasi inflasi 1-tahun konsumen menjadi salah satu pengukur 'anchoring' inflasi (target The Fed 2%).", src: SRC.umich },
      { name: "Pasar tenaga kerja", detail: "Ketersediaan & keamanan pekerjaan memengaruhi rasa aman berbelanja.", src: SRC.blsJobs },
      { name: "Sentimen politik & peristiwa", detail: "Peristiwa politik dapat memengaruhi mood konsumen dalam jangka pendek.", src: SRC.umich }
    ],
    expertViews: [
      { desk: "Micro Strategist", view: "Yang paling dicari adalah 'ekspektasi inflasi 1 tahun' dari survei ini \u2014 sering menjadi petunjuk kebijakan The Fed.", signal: "Watch ekspektasi inflasi 1y." },
      { desk: "Consumer Economist", view: "Sentimen biasanya mengikuti data ketenagakerjaan dan harga; korelasi dengan belanja riil tidak selalu langsung.", signal: "Gunakan sebagai konfirmasi." }
    ],
    outlook: "Terkini (verified FF): sentimen Jan 57,3 (K 55,0 \u2014 beat), Des 56,4 (revisi dr 54,0), Nov 52,9, lalu turun ke 51,0 (Jul) \u2014 pelemahan jelas. Ekspektasi inflasi 1-tahun: 3,5% (Jan, turun dr 4,0%). Sentimen sensitif terhadap dua hal: upah riil yang tertekan inflasi 3,4% dan kekhawatiran pasar kerja (partisipasi 61,4%). Selama ekspektasi inflasi 1-tahun tetap 'terjangkar' di bawah ~3%, The Fed tidak perlu panik; lonjakan ekspektasi (>3,5%) akan menjadi bahan bakar narasi hawkish (bullish USD) karena bank sentral harus lebih agresif menjangkarkan. Ekspektasi 5-tahun adalah indikator kepercayaan jangka panjang \u2014 jika masih ~2,3\u20132,5%, pasar harga akan tetap percaya target 2% The Fed tercapai.",
    scenarios: [
      { label: "Sentimen & ekspektasi inflasi naik", effect: "Narasi hawkish \u2192 USD naik.", dir: "up", cur: "USD" },
      { label: "Stabil", effect: "Netral; dampak kecil.", dir: "flat", cur: "USD" },
      { label: "Sentimen anjlok", effect: "Risiko resesi \u2192 USD turun (kecuali flight-to-safety).", dir: "down", cur: "USD" }
    ],
    watch: ["Ekspektasi inflasi 1y & 5y", "Retail Sales", "Data ketenagakerjaan"]
  },
  indpro: {
    read: [
      "Perubahan output pabrik, pertambangan, & utilitas (m/m).",
      "Indikator aktivitas sektor produksi \u2014 sekitar 1/4 ekonomi AS.",
      "Lihat 'advance indicators' (pesanan) di dalam rilis yang sama."
    ],
    forecast: {
      next: "Akhir bulan (laporan G.17, diperkirakan \xB125 Sep \xB7 19:30 WIB)",
      obs: "Agustus 2026 (m/m)",
      prev: "0,21% (Jul)",
      con: "\xB1+0,2% (estimasi pasar)",
      range: "+0,1 \u2013 0,3%",
      basis: "Produksi industri tumbuh pelan (Jul 0,21%) \u2014 sektor produksi 'stabil tapi tidak ekspansif' (ISM Mfg >55 namun kapasitas terpakai ~76%). Dampak FX kecil dibanding CPI/NFP \u2014 gunakan sebagai konfirmasi arah ISM: \u22650,3% bersamaan ISM akselerasi = cerita ekspansi aman (USD naik tipis); \u22640% dua bulan beruntun = sinyal produksi melambat (USD turun tipis).",
      scenarios: [
        { label: "\u2265 0,3%", effect: "Ekspansi berlanjut \u2192 USD naik tipis.", dir: "up", cur: "USD" },
        { label: "0,1 \u2013 0,2% (base)", effect: "Stabil \u2192 netral.", dir: "flat", cur: "USD" },
        { label: "\u2264 0%", effect: "Produksi melambat \u2192 USD turun tipis.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Pesanan manufaktur", detail: "Pesanan yang masuk (new orders) menentukan tingkat produksi berikutnya.", src: SRC.fedG17 },
      { name: "Permintaan global", detail: "Ekonomi dunia yang kuat mendorong ekspor dan produksi domestik; China & Eropa penopang utama.", src: SRC.fedG17 },
      { name: "Kapasitas produksi", detail: "Seberapa banyak kapasitas yang terpakai menunjukkan ruang untuk meningkatkan output.", src: SRC.fedG17 }
    ],
    expertViews: [
      { desk: "Industri Strategist", view: "Industrial production bersama PMI menunjukkan 'denyut' manufaktur. Kenaikan = ekspansi ekonomi.", signal: "Produksi naik = risk-on." }
    ],
    outlook: "Sektor manufaktur AS berada di fase 'stabil tapi tidak ekspansif' \u2014 tertahan biaya energi tinggi dan suku bunga 3,50\u20133,75%, ditopang investasi IT & energi. Industrial production diproyeksikan tumbuh pelan (+0,1\u20130,3% m/m) di kuartal III 2026. Dampak ke FX terbatas dibanding CPI/NFP, tetapi rangkaian produksi lemah 2\u20133 bulan berturut-turut akan memperkuat skenario resesi ringan yang berujung pada pemangkasan Fed (bearish USD).",
    scenarios: [
      { label: "Di atas konsensus", effect: "Ekspansi berlanjut \u2192 USD naik tipis.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Perlambatan produksi \u2192 USD turun tipis.", dir: "down", cur: "USD" }
    ],
    watch: ["ISM Manufacturing PMI", "Capacity Utilization", "Pesanan tahan lama (durable goods)"]
  },
  gdp: {
    read: [
      "Pertumbuhan ekonomi riil per kuartal, annualized (q/q) \u2014 angka preliminary BEA (sesuai tampilan ForexFactory).",
      "Angka paling luas tentang kesehatan ekonomi; dirilis 3 kali (advance, second, final).",
      "Baca komposisinya: konsumsi vs investasi vs ekspor bersih."
    ],
    forecast: {
      next: "Selasa, 30 Sep 2026 \xB7 19:30 WIB \u2014 FINAL Q2-2026 (rilis ke-3 dari 3)",
      obs: "Q2-2026 (q/q annualized)",
      prev: "1,5% (prelim 26 Agu)",
      con: "1,5% (konsensus)",
      range: "1,3 \u2013 1,7%",
      basis: "Q2-2026: 1,5 (advance 30 Jul, K 2,1%) \u2192 1,5 (prelim 26 Agu, K 1,5%) \u2014 stabil. Final diproyeksikan bertahan ~1,5% (meski revisi BEA 2026 liarnya tak bisa diabaikan \u2014 ingat Q4-2025: 4,4 \u2192 1,4 \u2192 0,7 \u2192 final 0,5). Setelah ini fokus pindah ke ADVANCE Q3 (28 Okt): >1,5% = skenario soft landing aman (USD up); <1% dua kuartal beruntun = skenario resesi (USD down, emas up).",
      scenarios: [
        { label: "\u2265 1,7%", effect: "Ekonomi lebih kuat \u2192 Fed tahan ketat \u2192 USD naik.", dir: "up", cur: "USD" },
        { label: "1,3 \u2013 1,7% (base)", effect: "Sesuai ekspektasi \u2192 netral; fokus advance Q3 (28 Okt).", dir: "flat", cur: "USD" },
        { label: "\u2264 1,3%", effect: "Momentum melemah \u2192 ekspektasi cut naik \u2192 USD turun.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Konsumsi rumah tangga", detail: "Komponen terbesar (~70% PDB). Belanja konsumen menentukan laju pertumbuhan.", data: "Q4-2025: 4,4% (22 Jan) \u2192 1,4% (20 Feb) \u2192 0,7% (13 Mar) \u2192 final 0,5% (9 Apr) \u2014 empat rilis, revisi turun brutal. Q2-2026: advance 1,5% (30 Jul, K 2,1%) \u2192 preliminary 1,5% (26 Agu, K 1,5%) \u2014 stabil. Q1-2026: advance 2,0% (30 Apr) \u2192 preliminary 1,6% (28 Mei) \u2192 'final' 2,1% (25 Jun) \u2192 direvisi ke 1,5% (per 26 Agu) \u2014 empat nilai untuk satu kuartal, dunia revisi BEA yang liar.", src: SRC.beaGdp },
      { name: "Investasi bisnis", detail: "Investasi modal (terutama IT) merefleksikan optimisme jangka panjang perusahaan; ini penopang pertumbuhan AS 2026.", src: SRC.beaGdp },
      { name: "Ekspor & impor", detail: "Ekspor yang kuat menambah, impor yang besar mengurangi PDB; tarif & kurs menentukan arahnya.", src: SRC.beaGdp },
      { name: "Belanja pemerintah", detail: "Kebijakan fiskal dan belanja negara mendorong pertumbuhan; pemotongan belanja federal bisa menjadi rem (lihat koreksi sektor pemerintah Juli 2026).", src: SRC.beaGdp }
    ],
    expertViews: [
      { desk: "Macro Strategist", view: "GDP kuat = The Fed lebih nyaman mempertahankan suku bunga tinggi = USD kuat. GDP lemah = ekspektasi cut naik.", signal: "GDP kuat = USD up." },
      { desk: "Economist", view: "Perhatikan komposisi: pertumbuhan berbasis konsumsi & investasi lebih sehat & berkelanjutan daripada hanya berbasis stimulus.", signal: "Baca komposisi, bukan headline." }
    ],
    outlook: "Ekonomi AS diproyeksikan tumbuh ~1,5\u20132,0% sepanjang 2026 \u2014 solid, ditopang investasi IT, energi, dan belanja konsumen yang tangguh. Q2-2026: advance +1,5% (30 Jul, K 2,1%) \u2192 preliminary +1,5% (26 Agu, K 1,5%) \u2014 final 30 Sep; Q1 final (revisi 26 Agu) 1,5%. Jika Q3 (advance 28 Okt) tetap >1,5% annualized, skenario 'soft landing' bertahan dan The Fed tidak punya alasan longgar \u2192 USD terdukung. Risiko utama: konsumsi rumah tangga yang melelah akibat inflasi 3,4% + suku bunga tinggi; dua kuartal berturut-turut <1% akan menggeser pasar ke skenario resesi (bearish USD).",
    scenarios: [
      { label: "Di atas konsensus", effect: "Ekonomi kuat \u2192 The Fed tahan ketat \u2192 USD naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Perlambatan \u2192 ekspektasi cut \u2192 USD turun.", dir: "down", cur: "USD" }
    ],
    watch: ["Konsumsi pribadi", "Investasi bisnis", "Ekspor bersih", "Kebijakan fiskal"]
  },
  claims: {
    read: [
      "Klaim pengangguran awal per minggu \u2014 data pasar kerja tercepat.",
      "Dirilis setiap Kamis, 08:30 ET (13:30/19:30 WIB). Di sini dirata-rata bulanan.",
      "Bandingkan 4-minggu moving average, bukan angka seminggu."
    ],
    forecast: {
      next: "Setiap KAMIS \xB7 19:30 WIB (mingguan; halaman menampilkan rata-rata bulanan)",
      obs: "Agustus 2026 = rata-rata rilis mingguan Agustus",
      prev: "\xB1204 ribu (rata-rata Agu)",
      con: "\xB1205 ribu (estimasi pasar)",
      range: "190 \u2013 230 ribu (moving average 4-minggu)",
      basis: "Klaim awal stabil 200\u2013210 ribu sejak Mei \u2014 zona 'aman', jauh dari alarm (>300 ribu). Dengan NFP Juli \u221223 ribu, claims adalah radar TERDINI pasar kerja: MA-4-minggu tembus >230 ribu selama 2\u20133 minggu beruntun = sinyal warning USD 4\u20138 minggu sebelum unemp naik. Base case September: stabil 200\u2013220 ribu.",
      scenarios: [
        { label: "\u2265 240 ribu (2\u20133 minggu beruntun)", effect: "Warning perlambatan \u2192 USD turun.", dir: "down", cur: "USD" },
        { label: "190 \u2013 220 ribu (base)", effect: "Zona aman \u2192 netral-bullish USD.", dir: "flat", cur: "USD" },
        { label: "< 190 ribu", effect: "Pasar kerja ketat \u2192 USD naik tipis.", dir: "up", cur: "USD" }
      ]
    },
    drivers: [
      { name: "PHK / pemutusan kerja", detail: "Peningkatan klaim menandakan perusahaan mulai memangkas karyawan \u2014 tanda awal perlambatan.", data: "Klaim awal sempat stabil di ~215 ribu (Juni\u2013Juli 2026) \u2014 level 'aman', jauh di bawah zona alarm (>300 ribu).", src: SRC.blsClaims },
      { name: "Siklus bisnis", detail: "Klaim biasanya naik menjelang/kala resesi dan turun saat ekspansi.", src: SRC.fred },
      { name: "Kondisi pasar kerja", detail: "Klaim yang rendah & stabil = pasar kerja solid, mendukung kebijakan ketat The Fed.", src: SRC.blsClaims }
    ],
    expertViews: [
      { desk: "Labor Economist", view: "Jobless claims adalah 'radar' dini pasar kerja. Lonjakan tajam adalah peringatan awal resesi.", signal: "Spike = risk-off." },
      { desk: "FX Strategist", view: "Klaim naik melemahkan USD karena memicu spekulasi The Fed akan memangkas suku bunga cepat.", signal: "Klaim naik = USD down." }
    ],
    outlook: "Dengan NFP Juli negatif (\u221223 ribu vs konsensus +85) dan revisi Juni ke bawah (57\u219220 ribu), klaim awal adalah radar paling dini untuk melihat apakah pasar kerja 'mendingin' atau 'retak'. Selama 4-minggu moving average bertahan di bawah ~230 ribu, pasar akan tetap menganggap pasar kerja stabil (netral-bullish USD). Lonjakan ke 260\u2013300 ribu berturut-turut 2\u20133 minggu akan menjadi sinyal awal pelemahan USD yang besar \u2014 biasanya mendahului kenaikan Unemployment Rate 4\u20138 minggu kemudian.",
    scenarios: [
      { label: "Naik tajam (>250 ribu)", effect: "Warning perlambatan \u2192 USD turun.", dir: "down", cur: "USD" },
      { label: "Stabil (<230 ribu)", effect: "Netral-bullish USD.", dir: "flat", cur: "USD" },
      { label: "Turun", effect: "Pasar kerja ketat \u2192 USD naik tipis.", dir: "up", cur: "USD" }
    ],
    watch: ["NFP (Jumat)", "Unemployment Rate", "Klaim lanjutan (continuing claims)"]
  },
  capacity: {
    read: [
      "Persentase kapasitas industri yang terpakai.",
      "Bersama Industrial Production mencerminkan denyut sektor manufaktur.",
      "Level >80% = tekanan; <75% = banyak ruang."
    ],
    forecast: {
      next: "Akhir bulan (rilis G.17 yang sama dengan industrial production, diperkirakan \xB125 Sep)",
      obs: "Agustus 2026 (%)",
      prev: "76,3% (Jul)",
      con: "\xB176,0% (estimasi pasar)",
      range: "75,5 \u2013 77,0%",
      basis: "Kapasitas terpakai di level menengah (~76%) \u2014 sektor produksi 'penuh tapi tidak overheat': bukan alasan Fed menaikkan bunga, tapi juga bukan ruang pemangkasan. Dampak FX paling kecil di antara indikator AS; gunakan sebagai konfirmasi siklus bersama ISM & industrial production: >77% = tekanan kapasitas (inflasioner); <75% = banyak ruang (dovish).",
      scenarios: [
        { label: "\u2265 77%", effect: "Tekanan kapasitas produksi \u2192 USD naik tipis.", dir: "up", cur: "USD" },
        { label: "75,5 \u2013 77% (base)", effect: "Penuh tapi tak overheat \u2192 netral.", dir: "flat", cur: "USD" },
        { label: "< 75%", effect: "Banyak ruang \u2192 produksi melemah \u2192 USD turun tipis.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Permintaan industri", detail: "Permintaan tinggi mendorong pabrik menggunakan lebih banyak kapasitas.", src: SRC.fedG17 },
      { name: "Investasi kapasitas", detail: "Pembangunan pabrik baru dan peralatan menambah kapasitas yang tersedia.", src: SRC.fedG17 },
      { name: "Siklus manufaktur", detail: "Kapasitas terpakai sangat terikat siklus ekspansi-kontraksi manufaktur.", src: SRC.fedG17 }
    ],
    expertViews: [
      { desk: "Industrial Analyst", view: "Kapasitas terpakai mendekati maksimum menandakan tekanan inflasi produksi \u2014 mendukung kebijakan ketat.", signal: "Kapasitas tinggi = inflasi pressure." }
    ],
    outlook: "Kapasitas terpakai AS di kisaran menengah (\xB177%) menunjukkan ekonomi produksi 'penuh tapi tidak overheat' \u2014 tidak memberi alasan tambahan bagi The Fed untuk menaikkan bunga, namun juga tidak membuka ruang pemangkasan. Dampak FX-nya paling kecil dibanding CPI/NFP; gunakan sebagai konfirmasi arah siklus manufaktur bersama ISM & Industrial Production.",
    scenarios: [
      { label: "Naik mendekati 80%+", effect: "Tekanan inflasi produksi \u2192 USD naik tipis.", dir: "up", cur: "USD" },
      { label: "Stabil", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Turun", effect: "Produksi melemah \u2192 USD turun tipis.", dir: "down", cur: "USD" }
    ],
    watch: ["Industrial Production", "ISM Manufacturing PMI", "PPI"]
  },
  eu_cpi: {
    read: [
      "Indeks harga konsumen Zona Euro (HICP), YoY.",
      "Target inflasi ECB juga 2% (symetris \u2014 inflasi rendah juga jadi masalah).",
      "Ada 'flash estimate' awal bulan (cepat, kurang akurat) & final."
    ],
    forecast: {
      next: "Pertengahan September (HICP final, diperkirakan \xB115 Sep \xB7 14:00 CET; flash awal bulan)",
      obs: "Agustus 2026 (y/y)",
      prev: "2,93% (Jul)",
      con: "\xB13,0% (proyeksi staff ECB: puncak 3,4% di Q3\u2013Q4)",
      range: "2,8 \u2013 3,2%",
      basis: "Inflasi EZ naik ke 2,93% (Jul) \u2014 didorong energi (konflik Timur Tengah 2026). ECB sudah naik +25bp di Juni (ke 2,40%) dan diproyeksikan 1\u20132x lagi pada 2026. Jika Agustus \u22653,1% = kasus kenaikan lanjutan menguat (EUR up); jika <2,5% = ruang longgar terbuka (EUR down). Kunci EURUSD: divergensi \u2014 ECB lebih hawkish dari Fed yang terjepit data kerja lemah = momentum EUR H2-2026, selama minyak tidak melonjak ekstrem.",
      scenarios: [
        { label: "\u2265 3,1%", effect: "ECB naik lagi \u2192 EUR naik (terutama vs USD).", dir: "up", cur: "EUR" },
        { label: "2,8 \u2013 3,1% (base)", effect: "Sesuai ekspektasi \u2192 netral.", dir: "flat", cur: "EUR" },
        { label: "< 2,5%", effect: "Ruang longgar \u2192 EUR turun.", dir: "down", cur: "EUR" }
      ]
    },
    drivers: [
      { name: "Harga energi", detail: "Eropa sangat bergantung pada impor energi \u2014 konflik Timur Tengah 2026 menaikkan inflasi EZ lewat harga gas & bensin.", data: "HICP Juli 2026: 2,9% YoY (Juni 2,8%) \u2014 naik lagi akibat energi; core 2,5%. Proyeksi ECB: HICP bisa mencapai 3,4% di Q3\u2013Q4 2026.", src: SRC.eurostat },
      { name: "Harga pangan", detail: "Kenaikan harga pangan langsung tercermin dalam inflasi konsumen Eropa (inflasi pangan Q2-2026: 1,2%).", src: SRC.eurostat },
      { name: "Upah Eropa", detail: "Perundingan upah yang tinggi dapat 'menumpuk' inflasi dan membuat ECB ketat lebih lama. Pertumbuhan upah Q1-2026: 3,4% YoY.", src: SRC.eurostat },
      { name: "Permintaan kawasan", detail: "Konsumsi & investasi dalam Zona Euro menentukan tekanan harga; pertumbuhan 2026 diproyeksikan hanya 0,8%.", src: SRC.ecb }
    ],
    expertViews: [
      { desk: "ECB Watcher", view: "Inflasi EZ biasanya didorong energi, bukan permintaan domestik. Karena itu ECB sering lebih berhati-hati daripada The Fed.", signal: "Baca komponen energi." },
      { desk: "FX Strategist", view: "Inflasi EZ tinggi \u2192 ECB hawkish \u2192 EUR kuat terhadap USD & GBP.", signal: "EZ CPI tinggi = EUR up." }
    ],
    outlook: "ECB baru saja melakukan kenaikan pertama dalam 3 tahun (+25bp Juni 2026, jadi 2,40%) sebagai respons guncangan energi. Proyeksi staff ECB (Juni 2026): HICP 2026 rata-rata 3,0%, bisa menyentuh 3,4% di Q3\u2013Q4, baru turun ke 2,3% di 2027. Artinya ECB kemungkinan menaikkan 1\u20132x lagi pada 2026 sebelum memotong. Divergensi ini adalah mesin EURUSD: ECB hawkish + Fed terjepit data kerja lemah \u2192 EUR memiliki momentum naik terhadap USD di paruh kedua 2026, selama minyak tidak melonjak ekstrem (yang justru merugikan ekonomi EZ).",
    scenarios: [
      { label: "Di atas konsensus", effect: "ECB hawkish \u2192 EUR naik (terutama vs USD/GBP).", dir: "up", cur: "EUR" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "EUR" },
      { label: "Di bawah konsensus", effect: "Ruang longgar ECB \u2192 EUR turun.", dir: "down", cur: "EUR" }
    ],
    watch: ["Keputusan ECB (Sept 2026)", "Harga energi (Brent/TTF)", "GDP & tenaga kerja Eropa"]
  },
  eu_unemp: {
    read: [
      "Tingkat pengangguran Zona Euro (Eurostat, bulanan).",
      "Dampak ke EUR umumnya kecil \u2014 pasar lebih fokus ke inflasi & keputusan ECB.",
      "Perhatikan juga youth unemployment & upah."
    ],
    forecast: {
      next: "Awal bulan (Eurostat, diperkirakan \xB17 Sep \xB7 11:00 CET)",
      obs: "Juli 2026",
      prev: "6,3% (Jun)",
      con: "\xB16,3% (estimasi pasar)",
      range: "6,1 \u2013 6,5%",
      basis: "Pasar kerja EZ solid (6,3%, dekat level terendah historis) meski di tengah siklus kenaikan bunga \u2014 ini memberi ECB legitimasi hawkish sepanjang 2026. Base case Juli: stabil 6,2\u20136,4%. Dampak FX kecil \u2014 fokus pasar tetap di HICP & ECB. Risiko di sisi pertumbuhan: jika GDP EZ stagnan (proyeksi 0,8% utk 2026), pengangguran bisa naik 6,5\u20136,7% di Q3\u2013Q4 \u2192 memaksa ECB stop-hike (EUR bearish 2027).",
      scenarios: [
        { label: "\u2264 6,2%", effect: "Pasar kerja ketat \u2192 ECB hawkish \u2192 EUR naik.", dir: "up", cur: "EUR" },
        { label: "6,2 \u2013 6,4% (base)", effect: "Stabil \u2192 netral.", dir: "flat", cur: "EUR" },
        { label: "\u2265 6,5%", effect: "Perlambatan \u2192 tekanan dovish ke ECB \u2192 EUR turun.", dir: "down", cur: "EUR" }
      ]
    },
    drivers: [
      { name: "Pasar kerja Eropa", detail: "Kondisi pasar kerja di negara-negara anggota berpengaruh pada angka gabungan.", data: "Juni 2026: 6,3% (Juli belum rilis; proyeksi 6,3%). Pengangguran muda 14,8% (Juni).", src: SRC.eurostat },
      { name: "Siklus ekonomi", detail: "Ekonomi yang tumbuh menurunkan pengangguran; stagnasi menaikannya. Pertumbuhan 2026 EZ hanya 0,8% \u2014 risiko utama.", src: SRC.ecb },
      { name: "Kebijakan ECB", detail: "Kebijakan suku bunga (kini 2,40%) berdampak pada investasi & lapangan kerja.", src: SRC.ecb }
    ],
    expertViews: [
      { desk: "Eurozone Economist", view: "Pengangguran rendah mendukung ECB mempertahankan kebijakan ketat, menguatkan EUR.", signal: "Unemp rendah = EUR up." }
    ],
    outlook: "Pasar kerja Zona Euro masih solid (6,3%, dekat level terendah historis) bahkan di tengah kenaikan suku bunga \u2014 ini memberi ECB legitimasi untuk tetap hawkish sepanjang 2026. Risiko: jika pertumbuhan 0,8% melambat menjadi stagnasi (Q3\u2013Q4), pengangguran bisa naik ke 6,5\u20136,7%, yang akan memaksa ECB berhenti menaikkan dan membuka wacana cut di 2027 (bearish EUR). Jangka pendek: data netral-bullish EUR.",
    scenarios: [
      { label: "Turun (pasar kerja ketat)", effect: "ECB yakin hawkish \u2192 EUR naik.", dir: "up", cur: "EUR" },
      { label: "Stabil", effect: "Netral.", dir: "flat", cur: "EUR" },
      { label: "Naik (perlambatan)", effect: "Tekanan dovish ke ECB \u2192 EUR turun.", dir: "down", cur: "EUR" }
    ],
    watch: ["Keputusan ECB", "PMI Zona Euro", "Upah & data tenaga kerja"]
  },
  uk_cpi: {
    read: [
      "Indeks harga konsumen Inggris (ONS), YoY.",
      "Menentukan kebijakan Bank of England (BoE).",
      "Target inflasi BoE: 2% (CPI)."
    ],
    forecast: {
      next: "Pertengahan September (ONS, diperkirakan \xB118 Sep \xB7 01:00 WIB)",
      obs: "Agustus 2026 (y/y)",
      prev: "2,9% (Jul)",
      con: "\xB12,9% (estimasi pasar)",
      range: "2,7 \u2013 3,1%",
      basis: "CPI UK naik ke 2,9% (Jul) akibat price cap energi Ofgem +13% \u2014 sementara core tetap 2,6%. BoE di 3,75% menghadapi dilema di rapat September: headline panas vs core jinak \u2014 pasar besar kemungkinan harga hold. Jika Agustus \u22653,1% = narasi 'BoE lebih hawkish dari Fed' bertahan (GBP/USD terangkat); jika <2,5% = ekspektasi cut Q1-2027 menguat (GBP down).",
      scenarios: [
        { label: "\u2265 3,1%", effect: "BoE hawkish \u2192 GBP naik.", dir: "up", cur: "GBP" },
        { label: "2,7 \u2013 3,0% (base)", effect: "BoE hold \u2192 GBP netral.", dir: "flat", cur: "GBP" },
        { label: "< 2,5%", effect: "Ruang cut \u2192 GBP turun.", dir: "down", cur: "GBP" }
      ]
    },
    drivers: [
      { name: "Harga pangan & energi", detail: "Inggris sensitif terhadap impor energi & pangan; lonjakan harga gas (Ofgem price cap) langsung menaikkan inflasi.", data: "CPI Juli 2026: 2,9% YoY (Juni 2,6%) \u2014 naik karena kenaikan price cap energi Ofgem 13%; inflasi energi 9,8%. Core tetap 2,6%.", src: SRC.onsCpi },
      { name: "Upah Inggris", detail: "Pasar kerja Inggris masih ketat, menaikkan upah dan inflasi jasa (inflasi jasa Juli: 3,4%).", src: SRC.onsCpi },
      { name: "Permintaan domestik & sterling", detail: "Konsumsi & revisi harga di sektor jasa; pound yang lemah menaikkan biaya impor.", src: SRC.onsCpi }
    ],
    expertViews: [
      { desk: "BoE Watcher", view: "Inflasi Inggris yang lebih 'sticky' daripada mitranya membuat BoE lebih lambat memangkas suku bunga \u2014 mendukung GBP.", signal: "UK CPI tinggi = GBP up." },
      { desk: "FX Strategist", view: "Perbedaan laju inflasi & kebijakan antara BoE dan The Fed adalah mesin utama GBP/USD.", signal: "Watch BoE vs Fed divergence." }
    ],
    outlook: "Inflasi UK kembali naik ke 2,9% (Juli 2026) \u2014 didorong price cap energi Ofgem, sementara core tetap 2,6% (di bawah target). BoE di 3,75% akan menghadapi dilema di rapat September 2026: headline yang panas vs core yang jinak. Pasar besar kemungkinan memperkirakan hold. Jika inflasi energi ikut mereda (Brent turun) dan upah melambat, BoE bisa mulai memotong di Q1-2027 \u2192 GBP perlahan bearish. Sebaliknya, CPI >3,0% dua bulan beruntun akan mempertahankan narasi 'BoE lebih hawkish dari Fed' \u2192 GBP/USD terangkat.",
    scenarios: [
      { label: "Di atas konsensus", effect: "BoE hawkish \u2192 GBP naik.", dir: "up", cur: "GBP" },
      { label: "Sesuai konsensus", effect: "Netral; fokus ke core.", dir: "flat", cur: "GBP" },
      { label: "Di bawah konsensus", effect: "Ruang cut BoE \u2192 GBP turun.", dir: "down", cur: "GBP" }
    ],
    watch: ["Keputusan BoE", "Data upah UK", "Harga energi & price cap Ofgem"]
  },
  uk_unemp: {
    read: [
      "Tingkat pengangguran Inggris (ONS, bulanan; 3-bulan rolling).",
      "Sering rilis bersamaan dengan data upah & klaim.",
      "Dampak ke GBP moderat \u2014 BoE juga sangat fokus ke inflasi."
    ],
    forecast: {
      next: "Pertengahan September (ONS, diperkirakan \xB118 Sep \xB7 01:00 WIB)",
      obs: "Juli 2026 (3-bulan rolling)",
      prev: "4,9% (Jun)",
      con: "\xB14,9% (estimasi pasar)",
      range: "4,8 \u2013 5,1%",
      basis: "Pasar kerja Inggris mode 'low-hire, low-fire': unemp stabil 4,9% tapi upah (ex bonus) masih ~4% YoY \u2014 menjaga inflasi jasa 3,4% dan memberi BoE alasan tidak longgar. Base case Juli: 4,8\u20135,0%. Lonjakan >5,1% = awal skenario cut BoE (2027, GBP bearish); \u22644,7% = pasar kerja mengetat (GBP terdukung).",
      scenarios: [
        { label: "\u2264 4,7%", effect: "Pasar kerja ketat \u2192 BoE tahan ketat \u2192 GBP naik.", dir: "up", cur: "GBP" },
        { label: "4,8 \u2013 5,0% (base)", effect: "Stabil \u2192 netral.", dir: "flat", cur: "GBP" },
        { label: "\u2265 5,1%", effect: "Perlambatan \u2192 ekspektasi cut \u2192 GBP turun.", dir: "down", cur: "GBP" }
      ]
    },
    drivers: [
      { name: "Pasar kerja UK", detail: "Kondisi pasar kerja Inggris, termasuk tingkat partisipasi & low-pay work.", data: "Juni 2026: 4,9% (3-bulan rolling) \u2014 stabil; upah (ex bonus) tetap tumbuh ~4% YoY.", src: SRC.onsJobs },
      { name: "Siklus ekonomi", detail: "Fase ekspansi menurunkan pengangguran; ekonomi UK 2026 diproyeksikan hanya ~0,9% \u2014 zona rapuh.", src: SRC.onsJobs },
      { name: "Kebijakan BoE", detail: "Suku bunga 3,75% menekan permintaan kredit & rekrutmen.", src: SRC.onsJobs }
    ],
    expertViews: [
      { desk: "UK Economist", view: "Pengangguran rendah + upah naik = inflasi bertahan \u2192 BoE ketat \u2192 GBP kuat.", signal: "Unemp rendah & wages up = GBP up." }
    ],
    outlook: "Pasar kerja Inggris dalam mode 'low-hire, low-fire' seperti AS: pengangguran stabil 4,9% tetapi pertumbuhan upah yang kuat (~4%) menjaga inflasi jasa tetap 3,4%. Selama pola ini bertahan, BoE tidak punya alasan longgar \u2014 netral-bullish GBP. Risiko: pertumbuhan ekonomi 0,9% yang terlalu tipis bisa memicu lonjakan pengangguran ke 5,3%+ pada 2027, yang akan menjadi katalis pemangkasan BoE lebih awal (bearish GBP).",
    scenarios: [
      { label: "Turun (pasar kerja ketat)", effect: "BoE tahan ketat \u2192 GBP naik.", dir: "up", cur: "GBP" },
      { label: "Stabil", effect: "Netral.", dir: "flat", cur: "GBP" },
      { label: "Naik (perlambatan)", effect: "BoE dovish \u2192 GBP turun.", dir: "down", cur: "GBP" }
    ],
    watch: ["Upah UK (ex bonus)", "Keputusan BoE", "UK CPI"]
  },
  jp_cpi: {
    read: [
      "Indeks harga konsumen Jepang (MOF), YoY \u2014 Tokyo & nasional.",
      "Menjadi penentu kebijakan normalisasi Bank of Japan (BoJ).",
      "Target inflasi BoJ: 2% (dengan upah riil positif)."
    ],
    forecast: {
      next: "Akhir September (CPI Tokyo, diperkirakan \xB129 Sep) & awal Oktober (nasional, diperkirakan \xB13 Okt)",
      obs: "Agustus 2026 (y/y)",
      prev: "Core Tokyo bertahan 2,5\u20133% (kondisi BoJ)",
      con: "Core Tokyo 2,5 \u2013 3,0% (estimasi pasar)",
      range: "2,0 \u2013 3,2%",
      basis: "Normalisasi BoJ berjalan (suku bunga kini 1,00%). Syarat kenaikan berikutnya: inflasi core Tokyo bertahan di zona 2,5\u20133%. Tiap kenaikan BoJ = katalis bullish JPY paling diandalkan \u2014 apalagi selisih suku bunga AS\u2013Jepang menyempit (US10Y 4,7% vs JGB10Y ~1,5\u20132%) sehingga carry USD/JPY perlahan kehilangan daya tarik. Risiko: yen menguat terlalu cepat (USD/JPY jebol ~150) bisa memaksa BoJ berhenti (efek umpan balik).",
      scenarios: [
        { label: "Core Tokyo \u2265 3%", effect: "BoJ naik lebih cepat \u2192 JPY naik tajam.", dir: "up", cur: "JPY" },
        { label: "2 \u2013 3% (base)", effect: "Normalisasi bertahap \u2192 JPY naik pelan.", dir: "flat", cur: "JPY" },
        { label: "< 2%", effect: "BoJ tertahan \u2192 JPY tertekan.", dir: "down", cur: "JPY" }
      ]
    },
    drivers: [
      { name: "Harga impor (energi & pangan)", detail: "Jepang sangat bergantung impor; yen lemah membuat impor mahal \u2192 inflasi naik tapi daya beli turun.", data: "BoJ telah menaikkan suku bunga ke 1,00% (2026) \u2014 proses normalisasi berlanjut mengikuti inflasi yang bertahan di atas 2%.", src: SRC.mofJp },
      { name: "Upah Jepang (shuntou)", detail: "Kenaikan upah yang berkelanjutan (musim semi/shuntou) diperlukan agar inflasi 'sehat' dan konsumsi pulih.", src: SRC.mofJp },
      { name: "Faktor yen (passthrough)", detail: "Yen yang lemah menaikkan biaya impor, mendorong inflasi namun menekan daya beli rumah tangga.", src: SRC.mofJp }
    ],
    expertViews: [
      { desk: "BoJ Watcher", view: "Inflasi Jepang menetap di atas target memaksa BoJ menaikkan suku bunga \u2014 langkah 'normalisasi' yang menguatkan JPY.", signal: "Normalisasi BoJ = JPY up." },
      { desk: "FX Strategist", view: "Intervensi Menteri Keuangan sering muncul saat yen melemah tajam \u2014 perhatikan risiko intervensi.", signal: "Watch intervensi yen." }
    ],
    outlook: "Normalisasi BoJ sudah dimulai (suku bunga kini 1,00%) dan akan berlanjut selagi inflasi inti Tokyo bertahan di 2,5\u20133%. Setiap kenaikan BoJ (diprediksi bertahap, total 25\u201350bp lagi pada 2026\u20132027) adalah katalis bullish JPY yang paling diandalkan analis, terutama terhadap USD & EUR. Namun JPY juga dibantu faktor lain: selisih suku bunga AS\u2013Jepang yang mulai menyempit (US10Y 4,73% vs JGB10Y masih ~1,5\u20132%) \u2014 selama The Fed tidak menaikkan lagi, carry trade USD/JPY perlahan kehilangan daya tarik. Risiko: yen terlalu cepat menguat bisa memaksa BoJ berhenti menaikkan (efek umpan balik).",
    scenarios: [
      { label: "CPI di atas 3%", effect: "BoJ cepat menaikkan \u2192 JPY naik tajam.", dir: "up", cur: "JPY" },
      { label: "CPI 2\u20133% (sesuai)", effect: "Normalisasi bertahap \u2192 JPY naik pelan.", dir: "flat", cur: "JPY" },
      { label: "CPI di bawah 2%", effect: "BoJ tertahan \u2192 JPY tertekan.", dir: "down", cur: "JPY" }
    ],
    watch: ["Keputusan BoJ", "Upah (shuntou)", "Intervensi yen", "USD/JPY level 160"]
  },
  eu_gdp: {
    read: [
      "Pertumbuhan ekonomi riil Zona Euro, kuartalan (flash \u2192 final).",
      "Flash estimate awal bulan; final 1,5 bulan kemudian.",
      "Baca revisi antar versi \u2014 pasar bereaksi ke kejutan, bukan level."
    ],
    forecast: {
      next: "Awal bulan (flash Q2, diperkirakan \xB11 Sep \xB7 14:00 CET)",
      obs: "Q2-2026 (q/q)",
      prev: "0,3% (Q1)",
      con: "\xB10,2\u20130,3% (estimasi pasar; proyeksi 2026 penuh 0,8%)",
      range: "0,0 \u2013 0,5%",
      basis: "EZ di zona stagnasi ringan: Q1 hanya 0,3% q/q, proyeksi 2026 penuh 0,8% \u2014 jauh di bawah AS. Jika flash Q2 \u22640% = risiko 'stagflasi ringan' terkonfirmasi (EUR down, tekanan dovish ke ECB meski inflasi tinggi); jika \u22650,5% = kejutan recovery (EUR up). Risiko utama EZ: energi (konflik Timur Tengah) & manufaktur lesu (permintaan China).",
      scenarios: [
        { label: "\u2265 0,5%", effect: "EZ pulih \u2192 EUR naik.", dir: "up", cur: "EUR" },
        { label: "0 \u2013 0,4% (base)", effect: "Stagnasi berlanjut \u2192 netral.", dir: "flat", cur: "EUR" },
        { label: "< 0%", effect: "Risiko stagnasi \u2192 EUR turun.", dir: "down", cur: "EUR" }
      ]
    },
    drivers: [
      { name: "Konsumsi & investasi Eropa", detail: "Belanja rumah tangga tertekan energi & suku bunga 2,40%; investasi ditopang program transisi hijau.", data: "Q1-2026: +0,3% annualized (melemah); proyeksi 2026: +0,8% (ECB) \u2014 jauh di bawah AS (2,1%).", src: SRC.eurostat },
      { name: "Ekspor (terutama ke Tiongkok)", detail: "Permintaan dari Tiongkok \u2014 yang sendiri dalam deflasi ringan \u2014 sangat memengaruhi industri manufaktur EZ.", src: SRC.eurostat },
      { name: "Kebijakan fiskal", detail: "Belanja negara & program investasi (terutama Jerman) mendorong pertumbuhan.", src: SRC.ecb }
    ],
    expertViews: [
      { desk: "EU Macro Strategist", view: "Zona Euro rentan stagnasi. GDP kuat = EUR menguat; pertumbuhan tipis memicu kekhawatiran dan melemahkan EUR.", signal: "EZ GDP kuat = EUR up." }
    ],
    outlook: "Risiko utama Zona Euro 2026 adalah stagnasi: proyeksi ECB hanya +0,8% (Q1 bahkan +0,3% annualized), tertahan guncangan energi dan manufaktur yang lesu. Jika GDP Q2\u2013Q3 ternyata negatif atau 0%, tekanan dovish ke ECB akan menguat \u2014 meski inflasi tinggi, 'stagflasi ringan' bisa memaksa ECB stop & cut di 2027 (bearish EUR). Sebaliknya, stimulus fiskal Jerman yang efektif + recovery manufaktur bisa mengejutkan ke atas (bullish EUR). Volatilitas EUR akan tinggi di sekitar rilis GDP flash.",
    scenarios: [
      { label: "Di atas konsensus (\u22650,5% q/q)", effect: "Ekonomi EZ pulih \u2192 EUR naik.", dir: "up", cur: "EUR" },
      { label: "Sesuai konsensus", effect: "Netral.", dir: "flat", cur: "EUR" },
      { label: "Di bawah konsensus (<0%)", effect: "Risiko stagnasi \u2192 EUR turun.", dir: "down", cur: "EUR" }
    ],
    watch: ["PMI Zona Euro", "Keputusan ECB", "Pertumbuhan China & AS", "Fiskal Jerman"]
  },
  china_cpi: {
    read: [
      "Indeks harga konsumen Tiongkok (NBS), YoY.",
      "Mencerminkan tekanan deflasi/inflasi ekonomi #2 dunia.",
      "PPI Tiongkok (deflasi industri) sering lebih penting bagi komoditas."
    ],
    forecast: {
      next: "Awal Oktober (diperkirakan \xB110 Okt \xB7 02:00 WIB)",
      obs: "Agustus 2026 (y/y)",
      prev: "0,5% (Jul \u2014 deflasi ringan berlanjut)",
      con: "\xB10,5% (estimasi pasar)",
      range: "0,2 \u2013 0,9%",
      basis: "China masih terjebak deflasi ringan (CPI Jul 0,5%, jauh di bawah target 2,5%) \u2014 memberi PBoC ruang terus melonggarkan (LPR 3,0%, lebih banyak cut & RRR) dan mendorong paket fiskal besar H2-2026. Skenario penting: CPI >1% + PPI keluar deflasi = 'reflasi terkonfirmasi' \u2192 rali AUD/NZD/CAD & tembaga. Sebaliknya CPI kembali 0% = panic stimulus (risk-off).",
      scenarios: [
        { label: "\u2265 1,0% (reflasi)", effect: "Permintaan global pulih \u2192 CNY naik, komoditas (AUD) naik.", dir: "up", cur: "CNY" },
        { label: "0,3 \u2013 0,8% (base)", effect: "Deflasi ringan berlanjut, easing berlanjut \u2192 netral.", dir: "flat", cur: "CNY" },
        { label: "\u2264 0,2%", effect: "Deflasi kembali \u2192 panic stimulus \u2192 CNY tertekan, risk-off.", dir: "down", cur: "CNY" }
      ]
    },
    drivers: [
      { name: "Permintaan domestik", detail: "Konsumsi & belanja rumah tangga Tiongkok (terlambat karena krisis properti) menentukan tekanan harga.", data: "CPI Juli 2026: +0,5% YoY \u2014 deflasi ringan berlanjut; konsumsi masih lesu pasca-krisis properti.", src: SRC.nbsCn },
      { name: "Harga pangan", detail: "Komponen pangan (terutama babi) besar dan volatil dalam CPI China.", src: SRC.nbsCn },
      { name: "Kebijakan stimulus", detail: "Pemerintah & PBoC melonggarkan kebijakan (LPR kini ~3,0%) untuk melawan deflasi; paket fiskal tambahan kemungkinan besar di H2-2026.", src: SRC.nbsCn },
      { name: "Sektor properti", detail: "Krisis properti menekan permintaan dan harga; pemulihannya penting bagi reflasi & harga tembaga.", src: SRC.nbsCn }
    ],
    expertViews: [
      { desk: "China Economist", view: "Deflasi di China memaksa stimulus agresif \u2192 mendukung CNY dan permintaan komoditas global.", signal: "Stimulus China = CNY & commodity up." },
      { desk: "Commodity Strategist", view: "Jika China berhasil reflasi, permintaan komoditas (tembaga, minyak) naik \u2014 menguntungkan AUD & CAD.", signal: "Reflasi China = AUD/CAD up." }
    ],
    outlook: "Tiongkok masih terjebak inflasi ~0,5% (Juli 2026) \u2014 jauh di bawah target 2,5%, yang memberi PBoC ruang terus melonggarkan (LPR 3,0%, lebih banyak cut & RRR di 2026) serta mendorong paket fiskal besar di H2-2026. Ini bullish CNY secara bertahap dan bullish komoditas (tembaga, minyak, batubara) jika stimulus efektif. Skenario penting: CPI kembali positif >1% + PPI keluar deflasi = 'reflasi terkonfirmasi' \u2192 rali AUD/NZD/CAD & emas. Sebaliknya, CPI kembali ke 0% (resesi-like) \u2192 panic stimulus tapi bearish risk assets.",
    scenarios: [
      { label: "CPI naik (reflasi)", effect: "Permintaan global pulih \u2192 CNY naik, komoditas (AUD) naik.", dir: "up", cur: "CNY" },
      { label: "Stabil ~0,5%", effect: "Netral; stimulus berlanjut.", dir: "flat", cur: "CNY" },
      { label: "Deflasi kembali", effect: "Panic stimulus \u2192 risk-off, CNY tertekan.", dir: "down", cur: "CNY" }
    ],
    watch: ["PPI Tiongkok", "Keputusan PBoC (LPR)", "Paket stimulus fiskal", "Data properti & penjualan ritel"]
  },
  wti: {
    read: [
      "Harga minyak mentah WTI per barel (NYMEX).",
      "Bergerak harian; sangat sensitif stok mingguan EIA (Rabu) & geopolitik.",
      "Pantau juga spread WTI\u2013Brent (kondisi pasar AS)."
    ],
    forecast: {
      next: "Bergerak HARIAN \u2014 laporan stok EIA mingguan Rabu 21:30 WIB",
      obs: "Harga spot (harian)",
      prev: "\xB1US$83,6 (30 Agu)",
      con: "\u2014",
      range: "September: 75 \u2013 90 US$",
      basis: "WTI ~83 dengan premium risiko geopolitik Timur Tengah yang belum pulih penuh. Dua jalur: (1) de-escalasi \u2192 75\u201380 \u2192 inflasi global mendingin (dovish semua bank sentral, bearish CAD/NOK, bullish importir JPY/EUR); (2) eskalasi \u2192 90+ \u2192 inflasi memanas lagi (hawkish, bullish CAD, bearish JPY). EIA mingguan (Rabu) penggerak jangka pendek; pantau produksi shale AS yang merespons harga >80.",
      scenarios: [
        { label: "\u2265 90", effect: "Inflasi naik \u2192 CAD/NOK naik, JPY/EUR turun.", dir: "up", cur: "CAD\xB7NOK" },
        { label: "80 \u2013 85 (base)", effect: "Premium risiko bertahan \u2192 netral.", dir: "flat", cur: "CAD\xB7NOK" },
        { label: "< 80", effect: "Inflasi mendingin \u2192 produsen minyak tertekan \u2192 CAD/NOK turun.", dir: "down", cur: "CAD\xB7NOK" }
      ]
    },
    drivers: [
      { name: "Penawaran OPEC+", detail: "Keputusan OPEC+ memangkas atau menambah produksi berdampak besar pada harga.", data: "WTI 30 Agu 2026: \u2248 US$83,4/barel (live) \u2014 masih tinggi akibat guncangan pasokan Timur Tengah; turun ~4,5% dari sebulan lalu.", src: SRC.eiaOil },
      { name: "Permintaan global", detail: "Permintaan dari ekonomi besar (China, AS, Eropa) menentukan konsumsi minyak; China kunci (lihat CPI deflasinya).", src: SRC.eiaOil },
      { name: "Geopolitik", detail: "Konflik & gangguan pasokan di kawasan produsen (Timur Tengah) menyebabkan lonjakan harga \u2014 faktor utama 2026.", src: SRC.eiaOil },
      { name: "Stok minyak AS (EIA)", detail: "Laporan stok mingguan (Rabu, 14:30 ET) memberi sinyal suplai-permintaan jangka pendek.", src: SRC.eiaOil }
    ],
    expertViews: [
      { desk: "Energy Strategist", view: "Minyak naik menguntungkan produsen (CAD, NOK) dan merugikan importir (JPY, EUR). Juga menaikkan inflasi global.", signal: "WTI up = CAD up, JPY down." },
      { desk: "Macro Desk", view: "Harga minyak memengaruhi inflasi & kebijakan bank sentral \u2014 lonjakan tajam bisa memicu hawkish bias.", signal: "Oil spike = inflation risk." }
    ],
    outlook: "Minyak di ~US$83 (Agu 2026) mencerminkan premium risiko geopolitik Timur Tengah yang belum pulih penuh. Dua jalur: (1) de-escalasi \u2192 stok menumpuk, harga turun ke 70\u201375 \u2192 inflasi global mendingin (dovish semua bank sentral, bearish CAD/NOK, bullish importir JPY/EUR); (2) eskalasi \u2192 90+ \u2192 inflasi kembali memanas (hawkish, bullish CAD, bearish JPY). Laporan EIA mingguan tetap penggerak jangka pendek; pantau juga produksi shale AS yang merespons harga >80.",
    scenarios: [
      { label: "Minyak melonjak", effect: "Inflasi naik \u2192 CAD/NOK naik, JPY/EUR turun.", dir: "up", cur: "CAD\xB7NOK" },
      { label: "Stabil", effect: "Netral.", dir: "flat", cur: "CAD\xB7NOK" },
      { label: "Minyak anjlok", effect: "Inflasi turun \u2192 produsen minyak tertekan.", dir: "down", cur: "CAD\xB7NOK" }
    ],
    watch: ["Laporan stok EIA (Rabu)", "Keputusan OPEC+", "Geopolitik Timur Tengah", "Permintaan China"]
  },
  brent: {
    read: [
      "Harga minyak mentah Brent per barel (ICE).",
      "Acuan harga minyak internasional (Eropa, Asia, Afrika).",
      "Selisih (spread) WTI\u2013Brent mencerminkan logistik & keseimbangan regional."
    ],
    forecast: {
      next: "Bergerak HARIAN \u2014 mengikuti WTI dengan premium \xB1US$6\u20138",
      obs: "Harga spot (harian)",
      prev: "\xB1US$91,4 (30 Agu)",
      con: "\u2014",
      range: "September: 80 \u2013 95 US$",
      basis: "Brent mengikuti WTI dengan premium stabil \u2014 pasar AS tidak surplus parah. Proyeksi H2-2026: 80\u201395, didorong disiplin suplai OPEC+ & rebound permintaan pasca-tensi. Level >95 = inflasi global memanas (hawkish global, bullish CAD, bearish JPY); <80 = angin segar bagi importir (EUR/JPY pulih) dan tekanan dovish ke bank sentral.",
      scenarios: [
        { label: "\u2265 95", effect: "Inflasi \u2192 CAD/NOK naik, JPY turun.", dir: "up", cur: "CAD\xB7NOK" },
        { label: "85 \u2013 95 (base)", effect: "Stabil \u2192 netral.", dir: "flat", cur: "CAD\xB7NOK" },
        { label: "< 80", effect: "Inflasi mendingin \u2192 CAD/NOK turun, JPY/EUR pulih.", dir: "down", cur: "CAD\xB7NOK" }
      ]
    },
    drivers: [
      { name: "Pasokan global & OPEC+", detail: "Produksi dan kebijakan kuota OPEC+ menentukan pasokan minyak dunia.", data: "Brent 30 Agu 2026: \u2248 US$89,3/barel (live) \u2014 premium ~US$6 di atas WTI (normal).", src: SRC.eiaOil },
      { name: "Permintaan global", detail: "Permintaan dari China, AS, & Eropa menggerakkan harga Brent; China ~1/3 impor minyak dunia.", src: SRC.eiaOil },
      { name: "Geopolitik & gangguan pasokan", detail: "Tensi di Timur Tengah & gangguan produksi memicu lonjakan harga.", src: SRC.eiaOil },
      { name: "Stok minyak (EIA/API)", detail: "Laporan stok mingguan memberikan petunjuk keseimbangan suplai-permintaan.", src: SRC.eiaOil }
    ],
    expertViews: [
      { desk: "Energy Strategist", view: "Brent acuan banyak kontrak Asia-Eropa. Naiknya minyak menguatkan CAD/NOK dan melemahkan JPY/EUR.", signal: "Brent up = CAD/NOK up." },
      { desk: "Commodity Analyst", view: "Selisih WTI\u2013Brent (spread) mencerminkan logistik & kondisi pasar regional; perhatikan penyempitan/pelebaran spread.", signal: "Watch WTI\u2013Brent spread." }
    ],
    outlook: "Brent ~US$89 mengikuti WTI dengan premium stabil (~US$6) \u2014 menandakan pasar AS tidak surplus parah. Dengan proyeksi permintaan 2026 yang didorong rebound pascatensi + pertumbuhan moderat, dan suplai OPEC+ yang disiplin, Brent diproyeksikan 80\u201395 sepanjang H2-2026. Level >90 = inflasi global memanas (hawkish global, bullish CAD, bearish JPY); <80 = angin segar bagi importir (EUR/JPY pulih) dan tekanan dovish ke bank sentral.",
    scenarios: [
      { label: "Brent naik (>90)", effect: "Inflasi \u2192 CAD/NOK naik, JPY turun.", dir: "up", cur: "CAD\xB7NOK" },
      { label: "Stabil (80\u201390)", effect: "Netral.", dir: "flat", cur: "CAD\xB7NOK" },
      { label: "Brent turun (<80)", effect: "Inflasi turun \u2192 CAD/NOK turun, JPY/EUR pulih.", dir: "down", cur: "CAD\xB7NOK" }
    ],
    watch: ["OPEC+", "Permintaan China", "Stok minyak EIA", "Spread WTI\u2013Brent"]
  },
  natgas: {
    read: [
      "Harga gas alam acuan Henry Hub per MMBtu (NYMEX).",
      "Bergerak harian; sangat musiman (musim dingin/panas).",
      "Laporan stok EIA tiap Kamis sangat menentukan."
    ],
    forecast: {
      next: "Bergerak HARIAN \u2014 laporan stok EIA mingguan Kamis 22:30 WIB",
      obs: "Harga spot Henry Hub (harian)",
      prev: "\xB1US$2,77 (30 Agu)",
      con: "\u2014",
      range: "September: 2,5 \u2013 3,2 US$/MMBtu",
      basis: "Gas US masih murah historis (~2,8) \u2014 produksi shale gas masif menjaga harga rendah sepanjang 2026. September diproyeksikan menguat ke 2,9\u20133,2 seiring awal musim pemanasan. Lonjakan ekstrem musim dingin (4\u20136) akan menaikkan biaya pemanasan & inflasi utilitas (bullish USD ringan), sementara waktu. Untuk FX, gas faktor sekunder \u2014 lebih ke sentimen energi & inflasi US.",
      scenarios: [
        { label: "\u2265 3,5 (musim dingin ekstrem)", effect: "Inflasi energi US naik \u2192 USD naik tipis.", dir: "up", cur: "USD" },
        { label: "2,5 \u2013 3,2 (base)", effect: "Pasokan murah \u2192 netral.", dir: "flat", cur: "USD" },
        { label: "< 2,5", effect: "Inflasi turun \u2192 USD turun tipis.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Musim & cuaca", detail: "Permintaan pemanasan (winter) & pendinginan (summer) sangat menentukan harga gas.", src: SRC.eiaGas },
      { name: "Produksi & stok gas AS", detail: "Stok mingguan EIA (injection/withdrawal) memengaruhi harga.", data: "Henry Hub 30 Agu 2026: \u2248 US$2,89/MMBtu (live) \u2014 level rendah historis akibat produksi shale gas masif.", src: SRC.eiaGas },
      { name: "Ekspor LNG", detail: "Ekspor LNG menyerap pasokan AS, menopang harga gas domestik.", src: SRC.eiaGas },
      { name: "Harga minyak & batu bara", detail: "Substitusi energi memengaruhi harga relatif gas.", src: SRC.eiaGas }
    ],
    expertViews: [
      { desk: "Energy Strategist", view: "Gas merupakan biaya input energi US. Harga naik menguatkan USD dan memengaruhi inflasi domestik.", signal: "Gas up = USD & energy up." },
      { desk: "Commodity Analyst", view: "Volatilitas gas sangat tinggi & musiman. Bisa jadi alat sentimen risiko namun bukan penggerak utama pair FX.", signal: "High vol; gunakan untuk sentimen." }
    ],
    outlook: "Gas US$2,89/MMBtu masih murah historis \u2014 produksi AS yang melimpah menjaga harga rendah sepanjang 2026. Lonjakan terjadi pada musim pendinginan (Nov\u2013Feb) jika cuaca dingin ekstrem: gas bisa 4\u20136 sementara, menaikkan biaya pemanasan rumah tangga & inflasi utilitas (bullish USD ringan). Untuk FX, gas adalah faktor sekunder; pengaruhnya lebih ke sentimen energi & inflasi US secara umum.",
    scenarios: [
      { label: "Gas melonjak (musim dingin ekstrem)", effect: "Inflasi energi US naik \u2192 USD naik tipis.", dir: "up", cur: "USD" },
      { label: "Stabil rendah", effect: "Netral.", dir: "flat", cur: "USD" },
      { label: "Gas turun", effect: "Inflasi turun \u2192 USD turun tipis.", dir: "down", cur: "USD" }
    ],
    watch: ["Stok gas EIA (Kamis)", "Cuaca/musim", "Ekspor LNG"]
  },
  copper: {
    read: [
      "Harga tembaga global per pound (COMEX) / per metrik ton (LME).",
      "Dianggap barometer kesehatan ekonomi dunia (indikator dini) \u2014 'Dr. Copper'.",
      "Korelasi kuat dengan aktivitas konstruksi, manufaktur & elektrifikasi."
    ],
    forecast: {
      next: "Bergerak HARIAN (COMEX/LME) \u2014 katalisnya stimulus China",
      obs: "Harga spot (harian)",
      prev: "\xB1US$6,56/lb (COMEX; +3,2% sebulan)",
      con: "\u2014",
      range: "September: 6,3 \u2013 7,0 US$/lb",
      basis: "Tembaga naik \u2014 kombinasi pasokan ketat + ekspektasi paket fiskal China H2-2026. Jika paket terealisasi & properti stabil: tembaga bisa 7+ (bullish AUD/NZD/CAD & sentimen risiko global). Risiko: resesi China (CPI kembali deflasi) \u2192 tembaga 5,5\u20135,8 \u2192 bearish mata uang komoditas. Pantau stok LME: stok turun + harga naik = permintaan riil, bukan spekulasi.",
      scenarios: [
        { label: "\u2265 7,0", effect: "Permintaan global kuat \u2192 AUD/NZD naik.", dir: "up", cur: "AUD\xB7NZD" },
        { label: "6,4 \u2013 6,8 (base)", effect: "Stabil \u2192 netral.", dir: "flat", cur: "AUD\xB7NZD" },
        { label: "< 5,8", effect: "Risiko resesi global \u2192 AUD/NZD turun.", dir: "down", cur: "AUD\xB7NZD" }
      ]
    },
    drivers: [
      { name: "Permintaan industri & China", detail: "Sebagian besar permintaan tembaga dari sektor konstruksi & manufaktur, terutama China \u2014 stimulus China = katalis utama.", data: "COMEX copper 30 Agu 2026: \u2248 US$6,56/lb (live) \u2014 +3,2% sebulan terakhir, didorong ekspektasi stimulus China.", src: SRC.lmeCopper },
      { name: "Investasi infrastruktur & elektrifikasi", detail: "Kendaraan listrik & jaringan listrik meningkatkan permintaan tembaga jangka panjang (EV butuh 3\u20134x tembaga vs mobil bensin).", src: SRC.lmeCopper },
      { name: "Pasokan tambang", detail: "Gangguan tambang & biaya produksi memengaruhi harga; pasokan global ketat jangka menengah.", src: SRC.lmeCopper },
      { name: "Kurs & stok bursa (LME)", detail: "Stok London Metal Exchange & harga dolar memengaruhi harga tembaga (dikalkulasikan dalam USD).", src: SRC.lmeCopper }
    ],
    expertViews: [
      { desk: "Metals Analyst", view: "Tembaga naik = permintaan global kuat \u2192 menguntungkan mata uang komoditas seperti AUD & NZD.", signal: "Copper up = AUD/NZD up." },
      { desk: "China Desk", view: "Karena China adalah konsumen terbesar, kebijakan stimulus & aktivitas properti China sangat menentukan arah tembaga.", signal: "Watch stimulus China." }
    ],
    outlook: "Tembaga di ~US$6,56/lb dengan tren naik \u2014 kombinasi pasokan ketat dan ekspektasi stimulus China H2-2026. Jika paket fiskal China terealisasi dan properti stabil, tembaga bisa 7+ pada 2027 (bullish AUD/NZD/CAD & sentimen risiko global). Risiko: resesi China (CPI kembali deflasi) \u2192 tembaga turun ke 5,5\u20135,8 \u2192 bearish mata uang komoditas. Pantau stok LME: penurunan stok + harga naik = sinyal permintaan riil, bukan spekulasi.",
    scenarios: [
      { label: "Tembaga naik (>7)", effect: "Permintaan global kuat \u2192 AUD/NZD naik.", dir: "up", cur: "AUD\xB7NZD" },
      { label: "Stabil", effect: "Netral.", dir: "flat", cur: "AUD\xB7NZD" },
      { label: "Tembaga turun (<5,8)", effect: "Risiko resesi global \u2192 AUD/NZD turun.", dir: "down", cur: "AUD\xB7NZD" }
    ],
    watch: ["Stimulus China", "Stok LME", "Data PMI manufaktur", "Aktivitas properti China"]
  },
  vix: {
    read: [
      "Indeks volatilitas/ketakutan pasar (CBOE), harian.",
      "Naik = pasar takut/volatile; turun = tenang. <15 tenang, 20\u201325 gelisah, >30 panic.",
      "Naiknya sering mendahului koreksi saham 2\u20135 hari."
    ],
    forecast: {
      next: "Bergerak HARIAN (CBOE)",
      obs: "Indeks harian",
      prev: "15,29 (30 Agu \u2014 tenang)",
      con: "\u2014",
      range: "September: 15 \u2013 25",
      basis: "VIX tenang (~15), tapi environment H2-2026 \u2014 Fed hawkish-on-hold, pasar kerja rapuh, geopolitik Timur Tengah \u2014 rawan spike di sekitar FOMC (17 Sep) & data kerja (4 Sep). Untuk trader forex: VIX >25 = hindari pair risiko (AUD, NZD, GBP), favor safe haven (USD, JPY, CHF, emas); VIX <18 = environment normal untuk strategi trend. VIX adalah filter, bukan sinyal arah.",
      scenarios: [
        { label: "> 25 (spike)", effect: "Risk-off \u2192 USD/JPY/CHF/emas naik, AUD/NZD turun.", dir: "up", cur: "USD" },
        { label: "15 \u2013 20 (base)", effect: "Normal \u2192 strategi standar.", dir: "flat", cur: "USD" },
        { label: "< 15", effect: "Risk-on \u2192 mata uang risiko pulih.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Sentimen risiko", detail: "Ketakutan & optimisme pasar menentukan level VIX.", src: SRC.cboeVix },
      { name: "Ketakutan krisis", detail: "Peristiwa besar (krisis, konflik, perang dagang) menyebabkan spike VIX.", src: SRC.cboeVix },
      { name: "Data makro besar", detail: "Rilis besar seperti FOMC & NFP (Juli 2026: kejutan NFP negatif) bisa memicu lonjakan volatilitas jangka pendek.", src: SRC.cboeVix }
    ],
    expertViews: [
      { desk: "Vol Strategist", view: "VIX tinggi = risk-off \u2192 aset aman (USD, JPY, CHF, emas) diburu; mata uang risiko (AUD, NZD, GBP) tertekan.", signal: "VIX spike = risk-off." },
      { desk: "Cross-Asset Strategist", view: "VIX adalah 'pengukur' suasana pasar. Pantau spike saat rilis hot sebagai penanda risiko & peluang.", signal: "Gunakan sebagai filter entry." }
    ],
    outlook: "Dengan The Fed 'hawkish on hold', pasar kerja yang rapuh, dan geopolitik Timur Tengah, volatilitas 2026H2 cenderung lebih tinggi dari 2025 \u2014 VIX kemungkinan sering menyentuh 20\u201325 di sekitar rilis FOMC & data kerja. Untuk trader forex: VIX >25 = hindari pair risk (AUD, NZD, GBP) & favor safe haven (USD, JPY, CHF, emas); VIX kembali <18 = environment normal untuk strategi trend. VIX adalah filter, bukan sinyal arah.",
    scenarios: [
      { label: "VIX spike (>25)", effect: "Risk-off \u2192 USD/JPY/CHF/emas naik, AUD/NZD turun.", dir: "up", cur: "USD\xB7JPY\xB7CHF" },
      { label: "Normal (15\u201320)", effect: "Netral; strategi standar.", dir: "flat", cur: "\u2014" },
      { label: "VIX rendah (<15)", effect: "Risk-on \u2192 mata uang risiko pulih.", dir: "down", cur: "USD\xB7JPY\xB7CHF" }
    ],
    watch: ["Rilis FOMC & data kerja", "Geopolitik", "Saham & obligasi (korelasi cross-asset)"]
  },
  ismmfg: {
    read: [
      "ISM Manufacturing PMI = indeks komposit sektor manufaktur AS dari survei purchasing managers (ISM, ratusan perusahaan).",
      "Di atas 50 = manufaktur berekspansi; di bawah 50 = berkontraksi.",
      "Dirilis hari kerja pertama tiap bulan, 10:00 ET (21:00 WIB saat DST) \u2014 sebelum pasar AS dibuka.",
      "Komponen penting: New Orders (leading), Production, Employment, Inventories, Prices Paid.",
      "Lebih bergejolak dari ISM Services \u2014 manufaktur \xB111% PDB AS, jadi bobotnya lebih kecil tapi cepat bereaksi."
    ],
    forecast: {
      next: "Selasa, 1 Sep 2026 \xB7 21:00 WIB (rilis TANGGAL INI)",
      obs: "Agustus 2026",
      prev: "55,6 (Jul \u2014 tertinggi 2026)",
      con: "55,2 (konsensus)",
      range: "53 \u2013 57",
      basis: "Juli akselerasi ke 55,6 (beat vs K 54,0) \u2014 momentum masih kuat. Agustus diproyeksikan sedikit melandai ke 55,2 (base 54\u201356). \u226555 = cerita pertumbuhan tetap utuh (USD terdukung); 53\u201355 = awal pelemahan momentum; <53 = perlambatan, <50 = alarm kontraksi (USD rentan). Watch subindeks New Orders: turun <50 = leading signal penurunan produksi.",
      scenarios: [
        { label: "\u2265 56", effect: "Manufaktur tetap akseleratif \u2192 bias hawkish bertahan \u2192 USD naik, yield naik.", dir: "up", cur: "USD" },
        { label: "53 \u2013 55 (base)", effect: "Momentum stabil \u2192 reaksi terbatas; pasar tunggu ISM Services 4 Sep.", dir: "flat", cur: "USD" },
        { label: "< 53", effect: "Manufaktur melambat \u2192 risiko resesi naik \u2192 USD turun, emas naik.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Permintaan (New Orders)", detail: "New Orders adalah komponen paling forward-looking: pesanan naik = pabrik menambah produksi & tenaga kerja. Pesanan turun biasanya mendahului pemangkasan produksi beberapa bulan.", data: "Des 47,9; Jan 52,6 (K 48,5 \u2014 beat besar); Feb 52,4 (K 51,7); Mar 52,7 (K 52,3); Apr 52,7; Mei 54,0 (K 53,3); Jun 53,3 (K 53,8); Jul 55,6 (K 54,0) \u2014 akselerasi sejak Januari.", src: SRC.ism },
      { name: "Kebijakan moneter & suku bunga", detail: "Suku bunga tinggi menaikkan biaya pinjaman modal kerja & investasi mesin \u2014 rem langsung bagi manufaktur. ISM bergerak cepat terhadap perubahan ekspektasi The Fed.", data: "Fed Funds 3,75% (FOMC 16 Sep 2026); Ketua Kevin Warsh menegaskan inflasi 3,4% 'belum cukup melambat'.", src: SRC.fed },
      { name: "Perdagangan global & tarif", detail: "Tarif menaikkan biaya input impor dan mengubah aliran pesanan ekspor. Manufaktur AS sangat terpapar pada China & Zona Euro.", data: "Meski ekonomi melambat, manufaktur bertahan di atas 50 (Juni 53,3) \u2014 lebih tahan banting dari sektor jasa dalam siklus ini.", src: SRC.ism },
      { name: "Biaya & harga (Prices Paid)", detail: "Subindeks harga pembayaran menunjukkan tekanan biaya input sebelum menular ke CPI. Naik = potensi inflasi lanjutan.", data: "Per Agustus 2026 tekanan harga masih terasa \u2014 konsisten dengan CPI yang tetap di 3,4%, jauh di atas target 2%.", src: SRC.ism }
    ],
    expertViews: [
      { desk: "FX Strategist (London)", view: "ISM Mfg adalah 'nadi pertumbuhan' \u2014 kejutan di atas 55 membuat pasar harga ulang The Fed ke arah hawkish; di bawah 48 memantik trade pemangkasan.", signal: "PMI > 55 = USD bullish; < 48 = USD bearish." },
      { desk: "Head of Global Macro (New York)", view: "Baca berpasangan dengan Services: manufaktur lemah tapi jasa tetap >54 = narasi 'soft landing', bukan resesi. Sebaliknya keduanya di bawah 50 = alarm.", signal: "Mfg < 50 + Svc > 53 = soft landing." },
      { desk: "Quant / Rates Desk", view: "Implied move di rilis ISM lebih kecil dari NFP/CPI (\xB115\u201325 pips EURUSD), tapi yield 2-tahun bereaksi cepat karena ini data pertumbuhan paling dini.", signal: "Pantau yield 2Y pasca-rilis." }
    ],
    outlook: "Per akhir Agustus 2026: manufaktur AS berekspansi dan justru mempercepat \u2014 Juli 55,6, beat konsensus 54,0 (Juni 53,3, Mei 54,0). Dengan The Fed 'on hold' di 3,75% dan inflasi lengket di 3,4%, momentum ini mengurangi risiko resesi manufaktur; pertanyaannya apakah beat Juli lanjutan atau spike sekali? Dua rilis beruntun di bawah 50 akan mendorong pasar ke mode 'Fed harus cut' \u2014 USD rentan. Selama bertahan di atas 53, cerita pertumbuhan USD tetap utuh; risikonya datang dari subindeks New Orders jika mulai turun di bawah 50.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Manufaktur lebih kuat \u2192 ekspektasi Fed hawkish bertahan \u2192 USD naik, yield naik.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Reaksi terbatas; pasar menunggu ISM Services beberapa hari kemudian.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Manufaktur melemah \u2192 risiko resesi + ekspektasi cut Fed \u2192 USD turun, emas naik.", dir: "down", cur: "USD" }
    ],
    watch: ["ISM Services PMI (beberapa hari kemudian)", "Keputusan FOMC 16 Sep 2026", "Subindeks New Orders", "Yield Treasury 2 tahun"]
  },
  ismsvc: {
    read: [
      "ISM Services PMI (Non-Manufacturing) = indeks komposit sektor jasa AS \u2014 \xB180% dari PDB.",
      "Di atas 50 = ekspansi. Karena jasanya dominan, ini leading indicator paling stabil utk ekonomi AS.",
      "Dirilis 3 hari kerja setelah ISM Manufacturing, 10:00 ET (21:00/22:00 WIB).",
      "Komponen penting: Business Activity, New Orders, Employment, Prices Received.",
      "Rilis Services sering menjadi 'rilis besar' bulan itu \u2014 bobotnya lebih besar daripada manufaktur."
    ],
    forecast: {
      next: "Kamis, 4 Sep 2026 \xB7 21:00 WIB (sehari setelah NFP)",
      obs: "Agustus 2026",
      prev: "54,1 (Jul)",
      con: "\xB154,0 (estimasi pasar)",
      range: "52 \u2013 56",
      basis: "Juli 54,1 = ekspansi solid, TAPI peringatan ada di komponen: Employment 47,4 (<50) dan dua rilis beruntun di bawah konsensus. Base case Agustus: stabil ~54. Yang paling penting: subindeks Employment \u2014 jika <47 = peringatan dini NFP (rilis hari yang sama); headline \u226555 dengan Prices Received >70 = cerita Fed hawkish berlanjut (USD up).",
      scenarios: [
        { label: "\u2265 55", effect: "Jasa solid \u2192 Fed tidak punya alasan cut \u2192 USD naik.", dir: "up", cur: "USD" },
        { label: "52 \u2013 54 (base)", effect: "Ekspansi berlanjut \u2192 netral; pasar baca Employment & Prices.", dir: "flat", cur: "USD" },
        { label: "< 52", effect: "Jasa melambat \u2192 ekspektasi cut menguat \u2192 USD turun.", dir: "down", cur: "USD" }
      ]
    },
    drivers: [
      { name: "Konsumsi rumah tangga", detail: "Sektor jasa adalah proksi langsung belanja konsumen (makanan, kesehatan, perjalanan, jasa keuangan). Services PMI kuat = konsumsi kuat = momentum GDP.", data: "Nov 52,6; Des 54,4 (K 52,2); Jan 53,8 (K 53,5); Feb 56,1 (K 53,5 \u2014 beat); Mar 54,0 (K 54,8); Apr 53,6 (K 53,7); Mei 54,5 (K 53,7); Jun 54,0 (K 54,2); Jul 54,1 (K 54,5) \u2014 ekspansi solid; dua rilis terakhir di bawah konsensus.", src: SRC.ism },
      { name: "Harga (Prices Received)", detail: "Subindeks harga diterima di atas 60\u201370 berarti bisnis jasa menaikkan harga \u2014 pendahulu CPI. Ini alasan The Fed membaca Services dengan saksama.", data: "Rilis 5 Agu 2026: Prices 70,3 \u2014 tekanan biaya tinggi, konsisten dengan CPI 3,4% yang jauh di atas target 2%.", src: SRC.ism },
      { name: "Subindeks Employment", detail: "Employment di bawah 50 berkepanjangan = peringatan dini PHK di sektor jasa \u2014 tempat mayoritas pekerjaan AS berada. Lebih cepat bicara dari pada NFP bulanan.", data: "Juli 2026: Employment 47,4 (konsensus 51,2) \u2014 di bawah 50, sejalan dengan pasar tenaga kerja yang mendingin (NFP Juli \u221223 ribu).", src: SRC.ism },
      { name: "Kebijakan The Fed", detail: "Sektor jasa adalah 'mandat kedua' The Fed dalam praktiknya: jasa kuat + inflasi lengket = pemangkasan ditunda. Kombinasi inilah yang menahan USD.", data: "Fed 3,75% dengan konsensus 'on hold ber ekor hawkish' menuju FOMC 16 Sep 2026.", src: SRC.fed }
    ],
    expertViews: [
      { desk: "FX Strategist (London)", view: "Services adalah angka yang lebih besar \u2014 80% PDB. Kejutan di atas 55 lebih menentukan arah USD daripada beat manufaktur.", signal: "Svc > 55 = USD bullish." },
      { desk: "Head of Global Macro (New York)", view: "Services di atas 54 dengan Prices di atas 70 = The Fed tidak punya alasan untuk cut. Itu kombinasi yang menopang dolar.", signal: "Svc tinggi + Prices tinggi = hawkish-friendly." },
      { desk: "Emerging Markets Macro", view: "Ekonomi jasa yang kuat menahan yield tinggi lebih lama \u2014 buruk bagi mata uang EM yang tertekan dolar.", signal: "Svc kuat = USD/EM naik." }
    ],
    outlook: "Per Agustus 2026: sektor jasa berada di ekspansi paling solid di antara indikator AS (Juli 54,1, naik dari 54,0) \u2014 tetapi dua komponen memberi peringatan: Employment 47,4 (di bawah 50, konsensus 51,2) dan dua rilis beruntun di bawah konsensus. Jika Employment turun di bawah 47 atau Business Activity menembus bawah 52, narasi 'soft landing' akan diuji dan USD rentan. Selama headline bertahan di atas 53 dengan Prices di atas 70, cerita Fed hawkish berlanjut dan USD tetap terdukung.",
    scenarios: [
      { label: "Di atas konsensus", effect: "Jasa lebih kuat \u2192 ekspektasi Fed hawkish \u2192 USD naik, yield naik, emas tertekan.", dir: "up", cur: "USD" },
      { label: "Sesuai konsensus", effect: "Netral; pasar membaca subindeks Employment & Prices.", dir: "flat", cur: "USD" },
      { label: "Di bawah konsensus", effect: "Jasa melambat \u2192 ekspektasi pemangkasan menguat \u2192 USD turun, EM & emas naik.", dir: "down", cur: "USD" }
    ],
    watch: ["ISM Manufacturing PMI", "Subindeks Employment", "FOMC 16 Sep 2026", "CPI core bulan berjalan"]
  }
};
function getEducation(id) {
  return EDUCATION[id] || null;
}

// data/calendar.js
function isDst(month) {
  return month >= 3 && month <= 10;
}
var FOMC_2026 = [
  { et: "2026-01-28", sep: false },
  { et: "2026-03-18", sep: true },
  { et: "2026-04-29", sep: false },
  { et: "2026-06-17", sep: true },
  { et: "2026-07-29", sep: false },
  { et: "2026-09-16", sep: true },
  // keputusan 16 Sep 14:00 ET → WIB 17 Sep 01:00
  { et: "2026-10-28", sep: false },
  { et: "2026-12-09", sep: true }
];
function fomcEvents() {
  const out = [];
  for (const f of FOMC_2026) {
    const m = Number(f.et.slice(5, 7));
    const dst = isDst(m);
    const t1 = dst ? "01:00" : "02:00";
    const t2 = dst ? "01:30" : "02:30";
    const d = /* @__PURE__ */ new Date(`${f.et}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    const date = d.toISOString().slice(0, 10);
    out.push({ date, time: t1, title: "FOMC Federal Funds Rate", category: "moneter", country: "US", impact: "High", indicatorId: "fedfunds" });
    if (f.sep) out.push({ date, time: t1, title: "FOMC Economic Projections", category: "moneter", country: "US", impact: "High", indicatorId: "fedfunds" });
    out.push({ date, time: t1, title: "FOMC Statement", category: "moneter", country: "US", impact: "High", indicatorId: "fedfunds" });
    out.push({ date, time: t2, title: "FOMC Press Conference", category: "moneter", country: "US", impact: "Medium", indicatorId: "fedfunds" });
  }
  return out;
}
var EVENTS = [
  ...fomcEvents(),
  // ---- NFP (Employment Situation) — 08:30 ET ----
  // ⚑ 30-Agu-2026: jadwal rilis NFP di kalender ini IRREGULER (validasi earningsapi:
  // 3 Jul-25, 5 Sep-25, 16 Des-25, 9 Jan-26, 11 Feb-26, 8 Mei-26, 5 Jun-26, 2 Jul-26).
  // Tanggal di bawah = ESTIMASI (belum terverifikasi API), masih pakai pola Jumat kedua.
  { date: "2026-09-04", time: "19:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-10-09", time: "19:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-11-13", time: "20:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-12-11", time: "20:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  // ---- ISM PMI — 10:00 ET ----
  // ⚑ 30-Agu-2026: jadwal rilis ISM IRREGULER (tervalidasi: Mfg 2 Jul-26, Svc 6 Jul-26
  // & 5 Agu-26). Tanggal di bawah = ESTIMASI (hari kerja pertama / +3 hari kerja).
  { date: "2026-10-26", time: "19:30", title: "Core PCE Price Index m/m", category: "inflasi", country: "US", impact: "High", indicatorId: "corepce" },
  { date: "2026-11-25", time: "19:30", title: "Core PCE Price Index m/m", category: "inflasi", country: "US", impact: "High", indicatorId: "corepce" },
  { date: "2026-10-28", time: "19:30", title: "GDP (Advance) q/q", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "gdp" },
  { date: "2026-11-25", time: "19:30", title: "GDP (Prelim) q/q", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "gdp" },
  { date: "2026-12-23", time: "19:30", title: "GDP (Final) q/q", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "gdp" },
  // ── Rilis sudah lewat (Jan–Mar 2026) — verified FF user; baris menampilkan P/K/A lengkap ──
  { date: "2026-01-05", time: "22:00", title: "ISM Manufacturing PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismmfg" },
  { date: "2026-01-07", time: "22:00", title: "ISM Services PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismsvc" },
  { date: "2026-01-07", time: "20:15", title: "ADP Non-Farm Employment Change", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "adp" },
  { date: "2026-01-09", time: "20:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-01-09", time: "22:00", title: "Prelim UoM Consumer Sentiment", category: "konsumen", country: "US", impact: "Medium", indicatorId: "umich" },
  { date: "2026-01-13", time: "20:30", title: "Consumer Price Index (CPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "cpi" },
  { date: "2026-01-14", time: "20:30", title: "Retail Sales m/m", category: "konsumen", country: "US", impact: "High", indicatorId: "retail" },
  { date: "2026-01-22", time: "22:00", title: "Core PCE Price Index (m/m)", category: "inflasi", country: "US", impact: "High", indicatorId: "corepce" },
  { date: "2026-02-02", time: "22:00", title: "ISM Manufacturing PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismmfg" },
  { date: "2026-02-04", time: "20:15", title: "ADP Non-Farm Employment Change", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "adp" },
  { date: "2026-02-04", time: "22:00", title: "ISM Services PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismsvc" },
  { date: "2026-02-06", time: "22:00", title: "Prelim UoM Consumer Sentiment", category: "konsumen", country: "US", impact: "Medium", indicatorId: "umich" },
  { date: "2026-02-10", time: "20:30", title: "Retail Sales m/m", category: "konsumen", country: "US", impact: "High", indicatorId: "retail" },
  { date: "2026-02-11", time: "20:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-02-13", time: "20:30", title: "Consumer Price Index (CPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "cpi" },
  { date: "2026-02-20", time: "20:30", title: "Core PCE Price Index (m/m)", category: "inflasi", country: "US", impact: "High", indicatorId: "corepce" },
  { date: "2026-03-02", time: "22:00", title: "ISM Manufacturing PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismmfg" },
  { date: "2026-03-04", time: "20:15", title: "ADP Non-Farm Employment Change", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "adp" },
  { date: "2026-03-04", time: "22:00", title: "ISM Services PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismsvc" },
  { date: "2026-03-06", time: "20:30", title: "Retail Sales m/m", category: "konsumen", country: "US", impact: "High", indicatorId: "retail" },
  { date: "2026-03-06", time: "20:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-03-11", time: "19:30", title: "Consumer Price Index (CPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "cpi" },
  { date: "2026-03-13", time: "19:30", title: "Core PCE Price Index (m/m)", category: "inflasi", country: "US", impact: "High", indicatorId: "corepce" },
  // ── Rilis sudah lewat (Jul–Agu 2026) — verified FF user; baris menampilkan P/K/A lengkap ──
  { date: "2026-07-01", time: "21:00", title: "ISM Manufacturing PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismmfg" },
  // ---- APR–JUN 2026 (diperbaiki 30 Agu 2026 — menutup gap R45; tanggal CONSENSUS
  //      terverifikasi API, waktu WIB dgn DST) ----
  { date: "2026-04-01", time: "19:15", title: "ADP Non-Farm Employment Change", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "adp" },
  { date: "2026-04-01", time: "19:30", title: "Retail Sales m/m", category: "konsumen", country: "US", impact: "High", indicatorId: "retail" },
  { date: "2026-04-01", time: "21:00", title: "ISM Manufacturing PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismmfg" },
  { date: "2026-04-03", time: "19:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-04-06", time: "21:00", title: "ISM Services PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismsvc" },
  { date: "2026-04-10", time: "19:30", title: "Consumer Price Index (CPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "cpi" },
  { date: "2026-04-10", time: "21:00", title: "Prelim UoM Consumer Sentiment", category: "konsumen", country: "US", impact: "Medium", indicatorId: "umich" },
  { date: "2026-04-21", time: "19:30", title: "Retail Sales m/m", category: "konsumen", country: "US", impact: "High", indicatorId: "retail" },
  { date: "2026-04-30", time: "19:30", title: "Core PCE Price Index (m/m)", category: "inflasi", country: "US", impact: "High", indicatorId: "corepce" },
  { date: "2026-05-05", time: "21:00", title: "ISM Services PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismsvc" },
  { date: "2026-05-08", time: "19:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-05-08", time: "21:00", title: "Prelim UoM Consumer Sentiment", category: "konsumen", country: "US", impact: "Medium", indicatorId: "umich" },
  { date: "2026-05-12", time: "19:30", title: "Consumer Price Index (CPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "cpi" },
  { date: "2026-05-14", time: "19:30", title: "Retail Sales m/m", category: "konsumen", country: "US", impact: "High", indicatorId: "retail" },
  { date: "2026-05-28", time: "19:30", title: "Core PCE Price Index (m/m)", category: "inflasi", country: "US", impact: "High", indicatorId: "corepce" },
  { date: "2026-06-01", time: "21:00", title: "ISM Manufacturing PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismmfg" },
  { date: "2026-06-03", time: "19:15", title: "ADP Non-Farm Employment Change", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "adp" },
  { date: "2026-06-04", time: "21:00", title: "ISM Services PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismsvc" },
  { date: "2026-06-05", time: "19:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-06-09", time: "19:30", title: "Consumer Price Index (CPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "cpi" },
  { date: "2026-06-12", time: "21:00", title: "Prelim UoM Consumer Sentiment", category: "konsumen", country: "US", impact: "Medium", indicatorId: "umich" },
  { date: "2026-06-16", time: "19:30", title: "Retail Sales m/m", category: "konsumen", country: "US", impact: "High", indicatorId: "retail" },
  { date: "2026-06-25", time: "19:30", title: "Core PCE Price Index (m/m)", category: "inflasi", country: "US", impact: "High", indicatorId: "corepce" },
  { date: "2026-07-02", time: "19:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-07-06", time: "21:00", title: "ISM Services PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismsvc" },
  { date: "2026-07-14", time: "19:30", title: "Consumer Price Index (CPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "cpi" },
  { date: "2026-07-15", time: "19:30", title: "Producer Price Index (PPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "ppi" },
  { date: "2026-07-30", time: "19:30", title: "Core PCE Price Index (m/m)", category: "inflasi", country: "US", impact: "High", indicatorId: "corepce" },
  { date: "2026-08-03", time: "21:00", title: "ISM Manufacturing PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismmfg" },
  { date: "2026-08-05", time: "21:00", title: "ISM Services PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismsvc" },
  { date: "2026-08-07", time: "19:30", title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "High", indicatorId: "nfp" },
  { date: "2026-08-12", time: "19:30", title: "Consumer Price Index (CPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "cpi" },
  { date: "2026-08-13", time: "19:30", title: "Producer Price Index (PPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "ppi" },
  { date: "2026-08-26", time: "19:30", title: "Core PCE Price Index (m/m)", category: "inflasi", country: "US", impact: "High", indicatorId: "corepce" },
  { date: "2026-08-26", time: "19:30", title: "GDP (Prelim) q/q", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "gdp" },
  { date: "2026-09-01", time: "21:00", title: "ISM Manufacturing PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismmfg" },
  { date: "2026-09-04", time: "21:00", title: "ISM Services PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismsvc" },
  { date: "2026-10-01", time: "21:00", title: "ISM Manufacturing PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismmfg" },
  { date: "2026-10-06", time: "21:00", title: "ISM Services PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismsvc" },
  { date: "2026-11-02", time: "22:00", title: "ISM Manufacturing PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismmfg" },
  { date: "2026-11-05", time: "22:00", title: "ISM Services PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismsvc" },
  { date: "2026-12-01", time: "22:00", title: "ISM Manufacturing PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismmfg" },
  { date: "2026-12-04", time: "22:00", title: "ISM Services PMI", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "ismsvc" },
  // ---- CPI AS — 08:30 ET ----
  { date: "2026-09-11", time: "19:30", title: "Consumer Price Index (CPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "cpi" },
  { date: "2026-10-14", time: "19:30", title: "Consumer Price Index (CPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "cpi" },
  { date: "2026-11-10", time: "20:30", title: "Consumer Price Index (CPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "cpi" },
  // ---- PPI AS — 08:30 ET (dampak: High) ----
  { date: "2026-09-10", time: "19:30", title: "Producer Price Index (PPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "ppi" },
  { date: "2026-10-15", time: "19:30", title: "Producer Price Index (PPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "ppi" },
  // ---- Core PCE Price Index m/m (indikator inflasi favorit The Fed) — 08:30 ET ----
  { date: "2026-09-30", time: "19:30", title: "Core PCE Price Index (m/m)", category: "inflasi", country: "US", impact: "High", indicatorId: "corepce" },
  // ---- Final GDP q/q — 08:30 ET ----
  { date: "2026-09-30", time: "19:30", title: "Final GDP (q/q)", category: "pertumbuhan", country: "US", impact: "High", indicatorId: "gdp" },
  // ---- Event pasar khusus (agenda simposium & pidato bank sentral) ----
  { date: "2026-08-28", time: "08:00", title: "Jackson Hole Symposium", category: "moneter", country: "US", impact: "High", indicatorId: "fedfunds" },
  { date: "2026-08-28", time: "21:00", title: "Prelim Benchmark Payrolls Revision", category: "tenaga-kerja", country: "US", impact: "Medium", indicatorId: "nfp" },
  { date: "2026-08-28", time: "21:30", title: "Fed Chairman Warsh Speaks", category: "moneter", country: "US", impact: "Medium", indicatorId: "fedfunds" },
  // ---- Indikator lain (patokan bulanan) ----
  { date: "2026-09-03", time: "19:30", title: "Initial Jobless Claims", category: "tenaga-kerja", country: "US", impact: "Medium", indicatorId: "claims" },
  { date: "2026-09-15", time: "19:30", title: "Retail Sales", category: "konsumen", country: "US", impact: "Medium", indicatorId: "retail" }
];
var UPCOMING = EVENTS.map((e) => ({ ...e, iso: `${e.date}T${e.time}:00+07:00` }));

// .smoke49-entry.jsx
var import_jsx_runtime7 = require("react/jsx-runtime");
var EB = class extends import_react4.Component {
  state = { err: null };
  static getDerivedStateFromError(e) {
    return { err: e };
  }
  render() {
    if (this.state.err) return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("pre", { id: "eb", children: String(this.state.err.message) });
    return this.props.children;
  }
};
function App({ id }) {
  const [p, setP] = (0, import_react5.useState)(null);
  (0, import_react5.useEffect)(() => {
    getReleaseAnalytics(id).then(setP);
  }, [id]);
  if (!p) return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { id: "loading", children: "\u2026" });
  const data = p;
  const cat = CATEGORIES.find((c) => c.id === data.category);
  const country = COUNTRIES.find((c) => c.id === data.country);
  const edu = getEducation(id);
  const upcoming = UPCOMING.filter((e) => e.indicatorId === id).sort((a, b) => a.iso.localeCompare(b.iso)).slice(0, 3);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(EB, { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    IndicatorClient,
    {
      data,
      releases: p.releases,
      accuracy: p.accuracy,
      source: p.source,
      edu,
      general: GENERAL,
      cat,
      country,
      upcoming
    }
  ) });
}
