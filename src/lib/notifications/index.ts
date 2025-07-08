import { Twilio } from 'twilio'
import { createTransport } from 'nodemailer'
import { createClientSupabaseClient } from '@/lib/supabase/browserClient'

const supabase = createClientSupabaseClient()

interface NotificationPreferences {
  sms: boolean
  email: boolean
  push: boolean
  reminderTiming: {
    days: number
    hours: number
    minutes: number
  }
}

interface NotificationPayload {
  userId: string
  type: 'reminder' | 'completion' | 'missed' | 'streak' | 'upcoming' | 'starting'
  title: string
  body: string
  data?: Record<string, any>
}

export class NotificationService {
  private static twilio = new Twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  )

  private static mailer = createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  static async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    const { data } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    return data || {
      sms: true,
      email: true,
      push: true,
      reminderTiming: {
        days: 0,
        hours: 1,
        minutes: 0,
      },
    }
  }

  static async updatePreferences(
    userId: string,
    preferences: NotificationPreferences
  ): Promise<void> {
    await supabase
      .from('notification_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString(),
      })
  }

  static async sendNotification(payload: NotificationPayload): Promise<void> {
    try {
      // Get user preferences
      const preferences = await this.getUserPreferences(payload.userId)

      // Get user contact info
      const { data: user } = await supabase
        .from('users')
        .select('phone_number, email')
        .eq('id', payload.userId)
        .single()

      if (!user) return

      // Log notification
      await supabase.from('notification_logs').insert({
        user_id: payload.userId,
        type: payload.type,
        title: payload.title,
        body: payload.body,
        data: payload.data,
      })

      // Send SMS if enabled
      if (preferences.sms && user.phone_number) {
        await this.twilio.messages.create({
          body: `${payload.title}\n\n${payload.body}`,
          to: user.phone_number,
          from: process.env.TWILIO_PHONE_NUMBER,
        })
      }

      // Send email if enabled
      if (preferences.email && user.email) {
        await this.mailer.sendMail({
          from: process.env.SMTP_FROM,
          to: user.email,
          subject: payload.title,
          html: this.getEmailTemplate(payload),
        })
      }

      // Send push notification if enabled
      if (preferences.push) {
        await this.sendPushNotification(payload)
      }
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  private static getEmailTemplate(payload: NotificationPayload): string {
    return `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3366ff;">${payload.title}</h2>
        <p style="color: #333; font-size: 16px;">${payload.body}</p>
        ${
          payload.type === 'upcoming' || payload.type === 'starting'
            ? `<a
                href="${process.env.NEXT_PUBLIC_APP_URL}/money-date/${payload.data?.sessionId}"
                style="
                  display: inline-block;
                  background-color: #3366ff;
                  color: white;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 6px;
                  margin-top: 16px;
                "
              >
                Join Session
              </a>`
            : ''
        }
      </div>
    `
  }

  private static async sendPushNotification(payload: NotificationPayload): Promise<void> {
    // Implement push notification logic here
    // This could use Firebase Cloud Messaging, OneSignal, or other push services
  }
}

export type { NotificationPayload } 