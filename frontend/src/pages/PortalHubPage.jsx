import PortalLayout from '../components/layout/PortalLayout.jsx'
import PortalHero from '../components/portal/PortalHero.jsx'
import DusunProfileGrid from '../components/portal/DusunProfileGrid.jsx'
import UmkmPreviewSection from '../components/portal/UmkmPreviewSection.jsx'
import KegiatanKknSection from '../components/portal/KegiatanKknSection.jsx'
import MapPreviewGrid from '../components/portal/MapPreviewGrid.jsx'
import BankSampahCTA from '../components/portal/BankSampahCTA.jsx'

export default function PortalHubPage() {
  return (
    <PortalLayout>
      <PortalHero />
      <DusunProfileGrid />
      <UmkmPreviewSection />
      <KegiatanKknSection />
      <MapPreviewGrid />
      <BankSampahCTA />
    </PortalLayout>
  )
}
