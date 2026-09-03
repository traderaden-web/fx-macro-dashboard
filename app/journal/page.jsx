// app/journal/page.jsx — Papan Skor Trading (jurnal + statistik kinerja).
import JournalClient from "../../components/JournalClient";

export const metadata = {
  title: "Papan Skor Trading",
  description: "Jurnal trade & statistik kinerja: win-rate, expectancy, profit factor, drawdown.",
};

export default function JournalPage() {
  return (
    <div className="page journal-page">
      <h1>Papan Skor Trading</h1>
      <p className="cell-muted">
        Catat setiap trade untuk membangun disiplin. Statistik dihitung otomatis dari trade yang sudah
        ditutup (punya hasil / PnL).
      </p>
      <JournalClient />
    </div>
  );
}
