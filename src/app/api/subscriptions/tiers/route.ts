import { NextResponse } from 'next/server';

const SUBSCRIPTION_TIERS = {
  solo: {
    id: 'solo',
    name: 'Solo Practitioner',
    price: 50,
    originalPrice: 75,
    features: [
      'AI session notes',
      'Client scheduling',
      'Basic analytics',
      'Secure messaging',
      'HIPAA-ready architecture'
    ]
  },
  group: {
    id: 'group',
    name: 'Small Group Practice',
    price: 150,
    originalPrice: 200,
    features: [
      'Everything in Solo, plus:',
      'Multi-user roles',
      'Shared dashboards',
      'Team scheduling',
      'Advanced analytics'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Large Organization',
    price: 500,
    originalPrice: 600,
    features: [
      'Everything in Group, plus:',
      'SSO integration',
      'Custom onboarding',
      'Priority support',
      'Custom integrations'
    ]
  }
};

export async function GET() {
  return NextResponse.json(SUBSCRIPTION_TIERS);
}