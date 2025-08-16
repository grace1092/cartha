'use client';

import { Shield, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useState } from 'react';

const securityChecklist = [
  {
    item: 'HIPAA-ready design',
    status: 'implemented',
    description: 'Architecture designed with healthcare privacy principles in mind',
    hasTooltip: true
  },
  {
    item: '256-bit TLS in transit',
    status: 'implemented',
    description: 'All data transmission encrypted with industry-standard TLS',
    hasTooltip: false
  },
  {
    item: 'At-rest encryption via managed DB',
    status: 'implemented',
    description: 'Database encryption using managed cloud infrastructure',
    hasTooltip: false
  },
  {
    item: 'Audit trails (roadmap)',
    status: 'roadmap',
    description: 'Comprehensive logging system currently in development',
    hasTooltip: false
  }
];

export default function SecurityCard() {
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'roadmap':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-neutral-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented':
        return 'text-green-700';
      case 'roadmap':
        return 'text-amber-700';
      default:
        return 'text-neutral-700';
    }
  };

  return (
    <Card>
      <CardHeader 
        title="Enterprise Security" 
        subtitle="Your practice data protection status"
        icon={Shield}
      />

      <CardContent>
        {/* Security Checklist */}
        <div className="space-y-4 mb-6">
          {securityChecklist.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
              <div className="flex items-center space-x-3">
                {getStatusIcon(check.status)}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getStatusColor(check.status)}`}>
                      {check.item}
                    </span>
                    {check.hasTooltip && (
                      <div className="relative">
                        <button
                          onMouseEnter={() => setTooltipVisible(check.item)}
                          onMouseLeave={() => setTooltipVisible(null)}
                          className="text-neutral-400 hover:text-neutral-600"
                        >
                          <Info className="h-3 w-3" />
                        </button>
                        {tooltipVisible === check.item && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-black text-white text-xs rounded-lg p-2 z-10">
                            {check.description}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {!check.hasTooltip && (
                    <p className="text-xs text-neutral-600 mt-1">
                      {check.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Roadmap Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 mb-1">
                Compliance roadmap
              </h4>
              <p className="text-sm text-amber-700">
                SOC 2 audit planned for Q2 2025. Full HIPAA compliance certification in progress.
              </p>
            </div>
          </div>
        </div>

        {/* Security Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-700 mb-1">99.9%</div>
            <div className="text-sm text-green-600">Uptime</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-700 mb-1">256</div>
            <div className="text-sm text-blue-600">Bit Encryption</div>
          </div>
        </div>

        {/* Demo Environment Notice */}
        <div className="mt-6 bg-neutral-100 rounded-xl p-3">
          <p className="text-xs text-neutral-600 text-center">
            🔒 This is a demo environment. No real PHI is stored or processed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
