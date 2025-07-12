// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'ipc-example'
  | 'start-backend'
  | 'stop-backend'
  | 'get-backend-status'
  | 'ping-backend'
  | 'initialize-backend'
  | 'send-prompt'
  | 'backend-message';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  backend: {
    async startBackend() {
      return ipcRenderer.invoke('start-backend');
    },
    async stopBackend() {
      return ipcRenderer.invoke('stop-backend');
    },
    async getBackendStatus() {
      return ipcRenderer.invoke('get-backend-status');
    },
    async pingBackend() {
      return ipcRenderer.invoke('ping-backend');
    },
    async initializeBackend(mode: 'worker' | 'consumer') {
      return ipcRenderer.invoke('initialize-backend', mode);
    },
    async sendPrompt(prompt: string, model: string) {
      return ipcRenderer.invoke('send-prompt', prompt, model);
    },
    onBackendMessage(callback: (message: any) => void) {
      const subscription = (_event: IpcRendererEvent, message: any) => callback(message);
      ipcRenderer.on('backend-message', subscription);

      return () => {
        ipcRenderer.removeListener('backend-message', subscription);
      };
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
