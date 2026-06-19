import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'
import Industries from '@/components/Industries'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <header className="hero" id="home">
        <Nav />
        <Hero />
      </header>
      <main>
        <Services />
        <Industries />
        <About />
      </main>
      <Footer />
    </>
  )
}
