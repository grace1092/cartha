import { Suspense } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import ConversationInterface from '@/components/conversations/ConversationInterface';

interface ConversationPageProps {
  params: { id: string };
}

export default function ConversationPage({ params }: ConversationPageProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading conversation...</div>}>
          <ConversationInterface conversationId={params.id} />
        </Suspense>
      </div>
    </AuthGuard>
  );
} 