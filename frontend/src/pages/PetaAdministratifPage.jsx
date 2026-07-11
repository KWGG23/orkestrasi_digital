import { MapPin } from '@phosphor-icons/react'
import MapPageLayout from '../components/map/MapPageLayout.jsx'

export default function PetaAdministratifPage() {
  return (
    <MapPageLayout
      crumbLabel="Peta Administratif"
      icon={MapPin}
      title="Batas Wilayah Karangasem & Blongkeng"
      description="Menggabungkan batas administratif kedua dusun dalam satu lapisan peta interaktif."
      layer="admin"
      layerColor="#15803d"
      sourceNote="Sumber: survei batas wilayah bersama perangkat desa (menyusul)."
    />
  )
}
