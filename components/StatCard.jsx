// components/StatCard.jsx
// Kartu ringkasan indikator untuk halaman depan — dengan animasi nilai & entri.
import Link from "next/link";
import Sparkline from "./Sparkline";
import CountUp from "./CountUp";
import { ImpactBadge, CategoryBadge, CountryFlag } from "./Badges";
import { CATEGORIES } from "../lib/series";

export default function StatCard({ data, index = 0 }) {
  const cat = CATEGORIES.find((c) => c.id === data.category);
  const catColor = cat ? cat.color : "#94a3b8";
  const change = data.points && data.points.length >= 2 ? data.points[data.points.length - 1].value : null;
  const prev = data.points && data.points.length >= 2 ? data.points[data.points.length - 2].value : null;
  const trend = prev !== null && change !== null ? change - prev : 0;

  const fmt = (v) => (v === null || v === undefined ? "—" : Number(v).toLocaleString("id-ID", { maximumFractionDigits: data.decimals ?? 2 }));

  return (
    <Link
      href={`/indicators/${data.id}`}
      className="stat-card reveal-stagger"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="stat-top">
        <div className="stat-title">
          <CountryFlag code={data.country} />
          <div>
            <div className="stat-name">{data.short}</div>
            <div className="stat-sub">{data.countryName}</div>
          </div>
        </div>
        <ImpactBadge level={data.impact} />
      </div>

      <div className="stat-value-row">
        <span className="stat-value">
          <CountUp value={Number(change) || 0} decimals={data.decimals ?? 2} />
        </span>
        <span className="stat-unit">{data.unit}</span>
      </div>

      <div className={`stat-trend ${trend >= 0 ? "up" : "down"}`} style={{ color: trend >= 0 ? "var(--up)" : "var(--down)" }}>
        {trend >= 0 ? "▲" : "▼"} {fmt(Math.abs(trend))} <span className="stat-mut">mo/mo</span>
      </div>

      <div className="stat-spark">
        <Sparkline points={data.points} color={catColor} width={220} height={44} />
      </div>

      <div className="stat-foot">
        <CategoryBadge id={cat?.id} label={cat?.label} color={catColor} />
        <span className="stat-date">{data.last?.date?.slice(0, 7) || "—"}</span>
      </div>
    </Link>
  );
}
