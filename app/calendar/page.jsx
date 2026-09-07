import CalendarClient from "../../components/CalendarClient";
import { UPCOMING, CALENDAR_META } from "../../data/calendar";
import { getFfEvents } from "../../lib/provider";
import { getSeries, CATEGORIES, COUNTRIES } from "../../lib/series";
import { getSeriesData } from "../../lib/data";
import { getReleaseAnalytics } from "../../lib/consensus";
import { getEducation, GENERAL } from "../../lib/education";
import { obsForRelease, todayWib } from "../../lib/schedule";

// Selalu dirender per request — P/A dari FRED (live), K dari ForexFactory.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Kalender Ekonomi — MacroLab",
  description: "Jadwal rilis data makro yang berdampak pada pasar valuta asing, lengkap dengan konsensus & aktual.",
};

const DAY = 86400000;

/** P (previous) / A (actual) untuk satu event dari deret FRED. */
function fredNumbers(series, e, now) {
  const pts = series?.points || [];
  if (!pts.length) return { previous: null, actual: null };
  const obs = e.obs || obsForRelease(series, e.date);
  const released = new Date(e.iso).getTime() <= now.getTime();
  const i = pts.findIndex((p) => p.date === obs);
  if (released && i >= 0) {
    return { actual: pts[i].value, previous: i > 0 ? pts[i - 1].value : null, obs };
  }
  // Belum rilis (atau FRED belum memuat): P = nilai terakhir sebelum periode ini.
  let previous = null;
  for (const p of pts) {
    if (p.date < obs) previous = p.value;
    else break;
  }
  return { previous, actual: null, obs };
}

