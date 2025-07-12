'use client'

import { useState, useEffect } from 'react'
import { APP_CONSTANTS, scrollToElement } from '@/lib/utils'
import { useAuth } from '@/lib/context/AuthContext'
import { User, LogOut } from 'lucide-react'
import AuthModal from '@/components/auth/AuthModal'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalType, setAuthModalType] = useState<'signin' | 'signup'>('signin')
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (elementId: string) => {
    scrollToElement(elementId)
    setIsMobileMenuOpen(false)
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

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'nav-glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container-modern">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-2xl font-bold gradient-text">
              {APP_CONSTANTS.APP_NAME}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavClick('features')}
              className="btn-ghost text-sm font-medium"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('pricing')}
              className="btn-ghost text-sm font-medium"
            >
              Pricing
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="btn-ghost text-sm font-medium"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="btn-ghost text-sm font-medium"
            >
              Contact
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.firstName}
                  </span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={handleSignIn}
                  className="btn-secondary text-sm px-6 py-2"
                >
                  Sign In
                </button>
                <button 
                  onClick={handleSignUp}
                  className="btn-primary text-sm px-6 py-2"
                >
                  Start Free Trial
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span 
                className={`block h-0.5 bg-gray-600 transition-transform ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span 
                className={`block h-0.5 bg-gray-600 transition-opacity ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span 
                className={`block h-0.5 bg-gray-600 transition-transform ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 nav-glass border-t border-gray-200">
            <div className="container-modern py-4 space-y-4">
              <button
                onClick={() => handleNavClick('features')}
                className="block w-full text-left py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick('pricing')}
                className="block w-full text-left py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Pricing
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="block w-full text-left py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                About
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="block w-full text-left py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Contact
              </button>
              <div className="pt-4 space-y-3 border-t border-gray-200">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                    <button 
                      onClick={handleSignOut}
                      className="btn-secondary w-full text-sm flex items-center justify-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={handleSignIn}
                      className="btn-secondary w-full text-sm"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={handleSignUp}
                      className="btn-primary w-full text-sm"
                    >
                      Start Free Trial
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialType={authModalType}
        />
      )}
    </header>
  )
} 