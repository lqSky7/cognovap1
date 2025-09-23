// React import removed - not needed with new JSX transform
import TooltipRadix from "./TooltipRadix.js";
import type { Conversation } from "../data/mock.js";
import { useTheme } from '../contexts/ThemeContext.js';

interface ConversationModalProps {
  conversation: Conversation | null;
  onClose: () => void;
}

export default function ConversationModal({ conversation, onClose }: ConversationModalProps) {
  const { theme } = useTheme();
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
      <div className={`relative rounded-lg w-4/5 max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border ${
        theme === 'dark' 
          ? 'bg-[#0a0a0a] border-[rgba(255,121,0,0.2)]' 
          : 'bg-white border-[rgba(255,121,0,0.3)]'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-[rgba(255,121,0,0.1)]' : 'border-gray-200'
        }`}>
          <div>
            <h3 id="conversation-modal-title" className={`font-semibold text-xl mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {conversation.title}
            </h3>
            <div className={`flex items-center gap-4 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
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
              className={`transition-colors p-2 ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
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
                <div className={`max-w-[75%] rounded-lg p-4 ${
                  message.sender === 'user' 
                    ? 'bg-[#FF7900] text-black' 
                    : theme === 'dark'
                      ? 'bg-[rgba(255,255,255,0.05)] text-white'
                      : 'bg-gray-100 text-gray-900'
                }`}>
                  
                  {message.sender === 'ai' && (
                    <div className={`flex items-center gap-2 mb-2 text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span className="text-base">{aiInfo.emoji}</span>
                      <span>{aiInfo.name}</span>
                    </div>
                  )}
                  
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  
                  <div className={`text-xs mt-2 ${
                    message.sender === 'user' 
                      ? 'text-black/70' 
                      : theme === 'dark' 
                        ? 'text-gray-400' 
                        : 'text-gray-600'
                  }`}>
                    {formatTimestamp(message.created_at)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={`text-center ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <div className="text-4xl mb-2">💬</div>
              <p>No messages in this conversation yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-6 border-t flex justify-between items-center ${
          theme === 'dark' ? 'border-[rgba(255,121,0,0.1)]' : 'border-gray-200'
        }`}>
          <div className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
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
                className={`px-4 py-2 rounded transition-colors ${
                  theme === 'dark'
                    ? 'bg-[rgba(255,255,255,0.05)] text-white hover:bg-[rgba(255,255,255,0.1)]'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
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