import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPost, apiPut } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export function useCreateJenisSampah() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body) => (await apiPost('/jenis-sampah', body, token)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jenis-sampah'] })
    },
  })
}

export function useUpdateJenisSampah() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...body }) => (await apiPut(`/jenis-sampah/${id}`, body, token)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jenis-sampah'] })
    },
  })
}
