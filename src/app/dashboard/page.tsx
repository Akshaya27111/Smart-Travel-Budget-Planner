"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import TripCard from "@/components/TripCard";
import EmptyState from "@/components/EmptyState";
import AiSavingsCard from "@/components/AiSavingsCard";
import {
  Compass,
  Wallet,
  TrendingDown,
  TrendingUp,
  PlusCircle,
  Receipt,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { getTrips, getExpenses, getCurrentUser } from "@/lib/store";
import { trackEvent } from "@/lib/analytics";
import { generateSavingsRecommendations } from "@/lib/ai-assistant";
import { Trip, Expense, Profile, AiRecommendation } from "@/types";
import { formatINR, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [user, setUser] = useState<Profile | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestAiTips, setLatestAiTips] = useState<AiRecommendation[]>([]);

  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        await trackEvent("dashboard_view", {}, currentUser.id);
      }

      const userTrips = await getTrips();
      const userExpenses = await getExpenses();
      setTrips(userTrips);
      setExpenses(userExpenses);

      // If user has trips, generate AI savings tips for the latest trip
      if (userTrips.length > 0) {
        const latestTrip = userTrips[0];
        const breakdown = {
          transportation: latestTrip.estimated_transport,
          accommodation: latestTrip.estimated_accommodation,
          food: latestTrip.estimated_food,
          localTransport: latestTrip.estimated_local_transport,
          activities: latestTrip.estimated_activities,
          miscellaneous: latestTrip.estimated_miscellaneous,
          total: latestTrip.estimated_total,
        };
        const tips = generateSavingsRecommendations(latestTrip, breakdown);
        setLatestAiTips(tips);
      }

      setLoading(false);
    }
    loadData();
  }, []);

  // Compute summary numbers from real data
  const totalTrips = trips.length;
  const totalPlanned = trips.reduce((acc, t) => acc + Number(t.max_budget || 0), 0);
  const totalSpent = expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const remainingBudget = totalPlanned - totalSpent;

  // Compute actual spent per trip
  const spentByTripId: Record<string, number> = {};
  expenses.forEach((e) => {
    spentByTripId[e.trip_id] = (spentByTripId[e.trip_id] || 0) + Number(e.amount);
  });

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      headerTitle={`Welcome back${user?.full_name ? `, ${user.full_name}` : ""}!`}
      headerSubtitle="Here is the financial overview of your planned journeys and actual spending."
      actions={
        <Link
          href="/create-trip"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold shadow-sm shadow-blue-600/25 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Plan a Trip</span>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Trips */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Trips
              </p>
              <h3 className="text-2xl font-bold text-[#0F172A] mt-1">{totalTrips}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {totalTrips === 1 ? "1 active itinerary" : `${totalTrips} active itineraries`}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
          </div>

          {/* Planned Budget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Planned Budget
              </p>
              <h3 className="text-2xl font-bold text-[#0F172A] mt-1">
                {formatINR(totalPlanned)}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Allocated max budget</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          {/* Actual Spending */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actual Spending
              </p>
              <h3 className="text-2xl font-bold text-[#0F172A] mt-1">
                {formatINR(totalSpent)}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Across {expenses.length} logged expense items
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center">
              <Receipt className="w-6 h-6" />
            </div>
          </div>

          {/* Remaining Budget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Remaining Budget
              </p>
              <h3
                className={`text-2xl font-bold mt-1 ${
                  remainingBudget >= 0 ? "text-[#16A34A]" : "text-[#DC2626]"
                }`}
              >
                {formatINR(Math.abs(remainingBudget))}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {remainingBudget >= 0 ? "Buffer available" : "Over budget deficit"}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                remainingBudget >= 0
                  ? "bg-emerald-50 text-[#16A34A]"
                  : "bg-rose-50 text-[#DC2626]"
              }`}
            >
              {remainingBudget >= 0 ? (
                <TrendingDown className="w-6 h-6" />
              ) : (
                <TrendingUp className="w-6 h-6" />
              )}
            </div>
          </div>
        </div>

        {/* If no trips, show clean empty state */}
        {trips.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No trips planned yet"
            description="Start by creating your first trip to estimate transportation, hotel, meals, and receive AI cost-cutting tips."
            actionText="Create Your First Trip"
            actionHref="/create-trip"
          />
        ) : (
          <>
            {/* Planned vs Actual Spend Mini-Comparison Bar Chart */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    Planned Budget vs. Actual Outlay
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live cumulative portfolio comparison across all saved itineraries
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
                    <span className="text-slate-600">Planned ({formatINR(totalPlanned)})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
                    <span className="text-slate-600">Spent ({formatINR(totalSpent)})</span>
                  </div>
                </div>
              </div>

              {/* Visual Multi-bar comparison */}
              <div className="pt-2 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Overall Budget Consumption</span>
                    <span className="font-bold text-slate-800">
                      {totalPlanned > 0
                        ? Math.min(Math.round((totalSpent / totalPlanned) * 100), 999)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        totalSpent > totalPlanned
                          ? "bg-[#DC2626]"
                          : totalSpent > totalPlanned * 0.85
                          ? "bg-[#F59E0B]"
                          : "bg-[#16A34A]"
                      }`}
                      style={{
                        width: `${
                          totalPlanned > 0
                            ? Math.min(Math.round((totalSpent / totalPlanned) * 100), 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendation Card for latest trip */}
            {latestAiTips.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2563EB]" />
                    <span>Latest AI Savings Insight for {trips[0].destination}</span>
                  </h3>
                  <Link
                    href={`/trips/${trips[0].id}`}
                    className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                  >
                    <span>View Trip Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <AiSavingsCard recommendations={latestAiTips.slice(0, 2)} />
              </div>
            )}

            {/* Recent Trips Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Recent Trips</h3>
                  <p className="text-xs text-slate-500">
                    Track and manage your upcoming and ongoing journeys
                  </p>
                </div>
                <Link
                  href="/create-trip"
                  className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  <span>+ Plan Another Trip</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    actualSpent={spentByTripId[trip.id] || 0}
                  />
                ))}
              </div>
            </div>

            {/* Recent Expenses List */}
            {expenses.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">Recent Expenses</h3>
                    <p className="text-xs text-slate-500">
                      Latest receipts and payments recorded across your trips
                    </p>
                  </div>
                  <Link
                    href="/analytics"
                    className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                  >
                    <span>View Expense Analytics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="divide-y divide-slate-100">
                  {expenses.slice(0, 5).map((exp) => (
                    <div
                      key={exp.id}
                      className="py-3 flex items-center justify-between text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                          <Receipt className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{exp.description}</p>
                          <p className="text-[11px] text-slate-400">
                            {exp.category} • {formatDate(exp.expense_date)}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-[#0F172A] font-mono">
                        {formatINR(exp.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
