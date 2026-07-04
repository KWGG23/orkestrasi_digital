export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'

// Bungkus fetch ke API Laravel. Mengembalikan { data, meta } sesuai kontrak
// ApiResponse backend, dan melempar error dengan pesan dari body bila gagal.
export async function apiGet(path, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString()

  const res = await fetch(`${API_BASE_URL}${path}${query ? `?${query}` : ''}`)
  const json = await res.json().catch(() => null)

  if (!res.ok || !json?.success) {
    throw new Error(json?.message ?? `Gagal memuat ${path}`)
  }

  return { data: json.data, meta: json.meta ?? null, message: json.message }
}

export function storageUrl(path) {
  if (!path) return null
  const origin = API_BASE_URL.replace(/\/api\/v1\/?$/, '')
  return `${origin}/storage/${path}`
}
