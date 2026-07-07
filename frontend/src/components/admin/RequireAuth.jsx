import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted">
        Memuat sesi…
      </div>
    )
  }

  if (status === 'guest') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
