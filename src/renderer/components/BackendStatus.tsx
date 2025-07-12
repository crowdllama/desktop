import React, { useState, useEffect } from 'react';

interface BackendStatusProps {
  className?: string;
}

interface BackendStatusData {
  isRunning: boolean;
  pid: number | null;
}

interface PingResult {
  success: boolean;
  message: string;
}

export default function BackendStatus({ className = '' }: BackendStatusProps) {
  const [status, setStatus] = useState<BackendStatusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastPing, setLastPing] = useState<PingResult | null>(null);

  const checkStatus = async () => {
    try {
      const result = await window.electron?.backend.getBackendStatus();
      setStatus(result);
    } catch (error) {
      console.error('Error checking backend status:', error);
    }
  };

  const startBackend = async () => {
    setLoading(true);
    try {
      const result = await window.electron?.backend.startBackend();
      console.log('Start backend result:', result);
      await checkStatus();
    } catch (error) {
      console.error('Error starting backend:', error);
    } finally {
      setLoading(false);
    }
  };

  const stopBackend = async () => {
    setLoading(true);
    try {
      const result = await window.electron?.backend.stopBackend();
      console.log('Stop backend result:', result);
      await checkStatus();
    } catch (error) {
      console.error('Error stopping backend:', error);
    } finally {
      setLoading(false);
    }
  };

  const pingBackend = async () => {
    try {
      const result = await window.electron?.backend.pingBackend();
      setLastPing(result);
      console.log('Ping result:', result);
    } catch (error) {
      console.error('Error pinging backend:', error);
    }
  };

  useEffect(() => {
    checkStatus();
    // Check status every 5 seconds
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-2">
        <div
          className={`w-2 h-2 rounded-full ${
            status?.isRunning ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-sm text-gray-600">
          Backend: {status?.isRunning ? 'Running' : 'Stopped'}
          {status?.pid && ` (PID: ${status.pid})`}
          {lastPing && (
            <span className={`ml-2 ${lastPing.success ? 'text-green-600' : 'text-red-600'}`}>
              • Ping: {lastPing.success ? 'OK' : 'Failed'}
            </span>
          )}
        </span>
      </div>
      <div className="flex space-x-1">
        <button
          type="button"
          onClick={startBackend}
          disabled={loading || status?.isRunning}
          className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start
        </button>
        <button
          type="button"
          onClick={stopBackend}
          disabled={loading || !status?.isRunning}
          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Stop
        </button>
        <button
          type="button"
          onClick={pingBackend}
          disabled={loading}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ping
        </button>
      </div>
    </div>
  );
}
