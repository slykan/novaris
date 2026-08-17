import { p } from '@/lib/path'

export default function HeroSlider() {
  return (
    <picture>
      <source media="(max-width: 760px)" srcSet={p('/hero3.png')} />
      <img src={p('/hero_new_5.jpg')} alt="" aria-hidden="true" className="hero-bg-image" />
    </picture>
  )
}
