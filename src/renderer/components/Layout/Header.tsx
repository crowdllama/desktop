import React from 'react';

interface HeaderProps {
  onHistoryClick?: () => void;
  onSettingsClick?: () => void;
  onUserClick?: () => void;
  title?: string;
  icon?: string;
  iconBgColor?: string;
}

const Header: React.FC<HeaderProps> = ({
  onHistoryClick,
  onSettingsClick,
  onUserClick,
  title = 'CrowdLlama',
  icon = 'fa-solid fa-users',
  iconBgColor = 'bg-purple-600',
}) => {
  return (
    <header className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <i className={`${icon} text-white text-sm`}></i>
        </div>
        <h1 className="text-xl font-semibold text-secondary">{title}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={onHistoryClick}
        >
          <i className="fa-solid fa-history text-gray-600"></i>
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={onSettingsClick}
        >
          <i className="fa-solid fa-cog text-gray-600"></i>
        </button>
        <button
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={onUserClick}
        >
          <i className="fa-solid fa-user text-gray-600"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
