import React, { ReactNode } from 'react';
import Header from './Header';
import NetworkStatusBar from './NetworkStatusBar';
import BackendStatus from '../BackendStatus';

interface BaseLayoutProps {
  children: ReactNode;
  isConnected?: boolean;
  peerCount?: number;
  networkStatusText?: string;
  onHistoryClick?: () => void;
  onSettingsClick?: () => void;
  onUserClick?: () => void;
  headerTitle?: string;
  headerIcon?: string;
  headerIconBgColor?: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  children,
  isConnected = true,
  peerCount = 0,
  networkStatusText = 'Connected',
  onHistoryClick,
  onSettingsClick,
  onUserClick,
  headerTitle = 'CrowdLlama',
  headerIcon = 'fa-solid fa-users',
  headerIconBgColor = 'bg-purple-600',
}) => {
  return (
    <div className="h-[900px] bg-white flex flex-col">
      <Header
        onHistoryClick={onHistoryClick}
        onSettingsClick={onSettingsClick}
        onUserClick={onUserClick}
        title={headerTitle}
        icon={headerIcon}
        iconBgColor={headerIconBgColor}
      />
      <NetworkStatusBar
        isConnected={isConnected}
        peerCount={peerCount}
        statusText={networkStatusText}
      />
      <div className="px-4 py-2 bg-gray-50 border-b">
        <BackendStatus />
      </div>
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default BaseLayout;
