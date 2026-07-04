import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../lib/api.js'

export function useUmkmList({ dusun, kategori, q, limit } = {}) {
  return useQuery({
    queryKey: ['umkm-list', { dusun, kategori, q }],
    queryFn: async () => {
      const { data, meta } = await apiGet('/umkm', { dusun, kategori, q })
      return { items: limit ? data.slice(0, limit) : data, total: meta?.total ?? data.length }
    },
    staleTime: 30_000,
  })
}
