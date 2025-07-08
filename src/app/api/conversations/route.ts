import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

// System prompts for different tiers
const FREE_TIER_PROMPT = `You are a helpful financial conversation guide for couples. Provide supportive, general advice about money discussions. Keep responses conversational and practical.

Guidelines:
- Provide 2-3 paragraph responses
- Focus on general communication tips  
- Offer basic budgeting and planning advice
- Encourage open dialogue between partners
- Be warm, supportive, and encouraging
- Keep advice actionable but general`;

const PREMIUM_TIER_PROMPT = `You are an expert financial conversation coach with deep insight into couples' money dynamics. Your role is to:

1. Analyze underlying money beliefs, values, and psychological patterns
2. Provide highly personalized, actionable advice based on conversation history
3. Create specific action plans with measurable steps
4. Identify relationship growth opportunities and potential friction points
5. Reference previous conversations to show progress and continuity
6. Provide detailed compatibility insights and behavioral recommendations

Guidelines:
- Provide 4-6 paragraph responses with specific examples
- Include personalized action items with specific steps
- Reference money psychology and relationship dynamics
- Create connection between current conversation and overall relationship journey
- Offer specific tools, frameworks, and exercises
- Use the user's name and relationship context when available
- Provide deeper psychological insights about money behaviors`;

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const body = await request.json();
    const { message, conversationId, conversationType = 'general' } = body;

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile and subscription info
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*, subscription_tier')
      .eq('user_id', user.id)
      .single();

    const isFreeTier = !profile?.subscription_tier || profile.subscription_tier === 'free';

    // Check if starting a new conversation (no conversationId provided)
    if (!conversationId) {
      // Check if user can start new conversation
      const { data: canStart, error: usageError } = await supabase
        .rpc('can_start_conversation', { p_user_id: user.id });

      if (usageError) {
        console.error('Usage check error:', usageError);
        return NextResponse.json({ error: 'Failed to check usage limits' }, { status: 500 });
      }

      if (!canStart) {
        return NextResponse.json({ 
          error: 'Monthly conversation limit reached',
          code: 'CONVERSATION_LIMIT_REACHED',
          upgradeMessage: "You've reached your 3 conversations this month! Upgrade for unlimited conversations + deeper insights"
        }, { status: 429 });
      }
    } else {
      // Check if user can send message in existing conversation
      const { data: messageCheck, error: msgError } = await supabase
        .rpc('can_send_message', { 
          p_user_id: user.id, 
          p_conversation_id: conversationId 
        })
        .single();

      if (msgError) {
        console.error('Message check error:', msgError);
        return NextResponse.json({ error: 'Failed to check message limits' }, { status: 500 });
      }

      if (!messageCheck || !(messageCheck as any).can_send) {
        const check = messageCheck as any;
        const upgradeMessage = check.is_premium 
          ? "You've reached the 20 message limit for this conversation. Start a new conversation to continue!"
          : `You've used all 10 messages in this conversation! Upgrade for ${20 - check.current_message_count} more messages per conversation`;
          
        return NextResponse.json({ 
          error: 'Message limit reached for this conversation',
          code: 'MESSAGE_LIMIT_REACHED',
          upgradeMessage,
          messagesRemaining: check.messages_remaining,
          currentMessageCount: check.current_message_count,
          isPremium: check.is_premium
        }, { status: 429 });
      }
    }

    let conversation;
    let conversationHistory = [];

    // Handle existing conversation or create new one
    if (conversationId) {
      // Get existing conversation
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single();

      if (!existingConv) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }

      conversation = existingConv;

      // Get conversation history
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      conversationHistory = messages || [];
    } else {
      // Create new conversation
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          conversation_type: conversationType,
          quality_tier: isFreeTier ? 'free' : 'premium'
        })
        .select()
        .single();

      if (convError) {
        console.error('Conversation creation error:', convError);
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
      }

      conversation = newConv;

      // No need to track here - will track after successful AI response
    }

    // Save user message
    const { error: userMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_type: 'user',
        content: message,
        word_count: message.split(' ').length
      });

    if (userMsgError) {
      console.error('User message save error:', userMsgError);
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }

    // Prepare conversation context for OpenAI
    const historyContext = conversationHistory
      .map(msg => `${msg.sender_type === 'user' ? 'User' : 'Guide'}: ${msg.content}`)
      .join('\n\n');

    const userContext = profile ? `
User Name: ${profile.full_name || 'User'}
Relationship Status: ${profile.relationship_status || 'Not specified'}
` : '';

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Generate AI response using appropriate tier
    const systemPrompt = isFreeTier ? FREE_TIER_PROMPT : PREMIUM_TIER_PROMPT;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(historyContext ? [{ role: 'assistant', content: `Previous conversation context:\n${historyContext}\n\nUser context:${userContext}` }] : []),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: isFreeTier ? 'gpt-3.5-turbo' : 'gpt-4',
      messages: messages as any,
      max_tokens: isFreeTier ? 300 : 600,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';

    // Save AI response
    const { error: aiMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_type: 'ai',
        content: aiResponse,
        word_count: aiResponse.split(' ').length
      });

    if (aiMsgError) {
      console.error('AI message save error:', aiMsgError);
      return NextResponse.json({ error: 'Failed to save AI response' }, { status: 500 });
    }

    // Track usage after successful message exchange
    const { error: trackingError } = await supabase
      .rpc('increment_usage', { 
        p_user_id: user.id, 
        p_conversation_id: conversation.id 
      });

    if (trackingError) {
      console.error('Usage tracking error:', trackingError);
      // Don't fail the request for tracking errors
    }

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversation.id);

    // Get updated usage info
    const { data: usage } = await supabase
      .rpc('get_current_month_usage', { p_user_id: user.id })
      .single();

    const usageData = usage as any;
    const conversationsUsed = usageData?.conversation_count || 0;
    const remaining = usageData?.conversations_remaining || 0;

    // Add premium preview after 10+ conversations for free users
    let premiumPreview = null;
    if (isFreeTier && conversationsUsed >= 10) {
      premiumPreview = {
        message: "Premium users also get personalized relationship roadmaps and compatibility scoring based on conversation patterns like this one.",
        features: [
          "Unlimited conversations with enhanced AI",
          "Detailed compatibility analysis", 
          "Personalized action plans",
          "Monthly progress reports"
        ]
      };
    }

    return NextResponse.json({ 
      response: aiResponse,
      conversation: {
        id: conversation.id,
        title: conversation.title,
        updated_at: conversation.updated_at
      },
      usage: {
        used: conversationsUsed,
        limit: usageData?.is_premium ? 999999 : 3,
        remaining: remaining,
        isUnlimited: usageData?.is_premium || false
      },
      premiumPreview,
      tier: isFreeTier ? 'free' : 'premium'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (conversationId) {
      // Get specific conversation with messages
      const { data: conversation } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single();

      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }

      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      return NextResponse.json({
        conversation,
        messages: messages || []
      });
    } else {
      // Get user's conversation history
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('id, title, created_at, updated_at, conversation_type, quality_tier')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Conversations fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
      }

      // Get current usage
      const { data: usage } = await supabase
        .rpc('get_current_month_usage', { p_user_id: user.id })
        .single();

      const usageData = usage as any;

      return NextResponse.json({ 
        conversations: conversations || [],
        usage: {
          used: usageData?.conversation_count || 0,
          limit: usageData?.is_premium ? 999999 : 3,
          remaining: usageData?.conversations_remaining || 0,
          isUnlimited: usageData?.is_premium || false
        }
      });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete conversation (messages will be cascade deleted)
    const { error: deleteError } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', user.id); // Ensure user can only delete their own conversations

    if (deleteError) {
      console.error('Conversation deletion error:', deleteError);
      return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
    }

    // NOTE: We intentionally DO NOT decrement usage counts
    // Usage tracking remains as-is to prevent abuse and maintain accurate API cost tracking

    return NextResponse.json({ 
      success: true,
      message: 'Conversation deleted successfully'
    });

  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 