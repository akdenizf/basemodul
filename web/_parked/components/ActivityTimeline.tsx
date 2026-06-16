"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Clock,
  Mail,
  User,
  Eye,
  RefreshCw,
  Edit,
  Ticket,
  Zap,
  ChevronRight,
  X,
  FileJson,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  PhoneForwarded,
  MessageSquare
} from 'lucide-react';
import {
  TicketActivity,
  formatActivityDescription,
  getRelativeTime
} from '@/lib/audit-log';

interface ActivityTimelineProps {
  ticketId: string;
  className?: string;
}

interface ActivityItemProps {
  activity: TicketActivity;
  isLast: boolean;
  onShowDetails: (activity: TicketActivity) => void;
}

// Modal für technische Details
function ActivityDetailsModal({ activity, onClose }: { activity: TicketActivity | null, onClose: () => void }) {
  if (!activity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300">
              <Terminal size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Technische Details</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{activity.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {activity.old_value && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                Vorheriger Zustand
              </p>
              <div className="bg-red-50/30 dark:bg-red-900/10 rounded-xl border border-red-100/50 dark:border-red-900/30 p-4">
                <pre className="text-xs text-red-900/80 dark:text-red-400 font-mono whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(activity.old_value, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {activity.new_value && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                Neuer Zustand
              </p>
              <div className="bg-green-50/30 dark:bg-green-900/10 rounded-xl border border-green-100/50 dark:border-green-900/30 p-4">
                <pre className="text-xs text-green-900/80 dark:text-green-400 font-mono whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(activity.new_value, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                Metadaten
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4">
                <pre className="text-xs text-slate-600 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                  {JSON.stringify(activity.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Protokolliert am {new Date(activity.created_at).toLocaleString('de-DE')} von {activity.admin_email || 'System'}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ activity, isLast, onShowDetails }: ActivityItemProps) {
  const hasDetails = activity.old_value || activity.new_value || (activity.metadata && Object.keys(activity.metadata).length > 0);
  const isSystemActivity = activity.admin_email === 'system@callfolio.io';

  const getActivityIcon = (type: string) => {
    const iconProps = { size: 12, className: "text-white" };

    switch (type) {
      case 'created': return <Ticket {...iconProps} />;
      case 'email_sent': return <Mail {...iconProps} />;
      case 'status_changed': return <RefreshCw {...iconProps} />;
      case 'assigned': return <User {...iconProps} />;
      case 'reviewed': return <Eye {...iconProps} />;
      case 'updated': return <Edit {...iconProps} />;
      case 'manual_action': return <Zap {...iconProps} />;
      case 'contractor_notified': return <CheckCircle2 {...iconProps} />;
      case 'contractor_confirmed': return <Clock {...iconProps} />;
      case 'contractor_resolved': return <CheckCircle2 {...iconProps} />;
      case 'contractor_message': return <MessageSquare {...iconProps} />;
      case 'follow_up_call': return <PhoneForwarded {...iconProps} />;
      case 'system_error': return <AlertTriangle {...iconProps} />;
      default: return <Clock {...iconProps} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'created': return 'bg-blue-500';
      case 'email_sent': return 'bg-green-500';
      case 'status_changed': return 'bg-purple-500';
      case 'assigned': return 'bg-slate-700';
      case 'reviewed': return 'bg-yellow-500';
      case 'updated': return 'bg-gray-500';
      case 'manual_action': return 'bg-red-500';
      case 'contractor_notified': return 'bg-emerald-500';
      case 'contractor_confirmed': return 'bg-blue-500 shadow-blue-200';
      case 'contractor_resolved': return 'bg-emerald-600 shadow-emerald-200';
      case 'contractor_message': return 'bg-slate-700 shadow-slate-200';
      case 'follow_up_call': return 'bg-amber-500';
      case 'system_error': return 'bg-amber-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="flex group">
      {/* Timeline line and icon */}
      <div className="flex flex-col items-center mr-4">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${getActivityColor(activity.activity_type)} ring-1 ring-white dark:ring-slate-900 z-10 transition-transform group-hover:scale-105`}>
          {getActivityIcon(activity.activity_type)}
        </div>
        {!isLast && (
          <div className="w-[1px] h-full bg-slate-100 dark:bg-slate-800 my-0.5"></div>
        )}
      </div>

      {/* Activity content */}
      <div className="flex-1 pb-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-[#E2E8F0] dark:border-slate-800 p-3 transition-colors hover:border-slate-300 dark:hover:border-slate-700 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50 leading-snug truncate tracking-[-0.01em]">
              {formatActivityDescription(activity)}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-[10px] font-medium font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                <Clock size={10} />
                {getRelativeTime(activity.created_at)}
              </span>
              {activity.activity_type === 'follow_up_call' && activity.metadata?.call_id && (
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 ml-2 border-l border-slate-200 dark:border-slate-800 pl-2">
                  Call: {activity.metadata.call_id.substring(0, 8)}
                </span>
              )}
              {!isSystemActivity && (
                <span className="text-[9px] bg-slate-100/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-semibold border border-slate-200/60 dark:border-slate-700/50 uppercase tracking-wider">
                  {activity.admin_email?.split('@')[0] || 'System'}
                </span>
              )}
            </div>
          </div>

          {hasDetails && (
            <button
              onClick={() => onShowDetails(activity)}
              className="p-1.5 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors shrink-0"
              title="Details anzeigen"
            >
              <FileJson size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ActivityTimeline({ ticketId, className = "" }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<TicketActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<TicketActivity | null>(null);

  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      // Debug logging
      console.log('[ActivityTimeline] Session check:', {
        hasSession: !!session,
        hasToken: !!session?.access_token,
        userEmail: session?.user?.email || 'none',
        error: sessionError?.message || null
      });

      const headers: Record<string, string> = {};
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
        console.log('[ActivityTimeline] Authorization header set for:', session.user?.email);
      } else {
        console.warn('[ActivityTimeline] No session/token available - request will use cookies only');
      }

      const response = await fetch(`/api/admin/tickets/${ticketId}/activities`, {
        credentials: 'include',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setActivities(data.activities || []);
    } catch (err) {
      console.error('Failed to load activities:', err);
      setError('Aktivitäten konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    loadActivities();
  }, [ticketId, loadActivities]);

  if (loading) {
    return (
      <div className={`${className} mt-4`}>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-2/3"></div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${className} mt-6`}>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#E2E8F0] dark:border-slate-800 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-5 sticky top-0 bg-white dark:bg-slate-900 z-10 pb-3 border-b border-[#F1F5F9] dark:border-slate-800">
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Verlauf</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                {activities.length} {activities.length === 1 ? 'Eintrag' : 'Einträge'}
              </p>
            </div>
            <button
              onClick={loadActivities}
              className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              title="Aktualisieren"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {activities.length === 0 ? (
            <div className="text-center py-8 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-50 dark:border-slate-800 border-dashed">
              <Clock size={32} className="text-slate-200 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Noch keine Aktivitäten</p>
            </div>
          ) : (
            <div className="space-y-0 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar -mr-2 pl-1 pt-1">
              {activities.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  isLast={index === activities.length - 1}
                  onShowDetails={setSelectedActivity}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedActivity && (
        <ActivityDetailsModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </>
  );
}