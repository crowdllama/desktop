import React, { createContext, useContext, useState, ReactNode } from 'react';

type AppRoute = 'welcome' | 'chat' | 'share-compute';

interface AppContextType {
  currentRoute: AppRoute;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  navigateTo: (route: AppRoute) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  peerCount: number;
  setPeerCount: (count: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // For development, always show welcome page first
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('welcome');
  const [isConnected, setIsConnected] = useState(true);
  const [peerCount, setPeerCount] = useState(100);

  const navigateTo = (route: AppRoute) => {
    setCurrentRoute(route);
    if (route !== 'welcome') {
      setShowWelcome(false);
    }
  };

  const value: AppContextType = {
    currentRoute,
    showWelcome,
    setShowWelcome,
    navigateTo,
    isConnected,
    setIsConnected,
    peerCount,
    setPeerCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
