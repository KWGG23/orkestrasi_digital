import { MapPin, Warning } from '@phosphor-icons/react'
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
  const bencana = useGeoLayer('bencana')

  return (
    <section id="peta" className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Peta Interaktif"
          title="Wilayah dalam satu peta"
          description="Batas administratif dan kerentanan bencana, disatukan dari data survei lapangan dan BNPB/BIG."
        />

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <FeatureCard
            icon={MapPin}
            eyebrow="Peta Administratif"
            title="Batas Dusun Karangasem & Tegalwungu"
            description="Lihat batas wilayah kedua dusun beserta fasilitas umum di sekitarnya."
            to="/portal/peta/administratif"
            badge={badgeFor(admin)}
          />
          <FeatureCard
            icon={Warning}
            eyebrow="Peta Kerentanan Bencana"
            title="Kerentanan Bencana"
            description="Rujukan mitigasi berbasis data BNPB/BIG dan survei primer lapangan."
            to="/portal/peta/bencana"
            tone="accent"
            badge={badgeFor(bencana)}
          />
        </div>
      </div>
    </section>
  )
}
