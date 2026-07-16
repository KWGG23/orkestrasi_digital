import { useState } from 'react'
import { DownloadSimple, FileText } from '@phosphor-icons/react'
import AdminLayout from '../../components/layout/AdminLayout.jsx'
import { useExportLaporan, useLaporanBulanan, useLaporanHarian } from '../../hooks/useLaporan.js'

const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const today = new Date().toISOString().slice(0, 10)
const thisMonth = today.slice(0, 7)

function SummaryCards({ data }) {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-border bg-white p-5">
        <p className="text-xs text-muted">Total nota</p>
        <p className="mt-1 font-heading text-2xl font-semibold text-primary-dark">{data.total_nota}</p>
      </div>
      <div className="rounded-2xl border border-border bg-white p-5">
        <p className="text-xs text-muted">Total nilai setoran</p>
        <p className="mt-1 font-heading text-2xl font-semibold text-primary-dark">
          {currency.format(Number(data.total_harga ?? 0))}
        </p>
      </div>
    </div>
  )
}

function PerMetodeTable({ perMetode }) {
  const entries = Object.entries(perMetode ?? {})
  if (entries.length === 0) return null

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-moss/50 text-left text-xs uppercase text-muted">
          <tr>
            <th className="px-4 py-2.5">Metode</th>
            <th className="px-4 py-2.5">Jumlah Nota</th>
            <th className="px-4 py-2.5">Total Nilai</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map(([metode, ringkasan]) => (
            <tr key={metode}>
              <td className="px-4 py-2.5 capitalize">{metode}</td>
              <td className="px-4 py-2.5">{ringkasan.jumlah_nota}</td>
              <td className="px-4 py-2.5">{currency.format(Number(ringkasan.total_harga ?? 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function LaporanHarianTab() {
  const [tanggal, setTanggal] = useState(today)
  const { data, isLoading } = useLaporanHarian(tanggal)

  return (
    <div className="mt-6">
      <input
        type="date"
        value={tanggal}
        onChange={(e) => setTanggal(e.target.value)}
        className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
      />

      {isLoading ? (
        <p className="mt-4 text-sm text-muted">Memuat…</p>
      ) : data ? (
        <>
          <SummaryCards data={data} />
          <PerMetodeTable perMetode={data.per_metode} />
        </>
      ) : null}
    </div>
  )
}

function LaporanBulananTab() {
  const [bulan, setBulan] = useState(thisMonth)
  const { data, isLoading } = useLaporanBulanan(bulan)
  const exportLaporan = useExportLaporan()
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  async function handleExport() {
    setExporting(true)
    setExportError(null)
    try {
      await exportLaporan(bulan)
    } catch (err) {
      setExportError(err.message ?? 'Gagal mengunduh laporan.')
    } finally {
      setExporting(false)
    }
  }

  const perHari = Object.entries(data?.per_hari ?? {})

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="month"
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary-dark transition-colors duration-200 hover:bg-moss disabled:cursor-not-allowed disabled:opacity-60"
        >
          <DownloadSimple size={16} />
          {exporting ? 'Mengunduh…' : 'Export Excel'}
        </button>
      </div>
      {exportError && <p className="mt-2 text-sm text-clay">{exportError}</p>}

      {isLoading ? (
        <p className="mt-4 text-sm text-muted">Memuat…</p>
      ) : data ? (
        <>
          <SummaryCards data={data} />
          <PerMetodeTable perMetode={data.per_metode} />

          {perHari.length > 0 && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-white">
              <table className="w-full text-sm">
                <thead className="bg-moss/50 text-left text-xs uppercase text-muted">
                  <tr>
                    <th className="px-4 py-2.5">Tanggal</th>
                    <th className="px-4 py-2.5">Jumlah Nota</th>
                    <th className="px-4 py-2.5">Total Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {perHari.map(([tanggal, ringkasan]) => (
                    <tr key={tanggal}>
                      <td className="px-4 py-2.5">{tanggal}</td>
                      <td className="px-4 py-2.5">{ringkasan.jumlah_nota}</td>
                      <td className="px-4 py-2.5">{currency.format(Number(ringkasan.total_harga ?? 0))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}

export default function AdminLaporanPage() {
  const [tab, setTab] = useState('harian')

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl font-semibold text-primary-dark">Laporan</h1>
      <p className="mt-1 text-sm text-muted">Rekap setoran harian dan bulanan, lengkap dengan export Excel.</p>

      <div className="mt-4 flex gap-1 rounded-full bg-moss/50 p-1 sm:w-fit">
        {[
          { key: 'harian', label: 'Harian', icon: FileText },
          { key: 'bulanan', label: 'Bulanan', icon: FileText },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 sm:flex-none ${
              tab === key ? 'bg-white text-primary-dark shadow-sm' : 'text-bark/70 hover:text-primary-dark'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'harian' ? <LaporanHarianTab /> : <LaporanBulananTab />}
    </AdminLayout>
  )
}
