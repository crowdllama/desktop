/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { spawn, ChildProcess } from 'child_process';
import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

// === IPC SOCKET CONFIGURATION ===
// The Electron app will create a Unix domain socket at this path for Go backend IPC.
// Update your Go backend to listen on this socket:
//   os.Getenv("CROWDLLAMA_SOCKET")
// Example: /tmp/crowdllama.sock
const CROWDLLAMA_SOCKET_PATH = '/tmp/crowdllama.sock';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let goBackendProcess: ChildProcess | null = null;
let pingInterval: ReturnType<typeof setInterval> | null = null;
let ipcClient: any = null;
let ipcClientBuffer = '';

// Connect to Go backend IPC socket (persistent connection)
const connectIPC = () => {
  if (ipcClient) {
    return; // Already connected
  }
  const net = require('net');
  ipcClient = new net.Socket();
  ipcClient.setEncoding('utf8');

  ipcClient.connect(CROWDLLAMA_SOCKET_PATH, () => {
    console.log('🟢 [MAIN] Connected to Go backend socket (persistent)');
  });

    ipcClient.on('data', (data: string) => {
    console.log('🔵 [MAIN] Raw data received from backend:', data);
    console.log('🔵 [MAIN] Data length:', data.length);
    console.log('🔵 [MAIN] Data type:', typeof data);
    console.log('🔵 [MAIN] Buffer before adding:', ipcClientBuffer);
    ipcClientBuffer += data;
    console.log('🔵 [MAIN] Buffer after adding:', ipcClientBuffer);
    console.log('🔵 [MAIN] Buffer length:', ipcClientBuffer.length);

    // Try to parse the entire buffer as a single JSON message first
    if (ipcClientBuffer.trim()) {
      try {
        const parsed = JSON.parse(ipcClientBuffer.trim());
        console.log('🔵 [MAIN] Parsed single JSON message from backend:', parsed);

        // Route incoming messages to renderer process
        if (mainWindow && !mainWindow.isDestroyed()) {
          console.log('🔵 [MAIN] Forwarding to renderer:', parsed);
          mainWindow.webContents.send('backend-message', parsed);
        } else {
          console.log('🔴 [MAIN] Main window not available for forwarding');
        }

        // Clear the buffer after successful parsing
        ipcClientBuffer = '';
        console.log('🔵 [MAIN] Cleared buffer after parsing');
        return;
      } catch (err) {
        console.log('🔵 [MAIN] Not a single JSON message, trying newline-delimited parsing');
      }
    }

    // Fallback to newline-delimited parsing
    let index;
    while ((index = ipcClientBuffer.indexOf('\n')) !== -1) {
      console.log('🔵 [MAIN] Found newline at index:', index);
      const message = ipcClientBuffer.slice(0, index);
      ipcClientBuffer = ipcClientBuffer.slice(index + 1);
      console.log('🔵 [MAIN] Processing message chunk:', message);
      console.log('🔵 [MAIN] Message chunk length:', message.length);
      console.log('🔵 [MAIN] Message chunk trimmed:', message.trim());
      console.log('🔵 [MAIN] Remaining buffer:', ipcClientBuffer);

      if (message.trim()) {
        try {
          const parsed = JSON.parse(message);
          console.log('🔵 [MAIN] Parsed message from backend:', parsed);

          // Route incoming messages to renderer process
          if (mainWindow && !mainWindow.isDestroyed()) {
            console.log('🔵 [MAIN] Forwarding to renderer:', parsed);
            mainWindow.webContents.send('backend-message', parsed);
          } else {
            console.log('🔴 [MAIN] Main window not available for forwarding');
          }
        } catch (err) {
          console.log('🔴 [MAIN] Failed to parse backend message:', message, err);
        }
      } else {
        console.log('🔵 [MAIN] Empty message chunk, skipping');
      }
    }
  });

  ipcClient.on('error', (err: any) => {
    console.log('🔴 [MAIN] IPC socket error:', err.message);
    // Optionally, try to reconnect or clean up
    ipcClient = null;
  });

  ipcClient.on('close', () => {
    console.log('🔴 [MAIN] IPC socket closed');
    ipcClient = null;
  });
};

// Send a message over the persistent IPC connection
const sendIPCMessage = (msg: object) => {
  if (ipcClient && !ipcClient.destroyed) {
    console.log('🟡 [MAIN] Sending to backend:', msg);
    ipcClient.write(JSON.stringify(msg) + '\n');
  } else {
    console.log('🔴 [MAIN] IPC client not connected, cannot send message');
  }
};

// Send ping to Go backend via persistent socket
const pingBackend = async () => {
  try {
    if (!ipcClient || ipcClient.destroyed) {
      console.log('IPC client not connected, reconnecting...');
      connectIPC();
      // Wait a moment for connection
      setTimeout(() => sendIPCMessage({ type: 'ping', timestamp: Date.now() }), 200);
      return;
    }
    sendIPCMessage({ type: 'ping', timestamp: Date.now() });
  } catch (error) {
    console.error('Error sending ping:', error);
  }
};

