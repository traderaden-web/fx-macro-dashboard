import { useEffect, useState } from "react";
import IndicatorsClient from "./components/IndicatorsClient";
import { getAllSeriesData } from "./lib/data";

export default function App() {
  const [items, setItems] = useState(null);
  useEffect(() => {
    getAllSeriesData().then(setItems).catch(() => setItems([]));
  }, []);
  if (!items) return <div id="loading">…</div>;
  return <IndicatorsClient items={items} />;
}
