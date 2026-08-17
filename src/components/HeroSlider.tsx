import { p } from '@/lib/path'

export default function HeroSlider() {
  return (
    <section className="hero-visual hero-slider" aria-label="Novaris hero vizual">
      <img src={p('/hero3.png')} alt="Novaris Tech rješenja" className="hero-slider-image" />
    </section>
  )
}
