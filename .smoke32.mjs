// Round-32 smoke: POPUP Detail Indikator — SSR + interaksi (jsdom)
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", {
  url: "http://localhost:3000/calendar", pretendToBeVisual: true,
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.navigator = dom.window.navigator;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
dom.window.ResizeObserver = globalThis.ResizeObserver;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const realFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = (u, o) =>
  String(u).includes("localhost") ? realFetch(u, o) : Promise.resolve({ ok: false, status: 502, json: () => Promise.resolve({}) });

const checks = [];
const add = (name, ok, detail) => checks.push({ name, ok: !!ok, detail });

// — 1) SSR —
const ssr = await realFetch("http://localhost:3000/calendar", { cache: "no-store" }).then((r) => r.text());
add("SSR 200 .cal-term", ssr.includes("cal-term"));
add("SSR tanpa modal di awal", !ssr.includes("cal-mo-modal"));
const cssHref = (ssr.match(/\/_next\/static\/css\/[^"]*\.css/) || [])[0];
const css = cssHref ? await realFetch(`http://localhost:3000${cssHref}`).then((r) => r.text()) : "";
add("CSS produksi .cal-mo-modal + head", css.includes(".cal-mo-modal") && css.includes(".cal-mo-head"));

// — 2) jsdom —
const React = (await import("react")).default;
const { createRoot } = await import("react-dom/client");
const { act } = await import("react");
const App = (await import("./.smoke32-bundle.mjs")).default;

const dstr = (days) => {
  const d = new Date(Date.now() + days * 86400000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const events = [
  { title: "Consumer Price Index (CPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "cpi", time: "19:30", iso: `${dstr(-1)}T19:30:00+07:00`, actual: "3.30", previous: "3.40", forecast: "3.40" },
  { title: "Retail Sales (JP)", category: "konsumen", country: "JP", impact: "Low", indicatorId: "retail", time: "10:00", iso: `${dstr(0)}T10:00:00+07:00` },
  { title: "Nonfarm Payrolls (NFP)", category: "tenaga-kerja", country: "US", impact: "Medium", indicatorId: "nfp", time: "16:30", iso: `${dstr(0)}T16:30:00+07:00` },
  { title: "Consumer Price Index (CPI)", category: "inflasi", country: "US", impact: "High", indicatorId: "cpi", time: "19:30", iso: `${dstr(0)}T19:30:00+07:00` },
  { title: "FOMC Federal Funds Rate", category: "moneter", country: "US", impact: "High", indicatorId: "fedfunds", time: "01:00", iso: `${dstr(1)}T01:00:00+07:00` },
];

const container = document.getElementById("root");
const root = createRoot(container);
await act(async () => { root.render(React.createElement(App, { events, ids: ["cpi", "retail", "nfp", "fedfunds"] })); });
await act(async () => { await new Promise((r) => setTimeout(r, 1200)); });

const $$ = (s) => [...container.querySelectorAll(s)];
const click = (el) => act(async () => { el.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });

add("data termuat (bukan loading)", !container.querySelector("#loading"));
add("5 baris ter-render", $$(".cal-row").length === 5, $$(".cal-row").length);

// expand baris NFP → klik tombol Detail indikator
const nfp = $$(".cal-row").find((r) => (r.querySelector(".cal-r-title")?.textContent || "").includes("Nonfarm Payrolls"));
await click(nfp);
await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
add("detail expand", nfp.closest(".cal-row-wrap").classList.contains("open"));
const btn = nfp.closest(".cal-row-wrap").querySelector("button.cal-d-link");
add("tombol Detail indikator ada (bukan link)", btn && btn.tagName === "BUTTON" && /Detail indikator/.test(btn.textContent), btn?.textContent);

await click(btn);
await act(async () => { await new Promise((r) => setTimeout(r, 1300)); }); // count-up terminal

const modal = container.querySelector(".cal-mo-modal");
add("popup terbuka (.cal-mo-modal)", !!modal);
add("popup a11y: dialog + aria-modal", !!container.querySelector('[role="dialog"][aria-modal="true"]'));
add("popup: judul NFP", /DETAIL INDIKATOR — NFP/.test(container.querySelector(".cal-mo-head")?.textContent || ""), container.querySelector(".cal-mo-head")?.textContent);
add("popup: terminal indikator di dalam", !!modal?.querySelector(".ind-term"));
add("popup: readout value terisi", /\d/.test(modal?.querySelector(".ind-readout-value")?.textContent || ""));
add("popup: cells P/K/A/S rilis terakhir", modal?.querySelectorAll(".ind-cell").length === 4, modal?.querySelectorAll(".ind-cell").length);
add("popup: tab edukasi ada", modal?.querySelectorAll(".ind-edu-tab").length >= 3);
add("popup: body scroll terkunci", document.body.style.overflow === "hidden");
add("popup: link halaman penuh (fallback)", modal?.querySelector(".cal-mo-note a")?.getAttribute("href") === "/indicators/nfp");

// tutup via ESC
await act(async () => { window.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
await act(async () => { await new Promise((r) => setTimeout(r, 120)); });
add("ESC menutup popup", !container.querySelector(".cal-mo-modal"));
add("scroll body dikembalikan", document.body.style.overflow === "");

// buka lagi → tutup via tombol ✕
await click(btn);
await act(async () => { await new Promise((r) => setTimeout(r, 100)); });
add("buka lagi OK", !!container.querySelector(".cal-mo-modal"));
await click(container.querySelector(".cal-mo-head .cm-close"));
await act(async () => { await new Promise((r) => setTimeout(r, 100)); });
add("tombol ✕ menutup", !container.querySelector(".cal-mo-modal"));

// buka lagi → tutup via klik backdrop
await click(btn);
await act(async () => { await new Promise((r) => setTimeout(r, 100)); });
await act(async () => { container.querySelector(".cal-mo-backdrop").dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
await act(async () => { await new Promise((r) => setTimeout(r, 100)); });
add("klik backdrop menutup", !container.querySelector(".cal-mo-modal"));

// regresi: filter tetap jalan setelah popup
const chipHigh = $$(".cal-chip").find((c) => c.textContent === "HIGH");
await click(chipHigh);
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("regresi: filter HIGH masih jalan", $$(".cal-row").length === 3 && $$(".cal-row").every((r) => r.querySelector(".cal-r-imp")?.classList.contains("im-high")), $$(".cal-row").length);

let pass = 0;
for (const c of checks) {
  if (c.ok) pass++;
  else console.log("FAIL:", c.name, c.detail !== undefined ? `(${c.detail})` : "");
}
console.log(`SMOKE-32: ${pass}/${checks.length} PASS`);
process.exit(pass === checks.length ? 0 : 1);
