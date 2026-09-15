"use client";

import React, { useState } from "react";
import { evaluateTripSafety } from "@/lib/safety-engine";
import { SafetyCheckResult } from "@/types";
import { formatINR } from "@/lib/utils";
import {
  ShieldAlert,
  ShieldCheck,
  PhoneCall,
  Moon,
  Sun,
  AlertTriangle,
  CheckCircle2,
  PlusCircle,
  MapPin,
  Car,
} from "lucide-react";

interface SafetyAwarePlannerProps {
  destination: string;
  travelers: number;
  onAddSafetyBuffer?: (extraSafeTransitCost: number) => void;
}

export default function SafetyAwarePlanner({
  destination,
  travelers,
  onAddSafetyBuffer,
}: SafetyAwarePlannerProps) {
  const safety: SafetyCheckResult = evaluateTripSafety({
    destination,
    travelers,
  });

  const [bufferAdded, setBufferAdded] = useState(false);

  const handleAddBuffer = (cost: number) => {
    if (onAddSafetyBuffer) {
      onAddSafetyBuffer(cost);
      setBufferAdded(true);
      setTimeout(() => setBufferAdded(false), 3500);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#0F172A]">
                Safety-Aware Travel Planning
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Safety & Risk Layer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Route timing advisories, day/night transit suitability, and emergency readiness for {destination}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          <span className="text-xs font-bold text-slate-800">
            Destination Safety Score: {safety.safetyRating}/10
          </span>
        </div>
      </div>

      {/* Success alert */}
      {bufferAdded && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span>Safe late-night transit buffer (+₹180) added to your local transport budget!</span>
        </div>
      )}

      {/* Day vs Night Suitability Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daytime card */}
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Daytime Transit (6:00 AM – 8:00 PM)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            High public transit frequency (Metro, AC city buses, autos). Ideal for palace tours, botanical gardens, and crowded street bazaars.
          </p>
        </div>

        {/* Nighttime card */}
        <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Moon className="w-4 h-4" />
            <span>Late-Night Transit (After 10:30 PM)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Public bus & metro services cease operations. Avoid isolated walks or hailing unmetered street rides; use verified app cabs.
          </p>
        </div>
      </div>

      {/* Concrete Late-Night Warning & Solution */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-5 space-y-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-950">
              Late-Night Transit Warning (11:30 PM Route)
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed">
              If your itinerary requires traveling between dinner venues or arriving at railway stations/airports late at night, budget for a verified app-based cab (Ola/Uber) instead of walking or relying on unverified roadside transit.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-amber-200/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
            <Car className="w-4 h-4 text-amber-700" />
            <span>Suggested Safe Cab Surcharge: ~₹180 per hop</span>
          </div>

          <button
            type="button"
            onClick={() => handleAddBuffer(180)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Safe Transit Buffer (+₹180)</span>
          </button>
        </div>
      </div>

      {/* Emergency Helplines & Contacts Bar */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Integrated Emergency Assistance Helplines
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {safety.emergencyContacts.map((contact) => (
            <div
              key={contact.service}
              className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between space-y-2"
            >
              <span className="text-[11px] text-slate-500 leading-tight">
                {contact.service}
              </span>
              <a
                href={`tel:${contact.number}`}
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#2563EB] hover:underline"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{contact.number}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
