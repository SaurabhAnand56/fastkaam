// src/app/layout.tsx
import type { Metadata } from 'next'
import { Poppins, Hind } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

// Hindi font
const hind = Hind({
  subsets: ['devanagari', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-hind',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Fastkaam Computer & Printing Press | PVC Card Printing Services',
    template: '%s | Fastkaam Printing Press',
  },
  description:
    'Professional PVC card printing for Aadhaar, PAN, ABHA, Ayushman, Kisan cards. Fast delivery, premium quality. Digital services, computer work, and online services.',
  keywords: [
    'PVC card printing',
    'Aadhaar card printing',
    'PAN card printing',
    'ABHA card',
    'Ayushman Bharat card',
    'Kisan card printing',
    'computer services',
    'printing press',
    'Fastkaam',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Fastkaam Computer & Printing Press',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${hind.variable}`}>
      <body className="font-poppins bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: { fontFamily: 'var(--font-poppins)' },
              }}
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
