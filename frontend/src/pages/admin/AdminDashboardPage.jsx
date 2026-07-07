import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { CaretRight, Receipt, Wallet } from '@phosphor-icons/react'
import AdminLayout from '../../components/layout/AdminLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { apiGet } from '../../lib/api.js'

const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const today = new Date().toISOString().slice(0, 10)

function useLaporanHarian() {
  const { token } = useAuth()
  return useQuery({
    queryKey: ['laporan-harian', today],
    queryFn: async () => (await apiGet('/laporan/harian', { tanggal: today }, token)).data,
  })
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useLaporanHarian()

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl font-semibold text-primary-dark">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Ringkasan hari ini, {today}.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-xs text-muted">Nota hari ini</p>
          <p className="mt-1 font-heading text-2xl font-semibold text-primary-dark">
            {isLoading ? '…' : (data?.total_nota ?? 0)}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-xs text-muted">Total nilai setoran</p>
          <p className="mt-1 font-heading text-2xl font-semibold text-primary-dark">
            {isLoading ? '…' : currency.format(Number(data?.total_harga ?? 0))}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-xs text-muted">Metode terbanyak</p>
          <p className="mt-1 font-heading text-lg font-semibold text-primary-dark">
            {isLoading
              ? '…'
              : (Object.entries(data?.per_metode ?? {}).sort(
                  (a, b) => b[1].jumlah_nota - a[1].jumlah_nota
                )[0]?.[0] ?? '—')}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/setoran"
          className="flex items-center justify-between rounded-2xl border border-border bg-white p-5 transition-colors duration-200 hover:border-primary"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-moss text-primary-dark">
              <Receipt size={20} />
            </span>
            <span>
              <span className="block font-semibold text-bark">Input Setoran Baru</span>
              <span className="block text-sm text-muted">Catat setoran sampah nasabah</span>
            </span>
          </span>
          <CaretRight size={18} className="text-muted" />
        </Link>

        <Link
          to="/admin/tabungan"
          className="flex items-center justify-between rounded-2xl border border-border bg-white p-5 transition-colors duration-200 hover:border-primary"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-moss text-primary-dark">
              <Wallet size={20} />
            </span>
            <span>
              <span className="block font-semibold text-bark">Kelola Tabungan</span>
              <span className="block text-sm text-muted">Lihat riwayat & proses penarikan</span>
            </span>
          </span>
          <CaretRight size={18} className="text-muted" />
        </Link>
      </div>
    </AdminLayout>
  )
}
