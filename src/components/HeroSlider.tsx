import { p } from '@/lib/path'

export default function HeroSlider() {
  return (
    <section className="hero-visual hero-map" aria-label="Novaris mreža">
      <img src={p('/world.png')} alt="Novaris Tech mreža u Europi" className="hero-map-image" />
    </section>
  )
}
