import Link from "next/link";
import { getAllSeriesData } from "../lib/data";
import { SEED_META } from "../lib/data";
import StatCard from "../components/StatCard";
import Onboarding from "../components/Onboarding";
import TopNews from "../components/TopNews";
import { IconAnalytics, IconCalendar, IconChart, IconLearn } from "../components/Icons";
import { ImpactLegend, GlossaryHint } from "../components/Legend";
import { ImpactBadge, CountryFlag } from "../components/Badges";
import { UPCOMING } from "../data/calendar";

const MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

// Hitung bulan yang akan datang (bulan berikutnya dari hari ini).
function nextMonthInfo(now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth(); // 0-based
  const nm = m + 1; // bulan berikutnya
  const ny = nm > 11 ? y + 1 : y;
  const monthIdx = nm > 11 ? 0 : nm;
  const key = `${ny}-${String(monthIdx + 1).padStart(2, "0")}`;
  return { key, label: `${MONTHS_ID[monthIdx]} ${ny}` };
}

export default async function Home() {
  const all = await getAllSeriesData();
  // Indikator pasar & komoditas: kategori "pasar" (WTI, Brent, Gas, Tembaga, VIX, 10Y Yield).
  const global = all
    .filter((s) => s.category === "pasar")
    .sort((a, b) => (a.short || "").localeCompare(b.short || ""));
  const us = [...all.filter((s) => s.country === "US" && s.category !== "pasar")]
    .reverse()
    .slice(0, 6);

  // Jadwal rilis hanya untuk bulan yang akan datang.
  const month = nextMonthInfo();
  let nextEvents = UPCOMING
    .filter((e) => e.date.slice(0, 7) === month.key)
    .sort((a, b) => a.iso.localeCompare(b.iso));
  if (nextEvents.length === 0) {
    nextEvents = UPCOMING.slice().sort((a, b) => a.iso.localeCompare(b.iso));
  }
  nextEvents = nextEvents.slice(0, 10);

  return (
    <>
      <Onboarding />

      <section className="hero">
        <h1>
          Data Makro Ekonomi untuk <span style={{ color: "var(--accent)" }}>Trader Forex</span>
        </h1>
        <p>
          Pantau indikator yang benar-benar menggerakkan pasar — NFP, CPI, PPI, FOMC, suku bunga, dan
          lainnya — lengkap dengan data historis dan analisis dampaknya terhadap mata uang. Data ditarik
          live dari FRED, dengan cache lokal sebagai cadangan.
        </p>
        <div className="hero-actions">
          <Link href="/analysis" className="btn btn-primary">
            <IconAnalytics size={16} /> Analisis Dampak Rilis
          </Link>
          <Link href="/charts" className="btn btn-ghost">
            <IconChart size={16} /> Chart Gold &amp; Komoditas
          </Link>
          <Link href="/learn" className="btn btn-ghost">
            <IconLearn size={16} /> Belajar Data Makro
          </Link>
          <Link href="/calendar" className="btn btn-ghost">
            <IconCalendar size={16} /> Kalender Ekonomi
          </Link>
        </div>
        <div className="legend" style={{ marginTop: 20 }}>
          <span><span className="pulse-dot" /> Sumber: FRED (live)</span>
          <span>Dikumpulkan: {SEED_META.generated?.slice(0, 10) || "—"}</span>
        </div>
        <GlossaryHint />
        <ImpactLegend />
      </section>

      <section className="section">
        <div className="section-head">
          <h2>
            <span className="tip" data-tip="Data yang paling sering menggerakkan dolar AS, seperti jumlah pekerja (NFP), inflasi (CPI/PPI), dan keputusan suku bunga (FOMC).">
              Indikator AS yang Paling Berdampak
            </span>
          </h2>
          <Link href="/indicators" className="see-all">Lihat semua →</Link>
        </div>
        <div className="grid grid-stats">
          {us.map((d, i) => (
            <StatCard key={d.id} data={d} index={i} />
          ))}
        </div>
      </section>

      <TopNews />

      <section className="section">
        <div className="section-head">
          <h2>Jadwal Rilis {month.label}</h2>
          <Link href="/calendar" className="see-all">Kalender penuh →</Link>
        </div>
        <div className="table-hint">Geser tabel untuk melihat semua kolom →</div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Waktu (WIB)</th>
                <th>Event</th>
                <th>Kategori</th>
                <th>Nilai</th>
              </tr>
            </thead>
            <tbody>
              {nextEvents.map((e) => (
                <tr key={e.iso}>
                  <td className="mono">
                    <div style={{ fontWeight: 600 }}>{e.date.slice(8, 10)}/{e.date.slice(5, 7)}</div>
                    <div className="cell-muted">{e.time} WIB</div>
                  </td>
                  <td>
                    <div className="cell-name">
                      <CountryFlag code={e.country} /> {e.title}
                    </div>
                  </td>
                  <td>
                    <span className="cell-muted">{e.category}</span>
                  </td>
                  <td><ImpactBadge level={e.impact} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>
            <span className="tip" data-tip="Harga pasar yang mencerminkan kondisi global: minyak (WTI & Brent), gas (Nat Gas), tembaga (Copper), indeks ketakutan (VIX), dan imbal hasil obligasi 10 tahun AS.">
              Indikator Pasar Global
            </span>
          </h2>
          <span className="cell-muted">Harga harian</span>
        </div>
        <div className="grid grid-stats">
          {global.map((d, i) => (
            <StatCard key={d.id} data={d} index={i + us.length} />
          ))}
        </div>
      </section>
    </>
  );
}
