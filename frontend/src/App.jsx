import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import PortalHubPage from './pages/PortalHubPage.jsx'
import DusunProfilePage from './pages/DusunProfilePage.jsx'
import UmkmCatalogPage from './pages/UmkmCatalogPage.jsx'
import PetaAdministratifPage from './pages/PetaAdministratifPage.jsx'
import PetaBencanaPage from './pages/PetaBencanaPage.jsx'
import BankSampahPortalPage from './pages/BankSampahPortalPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/portal" element={<PortalHubPage />} />
      <Route path="/portal/profil/:dusun" element={<DusunProfilePage />} />
      <Route path="/portal/umkm" element={<UmkmCatalogPage />} />
      <Route path="/portal/peta/administratif" element={<PetaAdministratifPage />} />
      <Route path="/portal/peta/bencana" element={<PetaBencanaPage />} />
      <Route path="/portal/bank-sampah" element={<BankSampahPortalPage />} />
    </Routes>
  )
}

export default App
