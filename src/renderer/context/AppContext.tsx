import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

type AppRoute = 'welcome' | 'chat' | 'share-compute';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  avatar?: string;
}

interface AppContextType {
  currentRoute: AppRoute;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  navigateTo: (route: AppRoute) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  peerCount: number;
  setPeerCount: (count: number) => void;
  networkStatusText: string;
  setNetworkStatusText: (text: string) => void;
  messages: Message[];
  addMessage: (message: Message) => void;
  addPromptResponse: (response: string) => void;
  initializeBackend: (mode: 'worker' | 'consumer') => Promise<any>;
  sendPrompt: (prompt: string, model: string) => Promise<any>;
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
  const [networkStatusText, setNetworkStatusText] = useState('Connected');
  const [messages, setMessages] = useState<Message[]>([]);

  const navigateTo = (route: AppRoute) => {
    setCurrentRoute(route);
    if (route !== 'welcome') {
      setShowWelcome(false);
    }
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const addPromptResponse = (response: string) => {
    const aiMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, aiMessage]);
  };

    // Handle incoming backend messages
  useEffect(() => {
    const unsubscribe = window.electron.backend.onBackendMessage((message: any) => {
      console.log('🟢 [RENDERER] Received backend message:', message);

      if (message.type === 'prompt_response') {
        console.log('🟢 [RENDERER] Processing prompt_response:', message);
        // Add the response to the chat messages
        if (message.content) {
          addPromptResponse(message.content);
        }
      } else if (message.type === 'initialize_status') {
        console.log('🟢 [RENDERER] Processing initialize_status:', message);
        setNetworkStatusText(message.text || 'Connected');
      } else {
        console.log('🟢 [RENDERER] Unknown message type:', message.type);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const initializeBackend = async (mode: 'worker' | 'consumer') => {
    return window.electron.backend.initializeBackend(mode);
  };

  const sendPrompt = async (prompt: string, model: string) => {
    console.log('🟡 [RENDERER] Sending prompt:', { prompt, model });
    const result = await window.electron.backend.sendPrompt(prompt, model);
    console.log('🟡 [RENDERER] Send prompt result:', result);
    return result;
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
    networkStatusText,
    setNetworkStatusText,
    messages,
    addMessage,
    addPromptResponse,
    initializeBackend,
    sendPrompt,
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
