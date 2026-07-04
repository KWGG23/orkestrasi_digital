import { ArrowRight, Recycle } from '@phosphor-icons/react'
import OrganicBlob from '../decorative/OrganicBlob.jsx'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <OrganicBlob
        tone="primary"
        className="pointer-events-none absolute -left-24 -top-20 h-96 w-96 opacity-30 animate-drift"
      />
      <OrganicBlob
        tone="accent"
        className="pointer-events-none absolute -right-16 top-32 h-72 w-72 opacity-20 animate-drift [animation-delay:4s]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full bg-moss px-4 py-1.5 text-sm font-medium text-primary-dark">
            <Recycle size={18} weight="bold" />
            Bank Sampah Digital &middot; Portal Desa
          </span>

          <h1 className="mt-6 font-heading text-4xl font-semibold leading-tight text-primary-dark sm:text-5xl">
            Mengelola sampah, menumbuhkan ekonomi Dusun Karangasem.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-bark/80">
            Platform digital yang menghubungkan setoran sampah warga dengan tabungan nyata,
            bermitra dengan BSI (Bank Sampah Indonesia), dan memetakan UMKM di dua dusun —
            Karangasem dan Tegalwungu.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#kalkulator"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary-dark"
            >
              Hitung Dampak Sampah Anda
              <ArrowRight size={20} />
            </a>
            <a
              href="#program"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-6 py-3.5 font-semibold text-primary-dark transition-colors duration-200 hover:bg-moss"
            >
              Lihat Program
            </a>
          </div>
        </div>

        <div className="relative animate-rise [animation-delay:150ms]">
          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-xl shadow-primary/5">
            <p className="text-sm font-medium uppercase tracking-wide text-muted">Harga sampah terbaru &middot; BSI</p>
            <ul className="mt-4 space-y-3">
              {[
                ['Kardus', 'Rp 1.000/kg'],
                ['Botol PET Bening', 'Rp 3.000/kg'],
                ['Aluminium (Alma)', 'Rp 7.000/kg'],
                ['Minyak Jelantah', 'Rp 3.400/kg'],
              ].map(([name, price]) => (
                <li key={name} className="flex items-center justify-between rounded-xl bg-sand/60 px-4 py-3">
                  <span className="text-sm font-medium text-bark">{name}</span>
                  <span className="font-heading text-sm font-semibold text-primary-dark">{price}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted">
              Harga dapat berubah mengikuti update dari mitra BSI.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
