import { useState } from 'react'
import { Recycle, Warning } from '@phosphor-icons/react'
import AdminLayout from '../../components/layout/AdminLayout.jsx'
import { useJenisSampah } from '../../hooks/useJenisSampah.js'
import { useUpdateJenisSampah } from '../../hooks/useJenisSampahAdmin.js'

function JenisSampahRow({ jenis }) {
  const [harga, setHarga] = useState(jenis.harga_per_satuan)
  const [aktif, setAktif] = useState(Boolean(jenis.aktif))
  const [error, setError] = useState(null)
  const updateJenis = useUpdateJenisSampah()

  const dirty = Number(harga) !== Number(jenis.harga_per_satuan) || aktif !== Boolean(jenis.aktif)

  async function handleSave() {
    setError(null)
    try {
      await updateJenis.mutateAsync({ id: jenis.id, harga_per_satuan: harga, aktif })
    } catch (err) {
      setError(err.message ?? 'Gagal menyimpan harga.')
    }
  }

  return (
    <li className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-bark">{jenis.nama}</p>
        <p className="truncate text-sm text-muted">
          {jenis.kategori} &middot; per {jenis.satuan}
        </p>
      </div>

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

export default function AdminJenisSampahPage() {
  const { data: jenisList, isLoading } = useJenisSampah()

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl font-semibold text-primary-dark">Harga Jenis Sampah</h1>
      <p className="mt-1 text-sm text-muted">
        Ubah harga per satuan sesuai update dari BSI. Perubahan langsung berlaku untuk setoran baru.
      </p>

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
