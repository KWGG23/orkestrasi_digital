import { useQuery } from '@tanstack/react-query'
import { API_BASE_URL } from '../lib/api.js'

// layer: 'admin' | 'fasilitas'
// Endpoint ini mengembalikan GeoJSON FeatureCollection mentah (bukan amplop ApiResponse standar).
export function useGeoLayer(layer) {
  return useQuery({
    queryKey: ['geo-layer', layer],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/layers/${layer}`)
      if (!res.ok) throw new Error(`Gagal memuat layer ${layer}`)
      return res.json()
    },
    staleTime: 5 * 60_000,
  })
}
