import { google } from 'googleapis'
import { createClient } from '@supabase/supabase-js'
import { createClientSupabaseClient } from '@/lib/supabase/browserClient'

interface CalendarSlot {
  start: Date
  end: Date
}

interface ScheduleOptions {
  userId: string
  date: Date
  userTimeZone: string
  partnerTimeZone?: string
}

interface AvailabilityOptions {
  userId: string
  userTimeZone: string
  partnerTimeZone?: string
  duration: number
}

interface CalendarEvent {
  userId: string
  eventId: string
  title: string
  startTime: Date
  endTime: Date
  description?: string
}

export class CalendarIntegration {
  private static readonly GOOGLE_SCOPES = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
  ]

  private static async getGoogleAuth(userId: string) {
    const { data: credentials } = await supabase
      .from('calendar_credentials')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'google')
      .single()

    if (!credentials) {
      throw new Error('Google Calendar not connected')
    }

    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    auth.setCredentials({
      access_token: credentials.access_token,
      refresh_token: credentials.refresh_token,
      expiry_date: new Date(credentials.token_expiry).getTime(),
    })

    return auth
  }

  static async connect(userId: string): Promise<void> {
    // Implementation will depend on the OAuth flow setup
    throw new Error('Not implemented')
  }

  static async isConnected(userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('calendar_credentials')
      .select('id')
      .eq('user_id', userId)
      .single()

    return !!data
  }

  static async getAvailableSlots({
    userId,
    userTimeZone,
    partnerTimeZone,
    duration,
  }: AvailabilityOptions): Promise<Date[]> {
    try {
      const auth = await this.getGoogleAuth(userId)
      const calendar = google.calendar({ version: 'v3', auth })

      // Get busy times for the next week
      const now = new Date()
      const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

      const { data: freeBusy } = await calendar.freebusy.query({
        requestBody: {
          timeMin: now.toISOString(),
          timeMax: oneWeekFromNow.toISOString(),
          timeZone: userTimeZone,
          items: [{ id: 'primary' }],
        },
      })

      const busySlots = freeBusy.calendars?.primary?.busy || []

      // Generate potential slots (9 AM to 9 PM, every 15 minutes)
      const slots: Date[] = []
      const current = new Date(now)
      current.setMinutes(Math.ceil(current.getMinutes() / 15) * 15)
      current.setSeconds(0)
      current.setMilliseconds(0)

      while (current < oneWeekFromNow) {
        const hour = current.getHours()
        if (hour >= 9 && hour < 21) {
          // Check if slot is available
          const slotEnd = new Date(current.getTime() + duration * 60 * 1000)
          const isAvailable = !busySlots.some(
            (busy) =>
              new Date(busy.start) <= current && new Date(busy.end) >= slotEnd
          )

          if (isAvailable) {
            slots.push(new Date(current))
          }
        }

        current.setMinutes(current.getMinutes() + 15)
      }

      // If partner timezone is provided, filter slots that work for both timezones
      if (partnerTimeZone) {
        return slots.filter((slot) => {
          const partnerTime = new Date(slot.toLocaleString('en-US', {
            timeZone: partnerTimeZone,
          }))
          const partnerHour = partnerTime.getHours()
          return partnerHour >= 9 && partnerHour < 21
        })
      }

      return slots
    } catch (error) {
      console.error('Error getting available slots:', error)
      return []
    }
  }

  static async scheduleMoneyDate({
    userId,
    date,
    userTimeZone,
    partnerTimeZone,
  }: ScheduleOptions): Promise<void> {
    try {
      const auth = await this.getGoogleAuth(userId)
      const calendar = google.calendar({ version: 'v3', auth })

      // Get partner info
      const { data: couple } = await supabase
        .from('couples')
        .select('partner_id, partner:users!partner_id(email)')
        .eq('user_id', userId)
        .single()

      // Create event
      await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: 'Money Date 💰',
          description: 'Time to sync up on finances and plan for your future together!',
          start: {
            dateTime: date.toISOString(),
            timeZone: userTimeZone,
          },
          end: {
            dateTime: new Date(date.getTime() + 15 * 60 * 1000).toISOString(), // 15 minutes
            timeZone: userTimeZone,
          },
          attendees: couple?.partner ? [{ email: couple.partner.email }] : undefined,
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 60 },
              { method: 'popup', minutes: 10 },
            ],
          },
        },
      })

      // Store session in database for tracking
      await supabase.from('money_date_sessions').insert({
        user_id: userId,
        partner_id: couple?.partner_id,
        scheduled_at: date.toISOString(),
        status: 'scheduled',
        user_timezone: userTimeZone,
        partner_timezone: partnerTimeZone,
      })
    } catch (error) {
      console.error('Error scheduling money date:', error)
      throw error
    }
  }

  static async addOrUpdateEvent({
    userId,
    eventId,
    title,
    startTime,
    endTime,
    description,
  }: CalendarEvent): Promise<void> {
    try {
      const auth = await this.getGoogleAuth(userId)
      const calendar = google.calendar({ version: 'v3', auth })

      // Check if event already exists
      try {
        await calendar.events.get({
          calendarId: 'primary',
          eventId,
        })

        // Update existing event
        await calendar.events.update({
          calendarId: 'primary',
          eventId,
          requestBody: {
            summary: title,
            description,
            start: {
              dateTime: startTime.toISOString(),
            },
            end: {
              dateTime: endTime.toISOString(),
            },
          },
        })
      } catch {
        // Create new event
        await calendar.events.insert({
          calendarId: 'primary',
          requestBody: {
            id: eventId,
            summary: title,
            description,
            start: {
              dateTime: startTime.toISOString(),
            },
            end: {
              dateTime: endTime.toISOString(),
            },
            reminders: {
              useDefault: true,
            },
          },
        })
      }
    } catch (error) {
      console.error('Error adding/updating calendar event:', error)
      throw error
    }
  }

  static async removeEvent(userId: string, eventId: string): Promise<void> {
    try {
      const auth = await this.getGoogleAuth(userId)
      const calendar = google.calendar({ version: 'v3', auth })

      await calendar.events.delete({
        calendarId: 'primary',
        eventId,
      })
    } catch (error) {
      console.error('Error removing calendar event:', error)
      throw error
    }
  }

  static async connectGoogleCalendar(userId: string, code: string): Promise<void> {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      )

      const { tokens } = await oauth2Client.getToken(code)

      await supabase.from('calendar_credentials').upsert({
        user_id: userId,
        provider: 'google',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: new Date(tokens.expiry_date!).toISOString(),
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error connecting Google Calendar:', error)
      throw error
    }
  }

  static getGoogleAuthUrl(): string {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.GOOGLE_SCOPES,
      prompt: 'consent',
    })
  }
}

export type { CalendarSlot, ScheduleOptions, AvailabilityOptions } 