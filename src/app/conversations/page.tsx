import { Suspense } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import ConversationStarter from '@/components/conversations/ConversationStarter';

export default function ConversationsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <ConversationStarter />
        </Suspense>
      </div>
    </AuthGuard>
  );
} 