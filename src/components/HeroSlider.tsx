import { p } from '@/lib/path'

export default function HeroSlider() {
  return (
    <section className="hero-visual hero-slider" aria-label="Novaris prezentacija">
      <div className="slider">
        <div className="slides">
          <div className="slide active">
            <img src={p('/slide2.jpg')} alt="Novaris Tech" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