export default async function CalendarPage() {
  const now = new Date();
  const today = todayWib(now);

  // 1) ForexFactory: live minggu ini + arsip cron (konsensus, previous, event pasar).
  const ff = await getFfEvents();
  const liveSource = ff.live;

  // 2) Deret FRED untuk semua indikator yang muncul di jadwal (paralel, ter-cache).
  const ids = [...new Set([...UPCOMING.map((e) => e.indicatorId), ...ff.events.map((e) => e.indicatorId)].filter(Boolean))];
  const seriesList = await Promise.all(ids.map((id) => getSeriesData(id).catch(() => null)));
  const seriesById = {};
  ids.forEach((id, i) => { if (seriesList[i]) seriesById[id] = seriesList[i]; });

  // 3) Gabungkan: jadwal resmi (P/A dari FRED) + FF (K/previous + event lain).
  const merged = {};
  const ffByKey = new Map();
  for (const e of ff.events) {
    // kunci: tanggal WIB + indikator (bila dikenal) — judul FF berbeda dgn judul kami
    if (e.indicatorId) ffByKey.set(`${e.wibDate}|${e.indicatorId}`, e);
  }

  for (const e of UPCOMING) {
    const key = `${e.date}|${e.title}`;
    if (merged[key]) continue;
    let previous = null, forecast = null, actual = null, obs = e.obs || null;
    const series = e.indicatorId ? seriesById[e.indicatorId] : null;
    const ffe = e.indicatorId ? ffByKey.get(`${e.date}|${e.indicatorId}`) : null;
    if (series) {
      const n = fredNumbers(series, e, now);
      previous = n.previous;
      actual = n.actual;
      obs = n.obs;
    }
    if (ffe) {
      if (ffe.forecast != null) forecast = ffe.forecast;
      if (previous == null && ffe.previous != null) previous = ffe.previous;
      ffe._used = true;
    }
    merged[key] = {
      ...e,
      forecast,
      actual,
      previous,
      obs,
      dataSource: series?.source || null,
      released: new Date(e.iso).getTime() <= now.getTime(),
    };
  }

  // 4) Event FF yang tidak ada di jadwal resmi (pidato, data negara lain, dst.).
  const normTitle = (t) => String(t || "").toLowerCase().replace(/\b(ecb|boe|boj|snb|rba|boc|rbnz|fomc|fed|us|eu|uk)\b/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  for (const e of ff.events) {
    if (e._used) continue;
    // event indikator kami yang sudah tercakup oleh jadwal resmi pada hari yang sama → lewati
    if (e.indicatorId && Object.values(merged).some((m) => m.indicatorId === e.indicatorId && m.date === e.wibDate)) continue;
    const key = `${e.wibDate}|${e.title}`;
    if (merged[key]) continue;
    // Judul mirip pada hari & negara yang sama (mis. FF "Main Refinancing Rate" vs
    // jadwal resmi "ECB Main Refinancing Rate") → gabungkan K/P ke event resmi.
    const nt = normTitle(e.title);
    const twin = nt && Object.values(merged).find((m) => m.date === e.wibDate && m.country === e.country && !m.fromFf && (() => { const mt = normTitle(m.title); return mt === nt || mt.includes(nt) || nt.includes(mt); })());
    if (twin) {
      if (twin.forecast == null && e.forecast != null) twin.forecast = e.forecast;
      if (twin.previous == null && e.previous != null) twin.previous = e.previous;
      continue;
    }
    const series = e.indicatorId ? seriesById[e.indicatorId] : null;
    let actual = null, previous = e.previous ?? null;
    if (series) {
      const n = fredNumbers(series, { date: e.wibDate, iso: e.dateIso }, now);
      actual = n.actual;
      if (n.previous != null) previous = n.previous;
    }
    merged[key] = {
      date: e.wibDate,
      time: e.time,
      iso: e.dateIso,
      title: e.title,
      category: series?.category || (e.impact === "Holiday" ? "pasar" : "pasar"),
      country: e.country,
      impact: e.impact,
      indicatorId: e.indicatorId,
      forecast: e.forecast ?? null,
      previous,
      actual,
      dataSource: series?.source || null,
      released: new Date(e.dateIso).getTime() <= now.getTime(),
      fromFf: true,
    };
  }

  const events = Object.values(merged)
    .map(({ _used, ...e }) => e)
    .sort((a, b) => a.iso.localeCompare(b.iso));

  // 5) Detail indikator untuk POPUP (analytics + edukasi + jadwal), per indicatorId.
  const detailIds = [...new Set(events.map((e) => e.indicatorId).filter(Boolean))];
  const analyticsAll = await Promise.all(detailIds.map((id) => getReleaseAnalytics(id).catch(() => null)));
  const details = {};
  detailIds.forEach((id, i) => {
    const a = analyticsAll[i];
    if (!a) return;
    const { releases, pending, accuracy, source, ...data } = a;
    details[id] = {
      // `data` tanpa duplikat releases/pending/accuracy (dipakai IndicatorClient lewat prop terpisah)
      data: { ...data, points: (data.points || []).slice(-72), pending, source },
      releases,
      pending,
      accuracy,
      source,
      edu: getEducation(id),
      general: GENERAL,
      cat: CATEGORIES.find((c) => c.id === a.category),
      country: COUNTRIES.find((c) => c.id === a.country),
      upcoming: UPCOMING.filter((e) => e.indicatorId === id && e.date >= today)
        .sort((x, y) => x.iso.localeCompare(y.iso))
        .slice(0, 3)
        .map(({ date, time, iso, title, indicatorId, impact, country, obs }) => ({ date, time, iso, title, indicatorId, impact, country, obs })),
    };
  });

  const liveFred = Object.values(seriesById).filter((s) => s.source === "live").length;
  const meta = {
    today,
    liveFf: liveSource,
    liveFred,
    totalFred: Object.keys(seriesById).length,
    blsUpdated: CALENDAR_META.blsUpdated,
    generatedAt: now.toISOString(),
  };

  return (
    <>
      <section className="hero section-fade" style={{ paddingTop: 20 }}>
        <h1>Kalender Ekonomi</h1>
        <p>
          Jadwal rilis data makro yang berdampak pada pasar valuta asing. Waktu dalam <strong>WIB (UTC+7)</strong>.
          Tampilan default <strong>"Terkini"</strong> menampilkan rilis dari <strong>30 hari terakhir hingga 45 hari ke depan</strong> —
          termasuk yang sudah lewat (terlihat redup) dan yang akan datang. Pilih <strong>"Semua"</strong> untuk seluruh rilis.
          Setiap baris menampilkan <strong>P</strong> (previous), <strong>K</strong> (forecast/konsensus), dan <strong>A</strong> (actual)
          — untuk jadwal yang sudah <strong>RELEASED</strong>, angka aktual diambil otomatis dari FRED begitu tersedia.
        </p>
        <div className="notice">
          {liveSource ? (
            <>🔗 Konsensus &amp; event pasar ditarik <strong>live dari ForexFactory</strong>; angka aktual &amp; previous
            <strong> langsung dari FRED</strong> ({liveFred}/{meta.totalFred} seri live). Tanggal rilis mengikuti jadwal
            resmi BLS/BEA/Fed/Census/ISM.</>
          ) : (
            <>ℹ️ Jadwal dari kalender resmi (BLS, BEA, Federal Reserve, Census, ISM, ECB); konsensus dari arsip
            ForexFactory (host live tidak terjangkau saat ini — otomatis aktif kembali saat tersedia). Angka aktual
            dari FRED{liveFred ? ` (${liveFred}/${meta.totalFred} seri live)` : " (cache, diperbarui otomatis)"}.</>
          )}{" "}
          Selalu verifikasi ke sumber resmi karena jadwal bisa berubah.
        </div>
      </section>

      <CalendarClient events={events} details={details} meta={meta} />
    </>
  );
}
