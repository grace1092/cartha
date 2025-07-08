'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  MessageSquare, 
  Mail, 
  Smartphone,
  Clock,
  Check,
  X,
  Eye,
  EyeOff,
  Filter,
  Search,
  Calendar,
  AlertTriangle,
  Info,
  Heart,
  Settings,
  Trash2
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { NotificationMessage, NotificationStatus } from '@/lib/types/money-date';
import Button from '@/components/ui/Button';

interface NotificationCenterProps {
  userId: string;
  notifications?: NotificationMessage[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (notificationId: string) => void;
  onResend?: (notificationId: string) => void;
  realTimeUpdates?: boolean;
}

const NOTIFICATION_TYPES = {
  reminder: { 
    icon: Clock, 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50', 
    borderColor: 'border-blue-200',
    label: 'Reminder' 
  },
  session_start: { 
    icon: Calendar, 
    color: 'text-green-600', 
    bgColor: 'bg-green-50', 
    borderColor: 'border-green-200',
    label: 'Session' 
  },
  missed_session: { 
    icon: AlertTriangle, 
    color: 'text-red-600', 
    bgColor: 'bg-red-50', 
    borderColor: 'border-red-200',
    label: 'Missed' 
  },
  partner_update: { 
    icon: Heart, 
    color: 'text-pink-600', 
    bgColor: 'bg-pink-50', 
    borderColor: 'border-pink-200',
    label: 'Partner' 
  },
  system: { 
    icon: Info, 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-50', 
    borderColor: 'border-gray-200',
    label: 'System' 
  }
};

const CHANNEL_ICONS = {
  sms: MessageSquare,
  email: Mail,
  push: Smartphone
};

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  userId,
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onResend,
  realTimeUpdates = true
}) => {
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationMessage[]>(notifications);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showUnreadOnly, setShowUnreadOnly] = useState<boolean>(false);
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());

  // Mock real-time notifications for demo
  useEffect(() => {
    if (realTimeUpdates) {
      const interval = setInterval(() => {
        // Simulate receiving new notifications
        const randomNotification: NotificationMessage = {
          id: `notification-${Date.now()}`,
          user_id: userId,
          type: 'reminder',
          channel: 'push',
          title: 'Money Date Reminder',
          body: 'Your scheduled Money Date is in 15 minutes!',
          status: 'delivered',
          scheduled_for: new Date().toISOString(),
          sent_at: new Date().toISOString(),
          read_at: null,
          metadata: {
            session_id: 'session-123',
            reminder_type: '15_minute'
          },
          created_at: new Date().toISOString()
        };
        
        // Only add notification occasionally to avoid spam
        if (Math.random() > 0.95) {
          setFilteredNotifications(prev => [randomNotification, ...prev]);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [realTimeUpdates, userId]);

  // Filter notifications based on search and filters
  useEffect(() => {
    let filtered = notifications;

    // Apply type filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(n => selectedFilters.includes(n.type));
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(query) ||
        n.body.toLowerCase().includes(query)
      );
    }

    // Apply unread filter
    if (showUnreadOnly) {
      filtered = filtered.filter(n => !n.read_at);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setFilteredNotifications(filtered);
  }, [notifications, selectedFilters, searchQuery, showUnreadOnly]);

  const handleMarkAsRead = (notificationId: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(notificationId);
    }
    setFilteredNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, read_at: new Date().toISOString() }
          : n
      )
    );
  };

  const handleDelete = (notificationId: string) => {
    if (onDelete) {
      onDelete(notificationId);
    }
    setFilteredNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const toggleFilter = (filterType: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterType)
        ? prev.filter(f => f !== filterType)
        : [...prev, filterType]
    );
  };

  const toggleExpanded = (notificationId: string) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: NotificationStatus) => {
    switch (status) {
      case 'delivered':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <X className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const unreadCount = filteredNotifications.filter(n => !n.read_at).length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-blue-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Notification Center</h2>
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                onClick={onMarkAllAsRead}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Mark all read
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="space-y-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <div className="flex gap-2">
                {Object.entries(NOTIFICATION_TYPES).map(([type, info]) => {
                  const Icon = info.icon;
                  const isSelected = selectedFilters.includes(type);
                  return (
                    <motion.button
                      key={type}
                      onClick={() => toggleFilter(type)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200
                        ${isSelected 
                          ? `${info.color} ${info.bgColor}` 
                          : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                        }
                      `}
                    >
                      <Icon className="w-3 h-3" />
                      {info.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              className={`
                flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-all duration-200
                ${showUnreadOnly 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }
              `}
            >
              {showUnreadOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showUnreadOnly ? 'Show all' : 'Unread only'}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <AnimatePresence>
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((notification, index) => {
                const typeInfo = NOTIFICATION_TYPES[notification.type as keyof typeof NOTIFICATION_TYPES] || NOTIFICATION_TYPES.system;
                const TypeIcon = typeInfo.icon;
                const ChannelIcon = CHANNEL_ICONS[notification.channel as keyof typeof CHANNEL_ICONS];
                const isUnread = !notification.read_at;
                const isExpanded = expandedNotifications.has(notification.id);

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      p-4 rounded-lg border transition-all duration-200 cursor-pointer
                      ${isUnread 
                        ? `${typeInfo.bgColor} ${typeInfo.borderColor} border-l-4` 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => !isUnread ? null : handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Type Icon */}
                      <div className={`p-2 rounded-lg ${typeInfo.bgColor}`}>
                        <TypeIcon className={`w-4 h-4 ${typeInfo.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className={`font-medium ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            <p className={`text-sm mt-1 ${isUnread ? 'text-gray-700' : 'text-gray-500'}`}>
                              {notification.body}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 ml-4">
                            <div className="flex items-center gap-1">
                              {ChannelIcon && <ChannelIcon className="w-3 h-3 text-gray-400" />}
                              {getStatusIcon(notification.status)}
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpanded(notification.id);
                              }}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                ⌄
                              </motion.div>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notification.id);
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </span>
                          {notification.scheduled_for && (
                            <span>
                              Scheduled: {format(new Date(notification.scheduled_for), 'MMM d, h:mm a')}
                            </span>
                          )}
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-gray-200"
                            >
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Channel:</span>
                                  <span className="font-medium capitalize">{notification.channel}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status:</span>
                                  <span className={`font-medium capitalize ${
                                    notification.status === 'delivered' ? 'text-green-600' :
                                    notification.status === 'failed' ? 'text-red-600' :
                                    'text-yellow-600'
                                  }`}>
                                    {notification.status}
                                  </span>
                                </div>
                                {notification.sent_at && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Sent:</span>
                                    <span className="font-medium">
                                      {format(new Date(notification.sent_at), 'MMM d, h:mm a')}
                                    </span>
                                  </div>
                                )}
                                {notification.read_at && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Read:</span>
                                    <span className="font-medium">
                                      {format(new Date(notification.read_at), 'MMM d, h:mm a')}
                                    </span>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                {notification.status === 'failed' && onResend && (
                                  <div className="pt-2">
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onResend(notification.id);
                                      }}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs"
                                    >
                                      Resend
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </AnimatePresence>

        {/* Summary Stats */}
        {filteredNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-gray-50 rounded-lg"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{filteredNotifications.length}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
                <div className="text-sm text-gray-600">Unread</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {filteredNotifications.filter(n => n.status === 'delivered').length}
                </div>
                <div className="text-sm text-gray-600">Delivered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {filteredNotifications.filter(n => n.status === 'failed').length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter; 