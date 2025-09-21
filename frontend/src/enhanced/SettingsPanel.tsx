import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext.js';

interface SettingsPanelProps {
  onClose: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { theme, toggleTheme } = useTheme();
  
  // Mock settings state
  const [settings, setSettings] = useState({
    notifications: {
      pushNotifications: true,
      emailNotifications: false,
      soundEnabled: true,
      journalReminders: true
    },
    privacy: {
      shareAnalytics: false,
      personalizedAds: false,
      dataCollection: true
    },
    ai: {
      selectedTherapist: 'supportive',
      responseSpeed: 'normal',
      personalityLevel: 7,
      contextMemory: true
    },
    appearance: {
      theme: theme,
      fontSize: 'medium',
      reducedMotion: false,
      compactMode: false
    },
    journal: {
      autoSave: true,
      reminderTime: '20:00',
      moodTracking: true,
      weeklyInsights: true
    }
  });

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'privacy', name: 'Privacy', icon: '🔒' },
    { id: 'ai', name: 'AI Settings', icon: '🤖' },
    { id: 'journal', name: 'Journal', icon: '📝' }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className={`w-full max-w-4xl h-[80vh] rounded-lg border shadow-xl flex overflow-hidden ${
        theme === 'dark' 
          ? 'bg-[#1a1a1a] border-[rgba(255,121,0,0.2)]' 
          : 'bg-white border-gray-200'
      }`}>
        
        {/* Sidebar */}
        <div className={`w-64 border-r ${
          theme === 'dark' 
            ? 'bg-[#0d0d0d] border-[rgba(255,121,0,0.1)]' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="p-4 border-b border-inherit">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Settings</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  activeTab === tab.id
                    ? 'bg-[#FF7900] text-white'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-[rgba(255,121,0,0.1)]'
                      : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-sm font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>General Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>Theme</label>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Choose between light and dark mode</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="px-4 py-2 bg-[#FF7900] text-white rounded-lg hover:bg-[#ff8f33] transition-colors"
                    >
                      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className={`text-sm font-medium ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>Font Size</label>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Adjust text size for better readability</p>
                    </div>
                    <select 
                      value={settings.appearance.fontSize}
                      onChange={(e) => updateSetting('appearance', 'fontSize', e.target.value)}
                      className={`px-3 py-1 rounded border text-sm ${
                        theme === 'dark'
                          ? 'bg-[#2a2a2a] border-[rgba(255,121,0,0.2)] text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Notification Settings</h3>
                
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <label className={`text-sm font-medium capitalize ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{key.replace(/([A-Z])/g, ' $1')}</label>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7900]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Privacy Settings</h3>
                
                <div className="space-y-4">
                  {Object.entries(settings.privacy).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <label className={`text-sm font-medium capitalize ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{key.replace(/([A-Z])/g, ' $1')}</label>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateSetting('privacy', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7900]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Settings */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>AI Therapist Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Default AI Therapist</label>
                    <select 
                      value={settings.ai.selectedTherapist}
                      onChange={(e) => updateSetting('ai', 'selectedTherapist', e.target.value)}
                      className={`w-full mt-1 px-3 py-2 rounded border ${
                        theme === 'dark'
                          ? 'bg-[#2a2a2a] border-[rgba(255,121,0,0.2)] text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="supportive">Supportive AI</option>
                      <option value="analytical">Analytical AI</option>
                      <option value="creative">Creative AI</option>
                      <option value="cbt">CBT AI</option>
                      <option value="jung">Jungian AI</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Response Speed</label>
                    <select 
                      value={settings.ai.responseSpeed}
                      onChange={(e) => updateSetting('ai', 'responseSpeed', e.target.value)}
                      className={`w-full mt-1 px-3 py-2 rounded border ${
                        theme === 'dark'
                          ? 'bg-[#2a2a2a] border-[rgba(255,121,0,0.2)] text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="slow">Thoughtful (Slower)</option>
                      <option value="normal">Balanced</option>
                      <option value="fast">Quick Responses</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Journal Settings */}
            {activeTab === 'journal' && (
              <div className="space-y-6">
                <h3 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Journal Settings</h3>
                
                <div className="space-y-4">
                  {Object.entries(settings.journal).map(([key, value]) => {
                    if (key === 'reminderTime') {
                      return (
                        <div key={key}>
                          <label className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>Reminder Time</label>
                          <input
                            type="time"
                            value={value as string}
                            onChange={(e) => updateSetting('journal', key, e.target.value)}
                            className={`w-full mt-1 px-3 py-2 rounded border ${
                              theme === 'dark'
                                ? 'bg-[#2a2a2a] border-[rgba(255,121,0,0.2)] text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                        </div>
                      );
                    }
                    
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <label className={`text-sm font-medium capitalize ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{key.replace(/([A-Z])/g, ' $1')}</label>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value as boolean}
                            onChange={(e) => updateSetting('journal', key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7900]"></div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}