import type { Metadata } from 'next'
import { Fragment } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { p } from '@/lib/path'

export const metadata: Metadata = {
  title: 'Novaris 360',
  description: 'Novaris 360 – cjeloviti pristup koji pokriva sve faze digitalne transformacije, od analize do kontinuiranog unaprjeđenja.',
  keywords: ['Novaris 360', 'digitalna transformacija', 'IT audit', 'Novaris Tech Osijek'],
  openGraph: {
    title: 'Novaris 360 – Novaris Tech',
    description: 'Cjeloviti pristup koji pokriva sve faze digitalne transformacije – od analize do kontinuiranog unaprjeđenja.',
    url: 'https://novaristech.hr/novaris360',
  },
  alternates: { canonical: 'https://novaristech.hr/novaris360' },
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

function IconShare() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <line x1="8.3" y1="10.8" x2="15.7" y2="7.2" />
      <line x1="8.3" y1="13.2" x2="15.7" y2="16.8" />
    </svg>
  )
}

function IconPerson() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  )
}

function IconChartUp() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="14 7 21 7 21 14" />
    </svg>
  )
}

const wheelSteps = [
  { num: '1', title: 'Audit', desc: 'Analiziramo trenutno stanje i definiramo prilike.', pos: 'pos-tl', icon: <IconSearch /> },
  { num: '2', title: 'Strategija', desc: 'Definiramo smjer i plan za ostvarenje ciljeva.', pos: 'pos-tr', icon: <IconTarget /> },
  { num: '3', title: 'Implementacija', desc: 'Pružamo tehnološka rješenja i upravljamo projektom.', pos: 'pos-r', icon: <IconShare /> },
  { num: '4', title: 'Podrška', desc: 'Osiguravamo stabilnost, pouzdanost i edukaciju.', pos: 'pos-b', icon: <IconPerson /> },
  { num: '5', title: 'Unaprjeđenje', desc: 'Kontinuirano optimiziramo procese i tehnologije.', pos: 'pos-bl', icon: <IconChartUp /> },
]

