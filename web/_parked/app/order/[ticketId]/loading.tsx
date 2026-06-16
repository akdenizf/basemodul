import { Loader2 } from "lucide-react";

export default function OrderPortalLoading() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                <p className="text-slate-500 text-sm font-medium">Auftrag wird geladen...</p>
            </div>
        </div>
    );
}
