"use client";

import React, { useState } from "react";
import {
    Search,
    ChevronDown,
    Calendar as CalendarIcon,
    ArrowUpDown,
    X
} from "lucide-react";

interface TicketFilterBarProps {
    onSearch: (term: string) => void;
    onSortChange: (sortInfo: { by: string; direction: 'asc' | 'desc' }) => void;
    onDateRangeChange: (range: { from: string | null; to: string | null }) => void;
    totalResults?: number;
    initialSearch?: string;
    initialSortBy?: string;
    initialSortDir?: 'asc' | 'desc';
    initialDateFrom?: string;
    initialDateTo?: string;
}

export default function TicketFilterBar({
    onSearch,
    onSortChange,
    onDateRangeChange,
    totalResults,
    initialSearch = "",
    initialSortBy = "priority",
    initialSortDir = "desc",
    initialDateFrom = "",
    initialDateTo = ""
}: TicketFilterBarProps) {
    // Local state initialized from props (sync with URL)
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [sortBy, setSortBy] = useState(initialSortBy);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDir);

    const [dateFrom, setDateFrom] = useState(initialDateFrom);
    const [dateTo, setDateTo] = useState(initialDateTo);

    // Handlers
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleSortByChange = (value: string) => {
        setSortBy(value);
        onSortChange({ by: value, direction: sortDirection });
    };

    const handleSortDirectionChange = (value: 'asc' | 'desc') => {
        setSortDirection(value);
        onSortChange({ by: sortBy, direction: value });
    };

    const handleDateChange = (type: 'from' | 'to', value: string) => {
        const newFrom = type === 'from' ? value : dateFrom;
        const newTo = type === 'to' ? value : dateTo;

        if (type === 'from') setDateFrom(value);
        else setDateTo(value);

        // Only notify if we have a valid range or cleared it
        // Or just pass raw values and let parent handle logic
        onDateRangeChange({ from: newFrom || null, to: newTo || null });
    };

    const clearDates = () => {
        setDateFrom("");
        setDateTo("");
        onDateRangeChange({ from: null, to: null });
    };

    return (
        <div className="w-full bg-white border-b border-slate-200 p-4 sticky top-0 z-10 shadow-sm">
            <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">

                {/* Left: Filters & Sort */}
                <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <span className="text-[13px] font-bold text-slate-500 whitespace-nowrap uppercase tracking-wider">Sortieren nach:</span>

                        {/* Custom Select Wrapper: Sort By */}
                        <div className="relative group min-w-[140px]">
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortByChange(e.target.value)}
                                className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[14px] font-medium rounded-xl pl-4 pr-8 py-2.5 focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] outline-none transition-shadow cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                            >
                                <option value="priority">Priorität</option>
                                <option value="created_at">Erstellt am</option>
                                <option value="age">Alter (Älteste)</option>
                                <option value="status">Status</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Custom Select Wrapper: Direction */}
                        <div className="relative group min-w-[110px]">
                            <select
                                value={sortDirection}
                                onChange={(e) => handleSortDirectionChange(e.target.value as 'asc' | 'desc')}
                                className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[14px] font-medium rounded-xl pl-4 pr-8 py-2.5 focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] outline-none transition-shadow cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                            >
                                <option value="desc">Absteigend</option>
                                <option value="asc">Aufsteigend</option>
                            </select>
                            <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />

                    {/* Date Range Picker */}
                    <div className="flex items-center gap-2 w-full md:w-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                        <div className="relative flex-1">
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => handleDateChange('from', e.target.value)}
                                className="w-[110px] bg-transparent text-[13px] text-slate-600 dark:text-slate-300 font-medium px-2 py-1.5 outline-none focus:text-slate-900 dark:focus:text-white placeholder:text-slate-400"
                            />
                        </div>
                        <span className="text-slate-300 text-xs">-</span>
                        <div className="relative flex-1">
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => handleDateChange('to', e.target.value)}
                                className="w-[110px] bg-transparent text-[13px] text-slate-600 dark:text-slate-300 font-medium px-2 py-1.5 outline-none focus:text-slate-900 dark:focus:text-white placeholder:text-slate-400"
                            />
                        </div>
                        {(dateFrom || dateTo) && (
                            <button
                                onClick={clearDates}
                                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>

                </div>

                {/* Right: Search & Pagination */}
                <div className="flex items-center gap-4 w-full xl:w-auto">

                    <form onSubmit={handleSearchSubmit} className="flex relative w-full xl:w-80 group">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#19e66f] transition-colors" />
                        <input
                            type="text"
                            placeholder="Tickets suchen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-[70px] py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[14px] font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#19e66f] hover:bg-[#15d163] text-[#0f1714] text-[13px] font-bold rounded-lg transition-colors shadow-sm"
                        >
                            Los
                        </button>
                    </form>

                    {totalResults !== undefined && (
                        <div className="hidden 2xl:block text-[13px] font-medium text-slate-400 whitespace-nowrap">
                            Zeige <span className="font-bold text-slate-700">1-{Math.min(50, totalResults)}</span> von {totalResults}
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
