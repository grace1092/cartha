import './globals.css'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import { APP_CONSTANTS } from '@/lib/utils'
import { SessionNotesProvider } from '@/lib/context/SessionNotesContext'
import { AuthProvider } from '@/lib/context/AuthContext'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-plus-jakarta',
  display: 'swap',
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
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <SessionNotesProvider>
            {children}
          </SessionNotesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
