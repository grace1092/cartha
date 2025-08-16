'use client';

import { useAuth } from '@/lib/context/AuthContext';
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Hero from '@/components/sections/Hero'
import LiveDemo from '@/components/sections/LiveDemo'
import Features from '@/components/sections/Features'
import Stats from '@/components/sections/Stats'
import Testimonials from '@/components/sections/Testimonials'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'
import PricingSimple from '@/components/sections/PricingSimple'
import FinalCTA from '@/components/sections/FinalCTA'
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <LiveDemo />
        <Features />
        <Testimonials />
                      <PricingSimple />
        <Stats />
        <About />
        <Contact />
        <FinalCTA />
        
        {/* Dashboard Access for Logged In Users */}
        {user && (
          <div className="fixed bottom-6 right-6 z-40">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <span className="text-sm font-medium">Go to Dashboard</span>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
