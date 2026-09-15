"use client";

import React, { useState } from "react";
import {
  getAvailablePackages,
  compareCustomPlanWithPackage,
} from "@/lib/packages-engine";
import { TravelPackage, TripType } from "@/types";
import { formatINR } from "@/lib/utils";
import {
  Heart,
  Users,
  Home,
  User,
  Sparkles,
  Check,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface PackageRecommenderProps {
  destination: string;
  travelers: number;
  customTripCost: number;
  onAdoptPackage: (pkg: TravelPackage) => void;
}

const TYPE_ICONS: Record<TripType, React.ReactNode> = {
  Couple: <Heart className="w-4 h-4 text-rose-500 fill-current" />,
  Friends: <Users className="w-4 h-4 text-amber-500" />,
  Family: <Home className="w-4 h-4 text-emerald-500" />,
  Solo: <User className="w-4 h-4 text-blue-500" />,
  Group: <Users className="w-4 h-4 text-indigo-500" />,
};

export default function PackageRecommender({
  destination,
  travelers,
  customTripCost,
  onAdoptPackage,
}: PackageRecommenderProps) {
  const packages = getAvailablePackages(destination, travelers);
  const [selectedType, setSelectedType] = useState<TripType>(
    travelers === 1 ? "Solo" : travelers === 2 ? "Couple" : "Friends"
  );
  const [adoptedPackageId, setAdoptedPackageId] = useState<string | null>(null);

  const comparison = compareCustomPlanWithPackage(
    customTripCost,
    destination,
    selectedType,
    travelers
  );

  const handleAdopt = (pkg: TravelPackage) => {
    onAdoptPackage(pkg);
    setAdoptedPackageId(pkg.id);
    setTimeout(() => setAdoptedPackageId(null), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
              Curated Experience Packages
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Weekend Escapes (2D/1N)
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mt-2 flex items-center gap-2">
            <span>Budget Package Recommendation Engine</span>
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pre-engineered experience templates with balanced accommodation, food, and sightseeing rates.
          </p>
        </div>

        {/* Trip Type Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-center overflow-x-auto max-w-full">
          {(["Couple", "Friends", "Family", "Solo"] as TripType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedType === type
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {TYPE_ICONS[type]}
              <span>{type}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Package vs Custom Plan Live Comparison Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 border border-blue-200/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-blue-600 fill-current" />
            <span>"Package vs. Custom Trip" Smart Comparator</span>
          </span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Your Plan:</span>
            <strong className="text-slate-900 font-bold">
              {formatINR(comparison.customPlanCost)}
            </strong>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">Curated Package:</span>
            <strong className="text-blue-700 font-bold">
              {formatINR(comparison.recommendedPackage.totalPrice)}
            </strong>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {comparison.savingsMessage}
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg) => {
          const isSelectedType = pkg.tripType === selectedType;
          return (
            <div
              key={pkg.id}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-5 ${
                isSelectedType
                  ? "bg-white border-blue-600 ring-2 ring-blue-500/15 shadow-md"
                  : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {pkg.tag}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-2">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-500">{pkg.duration}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900">
                      {formatINR(pkg.totalPrice)}
                    </div>
                    {pkg.perPersonPrice && (
                      <span className="text-[11px] text-slate-500">
                        ~{formatINR(pkg.perPersonPrice)} / person
                      </span>
                    )}
                  </div>
                </div>

                {/* Highlights */}
                <ul className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  {pkg.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Cost Breakdown Pills */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500">
                  <span className="bg-slate-100 px-2 py-1 rounded-md">
                    🏨 Stay: {formatINR(pkg.breakdown.stay)}
                  </span>
                  <span className="bg-slate-100 px-2 py-1 rounded-md">
                    🍛 Food: {formatINR(pkg.breakdown.food)}
                  </span>
                  <span className="bg-slate-100 px-2 py-1 rounded-md">
                    🚕 Transit: {formatINR(pkg.breakdown.transport)}
                  </span>
                  <span className="bg-slate-100 px-2 py-1 rounded-md">
                    🎟️ Sights: {formatINR(pkg.breakdown.activities)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAdopt(pkg)}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  adoptedPackageId === pkg.id
                    ? "bg-emerald-600 text-white"
                    : isSelectedType
                    ? "bg-[#2563EB] hover:bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "border border-slate-300 text-slate-700 hover:bg-white"
                }`}
              >
                {adoptedPackageId === pkg.id ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Package Adopted for Trip!</span>
                  </>
                ) : (
                  <>
                    <span>Adopt This Package</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
