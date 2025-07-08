'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  BarChart3, 
  LineChart as LineChartIcon,
  Filter,
  Download,
  Info
} from 'lucide-react';
import { 
  ScoreHistoryProps, 
  ScoreHistoryEntry, 
  ScoreTrend,
  TimeRange
} from '@/lib/types/gamification';

// Mock data - replace with real data fetching
const MOCK_SCORE_HISTORY: ScoreHistoryEntry[] = [
  { date: '2024-01-01', score: 65, change: 0, trigger: 'session_completion' },
  { date: '2024-01-03', score: 68, change: 3, trigger: 'session_completion' },
  { date: '2024-01-06', score: 71, change: 3, trigger: 'session_completion' },
  { date: '2024-01-08', score: 69, change: -2, trigger: 'session_completion' },
  { date: '2024-01-11', score: 73, change: 4, trigger: 'session_completion' },
  { date: '2024-01-13', score: 76, change: 3, trigger: 'session_completion' },
  { date: '2024-01-16', score: 74, change: -2, trigger: 'session_completion' },
  { date: '2024-01-18', score: 78, change: 4, trigger: 'session_completion' },
  { date: '2024-01-21', score: 80, change: 2, trigger: 'session_completion' },
  { date: '2024-01-23', score: 82, change: 2, trigger: 'session_completion' },
  { date: '2024-01-26', score: 79, change: -3, trigger: 'session_completion' },
  { date: '2024-01-28', score: 84, change: 5, trigger: 'milestone_achievement' },
  { date: '2024-01-30', score: 86, change: 2, trigger: 'session_completion' }
];

