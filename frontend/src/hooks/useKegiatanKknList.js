import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../lib/api.js'

export function useKegiatanKknList() {
  return useQuery({
    queryKey: ['kegiatan-kkn-list'],
    queryFn: async () => (await apiGet('/kegiatan-kkn')).data,
    staleTime: 30_000,
  })
}
