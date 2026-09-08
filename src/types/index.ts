export type TravelStyle = 'Budget' | 'Standard' | 'Premium';
export type TransportPreference = 'Flight' | 'Train' | 'Bus' | 'Car' | 'Other';
export type AccommodationPreference = 'Budget' | 'Standard' | 'Premium';
export type FoodPreference = 'Budget' | 'Standard' | 'Premium';
export type ActivityPreference = 'Low' | 'Medium' | 'High';

export type ExpenseCategory =
  | 'Transportation'
  | 'Accommodation'
  | 'Food'
  | 'Local Transport'
  | 'Activities'
  | 'Shopping'
  | 'Miscellaneous';

export interface BudgetBreakdown {
  transportation: number;
  accommodation: number;
  food: number;
  localTransport: number;
  activities: number;
  miscellaneous: number;
  total: number;
}

export interface Trip {
  id: string;
  user_id: string;
  origin: string;
  destination: string;
  start_date: string;
  end_date: string;
  travelers: number;
  travel_style: TravelStyle;
  max_budget: number;
  transport_preference: TransportPreference;
  accommodation_preference: AccommodationPreference;
  food_preference: FoodPreference;
  activity_preference: ActivityPreference;
  estimated_transport: number;
  estimated_accommodation: number;
  estimated_food: number;
  estimated_local_transport: number;
  estimated_activities: number;
  estimated_miscellaneous: number;
  estimated_total: number;
  created_at: string;
  updated_at?: string;
}

export interface Expense {
  id: string;
  user_id: string;
  trip_id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  expense_date: string;
  created_at: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'premium';
  status: 'active' | 'expired' | 'canceled';
  payment_reference?: string;
  started_at: string;
  expires_at?: string;
  created_at: string;
}

export type EventName =
  | 'signup'
  | 'login'
  | 'dashboard_view'
  | 'trip_created'
  | 'budget_calculated'
  | 'trip_viewed'
  | 'ai_recommendation_viewed'
  | 'expense_added'
  | 'expense_deleted'
  | 'premium_viewed'
  | 'payment_started'
  | 'payment_completed';

export interface ProductEvent {
  id: string;
  user_id?: string | null;
  event_name: EventName;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface AiRecommendation {
  id: string;
  category: 'Transportation' | 'Accommodation' | 'Food' | 'Activities' | 'General';
  title: string;
  tip: string;
  whyItSaves: string;
  estimatedSavings: number;
  source: 'AI-powered recommendation' | 'Smart fallback recommendation';
}

export interface FunnelMetric {
  stage: string;
  count: number;
  conversionRate: number;
}
