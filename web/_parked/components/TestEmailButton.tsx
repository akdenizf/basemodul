"use client";

import React, { useState, useEffect } from "react";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function TestEmailButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Get session on mount
  useEffect(() => {
    const supabase = createClient();

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[TestEmailButton] Session check:', !!session, session?.user?.email || 'none');
      if (session?.access_token) {
        setAccessToken(session.access_token);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('[TestEmailButton] Auth state changed:', !!session);
      setAccessToken(session?.access_token || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleTestEmail = async () => {
    if (!accessToken) {
      setStatus("error");
      setMessage("Nicht eingeloggt");
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 3000);
      return;
    }

    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(`Test-E-Mail erfolgreich versendet an ${data.sent_to}`);
        
        // Reset nach 5 Sekunden
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 5000);
      } else {
        setStatus("error");
        setMessage(data.error || "Fehler beim Versenden");
        
        // Reset nach 5 Sekunden
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 5000);
      }
    } catch (error) {
      setStatus("error");
      setMessage("Netzwerkfehler beim Versenden");
      
      // Reset nach 5 Sekunden
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if not logged in
  if (!accessToken) {
    return null;
  }

  return (
    <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700">
      <button
        onClick={handleTestEmail}
        disabled={loading}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
          text-sm font-medium transition-all duration-200
          ${
            status === "success"
              ? "bg-green-500 text-white"
              : status === "error"
              ? "bg-red-500 text-white"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-sm hover:shadow-md
        `}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sende...</span>
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Versendet!</span>
          </>
        ) : status === "error" ? (
          <>
            <AlertCircle className="w-4 h-4" />
            <span>Fehler</span>
          </>
        ) : (
          <>
            <Mail className="w-4 h-4" />
            <span>System-Check: E-Mail</span>
          </>
        )}
      </button>
      
      {message && (
        <div
          className={`
            mt-2 px-3 py-2 rounded-md text-xs
            ${
              status === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
            }
          `}
        >
          {message}
        </div>
      )}
      
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-center">
        Testet E-Mail-Versand über callfolio.io
      </p>
    </div>
  );
}
