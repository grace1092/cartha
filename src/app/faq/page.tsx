import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import FAQ from '@/components/sections/FAQ'

export const metadata = {
  title: 'FAQ - MoneyTalks Before Marriage™',
  description: 'Find answers to frequently asked questions about MoneyTalks and how it can strengthen your relationship.',
  openGraph: {
    title: 'FAQ - MoneyTalks Before Marriage™',
    description: 'Find answers to frequently asked questions about MoneyTalks and how it can strengthen your relationship.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section for FAQ */}
        <section className="relative py-24 sm:py-32 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl" style={{letterSpacing: '-0.025em'}}>
                Frequently Asked
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Questions</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Everything you need to know about MoneyTalks and how it can transform your relationship conversations.
              </p>
            </div>
          </div>
        </section>

        <FAQ />
      </main>
      <Footer />
    </>
  )
} 