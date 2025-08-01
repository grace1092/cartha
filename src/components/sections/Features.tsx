'use client'

import { useEffect, useState } from 'react'
import { 
  FileText, 
  MessageSquare, 
  Users, 
  Shield, 
  Calendar, 
  BarChart3,
  Zap,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { revealOnScroll } from '@/lib/utils'
import Modal from '@/components/ui/Modal'
import AISessionNotesDashboard from './AISessionNotesDashboard'
import FollowUpAutomationDashboard from './FollowUpAutomationDashboard'
import ClientManagementDashboard from './ClientManagementDashboard'
import SecurityDashboard from './SecurityDashboard'
import SmartSchedulingDashboard from './SmartSchedulingDashboard'
import PracticeAnalyticsDashboard from './PracticeAnalyticsDashboard'

export default function Features() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    type: string | null;
  }>({
    isOpen: false,
    title: '',
    type: null
  });

  useEffect(() => {
    revealOnScroll()
  }, [])

  const features = [
    {
      icon: FileText,
      title: 'AI Session Notes',
      description: 'Automatically generate comprehensive session notes with AI-powered transcription and smart templates.',
      gradient: 'from-blue-500 to-cyan-500',
      details: [
        'Real-time voice transcription',
        'Smart template suggestions',
        'Progress tracking automation',
        'Treatment plan integration'
      ],
      hasDashboard: true,
      dashboardType: 'ai-notes'
    },
    {
      icon: MessageSquare,
      title: 'Automated Follow-ups',
      description: 'Keep clients engaged with personalized follow-up emails and appointment reminders.',
      gradient: 'from-purple-500 to-pink-500',
      details: [
        'Personalized email templates',
        'Automated scheduling',
        'Client engagement tracking',
        'HIPAA-compliant communication'
      ],
      hasDashboard: true,
      dashboardType: 'follow-up'
    },
    {
      icon: Users,
      title: 'Client Management',
      description: 'Comprehensive client dashboards with progress tracking and treatment milestone management.',
      gradient: 'from-indigo-500 to-purple-500',
      details: [
        'Progress overview dashboards',
        'Interactive charts and graphs',
        'Treatment milestone tracking',
        'Customizable reporting'
      ],
      hasDashboard: true,
      dashboardType: 'client-management'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Healthcare-grade security and compliance to protect your practice and client data.',
      gradient: 'from-green-500 to-emerald-500',
      details: [
        'HIPAA Compliant infrastructure',
        'SOC 2 Type II certified',
        '256-bit SSL encryption',
        'Regular security audits'
      ],
      hasDashboard: true,
      dashboardType: 'security'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Intelligent appointment scheduling with conflict detection and automated reminders.',
      gradient: 'from-orange-500 to-red-500',
      details: [
        'Conflict-free scheduling',
        'Automated reminders',
        'Calendar integration',
        'Waitlist management'
      ],
      hasDashboard: true,
      dashboardType: 'scheduling'
    },
    {
      icon: BarChart3,
      title: 'Practice Analytics',
      description: 'Data-driven insights to optimize your practice performance and client outcomes.',
      gradient: 'from-teal-500 to-blue-500',
      details: [
        'Revenue analytics',
        'Client outcome tracking',
        'Practice performance metrics',
        'Custom report generation'
      ],
      hasDashboard: true,
      dashboardType: 'analytics'
    }
  ]

  const handleLearnMore = (feature: any) => {
    if (feature.hasDashboard) {
      setModalState({
        isOpen: true,
        title: feature.title,
        type: feature.dashboardType
      });
    }
  }

  const closeModal = () => {
    setModalState({
      isOpen: false,
      title: '',
      type: null
    });
  }

  const handleMinimize = () => {
    // Future implementation for minimize functionality
    console.log('Minimize clicked');
  }

  const renderModalContent = () => {
    switch (modalState.type) {
      case 'ai-notes':
        return <AISessionNotesDashboard />;
      case 'follow-up':
        return <FollowUpAutomationDashboard />;
      case 'client-management':
        return <ClientManagementDashboard />;
      case 'security':
        return <SecurityDashboard />;
      case 'scheduling':
        return <SmartSchedulingDashboard />;
      case 'analytics':
        return <PracticeAnalyticsDashboard />;
      default:
        return <div>Tool not found</div>;
    }
  }

  return (
    <>
      <section id="features" className="py-24 lg:py-32 relative bg-gradient-to-b from-white to-gray-50">
        <div className="container-modern relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="scroll-reveal">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Everything you need to run your
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> therapy practice</span>
              </h2>
            </div>
            <div className="scroll-reveal" style={{ animationDelay: '0.2s' }}>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Streamline your workflow with powerful tools designed specifically for mental health professionals. 
                Focus on what matters most – your clients.
              </p>
            </div>
          </div>

          {/* Feature Cards - 3 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={feature.title}
                  className="scroll-reveal group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div 
                    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full cursor-pointer hover:ring-2 hover:ring-blue-400"
                    onClick={() => handleLearnMore(feature)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleLearnMore(feature)
                      }
                    }}
                  >
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Feature Details */}
                    <ul className="space-y-3 mb-6">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700 leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Learn More Link - Now secondary action */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation() // Prevent card click when button is clicked
                        handleLearnMore(feature)
                      }}
                      className="text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors duration-300 flex items-center"
                    >
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Full-Screen Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onMinimize={handleMinimize}
        title={modalState.title}
        showMinimize={true}
      >
        {renderModalContent()}
      </Modal>
    </>
  )
} 