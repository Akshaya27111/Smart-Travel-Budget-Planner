import React from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Receipt,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Trip } from "@/types";
import { formatINR, formatDate, calculateDurationDays } from "@/lib/utils";

interface TripCardProps {
  trip: Trip;
  actualSpent?: number;
  onDelete?: (id: string) => void;
}

export default function TripCard({ trip, actualSpent = 0 }: TripCardProps) {
  const days = calculateDurationDays(trip.start_date, trip.end_date);
  const isWithinBudget = trip.estimated_total <= trip.max_budget;
  const compareSpend = actualSpent > 0 ? actualSpent : trip.estimated_total;
  const utilization = Math.min(Math.round((compareSpend / (trip.max_budget || 1)) * 100), 999);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between space-y-4">
      {/* Card Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#2563EB]">
              {trip.travel_style} Style
            </span>
            <h3 className="text-lg font-bold text-[#0F172A] mt-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>{trip.destination}</span>
            </h3>
            <p className="text-xs text-slate-500">From {trip.origin}</p>
          </div>

          {isWithinBudget ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#16A34A] border border-emerald-100">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Within Budget
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-[#DC2626] border border-rose-100">
              <AlertCircle className="w-3.5 h-3.5" />
              Over Budget
            </span>
          )}
        </div>

        {/* Details row */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {formatDate(trip.start_date)} ({days} days)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {trip.travelers} {trip.travelers === 1 ? "Traveler" : "Travelers"}
            </span>
          </div>
        </div>
      </div>

      {/* Financials Breakdown summary */}
      <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500">Planned Budget:</span>
          <span className="font-semibold text-slate-900">{formatINR(trip.max_budget)}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500">
            {actualSpent > 0 ? "Actual Spent:" : "Estimated Cost:"}
          </span>
          <span
            className={`font-semibold ${
              actualSpent > 0 ? "text-[#0F172A]" : "text-[#2563EB]"
            }`}
          >
            {formatINR(compareSpend)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
          <div
            className={`h-full rounded-full ${
              utilization > 100
                ? "bg-[#DC2626]"
                : utilization > 85
                ? "bg-[#F59E0B]"
                : "bg-[#2563EB]"
            }`}
            style={{ width: `${Math.min(utilization, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span>Utilization</span>
          <span className={utilization > 100 ? "text-[#DC2626] font-bold" : ""}>
            {utilization}%
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
        <Link
          href={`/trips/${trip.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href={`/trips/${trip.id}/expenses`}
          className="inline-flex items-center justify-center gap-1 text-xs font-semibold py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2563EB] transition-colors"
          title="Track actual expenses"
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Expenses</span>
        </Link>
      </div>
    </div>
  );
}
