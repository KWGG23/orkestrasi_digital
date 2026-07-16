import { useState } from 'react'
import { Megaphone, PencilSimple, Plus, Trash, Warning, X } from '@phosphor-icons/react'
import AdminLayout from '../../components/layout/AdminLayout.jsx'
import {
  useCreatePengumuman,
  useDeletePengumuman,
  usePengumumanList,
  useUpdatePengumuman,
} from '../../hooks/usePengumuman.js'

function emptyForm() {
  return {
    judul: '',
    isi: '',
    tanggal_publish: new Date().toISOString().slice(0, 10),
    aktif: true,
  }
}

function formFromPengumuman(p) {
  return {
    judul: p.judul ?? '',
    isi: p.isi ?? '',
    tanggal_publish: (p.tanggal_publish ?? '').slice(0, 10),
    aktif: Boolean(p.aktif),
  }
}

export default function AdminPengumumanPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const { data: items, isLoading } = usePengumumanList()

  const createPengumuman = useCreatePengumuman()
  const updatePengumuman = useUpdatePengumuman()
  const deletePengumuman = useDeletePengumuman()

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm())
    setError(null)
    setShowForm(true)
  }

  function openEdit(p) {
    setEditingId(p.id)
    setForm(formFromPengumuman(p))
    setError(null)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.judul || !form.isi || !form.tanggal_publish) {
      setError('Judul, isi, dan tanggal publish wajib diisi.')
      return
    }

    try {
      if (editingId) {
        await updatePengumuman.mutateAsync({ id: editingId, ...form })
      } else {
        await createPengumuman.mutateAsync(form)
      }
      setShowForm(false)
    } catch (err) {
      setError(err.message ?? 'Gagal menyimpan pengumuman.')
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await deletePengumuman.mutateAsync(id)
    } catch (err) {
      setError(err.message ?? 'Gagal menghapus pengumuman.')
    } finally {
      setDeletingId(null)
    }
  }

  const saving = createPengumuman.isPending || updatePengumuman.isPending

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-primary-dark">Pengumuman</h1>
        <button
          type="button"
          onClick={openCreate}
          className="flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Plus size={16} />
          Tambah Pengumuman
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-border bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold text-primary-dark">
              {editingId ? 'Edit Pengumuman' : 'Pengumuman Baru'}
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

          <div className="mt-4 grid gap-3">
            <input
              required
              placeholder="Judul"
              value={form.judul}
              onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value }))}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <textarea
              required
              placeholder="Isi pengumuman"
              value={form.isi}
              onChange={(e) => setForm((f) => ({ ...f, isi: e.target.value }))}
              rows={4}
              className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <div className="flex flex-wrap items-center gap-4">
              <input
                required
                type="date"
                value={form.tanggal_publish}
                onChange={(e) => setForm((f) => ({ ...f, tanggal_publish: e.target.value }))}
                className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <label className="flex items-center gap-2 text-sm text-bark">
                <input
                  type="checkbox"
                  checked={form.aktif}
                  onChange={(e) => setForm((f) => ({ ...f, aktif: e.target.checked }))}
                />
                Tampilkan ke publik
              </label>
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
            {saving ? 'Menyimpan…' : 'Simpan Pengumuman'}
          </button>
        </form>
      )}

      <div className="mt-6 rounded-2xl border border-border bg-white">
        {isLoading ? (
          <p className="p-5 text-sm text-muted">Memuat…</p>
        ) : !items || items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <Megaphone size={28} className="text-primary/40" />
            <p className="text-sm text-muted">Belum ada pengumuman aktif.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-bark">{p.judul}</p>
                  <p className="truncate text-sm text-muted">{p.tanggal_publish?.slice(0, 10)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  className="cursor-pointer rounded-full p-2 text-muted hover:bg-moss hover:text-primary-dark"
                  aria-label="Edit"
                >
                  <PencilSimple size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  disabled={deletingId === p.id}
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
