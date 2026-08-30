import { useEffect, useState } from "react";
import IndicatorClient from "./components/IndicatorClient";
import { getReleaseAnalytics } from "./lib/consensus";
import { CATEGORIES, COUNTRIES } from "./lib/series";
import { getEducation, GENERAL } from "./lib/education";
import { UPCOMING } from "./data/calendar";

export default function App({ id }) {
  const [a, setA] = useState(null);
  useEffect(() => {
    getReleaseAnalytics(id).then(setA).catch(() => setA({}));
  }, [id]);
  if (!a || !a.id) return <div id="loading">…</div>;
  const data = a;
  return (
    <IndicatorClient
      data={data}
      releases={a.releases || []}
      accuracy={a.accuracy}
      source={a.source}
      edu={getEducation(id)}
      general={GENERAL}
      cat={CATEGORIES.find((c) => c.id === data.category)}
      country={COUNTRIES.find((c) => c.id === data.country)}
      upcoming={UPCOMING.filter((e) => e.indicatorId === id).sort((x, y) => x.iso.localeCompare(y.iso)).slice(0, 3)}
    />
  );
}
