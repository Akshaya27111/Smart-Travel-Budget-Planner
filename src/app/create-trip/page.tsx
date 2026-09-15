"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import BudgetSummaryCard from "@/components/BudgetSummaryCard";
import AiSavingsCard from "@/components/AiSavingsCard";
import SmartTransportComparison from "@/components/SmartTransportComparison";
import HiddenCostDetector from "@/components/HiddenCostDetector";
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  Sparkles,
  Plane,
  Building2,
  Utensils,
  Compass,
  ArrowRight,
  AlertCircle,
  Save,
  CheckCircle2,
} from "lucide-react";
import {
  estimateTripBudget,
  BudgetCalculationResult,
} from "@/lib/budget-engine";
import { generateSavingsRecommendations } from "@/lib/ai-assistant";
import { saveTrip } from "@/lib/store";
import { trackEvent } from "@/lib/analytics";
import {
  TravelStyle,
  TransportPreference,
  AccommodationPreference,
  FoodPreference,
  ActivityPreference,
  AiRecommendation,
} from "@/types";
import { calculateDurationDays, formatINR } from "@/lib/utils";

export default function CreateTripPage() {
  const router = useRouter();

  // Form State
  const [origin, setOrigin] = useState("Mumbai");
  const [destination, setDestination] = useState("Goa");
  const [startDate, setStartDate] = useState("2026-10-15");
  const [endDate, setEndDate] = useState("2026-10-19");
  const [travelers, setTravelers] = useState(2);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>("Standard");
  const [maxBudget, setMaxBudget] = useState(25000);
  const [transportPreference, setTransportPreference] = useState<TransportPreference>("Flight");
  const [accommodationPreference, setAccommodationPreference] = useState<AccommodationPreference>("Standard");
  const [foodPreference, setFoodPreference] = useState<FoodPreference>("Standard");
  const [activityPreference, setActivityPreference] = useState<ActivityPreference>("Medium");

  // Output State
  const [calculationResult, setCalculationResult] = useState<BudgetCalculationResult | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<AiRecommendation[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Auto-calculated duration
  const durationDays = calculateDurationDays(startDate, endDate);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validations
    if (!destination.trim()) {
      setErrorMessage("Destination is required.");
      return;
    }
    if (!startDate || !endDate) {
      setErrorMessage("Both start date and end date are required.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setErrorMessage("End date cannot be earlier than start date.");
      return;
    }
    if (travelers < 1) {
      setErrorMessage("Number of travelers must be at least 1.");
      return;
    }
    if (maxBudget <= 0) {
      setErrorMessage("Maximum budget must be greater than ₹0.");
      return;
    }

    setIsCalculating(true);

    try {
      const result = estimateTripBudget({
        origin,
        destination,
        startDate,
        endDate,
        durationDays,
        travelers,
        travelStyle,
        transportPreference,
        accommodationPreference,
        foodPreference,
        activityPreference,
        maxBudget,
      });

      setCalculationResult(result);

      // Generate AI Recommendations
      const tips = generateSavingsRecommendations(
        {
          origin,
          destination,
          travelers,
          travel_style: travelStyle,
          transport_preference: transportPreference,
          accommodation_preference: accommodationPreference,
          food_preference: foodPreference,
          activity_preference: activityPreference,
        },
        result.breakdown
      );
      setAiRecommendations(tips);

      await trackEvent("budget_calculated", {
        origin,
        destination,
        totalEstimated: result.totalEstimated,
        maxBudget,
        isWithinBudget: result.isWithinBudget,
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Calculation failed.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!calculationResult) return;
    setIsSaving(true);
    setErrorMessage("");

    try {
      const newTrip = await saveTrip({
        origin,
        destination,
        start_date: startDate,
        end_date: endDate,
        travelers,
        travel_style: travelStyle,
        max_budget: maxBudget,
        transport_preference: transportPreference,
        accommodation_preference: accommodationPreference,
        food_preference: foodPreference,
        activity_preference: activityPreference,
        estimated_transport: calculationResult.breakdown.transportation,
        estimated_accommodation: calculationResult.breakdown.accommodation,
        estimated_food: calculationResult.breakdown.food,
        estimated_local_transport: calculationResult.breakdown.localTransport,
        estimated_activities: calculationResult.breakdown.activities,
        estimated_miscellaneous: calculationResult.breakdown.miscellaneous,
        estimated_total: calculationResult.totalEstimated,
      });

      if (newTrip) {
        setSaveSuccess(true);
        setTimeout(() => {
          router.push(`/trips/${newTrip.id}`);
        }, 800);
      } else {
        setErrorMessage("Failed to save trip to database.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error saving trip.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout
      headerTitle="Plan a New Trip"
      headerSubtitle="Enter your destination and preferences to compute an explainable budget with AI cost-saving intelligence."
    >
      <div className="space-y-8">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-sm text-rose-800">
            <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Validation Error</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Trip Planning Form */}
        <form onSubmit={handleCalculate} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-[#0F172A]">Trip Parameters</h2>
            <p className="text-xs text-slate-500">Provide itinerary details to calibrate algorithmic estimates.</p>
          </div>

          {/* Row 1: Origin & Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Starting Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Mumbai, Delhi, Bangalore"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Destination *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#2563EB] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Goa, Manali, Kerala, Jaipur"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Dates, Duration & Travelers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                End Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-blue-600 font-medium mt-1">
                Duration: {durationDays} {durationDays === 1 ? "day" : "days"} (auto-calculated)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Number of Travelers *
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={travelers}
                  onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Travel Style & Max Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Travel Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Budget", "Standard", "Premium"] as TravelStyle[]).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setTravelStyle(style)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      travelStyle === style
                        ? "bg-blue-50 border-[#2563EB] text-[#2563EB] shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Maximum Budget (INR) *
              </label>
              <div className="relative">
                <span className="text-sm font-bold text-slate-500 absolute left-3.5 top-2.5">₹</span>
                <input
                  type="number"
                  min="500"
                  step="500"
                  required
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(parseInt(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Your spending target cap</p>
            </div>
          </div>

          {/* Row 4: Preferences Preferences (Transport, Hotel, Food, Activity) */}
          <div className="pt-2 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Trip Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Transport Pref */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <Plane className="w-3.5 h-3.5 text-blue-600" />
                  <span>Transportation</span>
                </label>
                <select
                  value={transportPreference}
                  onChange={(e) => setTransportPreference(e.target.value as TransportPreference)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
                >
                  <option value="Flight">Flight</option>
                  <option value="Train">Train</option>
                  <option value="Bus">Bus</option>
                  <option value="Car">Car / Rental</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Accommodation Pref */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Accommodation</span>
                </label>
                <select
                  value={accommodationPreference}
                  onChange={(e) => setAccommodationPreference(e.target.value as AccommodationPreference)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
                >
                  <option value="Budget">Budget (Hostels / Guesthouses)</option>
                  <option value="Standard">Standard (3-Star / Boutique)</option>
                  <option value="Premium">Premium (4-5 Star Resorts)</option>
                </select>
              </div>

              {/* Food Pref */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5 text-blue-600" />
                  <span>Food & Dining</span>
                </label>
                <select
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value as FoodPreference)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
                >
                  <option value="Budget">Budget (Street Food & Cafes)</option>
                  <option value="Standard">Standard (Local Casual Dining)</option>
                  <option value="Premium">Premium (Fine Dining)</option>
                </select>
              </div>

              {/* Activity Pref */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  <span>Activities</span>
                </label>
                <select
                  value={activityPreference}
                  onChange={(e) => setActivityPreference(e.target.value as ActivityPreference)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
                >
                  <option value="Low">Low (Free walking & relax)</option>
                  <option value="Medium">Medium (Guided sights & passes)</option>
                  <option value="High">High (Adventures & excursions)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isCalculating}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              {isCalculating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Calculating Estimates...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Calculate My Budget</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Calculation Results Section */}
        {calculationResult && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header with Save Trip CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-md">
                  Calculated Itinerary
                </span>
                <h3 className="text-xl font-bold text-[#0F172A] mt-1.5">
                  {destination} ({durationDays} Days, {travelers} Travelers)
                </h3>
                <p className="text-xs text-slate-500">
                  Route: {origin} → {destination} • Style: {travelStyle}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveTrip}
                  disabled={isSaving || saveSuccess}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm shadow-md transition-all ${
                    saveSuccess
                      ? "bg-[#16A34A] shadow-emerald-500/20"
                      : "bg-[#2563EB] hover:bg-blue-700 shadow-blue-500/20"
                  } disabled:opacity-75`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving to Trips...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Trip Saved! Redirecting...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Trip</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Within / Over Budget Summary Card */}
            <BudgetSummaryCard
              maxBudget={calculationResult.maxBudget}
              estimatedCost={calculationResult.totalEstimated}
            />

            {/* Itemized Category Breakdown Grid */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-[#0F172A]">
                  Itemized Category Cost Breakdown
                </h3>
                <p className="text-xs text-slate-500">
                  Calculated transparently using regional cost models and group proportions
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase tracking-wider">Transportation</span>
                    <span className="text-[11px] text-blue-600">{transportPreference}</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900 mt-1 font-mono">
                    {formatINR(calculationResult.breakdown.transportation)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Round trip for {travelers} traveler(s)</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase tracking-wider">Accommodation</span>
                    <span className="text-[11px] text-blue-600">{accommodationPreference}</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900 mt-1 font-mono">
                    {formatINR(calculationResult.breakdown.accommodation)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {Math.ceil(travelers / 2)} room(s) for {Math.max(durationDays - 1, 1)} night(s)
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase tracking-wider">Food & Dining</span>
                    <span className="text-[11px] text-blue-600">{foodPreference}</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900 mt-1 font-mono">
                    {formatINR(calculationResult.breakdown.food)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">3 meals/day for {durationDays} days</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase tracking-wider">Local Transport</span>
                    <span className="text-[11px] text-blue-600">Daily transit</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900 mt-1 font-mono">
                    {formatINR(calculationResult.breakdown.localTransport)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Intra-city cabs, autos & rentals</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase tracking-wider">Activities & Sights</span>
                    <span className="text-[11px] text-blue-600">{activityPreference} activity</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900 mt-1 font-mono">
                    {formatINR(calculationResult.breakdown.activities)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Admission tickets, sports & tours</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase tracking-wider">Miscellaneous</span>
                    <span className="text-[11px] text-blue-600">5% Safety buffer</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900 mt-1 font-mono">
                    {formatINR(calculationResult.breakdown.miscellaneous)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tolls, tips & incidental buffer</p>
                </div>
              </div>

              {/* Assumptions & Methodology disclosure */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 text-xs text-slate-600 space-y-1.5 border border-slate-100">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Methodology & Mathematical Assumptions:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-500">
                  {calculationResult.assumptions.map((assump, i) => (
                    <li key={i}>{assump}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Smart Intercity Transport Comparison (Flight vs Train vs Bus) */}
            <SmartTransportComparison
              origin={origin}
              destination={destination}
              travelers={travelers}
              currentTransport={transportPreference}
              onApplyTransportCost={(mode, newCost) => {
                setTransportPreference(mode as TransportPreference);
                if (calculationResult) {
                  const newTotal =
                    newCost +
                    calculationResult.breakdown.accommodation +
                    calculationResult.breakdown.food +
                    calculationResult.breakdown.localTransport +
                    calculationResult.breakdown.activities +
                    calculationResult.breakdown.miscellaneous;
                  setCalculationResult({
                    ...calculationResult,
                    breakdown: {
                      ...calculationResult.breakdown,
                      transportation: newCost,
                      total: newTotal,
                    },
                    totalEstimated: newTotal,
                    difference: Math.abs(maxBudget - newTotal),
                    isWithinBudget: newTotal <= maxBudget,
                    utilizationPercentage: Math.min(Math.round((newTotal / maxBudget) * 100), 999),
                  });
                }
              }}
            />

            {/* Hidden Cost Detector Audit */}
            <HiddenCostDetector
              travelers={travelers}
              durationDays={durationDays}
              transportPreference={transportPreference}
              onAddHiddenCostBuffer={(additionalBuffer) => {
                if (calculationResult) {
                  const newMisc = calculationResult.breakdown.miscellaneous + additionalBuffer;
                  const newTotal = calculationResult.totalEstimated + additionalBuffer;
                  setCalculationResult({
                    ...calculationResult,
                    breakdown: {
                      ...calculationResult.breakdown,
                      miscellaneous: newMisc,
                      total: newTotal,
                    },
                    totalEstimated: newTotal,
                    difference: Math.abs(maxBudget - newTotal),
                    isWithinBudget: newTotal <= maxBudget,
                    utilizationPercentage: Math.min(Math.round((newTotal / maxBudget) * 100), 999),
                  });
                }
              }}
            />

            {/* AI Savings Recommendations Component */}
            {aiRecommendations.length > 0 && (
              <AiSavingsCard recommendations={aiRecommendations} />
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
