import Link from 'next/link'
import HeroSlider from './HeroSlider'

export default function Hero() {
  return (
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

        <div className="trust-row" aria-label="Prednosti tvrtke">
          <article>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path d="M24 4 8 10v12c0 10 6.8 18 16 22 9.2-4 16-12 16-22V10L24 4Zm7.8 17-9.4 9.4-5.2-5.2 2.8-2.8 2.4 2.4 6.6-6.6 2.8 2.8Z"/>
            </svg>
            <div><strong>Pouzdani</strong><span>Ovdje smo kada nas trebate</span></div>
          </article>
          <article>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path d="M24 6a18 18 0 1 1-12.7 30.7l3-3A13.8 13.8 0 1 0 10.2 22H15l-7 7-7-7h5A18 18 0 0 1 24 6Zm2 9v10l8 5-2 3-10-6V15h4Z"/>
            </svg>
            <div><strong>Brzi</strong><span>Brzo reagiramo, brže rješavamo</span></div>
          </article>
          <article>
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path d="M18 24a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm20-2a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM2 42c1.2-8 7.6-14 16-14s14.8 6 16 14H2Zm27.5-13.5A15 15 0 0 1 38 42h8c-.8-7-5.4-12-11.8-13.7-1.5-.4-3.1-.3-4.7.2Z"/>
            </svg>
            <div><strong>Partnerstvo</strong><span>Dugoročna suradnja i podrška</span></div>
          </article>
        </div>
      </section>

      <HeroSlider />
    </div>
  )
}
