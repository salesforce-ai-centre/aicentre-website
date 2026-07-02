import type { Metadata } from 'next'
import { Instrument_Serif, DM_Sans } from 'next/font/google'
import './globals.css'
import AgentforceChat from '@/components/AgentforceChat'
import { ChatProvider } from '@/contexts/ChatContext'
import { UserProvider } from '@/contexts/UserContext'
import SidebarAwareLayout from '@/components/SidebarAwareLayout'
import Script from 'next/script'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-serif',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Salesforce AI Centre | Engagement Portal',
  description: 'Plan your customer engagement at the Salesforce AI Centre',
  keywords: ['Salesforce', 'AI Centre', 'Workshops', 'Experiences', 'Agentforce'],
  robots: 'index, follow',
  other: {
    'theme-color': '#635BFF',
    'color-scheme': 'light',
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
    <html lang="en" className={`${instrumentSerif.variable} ${dmSans.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            html { margin: 0; padding: 0; background: #FFFFFF; color: #0A2540; min-height: 100%; overscroll-behavior: none; }
            body { margin: 0; padding: 0; background: #FFFFFF; color: #0A2540; min-height: 100vh; overscroll-behavior: none; }
            .container-max { max-width: 1152px; margin: 0 auto; }
            .section-padding { padding-left: 1.25rem; padding-right: 1.25rem; }
            @media (min-width: 640px) { .section-padding { padding-left: 2rem; padding-right: 2rem; } }
            @media (min-width: 1024px) { .section-padding { padding-left: 3rem; padding-right: 3rem; } }
          `
        }} />
        <link rel="icon" href="/images/favicon.ico" type="image/x-icon" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
      </head>
      <body className={dmSans.className} suppressHydrationWarning={true}>
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
        <UserProvider>
          <ChatProvider>
            <SidebarAwareLayout>
              {children}
            </SidebarAwareLayout>
            <AgentforceChat />
          </ChatProvider>
        </UserProvider>
      </body>
    </html>
  )
}
