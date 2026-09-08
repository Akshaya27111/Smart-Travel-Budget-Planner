import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatINR } from "@/lib/utils";

interface BudgetSummaryCardProps {
  maxBudget: number;
  estimatedCost: number;
  actualSpent?: number;
  compact?: boolean;
}

export default function BudgetSummaryCard({
  maxBudget,
  estimatedCost,
  actualSpent,
  compact = false,
}: BudgetSummaryCardProps) {
  const diffEstimated = maxBudget - estimatedCost;
  const isWithinBudget = diffEstimated >= 0;

  const compareSpent = actualSpent !== undefined ? actualSpent : estimatedCost;
  const diffActual = maxBudget - compareSpent;
  const isActualWithin = diffActual >= 0;

  const utilization = Math.min(Math.round((compareSpent / (maxBudget || 1)) * 100), 999);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
      {/* Header with status badge */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Budget Evaluation
        </h3>

        {isWithinBudget ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#16A34A] border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Within Budget
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-[#DC2626] border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Over Budget
          </span>
        )}
      </div>

      {/* Main amounts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
        <div>
          <p className="text-xs text-slate-500 font-medium">Max Planned Budget</p>
          <p className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-0.5">
            {formatINR(maxBudget)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500 font-medium">Estimated Cost</p>
          <p className="text-xl sm:text-2xl font-bold text-[#2563EB] mt-0.5">
            {formatINR(estimatedCost)}
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <p className="text-xs text-slate-500 font-medium">
            {isWithinBudget ? "Remaining Buffer" : "Excess Over Budget"}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            {isWithinBudget ? (
              <ArrowDownRight className="w-4 h-4 text-[#16A34A]" />
            ) : (
              <ArrowUpRight className="w-4 h-4 text-[#DC2626]" />
            )}
            <p
              className={`text-xl sm:text-2xl font-bold ${
                isWithinBudget ? "text-[#16A34A]" : "text-[#DC2626]"
              }`}
            >
              {formatINR(Math.abs(diffEstimated))}
            </p>
          </div>
        </div>
      </div>

      {/* Utilization Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium text-slate-600">
          <span>Budget Utilization</span>
          <span
            className={
              utilization > 100
                ? "text-[#DC2626] font-bold"
                : utilization > 85
                ? "text-[#F59E0B] font-bold"
                : "text-slate-700"
            }
          >
            {utilization}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              utilization > 100
                ? "bg-[#DC2626]"
                : utilization > 85
                ? "bg-[#F59E0B]"
                : "bg-[#2563EB]"
            }`}
            style={{ width: `${Math.min(utilization, 100)}%` }}
          />
        </div>
      </div>

      {/* Explanatory banner */}
      <div
        className={`p-3.5 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 ${
          isWithinBudget
            ? "bg-emerald-50/80 text-emerald-900 border border-emerald-100"
            : "bg-rose-50/80 text-rose-900 border border-rose-100"
        }`}
      >
        {isWithinBudget ? (
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
        )}
        <p>
          {isWithinBudget
            ? `Great job! Your planned itinerary is comfortably within budget with ${formatINR(
                diffEstimated
              )} left for spontaneous local adventures.`
            : `You are ${formatINR(
                Math.abs(diffEstimated)
              )} over your planned budget. Review the AI Savings Assistant recommendations below to trim costs!`}
        </p>
      </div>
    </div>
  );
}
