import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { adminHomePath } from '../../lib/adminRoles.js'

// `role` opsional -- kalau diisi, halaman di dalam grup route ini cuma bisa
// diakses admin dengan role itu. Role lain diarahkan ke "rumah" role mereka
// sendiri (bukan halaman error/blank), supaya tetap bisa lanjut kerja.
export default function RequireAuth({ role }) {
  const { status, user } = useAuth()
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

  if (role && user?.role !== role) {
    return <Navigate to={adminHomePath(user?.role)} replace />
  }

  return <Outlet />
}
