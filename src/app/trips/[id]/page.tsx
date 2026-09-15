"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import BudgetSummaryCard from "@/components/BudgetSummaryCard";
import AiSavingsCard from "@/components/AiSavingsCard";
import PlaceSelector from "@/components/PlanMyWay/PlaceSelector";
import TransportChainCalculator from "@/components/PlanMyWay/TransportChainCalculator";
import SmartTransportComparison from "@/components/SmartTransportComparison";
import BudgetWhatIfOptimizer from "@/components/BudgetWhatIfOptimizer";
import SafetyAwarePlanner from "@/components/SafetyAwarePlanner";
import HiddenCostDetector from "@/components/HiddenCostDetector";
import PackageRecommender from "@/components/PlanMyWay/PackageRecommender";
import PlanItForMeCard from "@/components/PlanMyWay/PlanItForMeCard";
import {
  Calendar,
  Users,
  Receipt,
  ArrowLeft,
  PlusCircle,
  Sparkles,
  Plane,
  Trash2,
  Sliders,
  AlertCircle,
  Compass,
  Train,
  ShieldAlert,
} from "lucide-react";
import { getTripById, getExpenses, deleteTrip, addExpense, updateTrip } from "@/lib/store";
import { trackEvent } from "@/lib/analytics";
import { generateSavingsRecommendations } from "@/lib/ai-assistant";
import {
  Trip,
  Expense,
  ExpenseCategory,
  AiRecommendation,
  TravelPackage,
  IntercityTransportMode,
} from "@/types";
import { formatINR, formatDate, calculateDurationDays } from "@/lib/utils";

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [aiTips, setAiTips] = useState<AiRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab State: 'plan-my-way' | 'optimizer' | 'overview' | 'plan-for-me'
  const [activeTab, setActiveTab] = useState<
    "plan-my-way" | "optimizer" | "overview" | "plan-for-me"
  >("plan-my-way");
  const [selectedPlaceNames, setSelectedPlaceNames] = useState<string[]>([]);

  // Quick Add Expense modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [expDescription, setExpDescription] = useState("");
  const [expCategory, setExpCategory] = useState<ExpenseCategory>("Food");
  const [expAmount, setExpAmount] = useState<number | "">("");
  const [expDate, setExpDate] = useState(new Date().toISOString().split("T")[0]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!tripId) return;
      const foundTrip = await getTripById(tripId);
      if (!foundTrip) {
        setLoading(false);
        return;
      }
      setTrip(foundTrip);

      const tripExpenses = await getExpenses(tripId);
      setExpenses(tripExpenses);

      const breakdown = {
        transportation: foundTrip.estimated_transport,
        accommodation: foundTrip.estimated_accommodation,
        food: foundTrip.estimated_food,
        localTransport: foundTrip.estimated_local_transport,
        activities: foundTrip.estimated_activities,
        miscellaneous: foundTrip.estimated_miscellaneous,
        total: foundTrip.estimated_total,
      };
      const tips = generateSavingsRecommendations(foundTrip, breakdown);
      setAiTips(tips);

      await trackEvent("trip_viewed", { tripId, destination: foundTrip.destination });
      setLoading(false);
    }
    load();
  }, [tripId]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!trip) {
    return (
      <AppLayout>
        <div className="text-center py-16 space-y-4">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Trip Not Found</h2>
          <p className="text-sm text-slate-500">The requested trip could not be retrieved.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const duration = calculateDurationDays(trip.start_date, trip.end_date);
  const actualSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  // 1. Destination Experience & Places Update Handler
  const handleUpdateFromPlaces = async (
    addedActivities: number,
    addedFood: number,
    names: string[]
  ) => {
    setSelectedPlaceNames(names);

    const newActivities = (trip.estimated_activities || 0) + addedActivities;
    const newFood = (trip.estimated_food || 0) + addedFood;
    const newTotal =
      trip.estimated_transport +
      trip.estimated_accommodation +
      newFood +
      trip.estimated_local_transport +
      newActivities +
      trip.estimated_miscellaneous;

    const updated = await updateTrip(trip.id, {
      estimated_activities: newActivities,
      estimated_food: newFood,
      estimated_total: newTotal,
    });

    if (updated) setTrip(updated);
  };

  // 2. Intra-City Local Transport Chain Update Handler
  const handleUpdateTransportBudget = async (newLocalTransitCost: number) => {
    const newTotal =
      trip.estimated_transport +
      trip.estimated_accommodation +
      trip.estimated_food +
      newLocalTransitCost +
      trip.estimated_activities +
      trip.estimated_miscellaneous;

    const updated = await updateTrip(trip.id, {
      estimated_local_transport: newLocalTransitCost,
      estimated_total: newTotal,
    });

    if (updated) setTrip(updated);
  };

  // 3. Smart Intercity Transport (Flight vs Train vs Bus) Selection Handler
  const handleApplyTransportCost = async (mode: IntercityTransportMode, newCost: number) => {
    const newTotal =
      newCost +
      trip.estimated_accommodation +
      trip.estimated_food +
      trip.estimated_local_transport +
      trip.estimated_activities +
      trip.estimated_miscellaneous;

    const updated = await updateTrip(trip.id, {
      transport_preference: mode,
      estimated_transport: newCost,
      estimated_total: newTotal,
    });

    if (updated) setTrip(updated);
  };

  // 4. "What If?" Budget Optimizer Handler
  const handleApplyOptimizedBudget = async (
    newEstimatedTotal: number,
    breakdownUpdates: {
      transport?: number;
      stay?: number;
      activities?: number;
      food?: number;
    }
  ) => {
    const updates: Partial<Trip> = {
      estimated_total: newEstimatedTotal,
    };
    if (breakdownUpdates.transport !== undefined) {
      updates.estimated_transport = breakdownUpdates.transport;
    }
    if (breakdownUpdates.stay !== undefined) {
      updates.estimated_accommodation = breakdownUpdates.stay;
    }
    if (breakdownUpdates.activities !== undefined) {
      updates.estimated_activities = breakdownUpdates.activities;
    }
    if (breakdownUpdates.food !== undefined) {
      updates.estimated_food = breakdownUpdates.food;
    }

    const updated = await updateTrip(trip.id, updates);
    if (updated) setTrip(updated);
  };

  // 5. Safety Safe Transit Buffer Handler
  const handleAddSafetyBuffer = async (extraSafeTransitCost: number) => {
    const newLocalTransit = trip.estimated_local_transport + extraSafeTransitCost;
    const newTotal = trip.estimated_total + extraSafeTransitCost;

    const updated = await updateTrip(trip.id, {
      estimated_local_transport: newLocalTransit,
      estimated_total: newTotal,
    });
    if (updated) setTrip(updated);
  };

  // 6. Hidden Cost Audit Buffer Handler
  const handleAddHiddenCostBuffer = async (additionalAmount: number) => {
    const newMisc = trip.estimated_miscellaneous + additionalAmount;
    const newTotal = trip.estimated_total + additionalAmount;

    const updated = await updateTrip(trip.id, {
      estimated_miscellaneous: newMisc,
      estimated_total: newTotal,
    });
    if (updated) setTrip(updated);
  };

  // 7. Travel Package Adoption Handler
  const handleAdoptPackage = async (pkg: TravelPackage) => {
    const updated = await updateTrip(trip.id, {
      estimated_accommodation: pkg.breakdown.stay,
      estimated_food: pkg.breakdown.food,
      estimated_local_transport: pkg.breakdown.transport,
      estimated_activities: pkg.breakdown.activities,
      estimated_miscellaneous: pkg.breakdown.contingency,
      estimated_total: pkg.totalPrice,
    });

    if (updated) setTrip(updated);
  };

  // Quick Expense Logging
  const handleQuickAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expDescription || !expAmount || Number(expAmount) <= 0) return;

    setModalLoading(true);
    const created = await addExpense({
      trip_id: trip.id,
      description: expDescription,
      category: expCategory,
      amount: Number(expAmount),
      expense_date: expDate,
    });

    if (created) {
      setExpenses([created, ...expenses]);
      setExpDescription("");
      setExpAmount("");
      setShowAddModal(false);
    }
    setModalLoading(false);
  };

  const handleDeleteTrip = async () => {
    if (confirm("Are you sure you want to delete this trip and all its logged expenses?")) {
      await deleteTrip(trip.id);
      router.push("/dashboard");
    }
  };

  return (
    <AppLayout
      headerTitle={trip.destination}
      headerSubtitle={`Trip Route: ${trip.origin} → ${trip.destination}`}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
          <Link
            href={`/trips/${trip.id}/expenses`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all"
          >
            <Receipt className="w-4 h-4 text-blue-600" />
            <span>Manage All Expenses</span>
          </Link>
          <button
            onClick={handleDeleteTrip}
            className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete Trip"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/dashboard" className="hover:text-[#2563EB] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Top Parameters Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded">
              {trip.travel_style} Style
            </span>
            <h2 className="text-2xl font-extrabold text-[#0F172A]">{trip.destination}</h2>
            <p className="text-xs text-slate-500">Starting Point: {trip.origin}</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2563EB]" />
              <div>
                <p className="font-semibold text-slate-900">
                  {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                </p>
                <p className="text-slate-400">{duration} Days duration</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2563EB]" />
              <div>
                <p className="font-semibold text-slate-900">{trip.travelers} Travelers</p>
                <p className="text-slate-400">Group Size</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-[#2563EB]" />
              <div>
                <p className="font-semibold text-slate-900">{trip.transport_preference}</p>
                <p className="text-slate-400">Transit Choice</p>
              </div>
            </div>
          </div>
        </div>

        {/* CORE CONNECTED MODULE TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {/* Tab 1: Plan It My Way */}
          <button
            type="button"
            onClick={() => setActiveTab("plan-my-way")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
              activeTab === "plan-my-way"
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span>🧳 Plan It My Way</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                activeTab === "plan-my-way"
                  ? "bg-white/20 text-white"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              Free
            </span>
          </button>

          {/* Tab 2: What-If Optimizer */}
          <button
            type="button"
            onClick={() => setActiveTab("optimizer")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
              activeTab === "optimizer"
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>💰 What-If Optimizer</span>
          </button>

          {/* Tab 3: Plan It For Me */}
          <button
            type="button"
            onClick={() => setActiveTab("plan-for-me")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
              activeTab === "plan-for-me"
                ? "bg-[#0F172A] text-white shadow-md shadow-slate-900/30"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>🤖 Plan It For Me</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                activeTab === "plan-for-me"
                  ? "bg-amber-400 text-slate-900"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              Premium
            </span>
          </button>

          {/* Tab 4: Overview & Ledger */}
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span>📊 Budget Overview & Ledger</span>
          </button>
        </div>

        {/* TAB 1: PLAN IT MY WAY (FREE TIER) */}
        {activeTab === "plan-my-way" && (
          <div className="space-y-8">
            {/* 1. Destination Experience & Famous Places/Food Picker */}
            <PlaceSelector
              destination={trip.destination}
              travelers={trip.travelers}
              onUpdateBudget={handleUpdateFromPlaces}
              initiallySelected={selectedPlaceNames}
            />

            {/* 2. Intra-City Local Transport Route Calculator */}
            <TransportChainCalculator
              stops={
                selectedPlaceNames.length > 0
                  ? selectedPlaceNames
                  : ["Historic Palace", "Botanical Garden", "Central Market"]
              }
              travelers={trip.travelers}
              onUpdateTransportBudget={handleUpdateTransportBudget}
            />

            {/* 3. Smart Intercity Transport Comparison (Flight vs Train vs Bus) */}
            <SmartTransportComparison
              origin={trip.origin}
              destination={trip.destination}
              travelers={trip.travelers}
              currentTransport={trip.transport_preference}
              onApplyTransportCost={handleApplyTransportCost}
            />

            {/* 4. Hidden Cost Detector */}
            <HiddenCostDetector
              travelers={trip.travelers}
              durationDays={duration}
              transportPreference={trip.transport_preference}
              onAddHiddenCostBuffer={handleAddHiddenCostBuffer}
            />

            {/* 5. Safety-Aware Travel Planning Layer */}
            <SafetyAwarePlanner
              destination={trip.destination}
              travelers={trip.travelers}
              onAddSafetyBuffer={handleAddSafetyBuffer}
            />
          </div>
        )}

        {/* TAB 2: WHAT-IF BUDGET OPTIMIZER */}
        {activeTab === "optimizer" && (
          <div className="space-y-8">
            {/* What If Budget Optimizer Component */}
            <BudgetWhatIfOptimizer
              trip={trip}
              onApplyOptimizedBudget={handleApplyOptimizedBudget}
            />

            {/* Budget Summary Card */}
            <BudgetSummaryCard
              maxBudget={trip.max_budget}
              estimatedCost={trip.estimated_total}
              actualSpent={actualSpent}
            />

            {/* AI Travel Savings Recommendations */}
            {aiTips.length > 0 && <AiSavingsCard recommendations={aiTips} />}
          </div>
        )}

        {/* TAB 3: PLAN IT FOR ME (PREMIUM AI TIER) */}
        {activeTab === "plan-for-me" && (
          <div className="space-y-8">
            {/* 1-Click AI Trip Plan Generator */}
            <PlanItForMeCard
              destination={trip.destination}
              durationDays={duration}
              maxBudget={trip.max_budget}
            />

            {/* Travel Package Recommendation Engine */}
            <PackageRecommender
              destination={trip.destination}
              travelers={trip.travelers}
              customTripCost={trip.estimated_total}
              onAdoptPackage={handleAdoptPackage}
            />
          </div>
        )}

        {/* TAB 4: BUDGET OVERVIEW & EXPENSE LEDGER */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Budget Comparison Evaluation */}
            <BudgetSummaryCard
              maxBudget={trip.max_budget}
              estimatedCost={trip.estimated_total}
              actualSpent={actualSpent}
            />

            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Category Breakdown</h3>
                  <p className="text-xs text-slate-500">
                    Itemized estimates vs actual receipts logged
                  </p>
                </div>
                <Link
                  href={`/trips/${trip.id}/expenses`}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  Open Expense Ledger ({expenses.length} items) →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: "Transportation",
                    estimated: trip.estimated_transport,
                    category: "Transportation",
                    pref: trip.transport_preference,
                  },
                  {
                    title: "Accommodation",
                    estimated: trip.estimated_accommodation,
                    category: "Accommodation",
                    pref: trip.accommodation_preference,
                  },
                  {
                    title: "Food & Dining",
                    estimated: trip.estimated_food,
                    category: "Food",
                    pref: trip.food_preference,
                  },
                  {
                    title: "Local Transport",
                    estimated: trip.estimated_local_transport,
                    category: "Local Transport",
                    pref: "Transit Chain",
                  },
                  {
                    title: "Activities & Tours",
                    estimated: trip.estimated_activities,
                    category: "Activities",
                    pref: trip.activity_preference,
                  },
                  {
                    title: "Miscellaneous",
                    estimated: trip.estimated_miscellaneous,
                    category: "Miscellaneous",
                    pref: "Safety Buffer",
                  },
                ].map((cat) => {
                  const catSpent = expenses
                    .filter((e) => e.category === cat.category)
                    .reduce((sum, e) => sum + Number(e.amount), 0);

                  return (
                    <div
                      key={cat.title}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700">{cat.title}</span>
                        <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {cat.pref}
                        </span>
                      </div>

                      <div className="flex justify-between items-baseline pt-1">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-medium">Estimated</p>
                          <p className="text-base font-bold text-slate-900 font-mono">
                            {formatINR(cat.estimated)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 uppercase font-medium">Actual Spent</p>
                          <p className="text-base font-bold text-[#2563EB] font-mono">
                            {formatINR(catSpent)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Travel Savings Recommendations */}
            {aiTips.length > 0 && <AiSavingsCard recommendations={aiTips} />}
          </div>
        )}

        {/* Quick Add Expense Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-[#0F172A]">Add New Trip Expense</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleQuickAddExpense} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flight ticket, Beach resort room, Seafood dinner"
                    value={expDescription}
                    onChange={(e) => setExpDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      value={expCategory}
                      onChange={(e) => setExpCategory(e.target.value as ExpenseCategory)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
                    >
                      <option value="Transportation">Transportation</option>
                      <option value="Accommodation">Accommodation</option>
                      <option value="Food">Food & Dining</option>
                      <option value="Local Transport">Local Transport</option>
                      <option value="Activities">Activities</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Miscellaneous">Miscellaneous</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Amount (₹) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="e.g. 1500"
                      value={expAmount}
                      onChange={(e) =>
                        setExpAmount(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="px-4 py-2 text-xs font-semibold bg-[#2563EB] text-white hover:bg-blue-700 rounded-xl shadow-sm"
                  >
                    {modalLoading ? "Saving..." : "Record Expense"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
