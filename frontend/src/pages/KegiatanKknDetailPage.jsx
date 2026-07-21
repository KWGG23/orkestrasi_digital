import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Buildings, CalendarBlank, Images, MagnifyingGlassPlus, X } from '@phosphor-icons/react'
import PortalLayout from '../components/layout/PortalLayout.jsx'
import { useKegiatanKknDetail } from '../hooks/useKegiatanKknDetail.js'
import { storageUrl } from '../lib/api.js'
import Seo from '../components/Seo.jsx'

const DUSUN_LABELS = { karangasem: 'Karangasem', blongkeng: 'Blongkeng' }

export default function KegiatanKknDetailPage() {
  const { tahun, dusun } = useParams()
  const { data: kegiatan, isLoading, isError } = useKegiatanKknDetail(tahun, dusun)
  // Desktop: hover buka preview (mouse enter/leave). Mobile/tablet tidak
  // punya hover, jadi tap toggle preview yang sama lewat onClick.
  const [previewFoto, setPreviewFoto] = useState(null)

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
        <Seo title="Dokumentasi Tidak Ditemukan" noindex />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CalendarBlank size={30} weight="duotone" />
          </span>
          <h1 className="mt-5 font-heading text-3xl font-semibold text-primary-dark">
            Dokumentasi tidak ditemukan
          </h1>
          <p className="mt-3 text-bark/75">
            Dokumentasi kegiatan KKN tahun {tahun} untuk Dusun {DUSUN_LABELS[dusun] ?? dusun} belum tersedia.
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
      <Seo
        title={kegiatan.judul}
        description={
          kegiatan.deskripsi ||
          `Dokumentasi kegiatan KKN tahun ${kegiatan.tahun} di Dusun ${DUSUN_LABELS[kegiatan.dusun] ?? kegiatan.dusun}.`
        }
        image={foto[0] ? storageUrl(foto[0]) : undefined}
      />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-moss px-4 py-1.5 text-sm font-medium text-primary-dark">
            <CalendarBlank size={18} weight="bold" />
            Tahun {kegiatan.tahun}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-moss px-4 py-1.5 text-sm font-medium text-primary-dark">
            <Buildings size={18} weight="bold" />
            Dusun {DUSUN_LABELS[kegiatan.dusun] ?? kegiatan.dusun}
          </span>
        </div>

        <h1 className="mt-5 font-heading text-3xl font-semibold leading-tight text-primary-dark sm:text-4xl">
          {kegiatan.judul}
        </h1>

        {kegiatan.nama_kelompok && (
          <p className="mt-1 text-sm font-medium text-muted">{kegiatan.nama_kelompok}</p>
        )}

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
              {foto.map((path) => {
                const url = storageUrl(path)
                return (
                  <button
                    key={path}
                    type="button"
                    onMouseEnter={() => setPreviewFoto(url)}
                    onMouseLeave={() => setPreviewFoto(null)}
                    onClick={() => setPreviewFoto((current) => (current === url ? null : url))}
                    className="group relative h-40 w-full cursor-zoom-in overflow-hidden rounded-xl"
                  >
                    <img
                      src={url}
                      alt={kegiatan.judul}
                      className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-primary-dark/0 opacity-0 transition-all duration-300 group-hover:bg-primary-dark/20 group-hover:opacity-100">
                      <MagnifyingGlassPlus size={24} weight="bold" className="text-white drop-shadow" />
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {previewFoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/80 p-4 backdrop-blur-sm"
            onClick={() => setPreviewFoto(null)}
          >
            <button
              type="button"
              onClick={() => setPreviewFoto(null)}
              aria-label="Tutup"
              className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X size={20} weight="bold" />
            </button>
            <img
              src={previewFoto}
              alt={kegiatan.judul}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            />
          </div>
        )}

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
