import Link from 'next/link'
import { p } from '@/lib/path'

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-grid">
        <a className="brand" href="#home" aria-label="Novaris Tech početna">
          <img src={p('/logo3_small.png')} alt="Novaris Tech" className="logo-footer" />
        </a>
        <div>
          <h4>Portfolio</h4>
          <a href="#services">Integracije</a>
          <a href="#services">Automatizacija</a>
          <a href="#services">Cloud transformacija</a>
          <a href="#services">Analitika i AI</a>
          <a href="#services">Upravljanje IT operacijama</a>
          <a href="#services">Upravljanje IT uslugama</a>
        </div>
        <div>
          <h4>Tvrtka</h4>
          <Link href="/usluge">Usluge</Link>
          <Link href="/o-nama">O nama</Link>
          <a href="#why">Zašto mi</a>
          <a href="#industries">Industrije</a>
          <a href="#contact">Karijere</a>
          <a href="#contact">Novosti</a>
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
