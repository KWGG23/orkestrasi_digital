import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Buildings, CalendarBlank, Images, X } from '@phosphor-icons/react'
import PortalLayout from '../components/layout/PortalLayout.jsx'
import { useKegiatanKknDetail } from '../hooks/useKegiatanKknDetail.js'
import { storageUrl } from '../lib/api.js'
import Seo from '../components/Seo.jsx'

const DUSUN_LABELS = { karangasem: 'Karangasem', blongkeng: 'Blongkeng' }

export default function KegiatanKknDetailPage() {
  const { tahun, dusun } = useParams()
  const { data: kegiatan, isLoading, isError } = useKegiatanKknDetail(tahun, dusun)
  // Mobile/tablet tidak punya hover, jadi tap buka foto penuh lewat state ini.
  // Desktop pakai hover CSS murni (group-hover di bawah), bukan state -- versi
  // awal pakai overlay fixed full-screen yang muncul di onMouseEnter, tapi itu
  // langsung menutupi posisi kursor sendiri sehingga mouseleave ke-trigger
  // instan lalu overlay hilang lagi dst (glitch/flicker). CSS group-hover
  // tidak kena masalah itu karena statusnya ngikutin elemen DOM yang di-hover,
  // bukan re-render React yang bisa saling kejar dengan posisi kursor.
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
                  // z-0 + hover:z-20 di elemen INI (bukan gambar di dalamnya) supaya
                  // seluruh sel ini terangkat di atas tetangga grid-nya saat foto
                  // di dalamnya membesar keluar batas sel.
                  <div key={path} className="group relative z-0 h-40 hover:z-20">
                    <button
                      type="button"
                      onClick={() => setPreviewFoto((current) => (current === url ? null : url))}
                      className="block h-full w-full cursor-zoom-in"
                    >
                      <img
                        src={url}
                        alt={kegiatan.judul}
                        className="h-full w-full rounded-xl object-cover shadow-sm transition-all duration-300 ease-out group-hover:absolute group-hover:left-1/2 group-hover:top-1/2 group-hover:h-64 group-hover:w-64 group-hover:max-w-[85vw] group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:rounded-2xl group-hover:bg-white group-hover:object-contain group-hover:p-2 group-hover:shadow-2xl"
                      />
                    </button>
                  </div>
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
