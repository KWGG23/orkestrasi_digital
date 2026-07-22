import { useState } from 'react'
import { Plus, Recycle, Warning, X } from '@phosphor-icons/react'
import AdminLayout from '../../components/layout/AdminLayout.jsx'
import { useJenisSampah } from '../../hooks/useJenisSampah.js'
import { useCreateJenisSampah, useUpdateJenisSampah } from '../../hooks/useJenisSampahAdmin.js'

const SATUAN_OPTIONS = [
  { value: 'kg', label: 'kg' },
  { value: 'pcs', label: 'pcs' },
]

function JenisSampahRow({ jenis }) {
  const [nama, setNama] = useState(jenis.nama)
  const [kategori, setKategori] = useState(jenis.kategori)
  const [satuan, setSatuan] = useState(jenis.satuan)
  const [harga, setHarga] = useState(jenis.harga_per_satuan)
  const [aktif, setAktif] = useState(Boolean(jenis.aktif))
  const [error, setError] = useState(null)
  const updateJenis = useUpdateJenisSampah()

  const dirty =
    nama !== jenis.nama ||
    kategori !== jenis.kategori ||
    satuan !== jenis.satuan ||
    Number(harga) !== Number(jenis.harga_per_satuan) ||
    aktif !== Boolean(jenis.aktif)

  async function handleSave() {
    setError(null)
    try {
      await updateJenis.mutateAsync({ id: jenis.id, nama, kategori, satuan, harga_per_satuan: harga, aktif })
    } catch (err) {
      setError(err.message ?? 'Gagal menyimpan perubahan.')
    }
  }

  return (
    <li className="flex flex-col gap-2 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
      <input
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        className="min-w-0 flex-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-bark outline-none focus:border-primary sm:basis-40"
      />
      <input
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
        className="w-32 rounded-lg border border-border px-3 py-1.5 text-sm text-muted outline-none focus:border-primary"
      />
      <select
        value={satuan}
        onChange={(e) => setSatuan(e.target.value)}
        className="rounded-lg border border-border px-3 py-1.5 text-sm outline-none focus:border-primary"
      >
        {SATUAN_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted">Rp</span>
        <input
          type="number"
          min="0"
          step="any"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
          className="w-28 rounded-lg border border-border px-3 py-1.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-bark">
        <input type="checkbox" checked={aktif} onChange={(e) => setAktif(e.target.checked)} />
        Aktif
      </label>

      <button
        type="button"
        onClick={handleSave}
        disabled={!dirty || updateJenis.isPending}
        className="cursor-pointer rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {updateJenis.isPending ? 'Menyimpan…' : 'Simpan'}
      </button>

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-clay sm:basis-full">
          <Warning size={14} />
          {error}
        </p>
      )}
    </li>
  )
}

function emptyForm() {
  return { nama: '', kategori: '', satuan: 'kg', harga_per_satuan: '' }
}

function TambahJenisSampahForm({ onClose }) {
  const [form, setForm] = useState(emptyForm())
  const [error, setError] = useState(null)
  const createJenis = useCreateJenisSampah()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.nama || !form.kategori || form.harga_per_satuan === '') {
      setError('Nama, kategori, dan harga wajib diisi.')
      return
    }

    try {
      await createJenis.mutateAsync(form)
      onClose()
    } catch (err) {
      setError(err.message ?? 'Gagal menambah jenis sampah.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-primary-dark">Jenis Sampah Baru</h2>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer text-muted hover:text-clay"
          aria-label="Tutup form"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          required
          placeholder="Nama (mis. Kardus)"
          value={form.nama}
          onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
          className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <input
          required
          placeholder="Kategori (mis. Kertas)"
          value={form.kategori}
          onChange={(e) => setForm((f) => ({ ...f, kategori: e.target.value }))}
          className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <select
          value={form.satuan}
          onChange={(e) => setForm((f) => ({ ...f, satuan: e.target.value }))}
          className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
        >
          {SATUAN_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <input
          required
          type="number"
          min="0"
          step="any"
          placeholder="Harga per satuan"
          value={form.harga_per_satuan}
          onChange={(e) => setForm((f) => ({ ...f, harga_per_satuan: e.target.value }))}
          className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      {error && (
        <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-clay/10 px-3 py-2 text-sm text-clay">
          <Warning size={16} />
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={createJenis.isPending}
        className="mt-4 w-full cursor-pointer rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {createJenis.isPending ? 'Menyimpan…' : 'Simpan Jenis Sampah'}
      </button>
    </form>
  )
}

export default function AdminJenisSampahPage() {
  const { data: jenisList, isLoading } = useJenisSampah()
  const [showForm, setShowForm] = useState(false)

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-primary-dark">Harga Jenis Sampah</h1>
          <p className="mt-1 text-sm text-muted">
            Kelola jenis sampah dan harganya sesuai update dari BSI. Belum ada API harga otomatis dari BSI
            pusat, jadi tambah/ubah jenis sampah dilakukan manual di sini.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Plus size={16} />
          Tambah Jenis Sampah
        </button>
      </div>

      {showForm && <TambahJenisSampahForm onClose={() => setShowForm(false)} />}

      <div className="mt-6 rounded-2xl border border-border bg-white">
        {isLoading ? (
          <p className="p-5 text-sm text-muted">Memuat…</p>
        ) : !jenisList || jenisList.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <Recycle size={28} className="text-primary/40" />
            <p className="text-sm text-muted">Belum ada data jenis sampah.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {jenisList.map((jenis) => (
              <JenisSampahRow key={jenis.id} jenis={jenis} />
            ))}
          </ul>
        )}
      </div>
    </AdminLayout>
  )
}
