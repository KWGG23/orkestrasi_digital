import { useState } from 'react'
import { ArrowDown, ArrowUp, MagnifyingGlass, Warning } from '@phosphor-icons/react'
import AdminLayout from '../../components/layout/AdminLayout.jsx'
import { useNasabahSearch } from '../../hooks/useNasabah.js'
import { useTabunganRiwayat, useTarikTabungan } from '../../hooks/useTabungan.js'

const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const dateFormat = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' })

export default function AdminTabunganPage() {
  const [q, setQ] = useState('')
  const [nasabahId, setNasabahId] = useState(null)
  const [jumlah, setJumlah] = useState('')
  const [keterangan, setKeterangan] = useState('')
  const [tarikError, setTarikError] = useState(null)
  const [tarikSuccess, setTarikSuccess] = useState(false)

  const { data: results, isFetching } = useNasabahSearch(q)
  const { data: riwayat, isLoading } = useTabunganRiwayat(nasabahId)
  const tarik = useTarikTabungan()

  function selectNasabah(id) {
    setNasabahId(id)
    setQ('')
    setTarikSuccess(false)
    setTarikError(null)
  }

  async function handleTarik(e) {
    e.preventDefault()
    setTarikError(null)
    setTarikSuccess(false)

    if (!Number(jumlah) || Number(jumlah) < 1000) {
      setTarikError('Jumlah penarikan minimal Rp 1.000.')
      return
    }

    try {
      await tarik.mutateAsync({ id_nasabah: nasabahId, jumlah: Number(jumlah), keterangan: keterangan || undefined })
      setJumlah('')
      setKeterangan('')
      setTarikSuccess(true)
    } catch (err) {
      setTarikError(err.message ?? 'Gagal memproses penarikan.')
    }
  }

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl font-semibold text-primary-dark">Tabungan</h1>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 sm:max-w-md">
        <MagnifyingGlass size={16} className="text-muted" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari nama atau no. anggota"
          className="w-full text-sm text-bark outline-none"
        />
      </div>

      {q.trim().length >= 2 && (
        <div className="mt-2 divide-y divide-border rounded-xl border border-border bg-white sm:max-w-md">
          {isFetching ? (
            <p className="p-3 text-sm text-muted">Mencari…</p>
          ) : results?.length ? (
            results.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => selectNasabah(n.id)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-moss/50"
              >
                <span className="font-medium text-bark">{n.nama}</span>
                <span className="text-muted">{n.no_anggota}</span>
              </button>
            ))
          ) : (
            <p className="p-3 text-sm text-muted">Tidak ditemukan.</p>
          )}
        </div>
      )}

      {nasabahId && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <section className="rounded-2xl border border-border bg-white p-5">
            {isLoading ? (
              <p className="text-sm text-muted">Memuat…</p>
            ) : riwayat ? (
              <>
                <p className="text-sm text-muted">No. Anggota {riwayat.nasabah.no_anggota}</p>
                <h2 className="font-heading text-lg font-semibold text-primary-dark">{riwayat.nasabah.nama}</h2>

                <div className="mt-4 rounded-2xl bg-primary-dark px-5 py-4 text-white">
                  <p className="text-xs text-white/70">Saldo tabungan</p>
                  <p className="font-heading text-2xl font-semibold">
                    {currency.format(Number(riwayat.nasabah.saldo_tabungan))}
                  </p>
                </div>

                <form onSubmit={handleTarik} className="mt-5 space-y-2">
                  <h3 className="text-sm font-semibold text-bark">Tarik tabungan</h3>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    placeholder="Jumlah (Rp)"
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <input
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder="Keterangan (opsional)"
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />

                  {tarikError && (
                    <p className="flex items-center gap-1.5 text-sm text-clay">
                      <Warning size={14} />
                      {tarikError}
                    </p>
                  )}
                  {tarikSuccess && <p className="text-sm text-primary">Penarikan berhasil dicatat.</p>}

                  <button
                    type="submit"
                    disabled={tarik.isPending}
                    className="w-full cursor-pointer rounded-full bg-clay px-4 py-2 text-sm font-semibold text-white hover:bg-clay/90 disabled:opacity-60"
                  >
                    {tarik.isPending ? 'Memproses…' : 'Proses Penarikan'}
                  </button>
                </form>
              </>
            ) : null}
          </section>

          <section className="rounded-2xl border border-border bg-white p-5">
            <h2 className="font-heading text-base font-semibold text-primary-dark">Riwayat Transaksi</h2>
            {riwayat?.transaksi?.length ? (
              <ul className="mt-3 space-y-2">
                {riwayat.transaksi.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between rounded-xl bg-sand/40 px-4 py-3 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      {t.jenis === 'masuk' ? (
                        <ArrowDown size={16} className="text-primary" />
                      ) : (
                        <ArrowUp size={16} className="text-clay" />
                      )}
                      <span>
                        <span className="block text-bark">{t.keterangan || (t.jenis === 'masuk' ? 'Setoran' : 'Penarikan')}</span>
                        <span className="block text-xs text-muted">{dateFormat.format(new Date(t.tanggal))}</span>
                      </span>
                    </span>
                    <span className={`font-semibold ${t.jenis === 'masuk' ? 'text-primary-dark' : 'text-clay'}`}>
                      {t.jenis === 'masuk' ? '+' : '-'}
                      {currency.format(Number(t.jumlah))}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted">Belum ada transaksi tercatat.</p>
            )}
          </section>
        </div>
      )}
    </AdminLayout>
  )
}
