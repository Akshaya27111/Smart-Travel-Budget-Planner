import React from "react";
import { Sparkles, TrendingDown, Info, ShieldCheck } from "lucide-react";
import { AiRecommendation } from "@/types";
import { formatINR } from "@/lib/utils";

interface AiSavingsCardProps {
  recommendations: AiRecommendation[];
}

export default function AiSavingsCard({ recommendations }: AiSavingsCardProps) {
  const totalPotentialSavings = recommendations.reduce(
    (sum, r) => sum + (r.estimatedSavings || 0),
    0
  );

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/40 rounded-2xl p-6 border border-blue-100 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-blue-100/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              AI Travel Savings Assistant
            </h3>
            <p className="text-xs text-slate-500">
              Personalized cost-reduction recommendations for your itinerary
            </p>
          </div>
        </div>

        {totalPotentialSavings > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EFF6FF] border border-blue-200 text-[#2563EB] text-xs font-semibold">
            <TrendingDown className="w-4 h-4" />
            <span>Potential Total Savings: {formatINR(totalPotentialSavings)}</span>
          </div>
        )}
      </div>

      {/* Recommendations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {rec.category}
                </span>

                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-500" />
                  {rec.source}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-[#0F172A]">{rec.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{rec.tip}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
              <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span className="leading-tight">{rec.whyItSaves}</span>
              </div>

              {rec.estimatedSavings > 0 && (
                <div className="flex items-center justify-between text-xs font-semibold text-[#16A34A] pt-1">
                  <span>Estimated Savings</span>
                  <span>~{formatINR(rec.estimatedSavings)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
