# MoneyTalks Before Marriage™

A couples-focused financial planning and discussion platform built with Next.js 14, Supabase, and Stripe.

## Features

- Secure couples authentication system
- Partner invitation and profile management
- Subscription tiers with feature gating
- Usage-based access control
- Stripe integration for payments
- Responsive, mobile-first design

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase and Stripe credentials

4. Set up Stripe:
   - Create a Stripe account at https://stripe.com
   - Get your API keys from the Stripe Dashboard
   - Create your products and price points in Stripe
   - Set up webhook endpoints:
     ```bash
     stripe listen --forward-to localhost:3000/api/webhooks/stripe
     ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Subscription Tiers

### Free
- Basic financial discussion templates
- Shared couple profile
- Email support
- Limited conversation history

### Core ($9.99/month)
- Everything in Free, plus:
- Unlimited conversation history
- Custom discussion templates
- Priority support
- Advanced financial planning tools

### Premium ($19.99/month)
- Everything in Core, plus:
- AI-powered financial insights
- Couples financial coaching
- Custom reporting
- White-glove support

## Development

### Database Migrations

Run migrations:
```bash
supabase db reset
```

### Stripe Testing

Use test card numbers:
- Success: 4242 4242 4242 4242
- Failure: 4000 0000 0000 0002

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary and confidential.
© 2024 MoneyTalks Before Marriage™. All rights reserved.

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)

Project Link: [https://github.com/yourusername/moneytalks-before-marriage](https://github.com/yourusername/moneytalks-before-marriage)

# MoneyTalks Before Marriage - Money Date Feature

A comprehensive system for scheduling and managing regular financial check-ins between couples.

## Features

### Core Functionality
- 📅 Calendar Integration (Google Calendar, Apple Calendar)
- 🤝 Smart Scheduling Suggestions
- 📱 Multi-channel Notifications (SMS, Email, Push)
- ⚡ Quick 15-minute Check-ins
- 📊 Session Tracking and Analytics

### Smart Scheduling
- AI-powered time suggestions based on couple availability
- Time zone handling for long-distance couples
- Consistent timing recommendations
- Missed session recovery

### Notifications
- Customizable reminder preferences
- Multi-channel delivery (SMS, Email, Push)
- Smart notification timing
- Partner synchronization

### Session Management
- Active session tracking
- Topic coverage tracking
- Note-taking capabilities
- Completion celebrations
- Streak tracking

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (via Supabase)
- Google Cloud Platform account (for Calendar API)
- Twilio account (for SMS)
- SMTP server (for email)

### Environment Variables
```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Calendar
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# SMTP
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=your_from_email

# App
NEXT_PUBLIC_APP_URL=your_app_url
```

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/moneytalks-before-marriage.git
cd moneytalks-before-marriage
```

2. Install dependencies
```bash
npm install
```

3. Set up the database
```bash
# Run the SQL migrations in src/lib/supabase/schema.sql
```

4. Start the development server
```bash
npm run dev
```

### Database Setup
The feature requires several tables in your Supabase database:
- `money_date_sessions`: Stores session information
- `notification_logs`: Tracks all notifications
- `calendar_credentials`: Stores calendar integration tokens
- `notification_preferences`: User notification settings
- `session_analytics`: Tracks session metrics

Run the SQL migrations in `src/lib/supabase/schema.sql` to create these tables.

### Calendar Integration
1. Create a Google Cloud Platform project
2. Enable the Google Calendar API
3. Create OAuth 2.0 credentials
4. Add the credentials to your environment variables

### Notification Setup
1. Set up a Twilio account for SMS
2. Configure your SMTP server for email
3. (Optional) Set up Firebase Cloud Messaging for push notifications

## Usage

### Scheduling a Money Date
```typescript
import { MoneyDateScheduler } from '@/components/money-date/MoneyDateScheduler'

function YourComponent() {
  return (
    <MoneyDateScheduler
      onSchedule={(date) => console.log('Scheduled for:', date)}
      onCancel={() => console.log('Cancelled')}
      partnerTimeZone="America/New_York"
    />
  )
}
```

### Managing Notifications
```typescript
import { ReminderSettings } from '@/components/money-date/ReminderSettings'

function YourComponent() {
  return (
    <ReminderSettings
      onSave={() => console.log('Preferences saved')}
      onCancel={() => console.log('Cancelled')}
    />
  )
}
```

### Tracking Sessions
```typescript
import { SessionTracker } from '@/components/money-date/SessionTracker'

function YourComponent() {
  return (
    <SessionTracker
      sessionId="123"
      onComplete={() => console.log('Session completed')}
      onCancel={() => console.log('Session cancelled')}
    />
  )
}
```

## Analytics

The system tracks various metrics to help couples improve their financial communication:
- Session completion rates
- Optimal meeting times
- Topic coverage
- Streak information
- Notification effectiveness

Access these analytics through the `session_analytics` table in your database.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
