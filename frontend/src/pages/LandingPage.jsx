import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Hero from '../components/landing/Hero.jsx'
import ImpactMetrics from '../components/landing/ImpactMetrics.jsx'
import CarbonCalculator from '../components/landing/CarbonCalculator.jsx'
import Solutions from '../components/landing/Solutions.jsx'
import CertificationBadges from '../components/landing/CertificationBadges.jsx'
import CTASection from '../components/landing/CTASection.jsx'

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Lewati ke konten utama
      </a>
      <Navbar />
      <main id="konten-utama">
        <Hero />
        <ImpactMetrics />
        <CarbonCalculator />
        <Solutions />
        <CertificationBadges />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
