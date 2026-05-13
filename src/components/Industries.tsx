'use client'
import { useEffect, useRef } from 'react'

const industries = [
  {
    icon: <path d="M8 40V20M16 40V12M24 40V24M32 40V8M40 40V16"/>,
    title: 'Telekomunikacije',
    desc: 'AI rješenja za mrežne operacije koja poboljšavaju performanse i korisničko iskustvo u telekomunikacijskom sektoru.',
  },
  {
    icon: <path d="M24 6l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8zM8 38h32M16 30v8M32 30v8"/>,
    title: 'Energetika',
    desc: 'Analitika, prognoziranje potrošnje, detekcija kvarova i optimizacija resursa za energetske kompanije i javne komunalne servise.',
  },
  {
    icon: <path d="M6 38V18l18-12 18 12v20H6zM18 38V26h12v12"/>,
    title: 'Javni sektor i financije',
    desc: 'Digitalizacija procesa za javnu upravu, financijske institucije i regulatorna tijela – sigurno, usklađeno i učinkovito.',
  },
]

export default function Industries() {
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
    <section className="section light" id="industries">
      <div className="section-heading split">
        <div>
          <p className="label">Industrije</p>
          <h2>Rješenja prilagođena vašem sektoru</h2>
        </div>
        <p>Specifično industrijsko znanje kombiniramo s tehnološkom izvrsnosti za rješenja koja donose mjerljive rezultate.</p>
      </div>

      <div className="service-grid">
        {industries.map((ind, i) => (
          <article
            key={i}
            className="service-card"
            ref={(el) => { cardRefs.current[i] = el }}
          >
            <svg viewBox="0 0 48 48" aria-hidden="true">{ind.icon}</svg>
            <h3>{ind.title}</h3>
            <p>{ind.desc}</p>
            <a href="#contact">Saznajte više <span aria-hidden="true">-&gt;</span></a>
          </article>
        ))}
      </div>
    </section>
  )
}
