import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { p } from '@/lib/path'

export const metadata: Metadata = {
  title: 'O nama',
  description: 'Upoznajte Novaris Tech – modernu IT tvrtku iz Osijeka. Naša misija, vizija i vrijednosti koje nas vode u izgradnji sigurnih i skalabilnih digitalnih rješenja.',
  keywords: ['Novaris Tech', 'IT tvrtka Osijek', 'digitalna transformacija', 'o nama', 'misija', 'vizija'],
  openGraph: {
    title: 'O nama – Novaris Tech',
    description: 'Upoznajte Novaris Tech – modernu IT tvrtku iz Osijeka. Naša misija, vizija i vrijednosti.',
    url: 'https://novaristech.hr/o-nama',
  },
  alternates: { canonical: 'https://novaristech.hr/o-nama' },
}

export default function ONama() {
  return (
    <>
      <header className="hero on-page-hero" id="home">
        <Nav />
        <div className="hero-grid page-hero-grid">
          <div>
            <p className="eyebrow"><span />O nama</p>
            <h1>Tko smo <em>Novaris Tech</em></h1>
            <p className="hero-lead">
              Moderna tehnološka kompanija koja spaja poslovanje i digitalne inovacije.
              Gradimo partnerstva, isporučujemo rezultate i stvaramo dugoročnu vrijednost za naše klijente.
            </p>
          </div>
          <div className="page-hero-orb" aria-hidden="true">
            <div className="orb-logo orb-static">
              <img src={p('/logo_small1.png')} alt="" className="logo-mark" />
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ── MISIJA ── */}
        <section className="light mv-section">
          <div className="section mv-inner">
            <div className="mv-bg-number" aria-hidden="true">01</div>
            <div className="mv-grid">
              <div className="mv-visual">
                <div className="mv-icon-wrap">
                  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <circle cx="32" cy="32" r="28" />
                    <circle cx="32" cy="32" r="16" />
                    <circle cx="32" cy="32" r="5" />
                    <line x1="32" y1="4" x2="32" y2="14" />
                    <line x1="32" y1="50" x2="32" y2="60" />
                    <line x1="4" y1="32" x2="14" y2="32" />
                    <line x1="50" y1="32" x2="60" y2="32" />
                  </svg>
                </div>
                <div className="mv-connector">
                  <div className="mv-connector-dot" />
                  <div className="mv-connector-line" />
                  <div className="mv-connector-dot" />
                </div>
                <div className="mv-card-accent">
                  <span className="mv-card-tag">Misija</span>
                  <p className="mv-card-quote">
                    "Pouzdan oslonac u procesu digitalne transformacije."
                  </p>
                </div>
              </div>

              <div className="mv-content">
                <div className="mv-badge">
                  <span className="mv-num">01</span>
                  <span className="mv-label-text">Misija</span>
                </div>
                <h2>Naša misija</h2>
                <p className="mv-text">
                  Naša misija je povezati poslovanje i tehnologiju kroz moderna, sigurna i skalabilna
                  digitalna rješenja koja unapređuju način rada tvrtki i stvaraju dugoročnu poslovnu
                  vrijednost.
                </p>
                <p className="mv-text">
                  Kroz stručnu podršku, kvalitetnu implementaciju i partnerski odnos s klijentima
                  želimo biti pouzdan oslonac u procesu digitalne transformacije i razvoja poslovanja.
                </p>
                <div className="mv-pillars">
                  {[
                    'Moderna i skalabilna rješenja',
                    'Sigurnost i pouzdanost',
                    'Partnerski pristup klijentima',
                    'Dugoročna poslovna vrijednost',
                  ].map((item) => (
                    <div key={item} className="mv-pillar">
                      <span className="mv-check" aria-hidden="true">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── VIZIJA ── */}
        <section className="dark mv-section">
          <div className="section mv-inner">
            <div className="mv-bg-number mv-bg-number-right" aria-hidden="true">02</div>
            <div className="mv-grid mv-grid-reverse">
              <div className="mv-content">
                <div className="mv-badge mv-badge-dark">
                  <span className="mv-num">02</span>
                  <span className="mv-label-text">Vizija</span>
                </div>
                <h2>Naša vizija</h2>
                <p className="mv-text mv-text-dark">
                  Vizija Novaris Techa je izgraditi modernu tehnološku kompaniju koja će biti
                  prepoznata po kvaliteti usluge, profesionalnom pristupu i stvaranju konkretnih
                  poslovnih rezultata za svoje klijente.
                </p>
                <p className="mv-text mv-text-dark">
                  Dugoročno želimo razvijati snažnu mrežu partnerstava, širiti prisutnost na
                  regionalnom tržištu i postati sinonim za pouzdana i moderna business-tech rješenja.
                </p>
                <div className="mv-pillars mv-pillars-dark">
                  {[
                    'Regionalna prisutnost i rast',
                    'Mreža strateških partnerstava',
                    'Prepoznatljivost po kvaliteti',
                    'Business-tech sinonim',
                  ].map((item) => (
                    <div key={item} className="mv-pillar mv-pillar-dark">
                      <span className="mv-check" aria-hidden="true">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mv-visual">
                <div className="mv-icon-wrap mv-icon-wrap-dark">
                  <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M32 8 L56 20 L56 44 L32 56 L8 44 L8 20 Z" />
                    <path d="M32 20 L44 26 L44 38 L32 44 L20 38 L20 26 Z" />
                    <circle cx="32" cy="32" r="5" />
                  </svg>
                </div>
                <div className="mv-connector mv-connector-dark">
                  <div className="mv-connector-dot mv-connector-dot-dark" />
                  <div className="mv-connector-line mv-connector-line-dark" />
                  <div className="mv-connector-dot mv-connector-dot-dark" />
                </div>
                <div className="mv-card-accent mv-card-accent-dark">
                  <span className="mv-card-tag">Vizija</span>
                  <p className="mv-card-quote">
                    "Sinonim za pouzdana i moderna business-tech rješenja."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="light">
          <div className="section mv-cta-section">
            <div className="mv-cta-inner">
              <p className="label" style={{ marginBottom: 16 }}>Surađujmo</p>
              <h2 className="mv-cta-heading">Postanite naš partner u digitalnoj transformaciji</h2>
              <p className="mv-cta-sub">
                Kontaktirajte nas i saznajte kako Novaris Tech može unaprijediti vaše poslovanje.
              </p>
              <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 36 }}>
                <a className="button primary" href="/#contact">
                  Zatražite ponudu <span aria-hidden="true">→</span>
                </a>
                <a className="button secondary" href="/#services">
                  Pogledajte portfolio <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
