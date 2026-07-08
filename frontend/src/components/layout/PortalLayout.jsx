import { Link } from 'react-router-dom'
import { CaretRight, House } from '@phosphor-icons/react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function PortalLayout({ crumbs = [], children }) {
  return (
    <div className="min-h-dvh bg-background">
      <Navbar />
      <main>
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <Link to="/" className="flex items-center gap-1 hover:text-primary">
              <House size={15} />
              Portal
            </Link>
            {crumbs.map((crumb) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                <CaretRight size={12} />
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-primary">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-bark">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
        {children}
      </main>
      <Footer />
    </div>
  )
}
