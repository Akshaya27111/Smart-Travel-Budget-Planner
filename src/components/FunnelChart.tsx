import React from "react";
import { FunnelMetric } from "@/types";
import { ArrowDown, Users, CheckCircle2 } from "lucide-react";

interface FunnelChartProps {
  metrics: FunnelMetric[];
}

export default function FunnelChart({ metrics }: FunnelChartProps) {
  const topCount = metrics[0]?.count || 1;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-[#0F172A]">
            Product Conversion Funnel
          </h3>
          <p className="text-xs text-slate-500">
            End-to-end user journey drop-off and conversion analysis for Product Analytics evaluation
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563EB]">
          <Users className="w-3.5 h-3.5" />
          <span>Cohort Telemetry Active</span>
        </div>
      </div>

      {/* Funnel Steps */}
      <div className="space-y-3">
        {metrics.map((item, index) => {
          const prevCount = index === 0 ? item.count : metrics[index - 1].count;
          const stepConversion = prevCount > 0 ? Math.round((item.count / prevCount) * 100) : 0;
          const overallConversion = topCount > 0 ? Math.round((item.count / topCount) * 100) : 0;
          const barWidth = topCount > 0 ? Math.max(Math.round((item.count / topCount) * 100), 8) : 8;

          return (
            <div key={item.stage} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-800 font-semibold">{item.stage}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono">{item.count} events</span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] font-bold">
                    {overallConversion}% total
                  </span>
                  {index > 0 && (
                    <span className="text-slate-400 text-[11px] hidden sm:inline">
                      ({stepConversion}% from previous)
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar representing funnel width */}
              <div className="w-full h-8 bg-slate-100 rounded-xl overflow-hidden relative flex items-center px-3">
                <div
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl transition-all duration-700 opacity-90"
                  style={{ width: `${item.count === 0 ? 0 : barWidth}%` }}
                />
                <span className="relative z-10 text-[11px] font-bold text-white tracking-wide mix-blend-difference">
                  {item.count} conversions
                </span>
              </div>

              {/* Connector Arrow */}
              {index < metrics.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown className="w-3.5 h-3.5 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
