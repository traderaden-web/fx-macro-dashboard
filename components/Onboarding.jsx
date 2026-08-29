// components/Onboarding.jsx
// Banner "Mulai di sini" yang ramah pemula — menjelaskan cara memakai dashboard
// dalam beberapa langkah. Bisa ditutup & diingat pada perangkat pengguna.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconHome, IconAnalytics, IconCalendar, IconLearn } from "./Icons";

const STEPS = [
  { icon: <IconHome size={20} />, title: "Beranda", desc: "Lihat indikator yang paling berpengaruh & harga pasar global (minyak, gas, tembaga, VIX)." },
  { icon: <IconCalendar size={20} />, title: "Kalender Ekonomi", desc: "Jadwal rilis data penting (NFP, CPI, FOMC). Cek tanggal & jamnya agar tidak ketinggalan." },
  { icon: <IconAnalytics size={20} />, title: "Analisis Dampak", desc: "Bandingkan perkiraan analis vs nilai aktual, lalu lihat efeknya ke pasangan mata uang." },
  { icon: <IconLearn size={20} />, title: "Belajar & Glosarium", desc: "Pahami istilah (konsensus, aktual, hawkish, dll.) dengan bahasa sederhana." },
];

export default function Onboarding() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("macrolab_onboarding")) setShow(true);
    } catch {
      /* abaikan jika localStorage tidak tersedia */
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem("macrolab_onboarding", "1");
    } catch {
      /* abaikan */
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <section className="onboarding">
      <div className="onbar-head">
        <span className="onbar-badge">Mulai di sini</span>
        <span className="onbar-title">Selamat datang di <strong>MacroLab</strong> — 4 langkah cepat memahami dashboard</span>
        <button className="onbar-close" onClick={dismiss} aria-label="Tutup panduan">✕</button>
      </div>
      <div className="onbar-grid">
        {STEPS.map((s, i) => (
          <div className="onbar-step" key={i}>
            <span className="onbar-ico">{s.icon}</span>
            <div>
              <div className="onbar-sname">{i + 1}. {s.title}</div>
              <div className="onbar-sdesc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="onbar-foot">
        <Link href="/learn" className="btn btn-ghost"><IconLearn size={16} /> Pelajari istilah penting</Link>
        <button className="btn btn-primary" onClick={dismiss}>Mengerti, mulai jelajahi →</button>
      </div>
    </section>
  );
}
