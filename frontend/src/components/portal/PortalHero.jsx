import { Buildings, Storefront, Recycle } from '@phosphor-icons/react'
import { useLiveStats } from '../../hooks/useLiveStats.js'
import OrganicBlob from '../decorative/OrganicBlob.jsx'

export default function PortalHero() {
  const { data } = useLiveStats()

  const stats = [
    { icon: Recycle, label: 'Nasabah bank sampah', value: data?.nasabah },
    { icon: Storefront, label: 'UMKM terdata', value: data?.umkm },
    { icon: Buildings, label: 'Dusun tercakup', value: 2 },
  ]

  return (
    <section className="relative overflow-hidden py-14">
      <OrganicBlob
        tone="primary"
        className="pointer-events-none absolute -left-20 -top-16 h-80 w-80 opacity-20"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-moss px-4 py-1.5 text-sm font-medium text-primary-dark">
          <Buildings size={18} weight="bold" />
          Kelurahan Muntilan, Kecamatan Muntilan, Kabupaten Magelang
        </span>

        <h1 className="mt-5 max-w-2xl font-heading text-4xl font-semibold leading-tight text-primary-dark sm:text-5xl">
          Portal Desa Digital Karangasem & Tegalwungu
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-bark/80">
          Satu pintu masuk untuk profil dusun, katalog UMKM, peta wilayah, dan pencatatan
          bank sampah — dirawat bersama warga, pengurus, dan tim KKN.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border border-border bg-white px-5 py-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={18} weight="duotone" />
              </span>
              <p className="mt-3 font-heading text-2xl font-semibold text-primary-dark">
                {typeof value === 'number' ? value : '—'}
              </p>
              <p className="text-xs text-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
