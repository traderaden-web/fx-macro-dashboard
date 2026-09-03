import Link from "next/link";
import { getAllSeriesData, SEED_META } from "../lib/data";
import { getForexRates } from "../lib/forex";
import { computeCurrencyStrength, riskBias } from "../lib/strength";
import StatCard from "../components/StatCard";
import Onboarding from "../components/Onboarding";
import TopNews from "../components/TopNews";
import CurrencyStrength from "../components/CurrencyStrength";
import RiskGauge from "../components/RiskGauge";
import MarketSessions from "../components/MarketSessions";
import {
  IconAnalytics,
  IconCalendar,
  IconChart,
  IconLearn,
  IconCalculator,
  IconGlobe,
} from "../components/Icons";
import { ImpactBadge, CountryFlag } from "../components/Badges";
import { UPCOMING } from "../data/calendar";
import BootScreen from "../components/BootScreen";
import TermClock from "../components/TermClock";

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

const BANNER = [
  "██████╗  ███████╗ ███████╗██████╗  ███████╗██████╗  ███████╗██████╗",
  "██╔══██╗██╔══███╗██╔══███╗██╔══██╗██╔══███╗██╔══██╗██╔══███╗██╔══██╗",
  "██████╔╝██║   ║║██║   ║║██████╔╝██║   ║║██║  ║║██║   ║║██████╔╝",
  "██╔══██╗██║   ║║██║   ║║██╔══██╗██║   ║║██║  ║║██║   ║║██╔══██╗",
  "██████╔╝╚██████╔╝╚██████╔╝██████╔╝╚██████╔╝██████╔╝╚██████╔╝██████╔╝",
  "╚═════╝  ╚═════╝  ╚═════╝ ╚═════╝  ╚═════╝ ╚═════╝  ╚═════╝ ╚═════╝",
].join("\n");

const FX_ONLY = (p) => p.symbol.includes("/") && !p.symbol.startsWith("XAU") && !p.symbol.startsWith("XAG");

