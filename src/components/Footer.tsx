import React from "react";
import Link from "next/link";
import { Wallet, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Travel<span className="text-blue-400">Budget</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              &ldquo;Plan Your Trip. Know Your Budget. Travel Smarter.&rdquo;
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An intelligent full-stack travel-finance web application developed for the 7th-Semester
              Engineering Product Analytics project by our 4-member team.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Supabase RLS Protected • Razorpay Ready</span>
            </div>
          </div>

          {/* Col 2: Product */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/create-trip" className="hover:text-white transition-colors">
                  Plan a Trip
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-white transition-colors">
                  Product Analytics
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Features */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Features
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-400">Smart Budget Engine</span>
              </li>
              <li>
                <span className="text-slate-400">AI Savings Assistant</span>
              </li>
              <li>
                <span className="text-slate-400">Actual vs Planned Spend</span>
              </li>
              <li>
                <span className="text-slate-400">Conversion Funnel Analytics</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Project & Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Project & Info
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Team
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <span className="text-slate-400">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} TravelBudget. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Product Analytics Project Evaluation
          </p>
        </div>
      </div>
    </footer>
  );
}
