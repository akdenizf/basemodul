"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ActivityData {
    day: string;
    eingegangen: number;
    geloest: number;
}

interface ActivityBarChartProps {
    data: ActivityData[];
}

export default function ActivityBarChart({ data }: ActivityBarChartProps) {
    // Fallback if no data
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Aktivität
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            Letzte 7 Tage
                        </p>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
                    Keine Daten vorhanden
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Aktivität
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        Letzte 7 Tage
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm bg-slate-700" />
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Eingegangen</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Gelöst</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barGap={2} barSize={14}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="currentColor"
                            className="text-slate-100 dark:text-slate-800"
                        />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "#94A3B8" }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "#94A3B8" }}
                            width={28}
                        />
                        <Tooltip
                            cursor={{ fill: "transparent" }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs shadow-lg">
                                            <p className="font-semibold text-slate-900 dark:text-white mb-1">{label}</p>
                                            {payload.map((entry, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div
                                                        className="w-2 h-2 rounded-sm"
                                                        style={{ backgroundColor: entry.color }}
                                                    />
                                                    <span className="text-slate-500">
                                                        {entry.name === "eingegangen" ? "Eingegangen" : "Gelöst"}:
                                                    </span>
                                                    <span className="font-bold text-slate-900 dark:text-white">{entry.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="eingegangen"
                            fill="#334155"
                            radius={[4, 4, 0, 0]}
                            name="eingegangen"
                        />
                        <Bar
                            dataKey="geloest"
                            fill="#10B981"
                            radius={[4, 4, 0, 0]}
                            name="geloest"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
