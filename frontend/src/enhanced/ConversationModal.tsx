import React from "react";
import TooltipRadix from "./TooltipRadix.js";
import type { Conversation, Message } from "../data/mock.js";

interface ConversationModalProps {
  conversation: Conversation | null;
  onClose: () => void;
}

export default function ConversationModal({ conversation, onClose }: ConversationModalProps) {
  if (!conversation) {
    return null;
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAITypeInfo = (aiType: string) => {
    const aiTypes: Record<string, { name: string; emoji: string }> = {
      empathetic_therapist: { name: "Empathetic Therapist", emoji: "🤗" },
      mindfulness_coach: { name: "Mindfulness Coach", emoji: "🧘" },
      behavioral_specialist: { name: "Behavioral Specialist", emoji: "🎯" },
      solution_focused: { name: "Solution-Focused Therapist", emoji: "💡" },
      trauma_specialist: { name: "Trauma Specialist", emoji: "🛡️" }
    };
    return aiTypes[aiType] || { name: "AI Therapist", emoji: "🤖" };
  };

  const aiInfo = getAITypeInfo(conversation.ai_type);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="conversation-modal-title"
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative bg-oled-surface border border-[rgba(255,121,0,0.2)] rounded-lg w-4/5 max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,121,0,0.1)]">
          <div>
            <h3 id="conversation-modal-title" className="font-semibold text-xl text-white mb-1">
              {conversation.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-text">
              <span className="flex items-center gap-2">
                <span className="text-lg">{aiInfo.emoji}</span>
                {aiInfo.name}
              </span>
              <span>{conversation.message_count} messages</span>
              <span>Started {new Date(conversation.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          <TooltipRadix content="Close conversation">
            <button 
              onClick={onClose}
              className="text-muted-text hover:text-white transition-colors p-2"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </TooltipRadix>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {conversation.messages && conversation.messages.length > 0 ? (
            conversation.messages.map((message) => (
              <div 
                key={message.message_id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] ${
                  message.sender === 'user' 
                    ? 'bg-[#FF7900] text-black' 
                    : 'bg-[rgba(255,255,255,0.05)] text-white'
                } rounded-lg p-4`}>
                  
                  {message.sender === 'ai' && (
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                      <span className="text-base">{aiInfo.emoji}</span>
                      <span>{aiInfo.name}</span>
                    </div>
                  )}
                  
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  
                  <div className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-black/70' : 'text-gray-400'
                  }`}>
                    {formatTimestamp(message.created_at)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-text">
              <div className="text-4xl mb-2">💬</div>
              <p>No messages in this conversation yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[rgba(255,121,0,0.1)] flex justify-between items-center">
          <div className="text-sm text-muted-text">
            Last updated: {new Date(conversation.updated_at).toLocaleDateString()}
          </div>
          
          <div className="flex gap-3">
            <TooltipRadix content="Continue this conversation">
              <button className="px-4 py-2 rounded bg-[rgba(255,121,0,0.1)] text-[#FF7900] hover:bg-[rgba(255,121,0,0.2)] transition-colors">
                Continue Chat
              </button>
            </TooltipRadix>
            
            <TooltipRadix content="Close conversation view">
              <button 
                onClick={onClose} 
                className="px-4 py-2 rounded bg-[rgba(255,255,255,0.05)] text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              >
                Close
              </button>
            </TooltipRadix>
          </div>
        </div>
      </div>
    </div>
  );
}