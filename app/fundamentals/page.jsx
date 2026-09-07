import { getForexRates } from "../../lib/forex";
import { getSeriesData } from "../../lib/data";
import FundamentalsBoard from "../../components/fundamentals/FundamentalsBoard";
import { EVENTS } from "../../data/calendar";
import { getReleaseAnalytics } from "../../lib/consensus";
import { todayWib } from "../../lib/schedule";
import { CENTRAL_BANKS, applyLiveOverrides, buildBiasRows, BANKS_ASOF } from "../../lib/centralBanks";
import {
  IDR_MONTHLY, BI_RATE_PATH, ID_INFLATION, ID_INDICATORS, ID_DRIVERS, ID_EVENTS,
  IDR_ASOF, idrStats, idrVerdict,
} from "../../lib/idrData";

// Dirender per request agar angka (FRED, ForexFactory, Yahoo) selalu segar.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Fundamental — MacroLab",
  description:
    "Papan fundamental lengkap: suku bunga 11 bank sentral, inflasi vs target, bias per mata uang, fokus Rupiah (BI-Rate, BPS) & simulasi rilis.",
};

const MONTH_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const fmtMonth = (d) => {
  const [y, m] = String(d).slice(0, 7).split("-");
  return `${MONTH_ID[+m - 1]} ${y}`;
};

