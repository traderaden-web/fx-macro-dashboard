import Copilot from "../../components/Copilot";
import { IconLightbulb } from "../../components/Icons";

export const metadata = {
  title: "Copilot — Asisten Trader — MacroLab",
  description:
    "Asisten AI berbasis data MacroLab: tanya setup teknikal, sentimen pasar, jadwal rilis & manajemen risiko.",
};

export default function CopilotPage() {
  return (
    <div className="page">
      <header className="detail-head">
        <div className="detail-title-row">
          <span className="brand-mark" style={{ width: 40, height: 40 }}><IconLightbulb size={18} /></span>
          <div>
            <h1>Copilot Trader</h1>
            <p className="cell-muted" style={{ margin: 0, maxWidth: 720 }}>
              Asisten yang membaca data MacroLab (sinyal teknikal, kekuatan mata uang, risk appetite,
              kalender rilis) untuk menjawab pertanyaan Anda dengan cepat. Coba: "Setup gold hari ini?"
            </p>
          </div>
        </div>
        <div className="tags">
          <span className="badge cat"><IconLightbulb size={13} /> AI Assistant</span>
          <span className="badge cat">Data Real-time</span>
        </div>
      </header>
      <Copilot />
    </div>
  );
}
