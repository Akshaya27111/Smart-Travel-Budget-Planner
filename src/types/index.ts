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
  is_trial?: boolean;
  renewal_amount?: number;
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
  | 'payment_completed'
  | 'places_customized'
  | 'transport_chain_updated'
  | 'package_compared';

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

// ==========================================
// "Plan It My Way" & Travel Decision Types
// ==========================================

export type TripType = 'Solo' | 'Couple' | 'Friends' | 'Family' | 'Group';

export interface PlaceItem {
  id: string;
  name: string;
  category: 'Heritage' | 'Nature' | 'Culture' | 'Shopping' | 'Entertainment' | 'Viewpoint';
  estimatedCost: number;
  durationHours: number;
  rating: number;
  description: string;
  isFamous?: boolean;
  area?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  estimatedCost: number;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack / Drink';
  isFamous?: boolean;
  description: string;
}

export interface CityData {
  cityName: string;
  state: string;
  tagline: string;
  famousPlaces: PlaceItem[];
  famousFoods: FoodItem[];
  localExperiences: string[];
}

export type TransportMode = 'Metro' | 'Bus' | 'Auto' | 'Bike' | 'Cab' | 'Walk';

export interface ModeOption {
  mode: TransportMode;
  cost: number;
  durationMins: number;
  recommended?: boolean;
  savingsNote?: string;
}

export interface TransportHop {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  selectedMode: TransportMode;
  options: ModeOption[];
}

export interface TransportChain {
  hops: TransportHop[];
  totalCost: number;
  totalDistanceKm: number;
  groupAdvice?: string;
  groupSavings?: number;
}

export interface TravelPackage {
  id: string;
  name: string;
  tag: string;
  tripType: TripType;
  duration: string;
  totalPrice: number;
  perPersonPrice?: number;
  comfortRating: number;
  highlights: string[];
  breakdown: {
    stay: number;
    food: number;
    transport: number;
    activities: number;
    contingency: number;
  };
}

export interface PackageComparison {
  customPlanCost: number;
  recommendedPackage: TravelPackage;
  difference: number;
  isPackageCheaper: boolean;
  savingsMessage: string;
}

// ==========================================
// 1. Smart Transport Comparison Types
// ==========================================

export type IntercityTransportMode = 'Flight' | 'Train' | 'Bus';

export interface TransportComparisonOption {
  mode: IntercityTransportMode;
  icon: string;
  name: string;
  ticketPerPerson: number;
  totalTicket: number;
  durationHours: number;
  baggageCost: number;
  hotelTransferCost: number;
  overallCost: number;
  costPerPerson: number;
  isBestValue: boolean;
  savingsComparedToFlight: number;
  tradeoffSummary: string;
}

export interface TransportComparisonResult {
  origin: string;
  destination: string;
  travelers: number;
  options: TransportComparisonOption[];
  bestValueMode: IntercityTransportMode;
  maxSavings: number;
}

// ==========================================
// 2. "What If?" Budget Optimizer Types
// ==========================================

export interface OptimizationLever {
  id: string;
  category: 'Transportation' | 'Accommodation' | 'Activities' | 'Food';
  title: string;
  changeFrom: string;
  changeTo: string;
  savings: number;
  explanation: string;
  impactLevel: 'High' | 'Medium' | 'Low';
}

export interface WhatIfPlan {
  originalCost: number;
  maxBudget: number;
  overBudgetAmount: number;
  levers: OptimizationLever[];
  totalPotentialSavings: number;
  combinedOptimizedTotal: number;
  willBeWithinBudget: boolean;
}

// ==========================================
// 3. Safety-Aware Travel Planning Types
// ==========================================

export interface SafetyAdvisory {
  id: string;
  level: 'info' | 'warning' | 'alert';
  title: string;
  message: string;
  suggestedAction: string;
  estimatedExtraCost?: number;
  appliesTo: string;
}

export interface SafetyCheckResult {
  safetyRating: number;
  nightTravelFlag: boolean;
  advisories: SafetyAdvisory[];
  emergencyContacts: { service: string; number: string }[];
  safeNeighborhoodTips: string[];
}

// ==========================================
// 4. Hidden Cost Detector Types
// ==========================================

export interface HiddenCostItem {
  id: string;
  name: string;
  category: string;
  estimatedCost: number;
  whyNeeded: string;
  likelihood: 'High' | 'Medium' | 'Low';
}

export interface HiddenCostAudit {
  overlookedItems: HiddenCostItem[];
  totalOverlookedCost: number;
  auditMessage: string;
}

