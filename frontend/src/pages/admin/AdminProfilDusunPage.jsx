import { useEffect, useState } from 'react'
import { Buildings, Warning } from '@phosphor-icons/react'
import AdminLayout from '../../components/layout/AdminLayout.jsx'
import { useProfilDusun } from '../../hooks/useProfilDusun.js'
import { useUpdateProfilDusun } from '../../hooks/useProfilDusunAdmin.js'
import ProfilContent from '../../components/profil/ProfilContent.jsx'

const DUSUN_OPTIONS = [
  { value: 'karangasem', label: 'Karangasem' },
  { value: 'blongkeng', label: 'Blongkeng' },
]

const TEMPLATE = {
  sejarah: 'Tulis sejarah singkat dusun di sini.',
  demografi: { jumlah_kk: 0, jumlah_penduduk: 0 },
  potensi: ['Contoh potensi 1', 'Contoh potensi 2'],
}

export default function AdminProfilDusunPage() {
  const [dusun, setDusun] = useState('karangasem')
  const { data, isLoading } = useProfilDusun(dusun)
  const updateProfil = useUpdateProfilDusun()

  const [raw, setRaw] = useState('')
  const [saveError, setSaveError] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isLoading) return
    setRaw(JSON.stringify(data?.konten ?? TEMPLATE, null, 2))
    setSaveError(null)
    setSaved(false)
  }, [dusun, isLoading, data])

  let preview = null
  let parseError = null
  try {
    preview = raw.trim() ? JSON.parse(raw) : null
  } catch {
    parseError = 'Format JSON tidak valid.'
  }

  async function handleSave() {
    setSaveError(null)
    setSaved(false)
    try {
      const konten = JSON.parse(raw)
      await updateProfil.mutateAsync({ dusun, konten })
      setSaved(true)
    } catch (err) {
      setSaveError(err instanceof SyntaxError ? 'Format JSON tidak valid.' : (err.message ?? 'Gagal menyimpan profil.'))
    }
  }

  return (
    <AdminLayout>
      <h1 className="font-heading text-2xl font-semibold text-primary-dark">Profil Dusun</h1>
      <p className="mt-1 text-sm text-muted">
        Isi konten profil dalam format JSON bebas — field apa pun akan otomatis ditampilkan di halaman publik.
      </p>

      <div className="mt-4 flex gap-1 rounded-full bg-moss/50 p-1 sm:w-fit">
        {DUSUN_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setDusun(o.value)}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 sm:flex-none ${
              dusun === o.value ? 'bg-white text-primary-dark shadow-sm' : 'text-bark/70 hover:text-primary-dark'
            }`}
          >
            <Buildings size={16} />
            {o.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted">Memuat…</p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-muted">Konten (JSON)</label>
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={18}
              spellCheck={false}
              className="mt-1 w-full rounded-xl border border-border p-3 font-mono text-xs outline-none focus:border-primary"
            />

            {parseError && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-clay">
                <Warning size={14} />
                {parseError}
              </p>
            )}
            {saveError && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-clay">
                <Warning size={14} />
                {saveError}
              </p>
            )}
            {saved && <p className="mt-2 text-sm text-primary">Profil berhasil disimpan.</p>}

            <button
              type="button"
              onClick={handleSave}
              disabled={Boolean(parseError) || updateProfil.isPending}
              className="mt-4 cursor-pointer rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateProfil.isPending ? 'Menyimpan…' : 'Simpan Profil'}
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-muted">Pratinjau</label>
            <div className="mt-1 rounded-xl border border-border bg-white p-5">
              {preview ? (
                <ProfilContent konten={preview} />
              ) : (
                <p className="text-sm text-muted">Tidak ada konten untuk ditampilkan.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
