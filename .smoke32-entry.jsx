import { useEffect, useState } from "react";
import CalendarClient from "./components/CalendarClient";
import { getReleaseAnalytics } from "./lib/consensus";
import { CATEGORIES, COUNTRIES } from "./lib/series";
import { getEducation, GENERAL } from "./lib/education";

export default function App({ events, ids }) {
  const [details, setDetails] = useState(null);
  useEffect(() => {
    Promise.all(ids.map((id) => getReleaseAnalytics(id).catch(() => null))).then((list) => {
      const d = {};
      ids.forEach((id, i) => {
        const a = list[i];
        if (!a) return;
        d[id] = {
          data: a, releases: a.releases, accuracy: a.accuracy, source: a.source,
          edu: getEducation(id), general: GENERAL,
          cat: CATEGORIES.find((c) => c.id === a.category),
          country: COUNTRIES.find((c) => c.id === a.country),
          upcoming: [],
        };
      });
      setDetails(d);
    });
  }, [ids]);
  if (!details) return <div id="loading">…</div>;
  return <CalendarClient events={events} details={details} />;
}
