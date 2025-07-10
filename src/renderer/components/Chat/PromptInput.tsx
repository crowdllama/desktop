import React, { useState, useRef, useEffect } from 'react';

interface PromptInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({
  onSendMessage,
  placeholder = 'Ask me anything...',
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [message]);

  return (
    <div className="border-t border-gray-200 p-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full min-h-[60px] max-h-[200px] p-4 pr-14 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder-gray-500 disabled:opacity-50"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={disabled || !message.trim()}
            className="absolute right-3 bottom-3 w-10 h-10 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 rounded-xl flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-paper-plane text-white text-sm"></i>
          </button>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="fa-solid fa-paperclip text-gray-600"></i>
              <span className="text-sm text-gray-600">Attach</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="fa-solid fa-microphone text-gray-600"></i>
              <span className="text-sm text-gray-600">Voice</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="fa-solid fa-image text-gray-600"></i>
              <span className="text-sm text-gray-600">Image</span>
            </button>
          </div>
          <div className="text-xs text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> to send,{' '}
            <kbd className="px-2 py-1 bg-gray-100 rounded">Shift+Enter</kbd> for new line
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptInput; 