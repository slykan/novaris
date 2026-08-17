import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { p } from '@/lib/path'

export const metadata: Metadata = {
  title: 'O nama',
  description: 'Novaris Tech je moderna business-tech kompanija koja pomaže organizacijama u digitalizaciji poslovanja, optimizaciji IT infrastrukture i povećanju sigurnosti informacijskih sustava.',
  keywords: ['Novaris Tech', 'IT tvrtka Osijek', 'digitalna transformacija', 'o nama', 'misija', 'vizija', 'cyber sigurnost', 'IT infrastruktura'],
  openGraph: {
    title: 'O nama – Novaris Tech',
    description: 'Moderna business-tech kompanija koja pomaže organizacijama u digitalizaciji poslovanja, optimizaciji IT infrastrukture i povećanju sigurnosti.',
    url: 'https://novaristech.hr/o-nama',
  },
  alternates: { canonical: 'https://novaristech.hr/o-nama' },
}

export default function ONama() {
  return (
    <>
      <header className="hero on-page-hero" id="home">
        <Nav />
        <img src={p('/kontakt_hero_5.png')} alt="" aria-hidden="true" className="hero-bg-image" />
        <div className="hero-grid page-hero-grid page-hero-grid-single">
          <div>
            <p className="eyebrow"><span />01 – Tko smo mi</p>
            <h1>Novaris <em>Tech</em></h1>
            <p className="hero-lead">
              Moderna business-tech kompanija koja pomaže organizacijama u digitalizaciji
              poslovanja, optimizaciji IT infrastrukture i povećanju sigurnosti informacijskih sustava.
            </p>
            <p className="hero-lead" style={{ marginTop: 12 }}>
              Naš cilj nije samo implementirati tehnologiju, već stvoriti stvarnu poslovnu
              vrijednost kroz pouzdana, sigurna i skalabilna rješenja.
            </p>
            <div className="about-focus-tags">
              {['Digitalna transformacija', 'IT infrastruktura', 'Cyber sigurnost', 'Automatizacija procesa', 'Poslovna podrška'].map((tag) => (
                <span key={tag} className="svc-remote-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main>

        {/* ── 02 MISIJA ── */}
        <section className="light mv-section">
          <div className="section mv-inner">
            <div className="mv-bg-number" aria-hidden="true">02</div>
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
                    &ldquo;Tehnologiju pretvaramo u poslovne rezultate.&rdquo;
                  </p>
                </div>
              </div>

              <div className="mv-content">
                <div className="mv-badge">
                  <span className="mv-num">02</span>
                  <span className="mv-label-text">Naša misija</span>
                </div>
                <h2>Tehnologiju pretvaramo u poslovne rezultate</h2>
                <p className="mv-text">Pomažemo tvrtkama da:</p>
                <div className="mv-pillars">
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
                <p className="mv-text" style={{ marginTop: 28 }}>
                  Ne prodajemo tehnologiju.<br />
                  Implementiramo rješenja koja stvaraju konkretan učinak na poslovanje.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 03 VIZIJA ── */}
        <section className="dark mv-section">
          <div className="section mv-inner">
            <div className="mv-bg-number mv-bg-number-right" aria-hidden="true">03</div>
            <div className="mv-grid mv-grid-reverse">
              <div className="mv-content">
                <div className="mv-badge mv-badge-dark">
                  <span className="mv-num">03</span>
                  <span className="mv-label-text">Vizija</span>
                </div>
                <h2>Naša vizija</h2>
                <p className="mv-text mv-text-dark">
                  Postati vodeći regionalni business-tech partner za digitalnu transformaciju
                  organizacija u javnom i privatnom sektoru.
                </p>
                <p className="mv-text mv-text-dark">Gradimo dugoročna partnerstva temeljena na:</p>
                <div className="mv-pillars mv-pillars-dark">
                  {[
                    'Stručnosti',
                    'Povjerenju',
                    'Inovacijama',
                    'Odgovornosti',
                    'Mjerljivim rezultatima',
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
                    &ldquo;Vodeći regionalni business-tech partner.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 ŠTO RADIMO ── */}
        <section className="light">
          <div className="section">
            <div className="svc-cat-header" style={{ textAlign: 'center', maxWidth: 600, marginInline: 'auto' }}>
              <p className="label">04 – Ključna područja</p>
              <h2>Što radimo</h2>
            </div>
            <div className="about-areas-grid">
              <div className="about-area-card">
                <div className="about-area-icon">
                  <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </div>
                <h3>Digitalizacija poslovanja</h3>
                <ul className="about-area-list">
                  <li>Integracije sustava</li>
                  <li>Automatizacija procesa</li>
                  <li>AI rješenja</li>
                  <li>Digitalni workflow</li>
                </ul>
              </div>
              <div className="about-area-card">
                <div className="about-area-icon">
                  <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                  </svg>
                </div>
                <h3>IT infrastruktura i cloud</h3>
                <ul className="about-area-list">
                  <li>Cloud migracije</li>
                  <li>Server infrastruktura</li>
                  <li>Microsoft 365</li>
                  <li>Upravljanje sustavima</li>
                </ul>
              </div>
              <div className="about-area-card">
                <div className="about-area-icon">
                  <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3>Cyber sigurnost</h3>
                <ul className="about-area-list">
                  <li>Firewall sustavi</li>
                  <li>Antivirus zaštita</li>
                  <li>Backup i Disaster Recovery</li>
                  <li>Sigurnosni auditi</li>
                </ul>
              </div>
              <div className="about-area-card">
                <div className="about-area-icon">
                  <svg viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" fill="none">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
                    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                  </svg>
                </div>
                <h3>Managed IT Services</h3>
                <ul className="about-area-list">
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
            <div className="about-process-grid">
              {[
                { num: '01', title: 'Analiza', desc: 'Pregled postojećeg stanja i poslovnih potreba.' },
                { num: '02', title: 'Audit', desc: 'Identifikacija rizika i prilika za unapređenje.' },
                { num: '03', title: 'Implementacija', desc: 'Uvođenje rješenja uz minimalan utjecaj na poslovanje.' },
                { num: '04', title: 'Podrška', desc: 'Kontinuirano praćenje, razvoj i optimizacija.' },
              ].map((step) => (
                <div key={step.num} className="about-process-step">
                  <div className="about-process-num">{step.num}</div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 06 BESPLATNI IT AUDIT ── */}
        <section className="light">
          <div className="section">
            <div className="svc-remote">
              <div className="svc-remote-body">
                <p className="label" style={{ marginBottom: 18 }}>06 – Besplatni IT Audit</p>
                <h2>Početak svake suradnje</h2>
                <p className="svc-remote-desc">Pregledavamo:</p>
                <div className="mv-pillars" style={{ marginTop: 20 }}>
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
                <p className="svc-remote-desc" style={{ marginTop: 24 }}>
                  Nakon analize klijent dobiva jasan izvještaj s preporukama za poboljšanje.
                </p>
              </div>
              <div className="svc-remote-orb" aria-hidden="true">
                <svg viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ── 07 ZAŠTO NOVARIS TECH ── */}
        <section className="dark">
          <div className="section">
            <div className="svc-cat-header" style={{ textAlign: 'center', maxWidth: 600, marginInline: 'auto' }}>
              <p className="label">07 – Zašto mi</p>
              <h2>Zašto Novaris Tech</h2>
            </div>
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
        </section>

        {/* ── 08 INDUSTRIJE ── */}
        <section className="light">
          <div className="section">
            <div className="svc-cat-header" style={{ textAlign: 'center', maxWidth: 600, marginInline: 'auto' }}>
              <p className="label">08 – Industrije</p>
              <h2>Radimo s organizacijama iz sektora</h2>
            </div>
            <div className="about-industries-grid">
              {[
                { emoji: '🏭', label: 'Industrija' },
                { emoji: '⚡', label: 'Energetika' },
                { emoji: '🏢', label: 'Javna uprava' },
                { emoji: '🚛', label: 'Logistika i promet' },
                { emoji: '🏥', label: 'Zdravstvo' },
                { emoji: '💼', label: 'Mala i srednja poduzeća' },
              ].map((ind) => (
                <div key={ind.label} className="about-industry-item">
                  <span className="about-industry-emoji">{ind.emoji}</span>
                  <span className="about-industry-label">{ind.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 09 PARTNERSTVA ── */}
        <section className="dark">
          <div className="section">
            <div className="svc-cat-header" style={{ textAlign: 'center', maxWidth: 660, marginInline: 'auto' }}>
              <p className="label">09 – Snaga suradnje</p>
              <h2>Partnerstva</h2>
              <p className="svc-cat-lead svc-cat-lead-dark" style={{ marginInline: 'auto' }}>
                Novaris Tech razvija mrežu strateških partnerstava kako bi klijentima
                pružio cjelovita i kvalitetna rješenja.
              </p>
            </div>
            <div className="about-focus-tags" style={{ justifyContent: 'center', marginTop: 8 }}>
              {['ERP i poslovni sustavi', 'Digitalizacija procesa', 'Cloud rješenja', 'IT infrastruktura', 'Cyber sigurnost'].map((tag) => (
                <span key={tag} className="svc-remote-tag">{tag}</span>
              ))}
            </div>
            <p className="about-partners-note">Partnerski logotipi uskoro.</p>
          </div>
        </section>

        {/* ── 10 CTA ── */}
        <section className="light">
          <div className="section mv-cta-section">
            <div className="mv-cta-inner">
              <p className="label" style={{ marginBottom: 16 }}>Smart Solutions. Real Impact.</p>
              <h2 className="mv-cta-heading">Vaš partner u digitalnoj transformaciji poslovanja</h2>
              <div className="about-cta-info">
                <span>📍 Osijek, Hrvatska</span>
                <span>🌐 novaristech.hr</span>
                <span>✉️ info@novaristech.hr</span>
              </div>
              <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 36 }}>
                <a className="button primary" href="/kontakt">
                  Kontaktirajte nas <span aria-hidden="true">→</span>
                </a>
                <a className="button secondary" href="/usluge">
                  Pogledajte usluge <span aria-hidden="true">→</span>
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
