// scripts/build-worldmap.mjs
// Regenerasi lib/worldMapData.js dari Natural Earth 50m (world-atlas).
// Proyeksi: equirectangular, viewBox 1000x500 (sama dengan versi 110m lama).
// - "COUNTRIES" = negara target (id ISO numeric) sebagai path terpisah (interaktif)
// - "OTHERS" = semua negara non-target digabung jadi satu path
// Thin: titik dibuang bila jaraknya < MIN_DIST unit dari titik terakhir yang disimpan.
// Jalankan: node scripts/build-worldmap.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";

const MIN_DIST = 0.45; // unit viewBox (≈0.16°)
const R1 = (v) => Math.round(v * 10) / 10;

const world = JSON.parse(readFileSync(new URL("../node_modules/world-atlas/countries-50m.json", import.meta.url), "utf8"));
const land = feature(world, world.objects.countries);

// id negara target — harus cocok dengan COUNTRY_NAMES versi sebelumnya
const TARGETS = [
  "124", "156", "191", "196", "233", "246", "250", "276", "300", "356", "372",
  "380", "392", "410", "428", "440", "442", "484", "528", "554", "620", "643",
  "703", "705", "710", "724", "756", "826", "840", "076", "040", "056", "036",
];

// equirectangular → viewBox 1000x500
const P = ([lon, lat]) => [R1(((lon + 180) / 360) * 1000), R1(((90 - lat) / 180) * 500)];

// Negara yang memiliki pulau di sisi +180° (Aleutian AS) → ring yang menyentuh
// tepi kanan peta dibuang agar tidak muncul "bintik error" di dekat NZ.
const CLIP_RIGHT = new Set(["840"]);

function ringToPath(ring, clipRight) {
  const pts = ring.map(P).filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]));
  if (pts.length < 3) return "";
  if (clipRight && pts.some(([x]) => x > 950)) return ""; // buang ring di sisi +180°
  // thin: simpan titik bila cukup jauh dari titik terakhir yang disimpan
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    const [px, py] = out[out.length - 1];
    if (Math.hypot(x - px, y - py) >= MIN_DIST) out.push([x, y]);
  }
  if (out.length < 3) return "";
  return out.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join("") + "Z";
}

function geomToPath(geom, clipRight) {
  if (!geom) return "";
  if (geom.type === "Polygon") return geom.coordinates.map((r) => ringToPath(r, clipRight)).join("");
  if (geom.type === "MultiPolygon") return geom.coordinates.map((poly) => poly.map((r) => ringToPath(r, clipRight)).join("")).join("");
  return "";
}

const countries = {};
const names = {};
const othersParts = [];
let skipped = 0;

for (const f of land.features) {
  const id = String(f.id).padStart(3, "0");
  const d = geomToPath(f.geometry, CLIP_RIGHT.has(id));
  if (!d) { skipped++; continue; }
  if (TARGETS.includes(id)) {
    countries[id] = { d };
    names[id] = f.properties?.name || id;
  } else {
    othersParts.push(d);
  }
}

const others = othersParts.join("");
const missing = TARGETS.filter((t) => !countries[t]);

const out = `// lib/worldMapData.js — DI-GENERASI oleh scripts/build-worldmap.mjs (jangan edit manual).
// Sumber geometri: Natural Earth 50m (public domain) via world-atlas npm.
// Proyeksi: equirectangular, viewBox 1000x500. "others" = semua negara non-target digabung.
export const MAP_VIEW = [1000, 500];
export const COUNTRY_NAMES = ${JSON.stringify(names)};
export const COUNTRIES = ${JSON.stringify(countries)};
export const OTHERS = "${others}";
`;

writeFileSync(new URL("../lib/worldMapData.js", import.meta.url), out);
const kb = (n) => (n / 1024).toFixed(0);
console.log(`negara target: ${Object.keys(countries).length}/33 | hilang: ${missing.join(",") || "tidak ada"}`);
console.log(`fitur dilewati (tanpa path valid): ${skipped}`);
console.log(`ukuran: COUNTRIES ${kb(Buffer.byteLength(JSON.stringify(countries)))} KB | OTHERS ${kb(Buffer.byteLength(others))} KB | total file ${kb(Buffer.byteLength(out))} KB`);
