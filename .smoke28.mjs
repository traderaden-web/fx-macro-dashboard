// Round-28 smoke: Release Calendar Terminal — SSR + interaksi (jsdom)
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", { url: "http://localhost:3000/calendar", pretendToBeVisual: true });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.navigator = dom.window.navigator;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const realFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = (url, opts) =>
  String(url).includes("localhost")
    ? realFetch(url, opts)
    : Promise.resolve({ ok: false, status: 502, json: () => Promise.resolve({}) });

const checks = [];
const add = (name, ok, detail) => checks.push({ name, ok: !!ok, detail });

// — 1) SSR via HTTP —
const ssr = await (await fetch("http://localhost:3000/calendar", { cache: "no-store" })).text();
add("SSR .cal-term", ssr.includes("cal-term"));
add("SSR 00 NEXT RELEASE", ssr.includes("NEXT RELEASE"));
add("SSR chips JENDELA/KATEGORI/DAMPAK", ssr.includes("TERKINI") && ssr.includes("KATEGORI") && ssr.includes("DAMPAK") && ssr.includes("NEGARA"));
add("SSR grup hari + baris", ssr.includes("cal-day-head") && ssr.includes("cal-row-wrap"));
add("SSR status bar", ssr.includes("MACROLAB") && /RELEASE\s+CALENDAR/.test(ssr));
add("SSR link indikator di DOM", /href="\/indicators\/[a-z]+"/.test(ssr));
const cssHref = (ssr.match(/\/_next\/static\/css\/[^"]*\.css/) || [])[0];
const css = cssHref ? await realFetch(`http://localhost:3000${cssHref}`).then((r) => r.text()) : "";
add("CSS produksi termuat", css.length > 10000, `${css.length}b`);
add("CSS produksi .cal-next-cd", css.includes(".cal-next-cd"));
add("CSS produksi .cal-d-grid", css.includes(".cal-d-grid"));
add("CSS produksi .cal-chip.on", css.includes(".cal-chip.on"));
add("CSS produksi .cal-row.is-next + is-past", css.includes(".cal-row.is-next") && css.includes(".cal-row.is-past"));

// — 2) jsdom interaksi —
const React = (await import("react")).default;
const { createRoot } = await import("react-dom/client");
const { act } = await import("react");
const App = (await import("./.smoke28-bundle.mjs")).default;

const container = document.getElementById("root");
const root = createRoot(container);
await act(async () => { root.render(React.createElement(App)); });
await act(async () => { await new Promise((r) => setTimeout(r, 80)); });

const $$ = (s) => [...container.querySelectorAll(s)];
const click = (el) => act(async () => { el.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
const type = (el, v) => act(async () => {
  Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set.call(el, v);
  el.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
});

add("hydrate: 6 baris", $$(".cal-row").length === 6, $$(".cal-row").length);
add("panel NEXT ada", $$(".cal-next").length === 1);
const cdTxt = () => container.querySelector(".cal-next-cd b")?.textContent || "";
add("countdown T- ter-render", /^T-/.test(cdTxt()), cdTxt());
add("row NEXT ditandai", $$(".cal-row.is-next").length === 1);

const chips = $$(".cal-chip");
const byText = (t, n = 0) => chips.filter((c) => c.textContent === t)[n];

await click(byText("HIGH"));
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("filter HIGH → 3 baris, semua im-high", $$(".cal-row").length === 3 && $$(".cal-row").every((r) => r.querySelector(".cal-r-imp")?.classList.contains("im-high")), $$(".cal-row").length);
await click(byText("SEMUA", 2)); // SEMUA baris DAMPAK
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("reset dampak → 6 baris", $$(".cal-row").length === 6, $$(".cal-row").length);

await click(byText("30 HARI")); // jendela = 30 hari ke depan (future-only)
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("jendela 30 hari (future) → 4 baris", $$(".cal-row").length === 4, $$(".cal-row").length);
await click(byText("TERKINI"));
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("jendela TERKINI → 6 baris", $$(".cal-row").length === 6, $$(".cal-row").length);

await click(byText("US"));
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("negara US → 4 baris", $$(".cal-row").length === 4, $$(".cal-row").length);
await click(byText("SEMUA", 3)); // SEMUA baris NEGARA
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("reset negara → 6 baris", $$(".cal-row").length === 6, $$(".cal-row").length);

await click(byText("INFLASI"));
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("kategori INFLASI → 2 baris", $$(".cal-row").length === 2, $$(".cal-row").length);
await click(byText("SEMUA", 1)); // SEMUA baris KATEGORI
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("reset kategori → 6 baris", $$(".cal-row").length === 6, $$(".cal-row").length);

await type(container.querySelector(".cal-search input"), "FOMC");
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("search FOMC → 1 baris", $$(".cal-row").length === 1, $$(".cal-row").length);
await type(container.querySelector(".cal-search input"), "zzz");
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("search tak ada → .cal-empty", !!container.querySelector(".cal-empty") && $$(".cal-row").length === 0);
await type(container.querySelector(".cal-search input"), "");
await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
add("reset search → 6 baris", $$(".cal-row").length === 6, $$(".cal-row").length);

const wrap = $$(".cal-row-wrap")[2]; // NFP hari ini (seriesId ada)
await click(wrap.querySelector(".cal-row"));
await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
add("expand → .open + aria-expanded", wrap.classList.contains("open") && wrap.querySelector(".cal-row").getAttribute("aria-expanded") === "true");
const dText = wrap.querySelector(".cal-d-grid")?.textContent || "";
add("detail 3 blok + isi", /APAKAH INI/.test(dText) && /MENGAPA PENTING/.test(dText) && /DAMPAK TERHADAP PAIR/.test(dText) && dText.length > 150, dText.slice(0, 70));
const foot = wrap.querySelector(".cal-d-foot")?.textContent || "";
add("detail foot: jadwal + 2 link", /JADWAL:/.test(foot) && foot.includes("Detail indikator") && foot.includes("Analisis dampak"), foot.slice(0, 90));
add("detail link indikator+analisis", wrap.querySelectorAll(".cal-d-link").length === 2 && wrap.querySelector(".cal-d-link").getAttribute("href") === "/indicators/nfp");
await click(wrap.querySelector(".cal-row"));
await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
add("collapse → tanpa .open", !wrap.classList.contains("open"));

const before = cdTxt();
await act(async () => { await new Promise((r) => setTimeout(r, 1200)); });
const after = cdTxt();
add("countdown live berubah", before && after && before !== after, `${before} → ${after}`);

let pass = 0;
for (const c of checks) {
  if (c.ok) pass++;
  else console.log("FAIL:", c.name, c.detail !== undefined ? `(${c.detail})` : "");
}
console.log(`SMOKE-28: ${pass}/${checks.length} PASS`);
process.exit(pass === checks.length ? 0 : 1);
