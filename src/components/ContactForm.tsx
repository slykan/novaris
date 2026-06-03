'use client'
import { useState, useEffect, useRef } from 'react'

// Nakon što registriraš domenu na https://www.google.com/recaptcha/admin
// zamijeni ovu vrijednost sa svojim Site Key-em (v2 checkbox):
const RECAPTCHA_SITE_KEY = '6LcINwotAAAAAATRbscYZ6Y3POgIMjcdNhhMOPDB'

declare global {
  interface Window {
    grecaptcha?: { getResponse: () => string; reset: () => void; render: (el: HTMLElement, opts: object) => void }
    onRecaptchaLoad?: () => void
  }
}

type FormState = { ime: string; email: string; tvrtka: string; oib: string; poruka: string; kopija: boolean }
const EMPTY: FormState = { ime: '', email: '', tvrtka: '', oib: '', poruka: '', kopija: false }

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')
  const captchaDiv = useRef<HTMLDivElement>(null)
  const [captchaReady, setCaptchaReady] = useState(false)

  useEffect(() => {
    if (document.getElementById('recaptcha-script')) { setCaptchaReady(true); return }
    window.onRecaptchaLoad = () => setCaptchaReady(true)
    const s = document.createElement('script')
    s.id  = 'recaptcha-script'
    s.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit'
    s.async = true
    s.defer = true
    document.head.appendChild(s)
  }, [])

  useEffect(() => {
    if (captchaReady && captchaDiv.current && !captchaDiv.current.hasChildNodes()) {
      window.grecaptcha?.render(captchaDiv.current, { sitekey: RECAPTCHA_SITE_KEY })
    }
  }, [captchaReady])

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrMsg('')

    const captcha = window.grecaptcha?.getResponse() ?? ''
    if (!captcha) {
      setStatus('error')
      setErrMsg('Molimo riješite CAPTCHA provjeru.')
      return
    }

    try {
      const res  = await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, captcha }),
      })
      const data = await res.json()
      if (data.ok) {
        setStatus('success')
        setForm(EMPTY)
        window.grecaptcha?.reset()
      } else {
        setStatus('error')
        setErrMsg(data.error || 'Greška pri slanju. Pokušajte ponovo.')
      }
    } catch {
      setStatus('error')
      setErrMsg('Greška pri slanju. Provjerite internetsku vezu i pokušajte ponovo.')
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-success">
        <div className="contact-success-icon">✓</div>
        <h2>Poruka uspješno poslana!</h2>
        <p>
          Hvala na upitu. Naš tim će Vam se javiti u roku od <strong>1 sat</strong> na
          e-mail adresu koju ste naveli.
        </p>
        <button className="button primary" onClick={() => setStatus('idle')} style={{ marginTop: 28 }}>
          Pošalji novu poruku →
        </button>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ime">Ime i prezime <span className="req">*</span></label>
          <input id="ime" name="ime" type="text" value={form.ime} onChange={set}
            placeholder="Ivan Horvat" required autoComplete="name" />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-mail adresa <span className="req">*</span></label>
          <input id="email" name="email" type="email" value={form.email} onChange={set}
            placeholder="ivan@tvrtka.hr" required autoComplete="email" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="tvrtka">Naziv tvrtke <span className="req">*</span></label>
          <input id="tvrtka" name="tvrtka" type="text" value={form.tvrtka} onChange={set}
            placeholder="Tvrtka d.o.o." required autoComplete="organization" />
        </div>
        <div className="form-group">
          <label htmlFor="oib">OIB tvrtke <span className="req">*</span></label>
          <input id="oib" name="oib" type="text" value={form.oib} onChange={set}
            placeholder="12345678901" maxLength={11} required inputMode="numeric" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="poruka">Poruka <span className="req">*</span></label>
        <textarea id="poruka" name="poruka" value={form.poruka} onChange={set}
          placeholder="Opišite vaš projekt ili upit – što trebate, koji je vremenski okvir, ima li specifičnih zahtjeva..." required />
      </div>

      <div ref={captchaDiv} />

      <label className="form-checkbox">
        <input type="checkbox" name="kopija" checked={form.kopija} onChange={set} />
        Pošalji mi kopiju upita na moj e-mail
      </label>

      {status === 'error' && (
        <div className="form-error" role="alert">{errMsg}</div>
      )}

      <button type="submit" className="button primary form-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Slanje...' : 'Pošalji upit →'}
      </button>

      <p className="form-note">Sva polja označena s <span className="req">*</span> su obavezna.</p>
    </form>
  )
}
