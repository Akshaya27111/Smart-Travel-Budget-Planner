"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import EmptyState from "@/components/EmptyState";
import {
  Receipt,
  PlusCircle,
  ArrowLeft,
  Trash2,
  Edit2,
  Calendar,
  Wallet,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Filter,
} from "lucide-react";
import {
  getTripById,
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "@/lib/store";
import { Trip, Expense, ExpenseCategory } from "@/types";
import { formatINR, formatDate } from "@/lib/utils";

const CATEGORIES: ExpenseCategory[] = [
  "Transportation",
  "Accommodation",
  "Food",
  "Local Transport",
  "Activities",
  "Shopping",
  "Miscellaneous",
];

export default function TripExpensesPage() {
  const params = useParams();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  // Form State (Add / Edit)
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Food");
  const [amount, setAmount] = useState<number | "">("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!tripId) return;
      const foundTrip = await getTripById(tripId);
      setTrip(foundTrip);
      const tripExpenses = await getExpenses(tripId);
      setExpenses(tripExpenses);
      setLoading(false);
    }
    load();
  }, [tripId]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!trip) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <p className="text-slate-600">Trip not found.</p>
          <Link href="/dashboard" className="text-blue-600 underline text-sm mt-2 inline-block">
            Go to dashboard
          </Link>
        </div>
      </AppLayout>
    );
  }

  // Calculations
  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const remainingBudget = trip.max_budget - totalSpent;
  const isOverBudget = remainingBudget < 0;
  const utilization = Math.min(Math.round((totalSpent / (trip.max_budget || 1)) * 100), 999);

  // Filtered List
  const filteredExpenses =
    selectedFilter === "All"
      ? expenses
      : expenses.filter((e) => e.category === selectedFilter);

  // Submit Handler (Add or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || Number(amount) <= 0) return;

    setSaving(true);
    if (isEditing) {
      const updated = await updateExpense(isEditing, {
        description,
        category,
        amount: Number(amount),
        expense_date: expenseDate,
      });
      if (updated) {
        setExpenses(expenses.map((e) => (e.id === isEditing ? updated : e)));
        resetForm();
      }
    } else {
      const created = await addExpense({
        trip_id: trip.id,
        description,
        category,
        amount: Number(amount),
        expense_date: expenseDate,
      });
      if (created) {
        setExpenses([created, ...expenses]);
        resetForm();
      }
    }
    setSaving(false);
  };

  const handleEditClick = (exp: Expense) => {
    setIsEditing(exp.id);
    setDescription(exp.description);
    setCategory(exp.category);
    setAmount(exp.amount);
    setExpenseDate(exp.expense_date);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this expense item?")) {
      await deleteExpense(id);
      setExpenses(expenses.filter((e) => e.id !== id));
      if (isEditing === id) resetForm();
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setDescription("");
    setCategory("Food");
    setAmount("");
    setExpenseDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <AppLayout
      headerTitle={`Expense Tracker: ${trip.destination}`}
      headerSubtitle="Record actual expenses, compare against your planned budget, and prevent overspending."
      actions={
        <Link
          href={`/trips/${trip.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Trip Overview</span>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Metrics Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Budget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Trip Budget Cap
            </p>
            <h3 className="text-2xl font-bold text-[#0F172A] mt-1 font-mono">
              {formatINR(trip.max_budget)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Maximum planned allowance</p>
          </div>

          {/* Actual Spent */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Actual Spent
            </p>
            <h3 className="text-2xl font-bold text-[#2563EB] mt-1 font-mono">
              {formatINR(totalSpent)}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isOverBudget ? "bg-[#DC2626]" : "bg-[#2563EB]"
                  }`}
                  style={{ width: `${Math.min(utilization, 100)}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-600">{utilization}%</span>
            </div>
          </div>

          {/* Remaining or Deficit */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {isOverBudget ? "Budget Deficit" : "Remaining Balance"}
            </p>
            <h3
              className={`text-2xl font-bold mt-1 font-mono ${
                isOverBudget ? "text-[#DC2626]" : "text-[#16A34A]"
              }`}
            >
              {formatINR(Math.abs(remainingBudget))}
            </h3>
            <p className="text-[11px] mt-0.5 font-medium">
              {isOverBudget ? (
                <span className="text-[#DC2626]">⚠ Budget exceeded by {formatINR(Math.abs(remainingBudget))}</span>
              ) : (
                <span className="text-[#16A34A]">✓ Within planned threshold</span>
              )}
            </p>
          </div>
        </div>

        {/* Add / Edit Expense Form Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                {isEditing ? "Edit Expense Item" : "Record New Expense"}
              </h3>
              <p className="text-xs text-slate-500">
                Enter expense details to update your running balance
              </p>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Description *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Taxi fare, Dinner, Museum pass"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                min="1"
                required
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-1">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 px-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center transition-all disabled:opacity-50"
              >
                {saving ? "..." : isEditing ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>

        {/* Expenses List & Filter */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Recorded Expenses</h3>
              <p className="text-xs text-slate-500">
                {expenses.length} total entries recorded for this journey
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </span>
              {["All", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                    selectedFilter === cat
                      ? "bg-[#2563EB] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredExpenses.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No expenses in this view"
              description="Use the form above to add your transportation, hotel, meals, or activity expenses."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="pb-3 px-2">Description</th>
                    <th className="pb-3 px-2">Category</th>
                    <th className="pb-3 px-2">Date</th>
                    <th className="pb-3 px-2 text-right">Amount</th>
                    <th className="pb-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-2 font-medium text-slate-900">
                        {exp.description}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-slate-500">
                        {formatDate(exp.expense_date)}
                      </td>
                      <td className="py-3.5 px-2 text-right font-bold text-slate-900 font-mono">
                        {formatINR(exp.amount)}
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEditClick(exp)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(exp.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
