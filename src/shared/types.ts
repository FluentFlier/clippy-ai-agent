export interface MessageBusEvent {
  type: 'user.activity' | 'agent.request' | 'agent.complete';
  payload: any;
  timestamp: number;
}

export interface ActivityEvent {
  windowCount: number;
  activeWindow: string;
  documentCount: number;
  emailThreadLength?: number;
}

export interface AgentRequest {
  agentName: string;
  action: string;
  context: any;
}

export interface AgentResponse {
  agentName: string;
  result: string;
  metadata?: any;
}

export interface Persona {
  name: string;
  role: string;
  capabilities: string[];
  prompt: string;
}
