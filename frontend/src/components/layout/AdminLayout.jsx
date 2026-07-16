import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Buildings,
  FileText,
  Leaf,
  Megaphone,
  Receipt,
  Recycle,
  SignOut,
  SquaresFour,
  Storefront,
  Wallet,
} from '@phosphor-icons/react'
import { useAuth } from '../../context/AuthContext.jsx'

const NAV_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: SquaresFour, end: true },
  { to: '/admin/setoran', label: 'Setoran Baru', icon: Receipt },
  { to: '/admin/tabungan', label: 'Tabungan', icon: Wallet },
  { to: '/admin/jenis-sampah', label: 'Harga Sampah', icon: Recycle },
  { to: '/admin/laporan', label: 'Laporan', icon: FileText },
  { to: '/admin/umkm', label: 'UMKM', icon: Storefront },
  { to: '/admin/profil', label: 'Profil Dusun', icon: Buildings },
  { to: '/admin/pengumuman', label: 'Pengumuman', icon: Megaphone },
]

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/admin" className="flex items-center gap-2 font-heading text-lg font-semibold text-primary-dark">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
              <Leaf size={20} weight="fill" />
            </span>
            Admin Bank Sampah
          </Link>

          <div className="flex items-center gap-4">
            {user && <span className="hidden text-sm text-muted sm:inline">{user.name}</span>}
            <button
              type="button"
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-bark/80 transition-colors duration-200 hover:border-clay hover:text-clay"
            >
              <SignOut size={16} />
              Keluar
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-1 px-4 pb-2 sm:px-6">
          {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'bg-moss text-primary-dark' : 'text-bark/70 hover:bg-moss/60 hover:text-primary-dark'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}
