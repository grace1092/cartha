'use client';

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Heart, CheckCircle, Star, Users, MessageCircle, BarChart3, Crown, Zap, Shield, Video, FileText, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Button from '@/components/ui/Button'

const tierQuestions = [
  {
    id: 1,
    question: "What's your current financial situation?",
    options: [
      { id: 'a', text: "Just starting out, tight budget", value: 'tight', tier: 1 },
      { id: 'b', text: "Stable income, looking to improve", value: 'stable', tier: 2 },
      { id: 'c', text: "Good income, ready to optimize", value: 'optimize', tier: 3 },
      { id: 'd', text: "High income, complex situation", value: 'complex', tier: 4 }
    ]
  },
  {
    id: 2,
    question: "How often do you want AI-guided conversations?",
    options: [
      { id: 'a', text: "A few times per month", value: 'few', tier: 1 },
      { id: 'b', text: "Weekly conversations", value: 'weekly', tier: 2 },
      { id: 'c', text: "Multiple times per week", value: 'multiple', tier: 3 },
      { id: 'd', text: "Whenever we need guidance", value: 'unlimited', tier: 4 }
    ]
  },
  {
    id: 3,
    question: "What level of support do you need?",
    options: [
      { id: 'a', text: "Basic templates and community", value: 'basic', tier: 1 },
      { id: 'b', text: "Personalized tracking and email support", value: 'personal', tier: 2 },
      { id: 'c', text: "Advanced features and video sessions", value: 'advanced', tier: 3 },
      { id: 'd', text: "Personal advisor and expert coaching", value: 'expert', tier: 4 }
    ]
  }
]

const tiers = [
  {
    id: 1,
    name: "First Steps",
    price: "FREE",
    description: "Perfect for couples just starting their financial journey",
    target: "New couples or tight budgets",
    color: "from-green-400 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: <Heart className="w-6 h-6" />,
    features: [
      "3 AI-guided conversations per month",
      "Basic conversation templates",
      "Simple compatibility assessment", 
      "3 foundational articles",
      "Community forum (read-only)"
    ],
    limitations: [
      "Limited conversation history",
      "Basic AI responses",
      "No personalization"
    ]
  },
  {
    id: 2,
    name: "Building Together", 
    price: "$20/month",
    yearlyPrice: "$200/year",
    savings: "Save 17%",
    description: "For couples ready to develop better financial habits",
    target: "Growing relationships",
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-50", 
    borderColor: "border-blue-200",
    icon: <Users className="w-6 h-6" />,
    popular: true,
    features: [
      "25 conversations/month with 20 messages each",
      "Money Date Tracking Calendar",
      "Budget App Integration", 
      "Relationship Financial Score",
      "Monthly Progress Reports",
      "Goal Tracking Dashboard",
      "Conversation Insights Library",
      "Partner Invitation System"
    ],
    upgrades: [
      "3x more conversations than free",
      "Personalized insights",
      "Goal tracking system"
    ]
  },
  {
    id: 3,
    name: "Financial Partners",
    price: "$30/month", 
    yearlyPrice: "$299/year",
    savings: "Save 17%",
    description: "For couples serious about financial optimization",
    target: "Committed partnerships",
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200", 
    icon: <BarChart3 className="w-6 h-6" />,
    features: [
      "Unlimited AI conversations",
      "All templates + custom builder",
      "Advanced analytics dashboard",
      "Couples financial worksheets",
      "Priority support + video calls (2/month)",
      "Early access to new features"
    ],
    upgrades: [
      "Unlimited conversations",
      "Custom template creation",
      "Video support sessions"
    ]
  },
  {
    id: 4,
    name: "Wealth Builders",
    price: "$60/month",
    yearlyPrice: "$599/year", 
    savings: "Save 17%",
    description: "For high-income couples with complex needs",
    target: "Wealth optimization",
    color: "from-amber-400 to-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: <Crown className="w-6 h-6" />,
    premium: true,
    features: [
      "Everything in Financial Partners",
      "Personal AI financial advisor",
      "Custom financial modeling",
      "Financial account integration", 
      "Monthly expert group sessions",
      "Quarterly 1-on-1 coaching calls"
    ],
    upgrades: [
      "AI financial advisor",
      "Account integration",
      "Expert coaching"
    ]
  }
]

