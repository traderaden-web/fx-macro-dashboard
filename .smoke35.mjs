// Round-35 smoke: POPUP detail rilis (baris tabel riwayat) — SSR + interaksi
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", {
  url: "http://localhost:3000/analysis", pretendToBeVisual: true,
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
const ssr = await realFetch("http://localhost:3000/analysis", { cache: "no-store" }).then((r) => r.text());
add("SSR 200 terminal", ssr.includes("CONSENSUS") && ssr.includes("Riwayat Surprise"));
add("SSR baris tabel clickable", (ssr.match(/rm-clickable/g) || []).length >= 10, (ssr.match(/rm-clickable/g) || []).length);
add("SSR meta KLIK BARIS = DETAIL", ssr.includes("KLIK BARIS = DETAIL"));
add("SSR tanpa popup di awal", !ssr.includes("rm-modal"));
const cssHref = (ssr.match(/\/_next\/static\/css\/[^"]*\.css/) || [])[0];
const css = cssHref ? await realFetch(`http://localhost:3000${cssHref}`).then((r) => r.text()) : "";
add("CSS produksi .rm-modal + .rm-clickable", css.includes(".rm-modal") && css.includes(".rm-clickable"));

// — 2) jsdom —
const React = (await import("react")).default;
const { createRoot } = await import("react-dom/client");
const { act } = await import("react");
const App = (await import("./.smoke35-bundle.mjs")).default;

const container = document.getElementById("root");
const root = createRoot(container);
await act(async () => { root.render(React.createElement(App)); });
await act(async () => { await new Promise((r) => setTimeout(r, 1200)); });

const $$ = (s) => [...container.querySelectorAll(s)];
const click = (el) => act(async () => { el.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });

add("data termuat (bukan loading)", !container.querySelector("#loading"));
const histBlock = $$(".ct-block").find((b) => /Riwayat Surprise/.test(b.textContent));
const rows = () => $$(".rm-clickable");
add("tabel riwayat ≥10 baris clickable", rows().length >= 10, rows().length);
add("baris punya role=button + title", rows()[0]?.getAttribute("role") === "button" && !!rows()[0]?.getAttribute("title"));

// klik baris teratas (rilis terakhir)
await click(rows()[0]);
await act(async () => { await new Promise((r) => setTimeout(r, 400)); });
const modal = () => document.querySelector(".rm-modal"); // portal ke body
add("popup terbuka", !!modal());
add("portal: backdrop anak <body> (bukan dalam terminal)", !!document.querySelector("body > .rm-backdrop") && !container.querySelector(".rm-backdrop"));
add("popup a11y dialog", !!document.querySelector('[role="dialog"][aria-modal="true"]'));
add("body scroll terkunci", document.body.style.overflow === "hidden");
const head = modal()?.querySelector(".rm-head")?.textContent || "";
add("judul popup: INDIKATOR · TGL", /CPI · \d{2} [A-Z][a-z]{2} 2026/.test(head), head);
add("chip verdict ada", !!modal()?.querySelector(".rm-verdict"));
add("4 sel angka P/K/A/S", modal()?.querySelectorAll(".rm-readout .ct-cell").length === 4, modal()?.querySelectorAll(".rm-readout .ct-cell").length);
add("gauge kejutan di popup", !!modal()?.querySelector(".ct-g-needle"));
add("layout 2 kolom (rm-cols + 2 kartu)", !!modal()?.querySelector(".rm-cols") && modal()?.querySelectorAll(".rm-card").length === 2, modal()?.querySelectorAll(".rm-card").length);
const txt = modal()?.querySelector(".rm-txt")?.textContent || "";
add("narasi: tanggal panjang + nilai", /2026/.test(txt) && /\b\d/.test(txt) && /rilis/.test(txt.toLowerCase()), txt.slice(0, 80));
add("3 blok konteks indikator", modal()?.querySelectorAll(".rm-ctx > div").length === 3);
add("strip akurasi konsensus", /AKURASI KONSENSUS/.test(modal()?.textContent || "") && !!modal()?.querySelector(".rm-acc-this"));
add("footer link halaman indikator", modal()?.querySelector(".rm-link")?.getAttribute("href") === "/indicators/cpi");

// tutup ESC
await act(async () => { window.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
await act(async () => { await new Promise((r) => setTimeout(r, 120)); });
add("ESC menutup", !modal());
add("scroll dikembalikan", document.body.style.overflow === "");

// buka baris ke-3 → tabel pair (CPI punya pair) + tutup via ✕
await click(rows()[2]);
await act(async () => { await new Promise((r) => setTimeout(r, 300)); });
add("popup rilis ke-3 terbuka", !!modal());
add("tabel estimasi pair ada", modal()?.querySelectorAll(".rm-pair-wrap .ct-table tbody tr").length > 0, modal()?.querySelectorAll(".rm-pair-wrap .ct-table tbody tr").length);
await click(modal()?.querySelector(".cm-close"));
await act(async () => { await new Promise((r) => setTimeout(r, 120)); });
add("tombol ✕ menutup", !modal());

// keyboard: fokus baris + Enter
const r1 = rows()[1];
await act(async () => { r1.focus(); r1.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Enter", bubbles: true })); });
await act(async () => { await new Promise((r) => setTimeout(r, 200)); });
add("keyboard Enter membuka popup", !!modal());
await act(async () => { window.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
await act(async () => { await new Promise((r) => setTimeout(r, 120)); });
add("ESC menutup (lagi)", !modal());

// ganti indikator → popup masih berfungsi (NFP)
const nfpRow = $$(".ct-side .ct-row").find((b) => /NFP/.test(b.textContent));
await click(nfpRow);
await act(async () => { await new Promise((r) => setTimeout(r, 500)); });
const nfpRows = rows();
add("NFP: tabel riwayat ter-render", nfpRows.length >= 5, nfpRows.length);
await click(nfpRows[0]);
await act(async () => { await new Promise((r) => setTimeout(r, 300)); });
add("NFP: popup terbuka", /NFP ·/.test(document.querySelector(".rm-head")?.textContent || ""), document.querySelector(".rm-head")?.textContent);
await act(async () => { window.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
await act(async () => { await new Promise((r) => setTimeout(r, 120)); });
add("NFP: ESC menutup", !modal());

let pass = 0;
for (const c of checks) {
  if (c.ok) pass++;
  else console.log("FAIL:", c.name, c.detail !== undefined ? `(${c.detail})` : "");
}
console.log(`SMOKE-35: ${pass}/${checks.length} PASS`);
process.exit(pass === checks.length ? 0 : 1);
