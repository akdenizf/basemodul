"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import {
    Clock,
    Mail,
    User,
    Eye,
    RefreshCw,
    Edit,
    Ticket,
    Zap,
    Search,
    Camera,
    Bot,
    Phone,
    Monitor,
    Loader2,
    Paperclip,
    MessageSquare,
    ImageOff,
    X,
    AlertTriangle,
} from 'lucide-react';
import { getRelativeTime, formatActivityDescription } from '@/lib/audit-log';
import type { TicketActivityWithContext } from '@/lib/audit-log';

// ============================================================
// CALLFOLIO v5.5 – GLOBAL HISTORY CLIENT
// ============================================================

// --- Allowed Supabase storage origin for multi-domain safety ---
const ALLOWED_IMAGE_HOST = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
    : '';

function isAllowedImageUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' && parsed.hostname === ALLOWED_IMAGE_HOST;
    } catch {
        return false;
    }
}

// --- Safe metadata extraction ---

function extractFileUrl(metadata: any): string | null {
    if (!metadata || typeof metadata !== 'object') return null;
    const url = metadata.file_url;
    if (typeof url !== 'string' || url.length === 0) return null;
    return isAllowedImageUrl(url) ? url : null;
}

// --- Filter types ---

type FilterType = 'all' | 'ai' | 'status' | 'email' | 'attachments';

const FILTERS: { key: FilterType; label: string; types?: string }[] = [
    { key: 'all', label: 'Alle' },
    { key: 'ai', label: 'KI-Aktivität', types: 'created' },
    { key: 'status', label: 'Status-Updates', types: 'status_changed,updated' },
    { key: 'email', label: 'E-Mails', types: 'email_sent' },
    { key: 'attachments', label: 'Anhänge', types: 'photo_requested,attachment_uploaded' },
];

// --- Icon & colour helpers (from ActivityTimeline pattern) ---

function getActivityIcon(type: string) {
    const iconProps = { size: 16, className: "text-white" };
    switch (type) {
        case 'created': return <Ticket {...iconProps} />;
        case 'email_sent': return <Mail {...iconProps} />;
        case 'status_changed': return <RefreshCw {...iconProps} />;
        case 'assigned': return <User {...iconProps} />;
        case 'reviewed': return <Eye {...iconProps} />;
        case 'updated': return <Edit {...iconProps} />;
        case 'manual_action': return <Zap {...iconProps} />;
        case 'photo_requested': return <MessageSquare {...iconProps} />;
        case 'attachment_uploaded': return <Camera {...iconProps} />;
        case 'system_error': return <AlertTriangle {...iconProps} />;
        default: return <Clock {...iconProps} />;
    }
}

function getActivityColor(type: string) {
    switch (type) {
        case 'created': return 'bg-blue-500';
        case 'email_sent': return 'bg-green-500';
        case 'status_changed': return 'bg-purple-500';
        case 'assigned': return 'bg-slate-700';
        case 'reviewed': return 'bg-yellow-500';
        case 'updated': return 'bg-gray-500';
        case 'manual_action': return 'bg-red-500';
        case 'photo_requested': return 'bg-teal-500';
        case 'attachment_uploaded': return 'bg-amber-500';
        case 'system_error': return 'bg-amber-500';
        default: return 'bg-gray-400';
    }
}

function getCategoryIcon(type: string) {
    switch (type) {
        case 'created': return <Bot size={12} className="text-blue-500" />;
        case 'email_sent': return <Mail size={12} className="text-green-500" />;
        case 'status_changed':
        case 'updated': return <Monitor size={12} className="text-purple-500" />;
        case 'assigned': return <User size={12} className="text-slate-600" />;
        case 'reviewed': return <Eye size={12} className="text-yellow-600" />;
        case 'manual_action': return <Phone size={12} className="text-red-500" />;
        case 'photo_requested': return <MessageSquare size={12} className="text-teal-500" />;
        case 'attachment_uploaded': return <Camera size={12} className="text-amber-500" />;
        case 'system_error': return <AlertTriangle size={12} className="text-amber-500" />;
        default: return <Clock size={12} className="text-gray-400" />;
    }
}

// ============================================================
// Lightbox Component
// ============================================================

interface LightboxProps {
    imageUrl: string;
    ticketCode?: string | null;
    ticketId?: string;
    timestamp?: string;
    onClose: () => void;
}

