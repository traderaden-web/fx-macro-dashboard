import { notFound } from "next/navigation";
import { getReleaseAnalytics } from "../../../lib/consensus";
import { CATEGORIES, COUNTRIES } from "../../../lib/series";
import { getEducation, GENERAL } from "../../../lib/education";
import { UPCOMING } from "../../../data/calendar";
import IndicatorClient from "../../../components/IndicatorClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Indikator ${id} — MacroLab`,
    description: "Detail indikator makro: riwayat, consensus vs actual, dan edukasi praktis untuk forex.",
  };
}

export default async function IndicatorDetail({ params }) {
  const { id } = await params;

  // getReleaseAnalytics = {...seriesDef, points, last, source, updated, releases, accuracy}
  const analytics = await getReleaseAnalytics(id);
  if (!analytics) notFound();

  const data = analytics;
  const cat = CATEGORIES.find((c) => c.id === data.category);
  const country = COUNTRIES.find((c) => c.id === data.country);
  const edu = getEducation(id);
  const upcoming = UPCOMING.filter((e) => e.indicatorId === id)
    .sort((a, b) => a.iso.localeCompare(b.iso))
    .slice(0, 3);

  return (
    <>
      <section className="hero section-fade" style={{ paddingTop: 20 }}>
        <h1>Indikator: {data.short}</h1>
        <p>
          Detail lengkap <strong>{data.name}</strong> — riwayat data, konsensus vs aktual, dan cara membacanya
          untuk trading forex. Waktu rilis dalam <strong>WIB (UTC+7)</strong>.
        </p>
      </section>

      <IndicatorClient
        data={data}
        releases={analytics.releases}
        accuracy={analytics.accuracy}
        source={analytics.source}
        edu={edu}
        general={GENERAL}
        cat={cat}
        country={country}
        upcoming={upcoming}
      />
    </>
  );
}
