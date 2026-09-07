// components/fundamentals/FundamentalsBoard.jsx
// Papan utama halaman /fundamentals (klien): navigasi cepat lengket +
// penyusunan semua panel. Data (pairs, pulses, banks, idr, cheat) dirakit
// server di app/fundamentals/page.jsx dan dikirim sebagai props.

"use client";

import { useEffect, useMemo, useState } from "react";
import { computeCurrencyStrength } from "../../lib/strength";
import { buildBiasRows } from "../../lib/centralBanks";
import PulseStrip from "./PulseStrip";
import RateBoard from "./RateBoard";
import BiasBoard from "./BiasBoard";
import IdrSpotlight from "./IdrSpotlight";
import ReleaseRadar from "./ReleaseRadar";

const NAV = [
  { id: "denyut", label: "💓 Denyut Makro" },
  { id: "banksentral", label: "🏛️ Bank Sentral" },
  { id: "bias", label: "🧭 Bias Mata Uang" },
  { id: "rupiah", label: "🇮🇩 Fokus Rupiah" },
  { id: "rilis", label: "📡 Radar Rilis" },
  { id: "metodologi", label: "📚 Metodologi" },
];

export default function FundamentalsBoard({ pairs = [], pulses = [], banks = [], idr = null, cheat = [], asof }) {
  const strength = useMemo(() => computeCurrencyStrength(pairs), [pairs]);
  const strengthByCcy = useMemo(() => Object.fromEntries(strength.map((s) => [s.currency, s])), [strength]);
  const biasRows = useMemo(() => buildBiasRows(banks, strengthByCcy), [banks, strengthByCcy]);

  // Scroll-spy: tandai bagian yang sedang terlihat di navigasi cepat.
  const [active, setActive] = useState("");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-70px 0px -55% 0px", threshold: [0, 0.15, 0.4] }
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="fund">
      {/* navigasi cepat (lengket + scroll-spy) */}
      <nav className="fv-quicknav" aria-label="Navigasi bagian">
        {NAV.map((n) => (
          <button key={n.id} type="button" className={active === n.id ? "active" : ""}
            onClick={() => document.getElementById(n.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}>
            {n.label}
          </button>
        ))}
      </nav>

      <PulseStrip pulses={pulses} strength={strength} />
      <RateBoard banks={banks} asof={asof.macro} />
      <BiasBoard rows={biasRows} strength={strength} />
      {idr && <IdrSpotlight idr={idr} banks={banks} />}
      <ReleaseRadar cheat={cheat} />

      {/* ── Metodologi & sumber ── */}
      <section className="section" id="metodologi">
        <div className="section-head">
          <h2><span className="inline-ico">📚</span> Metodologi &amp; Sumber</h2>
          <span className="cell-muted">transparansi penuh — cara tiap angka dihitung</span>
        </div>
        <div className="method-grid">
          <div className="panel-card method-card">
            <h4>🧮 Skor Bias (0–100)</h4>
            <p>Empat komponen berbobot: <b>suku bunga riil 35%</b> (bunga acuan − inflasi), <b>sikap kebijakan 25%</b> (arah langkah terakhir), <b>pertumbuhan 20%</b> (GDP), <b>pasar kerja 20%</b> (pengangguran). Skor gabungan = 55% fundamental + 45% kekuatan harga intraday.</p>
          </div>
          <div className="panel-card method-card">
            <h4>📡 Data Live vs Kurasi</h4>
            <p><b>LIVE</b> = FRED/Yahoo diambil per request (cache singkat). <b>FRED</b> = seed terbaru (GitHub Actions tiap 6 jam). <b>KURASI</b> = angka resmi terbaru yang ditulis manual dari rilis bank sentral/BPS dengan tanggal as-of. Saat offline, semua tetap tampil dengan label jujur.</p>
          </div>
          <div className="panel-card method-card">
            <h4>📊 Matriks Carry</h4>
            <p>Selisih suku bunga acuan antar dua mata uang (% p.a.). Carry positif = strategi long base/quote secara struktural dibayar bunga — tetap hitung swap broker aktual sebelum eksekusi.</p>
          </div>
          <div className="panel-card method-card">
            <h4>⚠️ Disclaimer</h4>
            <p>Semua skor, estimasi gerak &amp; skenario bersifat <b>edukatif</b> — bukan saran finansial. Reaksi pasar nyata dipengaruhi ekspektasi, posisi, dan likuiditas yang tidak termodelkan penuh.</p>
          </div>
        </div>
        <div className="method-sources">
          <a href="https://fred.stlouisfed.org/" target="_blank" rel="noopener noreferrer">FRED ↗</a>
          <a href="https://www.bls.gov/" target="_blank" rel="noopener noreferrer">BLS ↗</a>
          <a href="https://www.bi.go.id/" target="_blank" rel="noopener noreferrer">Bank Indonesia ↗</a>
          <a href="https://www.bps.go.id/" target="_blank" rel="noopener noreferrer">BPS ↗</a>
          <a href="https://www.ecb.europa.eu/" target="_blank" rel="noopener noreferrer">ECB ↗</a>
          <a href="https://www.ons.gov.uk/" target="_blank" rel="noopener noreferrer">ONS ↗</a>
          <a href="https://www.forexfactory.com/calendar" target="_blank" rel="noopener noreferrer">ForexFactory ↗</a>
          <a href="https://finance.yahoo.com/" target="_blank" rel="noopener noreferrer">Yahoo Finance ↗</a>
        </div>
      </section>
    </div>
  );
}
