'use client'

import { useEffect } from 'react'
import { revealOnScroll } from '@/lib/utils'
import { Code, Key, Database, Shield, Zap, Globe, Lock, CheckCircle, ArrowRight, Terminal } from 'lucide-react'

export default function API() {
  useEffect(() => {
    revealOnScroll()
  }, [])

  const apiFeatures = [
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "All API endpoints are designed with healthcare security standards in mind.",
      details: [
        "End-to-end encryption",
        "Audit logging",
        "Access controls",
        "Data validation"
      ]
    },
    {
      icon: Zap,
      title: "RESTful Design",
      description: "Clean, intuitive REST API following industry best practices.",
      details: [
        "Standard HTTP methods",
        "JSON responses",
        "Consistent error handling",
        "Rate limiting"
      ]
    },
    {
      icon: Database,
      title: "Real-time Data",
      description: "Access to real-time patient and practice data with webhook support.",
      details: [
        "Webhook notifications",
        "Real-time updates",
        "Event streaming",
        "Data synchronization"
      ]
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Fast, reliable API access from anywhere in the world.",
      details: [
        "Global edge locations",
        "99.9% uptime",
        "Low latency",
        "Automatic scaling"
      ]
    }
  ]

  const apiEndpoints = [
    {
      method: "GET",
      path: "/api/patients",
      description: "Retrieve patient records",
      auth: "Required"
    },
    {
      method: "POST",
      path: "/api/sessions",
      description: "Create session notes",
      auth: "Required"
    },
    {
      method: "GET",
      path: "/api/analytics",
      description: "Access practice analytics",
      auth: "Required"
    },
    {
      method: "POST",
      path: "/api/webhooks",
      description: "Configure webhooks",
      auth: "Required"
    }
  ]

  const authenticationMethods = [
    {
      type: "API Key",
      description: "Simple API key authentication for basic integrations",
      security: "High",
      icon: Key
    },
    {
      type: "OAuth 2.0",
      description: "Secure OAuth 2.0 flow for advanced integrations",
      security: "Enterprise",
      icon: Lock
    },
    {
      type: "JWT Tokens",
      description: "JSON Web Tokens for session-based authentication",
      security: "High",
      icon: Shield
    }
  ]

  const codeExamples = [
    {
      language: "JavaScript",
      title: "Fetch Patient Data",
      code: `const response = await fetch('/api/patients', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const patients = await response.json();`
    },
    {
      language: "Python",
      title: "Create Session Note",
      code: `import requests

response = requests.post(
    'https://api.cartha.com/api/sessions',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'patient_id': '123',
        'notes': 'Session notes content',
        'date': '2024-01-15'
    }
)`
    }
  ]

  return (
    <section id="api" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container-modern">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 opacity-0 animate-fade-in">
            <span className="animated-gradient bg-clip-text text-transparent">
              API Documentation
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed opacity-0 animate-fade-in-delay">
            Integrate CARTHA into your existing healthcare systems with our comprehensive, 
            HIPAA-compliant API designed for developers.
          </p>
          
          {/* API Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-0 animate-fade-in-delay-2">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
              <Code className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">RESTful API</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-lg shadow-md">
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">Real-time</span>
            </div>
          </div>
        </div>

        {/* API Features Grid */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            {apiFeatures.map((feature, index) => (
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

        {/* Authentication Methods */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-6 text-gray-800 opacity-0 animate-fade-in-delay-4">
              Authentication Methods
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in-delay-5">
              Multiple secure authentication options to fit your integration needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {authenticationMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 opacity-0 animate-fade-in-delay-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-gray-800">{method.type}</h4>
                <p className="text-gray-600 mb-4 leading-relaxed">{method.description}</p>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                  {method.security}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* API Endpoints */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-6 text-gray-800 opacity-0 animate-fade-in-delay-7">
              Core Endpoints
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in-delay-8">
              Essential API endpoints for healthcare practice management.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden opacity-0 animate-fade-in-delay-9">
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800">Available Endpoints</h4>
            </div>
            <div className="divide-y divide-gray-200">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                        endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded">
                        {endpoint.path}
                      </code>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">{endpoint.description}</span>
                      <span className="text-sm text-gray-500">Auth: {endpoint.auth}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-6 text-gray-800 opacity-0 animate-fade-in-delay-10">
              Code Examples
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in-delay-11">
              Get started quickly with our code examples in popular programming languages.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {codeExamples.map((example, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden opacity-0 animate-fade-in-delay-12">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-800">{example.language}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{example.title}</span>
                  </div>
                </div>
                <div className="p-4">
                  <pre className="text-sm text-gray-800 overflow-x-auto">
                    <code>{example.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Documentation CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center opacity-0 animate-fade-in-delay-13">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Code className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Ready to Integrate?</h3>
            <p className="text-lg mb-6 leading-relaxed">
              Access our complete API documentation, SDKs, and integration guides to start 
              building with CARTHA today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                <span>View Full Documentation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Get API Key
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
      `}</style>
    </section>
  )
} 