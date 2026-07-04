import { ArrowRight } from '@phosphor-icons/react'
import OrganicBlob from '../decorative/OrganicBlob.jsx'

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary-dark px-6 py-14 text-center text-white sm:px-12">
          <OrganicBlob
            tone="accent"
            className="pointer-events-none absolute -right-20 -top-16 h-72 w-72 opacity-20"
          />
          <h2 className="relative font-heading text-3xl font-semibold sm:text-4xl">
            Jadi bagian dari Karangasem yang lebih hijau
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/75">
            Daftar sebagai nasabah bank sampah, atau daftarkan usahamu ke Portal Desa —
            dua langkah kecil, dampak yang terus terasa.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#kalkulator"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-primary-dark transition-transform duration-200 hover:-translate-y-0.5"
            >
              Mulai Hitung Setoran
              <ArrowRight size={20} />
            </a>
            <a
              href="#program"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 font-semibold text-white transition-colors duration-200 hover:bg-white/10"
            >
              Pelajari Program
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