function ImageLightbox({ imageUrl, ticketCode, ticketId, timestamp, onClose }: LightboxProps) {
    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    // Prevent body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const [imgError, setImgError] = useState(false);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-5 right-5 z-[60] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Schließen (Esc)"
            >
                <X size={20} />
            </button>

            {/* Image container */}
            <div
                className="relative max-w-[90vw] max-h-[85vh] animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {imgError ? (
                    <div className="flex flex-col items-center justify-center gap-3 p-12 bg-neutral-900 rounded-2xl border border-neutral-700">
                        <ImageOff size={48} className="text-neutral-500" />
                        <p className="text-sm text-neutral-400 font-medium">Bild nicht verfügbar</p>
                        <p className="text-xs text-neutral-500">Die URL ist möglicherweise abgelaufen.</p>
                    </div>
                ) : (
                    <Image
                        src={imageUrl}
                        alt="Foto-Anhang Vollbild"
                        width={1200}
                        height={900}
                        unoptimized
                        className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-xl shadow-2xl"
                        onError={() => setImgError(true)}
                    />
                )}

                {/* Footer bar */}
                <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-4">
                    {ticketCode && ticketId && (
                        <Link
                            href={`/tickets?id=${ticketId}` as any}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors"
                            onClick={e => e.stopPropagation()}
                        >
                            <Ticket size={12} />
                            #{ticketCode}
                        </Link>
                    )}
                    {timestamp && (
                        <span className="flex items-center gap-1 text-[10px] text-white/60">
                            <Clock size={10} />
                            {getRelativeTime(timestamp)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// Thumbnail with fallback
// ============================================================

function SafeThumbnail({
    src,
    onClick,
}: {
    src: string;
    onClick: () => void;
}) {
    const [error, setError] = useState(false);

    if (error) {
        return (
            <div
                className="shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-50"
                title="Bild nicht verfügbar"
            >
                <ImageOff size={16} className="text-slate-400" />
            </div>
        );
    }

    return (
        <button
            onClick={onClick}
            className="shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-slate-200 hover:border-slate-500 transition-colors shadow-sm group-hover:shadow-md cursor-pointer relative"
            title="Foto-Vorschau – Klicken für Vollbild"
        >
            <Image
                src={src}
                alt="Foto-Anhang"
                fill
                sizes="48px"
                className="object-cover"
                onError={() => setError(true)}
            />
        </button>
    );
}

// ============================================================
// Main Component
// ============================================================

export default function HistoryPageClient() {
    const [activities, setActivities] = useState<TicketActivityWithContext[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Initial mount query param check
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tabParam = params.get('tab');
            if (tabParam === 'ki-aktivitaet' || tabParam === 'ai') {
                setActiveFilter('ai');
            }
        }
    }, []);

    // Lightbox state
    const [lightboxData, setLightboxData] = useState<{
        url: string;
        ticketCode?: string | null;
        ticketId?: string;
        timestamp?: string;
    } | null>(null);

    const loadActivities = useCallback(async (filter: FilterType, search: string) => {
        try {
            setLoading(true);
            setError(null);

            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            const headers: Record<string, string> = {};
            if (session?.access_token) {
                headers.Authorization = `Bearer ${session.access_token}`;
            }

            const params = new URLSearchParams();
            const filterDef = FILTERS.find(f => f.key === filter);
            if (filterDef?.types) params.set('type', filterDef.types);
            if (search.trim()) params.set('search', search.trim());
            params.set('limit', '100');

            const response = await fetch(`/api/admin/history?${params.toString()}`, {
                credentials: 'include',
                headers,
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            setActivities(data.activities || []);
        } catch (err) {
            console.error('Failed to load history:', err);
            setError('Verlauf konnte nicht geladen werden');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load & filter changes
    useEffect(() => {
        loadActivities(activeFilter, searchQuery);
    }, [activeFilter, loadActivities]); // eslint-disable-line react-hooks/exhaustive-deps

    // Debounced search
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            loadActivities(activeFilter, value);
        }, 300);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-transparent">
            {/* Header */}
            <div className="shrink-0 px-8 py-6 border-b border-slate-200 bg-white z-10 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">Verlauf</h1>
                            <p className="text-[13px] text-slate-500 font-medium">
                                {loading ? 'Laden…' : `${activities.length} Einträge geladen`}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => loadActivities(activeFilter, searchQuery)}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-900 shadow-sm border border-transparent hover:border-slate-200"
                        title="Aktualisieren"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                {/* Filter bar + Search */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    {/* Filter pills */}
                    <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
                        {FILTERS.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setActiveFilter(f.key)}
                                className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all duration-200 ${activeFilter === f.key
                                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:max-w-md">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => handleSearchChange(e.target.value)}
                            placeholder="Ticket-ID oder Mitarbeiter suchen…"
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#19e66f]/30 focus:border-[#19e66f] transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Activity List */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="max-w-4xl mx-auto">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex items-center gap-4 bg-white rounded-xl border border-slate-100 p-5 shadow-sm animate-pulse">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                                    <div className="h-3 bg-slate-50 rounded w-1/2" />
                                </div>
                                <div className="h-6 w-16 bg-slate-50 rounded-lg" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                            <Clock size={28} className="text-red-500" />
                        </div>
                        <p className="text-[15px] font-bold text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => loadActivities(activeFilter, searchQuery)}
                            className="text-[13px] font-bold text-slate-500 hover:text-slate-900 bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-sm transition-colors"
                        >
                            Erneut versuchen
                        </button>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-100">
                            <Clock size={32} className="text-slate-300" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-slate-900 mb-2">Keine Einträge gefunden</h3>
                        <p className="text-[14px] font-medium text-slate-500">
                            {searchQuery ? 'Versuche einen anderen Suchbegriff.' : 'Es gibt noch keine Aktivitäten in diesem Bereich.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activities.map(activity => (
                            <ActivityRow
                                key={activity.id}
                                activity={activity}
                                onOpenLightbox={(url) => setLightboxData({
                                    url,
                                    ticketCode: activity.ticket_code,
                                    ticketId: activity.ticket_id,
                                    timestamp: activity.created_at,
                                })}
                            />
                        ))}
                    </div>
                )}
                </div>
            </div>

            {/* Lightbox overlay */}
            {lightboxData && (
                <ImageLightbox
                    imageUrl={lightboxData.url}
                    ticketCode={lightboxData.ticketCode}
                    ticketId={lightboxData.ticketId}
                    timestamp={lightboxData.timestamp}
                    onClose={() => setLightboxData(null)}
                />
            )}
        </div>
    );
}

