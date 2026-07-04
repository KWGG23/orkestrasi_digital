import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../lib/api.js'

async function fetchCount(path) {
  const { data, meta } = await apiGet(path)
  return meta?.total ?? (Array.isArray(data) ? data.length : 0)
}

// Menarik angka nyata dari API Bank Sampah & Portal Desa.
// Jika backend belum jalan (mis. saat develop tampilan saja), gagal senyap
// dan komponen menampilkan target program sebagai gantinya.
export function useLiveStats() {
  return useQuery({
    queryKey: ['live-stats'],
    queryFn: async () => {
      const [nasabah, umkm, jenisSampah] = await Promise.allSettled([
        fetchCount('/nasabah'),
        fetchCount('/umkm'),
        fetchCount('/jenis-sampah'),
      ])

      return {
        nasabah: nasabah.status === 'fulfilled' ? nasabah.value : null,
        umkm: umkm.status === 'fulfilled' ? umkm.value : null,
        jenisSampah: jenisSampah.status === 'fulfilled' ? jenisSampah.value : null,
      }
    },
    staleTime: 60_000,
    retry: 1,
  })
}
