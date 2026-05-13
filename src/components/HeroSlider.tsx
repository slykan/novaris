'use client'
import { useState, useEffect, useCallback } from 'react'
import { p } from '@/lib/path'

const slides = [
  { src: '/slide1.jpg', alt: 'Novaris Tech' },
  { src: '/slide2.jpg', alt: 'Novaris Tech' },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)

  const goTo = useCallback((n: number) => {
    setCurrent((n + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => goTo(current + 1), 10000)
    return () => clearInterval(timer)
  }, [current, goTo])

  return (
    <section className="hero-visual hero-slider" aria-label="Novaris prezentacija">
      <div className="slider">
        <div className="slides">
          {slides.map((slide, i) => (
            <div key={i} className={`slide${i === current ? ' active' : ''}`}>
              <img src={p(slide.src)} alt={slide.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ))}
        </div>

        <button className="slider-prev" aria-label="Prethodni slide" onClick={() => goTo(current - 1)}>
          &#8249;
        </button>
        <button className="slider-next" aria-label="Sljedeći slide" onClick={() => goTo(current + 1)}>
          &#8250;
        </button>

        <div className="slider-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot${i === current ? ' active' : ''}`}
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
