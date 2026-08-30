import { useEffect, useState } from "react";
import AnalysisClient from "./components/AnalysisClient";
import { getAllReleaseAnalytics } from "./lib/consensus";
import { UPCOMING } from "./data/calendar";
export default function MacroApp() {
  const [items, setItems] = useState(null);
  useEffect(() => { getAllReleaseAnalytics().then(setItems); }, []);
  if (!items) return <div id="loading">…</div>;
  return <AnalysisClient items={items} upcoming={UPCOMING} />;
}
