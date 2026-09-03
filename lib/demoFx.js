// lib/demoFx.js
// Data kurs penjemput (fallback) yang DIPAKAI HANYA bila penyedia live
// (Yahoo Finance) tidak dapat dijangkau — misalnya di sandbox/offline.
//
// Nilai di bawah adalah level pasar yang wajar & konsisten antar-pair,
// BUKAN angka tebakan acak: setiap pair diturunkan agar cross-rate-nya
// konsisten (mis. EURJPY ≈ EURUSD × USDJPY), sehingga perhitungan
// "kekuatan mata uang" tetap bermakna.
//
// Skenario yang dipilih = sesi "RISK-ON": mata uang siklikal (AUD, NZD, EUR,
// GBP, CAD, SGD) menguat, USD & safe-haven (JPY, CHF) melemah, emas turun
// tipis. Ini membuat gauge sentimen, kekuatan mata uang, dan top-movers
// menceritakan satu cerita yang konsisten. Saat produksi online, data live
// dari Yahoo selalu menjadi prioritas & fallback ini di-lupakan.

export const DEMO_FX = [
  { label: "Euro / Dolar AS", symbol: "EUR/USD", base: 1.0920, prev: 1.0862 },
  { label: "Pound / Dolar AS", symbol: "GBP/USD", base: 1.2850, prev: 1.2790 },
  { label: "Dolar AS / Yen Jepang", symbol: "USD/JPY", base: 156.90, prev: 156.30 },
  { label: "Dolar AS / Franc Swiss", symbol: "USD/CHF", base: 0.9155, prev: 0.9126 },
  { label: "Dolar Australia / Dolar AS", symbol: "AUD/USD", base: 0.6640, prev: 0.6570 },
  { label: "Dolar AS / Dolar Kanada", symbol: "USD/CAD", base: 1.3450, prev: 1.3530 },
  { label: "Dolar Selandia Baru / Dolar AS", symbol: "NZD/USD", base: 0.6100, prev: 0.6040 },
  { label: "Euro / Pound Inggris", symbol: "EUR/GBP", base: 0.8490, prev: 0.8490 },
  // Regional Asia & pasar berkembang
  { label: "Dolar AS / Rupiah Indonesia", symbol: "USD/IDR", base: 15840, prev: 15780 },
  { label: "Dolar AS / Dolar Singapura", symbol: "USD/SGD", base: 1.3450, prev: 1.3370 },
  { label: "Dolar AS / Yuan Tiongkok", symbol: "USD/CNY", base: 7.1900, prev: 7.1500 },
  { label: "Dolar AS / Rupee India", symbol: "USD/INR", base: 84.52, prev: 84.30 },
  { label: "Dolar AS / Lira Turki", symbol: "USD/TRY", base: 41.10, prev: 40.80 },
  // Silang yen (konsisten dengan EUR/USD × USD/JPY)
  { label: "Euro / Yen Jepang", symbol: "EUR/JPY", base: 171.36, prev: 169.83 },
  { label: "Pound / Yen Jepang", symbol: "GBP/JPY", base: 201.62, prev: 199.96 },
  // Logam mulia (COMEX) — emas turun tipis di sesi risk-on
  { label: "Emas (per oz)", symbol: "XAU/USD", base: 2505.6, prev: 2518.2 },
  { label: "Perak (per oz)", symbol: "XAG/USD", base: 29.62, prev: 29.71 },
];
