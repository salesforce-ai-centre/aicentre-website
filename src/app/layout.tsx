import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import AgentforceChat from '@/components/AgentforceChat'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  title: 'Salesforce AI Centre | Engagement Portal',
  description: 'Discover AI Centre engagement offerings for Salesforce account teams',
  keywords: ['Salesforce', 'AI Centre', 'Workshops', 'Experiences', 'Agentforce'],
  robots: 'index, follow',
  other: {
    'theme-color': '#6366F1',
    'color-scheme': 'dark',
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS - inline for faster FCP */
            body { margin: 0; background: linear-gradient(135deg, #1B1B3A 0%, #2D1B69 60%, #6366F1 100%); color: white; }
            .container-max { max-width: 1280px; margin: 0 auto; }
            .section-padding { padding-left: 1rem; padding-right: 1rem; }
            @media (min-width: 640px) { .section-padding { padding-left: 1.5rem; padding-right: 1.5rem; } }
            @media (min-width: 1024px) { .section-padding { padding-left: 2rem; padding-right: 2rem; } }
          `
        }} />
        <link rel="preload" href="/images/AgentforceBackground.webp" as="image" type="image/webp" />
        <link rel="preload" href="/images/SalesforceLogo.png" as="image" type="image/png" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <PerformanceMonitor />
        {children}
        <AgentforceChat />
      </body>
    </html>
  )
}