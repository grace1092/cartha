import { Metadata } from 'next'
import { AuthGuard } from '@/components/auth/AuthGuard'
import Header from '@/components/ui/Header'

export const metadata: Metadata = {
  title: 'The Vault - MoneyTalks',
  description: 'Your private financial conversation archive and wealth documentation',
}

export default function VaultPage() {
  return (
    <AuthGuard>
      <div className="layout-estate">
        <Header />
        <div className="container-estate py-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-estate mb-4">The Vault</h1>
              <p className="text-vault max-w-2xl mx-auto text-center">
                Your private archive of financial conversations, insights, and wealth-building 
                documentation. Bank-grade security for your most important discussions.
              </p>
            </div>

            {/* Coming Soon Card */}
            <div className="card-vault text-center">
              <div className="w-16 h-16 bg-[var(--estate-navy)] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">🏦</span>
              </div>
              <h3 className="text-legacy mb-4">Coming Soon</h3>
              <p className="text-intimate mb-6">
                We're building your private vault - a secure repository for all your financial 
                conversations, insights, and wealth-building documentation. Every meaningful 
                discussion preserved with estate-level security.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-[var(--warm-white)] rounded-lg">
                  <h4 className="text-vault mb-2">Conversation Archive</h4>
                  <p className="text-whisper">Searchable history of all your financial discussions</p>
                </div>
                <div className="p-4 bg-[var(--warm-white)] rounded-lg">
                  <h4 className="text-vault mb-2">Insights Library</h4>
                  <p className="text-whisper">AI-generated summaries and action items</p>
                </div>
                <div className="p-4 bg-[var(--warm-white)] rounded-lg">
                  <h4 className="text-vault mb-2">Document Storage</h4>
                  <p className="text-whisper">Secure storage for financial documents and plans</p>
                </div>
                <div className="p-4 bg-[var(--warm-white)] rounded-lg">
                  <h4 className="text-vault mb-2">Legacy Planning</h4>
                  <p className="text-whisper">Generational wealth transfer documentation</p>
                </div>
              </div>
              <button className="btn-primary">
                Notify Me When Ready
              </button>
            </div>

            {/* Preview Features */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-intimate">
                <h3 className="text-legacy mb-3">Private & Secure</h3>
                <p className="text-whisper">
                  Bank-grade encryption ensures your financial conversations remain 
                  completely private and secure.
                </p>
              </div>
              <div className="card-intimate">
                <h3 className="text-legacy mb-3">Smart Search</h3>
                <p className="text-whisper">
                  Find any conversation, insight, or decision from your financial journey 
                  with intelligent search.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
} 