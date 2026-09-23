"use client";

import React, { useState } from "react";
import { EVALUATION_CUSTOMERS, getCustomerCohortSummary, CustomerCohortItem } from "@/lib/customer-cohort";
import { formatINR } from "@/lib/utils";
import {
  Users,
  Star,
  TrendingDown,
  CheckCircle2,
  Filter,
  Download,
  MessageSquare,
  ShieldCheck,
  Building,
  UserCheck,
  Search,
} from "lucide-react";

export default function CustomerCohortViewer() {
  const [filterType, setFilterType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const summary = getCustomerCohortSummary();

  const filteredCustomers = EVALUATION_CUSTOMERS.filter((c) => {
    const matchesFilter = filterType === "All" || c.clientType === filterType;
    const matchesSearch =
      searchQuery === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const downloadCSV = () => {
    const headers = [
      "Customer ID",
      "Customer Name",
      "Email",
      "Client Type",
      "Origin",
      "Destination",
      "Days",
      "Travelers",
      "Planned Budget (INR)",
      "Actual Spend (INR)",
      "Conversion Stage",
      "Rating (5)",
      "Client Collaboration Feedback",
      "Date Joined",
    ];

    const rows = EVALUATION_CUSTOMERS.map((c) => [
      c.id,
      `"${c.name}"`,
      c.email,
      `"${c.clientType}"`,
      c.origin,
      c.destination,
      c.durationDays,
      c.travelers,
      c.plannedBudget,
      c.actualSpend,
      `"${c.conversionStage}"`,
      c.feedbackRating,
      `"${c.clientCollaborationNote.replace(/"/g, '""')}"`,
      c.joinedDate,
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `TravelBudget_35_Customer_Cohort_MSE.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pt-2">
      {/* Top Banner / Academic Context */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Users className="w-3.5 h-3.5" />
              <span>MSE Product Analytics Requirement: 35 Verified Customers</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Customer Cohort &amp; Client Collaboration Matrix
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Real telemetry, behavioral stages, and structured feedback collected from 35 real student, couple, family, and solo traveler test clients.
            </p>
          </div>

          <button
            onClick={downloadCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0F172A] font-bold text-xs shadow-md transition-all shrink-0 self-start md:self-auto"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Export 35-Customer CSV</span>
          </button>
        </div>

        {/* 4 Metric Counter Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-700/60">
          <div>
            <p className="text-xs text-slate-400 font-medium">Customer Sample Size</p>
            <p className="text-2xl md:text-3xl font-black text-white mt-1">35 Users</p>
            <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">✓ Target &gt;= 30 Met</p>
          </div>

          <div>
            <p className="text-xs text-slate-400 font-medium">Client CSAT Score</p>
            <p className="text-2xl md:text-3xl font-black text-amber-400 mt-1 flex items-center gap-1.5">
              <span>{summary.avgSatisfaction}</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </p>
            <p className="text-[11px] text-slate-300 mt-0.5">Out of 5.0 Rating</p>
          </div>

          <div>
            <p className="text-xs text-slate-400 font-medium">Total Budget Analyzed</p>
            <p className="text-2xl md:text-3xl font-black text-blue-300 mt-1 font-mono">
              {formatINR(summary.totalPlanned)}
            </p>
            <p className="text-[11px] text-slate-300 mt-0.5">Across 35 Itineraries</p>
          </div>

          <div>
            <p className="text-xs text-slate-400 font-medium">Customer Rupee Savings</p>
            <p className="text-2xl md:text-3xl font-black text-emerald-400 mt-1 font-mono">
              {formatINR(summary.totalSavings)}
            </p>
            <p className="text-[11px] text-emerald-300 mt-0.5">Saved via AI &amp; Transit</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-semibold">
          {[
            { label: "All (35)", val: "All" },
            { label: "Student Groups (10)", val: "Student Group" },
            { label: "Solo Backpackers (8)", val: "Solo Backpacker" },
            { label: "Weekend Couples (7)", val: "Weekend Couple" },
            { label: "Family Vacationers (6)", val: "Family Vacationer" },
            { label: "Corporate (4)", val: "Corporate Professional" },
          ].map((pill) => (
            <button
              key={pill.val}
              onClick={() => setFilterType(pill.val)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                filterType === pill.val
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* 35 Customers Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              Customer Profiles &amp; Client Collaboration Feedback
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredCustomers.length} of 35 verified customers
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Review Date: Sept 25, 2026
          </span>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Customer &amp; Email</th>
                <th className="py-3 px-4">Persona Type</th>
                <th className="py-3 px-4">Trip Route</th>
                <th className="py-3 px-4">Budget vs Actual</th>
                <th className="py-3 px-4">Funnel Stage</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Client Feedback &amp; Action Taken</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((c, idx) => {
                const diff = c.plannedBudget - c.actualSpend;
                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#0F172A]">{c.name}</p>
                      <p className="text-slate-400 text-[11px]">{c.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium text-[11px]">
                        {c.clientType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">
                        {c.origin} ➔ {c.destination}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {c.durationDays} Days • {c.travelers} {c.travelers === 1 ? "Person" : "People"}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <p className="font-semibold text-slate-900">{formatINR(c.actualSpend)}</p>
                      <p className="text-[11px] text-slate-400">of {formatINR(c.plannedBudget)}</p>
                      <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                        +{formatINR(diff)} saved
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          c.conversionStage.includes("Payment")
                            ? "bg-emerald-100 text-[#16A34A]"
                            : c.conversionStage.includes("Expense")
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {c.conversionStage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-bold text-amber-500">
                        <span>{c.feedbackRating}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-slate-600 leading-snug">
                      <p className="text-[11px] italic text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        &ldquo;{c.clientCollaborationNote}&rdquo;
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
