"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar-motion";
import {
    LayoutDashboard,
    Users,
    History,
    Settings,
    Ticket,
    UploadCloud,
    LogOut,
    LifeBuoy
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AppSidebar() {
    const [open, setOpen] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const supabase = createClient();
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('organization_id')
                    .eq('user_id', session.user.id)
                    .maybeSingle();

                if (!profile?.organization_id) return;

                const { data: org } = await supabase
                    .from('organizations')
                    .select('logo_url')
                    .eq('id', profile.organization_id)
                    .maybeSingle();

                if (org?.logo_url) setLogoUrl(org.logo_url);
            } catch (err) {
                console.error('Failed to fetch org logo:', err);
            }
        };
        fetchLogo();
    }, []);

    const links = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: <LayoutDashboard className="text-slate-400 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Tickets",
            href: "/tickets",
            icon: <Ticket className="text-slate-400 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Mieterstamm",
            href: "/tenants",
            icon: <Users className="text-slate-400 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Verlauf",
            href: "/history",
            icon: <History className="text-slate-400 h-5 w-5 flex-shrink-0" />,
        },
        {
            label: "Import",
            href: "/import",
            icon: <UploadCloud className="text-slate-400 h-5 w-5 flex-shrink-0" />,
        },
    ];

    return (
        <div className={cn("flex flex-col md:flex-row bg-[#fafaf8] h-full border-r border-slate-200")}>
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo logoUrl={logoUrl} /> : <LogoIcon logoUrl={logoUrl} />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <SidebarSupportBox />
                        <div className="border-t border-slate-200 my-2" />
                        <SidebarLink
                            link={{
                                label: "Einstellungen",
                                href: "/settings",
                                icon: <Settings className="text-slate-400 h-5 w-5 flex-shrink-0" />,
                            }}
                        />
                        <SidebarLogoutButton />
                    </div>
                </SidebarBody>
            </Sidebar>
        </div>
    );
}

const SidebarLogoutButton = () => {
    const { open, animate } = useSidebar();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            title="Abmelden"
            className={cn(
                "text-slate-500 flex items-center justify-start gap-2 w-full py-2 px-1 rounded-lg font-medium text-sm transition-all",
                "bg-transparent border-none cursor-pointer group/sidebar relative z-20",
                "hover:bg-red-50 hover:text-red-500"
            )}
        >
            <div className="h-5 w-5 flex-shrink-0 text-inherit">
                <LogOut className="h-5 w-5" />
            </div>
            <motion.span
                animate={{
                    display: animate ? (open ? "inline-block" : "none") : "inline-block",
                    opacity: animate ? (open ? 1 : 0) : 1,
                }}
                className="text-inherit text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block font-medium"
            >
                Abmelden
            </motion.span>
        </button>
    );
};

const SidebarSupportBox = () => {
    const { open, animate } = useSidebar();

    if (animate && !open) {
        return (
            <Link
                href="/help"
                className="flex items-center justify-center p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors mb-2"
                title="Support-Center"
            >
                <LifeBuoy className="h-5 w-5 text-slate-500" />
            </Link>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="m-2 p-4 rounded-xl bg-slate-50 border border-slate-100"
        >
            <h4 className="text-slate-900 font-bold text-[13px] tracking-tight">Hilfe benötigt?</h4>
            <p className="text-slate-500 text-[11px] mt-1 font-medium">Kontaktieren Sie den Support</p>
            <Link
                href="/help"
                className="text-[#19e66f] hover:text-[#12b355] text-[12px] font-bold mt-3 block transition-colors"
            >
                Support-Center &rarr;
            </Link>
        </motion.div>
    );
};

export const Logo = ({ logoUrl }: { logoUrl?: string | null }) => {
    return (
        <Link href="/dashboard" className="font-normal flex items-center gap-3 text-sm py-1 relative z-20 pl-2">
            {logoUrl ? (
                <Image src={logoUrl} alt="Logo" width={32} height={32} unoptimized className="h-8 w-8 rounded-lg object-contain bg-slate-50 p-1 flex-shrink-0 border border-slate-200" />
            ) : (
                <Image src="/icon.svg" alt="Callfolio" width={32} height={32} className="h-8 w-8 rounded-lg object-contain" />
            )}
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
                <span className="font-display text-2xl font-bold tracking-tight text-[#19e66f] whitespace-pre leading-none">
                    {logoUrl ? '' : 'Callfolio'}
                </span>
                {logoUrl && (
                    <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">Powered by Callfolio</span>
                )}
            </motion.span>
        </Link>
    );
};

export const LogoIcon = ({ logoUrl }: { logoUrl?: string | null }) => {
    return (
        <Link href="/dashboard" className="font-normal flex items-center text-sm py-1 relative z-20 justify-center">
            {logoUrl ? (
                <Image src={logoUrl} alt="Logo" width={32} height={32} unoptimized className="h-8 w-8 rounded-lg object-contain bg-slate-50 p-1 flex-shrink-0 border border-slate-200" />
            ) : (
                <Image src="/icon.svg" alt="Callfolio" width={32} height={32} className="h-8 w-8 rounded-lg object-contain" />
            )}
        </Link>
    );
};
