export interface Property {
  id: string;
  project_id: string;
  name: string;
  developer: string;
  address: {
    area: string;
    city: string;
  };
  bhk: number;
  area_sqft: number;
  price_lakhs: number;
  price_per_sqft: number;
  floor: number;
  total_floors: number;
  amenities: string[];
  status: string;
  rera_id: string;
  description: string;
  possession_date: string;
}

export interface Lead {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  status: string;
  temperature: string;
  requirements: string;
  budget_min: number;
  budget_max: number;
  preferred_locations: string[];
  bhk_preference: number;
  financing_needed: boolean;
  score: number;
  conversion_probability: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface LeadScoreBreakdown {
  budget_fit: number;
  location_match: number;
  urgency: number;
  engagement: number;
  financing_readiness: number;
  overall: number;
}

export interface NextBestAction {
  action: string;
  priority: string;
  reason: string;
  deadline: string | null;
}

export interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Conversation {
  id: string;
  messages: Message[];
  created_at: string;
  status: string;
}

export interface AgentResponse {
  message: string;
  properties?: Property[];
  lead_update?: Partial<Lead>;
  actions_taken?: string[];
  suggestions?: string[];
  metadata?: Record<string, unknown>;
}

export interface DashboardData {
  total_leads: number;
  hot_leads: number;
  warm_leads: number;
  cold_leads: number;
  recent_activities: ActivityItem[];
  top_leads: Lead[];
  next_actions: NextBestAction[];
}

export interface SiteVisit {
  id: string;
  lead_id: string;
  property_id: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}
