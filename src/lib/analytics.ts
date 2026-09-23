import { EventName, ProductEvent, FunnelMetric } from "@/types";
import { supabase, isSupabaseConfigured } from "./supabase";

const LOCAL_STORAGE_EVENTS_KEY = "travel_budget_analytics_events";

export async function trackEvent(
  eventName: EventName,
  metadata: Record<string, any> = {},
  userId?: string
): Promise<void> {
  const event: ProductEvent = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId || null,
    event_name: eventName,
    metadata,
    created_at: new Date().toISOString(),
  };

  // Always store locally so that the viva analytics dashboard has immediate live telemetry
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
      const events: ProductEvent[] = stored ? JSON.parse(stored) : [];
      events.push(event);
      localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(events));
    } catch (e) {
      console.warn("Could not save event to localStorage", e);
    }

    // Forward custom event to Google Analytics 4 (GA4) if loaded
    if (typeof (window as any).gtag === "function") {
      try {
        (window as any).gtag("event", eventName, {
          ...metadata,
          user_id: userId,
        });
      } catch (err) {
        console.warn("Could not dispatch event to Google Analytics", err);
      }
    }
  }

  // Also push to Supabase events table if configured
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("events").insert({
        id: event.id,
        user_id: event.user_id,
        event_name: event.event_name,
        metadata: event.metadata,
        created_at: event.created_at,
      });
    } catch (err) {
      console.warn("Error streaming event to Supabase:", err);
    }
  }
}

export function getLocalEvents(): ProductEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export const FUNNEL_STAGES: { name: string; event: EventName; description: string }[] = [
  { name: "1. Signup", event: "signup", description: "Account registered" },
  { name: "2. Trip Created", event: "trip_created", description: "Trip initiated" },
  { name: "3. Budget Calculated", event: "budget_calculated", description: "Engine estimated costs" },
  { name: "4. AI Tip Viewed", event: "ai_recommendation_viewed", description: "Savings assistant opened" },
  { name: "5. Expense Added", event: "expense_added", description: "Real expense logged" },
  { name: "6. Premium Viewed", event: "premium_viewed", description: "Upgrade page inspected" },
  { name: "7. Payment Completed", event: "payment_completed", description: "Subscribed to Premium" },
];

export function computeFunnelMetrics(events: ProductEvent[]): FunnelMetric[] {
  const counts: Record<EventName, number> = {
    signup: 0,
    login: 0,
    dashboard_view: 0,
    trip_created: 0,
    budget_calculated: 0,
    trip_viewed: 0,
    ai_recommendation_viewed: 0,
    expense_added: 0,
    expense_deleted: 0,
    premium_viewed: 0,
    payment_started: 0,
    payment_completed: 0,
    places_customized: 0,
    transport_chain_updated: 0,
    package_compared: 0,
  };

  events.forEach((ev) => {
    if (counts[ev.event_name] !== undefined) {
      counts[ev.event_name]++;
    }
  });

  const baseCount = counts["signup"] || counts["dashboard_view"] || 1;

  return FUNNEL_STAGES.map((stage) => {
    const count = counts[stage.event] || 0;
    const rate = baseCount > 0 ? Math.min(Math.round((count / baseCount) * 100), 100) : 0;
    return {
      stage: stage.name,
      count,
      conversionRate: rate,
    };
  });
}
