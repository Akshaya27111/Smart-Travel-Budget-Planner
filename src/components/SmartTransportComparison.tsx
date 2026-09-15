"use client";

import React, { useState } from "react";
import { compareIntercityTransport } from "@/lib/transport-comparison";
import { TransportComparisonResult, TransportComparisonOption, IntercityTransportMode } from "@/types";
import { formatINR } from "@/lib/utils";
import {
  Train,
  Bus,
  Plane,
  Clock,
  Luggage,
  Building2,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface SmartTransportComparisonProps {
  origin?: string;
  destination?: string;
  travelers: number;
  currentTransport?: string;
  onApplyTransportCost?: (mode: IntercityTransportMode, newCost: number) => void;
}

export default function SmartTransportComparison({
  origin = "Starting City",
  destination = "Destination",
  travelers = 1,
  currentTransport = "Flight",
  onApplyTransportCost,
}: SmartTransportComparisonProps) {
  const result: TransportComparisonResult = compareIntercityTransport({
    origin,
    destination,
    travelers,
  });

  const [selectedMode, setSelectedMode] = useState<IntercityTransportMode>(
    (currentTransport as IntercityTransportMode) || result.bestValueMode
  );
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const handleSelect = (option: TransportComparisonOption) => {
    setSelectedMode(option.mode);
    setAppliedSuccess(false);
  };

  const handleApply = (option: TransportComparisonOption) => {
    if (onApplyTransportCost) {
      onApplyTransportCost(option.mode, option.overallCost);
      setAppliedSuccess(true);
      setTimeout(() => setAppliedSuccess(false), 3500);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center font-bold">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#0F172A]">
                Smart Transport Comparison
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB]">
                Intercity Transit Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Route: <span className="font-semibold text-slate-800">{result.origin} → {result.destination}</span> • For {result.travelers} traveler(s)
            </p>
          </div>
        </div>

        {result.maxSavings > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#16A34A] text-xs font-bold">
            <TrendingDown className="w-4 h-4" />
            <span>Max Savings: {formatINR(result.maxSavings)} vs Flying</span>
          </div>
        )}
      </div>

      {appliedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span>Transport choice updated in your trip budget!</span>
        </div>
      )}

      {/* Comparison Cards Grid (Train vs Bus vs Flight) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {result.options.map((option) => {
          const isSelected = selectedMode === option.mode;

          return (
            <div
              key={option.mode}
              onClick={() => handleSelect(option)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all relative flex flex-col justify-between space-y-4 ${
                isSelected
                  ? "bg-blue-50/40 border-[#2563EB] shadow-md ring-1 ring-[#2563EB]"
                  : "bg-white border-slate-200/90 hover:border-blue-200 hover:shadow-xs"
              }`}
            >
              {/* Badge row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{option.mode}</h4>
                    <p className="text-[11px] text-slate-400">{option.name}</p>
                  </div>
                </div>

                {option.isBestValue && (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-[#16A34A] border border-emerald-300">
                    <Sparkles className="w-3 h-3" />
                    Best Value
                  </span>
                )}
              </div>

              {/* Pricing section */}
              <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 border border-slate-100">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-500">Overall Trip Transit:</span>
                  <span className="text-lg font-bold text-[#0F172A] font-mono">
                    {formatINR(option.overallCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>Per Person:</span>
                  <span className="font-mono text-slate-700 font-medium">
                    {formatINR(option.costPerPerson)}
                  </span>
                </div>
              </div>

              {/* Breakdown metrics (Ticket, Transit to hotel, Duration, Baggage) */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Travel Duration:</span>
                  </span>
                  <span className="font-semibold text-slate-800 font-mono">
                    ~{option.durationHours} hrs
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hotel Transfer Cab:</span>
                  </span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {formatINR(option.hotelTransferCost)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Luggage className="w-3.5 h-3.5 text-slate-400" />
                    <span>Baggage Allowance:</span>
                  </span>
                  <span className="text-emerald-700 font-semibold">Included Free</span>
                </div>
              </div>

              {/* Tradeoff description */}
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-snug">
                {option.tradeoffSummary}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApply(option);
                }}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? "bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Select {option.mode} ({formatINR(option.overallCost)})</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
