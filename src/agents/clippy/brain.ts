import { ModelRunner } from '../../main/modelRunner';
import { messageBus } from '../../shared/messageBus';
import { BrowserWindow } from 'electron';
import persona from './persona.json';

export class ClippyAgent {
  constructor(private modelRunner: ModelRunner) {}

  async handle(action: string, context: any) {
    if (action === 'offer_summary') {
      const prompt = `${persona.prompt}\n\nThe user has opened ${context.documentCount} documents. Offer to help summarize their work.`;
      
      // Send to renderer to show dialog
      const mainWindow = BrowserWindow.getAllWindows()[0];
      if (mainWindow) {
        mainWindow.webContents.send('agent-event', {
          action: 'show_dialog',
          result: `I noticed you've opened ${context.documentCount} documents. Would you like me to summarize what you're working on?`
        });
      }
      
      messageBus.publish({
        type: 'agent.complete',
        payload: {
          agentName: 'clippy',
          result: 'Dialog shown',
          action: 'show_dialog'
        },
        timestamp: Date.now()
      });
    }
  }
}
