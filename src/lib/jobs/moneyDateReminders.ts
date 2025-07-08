import { createClientSupabaseClient } from '@/lib/supabase/browserClient'
import { NotificationService } from '@/lib/notifications'
import { CalendarIntegration } from '@/lib/calendar'

const supabase = createClientSupabaseClient()

interface ReminderJob {
  sessionId: string
  userId: string
  partnerId?: string
  scheduledAt: Date
  reminderType: 'upcoming' | 'starting' | 'missed' | 'streak'
}

export class MoneyDateReminderProcessor {
  private static readonly REMINDER_TYPES = {
    upcoming: {
      title: 'Upcoming Money Date',
      body: 'Your Money Date is coming up soon. Get ready to sync up on your finances!',
    },
    starting: {
      title: 'Money Date Starting Now',
      body: "It's time for your Money Date! Join now to start the session.",
    },
    missed: {
      title: 'Missed Money Date',
      body: "You missed your scheduled Money Date. Don't worry - let's get back on track!",
    },
    streak: {
      title: 'Keep Your Streak Going!',
      body: 'Great job on maintaining your Money Date streak! Keep the momentum going.',
    },
  }

  static async processReminders() {
    try {
      // Get upcoming sessions in the next 24 hours
      const { data: upcomingSessions } = await supabase
        .from('money_date_sessions')
        .select('*, notification_preferences!inner(*)')
        .eq('status', 'scheduled')
        .gte('scheduled_at', new Date().toISOString())
        .lte('scheduled_at', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())

      if (!upcomingSessions) return

      const reminderJobs: ReminderJob[] = []

      for (const session of upcomingSessions) {
        const preferences = session.notification_preferences
        const scheduledAt = new Date(session.scheduled_at)
        const now = new Date()

        // Calculate reminder times based on preferences
        const reminderTime = new Date(scheduledAt.getTime())
        reminderTime.setDate(reminderTime.getDate() - preferences.reminder_timing.days)
        reminderTime.setHours(reminderTime.getHours() - preferences.reminder_timing.hours)
        reminderTime.setMinutes(reminderTime.getMinutes() - preferences.reminder_timing.minutes)

        // Add upcoming reminder if within the reminder window
        if (now >= reminderTime && now < scheduledAt) {
          reminderJobs.push({
            sessionId: session.id,
            userId: session.user_id,
            partnerId: session.partner_id,
            scheduledAt,
            reminderType: 'upcoming',
          })
        }

        // Add starting reminder if within 5 minutes of start time
        if (Math.abs(scheduledAt.getTime() - now.getTime()) <= 5 * 60 * 1000) {
          reminderJobs.push({
            sessionId: session.id,
            userId: session.user_id,
            partnerId: session.partner_id,
            scheduledAt,
            reminderType: 'starting',
          })
        }
      }

      // Get missed sessions from the last 48 hours
      const { data: missedSessions } = await supabase
        .from('money_date_sessions')
        .select('*')
        .eq('status', 'missed')
        .gte('scheduled_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
        .lte('scheduled_at', new Date().toISOString())

      if (missedSessions) {
        for (const session of missedSessions) {
          reminderJobs.push({
            sessionId: session.id,
            userId: session.user_id,
            partnerId: session.partner_id,
            scheduledAt: new Date(session.scheduled_at),
            reminderType: 'missed',
          })
        }
      }

      // Get users with active streaks
      const { data: streaks } = await supabase
        .from('session_analytics')
        .select('user_id, streak_count')
        .gt('streak_count', 1)
        .order('created_at', { ascending: false })
        .limit(1)

      if (streaks) {
        for (const streak of streaks) {
          reminderJobs.push({
            sessionId: '', // No specific session for streak reminders
            userId: streak.user_id,
            scheduledAt: new Date(),
            reminderType: 'streak',
          })
        }
      }

      // Process all reminder jobs
      await Promise.all(
        reminderJobs.map(async (job) => {
          const { title, body } = this.REMINDER_TYPES[job.reminderType]

          // Send notification to user
          await NotificationService.sendNotification({
            userId: job.userId,
            type: job.reminderType,
            title,
            body,
            data: {
              sessionId: job.sessionId,
              scheduledAt: job.scheduledAt.toISOString(),
            },
          })

          // Send notification to partner if exists
          if (job.partnerId) {
            await NotificationService.sendNotification({
              userId: job.partnerId,
              type: job.reminderType,
              title,
              body: body.replace('Your', 'Your partner\'s'),
              data: {
                sessionId: job.sessionId,
                scheduledAt: job.scheduledAt.toISOString(),
              },
            })
          }

          // For upcoming sessions, also add to calendar if not already added
          if (job.reminderType === 'upcoming') {
            await CalendarIntegration.addOrUpdateEvent({
              userId: job.userId,
              eventId: job.sessionId,
              title: 'Money Date',
              startTime: job.scheduledAt,
              endTime: new Date(job.scheduledAt.getTime() + 15 * 60 * 1000), // 15 minutes duration
              description: 'Regular check-in to discuss finances and goals with your partner.',
            })

            if (job.partnerId) {
              await CalendarIntegration.addOrUpdateEvent({
                userId: job.partnerId,
                eventId: job.sessionId,
                title: 'Money Date',
                startTime: job.scheduledAt,
                endTime: new Date(job.scheduledAt.getTime() + 15 * 60 * 1000),
                description: 'Regular check-in to discuss finances and goals with your partner.',
              })
            }
          }
        })
      )
    } catch (error) {
      console.error('Error processing Money Date reminders:', error)
    }
  }

  static async scheduleReminders() {
    // Run reminder processor every 5 minutes
    setInterval(() => {
      this.processReminders()
    }, 5 * 60 * 1000)
  }
} 