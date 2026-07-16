import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiDelete, apiGet, apiPost, apiPut } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export function usePengumumanList() {
  return useQuery({
    queryKey: ['pengumuman-list'],
    queryFn: async () => (await apiGet('/pengumuman')).data,
    staleTime: 30_000,
  })
}

export function useCreatePengumuman() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body) => (await apiPost('/pengumuman', body, token)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengumuman-list'] })
    },
  })
}

export function useUpdatePengumuman() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...body }) => (await apiPut(`/pengumuman/${id}`, body, token)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengumuman-list'] })
    },
  })
}

export function useDeletePengumuman() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => (await apiDelete(`/pengumuman/${id}`, token)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengumuman-list'] })
    },
  })
}
