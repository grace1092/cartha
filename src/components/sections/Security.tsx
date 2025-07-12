'use client'

import { useEffect } from 'react'
import { revealOnScroll } from '@/lib/utils'
import { Shield, Lock, Eye, CheckCircle, Server, Key, Users, AlertTriangle, Database, Globe } from 'lucide-react'

export default function Security() {
  useEffect(() => {
    revealOnScroll()
  }, [])

  const securityFeatures = [
    {
      icon: Shield,
      title: "HIPAA Compliance",
      description: "Full compliance with HIPAA regulations including administrative, physical, and technical safeguards.",
      details: [
        "Business Associate Agreements (BAA)",
        "Risk assessments and management",
        "Workforce training and access controls",
        "Incident response procedures"
      ]
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "256-bit SSL encryption for all data in transit and AES-256 encryption for data at rest.",
      details: [
        "TLS 1.3 encryption protocols",
        "Database encryption at rest",
        "File upload encryption",
        "API communication security"
      ]
    },
    {
      icon: Server,
      title: "Secure Infrastructure",
      description: "Enterprise-grade cloud infrastructure with redundant systems and disaster recovery.",
      details: [
        "SOC 2 Type II certified data centers",
        "99.9% uptime guarantee",
        "Automated backups every 15 minutes",
        "Geographic redundancy"
      ]
    },
    {
      icon: Users,
      title: "Access Controls",
      description: "Multi-factor authentication and role-based access controls for all users.",
      details: [
        "Two-factor authentication (2FA)",
        "Role-based permissions",
        "Session management",
        "Audit logging"
      ]
    }
  ]

  const complianceStandards = [
    {
      name: "HIPAA",
      status: "Compliant",
      description: "Health Insurance Portability and Accountability Act",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      name: "SOC 2 Type II",
      status: "Certified",
      description: "Service Organization Control 2 Type II",
      icon: CheckCircle,
      color: "text-blue-600"
    },
    {
      name: "GDPR",
      status: "Compliant",
      description: "General Data Protection Regulation",
      icon: CheckCircle,
      color: "text-purple-600"
    },
    {
      name: "HITECH",
      status: "Compliant",
      description: "Health Information Technology for Economic and Clinical Health",
      icon: CheckCircle,
      color: "text-indigo-600"
    }
  ]

  const privacyMeasures = [
    {
      title: "Data Minimization",
      description: "We only collect and process the minimum amount of data necessary for providing our services.",
      icon: Eye
    },
    {
      title: "Patient Consent Management",
      description: "Comprehensive consent tracking and management for all patient interactions and data usage.",
      icon: Users
    },
    {
      title: "Audit Trails",
      description: "Complete audit logs of all data access, modifications, and system activities for compliance.",
      icon: Database
    },
    {
      title: "Data Retention Policies",
      description: "Automated data retention and deletion policies in accordance with healthcare regulations.",
      icon: AlertTriangle
    }
  ]

  return (
    <section id="security" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container-modern">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 opacity-0 animate-fade-in">
            <span className="animated-gradient bg-clip-text text-transparent">
              Enterprise-Grade Security
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed opacity-0 animate-fade-in-delay">
            Your clients' privacy and data security are our top priorities. We maintain the highest standards 
            of healthcare security and compliance.
          </p>
          
          {/* Security Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-0 animate-fade-in-delay-2">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
              <Lock className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">SOC 2 Type II</span>
            </div>
          </div>
        </div>

        {/* Security Features Grid */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 opacity-0 animate-fade-in-delay-3">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Standards */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-6 text-gray-800 opacity-0 animate-fade-in-delay-4">
              Compliance & Certifications
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in-delay-5">
              We maintain the highest standards of healthcare compliance and security certifications.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceStandards.map((standard, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 opacity-0 animate-fade-in-delay-6">
                <div className="flex items-center gap-3 mb-4">
                  <standard.icon className={`w-6 h-6 ${standard.color}`} />
                  <span className="font-bold text-gray-800">{standard.name}</span>
                </div>
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                    {standard.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{standard.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Measures */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-6 text-gray-800 opacity-0 animate-fade-in-delay-7">
              Privacy & Data Protection
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in-delay-8">
              Comprehensive privacy measures to protect your clients' sensitive information.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {privacyMeasures.map((measure, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 opacity-0 animate-fade-in-delay-9">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <measure.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-gray-800">{measure.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{measure.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Commitment */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center opacity-0 animate-fade-in-delay-10">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Security Commitment</h3>
            <p className="text-lg mb-6 leading-relaxed">
              We understand that trust is the foundation of any healthcare relationship. That's why we've built 
              CARTHA with security and privacy at its core, ensuring your practice and your clients' data are 
              protected with the highest standards available.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">Regular Security Audits</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">24/7 Security Monitoring</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">Incident Response Team</span>
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
      `}</style>
    </section>
  )
} 