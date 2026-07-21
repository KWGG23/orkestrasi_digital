import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../lib/api.js'

export function useKegiatanKknDetail(tahun, dusun) {
  return useQuery({
    queryKey: ['kegiatan-kkn-detail', tahun, dusun],
    queryFn: async () => (await apiGet(`/kegiatan-kkn/${tahun}/${dusun}`)).data,
    enabled: Boolean(tahun) && Boolean(dusun),
    retry: false,
  })
}
