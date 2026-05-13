'use client'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

const checkItems = [
  'Iskusan i certificiran tim stručnjaka',
  'Rješenja prilagođena vašoj industriji i poslovanju',
  'Proaktivna podrška i kontinuirano održavanje',
  'Fokus na sigurnost, pouzdanost i skalabilnost',
]

const stats = [
  { value: 30, suffix: '+', label: 'Godina na tržištu' },
  { value: 50, suffix: '+', label: 'Zadovoljnih klijenata' },
  { value: 110, suffix: '+', label: 'Stručnjaka u timu' },
  { value: 200, suffix: '+', label: 'Certifikata' },
]

export default function About() {
  const orbRef   = useRef<HTMLDivElement>(null)
  const listRef  = useRef<(HTMLLIElement | null)[]>([])
  const statsRef = useRef<HTMLDivElement>(null)
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([])

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

    // stats counter
    const statsEl = statsRef.current
    if (statsEl) {
      const so = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          spanRefs.current.forEach((span, i) => {
            if (!span) return
            const { value, suffix } = stats[i]
            const duration = 1800
            let start: number | null = null
            const step = (ts: number) => {
              if (!start) start = ts
              const progress = Math.min((ts - start) / duration, 1)
              const ease = 1 - Math.pow(1 - progress, 3)
              span.textContent = Math.floor(ease * value) + suffix
              if (progress < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
          })
          so.disconnect()
        }
      }, { threshold: 0.4 })
      so.observe(statsEl)
    }

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
          <Image src="/logo3_small.png" alt="" width={135} height={135} className="logo-mark" />
        </div>

        <ul className="check-list" id="why">
          {checkItems.map((item, i) => (
            <li key={i} ref={(el) => { listRef.current[i] = el }}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="stats" ref={statsRef}>
        {stats.map((s, i) => (
          <article key={i}>
            <span ref={(el) => { spanRefs.current[i] = el }}>0{s.suffix}</span>
            <p>{s.label}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
