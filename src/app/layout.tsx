import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AgentforceChat from '@/components/AgentforceChat'
import { ChatProvider } from '@/contexts/ChatContext'
import SidebarAwareLayout from '@/components/SidebarAwareLayout'
import Script from 'next/script'

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
            html { margin: 0; padding: 0; background: linear-gradient(135deg, #1B1B3A 0%, #2D1B69 60%, #6366F1 100%); color: white; min-height: 100%; overscroll-behavior: none; }
            body { margin: 0; padding: 0; background: linear-gradient(135deg, #1B1B3A 0%, #2D1B69 60%, #6366F1 100%); color: white; min-height: 100vh; overscroll-behavior: none; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; }
            img { pointer-events: none; -webkit-user-drag: none; -khtml-user-drag: none; -moz-user-drag: none; -o-user-drag: none; user-drag: none; }
            .container-max { max-width: 1280px; margin: 0 auto; }
            .section-padding { padding-left: 1rem; padding-right: 1rem; }
            @media (min-width: 640px) { .section-padding { padding-left: 1.5rem; padding-right: 1.5rem; } }
            @media (min-width: 1024px) { .section-padding { padding-left: 2rem; padding-right: 2rem; } }
          `
        }} />
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https:; img-src 'self' data: https:;" />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-7G39LQYB9L"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-7G39LQYB9L');
              `}
            </Script>
          </>
        )}
        <ChatProvider>
          <SidebarAwareLayout>
            {children}
          </SidebarAwareLayout>
          <AgentforceChat />
        </ChatProvider>
      </body>
    </html>
  )
}