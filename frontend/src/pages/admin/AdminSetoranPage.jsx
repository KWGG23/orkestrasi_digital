import { useMemo, useState } from 'react'
import { CheckCircle, DownloadSimple, MagnifyingGlass, Plus, Trash, Warning } from '@phosphor-icons/react'
import AdminLayout from '../../components/layout/AdminLayout.jsx'
import { useNasabahSearch } from '../../hooks/useNasabah.js'
import { useJenisSampah } from '../../hooks/useJenisSampah.js'
import { useCreateNasabah, useCreateSetoran } from '../../hooks/useSetoran.js'
import { API_BASE_URL } from '../../lib/api.js'

const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const METODE_OPTIONS = [
  { value: 'tunai', label: 'Tunai' },
  { value: 'tabung', label: 'Ditabung' },
  { value: 'tukar_barang', label: 'Tukar barang' },
]

function emptyItem() {
  return { key: crypto.randomUUID(), id_jenis_sampah: '', berat_kg: '' }
}

export default function AdminSetoranPage() {
  const [q, setQ] = useState('')
  const [nasabah, setNasabah] = useState(null)
  const [showNasabahForm, setShowNasabahForm] = useState(false)
  const [nasabahForm, setNasabahForm] = useState({ nama: '', no_anggota: '', alamat: '', rt: '', rw: '', no_hp: '' })
  const [nasabahError, setNasabahError] = useState(null)

  const [items, setItems] = useState([emptyItem()])
  const [metode, setMetode] = useState('tunai')
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().slice(0, 10))
  const [catatan, setCatatan] = useState('')
  const [submitError, setSubmitError] = useState(null)
  const [result, setResult] = useState(null)

  const { data: results, isFetching } = useNasabahSearch(q)
  const { data: jenisSampah } = useJenisSampah()
  const createNasabah = useCreateNasabah()
  const createSetoran = useCreateSetoran()

  const jenisById = useMemo(() => {
    const map = new Map()
    for (const j of jenisSampah ?? []) map.set(String(j.id), j)
    return map
  }, [jenisSampah])

  const total = items.reduce((sum, item) => {
    const jenis = jenisById.get(String(item.id_jenis_sampah))
    const berat = Number(item.berat_kg) || 0
    return sum + (jenis ? berat * Number(jenis.harga_per_satuan) : 0)
  }, 0)

  function updateItem(key, patch) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)))
  }

  function removeItem(key) {
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.key !== key) : prev))
  }

  async function handleCreateNasabah(e) {
    e.preventDefault()
    setNasabahError(null)
    try {
      const created = await createNasabah.mutateAsync(nasabahForm)
      setNasabah(created)
      setShowNasabahForm(false)
      setQ('')
    } catch (err) {
      setNasabahError(err.message ?? 'Gagal menambah nasabah.')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError(null)

    const validItems = items.filter((it) => it.id_jenis_sampah && Number(it.berat_kg) > 0)
    if (!nasabah || validItems.length === 0) {
      setSubmitError('Pilih nasabah dan isi minimal satu jenis sampah dengan berat > 0.')
      return
    }

    try {
      const setoran = await createSetoran.mutateAsync({
        id_nasabah: nasabah.id,
        tanggal,
        metode,
        catatan: catatan || undefined,
        items: validItems.map((it) => ({ id_jenis_sampah: it.id_jenis_sampah, berat_kg: Number(it.berat_kg) })),
      })
      setResult(setoran)
      setNasabah(null)
      setItems([emptyItem()])
      setCatatan('')
    } catch (err) {
      setSubmitError(err.message ?? 'Gagal menyimpan setoran.')
    }
  }

  if (result) {
    return (
      <AdminLayout>
        <div className="mx-auto max-w-lg rounded-3xl border border-border bg-white p-8 text-center">
          <CheckCircle size={40} weight="fill" className="mx-auto text-primary" />
          <h1 className="mt-4 font-heading text-xl font-semibold text-primary-dark">Setoran tersimpan</h1>
          <p className="mt-1 text-sm text-muted">
            Nota {result.no_nota} &middot; {currency.format(Number(result.total_harga))}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={`${API_BASE_URL}/setoran/${result.id}/pdf`}
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark"
            >
              <DownloadSimple size={16} />
              Unduh Nota PDF
            </a>
            <button
              type="button"
              onClick={() => setResult(null)}
              className="cursor-pointer rounded-full border border-border px-5 py-2.5 text-sm font-medium text-bark hover:border-primary"
            >
              Input Setoran Lain
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl font-semibold text-primary-dark">Setoran Baru</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="rounded-2xl border border-border bg-white p-5">
          <h2 className="font-heading text-base font-semibold text-primary-dark">1. Nasabah</h2>

          {nasabah ? (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-moss/60 px-4 py-3">
              <div>
                <p className="font-medium text-bark">{nasabah.nama}</p>
                <p className="text-sm text-muted">{nasabah.no_anggota}</p>
              </div>
              <button
                type="button"
                onClick={() => setNasabah(null)}
                className="cursor-pointer text-sm font-medium text-clay hover:underline"
              >
                Ganti
              </button>
            </div>
          ) : (
            <>
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5">
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
                <div className="mt-2 divide-y divide-border rounded-xl border border-border">
                  {isFetching ? (
                    <p className="p-3 text-sm text-muted">Mencari…</p>
                  ) : results?.length ? (
                    results.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => setNasabah(n)}
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

              <button
                type="button"
                onClick={() => setShowNasabahForm((v) => !v)}
                className="mt-3 flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <Plus size={14} />
                Nasabah baru belum terdaftar
              </button>

              {showNasabahForm && (
                <form onSubmit={handleCreateNasabah} className="mt-3 space-y-2 rounded-xl border border-border p-4">
                  <input
                    required
                    placeholder="Nama"
                    value={nasabahForm.nama}
                    onChange={(e) => setNasabahForm((f) => ({ ...f, nama: e.target.value }))}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <input
                    required
                    placeholder="No. Anggota (mis. KRA-010)"
                    value={nasabahForm.no_anggota}
                    onChange={(e) => setNasabahForm((f) => ({ ...f, no_anggota: e.target.value }))}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="RT"
                      value={nasabahForm.rt}
                      onChange={(e) => setNasabahForm((f) => ({ ...f, rt: e.target.value }))}
                      className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    <input
                      placeholder="RW"
                      value={nasabahForm.rw}
                      onChange={(e) => setNasabahForm((f) => ({ ...f, rw: e.target.value }))}
                      className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <input
                    placeholder="Alamat"
                    value={nasabahForm.alamat}
                    onChange={(e) => setNasabahForm((f) => ({ ...f, alamat: e.target.value }))}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <input
                    placeholder="No. HP"
                    value={nasabahForm.no_hp}
                    onChange={(e) => setNasabahForm((f) => ({ ...f, no_hp: e.target.value }))}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />

                  {nasabahError && (
                    <p className="flex items-center gap-1.5 text-sm text-clay">
                      <Warning size={14} />
                      {nasabahError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={createNasabah.isPending}
                    className="w-full cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
                  >
                    {createNasabah.isPending ? 'Menyimpan…' : 'Simpan Nasabah'}
                  </button>
                </form>
              )}
            </>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-white p-5">
          <h2 className="font-heading text-base font-semibold text-primary-dark">2. Jenis Sampah & Berat</h2>

          <div className="mt-3 space-y-3">
            {items.map((item) => {
              const jenis = jenisById.get(String(item.id_jenis_sampah))
              const subtotal = jenis ? (Number(item.berat_kg) || 0) * Number(jenis.harga_per_satuan) : 0
              return (
                <div key={item.key} className="flex items-center gap-2">
                  <select
                    value={item.id_jenis_sampah}
                    onChange={(e) => updateItem(item.key, { id_jenis_sampah: e.target.value })}
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Pilih jenis sampah</option>
                    {(jenisSampah ?? []).map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.nama} ({currency.format(Number(j.harga_per_satuan))}/{j.satuan})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0.001"
                    step="0.001"
                    placeholder={jenis?.satuan ?? 'jumlah'}
                    value={item.berat_kg}
                    onChange={(e) => updateItem(item.key, { berat_kg: e.target.value })}
                    className="w-24 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <span className="w-24 shrink-0 text-right text-sm font-medium text-bark">
                    {currency.format(subtotal)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="cursor-pointer text-muted hover:text-clay"
                    aria-label="Hapus baris"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => setItems((prev) => [...prev, emptyItem()])}
            className="mt-3 flex cursor-pointer items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <Plus size={14} />
            Tambah baris
          </button>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <span className="font-medium text-bark">Total</span>
            <span className="font-heading text-lg font-semibold text-primary-dark">{currency.format(total)}</span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted">Metode</label>
              <select
                value={metode}
                onChange={(e) => setMetode(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {METODE_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted">Tanggal</label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Catatan (opsional)"
            rows={2}
            className="mt-3 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />

          {submitError && (
            <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-clay/10 px-3 py-2 text-sm text-clay">
              <Warning size={16} />
              {submitError}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={createSetoran.isPending}
            className="mt-4 w-full cursor-pointer rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createSetoran.isPending ? 'Menyimpan…' : 'Simpan Setoran'}
          </button>
        </section>
      </div>
    </AdminLayout>
  )
}
