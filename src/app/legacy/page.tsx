import { Metadata } from 'next'
import { AuthGuard } from '@/components/auth/AuthGuard'
import Header from '@/components/ui/Header'

export const metadata: Metadata = {
  title: 'Legacy Index - MoneyTalks',
  description: 'Your relationship financial compatibility score and insights',
}

export default function LegacyPage() {
  return (
    <AuthGuard>
      <div className="layout-estate">
        <Header />
        <div className="container-estate py-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-estate mb-4">Legacy Index</h1>
              <p className="text-vault max-w-2xl mx-auto text-center">
                Your relationship financial compatibility score and strategic insights 
                for building lasting wealth together.
              </p>
            </div>

            {/* Coming Soon Card */}
            <div className="card-vault text-center">
              <div className="w-16 h-16 bg-[var(--old-gold)] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">💎</span>
              </div>
              <h3 className="text-legacy mb-4">Coming Soon</h3>
              <p className="text-intimate mb-6">
                We're crafting your personalized Legacy Index - a sophisticated compatibility 
                assessment that reveals your financial alignment and provides strategic 
                recommendations for building generational wealth.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-[var(--warm-white)] rounded-lg">
                  <h4 className="text-vault mb-2">Compatibility Score</h4>
                  <p className="text-whisper">87% alignment across 6 key dimensions</p>
                </div>
                <div className="p-4 bg-[var(--warm-white)] rounded-lg">
                  <h4 className="text-vault mb-2">Strategic Insights</h4>
                  <p className="text-whisper">Personalized recommendations for your journey</p>
                </div>
                <div className="p-4 bg-[var(--warm-white)] rounded-lg">
                  <h4 className="text-vault mb-2">Progress Tracking</h4>
                  <p className="text-whisper">Monthly assessments and trend analysis</p>
                </div>
              </div>
              <button className="btn-primary">
                Notify Me When Ready
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
} 