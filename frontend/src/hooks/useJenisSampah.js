import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../lib/api.js'

export function useJenisSampah() {
  return useQuery({
    queryKey: ['jenis-sampah'],
    queryFn: async () => (await apiGet('/jenis-sampah')).data,
    staleTime: 60_000,
  })
}
