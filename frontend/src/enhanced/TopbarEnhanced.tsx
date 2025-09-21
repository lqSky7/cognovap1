import React, { useState } from "react";
import TooltipRadix from "./TooltipRadix.js";

export default function TopbarEnhanced(){
  const [showTour, setShowTour] = useState(false);

  const handleShowTour = () => {
    localStorage.removeItem('cognova_onboard_shown');
    setShowTour(true);
    // Trigger tour restart by forcing a page reload or state update
    window.location.reload();
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-[rgba(255,121,0,0.06)] bg-[rgba(255,255,255,0.01)]">
      <div className="flex items-center gap-4">
        <TooltipRadix content="Cognova - Your AI Mental Health Companion">
          <button 
            className="text-[#FF7900] font-bold text-xl hover:text-[#ff8f33] transition-colors"
            aria-label="Cognova home"
          >
            Cognova
          </button>
        </TooltipRadix>
        <div className="text-sm text-muted-text">Your AI companion</div>
      </div>

      <div className="flex items-center gap-3">
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
            className="px-3 py-1 rounded bg-[rgba(255,121,0,0.12)] text-[#FF7900] hover:bg-[rgba(255,121,0,0.2)] transition-colors"
            aria-label="Start new conversation"
          >
            New
          </button>
        </TooltipRadix>
        
        <TooltipRadix content="User profile">
          <div 
            className="w-8 h-8 rounded-full bg-[#FF7900] text-black flex items-center justify-center font-bold cursor-pointer hover:bg-[#ff8f33] transition-colors"
            role="button"
            tabIndex={0}
            aria-label="User profile menu"
          >
            G
          </div>
        </TooltipRadix>
      </div>
    </header>
  );
}