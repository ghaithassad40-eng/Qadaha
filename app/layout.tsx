import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-cairo',
})

export const metadata: Metadata = {
  title: 'قدها – لعبة التحديات العربية',
  description: 'لعبة تحديات مضحكة للعائلة والأصدقاء',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body>{children}</body>
    </html>
  )
}
