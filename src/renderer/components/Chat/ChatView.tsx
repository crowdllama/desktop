import React, { useState } from 'react';
import ChatHistory from './ChatHistory';
import PromptInput from './PromptInput';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  avatar?: string;
}

interface ChatViewProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  disabled = false,
}) => {
  const [showWelcome, setShowWelcome] = useState(messages.length === 0);

  const handleSendMessage = (message: string) => {
    onSendMessage(message);
    setShowWelcome(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
    setShowWelcome(false);
  };

  return (
    <>
      <ChatHistory
        messages={messages}
        showWelcome={showWelcome}
        onSuggestionClick={handleSuggestionClick}
      />
      <PromptInput
        onSendMessage={handleSendMessage}
        disabled={disabled}
      />
    </>
  );
};

export default ChatView;
