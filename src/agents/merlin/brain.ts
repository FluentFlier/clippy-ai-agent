import { ModelRunner } from '../../main/modelRunner';
import persona from './persona.json';

export class MerlinAgent {
  constructor(private modelRunner: ModelRunner) {}

  async handle(action: string, context: any): Promise<string> {
    if (action === 'summarize') {
      const prompt = `${persona.prompt}

Current Context:
- Active Window: ${context.documents?.activeWindow || 'Unknown'}
- Application: ${context.documents?.owner || 'Unknown'}

Task: Create a brief summary of what the user is working on based on the window title and application.`;

      const summary = await this.modelRunner.chat(prompt);
      return summary;
    }
    return 'No action taken';
  }
}
