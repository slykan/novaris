import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'
import Industries from '@/components/Industries'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <main>
        <Services />
        <About />
        <Industries />
      </main>
      <Footer />
    </>
  )
}
