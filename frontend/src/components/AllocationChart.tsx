import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import type { DailyCost } from '../types';

interface AllocationChartProps {
    data: DailyCost[];
    height?: number;
}

export const AllocationChart: React.FC<AllocationChartProps> = ({ data, height = 300 }) => {
    // 1. Transform Data: Group by Date
    const { chartData, keys } = React.useMemo(() => {
        const grouped: Record<string, any> = {};
        const allKeys = new Set<string>();

        data.forEach(d => {
            if (!grouped[d.date]) {
                grouped[d.date] = { date: d.date };
            }
            // Use 'namespace' field as the key (it holds the aggregation value: ns/pod/node)
            grouped[d.date][d.namespace] = d.totalCost;
            allKeys.add(d.namespace);
        });

        return {
            chartData: Object.values(grouped).sort((a: any, b: any) => a.date.localeCompare(b.date)),
            keys: Array.from(allKeys)
        };
    }, [data]);

    // Color Palette
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6', '#f43f5e'];

    return (
        <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="var(--text-secondary)"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(val) => {
                            if (val.includes('Total')) return 'Total';
                            return val.length > 5 ? val.slice(5) : val;
                        }}
                    />
                    <YAxis stroke="var(--text-secondary)" tickFormatter={(val) => `$${val}`} />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        formatter={(val: any, name: any) => [`$${Number(val).toFixed(4)}`, name]}
                        labelStyle={{ color: 'var(--text-secondary)' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />

                    {/* 2. Dynamically Generate Bars for each Key (Namespace/Pod) */}
                    {keys.map((key, idx) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            name={key}
                            stackId="a"
                            fill={colors[idx % colors.length]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
