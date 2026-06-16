"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AppError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[App Error Boundary]", error);
    }, [error]);

    return (
        <div className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFC] h-full">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-10 max-w-md text-center">
                <div className="w-16 h-16 bg-red-50 border border-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 mb-2">
                    Etwas ist schiefgelaufen
                </h2>
                <p className="text-slate-500 text-sm mb-6">
                    Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.
                </p>
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold py-2.5 px-6 rounded-md hover:bg-slate-800 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Erneut versuchen
                </button>
                {error.digest && (
                    <p className="mt-4 text-xs text-slate-400 font-mono">
                        Fehler-ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
