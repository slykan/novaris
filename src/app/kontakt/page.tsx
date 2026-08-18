import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import { HeroBackground } from '@/components/HeroBackground'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontaktirajte Novaris Tech – pošaljite upit i javit ćemo Vam se u roku od 1 sat. Reisnerova ulica 91A, 31000 Osijek. OIB: 23096866887.',
  keywords: ['kontakt', 'IT upit', 'Novaris Tech Osijek', 'info@novaristech.hr'],
  openGraph: {
    title: 'Kontakt – Novaris Tech',
    description: 'Pošaljite upit Novaris Techu. Odgovaramo u roku od 1 sata.',
    url: 'https://novaristech.hr/kontakt',
  },
  alternates: { canonical: 'https://novaristech.hr/kontakt' },
}

export default function Kontakt() {
  return (
    <>
      <header className="hero on-page-hero" id="home">
        <Nav />
        <HeroBackground />
        <div className="hero-grid page-hero-grid page-hero-grid-single">
          <div>
            <p className="eyebrow"><span />Kontakt</p>
            <h1>Pišite <em>nam</em></h1>
            <p className="hero-lead">
              Imate projekt, pitanje ili ideju? Ispunite formu i naš tim
              će Vam se javiti u roku od sat vremena.
            </p>
          </div>
        </div>
      </header>

      <main>
        <section className="light">
          <div className="section">
            <div className="contact-layout">

              {/* ── Forma ── */}
              <div>
                <div className="svc-cat-header" style={{ marginBottom: 32 }}>
                  <p className="label">Upit</p>
                  <h2 style={{ marginBottom: 10 }}>Pošaljite nam poruku</h2>
                  <p className="svc-cat-lead">
                    Popunite formu ispod i odgovorit ćemo Vam u najkraćem mogućem roku.
                  </p>
                </div>
                <ContactForm />
              </div>

              {/* ── Info ── */}
              <aside className="contact-info">
                <div className="contact-info-card">
                  <div className="contact-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Adresa</h4>
                    <p>NOVARIS TECH d.o.o.</p>
                    <p>Reisnerova ulica 91A</p>
                    <p>31000 Osijek, Hrvatska</p>
                    <p style={{ marginTop: 4, color: '#8fa3be', fontSize: 13 }}>OIB: 23096866887</p>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <h4>E-mail</h4>
                    <a href="mailto:info@novaristech.hr">info@novaristech.hr</a>
                  </div>
                </div>

                <div className="contact-info-card">
                  <div className="contact-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Radno vrijeme</h4>
                    <p>Ponedjeljak – Petak</p>
                    <p>08:00 – 16:00 h</p>
                    <p style={{ marginTop: 6, color: '#1596ff', fontWeight: 600, fontSize: 13 }}>
                      Remote support — 0–24
                    </p>
                  </div>
                </div>

                <div className="contact-info-card contact-info-response">
                  <div className="contact-info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Odgovor na upit</h4>
                    <p style={{ fontSize: 20, fontWeight: 800, color: '#061127', lineHeight: 1.2 }}>
                      Unutar 1 sata
                    </p>
                    <p style={{ marginTop: 4, fontSize: 13, color: '#67738a' }}>
                      Za hitne intervencije odgovaramo odmah.
                    </p>
                  </div>
                </div>
              </aside>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
