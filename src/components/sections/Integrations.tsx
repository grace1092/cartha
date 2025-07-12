'use client'

import { useEffect } from 'react'
import { revealOnScroll } from '@/lib/utils'
import { Link, Calendar, CreditCard, FileText, Users, Database, Shield, Zap, CheckCircle, ArrowRight, Monitor } from 'lucide-react'

export default function Integrations() {
  useEffect(() => {
    revealOnScroll()
  }, [])

  const integrationCategories = [
    {
      icon: Database,
      title: "EHR Systems",
      description: "Seamlessly integrate with popular Electronic Health Record systems",
      integrations: [
        { name: "Epic", status: "Available", type: "Direct Integration" },
        { name: "Cerner", status: "Available", type: "Direct Integration" },
        { name: "Athenahealth", status: "Available", type: "API Integration" },
        { name: "Practice Fusion", status: "Available", type: "Direct Integration" }
      ]
    },
    {
      icon: Calendar,
      title: "Calendar & Scheduling",
      description: "Sync with your existing calendar and scheduling systems",
      integrations: [
        { name: "Google Calendar", status: "Available", type: "Two-way Sync" },
        { name: "Outlook Calendar", status: "Available", type: "Two-way Sync" },
        { name: "Calendly", status: "Available", type: "API Integration" },
        { name: "Acuity Scheduling", status: "Available", type: "Direct Integration" }
      ]
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Connect with secure payment processors and billing systems",
      integrations: [
        { name: "Stripe", status: "Available", type: "Direct Integration" },
        { name: "Square", status: "Available", type: "API Integration" },
        { name: "PayPal", status: "Available", type: "Direct Integration" },
        { name: "QuickBooks", status: "Available", type: "Two-way Sync" }
      ]
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Integrate with document storage and management systems",
      integrations: [
        { name: "Google Drive", status: "Available", type: "Direct Integration" },
        { name: "Dropbox", status: "Available", type: "Direct Integration" },
        { name: "OneDrive", status: "Available", type: "API Integration" },
        { name: "Box", status: "Available", type: "Direct Integration" }
      ]
    }
  ]

  const healthcareTools = [
    {
      icon: Monitor,
      title: "Telehealth Platforms",
      description: "Connect with popular telehealth and video conferencing tools",
      tools: ["Zoom", "Doxy.me", "TheraNest", "SimplePractice"]
    },
    {
      icon: Users,
      title: "Practice Management",
      description: "Integrate with comprehensive practice management solutions",
      tools: ["TheraNest", "SimplePractice", "TherapyNotes", "Kareo"]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Connect with security and compliance monitoring tools",
      tools: ["HIPAA Vault", "Hushmail", "ProtonMail", "Tutanota"]
    },
    {
      icon: Zap,
      title: "Automation Tools",
      description: "Automate workflows with popular automation platforms",
      tools: ["Zapier", "IFTTT", "Microsoft Power Automate", "Automate.io"]
    }
  ]

  const integrationFeatures = [
    {
      title: "One-Click Setup",
      description: "Most integrations can be set up with just a few clicks, no technical expertise required.",
      icon: Zap
    },
    {
      title: "Real-time Sync",
      description: "Data syncs automatically in real-time, ensuring your information is always up to date.",
      icon: Database
    },
    {
      title: "HIPAA Compliant",
      description: "All integrations maintain HIPAA compliance and data security standards.",
      icon: Shield
    },
    {
      title: "Custom Workflows",
      description: "Create custom workflows and automation rules to fit your practice needs.",
      icon: Link
    }
  ]

  return (
    <section id="integrations" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container-modern">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 opacity-0 animate-fade-in">
            <span className="animated-gradient bg-clip-text text-transparent">
              Seamless Integrations
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed opacity-0 animate-fade-in-delay">
            Connect CARTHA with your existing healthcare tools and systems. No more switching between 
            platforms or manual data entry.
          </p>
          
          {/* Integration Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-0 animate-fade-in-delay-2">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">One-Click Setup</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
              <Database className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">Real-time Sync</span>
            </div>
          </div>
        </div>

        {/* Integration Categories */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            {integrationCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 opacity-0 animate-fade-in-delay-3">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{category.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{category.description}</p>
                
                <div className="space-y-4">
                  {category.integrations.map((integration, integrationIndex) => (
                    <div key={integrationIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-800">{integration.name}</h4>
                        <p className="text-sm text-gray-600">{integration.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-green-700">{integration.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Healthcare Tools */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-6 text-gray-800 opacity-0 animate-fade-in-delay-4">
              Healthcare Tools & Platforms
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in-delay-5">
              Connect with the tools you already use in your practice.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthcareTools.map((tool, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 opacity-0 animate-fade-in-delay-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-gray-800">{tool.title}</h4>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{tool.description}</p>
                <div className="space-y-2">
                  {tool.tools.map((toolName, toolIndex) => (
                    <div key={toolIndex} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{toolName}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Features */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-6 text-gray-800 opacity-0 animate-fade-in-delay-7">
              Why Choose Our Integrations?
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in-delay-8">
              Built specifically for healthcare professionals with your needs in mind.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {integrationFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 opacity-0 animate-fade-in-delay-9">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-gray-800">{feature.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Setup Process */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-6 text-gray-800 opacity-0 animate-fade-in-delay-10">
              Simple Setup Process
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in-delay-11">
              Get your integrations up and running in minutes, not hours.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md text-center opacity-0 animate-fade-in-delay-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h4 className="text-lg font-bold mb-2 text-gray-800">Choose Integration</h4>
              <p className="text-gray-600">Select from our library of pre-built integrations for popular healthcare tools.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md text-center opacity-0 animate-fade-in-delay-13">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h4 className="text-lg font-bold mb-2 text-gray-800">Authenticate</h4>
              <p className="text-gray-600">Securely connect your account with just a few clicks and OAuth authentication.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md text-center opacity-0 animate-fade-in-delay-14">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h4 className="text-lg font-bold mb-2 text-gray-800">Start Syncing</h4>
              <p className="text-gray-600">Your data begins syncing automatically, and you're ready to work seamlessly.</p>
            </div>
          </div>
        </div>

        {/* Integration CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center opacity-0 animate-fade-in-delay-15">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Link className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Ready to Connect?</h3>
            <p className="text-lg mb-6 leading-relaxed">
              Start integrating CARTHA with your existing tools today and experience the power 
              of seamless healthcare practice management.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                <span>View All Integrations</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Request Custom Integration
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s forwards;
        }
        
        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.4s forwards;
        }
        
        .animate-fade-in-delay-3 {
          animation: fadeIn 0.8s ease-out 0.6s forwards;
        }
        
        .animate-fade-in-delay-4 {
          animation: fadeIn 0.8s ease-out 0.8s forwards;
        }
        
        .animate-fade-in-delay-5 {
          animation: fadeIn 0.8s ease-out 1.0s forwards;
        }
        
        .animate-fade-in-delay-6 {
          animation: fadeIn 0.8s ease-out 1.2s forwards;
        }
        
        .animate-fade-in-delay-7 {
          animation: fadeIn 0.8s ease-out 1.4s forwards;
        }
        
        .animate-fade-in-delay-8 {
          animation: fadeIn 0.8s ease-out 1.6s forwards;
        }
        
        .animate-fade-in-delay-9 {
          animation: fadeIn 0.8s ease-out 1.8s forwards;
        }
        
        .animate-fade-in-delay-10 {
          animation: fadeIn 0.8s ease-out 2.0s forwards;
        }
        
        .animate-fade-in-delay-11 {
          animation: fadeIn 0.8s ease-out 2.2s forwards;
        }
        
        .animate-fade-in-delay-12 {
          animation: fadeIn 0.8s ease-out 2.4s forwards;
        }
        
        .animate-fade-in-delay-13 {
          animation: fadeIn 0.8s ease-out 2.6s forwards;
        }
        
        .animate-fade-in-delay-14 {
          animation: fadeIn 0.8s ease-out 2.8s forwards;
        }
        
        .animate-fade-in-delay-15 {
          animation: fadeIn 0.8s ease-out 3.0s forwards;
        }
      `}</style>
    </section>
  )
} 