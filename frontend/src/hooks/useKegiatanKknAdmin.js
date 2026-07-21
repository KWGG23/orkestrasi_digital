import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiDelete, apiUpload } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export function useCreateKegiatanKkn() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData) => (await apiUpload('/kegiatan-kkn', formData, token)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan-kkn-list'] })
    },
  })
}

export function useUpdateKegiatanKkn() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, formData }) =>
      (await apiUpload(`/kegiatan-kkn/${id}`, formData, token, { isUpdate: true })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan-kkn-list'] })
    },
  })
}

export function useDeleteKegiatanKkn() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => (await apiDelete(`/kegiatan-kkn/${id}`, token)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan-kkn-list'] })
    },
  })
}
