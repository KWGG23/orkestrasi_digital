import { Link } from 'react-router-dom'
import { Storefront, WhatsappLogo } from '@phosphor-icons/react'
import { storageUrl } from '../../lib/api.js'

const KATEGORI_LABEL = {
  kuliner: 'Kuliner',
  kerajinan: 'Kerajinan',
  pertanian: 'Pertanian',
  jasa: 'Jasa',
  perdagangan: 'Perdagangan',
}

const DUSUN_LABEL = {
  karangasem: 'Karangasem',
  blongkeng: 'Blongkeng',
}

export default function UmkmCard({ umkm }) {
  const foto = storageUrl(umkm.foto_usaha)

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white">
      <Link to={`/portal/umkm/${umkm.id}`} className="flex flex-1 flex-col">
        <div className="flex h-36 items-center justify-center bg-moss">
          {foto ? (
            <img src={foto} alt={umkm.nama_usaha} className="h-full w-full object-cover" />
          ) : (
            <Storefront size={36} className="text-primary/50" weight="duotone" />
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-clay">
              {DUSUN_LABEL[umkm.dusun] ?? umkm.dusun}
            </span>
            <span className="rounded-full bg-moss px-2.5 py-0.5 text-xs font-medium text-primary-dark">
              {KATEGORI_LABEL[umkm.kategori] ?? umkm.kategori}
            </span>
          </div>
          <h3 className="mt-3 font-heading text-lg font-semibold text-primary-dark">
            {umkm.nama_usaha}
          </h3>
          <p className="text-sm text-muted">{umkm.nama_pemilik}</p>
          {umkm.deskripsi && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-bark/75">{umkm.deskripsi}</p>
          )}
        </div>
      </Link>
      {umkm.no_wa && (
        <a
          href={`https://wa.me/${umkm.no_wa.replace(/^0/, '62')}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 border-t border-border px-5 py-3 text-sm font-semibold text-primary hover:text-primary-dark"
        >
          <WhatsappLogo size={18} weight="fill" />
          Hubungi via WhatsApp
        </a>
      )}
    </div>
  )
}
