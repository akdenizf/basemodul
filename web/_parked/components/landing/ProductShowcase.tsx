"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Droplet, Thermometer, LayoutDashboard, Inbox, Users, Settings, Zap, TrendingUp, CheckCircle2, History, UploadCloud, AlertTriangle, Key, Bell, Building2 } from "lucide-react";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 40 },
    show: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 200, damping: 25 },
    },
};

export function ProductShowcase() {
    return (
        <motion.section
            id="cockpit"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="py-24 lg:py-32 xl:py-40 relative overflow-hidden"
        >
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 text-balance">
                        Ihr neues Cockpit.
                    </h2>
                    <p className="mt-6 text-lg text-slate-500 max-w-2xl mx-auto">
                        Behalten Sie alle Tickets, Aufzeichnungen und Auswertungen zentral
                        im Blick. Kein Excel mehr, kein Chaos.
                    </p>
                </div>

                <motion.div variants={itemVariants} className="relative mx-auto max-w-[1200px]">
                    {/* Glow effect behind dashboard */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-50/50 blur-[120px] rounded-full z-0" />

                    {/* The Dashboard Outer Frame */}
                    <div className="relative z-10 w-full rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 overflow-hidden flex flex-col aspect-[16/9] md:aspect-[16/10] lg:aspect-[16/9]">
                        {/* Fake Browser Title Bar */}
                        <div className="flex px-4 py-3 items-center border-b border-slate-100 bg-slate-50">
                            <div className="flex gap-2 mr-4">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                            </div>
                            <div className="flex-1 text-center">
                                <div className="inline-block bg-white border border-slate-200 rounded-md text-[10px] text-slate-400 px-8 py-1 font-mono">
                                    agenteq.de
                                </div>
                            </div>
                        </div>

                        {/* Dashboard App Grid */}
                        <div className="flex flex-1 bg-transparent min-h-[500px]">
                            {/* Left Sidebar (Collapsed) */}
                            <div className="hidden md:flex flex-col gap-6 w-[72px] border-r border-[#0A362B] bg-[#0A362B] py-6 shrink-0 items-center relative z-20">
                                <div className="h-10 w-10 bg-white shadow-sm rounded-xl mb-4 flex flex-shrink-0 items-center justify-center font-bold text-[#0A362B] text-lg">
                                    C
                                </div>

                                <div className="flex flex-col gap-3 w-full px-3">
                                    <div className="h-12 w-full rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center cursor-pointer transition-colors shadow-inner">
                                        <LayoutDashboard size={22} className="shrink-0" />
                                    </div>
                                    <div className="h-12 w-full rounded-xl bg-transparent text-slate-400 hover:text-white hover:bg-white/5 flex items-center justify-center cursor-pointer transition-all">
                                        <Inbox size={22} className="shrink-0" />
                                    </div>
                                    <div className="h-12 w-full rounded-xl bg-transparent text-slate-400 hover:text-white hover:bg-white/5 flex items-center justify-center cursor-pointer transition-all">
                                        <Users size={22} className="shrink-0" />
                                    </div>
                                    <div className="h-12 w-full rounded-xl bg-transparent text-slate-400 hover:text-white hover:bg-white/5 flex items-center justify-center cursor-pointer transition-all">
                                        <History size={22} className="shrink-0" />
                                    </div>
                                    <div className="h-12 w-full rounded-xl bg-transparent text-slate-400 hover:text-white hover:bg-white/5 flex items-center justify-center cursor-pointer transition-all">
                                        <UploadCloud size={22} className="shrink-0" />
                                    </div>
                                </div>

                                <div className="mt-auto flex flex-col w-full px-3">
                                    <div className="h-12 w-full rounded-xl bg-transparent text-slate-400 hover:text-white hover:bg-white/5 flex items-center justify-center cursor-pointer transition-all">
                                        <Settings size={22} className="shrink-0" />
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 flex flex-col p-6 xl:p-8 overflow-hidden z-10 bg-slate-50">
                                {/* Dashboard Header */}
                                <div className="flex justify-between items-center mb-8 relative z-20">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center justify-center shrink-0">
                                            <div className="w-10 h-10 flex items-center justify-center relative bg-emerald-50 rounded-lg">
                                                <Building2 className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <span className="text-[12px] font-bold text-slate-800 mt-1 uppercase tracking-wider">muster</span>
                                            <span className="text-[6px] font-bold text-slate-400 uppercase tracking-widest text-center">Hausverwaltung</span>
                                        </div>
                                        <div className="ml-2">
                                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Guten Abend, Horst Walter Müller! 👋</h3>
                                            <p className="text-slate-500 text-sm mt-1">Hier ist der aktuelle Status deiner Immobilien.</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-200 shadow-sm backdrop-blur-md">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        System Online
                                    </div>
                                </div>

                                {/* KPI Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors">
                                                <Inbox size={18} strokeWidth={2} />
                                            </div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-500 ring-4 ring-slate-100 shadow-sm mt-1"></div>
                                        </div>
                                        <div className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">18</div>
                                        <div className="text-sm font-medium text-slate-500 mt-1">Offene Tickets</div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-rose-200/60 p-5 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                                        {/* Red highlight shape from screenshot */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-2xl z-0 transform translate-x-8 -translate-y-8" />
                                        <div className="relative z-10 flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-xl border border-rose-100 flex items-center justify-center text-rose-500 bg-white shadow-sm">
                                                <AlertTriangle size={18} strokeWidth={2.5} />
                                            </div>
                                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-rose-50 shadow-sm mt-1"></div>
                                        </div>
                                        <div className="relative z-10 text-3xl font-extrabold text-rose-600 mt-2 tracking-tight">2 Notfälle</div>
                                        <div className="relative z-10 text-sm font-medium text-rose-500 mt-1">Notfälle / High Prio</div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm relative transition-all hover:shadow-md">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-xl border border-emerald-100 flex items-center justify-center text-emerald-500 bg-emerald-50 aspect-square">
                                                <CheckCircle2 size={18} strokeWidth={2.5} />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">14</div>
                                        <div className="text-sm font-medium text-slate-500 mt-1">Heute erledigt</div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm relative transition-all hover:shadow-md">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-xl border border-blue-100 flex items-center justify-center text-blue-500 bg-blue-50">
                                                <TrendingUp size={18} strokeWidth={2.5} />
                                            </div>
                                        </div>
                                        <div className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">92%</div>
                                        <div className="text-sm font-medium text-slate-500 mt-1">Abschlussquote (24h)</div>
                                    </div>
                                </div>

                                {/* Charts Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    {/* Donut Chart Box */}
                                    <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm flex flex-col relative overflow-hidden group">
                                        <div className="mb-8">
                                            <h4 className="font-bold text-slate-900 text-sm tracking-wide">Ticket Kategorien</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">Dieser Monat</p>
                                        </div>
                                        <div className="flex-1 flex gap-8 items-center justify-between px-4 sm:px-8">
                                            {/* CSS Donut Chart */}
                                            <div className="relative w-36 h-36 rounded-full flex items-center justify-center overflow-hidden shrink-0 transition-transform group-hover:scale-105" style={{ background: 'conic-gradient(#f97316 0% 68%, #3b82f6 68% 100%)' }}>
                                                <div className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center">
                                                    <div className="w-24 h-24 bg-white rounded-full z-10 border-4 border-slate-50/50 shadow-inner"></div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-6 flex-1 w-full max-w-[120px]">
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div>
                                                        <span className="text-xs font-semibold text-slate-600">Heizung</span>
                                                    </div>
                                                    <span className="text-xs font-extrabold text-slate-900">68%</span>
                                                </div>
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                                        <span className="text-xs font-semibold text-slate-600">Wasser/Sanitär</span>
                                                    </div>
                                                    <span className="text-xs font-extrabold text-slate-900">32%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bar Chart Box */}
                                    <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm flex flex-col pt-5">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm tracking-wide">Aktivität</h4>
                                                <p className="text-xs text-slate-400 mt-0.5">Letzte 7 Tage</p>
                                            </div>
                                            <div className="flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded-md">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2 h-2 bg-slate-800 rounded-sm"></div>
                                                    <span className="text-[10px] font-medium text-slate-600 tracking-wide">Eingegangen</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-sm"></div>
                                                    <span className="text-[10px] font-medium text-slate-600 tracking-wide">Gelöst</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col justify-end mt-2 h-[140px] relative">
                                            {/* Realistic Y-Axis markings */}
                                            <div className="relative w-full h-full border-b-[1.5px] border-slate-200/60 border-dashed">
                                                <div className="absolute top-0 w-full border-t-[1.5px] border-slate-200/60 border-dashed">
                                                    <span className="absolute -left-6 -top-[7px] text-[9px] text-slate-400 font-medium">12</span>
                                                </div>
                                                <div className="absolute top-[25%] w-full border-t-[1.5px] border-slate-200/60 border-dashed">
                                                    <span className="absolute -left-6 -top-[7px] text-[9px] text-slate-400 font-medium">9</span>
                                                </div>
                                                <div className="absolute top-[50%] w-full border-t-[1.5px] border-slate-200/60 border-dashed">
                                                    <span className="absolute -left-6 -top-[7px] text-[9px] text-slate-400 font-medium">6</span>
                                                </div>
                                                <div className="absolute top-[75%] w-full border-t-[1.5px] border-slate-200/60 border-dashed">
                                                    <span className="absolute -left-6 -top-[7px] text-[9px] text-slate-400 font-medium">3</span>
                                                </div>
                                                <span className="absolute -left-6 -top-[7px] translate-y-full mt-[115px] text-[9px] text-slate-400 font-medium">0</span>

                                                <div className="absolute bottom-0 left-0 w-full h-[100%] flex items-end justify-between px-4 sm:px-8 z-10 bottom-line-adjust">
                                                    {/* Sunday */}
                                                    <div className="w-8 flex justify-center items-end gap-[2px] group relative h-[15%]">
                                                        <span className="absolute -bottom-6 text-[10px] text-slate-400 font-medium w-full text-center">So</span>
                                                        <div className="w-[10px] bg-slate-800 rounded-t h-full group-hover:bg-slate-700 transition-colors shadow-sm" />
                                                        <div className="w-[10px] bg-emerald-500 rounded-t h-[40%] group-hover:bg-emerald-400 transition-colors shadow-sm" />
                                                    </div>
                                                    
                                                    {/* Monday */}
                                                    <div className="w-8 flex justify-center items-end gap-[2px] group relative h-[85%]">
                                                        <span className="absolute -bottom-6 text-[10px] text-slate-400 font-medium w-full text-center">Mo</span>
                                                        <div className="w-[10px] bg-slate-800 rounded-t h-full group-hover:bg-slate-700 transition-colors shadow-sm" />
                                                        <div className="w-[10px] bg-emerald-500 rounded-t h-[65%] group-hover:bg-emerald-400 transition-colors shadow-sm" />
                                                    </div>
                                                    
                                                    {/* Tuesday */}
                                                    <div className="w-8 flex justify-center items-end gap-[2px] group relative h-[70%]">
                                                        <span className="absolute -bottom-6 text-[10px] text-slate-400 font-medium w-full text-center">Di</span>
                                                        <div className="w-[10px] bg-slate-800 rounded-t h-[60%] group-hover:bg-slate-700 transition-colors shadow-sm" />
                                                        <div className="w-[10px] bg-emerald-500 rounded-t h-full group-hover:bg-emerald-400 transition-colors shadow-sm" />
                                                    </div>

                                                    {/* Wednesday */}
                                                    <div className="w-8 flex justify-center items-end gap-[2px] group relative h-[70%]">
                                                        <span className="absolute -bottom-6 text-[10px] text-slate-400 font-medium w-full text-center">Mi</span>
                                                        <div className="w-[10px] bg-slate-800 rounded-t h-full group-hover:bg-slate-700 transition-colors shadow-sm" />
                                                        <div className="w-[10px] bg-emerald-500 rounded-t h-[80%] group-hover:bg-emerald-400 transition-colors shadow-sm" />
                                                    </div>

                                                    {/* Thursday */}
                                                    <div className="w-8 flex justify-center items-end gap-[2px] group relative h-[90%]">
                                                        <span className="absolute -bottom-6 text-[10px] text-slate-400 font-medium w-full text-center">Do</span>
                                                        <div className="w-[10px] bg-slate-800 rounded-t h-full group-hover:bg-slate-700 transition-colors shadow-sm" />
                                                        <div className="w-[10px] bg-emerald-500 rounded-t h-[70%] group-hover:bg-emerald-400 transition-colors shadow-sm" />
                                                    </div>

                                                    {/* Friday */}
                                                    <div className="w-8 flex justify-center items-end gap-[2px] group relative h-[50%]">
                                                        <span className="absolute -bottom-6 text-[10px] text-slate-400 font-medium w-full text-center">Fr</span>
                                                        <div className="w-[10px] bg-slate-800 rounded-t h-[80%] group-hover:bg-slate-700 transition-colors shadow-sm" />
                                                        <div className="w-[10px] bg-emerald-500 rounded-t h-full group-hover:bg-emerald-400 transition-colors shadow-sm" />
                                                    </div>

                                                    {/* Saturday */}
                                                    <div className="w-8 flex justify-center items-end gap-[2px] group relative h-[25%]">
                                                        <span className="absolute -bottom-6 text-[10px] text-slate-400 font-medium w-full text-center">Sa</span>
                                                        <div className="w-[10px] bg-slate-800 rounded-t h-[50%] group-hover:bg-slate-700 transition-colors shadow-sm" />
                                                        <div className="w-[10px] bg-emerald-500 rounded-t h-[100%] group-hover:bg-emerald-400 transition-colors shadow-sm" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Row */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                                    <div className="lg:col-span-2 flex flex-col h-full min-h-[160px]">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-slate-900 text-sm tracking-wide">
                                                Neueste Aktivitäten
                                            </h4>
                                            <button className="text-[11px] font-bold text-slate-500 flex items-center gap-1 hover:text-slate-900 transition-colors">
                                                Alle Tickets <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>
                                        <div className="flex-1 bg-white rounded-xl border border-slate-200/60 shadow-sm p-4 mt-4 flex flex-col gap-3">
                                            {/* Realistic Activity Item 1 */}
                                            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
                                                    <CheckCircle2 size={16} strokeWidth={2.5} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm font-bold text-slate-900">Wasserrohrbruch behoben</p>
                                                        <span className="text-[10px] font-medium text-slate-400">Vor 12 Min</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Fa. Heizing & Söhne hat den Einsatz in der Goethestraße 14 erfolgreich abgeschlossen. Mieter wurde informiert.</p>
                                                </div>
                                            </div>

                                            {/* Realistic Activity Item 2 */}
                                            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 mt-0.5">
                                                    <Inbox size={16} strokeWidth={2.5} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-sm font-bold text-slate-900">Neues Ticket: Heizungsausfall</p>
                                                        <span className="text-[10px] font-medium text-slate-400">Vor 45 Min</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Anruf von Herr Schmidt (Schillerplatz 3): Heizkörper im Wohnzimmer werden seit gestern nicht mehr warm.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Widget */}
                                    <div className="flex flex-col h-full min-h-[160px]">
                                        <div className="flex-1 rounded-xl bg-white border border-slate-200/60 p-5 flex flex-col shadow-sm relative group transition-all hover:shadow-md hover:border-slate-300">

                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <span className="text-[9px] font-bold tracking-widest uppercase text-emerald-500">((●)) STANDBY</span>
                                                    </div>
                                                    <h4 className="text-slate-900 font-bold text-base leading-tight tracking-tight mt-1">AGENTEQ AI</h4>
                                                    <p className="text-slate-500 text-[10px] font-medium mt-0.5">Bereit für eingehende Anrufe</p>

                                                    {/* Minimal Pulse/Sound Waves beneath subtitle */}
                                                    <div className="flex items-center justify-start gap-1 h-3 mt-4 opacity-75">
                                                        <div className="w-1.5 h-3 rounded-full bg-emerald-400/80 animate-pulse"></div>
                                                        <div className="w-1.5 h-2 rounded-full bg-emerald-400/80 animate-pulse" style={{ animationDelay: '150ms' }}></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                                    </div>
                                                </div>

                                                <div className="text-slate-800 p-1">
                                                    {/* Abstract waveform from screenshot */}
                                                    <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2 16L10 16L16 4L24 28L32 10L38 16L46 16" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M10 16L16 8L24 24L32 12L38 16" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" className="translate-x-1" />
                                                        <path d="M10 16L16 6L24 26L32 10L38 16" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" className="-translate-x-1" />
                                                    </svg>
                                                </div>
                                            </div>

                                            <div className="mt-auto">
                                                <p className="text-slate-400 text-[10px] font-medium mb-3 flex items-center gap-1.5">
                                                    Die KI überwacht alle Anrufe im Hintergrund.
                                                </p>
                                                <button className="w-auto px-4 py-2 bg-[#1B2B38] hover:bg-[#0f172a] text-white rounded-md text-[11px] font-semibold transition-all shadow-sm">
                                                    Live-Log ansehen
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}
