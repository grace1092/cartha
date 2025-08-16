'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Target, 
  BarChart3, 
  PieChart, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Star
} from 'lucide-react';

interface PracticeAnalyticsDashboardProps {
  onClose?: () => void;
}

export default function PracticeAnalyticsDashboard({ onClose }: PracticeAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'revenue', label: 'Revenue Trends', icon: TrendingUp },
    { id: 'outcomes', label: 'Client Outcomes', icon: Target },
    { id: 'billing', label: 'Insurance Billing', icon: DollarSign },
    { id: 'referrals', label: 'Referral Sources', icon: Users }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 42000, sessions: 145, growth: 12 },
    { month: 'Feb', revenue: 45600, sessions: 158, growth: 8.6 },
    { month: 'Mar', revenue: 48900, sessions: 162, growth: 7.2 },
    { month: 'Apr', revenue: 52300, sessions: 175, growth: 7.0 },
    { month: 'May', revenue: 56100, sessions: 188, growth: 7.3 },
    { month: 'Jun', revenue: 59800, sessions: 195, growth: 6.6 }
  ];

  const outcomeMetrics = [
    { metric: 'Treatment Success Rate', value: '87%', change: '+5%', trend: 'up' },
    { metric: 'Client Retention Rate', value: '92%', change: '+3%', trend: 'up' },
    { metric: 'Average Session Rating', value: '4.8/5', change: '+0.2', trend: 'up' },
    { metric: 'Goal Achievement Rate', value: '78%', change: '+8%', trend: 'up' }
  ];

  const billingOptimization = [
    { insurance: 'Blue Cross Blue Shield', claimRate: '94%', avgReimbursement: '$125', optimization: '+$2,400' },
    { insurance: 'Aetna', claimRate: '89%', avgReimbursement: '$118', optimization: '+$1,800' },
    { insurance: 'Cigna', claimRate: '91%', avgReimbursement: '$122', optimization: '+$2,100' },
    { insurance: 'UnitedHealth', claimRate: '87%', avgReimbursement: '$115', optimization: '+$1,500' }
  ];

  const referralSources = [
    { source: 'Primary Care Physicians', clients: 45, revenue: 15600, growth: '+12%' },
    { source: 'Psychiatrists', clients: 32, revenue: 11800, growth: '+8%' },
    { source: 'Online Directories', clients: 28, revenue: 9800, growth: '+15%' },
    { source: 'Client Referrals', clients: 38, revenue: 13200, growth: '+18%' },
    { source: 'Insurance Networks', clients: 22, revenue: 7800, growth: '+5%' }
  ];

  const growthOpportunities = [
    { opportunity: 'Expand Telehealth Services', potential: '+$8,400', effort: 'Medium' },
    { opportunity: 'Add Group Therapy Sessions', potential: '+$6,200', effort: 'Low' },
    { opportunity: 'Optimize Insurance Contracts', potential: '+$3,000', effort: 'High' },
    { opportunity: 'Develop Specialized Programs', potential: '+$5,600', effort: 'Medium' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Practice Analytics Dashboard</h2>
              <p className="text-blue-100 mt-1">Data-driven insights for practice growth</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 font-medium">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-blue-900">$59,800</p>
                      <p className="text-blue-600 text-sm flex items-center mt-1">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        +6.6% from last month
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 font-medium">Active Clients</p>
                      <p className="text-2xl font-bold text-green-900">195</p>
                      <p className="text-green-600 text-sm flex items-center mt-1">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        +17 new this month
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 font-medium">Success Rate</p>
                      <p className="text-2xl font-bold text-purple-900">87%</p>
                      <p className="text-purple-600 text-sm flex items-center mt-1">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        +5% improvement
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 font-medium">Avg Session</p>
                      <p className="text-2xl font-bold text-orange-900">$307</p>
                      <p className="text-orange-600 text-sm flex items-center mt-1">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        +$12 from last month
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Revenue Trends (6 Months)</h3>
                <div className="space-y-3">
                  {revenueData.map((data, index) => (
                    <div key={data.month} className="flex items-center space-x-4">
                      <div className="w-16 text-sm font-medium text-gray-600">{data.month}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                          style={{ width: `${(data.revenue / 60000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-24 text-right">
                        <div className="font-semibold">${data.revenue.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{data.sessions} sessions</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth Opportunities */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Growth Opportunities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {growthOpportunities.map((opp, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{opp.opportunity}</p>
                        <p className="text-sm text-gray-600">Effort: {opp.effort}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{opp.potential}</p>
                        <p className="text-xs text-gray-500">monthly</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Analytics Workflow */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Analytics Workflow</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      id: 'data-collection',
                      title: 'Data Collection',
                      icon: Activity,
                      description: 'Automated data gathering from sessions, billing, and client interactions',
                      details: 'Real-time collection of session notes, billing data, client outcomes, and engagement metrics. Integrates with your existing systems seamlessly.'
                    },
                    {
                      id: 'analysis',
                      title: 'AI Analysis',
                      icon: BarChart3,
                      description: 'Advanced analytics identify patterns and opportunities',
                      details: 'Machine learning algorithms analyze trends, predict outcomes, and identify revenue optimization opportunities. Provides actionable insights.'
                    },
                    {
                      id: 'insights',
                      title: 'Smart Insights',
                      icon: Target,
                      description: 'Personalized recommendations for practice growth',
                      details: 'AI-powered recommendations for client retention, billing optimization, and service expansion. Tailored to your specific practice needs.'
                    },
                    {
                      id: 'action',
                      title: 'Take Action',
                      icon: TrendingUp,
                      description: 'Implement changes and track improvements',
                      details: 'Step-by-step action plans with progress tracking. Monitor the impact of changes and see real-time improvements in your practice metrics.'
                    }
                  ].map((step) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.id}>
                        <button
                          onClick={() => setSelectedWorkflowStep(selectedWorkflowStep === step.id ? null : step.id)}
                          className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                            selectedWorkflowStep === step.id
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              selectedWorkflowStep === step.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{step.title}</h4>
                              <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                          </div>
                          {selectedWorkflowStep === step.id && (
                            <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                              <p className="text-sm text-gray-700 leading-relaxed">{step.details}</p>
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Breakdown */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Revenue by Service Type</h3>
                  <div className="space-y-4">
                    {[
                      { type: 'Individual Therapy', revenue: 42300, percentage: 70.7, color: 'bg-blue-500', details: 'Core therapy sessions with individual clients. High demand service with consistent revenue stream.' },
                      { type: 'Couples Therapy', revenue: 12500, percentage: 20.9, color: 'bg-purple-500', details: 'Specialized sessions for couples. Growing market with premium pricing potential.' },
                      { type: 'Group Sessions', revenue: 5000, percentage: 8.4, color: 'bg-green-500', details: 'Group therapy and workshops. Efficient use of time with multiple clients per session.' }
                    ].map((service, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedWorkflowStep(selectedWorkflowStep === `service-${index}` ? null : `service-${index}`)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 ${service.color} rounded-full`}></div>
                          <span className="font-medium text-left">{service.type}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${service.revenue.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{service.percentage}%</div>
                        </div>
                      </button>
                    ))}
                    {/* Show details when service is selected */}
                    {selectedWorkflowStep && selectedWorkflowStep.startsWith('service-') && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800 leading-relaxed">
                          {selectedWorkflowStep === 'service-0' && 'Core therapy sessions with individual clients. High demand service with consistent revenue stream.'}
                          {selectedWorkflowStep === 'service-1' && 'Specialized sessions for couples. Growing market with premium pricing potential.'}
                          {selectedWorkflowStep === 'service-2' && 'Group therapy and workshops. Efficient use of time with multiple clients per session.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Revenue Growth */}
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Revenue Growth Analysis</h3>
                  <div className="space-y-4">
                    {[
                      {
                        id: 'new-clients',
                        title: 'New Client Revenue',
                        subtitle: '+23 new clients this month',
                        amount: '+$7,050',
                        percentage: '+13.4%',
                        bgColor: 'bg-green-50',
                        textColor: 'text-green-900',
                        subtitleColor: 'text-green-600',
                        details: 'Strong growth in new client acquisition through improved marketing and referral programs. Average new client value: $307 per session.'
                      },
                      {
                        id: 'existing-clients',
                        title: 'Existing Client Revenue',
                        subtitle: 'Increased session frequency',
                        amount: '+$3,200',
                        percentage: '+5.7%',
                        bgColor: 'bg-blue-50',
                        textColor: 'text-blue-900',
                        subtitleColor: 'text-blue-600',
                        details: 'Existing clients are booking more frequent sessions and longer appointments. Client retention strategies are working effectively.'
                      },
                      {
                        id: 'premium-services',
                        title: 'Premium Services',
                        subtitle: 'Extended sessions & assessments',
                        amount: '+$1,550',
                        percentage: '+8.2%',
                        bgColor: 'bg-purple-50',
                        textColor: 'text-purple-900',
                        subtitleColor: 'text-purple-600',
                        details: 'Premium services including extended sessions, assessments, and specialized programs are gaining popularity and driving higher revenue per client.'
                      }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedWorkflowStep(selectedWorkflowStep === item.id ? null : item.id)}
                        className={`w-full flex items-center justify-between p-3 ${item.bgColor} rounded-lg hover:shadow-md transition-all duration-200`}
                      >
                        <div>
                          <p className={`font-medium ${item.textColor}`}>{item.title}</p>
                          <p className={`text-sm ${item.subtitleColor}`}>{item.subtitle}</p>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${item.subtitleColor}`}>{item.amount}</div>
                          <div className={`text-sm ${item.subtitleColor}`}>{item.percentage}</div>
                        </div>
                      </button>
                    ))}
                    {/* Show details when growth item is selected */}
                    {selectedWorkflowStep && ['new-clients', 'existing-clients', 'premium-services'].includes(selectedWorkflowStep) && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {selectedWorkflowStep === 'new-clients' && 'Strong growth in new client acquisition through improved marketing and referral programs. Average new client value: $307 per session.'}
                          {selectedWorkflowStep === 'existing-clients' && 'Existing clients are booking more frequent sessions and longer appointments. Client retention strategies are working effectively.'}
                          {selectedWorkflowStep === 'premium-services' && 'Premium services including extended sessions, assessments, and specialized programs are gaining popularity and driving higher revenue per client.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'outcomes' && (
            <div className="space-y-6">
              {/* Outcome Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {outcomeMetrics.map((metric, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedWorkflowStep(selectedWorkflowStep === `metric-${index}` ? null : `metric-${index}`)}
                    className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 text-left"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{metric.metric}</h3>
                      <div className={`flex items-center text-sm ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                        )}
                        {metric.change}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                        style={{ width: `${parseInt(metric.value)}%` }}
                      ></div>
                    </div>
                    {/* Show details when metric is selected */}
                    {selectedWorkflowStep === `metric-${index}` && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800 leading-relaxed">
                          {index === 0 && 'Treatment success rate measures the percentage of clients who achieve their primary therapy goals. This metric has improved by 5% due to enhanced treatment planning and progress tracking.'}
                          {index === 1 && 'Client retention rate shows how many clients continue therapy beyond their initial sessions. The 3% improvement reflects better engagement strategies and personalized care approaches.'}
                          {index === 2 && 'Average session rating from client feedback surveys. The 0.2 point increase indicates higher client satisfaction with therapy quality and outcomes.'}
                          {index === 3 && 'Goal achievement rate tracks how many clients reach their specific therapy objectives. The 8% improvement shows more effective goal-setting and progress monitoring.'}
                        </p>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Client Progress Tracking */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Client Progress Tracking</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">156</div>
                    <p className="text-gray-600">Clients Meeting Goals</p>
                    <p className="text-sm text-green-600">+12 this month</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">89%</div>
                    <p className="text-gray-600">Session Attendance Rate</p>
                    <p className="text-sm text-blue-600">+3% improvement</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">4.8</div>
                    <p className="text-gray-600">Average Client Rating</p>
                    <div className="flex justify-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${
                          star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              {/* Insurance Billing Optimization */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Insurance Billing Optimization</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 font-medium text-gray-900">Insurance Provider</th>
                        <th className="text-center py-3 font-medium text-gray-900">Claim Rate</th>
                        <th className="text-center py-3 font-medium text-gray-900">Avg Reimbursement</th>
                        <th className="text-center py-3 font-medium text-gray-900">Optimization</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billingOptimization.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 font-medium">{item.insurance}</td>
                          <td className="py-3 text-center">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {item.claimRate}
                            </span>
                          </td>
                          <td className="py-3 text-center font-medium">{item.avgReimbursement}</td>
                          <td className="py-3 text-center">
                            <span className="text-green-600 font-bold">{item.optimization}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Billing Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Billing Efficiency</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average Days to Payment</span>
                      <span className="font-semibold text-green-600">18 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Claims Denial Rate</span>
                      <span className="font-semibold text-red-600">6.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Auto-Payment Success</span>
                      <span className="font-semibold text-green-600">94%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Revenue Recovery</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-green-900">Recovered Claims</span>
                      <span className="font-bold text-green-600">+$2,400</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-900">Optimized Contracts</span>
                      <span className="font-bold text-blue-600">+$1,800</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-900">Reduced Denials</span>
                      <span className="font-bold text-purple-600">+$900</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'referrals' && (
            <div className="space-y-6">
              {/* Referral Sources */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Referral Source Performance</h3>
                <div className="space-y-4">
                  {referralSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{source.source}</h4>
                          <span className="text-sm text-green-600 font-medium">{source.growth}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{source.clients} clients</span>
                          <span>${source.revenue.toLocaleString()} revenue</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referral Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Top Performing Sources</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Primary Care Physicians</p>
                        <p className="text-sm text-gray-600">45 clients, $15,600 revenue</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Client Referrals</p>
                        <p className="text-sm text-gray-600">38 clients, $13,200 revenue</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Referral Conversion</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Overall Conversion Rate</span>
                      <span className="font-semibold text-green-600">78%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Avg Time to First Session</span>
                      <span className="font-semibold text-blue-600">3.2 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Client Lifetime Value</span>
                      <span className="font-semibold text-purple-600">$2,400</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
          <div className="flex items-center space-x-4">
            <CheckCircle className="w-8 h-8 text-green-100" />
            <div>
              <h3 className="text-lg font-bold">Analytics Success!</h3>
              <p className="text-green-100">
                With data-driven insights, you just identified $3,000 in missed revenue opportunities and improved your practice efficiency by 60%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 