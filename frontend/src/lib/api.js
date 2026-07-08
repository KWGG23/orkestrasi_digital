export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'

// Bungkus fetch ke API Laravel. Mengembalikan { data, meta } sesuai kontrak
// ApiResponse backend, dan melempar error dengan pesan dari body bila gagal.
async function request(method, path, { params, body, token } = {}) {
  const query = new URLSearchParams(
    Object.entries(params ?? {}).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString()

  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE_URL}${path}${query ? `?${query}` : ''}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => null)

  if (!res.ok || !json?.success) {
    throw new Error(json?.message ?? `Gagal memuat ${path}`)
  }

  return { data: json.data, meta: json.meta ?? null, message: json.message }
}

export async function apiGet(path, params = {}, token = null) {
  return request('GET', path, { params, token })
}

export async function apiPost(path, body = {}, token = null) {
  return request('POST', path, { body, token })
}

export async function apiPut(path, body = {}, token = null) {
  return request('PUT', path, { body, token })
}

export async function apiDelete(path, token = null) {
  return request('DELETE', path, { token })
}

// Upload multipart (mis. foto UMKM). Laravel tidak mengisi $_FILES untuk method
// PUT, jadi update dengan file dikirim sebagai POST + field _method=PUT (method
// spoofing bawaan Laravel).
export async function apiUpload(path, formData, token = null, { isUpdate = false } = {}) {
  if (isUpdate) formData.append('_method', 'PUT')

  const headers = { Accept: 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE_URL}${path}`, { method: 'POST', headers, body: formData })
  const json = await res.json().catch(() => null)

  if (!res.ok || !json?.success) {
    throw new Error(json?.message ?? `Gagal mengirim ${path}`)
  }

  return { data: json.data, meta: json.meta ?? null, message: json.message }
}

export function storageUrl(path) {
  if (!path) return null
  const origin = API_BASE_URL.replace(/\/api\/v1\/?$/, '')
  return `${origin}/storage/${path}`
}
