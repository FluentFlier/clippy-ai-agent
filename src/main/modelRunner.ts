import path from 'path';
import { getCharacterPrompt } from '../agents/characters';

export class ModelRunner {
  private session: any = null;
  private isInitialized = false;
  private currentCharacter: string = 'clippy';
  private useOpenAI = false;
  private openaiApiKey: string | undefined;

  async initialize() {
    // Check for OpenAI API key
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (this.openaiApiKey) {
      console.log('✓ OpenAI API key found - using GPT-3.5');
      this.useOpenAI = true;
      this.isInitialized = true;
      return;
    }

    try {
      // Try to load local model
      const { LlamaModel, LlamaContext, LlamaChatSession } = await import('node-llama-cpp');
      const modelPath = path.join(process.cwd(), 'models', 'llama-2-7b-chat.gguf');
      
      const model = new LlamaModel({ modelPath });
      const context = new LlamaContext({ model });
      this.session = new LlamaChatSession({ context });
      
      this.isInitialized = true;
      console.log('✓ Local LLM initialized');
    } catch (error) {
      console.warn('⚠ No AI backend available - using demo mode');
      this.isInitialized = false;
    }
  }

  setCharacter(characterId: string) {
    this.currentCharacter = characterId;
  }

  async chat(prompt: string): Promise<string> {
    const characterPrompt = getCharacterPrompt(this.currentCharacter, prompt);
    
    // Try OpenAI first
    if (this.useOpenAI && this.openaiApiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.openaiApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: characterPrompt },
              { role: 'user', content: prompt }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        });

        const data = await response.json();
        return data.choices[0]?.message?.content || 'Error: No response';
      } catch (error) {
        console.error('OpenAI error:', error);
        // Fall through to mock
      }
    }

    // Try local model
    if (this.isInitialized && this.session) {
      try {
        const response = await this.session.prompt(characterPrompt);
        return response;
      } catch (error) {
        console.error('Local model error:', error);
      }
    }

    // Demo mode - intelligent mock responses
    return this.generateDemoResponse(prompt);
  }

  private generateDemoResponse(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    // Summarize responses
    if (lowerPrompt.includes('summarize')) {
      return `📄 **Document Summary**

Based on your recent work, here are the key points:

• You've been working on multiple documents related to the Kirowween hackathon
• Main focus areas include AI agent development and Windows 98 retro styling
• Key technologies: Electron, React, TypeScript, and AI integration

**Recommendations:**
- Consider consolidating related documents
- Create a project roadmap for remaining tasks
- Document your progress for the demo

Would you like me to help organize these into a structured format?`;
    }
    
    // Email responses
    if (lowerPrompt.includes('email')) {
      return `✉️ **Email Draft**

Subject: Kirowween Hackathon Project Update

Hi Team,

I wanted to share an exciting update on our Clippy AI Agent project for the Kirowween hackathon!

**What we've built:**
- Retro Windows 98 styled AI assistant
- Multi-agent system with specialized capabilities
- Real-time document monitoring and assistance

**Current status:**
- Core features implemented ✓
- UI/UX polished ✓
- Ready for demo presentation ✓

Looking forward to showcasing this at the event!

Best regards,
[Your name]

---
*Would you like me to adjust the tone or add more details?*`;
    }
    
    // Organize responses
    if (lowerPrompt.includes('organize')) {
      return `📋 **Task Organization**

**High Priority:**
1. ✓ Complete core AI integration
2. ✓ Polish Windows 98 UI styling
3. ⏳ Prepare demo presentation
4. ⏳ Create README documentation

**Medium Priority:**
- Test all features end-to-end
- Add keyboard shortcuts
- Record demo video

**Low Priority:**
- Add sound effects
- Create additional templates
- Implement advanced monitoring

**Next Steps:**
Focus on the demo preparation and documentation to ensure a smooth presentation!`;
    }
    
    // Default helpful response
    return `👋 Hi! I'm Clippy, your AI assistant!

I can help you with:
• **Summarizing** documents and work
• **Drafting** emails and messages  
• **Organizing** tasks and priorities
• **Quick templates** for common tasks

Just click on any option in my menu to get started!

*Tip: This is demo mode. Add an OPENAI_API_KEY environment variable for full AI capabilities.*`;
  }
}
