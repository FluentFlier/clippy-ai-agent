import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    x: width - 450,
    y: height - 450,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, '../preload/index.js')
    }
  });

  // In dev mode, load from dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
  
  mainWindow.setIgnoreMouseEvents(false);
}

app.whenReady().then(async () => {
  createWindow();
  
  // Lazy load heavy modules
  const { TrayManager } = await import('./trayManager');
  const { ModelRunner } = await import('./modelRunner');
  const { AgentOrchestrator } = await import('./agentOrchestrator');
  const { SystemMonitor } = await import('./systemMonitor');
  const { SettingsManager } = await import('./settingsManager');
  const { messageBus } = await import('../shared/messageBus');
  const { globalShortcut } = await import('electron');
  
  const settingsManager = new SettingsManager();
  const trayManager = new TrayManager(mainWindow!);
  const modelRunner = new ModelRunner();
  await modelRunner.initialize();
  
  const orchestrator = new AgentOrchestrator(modelRunner);
  const systemMonitor = new SystemMonitor();
  
  // Initialize notification manager
  const { NotificationManager } = await import('./notificationManager');
  const notificationManager = new NotificationManager(mainWindow!);
  
  // Apply settings
  const settings = settingsManager.getSettings();
  if (settings.monitoringEnabled) {
    systemMonitor.start();
  }
  
  // Register global hotkey
  try {
    globalShortcut.register(settings.hotkey, () => {
      if (mainWindow) {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
        }
      }
    });
  } catch (error) {
    console.error('Failed to register hotkey:', error);
  }
  
  // Idle detection
  let idleTimer: NodeJS.Timeout;
  const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      notificationManager.showIdleAlert();
    }, 5 * 60 * 1000); // 5 minutes
  };
  
  // Track user activity
  mainWindow.webContents.on('did-finish-load', resetIdleTimer);
  resetIdleTimer();
  
  // Enable dragging
  ipcMain.on('set-position', (event, x: number, y: number) => {
    if (mainWindow) {
      mainWindow.setPosition(Math.round(x), Math.round(y));
    }
  });
  
  ipcMain.on('move-window', (event, deltaX: number, deltaY: number) => {
    if (mainWindow) {
      const [currentX, currentY] = mainWindow.getPosition();
      mainWindow.setPosition(
        Math.round(currentX + deltaX),
        Math.round(currentY + deltaY)
      );
    }
  });
  
  // Listen for summary requests from renderer
  ipcMain.on('request-summary', async () => {
    console.log('Summary requested by user');
    messageBus.publish({
      type: 'agent.request',
      payload: {
        agentName: 'merlin',
        action: 'summarize',
        context: { source: 'user_request' }
      },
      timestamp: Date.now()
    });
  });
  
  // Listen for agent action requests
  ipcMain.on('agent-action', async (event, action: string) => {
    console.log('Agent action requested:', action);
    
    const { DatabaseManager } = await import('./database');
    const db = new DatabaseManager();
    
    let result = '';
    const context = await getFullContext();
    
    if (action === 'summarize') {
      const merlin = orchestrator.getAgent('merlin');
      result = await merlin.handle('summarize', {
        documents: context,
        timestamp: Date.now()
      });
      db.trackEvent('summary_generated', { context });
    } else if (action === 'draft_email') {
      const will = orchestrator.getAgent('will');
      result = await will.handle('draft_email', {
        context,
        timestamp: Date.now()
      });
      db.trackEvent('email_drafted', { context });
    } else if (action === 'organize') {
      const powerPup = orchestrator.getAgent('powerpup');
      result = await powerPup.handle('organize', {
        tasks: context,
        timestamp: Date.now()
      });
      db.trackEvent('tasks_organized', { context });
    }
    
    // Save to history
    db.addHistory({
      action,
      prompt: JSON.stringify(context),
      result,
      timestamp: Date.now()
    });
    
    // Send response back to renderer
    if (mainWindow) {
      mainWindow.webContents.send('agent-response', {
        action,
        result,
        timestamp: Date.now()
      });
    }
  });
  
  // Settings handlers
  ipcMain.on('get-settings', (event) => {
    const { SettingsManager } = require('./settingsManager');
    const settingsManager = new SettingsManager();
    event.reply('settings-data', settingsManager.getSettings());
  });

  ipcMain.on('save-settings', (event, newSettings) => {
    const { SettingsManager } = require('./settingsManager');
    const settingsManager = new SettingsManager();
    settingsManager.setSettings(newSettings);
    
    // Apply settings immediately
    if (newSettings.monitoringEnabled) {
      systemMonitor.start();
    } else {
      systemMonitor.stop();
    }
    
    // Update hotkey
    const { globalShortcut } = require('electron');
    globalShortcut.unregisterAll();
    try {
      globalShortcut.register(newSettings.hotkey, () => {
        if (mainWindow) {
          if (mainWindow.isVisible()) {
            mainWindow.hide();
          } else {
            mainWindow.show();
          }
        }
      });
    } catch (error) {
      console.error('Failed to register hotkey:', error);
    }
  });

  // Listen for open settings from tray
  ipcMain.on('open-settings', () => {
    if (mainWindow) {
      mainWindow.webContents.send('open-settings');
    }
  });

  // Hide Clippy
  ipcMain.on('hide-clippy', () => {
    if (mainWindow) {
      mainWindow.hide();
    }
  });

  // Quit app completely
  ipcMain.on('quit-app', () => {
    app.quit();
  });

  // Template handlers
  ipcMain.on('get-templates', async (event) => {
    const { TemplateManager } = await import('./templateManager');
    const templateManager = new TemplateManager();
    event.reply('templates-data', templateManager.getTemplates());
  });

  ipcMain.on('execute-template', async (event, templateId: string) => {
    const { TemplateManager } = await import('./templateManager');
    const templateManager = new TemplateManager();
    const context = await getFullContext();
    
    const prompt = await templateManager.executeTemplate(templateId, context);
    
    // Use AI to generate result
    const result = await modelRunner.chat(prompt);
    event.reply('template-result', result);
  });

  // Voice command handler
  ipcMain.on('process-voice-command', async (event, text: string) => {
    console.log('Processing voice command:', text);
    
    const context = await getFullContext();
    const prompt = `User said: "${text}"\n\nContext: ${JSON.stringify(context)}\n\nRespond helpfully to their request.`;
    
    const result = await modelRunner.chat(prompt);
    event.reply('voice-command-result', result);
  });

  // Character selection
  ipcMain.on('set-character', (event, characterId: string) => {
    settingsManager.setSetting('currentCharacter', characterId as any);
  });

  ipcMain.on('get-character', (event) => {
    const character = settingsManager.getSetting('currentCharacter' as any) || 'clippy';
    event.reply('character-data', character);
  });

  // History handlers
  ipcMain.on('get-history', async (event) => {
    const { DatabaseManager } = await import('./database');
    const db = new DatabaseManager();
    event.reply('history-data', db.getHistory());
  });

  ipcMain.on('search-history', async (event, query: string) => {
    const { DatabaseManager } = await import('./database');
    const db = new DatabaseManager();
    event.reply('history-search-results', db.searchHistory(query));
  });

  ipcMain.on('delete-history', async (event, id: number) => {
    const { DatabaseManager } = await import('./database');
    const db = new DatabaseManager();
    db.deleteHistory(id);
  });

  ipcMain.on('clear-history', async () => {
    const { DatabaseManager } = await import('./database');
    const db = new DatabaseManager();
    db.clearHistory();
  });

  // Analytics handlers
  ipcMain.on('get-analytics', async (event) => {
    const { DatabaseManager } = await import('./database');
    const db = new DatabaseManager();
    event.reply('analytics-data', db.getAnalytics(7));
  });

  // Helper to get full context
  async function getFullContext() {
    const { ContextGatherer } = await import('./contextGatherer');
    const gatherer = new ContextGatherer();
    return await gatherer.getFullContext();
  }

  // Helper to get open documents (legacy)
  async function getOpenDocuments() {
    const activeWin = (await import('active-win')).default;
    try {
      const window = await activeWin();
      return {
        activeWindow: window?.title || 'Unknown',
        owner: window?.owner?.name || 'Unknown'
      };
    } catch (error) {
      return { activeWindow: 'Unknown', owner: 'Unknown' };
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
