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

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Engineered for Effortless Travel Budgeting
            </h2>
            <p className="text-slate-600 text-base">
              Everything you need to predict, optimize, and record actual travel spending without
              messy spreadsheets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">1. Smart Budget Planning</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Transparent estimation algorithms calculate transport, stay, meals, and activities
                calibrated to travel style and group size.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#F59E0B] flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">2. AI Savings Assistant</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Contextual cost-cutting recommendations with precise rupee savings calculations and
                clear explanations why each tip works.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center font-bold">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">3. Expense Tracking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Log real-time trip expenses on the fly across 7 categories. Compare planned vs. actual
                outlay with automatic over-budget alerts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">4. Travel Analytics</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                In-depth charts, category distributions, budget utilization rates, and product
                conversion funnel telemetry for evaluation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#F8FAFC] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              User Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              How TravelBudget Works
            </h2>
            <p className="text-slate-600 text-base">
              A seamless 5-step workflow designed to keep every rupee accounted for.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: "1",
                title: "Create Your Trip",
                desc: "Enter your starting point, destination, travel dates, and group size.",
              },
              {
                step: "2",
                title: "Set Your Budget",
                desc: "Choose travel style and maximum budget cap to define parameters.",
              },
              {
                step: "3",
                title: "Get Estimates",
                desc: "Our engine computes itemized category breakdowns and AI savings tips.",
              },
              {
                step: "4",
                title: "Track Expenses",
                desc: "Log meals, transit tickets, hotel bills, and shopping during your journey.",
              },
              {
                step: "5",
                title: "Stay Within Budget",
                desc: "Monitor planned vs actual spending with live utilization gauges.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white font-bold flex items-center justify-center text-sm shadow-sm shadow-blue-500/20 mb-3">
                    {item.step}
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
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
              <div className="absolute top-4 right-4 bg-[#2563EB] text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-sm">
                Most Popular
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Premium Pro
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">₹199</span>
                  <span className="text-sm text-slate-400">/ month</span>
                </div>
                <p className="text-sm text-slate-300">
                  For avid adventurers, group trip leaders, and frequent travelers who demand full
                  insights.
                </p>

                <ul className="space-y-3 text-sm text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Unlimited saved trips & histories</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Advanced AI recommendations & deep savings tips</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Advanced analytics & conversion funnel telemetry</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Exportable PDF/CSV expense breakdown reports</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Priority multi-destination routing</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/premium"
                className="w-full text-center py-3 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-semibold text-sm shadow-md shadow-blue-500/30 transition-all"
              >
                Upgrade to Premium
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
