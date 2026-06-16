export default function AppLoading() {
    return (
        <div className="flex-1 p-6 md:p-10 bg-[#F8FAFC] h-full overflow-y-auto animate-pulse">
            {/* Header skeleton */}
            <div className="mb-10 flex items-center gap-4">
                <div className="h-14 w-14 bg-slate-200 rounded-xl" />
                <div className="space-y-2">
                    <div className="h-8 w-72 bg-slate-200 rounded-lg" />
                    <div className="h-4 w-56 bg-slate-100 rounded-md" />
                </div>
            </div>

            {/* KPI grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl border border-slate-100 p-5 h-[148px]"
                    >
                        <div className="w-9 h-9 rounded-md bg-slate-100 mb-5" />
                        <div className="h-9 w-20 bg-slate-100 rounded mb-2" />
                        <div className="h-3 w-24 bg-slate-100/60 rounded" />
                    </div>
                ))}
            </div>

            {/* Charts skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-100 h-[300px]" />
                <div className="bg-white rounded-xl border border-slate-100 h-[300px]" />
            </div>
        </div>
    );
}
