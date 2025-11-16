import { ModelRunner } from '../../main/modelRunner';
import persona from './persona.json';

export class PowerPupAgent {
  constructor(private modelRunner: ModelRunner) {}

  async handle(action: string, context: any): Promise<string> {
    if (action === 'organize' || action === 'track_task') {
      const prompt = `${persona.prompt}

Current Context:
- Active Window: ${context.tasks?.activeWindow || 'Unknown'}
- Application: ${context.tasks?.owner || 'Unknown'}

Task: Create an organized task list based on the work shown. Break it down into actionable steps with priorities.`;

      const response = await this.modelRunner.chat(prompt);
      return response;
    }
    return 'No action taken';
  }
}
