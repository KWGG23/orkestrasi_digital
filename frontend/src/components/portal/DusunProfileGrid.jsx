import { Buildings } from '@phosphor-icons/react'
import { useProfilDusun } from '../../hooks/useProfilDusun.js'
import FeatureCard from './FeatureCard.jsx'
import SectionHeading from './SectionHeading.jsx'

function badgeFor(query) {
  if (!query.isSuccess) return undefined
  return query.data?.konten ? 'Profil tersedia' : 'Segera hadir'
}

export default function DusunProfileGrid() {
  const karangasem = useProfilDusun('karangasem')
  const tegalwungu = useProfilDusun('tegalwungu')

  const dusunCards = [
    {
      slug: 'karangasem',
      title: 'Dusun Karangasem',
      description: 'Lokasi program Bank Sampah Digital dan bagian dari cakupan Portal Desa.',
      badge: badgeFor(karangasem),
    },
    {
      slug: 'tegalwungu',
      title: 'Dusun Tegalwungu',
      description: 'Mitra Portal Desa untuk pemetaan wilayah dan katalog UMKM lokal.',
      badge: badgeFor(tegalwungu),
    },
  ]

  return (
    <section id="profil-dusun" className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Profil Wilayah"
          title="Kenali dua dusun kami"
          description="Data geografis, demografis, dan potensi wilayah — diperbarui bertahap seiring survei lapangan."
        />

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {dusunCards.map((dusun) => (
            <FeatureCard
              key={dusun.slug}
              icon={Buildings}
              eyebrow="Profil Dusun"
              title={dusun.title}
              description={dusun.description}
              to={`/portal/profil/${dusun.slug}`}
              badge={dusun.badge}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
