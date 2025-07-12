import React, { useEffect, useRef } from 'react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  avatar?: string;
}

interface ChatHistoryProps {
  messages: Message[];
  showWelcome?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  messages,
  showWelcome = false,
  onSuggestionClick,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
      {showWelcome && (
        <div className="flex flex-col items-center justify-center min-h-full space-y-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-700 rounded-3xl flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-brain text-white text-3xl"></i>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              How can I help you today?
            </h2>
            <p className="text-gray-600 max-w-md text-lg">
              Ask me anything and I&apos;ll provide detailed, helpful responses to assist you.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-2xl">
            {[
              {
                icon: 'fa-solid fa-lightbulb',
                title: 'Creative Ideas',
                description: 'Generate creative content and brainstorm innovative ideas',
                color: 'blue' as const,
              },
              {
                icon: 'fa-solid fa-code',
                title: 'Code Help',
                description: 'Debug code and get programming assistance',
                color: 'green' as const,
              },
              {
                icon: 'fa-solid fa-book',
                title: 'Research',
                description: 'Find information and analyze complex topics',
                color: 'purple' as const,
              },
              {
                icon: 'fa-solid fa-pen',
                title: 'Writing',
                description: 'Improve writing and create compelling content',
                color: 'orange' as const,
              },
            ].map((suggestion, index) => (
              <button
                key={suggestion.title}
                type="button"
                className="group p-5 border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 text-left transition-all duration-200"
                onClick={() => onSuggestionClick?.(suggestion.title)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    suggestion.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200 text-blue-600' :
                    suggestion.color === 'green' ? 'bg-green-100 group-hover:bg-green-200 text-green-600' :
                    suggestion.color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-200 text-purple-600' :
                    'bg-orange-100 group-hover:bg-orange-200 text-orange-600'
                  }`}>
                    <i className={suggestion.icon}></i>
                  </div>
                  <span className="font-medium text-gray-900">{suggestion.title}</span>
                </div>
                <p className="text-sm text-gray-600">{suggestion.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((message) => (
        <div key={message.id} className="flex items-start space-x-4">
          {message.type === 'user' ? (
            <>
              <img
                src={message.avatar || "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg"}
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="bg-blue-600 text-white rounded-2xl px-5 py-3 max-w-md">
                  <p>{message.content}</p>
                </div>
                <div className="text-xs text-gray-500 mt-2">{formatTime(message.timestamp)}</div>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-brain text-white text-sm"></i>
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl px-5 py-4">
                  <p className="text-gray-900">{message.content}</p>
                </div>
                <div className="text-xs text-gray-500 mt-2 flex items-center space-x-3">
                  <span>{formatTime(message.timestamp)}</span>
                  <button className="hover:text-gray-700 transition-colors">
                    <i className="fa-solid fa-copy"></i>
                  </button>
                  <button className="hover:text-gray-700 transition-colors">
                    <i className="fa-solid fa-thumbs-up"></i>
                  </button>
                  <button className="hover:text-gray-700 transition-colors">
                    <i className="fa-solid fa-thumbs-down"></i>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
