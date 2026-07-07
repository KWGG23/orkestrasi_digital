import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export function useTabunganRiwayat(nasabahId) {
  return useQuery({
    queryKey: ['tabungan-riwayat', nasabahId],
    queryFn: async () => (await apiGet(`/tabungan/${nasabahId}`)).data,
    enabled: Boolean(nasabahId),
  })
}

export function useTarikTabungan() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => (await apiPost('/tabungan/tarik', payload, token)).data,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tabungan-riwayat', data.id_nasabah] })
      queryClient.invalidateQueries({ queryKey: ['nasabah-detail', data.id_nasabah] })
    },
  })
}
