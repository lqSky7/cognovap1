// React import removed - not needed with new JSX transform
import TooltipRadix from "./TooltipRadix.js";
import type { JournalEntry } from "../data/mock.js";

interface JournalCardProps {
  entry: JournalEntry;
}

declare global {
  interface Window {
    openJournalModal?: (entry: JournalEntry) => void;
  }
}

export default function JournalCard({ entry }: JournalCardProps){
  const handleClick = () => {
    // Use the global function to open the modal
    if (window.openJournalModal) {
      window.openJournalModal(entry);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <TooltipRadix content={`Open journal entry: ${entry.title}`}>
      <div 
        className="p-3 rounded-md bg-[rgba(255,255,255,0.02)] hover:scale-[1.01] hover:bg-[rgba(255,255,255,0.04)] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF7900] focus:ring-opacity-50 border border-transparent hover:border-[rgba(255,121,0,0.1)]"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Open journal entry: ${entry.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-white truncate pr-2">{entry.title}</div>
          <div className="text-xs text-muted-text whitespace-nowrap">
            Mood: {entry.mood_score}/10
          </div>
        </div>
        
        <div className="text-xs text-gray-400 mb-2 line-clamp-2 leading-relaxed">
          {entry.content}
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-text">{formatDate(entry.entry_date)}</span>
          <div className="flex gap-1">
            {entry.tags.slice(0, 2).map(tag => (
              <span 
                key={tag} 
                className="px-1.5 py-0.5 bg-[rgba(255,121,0,0.1)] text-[#FF7900] rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {entry.tags.length > 2 && (
              <span className="text-muted-text">+{entry.tags.length - 2}</span>
            )}
          </div>
        </div>
      </div>
    </TooltipRadix>
  );
}