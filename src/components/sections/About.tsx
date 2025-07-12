'use client'

import { useEffect } from 'react'
import { revealOnScroll } from '@/lib/utils'
import { Heart, Shield, Users, Award, Target, Zap, Lock, CheckCircle } from 'lucide-react'

export default function About() {
  useEffect(() => {
    revealOnScroll()
  }, [])

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container-modern">
        {/* Mission & Vision */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 opacity-0 animate-fade-in">
            <span className="animated-gradient bg-clip-text text-transparent">
              Transforming Healthcare Through Technology
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed opacity-0 animate-fade-in-delay">
            We're on a mission to revolutionize how therapists deliver care by eliminating administrative burdens 
            and empowering them to focus on what matters most: their clients' mental health and well-being.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 opacity-0 animate-fade-in-delay-2">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To create the most intuitive, secure, and time-saving practice management platform that enables 
                therapists to deliver exceptional care while growing their practice efficiently.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 opacity-0 animate-fade-in-delay-3">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                A world where every therapist has the tools they need to provide the highest quality care, 
                where technology enhances rather than hinders the therapeutic relationship.
              </p>
            </div>
          </div>
        </div>

        {/* Company Story */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="opacity-0 animate-fade-in-delay-4">
              <h3 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h3>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Founded by a team of healthcare professionals and technology experts, CARTHA was born from 
                  a simple observation: therapists were spending more time on paperwork than with their clients.
                </p>
                <p>
                  After years of working in mental health settings, our founders experienced firsthand the 
                  frustration of outdated systems that didn't understand the unique needs of therapy practices.
                </p>
                <p>
                  We set out to build something different—a platform designed specifically for therapists, 
                  by therapists, that would streamline every aspect of practice management while maintaining 
                  the highest standards of security and compliance.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white opacity-0 animate-fade-in-delay-5">
              <h4 className="text-2xl font-bold mb-6">Our Founding Principles</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <h5 className="font-semibold mb-1">Client-Centered Design</h5>
                    <p className="text-blue-100 text-sm">Every feature is built with the therapist-client relationship in mind</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <h5 className="font-semibold mb-1">Security First</h5>
                    <p className="text-blue-100 text-sm">HIPAA compliance and enterprise-grade security are non-negotiable</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <h5 className="font-semibold mb-1">Continuous Innovation</h5>
                    <p className="text-blue-100 text-sm">We evolve with the changing needs of mental health professionals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-6 text-gray-800 opacity-0 animate-fade-in-delay-6">
              Meet Our Team
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in-delay-7">
              Healthcare professionals, technology experts, and mental health advocates working together 
              to transform therapy practice management.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 opacity-0 animate-fade-in-delay-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-center mb-2 text-gray-800">Dr. Sarah Chen</h4>
              <p className="text-blue-600 text-center mb-4 font-semibold">Chief Medical Officer</p>
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                Licensed clinical psychologist with 15+ years of experience in private practice and healthcare technology.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 opacity-0 animate-fade-in-delay-9">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-center mb-2 text-gray-800">Michael Rodriguez</h4>
              <p className="text-blue-600 text-center mb-4 font-semibold">Chief Technology Officer</p>
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                Former healthcare IT executive with expertise in building secure, scalable platforms for medical practices.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 opacity-0 animate-fade-in-delay-10">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-center mb-2 text-gray-800">Dr. Emily Watson</h4>
              <p className="text-blue-600 text-center mb-4 font-semibold">Head of Security & Compliance</p>
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                Healthcare security expert with deep knowledge of HIPAA, SOC 2, and healthcare data protection.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-6 text-gray-800 opacity-0 animate-fade-in-delay-11">
              Our Values
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto opacity-0 animate-fade-in-delay-12">
              The principles that guide everything we do in serving the mental health community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 opacity-0 animate-fade-in-delay-13">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-gray-800">Privacy & Security</h4>
              <p className="text-gray-600 text-sm">
                Uncompromising commitment to protecting client data and maintaining the highest security standards.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 opacity-0 animate-fade-in-delay-14">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-gray-800">Client-Centered</h4>
              <p className="text-gray-600 text-sm">
                Every decision we make prioritizes the well-being and success of therapists and their clients.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 opacity-0 animate-fade-in-delay-15">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-gray-800">Excellence</h4>
              <p className="text-gray-600 text-sm">
                We strive for excellence in every aspect of our platform, from design to customer support.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 opacity-0 animate-fade-in-delay-16">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold mb-2 text-gray-800">Community</h4>
              <p className="text-gray-600 text-sm">
                Building a supportive community of mental health professionals who share knowledge and best practices.
              </p>
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
        
        .animate-fade-in-delay-16 {
          animation: fadeIn 0.8s ease-out 3.2s forwards;
        }
      `}</style>
    </section>
  )
} 