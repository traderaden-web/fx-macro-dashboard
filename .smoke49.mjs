// Round-49 smoke: tab PERKIRAAN RILIS di Edukasi Praktis — render bundle + interaksi klik
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost:3000/indicators/nfp", pretendToBeVisual: true,
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

const checks = [];
const add = (name, ok, detail) => checks.push({ name, ok: !!ok, detail });

const React = (await import("react")).default;
const { createRoot } = await import("react-dom/client");
const { act } = await import("react");
const __m = await import("./.smoke49-bundle.cjs");
const App = __m.default && __m.default.default ? __m.default.default : __m.default;

const $$ = (s, c) => [...(c || document.body).querySelectorAll(s)];
const click = (el) => act(async () => { el.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
const mount = async (id) => {
  const el = document.createElement("div");
  el.id = "app-" + id;
  document.body.appendChild(el);
  const root = createRoot(el);
  await act(async () => { root.render(React.createElement(App, { id })); });
  await act(async () => { await new Promise((r) => setTimeout(r, 2500)); });
  return el;
};

// — NFP —
const nfp = await mount("nfp");
add("nfp: termuat (bukan loading)", !nfp.querySelector("#loading"));
const tabBtn = (id) => [...nfp.querySelectorAll("button")].find((b) => b.textContent.includes("PERKIRAAN RILIS"));
add("nfp: tombol tab PERKIRAAN RILIS ada", !!tabBtn("nfp"));
add("nfp: konten forecast belum muncul sebelum klik", !nfp.querySelector(".ind-forecast"));
await click(tabBtn("nfp"));
await act(async () => { await new Promise((r) => setTimeout(r, 400)); });
const f = nfp.querySelector(".ind-forecast");
add("nfp: .ind-forecast muncul setelah klik", !!f);
if (f) {
  const t = f.textContent;
  add("nfp: tanggal rilis benar", t.includes("Kamis, 4 Sep 2026 · 19:30 WIB"), t.slice(0, 60));
  add("nfp: previous benar (−23 ribu Jul)", t.includes("−23 ribu (Jul; dirilis 7 Agu)"));
  add("nfp: konsensus benar (+58 ribu)", t.includes("+58 ribu (konsensus)"));
  add("nfp: range ada", t.includes("Base 0 – 120 ribu"));
  add("nfp: basis narasi ada", t.includes("Syok Juli"));
  add("nfp: 3 baris skenario", f.querySelectorAll(".ind-scen-row").length === 3, f.querySelectorAll(".ind-scen-row").length);
  add("nfp: arah skenario up/flat/down", ["up", "flat", "down"].every((d) => f.querySelector(".ind-scen-row." + d)));
  add("nfp: catatan sumber perkiraan", t.includes("Perkiraan disusun dari konsensus"));
}
// tab lain masih berfungsi setelah klik forecast
const readBtn = [...nfp.querySelectorAll("button")].find((b) => b.textContent.trim() === "CARA MEMBACA");
await click(readBtn);
await act(async () => { await new Promise((r) => setTimeout(r, 300)); });
add("nfp: kembali ke CARA MEMBACA (IRREGULER ter-render)", nfp.textContent.includes("IRREGULER") && !nfp.querySelector(".ind-forecast"));

// — ADP (tanpa jadwal) —
const adp = await mount("adp");
const adpTab = [...adp.querySelectorAll("button")].find((b) => b.textContent.includes("PERKIRAAN RILIS"));
add("adp: tombol tab ada", !!adpTab);
if (adpTab) {
  await click(adpTab);
  await act(async () => { await new Promise((r) => setTimeout(r, 400)); });
  add("adp: status TIDAK ADA JADWAL", adp.querySelector(".ind-forecast")?.textContent.includes("TIDAK ADA JADWAL"));
  add("adp: konteks data terakhir (Mei +122)", adp.querySelector(".ind-forecast")?.textContent.includes("+122 ribu (Mei"));
}

// — FOMC —
const ffc = await mount("fedfunds");
const ffcTab = [...ffc.querySelectorAll("button")].find((b) => b.textContent.includes("PERKIRAAN RILIS"));
add("fedfunds: tombol tab ada", !!ffcTab);
if (ffcTab) {
  await click(ffcTab);
  await act(async () => { await new Promise((r) => setTimeout(r, 400)); });
  add("fedfunds: tanggal FOMC 17 Sep", ffc.querySelector(".ind-forecast")?.textContent.includes("Rabu, 17 Sep 2026 · 01:00 WIB"));
  add("fedfunds: dot plot mentioned", ffc.querySelector(".ind-forecast")?.textContent.includes("dot median"));
}

let pass = 0;
for (const c of checks) {
  console.log((c.ok ? "PASS" : "FAIL") + "  " + c.name + (c.detail ? "  [" + c.detail + "]" : ""));
  if (c.ok) pass++;
}
console.log("SMOKE-49:", pass + "/" + checks.length + (pass === checks.length ? " PASS" : " FAIL"));
process.exit(pass === checks.length ? 0 : 1);
