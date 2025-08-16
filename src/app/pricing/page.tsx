import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Pricing from '@/components/sections/Pricing'

export const metadata = {
  title: 'Pricing - Cartha | HIPAA-Compliant Therapy Platform',
  description:
    'Solo, Group, and Enterprise plans with HIPAA compliance, encryption, and audit logs. Transparent monthly or annual pricing with a free pilot for Solo and Group.',
  openGraph: {
    title: 'Pricing - Cartha | HIPAA-Compliant Therapy Platform',
    description:
      'Solo, Group, and Enterprise plans with HIPAA compliance, encryption, and audit logs. Transparent monthly or annual pricing with a free pilot for Solo and Group.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <Pricing />
      </main>
      <Footer />
    </>
  )
} 