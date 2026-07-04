import { MapPin, Recycle } from '@phosphor-icons/react'

const SOLUTIONS = [
  {
    icon: Recycle,
    title: 'Bank Sampah Digital',
    scope: 'Dusun Karangasem',
    description:
      'Pencatatan setoran per nota, tabungan digital yang selalu sinkron dengan saldo nasabah, dan laporan harian/bulanan untuk pengurus.',
    points: ['Nota setoran otomatis', 'Buku tabungan digital', 'Harga sampah mengikuti BSI'],
  },
  {
    icon: MapPin,
    title: 'Portal Desa Digital',
    scope: 'Karangasem & Tegalwungu',
    description:
      'Peta interaktif dua dusun lengkap dengan batas wilayah, kerentanan bencana, fasilitas umum, dan katalog UMKM lokal.',
    points: ['Peta batas & kerentanan wilayah', 'Katalog UMKM & kontak WA', 'Profil dusun & pengumuman'],
  },
]

export default function Solutions() {
  return (
    <section id="program" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
            Dua sistem, satu tujuan
          </h2>
          <p className="mt-3 text-bark/75">
            Dibangun sebagai bagian dari program KKN digitalisasi desa, menyatukan pengelolaan
            sampah bernilai ekonomi dengan promosi potensi lokal.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {SOLUTIONS.map(({ icon: Icon, title, scope, description, points }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-3xl border border-border bg-white p-8 transition-shadow duration-200 hover:shadow-lg hover:shadow-primary/10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon size={26} weight="duotone" />
              </span>
              <div className="mt-5 flex items-baseline gap-2">
                <h3 className="font-heading text-xl font-semibold text-primary-dark">{title}</h3>
                <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-clay">
                  {scope}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-bark/75">{description}</p>
              <ul className="mt-5 space-y-2">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm text-bark">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
