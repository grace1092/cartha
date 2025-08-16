'use client'

import { APP_CONSTANTS } from '@/lib/utils'

export default function Footer() {
  return (
    <footer className="relative section-footer">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="container-modern relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">C</span>
                </div>
                <span className="text-3xl font-bold drop-shadow-lg footer-heading">{APP_CONSTANTS.APP_NAME}</span>
              </div>
              <p className="footer-body mb-6 max-w-md">
                {APP_CONSTANTS.TAGLINE}. {APP_CONSTANTS.DESCRIPTION}
              </p>
              <div className="flex space-x-4">
                <a 
                  href={APP_CONSTANTS.SOCIAL_LINKS.TWITTER}
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors shadow"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a 
                  href={APP_CONSTANTS.SOCIAL_LINKS.LINKEDIN}
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors shadow"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href={APP_CONSTANTS.SOCIAL_LINKS.INSTAGRAM}
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors shadow"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zm0 21.456c-5.217 0-9.468-4.252-9.468-9.469 0-5.217 4.251-9.468 9.468-9.468s9.469 4.251 9.469 9.468c0 5.217-4.252 9.469-9.469 9.469z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="footer-heading">Product</h3>
              <ul className="space-y-4">
                <li><a href="#features" className="footer-link font-medium">Features</a></li>
                <li><a href="#pricing" className="footer-link font-medium">Pricing</a></li>
                <li><a href="/integrations" className="footer-link font-medium">Integrations</a></li>
                <li><a href="/security" className="footer-link font-medium">Security</a></li>
                <li><a href="/api" className="footer-link font-medium">API</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="footer-heading">Company</h3>
              <ul className="space-y-4">
                <li><a href="#about" className="footer-link font-medium">About</a></li>
                <li><a href="#careers" className="footer-link font-medium">Careers</a></li>
                <li><a href="#blog" className="footer-link font-medium">Blog</a></li>
                <li><a href="#press" className="footer-link font-medium">Press</a></li>
                <li><a href="#contact" className="footer-link font-medium">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="footer-body font-medium">
                © 2024 {APP_CONSTANTS.APP_NAME}. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#privacy" className="footer-link text-base font-medium">
                  Privacy Policy
                </a>
                <a href="#terms" className="footer-link text-base font-medium">
                  Terms of Service
                </a>
                <a href="#cookies" className="footer-link text-base font-medium">
                  Cookie Policy
                </a>
              </div>
            </div>
            <div className="footer-body text-base font-medium">
              Made with <span className="text-red-400">❤️</span> for therapists
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 