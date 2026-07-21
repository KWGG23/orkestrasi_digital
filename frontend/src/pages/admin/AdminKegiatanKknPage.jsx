import { useState } from 'react'
import { CalendarBlank, PencilSimple, Plus, Trash, Warning, X } from '@phosphor-icons/react'
import AdminLayout from '../../components/layout/AdminLayout.jsx'
import { useKegiatanKknList } from '../../hooks/useKegiatanKknList.js'
import { useCreateKegiatanKkn, useDeleteKegiatanKkn, useUpdateKegiatanKkn } from '../../hooks/useKegiatanKknAdmin.js'
import { storageUrl } from '../../lib/api.js'

const DUSUN_OPTIONS = [
  { value: 'karangasem', label: 'Karangasem' },
  { value: 'blongkeng', label: 'Blongkeng' },
]

function emptyForm() {
  return {
    tahun: new Date().getFullYear(),
    dusun: 'karangasem',
    nama_kelompok: '',
    judul: '',
    deskripsi: '',
  }
}

function formFromKegiatan(kegiatan) {
  return {
    tahun: kegiatan.tahun,
    dusun: kegiatan.dusun,
    nama_kelompok: kegiatan.nama_kelompok ?? '',
    judul: kegiatan.judul ?? '',
    deskripsi: kegiatan.deskripsi ?? '',
  }
}

function toFormData(form, fotoFiles) {
  const fd = new FormData()
  fd.append('tahun', form.tahun)
  fd.append('dusun', form.dusun)
  fd.append('nama_kelompok', form.nama_kelompok)
  fd.append('judul', form.judul)
  if (form.deskripsi) fd.append('deskripsi', form.deskripsi)
  for (const file of fotoFiles) fd.append('foto[]', file)

  return fd
}

export default function AdminKegiatanKknPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [fotoFiles, setFotoFiles] = useState([])
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const { data, isLoading } = useKegiatanKknList()
  const items = data ?? []

  const createKegiatan = useCreateKegiatanKkn()
  const updateKegiatan = useUpdateKegiatanKkn()
  const deleteKegiatan = useDeleteKegiatanKkn()

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm())
    setFotoFiles([])
    setError(null)
    setShowForm(true)
  }

  function openEdit(kegiatan) {
    setEditingId(kegiatan.id)
    setForm(formFromKegiatan(kegiatan))
    setFotoFiles([])
    setError(null)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.nama_kelompok || !form.judul) {
      setError('Nama kelompok dan judul wajib diisi.')
      return
    }

    try {
      const formData = toFormData(form, fotoFiles)
      if (editingId) {
        await updateKegiatan.mutateAsync({ id: editingId, formData })
      } else {
        await createKegiatan.mutateAsync(formData)
      }
      setShowForm(false)
    } catch (err) {
      setError(err.message ?? 'Gagal menyimpan dokumentasi kegiatan KKN.')
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await deleteKegiatan.mutateAsync(id)
    } catch (err) {
      setError(err.message ?? 'Gagal menghapus dokumentasi kegiatan KKN.')
    } finally {
      setDeletingId(null)
    }
  }

  const saving = createKegiatan.isPending || updateKegiatan.isPending

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-primary-dark">Kegiatan KKN</h1>
        <button
          type="button"
          onClick={openCreate}
          className="flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Plus size={16} />
          Tambah Dokumentasi
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-border bg-white p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold text-primary-dark">
              {editingId ? 'Edit Dokumentasi' : 'Dokumentasi Baru'}
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
              type="number"
              placeholder="Tahun"
              value={form.tahun}
              onChange={(e) => setForm((f) => ({ ...f, tahun: e.target.value }))}
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

            <input
              required
              placeholder="Nama kelompok KKN"
              value={form.nama_kelompok}
              onChange={(e) => setForm((f) => ({ ...f, nama_kelompok: e.target.value }))}
              className="sm:col-span-2 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />

            <input
              required
              placeholder="Judul dokumentasi"
              value={form.judul}
              onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value }))}
              className="sm:col-span-2 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />

            <textarea
              placeholder="Deskripsi kegiatan"
              value={form.deskripsi}
              onChange={(e) => setForm((f) => ({ ...f, deskripsi: e.target.value }))}
              rows={3}
              className="sm:col-span-2 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted">
                Foto dokumentasi (opsional, maks 10 foto)
              </label>
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setFotoFiles(Array.from(e.target.files ?? []))}
                className="mt-1 w-full text-sm"
              />
              {editingId && (
                <p className="mt-1 text-xs text-muted">
                  Upload foto baru akan mengganti semua foto lama untuk dokumentasi ini.
                </p>
              )}
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
            {saving ? 'Menyimpan…' : 'Simpan Dokumentasi'}
          </button>
        </form>
      )}

      <div className="mt-6 rounded-2xl border border-border bg-white">
        {isLoading ? (
          <p className="p-5 text-sm text-muted">Memuat…</p>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <CalendarBlank size={28} className="text-primary/40" />
            <p className="text-sm text-muted">Belum ada dokumentasi kegiatan KKN.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((kegiatan) => (
              <li key={kegiatan.id} className="flex items-center gap-4 p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-moss">
                  {kegiatan.foto?.[0] ? (
                    <img src={storageUrl(kegiatan.foto[0])} alt={kegiatan.judul} className="h-full w-full object-cover" />
                  ) : (
                    <CalendarBlank size={22} className="text-primary/50" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-bark">{kegiatan.judul}</p>
                  <p className="truncate text-sm text-muted">
                    {kegiatan.tahun} &middot; {kegiatan.dusun} &middot; {kegiatan.nama_kelompok}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openEdit(kegiatan)}
                  className="cursor-pointer rounded-full p-2 text-muted hover:bg-moss hover:text-primary-dark"
                  aria-label="Edit"
                >
                  <PencilSimple size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(kegiatan.id)}
                  disabled={deletingId === kegiatan.id}
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
