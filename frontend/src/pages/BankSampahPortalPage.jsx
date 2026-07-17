import { useState } from 'react'
import { CheckCircle, MagnifyingGlass, Wallet } from '@phosphor-icons/react'
import PortalLayout from '../components/layout/PortalLayout.jsx'
import { useNasabahDetail, useNasabahSearch } from '../hooks/useNasabah.js'
import Seo from '../components/Seo.jsx'

const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const dateFormat = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' })

export default function BankSampahPortalPage() {
  const [q, setQ] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const { data: results, isFetching } = useNasabahSearch(q)
  const { data: detail, isLoading: loadingDetail } = useNasabahDetail(selectedId)

  return (
    <PortalLayout crumbs={[{ label: 'Bank Sampah' }]}>
      <Seo
        title="Cek Saldo & Riwayat Tabungan"
        description="Cek saldo tabungan dan riwayat setoran sampah untuk nasabah Bank Sampah Digital Dusun Karangasem, cukup dengan nama atau nomor anggota."
      />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-moss px-4 py-1.5 text-sm font-medium text-primary-dark">
          <Wallet size={18} weight="bold" />
          Khusus Dusun Karangasem
        </span>
        <h1 className="mt-4 font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
          Cek Saldo & Riwayat Tabungan
        </h1>
        <p className="mt-2 text-bark/75">
          Cari memakai nama atau nomor anggota untuk melihat saldo tabungan dan riwayat setoran.
          Pencatatan setoran baru dilakukan oleh pengurus di lokasi penimbangan.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-3">
          <MagnifyingGlass size={18} className="text-muted" />
          <input
            type="text"
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setSelectedId(null)
            }}
            placeholder="Nama atau nomor anggota (mis. KRA-001)"
            className="w-full text-sm text-bark outline-none"
          />
        </div>

        {q.trim().length >= 2 && !selectedId && (
          <div className="mt-3 divide-y divide-border rounded-xl border border-border bg-white">
            {isFetching ? (
              <p className="p-4 text-sm text-muted">Mencari…</p>
            ) : results?.length ? (
              results.map((nasabah) => (
                <button
                  key={nasabah.id}
                  type="button"
                  onClick={() => setSelectedId(nasabah.id)}
                  className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm hover:bg-moss/50"
                >
                  <span className="font-medium text-bark">{nasabah.nama}</span>
                  <span className="text-muted">{nasabah.no_anggota}</span>
                </button>
              ))
            ) : (
              <p className="p-4 text-sm text-muted">Tidak ditemukan nasabah dengan kata kunci ini.</p>
            )}
          </div>
        )}

        {selectedId && (
          <div className="mt-6 rounded-3xl border border-border bg-white p-6 sm:p-8">
            {loadingDetail ? (
              <p className="text-sm text-muted">Memuat data…</p>
            ) : detail ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-primary-dark">
                      {detail.nama}
                    </h2>
                    <p className="text-sm text-muted">No. Anggota {detail.no_anggota}</p>
                  </div>
                  <CheckCircle size={28} weight="fill" className="text-primary" />
                </div>

                <div className="mt-5 rounded-2xl bg-primary-dark px-5 py-4 text-white">
                  <p className="text-xs text-white/70">Saldo tabungan</p>
                  <p className="font-heading text-3xl font-semibold">
                    {currency.format(Number(detail.saldo_tabungan))}
                  </p>
                </div>

                <h3 className="mt-6 font-heading text-base font-semibold text-primary-dark">
                  Riwayat setoran terakhir
                </h3>
                {detail.setorans?.length ? (
                  <ul className="mt-3 space-y-2">
                    {detail.setorans.map((setoran) => (
                      <li
                        key={setoran.id}
                        className="flex items-center justify-between rounded-xl bg-sand/40 px-4 py-3 text-sm"
                      >
                        <span className="text-bark">
                          {setoran.no_nota} &middot; {dateFormat.format(new Date(setoran.tanggal))}
                        </span>
                        <span className="font-semibold text-primary-dark">
                          {currency.format(Number(setoran.total_harga))}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-muted">Belum ada riwayat setoran tercatat.</p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted">Data tidak ditemukan.</p>
            )}
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
