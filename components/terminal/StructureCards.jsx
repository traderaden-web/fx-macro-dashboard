// components/terminal/StructureCards.jsx
// Empat kartu analisis struktur pasar untuk Terminal:
//   1. SMC — market structure (BOS/CHoCH), Order Block, FVG, liquidity sweep
//   2. ICT — premium/discount gauge, OTE, liquidity pool, killzone WIB
//   3. SNR — support & resistance terdekat (klaster swing + sentuhan)
//   4. BREAKOUT — kotak range 20 bar, status, retest & target measured-move

"use client";

import { useEffect, useState } from "react";
import { fmtPrice, fmtPips, barsAgo, DIR, TF_LABEL } from "./fmt";

const ZONE_STATUS = { fresh: "Fresh", tested: "Tertest ✓", mitigated: "Termitigasi" };

function ZoneList({ title, items, empty, render }) {
  return (
    <div className="smc-group">
      <span className="smc-group-title">{title}</span>
      {items?.length ? <ul className="smc-list">{items.map(render)}</ul> : <p className="cell-muted smc-empty">{empty}</p>}
    </div>
  );
}

// ─── 1. SMC ───────────────────────────────────────────────────────────────
function SmcCard({ smc, symbolId, tf }) {
  const st = smc?.structure;
  const bias = st?.bias || "RANGE";
  const biasDir = bias === "BULLISH" ? "up" : bias === "BEARISH" ? "down" : "flat";
  return (
    <article className="term-card smc-card">
      <header className="term-head">
        <h3 className="term-title">
          <span className="term-ico" aria-hidden="true">🏗️</span>
          SMC — Struktur Pasar <span className="term-sub">· {TF_LABEL[tf] || tf}</span>
        </h3>
        <span className={`chip-dir ${biasDir}`}>{bias === "BULLISH" ? "▲" : bias === "BEARISH" ? "▼" : "◆"} {bias}</span>
      </header>
      <div className="term-body smc-body">
        <ZoneList
          title="Break of Structure / CHoCH"
          items={st?.events}
          empty="Belum ada BOS/CHoCH terbaru pada timeframe ini."
          render={(e, i) => (
            <li key={i} className={e.dir === "bullish" ? "up" : "down"}>
              <span className={`smc-ev ${e.type === "BOS" ? "bos" : "choch"}`}>{e.type}</span>
              <span className="smc-lv">{fmtPrice(symbolId, e.level)}</span>
              <span className="cell-muted">{barsAgo(e.barsAgo)}</span>
            </li>
          )}
        />
        <ZoneList
          title="Order Block (zona institusional)"
          items={smc?.orderBlocks}
          empty="Tidak ada order block aktif di dekat harga."
          render={(ob, i) => (
            <li key={i} className={ob.side === "bullish" ? "up" : "down"}>
              <span className={`smc-ev ${ob.side === "bullish" ? "dem" : "sup"}`}>{ob.side === "bullish" ? "DEMAND" : "SUPPLY"}</span>
              <span className="smc-lv">{fmtPrice(symbolId, ob.bottom)} – {fmtPrice(symbolId, ob.top)}</span>
              <span className={`smc-st st-${ob.status}`}>{ZONE_STATUS[ob.status]}</span>
              <span className="cell-muted">{barsAgo(ob.barsAgo)}</span>
            </li>
          )}
        />
        <ZoneList
          title="Fair Value Gap (imbalance)"
          items={smc?.fvgs}
          empty="Tidak ada FVG terbuka — harga efisien."
          render={(g, i) => (
            <li key={i} className={g.side === "bullish" ? "up" : "down"}>
              <span className={`smc-ev ${g.side === "bullish" ? "dem" : "sup"}`}>{g.side === "bullish" ? "FVG▲" : "FVG▼"}</span>
              <span className="smc-lv">{fmtPrice(symbolId, g.bottom)} – {fmtPrice(symbolId, g.top)}</span>
              <span className="smc-st">{g.state}{g.fillPct > 0 ? ` ${g.fillPct}%` : ""}</span>
              <span className="cell-muted">{barsAgo(g.barsAgo)}</span>
            </li>
          )}
        />
        <ZoneList
          title="Liquidity Sweep"
          items={smc?.liquidity}
          empty="Belum ada equal highs/lows yang jelas."
          render={(p, i) => (
            <li key={i} className={p.side === "buyside" ? "down" : "up"}>
              <span className={`smc-ev ${p.side === "buyside" ? "sup" : "dem"}`}>{p.side === "buyside" ? "EQH" : "EQL"}</span>
              <span className="smc-lv">{fmtPrice(symbolId, p.price)}</span>
              <span className={`smc-st ${p.swept ? "st-tested" : "st-fresh"}`}>{p.swept ? `Tersapu ${barsAgo(p.sweptBarsAgo)}` : "Belum tersapu"}</span>
            </li>
          )}
        />
      </div>
    </article>
  );
}

