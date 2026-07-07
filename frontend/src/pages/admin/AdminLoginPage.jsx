import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Leaf, Lock, Warning } from '@phosphor-icons/react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminLoginPage() {
  const { status, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (status === 'authenticated') {
    return <Navigate to={location.state?.from?.pathname ?? '/admin'} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(location.state?.from?.pathname ?? '/admin', { replace: true })
    } catch (err) {
      setError(err.message ?? 'Gagal masuk. Periksa email dan password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2 font-heading text-lg font-semibold text-primary-dark">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
            <Leaf size={20} weight="fill" />
          </span>
          Admin Bank Sampah
        </div>
        <p className="mt-2 text-sm text-muted">Masuk untuk mengelola setoran dan tabungan nasabah.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-bark">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-bark outline-none focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-bark">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-bark outline-none focus:border-primary"
            />
          </div>

          {error && (
            <p className="flex items-center gap-1.5 rounded-xl bg-clay/10 px-3 py-2 text-sm text-clay">
              <Warning size={16} />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Lock size={16} weight="bold" />
            {submitting ? 'Memproses…' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}
