'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { APP_CONSTANTS, scrollToElement } from '@/lib/utils'
import { useAuth } from '@/lib/context/AuthContext'
import { User, LogOut, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AuthModal from '@/components/auth/AuthModal'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalType, setAuthModalType] = useState<'signin' | 'signup'>('signin')
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Check if we're on the main page
  const isMainPage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleNavClick = (elementId: string) => {
    if (isMainPage) {
      // On main page, scroll to section
      scrollToElement(elementId)
    } else {
      // On other pages, navigate to home page and scroll to section
      router.push(`/#${elementId}`)
    }
    setIsMobileMenuOpen(false)
  }

  const handleLogoClick = () => {
    if (isMainPage) {
      // On main page, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // On other pages, navigate to home page
      router.push('/')
    }
  }

  const handleSignIn = () => {
    setAuthModalType('signin')
    setShowAuthModal(true)
  }

  const handleSignUp = () => {
    setAuthModalType('signup')
    setShowAuthModal(true)
  }

  const handleSignOut = () => {
    signOut()
  }

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'nav-glass shadow-lg' : 'bg-transparent'
        }`}
      >
        <nav className="container-modern" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.button 
              onClick={handleLogoClick}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Go to homepage"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-bold gradient-text">
                {APP_CONSTANTS.APP_NAME}
              </span>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item.href.replace('#', ''))}
                  className="btn-ghost text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 card-primary rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-body">
                      {user.firstName}
                    </span>
                  </div>
                  <motion.button 
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-3 py-2 text-caption hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </motion.button>
                </div>
              ) : (
                <>
                  <motion.button 
                    onClick={handleSignIn}
                    className="btn-secondary text-sm px-6 py-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign In
                  </motion.button>
                  <motion.button 
                    onClick={handleSignUp}
                    className="btn-primary text-sm px-6 py-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              <ThemeToggle />
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-caption hover:text-heading transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden border-t border-border-primary bg-overlay backdrop-blur-sm"
              >
                <div className="py-4 space-y-4">
                  {navigation.map((item) => (
                    <motion.button
                      key={item.name}
                      onClick={() => handleNavClick(item.href.replace('#', ''))}
                      className="block w-full text-left px-4 py-2 text-caption hover:text-heading hover:bg-secondary rounded-lg transition-colors duration-200"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.name}
                    </motion.button>
                  ))}
                  
                  <div className="border-t border-border-primary pt-4">
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 px-4 py-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-heading">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-muted">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <motion.button
                          onClick={handleSignOut}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </motion.button>
                      </div>
                    ) : (
                      <div className="space-y-3 px-4">
                        <motion.button
                          onClick={handleSignIn}
                          className="w-full btn-secondary text-sm py-3"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Sign In
                        </motion.button>
                        <motion.button
                          onClick={handleSignUp}
                          className="w-full btn-primary text-sm py-3"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Get Started
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialType={authModalType}
      />
    </>
  )
} 