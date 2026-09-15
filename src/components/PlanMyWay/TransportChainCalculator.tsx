"use client";

import React, { useState, useEffect } from "react";
import { buildTransportChain } from "@/lib/transport-chain";
import { TransportChain, TransportMode } from "@/types";
import { formatINR } from "@/lib/utils";
import {
  Navigation,
  Car,
  Compass,
  Users,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface TransportChainCalculatorProps {
  stops: string[];
  travelers: number;
  onUpdateTransportBudget: (newTransportCost: number) => void;
}

const MODE_ICONS: Record<TransportMode, string> = {
  Metro: "🚇",
  Bus: "🚌",
  Auto: "🛺",
  Bike: "🏍️",
  Cab: "🚕",
  Walk: "🚶",
};

export default function TransportChainCalculator({
  stops,
  travelers,
  onUpdateTransportBudget,
}: TransportChainCalculatorProps) {
  const [selectedModes, setSelectedModes] = useState<Record<string, TransportMode>>({});
  const [chain, setChain] = useState<TransportChain | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Recalculate transport chain when stops, travelers, or selected modes change
  useEffect(() => {
    const calculated = buildTransportChain({
      stops: stops.length > 0 ? stops : ["Central Landmark", "Heritage Market"],
      travelers,
      defaultModes: selectedModes,
    });
    setChain(calculated);
  }, [stops, travelers, selectedModes]);

  const handleModeChange = (hopId: string, mode: TransportMode) => {
    setSelectedModes((prev) => ({
      ...prev,
      [hopId]: mode,
    }));
    setAppliedSuccess(false);
  };

  const handleApplyToBudget = () => {
    if (chain) {
      onUpdateTransportBudget(chain.totalCost);
      setAppliedSuccess(true);
      setTimeout(() => setAppliedSuccess(false), 3000);
    }
  };

  if (!chain) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Intra-City Transport Optimizer
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {travelers} {travelers === 1 ? "Traveler" : "Travelers"}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mt-2 flex items-center gap-2">
            <span>Sequential Transport Chain</span>
            <Navigation className="w-5 h-5 text-blue-600 shrink-0" />
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            We don't calculate destinations in isolation. We link your full daily route:{" "}
            <strong>Hotel ➔ Sights ➔ Hotel</strong> and optimize for group economics.
          </p>
        </div>

        {/* Total Cost Badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-right self-start sm:self-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400">
            Estimated Daily Local Transit
          </span>
          <div className="text-2xl font-black text-blue-600">
            {formatINR(chain.totalCost)}
          </div>
          <span className="text-[11px] text-slate-500">
            Across {chain.totalDistanceKm} km total
          </span>
        </div>
      </div>

      {/* Group Economics Advice Callout */}
      {chain.groupAdvice && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
            <Users className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
              Smart Group Economics Insight
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {chain.groupAdvice}
            </p>
          </div>
        </div>
      )}

      {/* The Visual Transport Route Pipeline */}
      <div className="space-y-4">
        {chain.hops.map((hop, idx) => {
          return (
            <div
              key={hop.id}
              className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3"
            >
              {/* Hop Title & Distance */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 flex-wrap">
                    <span className="text-slate-800">{hop.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-blue-600">{hop.to}</span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
                  {hop.distanceKm} km
                </div>
              </div>

              {/* Mode Options Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
                {hop.options.map((opt) => {
                  const isSelected = hop.selectedMode === opt.mode;
                  return (
                    <button
                      key={opt.mode}
                      type="button"
                      onClick={() => handleModeChange(hop.id, opt.mode)}
                      className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? "bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-sm"
                          : "bg-white/60 border-slate-200 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      {opt.recommended && (
                        <span className="absolute -top-2 right-2 text-[9px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-full shadow-xs">
                          Best
                        </span>
                      )}

                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm">{MODE_ICONS[opt.mode]}</span>
                        <span
                          className={`text-xs font-bold ${
                            isSelected ? "text-blue-600" : "text-slate-700"
                          }`}
                        >
                          {opt.mode}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          {opt.cost === 0 ? "Free" : formatINR(opt.cost)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ~{opt.durationMins} mins
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Action Bar */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Rates calculated for {travelers} travelers including multi-vehicle auto thresholds.</span>
        </div>

        <div className="flex items-center gap-3">
          {appliedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Updated Local Transit Budget!
            </span>
          )}
          <button
            type="button"
            onClick={handleApplyToBudget}
            className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Car className="w-4 h-4" />
            <span>Apply {formatINR(chain.totalCost)} to Trip Budget</span>
          </button>
        </div>
      </div>
    </div>
  );
}
