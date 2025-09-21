import React from "react";
import TopbarEnhanced from "./TopbarEnhanced.js";
import SidebarEnhanced from "./SidebarEnhanced.js";
import ChatWrapper from "./ChatWrapper.js";
import JournalCard from "./JournalCard.js";
import JournalModal from "./JournalModal.js";
import OnboardingTour from "./OnboardingTour.js";
import { journal_entries, type JournalEntry } from "../data/mock.js";
import type { User } from "../services/api";

interface LayoutEnhancedProps {
  user?: User;
}

export default function LayoutEnhanced({ user }: LayoutEnhancedProps){
  return (
    <div className="min-h-screen flex bg-oled text-white">
      <SidebarEnhanced />
      <div className="flex-1 flex flex-col">
        <TopbarEnhanced />
        <main className="p-4 flex-1 overflow-auto">
          <div className="grid grid-cols-3 gap-4">
            <section className="col-span-2">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-[#FF7900] mb-2 flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  Chat
                </h2>
                <div className="h-[520px] bg-[rgba(255,255,255,0.02)] rounded-lg p-4 border border-[rgba(255,121,0,0.1)] backdrop-blur-sm">
                  <ChatWrapper user={user} />
                </div>
              </div>
            </section>

            <aside className="col-span-1 journal-section">
              <h3 className="text-lg font-semibold mb-3 text-white flex items-center gap-2">
                <span className="text-xl">📝</span>
                Journal
              </h3>
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2">
                {journal_entries.map((e: JournalEntry) => (
                  <JournalCard key={e.entry_id} entry={e} />
                ))}
              </div>
            </aside>
          </div>
        </main>
      </div>

      <JournalModal />
      <OnboardingTour />
    </div>
  );
}