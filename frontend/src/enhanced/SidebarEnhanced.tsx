import { useState } from "react";
import { conversations, user, type Conversation } from "../data/mock.js";
import TooltipRadix from "./TooltipRadix.js";
import ConversationModal from "./ConversationModal.js";
import SettingsPanel from "./SettingsPanel";
import { useTheme } from "../contexts/ThemeContext.js";
import type { User } from "../services/api";

interface SidebarEnhancedProps {
  currentUser?: User;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function SidebarEnhanced({ currentUser, collapsed = false, onToggleCollapse }: SidebarEnhancedProps = {}){
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const { theme } = useTheme();

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const closeModal = () => {
    setSelectedConversation(null);
  };

  const handleNewConversation = () => {
    // Create a simulated new conversation by showing an alert for now
    // This will be replaced with actual API call when backend is connected
    alert('New conversation feature will be fully functional when backend is connected. For now, you can explore the demo conversations!');
  };

  // Show demo conversations for guests, real conversations for authenticated users
  const displayConversations = conversations; // Always show demo conversations for now

  return (
    <>
      <aside className={`transition-all duration-200 ease-in-out p-4 border-r ${
        collapsed ? 'w-16' : 'w-72'
      } ${
        theme === 'dark' 
          ? 'border-[rgba(255,121,0,0.06)]' 
          : 'border-gray-200'
      }`}>
        
        {/* Collapse Toggle Button */}
        <div className="flex items-center justify-between mb-4">
          {!collapsed && (
            <h2 className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Cognova</h2>
          )}
          <TooltipRadix content={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <button
              onClick={onToggleCollapse}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-[rgba(255,121,0,0.1)] text-gray-300'
                  : 'hover:bg-gray-200 text-gray-600'
              }`}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? '→' : '←'}
            </button>
          </TooltipRadix>
        </div>
        
        {!collapsed && (
          <>
            {/* User Info */}
            <div className="flex items-center gap-3 mb-6">
              <TooltipRadix content="User avatar">
                <div className="h-12 w-12 rounded-full bg-[#FF7900] flex items-center justify-center text-black font-bold">
                  {currentUser?.username?.[0] || user?.username?.[0] || "G"}
                </div>
              </TooltipRadix>
              <div>
                <div className={`text-sm font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {currentUser?.username || user?.username || "Guest"}
                  {!currentUser && <span className="ml-2 text-xs px-2 py-1 bg-[#FF7900] text-white rounded">Demo</span>}
                </div>
              </div>
            </div>

            {/* New Conversation Button */}
            <TooltipRadix content="Create a new conversation with an AI therapist">
              <button 
                onClick={handleNewConversation}
                className={`w-full py-2 mb-4 rounded-md border text-sm transition-colors ${
                  theme === 'dark'
                    ? 'border-[rgba(255,121,0,0.12)] hover:bg-[rgba(255,121,0,0.04)]'
                    : 'border-orange-200 hover:bg-orange-50'
                }`}
                aria-label="Create new conversation"
              >
                + New Conversation
              </button>
            </TooltipRadix>

            {/* Past Sessions */}
            <div className="text-xs text-muted-text uppercase mb-2 flex items-center gap-2">
              <span>💬</span>
              Past Sessions
              {!currentUser && <span className="text-[#FF7900] normal-case">(Demo)</span>}
            </div>
            <div className="space-y-2 mb-6">
              {displayConversations.map((c: Conversation) => (
                <TooltipRadix key={c.conversation_id} content={`View conversation: ${c.title}`}>
                  <div 
                    className={`p-3 rounded-md cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7900] focus:ring-opacity-50 ${
                      theme === 'dark'
                        ? 'hover:bg-[rgba(255,121,0,0.04)]'
                        : 'hover:bg-orange-50'
                    }`}
                    onClick={() => handleConversationClick(c)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open conversation: ${c.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleConversationClick(c);
                      }
                    }}
                  >
                    <div className={`font-medium text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{c.title} {!currentUser && <span className="text-xs px-1 py-0.5 bg-[#FF7900] text-white rounded ml-1">Demo</span>}</div>
                    <div className="text-xs text-muted-text">
                      {c.message_count} messages • {new Date(c.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </TooltipRadix>
              ))}
            </div>
            
            {/* Settings Button */}
            <div className="border-t pt-4 mt-auto">
              <TooltipRadix content="Open settings">
                <button
                  onClick={() => setShowSettings(true)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-[rgba(255,121,0,0.1)]'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-label="Open settings"
                >
                  <span className="text-lg">⚙️</span>
                  <span className="text-sm font-medium">Settings</span>
                </button>
              </TooltipRadix>
            </div>
          </>
        )}
        
        {/* Collapsed Icons */}
        {collapsed && (
          <div className="space-y-3">
            <TooltipRadix content="Create new conversation">
              <button 
                onClick={handleNewConversation}
                className={`w-full p-3 rounded-lg transition-colors flex items-center justify-center ${
                  theme === 'dark'
                    ? 'hover:bg-[rgba(255,121,0,0.1)] text-gray-300'
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                +
              </button>
            </TooltipRadix>
            
            <TooltipRadix content="Past conversations">
              <div className={`w-full p-3 rounded-lg flex items-center justify-center text-gray-400`}>
                💬
              </div>
            </TooltipRadix>
            
            <TooltipRadix content="Settings">
              <button
                onClick={() => setShowSettings(true)}
                className={`w-full p-3 rounded-lg transition-colors flex items-center justify-center ${
                  theme === 'dark'
                    ? 'hover:bg-[rgba(255,121,0,0.1)] text-gray-300'
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                ⚙️
              </button>
            </TooltipRadix>
          </div>
        )}
      </aside>

      <ConversationModal 
        conversation={selectedConversation} 
        onClose={closeModal} 
      />
      
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </>
  );
}