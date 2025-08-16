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
      description: 'Generate comprehensive session notes with AI assistance. Perfect for therapists, psychologists, and counselors.',
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
      description: 'Automated client communication that saves time and improves engagement for all practice types.',
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
      description: 'Lightweight client organization for individual and group practices. Simple, effective, and secure.',
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
        return <AISessionNotesDashboard onClose={closeModal} />;
      case 'follow-up':
        return <FollowUpAutomationDashboard onClose={closeModal} />;
      case 'client-management':
        return <ClientManagementDashboard onClose={closeModal} />;
      case 'security':
        return <SecurityDashboard onClose={closeModal} />;
      case 'scheduling':
        return <SmartSchedulingDashboard onClose={closeModal} />;
      case 'analytics':
        return <PracticeAnalyticsDashboard onClose={closeModal} />;
      default:
        return <div>Tool not found</div>;
    }
  }

  return (
    <>
      <section id="features" className="py-24 lg:py-32 relative section-features">
        <div className="container-modern relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="scroll-reveal">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading mb-6">
                Everything you need to run your
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> therapy practice</span>
              </h2>
            </div>
            <div className="scroll-reveal" style={{ animationDelay: '0.2s' }}>
              <p className="text-xl text-body max-w-3xl mx-auto leading-relaxed">
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
                    className="feature-card h-full cursor-pointer hover:ring-2 hover:ring-blue-400"
                    onClick={() => handleLearnMore(feature)}
                  >
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-heading mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-body mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Feature List */}
                    <ul className="space-y-3 mb-6">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-caption">{detail}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="flex items-center justify-between mt-auto">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLearnMore(feature);
                        }}
                        className="flex items-center space-x-2 text-link hover:text-link-hover font-semibold transition-colors duration-200"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </button>
                      {feature.hasDashboard && (
                        <div className="flex items-center space-x-1">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <span className="text-xs text-muted">Live Demo</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="scroll-reveal">
              <p className="text-lg text-body mb-8">
                Ready to transform your practice? Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="btn-primary px-8 py-4 text-lg font-semibold">
                  Start Free Trial
                </button>
                <button className="btn-secondary px-8 py-4 text-lg font-semibold">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20" />
        </div>
      </section>

      {/* Feature Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onMinimize={handleMinimize}
        title={modalState.title}
      >
        {renderModalContent()}
      </Modal>
    </>
  )
} 