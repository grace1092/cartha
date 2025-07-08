"use client";

import { useState } from 'react';
import Button from '../ui/Button';

interface UsageDisplayProps {
  conversationsUsed: number;
  conversationsRemaining: number;
  isPremium: boolean;
  currentConversationMessages?: number;
  messagesRemainingInConversation?: number;
  onUpgradeClick?: () => void;
}

export default function UsageDisplay({
  conversationsUsed,
  conversationsRemaining,
  isPremium,
  currentConversationMessages = 0,
  messagesRemainingInConversation,
  onUpgradeClick
}: UsageDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);

  const totalConversationLimit = isPremium ? "unlimited" : 3;
  const messageLimit = isPremium ? 20 : 10;

  // Determine warning levels
  const conversationWarningLevel = isPremium ? 'none' : 
    conversationsRemaining <= 2 ? 'critical' : 
    conversationsRemaining <= 5 ? 'warning' : 'normal';

  const messageWarningLevel = messagesRemainingInConversation !== undefined ? (
    messagesRemainingInConversation <= 1 ? 'critical' :
    messagesRemainingInConversation <= 3 ? 'warning' : 'normal'
  ) : 'normal';

  const getBarColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getTextColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">
          {isPremium ? 'Premium Plan' : 'Free Plan'} Usage
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {/* Conversations Usage */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Monthly Conversations
          </span>
          <span className={`text-sm font-medium ${getTextColor(conversationWarningLevel)}`}>
            {conversationsUsed} / {totalConversationLimit}
          </span>
        </div>
        
        {!isPremium && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getBarColor(conversationWarningLevel)}`}
              style={{ width: `${Math.min((conversationsUsed / 3) * 100, 100)}%` }}
            />
          </div>
        )}

        <p className={`text-sm ${getTextColor(conversationWarningLevel)}`}>
          {isPremium ? (
            "Unlimited conversations"
          ) : conversationsRemaining > 0 ? (
            `${conversationsRemaining} conversations remaining this month`
          ) : (
            "Monthly limit reached! Upgrade for unlimited conversations."
          )}
        </p>
      </div>

      {/* Current Conversation Messages (if in conversation) */}
      {messagesRemainingInConversation !== undefined && (
        <div className="mb-4 border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Current Conversation
            </span>
            <span className={`text-sm font-medium ${getTextColor(messageWarningLevel)}`}>
              {currentConversationMessages} / {messageLimit} messages
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getBarColor(messageWarningLevel)}`}
              style={{ width: `${Math.min((currentConversationMessages / messageLimit) * 100, 100)}%` }}
            />
          </div>

          <p className={`text-sm ${getTextColor(messageWarningLevel)}`}>
            {messagesRemainingInConversation > 0 ? (
              `${messagesRemainingInConversation} messages remaining in this conversation`
            ) : (
              `Message limit reached! ${isPremium ? 'Start a new conversation to continue.' : 'Upgrade for more messages per conversation.'}`
            )}
          </p>
        </div>
      )}

      {/* Detailed breakdown */}
      {showDetails && (
        <div className="border-t pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Plan Benefits:</p>
              <ul className="mt-1 space-y-1 text-gray-600">
                                  <li>• {isPremium ? 'Unlimited' : '3'} conversations/month</li>
                                  <li>• {isPremium ? '20' : '10'} messages per conversation</li>
                <li>• {isPremium ? 'GPT-4' : 'GPT-3.5'} AI responses</li>
                {isPremium && (
                  <>
                    <li>• Detailed relationship insights</li>
                    <li>• Personalized action plans</li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-700">Monthly Reset:</p>
              <p className="text-gray-600 text-sm mt-1">
                Usage resets on the 1st of each month
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade prompt for free users */}
      {!isPremium && (conversationWarningLevel !== 'normal' || messageWarningLevel !== 'normal') && (
        <div className="border-t pt-4">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">
              Ready for Deeper Conversations?
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Upgrade to continue your money talk journey with unlimited conversations and enhanced AI insights.
            </p>
            <Button 
              onClick={onUpgradeClick}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white"
              size="sm"
            >
              Upgrade to Premium
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 