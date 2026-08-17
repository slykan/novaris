const industries = [
  {
    icon: <path d="M24 5 11 25h10l-4 18 20-25H26l4-13Z" />,
    title: 'Energetika',
    desc: 'Digitaliziramo energetske procese, poboljšavamo pouzdanost i pračenje energetskih bukvešnosti.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1d?w=800&h=600&fit=crop',
  },
  {
    icon: <path d="M9 18h30M13 18V40M35 18V40M7 40h34M24 8l17 10H7L24 8ZM20 40V28h8v12" />,
    title: 'Javni sektor',
    desc: 'Digitaliziramo usluge i procese te poboljšavamo transparentnost i brzoprenost.',
    image: 'https://images.unsplash.com/photo-1521732761447-fad9c6c65e3a?w=800&h=600&fit=crop',
  },
  {
    icon: <path d="M12 8c-2.2 0-4 1.8-4 4v24c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4V12c0-2.2-1.8-4-4-4H12Zm0 6h24v20H12V14Zm6 4h4v2h-4v-2Zm6 0h4v2h-4v-2Zm6 0h4v2h-4v-2Zm-12 6h4v2h-4v-2Zm6 0h4v2h-4v-2Zm6 0h4v2h-4v-2Z" />,
    title: 'Zdravstvo',
    desc: 'Sigurnost podataka i učinkovitost zdravstvenih ustanova u prioritetu.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
  },
  {
    icon: <path d="M6 12h12v24H6V12Zm16-4h12v28H22V8Z" />,
    title: 'Financije',
    desc: 'Pravilno analitika i digitalni servisi za financijske institucije.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
  },
  {
    icon: <path d="M24 5 11 25h10l-4 18 20-25H26l4-13Z" />,
    title: 'Telekomunikacije',
    desc: 'Omogućujemo pouzdan transformaciju infrastrukture i digitalnih servisa.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06628ca504d?w=800&h=600&fit=crop',
  },
  {
    icon: <path d="M8 40V18l16-10 16 10v22M6 40h36M15 40V24M24 40V24M33 40V24" />,
    title: 'Bankarstvo',
    desc: 'Unapređujemo sigurnost i moderni standarde strukture.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
  },
  {
    icon: <path d="M12 28v-5a12 12 0 0 1 24 0v5M18 20a2 2 0 0 1 4 0v8a2 2 0 0 1-4 0V20Zm6 2a2 2 0 0 1 4 0v6a2 2 0 0 1-4 0V22Z" />,
    title: 'Industrija i proizvodnja',
    desc: 'Pospješavamo proizvodnost, smanjujemo gubitke i optimiziramo procesne tok.',
    image: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=600&fit=crop',
  },
  {
    icon: <path d="M8 16h28v16H8V16Zm28-8h4v28h-4V8Zm-36 8h4v20H0V16Zm8-8h8v36h-8V8Z" />,
    title: 'Logistika i transport',
    desc: 'Optimiziramo lance dostave i poboljšavamo praksoljevost i trasportnih procesa.',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop',
  },
]

const whyUs = [
  {
    title: 'Pouzdan partner',
    desc: 'Dugoročna suradnja umjesto jednokratnih rješenja.',
    icon: <path d="M24 6 10 12v11c0 9 5.8 15.4 14 19 8.2-3.6 14-10 14-19V12L24 6Z" />,
  },
  {
    title: 'Brza reakcija',
    desc: 'Odgovor i podrška kada smo najpotrebniji.',
    icon: <path d="M24 8a16 16 0 1 1 0 32 16 16 0 0 1 0-32ZM24 16v9l6 4" />,
  },
  {
    title: 'Sigurnost',
    desc: 'Zaštita poslovnih podataka i sustava.',
    icon: <><path d="M20 24l4 4 8-9" /><rect x="8" y="12" width="32" height="28" rx="3" /><path d="M16 12V9a8 8 0 0 1 16 0v3" /></>,
  },
  {
    title: 'Poslovni pristup',
    desc: 'Razumijemo procese, ne samo tehnologiju.',
    icon: <path d="M12 34 34 12M20 12h14v14" />,
  },
]

export default function Industries() {
  return (
    <section className="section light industries-section" id="industries">
      <div className="industries-header">
        <p className="label">Industrije</p>
        <h2>Rješenja prilagođena vašem sektoru</h2>
      </div>

        <div className="industries-grid" aria-label="Industrije">
          {industries.map((ind, idx) => (
            <article 
              key={ind.title} 
              className="industry-card"
              style={{
                backgroundImage: `url('${ind.image}')`,
                backgroundColor: getIndustryColor(idx),
              }}
            >
              <div className="industry-card-overlay"></div>
              <div className="industry-card-inner">
                <svg viewBox="0 0 48 48" aria-hidden="true" className="industry-icon">{ind.icon}</svg>
                <h3>{ind.title}</h3>
                <p>{ind.desc}</p>
              </div>
            </article>
          ))}
        </div>
    </section>
  )
}

function getIndustryColor(index: number): string {
  const colors = [
    '#1e3c72',
    '#1e3c72',
    '#1e3c72',
    '#1e3c72',
    '#0f1a35',
    '#0f1a35',
    '#0f1a35',
    '#0f1a35',
  ]
  return colors[index] || '#1e3c72'
}
