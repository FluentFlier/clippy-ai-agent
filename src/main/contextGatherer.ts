import activeWin from 'active-win';
import { clipboard, screen, desktopCapturer } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export interface Context {
  activeWindow: string;
  owner: string;
  clipboard?: string;
  recentFiles?: string[];
  screenshot?: string;
}

export class ContextGatherer {
  async getFullContext(): Promise<Context> {
    const context: Context = {
      activeWindow: 'Unknown',
      owner: 'Unknown'
    };

    try {
      // Get active window
      const window = await activeWin();
      if (window) {
        context.activeWindow = window.title;
        context.owner = window.owner.name;
      }

      // Get clipboard content
      context.clipboard = clipboard.readText();

      // Get recent files (if accessible)
      context.recentFiles = await this.getRecentFiles();

    } catch (error) {
      console.error('Error gathering context:', error);
    }

    return context;
  }

  private async getRecentFiles(): Promise<string[]> {
    // This is platform-specific and may require additional permissions
    // For now, return empty array
    return [];
  }

  async captureScreenshot(): Promise<string | null> {
    try {
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: screen.getPrimaryDisplay().workAreaSize
      });

      if (sources.length > 0) {
        return sources[0].thumbnail.toDataURL();
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
    return null;
  }

  getClipboard(): string {
    return clipboard.readText();
  }
}
