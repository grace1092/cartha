'use client'

import { useEffect } from 'react'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import Pricing from '@/components/sections/Pricing'
import { revealOnScroll } from '@/lib/utils'

export default function Home() {
  useEffect(() => {
    revealOnScroll()
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </>
  )
}
