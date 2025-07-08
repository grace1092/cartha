import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import PainPoints from '@/components/sections/PainPoints'
import Outcomes from '@/components/sections/Outcomes'
import Product from '@/components/sections/Product'
import CompatibilityScoreSection from '@/components/sections/CompatibilityScoreSection'
import MakeDifference from '@/components/sections/MakeDifference'
import FinalCTA from '@/components/sections/FinalCTA'

export const metadata = {
  title: 'Features - MoneyTalks Before Marriage™',
  description: 'Discover the powerful features that make MoneyTalks the perfect tool for financial compatibility discussions between dating couples.',
  openGraph: {
    title: 'Features - MoneyTalks Before Marriage™',
    description: 'Discover the powerful features that make MoneyTalks the perfect tool for financial compatibility discussions between dating couples.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function Features() {
  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section for Features */}
        <section className="relative py-24 sm:py-32 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Powerful Features for
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Deep Connection</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Everything you need to transform awkward money conversations into meaningful moments of connection and understanding.
              </p>
            </div>
          </div>
        </section>

        <PainPoints />
        <Outcomes />
        <Product />
        <CompatibilityScoreSection />
        <MakeDifference />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
} 