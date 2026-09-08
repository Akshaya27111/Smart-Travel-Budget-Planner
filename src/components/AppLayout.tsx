"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  PlusCircle,
  Receipt,
  BarChart3,
  Sparkles,
  User,
  LogOut,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import { getCurrentUser, logoutUser, getSubscription } from "@/lib/store";
import { Profile, Subscription } from "@/types";

interface AppLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  actions?: React.ReactNode;
}

export default function AppLayout({
  children,
  headerTitle,
  headerSubtitle,
  actions,
}: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadAuth() {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      setUser(currentUser);
      const sub = await getSubscription();
      setSubscription(sub);
      setLoading(false);
    }
    loadAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Plan a Trip", href: "/create-trip", icon: PlusCircle },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Premium", href: "/premium", icon: Sparkles, badge: subscription?.plan === "premium" ? "PRO" : undefined },
    { name: "Profile", href: "/profile", icon: User },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading your travel workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0F172A] text-slate-300 border-r border-slate-800 shrink-0">
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white flex items-center">
              Travel<span className="text-blue-400">Budget</span>
            </span>
            <span className="text-[9px] text-slate-400 -mt-0.5 tracking-wider font-semibold">
              SMART PLANNER
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 font-bold flex items-center justify-center text-sm">
              {user?.full_name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.full_name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full ${
                    subscription?.plan === "premium" ? "bg-emerald-400" : "bg-blue-400"
                  }`}
                />
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  {subscription?.plan === "premium" ? "Premium Plan" : "Free Plan"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#2563EB] text-white shadow-sm shadow-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-all text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">
              Travel<span className="text-[#2563EB]">Budget</span>
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0F172A] text-slate-200 px-4 py-4 space-y-2 border-b border-slate-800">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 font-bold flex items-center justify-center text-sm">
                {user?.full_name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{user?.full_name}</p>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? "bg-[#2563EB] text-white" : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950/20 rounded-lg text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        )}

        {/* Sub-header on pages */}
        {(headerTitle || actions) && (
          <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              {headerTitle && (
                <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                  {headerTitle}
                </h1>
              )}
              {headerSubtitle && (
                <p className="text-sm text-slate-500 mt-0.5">{headerSubtitle}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        )}

        {/* Body content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-center justify-around h-16 px-2">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 p-1 text-xs font-medium ${
            pathname === "/dashboard" ? "text-[#2563EB]" : "text-slate-500"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/create-trip"
          className={`flex flex-col items-center gap-1 p-1 text-xs font-medium ${
            pathname === "/create-trip" ? "text-[#2563EB]" : "text-slate-500"
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Plan Trip</span>
        </Link>
        <Link
          href="/analytics"
          className={`flex flex-col items-center gap-1 p-1 text-xs font-medium ${
            pathname === "/analytics" ? "text-[#2563EB]" : "text-slate-500"
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Analytics</span>
        </Link>
        <Link
          href="/premium"
          className={`flex flex-col items-center gap-1 p-1 text-xs font-medium ${
            pathname === "/premium" ? "text-[#2563EB]" : "text-slate-500"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Premium</span>
        </Link>
        <Link
          href="/profile"
          className={`flex flex-col items-center gap-1 p-1 text-xs font-medium ${
            pathname === "/profile" ? "text-[#2563EB]" : "text-slate-500"
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}
