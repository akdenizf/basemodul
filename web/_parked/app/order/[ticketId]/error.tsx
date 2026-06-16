"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function OrderPortalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Order Portal Error]", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-xl p-10 max-w-sm text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                    Fehler beim Laden
                </h2>
                <p className="text-slate-500 text-sm mb-6">
                    Der Auftrag konnte nicht geladen werden. Bitte versuchen Sie es erneut.
                </p>
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-emerald-700 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Erneut versuchen
                </button>
            </div>
        </div>
    );
}
