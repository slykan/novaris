'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

const services = [
  {
    icon: (
      <>
        <rect x="8" y="8" width="11" height="11" rx="2" />
        <rect x="29" y="8" width="11" height="11" rx="2" />
        <rect x="8" y="29" width="11" height="11" rx="2" />
        <rect x="29" y="29" width="11" height="11" rx="2" />
      </>
    ),
    title: 'Integracije',
    desc: 'Omogućujemo integraciju aplikacija, sustava i podataka brzo, jednostavno i na siguran način uz upravljanje API životnim ciklusom i event streaming.',
  },
  {
    icon: <path d="M16 34h19a9 9 0 0 0 0-18 13 13 0 0 0-25 4 7 7 0 0 0 1 14h5Z" />,
    title: 'Automatizacija',
    desc: 'Pružamo sveobuhvatan skup mogućnosti za digitalizaciju i automatizaciju poslovnih procesa primjenom AI i low-code/no-code tehnologija.',
  },
  {
    icon: <path d="M24 6 10 12v11c0 9 5.8 15.4 14 19 8.2-3.6 14-10 14-19V12L24 6Z M18 24l4 4 8-9" />,
    title: 'Cloud transformacija',
    desc: 'Implementiramo cloud-by-design strategiju koja vašoj organizaciji donosi fleksibilnost infrastrukture i ubrzava digitalnu transformaciju.',
  },
  {
    icon: <path d="M15 30h18M15 21h18M18 12l-8 12 8 12M30 12l8 12-8 12" />,
    title: 'Analitika podataka i AI',
    desc: 'Omogućujemo tvrtkama da u potpunosti iskoriste potencijal svojih podataka pretvaramo složene informacije u konkretne poslovne uvide.',
  },
  {
    icon: <path d="M12 27v-5a12 12 0 0 1 24 0v5M12 27H8v9h5a4 4 0 0 0 4-4v-1a4 4 0 0 0-4-4h-1ZM36 27h4v9h-5a4 4 0 0 1-4-4v-1a4 4 0 0 1 4-4h1Z" />,
    title: 'Upravljanje IT operacijama',
    desc: 'Pružamo sveobuhvatan uvid u zdravlje infrastrukture, poslovnih servisa i aplikacija uz naprednu analitiku i proaktivno sprječavanje incidenata.',
  },
  {
    icon: (
      <>
        <ellipse cx="24" cy="12" rx="14" ry="5" />
        <path d="M10 12v24c0 2.8 6.3 5 14 5s14-2.2 14-5V12M10 24c0 2.8 6.3 5 14 5s14-2.2 14-5" />
      </>
    ),
    title: 'Upravljanje IT uslugama',
    desc: 'Implementiramo i automatiziramo IT procese u skladu s ITIL najboljim praksama – od service deska do upravljanja IT imovinom i promjenama.',
  },
]

export default function Services() {
  const cardRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target as HTMLElement)
            setTimeout(() => entry.target.classList.add('visible'), index * 100)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    cardRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section light" id="services">
      <div className="section-heading split">
        <div>
          <p className="label">Što radimo</p>
          <h2>Portfolio rješenja koja pokreću vaše poslovanje</h2>
        </div>
        <p>Od integracije sustava do napredne analitike i AI pretvaramo tehnologiju u stvarnu poslovnu vrijednost.</p>
      </div>

      <div className="service-grid">
        {services.map((s, i) => (
          <article
            key={i}
            className="service-card"
            ref={(el) => { cardRefs.current[i] = el }}
          >
            <svg viewBox="0 0 48 48" aria-hidden="true">{s.icon}</svg>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </article>
        ))}
      </div>

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Link className="button secondary" href="/usluge" style={{ display: 'inline-flex' }}>
          Detaljnije o uslugama <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
