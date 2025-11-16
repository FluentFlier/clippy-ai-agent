import { messageBus } from '../shared/messageBus';
import { ModelRunner } from './modelRunner';
import { ClippyAgent } from '../agents/clippy/brain';
import { MerlinAgent } from '../agents/merlin/brain';

import { WillAgent } from '../agents/will/brain';
import { PowerPupAgent } from '../agents/powerpup/brain';

export class AgentOrchestrator {
  private clippy: ClippyAgent;
  private merlin: MerlinAgent;
  private will: WillAgent;
  private powerPup: PowerPupAgent;

  constructor(private modelRunner: ModelRunner) {
    this.clippy = new ClippyAgent(modelRunner);
    this.merlin = new MerlinAgent(modelRunner);
    this.will = new WillAgent(modelRunner);
    this.powerPup = new PowerPupAgent(modelRunner);
    
    this.setupListeners();
  }

  getAgent(name: string) {
    if (name === 'clippy') return this.clippy;
    if (name === 'merlin') return this.merlin;
    if (name === 'will') return this.will;
    if (name === 'powerpup') return this.powerPup;
    throw new Error(`Unknown agent: ${name}`);
  }

  private setupListeners() {
    messageBus.subscribe('agent.request', async (event) => {
      const { agentName, action, context } = event.payload;
      
      if (agentName === 'clippy') {
        await this.clippy.handle(action, context);
      } else if (agentName === 'merlin') {
        await this.merlin.handle(action, context);
      } else if (agentName === 'will') {
        await this.will.handle(action, context);
      } else if (agentName === 'powerpup') {
        await this.powerPup.handle(action, context);
      }
    });
  }
}
