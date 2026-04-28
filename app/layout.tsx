import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import GoogleAdSense from '@/components/GoogleAdSense'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DataStudioz - Analytics Dashboard',
  description: 'Modern data analytics dashboard with interactive visualizations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <GoogleAdSense adSenseId={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID} />
        )}
        {children}
      </body>
    </html>
  )
}
