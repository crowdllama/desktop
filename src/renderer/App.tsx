import { useState } from 'react';
import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import BaseLayout from './components/Layout/BaseLayout';
import ChatView from './components/Chat/ChatView';
import WelcomePage from './components/Welcome/WelcomePage';
import ShareComputePage from './components/ShareCompute/ShareComputePage';
import { AppProvider, useAppContext } from './context/AppContext';
import './App.css';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  avatar?: string;
}

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { isConnected, peerCount } = useAppContext();

  const handleSendMessage = (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response (in real app, this would come from backend)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I received your message: "${message}". This is a simulated response. In the real application, this would come from your AI backend.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleHistoryClick = () => {
    console.log('History clicked');
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const handleUserClick = () => {
    console.log('User clicked');
  };

  return (
    <BaseLayout
      isConnected={isConnected}
      peerCount={peerCount}
      onHistoryClick={handleHistoryClick}
      onSettingsClick={handleSettingsClick}
      onUserClick={handleUserClick}
    >
      <ChatView messages={messages} onSendMessage={handleSendMessage} />
    </BaseLayout>
  );
}

function WelcomePageWrapper() {
  const navigate = useNavigate();

  const handleShareCompute = () => {
    console.log('Navigating to share-compute');
    navigate('/share-compute');
  };

  const handleUseNetwork = () => {
    console.log('Navigating to chat');
    navigate('/chat');
  };

  return (
    <BaseLayout
      isConnected
      peerCount={100}
      onHistoryClick={() => console.log('History clicked')}
      onSettingsClick={() => console.log('Settings clicked')}
      onUserClick={() => console.log('User clicked')}
    >
      <WelcomePage
        onShareCompute={handleShareCompute}
        onUseNetwork={handleUseNetwork}
      />
    </BaseLayout>
  );
}

function ShareComputePageWrapper() {
  const navigate = useNavigate();

  const handleStartSharing = () => {
    console.log('Starting to share, navigating to chat');
    navigate('/chat');
  };

  const handleCancel = () => {
    console.log('Canceling, navigating to chat');
    navigate('/chat');
  };

  return (
    <BaseLayout
      isConnected
      peerCount={100}
      onHistoryClick={() => console.log('History clicked')}
      onSettingsClick={() => console.log('Settings clicked')}
      onUserClick={() => console.log('User clicked')}
      headerTitle="Share My Compute"
      headerIcon="fa-solid fa-server"
      headerIconBgColor="bg-primary"
    >
      <ShareComputePage
        onStartSharing={handleStartSharing}
        onCancel={handleCancel}
      />
    </BaseLayout>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePageWrapper />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/share-compute" element={<ShareComputePageWrapper />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}
