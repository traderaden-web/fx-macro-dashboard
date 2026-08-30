import { getAllSeriesData } from "../../lib/data";
import { COUNTRIES } from "../../lib/series";
import { CountryFlag } from "../../components/Badges";
import { fmt } from "../../lib/format";

export default async function EconomyPage() {
  const all = await getAllSeriesData();

  const byCountry = {};
  for (const d of all) {
    if (d.country === "GL") continue;
    if (!byCountry[d.country]) byCountry[d.country] = [];
    byCountry[d.country].push(d);
  }

  const countries = COUNTRIES.filter((c) => byCountry[c.id]);

  return (
    <>
      <section className="hero" style={{ paddingTop: 20 }}>
        <h1>Ringkasan Ekonomi Global</h1>
        <p>
          Profil ekonomi tiap wilayah utama — inflasi, pengangguran, suku bunga, dan pertumbuhan —
          untuk memahami bagaimana kondisi masing-masing mendorong nilai tukar mata uangnya.
        </p>
      </section>

      {countries.map((c) => {
        const list = byCountry[c.id];
        const order = ["cpi", "nfp", "fedfunds", "corecpi", "gdp", "unemp", "ppi", "ahe", "eu_cpi", "eu_unemp", "eu_gdp", "uk_cpi", "uk_unemp", "jp_cpi", "china_cpi", "claims", "capacity", "dgs10", "retail", "umich", "indpro", "ismmfg", "ismsvc"];
        const key = order
          .map((id) => list.find((d) => d.id === id))
          .filter(Boolean)
          .slice(0, 4);
        return (
          <section className="section" key={c.id}>
            <div className="section-head">
              <h2><CountryFlag code={c.id} size={16} /> {c.name}</h2>
              <span className="cell-muted">{list.length} indikator</span>
            </div>
            <div className="grid-4">
              {key.length ? (
                key.map((d) => {
                  const v = d.points?.length ? d.points[d.points.length - 1].value : null;
                  return (
                    <a key={d.id} href={`/indicators/${d.id}`} className="stat-card">
                      <div className="kpi-label">{d.short}</div>
                      <div className="stat-value-row">
                        <span className="stat-value" style={{ fontSize: 26 }}>
                          {fmt(v, d.decimals)}
                        </span>
                        <span className="stat-unit">{d.unit}</span>
                      </div>
                      <div className="cell-muted" style={{ marginTop: 4, fontSize: 12 }}>
                        {d.last?.date?.slice(0, 7)}
                      </div>
                    </a>
                  );
                })
              ) : (
                <div className="card" style={{ gridColumn: "1 / -1" }}>
                  Belum ada data untuk negara ini.
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
