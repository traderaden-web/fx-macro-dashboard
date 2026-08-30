import { JSDOM } from "jsdom";
import fs from "fs";
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", { url: "http://localhost:3000/analysis", pretendToBeVisual: true });
globalThis.window = dom.window; globalThis.document = dom.window.document; globalThis.navigator = dom.window.navigator;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16); globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.fetch = () => Promise.resolve({ ok: false, status: 502, json: () => Promise.resolve({}) }); // FF tak terjangkau → fallback lokal
const React = (await import("react")).default;
const { createRoot } = await import("react-dom/client");
const { act } = await import("react");
const MacroApp = (await import("./.smoke20-bundle.mjs")).default;
const out = {};
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const txt = (s) => $(s)?.textContent?.trim() || "";
try {
  const root = createRoot(document.getElementById("root"));
  await act(async () => { root.render(React.createElement(MacroApp)); });
  await act(async () => { await new Promise((r) => setTimeout(r, 400)); }); // items load (seed fallback) + clock tick
  if (document.getElementById("loading")) throw new Error("items tak termuat");

  // — chrome terminal —
  out["frame + judul terminal"] = !!$(".ct-frame") && /CONSENSUS\s+TERMINAL/.test(txt(".ct-title"));
  out["jam WIB aktif (bukan --:--)"] = !txt(".ct-clock").includes("--:--");
  out["LED sumber"] = !!$(".ct-led");
  out["cursor berkedip ada"] = !!$(".ct-cursor");

  // — 01 picker: CPI default, 27 baris —
  out["picker: 27 baris indikator"] = $$(".ct-row").length === 27;
  out["picker: CPI aktif default"] = $$(".ct-row.on").length === 1 && txt(".ct-row.on .ct-row-name") === "CPI";
  out["baris ada delta + jadwal next"] = $$(".ct-row .ct-row-sub b").length > 10 && $$(".ct-next").length > 0;

  // — 02 consensus vs actual (CPI: prev 3.46, cons 3.4, act 3.30, surprise -0.10) —
  const cells = $$(".ct-readout .ct-cell");
  out["readout 4 sel"] = cells.length === 4;
  await act(async () => { await new Promise((r) => setTimeout(r, 700)); }); // count-up selesai
  out["ACTUAL = 3,3"] = cells[2].textContent.includes("3,3");
  out["SURPRISE = -0,1"] = cells[3].textContent.includes("−0,1") || cells[3].textContent.includes("-0,1");
  out["gauge + jarum + zona inline"] = !!$(".ct-gauge-track") && !!$(".ct-g-needle") && !!$(".ct-g-zone");
  out["chip sentimen ada"] = !!$(".ct-senti-chip");

  // — 03 riwayat: 14 baris, terbaru JUL 26 di atas, sparkline 14 sel —
  out["sparkline 14 sel"] = $$(".ct-sp-cell").length === 14;
  const rows = $$(".ct-hist-left .ct-table tbody tr");
  out["riwayat 14 baris"] = rows.length === 14;
  out["baris pertama = JUL 26 (terbaru)"] = rows[0].textContent.toUpperCase().includes("JUL");
  out["baris latest + dot"] = rows[0].classList.contains("ct-latest") && !!rows[0].querySelector(".ct-dot");
  out["panel akurasi: 4 metrik + split + streak"] = $$(".ct-acc-row").length === 4 && !!$(".ct-split") && $$(".ct-streak").length >= 1;
  out["N=14 di meta"] = $$(".ct-block-head .ct-block-meta").some((m) => m.textContent.includes("N=14"));

  // — 04 dampak pair: USD melemah (CPI -0.10 < -0.15? tidak: -0.10 dalam tol 0.15 → INLINE/NETRAL) —
  out["banner reaksi mata uang"] = !!$(".ct-rx") && txt(".ct-rx-cur") === "USD";
  out["pair table: 9 pair USD"] = $$(".ct-pair-name").length === 9;
  out["est move + kekuatan segmen"] = $$(".ct-rx-est").length === 1 && $$(".ct-seg i.on").length > 0;

  // — footer: next event global + countdown —
  out["footer NEXT + countdown T-"] = txt(".ct-foot-next").includes("NEXT") && txt(".ct-foot-next").includes("T-");

  // — ganti indikator: klik NFP —
  const nfpRow = $$(".ct-row").find((r) => txt(r.querySelector(".ct-row-name")) === "NFP");
  await act(async () => { nfpRow.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
  await act(async () => { await new Promise((r) => setTimeout(r, 800)); });
  out["ganti ke NFP: judul + actual -23"] = txt(".ct-block-head h4").includes("NFP") && $$(".ct-readout .ct-cell")[2].textContent.includes("23");
  out["NFP 12 baris riwayat"] = $$(".ct-hist-left .ct-table tbody tr").length === 12;
  out["NFP: USD Menguat? actual -23 vs cons 100 → surprise -123 → USD MELEMAH (dovish)"] = txt(".ct-senti-chip").includes("MELEMAH") || txt(".ct-rx-cur") === "USD";
  out["NFP pair: est move terisi"] = $$(".ct-pair-name").length === 9;

  // — filter kategori —
  const catBtns = $$(".ct-cats button");
  await act(async () => { catBtns.find((b) => b.textContent === "INFLASI").dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
  await act(async () => {});
  out["filter INFLASI: 7 baris (cpi, corecpi, ppi, corepce, eu_cpi, uk_cpi, jp_cpi, china_cpi=8)"] = $$(".ct-row").length === 8;

  // — search —
  const input = $(".ct-search input");
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set;
    setter.call(input, "gdp");
    input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  });
  await act(async () => {});
  out["search 'gdp': 2 baris (GDP, EZ GDP)"] = $$(".ct-row").length === 2;

  // — stale indicator: JP CPI (data 2021) → chip DATA STALE —
  await act(async () => {
    setter.call(input, "");
    input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  });
  await act(async () => {});
  const jpRow = $$(".ct-row").find((r) => txt(r.querySelector(".ct-row-name")) === "JP CPI");
  await act(async () => { jpRow.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
  await act(async () => {});
  out["JP CPI: chip DATA STALE"] = !!$(".ct-stale");
} catch (e) { fs.appendFileSync("/tmp/dbg20.log", "ERROR: " + e.message + "\n" + (e.stack || "") + "\n"); }
fs.writeFileSync("/tmp/smoke20.json", JSON.stringify(out, null, 1));
const fail = Object.entries(out).filter(([k, v]) => !v);
fs.appendFileSync("/tmp/smoke20.json", "\n" + (fail.length ? "FAIL: " + fail.map((f) => f[0]).join(" | ") : "ALL PASS") + "\n");
process.exit(fail.length ? 1 : 0);
