import './globals.css'
import { Inter, Playfair_Display } from 'next/font/google'
import { APP_CONSTANTS } from '@/lib/utils'
import { SessionNotesProvider } from '@/lib/context/SessionNotesContext'
import { AuthProvider } from '@/lib/context/AuthContext'
import { ThemeProvider } from '@/lib/context/ThemeContext'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import PerformanceInitializer from '@/components/performance/PerformanceInitializer'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
})

export const metadata = {
  metadataBase: new URL('https://cartha.com'),
  title: {
    default: `${APP_CONSTANTS.APP_NAME} - ${APP_CONSTANTS.TAGLINE}`,
    template: `%s | ${APP_CONSTANTS.APP_NAME}`,
  },
  description: APP_CONSTANTS.DESCRIPTION,
  keywords: [
    'therapy practice management',
    'therapist software',
    'session notes',
    'client dashboard',
    'follow-up emails',
    'mental health software',
    'practice management',
    'therapy tools',
  ],
  openGraph: {
    title: `${APP_CONSTANTS.APP_NAME} - ${APP_CONSTANTS.TAGLINE}`,
    description: APP_CONSTANTS.DESCRIPTION,
    type: 'website',
    locale: 'en_US',
    url: 'https://cartha.com',
    siteName: APP_CONSTANTS.APP_NAME,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: `${APP_CONSTANTS.APP_NAME} - Modern Practice Management for Therapists`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_CONSTANTS.APP_NAME} - ${APP_CONSTANTS.TAGLINE}`,
    description: APP_CONSTANTS.DESCRIPTION,
    images: ['/og-image.jpg'],
    creator: '@cartha',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/api/subscriptions/tiers" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/api/waitlist" as="fetch" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Resource hints for performance */}
        <link rel="preload" href="/api/analytics/performance" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#FAFAF7] text-[#222] antialiased font-[family-name:var(--font-inter)]">
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-link sr-only focus:not-sr-only">
          Skip to main content
        </a>
        
        <ErrorBoundary>
          <ThemeProvider>
            <AuthProvider>
              <SessionNotesProvider>
                <PerformanceInitializer />
                <main id="main-content">
                  {children}
                </main>
              </SessionNotesProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
