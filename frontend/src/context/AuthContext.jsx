import { createContext, useContext, useEffect, useState } from 'react'
import { apiGet, apiPost } from '../lib/api.js'

const AuthContext = createContext(null)
const TOKEN_KEY = 'admin_token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState(token ? 'loading' : 'guest')

  useEffect(() => {
    if (!token) {
      setStatus('guest')
      return
    }

    let cancelled = false
    setStatus('loading')

    apiGet('/auth/me', {}, token)
      .then(({ data }) => {
        if (cancelled) return
        setUser(data)
        setStatus('authenticated')
      })
      .catch(() => {
        if (cancelled) return
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
        setStatus('guest')
      })

    return () => {
      cancelled = true
    }
  }, [token])

  async function login(email, password) {
    const { data } = await apiPost('/auth/login', { email, password })
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    setUser(data.user)
    setStatus('authenticated')
  }

  async function logout() {
    try {
      if (token) await apiPost('/auth/logout', {}, token)
    } catch {
      // token mungkin sudah invalid — tetap lanjut hapus sesi lokal
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setUser(null)
      setStatus('guest')
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}
