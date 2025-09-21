import React from 'react';
import { useTheme } from '../contexts/ThemeContext.js';

interface ProfileModalProps {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const { theme } = useTheme();

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className={`p-6 rounded-lg border max-w-md w-full mx-4 ${
        theme === 'dark' 
          ? 'bg-[#1a1a1a] border-[rgba(255,121,0,0.2)] text-white' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#FF7900]">Guest Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center w-20 h-20 bg-[#FF7900] text-black text-2xl font-bold rounded-full mx-auto">
            G
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-medium">Guest User</h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              You're currently browsing as a guest
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${
            theme === 'dark' 
              ? 'bg-[rgba(255,121,0,0.05)] border border-[rgba(255,121,0,0.1)]' 
              : 'bg-orange-50 border border-orange-200'
          }`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              🎭 <strong>Demo Mode:</strong> You're seeing sample data including demo conversations, journal entries, and wellness stats. This helps you explore Cognova's features before signing up!
            </p>
          </div>
          
          <div className={`p-3 rounded-lg ${
            theme === 'dark' 
              ? 'bg-[rgba(100,255,100,0.05)] border border-[rgba(100,255,100,0.1)]' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <p className={`text-xs ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
              ✓ Demo data includes: Past chat sessions, Journal entries, Wellness journey stats, Mood tracking
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#FF7900] text-white rounded-lg hover:bg-[#ff8f33] transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Continue as Guest
            </button>
          </div>
          
          {/* Quick Access Menu */}
          <div className={`mt-4 p-3 rounded-lg border ${
            theme === 'dark' 
              ? 'border-[rgba(255,121,0,0.1)] bg-[rgba(255,121,0,0.02)]'
              : 'border-gray-200 bg-gray-50'
          }`}>
            <h4 className={`text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Quick Access</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => {
                  // This would navigate to journal section
                  onClose();
                  alert('Journal section access - will be implemented when main/chat views are separated');
                }}
                className={`p-2 rounded text-left transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-[rgba(255,121,0,0.1)] text-gray-300'
                    : 'hover:bg-orange-100 text-gray-700'
                }`}
              >
                <div className="text-lg mb-1">📝</div>
                <div className="text-xs font-medium">Journal</div>
              </button>
              
              <button 
                onClick={() => {
                  // This would navigate to wellness section
                  onClose();
                  alert('Wellness Journey access - will be implemented when main/chat views are separated');
                }}
                className={`p-2 rounded text-left transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-[rgba(255,121,0,0.1)] text-gray-300'
                    : 'hover:bg-orange-100 text-gray-700'
                }`}
              >
                <div className="text-lg mb-1">🌟</div>
                <div className="text-xs font-medium">Wellness</div>
              </button>
              
              <button 
                onClick={() => {
                  // This would navigate to chat archive
                  onClose();
                  alert('Chat Archive access - currently visible in left sidebar');
                }}
                className={`p-2 rounded text-left transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-[rgba(255,121,0,0.1)] text-gray-300'
                    : 'hover:bg-orange-100 text-gray-700'
                }`}
              >
                <div className="text-lg mb-1">💬</div>
                <div className="text-xs font-medium">Chats</div>
              </button>
              
              <button 
                onClick={() => {
                  // This would open settings
                  onClose();
                  alert('Settings access - settings panel will be added to left sidebar');
                }}
                className={`p-2 rounded text-left transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-[rgba(255,121,0,0.1)] text-gray-300'
                    : 'hover:bg-orange-100 text-gray-700'
                }`}
              >
                <div className="text-lg mb-1">⚙️</div>
                <div className="text-xs font-medium">Settings</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}