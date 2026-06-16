// Map English DB values to German UI labels

export const CATEGORY_CONFIG: Record<string, {
    label: string;
    icon: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
}> = {
    PLUMBING:        { label: 'Sanitär',        icon: '💧', bgClass: 'bg-blue-50 dark:bg-blue-950/40',    textClass: 'text-blue-700 dark:text-blue-300',    borderClass: 'border-blue-100 dark:border-blue-800' },
    HEATING:         { label: 'Heizung',         icon: '🔥', bgClass: 'bg-orange-50 dark:bg-orange-950/40', textClass: 'text-orange-700 dark:text-orange-300', borderClass: 'border-orange-100 dark:border-orange-800' },
    ELECTRICAL:      { label: 'Elektrik',        icon: '⚡', bgClass: 'bg-yellow-50 dark:bg-yellow-950/40', textClass: 'text-yellow-700 dark:text-yellow-300', borderClass: 'border-yellow-100 dark:border-yellow-800' },
    LOCKSMITH:       { label: 'Schlüsseldienst', icon: '🔑', bgClass: 'bg-slate-50 dark:bg-slate-800/40',   textClass: 'text-slate-600 dark:text-slate-400',  borderClass: 'border-slate-200 dark:border-slate-700' },
    BUILDING:        { label: 'Gebäude',         icon: '🏗️', bgClass: 'bg-purple-50 dark:bg-purple-950/40', textClass: 'text-purple-700 dark:text-purple-300', borderClass: 'border-purple-100 dark:border-purple-800' },
    STRUCTURAL:      { label: 'Gebäude',         icon: '🏗️', bgClass: 'bg-purple-50 dark:bg-purple-950/40', textClass: 'text-purple-700 dark:text-purple-300', borderClass: 'border-purple-100 dark:border-purple-800' },
    NOISE_COMPLAINT: { label: 'Lärm',            icon: '🔊', bgClass: 'bg-red-50 dark:bg-red-950/40',       textClass: 'text-red-600 dark:text-red-400',      borderClass: 'border-red-100 dark:border-red-800' },
    ADMIN:           { label: 'Verwaltung',      icon: '📋', bgClass: 'bg-slate-50 dark:bg-slate-800/40',   textClass: 'text-slate-600 dark:text-slate-400',  borderClass: 'border-slate-200 dark:border-slate-700' },
    BILLING:         { label: 'Abrechnung',      icon: '💶', bgClass: 'bg-slate-50 dark:bg-slate-800/40',   textClass: 'text-slate-600 dark:text-slate-400',  borderClass: 'border-slate-200 dark:border-slate-700' },
    COMMERCIAL:      { label: 'Gewerbe',         icon: '🏪', bgClass: 'bg-slate-50 dark:bg-slate-800/40',   textClass: 'text-slate-600 dark:text-slate-400',  borderClass: 'border-slate-200 dark:border-slate-700' },
    UTILITIES:       { label: 'Versorgung',      icon: '🔌', bgClass: 'bg-slate-50 dark:bg-slate-800/40',   textClass: 'text-slate-600 dark:text-slate-400',  borderClass: 'border-slate-200 dark:border-slate-700' },
    OTHER:           { label: 'Sonstiges',       icon: '📌', bgClass: 'bg-slate-50 dark:bg-slate-800/40',   textClass: 'text-slate-600 dark:text-slate-400',  borderClass: 'border-slate-200 dark:border-slate-700' },
};

export function getCategoryConfig(category?: string | null) {
    if (!category) return CATEGORY_CONFIG.OTHER;
    return CATEGORY_CONFIG[category.toUpperCase()] ?? CATEGORY_CONFIG.OTHER;
}

export const URGENCY_DE: Record<string, string> = {
    CRITICAL: 'Notfall',
    EMERGENCY: 'Notfall', // Fallback
    HIGH: 'Hoch',
    URGENT: 'Hoch', // Fallback
    MEDIUM: 'Mittel',
    LOW: 'Niedrig',
};

export const CATEGORY_DE: Record<string, string> = {
    PLUMBING: 'Wasser/Sanitär',
    HEATING: 'Heizung',
    ELECTRICAL: 'Elektro',
    BUILDING: 'Gebäude',
    STRUCTURAL: 'Gebäude',
    NOISE_COMPLAINT: 'Lärm',
    ADMIN: 'Sonstiges',
    COMMERCIAL: 'Sonstiges',
    BILLING: 'Sonstiges',
    UTILITIES: 'Sonstiges',
    OTHER: 'Sonstiges',
};

export function translateUrgency(urgency?: string | null): string {
    if (!urgency) return 'Unbekannt';
    const val = urgency.toUpperCase();
    return URGENCY_DE[val] || val;
}

export function translateCategory(category?: string | null): string {
    if (!category) return 'Sonstiges';
    const val = category.toUpperCase();
    return CATEGORY_DE[val] || val;
}
