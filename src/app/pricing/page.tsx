import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, Sparkles, X, ShieldCheck, Zap, HeartHandshake } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Special Trial Offer
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Try Premium for Just ₹1
          </h1>
          <p className="text-slate-600 text-base">
            Start with our powerful free <strong>"Plan It My Way"</strong> tools, or activate full <strong>"Plan It For Me"</strong> AI automation for ₹1 for your first 30 days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* FREE PLAN: Plan It My Way */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Self-Service Builder
                </span>
                <h3 className="text-2xl font-bold text-[#0F172A] mt-1">Free Tier</h3>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">"Plan It My Way"</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-[#0F172A]">₹0</span>
                <span className="text-sm font-medium text-slate-500">/ forever</span>
              </div>
              <p className="text-xs text-slate-500">
                Pick famous places, iconic foods, and optimize local transport hops manually.
              </p>

              <ul className="space-y-3 pt-6 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span><strong>Plan It My Way</strong>: Pick famous spots & foods</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span><strong>Local Transport Chain</strong>: Hotel ➔ Sight ➔ Hotel</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span><strong>Group Transport Economics</strong>: Auto vs Cab sharing</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span><strong>Curated Weekend Packages</strong>: Couple, Friends, Solo</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Standard expense ledger & variance tracking</span>
                </li>
              </ul>
            </div>

            <Link
              href="/create-trip"
              className="w-full text-center py-3.5 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-50 font-semibold text-sm transition-colors block"
            >
              Start Planning Free
            </Link>
          </div>

          {/* PREMIUM PLAN: Plan It For Me */}
          <div className="bg-gradient-to-b from-[#0F172A] to-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
            {/* Special Offer Ribbon */}
            <div className="absolute top-5 right-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              <span>₹1 Trial Offer</span>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Full AI Intelligence
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">Premium Tier</h3>
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">"Plan It For Me"</p>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">₹1</span>
                  <span className="text-sm font-medium text-slate-300">for first 30 days</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Then <strong className="text-slate-200">₹99/month</strong> recurring autopay. Cancel anytime with 1 click.
                </p>
              </div>

              <ul className="space-y-3 pt-6 border-t border-slate-800 text-xs sm:text-sm text-slate-200">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-emerald-300">"Plan It For Me" AI Itinerary Generator</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>AI Budget Trade-Off Engine</strong> (Auto-fixes overspend)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Women's Safety-Aware Routing</strong> & Night alerts</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Geographic Location Clustering</strong> (Save transit time)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited trips, exportable CSV/PDF reports & telemetry</span>
                </li>
              </ul>
            </div>

            <Link
              href="/premium"
              className="w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all block"
            >
              Start 30-Day Trial for ₹1
            </Link>
          </div>
        </div>

        {/* FEATURE COMPARISON TABLE */}
        <div className="mt-20 max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Detailed Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4 text-center">Free ("Plan It My Way")</th>
                  <th className="py-3 px-4 text-center text-blue-600">Premium ("Plan It For Me")</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">Famous Places & Food Discovery</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Yes</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Yes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">Local Transport Chain (Metro/Auto/Cab)</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Yes</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Yes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">Group Size Transport Economics</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Yes</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Yes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">Weekend Packages (Couple/Friends/Solo)</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Yes</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Yes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-slate-800">Package vs. Custom Plan Comparison</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Yes</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">✅ Yes</td>
                </tr>
                <tr className="bg-blue-50/40">
                  <td className="py-3 px-4 font-medium text-slate-900">AI One-Click Itinerary Generator</td>
                  <td className="py-3 px-4 text-center text-slate-400">❌</td>
                  <td className="py-3 px-4 text-center text-blue-600 font-bold">✅ Unlimited</td>
                </tr>
                <tr className="bg-blue-50/40">
                  <td className="py-3 px-4 font-medium text-slate-900">AI Budget Trade-Off Solver ("Fix Overspend")</td>
                  <td className="py-3 px-4 text-center text-slate-400">❌</td>
                  <td className="py-3 px-4 text-center text-blue-600 font-bold">✅ Included</td>
                </tr>
                <tr className="bg-blue-50/40">
                  <td className="py-3 px-4 font-medium text-slate-900">Safety-Aware Routing & Night Alerts</td>
                  <td className="py-3 px-4 text-center text-slate-400">Basic</td>
                  <td className="py-3 px-4 text-center text-blue-600 font-bold">✅ Advanced</td>
                </tr>
                <tr className="bg-blue-50/40">
                  <td className="py-3 px-4 font-medium text-slate-900">Subscription Price</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-800">₹0</td>
                  <td className="py-3 px-4 text-center font-bold text-blue-600">₹1 Trial (Then ₹99/mo)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-14 max-w-md mx-auto text-center flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted Razorpay Checkout • ₹1 30-Day Trial • Cancel Anytime</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
