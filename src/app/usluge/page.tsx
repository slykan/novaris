import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { p } from '@/lib/path'

export const metadata: Metadata = {
  title: 'Usluge',
  description: 'Web i software development, mobilne aplikacije, VPS serveri, firewall, antivirus, backup, grafički dizajn, knjiga standarda i remote IT podrška – sve na jednom mjestu.',
  keywords: ['web development', 'software development', 'VPS server', 'managed VPS', 'mail server', 'firewall', 'antivirus', 'backup', 'grafički dizajn', 'remote podrška', 'IT usluge Osijek'],
  openGraph: {
    title: 'Usluge – Novaris Tech',
    description: 'Web development, serveri, IT zaštita, grafički dizajn i remote podrška. Kompletna IT rješenja za vaše poslovanje.',
    url: 'https://novaristech.hr/usluge',
  },
  alternates: { canonical: 'https://novaristech.hr/usluge' },
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function IconCode() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function IconSmartphone() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  )
}

function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function IconServer() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  )
}

function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function IconSliders() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function IconFirewall() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <path d="M9 8h1M12 8h1M15 8h1M9 11h1M12 11h1M15 11h1" strokeLinecap="round" />
    </svg>
  )
}

function IconBug() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <path d="M12 19c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z" />
      <path d="M12 20v-9" />
      <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
      <path d="M6 13H2" />
      <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
      <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
      <path d="M22 13h-4" />
      <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
  )
}

function IconDatabase() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  )
}

function IconPenTool() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  )
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function IconHeadphones() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" fill="none">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  )
}

type CardProps = { icon: React.ReactNode; title: string; desc: string; dark?: boolean }

