"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, CheckCircle2, AlertCircle, Edit3 } from "lucide-react";
import type { Tenant } from "@/lib/types";

interface TenantListItemProps {
    tenant: Tenant;
    onEdit?: (id: string) => void;
}

export default function TenantListItem({ tenant, onEdit }: TenantListItemProps) {
    // Get initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Verification status based on phone presence only (as requested)
    const isVerified = !!tenant.phone;

    return (
        <div className="group bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-5 hover:border-[#19e66f]/50 hover:shadow-md transition-all duration-300">
            {/* 1. Avatar */}
            <div className="flex-shrink-0">
                <Avatar className="h-12 w-12 border border-slate-200 shadow-sm">
                    <AvatarFallback className="bg-slate-100 text-slate-700 font-display font-bold">
                        {getInitials(tenant.name)}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* 2. Info (Name & Address) */}
            <div className="flex-1 min-w-0">
                <h3 className="text-[16px] font-bold text-slate-900 truncate tracking-tight">
                    {tenant.name}
                </h3>
                <p className="text-[13px] font-medium text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                    <span className="truncate">{tenant.address}, {tenant.unit}</span>
                </p>
            </div>

            {/* 3. Contact Info */}
            <div className="flex-shrink-0 flex flex-col gap-2 text-[13px] font-medium text-slate-600 min-w-[200px]">
                <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{tenant.phone || "Keine Telefonnummer"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{tenant.email || "Keine E-Mail"}</span>
                </div>
            </div>

            {/* 4. Status Badge */}
            <div className="flex-shrink-0 min-w-[120px] flex items-center">
                {isVerified ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#19e66f]/10 text-[#12b355] text-[11px] font-bold uppercase tracking-widest border border-[#19e66f]/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verifiziert</span>
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 text-[11px] font-bold uppercase tracking-widest border border-amber-100">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Unvollständig</span>
                    </div>
                )}
            </div>

            {/* 5. Action */}
            <div className="flex-shrink-0 pl-4 border-l border-slate-100">
                <button
                    onClick={() => onEdit?.(tenant.id)}
                    className="p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors shadow-sm"
                >
                    <Edit3 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
