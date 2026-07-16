import { useQuery } from '@tanstack/react-query'
import { apiDownload, apiGet } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export function useLaporanHarian(tanggal) {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['laporan-harian', tanggal],
    queryFn: async () => (await apiGet('/laporan/harian', { tanggal }, token)).data,
    enabled: Boolean(tanggal),
  })
}

export function useLaporanBulanan(bulan) {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['laporan-bulanan', bulan],
    queryFn: async () => (await apiGet('/laporan/bulanan', { bulan }, token)).data,
    enabled: Boolean(bulan),
  })
}

export function useExportLaporan() {
  const { token } = useAuth()
  return async (bulan) => apiDownload('/laporan/export', { bulan }, token, `laporan-${bulan}.xlsx`)
}