function SvcCard({ icon, title, desc, dark }: CardProps) {
  return (
    <div className={`svc-card${dark ? ' svc-card-dark' : ''}`}>
      <div className={`svc-icon${dark ? ' svc-icon-dark' : ''}`}>{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

export default function Usluge() {
  return (
    <>
      <header className="hero on-page-hero" id="home">
        <Nav />
        <img src={p('/kontakt_hero_5.png')} alt="" aria-hidden="true" className="hero-bg-image" />
        <div className="hero-grid page-hero-grid page-hero-grid-single">
          <div>
            <p className="eyebrow"><span />Usluge</p>
            <h1>Što sve <em>Novaris Tech</em> nudi</h1>
            <p className="hero-lead">
              Od razvoja softvera i serverske infrastrukture do zaštite podataka, grafičkog dizajna
              i brze remote podrške – pokrivamo sve što Vaše poslovanje treba u digitalnom svijetu.
            </p>
          </div>
        </div>
      </header>

      <main>

        {/* ── 01 DEVELOPMENT ── */}
        <section className="light">
          <div className="section">
            <div className="svc-cat-layout">
              <div className="svc-cat-header">
                <p className="label">01 – Razvoj</p>
                <h2>Development</h2>
                <p className="svc-cat-lead">
                  Gradimo moderne digitalne proizvode – od ideje do finalnog rješenja prilagođenog
                  Vašem poslovanju. Koristimo provjerene tehnologije i agilne procese kako bismo
                  isporučili kvalitetan softver u dogovorenom roku.
                </p>
              </div>
              <div className="svc-grid">
                <SvcCard
                  icon={<IconGlobe />}
                  title="Web Development"
                  desc="Dizajniramo i razvijamo brze i vizualno dojmljive web stranice i aplikacije. Svaki projekt gradimo s fokusom na performanse, korisničko iskustvo i dugoročno održavanje."
                />
                <SvcCard
                  icon={<IconCode />}
                  title="Software Development"
                  desc="Prilagođeni softverski sustavi za automatizaciju poslovnih procesa, integraciju sustava i digitalnu transformaciju Vaše organizacije – od arhitekture do produkcijske isporuke."
                />
                <SvcCard
                  icon={<IconSmartphone />}
                  title="Mobile Development"
                  desc="Native mobilne aplikacije za iOS i Android korisnike. Intuitivno korisničko sučelje, visoke performanse i pouzdana sinkronizacija s Vašim backend sustavima."
                />
                <SvcCard
                  icon={<IconSettings />}
                  title="Custom Made"
                  desc="Svaki projekt tretiramo kao jedinstven izazov. Gradimo rješenja točno po Vašim zahtjevima, bez kompromisa, bez generičkih predložaka i bez tehničkih ograničenja."
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 02 SERVER ── */}
        <section className="dark">
          <div className="section">
            <div className="svc-cat-layout">
              <div className="svc-cat-header">
                <p className="label">02 – Infrastruktura</p>
                <h2>Server</h2>
                <p className="svc-cat-lead svc-cat-lead-dark">
                  Pouzdana, sigurna i skalabilna serverska infrastruktura prilagođena potrebama
                  Vašeg poslovanja. Od postavljanja do dugoročnog upravljanja i optimizacije.
                </p>
              </div>
              <div className="svc-grid">
                <SvcCard
                  dark
                  icon={<IconServer />}
                  title="Web Server"
                  desc="Postavljanje, konfiguracija i optimizacija web servera visoke dostupnosti za Vaše web stranice i aplikacije. Brzo, sigurno i stabilno u svakom trenutku."
                />
                <SvcCard
                  dark
                  icon={<IconShield />}
                  title="VPS Managed"
                  desc="Prepustite nam upravljanje Vašim VPS-om. Brinemo se o ažuriranjima, sigurnosti i performansama dok ste Vi fokusirani na ono što je bitno za Vaše poslovanje."
                />
                <SvcCard
                  dark
                  icon={<IconSliders />}
                  title="VPS Fully Custom Managed"
                  desc="Potpuno prilagođeno i upravljano VPS okruženje. Od inicijalne arhitekture do svakodnevnog nadzora, optimizacije i intervencija u skladu s Vašim specifičnim zahtjevima."
                />
                <SvcCard
                  dark
                  icon={<IconMail />}
                  title="Mail Server"
                  desc="Sigurni, pouzdani i anti-spam zaštićeni mail serveri za Vaše poslovanje. Vlastiti domain sa potpunom kontrolom nad podacima, bez ovisnosti o trećim stranama."
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 03 ZAŠTITA ── */}
        <section className="light">
          <div className="section">
            <div className="svc-cat-layout">
              <div className="svc-cat-header">
                <p className="label">03 – Sigurnost</p>
                <h2>Zaštita</h2>
                <p className="svc-cat-lead">
                  Višeslojna sigurnosna rješenja koja štite Vaše podatke, sustave i poslovne procese
                  od modernih prijetnji. Prevencija uvijek košta manje od oporavka.
                </p>
              </div>
              <div className="svc-grid svc-grid-3">
                <SvcCard
                  icon={<IconFirewall />}
                  title="Firewall – interni i eksterni"
                  desc="Implementacija i upravljanje firewall rješenjima na više razina. Zaštita perimetra od vanjskih prijetnji i segmentacija interne mreže. Nadzor i kontrola prometa u realnom vremenu, 24/7."
                />
                <SvcCard
                  icon={<IconBug />}
                  title="Antivirus rješenja"
                  desc="Sveobuhvatna antivirusna zaštita za poslovne sustave i servere. Automatsko ažuriranje, centralno upravljanje politikama i detaljni sigurnosni izvještaji."
                />
                <SvcCard
                  icon={<IconDatabase />}
                  title="Backup – lokalni i cloud, 3 lokacije"
                  desc="Automatizirani backup podataka na tri geografski odvojena mjesta: lokalno + dvije cloud lokacije. Garantirani oporavak podataka u slučaju incidenta, ransomware napada ili kvara hardwarea."
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 04 DIZAJN ── */}
        <section className="dark">
          <div className="section">
            <div className="svc-cat-layout">
              <div className="svc-cat-header">
                <p className="label">04 – Vizualni identitet</p>
                <h2>Dizajn i brand</h2>
                <p className="svc-cat-lead svc-cat-lead-dark">
                  Vizualni identitet koji komunicira vrijednosti Vaše tvrtke i ostavlja trajan dojam
                  na svakom koraku – od digital do tiska.
                </p>
              </div>
              <div className="svc-grid svc-grid-2">
                <SvcCard
                  dark
                  icon={<IconPenTool />}
                  title="Grafički dizajn"
                  desc="Dizajn logotipa, UI/UX rješenja, marketinških materijala, prezentacija, bannera i svega što Vaš brand treba da bi izgledao profesionalno i prepoznatljivo na svakom kanalu komunikacije."
                />
                <SvcCard
                  dark
                  icon={<IconBook />}
                  title="Knjiga standarda"
                  desc="Kompletan brand katalog koji precizno definira Vaš vizualni identitet – boje, tipografija, logotip, primjene i pravila upotrebe. Čvrsti temelj konzistentnog i snažnog branda koji raste s Vama."
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 05 REMOTE SUPPORT ── */}
        <section className="light">
          <div className="section">
            <div className="svc-remote">
              <div className="svc-remote-body">
                <p className="label" style={{ marginBottom: 18 }}>05 – Podrška</p>
                <h2>Remote Support</h2>
                <p className="svc-remote-desc">
                  Brza i profesionalna tehnička podrška na daljinu za svu IT problematiku –
                  od softverskih poteškoća i konfiguracije sustava do mrežnih problema,
                  optimizacije radnih okruženja i hitnih intervencija.
                </p>
                <p className="svc-remote-desc" style={{ marginTop: 12 }}>
                  Bez čekanja, bez nepotrebnih dolaska na teren, bez gubitka radnog vremena.
                  Naš tim reagira brzo, komunikacija je jasna, a svaki problem rješavamo temeljito
                  kako bi Vaši sustavi i timovi funkcionirali besprijekorno.
                </p>
                <div className="svc-remote-tags">
                  {[
                    'Brza reakcija',
                    'Sve platforme',
                    'Sigurna veza',
                    'Praćenje ticketa',
                    'Redovna izvješća',
                  ].map((tag) => (
                    <span key={tag} className="svc-remote-tag">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="svc-remote-orb" aria-hidden="true">
                <IconHeadphones />
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="light">
          <div className="section mv-cta-section">
            <div className="mv-cta-inner">
              <p className="label" style={{ marginBottom: 16 }}>Surađujmo</p>
              <h2 className="mv-cta-heading">Trebate više informacija o nekoj usluzi?</h2>
              <p className="mv-cta-sub">
                Kontaktirajte nas i zajedno ćemo pronaći pravo rješenje za Vaše poslovne potrebe.
                Bez obveze, bez složenih procedura, samo konkretan razgovor!
              </p>
              <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 36 }}>
                <a className="button primary" href="/#contact">
                  Zatražite ponudu <span aria-hidden="true">→</span>
                </a>
                <a className="button secondary" href="/o-nama">
                  Saznajte više o nama <span aria-hidden="true">→</span>
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
