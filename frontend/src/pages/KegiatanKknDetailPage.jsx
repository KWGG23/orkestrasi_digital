import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarBlank, Images } from '@phosphor-icons/react'
import PortalLayout from '../components/layout/PortalLayout.jsx'
import { useKegiatanKknDetail } from '../hooks/useKegiatanKknDetail.js'
import { storageUrl } from '../lib/api.js'

export default function KegiatanKknDetailPage() {
  const { tahun } = useParams()
  const { data: kegiatan, isLoading, isError } = useKegiatanKknDetail(tahun)

  if (isLoading) {
    return (
      <PortalLayout crumbs={[{ label: 'Kegiatan KKN', to: '/#kegiatan-kkn' }, { label: 'Memuat…' }]}>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <p className="text-sm text-muted">Memuat dokumentasi kegiatan…</p>
        </div>
      </PortalLayout>
    )
  }

  if (isError || !kegiatan) {
    return (
      <PortalLayout crumbs={[{ label: 'Kegiatan KKN', to: '/#kegiatan-kkn' }, { label: 'Tidak ditemukan' }]}>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CalendarBlank size={30} weight="duotone" />
          </span>
          <h1 className="mt-5 font-heading text-3xl font-semibold text-primary-dark">
            Dokumentasi tidak ditemukan
          </h1>
          <p className="mt-3 text-bark/75">
            Dokumentasi kegiatan KKN tahun {tahun} belum tersedia.
          </p>
          <Link
            to="/#kegiatan-kkn"
            className="mt-7 inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            <ArrowLeft size={18} />
            Kembali ke Kegiatan KKN
          </Link>
        </div>
      </PortalLayout>
    )
  }

  const foto = kegiatan.foto ?? []

  return (
    <PortalLayout crumbs={[{ label: 'Kegiatan KKN', to: '/#kegiatan-kkn' }, { label: kegiatan.judul }]}>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-moss px-4 py-1.5 text-sm font-medium text-primary-dark">
          <CalendarBlank size={18} weight="bold" />
          Tahun {kegiatan.tahun}
        </span>

        <h1 className="mt-5 font-heading text-3xl font-semibold leading-tight text-primary-dark sm:text-4xl">
          {kegiatan.judul}
        </h1>

        {kegiatan.deskripsi && (
          <p className="mt-4 max-w-2xl leading-relaxed text-bark/80">{kegiatan.deskripsi}</p>
        )}

        <div className="mt-8">
          <h2 className="font-heading text-lg font-semibold text-primary-dark">Galeri Dokumentasi</h2>

          {foto.length === 0 ? (
            <div className="mt-3 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-white/60 py-12 text-center">
              <Images size={32} className="text-primary/40" />
              <p className="text-sm text-bark/75">Foto dokumentasi belum tersedia.</p>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {foto.map((path) => (
                <img
                  key={path}
                  src={storageUrl(path)}
                  alt={kegiatan.judul}
                  className="h-40 w-full rounded-xl object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <Link
            to="/#kegiatan-kkn"
            className="inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            <ArrowLeft size={18} />
            Kembali ke daftar kegiatan
          </Link>
        </div>
      </div>
    </PortalLayout>
  )
}
