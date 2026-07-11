import { Link, useParams } from 'react-router-dom'
import {
  Certificate,
  Clock,
  CreditCard,
  InstagramLogo,
  MapPin,
  Storefront,
  Tag,
  WhatsappLogo,
} from '@phosphor-icons/react'
import PortalLayout from '../components/layout/PortalLayout.jsx'
import { useUmkmDetail } from '../hooks/useUmkmDetail.js'
import { storageUrl } from '../lib/api.js'

const KATEGORI_LABEL = {
  kuliner: 'Kuliner',
  kerajinan: 'Kerajinan',
  pertanian: 'Pertanian',
  jasa: 'Jasa',
  perdagangan: 'Perdagangan',
}

const DUSUN_LABEL = {
  karangasem: 'Dusun Karangasem',
  blongkeng: 'Dusun Blongkeng',
}

function Chip({ children }) {
  return (
    <span className="rounded-full bg-moss px-3 py-1 text-xs font-medium text-primary-dark">
      {children}
    </span>
  )
}

export default function UmkmDetailPage() {
  const { id } = useParams()
  const { data: umkm, isLoading, isError } = useUmkmDetail(id)

  if (isLoading) {
    return (
      <PortalLayout crumbs={[{ label: 'Katalog UMKM', to: '/portal/umkm' }, { label: 'Memuat…' }]}>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <p className="text-sm text-muted">Memuat data UMKM…</p>
        </div>
      </PortalLayout>
    )
  }

  if (isError || !umkm) {
    return (
      <PortalLayout crumbs={[{ label: 'Katalog UMKM', to: '/portal/umkm' }, { label: 'Tidak ditemukan' }]}>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="font-heading text-2xl font-semibold text-primary-dark">UMKM tidak ditemukan</h1>
          <Link to="/portal/umkm" className="mt-6 inline-block font-semibold text-primary hover:text-primary-dark">
            Kembali ke Katalog UMKM
          </Link>
        </div>
      </PortalLayout>
    )
  }

  const foto = storageUrl(umkm.foto_usaha)
  const fotoProduk = umkm.foto_produk ?? []
  const produkUtama = umkm.produk_utama ?? []
  const metodeBayar = umkm.metode_bayar ?? []
  const platformOnline = umkm.platform_online ?? []

  return (
    <PortalLayout crumbs={[{ label: 'Katalog UMKM', to: '/portal/umkm' }, { label: umkm.nama_usaha }]}>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex h-56 items-center justify-center overflow-hidden rounded-3xl bg-moss sm:h-72">
          {foto ? (
            <img src={foto} alt={umkm.nama_usaha} className="h-full w-full object-cover" />
          ) : (
            <Storefront size={48} className="text-primary/40" weight="duotone" />
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Chip>{DUSUN_LABEL[umkm.dusun] ?? umkm.dusun}</Chip>
          <Chip>{KATEGORI_LABEL[umkm.kategori] ?? umkm.kategori}</Chip>
          {umkm.punya_nib && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary-dark">
              <Certificate size={14} weight="fill" />
              Sudah punya NIB
            </span>
          )}
        </div>

        <h1 className="mt-3 font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
          {umkm.nama_usaha}
        </h1>
        <p className="mt-1 text-bark/75">Pemilik: {umkm.nama_pemilik}</p>

        {umkm.deskripsi && (
          <p className="mt-4 max-w-2xl leading-relaxed text-bark/80">{umkm.deskripsi}</p>
        )}

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {produkUtama.length > 0 && (
            <div className="rounded-2xl border border-border bg-white p-5">
              <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-primary-dark">
                <Tag size={18} />
                Produk Utama
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {produkUtama.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
              {umkm.kisaran_harga && (
                <p className="mt-3 text-sm text-muted">Kisaran harga: {umkm.kisaran_harga}</p>
              )}
            </div>
          )}

          {(umkm.jam_buka || umkm.hari_buka) && (
            <div className="rounded-2xl border border-border bg-white p-5">
              <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-primary-dark">
                <Clock size={18} />
                Jam Operasional
              </h2>
              {umkm.hari_buka && <p className="mt-2 text-sm text-bark/80">Hari: {umkm.hari_buka}</p>}
              {umkm.jam_buka && <p className="mt-1 text-sm text-bark/80">Jam: {umkm.jam_buka}</p>}
            </div>
          )}

          {metodeBayar.length > 0 && (
            <div className="rounded-2xl border border-border bg-white p-5">
              <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-primary-dark">
                <CreditCard size={18} />
                Metode Pembayaran
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {metodeBayar.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </div>
          )}

          {(umkm.lat && umkm.lng) && (
            <div className="rounded-2xl border border-border bg-white p-5">
              <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-primary-dark">
                <MapPin size={18} />
                Lokasi
              </h2>
              <p className="mt-2 text-sm text-bark/80">
                {umkm.lat}, {umkm.lng}
              </p>
            </div>
          )}
        </div>

        {fotoProduk.length > 0 && (
          <div className="mt-8">
            <h2 className="font-heading text-lg font-semibold text-primary-dark">Foto Produk</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {fotoProduk.map((path) => (
                <img
                  key={path}
                  src={storageUrl(path)}
                  alt={umkm.nama_usaha}
                  className="h-32 w-full rounded-xl object-cover"
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {umkm.no_wa && (
            <a
              href={`https://wa.me/${umkm.no_wa.replace(/^0/, '62')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
            >
              <WhatsappLogo size={18} weight="fill" />
              Hubungi via WhatsApp
            </a>
          )}
          {umkm.instagram && (
            <a
              href={`https://instagram.com/${umkm.instagram.replace(/^@/, '')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-bark transition-colors duration-200 hover:border-primary hover:text-primary-dark"
            >
              <InstagramLogo size={18} />
              {umkm.instagram}
            </a>
          )}
          {platformOnline.map((platform) => (
            <span
              key={platform}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-bark/80"
            >
              Tersedia di {platform}
            </span>
          ))}
        </div>
      </div>
    </PortalLayout>
  )
}
