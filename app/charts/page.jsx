// app/charts/page.jsx
// Halaman Chart telah digabung ke /terminal (Teknikal + Screener + Chart
// menjadi satu halaman). Redirect permanen agar tautan lama tetap berfungsi.

import { redirect } from "next/navigation";

export const metadata = {
  title: "Chart — pindah ke Terminal — MacroLab",
};

export default function ChartsPage() {
  redirect("/terminal#chart");
}