export default function FindYourStartingPoint() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{[key: number]: string}>({})
  const [showResults, setShowResults] = useState(false)
  const [recommendedTier, setRecommendedTier] = useState<number>(1)
  const [showAllTiers, setShowAllTiers] = useState(false)

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const nextQuestion = () => {
    if (currentQuestion < tierQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Calculate recommended tier based on answers
      const tierScores = [0, 0, 0, 0, 0] // index 0 unused, 1-4 for tiers
      
      Object.entries(answers).forEach(([qId, value]) => {
        const question = tierQuestions[parseInt(qId) - 1]
        const option = question.options.find(opt => opt.value === value)
        if (option) {
          tierScores[option.tier]++
        }
      })
      
      // Find tier with highest score
      const recommended = tierScores.indexOf(Math.max(...tierScores.slice(1)))
      setRecommendedTier(recommended)
      setShowResults(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setShowAllTiers(false)
  }

  const TierCard = ({ tier, isRecommended = false }: { tier: typeof tiers[0], isRecommended?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border-2 p-8 ${
        isRecommended 
          ? `${tier.borderColor} bg-gradient-to-br ${tier.bgColor} shadow-xl scale-105` 
          : 'border-gray-200 bg-white shadow-lg'
      } ${tier.popular ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      
      {tier.premium && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Crown className="w-4 h-4" />
            Premium
          </span>
        </div>
      )}

      {isRecommended && (
        <div className="absolute -top-4 right-4">
          <span className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Recommended
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${tier.color} text-white mb-4`}>
          {tier.icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
        <p className="text-gray-600 mt-2">{tier.description}</p>
        <div className="mt-4">
          <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
          {tier.yearlyPrice && (
            <div className="text-sm text-gray-500 mt-1">
              or {tier.yearlyPrice} • <span className="text-green-600 font-semibold">{tier.savings}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">{tier.target}</p>
      </div>

      <ul className="space-y-3 mb-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {tier.upgrades && (
        <div className="border-t pt-4 mb-6">
          <p className="text-sm font-semibold text-gray-900 mb-2">Key Upgrades:</p>
          <ul className="space-y-1">
            {tier.upgrades.map((upgrade, index) => (
              <li key={index} className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">{upgrade}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button
        onClick={() => router.push('/pricing')}
        className={`w-full ${
          isRecommended 
            ? `bg-gradient-to-r ${tier.color} text-white` 
            : tier.price === 'FREE' 
              ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' 
              : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {tier.price === 'FREE' ? 'Start Free' : 'Choose Plan'}
      </Button>
    </motion.div>
  )

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-24 sm:py-32 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Find Your
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Perfect Starting Point</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Take our quick 3-question assessment to discover which MoneyTalks tier matches your relationship's financial journey and goals.
              </p>
              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  30-day money-back guarantee
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  2,500+ couples transformed
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz Section */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-xl p-8"
                >
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Question {currentQuestion + 1} of {tierQuestions.length}</span>
                      <span>{Math.round(((currentQuestion + 1) / tierQuestions.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${((currentQuestion + 1) / tierQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {tierQuestions[currentQuestion].question}
                    </h2>
                    
                    <div className="space-y-4">
                      {tierQuestions[currentQuestion].options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleAnswer(tierQuestions[currentQuestion].id, option.value)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:border-blue-300 hover:bg-blue-50 ${
                            answers[tierQuestions[currentQuestion].id] === option.value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                              answers[tierQuestions[currentQuestion].id] === option.value
                                ? 'border-blue-600 bg-blue-600'
                                : 'border-gray-300'
                            }`}>
                              {answers[tierQuestions[currentQuestion].id] === option.value && (
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-gray-800">{option.text}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Next Button */}
                  <div className="flex justify-end">
                    <Button
                      onClick={nextQuestion}
                      disabled={!answers[tierQuestions[currentQuestion].id]}
                      className="flex items-center gap-2"
                    >
                      {currentQuestion < tierQuestions.length - 1 ? 'Next Question' : 'Get My Recommendation'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Results Header */}
                  <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                    <div className="text-6xl mb-4">🎯</div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Your Perfect Starting Point
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                      Based on your answers, we recommend starting with <strong>{tiers[recommendedTier - 1]?.name}</strong>
                    </p>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {tiers[recommendedTier - 1]?.features.length}
                        </div>
                        <div className="text-sm text-gray-500">Features</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {tiers[recommendedTier - 1]?.price}
                        </div>
                        <div className="text-sm text-gray-500">Price</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">4.9★</div>
                        <div className="text-sm text-gray-500">Rating</div>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Tier */}
                  <div className="max-w-md mx-auto">
                    <TierCard tier={tiers[recommendedTier - 1]} isRecommended={true} />
                  </div>

                  {/* Action Buttons */}
                  <div className="text-center space-y-4">
                    <Button
                      onClick={() => router.push('/pricing')}
                      className="mr-4"
                    >
                      View Full Pricing
                    </Button>
                    <Button
                      onClick={() => setShowAllTiers(true)}
                      variant="outline"
                      className="mr-4"
                    >
                      Compare All Plans
                    </Button>
                    <Button
                      onClick={resetQuiz}
                      variant="outline"
                    >
                      Retake Assessment
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* All Tiers Comparison */}
        {(showAllTiers || showResults) && (
          <section className="py-24 bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Choose Your Perfect Plan
                </h2>
                <p className="text-lg text-gray-600">
                  Start with any tier and upgrade anytime as your relationship grows
                </p>
              </div>

              <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
                {tiers.map((tier, index) => (
                  <TierCard 
                    key={tier.id} 
                    tier={tier} 
                    isRecommended={showResults && tier.id === recommendedTier}
                  />
                ))}
              </div>

              {/* Feature Comparison Table */}
              <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <h3 className="text-xl font-bold text-gray-900">Feature Comparison</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-6 font-semibold text-gray-900">Features</th>
                        {tiers.map(tier => (
                          <th key={tier.id} className="text-center py-3 px-4 font-semibold text-gray-900">
                            {tier.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { feature: "AI Conversations", values: ["3/month", "25/month", "Unlimited", "Unlimited"] },
                        { feature: "Conversation Templates", values: ["Basic", "Advanced", "All + Custom", "All + Custom"] },
                        { feature: "Progress Tracking", values: ["❌", "✅", "✅", "✅"] },
                        { feature: "Video Support", values: ["❌", "❌", "2/month", "Included"] },
                        { feature: "Expert Coaching", values: ["❌", "❌", "❌", "Quarterly"] },
                        { feature: "Account Integration", values: ["❌", "❌", "❌", "✅"] }
                      ].map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                          {row.values.map((value, valueIndex) => (
                            <td key={valueIndex} className="py-4 px-4 text-center text-gray-700">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Success Stories by Tier */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Real Stories from Real Couples
              </h2>
              <p className="text-lg text-gray-600">
                See how couples at every tier have transformed their financial relationships
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  tier: "First Steps",
                  name: "Jake & Emma",
                  story: "We were avoiding money talks completely. The free tier helped us start having basic conversations without pressure.",
                  result: "Finally talking about money",
                  color: "from-green-400 to-green-600"
                },
                {
                  tier: "Building Together", 
                  name: "Mike & Sarah",
                  story: "The personalized tracking helped us align our goals. We went from arguing about spending to planning our future together.",
                  result: "Aligned financial goals",
                  color: "from-blue-400 to-blue-600"
                },
                {
                  tier: "Financial Partners",
                  name: "David & Lisa",
                  story: "The unlimited conversations and video sessions took our communication to another level. We make better decisions together now.",
                  result: "Better financial decisions",
                  color: "from-purple-400 to-purple-600"
                },
                {
                  tier: "Wealth Builders",
                  name: "Alex & Jordan", 
                  story: "The personal advisor and coaching calls helped us optimize our investment strategy and plan for early retirement.",
                  result: "On track for early retirement",
                  color: "from-amber-400 to-amber-600"
                }
              ].map((story, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${story.color} mb-4`}>
                    {story.tier}
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{story.story}"</p>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">{story.name}</p>
                    <p className="text-green-600 font-medium">{story.result}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gray-50">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: "Can I upgrade or downgrade my plan anytime?",
                  a: "Yes! You can change your plan anytime. Upgrades take effect immediately, and downgrades take effect at your next billing cycle."
                },
                {
                  q: "What happens if I exceed my conversation limit?",
                  a: "We'll send you a friendly reminder when you reach 80% usage. If you hit your limit, you can either wait for the monthly reset or upgrade to continue immediately."
                },
                {
                  q: "Is there really a free tier with no hidden costs?",
                  a: "Absolutely! Our First Steps tier is completely free forever. No credit card required, no hidden fees. We believe every couple deserves access to better financial communication."
                },
                {
                  q: "How does the 30-day money-back guarantee work?",
                  a: "If you're not completely satisfied within 30 days of any paid plan, we'll refund your money, no questions asked. You can even keep access to any conversations you've had."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-700">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Financial Relationship?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join 2,500+ couples who've already started their journey to financial harmony
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
              >
                Start Free Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={resetQuiz}
              >
                Retake Assessment
              </Button>
            </div>
            <p className="text-sm text-blue-100 mt-4">
              💰 30-day money-back guarantee on all paid plans
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
} 