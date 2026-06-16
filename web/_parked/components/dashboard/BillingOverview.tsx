"use client";

import React from "react";
import { CreditCard, Clock, AlertTriangle, Zap, ShieldCheck } from "lucide-react";

export interface BillingStatusData {
  plan_tier: "starter" | "pro" | "enterprise" | "free" | string;
  call_limit: number | null;
  current_month_calls: number;
  current_month_duration_seconds?: number;
  overage_amount_eur: number;
  billing_cycle_start?: string;
}

interface BillingOverviewProps {
  data?: BillingStatusData | null;
  isLoading?: boolean;
}

// Helper to calculate saved hours: (Minutes * 1.5) / 60
const calculateSavedHours = (seconds: number = 0) => {
  const minutes = seconds / 60;
  const savedHours = (minutes * 1.5) / 60;
  return savedHours.toFixed(1);
};

export default function BillingOverview({ data, isLoading }: BillingOverviewProps) {
  if (isLoading || !data) {
    return <BillingOverviewSkeleton />;
  }

  const {
    plan_tier,
    call_limit,
    current_month_calls,
    current_month_duration_seconds = 0,
    overage_amount_eur,
  } = data;

  const limit = call_limit ?? 100; // Default fallback to 100 if null
  const isUnlimited = call_limit === null;
  const percentage = isUnlimited ? 0 : Math.min((current_month_calls / limit) * 100, 100);
  const isOverLimit = !isUnlimited && current_month_calls >= limit;
  const isNearLimit = !isUnlimited && percentage >= 80 && !isOverLimit;
  
  const savedHours = calculateSavedHours(current_month_duration_seconds);

  const getTierDisplayName = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "starter": return "Starter Plan";
      case "pro": return "Pro Plan";
      case "enterprise": return "Enterprise";
      default: return "Starter Plan";
    }
  };

  const totalSegments = 28;
  const filledSegments = isUnlimited ? 0 : Math.round((percentage / 100) * totalSegments);
  const segmentColor = isOverLimit ? "bg-red-500" : isNearLimit ? "bg-amber-400" : "bg-[#19e66f]";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 mb-1">
            Nutzung & Abrechnung
          </p>
          <p className="text-[13px] text-slate-500">
            Dein aktueller Verbrauchsstatus im Überblick.
          </p>
        </div>

        {/* Tier Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-md">
          <ShieldCheck size={13} className="text-blue-500" />
          <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700">
            {getTierDisplayName(plan_tier)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Usage Card */}
        <div className="lg:col-span-2">
          <div className="h-full bg-white rounded-xl border border-[#E2E8F0] px-6 py-6 flex flex-col justify-between">

            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-500">
                    <Zap size={14} />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">KI-Minuten Kontingent</p>
                </div>
                <p className="text-[13px] text-slate-500">
                  Gesamte Anrufe in diesem Abrechnungszeitraum.
                </p>
              </div>
              <div className="text-right">
                <span className="block font-display text-[34px] font-bold tracking-tighter leading-none text-slate-900">
                  {current_month_calls}
                </span>
                <span className="font-mono text-[11px] text-slate-400 mt-1 block">
                  {isUnlimited ? "UNBEGRENZT" : `/ ${limit} Anrufe`}
                </span>
              </div>
            </div>

            {/* Segmented Progress Bar */}
            <div className="flex gap-[3px] h-2 mb-3" aria-hidden="true">
              {Array.from({ length: totalSegments }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-[1px] transition-colors duration-500 ${
                    isUnlimited ? "bg-[#19e66f]/70" : i < filledSegments ? segmentColor : "bg-slate-200/70"
                  }`}
                  style={{ transitionDelay: `${i * 18}ms` }}
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-[12px]">
              {isOverLimit ? (
                <span className="flex items-center gap-1.5 font-semibold text-red-600 bg-red-500/10 px-2 py-1 rounded">
                  <AlertTriangle size={12} /> Limit überschritten
                </span>
              ) : isNearLimit ? (
                <span className="flex items-center gap-1.5 font-semibold text-amber-600 bg-amber-500/10 px-2 py-1 rounded">
                  <Clock size={12} /> Fast aufgebraucht
                </span>
              ) : (
                <span className="text-slate-500 font-medium">Im grünen Bereich</span>
              )}
              {!isUnlimited && (
                <span className="font-mono text-[11px] text-slate-500">
                  {Math.max(limit - current_month_calls, 0)} verbleibend
                </span>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Stats Stack */}
        <div className="flex flex-col gap-4">

          {/* Overage Card */}
          <div className="flex-1 bg-white rounded-xl border border-[#E2E8F0] px-5 py-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                overage_amount_eur > 0
                  ? "bg-red-500/10 text-red-500"
                  : "bg-[#F8FAFC] border border-[#E2E8F0] text-slate-400"
              }`}>
                <CreditCard size={15} />
              </div>
              {overage_amount_eur > 0 && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-70" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
              )}
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 mb-1.5">
              Zusatzkosten (Overage)
            </p>
            <h4 className={`font-display text-[28px] font-bold tracking-tighter leading-none ${
              overage_amount_eur > 0 ? "text-red-600" : "text-slate-900"
            }`}>
              {overage_amount_eur.toFixed(2).replace('.', ',')} €
            </h4>
            <p className="text-[11px] text-slate-400 mt-2">
              {overage_amount_eur > 0 ? "Wird zur nächsten Rechnung addiert." : "Keine extra Kosten in diesem Monat."}
            </p>
          </div>

          {/* Efficiency Card */}
          <div className="flex-1 bg-white rounded-xl border border-[#E2E8F0] px-5 py-5">
            <div className="flex items-center mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#19e66f]/10 text-[#12b355]">
                <Clock size={15} />
              </div>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 mb-1.5">
              Gesparte Arbeitszeit
            </p>
            <div className="flex items-baseline gap-1.5">
              <h4 className="font-display text-[28px] font-bold tracking-tighter leading-none text-[#12b355]">
                {savedHours}
              </h4>
              <span className="text-[13px] font-semibold text-slate-500">Std.</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Basis: <span className="font-mono">{(current_month_duration_seconds / 60).toFixed(0)}</span> Min reine Telefonie.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Skeleton Loader ---
function BillingOverviewSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="h-3 w-40 bg-slate-200 rounded mb-2" />
          <div className="h-3 w-48 bg-slate-100 rounded" />
        </div>
        <div className="hidden sm:block h-7 w-28 bg-slate-100 rounded-md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="h-full bg-white rounded-xl border border-[#E2E8F0] px-6 py-6 flex flex-col justify-between min-h-[220px]">
            <div className="flex justify-between mb-8">
              <div className="flex gap-3">
                <div className="h-7 w-7 bg-slate-100 rounded-md" />
                <div>
                  <div className="h-3 w-40 bg-slate-100 rounded mb-2" />
                  <div className="h-2.5 w-48 bg-slate-100/60 rounded" />
                </div>
              </div>
              <div className="h-9 w-20 bg-slate-100 rounded" />
            </div>
            <div className="flex gap-[3px] h-2 mb-3">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="flex-1 bg-slate-100 rounded-[1px]" />
              ))}
            </div>
            <div className="flex justify-between">
              <div className="h-3 w-32 bg-slate-100 rounded" />
              <div className="h-3 w-24 bg-slate-100/60 rounded" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex-1 bg-white rounded-xl border border-[#E2E8F0] px-5 py-5 min-h-[140px]">
              <div className="h-8 w-8 bg-slate-100 rounded-md mb-4" />
              <div className="h-3 w-24 bg-slate-100/60 rounded mb-3" />
              <div className="h-7 w-20 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