const LineChart: React.FC<{
  data: ScoreHistoryEntry[];
  width: number;
  height: number;
  animated?: boolean;
}> = ({ data, width, height, animated = true }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  
  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimationProgress(1);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setAnimationProgress(1);
    }
  }, [animated]);
  
  if (data.length === 0) return null;
  
  const maxScore = Math.max(...data.map(d => d.score));
  const minScore = Math.min(...data.map(d => d.score));
  const scoreRange = maxScore - minScore || 1;
  
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  // Generate path points
  const points = data.map((entry, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + (1 - (entry.score - minScore) / scoreRange) * chartHeight;
    return { x, y, score: entry.score, date: entry.date, change: entry.change };
  });
  
  // Create SVG path
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');
  
  // Animation path
  const totalLength = points.length * 50; // Approximate path length
  const animatedLength = totalLength * animationProgress;
  
  return (
    <div className="relative">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />
        
        {/* Y-axis labels */}
        {[minScore, Math.round((minScore + maxScore) / 2), maxScore].map((score, index) => {
          const y = padding + (1 - (score - minScore) / scoreRange) * chartHeight;
          return (
            <g key={score}>
              <text
                x={padding - 10}
                y={y + 5}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                {score}
              </text>
              <line
                x1={padding}
                y1={y}
                x2={padding + chartWidth}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            </g>
          );
        })}
        
        {/* Area under curve */}
        <motion.path
          d={`${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
          fill="url(#gradient)"
          opacity={0.2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: animationProgress }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#10B981" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        
        {/* Main line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="#10B981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={animated ? totalLength : undefined}
          strokeDashoffset={animated ? totalLength - animatedLength : 0}
          initial={{ strokeDashoffset: totalLength }}
          animate={{ strokeDashoffset: totalLength - animatedLength }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <motion.g
            key={index}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: (index / points.length) * 2, duration: 0.3 }}
          >
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill="white"
              stroke="#10B981"
              strokeWidth="3"
              className="cursor-pointer hover:r-8 transition-all"
            />
            
            {/* Tooltip on hover */}
            <g className="opacity-0 hover:opacity-100 pointer-events-none">
              <rect
                x={point.x - 30}
                y={point.y - 45}
                width="60"
                height="30"
                fill="black"
                fillOpacity="0.8"
                rx="4"
              />
              <text
                x={point.x}
                y={point.y - 30}
                textAnchor="middle"
                className="text-xs fill-white"
              >
                {point.score}
              </text>
              <text
                x={point.x}
                y={point.y - 18}
                textAnchor="middle"
                className="text-xs fill-white"
              >
                {point.change > 0 ? '+' : ''}{point.change}
              </text>
            </g>
          </motion.g>
        ))}
        
        {/* X-axis labels */}
        {points.filter((_, index) => index % 3 === 0).map((point, index) => (
          <text
            key={index}
            x={point.x}
            y={height - 10}
            textAnchor="middle"
            className="text-xs fill-gray-500"
          >
            {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </text>
        ))}
      </svg>
    </div>
  );
};

const TrendAnalysis: React.FC<{
  data: ScoreHistoryEntry[];
  timeRange: TimeRange;
}> = ({ data, timeRange }) => {
  const calculateTrend = (entries: ScoreHistoryEntry[]): ScoreTrend => {
    if (entries.length < 2) {
      return {
        direction: 'stable',
        magnitude: 0,
        consistency: 0,
        prediction: entries[0]?.score || 0
      };
    }
    
    const firstScore = entries[0].score;
    const lastScore = entries[entries.length - 1].score;
    const totalChange = lastScore - firstScore;
    const avgChange = totalChange / entries.length;
    
    // Calculate consistency (how often changes are in the same direction)
    const positiveChanges = entries.filter(e => e.change > 0).length;
    const negativeChanges = entries.filter(e => e.change < 0).length;
    const consistency = Math.abs(positiveChanges - negativeChanges) / entries.length;
    
    // Simple linear prediction
    const prediction = Math.min(100, Math.max(0, lastScore + avgChange * 3));
    
    return {
      direction: totalChange > 2 ? 'improving' : totalChange < -2 ? 'declining' : 'stable',
      magnitude: Math.abs(totalChange),
      consistency,
      prediction: Math.round(prediction)
    };
  };
  
  const trend = calculateTrend(data);
  
  const trendConfig = {
    improving: {
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    declining: {
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    stable: {
      icon: BarChart3,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  };
  
  const config = trendConfig[trend.direction];
  const Icon = config.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${config.bgColor} rounded-lg p-4 border ${config.borderColor}`}
    >
      <div className="flex items-center space-x-3 mb-3">
        <Icon className={`w-6 h-6 ${config.color}`} />
        <h3 className="font-semibold text-gray-900">Trend Analysis</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-600">Direction</div>
          <div className={`font-semibold capitalize ${config.color}`}>
            {trend.direction}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-600">Change</div>
          <div className="font-semibold text-gray-900">
            {trend.magnitude > 0 ? '+' : ''}{trend.magnitude} points
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-600">Consistency</div>
          <div className="font-semibold text-gray-900">
            {Math.round(trend.consistency * 100)}%
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-600">Prediction</div>
          <div className="font-semibold text-gray-900">
            {trend.prediction}
          </div>
        </div>
      </div>
      
      <div className="mt-3 p-3 bg-white rounded border border-gray-100">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-600">
            {trend.direction === 'improving' 
              ? `Great progress! Your alignment score has improved by ${trend.magnitude} points. Keep up the momentum!`
              : trend.direction === 'declining'
              ? `Your score has decreased by ${trend.magnitude} points. Consider scheduling more frequent money dates.`
              : 'Your score is stable. Try exploring new conversation topics to continue growing.'
            }
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ScoreHistory: React.FC<ScoreHistoryProps> = ({
  coupleId,
  timeRange = 'month',
  showTrends = true,
  compact = false
}) => {
  const [data, setData] = useState<ScoreHistoryEntry[]>(MOCK_SCORE_HISTORY);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(timeRange);
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');
  
  const timeRangeOptions = [
    { value: 'week' as TimeRange, label: 'Week' },
    { value: 'month' as TimeRange, label: 'Month' },
    { value: 'quarter' as TimeRange, label: 'Quarter' },
    { value: 'year' as TimeRange, label: 'Year' }
  ];
  
  const filteredData = data.filter(entry => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (selectedTimeRange) {
      case 'week': return daysDiff <= 7;
      case 'month': return daysDiff <= 30;
      case 'quarter': return daysDiff <= 90;
      case 'year': return daysDiff <= 365;
      default: return true;
    }
  });
  
  const stats = {
    totalSessions: filteredData.length,
    averageScore: Math.round(filteredData.reduce((sum, entry) => sum + entry.score, 0) / filteredData.length),
    bestScore: Math.max(...filteredData.map(entry => entry.score)),
    improvement: filteredData.length > 1 
      ? filteredData[filteredData.length - 1].score - filteredData[0].score 
      : 0
  };
  
  if (compact) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Score History</h3>
          <span className="text-sm text-gray-600">Last 30 days</span>
        </div>
        
        <LineChart 
          data={filteredData} 
          width={300} 
          height={150} 
          animated={false}
        />
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.averageScore}</div>
            <div className="text-sm text-gray-600">Average</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              stats.improvement >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.improvement >= 0 ? '+' : ''}{stats.improvement}
            </div>
            <div className="text-sm text-gray-600">Change</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Score History</h1>
          <p className="text-gray-600">Track your alignment score progress over time</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4 sm:mt-0">
          {/* Time Range Selector */}
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as TimeRange)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-2 text-sm font-medium ${
                viewMode === 'chart'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <LineChartIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Sessions', value: stats.totalSessions, suffix: '' },
          { label: 'Average Score', value: stats.averageScore, suffix: '' },
          { label: 'Best Score', value: stats.bestScore, suffix: '' },
          { label: 'Improvement', value: stats.improvement, suffix: '', signed: true }
        ].map((stat, index) => (
          <div key={stat.label} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
            <div className={`text-2xl font-bold ${
              stat.signed 
                ? stat.value >= 0 ? 'text-green-600' : 'text-red-600'
                : 'text-gray-900'
            }`}>
              {stat.signed && stat.value >= 0 ? '+' : ''}{stat.value}{stat.suffix}
            </div>
          </div>
        ))}
      </motion.div>
      
      {/* Main Chart/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        {viewMode === 'chart' ? (
          <LineChart 
            data={filteredData} 
            width={800} 
            height={400} 
            animated={true}
          />
        ) : (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Session History</h3>
            {filteredData.reverse().map((entry, index) => (
              <motion.div
                key={`${entry.date}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {entry.trigger.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{entry.score}</div>
                    <div className={`text-sm ${
                      entry.change > 0 ? 'text-green-600' : 
                      entry.change < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {entry.change > 0 ? '+' : ''}{entry.change}
                    </div>
                  </div>
                  
                  {entry.change !== 0 && (
                    <div className={`p-1 rounded ${
                      entry.change > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {entry.change > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      
      {/* Trend Analysis */}
      {showTrends && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <TrendAnalysis data={filteredData} timeRange={selectedTimeRange} />
        </motion.div>
      )}
    </div>
  );
};

export default ScoreHistory; 