import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const personalityTypes = {
  security: {
    type: 'The Protector',
    description: 'You prioritize financial security and stability above all else.',
    color: 'bg-green-500',
    icon: '🛡️'
  },
  freedom: {
    type: 'The Adventurer',
    description: 'You see money as a tool for experiences and personal freedom.',
    color: 'bg-blue-500',
    icon: '🗺️'
  },
  status: {
    type: 'The Achiever',
    description: 'You view money as a reflection of success and accomplishment.',
    color: 'bg-purple-500',
    icon: '🏆'
  },
  stress: {
    type: 'The Avoider',
    description: 'You find money conversations stressful and prefer to avoid them.',
    color: 'bg-yellow-500',
    icon: '😰'
  }
};

const quizQuestions = [
  {
    id: 1,
    question: "When you think about money, what's your first feeling?",
    options: [
      { value: 'security', label: 'Security - I want to feel safe and prepared' },
      { value: 'freedom', label: 'Freedom - Money buys me choices and experiences' },
      { value: 'status', label: 'Status - Money reflects success and achievement' },
      { value: 'stress', label: 'Stress - Money feels overwhelming and complicated' }
    ]
  },
  {
    id: 2,
    question: "Your ideal Saturday involves:",
    options: [
      { value: 'planning', label: 'Planning our financial future together' },
      { value: 'spending', label: 'Enjoying life - we can figure out money later' },
      { value: 'saving', label: 'Finding ways to save and optimize our budget' },
      { value: 'avoiding', label: 'Anything but talking about money!' }
    ]
  },
  {
    id: 3,
    question: "When your partner makes a big purchase without discussing it:",
    options: [
      { value: 'concerned', label: 'I feel concerned about our financial security' },
      { value: 'curious', label: 'I want to understand their reasoning' },
      { value: 'frustrated', label: 'I feel frustrated about the lack of communication' },
      { value: 'trusting', label: 'I trust their judgment completely' }
    ]
  }
];

function calculatePersonalityType(answers: Record<string, string>) {
  const answerValues = Object.values(answers);
  
  // Map second question answers to personality types
  const mappings: Record<string, string> = {
    planning: 'security',
    spending: 'freedom', 
    saving: 'security',
    avoiding: 'stress',
    concerned: 'security',
    curious: 'freedom',
    frustrated: 'status',
    trusting: 'freedom'
  };

  // Count frequency of each personality type
  const frequency: Record<string, number> = {};
  answerValues.forEach(answer => {
    const personalityType = mappings[answer] || answer;
    frequency[personalityType] = (frequency[personalityType] || 0) + 1;
  });

  // Find dominant personality type
  const dominantTrait = Object.keys(frequency).reduce((a, b) => 
    frequency[a] > frequency[b] ? a : b
  );

  return personalityTypes[dominantTrait as keyof typeof personalityTypes];
}

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
    const { answers } = body;

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate personality type
    const personalityResult = calculatePersonalityType(answers);
    const personalityType = Object.keys(personalityTypes).find(
      key => personalityTypes[key as keyof typeof personalityTypes].type === personalityResult.type
    );

    // Save quiz results
    const quizResultsData = Object.entries(answers).map(([questionId, answerValue]) => {
      const question = quizQuestions.find(q => q.id === parseInt(questionId));
      const option = question?.options.find(opt => opt.value === answerValue);
      
      return {
        user_id: user.id,
        question_id: parseInt(questionId),
        question_text: question?.question || '',
        answer_value: answerValue,
        answer_label: option?.label || ''
      };
    });

    const { error: quizError } = await supabase
      .from('quiz_results')
      .insert(quizResultsData);

    if (quizError) {
      console.error('Quiz results save error:', quizError);
      return NextResponse.json({ error: 'Failed to save quiz results' }, { status: 500 });
    }

    // Update user profile with personality type
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({
        personality_type: personalityType,
        personality_result: personalityResult,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (profileError) {
      console.error('Profile update error:', profileError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ 
      personalityResult,
      personalityType 
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 