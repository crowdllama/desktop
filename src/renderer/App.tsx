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
  const { isConnected, peerCount, sendPrompt, networkStatusText, messages, addMessage } = useAppContext();

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);

    // Send prompt to backend
    try {
      await sendPrompt(message, 'tinyllama'); // Default model
      // The response will be handled by the backend message listener in AppContext
    } catch (error) {
      console.error('Failed to send prompt:', error);
      // Show error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, there was an error sending your message. Please try again.',
        timestamp: new Date().toISOString(),
      };
      addMessage(errorMessage);
    }
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
      networkStatusText={networkStatusText}
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
  const { initializeBackend, networkStatusText } = useAppContext();

  const handleShareCompute = async () => {
    console.log('Initializing as worker');
    try {
      await initializeBackend('worker');
      console.log('Navigating to share-compute');
      navigate('/share-compute');
    } catch (error) {
      console.error('Failed to initialize as worker:', error);
    }
  };

  const handleUseNetwork = async () => {
    console.log('Initializing as consumer');
    try {
      await initializeBackend('consumer');
      console.log('Navigating to chat');
      navigate('/chat');
    } catch (error) {
      console.error('Failed to initialize as consumer:', error);
    }
  };

  return (
    <BaseLayout
      isConnected
      peerCount={100}
      networkStatusText={networkStatusText}
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
  const { networkStatusText } = useAppContext();

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
      networkStatusText={networkStatusText}
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
