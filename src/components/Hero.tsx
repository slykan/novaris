import Link from 'next/link'
import { HeroBackground } from './HeroBackground'

export default function Hero() {
  return (
    <>
      <HeroBackground />
      <div className="hero-grid">
      <section className="hero-copy">
        <p className="eyebrow"><span></span> Novaris Tech</p>
        <h1>Vaš pouzdan partner u <em>digitalnoj transformaciji</em></h1>
        <p className="hero-lead">
          Povezujemo vodeće globalne tehnologije s internom stručnošću kako bismo Vašoj
          organizaciji omogućili stabilnu, učinkovitu i sigurnu digitalnu transformaciju.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#services">
            Naš portfolio <span aria-hidden="true">-&gt;</span>
          </a>
          <Link className="button secondary" href="/kontakt">Kontaktirajte nas</Link>
        </div>
      </section>
      </div>
    </>
  )
}
