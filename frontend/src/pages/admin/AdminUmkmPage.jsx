import { useState } from 'react'
import { PencilSimple, Plus, Storefront, Trash, Warning, X } from '@phosphor-icons/react'
import AdminLayout from '../../components/layout/AdminLayout.jsx'
import { useUmkmList } from '../../hooks/useUmkmList.js'
import { useCreateUmkm, useDeleteUmkm, useUpdateUmkm } from '../../hooks/useUmkmAdmin.js'
import { storageUrl } from '../../lib/api.js'

const DUSUN_OPTIONS = [
  { value: 'karangasem', label: 'Karangasem' },
  { value: 'blongkeng', label: 'Blongkeng' },
]

const KATEGORI_OPTIONS = [
  { value: 'kuliner', label: 'Kuliner' },
  { value: 'kerajinan', label: 'Kerajinan' },
  { value: 'pertanian', label: 'Pertanian' },
  { value: 'jasa', label: 'Jasa' },
  { value: 'perdagangan', label: 'Perdagangan' },
]

function emptyForm() {
  return {
    nama_usaha: '',
    nama_pemilik: '',
    dusun: 'karangasem',
    kategori: 'kuliner',
    deskripsi: '',
    produk_utama: '',
    kisaran_harga: '',
    no_wa: '',
    instagram: '',
    jam_buka: '',
    hari_buka: '',
    metode_bayar: '',
    platform_online: '',
    punya_nib: false,
    lat: '',
    lng: '',
  }
}

function formFromUmkm(umkm) {
  return {
    nama_usaha: umkm.nama_usaha ?? '',
    nama_pemilik: umkm.nama_pemilik ?? '',
    dusun: umkm.dusun ?? 'karangasem',
    kategori: umkm.kategori ?? 'kuliner',
    deskripsi: umkm.deskripsi ?? '',
    produk_utama: (umkm.produk_utama ?? []).join(', '),
    kisaran_harga: umkm.kisaran_harga ?? '',
    no_wa: umkm.no_wa ?? '',
    instagram: umkm.instagram ?? '',
    jam_buka: umkm.jam_buka ?? '',
    hari_buka: umkm.hari_buka ?? '',
    metode_bayar: (umkm.metode_bayar ?? []).join(', '),
    platform_online: (umkm.platform_online ?? []).join(', '),
    punya_nib: Boolean(umkm.punya_nib),
    lat: umkm.lat ?? '',
    lng: umkm.lng ?? '',
  }
}

function toFormData(form, fotoFile) {
  const fd = new FormData()
  const scalarFields = [
    'nama_usaha', 'nama_pemilik', 'dusun', 'kategori', 'deskripsi',
    'kisaran_harga', 'no_wa', 'instagram', 'jam_buka', 'hari_buka', 'lat', 'lng',
  ]
  for (const field of scalarFields) {
    if (form[field] !== '' && form[field] !== undefined && form[field] !== null) {
      fd.append(field, form[field])
    }
  }
  fd.append('punya_nib', form.punya_nib ? '1' : '0')

  for (const item of form.produk_utama.split(',').map((s) => s.trim()).filter(Boolean)) {
    fd.append('produk_utama[]', item)
  }
  for (const item of form.metode_bayar.split(',').map((s) => s.trim()).filter(Boolean)) {
    fd.append('metode_bayar[]', item)
  }
  for (const item of form.platform_online.split(',').map((s) => s.trim()).filter(Boolean)) {
    fd.append('platform_online[]', item)
  }
  if (fotoFile) fd.append('foto_usaha', fotoFile)

  return fd
}

