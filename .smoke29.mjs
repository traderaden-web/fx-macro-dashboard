// Round-29 smoke: INDICATOR DETAIL terminal — SSR + interaksi (jsdom)
// jalankan: node .smoke29.mjs cpi | dgs10
import { JSDOM } from "jsdom";
const IND = process.argv[2] || "cpi";
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", {
  url: `http://localhost:3000/indicators/${IND}`, pretendToBeVisual: true,
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
const ssr = await realFetch(`http://localhost:3000/indicators/${IND}`, { cache: "no-store" }).then((r) => r.text());
add("SSR 200 .ind-term", ssr.includes("ind-term"));
add("SSR judul terminal", ssr.includes("MACROLAB") && /INDICATOR:&nbsp;|INDICATOR:/.test(ssr));
add("SSR readout value", ssr.includes("ind-readout-value"));
add("SSR panel NEXT RELEASE", ssr.includes("NEXT RELEASE"));
add("SSR chart svg", ssr.includes("chart-wrap") || ssr.includes("<svg"));
add("SSR 04 pemahaman", ssr.includes("ind-understand"));
add("SSR status bar", ssr.includes("ind-term-foot"));
const cssHref = (ssr.match(/\/_next\/static\/css\/[^"]*\.css/) || [])[0];
const css = cssHref ? await realFetch(`http://localhost:3000${cssHref}`).then((r) => r.text()) : "";
add("CSS produksi .ind-next-cd", css.includes(".ind-next-cd"));
add("CSS produksi .ind-gauge-needle", css.includes(".ind-gauge-needle"));
add("CSS produksi .ind-rows12", css.includes(".ind-rows12"));

// — 2) jsdom interaksi —
const React = (await import("react")).default;
const { createRoot } = await import("react-dom/client");
const { act } = await import("react");
const App = (await import("./.smoke29-bundle.mjs")).default;

const container = document.getElementById("root");
const root = createRoot(container);
await act(async () => { root.render(React.createElement(App, { id: IND })); });
await act(async () => { await new Promise((r) => setTimeout(r, 1400)); }); // load + count-up

const $$ = (s) => [...container.querySelectorAll(s)];
const click = (el) => act(async () => { el.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
const FULL = IND === "cpi"; // cpi: ada upcoming + releases + edu; dgs10: tanpa upcoming

add("data termuat (bukan loading)", !container.querySelector("#loading"));
add("judul terminal benar", /INDICATOR:\s*/.test(container.querySelector(".ind-term-title")?.textContent || ""), container.querySelector(".ind-term-title")?.textContent);
add("LED sumber ada", !!container.querySelector(".ind-term-head .ct-led"));
add("readout value terisi (count-up selesai)", /\d/.test(container.querySelector(".ind-readout-value")?.textContent || "") && !/^\s*—/.test((container.querySelector(".ind-readout-value")?.textContent || "").replace("AS-OF", "")));
add("stat Δ periode + Δ setahun ada", $$(".ind-stat").length === 3, $$(".ind-stat").length);

if (FULL) {
  const cd = container.querySelector(".ind-next-cd b")?.textContent || "";
  add("countdown NEXT rilis (CPI 11 Sep)", /^T-\d+d/.test(cd), cd);
  add("jadwal rilis tertera", /19:30 WIB/.test(container.querySelector(".ind-next-when")?.textContent || ""), container.querySelector(".ind-next-when")?.textContent);
  add("01 cells P/K/A/S (4 sel)", $$(".ind-cell").length === 4, $$(".ind-cell").length);
  add("gauge needle render", !!container.querySelector(".ind-gauge-needle"));
  add("strip akurasi ada", $$(".ind-acc-item").length >= 4, $$(".ind-acc-item").length);
  add("link analisis dampak", !!container.querySelector(".ind-linkrow a"));
} else {
  add("fallback NEXT: tanpa jadwal aktif", !!container.querySelector(".ind-next-none"));
  add("fallback pola rilis", /Pola rilis:/.test(container.querySelector(".ind-next-sched")?.textContent || ""));
}

// 02 · range tabs + chart
const rangeBtns = $$(".ind-range .cal-chip");
add("4 tab rentang", rangeBtns.length === 4, rangeBtns.length);
const pathD = () => container.querySelector(".chart-wrap path[stroke]")?.getAttribute("d") || "";
const segs = (d) => d ? (d.match(/L /g) || []).length + 1 : 0;
const before = segs(pathD());
await click(rangeBtns[0]); // 1T
await act(async () => { await new Promise((r) => setTimeout(r, 120)); });
const after = segs(pathD());
add("tab 1T memotong chart", after < before && after >= 4, `${before} → ${after}`);
await click(rangeBtns[3]); // SEMUA
await act(async () => { await new Promise((r) => setTimeout(r, 120)); });
add("tab SEMUA menampilkan semua titik", segs(pathD()) > before, `${segs(pathD())} vs ${before}`);

add("tabel 12 periode + bar", $$(".ind-row12").length === 12 && $$(".ind-row12-bar").length === 12, $$(".ind-row12").length);

if (FULL) {
  add("03 riwayat rilis (baris+bar)", $$(".ind-rel-row").length >= 2 && $$(".ind-rel-bar").length >= 2, $$(".ind-rel-row").length);
}

// 04 · pemahaman
add("04 tiga blok pemahaman", $$(".ind-understand > div").length === 3);

// 05 · edukasi — tab
const tabs = $$(".ind-edu-tab");
add("05 tab edukasi ada (≥3)", tabs.length >= 3, tabs.length);
const tabTexts = tabs.map((t) => t.textContent);
add("tab CARA MEMBACA default aktif", container.querySelector(".ind-edu-tab.on")?.textContent === "CARA MEMBACA" && $$(".ind-steps li").length >= 3);
const tOutlook = tabs.find((t) => t.textContent === "PROSPEK");
await click(tOutlook);
await act(async () => { await new Promise((r) => setTimeout(r, 80)); });
add("tab PROSPEK: outlook + skenario + pantau", !!container.querySelector(".ind-outlook-text") && $$(".ind-scen-row").length >= 2 && $$(".ind-watch-chip").length >= 2, `${$$(".ind-scen-row").length} skenario`);
const tDrivers = tabs.find((t) => t.textContent === "PENGERAK");
await click(tDrivers);
await act(async () => { await new Promise((r) => setTimeout(r, 80)); });
add("tab PENGERAK: driver + data riil + src", $$(".ind-driver").length >= 2 && $$(".ind-driver-data").length >= 1 && $$(".ind-driver-src").length >= 1, $$(".ind-driver").length);
if (tabTexts.includes("PAKAR")) {
  const tExperts = tabs.find((t) => t.textContent === "PAKAR");
  await click(tExperts);
  await act(async () => { await new Promise((r) => setTimeout(r, 80)); });
  add("tab PAKAR: expert card + signal", $$(".ind-expert").length >= 2 && $$(".ind-expert-signal").length >= 2, $$(".ind-expert").length);
}

// clock tick (jam WIB berubah per detik)
const c1 = container.querySelector(".term-clock")?.textContent;
await act(async () => { await new Promise((r) => setTimeout(r, 1200)); });
const c2 = container.querySelector(".term-clock")?.textContent;
add("jam WIB live tick", c1 && c2 && c1 !== c2, `${c1} → ${c2}`);

let pass = 0;
for (const c of checks) {
  if (c.ok) pass++;
  else console.log("FAIL:", c.name, c.detail !== undefined ? `(${c.detail})` : "");
}
console.log(`SMOKE-29[${IND}]: ${pass}/${checks.length} PASS`);
process.exit(pass === checks.length ? 0 : 1);
