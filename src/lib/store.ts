import { Trip, Expense, Profile, Subscription } from "@/types";
import { supabase, isSupabaseConfigured } from "./supabase";
import { trackEvent } from "./analytics";

const STORAGE_KEYS = {
  USER: "travel_budget_user",
  TRIPS: "travel_budget_trips",
  EXPENSES: "travel_budget_expenses",
  SUBSCRIPTION: "travel_budget_subscription",
};

// Default empty structures
const defaultUser: Profile = {
  id: "demo-user-123",
  full_name: "Demo Traveler",
  email: "demo@travelbudget.com",
  created_at: new Date().toISOString(),
};

export async function getCurrentUser(): Promise<Profile | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) return profile;

      return {
        id: user.id,
        full_name: user.user_metadata?.full_name || "Traveler",
        email: user.email || "",
        created_at: user.created_at,
      };
    } catch {
      // Fallback
    }
  }

  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEYS.USER);
  return stored ? JSON.parse(stored) : null;
}

export async function loginUser(email: string, pass: string): Promise<{ user: Profile | null; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    if (error) return { user: null, error: error.message };

    const profile = await getCurrentUser();
    await trackEvent("login", { email }, data.user?.id);
    return { user: profile };
  }

  // Demo fallback
  const user: Profile = {
    id: "user_" + btoa(email).slice(0, 10),
    full_name: email.split("@")[0].replace(".", " ").toUpperCase(),
    email,
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  await trackEvent("login", { email }, user.id);
  return { user };
}

export async function signupUser(
  fullName: string,
  email: string,
  pass: string
): Promise<{ user: Profile | null; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) return { user: null, error: error.message };

    const profile: Profile = {
      id: data.user!.id,
      full_name: fullName,
      email: data.user!.email || email,
      created_at: new Date().toISOString(),
    };
    await trackEvent("signup", { email }, profile.id);
    return { user: profile };
  }

  // Demo fallback
  const user: Profile = {
    id: "user_" + btoa(email).slice(0, 10),
    full_name: fullName,
    email,
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  await trackEvent("signup", { email }, user.id);
  return { user };
}

export async function logoutUser(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

export async function updateProfile(fullName: string): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  user.full_name = fullName;

  if (isSupabaseConfigured && supabase) {
    await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }
  return user;
}

// -------------------------------------------------------------
// TRIPS DATA STORE
// -------------------------------------------------------------

export async function getTrips(): Promise<Trip[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    return (data as Trip[]) || [];
  }

  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.TRIPS);
  const all: Trip[] = stored ? JSON.parse(stored) : [];
  return all.filter((t) => t.user_id === user.id);
}

export async function getTripById(id: string): Promise<Trip | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();
    return (data as Trip) || null;
  }

  const trips = await getTrips();
  return trips.find((t) => t.id === id) || null;
}

export async function saveTrip(tripData: Omit<Trip, "id" | "user_id" | "created_at">): Promise<Trip | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const newTrip: Trip = {
    ...tripData,
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `trip_${Date.now()}`,
    user_id: user.id,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("trips").insert(newTrip).select().single();
    if (!error && data) {
      await trackEvent("trip_created", { tripId: data.id, destination: data.destination }, user.id);
      return data as Trip;
    }
  }

  // Local fallback
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEYS.TRIPS);
    const trips: Trip[] = stored ? JSON.parse(stored) : [];
    trips.unshift(newTrip);
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
  }

  await trackEvent("trip_created", { tripId: newTrip.id, destination: newTrip.destination }, user.id);
  return newTrip;
}

export async function deleteTrip(tripId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  if (isSupabaseConfigured && supabase) {
    await supabase.from("expenses").delete().eq("trip_id", tripId);
    await supabase.from("trips").delete().eq("id", tripId);
    return true;
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEYS.TRIPS);
    const trips: Trip[] = stored ? JSON.parse(stored) : [];
    const filtered = trips.filter((t) => t.id !== tripId);
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(filtered));

    // delete expenses
    const expStored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    const expenses: Expense[] = expStored ? JSON.parse(expStored) : [];
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses.filter((e) => e.trip_id !== tripId)));
  }
  return true;
}

