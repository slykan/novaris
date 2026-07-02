'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { p } from '@/lib/path'

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.3" />
      <path d="M5.64 5.64l3.35 3.35M18.36 5.64l-3.35 3.35M5.64 18.36l3.35-3.35M18.36 18.36l-3.35-3.35" />
    </svg>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isONama = pathname === '/o-nama'
  const isUsluge = pathname === '/usluge'
  const isKontakt = pathname === '/kontakt'
  const close = () => setOpen(false)
  const home = (hash: string) => isHome ? hash : `/${hash}`

  return (
    <nav className="nav" aria-label="Primarna navigacija">
        <Link className="brand" href="/" onClick={close} aria-label="Novaris Tech početna">
          <img src={p('/logo-light.png')} alt="Novaris Tech" className="logo-full" />
        </Link>

        <div className={`nav-links${open ? ' open' : ''}`}>
          <Link className={isHome ? 'active' : ''} href="/" onClick={close}>Početna</Link>
          <a href={home('#services')} onClick={close}>Portfolio</a>
          <Link className={isUsluge ? 'active' : ''} href="/usluge" onClick={close}>Usluge</Link>
          <Link className={isONama ? 'active' : ''} href="/o-nama" onClick={close}>O nama</Link>
          <a href={home('#why')} onClick={close}>Zašto mi</a>
          <Link className={isKontakt ? 'active' : ''} href="/kontakt" onClick={close}>Kontakt</Link>
          <a className="nav-support-link" href="/portal.html" onClick={close}>
            <SupportIcon />
            Podrška
          </a>
        </div>

        <button
          className="nav-button"
          aria-label="Otvori navigaciju"
          onClick={() => setOpen(o => !o)}
        >
          <span />
        </button>

        <Link className="quote-button" href="/kontakt">
          Dogovori sastanak <span aria-hidden="true">&rarr;</span>
        </Link>

        <a className="support-fab" href="/portal.html" aria-label="Podrška – portal za klijente" title="Podrška">
          <SupportIcon />
        </a>
    </nav>
  )
}