export default function AdminUmkmPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [fotoFile, setFotoFile] = useState(null)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const { data, isLoading } = useUmkmList({})
  const items = data?.items ?? []

  const createUmkm = useCreateUmkm()
  const updateUmkm = useUpdateUmkm()
  const deleteUmkm = useDeleteUmkm()

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm())
    setFotoFile(null)
    setError(null)
    setShowForm(true)
  }

  function openEdit(umkm) {
    setEditingId(umkm.id)
    setForm(formFromUmkm(umkm))
    setFotoFile(null)
    setError(null)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.nama_usaha || !form.nama_pemilik) {
      setError('Nama usaha dan nama pemilik wajib diisi.')
      return
    }

    try {
      const formData = toFormData(form, fotoFile)
      if (editingId) {
        await updateUmkm.mutateAsync({ id: editingId, formData })
      } else {
        await createUmkm.mutateAsync(formData)
      }
      setShowForm(false)
    } catch (err) {
      setError(err.message ?? 'Gagal menyimpan UMKM.')
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await deleteUmkm.mutateAsync(id)
    } catch (err) {
      setError(err.message ?? 'Gagal menghapus UMKM.')
    } finally {
      setDeletingId(null)
    }
  }

  const saving = createUmkm.isPending || updateUmkm.isPending

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-primary-dark">UMKM</h1>
        <button
          type="button"
          onClick={openCreate}
          className="flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Plus size={16} />
          Tambah UMKM
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-border bg-white p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold text-primary-dark">
              {editingId ? 'Edit UMKM' : 'UMKM Baru'}
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="cursor-pointer text-muted hover:text-clay"
              aria-label="Tutup form"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              required
              placeholder="Nama usaha"
              value={form.nama_usaha}
              onChange={(e) => setForm((f) => ({ ...f, nama_usaha: e.target.value }))}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              required
              placeholder="Nama pemilik"
              value={form.nama_pemilik}
              onChange={(e) => setForm((f) => ({ ...f, nama_pemilik: e.target.value }))}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />

            <select
              value={form.dusun}
              onChange={(e) => setForm((f) => ({ ...f, dusun: e.target.value }))}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {DUSUN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <select
              value={form.kategori}
              onChange={(e) => setForm((f) => ({ ...f, kategori: e.target.value }))}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {KATEGORI_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <textarea
              placeholder="Deskripsi"
              value={form.deskripsi}
              onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))}
              rows={2}
              className="sm:col-span-2 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />

            <input
              placeholder="Produk utama (pisahkan koma)"
              value={form.produk_utama}
              onChange={(e) => setForm((f) => ({ ...f, produk_utama: e.target.value }))}
              className="sm:col-span-2 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />

            <input
              placeholder="Kisaran harga (mis. Rp 10.000 - Rp 50.000)"
              value={form.kisaran_harga}
              onChange={(e) => setForm((f) => ({ ...f, kisaran_harga: e.target.value }))}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              placeholder="No. WhatsApp"
              value={form.no_wa}
              onChange={(e) => setForm((f) => ({ ...f, no_wa: e.target.value }))}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />

            <input
              placeholder="Instagram"
              value={form.instagram}
              onChange={(e) => setForm((f) => ({ ...f, instagram: e.target.value }))}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              placeholder="Jam buka (mis. 08:00 - 17:00)"
              value={form.jam_buka}
              onChange={(e) => setForm((f) => ({ ...f, jam_buka: e.target.value }))}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />

            <input
              placeholder="Hari buka (mis. Senin - Sabtu)"
              value={form.hari_buka}
              onChange={(e) => setForm((f) => ({ ...f, hari_buka: e.target.value }))}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              placeholder="Metode bayar (pisahkan koma)"
              value={form.metode_bayar}
              onChange={(e) => setForm((f) => ({ ...f, metode_bayar: e.target.value }))}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />

            <input
              placeholder="Platform online (pisahkan koma)"
              value={form.platform_online}
              onChange={(e) => setForm((f) => ({ ...f, platform_online: e.target.value }))}
              className="sm:col-span-2 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />

            <input
              type="number"
              step="any"
              placeholder="Latitude (opsional)"
              value={form.lat}
              onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude (opsional)"
              value={form.lng}
              onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />

            <label className="flex items-center gap-2 text-sm text-bark">
              <input
                type="checkbox"
                checked={form.punya_nib}
                onChange={(e) => setForm((f) => ({ ...f, punya_nib: e.target.checked }))}
              />
              Punya NIB
            </label>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted">Foto usaha (opsional)</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setFotoFile(e.target.files?.[0] ?? null)}
                className="mt-1 w-full text-sm"
              />
            </div>
          </div>

          {error && (
            <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-clay/10 px-3 py-2 text-sm text-clay">
              <Warning size={16} />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-4 w-full cursor-pointer rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {saving ? 'Menyimpan…' : 'Simpan UMKM'}
          </button>
        </form>
      )}

      <div className="mt-6 rounded-2xl border border-border bg-white">
        {isLoading ? (
          <p className="p-5 text-sm text-muted">Memuat…</p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <Storefront size={28} className="text-primary/40" />
            <p className="text-sm text-muted">Belum ada UMKM terdaftar.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((umkm) => (
              <li key={umkm.id} className="flex items-center gap-4 p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-moss">
                  {umkm.foto_usaha ? (
                    <img src={storageUrl(umkm.foto_usaha)} alt={umkm.nama_usaha} className="h-full w-full object-cover" />
                  ) : (
                    <Storefront size={22} className="text-primary/50" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-bark">{umkm.nama_usaha}</p>
                  <p className="truncate text-sm text-muted">
                    {umkm.nama_pemilik} &middot; {umkm.dusun} &middot; {umkm.kategori}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openEdit(umkm)}
                  className="cursor-pointer rounded-full p-2 text-muted hover:bg-moss hover:text-primary-dark"
                  aria-label="Edit"
                >
                  <PencilSimple size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(umkm.id)}
                  disabled={deletingId === umkm.id}
                  className="cursor-pointer rounded-full p-2 text-muted hover:bg-clay/10 hover:text-clay disabled:opacity-50"
                  aria-label="Hapus"
                >
                  <Trash size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminLayout>
  )
}
