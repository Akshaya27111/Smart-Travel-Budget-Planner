"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Sparkles,
  Calculator,
  Receipt,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Zap,
  MapPin,
  Calendar,
  Users,
  Train,
  Car,
  Compass,
  AlertTriangle,
  Sliders,
  ShieldAlert,
  Heart,
  Flame,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200/60 bg-gradient-to-b from-white via-slate-50/50 to-[#F8FAFC]">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Powered Travel Financial Intelligence</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.15]">
                Plan Your Trip. <br />
                <span className="text-[#2563EB]">Know Your Budget.</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Plan smarter trips with AI-powered budget estimates, expense tracking, and
                personalized savings recommendations. Never worry about unexpected travel expenses
                again.
              </p>

              {/* Tagline */}
              <p className="text-sm font-semibold text-slate-500 italic">
                &ldquo;Plan Your Trip. Know Your Budget. Travel Smarter.&rdquo;
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/create-trip"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-base shadow-md shadow-blue-600/25 hover:shadow-lg transition-all"
                >
                  <span>Start Planning</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F172A] font-semibold text-base border border-slate-200 shadow-xs transition-all"
                >
                  <span>See How It Works</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>Transparent Engine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>Real Expense Tracking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>Supabase Protected</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Trip Budget Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                {/* Glow ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-md opacity-20" />

                <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
                  {/* Card Top Banner */}
                  <div className="bg-[#0F172A] p-5 text-white flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                          Verified Preview
                        </span>
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <h3 className="text-xl font-bold tracking-tight mt-0.5">GOA TRIP</h3>
                      <p className="text-xs text-slate-400">4 Days • 2 Travelers • Standard Style</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Planned Budget
                      </span>
                      <p className="text-lg font-bold text-white">₹18,000</p>
                    </div>
                  </div>

                  {/* Category Breakdown list */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100">
                      <span className="text-slate-600">Transportation</span>
                      <span className="font-semibold text-slate-900 font-mono">₹4,000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100">
                      <span className="text-slate-600">Accommodation</span>
                      <span className="font-semibold text-slate-900 font-mono">₹5,000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100">
                      <span className="text-slate-600">Food & Dining</span>
                      <span className="font-semibold text-slate-900 font-mono">₹3,000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100">
                      <span className="text-slate-600">Local Transport</span>
                      <span className="font-semibold text-slate-900 font-mono">₹1,000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100">
                      <span className="text-slate-600">Activities & Sights</span>
                      <span className="font-semibold text-slate-900 font-mono">₹2,000</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-1">
                      <span className="text-slate-600">Miscellaneous Buffer</span>
                      <span className="font-semibold text-slate-900 font-mono">₹500</span>
                    </div>

                    {/* Total & Comparison Box */}
                    <div className="mt-4 pt-3 border-t-2 border-slate-100 bg-[#EFF6FF] rounded-xl p-3.5 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-500">Estimated Total</p>
                        <p className="text-xl font-bold text-[#2563EB]">₹15,500</p>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#16A34A]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Within Budget
                        </span>
                        <p className="text-[11px] text-emerald-800 font-medium mt-1">
                          +₹2,500 Buffer
                        </p>
                      </div>
                    </div>

                    {/* AI Savings Tip Card */}
                    <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wide">
                          AI Smart Savings Tip
                        </span>
                        <p className="text-xs text-slate-700 font-medium mt-0.5 leading-snug">
                          &ldquo;Choosing budget accommodation could save approximately ₹1,200.&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Intelligent Travel Pillars Section */}
      <section id="features" className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              7 Intelligent Travel Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              One Connected Financial Intelligence System
            </h2>
            <p className="text-slate-600 text-base">
              Not random isolated calculators, but a unified decision engine built to guide you from initial daydreaming to final rupee tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1: Smart Transport Comparison */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold">
                <Train className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">1. Smart Transport Comparison</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Compare <strong>Flight vs Train vs Bus</strong> beyond ticket prices. Evaluates baggage fees, travel hours, and destination-to-hotel cab transfers to reveal the true <em>Best Value</em>.
              </p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  Includes Airport/Station Cabs
                </span>
              </div>
            </div>

            {/* Pillar 2: Destination Experience & Famous Things */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">2. Destination Experience & Sights</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Instantly explore famous spots (like Bangalore Palace or Cubbon Park) and iconic delicacies (like Vidyarthi Bhavan Dosa) with 1-click addition directly into your trip budget.
              </p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                  + Add to Trip with Live Costing
                </span>
              </div>
            </div>

            {/* Pillar 3: Local Transport Chain Calculator */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center font-bold">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">3. Local Transit Expense Chain</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Calculates transit hops: <em>Hotel ➔ Sight A ➔ Sight B ➔ Hotel</em> with group-size intelligence (e.g. 4 travelers = 1 shared cab is cheaper than 2 autos).
              </p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Group Economics: Auto vs Cab
                </span>
              </div>
            </div>

            {/* Pillar 4: Curated Packages Engine */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/80 hover:border-rose-400 hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">4. Weekend & Group Packages</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Curated pre-built itineraries for <strong>Couples, Friends, Families, and Solo</strong> adventurers with realistic budget estimates and must-do activities.
              </p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md">
                  1-Click Package Adoption
                </span>
              </div>
            </div>

            {/* Pillar 5: "What If?" Budget Optimizer */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">5. &ldquo;What If?&rdquo; Budget Optimizer</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Trip over budget? Interactive levers let you test trade-offs across transport, hotels, and dining to bring any trip into the green with 1-click rebalancing.
              </p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                  Interactive Levers &amp; Instant Fix
                </span>
              </div>
            </div>

            {/* Pillar 6: Safety-Aware Travel Planning */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/80 hover:border-purple-400 hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">6. Safety-Aware Travel Intelligence</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Flags late-night transit risks (e.g. 11:30 PM airport arrivals), budgets verified prepaid safe cabs, and provides one-tap access to 112 / 1091 emergency helplines.
              </p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                  Night Safety &amp; Emergency SOS
                </span>
              </div>
            </div>

            {/* Pillar 7: Hidden Cost Detector (Spans full row on md/lg) */}
            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-amber-200/80 hover:border-amber-400 hover:shadow-md transition-all md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">7. Pre-Trip Hidden Cost Detector</h3>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Most budget overruns happen from unbudgeted airport cabs (~₹900), highway tolls (~₹350), excess airline baggage (~₹1,200), and incidental resort tariffs. Our pre-trip audit flags these before you book so you never get caught off-guard.
                </p>
              </div>
              <Link
                href="/create-trip"
                className="shrink-0 px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
              >
                Try Hidden Cost Audit ➔
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Connected Travel Loop: How It Works */}
      <section id="how-it-works" className="py-20 bg-[#F8FAFC] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              The Connected Travel Loop
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Plan → Experience → Travel → Calculate → Optimize → Track
            </h2>
            <p className="text-slate-600 text-base">
              A 6-stage closed-loop financial system that connects itinerary planning to live rupee tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              {
                step: "1",
                badge: "Plan",
                title: "Trip Wizard",
                desc: "Set origin, destination, dates, travelers, and spending cap.",
              },
              {
                step: "2",
                badge: "Experience",
                title: "Famous Sights",
                desc: "Discover must-see places & foods with 1-click addition to budget.",
              },
              {
                step: "3",
                badge: "Travel",
                title: "Smart Transit",
                desc: "Flight vs Train vs Bus with station transfers & duration.",
              },
              {
                step: "4",
                badge: "Calculate",
                title: "Local Hops",
                desc: "Route calculation from Hotel to sights with auto vs cab sharing.",
              },
              {
                step: "5",
                badge: "Optimize",
                title: "What-If Levers",
                desc: "Rebalance budgets & eliminate hidden cost traps automatically.",
              },
              {
                step: "6",
                badge: "Track",
                title: "Expense Ledger",
                desc: "Log real spending and monitor planned vs actual variance live.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-full bg-[#2563EB] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                      {item.step}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Simple Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Choose the Plan That Fits Your Journey
            </h2>
            <p className="text-slate-600 text-base">
              Start free forever, or upgrade to unlock unlimited trips, deep AI optimization, and
              exportable reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#F8FAFC] rounded-2xl p-8 border border-slate-200 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Starter
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#0F172A]">₹0</span>
                  <span className="text-sm text-slate-500">/ forever</span>
                </div>
                <p className="text-sm text-slate-600">
                  Ideal for casual solo travelers planning single weekend getaways.
                </p>

                <ul className="space-y-3 text-sm text-slate-600 pt-4 border-t border-slate-200">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Basic trip planning & cost estimates</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Basic budget calculation engine</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Up to 3 active saved trips</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>Standard expense logging</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/signup"
                className="w-full text-center py-3 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-100 font-semibold text-sm transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-b from-[#0F172A] to-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
              {/* Popular badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-sm">
                ₹1 Trial Offer
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Full AI Automation
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">₹1</span>
                  <span className="text-sm text-slate-300">/ first 30 days</span>
                </div>
                <p className="text-xs text-amber-400 font-medium">
                  Then ₹99/mo autopay • Cancel anytime with 1 click
                </p>

                <ul className="space-y-3 text-sm text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-semibold">"Plan It For Me" AI Itinerary Generator</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>AI Budget Trade-Off Solver (Over-budget fixer)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Women's Safety-Aware Routing & Night alerts</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Geographic Clustering (Nearby attraction grouping)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Unlimited trips & exportable PDF/CSV reports</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/premium"
                className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-md shadow-blue-500/30 transition-all"
              >
                Start 30-Day Trial for ₹1
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#2563EB] text-white py-14">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Ready to Take Control of Your Travel Budget?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of travelers making smarter financial choices with real-time budget
            breakdowns and AI recommendations.
          </p>
          <div className="pt-2">
            <Link
              href="/create-trip"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#2563EB] hover:bg-blue-50 font-bold text-sm shadow-lg transition-all"
            >
              <span>Calculate Your Trip Budget Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
