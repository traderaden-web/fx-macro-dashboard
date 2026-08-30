import CalendarClient from "./components/CalendarClient";

export default function App() {
  const dstr = (days) => {
    const d = new Date(Date.now() + days * 86400000);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const ev = (days, time, title, category, country, impact, indicatorId, extra = {}) => ({
    title, category, country, impact, indicatorId, time,
    iso: `${dstr(days)}T${time}:00+07:00`,
    ...extra,
  });
  const events = [
    ev(-1, "19:30", "Consumer Price Index (CPI)", "inflasi", "US", "High", "cpi", {
      actual: "3.30", previous: "3.40", forecast: "3.40",
    }),
    ev(0, "10:00", "Retail Sales (JP)", "konsumen", "JP", "Low", "retail"),
    ev(0, "16:30", "Nonfarm Payrolls (NFP)", "tenaga-kerja", "US", "Medium", "nfp"),
    ev(0, "19:30", "Consumer Price Index (CPI)", "inflasi", "US", "High", "cpi"),
    ev(1, "01:00", "FOMC Federal Funds Rate", "moneter", "US", "High", "fedfunds"),
    ev(1, "07:00", "GDP (UK)", "pertumbuhan", "GB", "Low", "gdp"),
  ];
  return <CalendarClient events={events} />;
}
