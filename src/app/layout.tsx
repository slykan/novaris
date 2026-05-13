import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Novaris Tech – Vaš pouzdan partner u digitalnoj transformaciji',
  description: 'Povezujemo vodeće globalne tehnologije s internom stručnošću za stabilnu, učinkovitu i sigurnu digitalnu transformaciju.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr">
      <body>{children}</body>
    </html>
  )
}
