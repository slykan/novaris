'use client'
import { useEffect, useRef } from 'react'
import { p } from '@/lib/path'

const checkItems = [
  'Iskusan i certificiran tim stručnjaka',
  'Rješenja prilagođena vašoj industriji i poslovanju',
  'Proaktivna podrška i kontinuirano održavanje',
  'Fokus na sigurnost, pouzdanost i skalabilnost',
]


export default function About() {
  const orbRef   = useRef<HTMLDivElement>(null)
  const listRef  = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    // orb spin
    const orb = orbRef.current
    if (orb) {
      const o = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { orb.classList.add('spin'); o.disconnect() }
      }, { threshold: 0.5 })
      o.observe(orb)
    }

    // checklist
    const items = listRef.current.filter(Boolean) as HTMLLIElement[]
    const lo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const i = items.indexOf(entry.target as HTMLLIElement)
          setTimeout(() => entry.target.classList.add('visible'), i * 140)
          lo.unobserve(entry.target)
        }
      })
    }, { threshold: 0.2 })
    items.forEach((li) => lo.observe(li))

    return () => { lo.disconnect() }
  }, [])

  return (
    <section className="section dark" id="about">
      <div className="about-grid">
        <div>
          <p className="label">O nama</p>
          <h2>Vaš tehnološki partner za održivi rast</h2>
          <p>
            Spajamo stručnost, inovacije i osobni pristup kako bismo isporučili IT rješenja
            koja vaše poslovanje vode naprijed. Naša snaga leži u kombinaciji vodećih globalnih
            tehnologija i duboke poznate vaše industrije.
          </p>
          <a className="button secondary" href="#contact">
            Više o nama <span aria-hidden="true">-&gt;</span>
          </a>
        </div>

        <div className="orb-logo" ref={orbRef} aria-hidden="true">
          <img src={p('/logo_small1.png')} alt="" className="logo-mark" />
        </div>

        <ul className="check-list" id="why">
          {checkItems.map((item, i) => (
            <li key={i} ref={(el) => { listRef.current[i] = el }}>{item}</li>
          ))}
        </ul>
      </div>

    </section>
  )
}
