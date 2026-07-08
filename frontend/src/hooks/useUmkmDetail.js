import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../lib/api.js'

export function useUmkmDetail(id) {
  return useQuery({
    queryKey: ['umkm-detail', id],
    queryFn: async () => (await apiGet(`/umkm/${id}`)).data,
    enabled: Boolean(id),
  })
}
