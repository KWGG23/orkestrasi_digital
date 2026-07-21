import { CalendarBlank, Images } from '@phosphor-icons/react'
import { useKegiatanKknList } from '../../hooks/useKegiatanKknList.js'
import { storageUrl } from '../../lib/api.js'
import FeatureCard from './FeatureCard.jsx'
import SectionHeading from './SectionHeading.jsx'

const DUSUN_LABELS = { karangasem: 'Karangasem', blongkeng: 'Blongkeng' }

export default function KegiatanKknSection() {
  const { data, isLoading } = useKegiatanKknList()
  const items = data ?? []

  return (
    <section id="kegiatan-kkn" className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Kegiatan KKN"
          title="Dokumentasi Kegiatan KKN"
          description="Jejak kegiatan tim KKN dari tahun ke tahun dalam membangun Bank Sampah Digital dan Portal Desa Digital."
        />

        <div className="mt-8">
          {isLoading ? (
            <p className="text-sm text-muted">Memuat dokumentasi kegiatan…</p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border bg-white/60 py-12 text-center">
              <Images size={32} className="text-primary/40" />
              <p className="text-sm text-bark/75">
                Dokumentasi kegiatan KKN belum tersedia.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((kegiatan) => (
                <FeatureCard
                  key={kegiatan.id}
                  icon={CalendarBlank}
                  eyebrow={`Tahun ${kegiatan.tahun} · ${DUSUN_LABELS[kegiatan.dusun] ?? kegiatan.dusun}`}
                  title={kegiatan.judul}
                  description={kegiatan.deskripsi ?? 'Dokumentasi sedang disusun.'}
                  to={`/portal/kegiatan/${kegiatan.tahun}/${kegiatan.dusun}`}
                  badge={kegiatan.tahun}
                  image={kegiatan.foto?.[0] ? storageUrl(kegiatan.foto[0]) : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
