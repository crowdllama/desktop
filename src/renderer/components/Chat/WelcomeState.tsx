import React from 'react';
import SuggestionCard from './SuggestionCard';

interface WelcomeStateProps {
  onSuggestionClick?: (suggestion: string) => void;
}

const WelcomeState: React.FC<WelcomeStateProps> = ({ onSuggestionClick }) => {
  const suggestions = [
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
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-900 to-gray-700 rounded-3xl flex items-center justify-center shadow-lg">
        <i className="fa-solid fa-brain text-white text-3xl"></i>
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">How can I help you today?</h2>
        <p className="text-gray-600 max-w-md text-lg">
          Ask me anything and I'll provide detailed, helpful responses to assist you.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        {suggestions.map((suggestion, index) => (
          <SuggestionCard
            key={index}
            icon={suggestion.icon}
            title={suggestion.title}
            description={suggestion.description}
            color={suggestion.color}
            onClick={() => onSuggestionClick?.(suggestion.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default WelcomeState; 