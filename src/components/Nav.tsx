'use client'
import Image from 'next/image'
import { useState } from 'react'

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="hero" id="home">
      <nav className="nav" aria-label="Primarna navigacija">
        <a className="brand" href="#home" aria-label="Novaris Tech početna">
          <Image src="/logo3.png" alt="Novaris Tech" width={180} height={48} className="logo-full" priority />
        </a>

        <div className={`nav-links${open ? ' open' : ''}`}>
          <a className="active" href="#home">Početna</a>
          <a href="#services">Portfolio</a>
          <a href="#about">O nama</a>
          <a href="#why">Zašto mi</a>
          <a href="#contact">Kontakt</a>
        </div>

        <button
          className="nav-button"
          aria-label="Otvori navigaciju"
          onClick={() => setOpen(o => !o)}
        >
          <span />
        </button>

        <a className="quote-button" href="#contact">
          Zatražite ponudu <span aria-hidden="true">-&gt;</span>
        </a>
      </nav>
    </header>
  )
}
