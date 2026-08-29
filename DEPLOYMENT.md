# Deploy ke Netlify (Gratis)

Aplikasi ini berbasis **Next.js 15 (App Router)** dan sudah dilengkapi `netlify.toml` +
`@netlify/plugin-nextjs`, jadi deploy ke Netlify (paket gratis) **bisa dan mudah**.

## Apa yang sudah disiapkan di repo
- `netlify.toml` — build command `npm run build`, publish `.next`, hook plugin Next.js.
- `@netlify/plugin-nextjs` — menangani halaman Server Component (kalender, FRED, dsb.) otomatis.
- **Tanpa API key / environment variable** — FRED (`fredgraph.csv`) dan ForexFactory
  (`ff_calendar_thisweek.json`) keduanya publik, jadi siap jalan langsung di produksi.
  Data live ForexFactory (actual/konsensus/previous + event seperti Jackson Hole) **akan aktif**
  di Netlify karena server dapat mengakses internet (berbeda dengan sandbox).

## Langkah deploy

### Opsi 1 — Lewat dashboard Netlify (paling mudah)
1. Push seluruh folder proyek ini ke **GitHub** (git init, commit, push).
2. Buka [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
   → pilih repo.
3. Netlify menawarkan *build settings* otomatis:
   - Build command: `npm run build`
   - Publish directory: `.next`
   (kalau belum terisi otomatis, isi manual sesuai di atas).
4. Klik **Deploy** — tunggu selesai. Anda langsung dapat URL `https://<nama>.netlify.app`.

### Opsi 2 — Lewat CLI Netlify
```bash
# install CLI
npm i -g netlify-cli

# login
netlify login

# dari root proyek
netlify init
netlify deploy --build --prod
```

## Tips setelah deploy
- **Live ForexFactory/Foma & FRED otomatis aktif** — tidak ada konfigurasi tambahan.
- Untuk custom domain: Netlify → Domain settings → Add custom domain (gratis + SSL).
- Halaman **Kalender / Analisis / FRED** adalah Server Component → plugin Next.js
  otomatis membuat fungsi serverless sehingga tetap jalan 100% di Netlify.
- *Build & push* ke `main` akan otomatis memicu deploy baru (CI/CD).

## Komentar kecil
- Jika ingin data terbaru yang tersimpan lokal (bukan live), jalankan `npm run fetch`
  sebelum deploy — file `data/seed.json` ikut ter-commit dan dipakai sebagai fallback.
- Paket **free** Netlify memberi bandwidth & build minutes terbatas; cukup untuk dashboard ini.
