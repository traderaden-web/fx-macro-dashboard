// app/screener/page.jsx
// Halaman Screener telah digabung ke /terminal (Teknikal + Screener + Chart
// menjadi satu halaman). Redirect permanen agar tautan lama tetap berfungsi.

import { redirect } from "next/navigation";

export const metadata = {
  title: "Pattern Screener — pindah ke Terminal — MacroLab",
};

export default function ScreenerPage() {
  redirect("/terminal#screener");
}
