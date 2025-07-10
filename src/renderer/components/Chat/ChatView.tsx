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
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <ChatHistory
          messages={messages}
          showWelcome={showWelcome}
          onSuggestionClick={handleSuggestionClick}
        />
      </div>
      <div className="flex-shrink-0">
        <PromptInput
          onSendMessage={handleSendMessage}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default ChatView;
