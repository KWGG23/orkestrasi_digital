import { Link } from 'react-router-dom'
import { ArrowRight, Storefront } from '@phosphor-icons/react'
import { useUmkmList } from '../../hooks/useUmkmList.js'
import UmkmCard from '../umkm/UmkmCard.jsx'
import SectionHeading from './SectionHeading.jsx'

export default function UmkmPreviewSection() {
  const { data, isLoading } = useUmkmList({ limit: 3 })
  const items = data?.items ?? []

  return (
    <section id="katalog-umkm" className="bg-moss/50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Katalog UMKM"
            title="Usaha warga Karangasem & Tegalwungu"
            description="Ditemukan lewat peta portal, lengkap dengan kontak WhatsApp langsung ke pemilik."
          />
          <Link
            to="/portal/umkm"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-5 py-2.5 text-sm font-semibold text-primary-dark transition-colors duration-200 hover:bg-white"
          >
            Lihat semua UMKM
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <p className="text-sm text-muted">Memuat katalog UMKM…</p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-white/60 py-12 text-center">
              <Storefront size={32} className="text-primary/40" />
              <p className="text-sm text-bark/75">
                Belum ada UMKM terdaftar. Pendaftaran dikoordinasikan oleh pengurus/perangkat desa.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-3">
              {items.map((umkm) => (
                <UmkmCard key={umkm.id} umkm={umkm} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
