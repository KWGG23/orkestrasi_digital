import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPost } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export function useCreateNasabah() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => (await apiPost('/nasabah', payload, token)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nasabah-search'] })
    },
  })
}

export function useCreateSetoran() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload) => (await apiPost('/setoran', payload, token)).data,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['nasabah-detail', data.id_nasabah] })
      queryClient.invalidateQueries({ queryKey: ['tabungan-riwayat', data.id_nasabah] })
    },
  })
}
