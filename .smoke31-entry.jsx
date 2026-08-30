import { useEffect, useState } from "react";
import CalendarClient from "./components/CalendarClient";
import { UPCOMING } from "./data/calendar";
import { CONSENSUS } from "./data/releases";
import { getSeedSeries } from "./lib/data";

// replika logika enrich page.jsx (addLocal) — deterministik, tanpa network
function enrich(e) {
  let previous = null, forecast = null;
  if (e.indicatorId) {
    const d = e.iso.slice(0, 10);
    const pts = getSeedSeries(e.indicatorId)?.points || [];
    for (const p of pts) {
      if (p.date < d) previous = p.value;
      else break;
    }
    const period = d.slice(0, 8) + "01";
    const cons = (CONSENSUS[e.indicatorId] || []).find((c) => c.date === period);
    if (cons && cons.consensus != null) forecast = cons.consensus;
  }
  return { ...e, iso: e.iso, forecast, actual: null, previous };
}

export default function App() {
  const events = useState(() => UPCOMING.map(enrich).sort((a, b) => a.iso.localeCompare(b.iso)))[0];
  return <CalendarClient events={events} />;
}
