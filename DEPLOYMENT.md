# CARTHA Deployment Guide - Vercel

This guide will help you deploy the CARTHA application to Vercel with all necessary configurations.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Environment Variables**: Gather all required API keys and secrets

## Required Environment Variables

### Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Stripe Configuration
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### OpenAI Configuration
```env
OPENAI_API_KEY=your_openai_api_key
```

### Google Calendar Integration
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-domain.vercel.app/auth/callback
```

### Twilio Configuration (for SMS notifications)
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### SMTP Configuration (for email notifications)
```env
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
SMTP_FROM=noreply@yourdomain.com
```

### Application Configuration
```env
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy to Vercel
```bash
vercel --prod
```

### 4. Set Environment Variables in Vercel Dashboard

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each environment variable listed above

### 5. Configure Custom Domain (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Post-Deployment Setup

### 1. Database Migration
Run the database migrations in your Supabase project:
```sql
-- Run the migrations from supabase/migrations/
-- This will create all necessary tables and functions
```

### 2. Stripe Webhook Configuration
1. Go to your Stripe Dashboard
2. Navigate to Webhooks
3. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
5. Copy the webhook secret and add it to Vercel environment variables

### 3. Google Calendar API Setup
1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `https://your-domain.vercel.app/auth/callback`
6. Copy credentials to Vercel environment variables

### 4. Twilio Setup
1. Create a Twilio account
2. Get your Account SID and Auth Token
3. Purchase a phone number
4. Add credentials to Vercel environment variables

### 5. SMTP Setup
Configure your email service (Gmail, SendGrid, etc.) and add credentials to Vercel environment variables.

## Verification Steps

### 1. Test Authentication
- Visit your deployed site
- Test user registration and login
- Verify Supabase connection

### 2. Test Payment Flow
- Test Stripe checkout process
- Verify webhook handling
- Check subscription management

### 3. Test Data Storage Features
- Test backup functionality
- Test export functionality
- Test sync operations
- Verify metrics collection

### 4. Test Notifications
- Test email notifications
- Test SMS notifications (if configured)
- Verify calendar integration

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set correctly
   - Verify all dependencies are in package.json
   - Check for TypeScript errors

2. **API Errors**
   - Verify Supabase connection
   - Check Stripe webhook configuration
   - Ensure all API keys are valid

3. **Authentication Issues**
   - Verify Supabase URL and keys
   - Check redirect URIs in Supabase settings
   - Ensure environment variables are set

4. **Payment Issues**
   - Verify Stripe keys are correct
   - Check webhook endpoint is accessible
   - Ensure webhook secret is set

### Debug Mode
Enable debug logging by adding to environment variables:
```env
DEBUG=*
NODE_ENV=development
```

## Monitoring

### Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor performance metrics
- Track user behavior

### Error Tracking
- Set up error tracking (Sentry, LogRocket)
- Monitor API response times
- Track user experience metrics

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to Git
2. **API Keys**: Rotate keys regularly
3. **Webhooks**: Verify webhook signatures
4. **CORS**: Configure CORS properly for production
5. **Rate Limiting**: Implement rate limiting for API endpoints

## Performance Optimization

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Implement dynamic imports
3. **Caching**: Configure proper caching headers
4. **CDN**: Use Vercel's global CDN
5. **Database**: Optimize database queries

## Backup and Recovery

1. **Database Backups**: Set up automated Supabase backups
2. **Code Backups**: Use Git for version control
3. **Environment Backups**: Document all environment variables
4. **Disaster Recovery**: Have a recovery plan ready

## Support

For deployment issues:
1. Check Vercel documentation
2. Review build logs in Vercel dashboard
3. Check environment variable configuration
4. Verify all external service configurations

## Next Steps

After successful deployment:
1. Set up monitoring and alerting
2. Configure automated backups
3. Implement CI/CD pipeline
4. Set up staging environment
5. Plan for scaling and optimization 