import React from "react";
import { ChatInterface } from "../components/chat-interface-fullscreen";
import { useTheme } from "../contexts/ThemeContext.js";
import type { User } from "../services/api";

interface ChatWrapperProps {
  user?: User;
  onChatStart?: () => void;
}

export default function ChatWrapper({ user, onChatStart }: ChatWrapperProps){
  const { theme } = useTheme();
  
  const handleStartChat = () => {
    if (onChatStart) onChatStart();
    // Additional chat start logic can go here
  };
  
  return (
    <div className="h-full flex flex-col chat-root">
      <div className="flex-1 overflow-auto">
        {user ? (
          <ChatInterface user={user} />
        ) : (
          <div className={`h-full flex items-center justify-center ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-[#FF7900]" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="30" r="12" fill="currentColor" fillOpacity="0.3"/>
                <path d="M15 50 Q50 10 85 50 Q50 90 15 50" fill="currentColor" fillOpacity="0.2"/>
                <circle cx="35" cy="45" r="4" fill="currentColor"/>
                <circle cx="50" cy="38" r="4" fill="currentColor"/>
                <circle cx="65" cy="45" r="4" fill="currentColor"/>
                <path d="M35 45 L50 38 L65 45" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M50 55 Q40 65 35 75 M50 55 Q60 65 65 75 M45 60 Q50 70 55 60" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              <h3 className={`text-lg font-medium mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Start Your Mental Health Journey</h3>
              <p className={`text-sm max-w-md ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Welcome to Cognova! Choose from our specialized AI therapists to begin 
                a conversation tailored to your mental health needs.
              </p>
              <div className="mt-4 flex gap-2 justify-center">
                <button 
                  data-testid="new-chat-btn"
                  onClick={handleStartChat}
                  className="px-4 py-2 bg-[#FF7900] text-white rounded-lg hover:bg-[#ff8f33] transition-colors"
                >
                  Start Chatting
                </button>
                <span className="text-xs px-2 py-2 bg-[#FF7900] bg-opacity-20 text-[#FF7900] rounded">Demo Mode</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}