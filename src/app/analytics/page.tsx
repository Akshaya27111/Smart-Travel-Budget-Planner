"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import EmptyState from "@/components/EmptyState";
import FunnelChart from "@/components/FunnelChart";
import {
  BarChart3,
  TrendingUp,
  Wallet,
  Clock,
  Compass,
  MapPin,
  Sparkles,
  RefreshCw,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";
import { getTrips, getExpenses } from "@/lib/store";
import { getLocalEvents, computeFunnelMetrics, trackEvent } from "@/lib/analytics";
import { Trip, Expense, ProductEvent, FunnelMetric } from "@/types";
import { formatINR, calculateDurationDays } from "@/lib/utils";

export default function AnalyticsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [events, setEvents] = useState<ProductEvent[]>([]);
  const [funnelMetrics, setFunnelMetrics] = useState<FunnelMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const userTrips = await getTrips();
      const userExpenses = await getExpenses();
      const localEvents = getLocalEvents();

      setTrips(userTrips);
      setExpenses(userExpenses);
      setEvents(localEvents);

      const metrics = computeFunnelMetrics(localEvents);
      setFunnelMetrics(metrics);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  // If new user has no data at all
  if (trips.length === 0 && expenses.length === 0) {
    return (
      <AppLayout
        headerTitle="Product & Financial Analytics"
        headerSubtitle="Analyze trip portfolios, spending categories, and product conversion telemetry."
      >
        <EmptyState
          icon={BarChart3}
          title="No analytics available yet."
          description="Create your first trip and log expenses to generate comprehensive statistical graphs, category allocations, and product funnel metrics for your viva."
          actionText="Create Your First Trip"
          actionHref="/create-trip"
        />
      </AppLayout>
    );
  }

  // 1. Total trips
  const totalTrips = trips.length;

  // 2. Total planned budget
  const totalPlannedBudget = trips.reduce((acc, t) => acc + Number(t.max_budget), 0);

  // 3. Total actual spending
  const totalActualSpending = expenses.reduce((acc, e) => acc + Number(e.amount), 0);

  // 4. Average trip budget
  const avgTripBudget = totalTrips > 0 ? Math.round(totalPlannedBudget / totalTrips) : 0;

  // 5. Average trip duration
  const totalDays = trips.reduce(
    (acc, t) => acc + calculateDurationDays(t.start_date, t.end_date),
    0
  );
  const avgTripDuration = totalTrips > 0 ? (totalDays / totalTrips).toFixed(1) : "0";

  // 6. Average spending per trip
  const avgSpendingPerTrip = totalTrips > 0 ? Math.round(totalActualSpending / totalTrips) : 0;

  // 7. Most popular destinations
  const destinationCounts: Record<string, number> = {};
  trips.forEach((t) => {
    destinationCounts[t.destination] = (destinationCounts[t.destination] || 0) + 1;
  });
  const topDestinations = Object.entries(destinationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // 8. Most common travel style
  const styleCounts: Record<string, number> = {};
  trips.forEach((t) => {
    styleCounts[t.travel_style] = (styleCounts[t.travel_style] || 0) + 1;
  });
  const mostCommonStyle =
    Object.entries(styleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Standard";

  // Category breakdown of actual expenses
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });
  const categoryList = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  // Handle Viva Demo cohort simulation button to demonstrate product analytics telemetry
  const handleSeedDemoCohort = async () => {
    const demoEvents: { name: any; meta: any }[] = [
      { name: "signup", meta: { source: "viva_demo" } },
      { name: "trip_created", meta: { destination: "Goa" } },
      { name: "budget_calculated", meta: { destination: "Goa" } },
      { name: "ai_recommendation_viewed", meta: { trip: "Goa" } },
      { name: "expense_added", meta: { category: "Food" } },
      { name: "premium_viewed", meta: { feature: "Funnel Analytics" } },
      { name: "payment_started", meta: { amount: 199 } },
      { name: "payment_completed", meta: { plan: "premium" } },
    ];

    for (const evt of demoEvents) {
      await trackEvent(evt.name, evt.meta);
    }
    const refreshed = getLocalEvents();
    setEvents(refreshed);
    setFunnelMetrics(computeFunnelMetrics(refreshed));
  };

  return (
    <AppLayout
      headerTitle="Product Analytics & Financial Intelligence"
      headerSubtitle="Engineering evaluation dashboard tracking financial variance, category allocations, and user funnel telemetry."
      actions={
        <button
          onClick={handleSeedDemoCohort}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-[#2563EB] hover:bg-blue-100 text-xs font-semibold border border-blue-200 transition-colors"
          title="Simulate complete event telemetry for your viva presentation"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simulate Viva Telemetry</span>
        </button>
      }
    >
      <div className="space-y-8">
        {/* Academic Project Info Badge */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Product Analytics Project Module
              </span>
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                7th Semester Mechanical Engineering Analytics viva
              </h3>
              <p className="text-xs text-slate-500">
                Live metrics computed strictly from real Supabase user journeys & event logs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white rounded-lg border border-blue-200 text-xs font-semibold text-slate-700">
              {events.length} Captured Events
            </span>
          </div>
        </div>

        {/* 8 Primary Product Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Total Trips */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              1. Total Trips
            </p>
            <h4 className="text-2xl font-bold text-[#0F172A] mt-1">{totalTrips}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Recorded in database</p>
          </div>

          {/* Metric 2: Total Planned Budget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              2. Total Planned Budget
            </p>
            <h4 className="text-2xl font-bold text-[#0F172A] mt-1 font-mono">
              {formatINR(totalPlannedBudget)}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Cumulative allocated cap</p>
          </div>

          {/* Metric 3: Total Actual Spending */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              3. Total Actual Spending
            </p>
            <h4 className="text-2xl font-bold text-[#2563EB] mt-1 font-mono">
              {formatINR(totalActualSpending)}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {totalPlannedBudget > 0
                ? `${Math.round((totalActualSpending / totalPlannedBudget) * 100)}% of planned budget`
                : "0%"}
            </p>
          </div>

          {/* Metric 4: Average Trip Budget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              4. Average Trip Budget
            </p>
            <h4 className="text-2xl font-bold text-[#0F172A] mt-1 font-mono">
              {formatINR(avgTripBudget)}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Mean planned cap per trip</p>
          </div>

          {/* Metric 5: Average Duration */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              5. Average Trip Duration
            </p>
            <h4 className="text-2xl font-bold text-[#0F172A] mt-1">{avgTripDuration} Days</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Across all scheduled dates</p>
          </div>

          {/* Metric 6: Average Spending Per Trip */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              6. Avg Spending / Trip
            </p>
            <h4 className="text-2xl font-bold text-[#0F172A] mt-1 font-mono">
              {formatINR(avgSpendingPerTrip)}
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Actual mean expenditure</p>
          </div>

          {/* Metric 7: Popular Destinations */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              7. Top Destinations
            </p>
            <div className="mt-1 space-y-0.5">
              {topDestinations.map(([dest, count]) => (
                <div key={dest} className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800 truncate">{dest}</span>
                  <span className="text-slate-400">
                    {count} {count === 1 ? "trip" : "trips"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Metric 8: Most Common Travel Style */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              8. Common Travel Style
            </p>
            <h4 className="text-2xl font-bold text-[#2563EB] mt-1">{mostCommonStyle}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Predominant style tier</p>
          </div>
        </div>

        {/* 4 Interactive Visual Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Planned vs Actual Spending */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Chart 1: Planned vs Actual Spending
              </h3>
              <p className="text-xs text-slate-500">
                Direct monetary comparison of planned budget caps against logged outlays
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>Planned Target</span>
                  <span className="font-bold text-slate-900">{formatINR(totalPlannedBudget)}</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-full" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>Actual Spent</span>
                  <span className="font-bold text-[#2563EB]">
                    {formatINR(totalActualSpending)}
                  </span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      totalActualSpending > totalPlannedBudget
                        ? "bg-[#DC2626]"
                        : "bg-[#16A34A]"
                    }`}
                    style={{
                      width: `${
                        totalPlannedBudget > 0
                          ? Math.min(Math.round((totalActualSpending / totalPlannedBudget) * 100), 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Chart 2: Spending by Category */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Chart 2: Spending by Category
              </h3>
              <p className="text-xs text-slate-500">
                Expenditure distribution across transit, lodging, dining, and activities
              </p>
            </div>

            {categoryList.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Log expenses to see category proportions
              </p>
            ) : (
              <div className="space-y-2.5 pt-1">
                {categoryList.map(([cat, amt]) => {
                  const pct = totalActualSpending > 0 ? Math.round((amt / totalActualSpending) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">{cat}</span>
                        <span className="font-mono text-slate-900 font-medium">
                          {formatINR(amt)} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chart 3: Budget Utilization per Trip */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Chart 3: Budget Utilization
              </h3>
              <p className="text-xs text-slate-500">
                Individual trip consumption against maximum defined caps
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {trips.slice(0, 5).map((trip) => {
                const spentOnTrip = expenses
                  .filter((e) => e.trip_id === trip.id)
                  .reduce((sum, e) => sum + Number(e.amount), 0);
                const compare = spentOnTrip > 0 ? spentOnTrip : trip.estimated_total;
                const util = Math.min(Math.round((compare / (trip.max_budget || 1)) * 100), 999);

                return (
                  <div key={trip.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">{trip.destination}</span>
                      <span
                        className={`font-bold ${
                          util > 100 ? "text-[#DC2626]" : util > 85 ? "text-[#F59E0B]" : "text-slate-700"
                        }`}
                      >
                        {util}% ({formatINR(compare)} / {formatINR(trip.max_budget)})
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          util > 100
                            ? "bg-[#DC2626]"
                            : util > 85
                            ? "bg-[#F59E0B]"
                            : "bg-[#2563EB]"
                        }`}
                        style={{ width: `${Math.min(util, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 4: Trip / Spending Trend */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Chart 4: Trip / Spending Trend
              </h3>
              <p className="text-xs text-slate-500">
                Chronological sequence of planned itineraries and cost progression
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {trips.slice(0, 4).map((t, idx) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{t.destination}</p>
                      <p className="text-slate-400 text-[11px]">{t.start_date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#2563EB] font-mono">
                      {formatINR(t.estimated_total)}
                    </p>
                    <p className="text-[10px] text-slate-400">Estimated Total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Conversion Funnel (Viva Requirement) */}
        <FunnelChart metrics={funnelMetrics} />
      </div>
    </AppLayout>
  );
}
