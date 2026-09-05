import Link from "next/link";
import LlmSettings from "../../components/LlmSettings";
import { IconLightbulb, IconWallet } from "../../components/Icons";

export const metadata = {
  title: "Pengaturan — MacroLab",
  description:
    "Atur integrasi: API key LLM untuk Copilot (OpenAI/Gemini/Claude) & koneksi MetaAPI untuk sinkronisasi broker.",
};

export default function SettingsPage() {
  return (
    <div className="page">
      <header className="detail-head">
        <div className="detail-title-row">
          <span className="brand-mark" style={{ width: 40, height: 40 }}>ST</span>
          <div>
            <h1>Pengaturan &amp; Integrasi</h1>
            <p className="cell-muted" style={{ margin: 0, maxWidth: 720 }}>
              Hubungkan layanan eksternal untuk meningkatkan MacroLab: <b>Copilot LLM</b> (jawaban
              model sungguhan) dan <b>Broker MetaAPI</b> (sinkron posisi nyata).
            </p>
          </div>
        </div>
        <div className="tags">
          <span className="badge cat"><IconLightbulb size={13} /> Copilot LLM</span>
          <span className="badge cat"><IconWallet size={13} /> MetaAPI</span>
        </div>
      </header>

      <LlmSettings />

      {/* ── Broker hint ── */}
      <div className="panel-card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Broker MetaAPI</h3>
        <p className="cell-muted" style={{ marginTop: 0, fontSize: 13 }}>
          Koneksi broker diatur di halaman <Link href="/broker" style={{ color: "var(--accent)" }}>Broker &amp; Portfolio</Link> —
          masukkan MetaAPI token &amp; account ID di sana untuk sinkron posisi nyata. Sebagai
          alternatif (untuk deploy server), set environment variable:
        </p>
        <pre className="code-block mono">METAAPI_TOKEN=...
METAAPI_ACCOUNT_ID=...</pre>
        <Link href="/broker" className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>Ke halaman Broker →</Link>
      </div>

      {/* ── Environment vars (server) ── */}
      <div className="panel-card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Environment Variables (opsional, untuk produksi)</h3>
        <p className="cell-muted" style={{ marginTop: 0, fontSize: 13 }}>
          Semua variabel di bawah bisa di-set di `.env.local` (tidak di-commit) — solusi paling aman
          karena key tidak pernah masuk browser.
        </p>
        <pre className="code-block mono">COPILOT LLM
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini      # opsional
# ATAU
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-1.5-flash # opsional
# ATAU
ANTHROPIC_API_KEY=...

BROKER (MetaAPI)
METAAPI_TOKEN=...
METAAPI_ACCOUNT_ID=...
METAAPI_REGION=new-york       # opsional (new-york | singapore | ...)
</pre>
      </div>
    </div>
  );
}
