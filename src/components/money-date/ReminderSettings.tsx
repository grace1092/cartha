'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  Moon, 
  Settings, 
  Clock, 
  Users,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { ReminderPreferences } from '@/lib/types/money-date';
import Button from '@/components/ui/Button';

interface ReminderSettingsProps {
  userId: string;
  preferences?: ReminderPreferences;
  onSave?: (preferences: ReminderPreferences) => void;
  onTest?: (channel: 'sms' | 'email' | 'push') => void;
}

const DEFAULT_INTERVALS = [1440, 120, 15]; // 1 day, 2 hours, 15 minutes

const ReminderSettings: React.FC<ReminderSettingsProps> = ({
  userId,
  preferences,
  onSave,
  onTest
}) => {
  const [localPreferences, setLocalPreferences] = useState<ReminderPreferences>({
    id: '',
    user_id: userId,
    sms_enabled: true,
    email_enabled: true,
    push_enabled: true,
    reminder_intervals: DEFAULT_INTERVALS,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    escalation_enabled: true,
    partner_notifications: true,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...preferences
  });

  const [customInterval, setCustomInterval] = useState<string>('');
  const [testResults, setTestResults] = useState<{[key: string]: 'pending' | 'success' | 'error' | undefined}>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (preferences) {
      setLocalPreferences({ ...localPreferences, ...preferences });
    }
  }, [preferences]);

  const handleChannelToggle = (channel: 'sms_enabled' | 'email_enabled' | 'push_enabled') => {
    setLocalPreferences(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
    setHasChanges(true);
  };

  const handleIntervalChange = (index: number, value: string) => {
    const minutes = parseInt(value);
    if (isNaN(minutes) || minutes < 0) return;

    const newIntervals = [...localPreferences.reminder_intervals];
    newIntervals[index] = minutes;
    
    setLocalPreferences(prev => ({
      ...prev,
      reminder_intervals: newIntervals
    }));
    setHasChanges(true);
  };

  const addCustomInterval = () => {
    const minutes = parseInt(customInterval);
    if (isNaN(minutes) || minutes < 0) return;

    const newIntervals = [...localPreferences.reminder_intervals, minutes].sort((a, b) => b - a);
    
    setLocalPreferences(prev => ({
      ...prev,
      reminder_intervals: newIntervals
    }));
    setCustomInterval('');
    setHasChanges(true);
  };

  const removeInterval = (index: number) => {
    const newIntervals = localPreferences.reminder_intervals.filter((_, i) => i !== index);
    
    setLocalPreferences(prev => ({
      ...prev,
      reminder_intervals: newIntervals
    }));
    setHasChanges(true);
  };

  const handleTimeChange = (field: 'quiet_hours_start' | 'quiet_hours_end', value: string) => {
    setLocalPreferences(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleToggle = (field: 'escalation_enabled' | 'partner_notifications') => {
    setLocalPreferences(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    setHasChanges(true);
  };

  const testNotification = async (channel: 'sms' | 'email' | 'push') => {
    if (!onTest) return;

    setTestResults(prev => ({ ...prev, [channel]: 'pending' }));
    
    try {
      await onTest(channel);
      setTestResults(prev => ({ ...prev, [channel]: 'success' }));
      setTimeout(() => {
        setTestResults(prev => ({ ...prev, [channel]: undefined }));
      }, 3000);
    } catch (error) {
      setTestResults(prev => ({ ...prev, [channel]: 'error' }));
      setTimeout(() => {
        setTestResults(prev => ({ ...prev, [channel]: undefined }));
      }, 3000);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;

    setIsLoading(true);
    try {
      const updatedPreferences = {
        ...localPreferences,
        updated_at: new Date().toISOString()
      };
      
      await onSave(updatedPreferences);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatInterval = (minutes: number): string => {
    if (minutes >= 1440) {
      const days = Math.floor(minutes / 1440);
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };

  const getTestIcon = (status: string | undefined) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Reminder Settings</h2>
        </div>

        {/* Notification Channels */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* SMS */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                  ${localPreferences.sms_enabled 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50'
                  }
                `}
                onClick={() => handleChannelToggle('sms_enabled')}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className={`w-5 h-5 ${localPreferences.sms_enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="font-medium">SMS</span>
                  </div>
                  <div className={`
                    w-4 h-4 rounded-full border-2 transition-all duration-200
                    ${localPreferences.sms_enabled 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                    }
                  `} />
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Text message reminders to your phone
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      testNotification('sms');
                    }}
                    disabled={!localPreferences.sms_enabled}
                    className="text-xs"
                  >
                    Test SMS
                  </Button>
                  {getTestIcon(testResults.sms)}
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                  ${localPreferences.email_enabled 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50'
                  }
                `}
                onClick={() => handleChannelToggle('email_enabled')}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className={`w-5 h-5 ${localPreferences.email_enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="font-medium">Email</span>
                  </div>
                  <div className={`
                    w-4 h-4 rounded-full border-2 transition-all duration-200
                    ${localPreferences.email_enabled 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                    }
                  `} />
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Email reminders with session details
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      testNotification('email');
                    }}
                    disabled={!localPreferences.email_enabled}
                    className="text-xs"
                  >
                    Test Email
                  </Button>
                  {getTestIcon(testResults.email)}
                </div>
              </motion.div>

              {/* Push */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                  ${localPreferences.push_enabled 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50'
                  }
                `}
                onClick={() => handleChannelToggle('push_enabled')}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className={`w-5 h-5 ${localPreferences.push_enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="font-medium">Push</span>
                  </div>
                  <div className={`
                    w-4 h-4 rounded-full border-2 transition-all duration-200
                    ${localPreferences.push_enabled 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                    }
                  `} />
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Browser and mobile push notifications
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      testNotification('push');
                    }}
                    disabled={!localPreferences.push_enabled}
                    className="text-xs"
                  >
                    Test Push
                  </Button>
                  {getTestIcon(testResults.push)}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Reminder Timing */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reminder Timing</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Choose when to receive reminders before your Money Date sessions
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {localPreferences.reminder_intervals.map((interval, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <input
                      type="number"
                      value={interval}
                      onChange={(e) => handleIntervalChange(index, e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                    <span className="text-sm text-gray-600">min</span>
                    <button
                      onClick={() => removeInterval(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Interval */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customInterval}
                  onChange={(e) => setCustomInterval(e.target.value)}
                  placeholder="Add custom interval (minutes)"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                <Button
                  onClick={addCustomInterval}
                  disabled={!customInterval || isNaN(parseInt(customInterval))}
                  size="sm"
                >
                  Add Interval
                </Button>
              </div>

              <div className="text-xs text-gray-500">
                Examples: {formatInterval(1440)} before, {formatInterval(120)} before, {formatInterval(15)} before
              </div>
            </div>
          </div>

          {/* Quiet Hours */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Moon className="w-5 h-5" />
              Quiet Hours
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={localPreferences.quiet_hours_start || '22:00'}
                  onChange={(e) => handleTimeChange('quiet_hours_start', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={localPreferences.quiet_hours_end || '08:00'}
                  onChange={(e) => handleTimeChange('quiet_hours_end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              No notifications will be sent during these hours
            </p>
          </div>

          {/* Advanced Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Advanced Settings
            </h3>
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => handleToggle('escalation_enabled')}
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="font-medium">Escalation Reminders</div>
                    <div className="text-sm text-gray-600">
                      Send additional reminders if session is missed
                    </div>
                  </div>
                </div>
                <div className={`
                  w-12 h-6 rounded-full p-1 transition-all duration-200
                  ${localPreferences.escalation_enabled ? 'bg-blue-500' : 'bg-gray-300'}
                `}>
                  <div className={`
                    w-4 h-4 rounded-full bg-white transition-all duration-200
                    ${localPreferences.escalation_enabled ? 'translate-x-6' : 'translate-x-0'}
                  `} />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => handleToggle('partner_notifications')}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="font-medium">Partner Notifications</div>
                    <div className="text-sm text-gray-600">
                      Notify your partner about your reminder preferences
                    </div>
                  </div>
                </div>
                <div className={`
                  w-12 h-6 rounded-full p-1 transition-all duration-200
                  ${localPreferences.partner_notifications ? 'bg-blue-500' : 'bg-gray-300'}
                `}>
                  <div className={`
                    w-4 h-4 rounded-full bg-white transition-all duration-200
                    ${localPreferences.partner_notifications ? 'translate-x-6' : 'translate-x-0'}
                  `} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3"
          >
            <Button
              variant="outline"
              onClick={() => {
                setLocalPreferences({ ...preferences } as ReminderPreferences);
                setHasChanges(false);
              }}
            >
              Reset Changes
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReminderSettings; 