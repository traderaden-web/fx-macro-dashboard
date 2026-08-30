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
// Validasi CPI vs FF (screenshot user 30 Agu 2026): data Jun → rilis 14 Jul 2026: A=3.5 K=3.8 P=4.2
const cpiJul = rows().find((tr) => tr.textContent.includes("14 JUL 26"));
add("CPI: baris 14 JUL 26 (data Jun) K=3,8 A=3,5 P=4,2 (FF)", !!cpiJul && cpiJul.textContent.includes("4,2") && cpiJul.textContent.includes("3,8") && cpiJul.textContent.includes("3,5"), cpiJul?.textContent.replace(/\s+/g," ").slice(0,80));
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
add("picker: NFP next = 11 Sep 19:30 (Jumat kedua)", !!$$(".ct-side .ct-row").find((b) => /NFP/.test(b.textContent) && /11 Sep 19:30/.test(b.textContent)), $$(".ct-side .ct-row").find((b) => /NFP/.test(b.textContent))?.textContent.replace(/\s+/g," ").slice(0,80));
const nfpRow = $$(".ct-side .ct-row").find((b) => /NFP/.test(b.textContent));
await click(nfpRow);
await act(async () => { await new Promise((r) => setTimeout(r, 500)); });
const nfpRows = rows();
add("NFP: tabel riwayat ter-render", nfpRows.length >= 5, nfpRows.length);
// Validasi data NFP vs earningsapi (ground truth user, cek 30 Agu 2026):
// ANCHOR: data APRIL 2026 → rilis 8 MEI 2026: A=115K, K=65K, P=185K
const nfpApr = nfpRows.find((tr) => tr.textContent.includes("MEI 26"));
add("NFP: baris data Apr (rilis 8 MEI 26) ada", !!nfpApr, nfpRows.map((t) => t.textContent.slice(0, 12)).join("|"));
add("NFP: baris 8 MEI 26 P=185 K=65 A=115 (anchor user)", !!nfpApr && ["185","65","115"].every((v) => nfpApr.textContent.includes(v)), nfpApr?.textContent.replace(/\s+/g," ").slice(0,60));
const nfpMay = nfpRows.find((tr) => tr.textContent.includes("JUN 26"));
add("NFP: baris data Mei (rilis 5 JUN 26) A=129 K=85 (FF: P baris 2 Jul)", !!nfpMay && nfpMay.textContent.includes("129") && nfpMay.textContent.includes("85"), nfpMay?.textContent.replace(/\s+/g," ").slice(0,60));
const nfpJun = nfpRows.find((tr) => tr.textContent.includes("JUL 26"));
const nfpJunCells = nfpJun ? [...nfpJun.querySelectorAll("td")].map((td) => td.textContent.trim()) : [];
add("NFP: baris 2 JUL 26 (data Jun) P=129 K=114 A=20 (revisi 57→20, FF 7 Agu)", nfpJunCells.includes("129") && nfpJunCells.includes("114") && nfpJunCells.includes("20"), nfpJunCells.join("|"));
const nfpJul = nfpRows.find((tr) => tr.textContent.includes("7 AGU 26"));
const nfpJulCells = nfpJul ? [...nfpJul.querySelectorAll("td")].map((td) => td.textContent.trim()) : [];
add("NFP: baris 7 AGU 26 (data Jul, FF) K=85 A=−23 P=20", nfpJulCells.includes("85") && nfpJulCells.includes("20") && nfpJulCells.some((v) => v.replace(/[−-]/, "") === "23"), nfpJulCells.join("|"));
await click(nfpRows[0]);
await act(async () => { await new Promise((r) => setTimeout(r, 300)); });
add("NFP: popup terbuka", /NFP ·/.test(document.querySelector(".rm-head")?.textContent || ""), document.querySelector(".rm-head")?.textContent);
await act(async () => { window.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
await act(async () => { await new Promise((r) => setTimeout(r, 120)); });
add("NFP: ESC menutup", !modal());

// ISM (indikator baru 30-Agu-2026, tervalidasi FF user + API):
const mfgRow = $$(".ct-side .ct-row").find((b) => /ISM Mfg/.test(b.textContent));
add("picker: ISM Mfg tersedia", !!mfgRow, $$(".ct-side .ct-row").map((b) => b.textContent.slice(0, 10)).join("|").slice(0, 140));
await click(mfgRow);
await act(async () => { await new Promise((r) => setTimeout(r, 500)); });
const mfgRows = rows();
const mfgJun = mfgRows.find((tr) => tr.textContent.includes("2 JUL 26"));
const mfgCells = mfgJun ? [...mfgJun.querySelectorAll("td")].map((td) => td.textContent.trim()) : [];
add("ISM Mfg: baris 2 JUL 26 (data Jun) P=54 K=53,8 A=53,3 (FF)", mfgCells.includes("53,3") && mfgCells.includes("53,8") && mfgCells.includes("54"), mfgCells.join("|"));
const mfgJul = mfgRows.find((tr) => tr.textContent.includes("3 AGU 26"));
const mfgJulCells = mfgJul ? [...mfgJul.querySelectorAll("td")].map((td) => td.textContent.trim()) : [];
add("ISM Mfg: baris 3 AGU 26 (data Jul) P=53,3 K=54 A=55,6 (FF)", mfgJulCells.includes("55,6") && mfgJulCells.includes("54") && mfgJulCells.includes("53,3"), mfgJulCells.join("|"));
const svcRow = $$(".ct-side .ct-row").find((b) => /ISM Svc/.test(b.textContent));
await click(svcRow);
await act(async () => { await new Promise((r) => setTimeout(r, 500)); });
const svcRows = rows();
const svcJul = svcRows.find((tr) => tr.textContent.includes("5 AGU 26"));
const svcCells = svcJul ? [...svcJul.querySelectorAll("td")].map((td) => td.textContent.trim()) : [];
add("ISM Svc: baris 5 AGU 26 (data Jul) P=54 K=54,5 A=54,1 (API)", svcCells.includes("54,1") && svcCells.includes("54,5") && svcCells.includes("54"), svcCells.join("|"));

// Core PCE & GDP (cross-check FF window 26-31 Agu 2026):
const pceRow = $$(".ct-side .ct-row").find((b) => /Core PCE/.test(b.textContent));
add("picker: Core PCE tersedia", !!pceRow, $$(".ct-side .ct-row").map((b) => b.textContent.slice(0, 10)).join("|").slice(0, 160));
await click(pceRow);
await act(async () => { await new Promise((r) => setTimeout(r, 500)); });
const pceRows = rows();
const pceJul = pceRows.find((tr) => tr.textContent.includes("26 AGU 26"));
const pceCells = pceJul ? [...pceJul.querySelectorAll("td")].map((td) => td.textContent.trim()) : [];
add("Core PCE: baris 26 AGU 26 (data Jul) P=0,1 K=0,2 A=0,2 (FF)", pceCells.includes("0,2") && pceCells.includes("0,1"), pceCells.join("|"));
const gdpRow = $$(".ct-side .ct-row").find((b) => /GDP/.test(b.textContent) && !/EZ|UK/.test(b.textContent));
add("picker: GDP (US) tersedia", !!gdpRow, $$(".ct-side .ct-row").filter((b) => /GDP/.test(b.textContent)).map((b) => b.textContent.slice(0, 12)).join("|"));
await click(gdpRow);
await act(async () => { await new Promise((r) => setTimeout(r, 500)); });
const gdpRows = rows();
const gdpJul = gdpRows.find((tr) => tr.textContent.includes("26 AGU 26"));
const gdpCells = gdpJul ? [...gdpJul.querySelectorAll("td")].map((td) => td.textContent.trim()) : [];
add("GDP: baris 26 AGU 26 (Q2 advance) P=1,5 K=1,5 A=1,5 (FF)", gdpCells.filter((v) => v === "1,5").length >= 2, gdpCells.join("|"));

let pass = 0;
for (const c of checks) {
  if (c.ok) pass++;
  else console.log("FAIL:", c.name, c.detail !== undefined ? `(${c.detail})` : "");
}
console.log(`SMOKE-35: ${pass}/${checks.length} PASS`);
process.exit(pass === checks.length ? 0 : 1);
