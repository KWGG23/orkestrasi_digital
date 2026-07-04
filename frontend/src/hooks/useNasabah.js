import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../lib/api.js'

export function useNasabahSearch(q) {
  return useQuery({
    queryKey: ['nasabah-search', q],
    queryFn: async () => (await apiGet('/nasabah', { q })).data,
    enabled: q.trim().length >= 2,
    staleTime: 15_000,
  })
}

export function useNasabahDetail(id) {
  return useQuery({
    queryKey: ['nasabah-detail', id],
    queryFn: async () => (await apiGet(`/nasabah/${id}`)).data,
    enabled: Boolean(id),
  })
}
