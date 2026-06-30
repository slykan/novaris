import Link from 'next/link'
import { p } from '@/lib/path'

const ctaItems = [
  'Razumijemo Vaše potrebe',
  'Predlažemo najbolja rješenja',
  'Isporučujemo gotova rješenja',
  'Pružamo kontinuiranu podršku',
  'Gradimo dugoročno partnerstvo',
]

export default function Footer() {
  return (
    <>
      <section className="cta-section" id="contact">
        <div className="cta-inner">
          <div className="cta-left">
            <p className="label">Spremni za suradnju?</p>
            <h2>Započnimo razgovor o vašem projektu.</h2>
            <ul className="cta-list">
              {ctaItems.map((item, i) => (
                <li key={i}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="cta-cards">
            <Link href="/kontakt" className="cta-card">
              <div className="cta-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <rect x="8" y="13" width="3" height="3" rx="0.5" />
                </svg>
              </div>
              <h3>Dogovorite sastanak</h3>
              <p>Razgovarajmo o Vašim potrebama i ciljevima.</p>
            </Link>
            <Link href="/kontakt" className="cta-card">
              <div className="cta-card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <h3>Besplatni IT audit</h3>
              <p>Pregledavamo sigurnost i učinkovitost Vaše IT infrastrukture.</p>
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer-bar">
        <div className="footer-bar-inner">
          <Link className="brand" href="/" aria-label="Novaris Tech početna">
            <img src={p('/logo_small1.png')} alt="Novaris Tech" className="logo-footer" />
          </Link>
          <p className="footer-copy">© 2026 Novaris Tech d.o.o.</p>
          <nav className="footer-links">
            <Link href="/#services">Informatičke usluge</Link>
            <Link href="/#services">IT rješenja</Link>
            <Link href="/#services">IT sustavi</Link>
            <Link href="/#services">IT struktura</Link>
          </nav>
          <div className="socials" aria-label="Društvene mreže">
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">ig</a>
          </div>
          <nav className="footer-legal">
            <a href="#">Politika privatnosti</a>
            <a href="#">Uvjeti korištenja</a>
          </nav>
        </div>
      </footer>
    </>
  )
}
