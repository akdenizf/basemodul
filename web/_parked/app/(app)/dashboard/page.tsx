"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import AuthGuard from "@/components/AuthGuard";
import {
  Inbox,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Flame,
  Droplets,
  Radio,
  PhoneForwarded,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import CategoryDonutChart from "@/components/dashboard/CategoryDonutChart";
import ActivityBarChart from "@/components/dashboard/ActivityBarChart";
import BillingOverview, { type BillingStatusData } from "@/components/dashboard/BillingOverview";

// --- Types ---
interface RecentActivity {
  id: string;
  created_at: string;
  status: string;
  urgency: string;
  caller_name: string | null;
  issue_summary: string | null;
  ticket_code: string | null;
  category?: string;
  follow_up_count?: number;
  has_follow_up?: boolean;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface ActivityData {
  day: string;
  eingegangen: number;
  geloest: number;
}

interface AiStatus {
  text: string;
  active: boolean;
  connected: boolean;
}

// --- Helpers ---
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
};

function getTicketIcon(ticket: RecentActivity) {
  const summary = (ticket.issue_summary || "").toLowerCase();
  if (
    ticket.urgency === "EMERGENCY" ||
    summary.includes("rohrbruch") ||
    summary.includes("notfall")
  ) {
    return <Flame size={14} className="text-red-500" />;
  }
  if (
    summary.includes("wasser") ||
    summary.includes("rohr") ||
    summary.includes("tropf")
  ) {
    return <Droplets size={14} className="text-[#19e66f]" />;
  }
  if (ticket.urgency === "HIGH" || ticket.urgency === "URGENT") {
    return <Flame size={14} className="text-orange-500" />;
  }
  return (
    <div
      className={`h-2 w-2 rounded-full ${
        ticket.status === "NEW"
          ? "bg-yellow-400"
          : ticket.status === "IN_PROGRESS"
          ? "bg-[#19e66f]"
          : "bg-slate-300"
      }`}
    />
  );
}

// --- KPI Card (Flat / Cockpit) ---
function KpiCard({
  icon,
  iconBg,
  iconColor,
  value,
  label,
  pulse,
  danger,
  delay,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  value: string | number;
  label: string;
  pulse?: boolean;
  danger?: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.06, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="relative bg-white rounded-xl border border-slate-100 p-5 transition-colors hover:border-slate-300"
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`flex h-9 w-9 items-center justify-center rounded-md border ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        {(pulse || danger) && (
          <span className="flex h-2 w-2 relative mt-1.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${danger ? "bg-red-400" : "bg-slate-400"}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${danger ? "bg-red-500" : "bg-slate-600"}`} />
          </span>
        )}
      </div>
      <h3 className={`font-display text-[34px] font-bold tracking-tighter leading-none mb-2 ${
        danger ? "text-red-600" : "text-slate-900"
      }`}>
        {value}
      </h3>
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </p>
    </motion.div>
  );
}