// ---------------------------------------------------------------------------
// Cheat sheet rilis penting (kalender resmi ∪ konsensus ForexFactory ∪ FRED).
// `iso` (WIB) ditambahkan agar countdown di klien akurat.
// ---------------------------------------------------------------------------
async function upcomingCheat(limit = 10) {
  const today = todayWib();
  const list = EVENTS
    .filter((e) => e.impact === "High" && e.indicatorId)
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, limit * 3);
  const ids = [...new Set(list.map((e) => e.indicatorId))];
  const analytics = {};
  await Promise.all(ids.map(async (id) => { analytics[id] = await getReleaseAnalytics(id).catch(() => null); }));
  const out = [];
  const seen = new Set();
  for (const e of list) {
    const key = `${e.indicatorId}|${e.date}`;
    if (seen.has(key)) continue; // FOMC punya beberapa baris di tanggal sama
    seen.add(key);
    const a = analytics[e.indicatorId];
    const row = a?.pending?.find((r) => r.date === e.date) || null;
    const lastPt = a?.last || null;
    out.push({
      ...e,
      iso: `${e.date}T${e.time}:00+07:00`,
      consensus: row?.consensus ?? null,
      previous: row?.previous ?? lastPt?.value ?? null,
      unit: a?.unit || "",
    });
    if (out.length >= limit) break;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Tile "Denyut Makro" — dari seri FRED (live/seed) & pasangan Yahoo (live/demo).
// ---------------------------------------------------------------------------
function seriesPulse({ id, label, unit, decimals, series, hint, sparkColor, neutralTrend }) {
  if (!series?.last || series.last.value == null) return null;
  const pts = (series.points || []).filter((p) => p.value != null);
  const prev = pts.length > 1 ? pts[pts.length - 2].value : null;
  return {
    id, label, unit, decimals,
    value: series.last.value,
    prev,
    dateLabel: fmtMonth(series.last.date),
    sourceKind: series.source === "live" ? "live" : "seed",
    sourceLabel: series.source === "live" ? "LIVE" : "FRED",
    spark: pts.slice(-24),
    sparkColor,
    hint,
    neutralTrend,
  };
}

function pairPulse({ id, label, pair, unit, decimals, hint, invertTrend, showRawDelta, flag }) {
  if (!pair || pair.value == null) return null;
  const prev = pair.prev != null ? pair.prev : pair.value - (pair.delta || 0);
  return {
    id, label, unit, decimals, flag,
    value: pair.value, prev,
    dateLabel: pair.demo ? "mode demo (offline)" : "live · sesi berjalan",
    sourceKind: pair.demo ? "demo" : "live",
    sourceLabel: pair.demo ? "DEMO" : "LIVE",
    spark: null, hint, invertTrend, showRawDelta,
    rawDecimals: decimals === 0 ? 0 : 2,
  };
}

export default async function FundamentalsPage() {
  const [fx, fedfunds, cpi, unemp, dgs10, vix, euCpi] = await Promise.all([
    getForexRates().catch(() => ({ pairs: [] })),
    getSeriesData("fedfunds").catch(() => null),
    getSeriesData("cpi").catch(() => null),
    getSeriesData("unemp").catch(() => null),
    getSeriesData("dgs10").catch(() => null),
    getSeriesData("vix").catch(() => null),
    getSeriesData("eu_cpi").catch(() => null),
  ]);

  const pairs = fx.pairs || [];
  const byId = Object.fromEntries(pairs.map((p) => [p.symbol, p]));
  const gold = byId["XAU/USD"] || null;
  const idrPair = byId["USD/IDR"] || null;

  const banks = applyLiveOverrides(CENTRAL_BANKS, { fedfunds, cpi, unemp, eu_cpi: euCpi });

  // Denyut makro — 6 KPI inti.
  const pulses = [
    seriesPulse({ id: "fed", label: "Fed Funds", unit: "%", decimals: 2, series: fedfunds, hint: "suku bunga acuan AS", sparkColor: "#c084fc", neutralTrend: true }),
    seriesPulse({ id: "cpi", label: "Inflasi AS (CPI)", unit: "%", decimals: 1, series: cpi, hint: "YoY · FRED/BLS", sparkColor: "#f0b429", neutralTrend: true }),
    seriesPulse({ id: "dgs10", label: "Yield AS 10Y", unit: "%", decimals: 2, series: dgs10, hint: "Treasury · FRED", sparkColor: "#38bdf8", neutralTrend: true }),
    seriesPulse({ id: "vix", label: "VIX", unit: "", decimals: 1, series: vix, hint: "volatilitas implied S&P 500", sparkColor: "#fb7185", neutralTrend: true }),
    pairPulse({ id: "gold", label: "Emas", pair: gold, unit: "$/oz", decimals: 1, hint: "COMEX · Yahoo", showRawDelta: true, flag: "🥇" }),
    pairPulse({ id: "usdidr", label: "USD/IDR", pair: idrPair, unit: "", decimals: 0, hint: "hijau = rupiah menguat", showRawDelta: true, invertTrend: true, flag: "🇮🇩" }),
  ].filter(Boolean);

  // Fokus Rupiah.
  const stats = idrStats(IDR_MONTHLY, idrPair?.value ?? null);
  const idrBias = buildBiasRows(banks, {}).find((r) => r.cc === "IDR") || null;
  const verdict = idrVerdict({
    banks,
    stats,
    fedRate: banks.find((b) => b.key === "us")?.rate ?? 3.75,
    idrBias,
  });
  const idr = {
    quote: {
      value: idrPair?.value ?? null,
      prev: idrPair ? (idrPair.prev != null ? idrPair.prev : idrPair.value - (idrPair.delta || 0)) : null,
      pct: idrPair?.pct ?? null,
      demo: !!idrPair?.demo,
      source: idrPair ? (idrPair.demo ? "demo" : "live") : "kurasi",
      sourceLabel: idrPair ? (idrPair.demo ? "DEMO" : "LIVE") : "KURASI",
    },
    series: IDR_MONTHLY,
    biPath: BI_RATE_PATH,
    infl: ID_INFLATION,
    indicators: ID_INDICATORS,
    drivers: ID_DRIVERS,
    events: ID_EVENTS,
    stats,
    verdict,
    asof: IDR_ASOF,
  };

  const cheat = await upcomingCheat(10);

  // Keputusan bank sentral (ECB/BoE/BOJ/BI/…) digabung ke radar — event
  // fundamental paling penting. Konsensus = rate saat ini ( pasar mem harga
  // "hold"); simulator menghitung surprise bila user mengasumsikan cut/hike.
  const bankEvents = banks
    .map((b) => ({
      date: b.nextMeeting.iso.slice(0, 10),
      time: b.nextMeeting.iso.slice(11, 16),
      iso: b.nextMeeting.iso,
      title: `${b.bankShort} — Keputusan Suku Bunga`,
      category: "moneter",
      country: b.country,
      impact: "High",
      indicatorId: null,
      flag: b.flag,
      ccy: b.cc,
      consensus: b.rate,
      previous: b.rate,
      unit: "%",
      isDecision: true,
    }))
    .filter((e) => !cheat.some((c) => c.iso === e.iso)); // FOMC sudah ada dari kalender

  const radar = [...cheat, ...bankEvents].sort((a, b) => a.iso.localeCompare(b.iso));

  return (
    <div className="page">
      <header className="detail-head">
        <div className="detail-title-row">
          <span className="brand-mark" style={{ width: 40, height: 40 }}>FU</span>
          <div>
            <h1>Fundamental</h1>
            <p className="cell-muted" style={{ margin: 0, maxWidth: 780 }}>
              Papan lengkap <b>mengapa mata uang bergerak</b>: suku bunga 11 bank sentral, inflasi vs target,
              bias per mata uang, sorotan khusus <b>Rupiah 🇮🇩</b>, dan radar rilis dengan simulasi dampak —
              semua bertanda sumber &amp; tanggal.
            </p>
          </div>
        </div>
        <div className="tags">
          <span className="badge cat">💓 Denyut Makro</span>
          <span className="badge cat">🏛️ 11 Bank Sentral</span>
          <span className="badge cat">⚖️ Matriks Carry</span>
          <span className="badge cat">🇮🇩 Fokus Rupiah</span>
          <span className="badge cat">📡 Radar Rilis + Simulasi</span>
        </div>
      </header>

      <FundamentalsBoard
        pairs={pairs}
        pulses={pulses}
        banks={banks}
        idr={idr}
        cheat={radar}
        asof={{ macro: BANKS_ASOF }}
      />
    </div>
  );
}
