'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Sparkles, Clock, Users, TrendingUp, ChevronRight, Crown, Trash2 } from 'lucide-react';
import Button from '../ui/Button';

interface ConversationTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: React.ElementType;
  category: string;
}

interface UsageData {
  used: number;
  limit: number;
  remaining: number;
  isUnlimited: boolean;
}

const conversationTemplates: ConversationTemplate[] = [
  {
    id: 'spending-priorities',
    title: 'We disagree about spending priorities',
    description: 'Navigate different views on how to allocate your money',
    prompt: "My partner and I have different opinions about what we should prioritize when spending our money. How can we find common ground and make decisions together?",
    icon: Users,
    category: 'conflict'
  },
  {
    id: 'financial-future',
    title: 'Planning our financial future together',
    description: 'Create aligned goals and a roadmap for your relationship',
    prompt: "We want to start planning our financial future together but don't know where to begin. What are the key areas we should discuss and plan for?",
    icon: TrendingUp,
    category: 'planning'
  },
  {
    id: 'debt-management',
    title: 'Dealing with debt as a couple',
    description: 'Address debt challenges while strengthening your relationship',
    prompt: "We're dealing with debt (student loans, credit cards, etc.) and it's causing stress in our relationship. How can we tackle this together?",
    icon: Clock,
    category: 'debt'
  },
  {
    id: 'saving-goals',
    title: 'Saving for major goals',
    description: 'Build a strategy for big purchases and milestones',
    prompt: "We have some big financial goals (house, wedding, travel) but struggle to save consistently. How can we create a plan that works for both of us?",
    icon: Sparkles,
    category: 'goals'
  },
  {
    id: 'money-styles',
    title: 'Managing different money styles',
    description: 'Bridge the gap between different financial personalities',
    prompt: "My partner and I have very different approaches to money - one of us is a saver, the other is a spender. How can we balance our different styles?",
    icon: MessageCircle,
    category: 'styles'
  }
];

export default function ConversationStarter() {
  const router = useRouter();
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ConversationTemplate | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        setUsage(data.usage);
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to fetch usage data:', error);
    }
  };

  const deleteConversation = async (conversationId: string, title: string) => {
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?\n\nNote: This won't restore your monthly usage count. Each conversation counts toward your limit when started, regardless of deletion.`
    );
    
    if (!confirmed) return;

    setDeleteLoading(conversationId);
    try {
      const response = await fetch(`/api/conversations?conversationId=${conversationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove conversation from local state
        setConversations(conversations.filter((conv: any) => conv.id !== conversationId));
        
        // Show success message
        alert('Conversation deleted successfully.');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete conversation');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      alert('Failed to delete conversation. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const startConversation = async (message: string) => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          conversationType: selectedTemplate?.category || 'general'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to conversation page
        router.push(`/conversations/${data.conversation.id}`);
      } else if (response.status === 429) {
        // Handle usage limit reached
        alert(data.upgradeMessage || 'You\'ve reached your monthly conversation limit. Upgrade to continue!');
        router.push('/pricing');
      } else {
        throw new Error(data.error || 'Failed to start conversation');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: ConversationTemplate) => {
    setSelectedTemplate(template);
    setCustomMessage(template.prompt);
  };

  const getUsageColor = () => {
    if (!usage) return 'text-gray-500';
    if (usage.isUnlimited) return 'text-green-600';
    if (usage.remaining === 0) return 'text-red-600';
    if (usage.remaining <= 3) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getUsageBgColor = () => {
    if (!usage) return 'bg-gray-100';
    if (usage.isUnlimited) return 'bg-green-50';
    if (usage.remaining === 0) return 'bg-red-50';
    if (usage.remaining <= 3) return 'bg-yellow-50';
    return 'bg-blue-50';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Start Your AI-Guided Money Conversation
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get expert conversation guidance to navigate your most important financial discussions together
        </p>
      </div>

      {/* Usage Display */}
      {usage && (
        <div className={`${getUsageBgColor()} border border-gray-200 rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className={`w-5 h-5 ${getUsageColor()}`} />
              <div>
                <p className={`font-semibold ${getUsageColor()}`}>
                  {usage.isUnlimited ? (
                    <span className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Unlimited Conversations
                    </span>
                  ) : (
                    `${usage.remaining} conversations remaining this month`
                  )}
                </p>
                {!usage.isUnlimited && (
                  <p className="text-sm text-gray-600">
                    {usage.used} of {usage.limit} used
                  </p>
                )}
              </div>
            </div>
            {!usage.isUnlimited && usage.remaining <= 3 && (
              <Button
                onClick={() => router.push('/pricing')}
                className="text-sm"
                variant="outline"
              >
                Upgrade for Unlimited
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Conversation Templates */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Choose a conversation starter
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {conversationTemplates.map((template) => {
            const Icon = template.icon;
            const isSelected = selectedTemplate?.id === template.id;
            
            return (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`text-left p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`w-6 h-6 mt-1 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {template.title}
                    </h3>
                    <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                      {template.description}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Message Input */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedTemplate ? 'Customize your message' : 'Or start with your own question'}
        </h3>
        <div className="space-y-4">
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Describe your financial situation or question. The more specific you are, the better guidance we can provide..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-base resize-none"
          />
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {customMessage.length}/500 characters
            </p>
            <Button
              onClick={() => startConversation(customMessage)}
              disabled={loading || !customMessage.trim() || (usage ? usage.remaining === 0 && !usage.isUnlimited : false)}
              className="px-8"
            >
              {loading ? 'Starting...' : 'Start Conversation'}
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      {conversations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Conversations
          </h3>
          <div className="space-y-2">
            {conversations.slice(0, 5).map((conversation: any) => (
              <div
                key={conversation.id}
                className="flex items-center w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <button
                  onClick={() => router.push(`/conversations/${conversation.id}`)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{conversation.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(conversation.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {conversation.quality_tier === 'premium' && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => deleteConversation(conversation.id, conversation.title)}
                  disabled={deleteLoading === conversation.id}
                  className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete conversation"
                >
                  {deleteLoading === conversation.id ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium">Note about deletion:</p>
            <p>Deleting conversations won't restore your monthly usage count. Each conversation counts toward your limit when started, regardless of whether it's later deleted.</p>
          </div>
        </div>
      )}

      {/* Premium Preview (for free users with 10+ conversations) */}
      {usage && !usage.isUnlimited && usage.used >= 10 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <Crown className="w-8 h-8 text-purple-600 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                Ready for deeper insights?
              </h3>
              <p className="text-purple-700 mb-4">
                You've been making great progress! Premium users get enhanced AI responses, unlimited conversations, and personalized relationship insights.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-sm text-purple-700">Unlimited conversations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-sm text-purple-700">Enhanced AI intelligence</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-sm text-purple-700">Relationship compatibility scoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-sm text-purple-700">Monthly progress reports</span>
                </div>
              </div>
              <Button
                onClick={() => router.push('/pricing')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 