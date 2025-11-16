export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'email' | 'document' | 'task' | 'custom';
  prompt: string;
  icon: string;
}

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'weekly_report',
    name: 'Weekly Report',
    description: 'Generate a weekly status report',
    category: 'document',
    icon: '📊',
    prompt: 'Create a weekly status report summarizing the work done this week, key achievements, and next steps.'
  },
  {
    id: 'meeting_notes',
    name: 'Meeting Notes',
    description: 'Summarize meeting discussion',
    category: 'document',
    icon: '📝',
    prompt: 'Create structured meeting notes with: attendees, key discussion points, decisions made, and action items.'
  },
  {
    id: 'follow_up_email',
    name: 'Follow-up Email',
    description: 'Draft a follow-up email',
    category: 'email',
    icon: '📧',
    prompt: 'Draft a professional follow-up email checking on the status of a previous conversation or request.'
  },
  {
    id: 'thank_you_email',
    name: 'Thank You Email',
    description: 'Send appreciation',
    category: 'email',
    icon: '💌',
    prompt: 'Draft a warm thank you email expressing appreciation for help or collaboration.'
  },
  {
    id: 'project_plan',
    name: 'Project Plan',
    description: 'Create project outline',
    category: 'document',
    icon: '🎯',
    prompt: 'Create a project plan with: objectives, timeline, milestones, resources needed, and success criteria.'
  },
  {
    id: 'bug_report',
    name: 'Bug Report',
    description: 'Document a bug',
    category: 'document',
    icon: '🐛',
    prompt: 'Create a detailed bug report with: description, steps to reproduce, expected vs actual behavior, and environment details.'
  },
  {
    id: 'daily_standup',
    name: 'Daily Standup',
    description: 'Standup update',
    category: 'task',
    icon: '☀️',
    prompt: 'Create a daily standup update: what I did yesterday, what I\'m doing today, any blockers.'
  },
  {
    id: 'code_review',
    name: 'Code Review',
    description: 'Review code changes',
    category: 'document',
    icon: '👀',
    prompt: 'Provide a code review focusing on: functionality, code quality, potential issues, and suggestions for improvement.'
  }
];

export class TemplateManager {
  private templates: Template[] = [...DEFAULT_TEMPLATES];
  private customTemplates: Template[] = [];

  getTemplates(): Template[] {
    return [...this.templates, ...this.customTemplates];
  }

  getTemplatesByCategory(category: string): Template[] {
    return this.getTemplates().filter(t => t.category === category);
  }

  getTemplate(id: string): Template | undefined {
    return this.getTemplates().find(t => t.id === id);
  }

  addCustomTemplate(template: Omit<Template, 'id'>): Template {
    const newTemplate: Template = {
      ...template,
      id: `custom_${Date.now()}`
    };
    this.customTemplates.push(newTemplate);
    return newTemplate;
  }

  deleteCustomTemplate(id: string): boolean {
    const index = this.customTemplates.findIndex(t => t.id === id);
    if (index !== -1) {
      this.customTemplates.splice(index, 1);
      return true;
    }
    return false;
  }

  async executeTemplate(templateId: string, context: any): Promise<string> {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Combine template prompt with context
    const fullPrompt = `${template.prompt}\n\nContext: ${JSON.stringify(context)}`;
    return fullPrompt;
  }
}