// -------------------------------------------------------------
// EXPENSES DATA STORE
// -------------------------------------------------------------

export async function getExpenses(tripId?: string): Promise<Expense[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  if (isSupabaseConfigured && supabase) {
    let query = supabase.from("expenses").select("*").eq("user_id", user.id);
    if (tripId) query = query.eq("trip_id", tripId);
    const { data } = await query.order("expense_date", { ascending: false });
    return (data as Expense[]) || [];
  }

  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
  const expenses: Expense[] = stored ? JSON.parse(stored) : [];
  return expenses.filter((e) => e.user_id === user.id && (!tripId || e.trip_id === tripId));
}

export async function addExpense(
  expenseData: Omit<Expense, "id" | "user_id" | "created_at">
): Promise<Expense | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const newExpense: Expense = {
    ...expenseData,
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `exp_${Date.now()}`,
    user_id: user.id,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("expenses").insert(newExpense).select().single();
    if (!error && data) {
      await trackEvent("expense_added", { amount: data.amount, category: data.category }, user.id);
      return data as Expense;
    }
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    const list: Expense[] = stored ? JSON.parse(stored) : [];
    list.unshift(newExpense);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(list));
  }

  await trackEvent("expense_added", { amount: newExpense.amount, category: newExpense.category }, user.id);
  return newExpense;
}

export async function updateExpense(
  id: string,
  updatedFields: Partial<Omit<Expense, "id" | "user_id" | "trip_id" | "created_at">>
): Promise<Expense | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("expenses")
      .update(updatedFields)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();
    return (data as Expense) || null;
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    const list: Expense[] = stored ? JSON.parse(stored) : [];
    const index = list.findIndex((e) => e.id === id && e.user_id === user.id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields, updated_at: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(list));
      return list[index];
    }
  }
  return null;
}

export async function deleteExpense(id: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  if (isSupabaseConfigured && supabase) {
    await supabase.from("expenses").delete().eq("id", id).eq("user_id", user.id);
    await trackEvent("expense_deleted", { expenseId: id }, user.id);
    return true;
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    const list: Expense[] = stored ? JSON.parse(stored) : [];
    const filtered = list.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filtered));
  }

  await trackEvent("expense_deleted", { expenseId: id }, user.id);
  return true;
}

// -------------------------------------------------------------
// SUBSCRIPTIONS
// -------------------------------------------------------------

export async function getSubscription(): Promise<Subscription> {
  const user = await getCurrentUser();
  const defaultSub: Subscription = {
    id: "sub_free",
    user_id: user?.id || "",
    plan: "free",
    status: "active",
    started_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  if (!user) return defaultSub;

  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (data) return data as Subscription;
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (stored) {
      const sub: Subscription = JSON.parse(stored);
      if (sub.user_id === user.id) return sub;
    }
  }

  return defaultSub;
}

export async function activateSubscription(
  plan: "premium",
  paymentRef: string
): Promise<Subscription> {
  const user = await getCurrentUser();
  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + 1);

  const sub: Subscription = {
    id: `sub_${Date.now()}`,
    user_id: user?.id || "demo-user",
    plan,
    status: "active",
    payment_reference: paymentRef,
    started_at: new Date().toISOString(),
    expires_at: expiry.toISOString(),
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase && user) {
    await supabase
      .from("subscriptions")
      .upsert({
        user_id: user.id,
        plan,
        status: "active",
        payment_reference: paymentRef,
        started_at: sub.started_at,
        expires_at: sub.expires_at,
      });
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
  }

  await trackEvent("payment_completed", { plan, paymentRef }, user?.id);
  return sub;
}
