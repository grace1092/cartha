# CARTHA Waitlist System

A comprehensive waitlist management system for the CARTHA Founding Member Program with email confirmation, admin dashboard, export functionality, and GDPR compliance.

## 🚀 Features

### Core Functionality
- **Multi-step signup form** with detailed practice information collection
- **Email confirmation system** with secure tokens
- **GDPR compliance** with consent management and data rights
- **Admin dashboard** for subscriber management
- **Export functionality** (CSV/JSON) for marketing use
- **Priority scoring** based on practice type, interest level, and timeline
- **Comprehensive logging** of all actions and GDPR events

### Email System
- **Confirmation emails** with professional templates
- **Welcome emails** for confirmed subscribers
- **Unsubscribe functionality** with GDPR compliance
- **Email templates** stored in database for easy customization
- **Email delivery tracking** and bounce handling

### Admin Features
- **Real-time statistics** dashboard
- **Subscriber management** with filtering and search
- **Bulk operations** (export, email campaigns)
- **Individual subscriber editing** and notes
- **Resend confirmation** functionality
- **Admin action logging** for audit trails

### GDPR Compliance
- **Consent management** (essential vs marketing)
- **Right to be forgotten** implementation
- **Data access requests** logging
- **Consent withdrawal** tracking
- **IP address and user agent** logging for compliance

## 📁 File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── waitlist/
│   │   │   ├── route.ts                    # Main waitlist API
│   │   │   ├── confirm/
│   │   │   │   └── route.ts                # Email confirmation
│   │   │   └── unsubscribe/
│   │   │       └── route.ts                # Unsubscribe handling
│   │   └── admin/
│   │       └── waitlist/
│   │           └── route.ts                # Admin API
│   └── waitlist/
│       ├── confirmed/
│       │   └── page.tsx                    # Confirmation success page
│       └── unsubscribed/
│           └── page.tsx                    # Unsubscribe confirmation page
├── components/
│   ├── ui/
│   │   └── WaitlistModal.tsx               # Main signup modal
│   └── admin/
│       └── WaitlistDashboard.tsx           # Admin dashboard component
└── app/
    └── admin/
        └── waitlist/
            └── page.tsx                    # Admin page

supabase/
└── migrations/
    └── 20240104000000_add_waitlist_system.sql  # Database schema
```

## 🗄️ Database Schema

### Core Tables

#### `waitlist_subscribers`
Main subscriber information including:
- Personal details (name, email, phone)
- Practice information (name, type, license)
- Preferences (interest level, timeline, budget)
- Status tracking (confirmed, unsubscribed, etc.)
- GDPR consent flags
- Priority scoring

#### `waitlist_confirmation_tokens`
Secure tokens for email confirmation and unsubscribe:
- Unique tokens with expiration
- Token type (confirmation, unsubscribe, resubscribe)
- Usage tracking

#### `waitlist_email_templates`
Email template management:
- HTML and text versions
- Variable substitution support
- Active/inactive status

#### `waitlist_email_logs`
Email delivery tracking:
- Send status and timestamps
- Open and click tracking
- Bounce and error handling

#### `waitlist_admin_logs`
Admin action audit trail:
- All admin actions logged
- IP address and user agent
- Detailed action information

#### `waitlist_export_jobs`
Export functionality:
- Export type and filters
- File generation tracking
- Download statistics

#### `waitlist_gdpr_logs`
GDPR compliance tracking:
- Consent given/withdrawn
- Data access requests
- Deletion requests

## 🔧 Setup Instructions

### 1. Database Migration
```bash
# Apply the migration to your Supabase database
npx supabase db push
```

### 2. Environment Variables
Ensure these environment variables are set:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=your_app_url
```

### 3. Email Service Integration
The system is designed to work with any email service. Update the email sending functions in:
- `src/app/api/waitlist/route.ts` (confirmation emails)
- `src/app/api/waitlist/confirm/route.ts` (welcome emails)

Recommended services:
- **Resend** (recommended for Next.js)
- **SendGrid**
- **Mailgun**
- **AWS SES**

### 4. Admin Access
Create admin users by setting their email to:
- `admin@cartha.com`
- `gracetan@cartha.com`

## 📊 Usage

### User Signup Flow
1. User clicks "Join Waitlist" on pricing page
2. Multi-step form collects detailed information
3. Email confirmation sent with secure token
4. User confirms email and receives welcome email
5. Subscriber added to founding member program

### Admin Dashboard Access
1. Navigate to `/admin/waitlist`
2. Must be logged in as admin user
3. View statistics, manage subscribers, export data

### Export Functionality
1. Use admin dashboard export buttons
2. Choose CSV or JSON format
3. Apply filters as needed
4. Download file automatically

## 🔒 Security & Privacy

### Authentication
- Admin access restricted to specific email addresses
- JWT token validation for all admin operations
- Session-based authentication

### Data Protection
- All personal data encrypted at rest
- Secure token generation for email confirmation
- IP address logging for compliance
- GDPR consent tracking

### GDPR Compliance
- Explicit consent collection
- Right to be forgotten implementation
- Data access request logging
- Consent withdrawal tracking
- Privacy policy compliance

## 📈 Analytics & Insights

### Priority Scoring
Subscribers are automatically scored based on:
- **Interest Level** (40 points max)
- **Practice Type** (20 points max)
- **Timeline** (20 points max)
- **Budget Range** (20 points max)

### Key Metrics
- Total subscribers
- Confirmation rates
- Unsubscribe rates
- Geographic distribution
- Practice type breakdown
- Interest level distribution

## 🚀 Deployment

### Vercel Deployment
```bash
# Deploy to Vercel
vercel --prod
```

### Environment Setup
1. Set environment variables in Vercel dashboard
2. Ensure Supabase connection is working
3. Test email confirmation flow
4. Verify admin dashboard access

## 🔧 Customization

### Email Templates
Edit templates in the database or update the default templates in the migration file.

### Form Fields
Modify the `WaitlistModal.tsx` component to add/remove fields.

### Styling
Update Tailwind classes in components to match your brand.

### Admin Permissions
Modify the admin check in `src/app/admin/waitlist/page.tsx`.

## 🐛 Troubleshooting

### Common Issues

#### Email Not Sending
- Check email service configuration
- Verify environment variables
- Check email service logs

#### Admin Access Denied
- Ensure user email matches admin list
- Check authentication status
- Verify database permissions

#### Database Errors
- Run migration again
- Check Supabase connection
- Verify RLS policies

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=waitlist:*
```

## 📞 Support

For technical support:
- Email: support@cartha.com
- Documentation: [CARTHA Docs](https://docs.cartha.com)
- GitHub Issues: [Repository Issues](https://github.com/cartha/waitlist-system)

## 📄 License

This waitlist system is part of the CARTHA platform and is proprietary software. 