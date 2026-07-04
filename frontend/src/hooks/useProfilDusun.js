import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../lib/api.js'

export function useProfilDusun(dusun) {
  return useQuery({
    queryKey: ['profil-dusun', dusun],
    queryFn: async () => (await apiGet(`/profil/${dusun}`)).data,
    enabled: Boolean(dusun),
    staleTime: 60_000,
  })
}
