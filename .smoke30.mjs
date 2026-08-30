// Round-30 smoke: SEMUA INDIKATOR list terminal — SSR + interaksi (jsdom)
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", {
  url: "http://localhost:3000/indicators", pretendToBeVisual: true,
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
const ssr = await realFetch("http://localhost:3000/indicators", { cache: "no-store" }).then((r) => r.text());
add("SSR 200 .ilt-term", ssr.includes("ilt-term"));
add("SSR judul ALL INDICATORS", ssr.includes("MACROLAB") && ssr.includes("INDICATORS"));
add("SSR chip KATEGORI/DAMPAK/NEGARA/URUT", ["KATEGORI", "DAMPAK", "NEGARA", "URUT"].every((t) => ssr.includes(t)));
add("SSR search", ssr.includes("cal-search"));
const ssrRows = (ssr.match(/<a class="ilt-row/g) || []).length;
add("SSR 27 baris indikator", ssrRows === 27, ssrRows);
add("SSR sparkline svg", ssr.includes("ilt-spark"));
add("SSR status bar", ssr.includes("ilt-term-foot"));
const cssHref = (ssr.match(/\/_next\/static\/css\/[^"]*\.css/) || [])[0];
const css = cssHref ? await realFetch(`http://localhost:3000${cssHref}`).then((r) => r.text()) : "";
add("CSS produksi .ilt-row", css.includes(".ilt-row"));
add("CSS produksi .ilt-r-imp", css.includes(".ilt-r-imp"));

// — 2) jsdom interaksi —
const React = (await import("react")).default;
const { createRoot } = await import("react-dom/client");
const { act } = await import("react");
const App = (await import("./.smoke30-bundle.mjs")).default;

const container = document.getElementById("root");
const root = createRoot(container);
await act(async () => { root.render(React.createElement(App)); });
await act(async () => { await new Promise((r) => setTimeout(r, 700)); });

const $$ = (s) => [...container.querySelectorAll(s)];
const click = (el) => act(async () => { el.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
const type = (el, v) => act(async () => {
  Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set.call(el, v);
  el.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
});
const rows = () => $$(".ilt-row");
const rowNames = () => rows().map((r) => r.querySelector(".ilt-r-name b")?.textContent || "");

add("data termuat (bukan loading)", !container.querySelector("#loading"));
const total = rows().length;
add("27 baris ter-render", total === 27, total);
add("LED N INDIKATOR", /27 INDIKATOR/.test(container.querySelector(".ilt-term-head .ct-led")?.textContent || ""), container.querySelector(".ilt-term-head .ct-led")?.textContent);
add("sparkline di tiap baris", $$(".ilt-spark").length === total && $$(".ilt-spark polyline").length === total, $$(".ilt-spark").length);
add("baris = link ke detail", rows()[0]?.getAttribute("href") === `/indicators/${rows()[0].querySelector(".ilt-r-name b") ? rows()[0].getAttribute("href").split("/")[2] : ""}` && rows().every((r) => (r.getAttribute("href") || "").startsWith("/indicators/")), rows()[0]?.getAttribute("href"));
add("default sort impact-desc (baris 1 = HIGH)", rows()[0].querySelector(".ilt-r-imp")?.classList.contains("im-high"));

const chips = $$(".cal-chip");
const byText = (t, n = 0) => chips.filter((c) => c.textContent === t)[n];

// filter DAMPAK HIGH
const nHigh = rows().filter((r) => r.querySelector(".ilt-r-imp")?.classList.contains("im-high")).length;
await click(byText("HIGH"));
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("filter HIGH → semua baris im-high", rows().length === nHigh && rows().every((r) => r.querySelector(".ilt-r-imp")?.classList.contains("im-high")), `${rows().length} vs ${nHigh}`);
await click(byText("SEMUA", 1)); // SEMUA baris DAMPAK (urutan: 0=KATEGORI, 1=DAMPAK, 2=NEGARA)
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("reset dampak → 27 baris", rows().length === 27, rows().length);

// filter KATEGORI
const catChip = byText("INFLASI");
await click(catChip);
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
const nCat = rows().length;
add("filter INFLASI → <27 baris", nCat > 0 && nCat < 27, nCat);
await click(byText("SEMUA", 0)); // SEMUA baris KATEGORI
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("reset kategori → 27 baris", rows().length === 27, rows().length);

// filter NEGARA US (17 seri US di lib/series)
await click(byText("US"));
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("negara US → 17 baris, semua sub berisi singkatan", rows().length === 17 && rows().every((r) => /·/.test(r.querySelector(".ilt-r-name i")?.textContent || "")), rows().length);
await click(byText("SEMUA", 2));
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });

// urutan NAMA A→Z
await click(byText("NAMA A→Z"));
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
const names = rowNames();
add("urut A→Z benar", names.every((n, i) => i === 0 || names[i - 1].localeCompare(n) <= 0), `${names[0]} … ${names[names.length - 1]}`);
await click(byText("DAMPAK ↓"));
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });

// pencarian
const searchEl = container.querySelector(".cal-search input");
await type(searchEl, "CPI");
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("search CPI → ≥1 baris & semua cocok (nama/singkatan)", rows().length >= 1 && rows().every((r) => /cpi/i.test((r.querySelector(".ilt-r-name b")?.textContent || "") + " " + (r.querySelector(".ilt-r-name i")?.textContent || ""))), rows().length);
await type(searchEl, "zzz-tidak-ada");
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("search kosong → .cal-empty", !!container.querySelector(".cal-empty") && rows().length === 0);
await type(searchEl, "");
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("reset search → 27 baris", rows().length === 27, rows().length);

// meta baris + footer
const meta02 = [...container.querySelectorAll(".ilt-term-sec .ct-block-meta")][1]?.textContent || "";
add("meta baris ter-update", /27 DARI 27/.test(meta02), meta02);
add("footer status", /N: 27\/27/.test(container.querySelector(".ilt-term-foot")?.textContent || ""));

let pass = 0;
for (const c of checks) {
  if (c.ok) pass++;
  else console.log("FAIL:", c.name, c.detail !== undefined ? `(${c.detail})` : "");
}
console.log(`SMOKE-30: ${pass}/${checks.length} PASS`);
process.exit(pass === checks.length ? 0 : 1);
