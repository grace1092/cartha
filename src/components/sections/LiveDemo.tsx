'use client';

import React from 'react';
import { Play, Clock, FileText, Sparkles } from 'lucide-react';

const LiveDemo = () => {
  const handlePlayDemo = () => {
    // For now, we'll use a placeholder video URL
    // In production, this would be the actual demo video
    window.open('https://www.loom.com/share/demo-placeholder', '_blank');
  };

  const demoFeatures = [
    {
      icon: Clock,
      title: "3-minute sessions",
      description: "Complete notes in seconds"
    },
    {
      icon: FileText,
      title: "SOAP format",
      description: "Professional documentation"
    },
    {
      icon: Sparkles,
      title: "AI-powered",
      description: "Smart insights & analysis"
    }
  ];

  return (
    <section className="section-spacing section-light">
      <div className="container-luxury">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            See it in action
          </div>
          <h2 className="heading-xl mb-6">
            Watch how AI transforms your session notes
          </h2>
          <p className="subheading max-w-2xl mx-auto">
            See how Cartha turns a 45-minute therapy session into professional documentation 
            in under 60 seconds—without compromising quality or detail.
          </p>
        </div>

        {/* Demo Video Container */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="relative group">
            {/* Video Placeholder */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200">
              {/* Placeholder Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-80"></div>
              
              {/* Video Thumbnail Content */}
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center">
                  {/* Large Play Button */}
                  <button
                    onClick={handlePlayDemo}
                    className="group/play inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 mb-6 hover:scale-110"
                  >
                    <Play className="w-8 h-8 text-blue-600 ml-1 group-hover/play:text-blue-700" fill="currentColor" />
                  </button>
                  
                  {/* Demo Title */}
                  <div className="px-8">
                    <h3 className="heading-md text-slate-800 mb-2">
                      Real Session → AI Notes
                    </h3>
                    <p className="body-md text-slate-600 max-w-md mx-auto">
                      Watch a therapist create comprehensive session notes in real-time
                    </p>
                  </div>
                </div>
              </div>

              {/* Demo Badge */}
              <div className="absolute top-6 left-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Live Demo
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-6 right-6">
                <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-black/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                  <Clock className="w-3 h-3" />
                  3:24
                </div>
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
          </div>
        </div>

        {/* Demo Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {demoFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl mb-4">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="heading-sm mb-2">{feature.title}</h3>
              <p className="body-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePlayDemo}
              className="btn-primary"
            >
              Watch Full Demo
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="btn-secondary"
            >
              Try It Yourself
            </button>
          </div>
          <p className="body-sm text-slate-500 mt-4">
            No signup required • See results instantly
          </p>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
