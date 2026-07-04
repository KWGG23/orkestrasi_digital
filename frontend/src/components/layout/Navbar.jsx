import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Leaf, List, X } from '@phosphor-icons/react'

const SECTION_LINKS = [
  { href: '/#dampak', label: 'Dampak' },
  { href: '/#kalkulator', label: 'Kalkulator Karbon' },
  { href: '/#program', label: 'Program' },
  { href: '/#sertifikasi', label: 'Kemitraan' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-heading text-lg font-semibold text-primary-dark">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
            <Leaf size={20} weight="fill" />
          </span>
          Desa Digital Karangasem
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {SECTION_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-bark/80 transition-colors duration-200 hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/portal"
              className="text-sm font-medium text-bark/80 transition-colors duration-200 hover:text-primary"
            >
              Portal Desa
            </Link>
          </li>
        </ul>

        <Link
          to="/portal"
          className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-dark md:inline-block"
        >
          Buka Portal Desa
        </Link>

        <button
          type="button"
          className="cursor-pointer rounded-full p-2 text-primary-dark md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
        >
          {open ? <X size={26} /> : <List size={26} />}
        </button>
      </nav>

      {open && (
        <ul id="mobile-menu" className="flex flex-col gap-1 border-t border-border/70 px-4 py-3 md:hidden">
          {SECTION_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-bark/80 hover:bg-moss hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/portal"
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-primary-dark hover:bg-moss"
            >
              Portal Desa
            </Link>
          </li>
        </ul>
      )}
    </header>
  )
}
