export const PRICING = {
  currency: "USD",
  annualDiscountNote: "Annual plans: 2 months free.",
  seatAddon: { label: "Additional seat (Group)", priceMonthly: 75 },
  tiers: [
    {
      id: "solo",
      name: "Solo",
      priceMonthly: 125,
      priceAnnual: 1250,
      seatsIncluded: 1,
      cta: { label: "Start free pilot", href: "/signup?plan=solo" },
      features: [
        "HIPAA-grade encryption (at rest & in transit)",
        "Client progress tracking & outcomes",
        "Automated follow-ups & reminders",
        "Mobile access",
        "Basic analytics dashboard",
        "Email support",
        "Audit logs",
      ],
    },
    {
      id: "group",
      name: "Group",
      popular: true,
      priceMonthly: 400,
      priceAnnual: 4000,
      seatsIncluded: 5,
      addonNote: "+$75/mo per additional seat",
      cta: { label: "Start free pilot", href: "/signup?plan=group" },
      features: [
        "Everything in Solo",
        "Multi-user team collaboration",
        "Advanced practice analytics",
        "Custom client forms & worksheets",
        "Team scheduling & coordination",
        "Priority email + phone support",
        "Role-based access controls",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise (Clinic)",
      priceMonthly: 1200,
      priceAnnual: 12000,
      seatsIncluded: "Unlimited users & locations",
      cta: { label: "Talk to us", href: "/contact?type=enterprise" },
      features: [
        "Everything in Group",
        "Dedicated account manager",
        "SSO/SAML",
        "Custom API & white-label options",
        "Enhanced security & compliance",
        "Onboarding & training included",
        "24/7 priority support",
        "Custom integrations",
      ],
    },
  ],
} as const;

export type PricingConfig = typeof PRICING;

