import { ChartLineUp, Storefront, UsersThree } from '@phosphor-icons/react'
import { useLiveStats } from '../../hooks/useLiveStats.js'

const FALLBACK_TARGETS = [
  {
    icon: UsersThree,
    label: 'Target nasabah bank sampah',
    value: '100+',
    note: 'warga Dusun Karangasem tahun pertama',
  },
  {
    icon: Storefront,
    label: 'Target UMKM terdata',
    value: '50+',
    note: 'di Karangasem & Tegalwungu',
  },
  {
    icon: ChartLineUp,
    label: 'Jenis sampah bernilai',
    value: '50+',
    note: 'kategori mengikuti harga BSI',
  },
]

export default function ImpactMetrics() {
  const { data, isSuccess } = useLiveStats()

  const cards = [
    {
      icon: UsersThree,
      label: 'Nasabah terdaftar',
      value: data?.nasabah,
      fallback: FALLBACK_TARGETS[0],
    },
    {
      icon: Storefront,
      label: 'UMKM di peta portal',
      value: data?.umkm,
      fallback: FALLBACK_TARGETS[1],
    },
    {
      icon: ChartLineUp,
      label: 'Jenis sampah dikelola',
      value: data?.jenisSampah,
      fallback: FALLBACK_TARGETS[2],
    },
  ]

  return (
    <section id="dampak" className="bg-moss/50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
            Dampak yang bisa diukur
          </h2>
          <p className="mt-3 text-bark/75">
            Angka di bawah ditarik langsung dari sistem Bank Sampah &amp; Portal Desa saat tersedia.
            Selama masa rintisan, kami tampilkan target program sebagai acuan.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {cards.map(({ icon: Icon, label, value, fallback }) => {
            const hasLive = isSuccess && typeof value === 'number'
            return (
              <div
                key={label}
                className="rounded-3xl border border-border bg-white p-6 shadow-sm shadow-primary/5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon size={24} weight="duotone" />
                </span>
                <p className="mt-5 font-heading text-3xl font-semibold text-primary-dark">
                  {hasLive ? value : fallback.value}
                </p>
                <p className="mt-1 text-sm font-medium text-bark">{label}</p>
                <p className="mt-1 text-xs text-muted">
                  {hasLive ? 'data langsung dari sistem' : fallback.note}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
