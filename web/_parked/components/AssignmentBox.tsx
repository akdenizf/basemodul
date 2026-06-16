"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  UserX,
  User,
  MapPin,
  Phone,
  X,
  Loader2,
  ArrowRight,
  Ear,
  Bot
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Ticket, Tenant } from "@/lib/types";

// Verwende den zentralen SSR-Client mit korrekten Cookie-Optionen
const supabase = createClient();

interface AssignmentBoxProps {
  ticket: Ticket;
  onAssigned: () => void;
}

export default function AssignmentBox({ ticket, onAssigned }: AssignmentBoxProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Tenant[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState("");

  if (ticket.match_type === "MATCH" || ticket.match_type === "MANUAL_MATCH") {
    return null;
  }

  const getAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session?.access_token}`
    };
  };

  const handleAssign = async (tenantId: string, action: "confirm" | "manual") => {
    setIsAssigning(true);
    setError("");
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/admin/tickets/${ticket.id}/assign`, {
        method: "POST",
        headers,
        body: JSON.stringify({ tenant_id: tenantId, action })
      });
      if (response.ok) {
        setIsSearchOpen(false);
        onAssigned();
      } else {
        const data = await response.json();
        setError(data.error || "Fehler beim Zuordnen");
      }
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleDismiss = async () => {
    setIsAssigning(true);
    setError("");
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/admin/tickets/${ticket.id}/assign`, {
        method: "POST",
        headers,
        body: JSON.stringify({ action: "dismiss" })
      });
      if (response.ok) {
        onAssigned();
      } else {
        const data = await response.json();
        setError(data.error || "Fehler");
      }
    } catch (err: any) {
      setError(err.message || "Unbekannter Fehler");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      // v5.2: Use API endpoint to search tenants within organization
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/admin/tenants/search?q=${encodeURIComponent(query)}`, {
        headers
      });
      if (response.ok) {
        const { tenants } = await response.json();
        setSearchResults(tenants as Tenant[]);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const isReview = ticket.match_type === "REVIEW";
  const suggestedTenant = ticket.alternatives?.[0] || null;

  return (
    <div className="border border-amber-300 dark:border-amber-900/50 rounded-2xl overflow-hidden bg-gradient-to-b from-amber-50 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/5">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-200/60 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
          <AlertTriangle size={16} className="text-amber-700 dark:text-amber-500" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
            {isReview ? "Unsichere Zuordnung" : "Anrufer nicht erkannt"}
          </h4>
          <p className="text-[11px] text-amber-700/70 dark:text-amber-500/70">
            Bitte prüfen und manuell zuordnen.
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="px-5 pb-4">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-stretch">

          {/* Left: KI hörte */}
          <div className="bg-slate-100/80 dark:bg-slate-800/80 rounded-xl p-3.5 border border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Ear size={12} className="text-slate-500 dark:text-slate-400" />
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">KI hörte</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 italic truncate">
                {ticket.raw_caller_name || "—"}
              </p>
              {ticket.raw_caller_address && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                  <MapPin size={10} className="shrink-0" />
                  {ticket.raw_caller_address}
                </p>
              )}
              {ticket.caller_phone && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                  <Phone size={10} className="shrink-0" />
                  {ticket.caller_phone}
                </p>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
              <ArrowRight size={14} className="text-slate-400 dark:text-slate-500" />
            </div>
          </div>

          {/* Right: Vorschlag */}
          <div className={`rounded-xl p-3.5 border ${suggestedTenant
            ? "bg-emerald-50/80 dark:bg-emerald-900/10 border-emerald-200/60 dark:border-emerald-800/60"
            : "bg-red-50/60 dark:bg-red-900/10 border-red-200/40 dark:border-red-800/40"
            }`}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Bot size={12} className={suggestedTenant ? "text-emerald-600 dark:text-emerald-500" : "text-red-400 dark:text-red-500"} />
              <p className={`text-[10px] font-bold uppercase tracking-wider ${suggestedTenant ? "text-emerald-600 dark:text-emerald-500" : "text-red-400 dark:text-red-500"
                }`}>
                {suggestedTenant ? "Vorschlag" : "Kein Treffer"}
              </p>
            </div>
            {suggestedTenant ? (
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200 truncate">
                  {suggestedTenant.name}
                </p>
                <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 flex items-center gap-1 truncate">
                  <MapPin size={10} className="shrink-0" />
                  {suggestedTenant.address} {suggestedTenant.unit && `• ${suggestedTenant.unit}`}
                </p>
                {suggestedTenant.phone && (
                  <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-mono flex items-center gap-1">
                    <Phone size={10} className="shrink-0" />
                    {suggestedTenant.phone}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-red-400 dark:text-red-500 italic">
                Keine automatische Zuordnung möglich.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-5 pb-3">
          <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg border border-red-100 dark:border-red-800">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-5 pb-5 flex flex-wrap gap-2">
        {/* Confirm suggested tenant */}
        {isReview && suggestedTenant && (
          <button
            onClick={() => handleAssign(suggestedTenant.id, "confirm")}
            disabled={isAssigning}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-sm focus:ring-slate-500 disabled:opacity-50 min-w-[140px]"
          >
            {isAssigning ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            Als &quot;{suggestedTenant.name}&quot; bestätigen
          </button>
        )}

        {/* Manual search toggle */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          disabled={isAssigning}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all disabled:opacity-50 min-w-[140px]"
        >
          <Search size={14} />
          Mieter suchen
        </button>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          disabled={isAssigning}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-slate-400 dark:text-slate-500 text-xs font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 transition-all disabled:opacity-50"
        >
          {isAssigning ? <Loader2 size={14} className="animate-spin" /> : <UserX size={14} />}
          Als Gast behalten
        </button>
      </div>

      {/* Manual Search Panel */}
      {isSearchOpen && (
        <div className="px-5 pb-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <Search size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Name, Adresse oder Telefon suchen..."
                className="flex-1 text-sm outline-none text-slate-900 dark:text-slate-100 bg-transparent placeholder-slate-400 dark:placeholder-slate-600"
              />
              <button
                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); setSearchResults([]); }}
                className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded"
              >
                <X size={14} />
              </button>
            </div>

            <div className="max-h-52 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
              {isSearching ? (
                <div className="p-6 text-center">
                  <Loader2 size={18} className="animate-spin text-slate-400 dark:text-slate-500 mx-auto" />
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((tenant) => (
                  <button
                    key={tenant.id}
                    onClick={() => handleAssign(tenant.id, "manual")}
                    disabled={isAssigning}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-left group disabled:opacity-50"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                      <User size={14} className="text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white truncate">{tenant.name}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                        {tenant.address} {tenant.unit && `• ${tenant.unit}`}
                      </p>
                    </div>
                    <CheckCircle2 size={16} className="text-slate-200 dark:text-slate-700 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors shrink-0" />
                  </button>
                ))
              ) : searchQuery.length >= 2 ? (
                <p className="p-6 text-center text-sm text-slate-400 dark:text-slate-500">Keine Ergebnisse gefunden.</p>
              ) : (
                <p className="p-6 text-center text-sm text-slate-400 dark:text-slate-500">Mindestens 2 Zeichen eingeben...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}