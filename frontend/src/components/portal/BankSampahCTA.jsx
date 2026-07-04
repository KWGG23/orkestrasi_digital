import { Link } from 'react-router-dom'
import { ArrowRight, Wallet } from '@phosphor-icons/react'
import OrganicBlob from '../decorative/OrganicBlob.jsx'

export default function BankSampahCTA() {
  return (
    <section id="bank-sampah" className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary-dark px-6 py-12 text-white sm:px-12">
          <OrganicBlob
            tone="accent"
            className="pointer-events-none absolute -right-16 -top-10 h-64 w-64 opacity-20"
          />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
                <Wallet size={18} weight="bold" />
                Khusus Dusun Karangasem
              </span>
              <h2 className="mt-4 font-heading text-3xl font-semibold">
                Portal Pencatatan Bank Sampah
              </h2>
              <p className="mt-3 text-white/75">
                Cek saldo tabungan dan riwayat setoran memakai nomor anggota. Pencatatan setoran
                baru dilakukan oleh pengurus bank sampah di lokasi penimbangan.
              </p>
            </div>
            <Link
              to="/portal/bank-sampah"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-primary-dark transition-transform duration-200 hover:-translate-y-0.5"
            >
              Cek Saldo & Riwayat
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