export default function Novaris360() {
  return (
    <>
      <header className="hero n360-topbar" id="home">
        <Nav />
      </header>

      <main>

        {/* ── 01 TKO SMO MI / NOVARIS 360 ── */}
        <section className="light">
          <div className="section">
            <div className="n360-intro">
              <div className="n360-intro-body">
                <p className="label">01 – Tko smo mi</p>
                <h2>Novaris 360</h2>
                <p className="svc-cat-lead">
                  Cjeloviti pristup koji pokriva sve faze digitalne transformacije – od analize
                  do kontinuiranog unaprjeđenja.
                </p>
                <a className="button primary" href="/kontakt">
                  Saznajte više <span aria-hidden="true">→</span>
                </a>
              </div>

              <div className="n360-wheel" aria-hidden="true">
                <div className="n360-ring-halo" />
                <div className="n360-ring">
                  <img src={p('/logo_small1.png')} alt="" />
                  <strong>NOVARIS 360°</strong>
                </div>
                {wheelSteps.map((step) => (
                  <div key={step.num} className={`n360-icon-anchor ${step.pos}`}>
                    <div className="n360-node-icon">{step.icon}</div>
                  </div>
                ))}
                {wheelSteps.map((step) => (
                  <div key={step.num} className={`n360-text-anchor ${step.pos}`}>
                    <strong>{step.num}. {step.title}</strong>
                    <span>{step.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 MISIJA + 03 VIZIJA ── */}
        <section className="light">
          <div className="section">
            <div className="dual-panel-grid">
              <div className="dual-panel">
                <div className="n360-mv-row">
                  <div className="n360-mv-visual">
                    <div className="n360-mv-icon-wrap">
                      <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="12" cy="12" r="0.5" />
                      </svg>
                    </div>
                    <div className="mv-connector">
                      <div className="mv-connector-dot" />
                      <div className="mv-connector-line" />
                      <div className="mv-connector-dot" />
                    </div>
                    <div className="n360-mv-card-accent">
                      <span className="mv-card-tag">Naša misija</span>
                      <p className="mv-card-quote">
                        &ldquo;Tehnologiju pretvaramo u poslovne rezultate.&rdquo;
                      </p>
                    </div>
                  </div>
                  <div className="n360-mv-content">
                    <p className="label">02 – Naša misija</p>
                    <h2>Tehnologiju pretvaramo u poslovne rezultate</h2>
                    <p className="svc-remote-desc">Pomažemo tvrtkama da:</p>
                    <div className="mv-pillars" style={{ marginTop: 18 }}>
                      {[
                        'Rade učinkovitije',
                        'Smanje operativne troškove',
                        'Povećaju sigurnost podataka',
                        'Automatiziraju procese',
                        'Ubrzaju rast poslovanja',
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

              <div className="dual-panel">
                <div className="n360-mv-row">
                  <div className="n360-mv-visual">
                    <div className="n360-mv-icon-wrap">
                      <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <div className="mv-connector">
                      <div className="mv-connector-dot" />
                      <div className="mv-connector-line" />
                      <div className="mv-connector-dot" />
                    </div>
                    <div className="n360-mv-card-accent">
                      <span className="mv-card-tag">Naša vizija</span>
                      <p className="mv-card-quote">
                        &ldquo;Vodeći regionalni business-tech partner.&rdquo;
                      </p>
                    </div>
                  </div>
                  <div className="n360-mv-content">
                    <p className="label">03 – Naša vizija</p>
                    <h2>Naša vizija</h2>
                    <p className="svc-remote-desc">
                      Postati vodeći regionalni business-tech partner za digitalnu transformaciju
                      organizacija u javnom i privatnom sektoru.
                    </p>
                    <div className="mv-pillars" style={{ marginTop: 18 }}>
                      {[
                        'Stručnosti',
                        'Povjerenju',
                        'Inovacijama',
                        'Odgovornosti',
                        'Mjerljivim rezultatima',
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
            </div>
          </div>
        </section>

        {/* ── 04 ŠTO RADIMO ── */}
        <section className="light">
          <div className="section">
            <div className="svc-cat-header" style={{ textAlign: 'center', maxWidth: 600, marginInline: 'auto' }}>
              <p className="label">04 – Ključna ponuda</p>
              <h2>Što radimo</h2>
            </div>
            <div className="n360-areas-grid">
              <div className="n360-area-card">
                <div className="n360-panel-icon" style={{ marginBottom: 0 }}>
                  <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </div>
                <h3>Digitalizacija poslovanja</h3>
                <ul className="n360-area-list">
                  <li>Integracije sustava</li>
                  <li>Automatizacija procesa</li>
                  <li>AI rješenja</li>
                  <li>Digitalni workflow</li>
                </ul>
              </div>
              <div className="n360-area-card">
                <div className="n360-panel-icon" style={{ marginBottom: 0 }}>
                  <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                  </svg>
                </div>
                <h3>IT infrastruktura i cloud</h3>
                <ul className="n360-area-list">
                  <li>Cloud migracije</li>
                  <li>Server infrastruktura</li>
                  <li>Microsoft 365</li>
                  <li>Upravljanje sustavima</li>
                </ul>
              </div>
              <div className="n360-area-card">
                <div className="n360-panel-icon" style={{ marginBottom: 0 }}>
                  <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3>Cyber sigurnost</h3>
                <ul className="n360-area-list">
                  <li>Firewall sustavi</li>
                  <li>Antivirus zaštita</li>
                  <li>Backup i Disaster Recovery</li>
                  <li>Sigurnosni auditi</li>
                </ul>
              </div>
              <div className="n360-area-card">
                <div className="n360-panel-icon" style={{ marginBottom: 0 }}>
                  <svg viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" fill="none">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
                    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                </div>
                <h3>Managed IT Services</h3>
                <ul className="n360-area-list">
                  <li>Help Desk</li>
                  <li>Remote Support</li>
                  <li>Monitoring sustava</li>
                  <li>Upravljanje IT uslugama</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── 05 KAKO RADIMO ── */}
        <section className="dark">
          <div className="section">
            <div className="svc-cat-header" style={{ textAlign: 'center', maxWidth: 600, marginInline: 'auto' }}>
              <p className="label">05 – Jednostavan proces</p>
              <h2>Kako radimo</h2>
            </div>
            <div className="n360-process-row">
              {[
                { num: '01', title: 'Analiza', desc: 'Pregled postojećeg stanja i poslovnih potreba.' },
                { num: '02', title: 'Audit', desc: 'Identifikacija rizika i prilika za unapređenje.' },
                { num: '03', title: 'Implementacija', desc: 'Uvođenje rješenja uz minimalan utjecaj na poslovanje.' },
                { num: '04', title: 'Podrška', desc: 'Kontinuirano praćenje, razvoj i optimizacija.' },
              ].map((step, i, arr) => (
                <Fragment key={step.num}>
                  <div className="n360-process-step">
                    <div className="n360-process-num">{step.num}</div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="n360-process-dots" aria-hidden="true">
                      <span /><span /><span className="mid" /><span /><span />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ── 06 BESPLATNI IT AUDIT + 08 ZAŠTO MI ── */}
        <section className="light">
          <div className="section">
            <div className="dual-panel-grid">
              <div className="dual-panel">
                <p className="label">06 – Besplatni IT audit</p>
                <h2>Početak svake suradnje</h2>
                <p className="svc-remote-desc">Pregledavamo:</p>
                <div className="mv-pillars" style={{ marginTop: 18 }}>
                  {[
                    'IT infrastrukturu',
                    'Sigurnost sustava',
                    'Backup i oporavak',
                    'Cloud spremnost',
                    'Poslovne procese',
                  ].map((item) => (
                    <div key={item} className="mv-pillar">
                      <span className="mv-check" aria-hidden="true">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
                <p className="svc-remote-desc" style={{ marginTop: 20 }}>
                  Nakon analize klijent dobiva jasan izvještaj s preporukama za poboljšanje.
                </p>
              </div>

              <div className="dual-panel">
                <p className="label">08 – Zašto mi</p>
                <h2>Zašto Novaris Tech</h2>
                <div className="about-why-grid">
                  {[
                    { title: 'Pouzdan partner', desc: 'Dugoročna suradnja umjesto jednokratnih projekata.' },
                    { title: 'Brza reakcija', desc: 'Odgovor i podrška kada smo najpotrebniji.' },
                    { title: 'Sigurnost', desc: 'Zaštita poslovnih podataka i sustava.' },
                    { title: 'Poslovni pristup', desc: 'Razumijemo procese, ne samo tehnologiju.' },
                  ].map((item) => (
                    <div key={item.title} className="about-why-card">
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 09 PARTNERSTVA + CTA ── */}
        <section className="light">
          <div className="section">
            <div className="dual-panel-grid">
              <div className="dual-panel" style={{ textAlign: 'center' }}>
                <p className="label">09 – Snaga suradnje</p>
                <h2>Partnerstva</h2>
                <p className="svc-remote-desc" style={{ marginInline: 'auto' }}>
                  Novaris Tech razvija mrežu strateških partnerstava kako bi klijentima
                  pružio cjelovita i kvalitetna rješenja.
                </p>
                <div className="about-focus-tags" style={{ justifyContent: 'center', marginTop: 20 }}>
                  {['ERP i poslovni sustavi', 'Digitalizacija procesa', 'Cloud rješenja', 'IT infrastruktura', 'Cyber sigurnost'].map((tag) => (
                    <span key={tag} className="svc-remote-tag">{tag}</span>
                  ))}
                </div>
                <p className="about-partners-note" style={{ marginTop: 20, fontSize: 14 }}>Partnerski logotipi uskoro.</p>
              </div>

              <div className="dual-panel" style={{ textAlign: 'center' }}>
                <p className="label">Smart Solutions. Real Impact.</p>
                <h2>Vaš partner u digitalnoj transformaciji poslovanja</h2>
                <div className="about-cta-info" style={{ marginTop: 4 }}>
                  <span>📍 Osijek, Hrvatska</span>
                  <span>🌐 novaristech.hr</span>
                  <span>✉️ info@novaristech.hr</span>
                </div>
                <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 24 }}>
                  <a className="button primary" href="/kontakt">
                    Kontaktirajte nas <span aria-hidden="true">→</span>
                  </a>
                  <a className="button secondary" href="/usluge">
                    Usluge <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
