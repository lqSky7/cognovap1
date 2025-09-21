import React from "react";
import { ChatInterface } from "../components/chat-interface-fullscreen";
import type { User } from "../services/api";

interface ChatWrapperProps {
  user?: User;
}

export default function ChatWrapper({ user }: ChatWrapperProps){
  return (
    <div className="h-full flex flex-col chat-root">
      <div className="flex-1 overflow-auto">
        {user ? (
          <ChatInterface user={user} />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-text">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-lg font-medium mb-2">Start Your Mental Health Journey</h3>
              <p className="text-sm max-w-md">
                Welcome to Cognova! Choose from our specialized AI therapists to begin 
                a conversation tailored to your mental health needs.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}