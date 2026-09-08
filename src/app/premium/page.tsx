"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Zap,
  Lock,
  ArrowRight,
} from "lucide-react";
import { getSubscription, activateSubscription, getCurrentUser } from "@/lib/store";
import { trackEvent } from "@/lib/analytics";
import { Subscription, Profile } from "@/types";
import { formatDate } from "@/lib/utils";

export default function PremiumPage() {
  const [user, setUser] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [missingVarsMessage, setMissingVarsMessage] = useState<string | null>(null);
  const [sandboxEnabled, setSandboxEnabled] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser();
      setUser(u);
      const sub = await getSubscription();
      setSubscription(sub);
      await trackEvent("premium_viewed", { currentPlan: sub?.plan });
      setLoading(false);
    }
    load();
  }, []);

  const handleUpgrade = async () => {
    setUpgrading(true);
    setStatusMessage(null);
    setMissingVarsMessage(null);

    try {
      await trackEvent("payment_started", { plan: "premium", amount: 199 });

      // Step 1: Request Order Creation on the Server
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "premium",
          allowDemoSandbox: sandboxEnabled,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.requiresCredentials) {
          setMissingVarsMessage(
            "Razorpay API keys are not detected in environment variables. To activate live checkout, set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment or enable Demo Sandbox Mode below for your viva presentation."
          );
        } else {
          setStatusMessage({ type: "error", text: data.error || "Order creation failed" });
        }
        setUpgrading(false);
        return;
      }

      // Step 2: Handle Payment
      if (data.isSandbox) {
        // Step 3: Verify server-side
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: data.orderId,
            paymentId: `pay_demo_${Date.now()}`,
            isSandbox: true,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          const updatedSub = await activateSubscription("premium", verifyData.paymentReference);
          setSubscription(updatedSub);
          setStatusMessage({
            type: "success",
            text: "Sandbox verification passed! Premium plan is now active.",
          });
        } else {
          setStatusMessage({ type: "error", text: "Sandbox payment verification failed." });
        }
        setUpgrading(false);
        return;
      }

      // Live Razorpay SDK checkout
      const keyId = data.keyId;
      const orderId = data.orderId;

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        const options = {
          key: keyId,
          amount: data.amount,
          currency: data.currency,
          name: "TravelBudget",
          description: "Premium Plan Upgrade (₹199/month)",
          order_id: orderId,
          prefill: {
            name: user?.full_name || "",
            email: user?.email || "",
          },
          theme: {
            color: "#2563EB",
          },
          handler: async function (response: any) {
            // Server-side signature verification
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              const updatedSub = await activateSubscription("premium", response.razorpay_payment_id);
              setSubscription(updatedSub);
              setStatusMessage({
                type: "success",
                text: "Payment verified successfully! Welcome to TravelBudget Premium.",
              });
            } else {
              setStatusMessage({
                type: "error",
                text: verifyData.error || "Payment verification failed on the server.",
              });
            }
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setUpgrading(false);
      };

      document.body.appendChild(script);
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Failed to initiate checkout." });
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const isPremium = subscription?.plan === "premium" && subscription?.status === "active";

  return (
    <AppLayout
      headerTitle="TravelBudget Premium"
      headerSubtitle="Unlock advanced AI financial recommendations, multi-destination routing, and exportable reports."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl flex items-start gap-3 text-sm ${
              statusMessage.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                : "bg-rose-50 border border-rose-200 text-rose-900"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">
                {statusMessage.type === "success" ? "Success" : "Payment Error"}
              </p>
              <p>{statusMessage.text}</p>
            </div>
          </div>
        )}

        {/* Current Active Plan Badge Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                isPremium
                  ? "bg-emerald-100 text-[#16A34A]"
                  : "bg-blue-50 text-[#2563EB]"
              }`}
            >
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Subscription Status
              </span>
              <h3 className="text-xl font-bold text-[#0F172A]">
                {isPremium ? "Premium Pro Plan Active" : "Free Plan"}
              </h3>
              <p className="text-xs text-slate-500">
                {isPremium
                  ? `Active through ${formatDate(subscription?.expires_at || "")}`
                  : "Limited to 3 saved trips & basic cost calculation"}
              </p>
            </div>
          </div>

          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isPremium
                  ? "bg-emerald-50 text-[#16A34A] border border-emerald-200"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              {isPremium ? "ACTIVE" : "FREE TIER"}
            </span>
          </div>
        </div>

        {/* Missing Credentials Notice & Sandbox Toggle */}
        {missingVarsMessage && !isPremium && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-amber-900">
                  Payment Credentials Notice
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {missingVarsMessage}
                </p>
                <div className="bg-white/80 rounded-xl p-3 border border-amber-200 text-[11px] font-mono text-slate-700 space-y-1">
                  <p>NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxx</p>
                  <p>RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between">
              <label htmlFor="sandbox-toggle" className="text-xs font-medium text-amber-900 cursor-pointer">
                Enable Academic Evaluation Sandbox Mode (For Viva Demonstration)
              </label>
              <input
                id="sandbox-toggle"
                type="checkbox"
                checked={sandboxEnabled}
                onChange={(e) => setSandboxEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Upgrade Card */}
        {!isPremium ? (
          <div className="bg-gradient-to-b from-[#0F172A] to-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Upgrade Package
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold mt-1">
                  TravelBudget Premium
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Unlock everything needed for rigorous travel analytics & AI optimization
                </p>
              </div>

              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">₹199</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-semibold">Taxes included</p>
              </div>
            </div>

            {/* Features list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unlimited saved trips & histories</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Advanced AI recommendations & deep savings tips</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Advanced analytics & conversion funnel telemetry</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Detailed expense reports & exports</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Advanced budget optimization</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Downloadable reports (PDF / CSV)</span>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Server-verified payment architecture (Razorpay)</span>
              </div>

              <button
                type="button"
                onClick={handleUpgrade}
                disabled={upgrading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                {upgrading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹199 & Upgrade</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-emerald-950">
              You Have Full Premium Access
            </h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              All unlimited trips, AI recommendations, and advanced product analytics capabilities
              are unlocked on your account.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
