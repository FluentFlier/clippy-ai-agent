import { Tray, Menu, BrowserWindow, nativeImage } from 'electron';
import path from 'path';

export class TrayManager {
  private tray: Tray | null = null;

  constructor(private mainWindow: BrowserWindow) {
    this.createTray();
  }

  private createTray() {
    const icon = nativeImage.createFromPath(
      path.join(__dirname, '../../resources/icon.png')
    );
    
    this.tray = new Tray(icon.resize({ width: 16, height: 16 }));
    
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Show Clippy', click: () => this.mainWindow.show() },
      { label: 'Hide Clippy', click: () => this.mainWindow.hide() },
      { type: 'separator' },
      { 
        label: 'Settings', 
        click: () => {
          this.mainWindow.webContents.send('open-settings');
        }
      },
      { label: 'Quit', click: () => process.exit(0) }
    ]);
    
    this.tray.setContextMenu(contextMenu);
    this.tray.setToolTip('Clippy Agent');
  }
}
