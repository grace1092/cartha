# OpenAI Integration Setup Guide

## Required Environment Variables

To use the AI conversation features, you need to add the following environment variable to your `.env.local` file:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

## How to Get Your OpenAI API Key

1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Create a new API key
4. Copy the key and add it to your `.env.local` file

## Database Setup

The conversation system requires new database tables. Run the migration:

```bash
# Apply the new migration to your Supabase database
# You can run this through the Supabase dashboard or CLI
```

## Features Included

### Free Tier (3 conversations/month)
- Uses GPT-3.5-turbo model
- 2-3 paragraph responses
- General financial conversation guidance
- Usage tracking and limits

### Premium Tier (Unlimited conversations)
- Uses GPT-4 model
- 4-6 paragraph responses with detailed insights
- Personalized advice based on conversation history
- Advanced relationship analysis

## Usage

1. **Start Conversations**: Navigate to `/conversations` or click "Start AI Conversation" on the homepage
2. **Choose Templates**: Select from pre-built conversation starters or write your own
3. **Chat Interface**: Full conversation threading with message history
4. **Usage Tracking**: See remaining conversations in the UI
5. **Premium Previews**: After 10+ conversations, free users see premium feature previews

## API Endpoints

- `POST /api/conversations` - Start new conversation or continue existing
- `GET /api/conversations` - Get conversation history and usage info
- `GET /api/conversations?conversationId=<id>` - Get specific conversation with messages

## Components

- `ConversationStarter` - Template selection and conversation initiation
- `ConversationInterface` - Full chat interface with message threading
- Usage tracking and premium preview integration

## Database Schema

### Tables Added:
- `conversations` - Main conversation records
- `messages` - Individual messages in conversations
- `monthly_usage` - Track conversation usage per user per month

### Functions Added:
- `can_start_conversation()` - Check if user can start new conversation
- `track_conversation_usage()` - Increment usage counter
- Auto-update conversation timestamps on new messages

## Cost Considerations

- GPT-3.5-turbo: ~$0.002 per 1K tokens
- GPT-4: ~$0.06 per 1K tokens
- Average conversation: 500-1000 tokens
- Free tier budget: ~$3-6/month for 3 conversations per user
- Premium tier budget: ~$2-4/month API costs for $20/month subscription

## Security

- All conversations are tied to authenticated users
- Row Level Security (RLS) policies protect user data
- API keys are server-side only
- Users can only access their own conversations and usage data 