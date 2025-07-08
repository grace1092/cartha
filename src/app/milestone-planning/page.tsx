import { Metadata } from 'next'
import { AuthGuard } from '@/components/auth/AuthGuard'
import GoalTrackingDashboard from '@/components/dashboard/GoalTrackingDashboard'
import Header from '@/components/ui/Header'

export const metadata: Metadata = {
  title: 'Milestone Planning - MoneyTalks',
  description: 'Set and track your financial goals together as a couple',
}

export default function MilestonePlanningPage() {
  return (
    <AuthGuard>
      <div className="layout-estate">
        <Header />
        <div className="container-estate py-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-estate mb-4">Milestone Planning</h1>
              <p className="text-vault max-w-2xl mx-auto text-center">
                Build your financial future together. Set meaningful goals, track progress, 
                and celebrate achievements as a unified team.
              </p>
            </div>

            {/* Goal Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card-intimate">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[var(--sage-green)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">🏠</span>
                  </div>
                  <h3 className="text-legacy mb-2">Home & Family</h3>
                  <p className="text-whisper">First home, family planning, education funds</p>
                </div>
              </div>

              <div className="card-intimate">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[var(--old-gold)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">🌟</span>
                  </div>
                  <h3 className="text-legacy mb-2">Dreams & Adventures</h3>
                  <p className="text-whisper">Travel, experiences, passion projects</p>
                </div>
              </div>

              <div className="card-intimate">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[var(--estate-navy)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">💎</span>
                  </div>
                  <h3 className="text-legacy mb-2">Legacy & Wealth</h3>
                  <p className="text-whisper">Retirement, investments, generational wealth</p>
                </div>
              </div>
            </div>

            {/* Main Dashboard */}
            <div className="card-estate mb-8">
              <GoalTrackingDashboard />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="card-vault">
                <h3 className="text-legacy mb-4">Goal Templates</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[var(--warm-white)] rounded-lg">
                    <span className="text-vault">Emergency Fund (6 months)</span>
                    <button className="btn-ghost">Use Template</button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[var(--warm-white)] rounded-lg">
                    <span className="text-vault">First Home Down Payment</span>
                    <button className="btn-ghost">Use Template</button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[var(--warm-white)] rounded-lg">
                    <span className="text-vault">Retirement by 65</span>
                    <button className="btn-ghost">Use Template</button>
                  </div>
                </div>
              </div>

              <div className="card-vault">
                <h3 className="text-legacy mb-4">Milestone Rewards</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[var(--warm-white)] rounded-lg">
                    <div>
                      <span className="text-vault">25% Goal Progress</span>
                      <p className="text-whisper">Date night celebration</p>
                    </div>
                    <span className="badge-milestone">Earned</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[var(--warm-white)] rounded-lg">
                    <div>
                      <span className="text-vault">50% Goal Progress</span>
                      <p className="text-whisper">Weekend getaway</p>
                    </div>
                    <span className="badge-legacy">Upcoming</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[var(--warm-white)] rounded-lg">
                    <div>
                      <span className="text-vault">Goal Achieved</span>
                      <p className="text-whisper">Major celebration</p>
                    </div>
                    <span className="badge-legacy">Future</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="card-estate">
              <h3 className="text-legacy mb-6">Your Journey Together</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-monument text-[var(--sage-green)] mb-2">3</div>
                  <div className="text-vault">Active Goals</div>
                </div>
                <div className="text-center">
                  <div className="text-monument text-[var(--old-gold)] mb-2">$12,500</div>
                  <div className="text-vault">Saved This Year</div>
                </div>
                <div className="text-center">
                  <div className="text-monument text-[var(--estate-navy)] mb-2">65%</div>
                  <div className="text-vault">Average Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-monument text-[var(--sage-green)] mb-2">2</div>
                  <div className="text-vault">Milestones Achieved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
} 