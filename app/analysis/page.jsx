import AnalysisClient from "../../components/AnalysisClient";
import AssetHeatmap from "../../components/AssetHeatmap";
import MacroMap from "../../components/MacroMap";
import { getAllReleaseAnalytics } from "../../lib/consensus";
import { latestUpdated } from "../../lib/data";
import { UPCOMING } from "../../data/calendar";

// Selalu dirender per request: angka aktual FRED & konsensus ForexFactory
// ditarik saat halaman dibuka (cache server ≤ 5 menit, 3 menit di jendela
// rilis) — tidak pernah dibekukan saat build.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Analisis Dampak Rilis — MacroLab",
  description: "Bandingkan konsensus vs actual untuk tiap rilis ekonomi dan lihat dampaknya terhadap pasangan mata uang.",
};

export default async function AnalysisPage() {
  const items = await getAllReleaseAnalytics();
  const asOf = latestUpdated(items);
  const liveCount = items.filter((i) => i.dataSource === "live").length;
  const consensusLive = items.some((i) => i.consensusLive);
  // Peta Makro: timpa angka AS dengan nilai FRED terbaru (rate/inflasi/pengangguran/GDP).
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  const lastOf = (id) => byId[id]?.last?.value ?? null;
  const macroOverrides = {
    us: {
      rate: lastOf("fedfunds"),
      inflation: lastOf("cpi"),
      unemp: lastOf("unemp"),
      gdp: lastOf("gdp"),
      gdpNote: byId.gdp?.last?.date ? `annualized ${byId.gdp.last.date.slice(0, 7)} (FRED)` : undefined,
      live: ["fedfunds", "cpi", "unemp", "gdp"].some((id) => byId[id]?.last),
    },
  };
  // Jadwal ke depan saja (60 hari, kolom seperlunya) — hemat payload ke klien.
  const nowMs = Date.now();
  const horizon = nowMs + 60 * 86400000;
  const upcoming = UPCOMING
    .filter((e) => { const t = new Date(e.iso).getTime(); return t > nowMs - 3600000 && t < horizon; })
    .map(({ date, time, iso, title, indicatorId, impact, country }) => ({ date, time, iso, title, indicatorId, impact, country }));

  return (
    <>
      <section className="hero section-fade">
        <h1>Analisis Konsensus vs Actual &amp; Dampak Pair</h1>
        <p>
          Bandingkan estimasi analis (konsensus) dengan nilai aktual tiap rilis, hitung besarnya
          &ldquo;kejutan&rdquo; (surprise), lalu lihat arah &amp; kekuatan dampaknya terhadap pasangan mata uang.
        </p>
        <div className="notice">
          {liveCount > 0 ? (
            <>🔗 Nilai aktual &amp; sebelumnya ditarik <strong>langsung dari FRED</strong> ({liveCount}/{items.length} seri live,
            sisanya dari cache yang diperbarui otomatis).</>
          ) : (
            <>ℹ️ Nilai aktual &amp; sebelumnya dari FRED (cache lokal, diperbarui otomatis tiap beberapa jam &amp; setelah jam rilis).</>
          )}{" "}
          Konsensus dari <strong>ForexFactory</strong> {consensusLive ? "(live minggu ini + arsip)" : "(arsip mingguan)"} — tanggal
          rilis mengikuti jadwal resmi BLS/BEA/Fed. Data diperbarui otomatis setelah setiap rilis.
        </div>
      </section>

      {items.length ? (
        <AnalysisClient items={items} upcoming={upcoming} asOf={asOf} />
      ) : (
        <p className="cell-muted">Belum ada data rilis tersedia. Jalankan <code>npm run fetch</code> untuk memperbarui.</p>
      )}

      {/* Round-33: Peta Makro Global diletakkan tepat di atas Heatmap Aset */}
      <div className="section-fade map-upper">
        <MacroMap overrides={macroOverrides} asOf={asOf ? `${asOf.slice(8, 10)}/${asOf.slice(5, 7)}/${asOf.slice(0, 4)}` : null} />
      </div>

      {/* Heatmap dipindah ke paling bawah halaman (Round-25) */}
      <div className="section-fade heat-lower">
        <AssetHeatmap />
      </div>
    </>
  );
}
