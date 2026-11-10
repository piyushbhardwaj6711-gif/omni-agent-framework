import type {
  AgentResponse,
  Conversation,
  DashboardData,
  Lead,
  LeadScoreBreakdown,
  NextBestAction,
  Property,
} from './types';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
      '/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error');
      throw new Error(
        `API Error ${response.status}: ${response.statusText} — ${errorBody}`,
      );
    }

    return response.json() as Promise<T>;
  }

  async startConversation(): Promise<{
    conversation_id: string;
    welcome_message: string;
  }> {
    return this.request('/chat/start', { method: 'POST' });
  }

  async sendMessage(
    conversationId: string,
    content: string,
  ): Promise<AgentResponse> {
    const res = await this.request<any>(`/chat/${conversationId}/message`, {
      method: 'POST',
      body: JSON.stringify({ message: content, content }),
    });

    // Handle nested or top-level message format
    if (res.agent_response && !res.message) {
      return {
        message: res.agent_response.message,
        properties: res.agent_response.properties || [],
        actions_taken: res.agent_response.actions_taken || [],
        suggestions: res.agent_response.suggestions || [],
        lead_update: res.agent_response.lead_update,
        metadata: res.agent_response.metadata || {},
      };
    }

    return res as AgentResponse;
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    return this.request(`/chat/${conversationId}`);
  }

  async getLeads(): Promise<Lead[]> {
    return this.request('/leads');
  }

  async getLead(
    leadId: string,
  ): Promise<{
    lead: Lead;
    score_breakdown: LeadScoreBreakdown;
    next_actions: NextBestAction[];
  }> {
    return this.request(`/leads/${leadId}`);
  }

  async searchProperties(
    params: Record<string, string | number>,
  ): Promise<Property[]> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    return this.request(`/properties?${searchParams.toString()}`);
  }

  async getDashboard(): Promise<DashboardData> {
    return this.request('/dashboard');
  }
}

export const api = new ApiClient();
