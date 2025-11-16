import { ModelRunner } from './modelRunner';

export interface AIProvider {
  chat(prompt: string): Promise<string>;
}

export class OpenAIProvider implements AIProvider {
  constructor(private apiKey: string) {}

  async chat(prompt: string): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI error:', error);
      throw error;
    }
  }
}

export class AnthropicProvider implements AIProvider {
  constructor(private apiKey: string) {}

  async chat(prompt: string): Promise<string> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 500,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Anthropic error:', error);
      throw error;
    }
  }
}

export class AIManager {
  private providers: Map<string, AIProvider> = new Map();
  private currentProvider: string = 'local';

  constructor(private localModel: ModelRunner) {
    this.providers.set('local', localModel);
  }

  setOpenAI(apiKey: string) {
    this.providers.set('openai', new OpenAIProvider(apiKey));
  }

  setAnthropic(apiKey: string) {
    this.providers.set('anthropic', new AnthropicProvider(apiKey));
  }

  setProvider(name: string) {
    if (this.providers.has(name)) {
      this.currentProvider = name;
    }
  }

  async chat(prompt: string): Promise<string> {
    const provider = this.providers.get(this.currentProvider);
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    try {
      return await provider.chat(prompt);
    } catch (error) {
      // Fallback to local if cloud fails
      if (this.currentProvider !== 'local' && this.providers.has('local')) {
        console.log('Falling back to local model');
        return await this.providers.get('local')!.chat(prompt);
      }
      throw error;
    }
  }
}
