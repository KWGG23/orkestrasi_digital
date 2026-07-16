import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPut } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export function useUpdateProfilDusun() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ dusun, konten }) => (await apiPut(`/profil/${dusun}`, { konten }, token)).data,
    onSuccess: (_data, { dusun }) => {
      queryClient.invalidateQueries({ queryKey: ['profil-dusun', dusun] })
    },
  })
}
