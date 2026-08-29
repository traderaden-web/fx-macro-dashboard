-- data/schema.sql
-- Skema database relasional untuk data makroekonomi forex.
-- Ini adalah backup struktur "database" yang sebenarnya, agar mudah dimigrasikan ke
-- PostgreSQL, SQLite, dll. Dashboard saat ini memakai JSON seed + FRED live,
-- namun skema ini siap dipakai jika ingin menyimpan & mengelola data sendiri.

-- Kategori indikator (dimensi)
CREATE TABLE categories (
  id          TEXT PRIMARY KEY,            -- 'inflasi', 'tenaga-kerja', 'moneter', 'pertumbuhan', 'konsumen', 'pasar'
  label       TEXT NOT NULL,
  color       TEXT NOT NULL
);

-- Negara / kawasan (dimensi)
CREATE TABLE countries (
  id          TEXT PRIMARY KEY,            -- 'US', 'EZ', 'UK', 'JP', 'GL'
  name        TEXT NOT NULL,               -- 'Amerika Serikat'
  flag        TEXT NOT NULL,
  currency    TEXT NOT NULL                -- 'USD', 'EUR', 'GBP', 'JPY'
);

-- Definisi indikator (master data)
CREATE TABLE indicators (
  id          TEXT PRIMARY KEY,            -- 'cpi', 'nfp', 'fomc'
  name        TEXT NOT NULL,               -- 'Consumer Price Index (CPI)'
  short       TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id),
  country_id  TEXT NOT NULL REFERENCES countries(id),
  fred_series TEXT,                        -- kode seri FRED, mis. 'CPIAUCSL'
  unit        TEXT NOT NULL,               -- '%', 'ribu', 'index', dll.
  freq        TEXT NOT NULL,               -- 'D' | 'M' | 'Q'
  impact      TEXT NOT NULL,               -- 'High' | 'Medium' | 'Low'
  release     TEXT,                        -- 'Bulanan, Jumat pertama 08:30 ET'
  about       TEXT,
  why         TEXT,
  fx_impact   TEXT
);

-- Nilai historis indikator (facts / observations)
CREATE TABLE observations (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  indicator_id TEXT NOT NULL REFERENCES indicators(id),
  date         TEXT NOT NULL,              -- 'YYYY-MM-DD' (atau 'YYYY-MM' untuk bulanan)
  value        REAL,                       -- nilai numerik
  UNIQUE (indicator_id, date)
);
CREATE INDEX idx_obs_ind_date ON observations (indicator_id, date);

-- Jadwal rilis (kalender ekonomi)
CREATE TABLE releases (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  indicator_id TEXT REFERENCES indicators(id),  -- bisa NULL untuk event non-indikator
  title        TEXT NOT NULL,
  country_id   TEXT NOT NULL REFERENCES countries(id),
  category_id  TEXT REFERENCES categories(id),
  scheduled_at TEXT NOT NULL,              -- ISO datetime 'YYYY-MM-DDTHH:MM:SS+07:00'
  impact       TEXT NOT NULL,
  consensus_prev TEXT,                      -- konsensus / nilai sebelumnya (opsional)
  actual        TEXT,                       -- nilai aktual setelah rilis
  CONSTRAINT uq_release UNIQUE (title, scheduled_at)
);

-- Aset forex yang dipantau & keterkaitannya dengan indikator (opsional)
CREATE TABLE assets (
  symbol   TEXT PRIMARY KEY,               -- 'EURUSD', 'USDJPY', 'XAUUSD'
  pair     TEXT NOT NULL,
  base     TEXT,
  quote    TEXT
);

CREATE TABLE asset_indicator (
  asset_id      TEXT NOT NULL REFERENCES assets(symbol),
  indicator_id  TEXT NOT NULL REFERENCES indicators(id),
  direction     TEXT NOT NULL,             -- 'positif' | 'negatif' | 'netral'
  notes         TEXT,
  PRIMARY KEY (asset_id, indicator_id)
);

-- Contoh data awal
INSERT INTO categories VALUES
  ('inflasi','Inflasi','#f59e0b'),
  ('tenaga-kerja','Tenaga Kerja','#38bdf8'),
  ('moneter','Moneter','#f472b6'),
  ('pertumbuhan','Pertumbuhan','#34d399'),
  ('konsumen','Konsumen','#a78bfa'),
  ('pasar','Pasar','#94a3b8');

INSERT INTO countries VALUES
  ('US','Amerika Serikat','🇺🇸','USD'),
  ('EZ','Zona Euro','🇪🇺','EUR'),
  ('UK','Inggris','🇬🇧','GBP'),
  ('JP','Jepang','🇯🇵','JPY'),
  ('GL','Global','🌐','');

INSERT INTO indicators (id, name, short, category_id, country_id, fred_series, unit, freq, impact, release)
VALUES
  ('cpi','Consumer Price Index (CPI)','CPI','inflasi','US','CPIAUCSL','%','M','High','Bulanan, pertengahan bulan 08:30 ET'),
  ('nfp','Nonfarm Payrolls (NFP)','NFP','tenaga-kerja','US','PAYEMS','ribu','M','High','Bulanan, Jumat pertama 08:30 ET'),
  ('ppi','Producer Price Index (PPI)','PPI','inflasi','US','PPIACO','%','M','Medium','Bulanan, pertengahan bulan 08:30 ET'),
  ('fedfunds','Fed Funds Target Rate','Fed Funds','moneter','US','DFEDTARU','%','M','High','Putusan FOMC 8x/tahun 14:00 ET');
