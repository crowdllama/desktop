import React from 'react';

interface NetworkStatusBarProps {
  isConnected: boolean;
  peerCount: number;
  statusText?: string;
}

const NetworkStatusBar: React.FC<NetworkStatusBarProps> = ({
  isConnected,
  peerCount,
  statusText = 'Connected',
}) => {
  return (
    <div className="border-b border-gray-200 px-6 py-3 bg-gray-50 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div 
            className={`w-3 h-3 rounded-full animate-pulse ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          ></div>
          <i className="fa-solid fa-network-wired text-gray-600 text-sm"></i>
        </div>
        <span className="text-sm font-medium text-gray-700">Network Status:</span>
        <span 
          className={`text-sm font-medium ${
            isConnected ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {statusText}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <i className="fa-solid fa-users text-gray-600 text-sm"></i>
        <span className="text-sm text-gray-600">Network peers:</span>
        <span className="text-sm font-medium text-gray-700">{peerCount}</span>
      </div>
    </div>
  );
};

export default NetworkStatusBar; 