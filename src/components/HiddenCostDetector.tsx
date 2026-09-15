"use client";

import React, { useState } from "react";
import { HiddenCostItem } from "@/types";
import { formatINR } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface HiddenCostDetectorProps {
  travelers: number;
  durationDays: number;
  transportPreference?: string;
  onAddHiddenCostBuffer?: (additionalAmount: number) => void;
}

export default function HiddenCostDetector({
  travelers = 1,
  durationDays = 3,
  transportPreference = "Flight",
  onAddHiddenCostBuffer,
}: HiddenCostDetectorProps) {
  const t = Math.max(1, travelers);

  const potentialHiddenCosts: HiddenCostItem[] = [
    {
      id: "cost-airport-transfers",
      name: "Airport / Railway Station Transfers",
      category: "Transportation",
      estimatedCost: transportPreference === "Flight" ? 750 : 350,
      whyNeeded: "Pre-paid cabs or surge pricing from city perimeter terminals into central hotels.",
      likelihood: "High",
    },
    {
      id: "cost-parking-tolls",
      name: "Highway Tolls & Parking Permits",
      category: "Transit Fees",
      estimatedCost: 350,
      whyNeeded: "State toll booths, multi-level mall parking, and monument vehicle permits.",
      likelihood: "Medium",
    },
    {
      id: "cost-entry-tickets",
      name: "Attraction Photography & Audio Guides",
      category: "Activities",
      estimatedCost: 200 * t,
      whyNeeded: "Camera passes, special inner sanctum entry, and palace museum headphone guides.",
      likelihood: "High",
    },
    {
      id: "cost-water-incidentals",
      name: "Bottled Mineral Water & Convenience Snacks",
      category: "Miscellaneous",
      estimatedCost: 150 * t,
      whyNeeded: "Packaged drinking water, hydration during daytime walking, and tea breaks.",
      likelihood: "High",
    },
    {
      id: "cost-hotel-taxes",
      name: "Hotel Service Tips & Bellboy Luggage Gratuities",
      category: "Hospitality",
      estimatedCost: 200,
      whyNeeded: "Customary discretionary housekeeping gratuities and luggage assistance.",
      likelihood: "Medium",
    },
  ];

  const totalOverlooked = potentialHiddenCosts.reduce(
    (sum, item) => sum + item.estimatedCost,
    0
  );

  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleApply = () => {
    if (onAddHiddenCostBuffer) {
      onAddHiddenCostBuffer(totalOverlooked);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3500);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#0F172A]">
                Hidden Cost Detector
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                Pre-Trip Audit
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Audits overlooked trip incidentals that typically trigger 20-30% budget overruns.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-[#DC2626] text-xs font-bold">
          <span>Potential Overlooked Expenses: ~{formatINR(totalOverlooked)}</span>
        </div>
      </div>

      {addedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span>Contingency buffer (+{formatINR(totalOverlooked)}) successfully added to your trip!</span>
        </div>
      )}

      {/* Hidden Costs Itemized Table */}
      <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
        {potentialHiddenCosts.map((cost) => (
          <div
            key={cost.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50/40 hover:bg-slate-50 transition-colors"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-800">{cost.name}</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-600">
                  {cost.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{cost.whyNeeded}</p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <span className="text-xs font-bold text-slate-900 font-mono">
                ~{formatINR(cost.estimatedCost)}
              </span>
              <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                {cost.likelihood} Risk
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Action to add buffer */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-[#0F172A]">
            Protect Your Itinerary Against Unplanned Slippage
          </h4>
          <p className="text-[11px] text-slate-600">
            Automatically absorb these {formatINR(totalOverlooked)} into your miscellaneous contingency buffer.
          </p>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add {formatINR(totalOverlooked)} Safety Buffer</span>
        </button>
      </div>
    </div>
  );
}
