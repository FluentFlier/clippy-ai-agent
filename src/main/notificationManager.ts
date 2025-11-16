import { Notification, BrowserWindow } from 'electron';

export class NotificationManager {
  constructor(private mainWindow: BrowserWindow) {}

  show(title: string, body: string, onClick?: () => void) {
    const notification = new Notification({
      title,
      body,
      icon: undefined, // Add icon path if you have one
      silent: false
    });

    if (onClick) {
      notification.on('click', onClick);
    }

    notification.show();
  }

  showClippyAlert(message: string, action?: string) {
    this.show('📎 Clippy', message, () => {
      this.mainWindow.show();
      if (action) {
        this.mainWindow.webContents.send('trigger-action', action);
      }
    });
  }

  showIdleAlert() {
    this.showClippyAlert(
      "You've been idle for a while. Need help organizing your work?",
      'organize'
    );
  }

  showDocumentAlert(count: number) {
    this.showClippyAlert(
      `You've opened ${count} documents. Would you like a summary?`,
      'summarize'
    );
  }
}
