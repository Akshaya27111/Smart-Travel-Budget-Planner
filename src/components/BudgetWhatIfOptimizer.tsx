"use client";

import React, { useState } from "react";
import { generateWhatIfPlan } from "@/lib/budget-optimizer";
import { Trip, OptimizationLever } from "@/types";
import { formatINR } from "@/lib/utils";
import {
  Sparkles,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sliders,
  Check,
  Zap,
} from "lucide-react";

interface BudgetWhatIfOptimizerProps {
  trip: Trip;
  onApplyOptimizedBudget: (
    newEstimatedTotal: number,
    updatedBreakdown: {
      transport?: number;
      stay?: number;
      activities?: number;
      food?: number;
    }
  ) => void;
}

export default function BudgetWhatIfOptimizer({
  trip,
  onApplyOptimizedBudget,
}: BudgetWhatIfOptimizerProps) {
  const plan = generateWhatIfPlan(trip);

  // By default, select all levers that help achieve the target budget
  const [selectedLeverIds, setSelectedLeverIds] = useState<string[]>(
    plan.levers.map((l) => l.id)
  );
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const toggleLever = (id: string) => {
    setSelectedLeverIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setAppliedSuccess(false);
  };

  // Compute live adjusted savings based on user's active levers
  const activeLevers = plan.levers.filter((l) => selectedLeverIds.includes(l.id));
  const activeSavings = activeLevers.reduce((sum, l) => sum + l.savings, 0);
  const activeNewTotal = Math.max(0, plan.originalCost - activeSavings);
  const isNowWithinBudget = activeNewTotal <= plan.maxBudget;

  const handleApplyCombination = () => {
    // Determine category reductions
    const breakdownUpdates: {
      transport?: number;
      stay?: number;
      activities?: number;
      food?: number;
    } = {};

    activeLevers.forEach((l) => {
      if (l.category === "Transportation") {
        breakdownUpdates.transport = Math.max(0, trip.estimated_transport - l.savings);
      } else if (l.category === "Accommodation") {
        breakdownUpdates.stay = Math.max(0, trip.estimated_accommodation - l.savings);
      } else if (l.category === "Activities") {
        breakdownUpdates.activities = Math.max(0, trip.estimated_activities - l.savings);
      } else if (l.category === "Food") {
        breakdownUpdates.food = Math.max(0, trip.estimated_food - l.savings);
      }
    });

    onApplyOptimizedBudget(activeNewTotal, breakdownUpdates);
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 4000);
  };

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 rounded-2xl p-6 sm:p-8 border border-blue-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-blue-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold shadow-sm shadow-blue-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#0F172A]">
                &ldquo;What If?&rdquo; Budget Optimizer
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-[#2563EB]">
                Algorithmic Solver
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Interactive levers to eliminate budget deficits and bring your total cost into the green.
            </p>
          </div>
        </div>

        {plan.overBudgetAmount > 0 ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-[#DC2626] text-xs font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Currently {formatINR(plan.overBudgetAmount)} Over Budget</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#16A34A] text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Trip Within Budget</span>
          </div>
        )}
      </div>

      {/* Success Notification */}
      {appliedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span>Optimized budget combination successfully applied to your trip!</span>
        </div>
      )}

      {/* Interactive Levers List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Available Cost-Saving Levers
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {plan.levers.map((lever) => {
            const isSelected = selectedLeverIds.includes(lever.id);

            return (
              <div
                key={lever.id}
                onClick={() => toggleLever(lever.id)}
                className={`cursor-pointer rounded-xl p-4 border transition-all flex items-start gap-3 select-none ${
                  isSelected
                    ? "bg-white border-[#2563EB] shadow-xs ring-1 ring-[#2563EB]"
                    : "bg-white/60 border-slate-200 hover:border-slate-300 opacity-70"
                }`}
              >
                {/* Custom Checkbox */}
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected ? "bg-[#2563EB] text-white" : "border border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                {/* Lever description */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {lever.category}
                    </span>
                    <span className="text-xs font-bold text-[#16A34A] font-mono">
                      Save {formatINR(lever.savings)}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-900 leading-snug">
                    {lever.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {lever.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Impact Calculation Banner */}
      <div className="bg-white rounded-2xl p-5 border border-blue-200/90 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Rebalanced Trip Simulation
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-xs line-through text-slate-400 font-mono">
              {formatINR(plan.originalCost)}
            </span>
            <span className="text-2xl font-black text-[#0F172A] font-mono">
              {formatINR(activeNewTotal)}
            </span>
            <span className="text-xs font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              - {formatINR(activeSavings)} Total Savings
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Target Budget Cap: <span className="font-semibold text-slate-800">{formatINR(plan.maxBudget)}</span> •{" "}
            {isNowWithinBudget ? (
              <span className="text-[#16A34A] font-bold">
                ✓ Within budget with {formatINR(plan.maxBudget - activeNewTotal)} remaining buffer!
              </span>
            ) : (
              <span className="text-[#DC2626] font-bold">
                Still {formatINR(activeNewTotal - plan.maxBudget)} over budget
              </span>
            )}
          </p>
        </div>

        {/* 1-Click Apply Combination */}
        <button
          type="button"
          onClick={handleApplyCombination}
          disabled={activeSavings === 0}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
        >
          <Zap className="w-4 h-4" />
          <span>Apply Combination ({formatINR(activeNewTotal)})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
