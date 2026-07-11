import { useState } from 'react'
import { FunnelSimple, MagnifyingGlass, Storefront } from '@phosphor-icons/react'
import PortalLayout from '../components/layout/PortalLayout.jsx'
import { useUmkmList } from '../hooks/useUmkmList.js'
import UmkmCard from '../components/umkm/UmkmCard.jsx'

const DUSUN_OPTIONS = [
  { value: '', label: 'Semua dusun' },
  { value: 'karangasem', label: 'Karangasem' },
  { value: 'blongkeng', label: 'Blongkeng' },
]

const KATEGORI_OPTIONS = [
  { value: '', label: 'Semua kategori' },
  { value: 'kuliner', label: 'Kuliner' },
  { value: 'kerajinan', label: 'Kerajinan' },
  { value: 'pertanian', label: 'Pertanian' },
  { value: 'jasa', label: 'Jasa' },
  { value: 'perdagangan', label: 'Perdagangan' },
]

export default function UmkmCatalogPage() {
  const [dusun, setDusun] = useState('')
  const [kategori, setKategori] = useState('')
  const [q, setQ] = useState('')

  const { data, isLoading } = useUmkmList({ dusun, kategori, q })
  const items = data?.items ?? []

  return (
    <PortalLayout crumbs={[{ label: 'Katalog UMKM' }]}>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
          Katalog UMKM
        </h1>
        <p className="mt-2 text-bark/75">
          {data ? `${data.total} usaha terdaftar` : 'Memuat…'} di Dusun Karangasem & Blongkeng.
        </p>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border px-3 py-2">
            <MagnifyingGlass size={18} className="text-muted" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama usaha atau pemilik…"
              className="w-full text-sm text-bark outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelSimple size={18} className="text-muted" />
            <select
              value={dusun}
              onChange={(e) => setDusun(e.target.value)}
              className="cursor-pointer rounded-xl border border-border bg-sand/40 px-3 py-2 text-sm text-bark"
            >
              {DUSUN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="cursor-pointer rounded-xl border border-border bg-sand/40 px-3 py-2 text-sm text-bark"
            >
              {KATEGORI_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <p className="text-sm text-muted">Memuat katalog UMKM…</p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-moss/30 py-16 text-center">
              <Storefront size={36} className="text-primary/40" />
              <p className="text-bark/75">Tidak ada UMKM yang cocok dengan filter ini.</p>
              <p className="text-sm text-muted">
                Pendaftaran UMKM baru dikoordinasikan oleh pengurus/perangkat desa.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((umkm) => (
                <UmkmCard key={umkm.id} umkm={umkm} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  )
}
