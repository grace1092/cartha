'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, ArrowLeft, MessageCircle, Crown, Sparkles, AlertCircle, User, Bot } from 'lucide-react';
import Button from '../ui/Button';

interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'user' | 'ai';
  content: string;
  created_at: string;
  word_count: number;
}

interface Conversation {
  id: string;
  title: string;
  conversation_type: string;
  quality_tier: 'free' | 'premium';
  created_at: string;
  updated_at: string;
}

interface UsageData {
  used: number;
  limit: number;
  remaining: number;
  isUnlimited: boolean;
}

interface PremiumPreview {
  message: string;
  features: string[];
}

interface ConversationInterfaceProps {
  conversationId: string;
}

export default function ConversationInterface({ conversationId }: ConversationInterfaceProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [premiumPreview, setPremiumPreview] = useState<PremiumPreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversation();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversation = async () => {
    try {
      const response = await fetch(`/api/conversations?conversationId=${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setConversation(data.conversation);
        setMessages(data.messages || []);
      } else {
        throw new Error('Failed to fetch conversation');
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      setError('Failed to load conversation');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || loading) return;

    const messageToSend = newMessage.trim();
    setNewMessage('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          conversationId,
          conversationType: conversation?.conversation_type || 'general'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add the user message and AI response to the messages
        const userMessage: Message = {
          id: `user-${Date.now()}`,
          conversation_id: conversationId,
          sender_type: 'user',
          content: messageToSend,
          created_at: new Date().toISOString(),
          word_count: messageToSend.split(' ').length
        };

        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          conversation_id: conversationId,
          sender_type: 'ai',
          content: data.response,
          created_at: new Date().toISOString(),
          word_count: data.response.split(' ').length
        };

        setMessages(prev => [...prev, userMessage, aiMessage]);
        setUsage(data.usage);
        setPremiumPreview(data.premiumPreview);

        // Update conversation title if it's the first message
        if (messages.length === 0) {
          setConversation(prev => prev ? { ...prev, title: data.conversation.title } : null);
        }
      } else if (response.status === 429) {
        setError(data.upgradeMessage || 'You\'ve reached your monthly conversation limit. Upgrade to continue!');
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      setNewMessage(messageToSend); // Restore the message
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  if (error && !conversation) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-red-700">{error}</p>
          <Button
            onClick={() => router.push('/conversations')}
            className="mt-4"
            variant="outline"
          >
            Back to Conversations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/conversations')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {conversation?.title || 'Loading...'}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MessageCircle className="w-4 h-4" />
                <span>Financial Conversation</span>
                {conversation?.quality_tier === 'premium' && (
                  <Crown className="w-4 h-4 text-yellow-500" />
                )}
              </div>
            </div>
          </div>
          {usage && (
            <div className="text-sm text-gray-600">
              {usage.isUnlimited ? (
                <span className="flex items-center space-x-1">
                  <Crown className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Unlimited</span>
                </span>
              ) : (
                <span className={usage.remaining <= 3 ? 'text-yellow-600' : 'text-blue-600'}>
                  {usage.remaining} remaining
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl flex items-start space-x-3 ${
                message.sender_type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender_type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-green-100 text-green-600'
                }`}
              >
                {message.sender_type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div
                className={`px-4 py-3 rounded-lg ${
                  message.sender_type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm">
                  {formatMessageContent(message.content)}
                </div>
                <div
                  className={`text-xs mt-2 ${
                    message.sender_type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {new Date(message.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-3xl flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-sm text-gray-600 ml-2">Guide is typing...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Premium Preview */}
      {premiumPreview && (
        <div className="border-t border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-purple-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-purple-700 mb-2">{premiumPreview.message}</p>
                <div className="flex flex-wrap gap-2">
                  {premiumPreview.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => router.push('/pricing')}
                className="bg-purple-600 hover:bg-purple-700 text-sm"
              >
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="border-t border-red-200 bg-red-50 p-4">
          <div className="max-w-3xl mx-auto flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 flex-1">{error}</p>
            <Button
              onClick={() => setError(null)}
              variant="outline"
              className="text-sm"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Continue your conversation with your financial guide..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                rows={3}
                disabled={loading || (usage ? usage.remaining === 0 && !usage.isUnlimited : false)}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  Press Enter to send, Shift+Enter for new line
                </p>
                <p className="text-xs text-gray-500">
                  {newMessage.length}/500 characters
                </p>
              </div>
            </div>
            <Button
              onClick={sendMessage}
              disabled={loading || !newMessage.trim() || (usage ? usage.remaining === 0 && !usage.isUnlimited : false)}
              className="mb-7"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 