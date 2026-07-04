import { Leaf } from '@phosphor-icons/react'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-2 font-heading font-semibold text-primary-dark">
          <Leaf size={20} weight="fill" className="text-primary" />
          Desa Digital Karangasem
        </div>
        <p className="text-sm text-muted">
          Dusun Karangasem &amp; Dusun Tegalwungu, Kelurahan Muntilan, Kecamatan Muntilan, Kabupaten Magelang.
          Proyek KKN digitalisasi desa &middot; mitra Bank Sampah Indonesia (BSI).
        </p>
      </div>
    </footer>
  )
}
