import { notFound } from "next/navigation";
import { getSeriesData } from "../../../lib/data";
import { getReleaseAnalytics } from "../../../lib/consensus";
import { CATEGORIES, COUNTRIES } from "../../../lib/series";
import { getEducation, GENERAL } from "../../../lib/education";
import Chart from "../../../components/Chart";
import { ImpactBadge, CategoryBadge, CountryFlag } from "../../../components/Badges";
import { GlossaryHint } from "../../../components/Legend";
import { IconTarget } from "../../../components/Icons";
import { fmt } from "../../../lib/format";

export default async function IndicatorDetail({ params }) {
  const { id } = await params;
  const data = await getSeriesData(id);
  if (!data) notFound();

  const analytics = await getReleaseAnalytics(id);
  const latest = analytics?.releases?.length ? analytics.releases[analytics.releases.length - 1] : null;
  const edu = getEducation(id);

  const cat = CATEGORIES.find((c) => c.id === data.category);
  const country = COUNTRIES.find((c) => c.id === data.country);
  const pts = data.points || [];
  const v = pts.length ? pts[pts.length - 1].value : null;
  const prev = pts.length > 1 ? pts[pts.length - 2].value : null;
  const yearAgo = pts.length > 12 ? pts[pts.length - 13].value : null;

  return (
    <>
      <div className="detail-head section-fade">
        <div className="detail-title-row">
          <CountryFlag code={data.country} />
          <h1>{data.name}</h1>
          <ImpactBadge level={data.impact} />
          <CategoryBadge id={cat?.id} label={cat?.label} color={cat?.color} />
        </div>
        <div className="tags">
          <span className="badge cat" style={{ color: "var(--muted)", background: "rgba(148,163,184,0.12)" }}>
            {country?.name || "Global"}
          </span>
          <span className="badge cat" style={{ color: "var(--muted)", background: "rgba(148,163,184,0.12)" }}>
            Frekuensi: {data.freq === "D" ? "Harian" : data.freq === "Q" ? "Kuartalan" : "Bulanan"}
          </span>
          <span className="badge cat" style={{ color: "var(--muted)", background: "rgba(148,163,184,0.12)" }}>
            Rilis: {data.release}
          </span>
        </div>
      </div>

      <GlossaryHint />

      <div className="stat-grid reveal">
        <Kpi label="Nilai Terbaru" tip="Angka terakhir dari indikator ini yang tersedia." value={`${fmt(v, data.decimals)} ${data.unit}`} />
        <Kpi
          label="Perubahan (MoM)"
          tip="Perbandingan dengan periode sebelumnya. Naik/▲ atau Turun/▼."
          value={prev !== null && v !== null ? `${v - prev >= 0 ? "+" : ""}${fmt(v - prev, data.decimals)}` : "—"}
          tone={prev !== null && v !== null ? (v - prev >= 0 ? "up" : "down") : undefined}
        />
        <Kpi label="Setahun Lalu" tip="Nilai sekitar 12 bulan lalu, untuk melihat tren jangka panjang." value={yearAgo !== null ? `${fmt(yearAgo, data.decimals)}` : "—"} />
        <Kpi label="Sumber" tip="Data diambil dari sumber resmi & cache lokal sebagai cadangan." value={data.source === "live" ? "FRED (live)" : "Cache lokal"} sub={data.updated?.slice(0, 10)} />
      </div>

      <div className="card reveal">
        <h3>Riwayat {data.short}</h3>
        <Chart points={pts} color={cat?.color || "#f0b429"} unit={data.unit} decimals={data.decimals} height={300} />
      </div>

      {latest && (
        <div className="card reveal">
          <h3>Consensus vs Actual — Rilis Terakhir</h3>
          <div className="hilo-grid">
            <div className="hilo"><div className="kpi-label">Previous</div><div className="kpi-value" style={{ fontSize: 24 }}>{latest.previous == null ? "—" : fmt(latest.previous, data.decimals)}</div></div>
            <div className="hilo" style={{ border: "1px solid var(--accent)" }}><div className="kpi-label">Consensus</div><div className="kpi-value" style={{ fontSize: 24 }}>{latest.consensus == null ? "—" : fmt(latest.consensus, data.decimals)}</div></div>
            <div className="hilo" style={{ border: "1px solid var(--accent)" }}><div className="kpi-label">Actual</div><div className="kpi-value" style={{ fontSize: 24 }}>{latest.actual == null ? "—" : fmt(latest.actual, data.decimals)}</div></div>
            <div className="hilo">
              <div className="kpi-label">Surprise</div>
              <div className="kpi-value" style={{ fontSize: 24, color: latest.surprisePct > 0 ? "var(--up)" : latest.surprisePct < 0 ? "var(--down)" : "var(--warn)" }}>
                {latest.surprisePct == null ? "—" : `${latest.surprise > 0 ? "+" : ""}${fmt(latest.surprise, data.decimals)}`}
              </div>
              <div className="kpi-sub">{latest.surprisePct == null ? "" : `${latest.surprisePct > 0 ? "+" : ""}${latest.surprisePct.toFixed(2)}%`}</div>
            </div>
          </div>
          <p className="cell-muted" style={{ margin: "0 0 6px" }}>
            Lihat analisis lengkap dampak pair di <a href="/analysis" style={{ color: "var(--accent)", fontWeight: 600 }}>halaman Analisis Dampak →</a>
          </p>
        </div>
      )}

      <div className="card reveal">
        <h3>Apa & Mengapa Penting untuk Forex</h3>
        <div className="info-grid">
          <div className="info-block"><h4>APA ITU</h4><p>{data.about}</p></div>
          <div className="info-block"><h4>KENAPA PENTING</h4><p>{data.why}</p></div>
          <div className="info-block" style={{ gridColumn: "span 1" }}><h4>DAMPAK KE MATA UANG</h4><p>{data.fx}</p></div>
        </div>
      </div>

      {edu && (
        <>
          {/* 📖 Cara Membaca — langkah bernomor */}
          <div className="card reveal edu-card">
            <div className="edu-card-head">
              <span className="edu-emoji" aria-hidden="true">📖</span>
              <div>
                <h3>Cara Membaca {data.short}</h3>
                <p>Langkah-langkah praktis saat data ini rilis.</p>
              </div>
            </div>
            <ol className="edu-steps">
              {edu.read.map((p, i) => <li key={i}>{p}</li>)}
            </ol>
          </div>

          {/* 🔭 Prospek ke Depan — narasi + tabel skenario + pantau */}
          <div className="card reveal edu-card">
            <div className="edu-card-head">
              <span className="edu-emoji" aria-hidden="true">🔭</span>
              <div>
                <h3>Prospek ke Depan</h3>
                <p>Posisi terkini, skenario pasar, dan arah yang perlu diantisipasi.</p>
              </div>
            </div>
            <p className="outlook-text">{edu.outlook}</p>
            {edu.scenarios && edu.scenarios.length > 0 && (
              <div className="scenario-list">
                {edu.scenarios.map((s, i) => (
                  <div className={`scenario-row ${s.dir}`} key={i}>
                    <span className="scenario-case">{s.label}</span>
                    <span className="scenario-effect">{s.effect}</span>
                    <span className="scenario-dir">{s.dir === "up" ? "▲" : s.dir === "down" ? "▼" : "—"} {s.cur}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="tags" style={{ marginTop: 14 }}>
              <span className="cell-muted" style={{ fontWeight: 700 }}>Pantau:</span>
              {edu.watch.map((w, i) => <span key={i} className="badge cat" style={{ color: "var(--accent)", background: "rgba(240, 180, 41, 0.1)" }}>{w}</span>)}
            </div>
          </div>

          {/* ⚙️ Apa yang Menggerakkan — detail + data riil + sumber resmi */}
          <div className="card reveal edu-card">
            <div className="edu-card-head">
              <span className="edu-emoji" aria-hidden="true">⚙️</span>
              <div>
                <h3>Apa yang Menggerakkan {data.short}</h3>
                <p>Faktor penggerak, data rilinya, dan tautan ke sumber resminya.</p>
              </div>
            </div>
            <div className="driver-grid">
              {(edu.drivers || []).map((d, i) => (
                <div className="info-block driver-item" key={i}>
                  <h4>{d.name}</h4>
                  <p>{d.detail}</p>
                  {d.data && (
                    <div className="driver-data">
                      <span className="driver-data-label" aria-hidden="true">📊 Data riil</span>
                      <span>{d.data}</span>
                    </div>
                  )}
                  {d.src && (
                    <a className="driver-src" href={d.src.url} target="_blank" rel="noopener noreferrer" title={d.src.url}>
                      {d.src.label} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {edu.expertViews && edu.expertViews.length > 0 && (
            <div className="card reveal">
              <h3>🌍 Perspektif Pakar Analis Global</h3>
              <p className="cell-muted" style={{ margin: "0 0 14px", fontSize: 13 }}>{GENERAL.expertNote}</p>
              <div className="expert-grid">
                {edu.expertViews.map((e, i) => (
                  <div className="expert-card" key={i}>
                    <div className="expert-head">
                      <span className="expert-avatar">{(e.desk || "").charAt(0)}</span>
                      <div>
                        <div className="expert-desk">{e.desk}</div>
                        <div className="expert-role">Analis Global</div>
                      </div>
                    </div>
                    <p className="expert-view">{e.view}</p>
                    <div className="expert-foot">
                      <span className="expert-signal"><IconTarget size={13} /> {e.signal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {analytics?.releases?.length > 1 && (
        <div className="card reveal">
          <h3>📊 Riwayat Rilis — Consensus vs Actual</h3>
          <div className="table-wrap" style={{ border: "none" }}>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr><th>Tanggal</th><th>Previous</th><th>Consensus</th><th>Actual</th><th>Surprise</th></tr>
                </thead>
                <tbody>
                  {analytics.releases.slice(-6).reverse().map((r) => (
                    <tr key={r.date}>
                      <td className="cell-muted">{r.date}</td>
                      <td className="mono">{r.previous == null ? "—" : fmt(r.previous, data.decimals)}</td>
                      <td className="mono">{r.consensus == null ? "—" : fmt(r.consensus, data.decimals)}</td>
                      <td className="mono" style={{ fontWeight: 700 }}>{r.actual == null ? "—" : fmt(r.actual, data.decimals)}</td>
                      <td className="mono">
                        {r.surprise == null ? "—" : (
                          <span className={r.surprise >= 0 ? "val-up" : "val-down"}>
                            {r.surprise >= 0 ? "+" : ""}{fmt(r.surprise, data.decimals)}
                            {r.surprisePct != null ? ` (${r.surprisePct >= 0 ? "+" : ""}${r.surprisePct.toFixed(2)}%)` : ""}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="cell-muted" style={{ margin: "10px 0 0", fontSize: 12 }}>
            Belajar dari riwayat: perhatikan seberapa sering nilai aktual meleset dari konsensus (surprise) —
            itulah yang menggerakkan pasar.
          </p>
        </div>
      )}

      <div className="card reveal">
        <h3>Nilai Terbaru</h3>
        <div className="table-wrap" style={{ border: "none" }}>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr><th>Tanggal</th><th>Nilai</th><th>Perubahan</th></tr>
              </thead>
              <tbody>
                {pts.slice(-12).reverse().map((p, i, arr) => {
                  const next = arr[i - 1];
                  const c = next ? p.value - next.value : null;
                  return (
                    <tr key={p.date}>
                      <td className="cell-muted">{p.date}</td>
                      <td className="mono" style={{ fontWeight: 700 }}>{fmt(p.value, data.decimals)} {data.unit}</td>
                      <td className="mono">{c === null ? "—" : <span className={c >= 0 ? "val-up" : "val-down"}>{c >= 0 ? "+" : ""}{fmt(c, data.decimals)}</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

function Kpi({ label, value, tone, sub, tip }) {
  const color = tone === "up" ? "var(--up)" : tone === "down" ? "var(--down)" : undefined;
  return (
    <div className="kpi">
      <div className="kpi-label">{tip ? <span className="tip" data-tip={tip}>{label}</span> : label}</div>
      <div className="kpi-value" style={color ? { color } : undefined}>{value}</div>
      {sub ? <div className="kpi-sub">{sub}</div> : null}
    </div>
  );
}
