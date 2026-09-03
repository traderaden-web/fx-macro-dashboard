import { getForexRates } from "../../lib/forex";
import { getSeriesData } from "../../lib/data";
import FundamentalsView from "../../components/FundamentalsView";
import { IconAnalytics } from "../../components/Icons";
import { EVENTS } from "../../data/calendar";
import { CONSENSUS } from "../../data/releases";

export const metadata = {
  title: "Analisis Fundamental — MacroLab",
  description:
    "Bias fundamental per mata uang (suku bunga riil, kebijakan, pertumbuhan, pasar kerja) + scenario planner untuk rilis penting (NFP, CPI, FOMC).",
};

// Kumpulkan cheat sheet rilis penting dari kalender (terdekat yang belum lewat).
function upcomingCheat(limit = 6) {
  const now = new Date();
  const isoNow = now.toISOString();
  const list = EVENTS
    .filter((e) => e.impact === "High" && e.indicatorId)
    .filter((e) => e.date >= isoNow.slice(0, 10))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const seen = new Set();
  const out = [];
  for (const e of list) {
    // Ambil konsensus dari data/releases (per indikator, rilis terakhir).
    const series = CONSENSUS[e.indicatorId] || [];
    const last = series[series.length - 1];
    out.push({
      ...e,
      consensus: last?.consensus ?? null,
      previous: last?.previous ?? null,
    });
    if (out.length >= limit) break;
    seen.add(e.indicatorId);
  }
  return out;
}

export default async function FundamentalsPage() {
  const [fx, vixSeries] = await Promise.all([
    getForexRates().catch(() => ({ pairs: [] })),
    getSeriesData("vix").catch(() => null),
  ]);

  const cheat = upcomingCheat(8);

  return (
    <div className="page">
      <header className="detail-head">
        <div className="detail-title-row">
          <span className="brand-mark" style={{ width: 40, height: 40 }}>FU</span>
          <div>
            <h1>Analisis Fundamental</h1>
            <p className="cell-muted" style={{ margin: 0, maxWidth: 720 }}>
              Pahami <b>mengapa</b> mata uang bergerak. Lihat bias fundamental tiap valuta dari suku
              bunga riil, sikap bank sentral, pertumbuhan &amp; pasar kerja, lalu simulasikan bagaimana
              reaksi pasar terhadap rilis penting berikutnya.
            </p>
          </div>
        </div>
        <div className="tags">
          <span className="badge cat"><IconAnalytics size={13} /> Bias Fundamental</span>
          <span className="badge cat">Scenario Planner</span>
          <span className="badge cat">Cheat Sheet Rilis</span>
        </div>
      </header>

      <FundamentalsView pairs={fx.pairs || []} cheatSheet={cheat} />

      {/* ── Cheat Sheet Rilis ── */}
      <section className="section">
        <div className="section-head">
          <h2>Cheat Sheet Rilis Penting</h2>
          <span className="cell-muted">Konsensus &amp; dampak</span>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Event</th>
                <th>Kategori</th>
                <th>Konsensus</th>
                <th>Previous</th>
                <th>Dampak</th>
              </tr>
            </thead>
            <tbody>
              {cheat.map((e) => (
                <tr key={`${e.indicatorId}-${e.date}-${e.time}`}>
                  <td className="mono">
                    <div style={{ fontWeight: 600 }}>{e.date.slice(8, 10)}/{e.date.slice(5, 7)}</div>
                    <div className="cell-muted">{e.time} WIB</div>
                  </td>
                  <td>
                    <div className="cell-name">{e.title}</div>
                    <div className="cell-muted">{e.country}</div>
                  </td>
                  <td><span className="cell-muted">{e.category}</span></td>
                  <td className="mono">{e.consensus ?? "—"}</td>
                  <td className="mono cell-muted">{e.previous ?? "—"}</td>
                  <td><span className="badge impact" style={{ color: "#fb7185", background: "rgba(251,113,133,0.16)" }}>{e.impact}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
