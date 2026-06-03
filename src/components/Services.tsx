'use client'
import { useEffect, useRef } from 'react'

const services = [
  {
    icon: <path d="M6 24h8M34 24h8M24 6v8M24 34v8M13 13l6 6M29 29l6 6M13 35l6-6M29 17l6-6M24 20a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/>,
    title: 'Integracije',
    desc: 'Omogućujemo integraciju aplikacija, sustava i podataka brzo, jednostavno i na siguran način – uz upravljanje API životnim ciklusom i event streaming.',
  },
  {
    icon: <path d="M8 36V20l8-6 8 6v16H8Zm16 0V12l8-8 8 8v24H24ZM8 36h32"/>,
    title: 'Automatizacija',
    desc: 'Pružamo sveobuhvatan skup mogućnosti za digitalizaciju i automatizaciju poslovnih procesa primjenom AI i low-code/no-code tehnologija.',
  },
  {
    icon: <path d="M18 38h20a10 10 0 0 0 0-20 15 15 0 0 0-29 4 8 8 0 0 0 1 16h8Zm0-4h-8a4 4 0 0 1 0-8h3v-2a11 11 0 0 1 22-2h3a6 6 0 0 1 0 12H18Z"/>,
    title: 'Cloud transformacija',
    desc: 'Implementiramo cloud-by-design strategiju koja vašoj organizaciji donosi fleksibilnost infrastrukture i ubrzava digitalnu transformaciju.',
  },
  {
    icon: <path d="M8 27h7v15H8V27Zm12-10h7v25h-7V17ZM32 6h7v36h-7V6Z"/>,
    title: 'Analitika podataka i AI',
    desc: 'Omogućujemo tvrtkama da u potpunosti iskoriste potencijal svojih podataka – pretvaramo složene informacije u konkretne poslovne uvide.',
  },
  {
    icon: <path d="M6 10h36v4H6zM6 20h36v4H6zM6 30h36v4H6zM10 12v22M24 12v22M38 12v22"/>,
    title: 'Upravljanje IT operacijama',
    desc: 'Pružamo sveobuhvatan uvid u zdravlje infrastrukture, poslovnih servisa i aplikacija uz naprednu analitiku i proaktivno sprječavanje incidenata.',
  },
  {
    icon: <path d="M24 4 8 10v12c0 10 6.8 18 16 22 9.2-4 16-12 16-22V10L24 4Zm7.8 17-9.4 9.4-5.2-5.2 2.8-2.8 2.4 2.4 6.6-6.6 2.8 2.8Z"/>,
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
        <p>Od integracije sustava do napredne analitike i AI – pretvaramo tehnologiju u stvarnu poslovnu vrijednost.</p>
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
    </section>
  )
}
