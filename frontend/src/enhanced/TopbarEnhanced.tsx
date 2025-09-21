import React, { useState } from "react";
import TooltipRadix from "./TooltipRadix.js";
import { useTheme } from "../contexts/ThemeContext.js";
import ProfileModal from "./ProfileModal";
import NotificationsPanel from "./NotificationsPanel";

export default function TopbarEnhanced(){
  const [showTour, setShowTour] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleShowTour = () => {
    localStorage.removeItem('cognova_onboard_shown');
    setShowTour(true);
    // Trigger tour restart by forcing a page reload or state update
    window.location.reload();
  };

  const handleNewConversation = () => {
    // Create a simulated new conversation by showing an alert for now
    // This will be replaced with actual API call when backend is connected
    alert('New conversation feature will be fully functional when backend is connected. For now, you can explore the demo conversations in the sidebar!');
  };

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const themeIcon = theme === 'dark' ? '☀️' : '🌙';
  const themeLabel = theme === 'dark' ? 'Light' : 'Dark';

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-[rgba(255,121,0,0.06)] bg-[rgba(255,255,255,0.01)]">
      <div className="flex items-center gap-4">
        <TooltipRadix content="Cognova - Your AI Mental Health Companion">
          <button 
            className="flex items-center gap-2 text-[#FF7900] font-bold text-xl hover:text-[#ff8f33] transition-colors"
            aria-label="Cognova home"
          >
            <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none">
              <defs>
                <linearGradient id="brainGradientHeader" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF7900" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FF9933" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path d="M25 35 Q20 25 30 20 Q40 15 50 20 Q60 15 70 20 Q80 25 75 35 Q80 45 75 55 Q80 65 70 70 Q60 75 50 70 Q40 75 30 70 Q20 65 25 55 Q20 45 25 35 Z" 
                    fill="url(#brainGradientHeader)" stroke="#FF7900" strokeWidth="2"/>
              <circle cx="35" cy="35" r="3" fill="#FFB366" opacity="0.8"/>
              <circle cx="50" cy="30" r="2" fill="#FFB366" opacity="0.8"/>
              <circle cx="65" cy="35" r="3" fill="#FFB366" opacity="0.8"/>
              <circle cx="40" cy="50" r="2" fill="#FFB366" opacity="0.8"/>
              <circle cx="60" cy="50" r="2" fill="#FFB366" opacity="0.8"/>
              <circle cx="50" cy="60" r="3" fill="#FFB366" opacity="0.8"/>
              <line x1="35" y1="35" x2="50" y2="30" stroke="#FFB366" strokeWidth="1" opacity="0.6"/>
              <line x1="50" y1="30" x2="65" y2="35" stroke="#FFB366" strokeWidth="1" opacity="0.6"/>
              <line x1="35" y1="35" x2="40" y2="50" stroke="#FFB366" strokeWidth="1" opacity="0.6"/>
              <line x1="65" y1="35" x2="60" y2="50" stroke="#FFB366" strokeWidth="1" opacity="0.6"/>
              <line x1="40" y1="50" x2="50" y2="60" stroke="#FFB366" strokeWidth="1" opacity="0.6"/>
              <line x1="60" y1="50" x2="50" y2="60" stroke="#FFB366" strokeWidth="1" opacity="0.6"/>
            </svg>
            Cognova
          </button>
        </TooltipRadix>
        <div className="text-sm text-muted-text">Your AI companion</div>
      </div>

      <div className="flex items-center gap-3">
        <TooltipRadix content="Notifications">
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative px-3 py-1 text-xs rounded bg-[rgba(255,121,0,0.08)] text-[#FF7900] hover:bg-[rgba(255,121,0,0.15)] transition-colors flex items-center gap-1"
            aria-label="View notifications"
          >
            🔔 
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </TooltipRadix>
        
        <TooltipRadix content="Toggle theme">
          <button 
            onClick={toggleTheme}
            className="px-3 py-1 text-xs rounded bg-[rgba(255,121,0,0.08)] text-[#FF7900] hover:bg-[rgba(255,121,0,0.15)] transition-colors flex items-center gap-1"
            aria-label="Toggle theme"
          >
            {themeIcon} {themeLabel}
          </button>
        </TooltipRadix>
        
        <TooltipRadix content="Show onboarding tour">
          <button 
            onClick={handleShowTour}
            className="px-3 py-1 text-xs rounded bg-[rgba(255,121,0,0.08)] text-[#FF7900] hover:bg-[rgba(255,121,0,0.15)] transition-colors"
            aria-label="Show onboarding tour"
          >
            Show Tour
          </button>
        </TooltipRadix>
        
        <TooltipRadix content="Start new conversation">
          <button 
            onClick={handleNewConversation}
            className="px-3 py-1 rounded bg-[rgba(255,121,0,0.12)] text-[#FF7900] hover:bg-[rgba(255,121,0,0.2)] transition-colors"
            aria-label="Start new conversation"
          >
            New
          </button>
        </TooltipRadix>
        
        <TooltipRadix content="User profile">
          <div 
            onClick={handleProfileClick}
            className="w-8 h-8 rounded-full bg-[#FF7900] text-black flex items-center justify-center font-bold cursor-pointer hover:bg-[#ff8f33] transition-colors"
            role="button"
            tabIndex={0}
            aria-label="User profile menu"
          >
            G
          </div>
        </TooltipRadix>
      </div>
      
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
    </header>
  );
}