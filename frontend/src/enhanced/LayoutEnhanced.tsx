import React, { useState } from "react";
import TopbarEnhanced from "./TopbarEnhanced.js";
import SidebarEnhanced from "./SidebarEnhanced.js";
import ChatWrapper from "./ChatWrapper.js";
import JournalCard from "./JournalCard.js";
import JournalModal from "./JournalModal.js";
import OnboardingTour from "./OnboardingTour.js";
import WellnessJourney from "./WellnessJourney";
import { journal_entries, type JournalEntry } from "../data/mock.js";
import { useTheme } from "../contexts/ThemeContext.js";
import type { User } from "../services/api";

interface LayoutEnhancedProps {
  user?: User;
}

export default function LayoutEnhanced({ user }: LayoutEnhancedProps){
  const { theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatMode, setChatMode] = useState<'main' | 'chat'>('main'); // main shows journal/wellness, chat hides them
  
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };
  
  const handleChatModeChange = (mode: 'main' | 'chat') => {
    setChatMode(mode);
  };
  
  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-oled text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <SidebarEnhanced 
        currentUser={user} 
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      <div className="flex-1 flex flex-col">
        <TopbarEnhanced />
        <main className="p-4 flex-1 overflow-auto">
          <div className={`grid gap-4 ${
            chatMode === 'chat' || sidebarCollapsed 
              ? 'grid-cols-1' 
              : 'grid-cols-4'
          }`}>
            <section className={chatMode === 'chat' || sidebarCollapsed ? 'col-span-1' : 'col-span-2'}>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-[#FF7900] mb-2 flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#FF7900]" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="30" r="8" fill="currentColor" fillOpacity="0.3"/>
                    <path d="M20 45 Q50 15 80 45 Q50 75 20 45" fill="currentColor" fillOpacity="0.2"/>
                    <circle cx="30" cy="40" r="3" fill="currentColor"/>
                    <circle cx="50" cy="35" r="3" fill="currentColor"/>
                    <circle cx="70" cy="40" r="3" fill="currentColor"/>
                    <path d="M30 40 L50 35 L70 40" stroke="currentColor" strokeWidth="1" fill="none"/>
                    <path d="M50 50 Q35 60 30 70 M50 50 Q65 60 70 70 M45 55 Q50 65 55 55" stroke="currentColor" strokeWidth="1" fill="none"/>
                  </svg>
                  AI Chat
                  {chatMode === 'chat' && (
                    <button
                      onClick={() => handleChatModeChange('main')}
                      className="ml-2 px-2 py-1 text-xs bg-[rgba(255,121,0,0.1)] text-[#FF7900] rounded hover:bg-[rgba(255,121,0,0.2)] transition-colors"
                    >
                      ← Back to Main
                    </button>
                  )}
                </h2>
                <div className={`h-[520px] rounded-lg p-4 border backdrop-blur-sm ${
                  theme === 'dark'
                    ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,121,0,0.1)]'
                    : 'bg-white border-gray-200 shadow-sm'
                }`}>
                  <ChatWrapper 
                    user={user} 
                    onChatStart={() => handleChatModeChange('chat')}
                  />
                </div>
              </div>
            </section>

            {/* Only show journal and wellness in main mode and when sidebar is not collapsed */}
            {chatMode === 'main' && !sidebarCollapsed && (
              <>
                <aside className="col-span-1 wellness-section">
                  <WellnessJourney user={user} />
                </aside>

                <aside className="col-span-1 journal-section">
                  <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    <span className="text-xl">📝</span>
                    Journal <span className="text-xs px-2 py-1 bg-[#FF7900] text-white rounded">Demo</span>
                  </h3>
                  <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2">
                    {journal_entries.map((e: JournalEntry) => (
                      <JournalCard key={e.entry_id} entry={e} />
                    ))}
                    {/* Show demo indicator for now, will be removed when backend is set up */}
                    <div className={`p-3 rounded-lg border text-center text-xs ${
                      theme === 'dark'
                        ? 'border-[rgba(255,121,0,0.2)] bg-[rgba(255,121,0,0.05)] text-gray-400'
                        : 'border-orange-200 bg-orange-50 text-gray-600'
                    }`}>
                      📝 Demo journal entries - Sign up to save your own!
                    </div>
                  </div>
                </aside>
              </>
            )}
          </div>
        </main>
      </div>

      <JournalModal />
      <OnboardingTour />
    </div>
  );
}