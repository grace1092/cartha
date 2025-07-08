import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Pricing from '@/components/sections/Pricing'
import FinalCTA from '@/components/sections/FinalCTA'

export const metadata = {
  title: 'Pricing - MoneyTalks Before Marriage™',
  description: 'Choose the perfect plan for your relationship journey. Simple, transparent pricing for every couple.',
  openGraph: {
    title: 'Pricing - MoneyTalks Before Marriage™',
    description: 'Choose the perfect plan for your relationship journey. Simple, transparent pricing for every couple.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section for Pricing */}
        <section className="relative py-24 sm:py-32 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl" style={{letterSpacing: '-0.025em'}}>
                Simple, Transparent
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Pricing</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Choose the perfect plan for your relationship journey. Invest in your future together with confidence.
              </p>
            </div>
          </div>
        </section>

        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
} 