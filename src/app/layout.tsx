import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://novaristech.hr'),
  title: {
    default: 'Novaris Tech – Vaš pouzdan partner u digitalnoj transformaciji',
    template: '%s – Novaris Tech',
  },
  description: 'Novaris Tech nudi web i software development, serversku infrastrukturu, IT sigurnost, grafički dizajn i remote podršku. Vaš pouzdan IT partner u Osijeku.',
  keywords: ['IT usluge', 'web development', 'software development', 'VPS server', 'IT podrška', 'Osijek', 'Hrvatska', 'Novaris Tech'],
  authors: [{ name: 'Novaris Tech', url: 'https://novaristech.hr' }],
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    siteName: 'Novaris Tech',
    locale: 'hr_HR',
    title: 'Novaris Tech – Vaš pouzdan partner u digitalnoj transformaciji',
    description: 'Novaris Tech nudi web i software development, serversku infrastrukturu, IT sigurnost, grafički dizajn i remote podršku.',
    url: 'https://novaristech.hr',
  },
  twitter: {
    card: 'summary',
    title: 'Novaris Tech – IT rješenja za vaše poslovanje',
    description: 'Web development, serveri, IT zaštita, dizajn i remote podrška. Javite se – odgovaramo u roku od 1 sata.',
  },
  alternates: {
    canonical: 'https://novaristech.hr',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  )
}