// ============================================================
// Activity Row
// ============================================================

function ActivityRow({
    activity,
    onOpenLightbox,
}: {
    activity: TicketActivityWithContext;
    onOpenLightbox: (url: string) => void;
}) {
    const isSystem = activity.admin_email === 'system@callfolio.io';
    const isAttachmentType = activity.activity_type === 'attachment_uploaded' || activity.activity_type === 'photo_requested';
    const thumbnailUrl = extractFileUrl(activity.metadata);

    return (
        <div className="group flex items-stretch bg-white rounded-xl border border-slate-200 hover:border-[#19e66f]/50 hover:shadow-md transition-all duration-300 overflow-hidden">
            {/* Left: coloured bar */}
            <div className={`w-1.5 shrink-0 ${getActivityColor(activity.activity_type)}`} />

            <div className="flex items-center gap-5 p-5 flex-1 min-w-0">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getActivityColor(activity.activity_type)} shadow-sm transition-transform group-hover:scale-110`}>
                    {getActivityIcon(activity.activity_type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-slate-900 truncate leading-snug">
                        {formatActivityDescription(activity)}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        {/* Category icon */}
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                            {getCategoryIcon(activity.activity_type)}
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Kategorie</span>
                        </span>

                        {/* Timestamp */}
                        <span className="text-[12px] font-bold text-slate-400 flex items-center gap-1.5">
                            <Clock size={12} />
                            {getRelativeTime(activity.created_at)}
                        </span>

                        {/* Admin badge */}
                        {!isSystem && activity.admin_email && (
                            <span className="text-[11px] bg-[#19e66f]/10 text-[#0f1714] px-2 py-0.5 rounded-md font-bold border border-[#19e66f]/20">
                                {activity.admin_email.split('@')[0]}
                            </span>
                        )}

                        {/* Visual context indicator */}
                        {(activity.has_attachments || isAttachmentType) && (
                            thumbnailUrl ? (
                                <button
                                    onClick={() => onOpenLightbox(thumbnailUrl)}
                                    className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 hover:bg-amber-100 transition-colors cursor-pointer"
                                    title="Foto in Lightbox öffnen"
                                >
                                    <Camera size={12} />
                                    Foto
                                </button>
                            ) : (
                                <Link
                                    href={`/tickets?id=${activity.ticket_id}` as any}
                                    className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 hover:bg-amber-100 transition-colors"
                                    title="Foto-Anhang vorhanden"
                                >
                                    <Camera size={12} />
                                    Foto
                                </Link>
                            )
                        )}
                    </div>
                </div>

                {/* Thumbnail preview for attachment activities */}
                {activity.activity_type === 'attachment_uploaded' && thumbnailUrl && (
                    <SafeThumbnail
                        src={thumbnailUrl}
                        onClick={() => onOpenLightbox(thumbnailUrl)}
                    />
                )}

                {/* Ticket link */}
                {activity.ticket_code && (
                    <Link
                        href={`/tickets?id=${activity.ticket_id}`}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-mono font-bold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm group-hover:shadow-md"
                        title={activity.issue_summary || 'Ticket öffnen'}
                    >
                        <Ticket size={14} />
                        #{activity.ticket_code}
                    </Link>
                )}
            </div>
        </div>
    );
}
