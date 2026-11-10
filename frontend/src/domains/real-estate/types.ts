export type {
  Property,
  Lead,
  LeadScoreBreakdown,
  NextBestAction,
  Message,
  Conversation,
  AgentResponse,
  DashboardData,
  SiteVisit,
  ActivityItem,
} from '../../services/types';

export interface PriceDisplay {
  lakhs: number;
  formatted: string;
  perSqft: string;
}
