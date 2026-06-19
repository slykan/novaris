const industries = [
  {
    icon: <path d="M24 5 11 25h10l-4 18 20-25H26l4-13Z" />,
    title: 'Telekomunikacije',
  },
  {
    icon: <path d="M8 40V18l16-10 16 10v22M6 40h36M15 40V24M24 40V24M33 40V24" />,
    title: 'Energetika',
  },
  {
    icon: <path d="M9 18h30M13 18V40M35 18V40M7 40h34M24 8l17 10H7L24 8ZM20 40V28h8v12" />,
    title: 'Javni sektor i financije',
  },
]

const results = [
  { value: '30+', label: 'godina iskustva', icon: <path d="M12 34 34 12M20 12h14v14" /> },
  { value: '50+', label: 'zadovoljnih klijenata', icon: <path d="M24 8a16 16 0 1 1 0 32 16 16 0 0 1 0-32ZM24 16v9l6 4" /> },
  { value: '110+', label: 'stručnjaka u timu', icon: <path d="M24 6 10 12v11c0 9 5.8 15.4 14 19 8.2-3.6 14-10 14-19V12L24 6Z M18 24l4 4 8-9" /> },
  { value: '200+', label: 'certifikata', icon: <path d="M10 38V26M20 38V16M30 38V22M40 38V10" /> },
]

export default function Industries() {
  return (
    <section className="section light industries-section" id="industries">
      <div className="industries-results">
        <div className="industries-panel">
          <div className="section-heading compact-heading">
            <p className="label">Industrije</p>
            <h2>Rješenja prilagođena vašem sektoru</h2>
          </div>

          <div className="industry-strip" aria-label="Industrije">
            {industries.map((ind) => (
              <article key={ind.title} className="industry-item">
                <svg viewBox="0 0 48 48" aria-hidden="true">{ind.icon}</svg>
                <h3>{ind.title}</h3>
              </article>
            ))}
          </div>
        </div>

        <aside className="results-card">
          <p className="label">Rezultati koje donosimo</p>
          <h2>Mjerljivi rezultati. Stvarna vrijednost.</h2>
          <div className="results-grid">
            {results.map((item) => (
              <article key={item.label}>
                <svg viewBox="0 0 48 48" aria-hidden="true">{item.icon}</svg>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
