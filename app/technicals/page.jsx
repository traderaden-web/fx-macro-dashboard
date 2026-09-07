// app/technicals/page.jsx
// Halaman Teknikal telah digabung ke /terminal (Teknikal + Screener + Chart
// menjadi satu halaman). Redirect permanen agar tautan lama tetap berfungsi.

import { redirect } from "next/navigation";

export const metadata = {
  title: "Analisis Teknikal — pindah ke Terminal — MacroLab",
};

export default function TechnicalsPage() {
  redirect("/terminal#screener");
}
