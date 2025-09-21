import React, { createContext, useContext, useState } from 'react';

type AppMode = 'main' | 'chat' | 'search';

interface AppContextType {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  showJournalWellness: boolean;
  setShowJournalWellness: (show: boolean) => void;
  guestCreatedChat: boolean;
  setGuestCreatedChat: (created: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [appMode, setAppMode] = useState<AppMode>('main');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showJournalWellness, setShowJournalWellness] = useState(true);
  const [guestCreatedChat, setGuestCreatedChat] = useState(false);

  return (
    <AppContext.Provider value={{
      appMode,
      setAppMode,
      sidebarCollapsed,
      setSidebarCollapsed,
      showJournalWellness,
      setShowJournalWellness,
      guestCreatedChat,
      setGuestCreatedChat
    }}>
      {children}
    </AppContext.Provider>
  );
};