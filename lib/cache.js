// lib/cache.js
// Cache in-memory sederhana dengan TTL agar tidak memanggil sumber eksternal
// berulang-ulang. Mendukung:
// - in-flight dedupe: banyak pemanggil serentak untuk key yang sama hanya
//   memicu SATU request (penting saat 28 indikator diparalel).
// - penyimpanan paksa (untuk aksi "refresh" yang melewati TTL).

const store = new Map();
const inflight = new Map();

/**
 * Dapatkan nilai dari cache atau hitung jika sudah kedaluwarsa.
 * Jika perhitungan untuk key yang sama sedang berjalan, janji (promise) yang
 * sama dipakai kembali — tidak ada request ganda.
 * @param {string} key
 * @param {number} ttlMs waktu hidup cache (ms)
 * @param {() => Promise<any>} compute
 */
export async function cached(key, ttlMs, compute) {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < ttlMs) {
    return hit.data;
  }
  if (inflight.has(key)) return inflight.get(key);

  const p = compute().then(
    (data) => {
      store.set(key, { at: Date.now(), data });
      inflight.delete(key);
      return data;
    },
    (e) => {
      inflight.delete(key);
      throw e;
    }
  );
  inflight.set(key, p);
  return p;
}

/** Simpan nilai paksa ke cache (digunakan oleh aksi refresh agar TTL di-reset). */
cached.force = function force(key, data) {
  store.set(key, { at: Date.now(), data });
  return data;
};
