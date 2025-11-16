import { ModelRunner } from '../../main/modelRunner';
import persona from './persona.json';

export class WillAgent {
  constructor(private modelRunner: ModelRunner) {}

  async handle(action: string, context: any): Promise<string> {
    if (action === 'draft_email') {
      const prompt = `${persona.prompt}

Current Context:
- Active Window: ${context.context?.activeWindow || 'Unknown'}
- Application: ${context.context?.owner || 'Unknown'}

Task: Draft a professional email related to the work shown in the window title. Include a subject line, greeting, body, and closing.`;

      const draft = await this.modelRunner.chat(prompt);
      return draft;
    }
    return 'No action taken';
  }
}
