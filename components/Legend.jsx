// components/Legend.jsx
// Legenda warna & arti untuk pengguna awam. Komponen statis (bisa dipakai di server).
import Link from "next/link";
import { IconLightbulb } from "./Icons";

export function ImpactLegend() {
  return (
    <ul className="legend-box">
      <li><span className="lvl high" /> <b>High</b> — rilis besar, biasanya memicu pergerakan signifikan.</li>
      <li><span className="lvl medium" /> <b>Medium</b> — bisa memicu pergerakan bila angka meleset jauh.</li>
      <li><span className="lvl low" /> <b>Low</b> — berdampak kecil, penting bila digabung rilis lain.</li>
      <li><span className="lvl up">▲</span> Naik &amp; <span className="lvl down">▼</span> Turun — arah perubahan nilai vs periode sebelumnya.</li>
    </ul>
  );
}

export function GlossaryHint() {
  return (
    <p className="glossary-hint">
      <span className="inline-ico" aria-hidden="true"><IconLightbulb size={15} /></span>{" "}
      Istilah asing seperti <em>konsensus</em>, <em>aktual</em>, <em>hawkish/dovish</em>, dan <em>surprise</em>?
      Arahkan kursor ke teks yang bergaris putus-putus, atau baca{" "}
      <Link href="/learn#glosarium">Glosarium lengkap</Link>.
    </p>
  );
}
