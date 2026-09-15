"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

interface PlanItForMeCardProps {
  destination: string;
  durationDays: number;
  maxBudget: number;
  isPremium?: boolean;
}

export default function PlanItForMeCard({
  destination,
  durationDays,
  maxBudget,
  isPremium = false,
}: PlanItForMeCardProps) {
  const [activeDemoTab, setActiveDemoTab] = useState<"itinerary" | "tradeoffs" | "safety">("itinerary");

  return (
    <div className="bg-gradient-to-b from-[#0F172A] to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Premium AI Automation</span>
            </span>
            <span className="text-xs font-bold text-amber-400 bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-800">
              ₹1 Trial Available
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-2 flex items-center gap-2">
            <span>"Plan It For Me" AI System</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Don't want to build manually? Tell AI your budget of {formatINR(maxBudget)} and {durationDays} days in {destination}—it creates the mathematically optimal trip.
          </p>
        </div>

        <Link
          href="/premium"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>{isPremium ? "AI Engine Unlocked" : "Start ₹1 Trial"}</span>
        </Link>
      </div>

      {/* Feature Demo Switcher */}
      <div className="flex items-center bg-slate-800/80 p-1 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setActiveDemoTab("itinerary")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeDemoTab === "itinerary"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          🗺️ AI Auto-Itinerary & Clustering
        </button>
        <button
          type="button"
          onClick={() => setActiveDemoTab("tradeoffs")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeDemoTab === "tradeoffs"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          🧠 "What-if" Trade-Off Solver
        </button>
        <button
          type="button"
          onClick={() => setActiveDemoTab("safety")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeDemoTab === "safety"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          🛡️ Women's Safety Routing
        </button>
      </div>

      {/* Demo Content 1: Auto-Itinerary & Clustering */}
      {activeDemoTab === "itinerary" && (
        <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Geographic Clustering Activated</span>
            </span>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
              Saved ₹480 by grouping nearby spots
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Day 1 */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between font-bold text-blue-400 border-b border-slate-800 pb-1.5">
                <span>Day 1 • Central Cluster</span>
                <span className="text-white">₹2,450</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li>🌅 <strong>Morning:</strong> Heritage Walk & Filter Coffee</li>
                <li>🏛️ <strong>Afternoon:</strong> Botanical Gardens & Palaces</li>
                <li>🌙 <strong>Evening:</strong> Craft Brewery & Pub Dinner</li>
              </ul>
            </div>

            {/* Day 2 */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between font-bold text-blue-400 border-b border-slate-800 pb-1.5">
                <span>Day 2 • South Cluster</span>
                <span className="text-white">₹2,100</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li>🌅 <strong>Morning:</strong> Iconic Darshini Masala Dosa</li>
                <li>🌳 <strong>Afternoon:</strong> Sprawling Nature & Art Gallery</li>
                <li>🛍️ <strong>Evening:</strong> Textile Bazaar & Street Food</li>
              </ul>
            </div>

            {/* Day 3 */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between font-bold text-blue-400 border-b border-slate-800 pb-1.5">
                <span>Day 3 • Scenic Outskirts</span>
                <span className="text-white">₹2,800</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                <li>🌅 <strong>Morning:</strong> Mountain Viewpoint & Sunrise</li>
                <li>🍛 <strong>Afternoon:</strong> Traditional Highway Thali</li>
                <li>✈️ <strong>Evening:</strong> Airport Shuttle Return Hop</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Demo Content 2: Trade-off Engine */}
      {activeDemoTab === "tradeoffs" && (
        <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Simulated Scenario: Over Budget by ₹3,200</span>
            </span>
            <span className="text-slate-400">AI Decision Support</span>
          </div>

          <div className="space-y-2.5">
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
              <div>
                <strong className="text-emerald-400">Option A (Transport):</strong>
                <span className="text-slate-300 ml-2">Switch Flight ➔ AC Express Sleeper Train</span>
              </div>
              <span className="font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800">
                Saves ₹1,900
              </span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
              <div>
                <strong className="text-emerald-400">Option B (Accommodation):</strong>
                <span className="text-slate-300 ml-2">Select Boutique Homestay instead of 4-Star Hotel</span>
              </div>
              <span className="font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800">
                Saves ₹1,200
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800 text-xs text-blue-200 flex items-center justify-between">
            <span>🏆 <strong>AI Recommended Combination (A + B):</strong> Total ₹3,100 saved, trip is perfectly balanced!</span>
            <button
              type="button"
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
            >
              Apply Correction
            </button>
          </div>
        </div>
      )}

      {/* Demo Content 3: Women's Safety */}
      {activeDemoTab === "safety" && (
        <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold text-rose-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Destination Safety Index: 8.8 / 10</span>
            </span>
            <span className="bg-slate-700 px-2.5 py-0.5 rounded-full text-slate-300">
              Solo & Women-Friendly
            </span>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-amber-900/50 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Late-Night Transit Flag Detected (11:45 PM Transfer)</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Public transit stops drop off at 11:00 PM. We recommend shifting this activity to <strong>7:30 PM</strong> or pre-booking a verified rideshare pickup on well-lit main corridors.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
              <span>Safety Improvement: <strong>High</strong></span>
              <span>Estimated Cost Variance: <strong>+₹150</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          <span>Full AI Decision Support Engine is included with the ₹1 Trial</span>
        </div>

        <Link
          href="/premium"
          className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
        >
          <span>Upgrade to unlock full auto-scheduling</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