function AiPulse() {
  return (
    <div className="flex items-end gap-[3px] h-7 my-5">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div
          key={i}
          className="w-[2px] bg-[#19e66f] rounded-full"
          style={{
            height: `${8 + Math.abs(Math.sin(i * 0.9)) * 16}px`,
            animation: `pulse-wave 1.4s ease-in-out ${i * 0.08}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 h-[148px] animate-pulse">
      <div className="w-9 h-9 rounded-md bg-slate-100 mb-5" />
      <div className="h-9 w-20 bg-slate-100 rounded mb-2" />
      <div className="h-3 w-24 bg-slate-100/60 rounded" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 h-[300px] animate-pulse">
      <div className="h-3 w-32 bg-slate-100 rounded mb-6" />
      <div className="h-[200px] bg-slate-50 rounded-lg" />
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    open: 0,
    emergency: 0,
    resolvedToday: 0,
    productivity: 0,
  });
  const [recentTickets, setRecentTickets] = useState<RecentActivity[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [aiStatus, setAiStatus] = useState<AiStatus>({
    text: "Bereit für eingehende Anrufe",
    active: false,
    connected: false,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [orgName, setOrgName] = useState<string | null>(null);
  const [orgLogoUrl, setOrgLogoUrl] = useState<string | null>(null);
  const [billingStatus, setBillingStatus] = useState<BillingStatusData | null>(null);
  const [mounted, setMounted] = useState(false);

  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user);

      if (!session) return;

      try {
        const response = await fetch("/api/dashboard-stats", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await response.json();

        setStats(result.stats);
        setRecentTickets(result.recentTickets || []);
        setCategoryData(result.categoryDistribution || []);
        setActivityData(result.activityByDay || []);
        setAiStatus(
          result.aiStatus || { text: "Bereit für eingehende Anrufe", active: false }
        );
        if (result.orgName) setOrgName(result.orgName);
        if (result.orgLogoUrl) setOrgLogoUrl(result.orgLogoUrl);
        if (result.billingStatus) setBillingStatus(result.billingStatus);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [supabase]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Guten Morgen";
    if (hour < 18) return "Guten Tag";
    return "Guten Abend";
  };

  if (!mounted) return null;

  return (
    <AuthGuard>
      <div className="flex-1 p-6 md:p-10 bg-[#F8FAFC] h-full overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {orgLogoUrl ? (
              <div className="p-2.5 bg-white rounded-xl border border-slate-100">
                <Image src={orgLogoUrl} alt={orgName || "Logo"} width={180} height={48} unoptimized className="h-12 w-auto max-w-[180px] object-contain" />
              </div>
            ) : orgName ? (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F8FAFC] text-slate-500 border border-slate-100">
                <Building2 size={22} />
              </div>
            ) : null}
            <div>
              <h1 className="font-display text-[30px] font-bold tracking-tighter text-slate-900 leading-tight">
                {getGreeting()}{orgName ? `, Team ${orgName}` : (user?.email ? `, ${user.email.split("@")[0]}` : "")}
              </h1>
              <p className="text-[14px] font-medium text-slate-500 mt-1">
                Hier ist der aktuelle Status deiner Immobilien.
              </p>
            </div>
          </div>
          {aiStatus.connected ? (
            <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-md border border-slate-100">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#19e66f] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#12b355]" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-600">
                System Online
              </span>
            </div>
          ) : (
            <a
              href="/settings"
              className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-md border border-amber-200 hover:border-amber-300 transition-colors"
            >
              <div className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-amber-600">
                Nicht verbunden
              </span>
            </a>
          )}
        </header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {loading ? (
            <>
              <KpiSkeleton />
              <KpiSkeleton />
              <KpiSkeleton />
              <KpiSkeleton />
            </>
          ) : (
            <>
              <KpiCard
                icon={<Inbox size={16} />}
                iconBg="bg-[#F8FAFC] border-slate-100"
                iconColor="text-slate-600"
                value={stats.open}
                label="Offene Tickets"
                pulse={stats.open > 0}
                delay={1}
              />
              <KpiCard
                icon={<AlertTriangle size={16} />}
                iconBg="bg-red-500/10 border-red-200/60"
                iconColor="text-red-500"
                value={`${stats.emergency} Notfall`}
                label="Notfälle / High Prio"
                danger
                delay={2}
              />
              <KpiCard
                icon={<CheckCircle size={16} />}
                iconBg="bg-[#19e66f]/10 border-[#19e66f]/20"
                iconColor="text-[#12b355]"
                value={stats.resolvedToday}
                label="Heute erledigt"
                delay={3}
              />
              <KpiCard
                icon={<TrendingUp size={16} />}
                iconBg="bg-[#F8FAFC] border-slate-100"
                iconColor="text-slate-600"
                value={`${stats.productivity}%`}
                label="Abschlussquote (24h)"
                delay={4}
              />
            </>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {loading ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : (
            <>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-xl border border-slate-100 px-6 py-6 min-h-[300px]">
                <CategoryDonutChart data={categoryData} />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-slate-100 px-6 py-6 min-h-[300px]">
                <ActivityBarChart data={activityData} />
              </motion.div>
            </>
          )}
        </div>

        {/* Billing Overview */}
        <div className="mb-10">
          <BillingOverview data={billingStatus} isLoading={loading} />
        </div>

        {/* Recent Activity + AI Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                Neueste Aktivitäten
              </p>
              <Link
                href="/tickets"
                className="group flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 hover:text-slate-900 transition-colors"
              >
                Alle Tickets <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              {loading ? (
                <div>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="px-5 py-4 flex items-center gap-3 animate-pulse border-b border-slate-100 last:border-b-0">
                      <div className="h-8 w-8 rounded-md bg-slate-100 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-40 bg-slate-100 rounded" />
                        <div className="h-2.5 w-3/4 bg-slate-100/60 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentTickets.length === 0 ? (
                <div className="p-10 text-center text-[13px] text-slate-400 font-medium">
                  Keine Aktivitäten vorhanden.
                </div>
              ) : (
                <div>
                  {recentTickets.map((ticket, i, arr) => (
                    <React.Fragment key={ticket.id}>
                      <Link href="/tickets" className="block">
                        <div
                          className="group flex items-center gap-3.5 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                          style={{ animation: `fade-slide-in 0.35s ease-out ${i * 0.06}s both` }}
                        >
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-[#F8FAFC] border border-slate-100">
                            {getTicketIcon(ticket)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="text-[13px] font-bold text-slate-900 truncate tracking-[-0.01em]">
                                  {ticket.caller_name || "Unbekannter Anrufer"}
                                </p>
                                {ticket.ticket_code && (
                                  <span className="font-mono text-[10px] text-slate-400">
                                    #{ticket.ticket_code}
                                  </span>
                                )}
                                {ticket.urgency === "EMERGENCY" && (
                                  <span className="inline-flex items-center gap-1 rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-600">
                                    <Flame size={9} /> Notfall
                                  </span>
                                )}
                                {(ticket.urgency === "HIGH" || ticket.urgency === "URGENT") && (
                                  <span className="inline-flex items-center gap-1 rounded bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-orange-600">
                                    <Flame size={9} /> Hoch
                                  </span>
                                )}
                                {(ticket.has_follow_up || (ticket.follow_up_count && ticket.follow_up_count > 0)) && (
                                  <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                                    <PhoneForwarded size={9} /> Wiederkehrend
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-[11px] text-slate-400 shrink-0">
                                {formatDate(ticket.created_at)}
                              </span>
                            </div>
                            <p className="text-[12px] text-slate-500 line-clamp-1 leading-snug">
                              {ticket.issue_summary}
                            </p>
                          </div>
                          <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                      {i < arr.length - 1 && <div className="mx-5 h-px bg-slate-100" />}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Status Card */}
          <div className="mt-0 lg:mt-7">
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-md ${aiStatus.connected ? "bg-[#19e66f]/10" : "bg-amber-500/10"}`}>
                    <Radio size={15} className={aiStatus.connected ? "text-[#12b355]" : "text-amber-500"} />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                    Callfolio AI
                  </p>
                </div>
                {aiStatus.connected ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#12b355] uppercase tracking-[0.08em]">
                    <span className="flex h-1.5 w-1.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#19e66f] opacity-70" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#12b355]" />
                    </span>
                    {aiStatus.active ? "Live" : "Standby"}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.08em]">
                    Offline
                  </span>
                )}
              </div>

              <h3 className="font-display text-[22px] font-bold tracking-tighter text-slate-900 mb-1.5">
                {aiStatus.connected ? (aiStatus.active ? "Analysiert Anruf" : "Bereit") : "Setup erforderlich"}
              </h3>
              <p className="text-[13px] text-slate-500 mb-5 leading-relaxed">
                {aiStatus.connected ? aiStatus.text : "Vapi Phone ID fehlt. Jetzt in den Einstellungen hinterlegen."}
              </p>

              <AiPulse />

              <p className="text-[12px] font-medium text-slate-400 mb-6">
                {!aiStatus.connected
                  ? "KI-Telefonie ist noch nicht aktiv."
                  : aiStatus.active
                  ? "Analysiere eingehenden Anruf…"
                  : "Die KI überwacht alle Anrufe im Hintergrund."}
              </p>

              {aiStatus.connected ? (
                <Link
                  href={"/history?tab=ki-aktivitaet" as any}
                  className="inline-flex w-full items-center justify-center gap-1.5 px-4 py-2.5 rounded-md text-[12px] font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                >
                  Live-Log ansehen <ArrowRight size={13} />
                </Link>
              ) : (
                <Link
                  href="/settings"
                  className="inline-flex w-full items-center justify-center gap-1.5 px-4 py-2.5 rounded-md text-[12px] font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors"
                >
                  Vapi ID einrichten <ArrowRight size={13} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-slide-in {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-wave {
          0%, 100% { transform: scaleY(0.6); opacity: 0.4; }
          50% { transform: scaleY(1.4); opacity: 1; }
        }
      `}</style>
    </AuthGuard>
  );
}