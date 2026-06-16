"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryData {
    name: string;
    value: number;
    color: string;
}

interface CategoryDonutChartProps {
    data: CategoryData[];
}

export default function CategoryDonutChart({ data }: CategoryDonutChartProps) {
    // Fallback if no data
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Ticket Kategorien
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            Dieser Monat
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
                        Ticket Kategorien
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        Dieser Monat
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6 flex-1">
                {/* Chart */}
                <div className="w-[140px] h-[140px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={42}
                                outerRadius={65}
                                paddingAngle={3}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs shadow-lg">
                                                <span className="font-semibold text-slate-900 dark:text-white">
                                                    {payload[0].name}
                                                </span>
                                                <span className="ml-2 text-slate-500">{payload[0].value}%</span>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-3 flex-1">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <div
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                    {item.name}
                                </span>
                            </div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                                {item.value}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
