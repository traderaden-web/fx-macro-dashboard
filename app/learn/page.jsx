import Link from "next/link";
import { SERIES, CATEGORIES, COUNTRIES } from "../../lib/series";
import { EDUCATION, GENERAL } from "../../lib/education";
import { GLOSSARY } from "../../lib/glossary";
import { ImpactBadge, CountryFlag } from "../../components/Badges";
import { IconLightbulb, IconTarget } from "../../components/Icons";

export const metadata = {
  title: "Pusat Belajar Data Makro — MacroLab",
  description: "Panduan memahami indikator ekonomi, cara membacanya, dan prospek ke depan untuk trading forex.",
};

export default function LearnPage() {
  const byCat = {};
  for (const c of CATEGORIES) byCat[c.id] = [];
  for (const s of SERIES) {
    const edu = EDUCATION[s.id];
    if (!edu) continue;
    byCat[s.category]?.push({ ...s, edu });
  }

  const IMPACT_GLOSSARY = [
    { level: "High", desc: "Rilis besar yang biasanya memicu lonjakan volatilitas signifikan pada pair terkait." },
    { level: "Medium", desc: "Bisa memicu pergerakan tertentu, terutama jika angka meleset jauh dari konsensus." },
    { level: "Low", desc: "Biasanya berdampak kecil; penting hanya jika dikombinasikan dengan rilis lain." },
  ];

  return (
    <>
      <section className="hero section-fade">
        <h1>Pusat Belajar Data Makro</h1>
        <p>
          Pahami setiap indikator ekonomi dengan bahasa sederhana: apa artinya, bagaimana membacanya, dan
          ke arah mana prospeknya. Panduan penting bagi trader forex yang ingin membaca berita dengan benar.
        </p>
      </section>

      <section className="section section-fade">
        <div className="section-head"><h2>{GENERAL.title}</h2></div>
        <div className="card">
          <p style={{ margin: "0 0 14px", color: "var(--muted)" }}>{GENERAL.intro}</p>
          <div className="info-grid">
            <div className="info-block" style={{ gridColumn: "1 / -1" }}>
              <h4>Konsep Kunci</h4>
              <ul className="edu-list">{GENERAL.points.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
            <div className="info-block" style={{ gridColumn: "1 / -1" }}>
              <h4><span className="inline-ico"><IconLightbulb size={15} /></span> Tips Praktis</h4>
              <ul className="edu-list">{GENERAL.tips.map((p, i) => <li key={i}>{p}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" id="glosarium">
        <div className="section-head">
          <h2>Glosarium Istilah</h2>
          <span className="cell-muted">Bahasa sederhana untuk pemula</span>
        </div>
        <div className="card" style={{ margin: 0 }}>
          <div className="gloss-list">
            {GLOSSARY.map((g) => (
              <div className="gloss-item" key={g.term}>
                <div className="gloss-term">{g.term}</div>
                <div className="gloss-def">{g.def}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section reveal">
        <div className="section-head">
          <h2>Level Dampak</h2>
          <span className="cell-muted">Seberapa besar potensi pergerakan</span>
        </div>
        <div className="grid grid-4">
          {IMPACT_GLOSSARY.map((g) => (
            <div className="card" key={g.level} style={{ margin: 0 }}>
              <ImpactBadge level={g.level} />
              <p className="cell-muted" style={{ margin: "10px 0 0", fontSize: 13 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {CATEGORIES.map((c) => {
        const list = byCat[c.id];
        if (!list.length) return null;
        return (
          <section className="section" key={c.id}>
            <div className="section-head">
              <h2><span style={{ color: c.color }}>●</span> {c.label} <span style={{ color: "var(--muted)", fontSize: 15, fontWeight: 400 }}>— {list.length} indikator</span></h2>
            </div>
            <div className="learn-grid">
              {list.map((s) => {
                const country = COUNTRIES.find((x) => x.id === s.country);
                return (
                  <div className="card learn-card reveal stagger" key={s.id}>
                    <div className="learn-head">
                      <div>
                        <div className="learn-title"><CountryFlag code={country?.id} size={15} /> {s.name}</div>
                        <div className="cell-muted" style={{ fontSize: 12 }}>{country?.name} · {s.unit} · Frekuensi {s.freq}</div>
                      </div>
                      <ImpactBadge level={s.impact} />
                    </div>
                    <div className="learn-body">
                      <p className="learn-intro">{s.about}</p>
                      <h4>Cara Membaca</h4>
                      <ul className="edu-list">{s.edu.read.map((p, i) => <li key={i}>{p}</li>)}</ul>
                      <h4>Faktor Penggerak — Detail</h4>
                      <div className="driver-grid" style={{ gridTemplateColumns: "1fr" }}>
                        {s.edu.drivers.map((d, i) => (
                          <div className="info-block driver-item" key={i} style={{ padding: "11px 13px" }}>
                            <h4 style={{ fontSize: 12.5 }}>{d.name}</h4>
                            <p style={{ fontSize: 12.5 }}>{d.detail}</p>
                          </div>
                        ))}
                      </div>
                      <h4>Prospek ke Depan</h4>
                      <p className="learn-outlook">{s.edu.outlook}</p>
                      {s.edu.expertViews && s.edu.expertViews.length > 0 && (
                        <>
                          <h4>Perspektif Pakar Global</h4>
                          <div className="expert-grid" style={{ gridTemplateColumns: "1fr" }}>
                            {s.edu.expertViews.map((e, i) => (
                              <div className="expert-card" key={i} style={{ padding: "12px 13px" }}>
                                <div className="expert-head">
                                  <span className="expert-avatar" style={{ width: 30, height: 30, fontSize: 14 }}>{(e.desk || "").charAt(0)}</span>
                                  <div>
                                    <div className="expert-desk" style={{ fontSize: 12.5 }}>{e.desk}</div>
                                  </div>
                                </div>
                                <p className="expert-view" style={{ fontSize: 12.5 }}>{e.view}</p>
                                <div className="expert-foot"><span className="expert-signal" style={{ fontSize: 11 }}><IconTarget size={13} /> {e.signal}</span></div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <Link href={`/indicators/${s.id}`} className="btn btn-ghost learn-cta">Buka data {s.short} →</Link>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
