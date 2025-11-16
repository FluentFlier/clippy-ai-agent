import activeWin from 'active-win';
import { messageBus } from '../shared/messageBus';
import { ActivityEvent } from '../shared/types';

export class SystemMonitor {
  private documentWindows: Set<string> = new Set();
  private lastCheckTime: number = Date.now();
  private monitorInterval: NodeJS.Timeout | null = null;

  start() {
    this.monitorInterval = setInterval(() => this.checkActivity(), 5000);
  }

  stop() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
  }

  private async checkActivity() {
    try {
      const window = await activeWin();
      if (!window) return;

      const isDocument = this.isDocumentWindow(window.title, window.owner.name);
      
      if (isDocument) {
        this.documentWindows.add(window.title);
      }

      const now = Date.now();
      const timeDiff = (now - this.lastCheckTime) / 1000 / 60; // minutes

      if (this.documentWindows.size >= 5 && timeDiff <= 10) {
        this.triggerClippyPrompt();
      }

      const event: ActivityEvent = {
        windowCount: this.documentWindows.size,
        activeWindow: window.title,
        documentCount: this.documentWindows.size
      };

      messageBus.publish({
        type: 'user.activity',
        payload: event,
        timestamp: now
      });
    } catch (error) {
      console.error('Error monitoring activity:', error);
    }
  }

  private isDocumentWindow(title: string, owner: string): boolean {
    const docApps = ['Word', 'Excel', 'PowerPoint', 'Notepad', 'Code', 'Chrome', 'Firefox'];
    return docApps.some(app => owner.includes(app));
  }

  private triggerClippyPrompt() {
    messageBus.publish({
      type: 'agent.request',
      payload: {
        agentName: 'clippy',
        action: 'offer_summary',
        context: { documentCount: this.documentWindows.size }
      },
      timestamp: Date.now()
    });
    
    // Track analytics
    try {
      const { DatabaseManager } = require('./database');
      const db = new DatabaseManager();
      db.trackEvent('document_opened', {
        count: this.documentWindows.size,
        windows: Array.from(this.documentWindows)
      });
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }
    
    this.documentWindows.clear();
    this.lastCheckTime = Date.now();
  }
}
