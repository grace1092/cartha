'use client';

import { BarChart3, TrendingUp, DollarSign, Clock, Target } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const mrrData = [
  { month: 'Jan', value: 0 },
  { month: 'Feb', value: 850 },
  { month: 'Mar', value: 1650 },
  { month: 'Apr', value: 2400 },
  { month: 'May', value: 3200 },
  { month: 'Jun', value: 4100 },
  { month: 'Jul', value: 4800 },
  { month: 'Aug', value: 5600 },
  { month: 'Sep', value: 6300 },
  { month: 'Oct', value: 6900 },
  { month: 'Nov', value: 7200 },
  { month: 'Dec', value: 7500 }
];

const sessionsByWeek = [
  { week: 'W1', count: 8 },
  { week: 'W2', count: 12 },
  { week: 'W3', count: 15 },
  { week: 'W4', count: 18 },
  { week: 'W5', count: 22 },
  { week: 'W6', count: 25 },
  { week: 'W7', count: 28 },
  { week: 'W8', count: 32 }
];

const outcomes = [
  { month: 'Jan', score: 6.2 },
  { month: 'Feb', score: 6.5 },
  { month: 'Mar', score: 6.8 },
  { month: 'Apr', score: 7.1 },
  { month: 'May', score: 7.3 },
  { month: 'Jun', score: 7.6 },
  { month: 'Jul', score: 7.8 },
  { month: 'Aug', score: 8.1 }
];

const kpiData = [
  {
    title: 'Revenue (MTD)',
    value: '$12,450',
    change: '+18%',
    icon: DollarSign,
    positive: true
  },
  {
    title: 'Sessions (MTD)',
    value: '156',
    change: '+12%',
    icon: Target,
    positive: true
  },
  {
    title: 'Avg Note Time Saved',
    value: '23 min',
    change: '+5 min',
    icon: Clock,
    positive: true
  },
  {
    title: 'Client Retention',
    value: '94%',
    change: '+2%',
    icon: TrendingUp,
    positive: true
  }
];

export default function AnalyticsCard() {
  return (
    <Card>
      <CardHeader 
        title="Practice Analytics" 
        subtitle="Track your practice growth and client outcomes"
        icon={BarChart3}
      />

      <CardContent>
        {/* KPI Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div key={index} className="bg-neutral-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-5 w-5 text-neutral-500" />
                  <span className={`text-xs font-medium ${
                    kpi.positive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#222] mb-1">
                  {kpi.value}
                </div>
                <div className="text-sm text-neutral-600">
                  {kpi.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Monthly MRR */}
          <div className="bg-neutral-50 rounded-xl p-4">
            <h4 className="font-medium text-[#222] mb-4">Monthly Recurring Revenue</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mrrData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-neutral-600 mt-2">
              Growing consistently month over month
            </p>
          </div>

          {/* Sessions by Week */}
          <div className="bg-neutral-50 rounded-xl p-4">
            <h4 className="font-medium text-[#222] mb-4">Sessions by Week</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionsByWeek}>
                  <XAxis dataKey="week" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Bar dataKey="count" fill="#10b981" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-neutral-600 mt-2">
              Steady increase in weekly session volume
            </p>
          </div>

          {/* Outcome Scores */}
          <div className="bg-neutral-50 rounded-xl p-4">
            <h4 className="font-medium text-[#222] mb-4">Average Outcome Score</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={outcomes}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis hide domain={[0, 10]} />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-neutral-600 mt-2">
              Client progress scores improving over time
            </p>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <h4 className="font-medium text-[#222] mb-2">✨ AI Insights</h4>
          <ul className="text-sm text-neutral-700 space-y-1">
            <li>• Your Tuesday 2-3 PM slot has the highest client satisfaction scores</li>
            <li>• CBT sessions average 15% better outcomes than other modalities</li>
            <li>• Clients who receive follow-up emails show 23% better retention</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
