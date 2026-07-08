import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiDelete, apiUpload } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export function useCreateUmkm() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData) => (await apiUpload('/umkm', formData, token)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm-list'] })
    },
  })
}

export function useUpdateUmkm() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, formData }) =>
      (await apiUpload(`/umkm/${id}`, formData, token, { isUpdate: true })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm-list'] })
    },
  })
}

export function useDeleteUmkm() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => (await apiDelete(`/umkm/${id}`, token)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm-list'] })
    },
  })
}
