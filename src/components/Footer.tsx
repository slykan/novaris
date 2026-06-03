import Link from 'next/link'
import { p } from '@/lib/path'

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-grid">
        <Link className="brand" href="/" aria-label="Novaris Tech početna">
          <img src={p('/logo3_small.png')} alt="Novaris Tech" className="logo-footer" />
        </Link>
        <div>
          <h4>Portfolio</h4>
          <Link href="/#services">Integracije</Link>
          <Link href="/#services">Automatizacija</Link>
          <Link href="/#services">Cloud transformacija</Link>
          <Link href="/#services">Analitika i AI</Link>
          <Link href="/#services">Upravljanje IT operacijama</Link>
          <Link href="/#services">Upravljanje IT uslugama</Link>
        </div>
        <div>
          <h4>Tvrtka</h4>
          <Link href="/">Početna</Link>
          <Link href="/#services">Portfolio</Link>
          <Link href="/usluge">Usluge</Link>
          <Link href="/o-nama">O nama</Link>
          <Link href="/#why">Zašto mi</Link>
          <Link href="/kontakt">Kontakt</Link>
        </div>
        <div>
          <h4>Kontakt</h4>
          <p>NOVARIS TECH d.o.o.</p>
          <p>Reisnerova ulica 91A</p>
          <p>31000, Osijek, Hrvatska</p>
          <p>OIB: 23096866887</p>
          <p>info@novaristech.hr</p>
        </div>
        <div>
          <h4>Pratite nas</h4>
          <div className="socials" aria-label="Društvene mreže">
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">ig</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Novaris Tech. Sva prava pridržana.</p>
        <div>
          <a href="#">Politika privatnosti</a>
          <a href="#">Uvjeti korištenja</a>
        </div>
      </div>
    </footer>
  )
}
