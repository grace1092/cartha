import { Metadata } from 'next'
import { AuthGuard } from '@/components/auth/AuthGuard'
import MoneyDateCalendar from '@/components/money-date/MoneyDateCalendar'
import Header from '@/components/ui/Header'

export const metadata: Metadata = {
  title: 'Money Date Calendar - MoneyTalks',
  description: 'Schedule and track your intimate financial conversations',
}

export default function MoneyDatesPage() {
  return (
    <AuthGuard>
      <div className="layout-estate">
        <Header />
        <div className="container-estate py-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-estate mb-4">Money Date Calendar</h1>
              <p className="text-vault max-w-2xl mx-auto text-center">
                Schedule intimate financial conversations that strengthen your bond. 
                Transform money talk from awkward to meaningful.
              </p>
            </div>

            {/* Calendar Component */}
            <div className="card-estate">
              <MoneyDateCalendar />
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-intimate">
                <h3 className="text-legacy mb-3">Quick Schedule</h3>
                <p className="text-whisper mb-4">
                  Set up recurring money dates to build consistent financial intimacy
                </p>
                <button className="btn-secondary">
                  Schedule Weekly Check-ins
                </button>
              </div>

              <div className="card-intimate">
                <h3 className="text-legacy mb-3">Date Ideas</h3>
                <p className="text-whisper mb-4">
                  Discover conversation starters that make financial talks enjoyable
                </p>
                <button className="btn-secondary">
                  Browse Topics
                </button>
              </div>
            </div>

            {/* Upcoming Money Dates */}
            <div className="mt-8 card-vault">
              <h3 className="text-legacy mb-4">Upcoming Money Dates</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[var(--warm-white)] rounded-lg">
                  <div>
                    <h4 className="text-vault">Monthly Budget Review</h4>
                    <p className="text-whisper">Tomorrow at 7:00 PM</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge-milestone">Gentle</span>
                    <button className="btn-ghost">Reschedule</button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[var(--warm-white)] rounded-lg">
                  <div>
                    <h4 className="text-vault">Dream Home Discussion</h4>
                    <p className="text-whisper">Saturday at 2:00 PM</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge-milestone">Intimate</span>
                    <button className="btn-ghost">Prepare</button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[var(--warm-white)] rounded-lg">
                  <div>
                    <h4 className="text-vault">Investment Strategy Deep Dive</h4>
                    <p className="text-whisper">Next Sunday at 10:00 AM</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge-milestone">Deep</span>
                    <button className="btn-ghost">View Details</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
} 