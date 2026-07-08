import { Route, Routes } from 'react-router-dom'
import PortalHubPage from './pages/PortalHubPage.jsx'
import DusunProfilePage from './pages/DusunProfilePage.jsx'
import UmkmCatalogPage from './pages/UmkmCatalogPage.jsx'
import UmkmDetailPage from './pages/UmkmDetailPage.jsx'
import PetaAdministratifPage from './pages/PetaAdministratifPage.jsx'
import PetaBencanaPage from './pages/PetaBencanaPage.jsx'
import BankSampahPortalPage from './pages/BankSampahPortalPage.jsx'
import RequireAuth from './components/admin/RequireAuth.jsx'
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import AdminSetoranPage from './pages/admin/AdminSetoranPage.jsx'
import AdminTabunganPage from './pages/admin/AdminTabunganPage.jsx'
import AdminUmkmPage from './pages/admin/AdminUmkmPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PortalHubPage />} />
      <Route path="/portal" element={<PortalHubPage />} />
      <Route path="/portal/profil/:dusun" element={<DusunProfilePage />} />
      <Route path="/portal/umkm" element={<UmkmCatalogPage />} />
      <Route path="/portal/umkm/:id" element={<UmkmDetailPage />} />
      <Route path="/portal/peta/administratif" element={<PetaAdministratifPage />} />
      <Route path="/portal/peta/bencana" element={<PetaBencanaPage />} />
      <Route path="/portal/bank-sampah" element={<BankSampahPortalPage />} />

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/setoran" element={<AdminSetoranPage />} />
        <Route path="/admin/tabungan" element={<AdminTabunganPage />} />
        <Route path="/admin/umkm" element={<AdminUmkmPage />} />
      </Route>
    </Routes>
  )
}

export default App
