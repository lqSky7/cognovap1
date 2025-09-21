import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext.js';

interface NotificationsPanelProps {
  onClose: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'feature';
  timestamp: string;
  read: boolean;
}

export default function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const { theme } = useTheme();
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to Cognova! 🎉',
      message: 'Thanks for exploring our AI mental health companion. You\'re currently in demo mode.',
      type: 'info',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '2',
      title: 'New AI Therapist Available',
      message: 'Try our new CBT-focused AI therapist for cognitive behavioral therapy sessions.',
      type: 'feature',
      timestamp: '1 day ago',
      read: false
    },
    {
      id: '3',
      title: 'Wellness Journey Updated',
      message: 'Your mood tracking and achievement system has been enhanced with new insights.',
      type: 'success',
      timestamp: '2 days ago',
      read: true
    },
    {
      id: '4',
      title: 'Journal Reminder',
      message: 'Don\'t forget to write in your journal today! Consistent journaling improves mental health.',
      type: 'info',
      timestamp: '3 days ago',
      read: true
    },
    {
      id: '5',
      title: 'Backend Integration Coming Soon',
      message: 'Real user accounts and data persistence will be available when backend is connected.',
      type: 'warning',
      timestamp: '1 week ago',
      read: false
    }
  ]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'feature': return '🆕';
      default: return 'ℹ️';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4"
      onClick={handleOverlayClick}
    >
      <div className={`w-96 max-h-[80vh] overflow-hidden rounded-lg border shadow-xl ${
        theme === 'dark' 
          ? 'bg-[#1a1a1a] border-[rgba(255,121,0,0.2)]' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className={`p-4 border-b ${
          theme === 'dark' ? 'border-[rgba(255,121,0,0.1)]' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 text-xs bg-[#FF7900] text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-[#FF7900] hover:text-[#ff8f33] transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">🔔</div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                No notifications yet
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`p-4 border-b cursor-pointer transition-colors ${
                  theme === 'dark' 
                    ? 'border-[rgba(255,121,0,0.1)] hover:bg-[rgba(255,121,0,0.05)]' 
                    : 'border-gray-100 hover:bg-gray-50'
                } ${!notification.read ? 'bg-[rgba(255,121,0,0.03)]' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-lg flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-[#FF7900] rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>
                    <p className={`text-xs mt-2 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className={`p-3 border-t text-center ${
          theme === 'dark' 
            ? 'border-[rgba(255,121,0,0.1)] bg-[rgba(255,121,0,0.02)]' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Real-time notifications will be available when backend is connected
          </p>
        </div>
      </div>
    </div>
  );
}