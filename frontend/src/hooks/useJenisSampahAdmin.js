import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPut } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

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
