import { Warning } from '@phosphor-icons/react'
import MapPageLayout from '../components/map/MapPageLayout.jsx'

export default function PetaBencanaPage() {
  return (
    <MapPageLayout
      crumbLabel="Peta Kerentanan Bencana"
      icon={Warning}
      title="Kerentanan Bencana"
      description="Rujukan mitigasi warga terhadap potensi bencana di sekitar Karangasem & Blongkeng."
      layer="bencana"
      layerColor="#a16207"
      sourceNote="Sumber data: BNPB / BIG / survei primer lapangan. Belum tersedia — akan diperbarui bertahap."
    />
  )
}
