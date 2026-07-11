import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../lib/api.js'

export function useKegiatanKknDetail(tahun) {
  return useQuery({
    queryKey: ['kegiatan-kkn-detail', tahun],
    queryFn: async () => (await apiGet(`/kegiatan-kkn/${tahun}`)).data,
    enabled: Boolean(tahun),
    retry: false,
  })
}
