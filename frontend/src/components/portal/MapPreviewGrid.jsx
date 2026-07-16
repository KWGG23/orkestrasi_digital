import { MapPin } from '@phosphor-icons/react'
import { useGeoLayer } from '../../hooks/useGeoLayer.js'
import FeatureCard from './FeatureCard.jsx'
import SectionHeading from './SectionHeading.jsx'

function badgeFor(query) {
  if (!query.isSuccess) return undefined
  const count = query.data?.features?.length ?? 0
  return count > 0 ? `${count} area` : 'Data menyusul'
}

export default function MapPreviewGrid() {
  const admin = useGeoLayer('admin')

  return (
    <section id="peta" className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Peta Interaktif"
          title="Wilayah dalam satu peta"
          description="Batas administratif, disatukan dari data survei lapangan."
        />

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <FeatureCard
            icon={MapPin}
            eyebrow="Peta Administratif"
            title="Batas Dusun Karangasem & Blongkeng"
            description="Lihat batas wilayah kedua dusun beserta fasilitas umum di sekitarnya."
            to="/portal/peta/administratif"
            badge={badgeFor(admin)}
          />
        </div>
      </div>
    </section>
  )
}
