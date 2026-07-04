import { Handshake, SealCheck, ShieldCheck, Sparkle } from '@phosphor-icons/react'

const BADGES = [
  {
    icon: Handshake,
    title: 'Mitra Resmi BSI',
    description: 'Harga sampah mengikuti standar Bank Sampah Indonesia (BSI) — Dipa Nirmala.',
  },
  {
    icon: ShieldCheck,
    title: 'Program KKN Terverifikasi',
    description: 'Dikembangkan sebagai proyek KKN digitalisasi desa di bawah pembinaan kampus.',
  },
  {
    icon: SealCheck,
    title: 'Data Dua Dusun',
    description: 'Cakupan Portal Desa disepakati bersama Dusun Karangasem & Dusun Tegalwungu.',
  },
  {
    icon: Sparkle,
    title: 'Transparansi Harga',
    description: 'Update harga sampah oleh admin, tanpa perlu ubah kode — selalu bisa diaudit warga.',
  },
]

export default function CertificationBadges() {
  return (
    <section id="sertifikasi" className="bg-sand/50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
            Kemitraan &amp; kredibilitas
          </h2>
          <p className="mt-3 text-bark/75">
            Dibangun bersama pemangku kepentingan lokal, bukan klaim sepihak.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-clay/20 bg-white p-6 text-center"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Icon size={24} weight="duotone" />
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-primary-dark">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-bark/70">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