export default async function Home() {
  const all = await getAllSeriesData();

  // ── Data live (dengan fallback demo) ──────────────────────────────────
  let fx = { pairs: [], source: "demo" };
  try {
    fx = await getForexRates();
  } catch {
    /* abaikan; pakai pairs kosong */
  }
  const pairs = fx.pairs || [];
  const strength = computeCurrencyStrength(pairs);
  const bias = riskBias(strength);
  const vixDef = all.find((s) => s.id === "vix");
  const vix = vixDef?.last?.value ?? null;

  // Pergerakan terbesar (hanya pair FX).
  const movers = [...pairs]
    .filter(FX_ONLY)
    .sort((a, b) => Math.abs(b.pct || 0) - Math.abs(a.pct || 0))
    .slice(0, 6);

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
    <div className="home-term">
      <BootScreen />

      <header className="home-head">
        <span className="ct-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="home-title mono">
          MACROLAB <em>//</em> HOME.SYS <span className="ct-ver">v3.0</span>
        </span>
        <span className="home-head-right">
          <span className="live-pill">
            <span className="pulse-dot" /> {fx.source === "demo" ? "DEMO DATA" : "FRED·LIVE"}
          </span>
          <TermClock />
        </span>
      </header>

      <Onboarding />

      <section className="hero home-hero">
        <pre className="home-banner" aria-hidden="true">{BANNER}</pre>
        <div className="home-prompt mono" aria-hidden="true">
          <span className="hp-user">root@macrolab</span>
          <span className="hp-sep">:</span>
          <span className="hp-path">~</span>
          <span className="hp-sep">$</span>{" "}
          <span className="hp-cmd">run market --watch --asof 30-Agu-2026</span>
          <span className="hp-cur">▮</span>
        </div>
        <h1>
          Command Center <span style={{ color: "var(--accent)" }}>Trader Forex</span>
        </h1>
        <p>
          Satu layar untuk semua yang menggerakkan pasar — NFP, CPI, PPI, FOMC, suku bunga,
          plus sentimen pasar, kekuatan mata uang, sesi live, dan pergerakan terbesar hari ini.
          Data ditarik live dari FRED & Yahoo, dengan cache lokal sebagai cadangan.
        </p>
        <div className="hero-actions">
          <Link href="/analysis" className="btn btn-primary">
            <IconAnalytics size={16} /> Analisis Dampak Rilis
          </Link>
          <Link href="/calculators" className="btn btn-ghost">
            <IconCalculator size={16} /> Kalkulator Trader
          </Link>
          <Link href="/charts" className="btn btn-ghost">
            <IconChart size={16} /> Chart &amp; Teknikal
          </Link>
          <Link href="/learn" className="btn btn-ghost">
            <IconLearn size={16} /> Belajar Data Makro
          </Link>
          <Link href="/calendar" className="btn btn-ghost">
            <IconCalendar size={16} /> Kalender Ekonomi
          </Link>
        </div>
        <div className="legend" style={{ marginTop: 20 }}>
          <span><span className="pulse-dot" /> Sumber: FRED + Yahoo Finance</span>
          <span>Dikumpulkan: {SEED_META.generated?.slice(0, 10) || "—"}</span>
          {fx.source === "demo" && <span className="cell-muted">· kurs tampil dalam mode demo</span>}
        </div>
      </section>

      {/* ── Pantauan Pasar (Command Center) ── */}
      <section className="section">
        <div className="section-head">
          <h2>Pantauan Pasar Sekarang</h2>
          <span className="cell-muted">Risk · Sesi · Kekuatan Mata Uang</span>
        </div>
        <div className="grid grid-pulse">
          <div className="panel-card reveal">
            <div className="section-title">
              <span className="inline-ico"><IconChart size={18} /></span>
              <h3>Sentimen / Risk Appetite</h3>
            </div>
            <RiskGauge vix={vix} biasGap={bias?.gap} biasLabel={bias?.label} />
          </div>
          <div className="panel-card reveal">
            <div className="section-title">
              <span className="inline-ico"><IconAnalytics size={18} /></span>
              <h3>Sesi Pasar Live</h3>
            </div>
            <MarketSessions />
          </div>
        </div>
        <div className="panel-card reveal" style={{ marginTop: 16 }}>
          <div className="section-title">
            <span className="inline-ico"><IconGlobe size={18} /></span>
            <h3>Kekuatan Mata Uang (Currency Strength)</h3>
          </div>
          <CurrencyStrength pairs={pairs} />
        </div>
      </section>

      {/* ── Top Movers ── */}
      <section className="section">
        <div className="section-head">
          <h2>Pergerakan Terbesar Hari Ini</h2>
          <span className="cell-muted">Berdasarkan perubahan %</span>
        </div>
        <div className="grid grid-movers">
          {movers.length === 0 ? (
            <div className="cell-muted">Menunggu data kurs…</div>
          ) : (
            movers.map((p, i) => {
              const dir = p.pct > 0 ? "up" : p.pct < 0 ? "down" : "flat";
              return (
                <Link href="/charts" className="panel-card mover" key={p.symbol}>
                  <span className="mover-sym">{p.symbol}</span>
                  <span className="mover-dir">
                    {dir === "up" ? "▲" : dir === "down" ? "▼" : "—"}{" "}
                    <span className={dir === "up" ? "val-up" : dir === "down" ? "val-down" : ""}>
                      {p.pct > 0 ? "+" : ""}{Number(p.pct).toFixed(2)}%
                    </span>
                  </span>
                  <span className="mover-val mono">{p.value >= 100 ? p.value.toFixed(2) : p.value.toFixed(4)}</span>
                </Link>
              );
            })
          )}
        </div>
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

      <footer className="home-status mono">
        <span>SYS: FRED+FF · SERI: 27 · ASOF: 30 AGU 2026</span>
        {nextEvents[0] && (
          <span className="home-status-next">
            NEXT ▸ {nextEvents[0].title} — {nextEvents[0].date.slice(8)}{" "}
            {["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][Number(nextEvents[0].date.slice(5, 7)) - 1]}{" "}
            {nextEvents[0].time} WIB
          </span>
        )}
        <span className="home-status-right">
          <TermClock />
          <span className="ct-blink" aria-hidden="true">●</span>
        </span>
      </footer>
    </div>
  );
}