// ─── 2. ICT ───────────────────────────────────────────────────────────────
const KILLZONES = [
  { name: "Asian", start: 6, end: 9, note: "Range akumulasi" },
  { name: "London", start: 14, end: 17, note: "Judas swing & expansion" },
  { name: "New York", start: 19, end: 22, note: "Reversal / continuation" },
];

function Killzone() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  const hourWib = now
    ? Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Jakarta" }).format(now))
    : null;
  return (
    <div className="ict-kz">
      <span className="smc-group-title">Killzone ICT (WIB, ±1 jam saat DST)</span>
      <div className="ict-kz-row">
        {KILLZONES.map((k) => {
          const active = hourWib != null && hourWib >= k.start && hourWib < k.end;
          return (
            <span key={k.name} className={`ict-kz-chip ${active ? "on" : ""}`} title={k.note}>
              {active && <span className="pulse-dot" style={{ width: 6, height: 6 }} />}
              {k.name} <b>{k.start}:00–{k.end}:00</b>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function IctCard({ smc, symbolId }) {
  const pd = smc?.premium;
  const pools = smc?.liquidity || [];
  const price = smc?.price;
  if (!pd) return null;
  const zoneCls = pd.zone.includes("PREMIUM") ? "down" : pd.zone.includes("DISKON") ? "up" : "flat";
  const markerLeft = Math.max(0, Math.min(100, pd.pos));
  const rangeW = pd.hi - pd.lo;
  const eqLeft = rangeW > 0 ? ((pd.eq - pd.lo) / rangeW) * 100 : 50;
  return (
    <article className="term-card smc-card">
      <header className="term-head">
        <h3 className="term-title">
          <span className="term-ico" aria-hidden="true">🧠</span>
          ICT — Premium / Discount
        </h3>
        <span className={`chip-dir ${zoneCls}`}>{pd.zone}</span>
      </header>
      <div className="term-body smc-body">
        <div className="ict-gauge" role="img" aria-label={`Harga berada di ${pd.zone}, posisi ${pd.pos} persen range`}>
          <div className="ict-gauge-bar">
            <span className="ict-gauge-eq" style={{ left: `${eqLeft}%` }} title={`Equilibrium ${fmtPrice(symbolId, pd.eq)}`} />
            <span className="ict-gauge-mark" style={{ left: `${markerLeft}%` }} title={`Harga ${fmtPrice(symbolId, price)}`} />
          </div>
          <div className="ict-gauge-scale">
            <span title="Diskon (area cari BUY)">DISKON {fmtPrice(symbolId, pd.lo)}</span>
            <span title="Equilibrium 50%">50% {fmtPrice(symbolId, pd.eq)}</span>
            <span title="Premium (area cari SELL)">PREMIUM {fmtPrice(symbolId, pd.hi)}</span>
          </div>
        </div>
        <p className="cell-muted ict-hint">
          Prinsip ICT: <b className="up">BUY di diskon</b> · <b className="down">SELL di premium</b> — searah bias struktur (lihat kartu SMC).
        </p>
        {pd.ote && (
          <div className={`ict-ote ${pd.ote.inside ? "inside" : ""}`}>
            <div className="ict-ote-top">
              <b>OTE — Optimal Trade Entry</b>
              <span className={`smc-st ${pd.ote.inside ? "st-tested" : ""}`}>{pd.ote.inside ? "HARGA DI ZONA OTE" : "di luar zona"}</span>
            </div>
            <div className="ict-ote-lv">
              {fmtPrice(symbolId, pd.ote.bottom)} – {fmtPrice(symbolId, pd.ote.top)}
              <em>retrace 62–79% leg {pd.ote.legFrom} → {pd.ote.legTo}</em>
            </div>
          </div>
        )}
        <div className="smc-group">
          <span className="smc-group-title">Liquidity Pool (target smart money)</span>
          {pools.length ? (
            <ul className="smc-list">
              {pools.map((p, i) => (
                <li key={i} className={p.side === "buyside" ? "down" : "up"}>
                  <span className={`smc-ev ${p.side === "buyside" ? "sup" : "dem"}`}>{p.side === "buyside" ? "Buy-side" : "Sell-side"}</span>
                  <span className="smc-lv">{fmtPrice(symbolId, p.price)}</span>
                  <span className="cell-muted">{p.swept ? "sudah disapu" : "magnet harga"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="cell-muted smc-empty">Tidak ada pool menonjol.</p>
          )}
        </div>
        <Killzone />
      </div>
    </article>
  );
}

// ─── 3. SNR ───────────────────────────────────────────────────────────────
function SnrCard({ snr, symbolId, price }) {
  if (!snr) return null;
  const Row = ({ lv, cls }) => (
    <li className={cls}>
      <span className={`snr-key ${cls}`}>{lv.key}</span>
      <span className="snr-price">{fmtPrice(symbolId, lv.price)}</span>
      <span className="snr-touches" title={`Disentuh ${lv.touches}×· semakin sering semakin kuat`}>{lv.touches}× sentuh</span>
      <span className="snr-str-meter" title={`Kekuatan ${lv.strength}/100`}><i style={{ width: `${lv.strength}%` }} className={cls} /></span>
      <span className="cell-muted">{fmtPips(symbolId, lv.distPts)}</span>
    </li>
  );
  return (
    <article className="term-card smc-card">
      <header className="term-head">
        <h3 className="term-title">
          <span className="term-ico" aria-hidden="true">🧱</span>
          SNR — Support &amp; Resistance
        </h3>
        <span className="term-badge">klaster swing</span>
      </header>
      <div className="term-body smc-body">
        <div className="smc-group">
          <span className="smc-group-title down">Resistance di atas harga</span>
          {snr.resistances?.length ? (
            <ul className="snr-list">{snr.resistances.map((lv) => <Row key={lv.key} lv={lv} cls="down" />)}</ul>
          ) : <p className="cell-muted smc-empty">Langit cerah — tidak ada resistance dekat.</p>}
        </div>
        <div className="snr-now">
          <span className="pulse-dot" style={{ width: 7, height: 7 }} />
          Harga sekarang <b>{fmtPrice(symbolId, price)}</b>
        </div>
        <div className="smc-group">
          <span className="smc-group-title up">Support di bawah harga</span>
          {snr.supports?.length ? (
            <ul className="snr-list">{snr.supports.map((lv) => <Row key={lv.key} lv={lv} cls="up" />)}</ul>
          ) : <p className="cell-muted smc-empty">Tidak ada support dekat — harga di wilayah baru.</p>}
        </div>
        <p className="cell-muted ict-hint">Level hasil klaster pivot high/low 220 bar. Gunakan S1/R1 reaksi pertama; jebol &amp; retest = sinyal lanjutan.</p>
      </div>
    </article>
  );
}

// ─── 4. BREAKOUT ──────────────────────────────────────────────────────────
function BreakoutCard({ breakout, symbolId, price }) {
  if (!breakout) return null;
  const st = breakout.status;
  const stTxt = st === "BREAKOUT_UP" ? "BREAKOUT NAIK" : st === "BREAKOUT_DOWN" ? "BREAKOUT TURUN" : "DI DALAM RANGE";
  const stCls = st === "BREAKOUT_UP" ? "up" : st === "BREAKOUT_DOWN" ? "down" : "flat";
  const b = breakout.breakout;
  const retestTxt = { baru: "baru saja — belum retest", belum: "belum retest", sukses: "retest SUKSES (held)", gagal: "retest GAGAL (false break)" }[b?.retest];
  return (
    <article className="term-card smc-card">
      <header className="term-head">
        <h3 className="term-title">
          <span className="term-ico" aria-hidden="true">💥</span>
          Breakout — Range 20 Bar
        </h3>
        <span className={`chip-dir ${stCls}`}>{stTxt}</span>
      </header>
      <div className="term-body smc-body">
        <div className="br-box">
          <div className="br-box-edge up"><span>Atas range</span><b>{fmtPrice(symbolId, breakout.hi)}</b></div>
          <div
            className="br-box-fill"
            role="img"
            aria-label={`Posisi harga ${breakout.posPct} persen di dalam range`}
            style={{ height: "118px" }}
          >
            <span className="br-box-zone" />
            <span
              className={`br-box-price ${breakout.posPct > 92 || breakout.posPct < 8 ? "edge" : ""}`}
              style={{ bottom: `${Math.max(4, Math.min(96, breakout.posPct))}%` }}
            >
              <i /> {fmtPrice(symbolId, price)}
            </span>
          </div>
          <div className="br-box-edge down"><span>Bawah range</span><b>{fmtPrice(symbolId, breakout.lo)}</b></div>
          <div className="br-box-meta">
            <span>Lebar {fmtPips(symbolId, breakout.width)}</span>
            <span>Posisi {breakout.posPct}%</span>
          </div>
        </div>
        {b && (
          <div className={`br-event ${b.dir === "up" ? "up" : "down"}`}>
            <div className="br-event-top">
              <b>{b.dir === "up" ? "▲ Breakout atas" : "▼ Breakout bawah"}</b>
              <span className={`smc-st ${b.retest === "sukses" ? "st-tested" : b.retest === "gagal" ? "st-mitigated" : "st-fresh"}`}>{retestTxt}</span>
            </div>
            <div className="br-event-lv">
              Level {fmtPrice(symbolId, b.level)} · {barsAgo(b.barsAgo)} · target measured-move <b>{fmtPrice(symbolId, b.target)}</b>
            </div>
          </div>
        )}
        <p className="cell-muted ict-hint">
          Taktik: entry saat <b>close di luar kotak</b> atau saat <b>retest level breakout</b> bertahan;
          SL di dalam range (sisi sebaliknya), target = lebar range diproyeksikan.
        </p>
      </div>
    </article>
  );
}

export default function StructureCards({ data, tf, loading }) {
  if (loading && !data) {
    return <div className="cell-muted" style={{ padding: "10px 2px" }}>Menganalisis struktur pasar…</div>;
  }
  return (
    <div className="smc-grid">
      <SmcCard smc={data?.smc} symbolId={data?.symbol?.id} tf={tf} />
      <IctCard smc={data?.smc} symbolId={data?.symbol?.id} />
      <SnrCard snr={data?.snr} symbolId={data?.symbol?.id} price={data?.smc?.price ?? data?.signal?.price} />
      <BreakoutCard breakout={data?.breakout} symbolId={data?.symbol?.id} price={data?.smc?.price ?? data?.signal?.price} />
    </div>
  );
}
