import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-urbanist',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NiwaPhone — Облік товарів',
  description: 'Система обліку магазину телефонів',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className={`${urbanist.variable} flex flex-col min-h-screen`}>
        <Providers>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}