// Start ping interval
const startPingInterval = () => {
  // Clear any existing interval
  if (pingInterval) {
    clearInterval(pingInterval);
  }

  // Start new ping interval (every 1 minute = 60000ms)
  pingInterval = setInterval(pingBackend, 60000);
  console.log('Started ping interval (every 1 minute)');

  // Send initial ping immediately
  pingBackend();
};

// Start Go backend process
const startGoBackend = () => {
  try {
    const goBackendPath = '/Users/matias/go/src/github.com/crowdllama/crowdllama';
    const goBackendCommand = '/opt/homebrew/bin/go';
    const goBackendArgs = ['run', 'cmd/crowdllama/main.go', 'start'];

    // Remove the socket file if it exists
    try {
      if (fs.existsSync(CROWDLLAMA_SOCKET_PATH)) {
        fs.unlinkSync(CROWDLLAMA_SOCKET_PATH);
      }
    } catch (err) {
      console.error('Error removing old socket file:', err);
    }

    console.log('Starting Go backend process...');
    console.log(`Command: ${goBackendCommand} ${goBackendArgs.join(' ')}`);
    console.log(`Working directory: ${goBackendPath}`);
    console.log(`Socket path: ${CROWDLLAMA_SOCKET_PATH}`);

    goBackendProcess = spawn(goBackendCommand, goBackendArgs, {
      cwd: goBackendPath,
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: false,
      env: {
        ...process.env,
        CROWDLLAMA_SOCKET: CROWDLLAMA_SOCKET_PATH,
      },
    });

    goBackendProcess.stdout?.on('data', (data) => {
      console.log('Go backend stdout:', data.toString());
    });

    goBackendProcess.stderr?.on('data', (data) => {
      console.log('Go backend stderr:', data.toString());
    });

    goBackendProcess.on('error', (error) => {
      console.error('Failed to start Go backend process:', error);
    });

    goBackendProcess.on('close', (code) => {
      console.log(`Go backend process exited with code ${code}`);
      goBackendProcess = null;
      // Clean up IPC client
      if (ipcClient) {
        ipcClient.destroy();
        ipcClient = null;
      }
    });

    console.log('Go backend process started successfully');

    // Start ping interval after a short delay to allow backend to initialize
    setTimeout(() => {
      connectIPC();
      startPingInterval();
    }, 2000);
  } catch (error) {
    console.error('Error starting Go backend process:', error);
  }
};

// Stop Go backend process
const stopGoBackend = () => {
  if (goBackendProcess) {
    console.log('Stopping Go backend process...');
    goBackendProcess.kill('SIGTERM');
    goBackendProcess = null;
  }

  // Stop ping interval
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
  if (ipcClient) {
    ipcClient.destroy();
    ipcClient = null;
  }
};

// IPC handlers
ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.handle('start-backend', async () => {
  try {
    startGoBackend();
    return { success: true, message: 'Go backend started successfully' };
  } catch (error) {
    console.error('Error starting backend:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

ipcMain.handle('stop-backend', async () => {
  try {
    stopGoBackend();
    return { success: true, message: 'Go backend stopped successfully' };
  } catch (error) {
    console.error('Error stopping backend:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

ipcMain.handle('get-backend-status', async () => {
  return {
    isRunning: goBackendProcess !== null,
    pid: goBackendProcess && typeof goBackendProcess.pid === 'number' ? goBackendProcess.pid : null,
  };
});

ipcMain.handle('ping-backend', async () => {
  try {
    await pingBackend();
    return { success: true, message: 'Ping sent successfully' };
  } catch (error) {
    console.error('Error pinging backend:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

// New IPC handlers for initialize and prompt messages
ipcMain.handle('initialize-backend', async (event, mode: 'worker' | 'consumer') => {
  console.log('🟡 [MAIN] Received initialize-backend request:', { mode });
  try {
    sendIPCMessage({ type: 'initialize', mode });
    console.log('🟡 [MAIN] Initialize message sent successfully');
    return { success: true, message: 'Initialize message sent successfully' };
  } catch (error) {
    console.error('🔴 [MAIN] Error sending initialize message:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

ipcMain.handle('send-prompt', async (event, prompt: string, model: string) => {
  console.log('🟡 [MAIN] Received send-prompt request:', { prompt, model });
  try {
    sendIPCMessage({ type: 'prompt', prompt, model });
    console.log('🟡 [MAIN] Prompt message sent successfully');
    return { success: true, message: 'Prompt sent successfully' };
  } catch (error) {
    console.error('🔴 [MAIN] Error sending prompt:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug').default();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1229, // 20% wider than original 1024
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Stop Go backend process when app closes
  stopGoBackend();
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Ensure Go backend is stopped before quitting
  stopGoBackend();
});

app
  .whenReady()
  .then(() => {
    createWindow();
    // Start Go backend process when app is ready
    startGoBackend();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
