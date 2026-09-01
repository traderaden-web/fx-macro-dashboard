import { Component } from "react";
import { useEffect, useState } from "react";
import IndicatorClient from "./components/IndicatorClient";
import { getReleaseAnalytics } from "./lib/consensus";
import { CATEGORIES, COUNTRIES } from "./lib/series";
import { getEducation, GENERAL } from "./lib/education";
import { UPCOMING } from "./data/calendar";

class EB extends Component {
  state = { err: null };
  static getDerivedStateFromError(e) { return { err: e }; }
  render() {
    if (this.state.err) return <pre id="eb">{String(this.state.err.message)}</pre>;
    return this.props.children;
  }
}

export default function App({ id }) {
  const [p, setP] = useState(null);
  useEffect(() => { getReleaseAnalytics(id).then(setP); }, [id]);
  if (!p) return <div id="loading">…</div>;
  const data = p;
  const cat = CATEGORIES.find((c) => c.id === data.category);
  const country = COUNTRIES.find((c) => c.id === data.country);
  const edu = getEducation(id);
  const upcoming = UPCOMING.filter((e) => e.indicatorId === id)
    .sort((a, b) => a.iso.localeCompare(b.iso)).slice(0, 3);
  return (
    <EB>
      <IndicatorClient
        data={data}
        releases={p.releases}
        accuracy={p.accuracy}
        source={p.source}
        edu={edu}
        general={GENERAL}
        cat={cat}
        country={country}
        upcoming={upcoming}
      />
    </EB>
  );
}
