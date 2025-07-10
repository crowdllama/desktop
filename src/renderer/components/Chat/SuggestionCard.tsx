import React from 'react';

interface SuggestionCardProps {
  icon: string;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  onClick?: () => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  icon,
  title,
  description,
  color,
  onClick,
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 group-hover:bg-blue-200 text-blue-600',
    green: 'bg-green-100 group-hover:bg-green-200 text-green-600',
    purple: 'bg-purple-100 group-hover:bg-purple-200 text-purple-600',
    orange: 'bg-orange-100 group-hover:bg-orange-200 text-orange-600',
  };

  return (
    <button
      className="group p-5 border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 text-left transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${colorClasses[color]}`}>
          <i className={`${icon}`}></i>
        </div>
        <span className="font-medium text-gray-900">{title}</span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
};

export default SuggestionCard; 