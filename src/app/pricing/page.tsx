import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Transparent Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Plans for Every Traveler
          </h1>
          <p className="text-slate-600 text-base">
            From occasional weekend escapes to frequent adventurers needing deep budget
            analytics, pick the plan that fits your travel style.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* FREE PLAN */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Starter Tier
                </span>
                <h3 className="text-2xl font-bold text-[#0F172A] mt-1">Free Plan</h3>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-[#0F172A]">₹0</span>
                <span className="text-sm font-medium text-slate-500">/ forever</span>
              </div>
              <p className="text-xs text-slate-500">
                Essential tools to plan, estimate, and track occasional personal travels.
              </p>

              <ul className="space-y-3 pt-6 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Basic trip planning</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Basic budget calculation</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Limited to 3 saved trips</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Basic expense tracking</span>
                </li>
              </ul>
            </div>

            <Link
              href="/signup"
              className="w-full text-center py-3.5 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-50 font-semibold text-sm transition-colors block"
            >
              Get Started Free
            </Link>
          </div>

          {/* PREMIUM PLAN */}
          <div className="bg-gradient-to-b from-[#0F172A] to-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
            {/* Ribbon */}
            <div className="absolute top-5 right-5 bg-[#2563EB] text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Recommended</span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Pro Power
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">Premium Plan</h3>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-white">₹199</span>
                <span className="text-sm font-medium text-slate-400">/ month</span>
              </div>
              <p className="text-xs text-slate-400">
                Full AI optimization, unlimited itineraries, advanced analytics, and exportable ledgers.
              </p>

              <ul className="space-y-3 pt-6 border-t border-slate-800 text-xs sm:text-sm text-slate-200">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">Unlimited saved trips</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Advanced AI recommendations</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Advanced analytics & conversion funnels</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Detailed expense reports</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Advanced budget optimization</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Downloadable reports & exports</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Premium planning features</span>
                </li>
              </ul>
            </div>

            <Link
              href="/premium"
              className="w-full text-center py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all block"
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-14 max-w-md mx-auto text-center flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted Razorpay Checkout • Cancel Anytime</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
