'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { p } from '@/lib/path'

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
          <img src={p('/logo3.png')} alt="Novaris Tech" className="logo-full" />
        </Link>

        <div className={`nav-links${open ? ' open' : ''}`}>
          <Link className={isHome ? 'active' : ''} href="/" onClick={close}>Početna</Link>
          <a href={home('#services')} onClick={close}>Portfolio</a>
          <Link className={isUsluge ? 'active' : ''} href="/usluge" onClick={close}>Usluge</Link>
          <Link className={isONama ? 'active' : ''} href="/o-nama" onClick={close}>O nama</Link>
          <a href={home('#why')} onClick={close}>Zašto mi</a>
          <Link className={isKontakt ? 'active' : ''} href="/kontakt" onClick={close}>Kontakt</Link>
        </div>

        <button
          className="nav-button"
          aria-label="Otvori navigaciju"
          onClick={() => setOpen(o => !o)}
        >
          <span />
        </button>

        <Link className="quote-button" href="/kontakt">
          Zatražite ponudu <span aria-hidden="true">-&gt;</span>
        </Link>
    </nav>
  )
}
