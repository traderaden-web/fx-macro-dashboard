// data/releases.js
// RIWAYAT KONSENSUS + TANGGAL RILIS RIIL untuk 27 indikator (kurasi 30-Agu-2026,
// divalidasi terhadap file Myfxbook Economic Calendar user — window 1-14 Jan 2026).
// Format: { date: tanggal rilis (seperti di Myfxbook/ForexFactory), obs: periode data
// (awal bulan, kunci titik FRED), consensus: estimasi konsensus analis }.
//
// Tervalidasi dari file user (Jan 2026):
//   NFP/Unemp/AHE Jumat kedua 9 Jan · CPI 13 Jan · PPI 14 Jan · Retail 14 Jan ·
//   Claims 8 Jan (geser Tahun Baru) · UMich 9 Jan · EU CPI 7 Jan · EU Unemp 8 Jan.
// Aturan (data bulan M → rilis R):
//   NFP/Unemp/AHE : JUMAT KEDUA M+1 (BLS; 9 Jan 2026 & 8 Mei 2026 tervalidasi)
//   CPI/Core CPI  : jadwal BLS 2025-2026 (Des 2025 → 13 Jan 2026 tervalidasi)
//   PPI           : jadwal BLS (Des 2025 → 14 Jan 2026 tervalidasi)
//   Retail        : jadwal Census (Des 2025 → 14 Jan 2026 tervalidasi)
//   GDP advance   : BEA (30 Okt / 29 Jan / 30 Apr / 30 Jul)
//   Core PCE      : 27 M+1 · G.17 (IndPro/Capacity): 11-12 M+1
//   Claims        : Kamis pertama M (1 Jan → 8 Jan; tervalidasi)
//   UMich         : preliminary (Des 2025 → 9 Jan 2026 tervalidasi)
//   Fed Funds     : keputusan FOMC 2025-2026
//   EU CPI 7 M+1 · EU Unemp 8 M+1 (tervalidasi) · EU GDP flash 2 M+1
//   UK CPI/Unemp 7 M+1 · JP CPI 20 M+1 · CN CPI 2 M+1
//   Seri harian (DGS10, VIX, WTI, Brent, NatGas, Copper): hari kerja terakhir M
//
// Nilai ACTUAL/PREVIOUS dari FRED; konsensus historis = rekonstruksi estimasi analis.
// NFP data Mei 2026 (rilis 12 Jun): A 115K K 65K P 185K (verifikasi ForexFactory).
//
// Log perubahan (30 Agu 2026):
//   nfp        obs 2026-07-01 → rilis 2026-08-14
//   nfp        obs 2026-06-01 → rilis 2026-07-10
//   nfp        obs 2026-05-01 → rilis 2026-06-12
//   nfp        obs 2026-04-01 → rilis 2026-05-08
//   nfp        obs 2026-03-01 → rilis 2026-04-10
//   nfp        obs 2026-02-01 → rilis 2026-03-13
//   nfp        obs 2026-01-01 → rilis 2026-02-13
//   nfp        obs 2025-12-01 → rilis 2026-01-09
//   nfp        obs 2025-11-01 → rilis 2025-12-12
//   nfp        obs 2025-10-01 → rilis 2025-11-14
//   nfp        obs 2025-09-01 → rilis 2025-10-10
//   nfp        obs 2025-08-01 → rilis 2025-09-12
//   unemp      obs 2026-07-01 → rilis 2026-08-14
//   unemp      obs 2026-06-01 → rilis 2026-07-10
//   unemp      obs 2026-05-01 → rilis 2026-06-12
//   unemp      obs 2026-04-01 → rilis 2026-05-08
//   unemp      obs 2026-03-01 → rilis 2026-04-10
//   unemp      obs 2026-02-01 → rilis 2026-03-13
//   unemp      obs 2026-01-01 → rilis 2026-02-13
//   unemp      obs 2025-12-01 → rilis 2026-01-09
//   unemp      obs 2025-11-01 → rilis 2025-12-12
//   unemp      obs 2025-09-01 → rilis 2025-10-10
//   unemp      obs 2025-08-01 → rilis 2025-09-12
//   unemp      obs 2025-07-01 → rilis 2025-08-08
//   unemp      obs 2025-06-01 → rilis 2025-07-11
//   cpi        obs 2026-07-01 → rilis 2026-08-12
//   cpi        obs 2026-06-01 → rilis 2026-07-14
//   cpi        obs 2026-05-01 → rilis 2026-06-10
//   cpi        obs 2026-04-01 → rilis 2026-05-12
//   cpi        obs 2026-03-01 → rilis 2026-04-10
//   cpi        obs 2026-02-01 → rilis 2026-03-11
//   cpi        obs 2026-01-01 → rilis 2026-02-11
//   cpi        obs 2025-12-01 → rilis 2026-01-13
//   cpi        obs 2025-11-01 → rilis 2025-12-10
//   cpi        obs 2025-09-01 → rilis 2025-10-15
//   cpi        obs 2025-08-01 → rilis 2025-09-10
//   cpi        obs 2025-07-01 → rilis 2025-08-12
//   cpi        obs 2025-06-01 → rilis 2025-07-15
//   cpi        obs 2025-05-01 → rilis 2025-06-11
//   corecpi    obs 2026-07-01 → rilis 2026-08-12
//   corecpi    obs 2026-06-01 → rilis 2026-07-14
//   corecpi    obs 2026-05-01 → rilis 2026-06-10
//   corecpi    obs 2026-04-01 → rilis 2026-05-12
//   corecpi    obs 2026-03-01 → rilis 2026-04-10
//   corecpi    obs 2026-02-01 → rilis 2026-03-11
//   corecpi    obs 2026-01-01 → rilis 2026-02-11
//   corecpi    obs 2025-12-01 → rilis 2026-01-13
//   corecpi    obs 2025-11-01 → rilis 2025-12-10
//   corecpi    obs 2025-09-01 → rilis 2025-10-15
//   corecpi    obs 2025-08-01 → rilis 2025-09-10
//   corecpi    obs 2025-07-01 → rilis 2025-08-12
//   corecpi    obs 2025-06-01 → rilis 2025-07-15
//   corecpi    obs 2025-05-01 → rilis 2025-06-11
//   ppi        obs 2026-07-01 → rilis 2026-08-12
//   ppi        obs 2026-06-01 → rilis 2026-07-14
//   ppi        obs 2026-05-01 → rilis 2026-06-09
//   ppi        obs 2026-04-01 → rilis 2026-05-12
//   ppi        obs 2026-03-01 → rilis 2026-04-09
//   ppi        obs 2026-02-01 → rilis 2026-03-10
//   ppi        obs 2026-01-01 → rilis 2026-02-10
//   ppi        obs 2025-12-01 → rilis 2026-01-14
//   ppi        obs 2025-11-01 → rilis 2025-12-10
//   ppi        obs 2025-10-01 → rilis 2025-11-12
//   ppi        obs 2025-09-01 → rilis 2025-10-14
//   ppi        obs 2025-08-01 → rilis 2025-09-10
//   ppi        obs 2025-07-01 → rilis 2025-08-13
//   ppi        obs 2025-06-01 → rilis 2025-07-15
//   corepce    obs 2026-07-01 → rilis 2026-08-27
//   corepce    obs 2026-06-01 → rilis 2026-07-27
//   corepce    obs 2026-05-01 → rilis 2026-06-26
//   corepce    obs 2026-04-01 → rilis 2026-05-27
//   corepce    obs 2026-03-01 → rilis 2026-04-27
//   corepce    obs 2026-02-01 → rilis 2026-03-27
//   corepce    obs 2026-01-01 → rilis 2026-02-27
//   corepce    obs 2025-12-01 → rilis 2026-01-27
//   corepce    obs 2025-11-01 → rilis 2025-12-26
//   corepce    obs 2025-10-01 → rilis 2025-11-27
//   corepce    obs 2025-09-01 → rilis 2025-10-27
//   corepce    obs 2025-08-01 → rilis 2025-09-26
//   corepce    obs 2025-07-01 → rilis 2025-08-27
//   corepce    obs 2025-06-01 → rilis 2025-07-28
//   ahe        obs 2026-07-01 → rilis 2026-08-14
//   ahe        obs 2026-06-01 → rilis 2026-07-10
//   ahe        obs 2026-05-01 → rilis 2026-06-12
//   ahe        obs 2026-04-01 → rilis 2026-05-08
//   ahe        obs 2026-03-01 → rilis 2026-04-10
//   ahe        obs 2026-02-01 → rilis 2026-03-13
//   ahe        obs 2026-01-01 → rilis 2026-02-13
//   ahe        obs 2025-12-01 → rilis 2026-01-09
//   ahe        obs 2025-11-01 → rilis 2025-12-12
//   ahe        obs 2025-10-01 → rilis 2025-11-14
//   ahe        obs 2025-09-01 → rilis 2025-10-10
//   ahe        obs 2025-08-01 → rilis 2025-09-12
//   ahe        obs 2025-07-01 → rilis 2025-08-08
//   ahe        obs 2025-06-01 → rilis 2025-07-11
//   fedfunds   obs 2026-08-01 → rilis 2026-07-29
//   fedfunds   obs 2026-07-01 → rilis 2026-07-29
//   fedfunds   obs 2026-06-01 → rilis 2026-06-17
//   fedfunds   obs 2026-03-01 → rilis 2026-03-18
//   fedfunds   obs 2025-12-01 → rilis 2025-12-10
//   fedfunds   obs 2025-11-01 → rilis 2025-10-29
//   fedfunds   obs 2025-10-01 → rilis 2025-10-29
//   fedfunds   obs 2025-09-01 → rilis 2025-09-17
//   dgs10      obs 2026-08-01 → rilis 2026-08-31
//   retail     obs 2026-07-01 → rilis 2026-08-12
//   retail     obs 2026-06-01 → rilis 2026-07-15
//   retail     obs 2026-05-01 → rilis 2026-06-16
//   retail     obs 2026-04-01 → rilis 2026-05-12
//   retail     obs 2026-03-01 → rilis 2026-04-15
//   retail     obs 2026-02-01 → rilis 2026-03-16
//   retail     obs 2026-01-01 → rilis 2026-02-16
//   retail     obs 2025-12-01 → rilis 2026-01-14
//   retail     obs 2025-11-01 → rilis 2025-12-15
//   retail     obs 2025-10-01 → rilis 2025-11-18
//   retail     obs 2025-09-01 → rilis 2025-10-15
//   retail     obs 2025-08-01 → rilis 2025-09-15
//   retail     obs 2025-07-01 → rilis 2025-08-15
//   retail     obs 2025-06-01 → rilis 2025-07-15
//   umich      obs 2026-07-01 → rilis 2026-08-06
//   umich      obs 2026-06-01 → rilis 2026-07-09
//   umich      obs 2026-05-01 → rilis 2026-06-04
//   umich      obs 2026-04-01 → rilis 2026-05-07
//   umich      obs 2026-03-01 → rilis 2026-04-02
//   umich      obs 2026-02-01 → rilis 2026-03-05
//   umich      obs 2026-01-01 → rilis 2026-02-05
//   umich      obs 2025-12-01 → rilis 2026-01-09
//   umich      obs 2025-11-01 → rilis 2025-12-04
//   umich      obs 2025-10-01 → rilis 2025-11-06
//   umich      obs 2025-09-01 → rilis 2025-10-02
//   umich      obs 2025-08-01 → rilis 2025-09-04
//   umich      obs 2025-07-01 → rilis 2025-08-07
//   umich      obs 2025-06-01 → rilis 2025-07-10
//   indpro     obs 2026-07-01 → rilis 2026-08-11
//   indpro     obs 2026-06-01 → rilis 2026-07-10
//   indpro     obs 2026-05-01 → rilis 2026-06-11
//   indpro     obs 2026-04-01 → rilis 2026-05-11
//   indpro     obs 2026-03-01 → rilis 2026-04-10
//   indpro     obs 2026-02-01 → rilis 2026-03-11
//   indpro     obs 2026-01-01 → rilis 2026-02-11
//   indpro     obs 2025-12-01 → rilis 2026-01-12
//   indpro     obs 2025-11-01 → rilis 2025-12-12
//   indpro     obs 2025-10-01 → rilis 2025-11-12
//   indpro     obs 2025-09-01 → rilis 2025-10-13
//   indpro     obs 2025-08-01 → rilis 2025-09-12
//   indpro     obs 2025-07-01 → rilis 2025-08-12
//   indpro     obs 2025-06-01 → rilis 2025-07-11
//   gdp        obs 2026-04-01 → rilis 2026-07-30
//   gdp        obs 2026-01-01 → rilis 2026-04-30
//   gdp        obs 2025-10-01 → rilis 2026-01-29
//   gdp        obs 2025-07-01 → rilis 2025-10-30
//   eu_cpi     obs 2026-07-01 → rilis 2026-08-07
//   eu_cpi     obs 2026-06-01 → rilis 2026-07-07
//   eu_cpi     obs 2026-05-01 → rilis 2026-06-08
//   eu_cpi     obs 2026-04-01 → rilis 2026-05-07
//   eu_cpi     obs 2026-03-01 → rilis 2026-04-07
//   eu_cpi     obs 2026-02-01 → rilis 2026-03-06
//   eu_cpi     obs 2026-01-01 → rilis 2026-02-06
//   eu_cpi     obs 2025-12-01 → rilis 2026-01-07
//   eu_cpi     obs 2025-11-01 → rilis 2025-12-08
//   eu_cpi     obs 2025-10-01 → rilis 2025-11-07
//   eu_cpi     obs 2025-09-01 → rilis 2025-10-07
//   eu_cpi     obs 2025-08-01 → rilis 2025-09-08
//   eu_cpi     obs 2025-07-01 → rilis 2025-08-07
//   eu_cpi     obs 2025-06-01 → rilis 2025-07-07
//   eu_unemp   obs 2023-01-01 → rilis 2023-02-08
//   uk_cpi     obs 2025-03-01 → rilis 2025-04-07
//   uk_cpi     obs 2025-02-01 → rilis 2025-03-07
//   uk_cpi     obs 2025-01-01 → rilis 2025-02-07
//   uk_cpi     obs 2024-12-01 → rilis 2025-01-07
//   uk_cpi     obs 2024-11-01 → rilis 2024-12-06
//   uk_cpi     obs 2024-10-01 → rilis 2024-11-07
//   uk_cpi     obs 2024-09-01 → rilis 2024-10-07
//   uk_cpi     obs 2024-08-01 → rilis 2024-09-06
//   uk_cpi     obs 2024-07-01 → rilis 2024-08-07
//   uk_cpi     obs 2024-06-01 → rilis 2024-07-08
//   uk_cpi     obs 2024-05-01 → rilis 2024-06-07
//   uk_cpi     obs 2024-04-01 → rilis 2024-05-07
//   uk_cpi     obs 2024-03-01 → rilis 2024-04-08
//   uk_cpi     obs 2024-02-01 → rilis 2024-03-07
//   uk_unemp   obs 2026-04-01 → rilis 2026-05-07
//   uk_unemp   obs 2026-03-01 → rilis 2026-04-07
//   uk_unemp   obs 2026-02-01 → rilis 2026-03-06
//   uk_unemp   obs 2026-01-01 → rilis 2026-02-06
//   uk_unemp   obs 2025-12-01 → rilis 2026-01-07
//   uk_unemp   obs 2025-11-01 → rilis 2025-12-08
//   uk_unemp   obs 2025-10-01 → rilis 2025-11-07
//   uk_unemp   obs 2025-09-01 → rilis 2025-10-07
//   uk_unemp   obs 2025-08-01 → rilis 2025-09-08
//   uk_unemp   obs 2025-07-01 → rilis 2025-08-07
//   uk_unemp   obs 2025-06-01 → rilis 2025-07-07
//   uk_unemp   obs 2025-05-01 → rilis 2025-06-06
//   uk_unemp   obs 2025-04-01 → rilis 2025-05-07
//   uk_unemp   obs 2025-03-01 → rilis 2025-04-07
//   jp_cpi     obs 2021-06-01 → rilis 2021-07-20
//   wti        obs 2026-08-01 → rilis 2026-08-31
//   vix        obs 2026-08-01 → rilis 2026-08-31
//   brent      obs 2026-08-01 → rilis 2026-08-31
//   natgas     obs 2026-08-01 → rilis 2026-08-31
//   copper     obs 2026-07-01 → rilis 2026-07-31
//   claims     obs 2026-08-01 → rilis 2026-08-06
//   claims     obs 2026-07-01 → rilis 2026-07-02
//   claims     obs 2026-06-01 → rilis 2026-06-04
//   claims     obs 2026-05-01 → rilis 2026-05-07
//   claims     obs 2026-04-01 → rilis 2026-04-02
//   claims     obs 2026-03-01 → rilis 2026-03-05
//   claims     obs 2026-02-01 → rilis 2026-02-05
//   claims     obs 2026-01-01 → rilis 2026-01-08
//   claims     obs 2025-12-01 → rilis 2025-12-04
//   claims     obs 2025-11-01 → rilis 2025-11-06
//   claims     obs 2025-10-01 → rilis 2025-10-02
//   claims     obs 2025-09-01 → rilis 2025-09-04
//   claims     obs 2025-08-01 → rilis 2025-08-07
//   claims     obs 2025-07-01 → rilis 2025-07-03
//   capacity   obs 2026-07-01 → rilis 2026-08-11
//   capacity   obs 2026-06-01 → rilis 2026-07-10
//   capacity   obs 2026-05-01 → rilis 2026-06-11
//   capacity   obs 2026-04-01 → rilis 2026-05-11
//   capacity   obs 2026-03-01 → rilis 2026-04-10
//   capacity   obs 2026-02-01 → rilis 2026-03-11
//   capacity   obs 2026-01-01 → rilis 2026-02-11
//   capacity   obs 2025-12-01 → rilis 2026-01-12
//   capacity   obs 2025-11-01 → rilis 2025-12-12
//   capacity   obs 2025-10-01 → rilis 2025-11-12
//   capacity   obs 2025-09-01 → rilis 2025-10-13
//   capacity   obs 2025-08-01 → rilis 2025-09-12
//   capacity   obs 2025-07-01 → rilis 2025-08-12
//   capacity   obs 2025-06-01 → rilis 2025-07-11
//   eu_gdp     obs 2026-04-01 → rilis 2026-05-01
//   eu_gdp     obs 2026-01-01 → rilis 2026-02-02
//   eu_gdp     obs 2025-10-01 → rilis 2025-11-03
//   eu_gdp     obs 2025-07-01 → rilis 2025-08-01
//   china_cpi  obs 2025-04-01 → rilis 2025-05-02
//   china_cpi  obs 2025-03-01 → rilis 2025-04-02
//   china_cpi  obs 2025-02-01 → rilis 2025-03-03
//   china_cpi  obs 2025-01-01 → rilis 2025-02-03
//   china_cpi  obs 2024-12-01 → rilis 2025-01-02
//   china_cpi  obs 2024-11-01 → rilis 2024-12-02
//   china_cpi  obs 2024-10-01 → rilis 2024-11-01
//   china_cpi  obs 2024-09-01 → rilis 2024-10-02
//   china_cpi  obs 2024-08-01 → rilis 2024-09-02
//   china_cpi  obs 2024-07-01 → rilis 2024-08-02
//   china_cpi  obs 2024-06-01 → rilis 2024-07-02
//   china_cpi  obs 2024-05-01 → rilis 2024-06-03
//   china_cpi  obs 2024-04-01 → rilis 2024-05-02
//   china_cpi  obs 2024-03-01 → rilis 2024-04-02
export const CONSENSUS = {
  nfp: [
    { date: "2026-08-14", obs: "2026-07-01", consensus: 100 },
    { date: "2026-07-10", obs: "2026-06-01", consensus: 120 },
    { date: "2026-06-12", obs: "2026-05-01", consensus: 65 },
    { date: "2026-05-08", obs: "2026-04-01", consensus: 160 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 140 },
    { date: "2026-03-13", obs: "2026-02-01", consensus: 45 },
    { date: "2026-02-13", obs: "2026-01-01", consensus: 150 },
    { date: "2026-01-09", obs: "2025-12-01", consensus: 5 },
    { date: "2025-12-12", obs: "2025-11-01", consensus: 25 },
    { date: "2025-11-14", obs: "2025-10-01", consensus: 40 },
    { date: "2025-10-10", obs: "2025-09-01", consensus: 75 },
    { date: "2025-09-12", obs: "2025-08-01", consensus: -20 },
  ],
  unemp: [
    { date: "2026-08-14", obs: "2026-07-01", consensus: 4.2 },
    { date: "2026-07-10", obs: "2026-06-01", consensus: 4.3 },
    { date: "2026-06-12", obs: "2026-05-01", consensus: 4.3 },
    { date: "2026-05-08", obs: "2026-04-01", consensus: 4.4 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 4.3 },
    { date: "2026-03-13", obs: "2026-02-01", consensus: 4.3 },
    { date: "2026-02-13", obs: "2026-01-01", consensus: 4.4 },
    { date: "2026-01-09", obs: "2025-12-01", consensus: 4.4 },
    { date: "2025-12-12", obs: "2025-11-01", consensus: 4.4 },
    { date: "2025-10-10", obs: "2025-09-01", consensus: 4.3 },
    { date: "2025-09-12", obs: "2025-08-01", consensus: 4.3 },
    { date: "2025-08-08", obs: "2025-07-01", consensus: 4.2 },
    { date: "2025-07-11", obs: "2025-06-01", consensus: 4.2 },
  ],
  cpi: [
    { date: "2026-08-12", obs: "2026-07-01", consensus: 3.4 },
    { date: "2026-07-14", obs: "2026-06-01", consensus: 3.6 },
    { date: "2026-06-10", obs: "2026-05-01", consensus: 3.8 },
    { date: "2026-05-12", obs: "2026-04-01", consensus: 3.3 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 2.8 },
    { date: "2026-03-11", obs: "2026-02-01", consensus: 2.4 },
    { date: "2026-02-11", obs: "2026-01-01", consensus: 2.6 },
    { date: "2026-01-13", obs: "2025-12-01", consensus: 2.7 },
    { date: "2025-12-10", obs: "2025-11-01", consensus: 2.9 },
    { date: "2025-10-15", obs: "2025-09-01", consensus: 2.9 },
    { date: "2025-09-10", obs: "2025-08-01", consensus: 2.8 },
    { date: "2025-08-12", obs: "2025-07-01", consensus: 2.7 },
    { date: "2025-07-15", obs: "2025-06-01", consensus: 2.6 },
    { date: "2025-06-11", obs: "2025-05-01", consensus: 2.3 },
  ],
  corecpi: [
    { date: "2026-08-12", obs: "2026-07-01", consensus: 2.5 },
    { date: "2026-07-14", obs: "2026-06-01", consensus: 2.7 },
    { date: "2026-06-10", obs: "2026-05-01", consensus: 2.6 },
    { date: "2026-05-12", obs: "2026-04-01", consensus: 2.5 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 2.4 },
    { date: "2026-03-11", obs: "2026-02-01", consensus: 2.4 },
    { date: "2026-02-11", obs: "2026-01-01", consensus: 2.5 },
    { date: "2026-01-13", obs: "2025-12-01", consensus: 2.6 },
    { date: "2025-12-10", obs: "2025-11-01", consensus: 2.7 },
    { date: "2025-10-15", obs: "2025-09-01", consensus: 2.9 },
    { date: "2025-09-10", obs: "2025-08-01", consensus: 3.1 },
    { date: "2025-08-12", obs: "2025-07-01", consensus: 3 },
    { date: "2025-07-15", obs: "2025-06-01", consensus: 2.9 },
    { date: "2025-06-11", obs: "2025-05-01", consensus: 2.8 },
  ],
  ppi: [
    { date: "2026-08-12", obs: "2026-07-01", consensus: 9 },
    { date: "2026-07-14", obs: "2026-06-01", consensus: 11 },
    { date: "2026-06-09", obs: "2026-05-01", consensus: 9.5 },
    { date: "2026-05-12", obs: "2026-04-01", consensus: 6.5 },
    { date: "2026-04-09", obs: "2026-03-01", consensus: 4 },
    { date: "2026-03-10", obs: "2026-02-01", consensus: 2.5 },
    { date: "2026-02-10", obs: "2026-01-01", consensus: 2.9 },
    { date: "2026-01-14", obs: "2025-12-01", consensus: 3 },
    { date: "2025-12-10", obs: "2025-11-01", consensus: 3.2 },
    { date: "2025-11-12", obs: "2025-10-01", consensus: 3.6 },
    { date: "2025-10-14", obs: "2025-09-01", consensus: 2.5 },
    { date: "2025-09-10", obs: "2025-08-01", consensus: 2.4 },
    { date: "2025-08-13", obs: "2025-07-01", consensus: 2 },
    { date: "2025-07-15", obs: "2025-06-01", consensus: 1.8 },
  ],
  corepce: [
    { date: "2026-08-27", obs: "2026-07-01", consensus: 0.27 },
    { date: "2026-07-27", obs: "2026-06-01", consensus: 0.3 },
    { date: "2026-06-26", obs: "2026-05-01", consensus: 0.28 },
    { date: "2026-05-27", obs: "2026-04-01", consensus: 0.3 },
    { date: "2026-04-27", obs: "2026-03-01", consensus: 0.35 },
    { date: "2026-03-27", obs: "2026-02-01", consensus: 0.35 },
    { date: "2026-02-27", obs: "2026-01-01", consensus: 0.3 },
    { date: "2026-01-27", obs: "2025-12-01", consensus: 0.28 },
    { date: "2025-12-26", obs: "2025-11-01", consensus: 0.25 },
    { date: "2025-11-27", obs: "2025-10-01", consensus: 0.25 },
    { date: "2025-10-27", obs: "2025-09-01", consensus: 0.25 },
    { date: "2025-09-26", obs: "2025-08-01", consensus: 0.24 },
    { date: "2025-08-27", obs: "2025-07-01", consensus: 0.25 },
    { date: "2025-07-28", obs: "2025-06-01", consensus: 0.25 },
  ],
  ahe: [
    { date: "2026-08-14", obs: "2026-07-01", consensus: 3.3 },
    { date: "2026-07-10", obs: "2026-06-01", consensus: 3.4 },
    { date: "2026-06-12", obs: "2026-05-01", consensus: 3.5 },
    { date: "2026-05-08", obs: "2026-04-01", consensus: 3.5 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 3.6 },
    { date: "2026-03-13", obs: "2026-02-01", consensus: 3.7 },
    { date: "2026-02-13", obs: "2026-01-01", consensus: 3.7 },
    { date: "2026-01-09", obs: "2025-12-01", consensus: 3.8 },
    { date: "2025-12-12", obs: "2025-11-01", consensus: 3.9 },
    { date: "2025-11-14", obs: "2025-10-01", consensus: 3.9 },
    { date: "2025-10-10", obs: "2025-09-01", consensus: 3.9 },
    { date: "2025-09-12", obs: "2025-08-01", consensus: 4 },
    { date: "2025-08-08", obs: "2025-07-01", consensus: 4 },
    { date: "2025-07-11", obs: "2025-06-01", consensus: 3.9 },
  ],
  fedfunds: [
    { date: "2026-07-29", obs: "2026-08-01", consensus: 3.75 },
    { date: "2026-07-29", obs: "2026-07-01", consensus: 3.75 },
    { date: "2026-06-17", obs: "2026-06-01", consensus: 3.5 },
    { date: "2026-03-18", obs: "2026-03-01", consensus: 3.75 },
    { date: "2025-12-10", obs: "2025-12-01", consensus: 3.75 },
    { date: "2025-10-29", obs: "2025-11-01", consensus: 4 },
    { date: "2025-10-29", obs: "2025-10-01", consensus: 4 },
    { date: "2025-09-17", obs: "2025-09-01", consensus: 4.25 },
  ],
  dgs10: [
    { date: "2026-08-31", obs: "2026-08-01", consensus: 4.6 },
  ],
  retail: [
    { date: "2026-08-12", obs: "2026-07-01", consensus: 0.3 },
    { date: "2026-07-15", obs: "2026-06-01", consensus: 0.8 },
    { date: "2026-06-16", obs: "2026-05-01", consensus: 0.7 },
    { date: "2026-05-12", obs: "2026-04-01", consensus: 1.1 },
    { date: "2026-04-15", obs: "2026-03-01", consensus: 1 },
    { date: "2026-03-16", obs: "2026-02-01", consensus: 0.6 },
    { date: "2026-02-16", obs: "2026-01-01", consensus: 0.2 },
    { date: "2026-01-14", obs: "2025-12-01", consensus: 0.3 },
    { date: "2025-12-15", obs: "2025-11-01", consensus: 0.5 },
    { date: "2025-11-18", obs: "2025-10-01", consensus: 0.2 },
    { date: "2025-10-15", obs: "2025-09-01", consensus: 0.3 },
    { date: "2025-09-15", obs: "2025-08-01", consensus: 0.5 },
    { date: "2025-08-15", obs: "2025-07-01", consensus: 1 },
    { date: "2025-07-15", obs: "2025-06-01", consensus: 0.7 },
  ],
  umich: [
    { date: "2026-08-06", obs: "2026-07-01", consensus: 50.5 },
    { date: "2026-07-09", obs: "2026-06-01", consensus: 47 },
    { date: "2026-06-04", obs: "2026-05-01", consensus: 49 },
    { date: "2026-05-07", obs: "2026-04-01", consensus: 53 },
    { date: "2026-04-02", obs: "2026-03-01", consensus: 56 },
    { date: "2026-03-05", obs: "2026-02-01", consensus: 56.5 },
    { date: "2026-02-05", obs: "2026-01-01", consensus: 54 },
    { date: "2026-01-09", obs: "2025-12-01", consensus: 53 },
    { date: "2025-12-04", obs: "2025-11-01", consensus: 53.5 },
    { date: "2025-11-06", obs: "2025-10-01", consensus: 55 },
    { date: "2025-10-02", obs: "2025-09-01", consensus: 55.5 },
    { date: "2025-09-04", obs: "2025-08-01", consensus: 58.5 },
    { date: "2025-08-07", obs: "2025-07-01", consensus: 61.5 },
    { date: "2025-07-10", obs: "2025-06-01", consensus: 61 },
  ],
  indpro: [
    { date: "2026-08-11", obs: "2026-07-01", consensus: 0.2 },
    { date: "2026-07-10", obs: "2026-06-01", consensus: 0.3 },
    { date: "2026-06-11", obs: "2026-05-01", consensus: 0.2 },
    { date: "2026-05-11", obs: "2026-04-01", consensus: 0.4 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 0.1 },
    { date: "2026-03-11", obs: "2026-02-01", consensus: 0.5 },
    { date: "2026-02-11", obs: "2026-01-01", consensus: 0.2 },
    { date: "2026-01-12", obs: "2025-12-01", consensus: 0.3 },
    { date: "2025-12-12", obs: "2025-11-01", consensus: 0 },
    { date: "2025-11-12", obs: "2025-10-01", consensus: -0.1 },
    { date: "2025-10-13", obs: "2025-09-01", consensus: 0.1 },
    { date: "2025-09-12", obs: "2025-08-01", consensus: 0 },
    { date: "2025-08-12", obs: "2025-07-01", consensus: 0.3 },
    { date: "2025-07-11", obs: "2025-06-01", consensus: 0.4 },
  ],
  gdp: [
    { date: "2026-07-30", obs: "2026-04-01", consensus: 2.3 },
    { date: "2026-04-30", obs: "2026-01-01", consensus: 2.2 },
    { date: "2026-01-29", obs: "2025-10-01", consensus: 2.4 },
    { date: "2025-10-30", obs: "2025-07-01", consensus: 2.5 },
  ],
  eu_cpi: [
    { date: "2026-08-07", obs: "2026-07-01", consensus: 2.8 },
    { date: "2026-07-07", obs: "2026-06-01", consensus: 3 },
    { date: "2026-06-08", obs: "2026-05-01", consensus: 3.1 },
    { date: "2026-05-07", obs: "2026-04-01", consensus: 2.6 },
    { date: "2026-04-07", obs: "2026-03-01", consensus: 2 },
    { date: "2026-03-06", obs: "2026-02-01", consensus: 1.7 },
    { date: "2026-02-06", obs: "2026-01-01", consensus: 1.9 },
    { date: "2026-01-07", obs: "2025-12-01", consensus: 2.1 },
    { date: "2025-12-08", obs: "2025-11-01", consensus: 2.1 },
    { date: "2025-11-07", obs: "2025-10-01", consensus: 2.2 },
    { date: "2025-10-07", obs: "2025-09-01", consensus: 2 },
    { date: "2025-09-08", obs: "2025-08-01", consensus: 2 },
    { date: "2025-08-07", obs: "2025-07-01", consensus: 2 },
    { date: "2025-07-07", obs: "2025-06-01", consensus: 1.9 },
  ],
  eu_unemp: [
    { date: "2023-02-08", obs: "2023-01-01", consensus: 6.7 },
  ],
  uk_cpi: [
    { date: "2025-04-07", obs: "2025-03-01", consensus: 3.7 },
    { date: "2025-03-07", obs: "2025-02-01", consensus: 3.8 },
    { date: "2025-02-07", obs: "2025-01-01", consensus: 3.6 },
    { date: "2025-01-07", obs: "2024-12-01", consensus: 3.4 },
    { date: "2024-12-06", obs: "2024-11-01", consensus: 3.1 },
    { date: "2024-11-07", obs: "2024-10-01", consensus: 2.7 },
    { date: "2024-10-07", obs: "2024-09-01", consensus: 2.9 },
    { date: "2024-09-06", obs: "2024-08-01", consensus: 3 },
    { date: "2024-08-07", obs: "2024-07-01", consensus: 3.1 },
    { date: "2024-07-08", obs: "2024-06-01", consensus: 2.8 },
    { date: "2024-06-07", obs: "2024-05-01", consensus: 2.9 },
    { date: "2024-05-07", obs: "2024-04-01", consensus: 3.1 },
    { date: "2024-04-08", obs: "2024-03-01", consensus: 3.8 },
    { date: "2024-03-07", obs: "2024-02-01", consensus: 3.9 },
  ],
  uk_unemp: [
    { date: "2026-05-07", obs: "2026-04-01", consensus: 5 },
    { date: "2026-04-07", obs: "2026-03-01", consensus: 4.9 },
    { date: "2026-03-06", obs: "2026-02-01", consensus: 5 },
    { date: "2026-02-06", obs: "2026-01-01", consensus: 5.1 },
    { date: "2026-01-07", obs: "2025-12-01", consensus: 5.1 },
    { date: "2025-12-08", obs: "2025-11-01", consensus: 5 },
    { date: "2025-11-07", obs: "2025-10-01", consensus: 5 },
    { date: "2025-10-07", obs: "2025-09-01", consensus: 4.9 },
    { date: "2025-09-08", obs: "2025-08-01", consensus: 4.8 },
    { date: "2025-08-07", obs: "2025-07-01", consensus: 4.7 },
    { date: "2025-07-07", obs: "2025-06-01", consensus: 4.6 },
    { date: "2025-06-06", obs: "2025-05-01", consensus: 4.6 },
    { date: "2025-05-07", obs: "2025-04-01", consensus: 4.6 },
    { date: "2025-04-07", obs: "2025-03-01", consensus: 4.5 },
  ],
  jp_cpi: [
    { date: "2021-07-20", obs: "2021-06-01", consensus: -0.4 },
  ],
  wti: [
    { date: "2026-08-31", obs: "2026-08-01", consensus: 82 },
  ],
  vix: [
    { date: "2026-08-31", obs: "2026-08-01", consensus: 16 },
  ],
  brent: [
    { date: "2026-08-31", obs: "2026-08-01", consensus: 88 },
  ],
  natgas: [
    { date: "2026-08-31", obs: "2026-08-01", consensus: 2.9 },
  ],
  copper: [
    { date: "2026-07-31", obs: "2026-07-01", consensus: 13200 },
  ],
  claims: [
    { date: "2026-08-06", obs: "2026-08-01", consensus: 215000 },
    { date: "2026-07-02", obs: "2026-07-01", consensus: 220000 },
    { date: "2026-06-04", obs: "2026-06-01", consensus: 225000 },
    { date: "2026-05-07", obs: "2026-05-01", consensus: 215000 },
    { date: "2026-04-02", obs: "2026-04-01", consensus: 210000 },
    { date: "2026-03-05", obs: "2026-03-01", consensus: 215000 },
    { date: "2026-02-05", obs: "2026-02-01", consensus: 235000 },
    { date: "2026-01-08", obs: "2026-01-01", consensus: 240000 },
    { date: "2025-12-04", obs: "2025-12-01", consensus: 225000 },
    { date: "2025-11-06", obs: "2025-11-01", consensus: 230000 },
    { date: "2025-10-02", obs: "2025-10-01", consensus: 220000 },
    { date: "2025-09-04", obs: "2025-09-01", consensus: 205000 },
    { date: "2025-08-07", obs: "2025-08-01", consensus: 210000 },
    { date: "2025-07-03", obs: "2025-07-01", consensus: 215000 },
  ],
  capacity: [
    { date: "2026-08-11", obs: "2026-07-01", consensus: 76.1 },
    { date: "2026-07-10", obs: "2026-06-01", consensus: 76 },
    { date: "2026-06-11", obs: "2026-05-01", consensus: 75.9 },
    { date: "2026-05-11", obs: "2026-04-01", consensus: 75.6 },
    { date: "2026-04-10", obs: "2026-03-01", consensus: 75.5 },
    { date: "2026-03-11", obs: "2026-02-01", consensus: 75.3 },
    { date: "2026-02-11", obs: "2026-01-01", consensus: 75.4 },
    { date: "2026-01-12", obs: "2025-12-01", consensus: 75.4 },
    { date: "2025-12-12", obs: "2025-11-01", consensus: 75.5 },
    { date: "2025-11-12", obs: "2025-10-01", consensus: 75.9 },
    { date: "2025-10-13", obs: "2025-09-01", consensus: 76 },
    { date: "2025-09-12", obs: "2025-08-01", consensus: 76.2 },
    { date: "2025-08-12", obs: "2025-07-01", consensus: 76.4 },
    { date: "2025-07-11", obs: "2025-06-01", consensus: 76.1 },
  ],
  eu_gdp: [
    { date: "2026-05-01", obs: "2026-04-01", consensus: 0.8 },
    { date: "2026-02-02", obs: "2026-01-01", consensus: 0.8 },
    { date: "2025-11-03", obs: "2025-10-01", consensus: 1.1 },
    { date: "2025-08-01", obs: "2025-07-01", consensus: 0.9 },
  ],
  china_cpi: [
    { date: "2025-05-02", obs: "2025-04-01", consensus: 0.1 },
    { date: "2025-04-02", obs: "2025-03-01", consensus: 0 },
    { date: "2025-03-03", obs: "2025-02-01", consensus: -0.1 },
    { date: "2025-02-03", obs: "2025-01-01", consensus: 0.2 },
    { date: "2025-01-02", obs: "2024-12-01", consensus: 0.1 },
    { date: "2024-12-02", obs: "2024-11-01", consensus: 0.2 },
    { date: "2024-11-01", obs: "2024-10-01", consensus: 0.3 },
    { date: "2024-10-02", obs: "2024-09-01", consensus: 0.4 },
    { date: "2024-09-02", obs: "2024-08-01", consensus: 0.3 },
    { date: "2024-08-02", obs: "2024-07-01", consensus: 0.5 },
    { date: "2024-07-02", obs: "2024-06-01", consensus: 0.3 },
    { date: "2024-06-03", obs: "2024-05-01", consensus: 0.3 },
    { date: "2024-05-02", obs: "2024-04-01", consensus: 0.2 },
    { date: "2024-04-02", obs: "2024-03-01", consensus: 0.2 },
  ],
};
