# Deploy — Vercel (disarankan) atau Netlify

Aplikasi ini **Next.js 15 (App Router)** dengan route handler (`/api/*`) dan Server
Components, jadi butuh runtime server — bukan sekadar static export. Vercel dan
Netlify sama-sama mendukung. Konfigurasi untuk keduanya sudah ada di repo:

| File | Untuk | Isi |
|---|---|---|
| `vercel.json` | **Vercel** | framework `nextjs`, build `npm run build`, Node 20, `maxDuration` API 30 dtk, region `sin1` (Singapura → lebih cepat diakses dari Indonesia) |
| `netlify.toml` | Netlify | build `npm run build`, publish `.next`, `@netlify/plugin-nextjs` |
| `.github/workflows/ci-deploy.yml` | GitHub Actions | tiap push → **CI build**, lalu deploy otomatis ke Vercel/Netlify bila secret-nya di-set (kalau tidak di-set, deploy dilewati, CI tetap jalan) |

---

## ⭐ Cara paling simpel: hubungkan repo ke Vercel (sekali saja, 5 menit)

Setelah ini **tidak perlu lagi apa-apa** — setiap `git push` ke `main` langsung
dipublikasikan otomatis. Persis alur yang diminta: *ubah → commit → push → live*.

1. Buka **https://vercel.com** → **Sign Up with GitHub** (pakai akun GitHub
   `traderaden-web`). Masuk dengan GitHub = tidak perlu isi kartu kredit untuk Hobby (gratis).
2. **Add New… → Project** → cari **`traderaden-web/fx-macro-dashboard`** → **Import**.
3. Vercel otomatis mendeteksi **Framework: Next.js** dan membaca `vercel.json`.
   Yang perlu dicek/diisi:
   - **Root Directory**: `fx-macro-dashboard` (default, biarkan).
   - **Build Command**: `npm run build` — **Output Directory**: `.next` (otomatis).
   - **Node.js Version**: 20 (default).
   - **Environment Variables**: kosongkan dulu — dashboard jalan tanpa API key.
     Opsional: isi `OPENAI_API_KEY` / `GEMINI_API_KEY` / `ANTHROPIC_API_KEY` supaya
     **Copilot** aktif (daftar di `.env.example`). Untuk **MetaAPI**:
     `METAAPI_TOKEN`, `METAAPI_ACCOUNT_ID`.
4. Klik **Deploy**. Selesai 1–3 menit → dapat URL
   `https://fx-macro-dashboard.vercel.app`.
5. Uji: buka URL, lalu **Settings → Git** di dashboard Vercel — pastikan
   **Production Branch = `main`**. Sekarang tiap push ke `main` = deploy baru,
   dan tiap PR = *preview deployment* dengan URL sendiri.

> Repo yang sudah terlanjur terhubung: cukup buka project → **Redeploy** untuk
> mengambil commit terbaru tanpa import ulang.

## Cara A.2: CLI Vercel (kalau tidak mau lewat dashboard)

```bash
npm i -g vercel
vercel login            # buka browser, authorize
vercel                  # di root proyek; pilih "Yes" saat ditanya pakai repo GitHub
vercel --prod           # deploy production + daftarkan auto-deploy on push
```

## Cara B: CI GitHub Actions (opsional, untuk yang suka log deploy di tab Actions)

Deploy di workflow hanya jalan kalau credential diisi:

- GitHub → repo → **Settings → Secrets and variables → Actions → Variables**:
  `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID` (dari Vercel: **Settings → Other → Project Keys** /
  `vercel project ls`)
- **Secrets**: `VERCEL_TOKEN` (Vercel → **Account Settings → Tokens**)

Cara mengambil IDs (dari root proyek, setelah `vercel login`):

```bash
vercel link --yes
vercel link                 # tampilkan Org ID & Project ID
echo "Org: $(vercel link --yes 2>/dev/null | grep -o 'org:[A-Za-z0-9]*')"
```

Atau pakai Netlify: set Variable `NETLIFY_SITE_ID` + Secret `NETLIFY_AUTH_TOKEN`
(Netlify → **Site settings → General → Site details** & **User settings → Personal access tokens**).
Keduanya boleh di-set, tapi pilih satu agar tidak ada dua deploy paralel.

## Catatan penting untuk Vercel

- **`/api/journal` (Papan Skor)**: filesystem Vercel **read-only**, jadi jurnal
  otomatis disimpan ke `/tmp` (sudah di-handle `lib/journal.js`) dan halaman akan
  menampilkan peringatan "penyimpanan sementara". Data bertahan selama instance
  aktif, hilang setelah redeploy/idle. Riwayat permanen → butuh DB
  (Vercel KV / Postgres / Supabase). Alternatif cepat: simpan di `localStorage` browser.
- **Halaman statis** (`/technicals`, `/screener`, `/watchlist`, `/journal`) memakai
  client fetch, jadi datanya selalu live. Halaman server (`/`, `/news`, `/calendar`)
  me-fetch API publik saat render.
- **Region**: `sin1` (Singapura) dipangkas latency-nya; ubah di `vercel.json` bila perlu.
- Paket **Hobby gratis**: 100 GB bandwidth & build menit terbatas — lebih dari cukup
  untuk dashboard pribadi.

## Kalau ingin Netlify (masih didukung)

```bash
npm i -g netlify-cli
netlify login
netlify init
netlify deploy --build --prod
```

Atau dashboard: [app.netlify.com](https://app.netlify.com) → **Add new site → Import an
existing project** → pilih repo → Build `npm run build`, Publish `.next` → **Deploy**.
`@netlify/plugin-nextjs` sudah ada di `devDependencies`.

## Data & fallback

- Jalankan `npm run fetch` sebelum deploy bila ingin snapshot data lokal ikut ter-commit
  (`data/seed.json` dipakai sebagai fallback saat API publik gagal).
- File yang **tidak** boleh ter-commit: `.env*`, `data/broker.json`,
  `data/journal.json`, `.vercel/`, `.smoke*`, `.dbg*` (semua sudah ada di `.gitignore`).
