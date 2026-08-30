// Round-31 smoke: Kalender P/K/A — SSR + interaksi (jsdom)
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

// — 1) SSR via HTTP —
const ssr = await realFetch("http://localhost:3000/calendar", { cache: "no-store" }).then((r) => r.text());
add("SSR 200 .cal-term", ssr.includes("cal-term"));
const nP = (ssr.match(/<b class="m-p">/g) || []).length;
add("SSR ≥40 badge P dengan angka", nP >= 40, nP);
add("SSR badge K (konsensus cocok periode)", (ssr.match(/<b class="m-k">/g) || []).length >= 1);
add("SSR NFP baris memuat P -23", /Nonfarm Payrolls \(NFP\)[\s\S]{0,300}?<b class="m-p"><u>P<\/u>-23<\/b>/.test(ssr));
add("SSR FOMC baris memuat P 3,8", /FOMC Federal Funds Rate[\s\S]{0,300}?<b class="m-p"><u>P<\/u>3,8<\/b>/.test(ssr));
add("SSR footer sumber angka", ssr.includes("P: FRED") && ssr.includes("K/A: FOREXFACTORY LIVE"));
add("SSR note legenda P/K/A", ssr.includes("P = sebelum rilis"));
add("SSR hero menjelaskan P/K/A", /Setiap baris menampilkan <strong>P<\/strong>/.test(ssr));
const cssHref = (ssr.match(/\/_next\/static\/css\/[^"]*\.css/) || [])[0];
const css = cssHref ? await realFetch(`http://localhost:3000${cssHref}`).then((r) => r.text()) : "";
add("CSS produksi .m-a + .cal-d-data", css.includes(".m-a") && css.includes(".cal-d-data"));

// — 2) jsdom (data UPCOMING + enrich sama dengan page) —
const React = (await import("react")).default;
const { createRoot } = await import("react-dom/client");
const { act } = await import("react");
const App = (await import("./.smoke31-bundle.mjs")).default;

const container = document.getElementById("root");
const root = createRoot(container);
await act(async () => { root.render(React.createElement(App)); });
await act(async () => { await new Promise((r) => setTimeout(r, 80)); });

const $$ = (s) => [...container.querySelectorAll(s)];
const click = (el) => act(async () => { el.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
const rows = () => $$(".cal-row");

// pindah ke jendela SEMUA agar seluruh UPCOMING tampil
await click($$(".cal-chip").find((c) => c.textContent === "SEMUA"));
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("45 baris UPCOMING (jendela SEMUA)", rows().length === 45, rows().length);
add("setiap baris punya badge P", $$(".cal-r-metrics .m-p").length === 45, $$(".cal-r-metrics .m-p").length);

// baris lewat (20 = 17 FOMC 2026 yang sudah lewat + 3 event 28 Agu) → RELEASED + redup
const past = rows().filter((r) => r.classList.contains("is-past"));
add("20 baris lewat = is-past (17 FOMC lama + 3 event 28 Agu)", past.length === 20, past.length);
add("20 tag RELEASED di baris lewat", $$(".cal-released").length === 20, $$(".cal-released").length);
add("baris lewat tetap menampilkan P", past.every((r) => r.querySelector(".m-p")));

// baris NFP Sep 4: P -23, tanpa RELEASED, ada countdown
const nfp = rows().find((r) => (r.querySelector(".cal-r-title")?.textContent || "").includes("Nonfarm Payrolls (NFP)"));
add("NFP: P -23 & tanpa RELEASED & countdown", /-23/.test(nfp.querySelector(".m-p")?.textContent || "") && !nfp.querySelector(".cal-released") && /T-/.test(nfp.querySelector(".cal-r-cd")?.textContent || ""), nfp.querySelector(".cal-r-cd")?.textContent);

// NEXT panel: SEBELUMNYA + angka
const prev = container.querySelector(".cal-next-prev");
add("panel NEXT: SEBELUMNYA + angka", prev && /SEBELUMNYA:/.test(prev.textContent) && prev.querySelector("b")?.textContent.length > 0, prev?.textContent);

// expand baris Jackson Hole (ada P + K) → cal-d-data
const jh = rows().find((r) => (r.querySelector(".cal-r-title")?.textContent || "").includes("Jackson Hole"));
await click(jh);
await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
const dData = jh.closest(".cal-row-wrap")?.querySelector(".cal-d-data")?.textContent || "";
add("detail: baris angka P · K", /P 3,8/.test(dData) && /K 3,8/.test(dData), dData);
await click(jh);
await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
add("collapse kembali", !jh.classList.contains("open"));

// regresi filter
const chipHigh = $$(".cal-chip").find((c) => c.textContent === "HIGH");
await click(chipHigh);
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("regresi: filter HIGH → semua im-high", rows().length > 0 && rows().every((r) => r.querySelector(".cal-r-imp")?.classList.contains("im-high")), rows().length);

let pass = 0;
for (const c of checks) {
  if (c.ok) pass++;
  else console.log("FAIL:", c.name, c.detail !== undefined ? `(${c.detail})` : "");
}
console.log(`SMOKE-31: ${pass}/${checks.length} PASS`);
process.exit(pass === checks.length ? 0 : 1);
