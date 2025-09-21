import React, { useState, useEffect } from "react";
import TooltipRadix from "./TooltipRadix.js";
import type { JournalEntry } from "../data/mock.js";

export default function JournalModal(){
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Listen for journal card clicks
  useEffect(() => {
    const handleJournalCardClick = (entry: JournalEntry) => {
      setSelectedEntry(entry);
      setIsOpen(true);
    };

    // Add this function to window so JournalCard can call it
    window.openJournalModal = handleJournalCardClick;

    return () => {
      delete window.openJournalModal;
    };
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    setSelectedEntry(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen || !selectedEntry) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="journal-modal-title"
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={closeModal}
        aria-label="Close modal"
      />
      <div className="relative bg-oled-surface border border-[rgba(255,121,0,0.2)] p-6 rounded-lg w-3/4 max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 id="journal-modal-title" className="font-semibold text-xl text-white mb-1">
              {selectedEntry.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-text">
              <span>{formatDate(selectedEntry.entry_date)}</span>
              <span>Mood: {selectedEntry.mood_score}/10</span>
              <span className={`px-2 py-1 rounded text-xs ${
                selectedEntry.accessible_in_chat 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {selectedEntry.accessible_in_chat ? 'Shared with AI' : 'Private'}
              </span>
            </div>
          </div>
          
          <TooltipRadix content="Close journal entry">
            <button 
              onClick={closeModal}
              className="text-muted-text hover:text-white transition-colors p-1"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </TooltipRadix>
        </div>

        <div className="mb-4">
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {selectedEntry.content}
          </p>
        </div>

        {selectedEntry.attachment_placeholder && (
          <div className="mb-4">
            <div className="w-full h-48 bg-[rgba(255,255,255,0.05)] rounded border-2 border-dashed border-[rgba(255,121,0,0.3)] flex items-center justify-center">
              <div className="text-center text-muted-text">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Image attachment placeholder</p>
                <p className="text-xs opacity-75">{selectedEntry.attachment_placeholder}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <h4 className="text-sm font-medium text-white mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {selectedEntry.tags.map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 bg-[rgba(255,121,0,0.1)] text-[#FF7900] rounded text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <TooltipRadix content="Edit this journal entry">
            <button className="px-4 py-2 rounded bg-[rgba(255,121,0,0.1)] text-[#FF7900] hover:bg-[rgba(255,121,0,0.2)] transition-colors">
              Edit
            </button>
          </TooltipRadix>
          
          <TooltipRadix content="Close journal entry">
            <button 
              onClick={closeModal} 
              className="px-4 py-2 rounded bg-[rgba(255,255,255,0.05)] text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            >
              Close
            </button>
          </TooltipRadix>
        </div>
      </div>
    </div>
  );
}