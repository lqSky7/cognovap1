import React, { useState } from "react";
import { conversations, user, type Conversation } from "../data/mock.js";
import TooltipRadix from "./TooltipRadix.js";
import ConversationModal from "./ConversationModal.js";

export default function SidebarEnhanced(){
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const closeModal = () => {
    setSelectedConversation(null);
  };

  return (
    <>
      <aside className="w-72 p-4 border-r border-[rgba(255,121,0,0.06)]">
        <div className="flex items-center gap-3 mb-6">
          <TooltipRadix content="User avatar">
            <div className="h-12 w-12 rounded-full bg-[#FF7900] flex items-center justify-center text-black font-bold">
              {user?.username?.[0] || "G"}
            </div>
          </TooltipRadix>
          <div>
            <div className="text-sm font-semibold">{user?.username || "Guest"}</div>
            <div className="text-xs text-muted-text">{user?.email}</div>
          </div>
        </div>

        <TooltipRadix content="Create a new conversation with an AI therapist">
          <button 
            className="w-full py-2 mb-4 rounded-md border border-[rgba(255,121,0,0.12)] text-sm hover:bg-[rgba(255,121,0,0.04)] transition-colors"
            aria-label="Create new conversation"
          >
            + New Conversation
          </button>
        </TooltipRadix>

        <div className="text-xs text-muted-text uppercase mb-2 flex items-center gap-2">
          <span>💬</span>
          Past Sessions
        </div>
        <div className="space-y-2">
          {conversations.map((c: Conversation) => (
            <TooltipRadix key={c.conversation_id} content={`View conversation: ${c.title}`}>
              <div 
                className="p-3 rounded-md cursor-pointer hover:bg-[rgba(255,121,0,0.04)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7900] focus:ring-opacity-50"
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
                <div className="font-medium text-sm">{c.title}</div>
                <div className="text-xs text-muted-text">
                  {c.message_count} messages • {new Date(c.updated_at).toLocaleDateString()}
                </div>
              </div>
            </TooltipRadix>
          ))}
        </div>
      </aside>

      <ConversationModal 
        conversation={selectedConversation} 
        onClose={closeModal} 
      />
    </>
  );
}