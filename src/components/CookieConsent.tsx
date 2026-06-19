'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner">
      <div className="cookie-inner">
        <div className="cookie-text">
          <strong>Kolačići (Cookies)</strong>
          <p>
            Ova web stranica koristi kolačiće kako bi osigurala najbolje korisničko iskustvo.
            Nastavkom korištenja stranice pristajete na upotrebu kolačića u skladu s našom
            politikom privatnosti.
          </p>
        </div>
        <div className="cookie-actions">
          <button className="button primary cookie-btn" onClick={accept}>
            Prihvaćam
          </button>
          <button className="button secondary cookie-btn" onClick={decline}>
            Odbijam
          </button>
        </div>
      </div>
    </div>
  )
}
